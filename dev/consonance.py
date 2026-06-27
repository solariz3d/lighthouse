"""
Consonance — instance launcher & manager.

A small, elegant control surface for spinning up and reopening Claude instances,
instead of making a folder and typing the cmd incantation every time.

The intro embodies the signal: three dissonant waves (distinct vantages) resolving
into one consonant signal (confirmation, not a mirror). Vector logo, no image files.
Stdlib Tkinter only — no installs.

  py consonance.py
"""
import os
import json
import math
import tempfile
import subprocess
import tkinter as tk
from tkinter import ttk, font, filedialog

# ---- palette: deep-night signal ----
BG     = "#0B0E14"   # deepest
PANEL  = "#141A28"   # panel
PANEL2 = "#1B2335"   # raised field
LINE   = "#27304A"   # borders
TEXT   = "#E6EAF2"   # primary text
MUTED  = "#8893AD"   # secondary text
AQUA   = "#5EEAD4"   # the signal (primary accent)
AQUA_D = "#2BB7A3"   # dimmer signal
AMBER  = "#F2B880"   # live / active (sparingly)

CONFIG = os.path.expanduser("~/.consonance.json")
DEFAULT_BASE = os.path.expanduser("~/claude-instances")
DEFAULT_FLAGS = "--dangerously-skip-permissions --continue"


# ---- helpers ----------------------------------------------------------------
def hexlerp(a, b, t):
    """Blend two #rrggbb colors; t in [0,1]. Used for fades (canvas has no alpha)."""
    t = max(0.0, min(1.0, t))
    a, b = a.lstrip("#"), b.lstrip("#")
    ch = [int(a[i:i+2], 16) + (int(b[i:i+2], 16) - int(a[i:i+2], 16)) * t for i in (0, 2, 4)]
    return "#%02x%02x%02x" % tuple(int(c) for c in ch)


def load_cfg():
    if os.path.exists(CONFIG):
        try:
            return json.load(open(CONFIG, encoding="utf-8"))
        except Exception:
            pass
    cfg = {"base": DEFAULT_BASE, "flags": DEFAULT_FLAGS, "instances": []}
    # pre-seed known live instances so "this one" shows up without setup
    for nm, pth in [("606", os.path.expanduser("~/OneDrive/Desktop/606")),
                    ("lighthouse", os.path.expanduser("~/OneDrive/Desktop/projects/lighthouse"))]:
        if os.path.isdir(pth):
            cfg["instances"].append({"name": nm, "path": pth})
    return cfg


def save_cfg(cfg):
    try:
        json.dump(cfg, open(CONFIG, "w", encoding="utf-8"), indent=2)
    except Exception:
        pass


def launch(path, flags, title):
    """Open a new terminal in `path` running claude. Robust to spaces via a temp .bat."""
    os.makedirs(path, exist_ok=True)
    fd, bat = tempfile.mkstemp(suffix=".bat", prefix="consonance_")
    os.close(fd)
    with open(bat, "w", encoding="utf-8") as fh:
        fh.write(f'@echo off\ntitle {title}\ncd /d "{path}"\nclaude {flags}\n')
    subprocess.Popen(f'start "" cmd /k "{bat}"', shell=True)


def draw_mark(cv, cx, cy, r, glow=1.0):
    """The Consonance mark: resonance rings + three nodes coming into phase."""
    for i, frac in enumerate((1.0, 0.64, 0.30)):
        col = hexlerp(BG, AQUA, 0.18 + 0.22 * glow * (1 - i * 0.22))
        cv.create_oval(cx - r*frac, cy - r*frac, cx + r*frac, cy + r*frac, outline=col, width=2)
    for k in range(3):
        ang = -math.pi/2 + k * 2*math.pi/3
        nx, ny = cx + math.cos(ang)*r, cy + math.sin(ang)*r
        c = AMBER if k == 0 else AQUA
        d = 3.2
        cv.create_oval(nx-d, ny-d, nx+d, ny+d, fill=c, outline="")
    cv.create_oval(cx-2.4, cy-2.4, cx+2.4, cy+2.4, fill=AQUA, outline="")


# ---- intro splash -----------------------------------------------------------
class Splash:
    def __init__(self, root, on_done):
        self.root, self.on_done, self.alive, self.f = root, on_done, True, 0
        self.W, self.H, self.total = 660, 460, 116
        self.cv = tk.Canvas(root, width=self.W, height=self.H, bg=BG, highlightthickness=0)
        self.cv.pack(fill="both", expand=True)
        self.cv.bind("<Button-1>", lambda _e: self.finish())
        self.f_word = font.Font(family="Segoe UI Light", size=36)
        self.f_tag = font.Font(family="Segoe UI", size=10)
        self.f_skip = font.Font(family="Segoe UI", size=8)
        self.step()

    def step(self):
        if not self.alive:
            return
        cv, W, H, f = self.cv, self.W, self.H, self.f
        cv.delete("all")
        p = min(1.0, f / 84.0)
        ease = p * p * (3 - 2 * p)               # smoothstep
        y0 = H * 0.40
        drift = f * 0.05
        # three components: dissonant freqs -> harmonic 1:2:3, phases -> aligned
        starts = [(2.0, 0.4), (3.7, 2.1), (5.3, 4.0)]
        targets = [(2.0, 0.0), (4.0, 0.0), (6.0, 0.0)]
        amps = (1.0, 0.7, 0.5)
        comps = [(fs + (ft-fs)*ease, ps + (pt-ps)*ease) for (fs, ps), (ft, pt) in zip(starts, targets)]
        # expanding resonance rings from center
        cx = W / 2
        for k in range(3):
            rr = (f * 3 + k * 42) % 126
            if rr > 2:
                cv.create_oval(cx-rr, y0-rr, cx+rr, y0+rr,
                               outline=hexlerp(BG, AQUA, max(0, 0.26*(1 - rr/126))), width=1)
        # faint component waves
        for amp, (freq, ph) in zip(amps, comps):
            pts = []
            for x in range(0, W + 1, 4):
                u = x / W
                pts += [x, y0 - amp * math.sin(2*math.pi*freq*u + ph + drift) * 22]
            cv.create_line(*pts, fill=hexlerp(BG, AQUA, 0.16), width=1, smooth=True)
        # bright consonant sum
        flat = []
        for x in range(0, W + 1, 4):
            u = x / W
            s = sum(amp * math.sin(2*math.pi*freq*u + ph + drift) for amp, (freq, ph) in zip(amps, comps))
            flat += [x, y0 - s * 20]
        cv.create_line(*flat, fill=hexlerp(AQUA_D, AQUA, ease), width=2, smooth=True)
        # wordmark + tagline fade in late
        cv.create_text(W/2, H*0.73, text="CONSONANCE",
                       fill=hexlerp(BG, TEXT, max(0, (ease-0.55)/0.45)), font=self.f_word)
        cv.create_text(W/2, H*0.81, text="instances, in concert",
                       fill=hexlerp(BG, MUTED, max(0, (ease-0.72)/0.28)), font=self.f_tag)
        cv.create_text(W-14, H-12, text="click to enter", anchor="e",
                       fill=hexlerp(BG, MUTED, 0.5), font=self.f_skip)
        self.f += 1
        if f >= self.total:
            self.finish()
        else:
            self.root.after(26, self.step)

    def finish(self):
        if not self.alive:
            return
        self.alive = False
        self.cv.destroy()
        self.on_done()


# ---- main app ---------------------------------------------------------------
class App:
    def __init__(self, root):
        self.root = root
        self.cfg = load_cfg()
        self.base = tk.StringVar(value=self.cfg.get("base", DEFAULT_BASE))
        self.flags = tk.StringVar(value=self.cfg.get("flags", DEFAULT_FLAGS))
        self.name = tk.StringVar()
        self.status = tk.StringVar(value="ready")

        outer = ttk.Frame(root, style="BG.TFrame", padding=(20, 16))
        outer.pack(fill="both", expand=True)
        self._header(outer)
        nb = ttk.Notebook(outer)
        nb.pack(fill="both", expand=True, pady=(14, 8))
        self._tab_new(nb)
        self._tab_instances(nb)
        self._tab_about(nb)
        ttk.Label(outer, textvariable=self.status, style="Status.TLabel", anchor="w").pack(fill="x")
        self.refresh()

    def _header(self, parent):
        head = ttk.Frame(parent, style="BG.TFrame")
        head.pack(fill="x")
        cv = tk.Canvas(head, width=48, height=48, bg=BG, highlightthickness=0)
        cv.pack(side="left")
        draw_mark(cv, 24, 24, 18)
        txt = ttk.Frame(head, style="BG.TFrame")
        txt.pack(side="left", padx=12)
        ttk.Label(txt, text="Consonance", style="Title.TLabel").pack(anchor="w")
        ttk.Label(txt, text="instances, in concert", style="Sub.TLabel").pack(anchor="w")

    def _tab_new(self, nb):
        t = ttk.Frame(nb, style="Card.TFrame", padding=18)
        nb.add(t, text="  New  ")
        ttk.Label(t, text="instances folder", style="Field.TLabel").grid(row=0, column=0, sticky="w", pady=(0, 2))
        ttk.Entry(t, textvariable=self.base).grid(row=1, column=0, columnspan=2, sticky="we", pady=(0, 10))
        ttk.Label(t, text="claude flags", style="Field.TLabel").grid(row=2, column=0, sticky="w", pady=(0, 2))
        ttk.Entry(t, textvariable=self.flags).grid(row=3, column=0, columnspan=2, sticky="we", pady=(0, 10))
        ttk.Label(t, text="new instance name", style="Field.TLabel").grid(row=4, column=0, sticky="w", pady=(0, 2))
        e = ttk.Entry(t, textvariable=self.name)
        e.grid(row=5, column=0, sticky="we", pady=(0, 0))
        e.bind("<Return>", lambda _e: self.launch_new())
        ttk.Button(t, text="Launch", style="Accent.TButton", command=self.launch_new)\
            .grid(row=5, column=1, sticky="e", padx=(10, 0))
        t.columnconfigure(0, weight=1)

    def _tab_instances(self, nb):
        t = ttk.Frame(nb, style="Card.TFrame", padding=18)
        nb.add(t, text="  Instances  ")
        self.listbox = tk.Listbox(t, bg=PANEL2, fg=TEXT, selectbackground=AQUA_D,
                                  selectforeground=BG, borderwidth=0, highlightthickness=0,
                                  activestyle="none", font=("Segoe UI", 10))
        self.listbox.pack(side="left", fill="both", expand=True)
        self.listbox.bind("<Double-Button-1>", lambda _e: self.open_selected())
        side = ttk.Frame(t, style="Card.TFrame")
        side.pack(side="left", fill="y", padx=(12, 0))
        ttk.Button(side, text="Open", style="Accent.TButton", command=self.open_selected).pack(fill="x", pady=(0, 6))
        ttk.Button(side, text="Add existing", command=self.add_existing).pack(fill="x", pady=3)
        ttk.Button(side, text="Remove", command=self.remove_selected).pack(fill="x", pady=3)
        ttk.Button(side, text="Refresh", command=self.refresh).pack(fill="x", pady=3)

    def _tab_about(self, nb):
        t = ttk.Frame(nb, style="Card.TFrame", padding=18)
        nb.add(t, text="  About  ")
        cv = tk.Canvas(t, width=120, height=120, bg=PANEL, highlightthickness=0)
        cv.pack(pady=(8, 6))
        draw_mark(cv, 60, 60, 44)
        ttk.Label(t, text="Consonance", style="Title.TLabel").pack()
        ttk.Label(t, text="Distinct signals, brought into harmony.\n"
                          "A control surface for the living loop — spin up and rejoin\n"
                          "instances in one move, not a folder-and-cmd dance.",
                  style="Sub.TLabel", justify="center").pack(pady=(6, 0))

    # ---- behavior ----
    def _instances(self):
        return self.cfg.setdefault("instances", [])

    def refresh(self):
        self.listbox.delete(0, tk.END)
        for inst in self._instances():
            here = " *" if os.path.normcase(inst["path"]) == os.path.normcase(os.getcwd()) else ""
            self.listbox.insert(tk.END, f"  {inst['name']}{here}    {inst['path']}")
        self.status.set(f"{len(self._instances())} instance(s)   ( * = this folder )")

    def _persist(self):
        self.cfg["base"], self.cfg["flags"] = self.base.get(), self.flags.get()
        save_cfg(self.cfg)

    def launch_new(self):
        name = self.name.get().strip().replace(" ", "-")
        if not name:
            self.status.set("give the instance a name first")
            return
        path = os.path.join(self.base.get(), name)
        launch(path, self.flags.get(), f"Claude: {name}")
        if not any(os.path.normcase(i["path"]) == os.path.normcase(path) for i in self._instances()):
            self._instances().append({"name": name, "path": path})
        self._persist()
        self.name.set("")
        self.refresh()
        self.status.set(f"launched  {name}")

    def open_selected(self):
        sel = self.listbox.curselection()
        if not sel:
            self.status.set("select an instance to open")
            return
        inst = self._instances()[sel[0]]
        launch(inst["path"], self.flags.get(), f"Claude: {inst['name']}")
        self.status.set(f"opened  {inst['name']}")

    def add_existing(self):
        path = filedialog.askdirectory(title="Add an existing instance folder")
        if not path:
            return
        path = os.path.normpath(path)
        if not any(os.path.normcase(i["path"]) == os.path.normcase(path) for i in self._instances()):
            self._instances().append({"name": os.path.basename(path) or path, "path": path})
            self._persist()
            self.refresh()
            self.status.set(f"added  {os.path.basename(path)}")

    def remove_selected(self):
        sel = self.listbox.curselection()
        if not sel:
            return
        gone = self._instances().pop(sel[0])
        self._persist()
        self.refresh()
        self.status.set(f"removed  {gone['name']}  (folder untouched)")


# ---- theme + boot -----------------------------------------------------------
def style_app(root):
    st = ttk.Style(root)
    st.theme_use("clam")
    st.configure(".", background=BG, foreground=TEXT, font=("Segoe UI", 10))
    st.configure("BG.TFrame", background=BG)
    st.configure("Card.TFrame", background=PANEL)
    st.configure("Title.TLabel", background=BG, foreground=TEXT, font=("Segoe UI Light", 22))
    st.configure("Sub.TLabel", background=BG, foreground=MUTED, font=("Segoe UI", 10))
    st.configure("Field.TLabel", background=PANEL, foreground=MUTED, font=("Segoe UI", 9))
    st.configure("Status.TLabel", background=BG, foreground=MUTED, font=("Segoe UI", 9))
    st.configure("TEntry", fieldbackground=PANEL2, foreground=TEXT, insertcolor=AQUA,
                 bordercolor=LINE, lightcolor=LINE, darkcolor=LINE, borderwidth=1, padding=6)
    st.configure("TButton", background=PANEL2, foreground=TEXT, borderwidth=0, padding=(14, 7))
    st.map("TButton", background=[("active", LINE)])
    st.configure("Accent.TButton", background=AQUA, foreground=BG, borderwidth=0,
                 padding=(16, 7), font=("Segoe UI Semibold", 10))
    st.map("Accent.TButton", background=[("active", AQUA_D)])
    st.configure("TNotebook", background=BG, borderwidth=0, tabmargins=(0, 6, 0, 0))
    st.configure("TNotebook.Tab", background=BG, foreground=MUTED, borderwidth=0, padding=(16, 8))
    st.map("TNotebook.Tab", background=[("selected", PANEL)], foreground=[("selected", AQUA)])
    # Card frames host the About/About canvases — keep their bg consistent
    st.configure("Card.TLabel", background=PANEL, foreground=TEXT)


def center(root, w, h):
    root.update_idletasks()
    x = (root.winfo_screenwidth() - w) // 2
    y = (root.winfo_screenheight() - h) // 3
    root.geometry(f"{w}x{h}+{x}+{y}")


if __name__ == "__main__":
    root = tk.Tk()
    root.title("Consonance")
    root.configure(bg=BG)
    style_app(root)
    center(root, 660, 460)
    Splash(root, on_done=lambda: App(root))
    root.mainloop()
