#!/usr/bin/env python3
"""
Generate digital mission books + SVG figures for all playable missions,
and wire boot-l1.js to open them.
"""
from __future__ import annotations

import json
import pathlib
import re
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
GAMES = ROOT / "games"

# Richer curriculum hints for gold games
GOLD_EXTRA = {
    ("chemistry-lab", 0): {
        "focus": "particles, states of matter, heat, and the grain-to-atom story",
        "terms": ["particle", "molecule", "lattice", "evaporation", "condensation", "matter", "energy", "solid"],
    },
    ("chemistry-lab", 1): {
        "focus": "elements, symbols, and sorting metals vs non-metals",
        "terms": ["element", "symbol", "periodic", "metal", "non-metal", "atom", "property"],
    },
    ("chemistry-lab", 2): {
        "focus": "why atoms stick - ionic and covalent bond ideas",
        "terms": ["bond", "attract", "ionic", "covalent", "electron", "compound", "molecule"],
    },
    ("eco-guardian", 0): {
        "focus": "reduce, reuse, recycle, compost, and landfill choices",
        "terms": ["recycle", "compost", "landfill", "reduce", "reuse", "organic", "plastic", "waste"],
    },
    ("ict-fundamentals", 0): {
        "focus": "CPU, RAM, and storage as a teamwork story",
        "terms": ["CPU", "RAM", "storage", "SSD", "bit", "instruction", "memory", "hardware"],
    },
    ("ict-fundamentals", 1): {
        "focus": "input devices vs output devices",
        "terms": ["input", "output", "keyboard", "sensor", "display", "device", "signal"],
    },
    ("ict-fundamentals", 2): {
        "focus": "files, folders, and finding saved work",
        "terms": ["file", "folder", "path", "extension", "save", "directory", "document"],
    },
    ("math-quest", 0): {
        "focus": "place value with tens and ones",
        "terms": ["place value", "tens", "ones", "digit", "regroup", "number", "base ten"],
    },
    ("math-quest", 1): {
        "focus": "fractions as fair shares of a whole",
        "terms": ["fraction", "numerator", "denominator", "whole", "equal parts", "half", "quarter"],
    },
}


def extract_playable(meta_text: str) -> list[dict]:
    """Parse MISSIONS array objects with playable true (simple brace walk)."""
    missions = []
    # Find each { ... } that looks like a mission near playable
    for m in re.finditer(r"\{[^{}]*?\"id\"\s*:\s*\"([^\"]+)\"[^{}]*?\}", meta_text, re.S):
        block = m.group(0)
        if "playable" not in block:
            # try wider - nested braces unlikely in our meta
            pass
    # Better: split by playable true blocks with preceding fields
    chunks = re.split(r"\n\s*\{", meta_text)
    idx = 0
    for ch in chunks:
        if '"playable": true' not in ch and "playable: true" not in ch:
            continue
        def field(name):
            m = re.search(rf'"{name}"\s*:\s*"([^"]*)"', ch)
            return m.group(1) if m else ""
        missions.append(
            {
                "index": idx,
                "id": field("id") or f"mission-{idx+1}",
                "kidTitle": field("kidTitle") or f"Mission {idx+1}",
                "theme": field("theme") or "explore",
                "hook": field("hook") or "",
                "rewardName": field("rewardName") or "",
            }
        )
        idx += 1
    return missions


def extract_level_meta(level_path: pathlib.Path) -> dict:
    if not level_path.exists():
        return {}
    t = level_path.read_text(encoding="utf-8", errors="replace")
    m = re.search(r"export const L\d+_META\s*=\s*\{([\s\S]*?)\n\};", t)
    if not m:
        return {}
    body = m.group(1)

    def s(name):
        mm = re.search(rf'{name}:\s*"([^"]*)"', body)
        return mm.group(1) if mm else ""

    everyday = re.findall(r'everyday:\s*\[([^\]]*)\]', body)
    everyday_list = []
    if everyday:
        everyday_list = re.findall(r'"([^"]+)"', everyday[0])
    subs = re.findall(r'subTitles:\s*\[([^\]]*)\]', body)
    sub_list = []
    if subs:
        sub_list = re.findall(r'"([^"]+)"', subs[0])
    return {
        "kidTitle": s("kidTitle"),
        "theme": s("theme"),
        "intro": s("intro"),
        "rewardName": s("rewardName"),
        "everyday": everyday_list,
        "subTitles": sub_list,
    }


def svg_fig(path: pathlib.Path, title: str, kind: int, accent: str):
    """Write a simple themed SVG illustration."""
    path.parent.mkdir(parents=True, exist_ok=True)
    shapes = [
        f'<rect x="40" y="70" width="240" height="120" rx="12" fill="{accent}" opacity="0.85"/>'
        f'<circle cx="100" cy="130" r="28" fill="#fff" opacity="0.9"/>'
        f'<circle cx="170" cy="130" r="28" fill="#fff" opacity="0.7"/>'
        f'<circle cx="240" cy="130" r="28" fill="#fff" opacity="0.5"/>',
        f'<path d="M40 180 L160 40 L280 180 Z" fill="{accent}" opacity="0.9"/>'
        f'<rect x="70" y="120" width="180" height="16" fill="#0f172a" opacity="0.35"/>'
        f'<rect x="90" y="145" width="140" height="12" fill="#0f172a" opacity="0.25"/>',
        f'<rect x="50" y="50" width="70" height="160" rx="8" fill="{accent}"/>'
        f'<rect x="135" y="90" width="70" height="120" rx="8" fill="{accent}" opacity="0.75"/>'
        f'<rect x="220" y="120" width="70" height="90" rx="8" fill="{accent}" opacity="0.55"/>'
        f'<text x="160" y="40" text-anchor="middle" fill="#334155" font-family="Sora,sans-serif" font-size="14">Chart</text>',
    ]
    body = shapes[kind % 3]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" role="img">
  <rect width="320" height="220" fill="#f8fafc"/>
  <rect x="8" y="8" width="304" height="204" rx="10" fill="none" stroke="#cbd5e1" stroke-width="2"/>
  {body}
  <text x="160" y="205" text-anchor="middle" fill="#475569" font-family="Georgia,serif" font-size="12">{title[:48]}</text>
</svg>
'''
    path.write_text(svg, encoding="utf-8")


def js_escape(s: str) -> str:
    return (
        str(s)
        .replace("\\", "\\\\")
        .replace("`", "\\`")
        .replace("${", "\\${")
        .replace('"', '\\"')
    )


def build_book_js(game: str, mission_index: int, meta: dict, mission: dict, accent: str) -> str:
    title = meta.get("kidTitle") or mission.get("kidTitle") or f"Mission {mission_index+1}"
    theme = meta.get("theme") or mission.get("theme") or "explore"
    intro = meta.get("intro") or mission.get("hook") or f"Learn the ideas behind {title}."
    everyday = meta.get("everyday") or []
    subs = meta.get("subTitles") or []
    gold = GOLD_EXTRA.get((game, mission_index), {})
    focus = gold.get("focus") or theme
    terms = gold.get("terms") or []
    # derive terms from theme words if empty
    if not terms:
        words = re.findall(r"[A-Za-z][A-Za-z-]{3,}", f"{theme} {intro} {' '.join(subs)}")
        # pick distinctive
        skip = {"this", "that", "with", "from", "your", "into", "then", "when", "mission", "learn", "about", "more"}
        seen = []
        for w in words:
            lw = w.lower()
            if lw in skip or lw in seen:
                continue
            seen.append(lw)
            terms.append(w)
            if len(terms) >= 8:
                break
    glossary = [{"id": t.lower().replace(" ", "-"), "term": t} for t in terms[:10]]

    base = f"/games/{game}/assets/book"
    figs = [
        {"src": f"{base}/m{mission_index+1}-fig1.svg", "caption": f"Figure: {title} overview", "place": "top", "alt": title},
        {"src": f"{base}/m{mission_index+1}-fig2.svg", "caption": "Figure: key idea map", "place": "full", "alt": "Idea map"},
        {"src": f"{base}/m{mission_index+1}-fig3.svg", "caption": "Figure: everyday example", "place": "right", "alt": "Everyday"},
    ]

    ex0 = everyday[0] if everyday else "something you see every day"
    ex1 = everyday[1] if len(everyday) > 1 else ex0
    steps = subs[:6] if subs else [f"Step {i+1}" for i in range(6)]

    pages = [
        {
            "title": f"Welcome to {title}",
            "layout": "text",
            "figures": [figs[0]],
            "blocks": [
                {"type": "p", "text": intro},
                {"type": "p", "text": f"This mission explores {focus}. In the game you practiced short steps; this book slows down and connects the big ideas."},
                {"type": "p", "text": f"Everyday hook: think about {ex0}."},
            ],
        },
        {
            "title": "The big idea",
            "layout": "text",
            "blocks": [
                {"type": "p", "text": f"Theme: {theme}."},
                {"type": "p", "text": f"If you remember only one sentence, remember this: {intro}"},
                {"type": "ul", "items": [f"Notice it in {ex0}.", f"Compare it with {ex1}.", "Say the rule in your own words."]},
            ],
        },
        {
            "title": "Picture the concept",
            "layout": "full-fig",
            "figures": [figs[1]],
            "blocks": [
                {"type": "p", "text": "Look at the figure carefully. Point to each part and name it aloud. Good scientists and makers always match words to pictures."},
            ],
        },
        {
            "title": "How the mission steps fit",
            "layout": "text",
            "blocks": [
                {"type": "p", "text": "Each sub-level was one spiral step: meet, try, sort, lab, explain, rule, stretch, myth, fluency, mastery."},
                {"type": "ul", "items": steps[:5]},
                {"type": "p", "text": "Together they build the same story this book tells in longer form."},
            ],
        },
        {
            "title": "Everyday lab",
            "layout": "split",
            "figures": [figs[2]],
            "blocks": [
                {"type": "p", "text": f"Try this at home or school: use {ex0} as your example."},
                {"type": "p", "text": "Ask: What is changing? What stays the same? What rule explains it?"},
                {"type": "p", "text": "Write one sentence you could teach a friend."},
            ],
        },
        {
            "title": "Watch for myths",
            "layout": "text",
            "blocks": [
                {"type": "p", "text": "Learners often mix up nearby ideas. Pause and check:"},
                {"type": "ul", "items": [
                    "Did I use the right word for the right job?",
                    "Can I show an example and a counter-example?",
                    "Would my explanation still work tomorrow?",
                ]},
                {"type": "p", "text": "Red words in this book are glossary terms - tap one to ask the tutor."},
            ],
        },
        {
            "title": "Mastery checkpoint",
            "layout": "text",
            "blocks": [
                {"type": "p", "text": f"You earned the path to the {meta.get('rewardName') or mission.get('rewardName') or 'mission'} reward in the game. In the book, mastery means you can teach it."},
                {"type": "ul", "items": [
                    f"Explain {title} to someone younger in under one minute.",
                    "Sketch the figure from memory.",
                    "Name two everyday places the idea appears.",
                ]},
                {"type": "p", "text": "When a word feels hard, tap it. Stay curious."},
            ],
        },
    ]

    # Build JS file
    def dumps_page(p):
        return json.dumps(p, ensure_ascii=True, indent=2)

    glossary_js = json.dumps(glossary, ensure_ascii=True, indent=2)
    pages_js = ",\n".join(dumps_page(p) for p in pages)

    return f'''/**
 * Digital book - {game} mission {mission_index + 1}: {title}
 * Auto-generated curriculum deepen book (5-7 pages).
 */
export const BOOK = {{
  missionIndex: {mission_index},
  title: {json.dumps(title)},
  subtitle: {json.dumps(theme)},
  subject: {json.dumps(game.replace("-", " ").title() + " / " + title)},
  cover: {{
    title: {json.dumps(title)},
    art: {json.dumps(figs[0]["src"])},
  }},
  glossary: {glossary_js},
  pages: [
{pages_js}
  ],
}};

export default BOOK;
'''


BOOT_IMPORT_MARKER = "import { setupMissionBooks }"
BOOT_IMPORT = (
    'import { setupMissionBooks } from "/engine/js/mission-books.js?v=book1";\n'
)


def wire_boot(game_dir: pathlib.Path, playable_count: int) -> bool:
    boot = game_dir / "js" / "boot-l1.js"
    if not boot.exists() or playable_count < 1:
        return False
    t = boot.read_text(encoding="utf-8")
    changed = False

    # imports for books
    book_imports = []
    for i in range(1, playable_count + 1):
        book_imports.append(f'import {{ BOOK as BOOK_L{i} }} from "../books/level{i}.js?v=book1";')
    block = "\n".join(book_imports) + "\n" + BOOT_IMPORT

    if "BOOK_L1" not in t:
        # insert after last import from ./level or missions-meta
        m = list(re.finditer(r'^import .+;$', t, re.M))
        if m:
            last = m[-1]
            t = t[: last.end()] + "\n" + block + t[last.end() :]
            changed = True
    elif "setupMissionBooks" not in t:
        if BOOT_IMPORT_MARKER not in t:
            m = list(re.finditer(r'^import .+;$', t, re.M))
            if m:
                last = m[-1]
                t = t[: last.end()] + "\n" + BOOT_IMPORT + t[last.end() :]
                changed = True

    # BOOKS array + setup after manifest theme block - inject near start of boot function
    if "const BOOKS =" not in t and "BOOKS =" not in t:
        books_arr = ", ".join(f"BOOK_L{i}" for i in range(1, playable_count + 1))
        inject = textwrap.dedent(
            f"""
            const BOOKS = [{books_arr}];
            const bookApi = setupMissionBooks({{
              subject: manifest.title || "{game_dir.name}",
              getBook: (i) => BOOKS[i] || null,
              showToast: (msg) => {{
                const toastRoot = document.getElementById("toast-root");
                if (!toastRoot) return;
                toastRoot.innerHTML = `<div class="toast">${{msg}}</div>`;
                setTimeout(() => {{ toastRoot.innerHTML = ""; }}, 2200);
              }},
            }});
            """
        )
        # After `export async function boot... {`
        m = re.search(r"export async function boot\w+\(\{\s*manifest\s*\}\)\s*\{", t)
        if m:
            # find first await initI18n end or first line inside
            insert_at = m.end()
            t = t[:insert_at] + "\n" + inject + t[insert_at:]
            changed = True

    # Add onBookClick to mountMissionHub
    if "onBookClick" not in t and "mountMissionHub(" in t:
        t2 = re.sub(
            r"(mountMissionHub\(\s*hubRoot,\s*\{)",
            r"\1\n      onBookClick: (idx, meta) => bookApi.onBookClick(idx, meta),",
            t,
            count=1,
        )
        if t2 != t:
            t = t2
            changed = True
        else:
            # try without newline patterns
            t2 = t.replace(
                "mountMissionHub(hubRoot, {",
                "mountMissionHub(hubRoot, {\n      onBookClick: (idx, meta) => bookApi.onBookClick(idx, meta),",
                1,
            )
            if t2 != t:
                t = t2
                changed = True

    if changed:
        boot.write_text(t, encoding="utf-8", newline="\n")
    return changed


def accents_for(game: str) -> str:
    palette = {
        "chemistry-lab": "#0ea5e9",
        "eco-guardian": "#22c55e",
        "ict-fundamentals": "#3b82f6",
        "math-quest": "#a855f7",
        "force-fighter": "#f97316",
        "bio-explorer": "#10b981",
        "web-dev-studio": "#06b6d4",
        "electrical-basics": "#eab308",
    }
    return palette.get(game, "#64748b")


def main():
    wired = []
    generated = []
    for game_dir in sorted(GAMES.iterdir()):
        if not game_dir.is_dir():
            continue
        meta = game_dir / "js" / "missions-meta.js"
        if not meta.exists():
            continue
        missions = extract_playable(meta.read_text(encoding="utf-8", errors="replace"))
        if not missions:
            continue
        accent = accents_for(game_dir.name)
        # Re-index playable missions by order of appearance; level files are level1..n for first n playable
        for i, mission in enumerate(missions):
            level_path = game_dir / "js" / f"level{i+1}.js"
            lm = extract_level_meta(level_path)
            book_js = build_book_js(game_dir.name, i, lm, mission, accent)
            out_dir = game_dir / "books"
            out_dir.mkdir(exist_ok=True)
            out = out_dir / f"level{i+1}.js"
            out.write_text(book_js, encoding="utf-8", newline="\n")
            # figures
            for fi in range(3):
                svg_fig(
                    game_dir / "assets" / "book" / f"m{i+1}-fig{fi+1}.svg",
                    (lm.get("kidTitle") or mission["kidTitle"])[:40],
                    fi,
                    accent,
                )
            generated.append(f"{game_dir.name}/level{i+1}")

        if wire_boot(game_dir, len(missions)):
            wired.append(game_dir.name)
        else:
            # still try wire even if previously partial
            wire_boot(game_dir, len(missions))
            wired.append(game_dir.name)

        # cache bust index/main lightly
        for name in ("main.js", "index.html"):
            p = game_dir / name
            if not p.exists():
                continue
            tt = p.read_text(encoding="utf-8")
            nt = re.sub(r"\?v=[^\s\"']+", "?v=book1", tt)
            if nt != tt:
                p.write_text(nt, encoding="utf-8", newline="\n")

    print("BOOKS", len(generated))
    for g in generated:
        print(" ", g)
    print("WIRED", len(set(wired)))
    for g in sorted(set(wired)):
        print(" ", g)


if __name__ == "__main__":
    main()
