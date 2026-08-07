#!/usr/bin/env python3
"""Generate themed SVG badges for statistics-probability and geometry-trig deepen."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def write(path: Path, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(body.strip() + "\n", encoding="ascii", errors="strict")
    print("wrote", path.relative_to(ROOT))


def svg(inner: str, vb="0 0 128 128") -> str:
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="none">{inner}</svg>'


def stats_assets() -> None:
    base = ROOT / "games" / "statistics-probability" / "assets"
    write(
        base / "m1.svg",
        svg(
            '<rect x="18" y="70" width="14" height="30" rx="2" fill="#fbbf24"/>'
            '<rect x="40" y="50" width="14" height="50" rx="2" fill="#f59e0b"/>'
            '<rect x="62" y="40" width="14" height="60" rx="2" fill="#fbbf24"/>'
            '<rect x="84" y="58" width="14" height="42" rx="2" fill="#f59e0b"/>'
            '<line x1="16" y1="55" x2="112" y2="55" stroke="#fde68a" stroke-width="2" stroke-dasharray="4 3"/>'
            '<text x="64" y="20" text-anchor="middle" font-family="Segoe UI" font-size="11" font-weight="700" fill="#fde68a">MEAN+MODE</text>'
        ),
    )
    write(
        base / "m2.svg",
        svg(
            '<circle cx="44" cy="64" r="28" fill="#fbbf24" opacity="0.85"/>'
            '<circle cx="44" cy="64" r="10" fill="#78350f"/>'
            '<path d="M44 64 L44 42" stroke="#fef3c7" stroke-width="4" stroke-linecap="round"/>'
            '<rect x="78" y="40" width="36" height="36" rx="6" fill="#f59e0b"/>'
            '<text x="96" y="64" text-anchor="middle" font-family="Segoe UI" font-size="14" font-weight="700" fill="#78350f">6</text>'
            '<text x="64" y="20" text-anchor="middle" font-family="Segoe UI" font-size="11" font-weight="700" fill="#fde68a">CHANCE</text>'
        ),
    )
    write(
        base / "rule.svg",
        svg(
            '<rect x="20" y="36" width="88" height="56" rx="10" fill="#78350f" stroke="#fbbf24" stroke-width="3"/>'
            '<text x="64" y="70" text-anchor="middle" font-family="Segoe UI" font-size="14" font-weight="700" fill="#fde68a">RULE</text>'
        ),
    )
    write(
        base / "myth.svg",
        svg(
            '<path d="M40 88 L64 28 L88 88 Z" fill="#7f1d1d" stroke="#f87171" stroke-width="3"/>'
            '<text x="64" y="78" text-anchor="middle" font-family="Segoe UI" font-size="12" font-weight="700" fill="#fecaca">MYTH</text>'
        ),
    )
    write(
        base / "data-bars.svg",
        svg(
            '<rect x="24" y="72" width="16" height="28" fill="#fbbf24"/>'
            '<rect x="48" y="48" width="16" height="52" fill="#f59e0b"/>'
            '<rect x="72" y="36" width="16" height="64" fill="#fbbf24"/>'
            '<rect x="96" y="60" width="16" height="40" fill="#f59e0b"/>'
        ),
    )
    write(
        base / "mean-line.svg",
        svg(
            '<line x1="16" y1="64" x2="112" y2="64" stroke="#fde68a" stroke-width="3"/>'
            '<circle cx="40" cy="64" r="8" fill="#fbbf24"/>'
            '<circle cx="64" cy="64" r="8" fill="#f59e0b"/>'
            '<circle cx="88" cy="64" r="8" fill="#fbbf24"/>'
            '<text x="64" y="28" text-anchor="middle" font-family="Segoe UI" font-size="12" font-weight="700" fill="#fde68a">MEAN</text>'
        ),
    )
    write(
        base / "mode-peak.svg",
        svg(
            '<circle cx="32" cy="80" r="10" fill="#f59e0b"/>'
            '<circle cx="56" cy="56" r="10" fill="#fbbf24"/>'
            '<circle cx="56" cy="80" r="10" fill="#fbbf24"/>'
            '<circle cx="56" cy="32" r="10" fill="#fbbf24"/>'
            '<circle cx="80" cy="80" r="10" fill="#f59e0b"/>'
            '<circle cx="104" cy="80" r="10" fill="#f59e0b"/>'
            '<text x="64" y="118" text-anchor="middle" font-family="Segoe UI" font-size="11" font-weight="700" fill="#fde68a">MODE</text>'
        ),
    )
    write(
        base / "coin-fair.svg",
        svg(
            '<circle cx="64" cy="64" r="40" fill="#fbbf24" stroke="#b45309" stroke-width="4"/>'
            '<text x="64" y="72" text-anchor="middle" font-family="Segoe UI" font-size="28" font-weight="700" fill="#78350f">H</text>'
        ),
    )
    write(
        base / "die-six.svg",
        svg(
            '<rect x="28" y="28" width="72" height="72" rx="10" fill="#fef3c7" stroke="#b45309" stroke-width="3"/>'
            '<circle cx="48" cy="48" r="6" fill="#78350f"/><circle cx="80" cy="48" r="6" fill="#78350f"/>'
            '<circle cx="48" cy="64" r="6" fill="#78350f"/><circle cx="80" cy="64" r="6" fill="#78350f"/>'
            '<circle cx="48" cy="80" r="6" fill="#78350f"/><circle cx="80" cy="80" r="6" fill="#78350f"/>'
        ),
    )
    write(
        base / "chance-spin.svg",
        svg(
            '<circle cx="64" cy="64" r="42" fill="#78350f" stroke="#fbbf24" stroke-width="3"/>'
            '<path d="M64 64 L64 26 A38 38 0 0 1 96 48 Z" fill="#fbbf24"/>'
            '<path d="M64 64 L96 48 A38 38 0 0 1 64 102 Z" fill="#f59e0b"/>'
            '<path d="M64 64 L64 102 A38 38 0 0 1 32 48 Z" fill="#fde68a"/>'
            '<circle cx="64" cy="64" r="8" fill="#0f172a"/>'
        ),
    )


def geo_assets() -> None:
    base = ROOT / "games" / "geometry-trig" / "assets"
    write(
        base / "m1.svg",
        svg(
            '<polygon points="64,22 104,98 24,98" fill="#60a5fa" opacity="0.9" stroke="#93c5fd" stroke-width="3"/>'
            '<rect x="78" y="70" width="36" height="36" fill="#3b82f6" opacity="0.85" stroke="#93c5fd" stroke-width="2"/>'
            '<circle cx="30" cy="40" r="16" fill="none" stroke="#93c5fd" stroke-width="3"/>'
            '<text x="64" y="18" text-anchor="middle" font-family="Segoe UI" font-size="10" font-weight="700" fill="#bfdbfe">SHAPES</text>'
        ),
    )
    write(
        base / "m2.svg",
        svg(
            '<path d="M28 96 L28 32 L100 96" fill="none" stroke="#93c5fd" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
            '<path d="M28 72 A24 24 0 0 1 48 96" fill="none" stroke="#60a5fa" stroke-width="4"/>'
            '<text x="64" y="20" text-anchor="middle" font-family="Segoe UI" font-size="11" font-weight="700" fill="#bfdbfe">ANGLES</text>'
        ),
    )
    write(
        base / "rule.svg",
        svg(
            '<rect x="20" y="36" width="88" height="56" rx="10" fill="#1e3a8a" stroke="#93c5fd" stroke-width="3"/>'
            '<text x="64" y="70" text-anchor="middle" font-family="Segoe UI" font-size="14" font-weight="700" fill="#dbeafe">RULE</text>'
        ),
    )
    write(
        base / "myth.svg",
        svg(
            '<path d="M40 88 L64 28 L88 88 Z" fill="#7f1d1d" stroke="#f87171" stroke-width="3"/>'
            '<text x="64" y="78" text-anchor="middle" font-family="Segoe UI" font-size="12" font-weight="700" fill="#fecaca">MYTH</text>'
        ),
    )
    write(
        base / "triangle.svg",
        svg(
            '<polygon points="64,20 108,100 20,100" fill="#60a5fa" stroke="#93c5fd" stroke-width="3"/>'
            '<text x="64" y="78" text-anchor="middle" font-family="Segoe UI" font-size="12" font-weight="700" fill="#0f172a">3</text>'
        ),
    )
    write(
        base / "square.svg",
        svg(
            '<rect x="28" y="28" width="72" height="72" fill="#3b82f6" stroke="#93c5fd" stroke-width="3"/>'
            '<text x="64" y="72" text-anchor="middle" font-family="Segoe UI" font-size="14" font-weight="700" fill="#dbeafe">4</text>'
        ),
    )
    write(
        base / "circle-shape.svg",
        svg(
            '<circle cx="64" cy="64" r="44" fill="none" stroke="#93c5fd" stroke-width="5"/>'
            '<circle cx="64" cy="64" r="4" fill="#60a5fa"/>'
            '<line x1="64" y1="64" x2="108" y2="64" stroke="#60a5fa" stroke-width="2"/>'
        ),
    )
    write(
        base / "acute-angle.svg",
        svg(
            '<path d="M24 100 L24 40 L70 100" fill="none" stroke="#93c5fd" stroke-width="5" stroke-linecap="round"/>'
            '<path d="M24 78 A22 22 0 0 1 40 96" fill="none" stroke="#60a5fa" stroke-width="3"/>'
            '<text x="48" y="88" font-family="Segoe UI" font-size="11" font-weight="700" fill="#bfdbfe">&lt;90</text>'
        ),
    )
    write(
        base / "right-angle.svg",
        svg(
            '<path d="M24 100 L24 36 L100 36" fill="none" stroke="#93c5fd" stroke-width="5" stroke-linecap="round"/>'
            '<path d="M24 56 L44 56 L44 36" fill="none" stroke="#60a5fa" stroke-width="3"/>'
            '<text x="64" y="80" font-family="Segoe UI" font-size="12" font-weight="700" fill="#bfdbfe">90</text>'
        ),
    )
    write(
        base / "obtuse-angle.svg",
        svg(
            '<path d="M20 100 L48 48 L116 100" fill="none" stroke="#93c5fd" stroke-width="5" stroke-linecap="round"/>'
            '<path d="M48 70 A28 28 0 0 1 78 92" fill="none" stroke="#60a5fa" stroke-width="3"/>'
            '<text x="64" y="88" font-family="Segoe UI" font-size="11" font-weight="700" fill="#bfdbfe">&gt;90</text>'
        ),
    )


if __name__ == "__main__":
    stats_assets()
    geo_assets()
    print("done")
