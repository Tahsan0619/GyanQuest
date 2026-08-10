from pathlib import Path
import re, json

root = Path(r"c:\Users\Tahsan\Downloads\ImpactX")
books = list((root / "games").glob("*/books/level*.js"))
missing = []
ok = 0
for b in books:
    txt = b.read_text(encoding="utf-8")
    # only quoted paths ending with image extension
    for src in re.findall(r'"(/games/[^"]+/assets/book/[^"]+\.(?:jpg|jpeg|png|webp|gif))"', txt):
        p = root / src.lstrip("/")
        if p.exists() and p.stat().st_size > 1000:
            ok += 1
        else:
            missing.append(src)

print("books", len(books))
print("image refs ok", ok)
print("image refs missing", len(missing))
for m in missing[:15]:
    print(" ", m)

# spot-check ai-lab book parses
sample = (root / "games" / "ai-lab" / "books" / "level1.js").read_text(encoding="utf-8")
# extract JSON object after export const BOOK =
m = re.search(r"export const BOOK = (\{[\s\S]*\});\s*\n\s*export default", sample)
assert m, "parse fail"
book = json.loads(m.group(1))
print("ai pages", len(book["pages"]), "theories", book.get("theories"))
print("cover", book["cover"]["art"])
print("cover exists", (root / book["cover"]["art"].lstrip("/")).exists())
