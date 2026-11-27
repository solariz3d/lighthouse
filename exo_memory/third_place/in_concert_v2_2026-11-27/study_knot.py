"""study_knot.py: a study for the second version's c02, not a chapter. It tests one question on a sheet: can someone
who has never seen the film read what the knot is?

  python study_knot.py            out/check/study_knot.png: seven moments, 4 across
  python study_knot.py strip      out/check/study_knot_draw.png: the knot being drawn, every sixth frame

The idea, as the engine already states it (cast2.interval): one note moves a point from side to side, the other moves
it up and down, and the point draws the figure. So each voice gets a slider on a rail, and the point sits where the two
sliders cross.

  2 to 6      his voice alone: his slider swings; the point only goes side to side: a line
  6 to 10     mine alone: my slider swings; the point only goes up and down: a line
  10 to 18    both: the point is moved both ways at once and draws a knot (he swings three times while I swing twice)
  18 to 22    I change my note: another figure (5:4)
  22 to 26    a note too near his: it will not close; it crawls
  26 to 30    I copy his note: one slanted line; the knot is gone
"""
import sys

import again
from world import *
from ch.c01_turns import S, GOLD, light

C = (0.32, 0.04)                           # the middle of the figure, over the table
R = 0.17
RAIL_Y = C[1] - R - 0.055                  # his rail, under the figure
RAIL_X = C[0] - R - 0.055                  # my rail, to its left
MA = (ME[0] + 0.12, ME[1] + 0.20)          # my voice leaves from here
HA = (SEAT[0] - 0.15, SEAT[1] + 0.02)      # his from here
LOOP = 4.0                                 # seconds for the point to go once round a figure


def figure(cv, t, a, b, t0, col, his=1.0, mine=1.0, drift=0.0, same=False, k=1.0):
    """The point, its trail since t0, the two sliders on their rails and the guide lines to the point."""
    def at(tt):
        u = (tt - t0) / LOOP
        x = math.sin(a * u * 2 * math.pi) * his
        y = (math.sin(a * u * 2 * math.pi) if same else math.sin(b * (1.0 + drift) * u * 2 * math.pi)) * mine
        return (C[0] + R * x, C[1] + R * y)
    span = LOOP * (1.0 if drift == 0 else 2.2)
    n = int(max(2, min(260, (min(t - t0, span)) * 60)))
    ta = max(t0, t - span)
    pts = [at(ta + (t - ta) * i / n) for i in range(n + 1)]
    p = at(t)
    ink, rail = (0.33, 0.24, 0.20), (0.45, 0.36, 0.30)
    cv.stroke(cv.seg((C[0] - R, RAIL_Y), (C[0] + R, RAIL_Y)), 0.006, rail, 0.8 * k * (0.35 + 0.65 * his))
    cv.stroke(cv.seg((RAIL_X, C[1] - R), (RAIL_X, C[1] + R)), 0.006, rail, 0.8 * k * (0.35 + 0.65 * mine))
    if his > 0.02:
        cv.stroke(cv.seg((p[0], RAIL_Y), p), 0.0028, KEEPER, 0.45 * k * his)
        cv.fill(cv.circle((p[0], RAIL_Y), 0.017), KEEPER, k)
        cv.glow(cv.circle((p[0], RAIL_Y), 0.017), KEEPER, 0.03, 0.5 * k)
    if mine > 0.02:
        cv.stroke(cv.seg((RAIL_X, p[1]), p), 0.0028, AMBER, 0.45 * k * mine)
        cv.fill(cv.circle((RAIL_X, p[1]), 0.017), AMBER, k)
        cv.glow(cv.circle((RAIL_X, p[1]), 0.017), AMBER, 0.03, 0.5 * k)
    d = cv.path(pts)
    cv.stroke(d, 0.011, ink, 0.55 * k)
    cv.stroke(d, 0.006, mix(col, (1, 1, 1), 0.35), 0.95 * k)
    cv.glow(d, col, 0.018, 0.55 * k)
    cv.fill(cv.circle(p, 0.013), (1.0, 0.98, 0.9), k)
    cv.glow(cv.circle(p, 0.013), col, 0.035, 0.9 * k)


def s_study(cv, t):
    cv.begin((0.30, -0.16, 1.75))
    my_room(cv, t, at=ME, shelf=6, cups=(1.0, 1.0))
    his_on = 1.0 if (2.0 <= t < 6.0 or t >= 10.0) else 0.0
    mine_on = 1.0 if t >= 6.0 else 0.0
    # the two voices: a wave from each of us to the end of our own rail
    if his_on:
        wave_line(cv, HA, (C[0] + R + 0.02, RAIL_Y), 0.022, 3.0, -t * 7.0, KEEPER, 0.9, w=0.006, taper=False)
    if mine_on:
        f_me = 2.0 if t < 18.0 else 2.4 if t < 22.0 else 2.9 if t < 26.0 else 3.0
        wave_line(cv, MA, (RAIL_X, C[1] - R - 0.02), 0.022, f_me, -t * (7.0 if t >= 26.0 else 4.7), KEEPER if t >= 26.0 else AMBER,
                  0.9, w=0.006, taper=False)
    if t < 6.0:
        figure(cv, t, 3, 2, 2.0, KEEPER, his=1.0, mine=0.0)
    elif t < 10.0:
        figure(cv, t, 3, 2, 6.0, AMBER, his=0.0, mine=1.0)
    elif t < 18.0:
        figure(cv, t, 3, 2, 10.0, GOLD)
    elif t < 22.0:
        figure(cv, t, 5, 4, 18.0, GOLD)
    elif t < 26.0:
        figure(cv, t, 3, 2.9 / 1.0 * 1.0, 22.0, (0.85, 0.45, 0.35), drift=0.012)
    else:
        figure(cv, t, 3, 3, 26.0, KEEPER, same=True)
    m_me = mood(t, [(0.0, "open", None, "smile"), (6.1, "wide", None, "o"), (12.5, "spark", "!", "grin"), (18.2, "happy", None, "grin"),
                    (22.4, "open", "?", "flat"), (26.2, "happy", None, "grin"), (28.2, "open", "?", "flat")])
    m_k = mood(t, [(0.0, "happy", None, "smile"), (12.6, "wide", None, "o"), (14.0, "happy", None, "smile"), (22.5, "open", None, "flat"),
                   (28.0, "open", "?", "flat")])
    light(cv, t, (ME[0], ME[1] + bob(t) * S), S, (1.0, 0.5), sway(t, ((-0.12, -0.03), (0.13, 0.06))), m_me)
    orb(cv, (SEAT[0], SEAT[1] + bob(t, 1.3) * 0.6 * S), S, t, look=(-0.9, 0.45), arms=sway(t * 0.7, ((-0.15, 0.02), (0.13, -0.06))), **m_k)


if __name__ == "__main__":
    again.SCENES[:] = [(0.0, s_study)]
    again.XFADE.clear()
    OUT.mkdir(exist_ok=True)
    if len(sys.argv) > 1 and sys.argv[1] == "strip":
        again.grid([10.0 + i * 0.25 for i in range(24)], "study_knot_draw", 6, 400)
    else:
        again.grid([4.4, 8.4, 11.2, 12.6, 16.5, 21.5, 25.6, 29.4], "study_knot", 4, 640)
