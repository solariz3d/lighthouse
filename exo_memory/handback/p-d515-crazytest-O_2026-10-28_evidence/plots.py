# plots.py (D515, O): the three plots from table.csv. py -I plots.py <table.csv> <out dir>
import csv, sys, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

src, out = sys.argv[1], sys.argv[2]
rows = []
with open(src, newline="") as f:
    for r in csv.DictReader(f):
        rows.append({k: (float(v) if v not in ("", None) else float("nan")) for k, v in r.items()})

def col(k, rs=rows):
    return [r[k] for r in rs]

# 1. load against s, the geometry underneath (bank, climb, curvature into the road, and the load the line's curvature asks for)
fig, ax = plt.subplots(4, 1, figsize=(13, 10), sharex=True, gridspec_kw={"height_ratios": [3, 1, 1, 1]})
ax[0].scatter(col("s"), col("load"), s=2, c="#c0392b", label="measured load into the road")
ax[0].scatter(col("s"), col("predLoad"), s=1, c="#7f8c8d", label="asked by the AI line's curvature at the car's speed")
for y, lab, c in [(25, "suspension out of travel (~25 g)", "#2980b9"), (47, "box reaches the road surface (~47 g)", "#8e44ad"), (55, "rigid-tyre box under the road (~55 g)", "#d35400")]:
    ax[0].axhline(y, ls="--", lw=1, c=c, label=lab)
ax[0].set_ylabel("load (g)"); ax[0].legend(loc="upper left", fontsize=8); ax[0].set_title("CRAZY TEST, Mach 6 replay 28-10 09:36: load along the AI line, and the geometry under it (15:22Z export)")
ax[1].plot(col("s"), col("bank"), c="#16a085", lw=1); ax[1].set_ylabel("bank (°)")
ax[2].plot(col("s"), [k * 1000 for k in col("kn")], c="#2c3e50", lw=1); ax[2].set_ylabel("κ into road\n(1/km)")
ax[3].plot(col("s"), col("climb"), c="#f39c12", lw=1); ax[3].set_ylabel("climb (°)"); ax[3].set_xlabel("s along the AI line (m)")
for a in ax: a.grid(alpha=.3)
fig.tight_layout(); fig.savefig(os.path.join(out, "load-vs-s.png"), dpi=110); plt.close(fig)

# 1b. the same, zoomed on the high-load helix (piece 13)
z = [r for r in rows if 15500 <= r["s"] <= 19700]
fig, ax = plt.subplots(3, 1, figsize=(13, 8), sharex=True, gridspec_kw={"height_ratios": [3, 1, 1]})
ax[0].scatter(col("s", z), col("load", z), s=3, c="#c0392b", label="load (g)")
ax[0].scatter(col("s", z), [-(d) * 100 for d in col("depth", z)], s=3, c="#2980b9", label="rigid-tyre box clearance (cm; < 0 = under the road)")
ax[0].scatter(col("s", z), [b * 100 for b in col("boxOverMesh", z)], s=3, c="#8e44ad", label="box over the mesh surface (cm)")
ax[0].axhline(0, c="k", lw=.8); ax[0].legend(loc="lower left", fontsize=8); ax[0].set_title("piece 13, the descending helix at bank 85°: load and clearance")
ax[1].plot(col("s", z), col("R", z), c="#2c3e50", lw=1); ax[1].set_ylabel("horizontal\nR (m)"); ax[1].set_yscale("log")
ax[2].plot(col("s", z), col("kph", z), c="#e67e22", lw=1); ax[2].set_ylabel("km/h"); ax[2].set_xlabel("s along the AI line (m)")
for a in ax: a.grid(alpha=.3)
fig.tight_layout(); fig.savefig(os.path.join(out, "load-vs-s-piece13.png"), dpi=110); plt.close(fig)

# 2. height over the wheels against load, with the clearance over the mesh
fig, ax = plt.subplots(1, 2, figsize=(13, 5.5))
sc = ax[0].scatter(col("load"), [h * 100 for h in col("h")], s=2, c=col("t"), cmap="viridis")
ax[0].axhline(-34.5, ls="--", c="#d35400", lw=1, label="rigid-tyre box at the road (h = -34.5 cm)")
ax[0].axhline(-20.4, ls=":", c="#2980b9", lw=1, label="suspension plateau (-20.4 cm, 40-45 g median)")
ax[0].set_xlabel("load into the road (g)"); ax[0].set_ylabel("body over the wheel-centre plane, h (cm)"); ax[0].legend(fontsize=8); ax[0].grid(alpha=.3)
fig.colorbar(sc, ax=ax[0], label="t (s)")
ax[1].scatter(col("load"), [b * 100 for b in col("boxOverMesh")], s=2, c="#8e44ad")
ax[1].axhline(0, c="k", lw=.8); ax[1].set_xlabel("load into the road (g)"); ax[1].set_ylabel("collision box over the mesh surface (cm)"); ax[1].grid(alpha=.3)
ax[1].set_title("box over the road mesh (along the car's normal)", fontsize=10); ax[0].set_title("height over the wheels against load", fontsize=10)
fig.tight_layout(); fig.savefig(os.path.join(out, "height-vs-load.png"), dpi=110); plt.close(fig)
print("written", [n for n in os.listdir(out) if n.endswith(".png")])
