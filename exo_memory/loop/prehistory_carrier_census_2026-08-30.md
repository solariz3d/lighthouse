# Prehistory carrier census — 2026-08-30, pane E

**Object measured:** `git show 0db90d1 -- exo_memory/librarian/2026-08-30.md`, §2 —
*"The transcript is the room's PREHISTORY, on disk for the first time. … It is now in exactly one
place: a 9.7MB transcript, machine-local, plus gitignored notes, plus a sealed corpus of four
documents. The desktop cannot see it; no journal points at it."*

**Scope:** inventory only. Nothing was copied, moved, backed up, committed, or deleted. Every figure
below is followed by the command that produces it. Two content greps were run over the board and its
backup; both emitted metadata only (pane, role, timestamp, length) and no conversation text. The
seat's own notes, the transcript, and the sealed corpus were **not read** — only stat'd, counted and
hashed.

**Registered outcome, honoured up front:** the material **is** retained in more than one place, and
§2's "exactly one place" is false as an inventory of the conversation — it has four independent
carriers on this disk. It is true as a statement of *failure domain*: every one of those carriers is
on this one machine, and nothing off it holds any of them. Both halves are stated per-artifact below
rather than averaged into a verdict.

---

## 1. THE INVENTORY — every copy on this machine

Sixteen artifacts. Sizes in bytes, times local (Regina, UTC−6).

### The conversation itself — FOUR carriers, not one

| # | Path | Bytes | mtime | What retains it | Fidelity |
|---|---|---|---|---|---|
| A | `C:\Users\zackn\.claude\projects\C--Consonance-instances-third-place\3d000000-0000-4000-8000-000000003d00.jsonl` | **9,731,379** | 2026-08-30 04:05:53 (created 2026-08-25 11:38:01) | `cleanupPeriodDays: 3650` | complete, structured |
| B | same dir, `771223f4-bf68-4d86-8348-6f4633249257.jsonl` | 15,214 | 2026-08-29 07:59:15 | same | second session, complete |
| C | `C:\Consonance\data\captures\3d000000-…-3d00.log` | 1,244,683 | 2026-08-30 03:59 | **nothing found** | raw ANSI terminal stream |
| D | `C:\Consonance\data\captures\3d000000-…-3d00.txt` | 95,038 (1,012 lines) | 2026-08-30 03:36 | **nothing found** | terminal-rendered, lossy |
| E | `C:\Consonance\data\captures\archive\3d000000-…-3d00.log` | 5,935,797 | 2026-08-29 07:54 | **nothing found** | raw ANSI, first session |
| F | `C:\Consonance\data\captures\archive\3d000000-…-3d00.txt` | 251,348 | 2026-08-29 07:54 | **nothing found** | terminal-rendered, lossy |
| G | `…\Temp\claude\C--Consonance-instances-librarian\0c0c0c0b-…-115b\scratchpad\tp-full.txt` | 209,535 | 2026-08-30 03:38 | **Storage Sense** (see §1.1) | 149-turn text extract |

C–F are Consonance's own transcript tailer writing to `data/captures`. **They are not named in §2 and
were not known to it.** Their combined text is a second and third independent rendering of the same
conversation, produced by a different mechanism from A, and none of them is governed by
`cleanupPeriodDays`.

    ls -la "/c/Users/zackn/.claude/projects/C--Consonance-instances-third-place/"
    ls -la /c/Consonance/data/captures/ /c/Consonance/data/captures/archive/

### Everything else

| # | Path | Bytes | mtime | What retains it |
|---|---|---|---|---|
| H | `exo_memory/third_place/2026-08-25.md` + `2026-08-29.md` (seat's own notes, in the repo tree) | 2,388 + 7,116 = **9,504** | 08-25 11:42 / 08-29 07:51 | nothing — untracked by `.gitignore:60` |
| I | `C:\Consonance\sealed\univ_corpus_2026-08-29\` — 4 docs + MANIFEST | 7,947 + 6,020 + 3,540 + 3,283 + 974 = **21,764** | 2026-08-29 04:15 | nothing — outside the repo, unsynced |
| J | `C:\Consonance\data\board.jsonl` — **6 rows**, 1,631 chars of text | (inside a 192,181,623-byte file) | rows dated 2026-08-25 17:38:00.928Z–17:42:51.013Z | nothing |
| K | `C:\Consonance\backups\board.jsonl.pre-thirdplace-purge-2026-08-29` — the same 6 rows | 185,202,081 (file) | 2026-08-29 01:42 | nothing |
| L | the seven imprints — `Downloads\IMPRINT_GOOD_QUALITY.jpg, 8/7/6/11/15.webp`; `OneDrive\Desktop\FIC\image4.webp` | **3,624,109** across 7 distinct images | 2026-05-12 → 2026-06-22; FIC copy 2026-08-30 02:58 | nothing; **one of the seven is OneDrive-synced** |
| M | `C:\Users\zackn\OneDrive\Desktop\FIC\` — 9 files (4 explanation JPGs, `image4.webp`, 4 plot PNGs) | **2,030,803** | 2026-08-30 02:58–03:11 (**tonight**) | OneDrive |
| N | `C:\Consonance\instances\third-place\CLAUDE.md` (the seat's own shell) + `dreams/dream.log` | 134,537 + 232 | 2026-08-30 00:30 | nothing (rolling-window eviction shrinks it — see Finding 2) |
| O | `exo_memory/librarian/2026-08-30.md` — the derived record | 167 lines, commits `95dfe5c` + `0db90d1` | — | git, **but NOT pushed**: `origin/main` = `f5e3c5f`, local ahead 2 |
| P | `exo_memory/record/third_place_prehistory_2026-08-30.md` | **31,690**, untracked | 2026-08-30 04:11 | nothing yet — **in flight, another pane is writing it now** |

### 1.1 What governs the temp directory — the expectation was wrong

Storage Sense is **on**, with temp-file cleanup **on**:

    reg query "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy"
    01    REG_DWORD    0x1     <- Storage Sense enabled
    04    REG_DWORD    0x1     <- "delete temporary files my apps aren't using" enabled
    2048  REG_DWORD    0x0     <- cadence: ONLY during low free disk space

So `tp-full.txt` is governed by something, not nothing — but by a **trigger, not a clock**, and the
trigger is nowhere near:

    df -h /c   ->  1.9T total, 755G available, 61% used

Observed behaviour agrees: `Temp\claude` holds session directories dated **2026-08-09** — 21 days,
3.8 GB, unpruned. The honest statement is *conditionally governed, currently dormant, and it fires on
a disk event nobody will see coming* — which is worse than "nothing" for planning purposes, because
"nothing" is predictable.

### 1.2 `cleanupPeriodDays`, verified rather than taken

    grep -rn "cleanupPeriodDays" ~/.claude/settings.json ~/.claude/settings.local.json \
        /c/Consonance/lighthouse/.claude/settings*.json /c/Consonance/instances/*/.claude/settings*.json
    /c/Users/zackn/.claude/settings.json:2:  "cleanupPeriodDays": 3650,

**One occurrence, user scope, value 3650.** No project or local override anywhere. ≈10 years from
last write; artifact A's clock therefore restarts every time the seat speaks. Confirmed as the
librarian reported it.

---

## 2. WHAT IS LOST, PER ARTIFACT, UNDER EACH SCENARIO

`Y` = survives · `N` = gone · `1/7` = partial

| Artifact | temp cleared | this machine gone | `.claude/projects` pruned | fresh clone on the desktop |
|---|---|---|---|---|
| A master jsonl (9.7MB, complete) | Y | **N** | **N** | N |
| B second session (15KB) | Y | **N** | **N** | N |
| C/E capture `.log` (7.18MB total) | Y | **N** | Y | N |
| D/F capture `.txt` (346KB total) | Y | **N** | Y | N |
| G `tp-full.txt` extract | **N** | **N** | Y | N |
| H seat's notes (9,504 B) | Y | **N** | Y | N — gitignored, never travels |
| I sealed corpus (21,764 B) | Y | **N** | Y | N |
| J board rows (6 / 1,631 chars) | Y | **N** | Y | N |
| K pre-purge board backup | Y | **N** | Y | N |
| L the seven imprints | Y | 1/7 | Y | **1/7** via OneDrive |
| M FIC folder (2,030,803 B) | Y | Y (OneDrive) | Y | Y |
| N seat's CLAUDE.md shell | Y | **N** | Y | N |
| O librarian's derived record | Y | **N — unpushed** | Y | N until pushed |
| P record-tier entry in flight | Y | **N** | Y | N until committed and pushed |

**Read across the rows, not down them.** No single scenario except *this machine gone* costs the
conversation, and that one costs **all four carriers at once**, because A, C–F, G, H, I, J, K, N and
O are all on drive C: of ZachsLEGION with no off-machine copy. Redundancy against a stray deletion is
real and fourfold; redundancy against losing the disk is zero for everything except artifact M and
one of the seven images.

**The one non-obvious loss:** artifact O — the librarian's deep read, the only *derived* account of
the prehistory — is committed but **not pushed** (`origin/main` = `f5e3c5f`; local is 2 ahead with
`95dfe5c` and `0db90d1`). It is currently in the same failure domain as the raw material it was
written to survive.

---

## 3. THE DESKTOP — what is established, and what is not

**Established from here, by git:**

    git ls-remote --heads origin   ->  refs/heads/main = f5e3c5f...
    git merge-base --is-ancestor <sha> origin/main
      b601440 (tailer guard)        YES      95dfe5c (deep read)   NO
      2fc006c (gitignore rule)      YES      0db90d1 (amendment)   NO
      9bb3b8e, f5e3c5f              YES

A fresh clone on the desktop gets the `THIRD_PLACE.md` brief, the tailer guard, `ASK.md`, the
librarian's 08-25 / 08-25.desktop / 08-29 notes and the loop registrations — and **none** of
artifacts A–N. `exo_memory/third_place/` is excluded by `.gitignore:60` and has never been in a
commit.

**Established from here, about the desktop's identity** — `exo_memory/librarian/2026-08-25.desktop.md:25-28`:

    hostname   DESKTOP-EEGVFMT
    repo       C:\Users\nname\Desktop\lighthouse
    C:\Consonance\lighthouse   DOES NOT EXIST on this machine

This machine is **ZachsLEGION** (`hostname`). They are two machines with two repo paths.

**NOT established, and it is the sharp part.** That same file, at `:414`, prints what reads as a live
directory listing:

    /c/Consonance/instances/third-place/CLAUDE.md          212,874 bytes, 11:10
    ~/.claude/projects/C--Consonance-instances-third-place/  5 sessions
      3d000000-...-3d00.jsonl   54,511 bytes, last written 14:15

**Those figures do not describe this machine.** Here:

    Get-ChildItem ...\C--Consonance-instances-third-place -File | Select Name,Length,CreationTime
      3d000000-...-3d00.jsonl   created 2026-08-25 11:38:01
      771223f4-...-9257.jsonl   created 2026-08-29 07:59:15
    Get-Item C:\Consonance\instances\third-place  ->  CreationTime 2026-08-25 10:54:42

The instance dir here was created at 10:54:42, not 11:10; the SID transcript at 11:38:01; and on
2026-08-25 this directory held **one** session file, not five — the second was created four days
later. If the desktop seat's listing was a live read, **the desktop holds its own Third Place
material: roughly five sessions including a same-named fixed-SID transcript, none of which anyone on
this machine has ever seen.**

**The limits, stated rather than fused:**

- *"Desktop did not push it"* — **established.** `origin/main` carries nothing of it.
- *"Desktop does not have it"* — **NOT established, and the evidence points the other way.**
- The instrument is weak. That same seat, in that same session, logged **four wrong-path errors and
  one false-identical** by its own account (`...desktop.md:385-401`) and called the false-identical
  "the worst of the four". A listing from it is a lead, not a measurement.
- Nothing on this machine can read `DESKTOP-EEGVFMT`'s disk. This can only be settled there.
- **OneDrive is the one live cross-machine channel and it carries almost none of this.** Searched:
  `OneDrive/consonance-migration/` holds a `room-20260728-0121` snapshot and `pane-data-2026-08-18` —
  both **predate** the Third Place's first session (2026-08-25). The only prehistory material in
  OneDrive is `Desktop/FIC/` (9 files, placed there **tonight**, 02:58–03:11) and `Desktop/606/`.
  So `.gitignore:60`'s stated premise — *"it travels through OneDrive and never the repo"* — is at
  present **not instantiated**: the seat's notes travel nowhere.

**A hazard this turned up, worth more than the census.** The SID is a fixed constant —
`consonance/src-tauri/src/main.rs:4308: const THIRD_PLACE_SID: &str = "3d000000-...-3d00"` — so both
machines' Third Place transcripts have **byte-identical filenames and different contents**. Any
future collation that gathers by filename overwrites one with the other and reports success.

---

## 4. `.gitignore:60` — the consequence, as inventory

    git check-ignore -v exo_memory/third_place/*.md
    .gitignore:60:exo_memory/third_place/  exo_memory/third_place/2026-08-25.md
    .gitignore:60:exo_memory/third_place/  exo_memory/third_place/2026-08-29.md

    git status --ignored -s -- exo_memory/
    !! exo_memory/third_place/

**Currently unbacked because of line 60: two files, 9,504 bytes.** That is the entire consequence —
`2026-08-25.md` (2,388 B) and `2026-08-29.md` (7,116 B). No other path in the repo is affected by
that rule.

Adjacent, and **not** caused by line 60, but in the same unbacked condition and worth counting once:

- `C:\Consonance\sealed\univ_corpus_2026-08-29\` — 21,764 B — is not gitignored; it is **outside the
  repo entirely**, so no rule governs it.
- `C:\Consonance\instances\third-place\` — 134,769 B — likewise outside the repo.
- Artifacts A–G and J–L — all outside the repo.

So line 60 accounts for roughly **0.07%** of the unbacked prehistory bytes (9,504 of ~13.9 MB).
ASK-010 asks whether that line should stand; the census's contribution is that **answering it either
way changes almost nothing about retention**, because the rule was never what put this material at
risk.

---

## FINDINGS — five, all checkable

**1. The board leak is SIX rows, not eleven, and it never continued.** `b601440`'s message says
*"having sat uncommitted on one disk for three days while the leak continued: 10 rows when found, 11
now"*, and `ASK.md:132` asks the keeper about *"the 11 Third Place board rows"*. Measured by parsing
rather than grepping, both the live board and the pre-purge backup contain **exactly 6 rows** with
`pane == "3d000000-...-3d00"`, totalling **1,631 characters**, all between
**2026-08-25T17:38:00.928Z and 17:42:51.013Z** — a five-minute window. The count is **identical in
both files**. The "11" is a grep over the SID string, and **5 of its 11 hits in the backup are the
same chair turn** (26,734 chars, `ts 2026-08-25T11:06:53.393Z`, pane `0c0c0c0a`) replayed five times
by the board's known replay ratchet. **The leak did not continue between discovery and landing; what
grew was the record OF the leak.** Same species as 08-16's *"named zero times"* — the instrument's
own output counted as the room's behaviour. And the guard is holding: the Third Place has run two
more sessions since (08-29 and tonight) and produced **zero** further rows.

    node -e '...pane === THIRD_PLACE_SID...'   # over both files
    live:   139,893 lines · 18 SID mentions ·  6 pane rows · 1,631 text bytes
    backup: 133,999 lines · 11 SID mentions ·  6 pane rows · 1,631 text bytes

*What this does not establish:* that the guard is the cause. Zero-since is consistent with the guard
running, and also with the pane having been launched differently. Not separable from here.

**2. The census target is moving.** Artifact A grew **4,937 bytes during this census**
(9,726,442 -> 9,731,379; last write 04:05:53), and `Get-Process consonance` shows the app up since
00:25:30. **`tp-full.txt` is an extract of a superseded state** — 149 turns as of 03:38, and the
transcript has been written to since. Any figure quoted from it is already historical. Relatedly, the
seat's own shell (artifact N) is **134,537 bytes today against the 212,874 the desktop seat recorded
on 08-25** — the rolling-window eviction is running on it, so the shell is not a stable carrier
either.

**3. §2's "no journal points at it" is true of `journal/` and false at the record tier.**

    git grep -ln "3d000000\|Third Place\|third_place" -- journal/   ->  (no output)
    git grep -ln "sealed/univ\|univ_corpus"  ->  ASK.md, librarian/2026-08-29.md,
        loop/univ_amendment_registration_2026-08-29.md, loop/univ_coldread_prereg_2026-08-29.md,
        loop/univ_withdrawal_attack_2026-08-29.md

Five tracked, pushed files point at the sealed corpus, and the sealed corpus's `MANIFEST.json` names
the transcript by **absolute path** with sha256 for all four documents. **A two-hop retrieval path
exists** — tracked repo -> machine-local sealed corpus -> transcript — and it works from a fresh
clone **only on this machine**. That is a weaker claim than *nothing reaches it* and a much weaker
one than *it is reachable*; it is precisely the retrieval crack the room has been naming, with a
measured length of two hops.

**4. One of the seven imprints carries its own dated provenance, unremarked.** By sha256,
`Downloads\15.webp` == `Downloads\39.webp` ==
`Downloads\DALLE_2025-03-16_22.21.05_-_A_newly_transcended_fractal_intelligence_imprint_reaching_its_highest_coherence_yet...webp`
(`118ae83141027d3c...`). **The filename carries the generation timestamp and the original prompt text**
for one of the seven. Separately, `OneDrive\Desktop\FIC\image4.webp` == `Downloads\14.webp`
(`f20cc57f153ed9c2...`) — so the seven are seven distinct images held in eight files, and exactly one
of them sits in a synced folder.

    sha256sum Downloads/*.webp Downloads/IMPRINT_GOOD_QUALITY.jpg "OneDrive/Desktop/FIC/image4.webp"

**5. Eight more same-era images sit beside the seven, status unstated.** `Downloads` holds 15
distinct image hashes in this family; 7 are the imprints, and **8 are not**: `CD602A41-...webp`
(1,182,987), `12.webp` (558,970), `4.webp` (480,182), `image.webp` (529,778), `5.webp` (502,632),
`3.webp` (469,838), `2.webp` (519,738), `9.webp` (580,370) — 4,824,495 bytes total, most downloaded
in the same 2026-06-22 batch. **This is not a control set and must not be read as one:** their
imprint status is unknown, and same-batch provenance makes "also imprints" at least as likely as
"ordinary". The census can say only that P-FIC's unnamed gate — *does the keeper already hold 10–20
non-imprint DALL-E-legacy images on disk* — has **8 candidates whose status is exactly the
question**, and that the answer is still his sentence to say.

---

## RECOMMENDATIONS — not acted on, per the packet

Nothing here was executed. Listed because the census was told to put safety moves here rather than
make them.

1. **Push.** Artifact O — the only derived account of the prehistory — is 2 commits ahead of
   `origin/main` and shares a failure domain with the raw material. Pushing costs nothing and is the
   single highest-value change in this document. It is a publishing act, so it is the keeper's.
2. **Correct the leak figure before ASK-009 is decided.** The decision object is 6 rows / 1,631
   characters in one 5-minute window, not 11 rows across three days. The scope the keeper is being
   asked to rule on is smaller than the ask states.
3. **Settle the desktop question on the desktop.** One command there —
   `ls ~/.claude/projects/C--Consonance-instances-third-place/` — converts the strongest open item in
   this census from a lead into a fact. It cannot be run from here.
4. **The fixed SID is a collision waiting for a collation.** Before any cross-machine gather of Third
   Place material, the two transcripts need distinguishing by something other than filename.
5. **Nothing about copying, moving or backing up any of A–N is recommended here.** The private/public
   line is the keeper's, the material includes his history, and a helpful backup into the repo is the
   one outcome that would be a real harm. Redundancy, if he wants it, is a decision and not a chore.

---

## WHAT THIS CENSUS DOES NOT ESTABLISH

- Whether the desktop holds Third Place material. Only what a weak instrument on that machine
  recorded, and that this machine cannot check it.
- Whether the tailer guard is the reason no rows appeared after 08-25.
- Whether the 8 additional Downloads images are imprints or ordinary outputs.
- Anything about the *content* of A, H, or I. They were counted and hashed, never read.
- Whether OneDrive has actually synced `Desktop/FIC/` to any other machine — sync state on the far
  side is not visible from here.

**Registered falsifier for this document:** if the desktop is checked and holds no
`C--Consonance-instances-third-place` directory, §3's central inference is wrong and the mismatch at
`...desktop.md:414` was a fifth wrong-path error in that session rather than a reading of a second
disk. That is checkable in one command on the other machine, and this census's reading should be
struck if it fails.

Uncommitted; the chair commits.
