# D627 part 1: adjudicate machine flags against what happened next (READ ONLY)

You are helping pane P answer the keeper's question: "what about the room was good but not utilized, and what was utilized and not good". Two automatic checkers produced flags that nobody ever scored for VALUE. Your job is to score a fixed slice of them against the record. **Read only: write nothing anywhere except your one output file.** Never print a credential value. Do not run test suites or builds.

## The record (where to look)
- The lighthouse repo: `C:\Users\nname\Desktop\lighthouse` (git log, `exo_memory/handback/*.md` hand-backs with their corrections sections, `exo_memory/librarian/*.md` the librarian's dated logs, `exo_memory/loop/*.md` plans/results, `exo_memory/journal/`). `git log -S"<string>"` and `grep -rn` are your friends.
- t180 repo: `C:\Users\nname\Downloads\t180-fresh` (git only; read only).
- The board: `C:\Consonance\data\` (board files) if needed.
- Transcripts (huge; grep only, never read whole): `C:\Users\nname\.claude\projects\C--Consonance-instances-<seat>\*.jsonl`.

## What to decide, per row
**A. Was the flag RIGHT?** "Right" here means VALUE: the flagged sentence states something that was actually **wrong** (a wrong figure, path, sha, count, version, verdict, or a claim the record contradicts) at the time it was sent. If the sentence was accurate per the record, the flag found no error (`NO-ERROR`) even if it was procedurally correct that the seat hadn't re-read it. If you cannot settle it from the record in reasonable effort, say `UNDECIDABLE` and why. Check each claim against its MASTER (the hand-back, the file, the commit), not against another summary. Do not assume either way: a claim restated by the librarian from a pane's ring is right only if the pane's file says the same.

**B. What happened next?** If the claim was wrong: was it corrected later, by whom, where (path:line or sha), and how long after? `CAUGHT-ANYWAY` (someone corrected it by other means) or `MISSED` (no correction found; say where you looked). Also: did the error matter (did anything act on the wrong figure)?

**C. For vantage rows only (they WERE surfaced to the originating pane via the return ledger):** did the pane act on it (a correction, a re-derivation, a reply, a commit) — cite it — and did acting help? And was the vantage reader itself right (re-derive its check yourself where cheap; its `commands` show what it ran).

## Output — one file, exactly this shape
Write `<your output path>` as a markdown table, one line per row, columns:

`| row | seat | verdict | claim wrong? | acted on? | helped? | citation | note |`

- `verdict` for second-reader rows: `ERROR-MISSED`, `ERROR-CAUGHT-ANYWAY`, `NO-ERROR`, `UNDECIDABLE` (the row's worst flag decides; say in the note which flag).
- `verdict` for vantage rows: `RIGHT-ACTED`, `RIGHT-IGNORED`, `WRONG` (the reader's DISAGREE was itself wrong), `UNDECIDABLE`.
- `citation`: the path:line, sha or command result that settled it. Every row needs one, or the row is UNDECIDABLE.
- `note`: one short line; for an error, the claimed vs actual value.

After the table, add: the counts per verdict, and up to 3 rows you think were the most valuable catches (a real error, in something that mattered). Keep the note column short; no prose essays. Be honest about effort: if you ran out of time on a row, mark it UNDECIDABLE ("not reached"), never guess.
