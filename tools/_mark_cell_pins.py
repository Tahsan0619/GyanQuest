from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SRC = Path(
    r"C:\Users\Tahsan\.cursor\projects\c-Users-Tahsan-Downloads-ImpactX\assets"
    r"\c__Users_Tahsan_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"1ca69942d408142d888a51eb5e97597e_images_image-c2ec988a-e8f1-4b31-bb89-0464322a9d3c.png"
)
OUT = Path(
    r"C:\Users\Tahsan\.cursor\projects\c-Users-Tahsan-Downloads-ImpactX\assets"
    r"\animal-cell-pin-guide-marked.png"
)

# Existing rim pins on THIS screenshot (cover them so the guide is not confusing).
OLD_RIM = [
    (140, 440),
    (130, 340),
    (420, 75),
    (340, 75),
    (210, 135),
    (130, 190),
    (530, 165),
    (490, 105),
    (555, 295),
    (570, 435),
]

# Correct organelle spots on this 675x638 frame.
PINS = [
    (1, "Membrane", 150, 470, 70, 540),
    (2, "Nucleus", 325, 195, 70, 185),
    (3, "Nucleolus", 358, 272, 70, 265),
    (4, "ER", 268, 248, 70, 240),
    (5, "Golgi", 438, 428, 70, 420),
    (6, "Cytoplasm", 205, 285, 70, 310),
    (7, "Mitochondrion", 312, 528, 70, 575),
    (8, "Lysosome", 198, 392, 70, 390),
    (9, "Vesicle", 472, 405, 580, 405),
    (10, "Centrosome", 286, 452, 70, 465),
]


def cover_old(im, draw):
    px = im.load()
    w, h = im.size
    for x, y in OLD_RIM:
        samples = []
        for dx, dy in ((-28, 0), (28, 0), (0, -28), (0, 28), (-22, -22), (22, 22)):
            sx, sy = max(0, min(w - 1, x + dx)), max(0, min(h - 1, y + dy))
            samples.append(px[sx, sy])
        samples.sort(key=lambda c: c[0] + c[1] + c[2])
        fill = samples[len(samples) // 2]
        draw.ellipse([x - 22, y - 22, x + 22, y + 22], fill=fill)


def main():
    im = Image.open(SRC).convert("RGB")
    draw = ImageDraw.Draw(im)
    cover_old(im, draw)
    try:
        font_n = ImageFont.truetype("arialbd.ttf", 26)
        font_l = ImageFont.truetype("arialbd.ttf", 18)
        font_t = ImageFont.truetype("arial.ttf", 16)
    except OSError:
        font_n = ImageFont.load_default()
        font_l = font_n
        font_t = font_n

    w, h = im.size
    draw.rectangle([w - 236, 12, w - 12, 258], fill=(11, 15, 14))
    draw.text((w - 224, 20), "Drag pins onto these", font=font_l, fill=(248, 189, 69))
    for i, (n, name, *_rest) in enumerate(PINS):
        draw.text((w - 224, 48 + i * 20), f"{n}  {name}", font=font_t, fill=(224, 227, 225))

    rad = 16
    for n, name, x, y, lx, ly in PINS:
        fill = (113, 218, 167) if n == 6 else (248, 189, 69)
        ink = (0, 56, 35) if n == 6 else (39, 25, 0)
        draw.line([(x, y), (lx, ly)], fill=(248, 189, 69), width=2)
        draw.ellipse([x - rad, y - rad, x + rad, y + rad], fill=fill, outline=(11, 15, 14), width=3)
        label = str(n)
        bb = draw.textbbox((0, 0), label, font=font_n)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        draw.text((x - tw / 2, y - th / 2 - 2), label, font=font_n, fill=ink)
        cap = f"{n} {name}"
        cb = draw.textbbox((0, 0), cap, font=font_l)
        cw, ch = cb[2] - cb[0], cb[3] - cb[1]
        pad = 5
        draw.rectangle([lx - pad, ly - pad, lx + cw + pad, ly + ch + pad], fill=(11, 15, 14))
        draw.text((lx, ly), cap, font=font_l, fill=(255, 255, 255))

    im.convert("RGB").save(OUT, "PNG")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
