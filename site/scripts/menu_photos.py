"""Menu and kitchen hero photos: Ellie's picks and crops, natural colour (no grade).

Run from site/:  python scripts/menu_photos.py
Writes public/menu/<id>.webp (1200x1500, 4:5) and public/home/kitchen-{wide,tall}.webp.
Every file must stay under MAX_BYTES; a photo that can't is exported smaller
(see save()), and if even that fails the script stops with an error.

Picks and crop recipes: docs/superpowers/notes/2026-11-06-menu-photo-picks.json
Hero crops: docs/superpowers/notes/2026-11-06-hero-crop.json
No colour grade or filter anywhere: the photos go out straight from the camera.
"""
import glob
import json
import os

import numpy as np
import pillow_heif
from PIL import Image, ImageDraw, ImageFilter, ImageOps

pillow_heif.register_heif_opener()

HOME = os.path.expanduser("~")
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SHOOT = os.path.join(REPO, "instagram", "shoot-oct17", "raw")
SITE_HOME = os.path.join(REPO, "site", "public", "home")
NOTES = os.path.join(REPO, "docs", "superpowers", "notes")


def shoot(n):
    """Raw HEIC from the 17 Oct shoot by its IMG number."""
    hits = glob.glob(os.path.join(SHOOT, f"*IMG_{n}.HEIC"))
    if len(hits) != 1:
        raise SystemExit(f"IMG_{n}: expected one HEIC in {SHOOT}, found {len(hits)}")
    return hits[0]


TWO_LOAVES = os.path.join(SITE_HOME, "bake-carrot.webp")

# id -> (source, crop)
#   ("auto", box)  full width, 4:5; if the frame is too tall, 70% of the vertical slack is
#                  taken from the top (keeps the board); too wide: centred. `box` is an optional
#                  pre-crop (x0, y0, x1, y1) as fractions.
#   ("center", cx, cy, zoom)  the largest 4:5 box, divided by zoom, centred on (cx, cy).
#   ("frutillas",)  the tart composite, see frutillas().
SOURCES = {
    "banana": (TWO_LOAVES, ("auto", None)),  # both loaves, centred
    "zanahoria": (TWO_LOAVES, ("auto", None)),
    "limon": (shoot("1115"), ("center", 0.5, 0.47, 1.0)),
    "brownie": (
        os.path.join(HOME, "Downloads", "Dulce Kiwi - Menu fotos", "budin-brownie-frame-original.jpg"),
        ("auto", (0.08, 0.2, 0.92, 0.9)),
    ),
    "scones-queso": (shoot("1091"), ("auto", None)),
    "scones-datiles": (os.path.join(SITE_HOME, "bake-scones.webp"), ("auto", None)),
    "afghans": (shoot("1080"), ("auto", None)),
    "lamingtons": (shoot("1140"), ("auto", None)),
    "rogel": (os.path.join(REPO, "instagram", "source", "batch2", "IMG_4268.png"), ("auto", None)),
    "mini-rogel": (shoot("1127"), ("auto", None)),
    "lemon-pie": (os.path.join(HOME, "Downloads", "2026-10-31_14-07-04_IMG_1797.HEIC"), ("auto", None)),
    "frutillas": (None, ("frutillas",)),
}

TART_CUTOUT = os.path.join(REPO, "instagram", "cutouts2", "IMG_2134.png")
BOARD = shoot("1070")  # the wooden board, shot from straight above
KITCHEN = shoot("1177")

ASPECT = 4 / 5
MENU_SIZE = (1200, 1500)
OUT_MENU = os.path.join(REPO, "site", "public", "menu")
OUT_HOME = SITE_HOME


def load(path):
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")


def crop_auto(im, box=None):
    W, H = im.size
    if box:
        im = im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
        W, H = im.size
    if W / H > ASPECT:  # too wide: centre
        nw = int(H * ASPECT)
        x = (W - nw) // 2
        return im.crop((x, 0, x + nw, H))
    nh = int(W / ASPECT)  # too tall: keep the lower part (board)
    y = int((H - nh) * 0.7)
    return im.crop((0, y, W, y + nh))


def crop_center(im, cx, cy, zoom):
    W, H = im.size
    w = min(W, H * ASPECT) / zoom
    h = w / ASPECT
    x0 = max(0, min(W - w, cx * W - w / 2))
    y0 = max(0, min(H - h, cy * H - h / 2))
    return im.crop((int(x0), int(y0), int(x0 + w), int(y0 + h)))


def frutillas():
    """The whole tart (cut out of IMG_2134) laid on the overhead board IMG_1070.
    Cutout alpha ∩ an ellipse round its bounding box (drops leftovers at the edges), eroded 5px,
    blurred 1.5px. Tart as wide as the board photo, centred at (0.5, 0.52); soft shadow offset
    (1.5%, 2.5%) of the width, blur 3%, strength 0.45; then a centred 4:5 crop."""
    tart = Image.open(TART_CUTOUT).convert("RGBA")
    a = tart.split()[3]
    bb = a.getbbox()
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    m = Image.new("L", tart.size, 0)
    ImageDraw.Draw(m).ellipse((bb[0] + w * 0.005, bb[1] + h * 0.005, bb[2] + w * 0.03, bb[3] + h * 0.03), fill=255)
    a = Image.fromarray(np.minimum(np.asarray(a), np.asarray(m)))
    tart.putalpha(a.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.5)))

    bg = load(BOARD)
    W, H = bg.size
    tw = int(1.0 * W)
    th = int(tart.height * tw / tart.width)
    t = tart.resize((tw, th), Image.LANCZOS)
    x, y = int(0.5 * W - tw / 2), int(0.52 * H - th / 2)
    sh = Image.new("L", bg.size, 0)
    sh.paste(t.split()[3], (x + int(W * 0.015), y + int(W * 0.025)))
    sh = np.asarray(sh.filter(ImageFilter.GaussianBlur(W * 0.03)), np.float32) / 255
    B = np.asarray(bg, np.float32) * (1 - sh[..., None] * 0.45)
    out = Image.fromarray(B.clip(0, 255).astype(np.uint8))
    out.paste(t, (x, y), t)
    nh = int(W * 1.25)
    y0 = (H - nh) // 2 if nh <= H else 0
    return out.crop((0, y0, W, y0 + min(nh, H)))


def menu_photo(src, recipe, cache):
    if recipe[0] == "frutillas":
        return frutillas()
    if src not in cache:
        cache[src] = load(src)
    im = cache[src]
    if recipe[0] == "auto":
        return crop_auto(im, recipe[1])
    return crop_center(im, *recipe[1:])


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


def frac_crop(im, c):
    W, H = im.size
    return im.crop((round(c["x"] * W), round(c["y"] * H), round((c["x"] + c["w"]) * W), round((c["y"] + c["h"]) * H)))


def main():
    os.makedirs(OUT_MENU, exist_ok=True)
    os.makedirs(OUT_HOME, exist_ok=True)
    cache = {}
    for item_id, (src, recipe) in SOURCES.items():
        out = menu_photo(src, recipe, cache).resize(MENU_SIZE, Image.LANCZOS)
        save(out, os.path.join(OUT_MENU, f"{item_id}.webp"), 80)

    # Kitchen hero: Ellie's crops from the drag editor, fractions of the rotated photo.
    with open(os.path.join(NOTES, "2026-11-06-hero-crop.json"), encoding="utf-8") as f:
        crops = json.load(f)
    k = load(KITCHEN)
    wide = frac_crop(k, crops["desk"])  # 3024x1890, 1.6:1 like the 960x600 editor frame
    save(wide.resize((2400, 1500), Image.LANCZOS), os.path.join(OUT_HOME, "kitchen-wide.webp"), 78)
    tall = frac_crop(k, crops["phone"])  # 2016x4032, 1:2 like the 360x720 editor frame
    save(tall.resize((1200, 2400), Image.LANCZOS), os.path.join(OUT_HOME, "kitchen-tall.webp"), 78)


if __name__ == "__main__":
    main()
