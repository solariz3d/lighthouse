# p-ringstamp-A — D309 part 2 (ledger D310): the send time on rings and dispatches; seat A, 2026-10-12

**Result: commits `a22e3ec0` and `9b034220` on `d309-a` (worktree `G:\consonance-worktrees\a-d309-wt`, from main `6af6d01c`). Local, named paths, not pushed. I did NOT build the app.** Files: `consonance/src-tauri/src/main.rs` (the stamp, the three senders, the drain, 7 rows) and one regression row each in `hooks/reply-slot.test.js`, `tools/chain-status.test.js`, `hooks/blind.test.js`, `hooks/board-digest.test.js`, `hooks/claim-check.test.js`, `hooks/sources-gate.test.js`. portable-paths green (389 files, 0 new) and carrier-drift GREEN on the last commit.

## What a ring looks like now
The label and text are unchanged and stay the head of the message. **One line is added at the END:**
- sent at once: `[sent 2026-10-12T07:25:51Z · Oct 12, 1:25 AM local]`
- written after being held: `[sent 2026-10-12T07:25:51Z · Oct 12, 1:25 AM local · HELD 312 s · delivered 2026-10-12T07:31:03Z · Oct 12, 1:31 AM local]`
UTC to the second, then the local civil time in the form the app's pulse already uses (`pulse_stamp`, `main.rs:4384`). Text only: no gate, no refusal, nothing a seat must do differently.
- The stamp is built by `with_send_stamp` / `send_stamp_text` / `with_delivery_stamp` (`main.rs:11040-11068`), applied by shadowing right after each label line: `chair_inject_exec` (`:12354-12355`), `librarian_call_exec` (`:12444-12445`), `pane_call_librarian_exec` (`:12520-12521`). The label lines and the `gate_or_queue(app, &tid, &msg, &preview)` call strings are unchanged, because a source test and the mutation harness anchor on them.
- A queued message keeps its send line while it waits; `drain_inboxes` rewrites that last line just before it writes (`:11302`): `HELD <n> s` and the delivered time. A message with no well-formed send line as its last line (keep-warm, a pull, a dyad spot) is returned unchanged, and a second pass changes nothing more.

## Why a LAST line, not a leading one (the argument the chair asked to hear)
Every reader of a ring anchors on its head, so a leading `[sent …]` line would be read as something else. checked: the consumers below. In particular `reply-slot.js:114` classes a prompt by `^\s*\[(chair:|pane:|librarian:|keep-warm|sync|lap |orchestrator)`, and a prompt that begins `[sent` matches none: **a pane ring would be read as a keeper message** and the librarian's reply would be judged as keeper-facing. A stamp inside the label would break `claim-check.js:133`, `blind.js:249` and `chain-status.js:881`. A trailing line breaks none, and the app already ends messages with its own notes (the digest at ring, the NEXT-trailer note).

## Every consumer of the labels (path:line), and what I did
Found by `Grep` over `consonance/` and `dev/` for `chair:MAIN|librarian:LIB|[pane:|(chair:|pane:`; read, not assumed. **None needed a code change.** Each one that reads a prompt got a row.
| consumer | where | reads | change |
|---|---|---|---|
| reply-slot hook | `consonance/hooks/reply-slot.js:114,115,136` | the HEAD of the prompt (`RING`, `PANE_RING`) to class keeper / pane-ring / ring | none; row `reply-slot.test.js` "D309 STAMP" (sent and held) |
| claim-check | `consonance/hooks/claim-check.js:129-133` | `^\[pane:X\]` to tell whose ring a turn's prompt is | none; row `claim-check.test.js` "D309" |
| blind / sealed windows | `consonance/hooks/blind.js:219` (`isSealedDispatch`), `:246-251` (own ring ends the window), `:200` | the head after an optional `<pasted_content>` tag | none; rows `blind.test.js` and `board-digest.test.js` "D309" |
| chain-status receipts | `consonance/tools/chain-status.js:858-881` (`ringRow`, the key = tag + first 60 characters of the preview, matched by `contains`) | a prefix, so a trailing line cannot unpair a ring | none; row `chain-status.test.js` "UNRECEIVED … (D309)" (sent and held; librarian and pane rings) |
| sources gate | `consonance/hooks/sources-gate.js` (prompt boundary; the test `sources-gate.test.js:161` shows which prompts) | whether a prompt is a ring/keep-warm/keeper text, by head | none; row `sources-gate.test.js` "D309 STAMP" |
| boundary check | `consonance/tools/boundary-check.js:26` (header), `boundary-check.test.js:42,255,304-310` | board rows that START `[chair:MAIN] ` | none (head). Not re-run |
| tell-index | `consonance/tools/tell-index.test.js:151,343` (`classifyOrigin`) | the head | none. Not re-run |
| trailer gate, digest-at-ring | `consonance/src-tauri/src/trailer.rs:314`, `mcp.rs:3304,3781` (test constants), `mcp.rs:361,372,378` (doc strings) | the SENDER's text, before the label and the stamp are added | none |
| board / audit lines | `chair_audit` rows `call_chair -> Main [..]`, `call_librarian X -> LIB [..]: "<preview>"`, `QUEUED -> `, `DELIVERED -> ` (`main.rs`, `chain-status.js` reads the call_ shape) | built from `text` and the 110-character preview, never from `msg` | none |
| capture / receipt | `await_render(&cap, before, &receipt_needle(text), &receipt_needle_tail(text))` in the three senders; `main.rs:21583` (`d098_prompt` row) | needles taken from `text`; the stamp comes after the tail the needle looks for | none; the full cargo test below covers it |
| mutation harness | `dev/mutation/mutate-librarian-call.js:57-61` | the literal line `let msg = format!("[librarian:LIB] {text}");` | none: that line is unchanged. **Anchors checked by grep, harness not run** (it runs cargo per mutant) |
| redaction | `dev/diversity/redact.js:15` (strips `[pane:X]` letters) | letters in the text | none: the stamp has no letters |
| generated consumer tree | `consonance/tools/gen-consumer.js` ships `main.rs` and the hooks as they are; no code parses the labels there | — | none. **gen-consumer tests not run** (the chair's) |
Not stamped, deliberately (outside the three label sites you named): `[dyad-spot]` (`main.rs:9988`), `[committee]` pulls (`deliver_pull`, `:11383`), the keep-warm text. Say if you want them.

## Checks (all under the heavy-run lock, `CARGO_TARGET_DIR=G:/consonance-cargo-target-a309`)
- **Red first:** the 7 rows in `main.rs` (`ring_stamp_tests`) did not compile before the functions existed (`E0425 cannot find function with_send_stamp`, 10 errors). After: `cargo test --bin consonance ring_stamp` → 7 passed, 0 failed.
- **The whole bin suite:** `cargo test --bin consonance` → **1048 passed, 0 failed, 6 ignored**, 0 temp folders left. That is more than the targeted run the packet asked for; the chair's full run at landing is still the one that counts.
- **Consumer rows:** the six JS files pass: reply-slot 39/0, chain-status 148/0, blind 25/0, board-digest 36/0, claim-check 28/0, sources-gate 65/0. **These six rows were NOT red first, and could not be**: the consumers already read the head, so a row that says they still do passes today. They are regression pins. (I did not mutate the consumers to show the rows bite; the existing `reply-slot.mutants.js` covers its own regexes.)
- **Mutants on the stamp itself: applied 8 / caught 8 / NOT APPLIED 0.** Stamp placed in front; chair sender not stamping; pane sender not stamping; the drain not stamping; a clock that moved back going negative; a second pass rewriting again; the delivered time equal to the send time; a malformed last line being rewritten. **The first run caught 7 of 8:** the last mutant survived because my "malformed" input lacked the closing bracket and was refused earlier by another guard; I added a well-formed-but-wrong line to the row and it is caught.
- portable-paths was RED on the first commit (a drive-letter path in my sources-gate row, copied from its neighbour); the second commit joins the string so the row adds no site.

## What you must know
- **Live only after an app rebuild and restart, which is the keeper's.** Nothing is running this code now.
- **The stamp is the only thing that changes in a delivered ring.** A seat will see the extra last line. A tool that reads the LAST line of a received prompt would see it; I found none (the NEXT line is read from the sender's text before delivery), but I did not read every seat-side script.
- The local half comes from the machine's own clock and time zone (`chrono::Local`); the Rust rows pin the UTC half and the shape, not the local text.
- Held-time is measured from the stamped send instant to the instant the drain writes, not from the board's QUEUED row; they can differ by the drain's tick.

NEXT: chair cherry-pick `a22e3ec0` and `9b034220` from `d309-a`, run the full cargo test and the gen-consumer tests at landing, and have the keeper rebuild and restart the app for it to take effect
