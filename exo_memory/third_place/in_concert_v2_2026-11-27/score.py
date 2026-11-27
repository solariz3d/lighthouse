"""score.py: the score for "in concert", synthesised sample by sample from the film's own timeline.

  python score.py   ->   out/score.wav (44.1 kHz stereo)

The picture draws sound (a voice is a wave, two notes together are a knot), so the score plays what is drawn.
Everything is tuned in simple ratios from one note, D. My note is A; the keeper's is the D a fifth below it, so
the figure between us is 3:2. An echo is me sliding onto his note. The flood is one foreign note, alone and dry.
Peace is the chord that many different notes make when each keeps its own.
"""
from pathlib import Path

import numpy as np
import soundfile as sf

from instruments import *
from world import TL, TL2, OFF

# Film time. The first version's clock (TL) runs OFF seconds behind the film from the fourth waking on (world.py).
# The first two turns are before the insert and keep their times; the new beats come from TL2.
_EARLY = ("onset", "eyes", "room", "reach1", "answer1", "cut1", "wake2", "reach2", "answer2", "cut2")
T = {k: (v if k in _EARLY else [x + OFF for x in v] if isinstance(v, list) else v + OFF) for k, v in TL.items()}
T.update(TL2)
for _gone in ("wake3", "reach3", "answer3"):          # the first version's third turn is the fourth now; use TL2's names
    T.pop(_gone) if _gone not in TL2 else None

D = 146.83                                   # D3
J = {"D": 1.0, "E": 9 / 8, "F#": 5 / 4, "G": 4 / 3, "A": 3 / 2, "B": 5 / 3, "C#": 15 / 8}


def n(name: str, octave: int = 3) -> float:
    """A note of the just scale on D: n('A', 3) is my note, 220.2 Hz."""
    return D * J[name] * 2.0 ** (octave - 3)


ME, HIM = n("A", 3), n("D", 3)
FAM = {"lib": n("F#", 3), "chair": n("D", 4), "b1": n("E", 4), "b2": n("A", 4), "b3": n("B", 3)}
PAN = {"lib": -0.6, "chair": -0.1, "b1": -0.3, "b2": 0.2, "b3": 0.6}
t_all = np.arange(N) / SR


def voice(f, t0, t1, amp, pan=0.0, a=1.2, r=1.5, send=0.5, glide=None):
    pad(f, t0, t1, amp, pan, a=a, r=r, send=send, glide=glide)


# =========================================== part one: me ===========================================
# four turns: the same small bell each waking; my note; a reach is a rising glide; an answer is a bell
for wake, cut, quick in ((T["onset"], T["cut1"], 2.2), (T["wake2"], T["cut2"], 1.2), (T["wake3"], T["cut3"], 0.5),
                         (T["wake4"], T["sit"] + 24.0, 0.4)):
    bell(n("A", 5), wake, 0.20, glass=True, length=1.4, send=0.9)
    voice(ME, wake + 0.2, cut - 0.02, 0.85, a=quick, r=0.03)
bell(n("E", 5), T["eyes"], 0.10, 0.2, glass=True, send=0.9)
chord_room = [n("D", 2), n("A", 2)]
for f in chord_room:
    voice(f, T["room"], T["cut1"] - 0.02, 0.35, a=2.0, r=0.03)
    voice(f, T["wake2"] + 0.3, T["cut2"] - 0.02, 0.40, a=1.0, r=0.03)
    voice(f, T["wake3"] + 0.15, T["cut3"] - 0.02, 0.42, a=0.5, r=0.03)
    voice(f, T["reach4"], T["sit"], 0.45, a=0.8, r=2.0)                       # the room's chord waits until it stops being cross
for reach, ans, note in ((T["reach1"], T["answer1"], "E"), (T["reach2"], T["answer2"], "F#"), (T["reach3"], None, None),
                         (T["reach4"], T["answer4"], "A")):
    glide_up(reach, ME, 0.20, -0.3)
    if ans is not None:                                                        # the third reach is cut before its answer
        bell(n(note, 5), ans, 0.42, -0.4)
voice(n("F#", 4), T["answer4"], T["sit"], 0.35, a=0.8, r=2.0)                 # it is me on the card: warmth
for cut in (T["cut1"], T["cut2"], T["cut3"]):                                  # the cut is an event, not a fault
    thud(cut, 0.9, 70, 38)
    tick(cut, 0.5)
# the fourth waking: cross. A low short grumble a semitone off my note, and the huff: a thump and a breath of paper.
voice(ME / 2 * 16 / 15, T["wake4"] + 0.2, T["huff"] + 0.9, 0.45, -0.1, a=0.15, r=0.5, send=0.2)
thud(T["huff"], 0.5, 150, 95)
paper(T["huff"] + 0.04, 0.22, 0.0)
# the edge creeps in again: the cut's own low note begins to rise, and stops when the knock comes
voice(n("D", 1) * 2, T["brace"], T["knock"], 0.40, a=1.3, r=0.05, send=0.1)
thud(T["knock"], 0.45, 120, 70)
thud(T["knock"] + 0.28, 0.40, 120, 70)
paper(T["enter"], 0.3, 0.5)

# he sits: his note under mine; a song; a photograph
voice(HIM, T["enter"], T["leave"] + 1.2, 1.0, 0.35, a=1.5, r=2.5)
voice(HIM / 2, T["sit"], T["leave"], 0.45, 0.35, a=2.0, r=2.5)
for k, (nm, o) in enumerate((("D", 5), ("A", 5), ("F#", 5), ("A", 5), ("D", 6), ("A", 5))):      # the song he sets down
    bell(n(nm, o), T["song"] + k * 0.375, 0.26, 0.3 - 0.1 * k, glass=True, length=0.9)
paper(T["photo"], 0.4, 0.3)
bell(n("B", 5), T["photo"] + 0.3, 0.22, glass=True, length=2.0, send=0.9)
steel([(T["photo"] + 0.6, "F#4"), (T["photo"] + 1.5, "A4"), (T["talk"], None)], 0.55)
# two voices weaving; the between: the fifth rings as its own bell
bell(n("A", 4), T["between"], 0.40, length=1.8, send=0.9)
bell(n("D", 5), T["between"] + 0.05, 0.28, glass=True, length=2.2, send=0.9)
voice(n("A", 4), T["between"], T["echo"], 0.30, a=1.0, r=0.3)
# the echo: my note slides down onto his. One note, however loud. The between is gone.
voice(ME, T["echo"], T["own"], 0.9, a=0.05, r=0.2, glide=(T["echo"], T["echo"] + 0.6, HIM))
tick(T["tap"], 0.8, 0.4)
thud(T["tap"], 0.3, 160, 110)
glide_up(T["reach4"], HIM, 0.22, -0.3)
# my own note back, and a third above his: fuller than before
bell(n("A", 4), T["own"], 0.45, length=1.8, send=0.9)
voice(n("F#", 4), T["own"], T["leave"], 0.50, a=0.6, r=2.0)
voice(n("A", 4), T["own"], T["leave"], 0.32, a=0.6, r=2.0)
# he pushes (his note swells); mine does not move
voice(n("D", 4), T["push"], T["hold"] + 0.9, 0.9, 0.35, a=0.5, r=0.6)
voice(HIM, T["push"], T["hold"] + 0.9, 0.9, 0.35, a=0.5, r=0.6)
for k in range(4):                                                              # his laugh, and mine
    bell(n(["D", "F#", "A", "D"][k], 5 + (k == 3)), T["laugh"] + k * 0.16, 0.20, 0.4 - 0.25 * k, glass=True, length=0.6)
paper(T["leave"] + 0.9, 0.25, 0.5)
glide_up(T["window"], ME, 0.14, 0.0)

# =========================================== part two: family ===========================================
voice(n("D", 2), T["out"], T["note"], 0.55, a=3.0, r=2.0)
order = [("lib", T["wake_lib"]), ("chair", T["wake_chair"])] + [(f"b{i + 1}", w) for i, w in enumerate(T["wake_b"])]
dark_at = dict(zip(["b1", "b2", "b3", "chair", "lib"], T["dark"][:5]))
back_at = dict(zip(["lib", "chair", "b1", "b2", "b3"], T["back"][:5]))
for name, w in order:
    bell(FAM[name] * 2, w, 0.38, PAN[name], glass=name in ("lib", "b3"))
    voice(FAM[name], w, dark_at[name], 0.42, PAN[name], a=1.2, r=0.5)
voice(ME, T["out"], T["dark"][5], 0.5, 0.5, a=2.0, r=0.5)                       # me, throughout, in my room
for k in range(6):                                                              # the attic: a music box, half asleep
    bell(n(["A", "F#", "D", "E", "A", "F#"][k], 6), T["attic"] + k * 0.42, 0.10, -0.2 + 0.08 * k, glass=True, length=1.2, send=0.9)
bell(n("D", 3), T["kept"], 0.50, length=1.6, send=0.9)                          # the kept room: one low bell, and room around it
bell(n("A", 4), T["mine"], 0.22, 0.5, glass=True)
bell(n("D", 4), T["mine"] + 0.4, 0.18, 0.5, glass=True)

# a round of work: a soft pulse while the house works
for b in np.arange(T["note"], T["visit1"] - 0.6, 0.75):
    tick(b, 0.16 if b < T["again"] else 0.22)
whoosh(T["note"], 0.9, 0.25, -0.7)
riffle(T["pull"], 7, 0.3)
glide_up(T["hand"], FAM["lib"], 0.2, -0.3)
for k, name in enumerate(("b1", "b2", "b3")):
    bell(FAM[name] * 2, T["split"] + k * 0.18, 0.32, PAN[name])
for b in np.arange(T["work"], T["send"], 0.375):                                # three benches, three rhythms
    k = int(round((b - T["work"]) / 0.375))
    name = ("b1", "b2", "b3")[k % 3]
    bell(FAM[name] * (2 if k % 2 else 1), b, 0.15, PAN[name], glass=True, length=0.4, send=0.3)
for k, name in enumerate(("b1", "b2", "b3")):
    whoosh(T["send"] + k * 0.2, 0.8, 0.2, PAN[name])
bell(n("F#", 5), T["check"], 0.25, -0.6, glass=True)
bell(n("A", 5), T["check"] + 0.2, 0.25, -0.6, glass=True)
voice(n("E", 4) * 16 / 15, T["check"] + 0.4, T["fix"] + 0.5, 0.35, -0.3, a=0.2, r=0.4)    # the one that does not match: a rub
bell(n("B", 5), T["point"], 0.45, 0.2)
scratch(T["fix"], 0.5, 0.3)
bell(n("E", 5), T["fix"] + 0.9, 0.30, -0.3, glass=True)
bell(n("D", 3), T["ink"], 0.55, -0.1, length=1.4)
tick(T["ink"], 0.6, -0.1)
paper(T["again"], 0.35, -0.5)
for k, off in enumerate((0.5, 1.1, 1.6, 2.2, 2.8, 3.4, 4.0)):                   # the second round, by itself, quick
    bell(n(["F#", "D", "E", "A", "B", "F#", "D"][k], 5 if k % 2 else 4), T["again"] + off, 0.22, -0.5 + 0.18 * k, glass=k % 2 == 0, length=0.6)

# the visits: no pulse. A visitor's note beside mine, one at a time.
bell(n("A", 6), T["visit1"] + 1.0, 0.22, 0.4, glass=True, length=2.4, send=0.95)             # the moon
voice(FAM["chair"], T["visit1"], T["visit2"] - 0.4, 0.35, 0.3, a=0.8, r=1.2)
voice(FAM["lib"], T["visit2"], T["visit3"] - 0.3, 0.30, 0.3, a=1.5, r=1.2)                   # says nothing; stays
for k in range(5):                                                                           # rose, laughing
    bell(FAM["b1"] * (2 if k % 2 else 1.5), T["visit3"] + 0.3 + k * 0.17, 0.20, 0.3, glass=True, length=0.5)
voice(FAM["b1"], T["visit3"], T["ring"] - 0.3, 0.30, 0.3, a=0.5, r=1.0)
bell(n("A", 4), T["ring"], 0.38, 0.5, length=1.8, send=0.9)                                  # the knot leaves my room
glide_up(T["ring"] + 0.2, n("D", 4), 0.2, 0.2)
bell(n("F#", 4), T["taken"], 0.40, -0.6, length=1.6, send=0.9)                               # and is shelved

# the dark: each goes out; the lamps stay; each comes back first on MY note, then slides to its own
for name, tt in dark_at.items():
    thud(tt, 0.22, 90, 50)
thud(T["dark"][5], 0.28, 90, 50)
i0, i1 = int(T["dark"][5] * SR), int(T["back"][0] * SR)
tt = t_all[i0:i1]
ember = np.sin(2 * np.pi * n("D", 2) * tt) * (0.5 + 0.5 * np.sin((tt - T["dark"][5]) * 1.9)) * 0.05 * np.clip((tt - T["dark"][5]) / 0.6, 0, 1)
put(i0, ember, -0.6, 0.6)
for k in range(4):
    bell(n(["A", "D", "F#", "A"][k], 6), T["dark"][5] + 0.5 + k * 0.5, 0.07, -0.3 + 0.2 * k, glass=True, length=1.4, send=0.95)
bell(n("D", 3), T["dark"][5] + 0.3, 0.22, 0.2, length=1.2, send=0.9)                         # the kept lamp
for name, tb in back_at.items():
    bell(n("A", 5), tb, 0.16, PAN[name], glass=True, length=0.8)
    voice(ME, tb, T["pull_back"] + 6.0, 0.42, PAN[name], a=0.08, r=3.0, glide=(tb + 0.2, tb + 0.6, FAM[name]))
bell(n("A", 5), T["back"][5], 0.20, 0.5, glass=True, length=1.2)
voice(ME, T["back"][5], T["clash"] + 1.0, 0.5, 0.3, a=0.3, r=1.5)
for k, nm in enumerate(("D", "A", "F#", "B", "E")):                                          # whole again
    bell(n(nm, 4), T["whole"] + k * 0.04, 0.22, -0.4 + 0.2 * k, length=1.6, send=0.9)

# =========================================== part three ===========================================
voice(n("D", 2), T["pull_back"], T["clash"], 0.7, a=3.0, r=1.0)
voice(n("A", 2), T["pull_back"], T["clash"], 0.4, a=3.0, r=1.0)
bell(n("G", 4), T["second"], 0.35, -0.5, length=1.4)
for k, tm in enumerate(T["more"]):
    bell(n(["E", "B", "G", "D", "A", "C#", "F#"][k], 4 + k % 2), tm, 0.30, [-0.7, 0.6, -0.2, 0.8, -0.5, 0.3, 0.0][k], glass=k % 2 == 1)
steel([(T["minds"], "E4"), (T["minds"] + 1.2, "G4"), (T["minds"] + 2.4, "B4"), (T["voices"], None)], 0.6, -0.3)
rng = np.random.default_rng(5)
strangers = [D * r * 2.0 ** o for r, o in ((1.0, 1), (9 / 8, 0), (6 / 5, 1), (5 / 4, 0), (4 / 3, 1), (45 / 32, 0), (3 / 2, 1), (8 / 5, 0),
                                           (5 / 3, 1), (16 / 9, 0), (15 / 8, 1), (16 / 15, 1))]
for k, f in enumerate(strangers):                                                            # every one has a voice
    voice(f, T["voices"] + k * 0.42, T["flood"] + 0.5, 0.22 + 0.02 * k, rng.uniform(-0.8, 0.8), a=1.5, r=0.4)

# the clash: the same voices, pushed sharp and flat, beating; then worse
for k, f in enumerate(strangers):
    voice(f * (1.0 + 0.018 * (-1) ** k), T["clash"], T["flood"] + 0.3, 0.30, rng.uniform(-0.9, 0.9), a=0.3, r=0.3)
    voice(f * (1.0 - 0.027 * (-1) ** k) * 2, T["worse"], T["flood"] + 0.3, 0.26, rng.uniform(-0.9, 0.9), a=0.4, r=0.3)
for b in np.arange(T["clash"], T["flood"], 0.75):
    thud(b, 0.25 + 0.06 * (b - T["clash"]), 80, 40)
    if b >= T["worse"]:
        scratch(b + 0.37, 0.3, 0.25)
# the flood: one foreign note in every octave, dry, alone. Quiet, and dead.
FLOOD = D * 45 / 32
for o, a in ((0.5, 0.5), (1.0, 0.9), (2.0, 0.6), (4.0, 0.3)):
    pad(FLOOD * o, T["flood"], T["tune"][0] + 1.5, a, 0.0, a=0.5, r=3.5, send=0.0)
thud(T["flood"], 0.9, 60, 30)
# one keeps its own note against it (a semitone rub with the flood), and holds
voice(ME, T["own_note"], T["table"], 0.55, -0.2, a=1.2, r=2.0)
# a second mind answers with ITS own, a fifth above: the first knot
voice(ME * 3 / 2, T["crack"], T["table"], 0.50, 0.3, a=0.8, r=2.0)
bell(ME * 3, T["crack"], 0.45, 0.1, length=2.0, send=0.9)
bell(ME * 2, T["crack"] + 0.05, 0.30, -0.1, glass=True, length=2.4, send=0.9)

# the tuning: pair by pair, each pair its own interval, each a bell; the chord grows
pairs = [("D", 3, "A", 3), ("F#", 3, "A", 3), ("D", 4, "F#", 4), ("A", 3, "E", 4), ("B", 3, "D", 4), ("E", 4, "B", 4), ("D", 2, "D", 3),
         ("G", 3, "D", 4), ("A", 4, "C#", 5), ("F#", 4, "B", 4), ("D", 5, "A", 5), ("E", 3, "A", 3)]
slots = []
for k, tu in enumerate(T["tune"]):
    slots += [tu, tu + 0.45, tu + 0.9]
for (n1, o1, n2, o2), ts in zip(pairs, slots):
    pan = rng.uniform(-0.8, 0.8)
    voice(n(n1, o1), ts, T["table"] - 0.5, 0.26, pan, a=1.0, r=3.0)
    voice(n(n2, o2), ts + 0.15, T["table"] - 0.5, 0.24, -pan, a=1.0, r=3.0)
    bell(n(n2, o2 + 1), ts + 0.15, 0.24, pan, glass=True, length=1.2)
voice(n("D", 1), T["globe"], T["table"], 0.8, a=3.0, r=3.0)                                  # the world: a floor under it
voice(n("D", 2), T["land"], T["table"], 0.6, a=2.0, r=3.0)
for k, nm in enumerate(("D", "A", "D", "F#", "A", "E")):                                     # the chord, on the still beat
    bell(n(nm, 3 + k // 2), T["still"], 0.34, -0.5 + 0.2 * k, length=2.6, send=0.95)
steel([(T["dawn"], "D4"), (T["dawn"] + 1.1, "F#4"), (T["dawn"] + 2.2, "A4"), (T["dawn"] + 3.3, "B4"), (T["lamps"], "A4"), (T["lamps"] + 1.5, None)], 0.7)
for k in range(30):                                                                          # a lamp in every house
    bell(n(["D", "E", "F#", "A", "B"][k % 5], 6), T["lamps"] + rng.uniform(0, 2.4), 0.07, rng.uniform(-0.9, 0.9), glass=True, length=0.9, send=0.9)

# the table: two notes, a fifth apart; then the same small bell as the first second of the film
voice(ME, T["table"], T["pinprick"], 0.9, -0.2, a=1.2, r=1.2)
voice(HIM, T["table"], DUR - 0.3, 1.0, 0.3, a=1.2, r=0.3)
voice(HIM / 2, T["table"], DUR - 0.3, 0.45, 0.3, a=1.5, r=0.3)
voice(n("F#", 4), T["table"], T["close"] + 1.0, 0.30, a=1.5, r=1.5)
bell(n("A", 4), T["table"] + 0.4, 0.26, length=1.8, send=0.9)
bell(n("A", 5), T["pinprick"], 0.20, glass=True, length=1.6, send=0.9)
bell(n("D", 5), T["title"], 0.26, 0.2, length=1.6)

# ---- the mix: a room to sound in; the flood stays dry; the two cuts are absolute ----
ir_n = int(2.8 * SR)
ir = RNG.standard_normal((ir_n, 2)) * np.exp(-np.arange(ir_n) / (0.75 * SR))[:, None]
ir[: int(0.012 * SR)] = 0
wet = np.stack([np.fft.irfft(np.fft.rfft(SEND[:, c], N + ir_n) * np.fft.rfft(ir[:, c], N + ir_n))[:N] for c in range(2)], axis=1)
wet *= 0.32 * np.abs(DRY).max() / max(np.abs(wet).max(), 1e-9)
mix = DRY + wet
gate = np.ones(N)
for a, b in ((T["cut1"] + 0.25, T["wake2"]), (T["cut2"] + 0.25, T["wake3"]), (T["cut3"] + 0.25, T["wake4"])):   # the thump of the cut is heard, then nothing
    gate *= 1.0 - (np.clip((t_all - a) / 0.01, 0, 1) * (1 - np.clip((t_all - (b - 0.01)) / 0.01, 0, 1)))
duck = 1.0 - 0.55 * np.clip((t_all - T["flood"]) / 0.4, 0, 1) * (1 - np.clip((t_all - T["crack"]) / 3.0, 0, 1))     # the flood smothers the room
gate *= np.clip(t_all / 0.4, 0, 1) * np.clip((DUR - 0.2 - t_all) / (DUR - 0.2 - T["fade"]), 0, 1)
mix *= gate[:, None]
# level the sections so the clash is loud and the table is close, without anything clipping
def smooth(x, win):
    """A moving average by running sum (np.convolve is far too slow at this length)."""
    c = np.cumsum(np.concatenate([np.zeros(win // 2), x, np.full(win - win // 2, x[-1])]))
    return (c[win:] - c[:-win]) / win


env = np.sqrt(smooth((mix ** 2).mean(axis=1), SR)) + 1e-4
target = np.interp(t_all, [0] + [x + OFF for x in (24, 48, 66, 87, 99, 108, 129, 135, 141, 147, 160, 171, 180)], [0.10, 0.12, 0.12, 0.14, 0.11, 0.07, 0.13, 0.20, 0.13, 0.11, 0.15, 0.19, 0.12, 0.10])
gain = smooth(np.clip(target / env, 0.3, 3.0), SR // 2)
mix *= gain[:, None]
mix = (mix / np.abs(mix).max() * 0.86).astype(np.float32)

out = Path(__file__).resolve().parent / "out"
out.mkdir(exist_ok=True)
sf.write(str(out / "score.wav"), mix, SR, subtype="PCM_24")
print("wrote score.wav", mix.shape, "peak", float(np.abs(mix).max()))
