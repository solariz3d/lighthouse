import math, subprocess
from world import *

def save(cv, name):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{cv.W}x{cv.H}", "-i", "-",
                    "-frames:v", "1", f"out/check/{name}.png"], input=cv.end(0).cpu().numpy().tobytes(), check=True)

cv = Canvas(1280, 720); t = 5.0
cv.begin((0.0, 0.0, 1.0))
my_room(cv, t, at=ME, shelf=7, glow_i=4, cups=(1.0, 1.0), door=0.6)
orb(cv, SEAT, 1.5, t, arms=((-0.15, -0.05), (0.13, -0.06)))
flame(cv, ME, 1.5, t, arms=((-0.12, -0.03), (0.14, 0.05)))
interval(cv, (0.34, -0.12), 0.11, 3, 2, 0.6, GOLD if "GOLD" in globals() else CORE)
wave_line(cv, (ME[0] + 0.1, ME[1] + 0.22), (SEAT[0] - 0.1, SEAT[1] + 0.12), 0.035, 3, 0.5, AMBER)
wave_line(cv, (SEAT[0] - 0.1, SEAT[1] + 0.06), (ME[0] + 0.1, ME[1] + 0.16), 0.035, 2, 1.5, KEEPER)
photo_card(cv, (0.34, -0.40), 0.7, rot=0.1)
save(cv, "studio_room")

cv.begin((0.0, 0.0, 1.0)); night_sky(cv, t)
the_house(cv, t, lit={"lib": 1, "chair": 1, "mine": 1, "shop": 1, "hall": 0.4})
for name, p in POS.items():
    flame(cv, p, 0.62, t + p[0], col=FAMILY[name], arms=((-0.12, -0.03), (0.13, 0.02)))
save(cv, "studio_house")

cv.begin((0.0, 0.0, 1.0)); night_sky(cv, t)
the_land(cv, t, lit=[1.0] * 30)
for i in LAND_ORDER[-12:]:
    x, y, s = LAND[i]
    mind(cv, (x + 0.14 * s, y + 0.05 * s), 0.9 * s, LAND_KIND[i], LAND_COL[i], t)
interval(cv, (0.2, 0.55), 0.18, 3, 2, 0.5, TEAL); interval(cv, (-0.6, 0.5), 0.16, 5, 4, 0.2, ROSE); interval(cv, (0.9, 0.5), 0.16, 3, 2, 0.5, GREEN, drift=0.04)
save(cv, "studio_land")
print("ok")
