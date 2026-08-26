#!/usr/bin/env python3
"""
Build one giant GyanQuest-Setup.exe (uncompressed payload, like a game installer).

Streams files from dist/GyanQuest into the exe. Uses D: for the output if C: is tight.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "dist" / "GyanQuest"
STUB_CS = ROOT / "tools" / "giant_setup_stub.cs"
CSC = Path(r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe")
MAGIC = b"GQINST1\n"
SKIP_NAMES = {".env", "payload.zip"}


def files_to_pack(src: Path) -> list[tuple[str, Path]]:
    items: list[tuple[str, Path]] = []
    for path in src.rglob("*"):
        if not path.is_file():
            continue
        if path.name in SKIP_NAMES:
            continue
        rel = path.relative_to(src).as_posix()
        items.append((rel, path))
    items.sort(key=lambda x: x[0].lower())
    return items


def compile_stub(out: Path) -> None:
    if not CSC.is_file():
        raise SystemExit("csc.exe not found — cannot compile the setup stub.")
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        str(CSC),
        "/nologo",
        "/target:winexe",
        f"/out:{out}",
        "/r:System.Windows.Forms.dll",
        "/r:System.Drawing.dll",
        "/r:Microsoft.CSharp.dll",
        "/r:System.Core.dll",
    ]
    ico = ROOT / "tools" / "gyanquest.ico"
    if not ico.is_file():
        try:
            if str(ROOT / "tools") not in sys.path:
                sys.path.insert(0, str(ROOT / "tools"))
            from make_app_icon import ensure_ico

            ico = ensure_ico()
        except Exception:
            ico = None
    if ico and Path(ico).is_file():
        cmd.append(f"/win32icon:{ico}")
    cmd.append(str(STUB_CS))
    subprocess.check_call(cmd)


def pick_out_path() -> Path:
    preferred = ROOT / "dist" / "GyanQuest-Setup.exe"
    try:
        c_free = shutil.disk_usage("C:/").free
    except OSError:
        c_free = 0
    need = 900 * 1024 * 1024
    if c_free > need:
        return preferred
    d = Path("D:/GyanQuest-Setup.exe")
    try:
        if shutil.disk_usage("D:/").free > need:
            print("C: is tight — writing the giant exe to D: first")
            return d
    except OSError:
        pass
    return preferred


def write_giant_exe(stub: Path, items: list[tuple[str, Path]], dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        dest.unlink()
    total = len(items)
    packed = 0
    print(f"Writing {dest} ({total} files, uncompressed) …")
    with dest.open("wb") as out:
        out.write(stub.read_bytes())
        out.write(MAGIC)
        out.write(len(items).to_bytes(4, "little"))
        for i, (rel, path) in enumerate(items, 1):
            rel_b = rel.encode("utf-8")
            if len(rel_b) > 65535:
                raise SystemExit(f"Path too long: {rel}")
            size = path.stat().st_size
            out.write(len(rel_b).to_bytes(2, "little"))
            out.write(rel_b)
            out.write(size.to_bytes(8, "little"))
            with path.open("rb") as inf:
                while True:
                    chunk = inf.read(8 * 1024 * 1024)
                    if not chunk:
                        break
                    out.write(chunk)
            packed += size
            if i == 1 or i % 200 == 0 or i == total:
                print(f"  {i}/{total}  {packed / (1024 ** 2):.0f} MB  {rel}")
    print(f"Done. {dest.stat().st_size / (1024 ** 2):.0f} MB")


def main() -> None:
    os.chdir(ROOT)
    if not (SRC / "GyanQuest.exe").is_file():
        raise SystemExit("Missing dist/GyanQuest/GyanQuest.exe — run pack_desktop.py first.")
    cache = ROOT / "build" / "desktop-web"
    if cache.is_dir():
        print("Removing leftover build/desktop-web to free disk …")
        shutil.rmtree(cache, ignore_errors=True)

    stub = ROOT / "build" / "gq-setup-stub.exe"
    compile_stub(stub)
    items = files_to_pack(SRC)
    print(f"Packing {len(items)} files from {SRC}")
    dest = pick_out_path()
    write_giant_exe(stub, items, dest)

    final = ROOT / "dist" / "GyanQuest-Setup.exe"
    if dest.resolve() != final.resolve():
        print(f"Copying onto C: {final}")
        final.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(dest, final)
    mb = final.stat().st_size / (1024 ** 2)
    print(f"\nSingle installer:\n  {final}\n  {mb:.0f} MB")
    print("Copy only that one file to another Windows PC and double-click it.")


if __name__ == "__main__":
    main()
