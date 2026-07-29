"""
make_icon.py -- draw the Consonance mark at every size it is actually displayed at.

THE BUG THIS FIXES, found 2026-07-29 by the keeper noticing the desktop icon looked wrong.
`icon.ico` contained exactly ONE image: 256x256. So every small size Windows needs -- 16 for
the tree view, 20 and 24 for the taskbar, 32 for the desktop, 48 for alt-tab -- was produced by
downscaling that single 256 on the fly with a generic filter.

The mark is ~10 thin concentric rings across 256 px, so the rings sit about 12 px apart. At 32
px that spacing is 1.5 px. At 16 px it is 0.75 px. Below one pixel a ring cannot be represented
at all, and a resampler does not drop it -- it ALIASES, and the ring spacing beats against the
pixel grid to produce circles that are not in the artwork. Concentric rings are close to the
worst case a downscaler can be handed; it is the same reason a striped shirt strobes on camera.

THE FIX IS NOT A BETTER FILTER. No resampling kernel can put ten rings into sixteen pixels;
the information is not there. The mark has to be REDRAWN at each size with a ring count that
fits it. That is ordinary icon craft -- an icon is a family of drawings, not one drawing scaled
-- and it is why hand-made .ico files carry a separate image per size.

So: rings are drawn natively at each size, at 4x supersampling, and the ring COUNT drops as the
canvas shrinks. Ring spacing is held at or above ~3 px in the final image, which keeps every
ring above the pixel grid's ability to represent it. The result is that the small icon reads as
"fewer, cleaner rings" instead of "ten rings and an interference pattern".

Colours are sampled from the existing icon.png rather than invented, so this reproduces the
mark that exists instead of redesigning it.

    py consonance/src-tauri/icons/make_icon.py            # write icon.ico + the pngs
    py consonance/src-tauri/icons/make_icon.py --check    # report only, change nothing
"""
import sys, pathlib
from PIL import Image, ImageDraw

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "icon.png"

# Every size Windows actually asks for, plus the two Tauri lists separately.
SIZES = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256]

SS = 4                    # supersample factor -- draw big, reduce once, cleanly
MIN_RING_GAP_PX = 3.0     # final-image spacing below which a ring cannot survive the grid
MAX_RINGS = 10            # the mark's full ring count, used at 256


def palette():
    """Sample the existing mark so this reproduces it rather than redesigning it."""
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    bg = im.getpixel((2, 2))[:3]
    # The ring colour, sampled along the horizontal centre line -- but SKIPPING the middle,
    # because the mark has a white dot at its centre and a naive brightest-pixel scan returns
    # that instead of the teal. First run of this function did exactly that and reported
    # ring=(225,255,250), which is the dot. Caught by reading the output rather than trusting it.
    cy = h // 2
    guard = w * 0.12                                   # radius around centre to ignore
    best, ring = -1, (0, 200, 190)
    for x in range(w):
        if abs(x - w / 2) < guard:
            continue
        r, g, b, a = im.getpixel((x, cy))
        # most SATURATED, not brightest: the rings are chromatic, the dot is not
        sat = max(r, g, b) - min(r, g, b)
        if a and sat > best and (r + g + b) > sum(bg) + 20:
            best, ring = sat, (r, g, b)
    return bg, ring


def rings_for(size):
    """How many rings fit at this size without any two closing to under MIN_RING_GAP_PX.

    This is the whole fix in one function: the count is derived from the canvas, not inherited
    from the 256 and then squeezed.
    """
    usable = size / 2 * 0.92                      # outer radius, leaving a margin
    n = int(usable // MIN_RING_GAP_PX)
    return max(2, min(MAX_RINGS, n))


def draw(size, bg, ring):
    S = size * SS
    im = Image.new("RGBA", (S, S), bg + (255,))
    d = ImageDraw.Draw(im)
    n = rings_for(size)
    outer = S / 2 * 0.92
    # line weight scales with the canvas but never below one final pixel, or the ring vanishes
    w = max(SS, int(round(S / 256 * 2)))
    for i in range(1, n + 1):
        r = outer * i / n
        # the mark brightens toward the centre; reproduce that falloff
        t = 1.0 - (i - 1) / max(1, n - 1)
        c = tuple(int(bg[k] + (ring[k] - bg[k]) * (0.45 + 0.55 * t)) for k in range(3))
        d.ellipse([S / 2 - r, S / 2 - r, S / 2 + r, S / 2 + r], outline=c + (255,), width=w)
    # the centre dot: present at every size, since it is what makes the mark read as a source
    dot = max(SS * 0.9, S * 0.018)
    d.ellipse([S / 2 - dot, S / 2 - dot, S / 2 + dot, S / 2 + dot], fill=(235, 245, 245, 255))
    return im.resize((size, size), Image.LANCZOS)


def main():
    """Use the ORIGINAL artwork wherever it can render, and redraw only where it cannot.

    The first version of this script redrew every size including 256 and overwrote icon.png
    with the result. Putting the two side by side settled it: the original has luminous
    falloff -- rings brightening toward the centre, varied weight, a faint glow -- and the
    redraw is flat and mechanical. It is a DIAGRAM of the mark, not the mark. Replacing hand
    artwork with a generator's approximation is a downgrade even when the geometry is right,
    and the moiré bug never justified touching the sizes that were rendering correctly.

    So the rule is narrow: above the aliasing threshold, downscale the real artwork with a
    proper filter. Below it -- where ten rings physically cannot occupy the pixels and no
    filter can save them -- draw a simplified mark with a ring count that fits. The redraw
    earns its place only where the alternative is interference.
    """
    check = "--check" in sys.argv
    bg, ring = palette()
    src = Image.open(SRC).convert("RGBA")
    native = min(s for s in SIZES if rings_for(s) >= MAX_RINGS)
    print(f"mark sampled from {SRC.name}: bg={bg} ring={ring}")
    print(f"original artwork used at >= {native}px; redrawn below that\n")
    print(f"{'size':>5}  {'rings':>5}  {'gap px':>7}  source")

    imgs = []
    for s in SIZES:
        n = rings_for(s)
        gap = (s / 2 * 0.92) / n
        if s >= native:
            im, how = src.resize((s, s), Image.LANCZOS), "original (lanczos)"
        else:
            im, how = draw(s, bg, ring), f"redrawn, {n} rings"
        print(f"{s:>5}  {n:>5}  {gap:>7.2f}  {how}")
        imgs.append(im)

    if check:
        print("\n--check: nothing written.")
        return 0
    ico = HERE / "icon.ico"
    imgs[-1].save(ico, format="ICO", sizes=[(s, s) for s in SIZES], append_images=imgs[:-1])
    for s, im in zip(SIZES, imgs):
        if s in (32, 128):
            im.save(HERE / f"{s}x{s}.png")
    # icon.png is the ARTWORK and is never written by this script.
    print(f"\nwrote {ico.name} ({len(SIZES)} sizes) + 32x32.png, 128x128.png. icon.png untouched.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
