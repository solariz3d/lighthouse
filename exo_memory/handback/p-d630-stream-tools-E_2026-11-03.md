# D630: fix 2(d), the tools that broke on transcripts over 512 MB (pane E)

Seat: pane E (machine D), sibling-07b8a48f. Order: the chair, 08:30 (plan `loop/plan_room_fixes_2_5_2026-11-03.md` at 6fa5aa26, part D630). Tier: PROVE IT. Still parked from T-180; d624-e untouched.

## 1. Where it is

- **lighthouse `d630-e` at `ca4cd85`** (one commit) off `d628-o` 82da03fc, worktree `C:\Users\nname\Desktop\worktrees\lh-d630-e`. **Not pushed.**
  checked: `git -C …/lh-d630-e log -1 --format=%H` → `ca4cd85cbd9c1dd2eb33272e1a00ea134cb5d0b4`
- Files: `consonance/tools/pane-status.js`, `usage.js`, `offramp-check.js`, new `big-transcript.test.js`. No hook, no instruction file, no seat's conversation touched (the standing guard).

## 2. The cause

V8 cannot make a string longer than 0x1fffffe8 (536,870,888) characters, so `fs.readFileSync(file, 'utf8')` on a bigger transcript throws ERR_STRING_TOO_LONG:
- **pane-status.js:96** threw and died;
- **offramp-check.js:72** threw and died;
- **usage.js:114** caught it (`catch (_) { continue; }`) and went on, so the table was printed **without that seat's file, and nothing said so**. Its stat at :112 skipped the same way.

Seven real transcripts are past the limit now (540 to 1,288 MB). checked: `find ~/.claude/projects -name "*.jsonl" -size +512M` → 7 files.

## 3. The fix

- All three read a line at a time through `sourced.js eachLine` (D273, written for this same limit and already tested; reused rather than a fourth reader).
- **pane-status** reads forward and keeps the backward scan's meaning: the newest assistant record with text is the last turn; a tool_use in it or in any later assistant record means WORKING.
- **usage** throws `could not read <file> (<code>); refusing to print a table that would leave it out` on any stat or read error, and its command line catches that, prints it to stderr and exits 1 with **no table**.
- **offramp-check**'s scan loop became the eachLine callback (`continue` → `return`; the inner `break` unchanged).

## 4. Proof

- **The test** `consonance/tools/big-transcript.test.js` builds one synthetic transcript of **541 MB** in the scratch root (G:\consonance-scratch via scratch.js), with responses at the start and an offer and a last turn at the end, and removes it in `after`. Rows:
  1. control: reading it whole throws ERR_STRING_TOO_LONG;
  2. pane-status on it reports the last turn;
  3. pane-status read forward: a tool after the last text, or in it, is WORKING; text with nothing after is done? (small files);
  4. usage counts all three responses, first and last;
  5. usage throws on a read error, naming the file;
  6. usage throws on a stat error, naming the file;
  7. usage's command line prints no table and exits non-zero;
  8. offramp-check counts all three assistant turns and finds the offer at the end.
- **Red first** on 82da03fc (rows 1, 2, 4, 5, 7 and 8, the six first written; rows 3 and 6 were added after the fix and are checked by the mutants below): control ok; pane-status `exited 1 … Cannot create a string longer than 0x1fffffe8`; usage `[] ` against `['msg_first','msg_last','msg_offer']`; read error `Missing expected exception`; command line `usage exited 0 and printed` a table; offramp `ERR_STRING_TOO_LONG`. 5 of 6 failed.
- **Green:** sourced, big-transcript, usage and offramp-check tests → **53 pass, 0 fail**.
  checked: `node --test consonance/tools/{sourced,big-transcript,usage,offramp-check}.test.js` → `# tests 53 # pass 53 # fail 0`
- **Mutants** (no harness names these files, so by hand: `evidence/mutants.js`, each one exact replacement in a scratch COPY of consonance/tools, the tracked files never written, a control first): **applied 9 / caught 8 / NOT APPLIED 0** (`evidence/mut.txt`, plus the U2 rerun after row 6 was added: caught).
  - Survivor **U3** (the command line's catch removed): **equivalent.** The uncaught throw still exits 1 with empty stdout and the file named on stderr, so the failure is just as loud; only the stack trace differs.
- **On real files** (read-only):
  - pane B's 591 MB transcript: the old pane-status (lighthouse main) → `ERR_STRING_TOO_LONG`; the new → `done? quiet 6093s`, 0.7 s. offramp-check's new scan → 4,412 assistant turns, 0 hits, 1.2 s.
  - **How short usage was:** `readResponses` over the 33 transcripts written in the last 2 days: old **8,949 responses, 3.53 B tokens**; new **128,300 responses, 57.9 B tokens** (19.9 s). The old table left out about 93% of the responses in that set, silently. (Files modified in the window, all rows in them; a like-for-like comparison, not a 2-day total.)
- **Clean-up:** the synthetic files are gone. checked: `ls G:/consonance-scratch | grep -cE "bigtx|d630"` → 0.

## 5. Corrections and notes

- inferred: any table that came from usage.js since the transcripts passed 512 MB is short, and silently; whoever relied on one should re-run it on d630-e. I have not checked which of the room's quoted figures came from it (D618's seat weights were my own scratch scripts, whose read path I have not re-checked).
- My first offramp edit went through a heredoc that ate a backslash (the same trap as D626); it failed its own line check and wrote nothing; redone with Edit.
- heavy-run warned **C: has 47.3 GB free, under 50 GB**.

NEXT: librarian checks ca4cd85 when this lands; the landing pane the chair names merges d630-e onto d628-o with the other fixes.
