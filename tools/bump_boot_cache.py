from pathlib import Path
import re

root = Path(r"c:\Users\Tahsan\Downloads\ImpactX\games")
n = 0
for p in sorted(root.glob("*/main.js")):
    t = p.read_text(encoding="utf-8")
    nt, c = re.subn(r"boot-l1\.js\?v=[^\"']+", "boot-l1.js?v=hubfirst1", t, count=1)
    if c:
        p.write_text(nt, encoding="utf-8")
        n += 1
        print("OK", p.parent.name)
    else:
        print("SKIP", p.parent.name)
print("updated", n)
