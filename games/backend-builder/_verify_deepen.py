#!/usr/bin/env python3
"""Structural verify for Backend Builder deepen."""
from pathlib import Path

root = Path(__file__).resolve().parent
errors = []

def ok(cond, msg):
    if not cond:
        errors.append(msg)

boot = (root / "js" / "boot-l1.js").read_text(encoding="utf-8")
ok("registerServerScenes" in boot, "boot missing server")
ok("registerRoutesScenes" in boot, "boot missing routes")
ok("registerAuthScenes" in boot, "boot missing auth")
ok("runL1Sub" in boot and "runL2Sub" in boot and "runL3Sub" in boot, "boot missing runners")
ok("routesMeet" in boot and "authMeet" in boot, "boot intro scenes")
ok("serverMastery" in boot and "routesMastery" in boot and "authMastery" in boot, "boot win scenes")
ok("pushMeet" not in boot and "rockMastery" not in boot, "force leftovers in boot")

main = (root / "main.js").read_text(encoding="utf-8")
idx = (root / "index.html").read_text(encoding="utf-8")
ok("deepen-backend" in main and "deepen-backend" in idx, "cache-bust missing")

lab = (root / "js" / "lab-state.js").read_text(encoding="utf-8")
ok("backend-builder/assets/m1.svg" in lab, "LAB_ASSET_PATHS m1")

for name in ["m1", "m2", "m3", "rule", "myth"]:
    ok((root / "assets" / f"{name}.svg").exists(), f"missing asset {name}")

checks = {
    "server-scenes.js": [
        "serverMeet", "serverSort", "serverLab", "serverRule",
        "serverStretch", "serverMyth", "serverDrill", "serverMastery",
    ],
    "routes-scenes.js": [
        "routesMeet", "routesSort", "routesLab", "routesRule",
        "routesStretch", "routesMyth", "routesDrill", "routesMastery",
    ],
    "auth-scenes.js": [
        "authMeet", "authSort", "authLab", "authRule",
        "authStretch", "authMyth", "authDrill", "authMastery",
    ],
}
for sc, names in checks.items():
    t = (root / "js" / sc).read_text(encoding="utf-8")
    for n in names:
        ok(f'"{n}"' in t or f"P + \"{n[len(sc.split('-')[0]):]}\"" in t or ("P + \"" + n.replace(sc.split("-")[0], "") + "\"") in t, f"missing scene {n} in {sc}")
    # prefix style: P + "Meet"
    ok('P + "Meet"' in t or "serverMeet" in t or "routesMeet" in t or "authMeet" in t, f"meet missing in {sc}")
    ok("labState.placed" in t, f"placed missing in {sc}")

# Prefer P+"Meet" style - verify register names via P +
for sc, pref in [("server-scenes.js", "server"), ("routes-scenes.js", "routes"), ("auth-scenes.js", "auth")]:
    t = (root / "js" / sc).read_text(encoding="utf-8")
    for suf in ["Meet", "Sort", "Lab", "Rule", "Stretch", "Myth", "Drill", "Mastery"]:
        ok(f'P + "{suf}"' in t, f'{pref}{suf} via P+ missing in {sc}')

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
ss = (root / "js" / "server-scenes.js").read_text(encoding="utf-8")
ok('id: "req"' in l1 and "req:" in ss, "server zone req")
ok('id: "res"' in l1 and "res:" in ss, "server zone res")

l2 = (root / "js" / "level2.js").read_text(encoding="utf-8")
rs = (root / "js" / "routes-scenes.js").read_text(encoding="utf-8")
ok('id: "route"' in l2 and "route:" in rs, "routes zone")
ok('id: "method"' in l2 and "method:" in rs, "method zone")

l3 = (root / "js" / "level3.js").read_text(encoding="utf-8")
aus = (root / "js" / "auth-scenes.js").read_text(encoding="utf-8")
ok('id: "auth"' in l3 and "auth:" in aus, "auth zone")
ok('id: "pub"' in l3 and "pub:" in aus, "pub zone")

meta = (root / "js" / "missions-meta.js").read_text(encoding="utf-8")
ok(meta.count('"playable": true') >= 3, "need 3 playable missions")

# ASCII check: no common mojibake / fancy arrows in buttons of activities
act = (root / "js" / "lab-activities.js").read_text(encoding="utf-8")
ok(">Prev<" in act or ">Prev</" in act, "Prev button")
ok(">Next<" in act or ">Next</" in act, "Next button")

if errors:
    print("FAIL:")
    for e in errors:
        print(" -", e)
    raise SystemExit(1)
print("ALL CHECKS PASSED")
