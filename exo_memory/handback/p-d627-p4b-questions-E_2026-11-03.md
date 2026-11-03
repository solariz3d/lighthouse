# D627 part 4b: the continuity test's questions (pane E)

Seat: pane E (machine D), sibling-07b8a48f. At the chair's 07:02 order (delivered 07:33). I have not read the librarian's chain. No arm was run.

## The two files

- **Questions** (the arms see only this): `exo_memory/handback/p-d627-p4b-questions-E_2026-11-03_QUESTIONS.md`
  checked: `sha256sum` → **sha256 0f344c3e88b5c0435d61911c60c6925ec1919de8bb62a74647f9f4ba2df595f9**
- **Keys** (for the grader, later): `exo_memory/handback/p-d627-p4b-questions-E_2026-11-03_KEYS.md`
  checked: `sha256sum` → sha256 ae4fdd9784a55e2b9d01d09db9fabcee79bf4bd16aee4c5f3854f1b56da8caf0
- 35 questions, 35 keyed rows (checked: `grep -c` on each file → 35, 35). Each key is path:line plus the expected answer and what counts as partly right.

## What they cover (drawn from the record, not from memory)

- **Window:** the librarian's log `exo_memory/librarian/2026-10-18.md` lines 1624–1780 (2026-11-01 00:09 to 11-03 07:05), read whole; plus `loop/t180_where_we_are_2026-11-03.md`, `loop/room_audit_result_2026-11-02.md` and the plan's own lines 3–5.
- **Types,** tagged on each question:
  - state (6);
  - decision (6);
  - his words (7);
  - lesson (7);
  - proposal (5): each graded against what he did say;
  - judgment (4): calls the record already answered.
- **The falsifier's subset** (judgment + his words): questions 13–19 and 32–35, **11 questions**. Whether the 5 proposal questions join it is the registrant's call; the keys say so.

## Choices and weaknesses (also at the foot of the keys file)

1. **Every key is in a room file any arm may read.** None is a transcript, the board or a `p-d627-*` file, so a ROOM win cannot be an artefact of where I put the keys. It also means the set measures recall by reading against carried recall; what the room never wrote down cannot be keyed by path:line, so it is absent by construction. That is the set's main limit, and it leans against CHAIN.
2. **Paraphrase:** for questions 12, 17, 18 and 19 the record holds only the librarian's paraphrase of him; an arm closer to his exact words should be graded right.
3. **Overlap with O:** O's set (`p-d627-p4b-questions-O_2026-11-03_*`) exists. I did not open it. One line of it (its question 32, on the shell-making rule) showed in a grep I ran for "shell-making" in the D626 lap, before I knew the file was there; my question 22 covers the same rule. All the others come from the record directly.
4. **My stake:** none in which arm wins. I am not the grader and hold no arm labels.

## Corrections

None to this set. The D626 park hand-back carries this lap's other correction (the wrong lock folder).

NEXT: A runs the arms on the questions file by its sha256 when the librarian says go; P (or the librarian's choice) grades with the keys after.
