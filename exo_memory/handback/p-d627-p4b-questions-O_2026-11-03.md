# p-d627 part 4b — the continuity test's questions (O), 2026-11-03

Packet: the chair's D627 part 4b (13:07Z). Read first: `exo_memory/loop/plan_room_value_2026-11-03.md` "Part 4, widened", and A's registration `exo_memory/loop/continuity_test_registration_2026-11-03.md` (de35c938). Seat: O, question writer. **No arm was run.**

## The two files, kept apart
- **Questions, for the arms:** `exo_memory/handback/p-d627-p4b-questions-O_2026-11-03_QUESTIONS.md`
  - **sha256 `6a599d28075861e6a66a7ef9ac490fe7920238ad9c8ab8c5819c15525bc39584`**
  - 34 questions, each tagged; no answers, and no pointers to where they are.
- **Keys, for the grader only:** `exo_memory/handback/p-d627-p4b-questions-O_2026-11-03_KEYS.md`
  - Its sha256 is in the commit, taken after a final wording edit, and not given here, so the hand-back carries nothing an arm could use.
  - Every key is a file and a line, never a seat's memory.
- **Both sit under `exo_memory/handback/p-d627-*`,** which A's registration denies to every arm (registration:34).

## Coverage
| tag | count | from |
|---|---|---|
| state | 7 | where things stand: 0.4.39 held, the installed 0.4.38, D624/D626, the stick waiter, B's crash, the next feature |
| his words | 12 | his words on key turns, 11-01 08:28 to 11-03 07:02 |
| judgment | 9 | what he decided, and what he would say to a proposal, keyed against what he did say: the 0.4.39 push, the no-cut rule, the clutter timing, the slab's underside, the 0.5 m apron, the history rewrite, D611, D609, the helix |
| lesson | 6 | which lesson came from which mistake |

Judgment plus his words make **21 questions**, the falsifier's subset (registration:12).

**The key files**, pinned at lighthouse HEAD d0ee92de; each had worktree = HEAD when the keys were written:
- `exo_memory/librarian/2026-10-18.md` (git-blob 8e7c7c1f1e65…, lines 1628-1776);
- `exo_memory/loop/t180_where_we_are_2026-11-03.md` (git-blob 7001ff755751…);
- `exo_memory/loop/plan_room_value_2026-11-03.md` (git-blob 78867a8419e1…).

checked: `sed -n "<line>p"` on all 25 notebook key lines and both plan lines → each starts with the entry the key cites.

## What the test can and cannot see, from how the questions were drawn
- **Every key is in a room file.** The notebook is one, so the ROOM arm can in principle find every answer by reading.
  - What the test measures is whether it does, and how fast, not whether the answer exists outside the chain.
  - A question whose answer lives only in the carried conversation would have needed a key outside the files, and the packet forbids that. **So this set cannot, by construction, measure chain-only knowledge.** The registration should state that limit beside its falsifier.
- **Q22 and Q31** overlap the morning discussion A names as a confound (registration:52).
- **My stake:** I was in much of this record (D604, D620, D621, D622), so my questions lean toward the track and the audit I saw. I haven't read the librarian's transcript.

## Corrections
- I fixed two wording slips in the keys file (a "Q34" in the grader notes; "He" where the librarian is meant) before committing.
- The questions file was unchanged by that edit, and its sha256 above is of the final file.

SOURCES: plan_room_value_2026-11-03.md; continuity_test_registration_2026-11-03.md; exo_memory/librarian/2026-10-18.md (lines 1476-1780 read); t180_where_we_are_2026-11-03.md; sha256sum of the questions file
NEXT: librarian hands A the questions path and sha256 when A is ready to run the arms; the grader alone gets the keys
