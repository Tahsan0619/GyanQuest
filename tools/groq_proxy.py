#!/usr/bin/env python3
"""
GyanQuest static server + Groq chat proxy.
Keeps GROQ_API_KEY off the browser. Serves repo root like http.server.

Usage (from repo root):
  py -3 tools/groq_proxy.py
"""
from __future__ import annotations

import json
import mimetypes
import os
import pathlib
import sys
import threading
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


def resolve_root() -> pathlib.Path:
    env = os.environ.get("GYANQUEST_ROOT", "").strip()
    if env:
        return pathlib.Path(env).expanduser().resolve()
    if getattr(sys, "frozen", False):
        exe_dir = pathlib.Path(sys.executable).resolve().parent
        for cand in (exe_dir / "web", exe_dir):
            if (cand / "index.html").is_file():
                return cand
        return exe_dir
    return pathlib.Path(__file__).resolve().parents[1]


ROOT = resolve_root()


def load_env() -> None:
    candidates = [ROOT / ".env"]
    if getattr(sys, "frozen", False):
        candidates.append(pathlib.Path(sys.executable).resolve().parent / ".env")
    seen: set[pathlib.Path] = set()
    for env_path in candidates:
        try:
            env_path = env_path.resolve()
        except OSError:
            continue
        if env_path in seen or not env_path.is_file():
            continue
        seen.add(env_path)
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = val


load_env()

PORT = int(os.environ.get("PORT", "5500"))
GROQ_KEY = os.environ.get("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.environ.get("GROQ_MODEL", "").strip()
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODELS_URL = "https://api.groq.com/openai/v1/models"

# llama-3.3-70b-versatile / llama-3.1-8b-instant shut down 16 Aug 2026.
_RETIRED = {
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "llama-3.2-90b-vision-preview",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
}

# Prefer faster/higher-limit chat models first, then the rest of Groq's free text models.
_PREFERRED_CHAT = (
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b",
    "groq/compound-mini",
    "groq/compound",
    "openai/gpt-oss-safeguard-20b",
    "allam-2-7b",
)

_SKIP_CHAT = (
    "whisper",
    "orpheus",
    "prompt-guard",
    "tts",
    "playai-tts",
    "distil-whisper",
)

_DEAD: set[str] = set()
_CHAT_CHAIN: list[str] = []

SYSTEM = (
    "You are a friendly GyanQuest tutor for school kids (roughly ages 9-14). "
    "Use plain, clear English. You may use **bold** for key words, `-` bullet lines for lists, "
    "and short paragraphs. Never output raw HTML tags or broken encoding. "
    "Be warm and Socratic: guide thinking with questions; do not lecture unless evaluating a word."
)

FORMATTING_RULE = (
    " Formatting: use **bold** labels, `-` bullets when listing, numbered lists like `1.` when steps help. "
    "No markdown headings (#). Use a plain hyphen (-) never an em dash. Keep Unicode clean."
)

SOCRATIC_CHAT_RULE = (
    " The learner is chatting freely. Use the Socratic method: ask what they think first when a "
    "definition or idea is unclear, build on their words, and end with ONE thoughtful question "
    "that makes them reason, not yes/no."
)

EVALUATE_RULE = (
    " The learner tapped a red glossary word in the digital book and just shared what they think "
    "it means. Reply in this structure (use these **bold** section labels exactly):\n\n"
    "**What it means:** Clear correct meaning in this subject, 2-4 sentences.\n\n"
    "**What you said:** Restate their idea fairly in your own words.\n\n"
    "**How close:** Say if they are right, partly right, or off track. If partly right, name what "
    "made sense. If wrong, be kind and credit any sensible part.\n\n"
    "**Compare:** One short paragraph linking the real meaning to their idea: what to keep, "
    "what to adjust.\n\n"
    "End with exactly ONE Socratic question on its own line about this word in the topic. "
    'Never ask "Do you want to learn more?" or similar.'
)

FIRST_TURN_RULE = (
    " This is a deeper re-read of a glossary word (not the first Socratic pass). "
    "Give 5 to 7 sentences: meaning, a Bangladesh-friendly everyday example, why it matters. "
    "End with one Socratic question about the idea itself."
)

FOLLOW_UP_RULE = (
    " The learner already discussed this word and just replied. Use Socratic tutoring: respond to "
    "what they actually said, go one step deeper, clear a misconception if needed. "
    "End with ONE question you compose that names the specific idea and pushes their thinking. "
    'Never ask "Do you want to learn more?" or rewordings of it.'
)


def _groq_headers() -> dict:
    return {
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; GyanQuestTutor/1.0)",
        "Accept": "application/json",
    }


def _is_chat_model(item: dict) -> bool:
    mid = str(item.get("id") or "")
    if not mid or mid in _RETIRED:
        return False
    low = mid.lower()
    if any(s in low for s in _SKIP_CHAT):
        return False
    ins = [str(x).lower() for x in (item.get("input_modalities") or ["text"])]
    outs = [str(x).lower() for x in (item.get("output_modalities") or ["text"])]
    if "text" not in ins:
        return False
    if "text" not in outs:
        return False
    return True


def _fetch_live_chat_ids() -> list[str]:
    if not GROQ_KEY:
        return []
    req = urllib.request.Request(GROQ_MODELS_URL, headers=_groq_headers(), method="GET")
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    items = data.get("data") or []
    return [m["id"] for m in items if isinstance(m, dict) and _is_chat_model(m)]


def _parse_env_models() -> list[str]:
    raw = os.environ.get("GROQ_MODELS", "").strip()
    found: list[str] = []
    if raw:
        for part in raw.split(","):
            mid = part.strip()
            if mid and mid not in _RETIRED and mid not in found:
                found.append(mid)
    if GROQ_MODEL and GROQ_MODEL not in _RETIRED and GROQ_MODEL not in found:
        found.insert(0, GROQ_MODEL)
    return found


def build_chat_chain() -> list[str]:
    live: list[str] = []
    try:
        live = _fetch_live_chat_ids()
    except Exception:
        live = []
    preferred = [m for m in _PREFERRED_CHAT if not live or m in live]
    env_first = _parse_env_models()
    chain: list[str] = []
    for mid in (*env_first, *preferred, *live):
        if mid in _RETIRED or mid in chain:
            continue
        if live and mid not in live:
            continue
        chain.append(mid)
    if not chain:
        chain = list(_PREFERRED_CHAT)
    return chain


def _message_text(data: dict) -> str:
    try:
        msg = data["choices"][0]["message"]
    except (KeyError, IndexError, TypeError):
        return ""
    content = msg.get("content")
    if isinstance(content, str) and content.strip():
        return content.strip()
    if isinstance(content, list):
        parts = []
        for p in content:
            if isinstance(p, str):
                parts.append(p)
            elif isinstance(p, dict) and p.get("text"):
                parts.append(str(p["text"]))
        joined = "\n".join(parts).strip()
        if joined:
            return joined
    return ""


def _retryable(code: int, body: str) -> bool:
    if code in (400, 404, 408, 409, 429, 500, 502, 503, 529):
        return True
    low = (body or "").lower()
    return any(
        s in low
        for s in (
            "decommission",
            "does not exist",
            "not found",
            "rate limit",
            "over capacity",
            "unavailable",
        )
    )


def _model_dead(code: int, body: str) -> bool:
    low = (body or "").lower()
    if code in (404,):
        return True
    return any(s in low for s in ("decommission", "does not exist", "model_not_found"))


def groq_complete(messages: list, system: str, max_tokens: int) -> tuple[str, str]:
    """Try every free chat model, then raise the last error."""
    global _CHAT_CHAIN
    if not _CHAT_CHAIN:
        _CHAT_CHAIN = build_chat_chain()
    last_err = "Groq API error"
    for model in [m for m in _CHAT_CHAIN if m not in _DEAD]:
        payload = {
            "model": model,
            "messages": [{"role": "system", "content": system}, *messages],
            "temperature": 0.5,
            "max_tokens": max_tokens,
        }
        if "gpt-oss" in model or "qwen" in model:
            payload["reasoning_effort"] = "low"
        req = urllib.request.Request(
            GROQ_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers=_groq_headers(),
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            if e.code in (401,) or (e.code == 403 and "1010" not in err_body):
                raise PermissionError(err_body[:800]) from e
            if e.code == 403 and "1010" in err_body:
                raise RuntimeError(err_body) from e
            if _model_dead(e.code, err_body):
                _DEAD.add(model)
            if _retryable(e.code, err_body):
                last_err = err_body[:400] or last_err
                continue
            last_err = err_body[:400] or last_err
            continue
        except Exception as e:
            last_err = str(e)
            continue
        text = normalize_dashes(_message_text(data))
        if text:
            return text, model
        last_err = f"{model} returned empty content"
    raise RuntimeError(last_err)


def normalize_dashes(text: str) -> str:
    if not text:
        return text
    return (
        text.replace("\u2014", " - ")
        .replace("\u2013", " - ")
        .replace("\u2212", "-")
    )


def follow_up_question(term: str, subject: str) -> str:
    t = (term or "this idea").strip() or "this idea"
    sub = (subject or "your topic").strip()
    return f'Where in {sub} do you think "{t}" would change what happens?'


def local_explain(term: str, subject: str, phase: str = "explain", user_attempt: str = "") -> str:
    t = (term or "this idea").strip() or "this idea"
    sub = (subject or "this school topic").strip()
    attempt = (user_attempt or "").strip()
    if phase == "evaluate" and attempt:
        return (
            f"**What it means:** In {sub}, **{t}** is a key idea from the lesson: "
            f"the building block the book pictures and examples point to.\n\n"
            f"**What you said:** You said: \"{attempt}\"\n\n"
            f"**How close:** That is a fair try. Some parts may match the book; compare your words "
            f"to the red glossary line and the diagram on this page.\n\n"
            f"**Compare:** Keep the parts that fit what you see in the book. Adjust anything that "
            f"does not match the mission examples.\n\n"
            f"(Online tutor briefly unavailable - local helper used.)\n\n"
            f'Where in {sub} would **{t}** change what happens if it were missing?'
        )
    if phase == "followup":
        return (
            f'Good - let\'s push **"{t}"** further in {sub}.\n\n'
            f"- Watch what happens before, during, and after in the mission.\n"
            f"- Name which part the word is labeling.\n\n"
            f"(Online tutor briefly unavailable - local helper used.)\n\n"
            f'{follow_up_question(t, sub)}'
        )
    return (
        f"**What it means:** In {sub}, **{t}** is a core word for this topic.\n\n"
        f"- Say it aloud.\n"
        f"- Point to a book picture that matches.\n"
        f"- Use it in one sentence of your own.\n\n"
        f"(Online tutor briefly unavailable - local helper used.)\n\n"
        f'What do you think **{t}** means in your own words?'
    )


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        # Avoid stale boot/hub modules blanking the mission grid after deploys.
        path = (self.path or "").split("?", 1)[0].lower()
        if path.endswith((".js", ".css", ".html")):
            self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if self.path in ("/api/chat", "/api/explain"):
            self._api_chat()
            return
        self.send_error(404, "Not found")

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def _api_chat(self):
        if not GROQ_KEY:
            self._json(503, {"error": "GROQ_API_KEY missing. Add it to .env and restart."})
            return

        body = self._read_json()
        messages = body.get("messages")
        term = (body.get("term") or "").strip()
        subject = (body.get("subject") or body.get("context") or "").strip()
        user = (body.get("message") or body.get("prompt") or "").strip()
        user_attempt = (body.get("userAttempt") or body.get("user_attempt") or "").strip()
        # Optional tier 1|2|3 for Hint Ladder - same endpoint, varied depth (Feature 2).
        try:
            tier = int(body.get("tier") or 1)
        except (TypeError, ValueError):
            tier = 1
        tier = max(1, min(3, tier))

        if not isinstance(messages, list) or not messages:
            if term:
                user = (
                    f"Please explain the word or idea \"{term}\" "
                    f"in the context of: {subject or 'this school topic'}."
                )
            if not user:
                self._json(400, {"error": "Send message, term, or messages."})
                return
            messages = [{"role": "user", "content": user}]

        # Cap history
        messages = messages[-12:]

        # Phase drives tutor behaviour: evaluate (word tap reply), explain, followup, chat.
        phase = (body.get("phase") or "").strip().lower()
        if phase not in ("explain", "followup", "evaluate", "chat"):
            answered_before = any(
                isinstance(m, dict) and m.get("role") == "assistant" for m in messages
            )
            if term and user_attempt:
                phase = "evaluate"
            elif term and not answered_before:
                phase = "explain"
            elif term or answered_before:
                phase = "followup"
            else:
                phase = "chat"

        if phase == "evaluate":
            system = SYSTEM + FORMATTING_RULE + EVALUATE_RULE
        elif phase == "explain":
            system = SYSTEM + FORMATTING_RULE + FIRST_TURN_RULE
        elif phase == "followup":
            system = SYSTEM + FORMATTING_RULE + FOLLOW_UP_RULE
        else:
            system = SYSTEM + FORMATTING_RULE + SOCRATIC_CHAT_RULE
        if tier >= 3:
            system += " Point to a book diagram if one would help."
        max_tokens = 700

        try:
            text, used_model = groq_complete(messages, system, max_tokens)
        except PermissionError as e:
            self._json(401, {"error": "Groq API error", "detail": str(e)[:800]})
            return
        except Exception as e:
            fallback = normalize_dashes(local_explain(term or user, subject, phase, user_attempt))
            self._json(
                200,
                {
                    "reply": fallback,
                    "model": "local-fallback",
                    "warning": str(e)[:400],
                },
            )
            return

        self._json(200, {"reply": normalize_dashes(text), "model": used_model})

    def _json(self, code: int, obj: dict):
        raw = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def log_message(self, fmt, *args):
        # Quieter than default for static assets
        if self.path.startswith("/api/"):
            super().log_message(fmt, *args)


def _register_mimetypes() -> None:
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")
    mimetypes.add_type("image/svg+xml", ".svg")
    mimetypes.add_type("model/gltf-binary", ".glb")
    mimetypes.add_type("model/gltf+json", ".gltf")


def create_server(preferred_port: int | None = None) -> tuple[ThreadingHTTPServer, int]:
    """Bind 127.0.0.1; skip occupied ports so the desktop app can still start."""
    global PORT
    _register_mimetypes()
    start = preferred_port if preferred_port is not None else PORT
    last_err: OSError | None = None
    for port in range(start, start + 30):
        try:
            httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
            PORT = port
            return httpd, port
        except OSError as e:
            last_err = e
    raise OSError(f"No free port in {start}-{start + 29}") from last_err


def warm_chat_chain() -> None:
    global _CHAT_CHAIN
    try:
        _CHAT_CHAIN = build_chat_chain()
    except Exception:
        _CHAT_CHAIN = list(_PREFERRED_CHAT)


def main():
    httpd, port = create_server()
    threading.Thread(target=warm_chat_chain, daemon=True).start()
    print(f"GyanQuest + Groq proxy at http://127.0.0.1:{port}/")
    print(f"Key loaded: {'yes' if GROQ_KEY else 'NO - set GROQ_API_KEY in .env'}")
    print("POST /api/chat  or  /api/explain")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
