# README audit — every description checked against the tree, 2026-09-14 ~06:45–07:20 (hand-back from the Third Place; applied and pushed at 2ad8715)

*At the keeper's ask ("a comprehensive audit of the read me, about within the app, and every description to
match what consonance currently is now"). Five files audited: `README.md`, `consonance/README.md`, the About tab
in `consonance/ui/index.html`, `exo_memory/README.md`, `consonance/hooks/README.md`. Method: every claim that
names a command was re-run; every path was `ls`'d; every count was recounted; every file added to
`consonance/tools`, `consonance/hooks`, `dev`, `consonance/src-tauri/src` and `consonance/ui` since 2026-09-02
(`git log --since=2026-09-02 --diff-filter=A --name-only`) was checked for a description. HEAD `871ad66`;
running binary matches the newest Rust commit (`node consonance/tools/whats-live.js`: "Nothing stale").*

## Findings — claim · found · action

| file | claim | found | action |
|---|---|---|---|
| app README | 7 `.md` briefs | 9 `.md` files (7 briefs + `frag-pointer.md`, `frag-traces.md`) | corrected |
| app README | 41 `#[tauri::command]` | 46 | corrected |
| app README | "Panes persist by reconstruction, not by resume; `resume_pane` does not `--resume`" | **false since P1b, 2026-09-12**: `resume_pane` tries the real `--resume` first (2.1.269 keeps completed turns, 9/9 and 6/6 measured), falls back to warm spawn on refusal; warm brief deliberately not written on the resume path | section rewritten from the code comment |
| app README | verb grep `"(post_board\|…)"` | `read_board` and `raise_pull` are `async fn` names, not quoted strings; the printed command misses two of the ten | command corrected; list of 10 unchanged |
| app README | 45 non-test tools, 49 tests | 59 non-test (+2 `.mutants.js`), 68 tests; three tools say "WIRED TO NOTHING" in their headers | corrected, the three named |
| app README | 12 hook scripts | 14 non-test files (13 hooks + `blind.js` library) | corrected |
| app README | the 199-turn / `read_board`-zero measurement "is in hooks/README.md" | it is in `consonance/AUTONOMY.md`; `hooks/README.md` holds the roster and the design argument | pointer corrected |
| app README | "`ls dreams/` returns nothing; the directory exists and is empty" | no `dreams/` in the checkout; dreams live at `C:\Consonance\instances\<seat>\dreams\` (13 in the Third Place's; `whats-live` reports 25 live) | corrected |
| app README | (absent) sync at launch, the carried receipt, the state set, the stick, the live mirror, `lap_holders.rs`, `seat_alias.rs`, `harvest_guard.rs`, `commit-gate.js`, `close.js`, `stamp.js`, `board-compact.js`, `replay-check.js`, no-console-window | 24 files added since 09-02 with no description | new section "Two machines, one thread" + a landed-since paragraph, every item citing its file and the number in its own header |
| app README | Seven tabs | 7, correct; `terminal` (the default) was not described anywhere | one sentence added |
| root README | `index.html:38-44` | tabs are at lines 43–49 | corrected |
| root README | seats "as the tab bar names them" | the Terminal tab (default) missing from the list | added |
| root README | `PLAN.md` "the spec" | the July spec; says `main.rs` is 139 lines (now ~14,000+) | relabelled as the design's trace |
| root README | `PROGRESS.md` "the as-built stage tracker" | last dated entry 2026-07-27; ~800 commits since | relabelled as a dated trace through 07-27 |
| About tab | "The tab bar shows which seat holds the loop" | superseded by amendment 4 (2026-09-02): the logo is the indicator, the chip is the detail | corrected; one sentence on the stick setup window added |
| About tab | Orchestrator brief `BOOT.md` (app README says `BUILDING.md`, `COMMITTEE.md`) | both true: wakes on the room master, holds the chair verbs | harmonised |
| About tab | "run `cargo test --test arch_test`" | 11/12 at HEAD; the red one is `every_named_record_file_exists_and_every_record_file_is_named`, not plane separation | noted on the page |
| About tab | points to `consonance/README.md § What the gauges do and don't do` | no such section exists | pointed at root README § What was measured NOT to work |
| exo_memory/README | 2026-06-08 page: memory store at `…606\memory\`; "reconstruction, not continuity" | store is the June workspace; BOOT amended the claim to an open question | dated note prepended (append, never rewrite) |
| hooks/README | "Thirteen non-test files" | fourteen; `live-mirror-stop.js` not in the roster | count and row added, quoting the file's own header |

## Verified and left alone

`ADDRESS_TABLE` is two rows. QUIET/OPEN phases exist in `mcp.rs`. `LIBRARIAN_INTAKE_LIMIT` / `HARNESS_CLAUDE_MD_CHAR_CAP`
exist. The flake test `dirs_guard_tests::a_panicking_writer_still_puts_dirs_back` exists. `dream_cycle.ps1` +
test exist. `dev/shell/install.ps1` exists. All six spawn/audio commands exist. The four Listen files exist.
Rooms: `new_room` exists. The rolling window exists (`main.rs`, "rolling window" comment). The root README's
`dreams/` paragraph is correct (gitignored, on disk). The root README's seats, work chain and continuity
instruments paragraphs match the tree.

## What this audit cannot see

Whether a described behaviour is on screen: the binary matched the tree at 06:40, but the app README's own caveat
stands for every later commit. Whether `PLAN.md`'s design still governs anything: not checked beyond its date.
Whether the About page's prose about the stance matches the keeper's current wording: prose, not a claim.

## Re-derive

`node "<scratchpad>/audit_apply.js"` applied every correction with content anchors (aborts on a miss).
Counts: `grep -c '^#\[tauri::command\]' consonance/src-tauri/src/main.rs` · `ls consonance/tools/*.js | grep -v
'\.test\.js' | grep -v '\.mutants\.js' | wc -l` · `ls consonance/hooks/*.js | grep -v '\.test\.js' | wc -l` ·
`ls consonance/src-tauri/brief/*.md | wc -l` · `grep -oE 'async fn (post_board|read_board|call_chair|call_librarian|raise_pull|chair_[a-z_]+)' consonance/src-tauri/src/mcp.rs | sort -u`.
