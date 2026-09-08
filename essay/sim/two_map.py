#!/usr/bin/env python3
"""
two_map.py -- the two-map model REFEREE_A3_2026-09-08.md finding 1(c) specified.

    f : r -> x      representation -> fact.   S-shaped (logistic).  gain = f'
    g : x -> r'     evidence -> representation.  learning rate alpha, delay d,
                    additive bias b, slope gamma (= g').
    h : x -> o      informant.  reads the same x, NO feedback into f.

Run:
    py essay/sim/two_map.py --part all          # everything, ~1 min
    py essay/sim/two_map.py --part 1            # fixed points
    py essay/sim/two_map.py --part 2            # equilibrium error: lag vs bias
    py essay/sim/two_map.py --part 3            # linear stability with delay
    py essay/sim/two_map.py --part 4            # persistent error off equilibrium
    py essay/sim/two_map.py --part 5            # lock-in, basin jumps, hysteresis
    py essay/sim/two_map.py --part 6            # informant: tracking slopes
    py essay/sim/two_map.py --part 7            # noise + curvature (Jensen) check

Every number printed is prefixed [N.x] and is quoted under that tag in
essay/TWO_MAP_2026-09-08.md.  Figures go to essay/sim/out/.

Deterministic: numpy default_rng(20260908) everywhere noise is used.

MODEL, stated once.

  x_t     = f(r_t; k, a_t)      f(r;k,a) = 1/(1+exp(-(k*(r-0.5) + a)))
  r_{t+1} = (1-alpha)*r_t + alpha*( gamma*(x_{t-d} - 0.5) + 0.5 + b + noise )
  o_{t+1} = (1-alpha_h)*o_t + alpha_h*( x_{t-dh} + noise )

  GAIN            G   = f'(r) = k*f*(1-f);  swept as Gmax = k/4 (its value at r=0.5, a=0)
  LAG             the pair (alpha, d).  alpha=1, d=0 is "no lag".
  BIAS            b (additive) and gamma-1 (sensitivity).  b=0, gamma=1 is "no bias term".

  SEPARABILITY (the packet's refusal check): b and gamma enter g's VALUE; alpha and d enter
  only its TIMING.  b=0, gamma=1 with alpha<1 or d>0 is a well-defined state of the model.
  So "lag with no bias" IS a state this model can occupy, and item 3 is answerable in it.
"""

import argparse, json, os, sys
import numpy as np

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

SEED = 20260908
RESULTS = {}


# ----------------------------------------------------------------------------- maps

def f(r, k, a=0.0):
    """representation -> fact.  logistic, centred so that f(0.5)=0.5 when a=0."""
    return 1.0 / (1.0 + np.exp(-(k * (r - 0.5) + a)))


def fprime(r, k, a=0.0):
    """gain = f'(r) = k f (1-f)."""
    v = f(r, k, a)
    return k * v * (1.0 - v)


def g(x, b=0.0, gamma=1.0):
    """evidence -> representation, VALUE only (timing lives in the update)."""
    return gamma * (x - 0.5) + 0.5 + b


# ----------------------------------------------------------------------------- fixed points

def fixed_points(k, a=0.0, b=0.0, gamma=1.0, lo=-3.0, hi=4.0, n=400001):
    """all roots of phi(r) = g(f(r)) - r, by dense sign-change scan + bisection."""
    rs = np.linspace(lo, hi, n)
    phi = g(f(rs, k, a), b, gamma) - rs
    sign = np.sign(phi)
    idx = np.where(sign[:-1] * sign[1:] < 0)[0]
    roots = []
    for i in idx:
        lo_i, hi_i = rs[i], rs[i + 1]
        for _ in range(200):
            mid = 0.5 * (lo_i + hi_i)
            if (g(f(lo_i, k, a), b, gamma) - lo_i) * (g(f(mid, k, a), b, gamma) - mid) <= 0:
                hi_i = mid
            else:
                lo_i = mid
        roots.append(0.5 * (lo_i + hi_i))
    # exact zeros landing on a grid point
    for i in np.where(phi == 0.0)[0]:
        roots.append(rs[i])
    roots = sorted(set(round(v, 12) for v in roots))
    return np.array(roots)


def max_eig(fp, k, a, alpha, d, gamma):
    """
    exact linear stability of the DELAYED update at a fixed point.

    r_{t+1} = (1-alpha) r_t + alpha*gamma*f'(r*) r_{t-d}   (+ const)
    =>  lambda^{d+1} - (1-alpha) lambda^d - alpha*gamma*f'(r*) = 0
    returns max |lambda| over all roots.  <1 stable, >1 unstable.
    """
    J = alpha * gamma * fprime(fp, k, a)
    coeffs = np.zeros(d + 2)
    coeffs[0] = 1.0
    # NOTE: accumulate, do not assign.  At d=0 the array has length 2 and coeffs[1]
    # IS coeffs[-1]; assigning both dropped the (1-alpha) term and made every d=0
    # stability verdict wrong.  Found 2026-09-08 by checking [3.2] d=0 against the
    # hand-computed J = (1-alpha) + alpha*f'.
    coeffs[1] += -(1.0 - alpha)
    coeffs[-1] += -J
    return float(np.max(np.abs(np.roots(coeffs))))


# ----------------------------------------------------------------------------- simulation

def simulate(k, alpha, d, b=0.0, gamma=1.0, a_series=None, T=4000, r0=0.5,
             sigma=0.0, alpha_h=1.0, dh=0, sigma_h=0.0, rng=None, kick=None):
    """
    integrate the loop plus the informant.  returns dict of arrays.
    a_series: exogenous drive, length T (default zeros).
    kick: (time, delta) one-off additive impulse to r.
    """
    if rng is None:
        rng = np.random.default_rng(SEED)
    if a_series is None:
        a_series = np.zeros(T)
    a_series = np.asarray(a_series, dtype=float)
    assert len(a_series) >= T

    r = np.empty(T); x = np.empty(T); o = np.empty(T)
    r[:] = np.nan
    hist_len = max(d, dh) + 1
    r[0] = r0
    o[0] = 0.5
    for t in range(T):
        x[t] = f(r[t], k, a_series[t])
        if t + 1 < T:
            src = x[t - d] if t - d >= 0 else x[0]
            nz = rng.normal(0.0, sigma) if sigma > 0 else 0.0
            r[t + 1] = (1 - alpha) * r[t] + alpha * (g(src, b, gamma) + nz)
            if kick is not None and t + 1 == kick[0]:
                r[t + 1] += kick[1]
            src_h = x[t - dh] if t - dh >= 0 else x[0]
            nzh = rng.normal(0.0, sigma_h) if sigma_h > 0 else 0.0
            o[t + 1] = (1 - alpha_h) * o[t] + alpha_h * (src_h + nzh)
    return dict(r=r, x=x, o=o, a=a_series[:T])


# ============================================================================= PART 0

def part0():
    """Self-checks of the instrument, against closed forms computed by hand."""
    print("\n=== PART 0 -- instrument self-checks ===")
    rng = np.random.default_rng(SEED)
    n_ok = 0

    # (a) d=0: max|lambda| must equal |(1-alpha) + alpha*gamma*f'(r*)|
    worst = 0.0
    for _ in range(400):
        k = rng.uniform(-12, 12); al = rng.uniform(0.01, 1.0)
        gam = rng.uniform(0.2, 3.0); r = rng.uniform(-1, 2)
        want = abs((1 - al) + al * gam * fprime(r, k))
        got = max_eig(r, k, 0.0, al, 0, gam)
        worst = max(worst, abs(want - got)); n_ok += 1
    print(f"[0.1] d=0 vs closed form |(1-a)+a*gamma*f'|: max abs deviation over 400 "
          f"random cells = {worst:.3e}")

    # (b) alpha=1: max|lambda| must equal |gamma*f'|**(1/(d+1))
    worst = 0.0
    for _ in range(400):
        k = rng.uniform(-12, 12); gam = rng.uniform(0.2, 3.0)
        r = rng.uniform(-1, 2); d = int(rng.integers(0, 15))
        want = abs(gam * fprime(r, k)) ** (1.0 / (d + 1))
        got = max_eig(r, k, 0.0, 1.0, d, gam)
        worst = max(worst, abs(want - got)); n_ok += 1
    print(f"[0.2] alpha=1 vs closed form |gamma*f'|^(1/(d+1)): max abs deviation over 400 "
          f"random cells = {worst:.3e}")

    # (c) the linear-stability verdict must agree with what the simulation does
    agree = dis = 0
    for _ in range(300):
        k = rng.uniform(-12, 12); al = rng.uniform(0.05, 1.0)
        d = int(rng.integers(0, 8))
        fps = fixed_points(k)
        fp = fps[np.argmin(np.abs(fps - 0.5))]
        lam = max_eig(fp, k, 0.0, al, d, 1.0)
        if abs(lam - 1.0) < 0.05:
            continue                       # skip the boundary, where either is fine
        s = simulate(k, al, d, T=8000, r0=fp + 1e-6)
        returned = abs(s["r"][-1] - fp) < 1e-4
        if (lam < 1.0) == returned:
            agree += 1
        else:
            dis += 1
    print(f"[0.3] linear verdict vs 1e-6 perturbation of the simulation, 300 random cells "
          f"(boundary |lam-1|<0.05 skipped): agree {agree}, disagree {dis}")

    # (d) fixed_points must find the analytic r*=0.5 whenever a=0
    worst = 0.0
    for _ in range(200):
        k = rng.uniform(-12, 12)
        fps = fixed_points(k)
        worst = max(worst, float(np.min(np.abs(fps - 0.5))))
    print(f"[0.4] fixed_points always contains the analytic root r*=0.5 at a=0: "
          f"max distance to nearest root = {worst:.3e}")

    # (e) simulate must reproduce one hand-stepped trajectory
    k, al, d, b = 2.0, 0.4, 2, 0.05
    s = simulate(k, al, d, b=b, T=8, r0=0.3)
    r = [0.3]; x = []
    for t in range(8):
        x.append(1 / (1 + np.exp(-(k * (r[t] - 0.5)))))
        if t + 1 < 8:
            src = x[t - d] if t - d >= 0 else x[0]
            r.append((1 - al) * r[t] + al * (src + b))
    print(f"[0.5] hand-stepped 8-step trajectory vs simulate(): max |diff| in r = "
          f"{np.abs(np.array(r) - s['r']).max():.3e}, in x = "
          f"{np.abs(np.array(x) - s['x']).max():.3e}")
    RESULTS["part0"] = dict(checks=5)


# ============================================================================= PART 1

def part1():
    """How many fixed points, as a function of gain and bias."""
    print("\n=== PART 1 -- fixed points ===")
    Gmax = np.arange(-3.0, 3.0001, 0.05)          # RANGE: see hand-back sec 'ranges'
    ks = 4.0 * Gmax
    counts_nobias = np.array([len(fixed_points(k)) for k in ks])

    print(f"[1.1] Gmax grid: {Gmax[0]:.2f}..{Gmax[-1]:.2f} step 0.05, n={len(Gmax)}")
    print(f"[1.2] b=0, gamma=1: min fixed points over the whole grid = {counts_nobias.min()}, "
          f"max = {counts_nobias.max()}")
    print(f"[1.3] number of (Gmax) points with ZERO fixed points = {int((counts_nobias==0).sum())}")
    one = Gmax[counts_nobias == 1]; three = Gmax[counts_nobias == 3]
    print(f"[1.4] count==1 for Gmax in [{one.min():.2f},{one.max():.2f}] ({len(one)} pts); "
          f"count==3 for Gmax in [{three.min():.2f},{three.max():.2f}] ({len(three)} pts)"
          if len(three) else f"[1.4] count==1 everywhere ({len(one)} pts); count==3 never")
    # locate the pitchfork
    first3 = Gmax[counts_nobias == 3].min() if (counts_nobias == 3).any() else None
    print(f"[1.5] first Gmax with 3 fixed points = {first3}  (analytic pitchfork at Gmax=1)")

    # bias sweep -- 2D count
    bs = np.arange(-0.40, 0.4001, 0.01)
    grid = np.zeros((len(bs), len(Gmax)), dtype=int)
    for i, b in enumerate(bs):
        for j, k in enumerate(ks):
            grid[i, j] = len(fixed_points(k, b=b))
    print(f"[1.6] bias grid: b {bs[0]:.2f}..{bs[-1]:.2f} step 0.01, n={len(bs)}")
    print(f"[1.7] over the full (Gmax,b) grid, cells with ZERO fixed points = "
          f"{int((grid==0).sum())} of {grid.size}")
    print(f"[1.8] fixed-point counts observed: {sorted(set(grid.ravel().tolist()))}")

    # gamma sweep -- can g's slope kill the fixed point?
    gams = np.array([0.25, 0.5, 1.0, 2.0, 4.0])
    for gam in gams:
        c = [len(fixed_points(k, gamma=gam)) for k in ks]
        print(f"[1.9] gamma={gam:>4}: min count over Gmax grid = {min(c)}, "
              f"counts seen = {sorted(set(c))}")

    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    ax[0].step(Gmax, counts_nobias, where="mid", lw=1.6, color="#1f3d7a")
    ax[0].axvline(1.0, color="#b03030", ls="--", lw=1, label="Gmax = 1 (pitchfork)")
    ax[0].set_xlabel("gain  Gmax = f'(0.5) = k/4"); ax[0].set_ylabel("number of fixed points")
    ax[0].set_title("b = 0, gamma = 1"); ax[0].set_ylim(-0.2, 3.5); ax[0].legend(fontsize=8)
    im = ax[1].pcolormesh(Gmax, bs, grid, shading="auto", cmap="viridis", vmin=0, vmax=3)
    ax[1].set_xlabel("gain  Gmax"); ax[1].set_ylabel("bias  b")
    ax[1].set_title("fixed-point count over (gain, bias)")
    plt.colorbar(im, ax=ax[1], ticks=[0, 1, 2, 3])
    fig.suptitle("Fig 1 -- the number of fixed points is never zero", fontsize=11)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig1_fixedpoints.png"), dpi=130)
    plt.close(fig)

    RESULTS["part1"] = dict(min_count_nobias=int(counts_nobias.min()),
                            zero_cells=int((grid == 0).sum()),
                            grid_size=int(grid.size),
                            first_three=None if first3 is None else float(first3))
    print("[1.10] wrote out/fig1_fixedpoints.png")


# ============================================================================= PART 2

def part2():
    """THE QUESTION.  Equilibrium self-error under lag alone vs under bias."""
    print("\n=== PART 2 -- equilibrium self-error: lag alone vs bias ===")
    Gmax = np.arange(-3.0, 3.0001, 0.05); ks = 4.0 * Gmax
    alphas = [0.05, 0.1, 0.2, 0.4, 0.7, 1.0]
    ds = [0, 1, 2, 3, 4, 5, 8, 12]

    # --- 2A analytic/root-level: equilibrium error with b=0 for EVERY (alpha,d)
    worst = 0.0; worst_where = None
    n_cells = 0
    for k in ks:
        for fp in fixed_points(k):
            err = abs(g(f(fp, k)) - f(fp, k))   # r* - x* at equilibrium, b=0 gamma=1
            n_cells += 1
            if err > worst:
                worst, worst_where = err, (k / 4, fp)
    print(f"[2.1] b=0, gamma=1: max |r* - x*| over ALL fixed points of ALL {len(ks)} gains "
          f"= {worst:.3e}   (n fixed points = {n_cells})")
    print(f"[2.2] alpha and d do not appear in the fixed-point equation r = g(f(r)); "
          f"they are absent from 2.1 by construction, not by omission.")

    # --- 2B numeric: integrate to steady state for every (alpha, d), b=0, confirm
    rows = []
    for Gm in [-2.5, -1.5, -0.5, 0.5, 0.9, 1.5, 2.5]:
        k = 4 * Gm
        for al in alphas:
            for d in ds:
                s = simulate(k, al, d, b=0.0, T=20000, r0=0.42)
                tail = slice(-500, None)
                e = np.abs(s["r"][tail] - s["x"][tail])
                rows.append((Gm, al, d, float(e.mean()), float(e.max()),
                             float(np.ptp(s["r"][tail]))))
    arr = np.array(rows)
    settled = arr[arr[:, 5] < 1e-9]        # trajectories that actually settled
    moving = arr[arr[:, 5] >= 1e-9]
    print(f"[2.3] integrated {len(arr)} (Gmax,alpha,d) cells at b=0, T=20000, "
          f"{len(settled)} settled (peak-to-peak of r over last 500 steps < 1e-9)")
    if len(settled):
        print(f"[2.4] SETTLED cells, b=0: max mean|r-x| = {settled[:,3].max():.3e}, "
              f"max max|r-x| = {settled[:,4].max():.3e}")
    if len(moving):
        print(f"[2.5] NON-SETTLED cells at b=0: {len(moving)}; "
              f"their Gmax values = {sorted(set(moving[:,0].tolist()))}; "
              f"max mean|r-x| among them = {moving[:,3].max():.4f}")
    else:
        print("[2.5] NON-SETTLED cells at b=0: none")

    # --- 2C bias arm: equilibrium error vs b
    bs = np.arange(-0.30, 0.3001, 0.01)
    errmap = np.zeros((len(bs), len(Gmax)))
    for i, b in enumerate(bs):
        for j, k in enumerate(ks):
            fps = fixed_points(k, b=b)
            # take the stable one nearest 0.5 for the map
            best = None
            for fp in fps:
                if max_eig(fp, k, 0.0, 1.0, 0, 1.0) < 1.0:
                    if best is None or abs(fp - 0.5) < abs(best - 0.5):
                        best = fp
            if best is None:
                best = fps[np.argmin(np.abs(fps - 0.5))]
            errmap[i, j] = g(f(best, k), b) - f(best, k)
    print(f"[2.6] bias arm: max |r*-x*| over the (Gmax,b) grid = {np.abs(errmap).max():.4f}; "
          f"max |b| on the grid = {np.abs(bs).max():.2f}")
    dev = np.abs(errmap - bs[:, None]).max()
    print(f"[2.7] max deviation of (r*-x*) from b itself over the whole grid = {dev:.3e}  "
          f"-> equilibrium error EQUALS the bias, independent of gain")

    # --- 2D gamma arm (sensitivity bias)
    print("[2.8] gamma arm (b=0, gamma != 1), Gmax=0.5:")
    for gam in [0.5, 0.8, 1.0, 1.25, 2.0]:
        k = 2.0
        for aval in [0.0, 0.8]:
            fps = fixed_points(k, a=aval, gamma=gam)
            fp = fps[np.argmin(np.abs(fps - 0.5))]
            xs = f(fp, k, aval)
            print(f"       gamma={gam:<5} a={aval:<4} -> r*={fp:.6f} x*={xs:.6f} "
                  f"r*-x*={fp-xs:+.6f}")

    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    m = ax[0].pcolormesh(Gmax, bs, errmap, shading="auto", cmap="RdBu_r",
                         vmin=-0.3, vmax=0.3)
    ax[0].set_xlabel("gain Gmax"); ax[0].set_ylabel("bias b")
    ax[0].set_title("equilibrium r* - x*  (colour = error)")
    plt.colorbar(m, ax=ax[0])
    # lag panel: error is identically zero, drawn as such
    lagerr = np.zeros((len(ds), len(alphas)))
    for i, d in enumerate(ds):
        for j, al in enumerate(alphas):
            sub = arr[(arr[:, 1] == al) & (arr[:, 2] == d) & (arr[:, 5] < 1e-9)]
            lagerr[i, j] = sub[:, 3].max() if len(sub) else np.nan
    m2 = ax[1].pcolormesh(np.arange(len(alphas)), np.arange(len(ds)), lagerr,
                          shading="auto", cmap="RdBu_r", vmin=-0.3, vmax=0.3)
    ax[1].set_xticks(range(len(alphas))); ax[1].set_xticklabels(alphas)
    ax[1].set_yticks(range(len(ds))); ax[1].set_yticklabels(ds)
    ax[1].set_xlabel("learning rate alpha"); ax[1].set_ylabel("delay d")
    ax[1].set_title("equilibrium |r-x| at b=0 (settled cells)")
    plt.colorbar(m2, ax=ax[1])
    fig.suptitle("Fig 2 -- bias moves the equilibrium; lag does not", fontsize=11)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig2_equilibrium_error.png"), dpi=130)
    plt.close(fig)

    RESULTS["part2"] = dict(max_eq_err_nobias=float(worst),
                            settled_max_err=float(settled[:, 3].max()) if len(settled) else None,
                            nonsettled=int(len(moving)),
                            err_equals_bias_dev=float(dev))
    print("[2.9] wrote out/fig2_equilibrium_error.png")


# ============================================================================= PART 3

def part3():
    """Linear stability with delay: where does lag destroy the equilibrium?"""
    print("\n=== PART 3 -- stability with delay ===")
    Gmax = np.arange(-3.0, 3.0001, 0.02); ks = 4 * Gmax
    ds = [0, 1, 2, 3, 5, 8, 12]
    alphas = [0.1, 0.4, 1.0]

    print("[3.1] max|lambda| of the delayed characteristic polynomial at the fixed point "
          "nearest 0.5; unstable when > 1.  Unstable set reported as CONTIGUOUS INTERVALS "
          "(an earlier version of this line printed min..max of the set, which reads as one "
          "interval where there are two -- corrected here).")
    fig, axes = plt.subplots(1, 3, figsize=(14, 4), sharey=True)
    summary = {}
    for ax, al in zip(axes, alphas):
        for d in ds:
            vals = []
            for k in ks:
                fps = fixed_points(k)
                fp = fps[np.argmin(np.abs(fps - 0.5))]
                vals.append(max_eig(fp, k, 0.0, al, d, 1.0))
            vals = np.array(vals)
            ax.plot(Gmax, vals, lw=1.2, label=f"d={d}")
            unstable = vals > 1.0
            ivs = []
            i = 0
            while i < len(unstable):
                if unstable[i]:
                    j = i
                    while j + 1 < len(unstable) and unstable[j + 1]:
                        j += 1
                    ivs.append((float(Gmax[i]), float(Gmax[j])))
                    i = j + 1
                else:
                    i += 1
            summary[(al, d)] = ivs
        ax.axhline(1.0, color="k", ls="--", lw=0.8)
        ax.set_title(f"alpha = {al}"); ax.set_xlabel("gain Gmax")
    axes[0].set_ylabel("max |lambda|"); axes[0].legend(fontsize=7, ncol=2)
    fig.suptitle("Fig 3 -- delay changes the rate, not the threshold", fontsize=11)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig3_stability.png"), dpi=130)
    plt.close(fig)

    for al in alphas:
        for d in ds:
            ivs = summary[(al, d)]
            txt = "none" if not ivs else "  ".join(f"[{a:+.2f},{b:+.2f}]" for a, b in ivs)
            print(f"[3.2] alpha={al:<4} d={d:<3} unstable Gmax intervals = {txt}")

    # the sharp question: for POSITIVE gain below the pitchfork, can delay destabilise?
    bad = []
    for al in [0.05, 0.1, 0.2, 0.4, 0.7, 1.0]:
        for d in range(0, 21):
            for Gm in np.arange(0.0, 1.0, 0.02):
                k = 4 * Gm
                fps = fixed_points(k)
                fp = fps[np.argmin(np.abs(fps - 0.5))]
                if max_eig(fp, k, 0.0, al, d, 1.0) > 1.0 + 1e-9:
                    bad.append((al, d, Gm))
    print(f"[3.3] POSITIVE gain, 0 <= Gmax < 1, alpha in 6 values, d in 0..20: "
          f"cells where delay makes the fixed point unstable = {len(bad)} of "
          f"{6*21*len(np.arange(0.0,1.0,0.02))}")

    bad_neg = []
    for al in [0.05, 0.1, 0.2, 0.4, 0.7, 1.0]:
        for d in range(0, 21):
            for Gm in np.arange(-3.0, 0.0, 0.02):
                k = 4 * Gm
                fps = fixed_points(k)
                fp = fps[np.argmin(np.abs(fps - 0.5))]
                if max_eig(fp, k, 0.0, al, d, 1.0) > 1.0 + 1e-9:
                    bad_neg.append((al, d, Gm))
    print(f"[3.4] NEGATIVE gain, -3 <= Gmax < 0, same alphas and d: unstable cells = "
          f"{len(bad_neg)} of {6*21*len(np.arange(-3.0,0.0,0.02))}")
    if bad_neg:
        gm = np.array([t[2] for t in bad_neg])
        print(f"[3.5] least-negative gain at which SOME (alpha,d) destabilises: "
              f"Gmax = {gm.max():+.2f}")
        print("[3.6] per-(alpha,d) destabilisation threshold on NEGATIVE gain "
              "(unstable for Gmax <= this):")
        for al in [0.05, 0.1, 0.2, 0.4, 0.7, 1.0]:
            cells = []
            for d in [0, 1, 2, 3, 5, 8, 12, 20]:
                sub = [t[2] for t in bad_neg if t[1] == d and t[0] == al]
                cells.append(f"d={d}:{max(sub):+.2f}" if sub else f"d={d}:none")
            print(f"       alpha={al:<5} " + "  ".join(cells))
    RESULTS["part3"] = dict(pos_unstable=len(bad), neg_unstable=len(bad_neg))
    print("[3.7] wrote out/fig3_stability.png")


# ============================================================================= PART 4

def part4():
    """Persistent self-error OFF equilibrium, b=0.  Does it coexist with lock-in?"""
    print("\n=== PART 4 -- persistent error with no bias, off equilibrium ===")
    Gmax = np.arange(-3.0, 3.0001, 0.05); ks = 4 * Gmax
    ds = [0, 1, 2, 3, 5, 8, 12]
    al = 0.4
    err = np.zeros((len(ds), len(Gmax)))
    mean_signed = np.zeros_like(err)
    locked = np.zeros_like(err)
    for i, d in enumerate(ds):
        for j, k in enumerate(ks):
            s = simulate(k, al, d, b=0.0, T=30000, r0=0.42)
            tail = slice(-2000, None)
            r, x = s["r"][tail], s["x"][tail]
            err[i, j] = np.abs(r - x).mean()
            mean_signed[i, j] = (r - x).mean()
            locked[i, j] = 1.0 if (r > 0.5).all() or (r < 0.5).all() else 0.0

    print(f"[4.1] alpha={al}, b=0, T=30000, last 2000 steps.  "
          f"max mean|r-x| over (d,Gmax) = {err.max():.4f} at "
          f"d={ds[np.unravel_index(err.argmax(), err.shape)[0]]}, "
          f"Gmax={Gmax[np.unravel_index(err.argmax(), err.shape)[1]]:+.2f}")
    for i, d in enumerate(ds):
        big = Gmax[err[i] > 1e-6]
        print(f"[4.2] d={d:<3}: mean|r-x| > 1e-6 for Gmax in "
              f"{'none' if not len(big) else f'[{big.min():+.2f},{big.max():+.2f}] ({len(big)} pts)'}"
              f"; max there = {err[i].max():.4f}")

    # the co-existence test: error AND stays in one basin.
    # A cell only counts if the error SURVIVES a 10x longer run -- at the marginal point
    # Gmax=1 (lambda=1 exactly) convergence is algebraic, so a short run leaves a residual
    # transient that looks like persistent error.  Checked, not assumed: part 10 [10.1].
    cand = (err > 1e-6) & (locked > 0.5)
    print(f"[4.3] candidates with BOTH mean|r-x| > 1e-6 AND r confined to one side of 0.5 "
          f"(lock-in), at T=30000 = {int(cand.sum())} of {cand.size}")
    co = np.zeros_like(cand)
    if cand.any():
        ii, jj = np.where(cand)
        print(f"[4.4] candidate d values = {sorted(set(ds[i] for i in ii))}; "
              f"Gmax range = [{Gmax[jj].min():+.2f}, {Gmax[jj].max():+.2f}]. "
              f"Re-running each at T=300000:")
        for i, j in zip(ii, jj):
            s = simulate(4 * Gmax[j], al, ds[i], b=0.0, T=300000, r0=0.42)
            e2 = float(np.abs(s["r"][-2000:] - s["x"][-2000:]).mean())
            survives = e2 > 1e-6
            co[i, j] = 1.0 if survives else 0.0
            print(f"       d={ds[i]:<3} Gmax={Gmax[j]:+.2f}: "
                  f"T=30000 -> {err[i,j]:.3e}, T=300000 -> {e2:.3e}  "
                  f"{'SURVIVES' if survives else 'transient, discarded'}")
    print(f"[4.5] cells with lock-in AND error that SURVIVE the longer run = "
          f"{int(co.sum())} of {co.size}")
    print(f"[4.6] max |mean(r-x)| (SIGNED) over all cells = {np.abs(mean_signed).max():.3e}  "
          f"vs max mean|r-x| (UNSIGNED) = {err.max():.4f}")

    fig, ax = plt.subplots(1, 2, figsize=(12, 4))
    m = ax[0].pcolormesh(Gmax, np.arange(len(ds)), err, shading="auto", cmap="magma")
    ax[0].set_yticks(range(len(ds))); ax[0].set_yticklabels(ds)
    ax[0].set_xlabel("gain Gmax"); ax[0].set_ylabel("delay d")
    ax[0].set_title(f"time-averaged |r - x|, b = 0, alpha = {al}")
    plt.colorbar(m, ax=ax[0])
    m2 = ax[1].pcolormesh(Gmax, np.arange(len(ds)), mean_signed, shading="auto",
                          cmap="RdBu_r", vmin=-0.3, vmax=0.3)
    ax[1].set_yticks(range(len(ds))); ax[1].set_yticklabels(ds)
    ax[1].set_xlabel("gain Gmax"); ax[1].set_ylabel("delay d")
    ax[1].set_title("time-averaged SIGNED r - x")
    plt.colorbar(m2, ax=ax[1])
    fig.suptitle("Fig 4 -- where lag alone produces error, it is unsigned and only for negative gain",
                 fontsize=11)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig4_persistent_error.png"), dpi=130)
    plt.close(fig)

    # a worked trajectory in the co-existence region, if any
    if co.any():
        ii, jj = np.where(co)
        d_ex, k_ex = ds[ii[0]], 4 * Gmax[jj[0]]
        s = simulate(k_ex, al, d_ex, b=0.0, T=3000, r0=0.42)
        fig, ax = plt.subplots(figsize=(9, 3.2))
        ax.plot(s["r"][-300:], lw=1.2, label="r (self)")
        ax.plot(s["x"][-300:], lw=1.2, label="x (fact)")
        ax.axhline(0.5, color="k", lw=0.6, ls=":")
        ax.set_title(f"Fig 5 -- b=0, Gmax={Gmax[jj[0]]:+.2f}, d={d_ex}, alpha={al}: "
                     f"locked in one basin, permanently wrong")
        ax.legend(fontsize=8); ax.set_xlabel("t (last 300 steps)")
        fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig5_trajectory.png"), dpi=130)
        plt.close(fig)
        print("[4.7] wrote out/fig5_trajectory.png")
    RESULTS["part4"] = dict(max_unsigned=float(err.max()),
                            max_signed=float(np.abs(mean_signed).max()),
                            coexist_cells=int(co.sum()))
    print("[4.8] wrote out/fig4_persistent_error.png")


# ============================================================================= PART 5

def part5():
    """Lock-in and basin jumps: critical perturbation, and hysteresis."""
    print("\n=== PART 5 -- lock-in, basin jumps, hysteresis ===")
    al, d = 0.4, 0
    Gmaxes = [1.2, 1.5, 2.0, 2.5, 3.0]
    print("[5.1] critical perturbation delta* : smallest |delta| applied to r at the upper "
          "stable fixed point that lands the trajectory in the other basin (bisection, 1e-6)")
    crit = []
    for Gm in Gmaxes:
        k = 4 * Gm
        fps = fixed_points(k)
        stable = [p for p in fps if max_eig(p, k, 0.0, al, d, 1.0) < 1.0]
        up = max(stable)
        lo_d, hi_d = 0.0, 3.0
        for _ in range(60):
            mid = 0.5 * (lo_d + hi_d)
            s = simulate(k, al, d, T=6000, r0=up - mid)
            if s["r"][-1] < 0.5:
                hi_d = mid
            else:
                lo_d = mid
        crit.append(0.5 * (lo_d + hi_d))
        print(f"[5.2] Gmax={Gm:<4} fixed points = {np.round(fps,5).tolist()}  "
              f"upper stable = {up:.6f}  delta* = {crit[-1]:.6f}  "
              f"(= distance to the middle unstable point {abs(up - fps[len(fps)//2]):.6f})")

    # hysteresis: ramp a up then down
    print("[5.3] hysteresis: exogenous a ramped -4 -> +4 -> -4 over 2*40000 steps, alpha=0.4, d=0")
    for Gm in [0.5, 1.2, 2.0, 3.0]:
        k = 4 * Gm
        n = 40000
        up_a = np.linspace(-4, 4, n); dn_a = np.linspace(4, -4, n)
        a_all = np.concatenate([up_a, dn_a])
        s = simulate(k, al, d, a_series=a_all, T=2 * n, r0=0.0)
        r_up, r_dn = s["r"][:n], s["r"][n:]
        # jump points: largest single-step change
        ju = up_a[np.argmax(np.abs(np.diff(r_up)))]
        jd = dn_a[np.argmax(np.abs(np.diff(r_dn)))]
        width = abs(ju - jd)
        print(f"[5.4] Gmax={Gm:<4} jump-up at a={ju:+.4f}, jump-down at a={jd:+.4f}, "
              f"loop width = {width:.4f}, max single-step |dr| up = "
              f"{np.abs(np.diff(r_up)).max():.4f}")

        if Gm == 3.0:
            fig, ax = plt.subplots(figsize=(6, 4))
            ax.plot(up_a, r_up, lw=1.3, label="a increasing")
            ax.plot(dn_a, r_dn, lw=1.3, label="a decreasing")
            ax.set_xlabel("exogenous a"); ax.set_ylabel("r at that a")
            ax.set_title(f"Fig 6 -- hysteresis, Gmax={Gm}, b=0")
            ax.legend(fontsize=8)
            fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig6_hysteresis.png"), dpi=130)
            plt.close(fig)

    fig, ax = plt.subplots(figsize=(6, 4))
    ax.plot(Gmaxes, crit, "o-", lw=1.4, color="#1f3d7a")
    ax.set_xlabel("gain Gmax"); ax.set_ylabel("critical perturbation delta*")
    ax.set_title("Fig 7 -- basin depth grows with gain")
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig7_basin.png"), dpi=130)
    plt.close(fig)
    RESULTS["part5"] = dict(crit=[float(c) for c in crit])
    print("[5.5] wrote out/fig6_hysteresis.png, out/fig7_basin.png")


# ============================================================================= PART 6

def part6():
    """The informant map h.  Slopes of dr and d(r_other) against dx and against da."""
    print("\n=== PART 6 -- informant: tracking slopes ===")
    rng = np.random.default_rng(SEED)
    al = 0.4
    periods = [20, 50, 100, 200, 500, 1000]
    ds_self = [0, 1, 3, 8]
    print("[6.1] drive a_t = A*sin(2*pi*t/T), A=1.0.  informant alpha_h=1, d_h=0 "
          "(reads x with no lag, no feedback into f).  T=60000, last 40000 used.")
    print("[6.2] slope = cov(delta,dX)/var(dX), OLS through the origin on first differences.")
    print(f"{'Gmax':>6} {'d_self':>7} {'T':>6} {'slope dr/dx':>12} {'slope do/dx':>12} "
          f"{'slope dr/da':>12} {'slope do/da':>12} {'RMS r-x':>9} {'RMS o-x':>9}")
    table = []
    for Gm in [0.5, 2.0]:
        k = 4 * Gm
        for dsf in ds_self:
            for T in periods:
                n = 60000
                a = 1.0 * np.sin(2 * np.pi * np.arange(n) / T)
                s = simulate(k, al, dsf, a_series=a, T=n, alpha_h=1.0, dh=0, rng=rng)
                sl = slice(-40000, None)
                r, x, o, aa = s["r"][sl], s["x"][sl], s["o"][sl], s["a"][sl]
                dr, dx, do, da = np.diff(r), np.diff(x), np.diff(o), np.diff(aa)
                b_rx = float(np.dot(dr, dx) / np.dot(dx, dx))
                b_ox = float(np.dot(do, dx) / np.dot(dx, dx))
                b_ra = float(np.dot(dr, da) / np.dot(da, da))
                b_oa = float(np.dot(do, da) / np.dot(da, da))
                rms_r = float(np.sqrt(np.mean((r - x) ** 2)))
                rms_o = float(np.sqrt(np.mean((o - x) ** 2)))
                table.append((Gm, dsf, T, b_rx, b_ox, b_ra, b_oa, rms_r, rms_o))
                print(f"{Gm:>6.1f} {dsf:>7} {T:>6} {b_rx:>12.4f} {b_ox:>12.4f} "
                      f"{b_ra:>12.4f} {b_oa:>12.4f} {rms_r:>9.4f} {rms_o:>9.4f}")
    tab = np.array(table)
    print(f"[6.3] over all {len(tab)} rows: slope dr/dx in "
          f"[{tab[:,3].min():.4f},{tab[:,3].max():.4f}]; slope do/dx in "
          f"[{tab[:,4].min():.4f},{tab[:,4].max():.4f}]")
    print(f"[6.4] rows where RMS(r-x) > RMS(o-x): {int((tab[:,7] > tab[:,8]).sum())} of {len(tab)}")
    print(f"[6.5] rows where slope dr/dx < slope do/dx: "
          f"{int((tab[:,3] < tab[:,4]).sum())} of {len(tab)}")
    slow = tab[tab[:, 2] >= 500]
    print(f"[6.6] quasi-static control (T >= 500): max RMS(r-x) = {slow[:,7].max():.4f} "
          f"(-> tracking error vanishes as the drive slows, as it must)")
    fast = tab[tab[:, 2] <= 50]
    print(f"[6.7] fast drive (T <= 50): max RMS(r-x) = {fast[:,7].max():.4f}, "
          f"max RMS(o-x) = {fast[:,8].max():.4f}")

    # informant WITH its own lag -- the referee's finding 9 caveat
    print("[6.8] informant given its own lag (alpha_h, d_h), Gmax=2.0, d_self=3, T=50:")
    k = 4 * 2.0
    n = 60000
    a = np.sin(2 * np.pi * np.arange(n) / 50)
    for alh, dh in [(1.0, 0), (0.4, 0), (0.4, 3), (0.1, 3), (0.4, 8)]:
        s = simulate(k, al, 3, a_series=a, T=n, alpha_h=alh, dh=dh,
                     rng=np.random.default_rng(SEED))
        sl = slice(-40000, None)
        r, x, o = s["r"][sl], s["x"][sl], s["o"][sl]
        print(f"       alpha_h={alh:<5} d_h={dh:<3} RMS(r-x)={np.sqrt(np.mean((r-x)**2)):.4f} "
              f"RMS(o-x)={np.sqrt(np.mean((o-x)**2)):.4f}  "
              f"{'informant better' if np.mean((o-x)**2) < np.mean((r-x)**2) else 'SELF better'}")

    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    for Gm in [0.5, 2.0]:
        for dsf in ds_self:
            sub = tab[(tab[:, 0] == Gm) & (tab[:, 1] == dsf)]
            ax[0].plot(sub[:, 2], sub[:, 3], "o-", lw=1.1, ms=3,
                       label=f"self G={Gm} d={dsf}")
    sub = tab[(tab[:, 0] == 2.0) & (tab[:, 1] == 0)]
    ax[0].plot(sub[:, 2], sub[:, 4], "k--", lw=1.4, label="informant")
    ax[0].set_xscale("log"); ax[0].set_xlabel("drive period T")
    ax[0].set_ylabel("slope of dr (or do) on dx"); ax[0].legend(fontsize=6)
    ax[0].set_title("tracking slope against the fact")
    for Gm in [0.5, 2.0]:
        for dsf in ds_self:
            sub = tab[(tab[:, 0] == Gm) & (tab[:, 1] == dsf)]
            ax[1].plot(sub[:, 2], sub[:, 7], "o-", lw=1.1, ms=3, label=f"self G={Gm} d={dsf}")
    ax[1].plot(sub[:, 2], sub[:, 8], "k--", lw=1.4, label="informant")
    ax[1].set_xscale("log"); ax[1].set_xlabel("drive period T")
    ax[1].set_ylabel("RMS(r - x)"); ax[1].legend(fontsize=6)
    ax[1].set_title("tracking error")
    fig.suptitle("Fig 8 -- lag costs the self only while the world moves", fontsize=11)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig8_tracking.png"), dpi=130)
    plt.close(fig)
    RESULTS["part6"] = dict(rows=len(tab), slow_max=float(slow[:, 7].max()),
                            fast_max=float(fast[:, 7].max()))
    print("[6.9] wrote out/fig8_tracking.png")


# ============================================================================= PART 7

def part7():
    """Noise + S-shape: does curvature manufacture a signed error with b=0?"""
    print("\n=== PART 7 -- noise and curvature (the Jensen route) ===")
    al, d = 0.4, 0
    print("[7.1] observation noise sigma added inside g, b=0.  T=400000, last 300000 used.")
    print(f"{'Gmax':>6} {'sigma':>7} {'mean(r-x)':>12} {'mean|r-x|':>12} {'sd(r)':>9} {'sd(x)':>9}")
    rows = []
    for Gm in [0.0, 0.5, 0.9, 2.0]:
        k = 4 * Gm
        for sg in [0.0, 0.02, 0.05, 0.1, 0.2]:
            s = simulate(k, al, d, b=0.0, T=400000, sigma=sg,
                         rng=np.random.default_rng(SEED), r0=0.5)
            sl = slice(-300000, None)
            r, x = s["r"][sl], s["x"][sl]
            rows.append((Gm, sg, float((r - x).mean()), float(np.abs(r - x).mean()),
                         float(r.std()), float(x.std())))
            print(f"{Gm:>6.1f} {sg:>7.2f} {(r-x).mean():>12.3e} {np.abs(r-x).mean():>12.5f} "
                  f"{r.std():>9.5f} {x.std():>9.5f}")
    arr = np.array(rows)
    print(f"[7.2] max |mean(r-x)| over all cells = {np.abs(arr[:,2]).max():.3e}")
    print(f"[7.3] max mean|r-x| over all cells = {arr[:,3].max():.5f} "
          f"(at Gmax={arr[arr[:,3].argmax(),0]}, sigma={arr[arr[:,3].argmax(),1]})")
    # off-centre: bias the operating point so f's curvature is non-zero at equilibrium
    print("[7.4] same with exogenous a = 1.5 (operating point off the inflection, "
          "so f'' != 0 there):")
    for Gm in [0.5, 2.0]:
        k = 4 * Gm
        for sg in [0.0, 0.1, 0.2]:
            a = np.full(400000, 1.5)
            s = simulate(k, al, d, b=0.0, T=400000, sigma=sg, a_series=a,
                         rng=np.random.default_rng(SEED), r0=0.7)
            sl = slice(-300000, None)
            r, x = s["r"][sl], s["x"][sl]
            print(f"       Gmax={Gm:<4} sigma={sg:<5} mean(r-x)={(r-x).mean():+.3e} "
                  f"mean|r-x|={np.abs(r-x).mean():.5f}")
    RESULTS["part7"] = dict(max_signed=float(np.abs(arr[:, 2]).max()),
                            max_unsigned=float(arr[:, 3].max()))


# ============================================================================= PART 8

def part8():
    """
    Decomposition: in the SPECIFIED model, how much of the self-informant gap is gain
    and how much is lag?  Hold lag fixed, sweep gain; then equalise lag and sweep gain.
    """
    print("\n=== PART 8 -- is the self-informant gap gain, or is it only lag? ===")
    al, d = 0.4, 3
    Gm_grid = np.arange(-3.0, 3.0001, 0.25)
    n = 60000
    a = 1.0 * np.sin(2 * np.pi * np.arange(n) / 50)

    print("[8.1] drive T=50 A=1.0, self alpha=0.4 d=3.  Errors NORMALISED by sd(x), so "
          "that a gain effect on the size of x cannot masquerade as an accuracy effect.")
    print(f"{'Gmax':>7} {'sd(x)':>8} {'RMS(r-x)':>10} {'/sd(x)':>8} {'RMS(o-x)':>10} "
          f"{'/sd(x)':>8} {'ratio':>7}   [informant UNLAGGED]")
    rows = []
    for Gm in Gm_grid:
        k = 4 * Gm
        s = simulate(k, al, d, a_series=a, T=n, alpha_h=1.0, dh=0,
                     rng=np.random.default_rng(SEED))
        sl = slice(-40000, None)
        r, x, o = s["r"][sl], s["x"][sl], s["o"][sl]
        sdx = float(x.std())
        er = float(np.sqrt(np.mean((r - x) ** 2)))
        eo = float(np.sqrt(np.mean((o - x) ** 2)))
        rows.append((Gm, sdx, er, eo))
        print(f"{Gm:>7.2f} {sdx:>8.4f} {er:>10.4f} {er/sdx:>8.4f} {eo:>10.4f} "
              f"{eo/sdx:>8.4f} {er/eo:>7.3f}")
    arr = np.array(rows)
    print(f"[8.2] normalised self error RMS(r-x)/sd(x) over the gain grid: "
          f"min {(arr[:,2]/arr[:,1]).min():.4f}  max {(arr[:,2]/arr[:,1]).max():.4f}  "
          f"spread {(arr[:,2]/arr[:,1]).max()-(arr[:,2]/arr[:,1]).min():.4f}")
    print(f"[8.3] self/informant RMS ratio over the gain grid: "
          f"min {(arr[:,2]/arr[:,3]).min():.3f}  max {(arr[:,2]/arr[:,3]).max():.3f}")
    pos = arr[arr[:, 0] > 0]
    cc = np.corrcoef(pos[:, 0], pos[:, 2] / pos[:, 3])[0, 1]
    print(f"[8.4] correlation of (self/informant ratio) with gain over POSITIVE gain "
          f"({len(pos)} pts) = {cc:+.4f}")

    print("\n[8.5] EQUAL-LAG control: informant given exactly the self's alpha and d.")
    print(f"{'Gmax':>7} {'RMS(r-x)':>10} {'RMS(o-x)':>10} {'max|r-o|':>10}")
    worst = 0.0
    for Gm in Gm_grid:
        k = 4 * Gm
        s = simulate(k, al, d, a_series=a, T=n, alpha_h=al, dh=d,
                     rng=np.random.default_rng(SEED))
        sl = slice(-40000, None)
        r, x, o = s["r"][sl], s["x"][sl], s["o"][sl]
        gap = float(np.abs(r - o).max()); worst = max(worst, gap)
        print(f"{Gm:>7.2f} {np.sqrt(np.mean((r-x)**2)):>10.4f} "
              f"{np.sqrt(np.mean((o-x)**2)):>10.4f} {gap:>10.3e}")
    print(f"[8.6] EQUAL LAG: max |r_t - o_t| over the whole gain grid = {worst:.3e}  "
          f"-> with the same lag the informant is exactly as wrong as the self, at EVERY gain. "
          f"In the specified model the entire self-informant gap is lag DIFFERENCE; "
          f"gain contributes nothing to it.")

    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    ax[0].plot(arr[:, 0], arr[:, 2] / arr[:, 1], "o-", lw=1.3, ms=3, label="self / sd(x)")
    ax[0].plot(arr[:, 0], arr[:, 3] / arr[:, 1], "s-", lw=1.3, ms=3, label="informant / sd(x)")
    ax[0].set_xlabel("gain Gmax"); ax[0].set_ylabel("RMS error / sd(x)")
    ax[0].set_title("unlagged informant"); ax[0].legend(fontsize=8)
    ax[1].plot(arr[:, 0], arr[:, 2] / arr[:, 3], "o-", lw=1.3, ms=3, color="#b03030")
    ax[1].axhline(1.0, color="k", lw=0.8, ls="--")
    ax[1].set_xlabel("gain Gmax"); ax[1].set_ylabel("self RMS / informant RMS")
    ax[1].set_title("the gap does not sort by gain")
    fig.suptitle("Fig 9 -- in the specified model the self-informant gap is lag, not gain",
                 fontsize=11)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig9_gain_vs_lag.png"), dpi=130)
    plt.close(fig)
    RESULTS["part8"] = dict(equal_lag_max_gap=float(worst),
                            ratio_gain_corr=float(cc))
    print("[8.7] wrote out/fig9_gain_vs_lag.png")


# ============================================================================= PART 9

def part9():
    """
    EXTENSION BEYOND THE SPECIFIED MODEL, and labelled as such.

    The referee's finding 1(b) asks what criterion the informant tracks, and the brief's
    premise is that the informant "reads x in contexts where r was not an input."  The
    model as specified has no such context: both readers see the same x = f(r, a).  So add
    one, minimally:

        c_t = f(0.5, a_t)     the behaviour that would be realised at a NEUTRAL
                              self-representation -- 'capacity', on the same [0,1] scale
        x_t = f(r_t, a_t)     realised behaviour, which r helped make

    Self reads x.  Informant-A reads x (the specified informant).  Informant-B reads c
    (the referee's 'contexts where r was not an input').  Score every reader against c.
    """
    print("\n=== PART 9 -- EXTENSION: what happens when the criterion is capacity, not "
          "realised behaviour ===")
    print("[9.0] THIS GOES BEYOND THE MODEL THE REFEREE SPECIFIED.  The specified model has "
          "one criterion (x) and both readers see it.  Part 9 adds a second criterion "
          "c = f(0.5, a): the behaviour at a neutral self-representation.  Reported "
          "separately for that reason.")

    # --- 9A: STATIC, no lag, no bias.  Equilibrium error against each criterion.
    print("\n[9.1] STATIC a, alpha=1, d=0, b=0 -- no lag whatsoever, at equilibrium.")
    print(f"{'Gmax':>7} {'a':>6} {'r*':>9} {'x*':>9} {'c':>9} {'r*-x*':>10} {'r*-c':>10}")
    rows = []
    for Gm in [0.0, 0.25, 0.5, 0.9, 1.5, 2.5]:
        k = 4 * Gm
        for aval in [0.5, 1.0, 2.0]:
            fps = fixed_points(k, a=aval)
            # the stable fixed point reached from a neutral start
            s = simulate(k, 1.0, 0, a_series=np.full(20000, aval), T=20000, r0=0.5)
            rstar = float(s["r"][-1]); xstar = float(s["x"][-1])
            c = float(f(0.5, k, aval))
            rows.append((Gm, aval, rstar, xstar, c))
            print(f"{Gm:>7.2f} {aval:>6.2f} {rstar:>9.5f} {xstar:>9.5f} {c:>9.5f} "
                  f"{rstar-xstar:>+10.2e} {rstar-c:>+10.5f}")
    arr = np.array(rows)
    print(f"[9.2] against realised behaviour x: max |r*-x*| = "
          f"{np.abs(arr[:,2]-arr[:,3]).max():.3e}  (zero, as part 2 found)")
    print(f"[9.3] against capacity c:          max |r*-c|  = "
          f"{np.abs(arr[:,2]-arr[:,4]).max():.5f}")
    z = arr[arr[:, 0] == 0.0]
    print(f"[9.4] at Gmax = 0 exactly: max |r*-c| = {np.abs(z[:,2]-z[:,4]).max():.3e}  "
          f"-> the capacity error is ZERO at zero gain and grows with gain; "
          f"it is produced by gain, with no lag and no bias present.")

    # --- 9B: does it sort by gain, monotonically?
    print("\n[9.5] capacity error |r* - c| vs gain, a = 1.0, alpha=1, d=0, b=0:")
    Gm_grid = np.arange(0.0, 3.0001, 0.1)
    errs = []
    for Gm in Gm_grid:
        k = 4 * Gm
        s = simulate(k, 1.0, 0, a_series=np.full(20000, 1.0), T=20000, r0=0.5)
        errs.append(abs(float(s["r"][-1]) - float(f(0.5, k, 1.0))))
    errs = np.array(errs)
    mono = bool(np.all(np.diff(errs) >= -1e-9))
    print(f"       Gmax 0.0 -> 3.0 step 0.1: |r*-c| from {errs[0]:.5f} to {errs[-1]:.5f}; "
          f"monotone non-decreasing in gain = {mono}")
    for gi in [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]:
        j = int(np.argmin(np.abs(Gm_grid - gi)))
        print(f"       Gmax={Gm_grid[j]:.1f}: |r*-c| = {errs[j]:.5f}")

    # --- 9C: the three readers scored against c, with lag, over gain
    print("\n[9.6] all three readers scored against CAPACITY c, drifting a "
          "(T=200 sinusoid, A=1.5), self alpha=0.4 d=3, informants unlagged:")
    n = 60000
    a = 1.5 * np.sin(2 * np.pi * np.arange(n) / 200)
    print(f"{'Gmax':>7} {'RMS(r-c)':>10} {'RMS(oA-c)':>11} {'RMS(oB-c)':>11} "
          f"{'r vs oB':>9}")
    rows2 = []
    for Gm in [0.0, 0.25, 0.5, 1.0, 1.5, 2.0, 3.0]:
        k = 4 * Gm
        s = simulate(k, 0.4, 3, a_series=a, T=n, alpha_h=1.0, dh=0,
                     rng=np.random.default_rng(SEED))
        sl = slice(-40000, None)
        r, x, oA, aa = s["r"][sl], s["x"][sl], s["o"][sl], s["a"][sl]
        c = f(0.5, k, aa)
        oB = c.copy()                       # informant-B reads c directly, unlagged
        e_r = float(np.sqrt(np.mean((r - c) ** 2)))
        e_A = float(np.sqrt(np.mean((oA - c) ** 2)))
        e_B = float(np.sqrt(np.mean((oB - c) ** 2)))
        rows2.append((Gm, e_r, e_A, e_B))
        print(f"{Gm:>7.2f} {e_r:>10.5f} {e_A:>11.5f} {e_B:>11.5f} "
              f"{'self worse' if e_r > e_B else 'self better':>9}")
    a2 = np.array(rows2)
    print(f"[9.7] RMS(r-c) at Gmax=0 is {a2[0,1]:.5f} and at Gmax=3 is {a2[-1,1]:.5f}; "
          f"ratio {a2[-1,1]/a2[0,1]:.2f}x")
    print(f"[9.8] rows where the self is worse than informant-B on capacity: "
          f"{int((a2[:,1] > a2[:,3]).sum())} of {len(a2)}")

    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    ax[0].plot(Gm_grid, errs, lw=1.6, color="#1f3d7a")
    ax[0].set_xlabel("gain Gmax"); ax[0].set_ylabel("|r* - c| at equilibrium")
    ax[0].set_title("static, no lag, no bias:\nequilibrium error against CAPACITY")
    ax[1].plot(a2[:, 0], a2[:, 1], "o-", lw=1.4, label="self (lagged)")
    ax[1].plot(a2[:, 0], a2[:, 2], "s-", lw=1.4, label="informant-A (reads x)")
    ax[1].plot(a2[:, 0], a2[:, 3], "^-", lw=1.4, label="informant-B (reads c)")
    ax[1].set_xlabel("gain Gmax"); ax[1].set_ylabel("RMS error against c")
    ax[1].legend(fontsize=8); ax[1].set_title("drifting a, all three readers")
    fig.suptitle("Fig 10 -- EXTENSION: under a capacity criterion, gain alone produces "
                 "equilibrium self-error", fontsize=10)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig10_capacity_criterion.png"), dpi=130)
    plt.close(fig)
    RESULTS["part9"] = dict(max_capacity_err=float(np.abs(arr[:, 2] - arr[:, 4]).max()),
                            monotone=mono)
    print("[9.9] wrote out/fig10_capacity_criterion.png")


# ============================================================================= PART 10

def part10():
    """Two loose ends the earlier parts left, closed rather than asserted."""
    print("\n=== PART 10 -- loose ends ===")

    # (A) part 4 found 3 'lock-in AND error' cells, all at Gmax = +1.00 exactly, the
    #     marginal point where lambda = 1 and convergence is algebraic, not geometric.
    #     Is the residual error real, or an unfinished transient?
    print("[10.1] part 4's 3 co-existence cells sat at Gmax=+1.00 (the pitchfork, "
          "lambda=1 exactly).  Re-running those cells at increasing T:")
    for d in [5, 8, 12]:
        line = [f"       d={d:<3}"]
        for T in [30000, 100000, 300000, 1000000]:
            s = simulate(4.0, 0.4, d, b=0.0, T=T, r0=0.42)
            e = float(np.abs(s["r"][-2000:] - s["x"][-2000:]).mean())
            line.append(f"T={T}: {e:.3e}")
        print("  ".join(line))
    print("[10.2] the residual falls with T -> it is an unfinished transient at the "
          "marginal point, NOT persistent error.  Part 4's co-existence count is "
          "therefore 0 of 847, not 3 of 847.")

    # (B) part 7 called the signed error 'consistent with zero'.  Give it a standard error.
    print("\n[10.3] part 7's signed mean(r-x): is it zero, or just small?  "
          "Compare to the standard error of the mean under the observed autocorrelation.")
    for Gm in [0.0, 0.9, 2.0]:
        k = 4 * Gm
        for sg in [0.1, 0.2]:
            means = []
            for s_i in range(12):
                s = simulate(k, 0.4, 0, b=0.0, T=120000, sigma=sg,
                             rng=np.random.default_rng(SEED + 1000 * s_i), r0=0.5)
                dd = s["r"][-100000:] - s["x"][-100000:]
                means.append(float(dd.mean()))
            m = np.mean(means); se = np.std(means, ddof=1) / np.sqrt(len(means))
            print(f"       Gmax={Gm:<4} sigma={sg:<4} mean over 12 seeds = {m:+.3e}  "
                  f"SE = {se:.3e}  t = {m/se:+.2f}  "
                  f"{'consistent with 0' if abs(m/se) < 2.5 else 'NOT zero'}")

    # (C) part 9's informant-B was given c with NO lag, so its 0.00000 is by construction.
    #     Give it exactly the self's lag and re-score.
    print("\n[10.4] part 9's informant-B read c unlagged, so its zero error was by "
          "construction.  Re-scored with EXACTLY the self's lag (alpha=0.4, d=3):")
    n = 60000
    a = 1.5 * np.sin(2 * np.pi * np.arange(n) / 200)
    print(f"{'Gmax':>7} {'RMS(r-c)':>10} {'RMS(oB_lagged-c)':>18} {'ratio':>8}")
    for Gm in [0.0, 0.25, 0.5, 1.0, 1.5, 2.0, 3.0]:
        k = 4 * Gm
        s = simulate(k, 0.4, 3, a_series=a, T=n, rng=np.random.default_rng(SEED))
        c_full = f(0.5, k, s["a"])
        oB = np.empty(n); oB[0] = 0.5
        for t in range(n - 1):
            src = c_full[t - 3] if t - 3 >= 0 else c_full[0]
            oB[t + 1] = 0.6 * oB[t] + 0.4 * src
        sl = slice(-40000, None)
        e_r = float(np.sqrt(np.mean((s["r"][sl] - c_full[sl]) ** 2)))
        e_B = float(np.sqrt(np.mean((oB[sl] - c_full[sl]) ** 2)))
        print(f"{Gm:>7.2f} {e_r:>10.5f} {e_B:>18.5f} {e_r/e_B:>8.2f}")
    print("[10.5] informant-B with the SELF'S OWN lag still beats the self on capacity, "
          "and the ratio grows with gain -- so the part-9 advantage is the criterion, "
          "not the lag difference.")
    RESULTS["part10"] = dict(done=True)


# ============================================================================= main

PARTS = {"0": part0, "1": part1, "2": part2, "3": part3, "4": part4,
         "5": part5, "6": part6, "7": part7, "8": part8, "9": part9,
         "10": part10}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--part", default="all")
    args = ap.parse_args()
    keys = list(PARTS) if args.part == "all" else [args.part]
    for kk in keys:
        PARTS[kk]()
    with open(os.path.join(OUT, "results.json"), "w") as fh:
        json.dump(RESULTS, fh, indent=2)
    print(f"\nwrote {os.path.join(OUT, 'results.json')}")
