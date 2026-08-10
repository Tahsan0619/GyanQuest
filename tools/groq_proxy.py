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
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = pathlib.Path(__file__).resolve().parents[1]


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
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
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM = (
    "You are a friendly GyanQuest tutor for school kids (roughly ages 9-14). "
    "Explain ideas from the root in simple, clear English. Use short paragraphs. "
    "Avoid jargon unless you define it. When a specific word/term is given, explain "
    "that word in the subject context first. "
    "Finish every reply with exactly one question, on its own line, with nothing after it."
)

# First tap on a book word: full explanation, then the fixed opt-in question.
FIRST_TURN_RULE = (
    " This is the learner's first tap on this word, so give the whole picture: 5 to 7 sentences "
    "covering what the word means, one everyday Bangladesh-friendly example, and why it matters "
    "in this topic. Do not stop at a one-line hint. "
    'End with exactly this line: "Do you want to learn more?"'
)

# Every later turn: the closing question is generated from the conversation, never canned.
FOLLOW_UP_RULE = (
    " The learner already got the first explanation and has just replied. Build on what they "
    "actually said about this word - go one step deeper, or clear up whatever they sound unsure "
    "about - in 5 to 7 sentences. Then end with ONE question you compose yourself that names the "
    "specific idea you just taught and pushes their thinking forward. "
    'Never ask "Do you want to learn more?" again, and never reword it as "want to know more", '
    '"shall I explain more", "learn more?" or anything similar. Ask about the idea itself.'
)


def follow_up_question(term: str, subject: str) -> str:
    t = (term or "this idea").strip() or "this idea"
    sub = (subject or "your topic").strip()
    return f'Where in {sub} do you think "{t}" would change what happens?'


def local_explain(term: str, subject: str, phase: str = "explain") -> str:
    t = (term or "this idea").strip() or "this idea"
    sub = (subject or "this school topic").strip()
    if phase == "followup":
        return (
            f'Good - let\'s push "{t}" a bit further in {sub}.\n\n'
            f'The next layer is where "{t}" shows up when things change: watch what happens '
            f"before, during, and after, and notice which part the word is naming. That is the "
            f"part you can point to in the mission book pictures.\n\n"
            f"(Online tutor briefly unavailable - local helper used.)\n\n"
            f"{follow_up_question(t, sub)}"
        )
    return (
        f'Let\'s start from the root with "{t}" in {sub}.\n\n'
        f'A simple way to think about it: "{t}" is a building-block idea you use to understand '
        f"the bigger lesson. Look for where it shows up in the mission book pictures and examples.\n\n"
        f"Try this: say the word aloud, point to a picture that matches it, then use it in one "
        f"short sentence of your own.\n\n"
        f"(Online tutor briefly unavailable - local helper used.)\n\n"
        f"Do you want to learn more?"
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
        # Optional tier 1|2|3 for Hint Ladder — same endpoint, varied depth (Feature 2).
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

        # Phase drives the closing question: fixed opt-in first, AI-generated after that.
        phase = (body.get("phase") or "").strip().lower()
        if phase not in ("explain", "followup"):
            answered_before = any(
                isinstance(m, dict) and m.get("role") == "assistant" for m in messages
            )
            phase = "explain" if term and not answered_before else "followup"

        system = SYSTEM + (FIRST_TURN_RULE if phase == "explain" else FOLLOW_UP_RULE)
        if tier >= 3:
            system += " Point to a book diagram if one would help."
        max_tokens = 700

        payload = {
            "model": body.get("model") or GROQ_MODEL,
            "messages": [{"role": "system", "content": system}, *messages],
            "temperature": 0.5,
            "max_tokens": max_tokens,
        }

        req = urllib.request.Request(
            GROQ_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {GROQ_KEY}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (compatible; GyanQuestTutor/1.0)",
                "Accept": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            # Cloudflare / network blocks: still teach with a local fallback
            if e.code in (403, 429, 503) or "1010" in err_body:
                hint = term or user
                if not hint and messages:
                    hint = str(messages[-1].get("content") or "")
                fallback = local_explain(hint, subject, phase)
                self._json(
                    200,
                    {
                        "reply": fallback,
                        "model": "local-fallback",
                        "warning": "Groq blocked or unavailable; used local tutor fallback.",
                        "detail": err_body[:200],
                    },
                )
                return
            self._json(e.code, {"error": "Groq API error", "detail": err_body[:800]})
            return
        except Exception as e:
            fallback = local_explain(term or user, subject, phase)
            self._json(
                200,
                {
                    "reply": fallback,
                    "model": "local-fallback",
                    "warning": str(e),
                },
            )
            return

        try:
            text = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError):
            self._json(502, {"error": "Unexpected Groq response", "raw": data})
            return

        self._json(200, {"reply": text, "model": payload["model"]})

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


def main():
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")
    mimetypes.add_type("image/svg+xml", ".svg")
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"GyanQuest + Groq proxy at http://127.0.0.1:{PORT}/")
    print(f"Key loaded: {'yes' if GROQ_KEY else 'NO - set GROQ_API_KEY in .env'}")
    print("POST /api/chat  or  /api/explain")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
