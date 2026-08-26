#!/usr/bin/env python3
"""GyanQuest desktop window: local static+tutor server + native WebView."""
from __future__ import annotations

import os
import sys
import threading
from pathlib import Path


def app_dir() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parents[1]


def webview2_installed() -> bool:
    if sys.platform != "win32":
        return True
    import winreg

    paths = (
        (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"),
        (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"),
        (winreg.HKEY_CURRENT_USER, r"SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"),
    )
    for hive, path in paths:
        try:
            winreg.OpenKey(hive, path)
            return True
        except OSError:
            continue
    return False


def ensure_webview2() -> None:
    if webview2_installed():
        return
    url = "https://go.microsoft.com/fwlink/p/?LinkId=2124703"
    msg = (
        "GyanQuest needs Microsoft Edge WebView2 (free, one-time).\n\n"
        "Click Yes to open the installer page, install it, then open GyanQuest again."
    )
    try:
        import ctypes

        yes = ctypes.windll.user32.MessageBoxW(0, msg, "GyanQuest", 0x04 | 0x20)
        if yes == 6:
            os.startfile(url)
    except Exception:
        print("Install WebView2:", url, file=sys.stderr)
    raise SystemExit(1)


def find_web_root() -> Path:
    base = app_dir()
    for cand in (base / "web", base):
        if (cand / "index.html").is_file():
            return cand
    raise FileNotFoundError(
        "GyanQuest files not found. Keep the 'web' folder next to GyanQuest.exe."
    )


def die(message: str) -> None:
    try:
        import ctypes

        ctypes.windll.user32.MessageBoxW(0, message, "GyanQuest", 0x10)
    except Exception:
        print(message, file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    os.chdir(app_dir())
    ensure_webview2()
    try:
        web = find_web_root()
    except FileNotFoundError as e:
        die(str(e))
        return

    os.environ["GYANQUEST_ROOT"] = str(web)
    tools = Path(__file__).resolve().parent
    if str(tools) not in sys.path:
        sys.path.insert(0, str(tools))

    import groq_proxy

    try:
        httpd, port = groq_proxy.create_server()
    except OSError as e:
        die(f"Could not start the local server.\n{e}")
        return

    threading.Thread(target=groq_proxy.warm_chat_chain, daemon=True).start()
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{port}/"

    try:
        import webview
    except ImportError:
        import webbrowser

        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        return

    storage = Path(os.environ.get("LOCALAPPDATA", str(app_dir()))) / "GyanQuest" / "webview"
    storage.mkdir(parents=True, exist_ok=True)

    webview.create_window(
        "GyanQuest",
        url,
        width=1280,
        height=800,
        min_size=(900, 600),
        confirm_close=True,
    )
    try:
        webview.start(private_mode=False, storage_path=str(storage))
    except Exception as e:
        die(
            "The GyanQuest window could not open. Install Microsoft Edge WebView2 "
            "and try again.\n\n"
            f"{e}"
        )
    httpd.shutdown()


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        die(f"GyanQuest failed to start.\n{e}")
