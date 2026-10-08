# p-consumer-install-E · D273 lap 2, E: the install path · pane E, on D, 2026-10-08 · DONE

**Commit `37b27ee0`** on lighthouse `ea4f5bcf`, branch `d273-install`, my own worktree `C:/Users/nname/Desktop/worktrees/e-install-wt`.
- 9 files, +199/−10. Not pushed. **Nothing live changed:** `~/.claude` and the installed hooks are untouched; they change only when the chair lands this. The real `~/.claude/settings.json` is still dated 2026-10-06 02:54, checked after every run.

## 1. The five hooks resolve their folders as the app does
- **The app's rule** (`consonance/src-tauri/src/main.rs` `set_dirs`, `default_data`, `default_instances`): `~/.consonance.json`'s `data_dir` / `instances_dir` when set, trimmed (a BOM is allowed), else `%USERPROFILE%\.consonance` and `%USERPROFILE%\claude-instances`.
  - **Note: the plan said `%USERPROFILE%\.consonance` for instances too.** The app's own default for instances is `claude-instances`, and the hooks follow the app.
  - `home` is `USERPROFILE`, else `.`, as `main.rs` `home()`.
- **One block, the same text in all five,** between `// D273 dirs: begin` and `// D273 dirs: end`. `dirs.test.js` row 1 holds them to one text. The env overrides each hook had (CONSONANCE_DATA, VANTAGE_DATA, RETURN_LEDGER, RETURN_STATE_DIR, SOURCED_LEDGER, the *_LOG ones) still win.
- **Lines, for a clean merge with C** (who changes only refusal-message strings):

| file | the D273 block | then |
|---|---|---|
| `dev/shell/hooks/session-start.js` | 50–59 | the `INSTANCES_DIR` line |
| `consonance/hooks/sessionstart-state.js` | 42–51 | the `DATA` line |
| `consonance/hooks/findings-return.js` | 81–90 | the `DATA`, `FINDINGS`, `RETURNS`, `STATEDIR` lines |
| `consonance/hooks/sourced-stop.js` | 88–97 | the `LEDGER` line |
| `consonance/hooks/precompact-preserve.js` | 66–75 | the `DATA` line |

- `RETURNS` and `STATEDIR` stay out from under `VANTAGE_DATA`, as they always were (row 4 pins it).

### THE PROOF, this machine, before (`ea4f5bcf`) and after, byte for byte
- **Method:** scratch `install/proof.js`; output `proof.txt`, sha256 `c08b2895…`.
  - Each hook's folder constants (and the D273 block) are evaluated in a VM sandbox. No hook body runs and nothing is written.
  - The override env vars are cleared, so the defaults are what is shown. `USERPROFILE` is this machine's.
- **Result: every constant is the same bytes:**
```
dev/shell/hooks/session-start.js | this machine | INSTANCES_DIR | before "C:\\Consonance\\instances" | after "C:\\Consonance\\instances" | SAME BYTES
consonance/hooks/sessionstart-state.js | this machine | DATA | before "C:\\Consonance\\data" | after "C:\\Consonance\\data" | SAME BYTES
consonance/hooks/sessionstart-state.js | this machine | LEDGER | before "C:\\Consonance\\data\\sessionstart-state.jsonl" | after "C:\\Consonance\\data\\sessionstart-state.jsonl" | SAME BYTES
consonance/hooks/findings-return.js | this machine | DATA | before "C:\\Consonance\\data" | after "C:\\Consonance\\data" | SAME BYTES
consonance/hooks/findings-return.js | this machine | FINDINGS | before "C:\\Consonance\\data\\vantage_findings.jsonl" | after "C:\\Consonance\\data\\vantage_findings.jsonl" | SAME BYTES
consonance/hooks/findings-return.js | this machine | RETURNS | before "C:\\Consonance\\data\\return_ledger.jsonl" | after "C:\\Consonance\\data\\return_ledger.jsonl" | SAME BYTES
consonance/hooks/findings-return.js | this machine | STATEDIR | before "C:\\Consonance\\data\\return_state" | after "C:\\Consonance\\data\\return_state" | SAME BYTES
consonance/hooks/sourced-stop.js | this machine | LEDGER | before "C:\\Consonance\\data\\sourced_ledger.jsonl" | after "C:\\Consonance\\data\\sourced_ledger.jsonl" | SAME BYTES
consonance/hooks/precompact-preserve.js | this machine | DATA | before "C:\\Consonance\\data" | after "C:\\Consonance\\data" | SAME BYTES
consonance/hooks/precompact-preserve.js | this machine | LEDGER | before "C:\\Consonance\\data\\precompact.jsonl" | after "C:\\Consonance\\data\\precompact.jsonl" | SAME BYTES
```
- **The stranger case** (a temp `USERPROFILE`), before → after:
  - With no config, everything resolved to `C:\Consonance\...` before (into the keeper's data, on this machine) and resolves under the stranger's own home after (`<TEMP HOME>\.consonance\…`, `<TEMP HOME>\claude-instances`).
  - With their own config (a BOM, padded values), it resolves to their folders after (`D:\Somewhere\cdata`, `D:\Somewhere\inst`, trimmed).
  - All 30 rows are in `proof.txt` (10 per home; the 10 for this machine are all SAME BYTES).
- **A real hook in a stranger's home** (`dirs.test.js` row 5, `sourced-stop.js` as a process, no override): its ledger lands at `<home>\.consonance\sourced_ledger.jsonl`.

## 2. install.ps1: `{}` when settings.json is missing, and it says so
- **Where:** `dev/shell/install.ps1` 809–818 (the old refusal at 809–813 replaced).
  - A home with no `settings.json` gets its folder and `{}` (no BOM: JSON.parse rejects one, the script's own note at 960–965), with the message "NO settings.json at … -- created an empty one ({}) to register the hooks into. Nothing else in it was invented." Then it is registered into like any other.
  - An existing file is merged into and backed up first, as before. One that does not parse still stops the script.
- **Run in a stranger's temp home** (everything the script writes is under `%USERPROFILE%`): exit 0, the message printed, the hooks registered, the backup made, no BOM.

## 3. GUIDE (`consonance/GUIDE.md`)
- **Prerequisites (ruling 4):** Node.js on PATH (the hooks), and Python 3, a real `python.exe` on PATH or in `%LOCALAPPDATA%\Programs\Python`, not the Microsoft Store stub (the pulse hook).
  - It also says to install them BEFORE the hooks step: `install.ps1` writes the path it finds into each hook, and registers a placeholder when it finds none (`install.ps1:735-736`).
- **"Then, the hooks"** (inside section 1, so no section number moves): the command; where it copies and registers; `{}` on a fresh home; merge plus backup on an existing one; `-NoRegister` to preview (it still copies). The hooks keep their records in the app's own Data folder, so the order against the first launch does not matter.

## Tests (all under the lock)
- **`consonance/hooks/dirs.test.js`, 5 rows:**
  1. one block, the same text in all five, and no `C:\Consonance` in their code;
  2. a stranger with no config gets the app's defaults under their home;
  3. a named config (BOM, padding) gives those folders, while blank, non-string or not-JSON falls back;
  4. the env overrides win;
  5. a real `sourced-stop` run in a stranger's home writes under that home.
  - Red first on `ea4f5bcf`: **0/5** (`install/base.tap` sha256 `a5c1c013…`). With the five hooks' own tests: **65/65** (`new.tap` `a2d6ed44…`).
- **`dev/shell/install-fresh-home.test.js`, 2 rows, temp homes only:**
  1. a fresh home: exit 0, the message, `{}` with no BOM, hooks registered;
  2. an existing `settings.json`: the user's keys survive and no "created" message appears.
  - Red first on `ea4f5bcf`: row 1 fails (the refusal), row 2 passes as a guard. Branch, with `shell-dir-seam.test.js`: **6/6**.
- **My own fixes on the way:**
  - row 5 first compared the size of the LIVE `C:\Consonance\data` ledger, which any live pane may grow, so I dropped that check (the ledger landing under the stranger's home already shows where the write went);
  - row 4 compared a VM-realm object with `deepStrictEqual`, now compared through JSON;
  - my first sandbox lacked `path`.
- **Not done:** session-start has no test of its own in the repo (it passes `node --check`, and the proof evaluates its constant). The full hooks suite and the live install are the chair's at landing.
