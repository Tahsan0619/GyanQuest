#!/usr/bin/env python3
"""One-click installer/launcher: extract GyanQuest to LocalAppData, shortcut, run."""
from __future__ import annotations

import os
import subprocess
import sys
import zipfile
from pathlib import Path

APP_NAME = "GyanQuest"
INSTALL_DIR = Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / "Programs" / "GyanQuest"


def bundle_dir() -> Path:
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).resolve().parent


def payload_zip() -> Path:
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS) / "payload.zip"
    return Path(__file__).resolve().parents[1] / "build" / "payload.zip"


def die(message: str) -> None:
    try:
        import ctypes

        ctypes.windll.user32.MessageBoxW(0, message, APP_NAME, 0x10)
    except Exception:
        print(message, file=sys.stderr)
    raise SystemExit(1)


def info(message: str) -> None:
    try:
        import ctypes

        ctypes.windll.user32.MessageBoxW(0, message, APP_NAME, 0x40)
    except Exception:
        print(message)


def make_shortcut(target: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    t = str(target).replace("'", "''")
    d = str(dest).replace("'", "''")
    wd = str(target.parent).replace("'", "''")
    cmd = (
        f"$s = (New-Object -ComObject WScript.Shell).CreateShortcut('{d}');"
        f"$s.TargetPath = '{t}';"
        f"$s.WorkingDirectory = '{wd}';"
        f"$s.Save()"
    )
    subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", cmd],
        check=False,
        capture_output=True,
    )


def webview2_ok() -> bool:
    import winreg

    guid = r"SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
    wow = r"SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
    for hive, path in (
        (winreg.HKEY_LOCAL_MACHINE, wow),
        (winreg.HKEY_LOCAL_MACHINE, guid),
        (winreg.HKEY_CURRENT_USER, guid),
    ):
        try:
            winreg.OpenKey(hive, path)
            return True
        except OSError:
            continue
    return False


def maybe_install_webview2() -> None:
    if webview2_ok():
        return
    setup = bundle_dir() / "MicrosoftEdgeWebview2Setup.exe"
    if not setup.is_file():
        return
    subprocess.run([str(setup), "/silent", "/install"], check=False)


def extract_payload() -> None:
    zpath = payload_zip()
    if not zpath.is_file():
        die("Installer is missing the GyanQuest files (payload.zip).")
    INSTALL_DIR.mkdir(parents=True, exist_ok=True)
    try:
        import tkinter as tk
        from tkinter import ttk

        root = tk.Tk()
        root.title("Installing GyanQuest")
        root.geometry("420x120")
        root.resizable(False, False)
        ttk.Label(root, text="Installing GyanQuest... this can take a minute.").pack(pady=16)
        bar = ttk.Progressbar(root, mode="indeterminate", length=360)
        bar.pack(pady=8)
        bar.start(12)
        root.update()
        with zipfile.ZipFile(zpath) as zf:
            zf.extractall(INSTALL_DIR)
        root.destroy()
    except Exception:
        with zipfile.ZipFile(zpath) as zf:
            zf.extractall(INSTALL_DIR)


def main() -> None:
    exe = INSTALL_DIR / "GyanQuest.exe"
    if "/reinstall" in sys.argv and INSTALL_DIR.exists():
        import shutil

        shutil.rmtree(INSTALL_DIR, ignore_errors=True)
    if not exe.is_file():
        extract_payload()
        if not (INSTALL_DIR / "GyanQuest.exe").is_file():
            die("Install finished but GyanQuest.exe was not found.")
        exe = INSTALL_DIR / "GyanQuest.exe"
        desktop = Path.home() / "Desktop" / f"{APP_NAME}.lnk"
        start = (
            Path(os.environ.get("APPDATA", str(Path.home())))
            / "Microsoft/Windows/Start Menu/Programs"
            / f"{APP_NAME}.lnk"
        )
        make_shortcut(exe, desktop)
        make_shortcut(exe, start)
        maybe_install_webview2()
        info("GyanQuest is installed.\nA shortcut was added to your Desktop.")
    os.startfile(str(exe))


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        die(f"Setup failed.\n{e}")
