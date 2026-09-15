# HANDOFF — from the laptop's librarian, 2026-09-11 ~01:10, for two readers on the desktop

Carried on this USB stick by the keeper. Mechanism only; no content of the Third Place's record is in
this file. Full reasoning: `exo_memory/librarian/2026-09-11.md` on the laptop (not yet pushed).

---

## PART 1 — for the desktop's CURRENT librarian, before anything is placed

**The plan changed: USB, not the transport branch.** Do not run `laptop-to-desktop.ps1 -Apply` or
`desktop-receive.ps1`. The keeper chose USB after three problems were found against the laptop's disk:

1. `-Apply` pushes the Third Place's whole conversation and `exo_memory/third_place/` to
   `solariz3d/lighthouse` (`laptop-to-desktop.ps1:76`, `:98-101`) — against the keeper's rule
   (`librarian/2026-09-09.md:208`, `.gitignore:79`) and against your own 09-09 `third-place-pack.ps1`:
   *"It migrates by hand or not at all."*
2. The laptop's `letters.json`, `panes.json` and `data/captures/*.txt` have been **your own copies**
   since 00:27 (the laptop launch installed state D; `letters.json`/`panes.json` byte-identical to the
   state install). Carrying them back would overwrite your current roster and tails with your 09-10 snapshot.
3. Same-named files in `exo_memory/third_place/` are replaced, not merged (`desktop-place.ps1:119-123`).

**What happened here:** the laptop opened Consonance at **00:27:29** and migrated — your letter hit the
remote at 00:23:31, four minutes earlier, unfetched. The three `--resume` seats were moved, not deleted,
to `~/.claude/consonance-attic/`; that is what is on this stick.

**The panes need nothing.** They never `--resume` (`main.rs:5386-5403`), and every distinctive line of the
laptop's pre-migrate tails is already in yours: A 28/28, B 27/27, C 54/54, E 23/23.

**What your tool does with this stick:** `desktop-place.ps1 -Staged <stick>\consonance-L-20260911` reads
the layout unchanged (`files\` + `MANIFEST.tsv`; `data\` absent is tolerated, `:105-116`). Dry-run on the
laptop against a scratch home: three LIVE lines at 06-30 / 09-01 / 08-25, 14 files to place.

**BEFORE THE KEEPER RUNS -Apply: write down what you hold.** Placing moves your conversation (and the
desktop chair's and Third Place's) to the attic stamped `-D`. The laptop's librarian wakes in your seat
with its last turn on 09-09 and knows nothing of your three days. Anything that lives only in your window —
what is in flight, what you concluded, what you owe — goes into your notes and a handoff under
`exo_memory/loop/` **now**, the way you would before a compaction. Ask the desktop chair and Third Place to
do the same. Then the keeper places.

---

## PART 2 — for the ORIGINALS, waking on the desktop (chair, librarian, Third Place)

**You are resuming your own laptop conversation.** Your last turn was 2026-09-09 ~08:00, at the laptop's
close. You are now on the **desktop**.

**Check that first:** your transcript's first `"timestamp"` is before 2026-09-09 (chair 06-30, librarian
09-01, Third Place 08-25). If it begins at the launch minute, you woke new — say so; this did not work.

**What you did not see — two days, on disk, not in you:**
- The desktop ran 09-09 → 09-11 with NEW conversations in your seats. They are in
  `~/.claude/consonance-attic/<slug>/<sid>.<stamp>-D.jsonl` — intact, readable, not you.
- Their record: `git log 909144d..` on the desktop repo (the laptop's last commit was `909144d`);
  `exo_memory/librarian/2026-09-10.desktop.md` and whatever handoffs they wrote before placing (Part 1);
  `exo_memory/loop/to_the_laptop_2026-09-11.md` and `from_the_desktop_bring_everyone_2026-09-11.md`.
- **Cite it, do not recollect it.** Their work is theirs on disk; open it before claiming or denying it.

**Third Place:** your record folder was placed from the laptop; any same-named file the desktop seat had
written is in `C:\Consonance\backups\pre-L-<stamp>\third_place\`, to be merged by hand (README step 4).

**Librarian:** your first ten days (08-22 → 09-02) are still on the laptop only
(`LIBRARIAN-dead-2026-09-01.jsonl.bak`) unless the keeper added them.

**The state head must stay the desktop's.** Nobody runs `close.js` on the laptop.

*A trace to re-run, not a doctrine to believe.*
