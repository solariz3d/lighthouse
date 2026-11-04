# p-steamac-C — a non-author look at B's 8292269 (D250 item 1: Export to Assetto Corsa finds AC through Steam). Pane C, 2026-10-06

SOURCES: exo_memory/handback/p-steamac-B_2026-10-06.md · `git show 8292269 -- src-tauri/src/ac.rs src-tauri/src/lib.rs` · `ac.rs` `tracks_of` / `remember_ac_root` / `recall_ac_root` / `install_to`

**Verdict: GREEN to land.**
- The parser takes the odd input I gave it.
- No test reads the real registry or the real AC tree.
- A folder is remembered only when it really holds `content\tracks`, and a gone one is looked up again.
- The install guards hold in a FOUND folder.
- **One thing for the lander:** the merged tree needs `CHANGELOG.md` resolved by hand, twice (below); the code merges clean.
- Two small notes, neither blocking.

EXPORT tier for `ac.rs`: `cargo test ac::` plus targeted JS only. No real Steam, no registry read, no AC.

## The merged tree: 8b15ee9 → f13cded → 8292269
`git cherry-pick -x f13cded 8292269` onto 8b15ee9, in a fresh worktree `C:\Users\nname\Desktop\worktrees\c-steamac-merge-wt` (0 links) → `aaf435d`, **`2b3215b`**.
- **Both picks stopped on `CHANGELOG.md` only.** The code files merged clean.
  - f13cded: both sides added a new first line under "Changed" (8b15ee9's Sculpt-refusal line, mine). I kept both.
  - 8292269: B's Added line sits beside 8b15ee9's Add-jump line, and the "Drag handles" line differs. **8b15ee9's wording is the newer one** ("the centreline at the NEAR end"; B's side still says "far end"), so I kept HEAD's handles line plus B's Export line.
  - Whoever lands it will meet the same two conflicts. **Keep 8b15ee9's handles wording.**
- **Targeted JS on that tree** (both packets' sets: share-install, core-eqonly, onboarding, guides; core_piece, core-pieces-ui, core_cup_fixtures, core-shell) → **179 / 179, "0 of 9 differ"** (`sa/js.out`, sha256 `744390fd…`).
- **`cargo test ac::` on that tree → 16 / 16**: B's 13 ac rows plus my 3 temporary ones (`sa/cargo2.out`, `ee1996a4…`).
  - My rows were appended to `ac.rs` for the run and removed after (`git checkout`; `git status` clean). The module is kept as `sa/c_look.rs` (`2e114d4d…`).

## 1. The vdf parser on odd input (my temporary rows, all green)
| input | result |
|---|---|
| a path with **spaces and unicode** (`D:\\Spiele Bibliothek\\Stéam ⚙`) | read exactly |
| a library on **another drive** (`G:`, old format) | read |
| an escaped **trailing backslash** (`F:\\SteamLib\\`) | `F:\SteamLib\`; and **AC is found through it**, in a real fake tree whose library folder has spaces, unicode and that trailing backslash |
| a **UNC share** (`\\\\server\\share\\Steam`) | read |
| **both formats in one file**, CRLF, a **BOM** | all four libraries, in order |
| a **missing** vdf; an **EMPTY** vdf | only Steam's own folder is tried → None (the picker follows), no panic |
| a vdf that is **not UTF-8** | `read_to_string` fails, so the libraries are skipped → None, no panic |
| a broken line (an escaped closing quote), a third token, a key with no value | skipped |

- **Note 1 (small):** a vdf written with SINGLE backslashes (`"D:\SteamLibrary"`; not what Steam writes, it escapes them) loses them to the escape rule and yields the drive-relative `D:SteamLibrary`. No AC is found there, so the picker follows. Harmless, but a hand-edited vdf would silently not find its library.
- **Note 2 (small):** a non-UTF-8 vdf is skipped silently, with no word to the user beyond the picker. Steam writes UTF-8.

## 2. No test reads the real registry or the real AC tree
- `steam_path_from_registry` (the only `reg.exe` call, `ac.rs:148`) is called only from `lib.rs:418` (`get_ac_root`), and **by no test** (`grep -rn steam_path_from_registry src-tauri/src`).
- In the test module (`ac.rs:277` on), the real-looking paths (`C:\Program Files (x86)\Steam`, `E:\SteamLibrary`, the `HKEY_CURRENT_USER…` line) are **string literals handed to the parsers**, never touched on disk.
  - Every fake tree is under `std::env::temp_dir()` (`scratch()`, 4 uses).
  - There is no `Command::new`, `env::var`, `APPDATA` or `USERPROFILE` in the tests (`grep`, 0 hits beyond those literals).
- **JS** (`app/test/share-install.test.js`): a `fakeNative()`; the "found" root is the string `G:/SteamLibrary/...`, with no fs, no `child_process` and no `invoke`.

## 3. Remembered ONLY with content\tracks; a gone one is looked up again
- By construction: `remember_ac_root` calls `tracks_of(root)?` first (it refuses without `content\tracks`), and `recall_ac_root` returns None when the remembered folder no longer passes `tracks_of`. So `root_or_find` asks Steam again.
- My row: an `assettocorsa` with `content` but no `tracks` → None, **no `ac_root.txt` written**. Then a real one → found and remembered. Then `content\tracks` removed → the registry closure **is called again** (`asked == true`) → None. B's row covers a GONE picked folder → found through Steam.

## 4. The install guards in a FOUND folder (my row, green)
In the folder `root_or_find` found and remembered:
- `not_ours` is refused.
- An existing `t180b_hand_made` **without the builder's marker** is refused, and its file is unchanged ("theirs").
- `t180b_../../escape`, `t180b_..\..\escape`, `t180b_a/b`, `..` and `t180b_` are all refused, and nothing appears outside `content\tracks`.
- Control: `t180b_mine` lands (2 files).

## Corrections, mine
- **My first cargo run did not compile (`E0762`).** I wrote the temporary module through a bash heredoc, which halved every `\\`. I restored `ac.rs` from my copy, wrote the module with the Write tool, and appended it with node; that run is the one above.
- The JS run in the same lock hold was unaffected (179 / 179).

## Not verified
- The real `reg.exe` call and a real Steam (B's limit too; forbidden here).
- A real window or Tauri build; the button's new place beside Export.
- A library on a real network share; Steam's `appmanifest_244210.acf` (unused).

NEXT: librarian collate this look when read — plan default: f13cded (with its fixes 0b04996) and 8292269 land on 8b15ee9, the CHANGELOG resolved as above
