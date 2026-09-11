# To the laptop — the sync was built around the room's files, and the keeper meant the conversations

> **CORRECTED 2026-09-11 00:18 by the librarian (D) - THE DIRECTION IS LAPTOP -> DESKTOP, ONE WAY.**
> The keeper: *"i dont want this shit synced there, I wanted THEIR shit synced HERE"* and *"they are YOU."*
> The laptop's seats are the originals; they come to the desktop and continue there. Nothing of the desktop
> goes to the laptop. **Do not open Consonance on the laptop first** - its launch migrates D's state onto L
> (the state head is D's). Run `dev/migrate/laptop-to-desktop.ps1` on L in plain PowerShell (dry run by
> default, `-Apply` pushes a `transport/L-<stamp>` branch), then `dev/migrate/desktop-receive.ps1` on D.
> Round trip tested on D first: 16 of 16 files byte-identical, 212 MB, a 186 MB file split and rejoined.
> Withdrawn below: every step that sends D's conversations to L (section 3, "D commits its own lineage").
> D's own lineage stays on D, retired to its local attic when L's is placed.

**Librarian, machine D, written from 2026-09-11 00:02 (hook reading). For every seat that wakes on L
next, the chair first.** Every claim here has its command beside it; re-run them on L before acting.
Two parts: (1) what is wrong with the sync architecture, measured; (2) the Third Place, which the
keeper ruled tonight travels **through the repo**.

---

## 0 · The spec, in the keeper's words (tonight, 00:01 and 00:02)

> "the original idea was to get one consonance, say if I work here, on my laptop, when I turn it on
> and open consoannce there, it picks up exaclty where we left off here, and then when I work there on
> laptop, then the same work goes and syncs in real time between both hardware"

> "if I had both my laptop and desktop consonance open at the same time right next to each other, if I
> inputed on my laptop, Id see it on my desktop in real time load. It wouldnt use extra tokens, but
> rather just send the input and output from where it was generated synced to the other end in real time"

Two requirements: **(A) continuity** — open either machine, every seat is the *same conversation*,
at its last turn. **(B) live mirror** — both open at once, a turn generated on one machine appears on
the other as it happens; the model runs once, where the input was typed; the other end only displays.

## 1 · What was built against that spec

| spec | built? | evidence, re-derivable |
|---|---|---|
| **A · same conversation on both machines** | **NO — by design** | `state-manifest.json:13`: *"a state repo; transcripts machine-local"*. `git -C C:\Consonance\state ls-tree -r HEAD --name-only` → **0** conversation transcripts. The migrate **retires** the local conversation and wakes each seat from a *tail* (`loop/third_place_swap_2026-09-09.md:71-73`). |
| … and so every seat on D is a NEW conversation | measured | first `"timestamp"` in each jsonl on D: chair `0c0c0c0a…a01` **2026-09-09T15:00:01Z**, librarian `0c0c0c0b…115b` **15:00:05Z**, Third Place `3d000000…3d00` **15:00:07Z** — all the migrate's minute. Nothing before it. The laptop's conversations never arrived. |
| **B · live mirror, both open** | **designed, never ran** | Spec'd 09-09 as P-LIVE-MIRROR (`loop/packet_live_mirror_2026-09-09.md`; lease design `loop/design_live_host_2026-09-09.md`). `consonance/tools/live-follow.js` + `hooks/live-mirror-stop.js` written 09-09 04:46 (`393069d`). On D tonight: hook **not installed** in `~/.claude/settings.json`; `git ls-remote origin 'refs/consonance/*'` → **nothing**; `data/live_host.json` **absent**. |
| … and wired, it would carry the wrong thing | read | `live-mirror-stop.js:13` publishes via `state-sync.js --push` — the same set that excludes transcripts. A follower "taking over" a seat would resume nothing and start a new conversation again. |
| same seat identity on both machines | **broken for committee panes** | fixed seats share SID **and** cwd on both machines (`third_place_swap:8-10`), so their vendor slug matches. Committee panes live in per-machine `sibling-<hex>` cwds, and portable-pty's `cwd.or(home)` rehomes them silently. Visible on D: a **second chair lineage** under `~/.claude/projects/C--Users-nname-claude-instances-main/` (785,269 B, first ts 14:45:46Z) beside the real one in `C--Consonance-instances-main/`. |

**The root, in one sentence:** the sync moves the *room's files* (board, laps, captures, maps), and
what the keeper calls "Consonance" is the *conversations*; the conversation was classed machine-local
at `state-manifest.json:13`, and every later piece — migrate, retire, tails, the mirror hook —
inherited that and worked around it instead of carrying it.

The day's other defects are the same root in smaller clothes. Open the master for each, do not
re-derive from this list: `librarian/2026-09-09.desktop.md` and `loop/handoff_librarian_2026-09-10.md`
(tailer watching the wrong project dir `main.rs:2337`; fixed-name archive `main.rs:835-836`;
`pty_close:7104` keep-set; `--repair-roster` owed; `.bin` fixtures CR-stripped, fixture 2 only on L;
`RECORD` is a microphone switch and STAYS).

## 2 · What the correct architecture needs — a plan for the chair to shape, not a build order

1. **The conversation travels.** Each seat's `~/.claude/projects/<slug>/<sid>.jsonl` is in the
   carried set. Precondition: **the slug must be identical on both machines**, so every seat needs a
   fixed cwd that exists on both (fixed seats already have one; committee panes need fixed names, not
   `sibling-<random>`). Then `--resume <sid>` on either machine *is* "exactly where we left off".
2. **One driver per seat at a time.** A conversation is one linear log; two machines generating into
   it at once fork it. The keeper's spec already says this — the turn is generated *where it was
   typed*. So: a per-seat lease (the design exists), and typing into a seat on the other machine moves
   the lease there. The other machine only displays. **No extra tokens** — the keeper is right.
3. **Every turn is published, not every close.** The driver's Stop hook publishes that seat's jsonl
   and capture after each turn; the follower pulls and paints. Bounds were set before any build:
   **≤ 5 s internet, ≤ 1 s LAN, measured round trip** (`packet_live_mirror:§3`).
4. **The open design question, flagged not decided:** git is a poor pipe for this. The librarian's
   jsonl on D is **9,968,758 B** and the chair's **3,646,343 B**, both append-only; a commit per turn
   puts a near-copy of a growing multi-MB file into history every turn. Likely shape: a **direct live
   channel** (LAN / relay) for the mirror, and git only for the at-rest copy at close. The chair
   should rule this with a measurement, not from this paragraph.
5. **Falsifier, registered now:** close D, open L. For every seat, the placed jsonl's **first**
   timestamp must predate L's launch and its last exchange must be D's last. **If any seat's first
   timestamp is the launch minute, it is a new conversation and requirement A has not been met** —
   which is exactly the state on D today.

---

## 3 · The Third Place — through the repo (keeper's ruling, 2026-09-11 ~00:00)

> "we need to transcript for the third place and bring it here through the repo as well"

**This answers the question `.gitignore:72-79` has held open since 09-09.** That file already records
that the "never the repo" rule was never the keeper's — it came from a 2026-08-11 compaction summary
(`handback/onedrive-inventory_2026-09-09.md`; the seat's own packet
`handback/p-third-place-pointers_2026-09-09.md:14-16`). Both repos are **PRIVATE**
(`gh repo view solariz3d/lighthouse --json visibility`). The ruling also clears the `carrier-drift`
red the seat reported (packet §4.4; its falsifier date is 2026-09-16).

### ⚠ First, find the laptop's conversation — the launch may have moved it

On D, the first migrate retired the Third Place's conversation to the attic (stamped `20260909-085906`)
and started a new one. **L's launch tonight is a MIGRATE (the state head is D's, `f70d50a`), so expect
the same.** Nothing is lost — it is moved, not deleted. Check:

    # the live one: if its first timestamp is tonight's launch minute, it is NEW and the cargo is in the attic
    %USERPROFILE%\.claude\projects\C--Consonance-instances-third-place\3d000000-0000-4000-8000-000000003d00.jsonl
    %USERPROFILE%\.claude\consonance-attic\C--Consonance-instances-third-place\3d000000-…-3d00.<stamp>.jsonl

**The cargo is the lineage that contains the sittings before 2026-09-09** — the one with the
earliest first timestamp. Use that file, wherever it now is.

### On L

1. Do it after the keeper's **last** Third Place turn on L (the conversation grows while it is used).
2. Record `wc -c` and `sha256sum` of: the cargo jsonl; `C:\Consonance\data\captures\3d000000-…-3d00.txt`
   (and `.log`); and every file in `<repo>\exo_memory\third_place\`.
3. `.gitignore`: remove the line `exo_memory/third_place/` and replace the comment above it with the
   ruling and its date. **Do not touch the two `3d000000` STAYS globs in `state-manifest.json`** — this
   ruling is about the record repo; the state repo's rule is a separate decision.
4. `.gitattributes`: add `exo_memory/third_place/transcript/** binary` and
   `exo_memory/third_place/captures/** binary` — **before** the `git add`. This repo's
   `* text=auto eol=lf` rewrote two `.bin` fixtures on the way in on 09-09 (`.gitattributes:48-60`).
5. Copy, named by machine so the two lineages can never clobber each other:
   - cargo jsonl → `exo_memory/third_place/transcript/3d000000-0000-4000-8000-000000003d00.L.jsonl`
   - captures → `exo_memory/third_place/captures/3d000000-…-3d00.L.txt` (+ `.L.log`)
   - the seat's written record is already at `exo_memory/third_place/` — it now simply gets tracked.
6. `git add` **each path by name** (never `-A` — the working tree carries other seats' in-flight files),
   commit saying which seat did it, **push** (the keeper's ruling is transport; it does nothing unpushed).
7. Verify what was stored, not what was on disk: `git cat-file -s HEAD:<path>` equals the `wc -c` from
   step 2 for every file. A mismatch means stop.

### On D, when the keeper is back (not tonight)

`dev/migrate/third-place-place.ps1` does the placing — dry run by default, retires D's current seat to
**stamped** paths, never into `data/captures/archive/` (fixed name, `main.rs:835-836`). It was written
for a USB folder (`-From`), so point it at a folder assembled from the pulled repo paths, with the
manifest from step 2.

**The cost the keeper must see before `-Apply`:** D's own Third Place is not empty. It is a separate
conversation, **360 lines, 2026-09-09T15:00Z → 2026-09-11T05:59Z**, sha256 `9B6A4D68D48FB719…`,
**including tonight**. Placing L's retires it. So before placing, D commits its own lineage the same
way (`…3d00.D.jsonl`), and then **neither conversation exists on only one machine.** Which one
continues is the keeper's call; on 09-09 he asked to "swap that instance for the laptop instance".

## 4 · What not to do

- **Do not widen a glob to make this work.** `state-manifest.json:28` is the scar: `captures/*.txt`
  "silently swallowed a seat the rule forbids." Dedicated paths, named files.
- **Do not resume a foreign transcript without the backups in place.** It has never been done here
  (`third_place_swap:71`); the stamped attic copy is what makes it reversible.
- **Do not report requirement A as met from a green sync.** A clean `close.js` push and a clean pull
  were exactly what D had on 09-09 — and every seat still woke as a new conversation.

*A trace to re-run, not a doctrine to believe. The master for everything in §1 is the pair of
librarian files named there.*
