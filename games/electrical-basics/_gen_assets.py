#!/usr/bin/env python3
"""Generate themed SVG badges for Electrical Basics deepen."""
from pathlib import Path

ASSETS = Path(__file__).resolve().parent / "assets"
ASSETS.mkdir(exist_ok=True)

SVGS = {
    "m1.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="18" y="48" width="28" height="40" rx="4" fill="#1e293b" stroke="#facc15" stroke-width="3"/>
  <line x1="26" y1="48" x2="26" y2="40" stroke="#facc15" stroke-width="3"/>
  <line x1="38" y1="48" x2="38" y2="40" stroke="#facc15" stroke-width="3"/>
  <path d="M46 68 H70" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
  <circle cx="88" cy="68" r="18" fill="#fef3c7" stroke="#facc15" stroke-width="3"/>
  <path d="M84 58 L90 68 L84 68 L90 78" stroke="#a16207" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <text x="64" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#fde68a" font-family="Segoe UI">LOOP</text>
</svg>""",
    "m2.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="20" y="44" width="36" height="48" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
  <text x="38" y="74" text-anchor="middle" font-size="16" font-weight="700" fill="#38bdf8" font-family="Segoe UI">V</text>
  <path d="M64 68 H100" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
  <polygon points="96,60 110,68 96,76" fill="#facc15"/>
  <text x="82" y="52" text-anchor="middle" font-size="14" font-weight="700" fill="#fde68a" font-family="Segoe UI">I</text>
  <text x="64" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#fde68a" font-family="Segoe UI">V &amp; I</text>
</svg>""",
    "m3.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <path d="M64 22 L98 36 V62 C98 86 82 104 64 110 C46 104 30 86 30 62 V36 Z" fill="#1e293b" stroke="#22c55e" stroke-width="3"/>
  <path d="M52 66 L60 74 L78 52" stroke="#22c55e" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="64" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#86efac" font-family="Segoe UI">SAFE</text>
</svg>""",
    "rule.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="14" y="40" width="100" height="44" rx="10" fill="#1e293b" stroke="#facc15" stroke-width="3"/>
  <text x="64" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#fde68a" font-family="Segoe UI">ELEC RULE</text>
</svg>""",
    "myth.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <circle cx="64" cy="64" r="28" fill="#fef3c7" stroke="#f59e0b" stroke-width="3"/>
  <text x="64" y="72" text-anchor="middle" font-size="28" font-weight="700" fill="#b45309" font-family="Segoe UI">?</text>
</svg>""",
}

def main():
    for name, body in SVGS.items():
        path = ASSETS / name
        path.write_text(body.strip() + "\n", encoding="utf-8")
        print("wrote", path.name)

if __name__ == "__main__":
    main()
