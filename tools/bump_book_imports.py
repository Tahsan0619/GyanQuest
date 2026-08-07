"""Bump all BOOK_L* import cache query params after book rebuild."""
from pathlib import Path
import re

root = Path(r"c:\Users\Tahsan\Downloads\ImpactX\games")
n = 0
for p in sorted(root.glob("*/js/boot-l1.js")):
    t = p.read_text(encoding="utf-8")
    nt, c = re.subn(
        r'(from\s+"\.\./books/level\d+\.js)\?v=[^"]+"',
        r'\1?v=book3"',
        t,
    )
    if c:
        p.write_text(nt, encoding="utf-8", newline="\n")
        n += 1
        print(p.parent.parent.name, c)
print("boots", n)
