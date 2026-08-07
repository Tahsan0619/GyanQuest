#!/usr/bin/env python3
"""Structural verify for Database SQL deepen."""
from pathlib import Path

root = Path(__file__).resolve().parent
errors = []

def ok(cond, msg):
    if not cond:
        errors.append(msg)

boot = (root / "js" / "boot-l1.js").read_text(encoding="utf-8")
ok("registerTableScenes" in boot, "boot missing table")
ok("registerSelectScenes" in boot, "boot missing select")
ok("registerJoinScenes" in boot, "boot missing join")
ok("runL1Sub" in boot and "runL2Sub" in boot and "runL3Sub" in boot, "boot missing runners")
ok("selectMeet" in boot and "joinMeet" in boot, "boot intro scenes")
ok("tableMastery" in boot and "selectMastery" in boot and "joinMastery" in boot, "boot win scenes")
ok("pushMeet" not in boot and "rockMastery" not in boot, "force leftovers in boot")

main = (root / "main.js").read_text(encoding="utf-8")
idx = (root / "index.html").read_text(encoding="utf-8")
ok("deepen-db" in main and "deepen-db" in idx, "cache-bust missing")

lab = (root / "js" / "lab-state.js").read_text(encoding="utf-8")
ok("database-sql/assets/m1.svg" in lab, "LAB_ASSET_PATHS m1")

for name in ["m1", "m2", "m3", "rule", "myth"]:
    ok((root / "assets" / f"{name}.svg").exists(), f"missing asset {name}")

for sc, pref in [("table-scenes.js", "table"), ("select-scenes.js", "select"), ("join-scenes.js", "join")]:
    t = (root / "js" / sc).read_text(encoding="utf-8")
    for suf in ["Meet", "Sort", "Lab", "Rule", "Stretch", "Myth", "Drill", "Mastery"]:
        ok(f'P + "{suf}"' in t, f'{pref}{suf} via P+ missing in {sc}')
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
ts = (root / "js" / "table-scenes.js").read_text(encoding="utf-8")
ok('id: "table"' in l1 and "table:" in ts, "table zone")
ok('id: "messy"' in l1 and "messy:" in ts, "messy zone")

l2 = (root / "js" / "level2.js").read_text(encoding="utf-8")
ss = (root / "js" / "select-scenes.js").read_text(encoding="utf-8")
ok('id: "ask"' in l2 and "ask:" in ss, "ask zone")
ok('id: "write"' in l2 and "write:" in ss, "write zone")

l3 = (root / "js" / "level3.js").read_text(encoding="utf-8")
js = (root / "js" / "join-scenes.js").read_text(encoding="utf-8")
ok('id: "key"' in l3 and "key:" in js, "key zone")
ok('id: "join"' in l3 and "join:" in js, "join zone")

meta = (root / "js" / "missions-meta.js").read_text(encoding="utf-8")
ok(meta.count('"playable": true') >= 3, "need 3 playable missions")

act = (root / "js" / "lab-activities.js").read_text(encoding="utf-8")
ok(">Prev<" in act or ">Prev</" in act, "Prev button")
ok(">Next<" in act or ">Next</" in act, "Next button")

if errors:
    print("FAIL:")
    for e in errors:
        print(" -", e)
    raise SystemExit(1)
print("ALL CHECKS PASSED")
