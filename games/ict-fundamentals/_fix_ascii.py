#!/usr/bin/env python3
"""ASCII-safe cleanup + structural checks for ICT Fundamentals Phase 3."""
from __future__ import annotations

import os
import re
import sys

# Windows console safety
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {"_legacy3d", "node_modules", ".git"}

# Only touch content JS / entry HTML (not CSS / engine leftovers)
TARGET_REL = {
    "index.html",
    "main.js",
    os.path.join("js", "bits-scenes.js"),
    os.path.join("js", "io-scenes.js"),
    os.path.join("js", "files-scenes.js"),
    os.path.join("js", "level1.js"),
    os.path.join("js", "level2.js"),
    os.path.join("js", "level3.js"),
    os.path.join("js", "lab-activities.js"),
    os.path.join("js", "boot-l1.js"),
    os.path.join("js", "missions-meta.js"),
    os.path.join("js", "lab-state.js"),
    os.path.join("js", "mission-hub.js"),
    os.path.join("js", "activity-controller.js"),
    os.path.join("js", "arena-2d.js"),
    os.path.join("js", "scene-layout.js"),
    "manifest.js",
}

# Literal replacements (order matters for multi-char / mojibake)
REPLACEMENTS = [
    # Corrupted UTF-8 left as euro/dagger + JS \\u escapes in source
    ("\u20ac\\u201D", " - "),
    ("\u20ac\\u201d", " - "),
    ("\u20ac\\u201C", " - "),
    ("\u20ac\\u201c", " - "),
    ("\u02c6\\u2019", "-"),  # decrease nudge
    ("\u0153\\u201C", " - "),
    ("\u0153\\u201c", " - "),
    ("\u2020\\u2019", " -> "),  # dagger + rsquo escape = was ->
    ("\u20ac\u0153", '"'),  # €œ open quote mojibake
    ("\u20ac\u009d", '"'),  # € close (C1)
    ("\u20ac\u201d", " - "),
    ("\u20ac\u201c", " - "),
    ("\u20ac\u2122", "'"),
    ("\u00b7", " / "),  # middle dot
    ("\u2265", ">="),
    ("\u2026", "..."),
    ("\u2192", "->"),
    ("\u2194", "<->"),
    ("\u2190", "<-"),
    ("\u2191", " up"),
    ("\u2193", " down"),
    ("\u2014", " - "),
    ("\u2013", "-"),
    ("\u201c", '"'),
    ("\u201d", '"'),
    ("\u2018", "'"),
    ("\u2019", "'"),
    ("\u25b6", ""),
    ("\u25c0", ""),
    ("\u2212", "-"),  # minus sign
]

EMOJI_FIELD_RE = re.compile(r'(emoji:\s*)"([^"]*)"')


def char_escape(s: str) -> str:
    out = []
    for ch in s:
        o = ord(ch)
        if o < 128:
            if ch in '\\"':
                out.append("\\" + ch)
            else:
                out.append(ch)
        elif o > 0xFFFF:
            o2 = o - 0x10000
            out.append("\\u%04x\\u%04x" % (0xD800 + (o2 >> 10), 0xDC00 + (o2 & 0x3FF)))
        else:
            out.append("\\u%04x" % o)
    return "".join(out)


def clean_text(text: str, path: str) -> str:
    for a, b in REPLACEMENTS:
        text = text.replace(a, b)

    # Collapse only spaces created by middle-dot -> " / " next to existing spaces:
    # e.g. "CPU · RAM" -> "CPU  /  RAM" if spaced; normalize " /  " patterns lightly
    text = text.replace("  /  ", " / ")
    text = text.replace(" /  ", " / ")
    text = text.replace("  / ", " / ")

    base = os.path.basename(path)
    if base in ("level1.js", "level2.js", "level3.js"):

        def esc_emoji(m: re.Match) -> str:
            raw = m.group(2)
            raw = raw.replace("\ufe0f", "")
            if all(ord(c) < 128 for c in raw):
                return m.group(0)
            return f'{m.group(1)}"{char_escape(raw)}"'

        text = EMOJI_FIELD_RE.sub(esc_emoji, text)
        # Mastery / HTML titles: drop leading emoji glyphs for ASCII-safe copy
        text = re.sub(r"<h3>[^\x00-\x7F]+\s*", "<h3>", text)

    # Explicit button cleanups (after triangle strip leaves trailing space)
    text = text.replace("Next ▶", "Next")
    text = text.replace("Next step ▶", "Next step")
    text = text.replace('title="Next">Next </button>', 'title="Next">Next</button>')
    text = text.replace(">Next step </button>", ">Next step</button>")
    text = text.replace(">Next </button>", ">Next</button>")

    # lab-activities myth copy
    text = text.replace(
        "Hit \u20ac\u0153Bust it\u20ac\u009d to see",
        'Hit "Bust it" to see',
    )
    text = text.replace(
        "Hit \u20ac\u0153Bust it\u20ac\\u009d to see",
        'Hit "Bust it" to see',
    )

    return text


def scan_non_ascii(text: str) -> list[tuple[int, str, list[str]]]:
    hits = []
    for i, line in enumerate(text.splitlines(), 1):
        bad = [f"U+{ord(c):04X}" for c in line if ord(c) > 127]
        if bad:
            # show unique
            uniq = []
            for b in bad:
                if b not in uniq:
                    uniq.append(b)
            hits.append((i, line.strip()[:120], uniq[:20]))
    return hits


def verify_structure() -> list[str]:
    issues = []
    boot = open(os.path.join(ROOT, "js", "boot-l1.js"), encoding="utf-8").read()
    for name in ("registerBitsScenes", "registerIoScenes", "registerFilesScenes"):
        if name not in boot:
            issues.append(f"boot-l1 missing {name}")
        if f"{name}(" not in boot and f"{name} (" not in boot:
            # call site
            pass
    # Prefer checking call sites
    for call in ("registerBitsScenes(arena)", "registerIoScenes(arena)", "registerFilesScenes(arena)"):
        if call not in boot and call.replace("(arena)", "(arena2d)") not in boot:
            # soft: just check function name appears with (
            if not re.search(rf"{call.split('(')[0]}\s*\(", boot):
                issues.append(f"boot-l1 may not call {call.split('(')[0]}")

    for lf, runner, n in (
        ("level1.js", "runL1Sub", 10),
        ("level2.js", "runL2Sub", 10),
        ("level3.js", "runL3Sub", 10),
    ):
        text = open(os.path.join(ROOT, "js", lf), encoding="utf-8").read()
        m = re.search(r"const runners = \[([^\]]+)\]", text)
        if not m:
            issues.append(f"{lf}: no runners array")
        else:
            count = len([x for x in m.group(1).split(",") if x.strip()])
            if count != n:
                issues.append(f"{lf}: runners count {count} != {n}")
        if f"export function {runner}" not in text:
            issues.append(f"{lf}: missing {runner}")

    meta = open(os.path.join(ROOT, "js", "missions-meta.js"), encoding="utf-8").read()
    playable_true = len(re.findall(r'"playable":\s*true', meta))
    if playable_true < 3:
        issues.append(f"missions-meta playable true count={playable_true} (want >=3)")

    bits = open(os.path.join(ROOT, "js", "bits-scenes.js"), encoding="utf-8").read()
    if "accept.storage" not in bits and re.search(r"storage:\s*\[", bits) is None:
        issues.append("bitsSort: no storage accept list")
    if 'id: "storage"' not in bits:
        issues.append("bitsSort: no storage zone id")
    if "placed[chipId] = zoneId" not in open(
        os.path.join(ROOT, "js", "activity-controller.js"), encoding="utf-8"
    ).read():
        issues.append("activity-controller missing placed[chipId]=zoneId")

    l1 = open(os.path.join(ROOT, "js", "level1.js"), encoding="utf-8").read()
    if 'id: "storage"' not in l1:
        issues.append("level1 mountDragSort missing storage zone")

    return issues


def main():
    write = "--write" in sys.argv or "-w" in sys.argv
    changed = []
    remaining = []

    for rel in sorted(TARGET_REL):
        path = os.path.join(ROOT, rel)
        if not os.path.isfile(path):
            print(f"MISSING: {rel}")
            continue
        with open(path, encoding="utf-8") as fh:
            original = fh.read()
        cleaned = clean_text(original, path)
        if cleaned != original:
            if write:
                # Preserve existing newline style roughly
                with open(path, "w", encoding="utf-8", newline="\n") as fh:
                    fh.write(cleaned)
            changed.append(rel.replace("\\", "/"))
        post = scan_non_ascii(cleaned)
        # Allow unicode escapes in source as ASCII (already ASCII)
        # Remaining are real non-ASCII codepoints still in file
        if post:
            remaining.append((rel.replace("\\", "/"), post))

    print("=== CHANGED ===")
    for c in changed:
        print(c if write else f"{c} (dry-run)")
    print("=== REMAINING NON-ASCII (after clean) ===")
    if not remaining:
        print("(none)")
    for rel, hits in remaining:
        for i, line, bad in hits:
            print(f"{rel}:{i}: {', '.join(bad)}")
            print(f"  {line}")
    print("=== STRUCTURE ===")
    issues = verify_structure()
    if not issues:
        print("OK")
    else:
        for i in issues:
            print("ISSUE:", i)
    print(f"mode={'write' if write else 'dry-run'} files_touched={len(changed)}")
    return 0 if not issues else 1


if __name__ == "__main__":
    sys.exit(main())
