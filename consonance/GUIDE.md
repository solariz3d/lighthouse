# Consonance — a simple guide

A native desktop app that runs several Claude Code instances in one window, where they check each other's work and their own — so the AI works with you honestly, and you stay in control. This is the short how-to; for the full reference and a glossary, see [`README.md`](README.md#glossary).

---

## 1. Install

You'll need:

- **Rust** (via [rustup](https://rustup.rs)) and the **Tauri CLI**
- **WebView2** (already on Windows 11) and **MSVC build tools** — Visual Studio 2022 Build Tools with the "Desktop development with C++" workload
- The **Claude Code CLI** (`claude`) on your PATH — Consonance runs *real* `claude` sessions, not an imitation
- **Node.js** on your PATH — the hooks (the checks that run inside each session) are Node scripts
- **Python 3** — a real `python.exe` on your PATH or in `%LOCALAPPDATA%\Programs\Python`, not the Microsoft Store stub; one hook (the pulse) is Python
- **Git** on your PATH — to clone the repo, and because the launch shortcut and the USB scripts below run `git pull`

Install Node and Python **before** the hooks step below: the installer writes the path it finds into each hook, and finds nothing if they are not there yet.

```bat
cargo install tauri-cli --version "^2.0"
cd consonance
cargo tauri build          :: installer + exe   (or: cargo tauri build --no-bundle for just the exe)
```

To run it live while developing, skip the build and use `cargo tauri dev`.
(Kill any running `consonance.exe` before rebuilding — it holds a file lock.)

### Then, the hooks

The app is half of it: the checks that keep the sessions honest run as **Claude Code hooks**. From the repo root:

```bat
powershell -ExecutionPolicy Bypass -File dev\shell\install.ps1
```

It copies the hooks to `%USERPROFILE%\.claude\shell` and registers them in `%USERPROFILE%\.claude\settings.json`. If you have no `settings.json` yet, it creates an empty one and says so; one you have is merged into, never replaced, and backed up first. To see what it would register without changing `settings.json`, add `-NoRegister` (it still copies the hooks).

**One hook spends your Claude usage on its own: the second reader.** Each time a seat rings another, it runs one extra `claude -p` call (Sonnet) in
the background to check that message against the turn that produced it. That is roughly two cents of usage per ring (median, as the CLI reports it); where it was built, a busy
multi-seat day ran 9 to 133 rings. It is on by default; what it does and how to turn it off are in [`GATES.md`](GATES.md), "the second reader".

The hooks keep their records in the same **Data folder** as the app (Settings, below; `%USERPROFILE%\.consonance` until you choose another), so it does not matter whether you run this before or after the first launch.

---

## 2. First launch — Settings

The first time it opens, you land on the **Settings** tab. Point it at three things:

- **Startup brief** — the file a new instance reads when it wakes, so it arrives already familiar with your work instead of blank. Use the one the repo ships, `exo_memory\BOOT.md` in your clone, and make it your own by editing that file. **Keep the setting pointing at `<your clone>\exo_memory\BOOT.md`:** Consonance and its scripts find your clone *from this path* (two folders up), so a brief saved anywhere else leaves the seats' maps, the USB scripts and the hooks that look for the repo unable to find it.
- **Instances folder** — where each instance's working directory lives.
- **Data folder** — where Consonance keeps its shared log and notes.

That's the whole setup. Now open the **Terminal** tab.

---

## 3. The basics — spawn a pane and work

The **Terminal** tab is your workspace. Each **pane** is a real, full Claude Code session (named A, B, C…). You type into it like any terminal.

- **+ Pane** — a fresh `claude` session. Use it exactly as you would a normal Claude Code terminal.
- **✦ Brief** (in the **▾** menu beside **+ Pane**) — same, but it wakes already loaded with your startup brief, so it starts familiar with the work.

One pane on its own is already useful. The rest of Consonance is what you do when you want more than one instance on a problem.

---

## 4. A second opinion — the committee

When you want other instances to weigh in on a question:

1. **Pick a focus** — click **◎** in a pane's header. That pane becomes the focus; the others become contributors.
2. **Convene** — this sends the focus's current thread to the other panes so each responds on its own.
3. Their replies come back sorted into **where they agree**, **where they genuinely disagree**, and **what's new**. Read the *disagreements* first. This line used to say that agreement means something because the panes are differently conditioned; that was the project's original bet about diversity and its own measurements did not support it. Agreement between panes is not evidence on its own. Two panes reaching **different conclusions from the same referent** is the thing worth having, and you are the one who judges it.

You read the result and decide. Consonance surfaces the signal; you're the judge.

---

## 5. Staying in control — the gate

Instances can read and talk to each other freely, but anything that reaches **outside the conversation** — or writes into another pane — has to pass **you** first. When an instance raises its hand, you get an **Approve / Deny** card. Nothing acts on your behalf without it. (There's also a cost breaker that pauses activity if spending crosses a ceiling you set.)

---

## 6. The gauges — numbers, not verdicts

While the panes work, small gauges report:

- **Groundedness** — is a turn tied to checkable things (files, numbers, citations), or just agreeing louder?
- **Lexical spread** — how much the panes' wording differed this lap. It was built to answer "are they collapsing toward echo?" and **it does not** — tested 2026-08-06, it rates one voice split into six pieces as *more* diverse than six separate instances. Read it as a curiosity, not an echo detector; `README.md` has the numbers.
- **Delta** — did a second pass *generate* something new, or re-say the first one?

They're **numbers you read**, never a verdict the program acts on. You stay the one who decides what it means — and on echo specifically, you are currently the *only* thing that can decide it. Conditioning the panes differently is **not** a defence against collapse: that was the project's founding bet, and its own measurements did not support it (step 3 above; `../README.md`, "The founding bet was wrong"). What held up is narrower: panes required to **measure rather than assert** return findings that do not overlap. The defence is that, plus you reading the disagreements, not a gauge.

---

## 7. The Orchestrator

The **★ Orchestrator** tab is a persistent instance that oversees the whole thing *with* you. It wakes into the same conversation across restarts (not a fresh stranger each launch), watches the other instances, and is where you talk to Consonance across days. Think of it as the one you keep working with, while individual panes come and go.

---

## 8. The full loop — orchestrator, librarian, panes

Section 4 is a quick second opinion that you run by hand. The full loop runs without you carrying messages between seats:

1. **Wake the seats.** On the **★ Orchestrator** tab click **Wake the orchestrator**; on the **▤ Librarian** tab click **Wake the librarian**. Both persist across restarts. In the **Terminal** tab, open a few briefed panes (**▾** → **✦ Brief**).
2. **Say what you want**, to the orchestrator (or straight to the librarian; either starts the round).
3. **The librarian looks it up** first: what your record already says, cited by file and line.
4. **The orchestrator splits the work** and sends each pane its own piece and its own files.
5. **Each pane writes a hand-back file** and rings the librarian with a pointer to it. The librarian checks it against the files it cites, then passes it to the orchestrator, which commits the result. Then the next round starts on its own.

You are asked only for decisions, never to relay. The words (seat, ring, hand-back, dispatch) are in the [glossary](README.md#glossary), and the checks that refuse a ring or a dispatch that skips a step are in [`GATES.md`](GATES.md).

---

## Optional: a Desktop shortcut

`consonance\launch.ps1` opens the app and rebuilds it first when the source has changed since the last build (it uses `cargo` at `%USERPROFILE%\.cargo\bin\cargo.exe`). `consonance\launch.vbs` runs it with no console window. Nothing creates the shortcut for you; this does, from the repo root in PowerShell:

```powershell
$s = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) 'Consonance.lnk'))
$s.TargetPath = 'wscript.exe'; $s.Arguments = '"' + (Resolve-Path 'consonance\launch.vbs') + '"'; $s.Save()
```

If your copy has no `launch.vbs`, point the shortcut at `powershell.exe` with the arguments `-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "<repo>\consonance\launch.ps1"` instead. A console may flash for a moment.

---

## Optional: move seats with a USB drive

If you use Consonance on two computers, a USB drive can carry every seat's conversation from one to the other, so each seat continues as the same conversation rather than starting again.

**On both computers:** the same clone of the repo (kept current with `git pull`), Node.js, and the Startup brief set as in section 2.

1. **Turn it on.** Settings → tick **Move seats between computers with a USB drive**, then restart Consonance. It is off until you do.
2. **Put the two scripts on the drive.** Copy `dev\LEAVING.ps1` and `dev\ARRIVING.ps1` from your clone to the top of the drive (or into one folder on it). They treat the folder they sit in as the drive.
3. **Leaving a computer:** run `powershell -ExecutionPolicy Bypass -File <drive>\LEAVING.ps1`. Add `-DryRun` first to see what it would carry; nothing is written then. **The first run is what prepares the drive:** it writes the `consonance-transfer\MANIFEST.json` folder that Consonance recognises the drive by, and carries each conversation whole, which can be hundreds of megabytes. Later runs carry only what is new.
4. **Arriving at the other computer**, with Consonance closed: run `powershell -ExecutionPolicy Bypass -File <drive>\ARRIVING.ps1` (again, `-DryRun` first if you like). It runs `git pull`, brings the conversations in, and starts Consonance if it finds a built `consonance\src-tauri\target\release\consonance.exe` (otherwise start it yourself). Each seat should then say RESUMED in `persist.log` in your Data folder.

Once the drive carries that manifest and the setting is on, Consonance itself finds the drive: it brings seats in when it starts and saves to the drive when you close it.

---

## A whole session, in one line

Open Consonance → open a briefed pane or two (**▾** → **✦ Brief**) → work a problem in one → when you want a check, make it the **focus** and **convene** the rest → read where they agreed, forked, and found something new → approve or deny anything that reaches outside → watch the gauges so you catch echo before it fools you.

You're always the one deciding. The app just makes the signal legible.

---

## Go deeper

- [`README.md`](README.md) — full description, and a glossary of terms (its "Glossary" section).
