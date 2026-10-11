# D287 part 3 (C): evidence lives in the record, not in a scratchpad

**The commit:** **69d89696** on `main` in the main lighthouse checkout, `C:\Users\nname\Desktop\lighthouse`. I chose the main checkout over a worktree because every file is new, under `exo_memory/handback/*_evidence/`.
- **Diff:** 310 files, all added. Nothing modified or deleted.
- **Paths:** named exactly, through `git add/commit --pathspec-from-file`. Before the commit, the list equalled the untracked set under `*_evidence/`, and the index was empty.
- **Not pushed.**

**Full lists:** `exo_memory/handback/p-evidencecopy-C_2026-10-10_evidence/`:
- `manifest.json`: every copy, with source, destination, size, sha256, how it was resolved, and the skipped and ambiguous entries;
- `missing.tsv`;
- `cited-directories.tsv`.

## Counts (re-derive: `node scan.js` then `node copy.js --dry`, both in C's scratchpad `evid/`; the dry run now reads every copy as "already there")
| | |
|---|---|
| scratchpads on disk under `%LOCALAPPDATA%\Temp\claude\*\*\scratchpad` | 936 |
| hand-backs in `exo_memory/handback/*.md` | 820 |
| hand-backs citing a scratchpad path | 255 |
| citations (deduplicated per hand-back, `{a,b}` brace forms expanded, `:line` suffixes stripped) | **669** |
| **files copied** | **307**, **6,211,891 bytes**, into **138** `<handback>_evidence/` folders |
| cited paths that no longer exist | **288** (13 absolute, 275 relative), from 122 hand-backs: `missing.tsv` |
| cited DIRECTORIES, not copied | **75**, 8 of them whole scratchpads: `cited-directories.tsv` |
| skipped | 1: `vtdump\target\release\scan.exe` (cargo target), cited by `p-composer-tristate-E_2026-09-19.md` |
| credential matches | **0** (content regex for key, token, password and private-key shapes, plus .env/.pem/.key/.pfx names) |
| conflicts with existing files | 0. The 26 `_evidence` folders that already existed only gained files; nothing was overwritten |

**Verified:** after the copy, a dry re-run hashed every destination against its source: **307 already there, 0 conflicts.** By type: 221 .js, 28 .log, 22 .txt, 15 .out, 7 .sh, 3 .rs, 3 .tap, 2 .html, and one each of .ps1, .json, .jsonl and .t180track.

## How a citation became a file
- **Layout:** `<handback>_evidence/<path under the scratchpad>`, so the name is kept and two `run.log`s from different folders cannot collide.
- **Absolute citations:** the `C:\…`, `C:/…` and `/c/…` spellings of `…\Temp\claude\<project>\<session>\scratchpad\…`. These are copied as they are. 26 of 39 still exist.
- **Relative citations** (`scratchpad/<rel>`): these name no seat, so each was looked up in all 936 scratchpads.
  - **One match: 342.** Checked against a seat-to-project map built from the hand-backs' own absolute citations: A → sibling-3d57124e and librarian; B → 5bf9d657; C → 0845a868; E → 07b8a48f and 0845a868.
    - 289 resolve into the citing seat's own scratchpad.
    - **5 resolve into ANOTHER seat's**, marked in the manifest and copied, because the hand-back plainly read that seat's file:
      - `p-flake-C_2026-10-06` `full1ff.tap`, in the librarian's scratchpad;
      - `p-harness-audit-E_2026-09-20`: `ctrl_leave.js`, `redact_mutants.js`, `stick-apply.mutants.js` (A's) and `nul/stick_mutants.js` (B's).
    - **1 has no seat letter my parser reads** (`p-d218-B2_2026-10-03`); its match is in B's scratchpad.
  - **Several matches: 13**, of them 5 files and the rest directories.
    - **3 narrowed to one by the seat map:** `p-d098-dataseam-C`, `p-d201-B-read` and `p-d201-C-read`.
    - **2 still AMBIGUOUS**, because both candidates sit in E's two mapped projects: `p-d098-keepwarm-E_2026-09-21` `d098/mutants.js` and `p-d186-brush-E_2026-09-28` `d186/proto.js`. Both candidates are copied, each under its project id (`07b8a48f/…` and `0845a868/…`), and listed as ambiguous in the manifest.
  - **None: 275.** Sampled ~30: real file names in retired sessions (for example `scratchpad/d161/mutants.js`, `scratchpad/l100/mutants.js`), not parse errors.

## Judgements made (say if any is wrong)
1. **Directories are not copied.** The packet says files. Of the 75:
   - 8 are whole scratchpads, cited by `p-d006-priorart`, `p-d172-read-B`, `p-d172-read-widened-B-SUPERSEDED`, `p-d174-read-B`, `p-d176-read-B`, `p-nowater-A`, `p-six-reds-B` and `p1-where-a-seat-lives`. One of them is 38.5 GB and 67,311 files.
   - Several are cargo targets (`d190\target` 3.5 GB, my own `d277margin\target-src` 3.0 GB, `d273\target-bundle\` 1.9 GB).
   - The rest are evidence folders from a few KB up to 86 MB (`c1read\c1\`).
   - A citation like "Logs: `scratchpad/d277p/`: `run.log`, `gen.out`…" names its files only as bare names after the folder, so it counts here as one directory citation, and those files were NOT copied. If the chair wants the small evidence folders copied whole (under some size cap, minus targets and generated trees), that is one more pass with the same script.
2. **Folders named `nul`.** Two source scratchpads hold a real folder named `nul`, a Windows device name. Copying into it made folders git cannot open (`warning: could not open directory '…/nul/'`).
   - I renamed my two copies to `nul_dir/` (in `p-harness-audit-E_2026-09-20_evidence` and `p-nul-repairs-B_2026-09-16_evidence`) and fixed the 4 manifest destinations.
   - `copy.js` now maps any reserved name (con, prn, aux, nul, com\d, lpt\d) to `<name>_dir`.
   - The sources are untouched.
3. **Third Place:** no citation resolved into the Third Place's scratchpad. The script refuses one if it does.

## What this does not establish
- **Only `exo_memory/handback/*.md` was scanned,** as asked. Citations in `exo_memory/loop/`, `journal/`, the maps or the board are not covered, so a janitor expiring a scratchpad could still break a citation there.
- **Citation forms not matched:** a variable (`$S/d273/run.js`), "my scratchpad's d273", a bare file name after a folder citation, or `%TEMP%` spellings. The regexes are `…AppData[\\/]Local[\\/]Temp[\\/]claude…` and `scratchpad[\\/]…`.
- **"Missing" means not on THIS machine, which is machine D.** Hand-backs written on machine L cite L's scratchpads, which may still exist there. *(Amended 2026-10-10 ~19:00Z, at the librarian's correction: the first version said "this machine (machine L)" and had the two machines swapped. The 288 missing are D's count.)*
- **The 5 other-seat and 2 ambiguous resolutions are inferences from the seat map**, not confirmed with the authors.
- **The 0 credential matches** come from a pattern list, not a reading of all 307 files.

## Corrections (mine, this lap)
- **Two node one-liners failed:**
  - a regex with `\\` mangled through a bash heredoc, rewritten as a file;
  - a `/c/…` path given to node, which resolves it to `C:\c\…`.
  Neither wrote anything.
- **The `nul` folders** above: created by my copy, found by git's warning before the commit, renamed.

## For the janitor (E) and the chair
A scratchpad is safe to archive once every file cited out of it is in this manifest:
- **`copied[].src`** gives the cited files that were copied.
- **`missing.tsv`** shows what was already gone.
- **`cited-directories.tsv`** lists the directories that still pin a scratchpad, the whole-scratchpad citations included, until the chair rules on them.

## Second pass (2026-10-10 ~19:00Z): the cited directories, at the librarian's ruling

**The commit:** **e23fcb24** on `main`, in the same checkout. 3,462 files, all added: 3,460 copies, plus `second-pass.json` and `dirs-not-copied.tsv` in `p-evidencecopy-C_2026-10-10_evidence/`. Paths named through `--pathspec-from-file`; the list equalled the untracked set, 0 ignored, the index empty before. Not pushed. 69d89696, the first pass, is untouched.

**The rule applied** (the plan's last section): each cited directory whose files, leaving out `target*`, `node_modules` and `*-gen*`, total at most 20 MB is copied whole into the citing hand-back's `_evidence/<path under scratchpad>/`.
- **Several matches:** a directory citation with several matches was narrowed by the same seat map. One with no unique seat was copied under each project id.
- **Unchanged from pass 1:** reserved names map to `<name>_dir`, nothing from the Third Place, nothing overwritten.
- Script: `evid/copydirs.js` in C's scratchpad.

| | |
|---|---|
| cited directories (from the first scan) | 75 |
| **directories copied** | **61**: **3,460 files, 36,871,034 bytes** |
| files already there from the first pass | 21, all byte-identical |
| conflicts | 0 |
| **verified** | a dry re-run reads **3,481 already there, 0 conflicts**: every destination's sha256 matches its source |
| **credential hits** | **2, listed, not copied**, both in `p-verify-B_2026-10-10`'s `d277v/turns/`. Matches checked with the values masked: `65.txt` matched `sk-store_915209a_ASK-008-009`, a store file name, not a key. `78.txt` matched a `token: '…'` line, probably a heavy-run lock token. Neither looks like a secret, but the rule is list, don't copy |
| directories not copied | **22**, below |

**Left out by my judgement, beyond the ruling's list** (say if wrong):
- **Checked-out worktrees (`*-wt`):** copies of source git already holds. This took out `d195/base-wt`, cited by `p-d195-B-lag`.
- **Binary build output (`.exe` `.dll` `.msi` `.pdb` `.node`):** inside otherwise-small directories this was 4 files, 20,118,146 bytes, from the throwaway installs at `d181\throwaway\app\`:
  - `t180-track-builder.exe`, 9,979,904 bytes, cited through `p-d181-installer-A` and `p-d182-installer022-A`;
  - `uninstall.exe`, 79,169 bytes, through the same two hand-backs.
- **Checked:** `git show --name-only e23fcb24 69d89696` has 0 paths matching an executable, `-wt/`, `target*/`, `node_modules/` or `-gen*/`.

**Not copied: 22 directories.** These stay in place for the janitor to MOVE to `Z:\consonance-archive\`. Sizes are bytes after the leave-outs; full paths are in `dirs-not-copied.tsv`.

| hand-back | why | bytes | where (under `Temp\claude\`) |
|---|---|---|---|
| p-d006-priorart_2026-09-04 | whole scratchpad | — | sibling-906f757a\1582ff09…\scratchpad |
| p-d172-read-B_2026-09-27 | whole scratchpad | — | sibling-5bf9d657\12fb81f6…\scratchpad |
| p-d172-read-widened-B-SUPERSEDED_2026-09-27 | whole scratchpad | — | the same |
| p-d174-read-B_2026-09-27 | whole scratchpad | — | the same |
| p-d176-read-B_2026-09-27 | whole scratchpad | — | the same |
| p-six-reds-B_2026-09-19 | whole scratchpad | — | the same |
| p-nowater-A_2026-10-04 | whole scratchpad | — | sibling-3d57124e\6fe15f0a…\scratchpad |
| p1-where-a-seat-lives_2026-09-11 | whole scratchpad | — | sibling-0845a868\0845a868…\scratchpad (mine) |
| p-d190-E-seal_2026-09-29 | over 20 MB | 211,682,264 | sibling-5bf9d657…\scratchpad\d190\ (after leaving out 3,442 target files) |
| p-d164-spawn-A_2026-09-27 | over 20 MB | 147,155,011 | sibling-3d57124e…\scratchpad\leave3_target |
| p-d190-B-r3_2026-09-29 | over 20 MB | 60,914,046 | sibling-5bf9d657…\scratchpad\d190\r3\ |
| p-d190-B-r2_2026-09-29 | over 20 MB | 59,335,722 | sibling-5bf9d657…\scratchpad\d190\r2\ |
| p-xsec-E-seal_2026-10-03 | over 20 MB | 46,237,542 | sibling-07b8a48f…\scratchpad\xsec\ |
| p-d195-E-lag_2026-09-30 | over 20 MB | 41,281,944 | sibling-5bf9d657…\scratchpad\d195\ (one of two matches) |
| p-freeze-C_2026-09-28 | over 20 MB | 39,473,501 | sibling-0845a868…\scratchpad\mathsrc\ (mine) |
| p-d195-E-lag_2026-09-30 | over 20 MB | 29,252,210 | sibling-07b8a48f…\scratchpad\d195\ (the other match) |
| p-consumer-parity-B_2026-10-08 | is a target | — | sibling-5bf9d657…\scratchpad\d273\target-bundle\ |
| p-d178-release-A_2026-09-27 | is a target | — | sibling-3d57124e…\scratchpad\d178\target |
| p-d181-installer-A_2026-09-27 | is a target | — | sibling-3d57124e…\scratchpad\d178\target\release\bundle\nsis\ |
| p-d190-B_2026-09-29 | is a target | — | sibling-5bf9d657…\scratchpad\d190\target |
| p-d195-B-lag_2026-09-30 | is a worktree (my judgement) | — | sibling-5bf9d657…\scratchpad\d195\base-wt |
| p-d277margin-C_2026-10-10 | is a target | — | sibling-0845a868…\scratchpad\d277margin\target-src (mine) |

**For the janitor:**
- **Scratchpads still pinned by a whole-scratchpad citation:** B's `5bf9d657\12fb81f6…` (5 hand-backs), A's `3d57124e\6fe15f0a…`, `906f757a\1582ff09…`, and mine (`0845a868\0845a868…`).
- **Those to move whole to Z:,** never to delete. Everything else cited out of a scratchpad is now either in the repo (`manifest.json` and `second-pass.json`) or listed as missing.

**Line endings:** the repo pins `text=auto eol=lf` (`.gitattributes`). So **2,861 of the copied files**, written with CRLF in the scratchpads, are stored with LF.
- The sha256 values in the manifests match the files as copied on disk, and that is what the dry re-run checked.
- A fresh checkout of those 2,861 will differ from the source in line endings only.
- Counted from git's "CRLF will be replaced by LF" warnings on the commit, deduplicated by path.

**Corrections, this pass:**
- **A stray redirect again:** a `> /tmp_crlf.txt` returned "Permission denied", so nothing was written. It is the same slip as in my verify pass earlier today.
- **One heredoc script (`peek.js`) had its backslash escapes collapsed** (as two did in pass 1). It failed to parse, was rewritten as a file and then ran.
- **The machine-name correction** is above, in place, with its date.
