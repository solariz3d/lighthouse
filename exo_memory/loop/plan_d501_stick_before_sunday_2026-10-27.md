# D501: the stick must carry again by Sunday 2026-11-01. Librarian, 2026-10-27 17:2x

The keeper, 17:21: "we go back to work on sunday, so that means next sunday, we take the stick and the transcripts onto the laptop again everyday, so its back to how its supposed to be. So yes, the whole month i have had off work ... we havent been going to the laptop, but rather accumulating everything on desktop."

So from Sunday 2026-11-01 the daily carry desktop → stick → laptop resumes. Today the stick cannot carry: D479 (E, `exo_memory/handback/p-d479-stick-E_2026-10-26.md` §2) found every file written to it since about 10-20 reads back as different bytes (9 of 9 ledger tails mismatch their sha256, 14 begin `55 aa 55 aa 1e f3 c8 a0`, from 64 KiB on everything differs, `MANIFEST.json` unreadable), while a 09-29 control reads EQUAL. E's inference: real capacity smaller than the 250 GB it reports, or failing flash. checked 17:23: still mounted as D:, 250 GB, 18 GB used, 233 GB free, folder `consonance-L-20260911`.

Two more facts from D479 and my 15:42/16:09 notes: the carry runs at LAUNCH, and the Leave's 600 s bound timed out before the ledger was written on 10-20 and 10-26; the carry has grown past 3.8 GB since the laptop's 09-29 agreed state, so every Leave will time out until it moves. The laptop import refuses a damaged tail (`tail-carry.js:904`, TAIL_DAMAGED), so nothing on the laptop is at risk from a bad stick.

## Part 1, pane A (check it): is the stick lying about its size, or dying?

Write into FREE space only; touch nothing that exists on D:. Under BelowNormal, no window, no focus.
- Write 1 GiB files of a known seeded pattern (file index + block number in every 4 KiB block) into `D:\d501-capacity-test\`, one after another, up to 40 GiB or until a write fails. After each file, flush, then read it back whole and compare. Also re-read file 1 after every 8 files: on a fake-capacity stick the LATER writes overwrite EARLIER space, so file 1 going bad is the tell, and the file count at which it goes bad is the real capacity (plus the 18 GB already on it).
- Also read back one of the 09-29 tails E used as the control and one 10-20 tail, and say whether they read the same as E measured (the control still EQUAL, the 10-20 tail still `55 aa …`).
- Report: real usable capacity (a number of GiB, or "≥ 58 GiB, no failure seen" = 18 used + 40 written), the first offset at which bytes went wrong, write and read MB/s (so the Sunday carry's time can be planned), and the verdict in one line: FAKE CAPACITY / FAILING FLASH / NO FAULT FOUND. Then delete `D:\d501-capacity-test\` (your own test files only) and say so.
- Prior art: E's tools from D479 (`tailsha.js`, the `--verify-set` run) are in its hand-back; reuse what reads.

## Part 2 (prove it: the carry), after Part 1, by Saturday night 2026-10-31
Depends on the verdict and the keeper:
- FAKE CAPACITY or FAILING FLASH → the keeper brings a new medium (his call; nothing we can do about the hardware). Then one pane does a full, verified carry onto it OUTSIDE the Leave's 600 s bound (the carry invoked directly, however long it takes, BelowNormal), sha256 of every tail against the ledger, and a `--verify-set` that returns 0.
- NO FAULT FOUND → the bad region is the stick's own; a fresh folder on the same stick, then the same full verified carry.
Either way the written set must verify on the desktop before he leaves with it, because the laptop import will refuse what does not match.

## Part 3, Sunday, the keeper's hands
The laptop-side import, at the laptop. If the laptop wrote nothing to its seats in October, there is no fork to resolve; D479 §4 says how a fork shows if there is one.

Kept out: the 600 s Leave bound itself (a design question for later: once the daily carry is small again it stops mattering). Tier: Part 1 check it (writes only its own files, deletes only them). surfaced: D479 §2, `tail-carry.js:904`, the 15:42/16:09 notes.
