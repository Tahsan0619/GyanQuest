# -*- coding: utf-8 -*-
"""Generate themed badge SVGs for Web Dev Studio (ASCII-safe)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "assets"
ROOT.mkdir(parents=True, exist_ok=True)

SVGS = {
    "m1.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <path d="M20 72 L64 28 L108 72 Z" fill="#c2410c"/>
  <rect x="28" y="72" width="72" height="40" rx="4" fill="#fed7aa" stroke="#ea580c" stroke-width="3"/>
  <rect x="54" y="86" width="20" height="26" rx="2" fill="#9a3412"/>
  <rect x="36" y="80" width="14" height="12" rx="1" fill="#fde68a"/>
  <rect x="78" y="80" width="14" height="12" rx="1" fill="#fde68a"/>
  <text x="64" y="122" text-anchor="middle" font-size="11" font-weight="700" fill="#fdba74" font-family="Segoe UI">HTML</text>
</svg>
""",
    "m2.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="24" y="28" width="80" height="64" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
  <rect x="34" y="40" width="48" height="10" rx="3" fill="#38bdf8"/>
  <rect x="34" y="56" width="60" height="6" rx="2" fill="#7dd3fc"/>
  <rect x="34" y="68" width="40" height="6" rx="2" fill="#22c55e"/>
  <circle cx="98" cy="86" r="14" fill="#a78bfa"/>
  <text x="64" y="122" text-anchor="middle" font-size="11" font-weight="700" fill="#7dd3fc" font-family="Segoe UI">CSS</text>
</svg>
""",
    "m3.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="24" y="48" width="80" height="36" rx="12" fill="#facc15" stroke="#fef08a" stroke-width="3"/>
  <text x="64" y="72" text-anchor="middle" font-size="14" font-weight="800" fill="#422006" font-family="Segoe UI">CLICK</text>
  <circle cx="64" cy="36" r="10" fill="none" stroke="#eab308" stroke-width="3"/>
  <text x="64" y="122" text-anchor="middle" font-size="11" font-weight="700" fill="#fde047" font-family="Segoe UI">JS</text>
</svg>
""",
    "rule.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="14" y="40" width="100" height="44" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
  <text x="64" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#e0f2fe" font-family="Segoe UI">WEB RULE</text>
</svg>
""",
    "myth.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="20" y="28" width="88" height="64" rx="12" fill="#7f1d1d" stroke="#f87171" stroke-width="3"/>
  <text x="64" y="58" text-anchor="middle" font-size="18" font-weight="800" fill="#fecaca" font-family="Segoe UI">?</text>
  <text x="64" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="#fecaca" font-family="Segoe UI">MYTH</text>
  <text x="64" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#fca5a5" font-family="Segoe UI">BUST</text>
</svg>
""",
}

def main():
    for name, body in SVGS.items():
        path = ROOT / name
        # write without BOM
        path.write_text(body.lstrip("\ufeff"), encoding="utf-8", newline="\n")
        print("wrote", path)

if __name__ == "__main__":
    main()
