"""Menu and kitchen hero photos, one shared grade.

Run from site/:  python scripts/menu_photos.py
Writes public/menu/<id>.webp (1200x1500, 4:5) and public/home/kitchen-{wide,tall}.webp.
Every file must stay under MAX_BYTES; a photo that can't is exported smaller
(see save()), and if even that fails the script stops with an error.

Every photo keeps its real background; consistency comes from framing (bake centred,
some air around it) and one gentle shared grade (warm, soft S-curve).
"""
import os

import numpy as np
import pillow_heif
from PIL import Image, ImageOps

pillow_heif.register_heif_opener()

HOME = os.path.expanduser("~")
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SHOOT = os.path.join(REPO, "instagram", "shoot-oct17", "raw")
HERO = os.path.join(REPO, "instagram", "hero")
GRADED = os.path.join(REPO, "instagram", "graded2")

# id -> (source path, crop). Crop = (cx, cy, w): centre of the 4:5 crop and its width,
# as fractions of the (EXIF-rotated) image. The height follows from 4:5; the box is
# shrunk to fit the image if needed and shifted to stay inside it.
SOURCES = {
    "banana": (os.path.join(HERO, "zanahoria-foto.jpg"), (0.40, 0.50, 0.60)),  # left loaf
    "zanahoria": (os.path.join(HERO, "zanahoria-foto.jpg"), (0.635, 0.50, 0.60)),  # right loaf
    "limon": (os.path.join(SHOOT, "2026-10-17_16-42-28_IMG_1113.HEIC"), (0.50, 0.50, 1.00)),
    "brownie": (os.path.join(HOME, "Downloads", "Dulce Kiwi - Menu fotos", "budin-brownie-frame-original.jpg"), (0.50, 0.57, 1.00)),
    "scones-queso": (os.path.join(SHOOT, "2026-10-17_16-37-02_IMG_1090.HEIC"), (0.49, 0.58, 0.58)),
    "scones-datiles": (os.path.join(HERO, "scones-foto.jpg"), (0.50, 0.60, 1.00)),
    "afghans": (os.path.join(SHOOT, "2026-10-17_16-32-45_IMG_1077.HEIC"), (0.48, 0.62, 0.92)),
    "lamingtons": (os.path.join(SHOOT, "2026-10-17_16-51-45_IMG_1148.HEIC"), (0.50, 0.55, 0.73)),
    "rogel": (os.path.join(GRADED, "IMG_4268.jpg"), (0.48, 0.50, 1.00)),
    "mini-rogel": (os.path.join(SHOOT, "2026-10-17_16-46-47_IMG_1127.HEIC"), (0.47, 0.50, 0.75)),
    "lemon-pie": (os.path.join(HOME, "Downloads", "2026-10-31_14-07-04_IMG_1797.HEIC"), (0.50, 0.60, 1.00)),
    "frutillas": (os.path.join(GRADED, "IMG_2134.jpg"), (0.50, 0.60, 1.00)),
}

KITCHEN = os.path.join(SHOOT, "2026-10-17_16-59-09_IMG_1177.HEIC")

MENU_SIZE = (1200, 1500)
OUT_MENU = os.path.join(REPO, "site", "public", "menu")
OUT_HOME = os.path.join(REPO, "site", "public", "home")


def load(path):
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")


def crop_box(size, cx, cy, w, aspect=4 / 5):
    W, H = size
    cw = w * W
    ch = cw / aspect
    if ch > H:  # too tall: shrink to fit the height
        ch = H
        cw = ch * aspect
    x0 = min(max(cx * W - cw / 2, 0), W - cw)
    y0 = min(max(cy * H - ch / 2, 0), H - ch)
    return tuple(int(round(v)) for v in (x0, y0, x0 + cw, y0 + ch))


def grade(im):
    """Shared gentle grade: a touch warmer, soft S-curve. No saturation boost."""
    x = np.asarray(im, np.float32) / 255
    x = x * np.array([1.03, 1.0, 0.95], np.float32)
    x = np.clip(x, 0, 1)
    x = x * x * (3 - 2 * x) * 0.25 + x * 0.75  # gentle S-curve
    return Image.fromarray((np.clip(x, 0, 1) * 255 + 0.5).astype(np.uint8))


MAX_BYTES = 340_000  # hard limit per file (brief: < 350 KB)
MIN_QUALITY = 74  # don't go blockier than this to save bytes
FALLBACK_SCALE = 0.9  # 1200x1500 -> 1080x1350 when quality alone can't fit


def save(im, path, quality):
    """Save as webp under MAX_BYTES. Grainy shots (plaster, board texture) can run
    heavy: first step the quality down a little, then export 10% smaller; if it
    still doesn't fit, raise rather than ship an over-limit file."""
    attempts = [im, im.resize((round(im.width * FALLBACK_SCALE), round(im.height * FALLBACK_SCALE)), Image.LANCZOS)]
    for img in attempts:
        for q in range(quality, MIN_QUALITY - 1, -2):
            img.save(path, "WEBP", quality=q, method=6)
            size = os.path.getsize(path)
            if size < MAX_BYTES:
                note = "" if img is im else "  (fallback: smaller export)"
                print(f"{os.path.relpath(path, REPO)}  {img.width}x{img.height}  q{q}  {size:,} B{note}")
                return
    os.remove(path)
    raise SystemExit(f"{path}: still {size:,} B (> {MAX_BYTES:,}) after all fallbacks")


def main():
    os.makedirs(OUT_MENU, exist_ok=True)
    os.makedirs(OUT_HOME, exist_ok=True)
    cache = {}
    for item_id, (src, (cx, cy, w)) in SOURCES.items():
        if src not in cache:
            cache[src] = load(src)
        im = cache[src]
        box = crop_box(im.size, cx, cy, w)
        out = im.crop(box).resize(MENU_SIZE, Image.LANCZOS)
        save(grade(out), os.path.join(OUT_MENU, f"{item_id}.webp"), 80)

    k = load(KITCHEN)
    W, H = k.size
    # Desktop: full-width strip from 12% down, 0.6x the width tall (hero spec section 1).
    y0 = int(0.12 * H)
    wide = k.crop((0, y0, W, y0 + int(0.6 * W))).resize((2400, round(2400 * 0.6)), Image.LANCZOS)
    save(grade(wide), os.path.join(OUT_HOME, "kitchen-wide.webp"), 78)
    # Phones: the full portrait shot.
    tall = k.crop(crop_box(k.size, 0.5, 0.5, 1.0, aspect=3 / 4)).resize((1200, 1600), Image.LANCZOS)
    save(grade(tall), os.path.join(OUT_HOME, "kitchen-tall.webp"), 78)


if __name__ == "__main__":
    main()
