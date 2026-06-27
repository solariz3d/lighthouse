"""
Lighthouse — instance launcher. A tiny GUI to spin up and reopen Claude instances fast,
instead of making a folder and typing `claude --dangerously-skip-permissions --continue`
in cmd every single time.

  py launcher.py

(Standard-library Tkinter, no installs. Keep the instances-folder path space-free for now.)
"""
import os
import subprocess
import tkinter as tk
from tkinter import ttk

DEFAULT_BASE = os.path.expanduser("~/claude-instances")
DEFAULT_FLAGS = "--dangerously-skip-permissions --continue"


def _launch(folder, flags, title):
    """Open a NEW terminal window, cd into the folder, run claude (stays open via /k)."""
    os.makedirs(folder, exist_ok=True)
    subprocess.Popen(f'start "{title}" cmd /k "cd /d {folder} && claude {flags}"', shell=True)


class Launcher:
    def __init__(self, root):
        root.title("Lighthouse — instances")
        root.geometry("560x440")
        pad = dict(padx=8, pady=4)

        top = ttk.Frame(root); top.pack(fill="x", **pad)
        ttk.Label(top, text="instances folder").grid(row=0, column=0, sticky="w")
        self.base = tk.StringVar(value=DEFAULT_BASE)
        ttk.Entry(top, textvariable=self.base).grid(row=0, column=1, sticky="we")
        ttk.Label(top, text="claude flags").grid(row=1, column=0, sticky="w")
        self.flags = tk.StringVar(value=DEFAULT_FLAGS)
        ttk.Entry(top, textvariable=self.flags).grid(row=1, column=1, sticky="we")
        top.columnconfigure(1, weight=1)

        new = ttk.Frame(root); new.pack(fill="x", **pad)
        ttk.Label(new, text="new instance").grid(row=0, column=0, sticky="w")
        self.name = tk.StringVar()
        e = ttk.Entry(new, textvariable=self.name); e.grid(row=0, column=1, sticky="we")
        e.bind("<Return>", lambda _e: self.launch_new())
        ttk.Button(new, text="Launch  >", command=self.launch_new).grid(row=0, column=2, padx=4)
        new.columnconfigure(1, weight=1)

        ttk.Label(root, text="open an existing instance  (double-click)").pack(anchor="w", padx=8)
        mid = ttk.Frame(root); mid.pack(fill="both", expand=True, **pad)
        self.listbox = tk.Listbox(mid)
        self.listbox.pack(side="left", fill="both", expand=True)
        self.listbox.bind("<Double-Button-1>", lambda _e: self.open_selected())
        side = ttk.Frame(mid); side.pack(side="left", fill="y", padx=6)
        ttk.Button(side, text="Open  >", command=self.open_selected).pack(fill="x", pady=2)
        ttk.Button(side, text="Refresh", command=self.refresh).pack(fill="x", pady=2)

        self.status = tk.StringVar(value="ready")
        ttk.Label(root, textvariable=self.status, relief="sunken", anchor="w").pack(fill="x", side="bottom")
        self.refresh()

    def refresh(self):
        self.listbox.delete(0, tk.END)
        base = self.base.get()
        if os.path.isdir(base):
            for d in sorted(os.listdir(base)):
                if os.path.isdir(os.path.join(base, d)):
                    self.listbox.insert(tk.END, d)
        self.status.set(f"{self.listbox.size()} instance(s) in {base}")

    def launch_new(self):
        name = self.name.get().strip().replace(" ", "-")
        if not name:
            self.status.set("give the instance a name first")
            return
        _launch(os.path.join(self.base.get(), name), self.flags.get(), f"Claude: {name}")
        self.status.set(f"launched  {name}")
        self.name.set("")
        self.refresh()

    def open_selected(self):
        sel = self.listbox.curselection()
        if not sel:
            self.status.set("select an instance to open")
            return
        name = self.listbox.get(sel[0])
        _launch(os.path.join(self.base.get(), name), self.flags.get(), f"Claude: {name}")
        self.status.set(f"opened  {name}")


if __name__ == "__main__":
    root = tk.Tk()
    Launcher(root)
    root.mainloop()
