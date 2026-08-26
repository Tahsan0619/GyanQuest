#!/usr/bin/env python3
"""
Build a single GyanQuest-Setup.exe that any Windows PC can double-click.

Needs dist/GyanQuest/ from pack_desktop.py first.
Downloads Inno Setup (compiler) and the WebView2 bootstrapper into tools/vendor/.
"""
from __future__ import annotations

import os
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VENDOR = ROOT / "tools" / "vendor"
INNO_DIR = VENDOR / "InnoSetup"
ISS = next((ROOT / "tools").glob("*.iss"))
DIST_EXE = ROOT / "dist" / "GyanQuest" / "GyanQuest.exe"
SETUP_OUT = ROOT / "dist" / "GyanQuest-Setup.exe"

INNO_URL = "https://jrsoftware.org/download.php/is.exe"
WEBVIEW2_URL = "https://go.microsoft.com/fwlink/p/?LinkId=2124703"


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {dest.name} …")
    req = urllib.request.Request(url, headers={"User-Agent": "GyanQuestInstaller/1.0"})
    with urllib.request.urlopen(req, timeout=180) as resp, dest.open("wb") as out:
        while True:
            chunk = resp.read(1024 * 256)
            if not chunk:
                break
            out.write(chunk)
    print(f"  saved {dest} ({dest.stat().st_size / 1024:.0f} KB)")


def find_iscc() -> Path | None:
    for cand in (
        INNO_DIR / "ISCC.exe",
        Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / "Inno Setup 6" / "ISCC.exe",
        Path(r"C:\Program Files (x86)\Inno Setup 6\ISCC.exe"),
        Path(r"C:\Program Files\Inno Setup 6\ISCC.exe"),
    ):
        if cand.is_file():
            return cand
    return None


def install_inno() -> Path:
    existing = find_iscc()
    if existing:
        return existing
    installer = VENDOR / "innosetup-install.exe"
    if not installer.is_file():
        download(INNO_URL, installer)
    INNO_DIR.mkdir(parents=True, exist_ok=True)
    print("Installing Inno Setup compiler (local, one-time) …")
    subprocess.check_call(
        [
            str(installer),
            "/VERYSILENT",
            "/SUPPRESSMSGBOXES",
            "/NORESTART",
            "/NOCANCEL",
            f"/DIR={INNO_DIR}",
        ]
    )
    iscc = find_iscc()
    if not iscc:
        raise SystemExit("Inno Setup ISCC.exe not found after install.")
    return iscc


def ensure_webview2_bootstrapper() -> None:
    dest = VENDOR / "MicrosoftEdgeWebview2Setup.exe"
    if dest.is_file() and dest.stat().st_size > 100_000:
        return
    download(WEBVIEW2_URL, dest)


def stop_running_app() -> None:
    subprocess.run(
        ["taskkill", "/F", "/IM", "GyanQuest.exe"],
        capture_output=True,
        text=True,
    )


def copy_runtime_into_dist() -> None:
    import shutil
    import time

    stop_running_app()
    time.sleep(1)
    built = ROOT / "build" / "gq-runtime" / "GyanQuest"
    dest = ROOT / "dist" / "GyanQuest"
    if not (built / "GyanQuest.exe").is_file():
        raise SystemExit("Runtime build missing. Re-run without --skip-rebuild.")
    shutil.copy2(built / "GyanQuest.exe", dest / "GyanQuest.exe")
    internal = dest / "_internal"
    if internal.exists():
        shutil.rmtree(internal)
    shutil.copytree(built / "_internal", internal)
    print("  runtime copied into dist/GyanQuest/")


def rebuild_runtime() -> None:
    """Refresh GyanQuest.exe without recopying the 700MB web payload."""
    web = ROOT / "dist" / "GyanQuest" / "web"
    if not web.is_dir():
        raise SystemExit("Missing dist/GyanQuest/web — run: py -3 tools/pack_desktop.py")
    out = ROOT / "build" / "gq-runtime"
    print("Rebuilding GyanQuest.exe …")
    cmd = [
            sys.executable,
            "-m",
            "PyInstaller",
            "--noconfirm",
            "--onedir",
            "--windowed",
            "--name",
            "GyanQuest",
            "--distpath",
            str(out),
            "--workpath",
            str(ROOT / "build" / "gq-runtime-work"),
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
    ico = ROOT / "tools" / "gyanquest.ico"
    if ico.is_file():
        cmd[-1:-1] = ["--icon", str(ico)]
    subprocess.check_call(cmd, cwd=ROOT)
    copy_runtime_into_dist()


def make_payload_zip() -> Path:
    import zipfile

    src = ROOT / "dist" / "GyanQuest"
    dest = ROOT / "build" / "payload.zip"
    dest.parent.mkdir(parents=True, exist_ok=True)
    print("Packing payload.zip (stored, no extra compression) …")
    if dest.exists():
        dest.unlink()
    n = 0
    with zipfile.ZipFile(dest, "w", compression=zipfile.ZIP_STORED, allowZip64=True) as zf:
        for path in src.rglob("*"):
            if not path.is_file():
                continue
            if path.name == ".env":
                continue
            zf.write(path, path.relative_to(src).as_posix())
            n += 1
    print(f"  {n} files, {dest.stat().st_size / (1024 * 1024):.0f} MB")
    return dest


def build_setup_exe(payload: Path) -> Path:
    wv = VENDOR / "MicrosoftEdgeWebview2Setup.exe"
    add_data = [f"{payload};."]
    if wv.is_file():
        add_data.append(f"{wv};.")
    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--onefile",
        "--windowed",
        "--name",
        "GyanQuest-Setup",
        "--distpath",
        str(ROOT / "dist"),
        "--workpath",
        str(ROOT / "build" / "setup-work"),
        "--specpath",
        str(ROOT / "build"),
        str(ROOT / "tools" / "setup_bootstrap.py"),
    ]
    for item in add_data:
        cmd.extend(["--add-data", item])
    print("Building GyanQuest-Setup.exe (this can take several minutes) …")
    subprocess.check_call(cmd, cwd=ROOT)
    return SETUP_OUT


def main() -> None:
    os.chdir(ROOT)
    if not DIST_EXE.is_file():
        raise SystemExit("Missing dist/GyanQuest/GyanQuest.exe — run: py -3 tools/pack_desktop.py")
    if "--skip-rebuild" in sys.argv:
        copy_runtime_into_dist()
    else:
        rebuild_runtime()
    ensure_webview2_bootstrapper()
    payload = make_payload_zip()
    out = build_setup_exe(payload)
    if not out.is_file():
        raise SystemExit("GyanQuest-Setup.exe was not produced.")
    mb = out.stat().st_size / (1024 * 1024)
    print(f"\nCopy this one file to any Windows 10/11 PC:")
    print(f"  {out}")
    print(f"  {mb:.0f} MB")
    print("Double-click it. It installs to the user folder, adds a Desktop shortcut, and launches.")


if __name__ == "__main__":
    main()
