"""instruments.py: the synthesised instruments (pad, bell, steel voice, paper, thud ...), from the last film.
Shared. They all write into DRY and SEND; score.py mixes those down.
"""
from pathlib import Path

import numpy as np
import soundfile as sf

from world import TL

SR = 44100
DUR = TL["DUR"]
N = int(SR * DUR)
DRY = np.zeros((N, 2))
SEND = np.zeros((N, 2))
RNG = np.random.default_rng(12345)
SEMIS = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def F(name: str) -> float:
    """'Bb3' -> Hz."""
    letter, rest = name[0], name[1:]
    acc = 0
    if rest[0] in "#b":
        acc = 1 if rest[0] == "#" else -1
        rest = rest[1:]
    midi = 12 * (int(rest) + 1) + SEMIS[letter] + acc
    return 440.0 * 2.0 ** ((midi - 69) / 12.0)


def put(i0: int, sig: np.ndarray, pan: float, send: float) -> None:
    i0 = max(0, i0)
    sig = sig[: max(0, N - i0)]
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    st = np.stack([sig * gl, sig * gr], axis=1)
    DRY[i0:i0 + len(sig)] += st
    SEND[i0:i0 + len(sig)] += st * send


def pad(f, t0, t1, amp, pan=0.0, a=2.5, r=3.0, glide=None, send=0.55):
    """Three slightly detuned sines with soft upper partials. glide = (start, end, to Hz)."""
    i0, i1 = int(t0 * SR), min(N, int((t1 + r) * SR))
    t = np.arange(i0, i1) / SR
    freq = np.full(len(t), float(f))
    if glide:
        k = np.clip((t - glide[0]) / (glide[1] - glide[0]), 0, 1)
        k = k * k * (3 - 2 * k)
        freq = f * (glide[2] / f) ** k
    ph = 2 * np.pi * np.cumsum(freq) / SR
    env = np.minimum(np.clip((t - t0) / a, 0, 1), np.where(t > t1, 1 - (t - t1) / r, 1.0)).clip(0, 1)
    env = env * (1 + 0.08 * np.sin(t * 0.7 + RNG.uniform(0, 6.28)))
    p = RNG.uniform(0, 6.28, 3)
    v = (np.sin(ph + p[0]) + 0.8 * np.sin(ph * 1.003 + p[1]) + 0.8 * np.sin(ph * 0.9968 + p[2]) + 0.18 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph))
    put(i0, v * env * amp * 0.25, pan, send)


def chord(notes, t0, t1, amp=1.0, **kw):
    for k, n in enumerate(notes):
        pad(F(n), t0, t1, amp * (1.1 if k == 0 else 0.8), ((k / max(1, len(notes) - 1)) - 0.5) * 0.9, **kw)


def bell(f, t0, amp, pan=0.0, glass=False, length=1.0, send=0.6):
    parts = [(1, 1, 2.5), (2.0, .5, 1.6), (3.01, .3, 1.1), (4.2, .16, .8)] if glass else \
        [(1, 1, 3.2), (2.76, .45, 1.6), (5.4, .25, .9), (8.93, .1, .5), (.5, .25, 3.5)]
    dur = max(p[2] for p in parts) * length * 6
    i0 = int(t0 * SR)
    t = np.arange(int(dur * SR)) / SR
    v = sum(g * np.sin(2 * np.pi * f * m * t) * np.exp(-t / (d * length)) for m, g, d in parts)
    put(i0, v * amp * 0.22 * np.clip(t / 0.003, 0, 1), pan, send)


def noise(t0, dur, amp, pan=0.0, high=False, cut=0.3, decay=6.0, send=0.3, shape=None):
    i0 = int(t0 * SR)
    n = int(dur * SR)
    x = RNG.uniform(-1, 1, n)
    lp = np.empty(n)
    acc = 0.0
    for i in range(n):                                   # one-pole low-pass
        acc += (x[i] - acc) * cut
        lp[i] = acc
    v = np.diff(lp, prepend=0.0) if high else lp
    k = np.arange(n) / max(1, n)
    env = shape(k) if shape else np.exp(-k * decay) * np.clip(np.arange(n) / (0.004 * SR), 0, 1)
    put(i0, v * env * amp, pan, send)


def paper(t, amp=0.5, pan=0.0):
    noise(t, 0.28, amp * 2.2, pan, high=True, cut=0.55, decay=9)


def riffle(t, n=7, amp=0.35):
    for k in range(n):
        paper(t + k * 0.07 + RNG.uniform(0, 0.02), amp * (1 - k / n * 0.5), RNG.uniform(-0.3, 0.3))


def tick(t, amp=0.5, pan=0.0):
    noise(t, 0.05, amp * 2.5, pan, high=True, cut=0.9, decay=40, send=0.2)


def scratch(t, dur=0.45, amp=0.3):
    noise(t, dur, amp * 2.0, 0.0, high=True, cut=0.7, send=0.2, shape=lambda k: np.sin(k * np.pi) ** 0.5)


def whoosh(t, dur=1.2, amp=0.35, pan=0.0):
    noise(t, dur, amp * 0.9, pan, cut=0.12, send=0.5, shape=lambda k: np.sin(k * np.pi) ** 1.5)


def thud(t0, amp=0.6, f0=90.0, f1=42.0):
    t = np.arange(int(0.7 * SR)) / SR
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 18)) / SR
    put(int(t0 * SR), np.sin(ph) * np.exp(-t * 7) * amp * 0.5, 0.0, 0.15)


def glide_up(t, f, amp=0.3, pan=0.0):
    pad(f, t, t + 0.6, amp, pan, a=0.15, r=1.6, glide=(t, t + 0.8, f * 2), send=0.7)


def steel(notes, amp=1.0, pan=0.15):
    """A bowed, lap-steel-like voice: harmonics, glides between notes, vibrato 6.8 Hz. notes: [(t, 'A4'), ..., (t, None)]"""
    t0, t1 = notes[0][0], notes[-1][0]
    i0, i1 = int(t0 * SR), min(N, int((t1 + 2.5) * SR))
    t = np.arange(i0, i1) / SR
    freq = np.full(len(t), F(notes[0][1]))
    for (ta, na), (tb, nb) in zip(notes[:-1], notes[1:]):
        if nb is None:
            break
        k = np.clip((t - (tb - 0.18)) / 0.36, 0, 1)
        k = k * k * (3 - 2 * k)
        freq = np.where(t >= tb - 0.18, F(na) * (F(nb) / F(na)) ** k, freq)
    vib = 33.0 / 1200.0 * np.clip((t - t0) / 1.2, 0, 1)
    ph = 2 * np.pi * np.cumsum(freq * 2.0 ** (np.sin(2 * np.pi * 6.8 * t) * vib)) / SR
    env = np.minimum(np.clip((t - t0) / 0.6, 0, 1), np.where(t > t1, 1 - (t - t1) / 2.5, 1.0)).clip(0, 1)
    v = sum(np.sin(ph * h) / (h * h * 0.8 + 0.2) for h in range(1, 7))
    put(i0, v * env * amp * 0.075, pan, 0.7)


# ------------------------------------------------------------------------------------------------------
# the score
# ------------------------------------------------------------------------------------------------------
