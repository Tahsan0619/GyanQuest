#!/usr/bin/env python3
"""
Copy only live GyanQuest files (no leftover 3D dumps/audio/backend),
then build dist/GyanQuest/GyanQuest.exe.

Usage (from repo root):
  py -3 tools/pack_desktop.py
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGE = ROOT / "build" / "desktop-web"
DIST_APP = ROOT / "dist" / "GyanQuest"
MB = 1024 * 1024

SKIP_DIRS = {"_legacy3d", "__pycache__", ".git"}
SKIP_SUFFIXES = {".md", ".py", ".pyc", ".ps1"}
SKIP_NAME_PARTS = ("_qa-jump",)


def kb(n: int) -> str:
    return f"{n / MB:.1f} MB"


def should_skip(rel: Path) -> bool:
    if any(part in SKIP_DIRS for part in rel.parts):
        return True
    name = rel.name.lower()
    if rel.suffix.lower() in SKIP_SUFFIXES:
        return True
    return any(part in name for part in SKIP_NAME_PARTS)


def copy_file(src: Path, dest: Path, stats: dict) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    stats["bytes"] += src.stat().st_size
    stats["files"] += 1


def copy_tree(src: Path, dest: Path, stats: dict) -> None:
    if not src.exists():
        print(f"  skip missing {src.relative_to(ROOT)}")
        return
    for path in src.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(src)
        if should_skip(rel):
            stats["skipped"] += 1
            continue
        copy_file(path, dest / rel, stats)


def catalog_glb_names() -> list[str]:
    catalog = ROOT / "games" / "3d-lab" / "js" / "catalog.js"
    text = catalog.read_text(encoding="utf-8")
    return re.findall(r'file:\s*"([^"]+\.glb)"', text)


def copy_catalog_models(dest_web: Path, stats: dict) -> None:
    names = catalog_glb_names()
    src_root = ROOT / "sketchfab models"
    glbs = {p.name.lower(): p for p in src_root.rglob("*.glb")} if src_root.exists() else {}
    dest_dir = dest_web / "sketchfab models"
    dest_dir.mkdir(parents=True, exist_ok=True)
    missing = []
    for name in names:
        src = glbs.get(name.lower())
        if not src:
            missing.append(name)
            continue
        copy_file(src, dest_dir / name, stats)
    print(f"  catalog models {len(names) - len(missing)}/{len(names)}")
    for name in missing:
        print(f"  MISSING model: {name}")


def stage_web() -> dict:
    if STAGE.exists():
        shutil.rmtree(STAGE)
    STAGE.mkdir(parents=True)
    stats = {"bytes": 0, "files": 0, "skipped": 0}

    copy_file(ROOT / "index.html", STAGE / "index.html", stats)

    for folder in ("css", "engine", "assets"):
        print(f"  copying {folder}/")
        copy_tree(ROOT / folder, STAGE / folder, stats)

    js_src = ROOT / "js" / "landing.js"
    if js_src.exists():
        copy_file(js_src, STAGE / "js" / "landing.js", stats)
    print("  copying games/ (no leftover 3D, docs, QA scripts)")
    copy_tree(ROOT / "games", STAGE / "games", stats)
    print("  copying Sketchfab catalog models")
    copy_catalog_models(STAGE, stats)
    print(f"  staged {stats['files']} files, {kb(stats['bytes'])} (skipped {stats['skipped']})")
    return stats


def app_icon() -> Path | None:
    tools = ROOT / "tools"
    if str(tools) not in sys.path:
        sys.path.insert(0, str(tools))
    try:
        from make_app_icon import ensure_ico

        return ensure_ico()
    except Exception as e:
        print(f"  (logo icon skipped: {e})")
        return None


def build_exe() -> None:
    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--clean",
        "--onedir",
        "--windowed",
        "--name",
        "GyanQuest",
        "--distpath",
        str(ROOT / "dist"),
        "--workpath",
        str(ROOT / "build" / "desktop-work"),
        "--specpath",
        str(ROOT / "build"),
        "--paths",
        str(ROOT / "tools"),
        "--hidden-import",
        "groq_proxy",
        "--collect-all",
        "webview",
        str(ROOT / "tools" / "desktop_app.py"),
    ]
    ico = app_icon()
    if ico:
        cmd[-1:-1] = ["--icon", str(ico)]
    print("\nBuilding GyanQuest.exe …")
    subprocess.check_call(cmd, cwd=ROOT)


def finish_bundle() -> None:
    web_dest = DIST_APP / "web"
    if web_dest.exists():
        shutil.rmtree(web_dest)
    print("Copying web payload next to the exe …")
    shutil.copytree(STAGE, web_dest)

    example = ROOT / ".env.example"
    if example.exists():
        shutil.copy2(example, DIST_APP / ".env.example")
    env = ROOT / ".env"
    if env.exists():
        shutil.copy2(env, DIST_APP / ".env")

    (DIST_APP / "README.txt").write_text(
        "GyanQuest desktop\n"
        "=================\n\n"
        "On a new Windows PC: copy this WHOLE folder, then double-click Install.exe.\n"
        "That adds a Desktop shortcut and opens GyanQuest. No Python needed.\n\n"
        "Already on this PC: double-click GyanQuest.exe (portable) or Install.exe.\n\n"
        "Keep this folder together (GyanQuest.exe + _internal + web + Install.exe).\n"
        "Windows 10/11 64-bit only — not phones or Mac.\n\n"
        "Tutor chat: copy .env.example to .env and add GROQ_API_KEY.\n",
        encoding="utf-8",
    )
    bat = ROOT / "tools" / "Install.bat"
    if bat.is_file():
        shutil.copy2(bat, DIST_APP / "Install.bat")
    cs = ROOT / "tools" / "install_local.cs"
    csc = Path(r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe")
    if cs.is_file() and csc.is_file():
        csc_cmd = [
            str(csc),
            "/nologo",
            "/target:exe",
            f"/out:{DIST_APP / 'Install.exe'}",
            "/r:Microsoft.CSharp.dll",
            "/r:System.Core.dll",
        ]
        ico = app_icon()
        if ico:
            csc_cmd.append(f"/win32icon:{ico}")
        csc_cmd.append(str(cs))
        subprocess.check_call(csc_cmd)
    wv = ROOT / "tools" / "vendor" / "MicrosoftEdgeWebview2Setup.exe"
    if wv.is_file():
        shutil.copy2(wv, DIST_APP / "MicrosoftEdgeWebview2Setup.exe")


def main() -> None:
    os.chdir(ROOT)
    print("Staging used files only …")
    stage_web()
    build_exe()
    if not (DIST_APP / "GyanQuest.exe").exists():
        raise SystemExit("PyInstaller did not produce GyanQuest.exe")
    finish_bundle()
    total = 0
    n = 0
    for f in DIST_APP.rglob("*"):
        if f.is_file():
            total += f.stat().st_size
            n += 1
    print(f"\nDone: {DIST_APP / 'GyanQuest.exe'}")
    print(f"Folder size: {kb(total)} in {n} files")
    print("Portable folder: dist/GyanQuest/")
    print("Single installer for any PC: py -3 tools/build_installer.py")


if __name__ == "__main__":
    main()
