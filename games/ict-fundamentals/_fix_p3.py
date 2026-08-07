#!/usr/bin/env python3
"""Structural + bitsSort accept verification for ICT Fundamentals Phase 3."""
from __future__ import annotations

import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.abspath(__file__))
JS = os.path.join(ROOT, "js")


def read(rel: str) -> str:
    return open(os.path.join(ROOT, rel), encoding="utf-8").read()


def main() -> int:
    ok = True
    boot = read("js/boot-l1.js")
    for name in ("registerBitsScenes", "registerIoScenes", "registerFilesScenes"):
        if not re.search(rf"{name}\s*\(\s*arena\s*\)", boot):
            print(f"FAIL: boot does not call {name}(arena)")
            ok = False
        else:
            print(f"OK: {name}(arena)")

    for lf, runner in (("level1.js", "runL1Sub"), ("level2.js", "runL2Sub"), ("level3.js", "runL3Sub")):
        text = read(f"js/{lf}")
        m = re.search(r"const runners = \[([^\]]+)\]", text)
        n = len([x for x in m.group(1).split(",") if x.strip()]) if m else -1
        print(f"{'OK' if n == 10 else 'FAIL'}: {lf} runners={n} export={runner in text}")
        if n != 10:
            ok = False

    meta = read("js/missions-meta.js")
    playable = len(re.findall(r'"playable":\s*true', meta))
    print(f"{'OK' if playable >= 3 else 'FAIL'}: playable true={playable}")
    if playable < 3:
        ok = False

    bits = read("js/bits-scenes.js")
    l1 = read("js/level1.js")
    act = read("js/activity-controller.js")
    lab = read("js/lab-activities.js")

    checks = [
        ('bitsSort zone id "storage"', 'id: "storage"' in bits),
        ("bitsSort accept.storage alias", "accept.storage" in bits),
        ("bitsSort store accept chips", 'store: ["save", "ssd"]' in bits or "store: ['save', 'ssd']" in bits),
        ('level1 zone id "storage"', 'id: "storage"' in l1 and 'accept: ["save", "ssd"]' in l1),
        ("PLACE_CHIP sets placed[chipId]", "state.placed[chipId] = zoneId" in act),
        ("mountDragSort tryPlace uses accept", "zdef?.accept.includes(id)" in lab),
        ("cache deepen-p3b in main", "deepen-p3b" in read("main.js")),
        ("cache deepen-p3b in index", "deepen-p3b" in read("index.html")),
    ]
    for label, passed in checks:
        print(f"{'OK' if passed else 'FAIL'}: {label}")
        if not passed:
            ok = False

    # Hint bank should mention ICT topics for mission 0
    if "Bit Scout" not in boot or "I/O Ranger" not in boot or "File Finder" not in boot:
        print("FAIL: hint bank still missing ICT mission rewards")
        ok = False
    else:
        print("OK: hint bank is ICT-themed")

    print("RESULT:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
