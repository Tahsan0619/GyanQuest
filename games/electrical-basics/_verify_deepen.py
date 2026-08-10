#!/usr/bin/env python3
"""Quick structural verify for Electrical Basics deepen."""
from pathlib import Path

root = Path(__file__).resolve().parent
errors = []

def ok(cond, msg):
    if not cond:
        errors.append(msg)

boot = (root / "js" / "boot-l1.js").read_text(encoding="utf-8")
ok("registerCircuitScenes" in boot, "boot missing circuit")
ok("registerVoltScenes" in boot, "boot missing volt")
ok("registerSafeScenes" in boot, "boot missing safe")
ok("runL1Sub" in boot and "runL2Sub" in boot and "runL3Sub" in boot, "boot missing runners")

main = (root / "main.js").read_text(encoding="utf-8")
idx = (root / "index.html").read_text(encoding="utf-8")
ok("circuit1" in main or "deepen-elec" in main, "cache-bust missing in main")
ok("circuit1" in idx or "deepen-elec" in idx, "cache-bust missing in index")

lab = (root / "js" / "lab-state.js").read_text(encoding="utf-8")
ok("electrical-basics/assets/m1.svg" in lab, "LAB_ASSET_PATHS m1")

for name in ["m1", "m2", "m3", "rule", "myth"]:
    ok((root / "assets" / f"{name}.svg").exists(), f"missing asset {name}")

checks = {
    "circuit-scenes.js": [
        "circuitMeet", "circuitSort", "circuitLab", "circuitRule",
        "circuitStretch", "circuitMyth", "circuitDrill", "circuitMastery",
    ],
    "volt-scenes.js": [
        "voltMeet", "voltSort", "voltLab", "voltRule",
        "voltStretch", "voltMyth", "voltDrill", "voltMastery",
    ],
    "safe-scenes.js": [
        "safeMeet", "safeSort", "safeLab", "safeRule",
        "safeStretch", "safeMyth", "safeDrill", "safeMastery",
    ],
}
for sc, names in checks.items():
    t = (root / "js" / sc).read_text(encoding="utf-8")
    for n in names:
        ok(f'"{n}"' in t, f"missing scene {n} in {sc}")
    ok("labState.placed" in t, f"placed missing in {sc}")

mounts = [
    "mountMotionChain", "mountDragSort", "mountHeatLab", "mountEquationBuild",
    "mountOrderSteps", "mountSpeedDrill", "mountMythCards", "mountQuiz", "mountTapContinue",
]
for lv in ["level1.js", "level2.js", "level3.js"]:
    t = (root / "js" / lv).read_text(encoding="utf-8")
    for m in mounts:
        ok(m in t, f"{m} missing in {lv}")
    ok("function s10" in t, f"s10 missing in {lv}")
    ok("Yes A" not in t and "Meet the Idea" not in t, f"stamp leftovers in {lv}")

l1 = (root / "js" / "level1.js").read_text(encoding="utf-8")
cs = (root / "js" / "circuit-scenes.js").read_text(encoding="utf-8")
ok('id: "closed"' in l1 and "closed:" in cs, "circuit zone closed")
ok('id: "open"' in l1 and "open:" in cs, "circuit zone open")

l2 = (root / "js" / "level2.js").read_text(encoding="utf-8")
vs = (root / "js" / "volt-scenes.js").read_text(encoding="utf-8")
ok('id: "volt"' in l2 and "volt:" in vs, "volt zone")
ok('id: "curr"' in l2 and "curr:" in vs, "curr zone")

l3 = (root / "js" / "level3.js").read_text(encoding="utf-8")
ss = (root / "js" / "safe-scenes.js").read_text(encoding="utf-8")
ok('id: "safe"' in l3 and "safe:" in ss, "safe zone")
ok('id: "adult"' in l3 and "adult:" in ss, "adult zone")

# Prev/Next in activities
act = (root / "js" / "lab-activities.js").read_text(encoding="utf-8")
ok(">Prev<" in act or ">Prev</" in act, "Prev button")
ok(">Next<" in act or ">Next</" in act, "Next button")

if errors:
    print("FAIL:")
    for e in errors:
        print(" -", e)
    raise SystemExit(1)
print("ALL CHECKS PASSED")
