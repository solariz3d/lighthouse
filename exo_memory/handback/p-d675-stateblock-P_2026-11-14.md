# The state block's HEAD subject clip (D675): READY, red first then green (pane P)

Seat: pane P (sibling-372c8abc). Tier: CHECK IT. Branch `sb-subject-p` at **5f1a0c38**, one commit on origin/main 676d5c5d,
worktree `Desktop\worktrees\lh-sb-p`. Nothing merged or pushed. O lands it.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\`.

## 1. A fixed clip would not have fixed it: the clip takes the overflow

checked: `node consonance/tools/state-block.js --json` in `Desktop\lighthouse` → 2,991 chars, not truncated, with a 74-character subject
(`git log -1 --format=%s | wc -c` → 75, newline included).

- So the block without its subject is about 2,917 characters. That leaves about 83 for the subject.
- A fixed clip at 72 characters plus any mark would sit at the cap, and would truncate at the next growth.
- What I built:
  - when the block would pass the cap, `render()` clips the subject by exactly the overflow and adds the mark
    `... [subject clipped, N chars in full]`;
  - a subject that fits is printed whole and unmarked;
  - if the subject cannot absorb the overflow, the existing loud truncation still runs.
- This is the chair's spec ("the subject is CLIPPED in the block, WITH A MARK"). The difference from a fixed length, said here so it can be
  ruled: the clip length depends on the room left under the cap.
- `repoSection()` now carries `subject: {line, sha, text}` beside its lines. No other caller reads that field.

checked: `grep -ln state-block consonance/hooks/*.test.js consonance/tools/*.mutants.js` → `consonance/hooks/sessionstart-state.test.js` only.

## 2. Red first, then green (`consonance/tools/state-block.test.js`)

- **The fixture:** a new git repo whose HEAD has a 200-character subject. Its `repoSection()` is rendered in a child process with
  `STATE_BLOCK_REPO`, then put together with the live repo's other five sections, so the block is as near the cap as it is at a wake.
- **One fixture correction, mine, made between my first red and the final red:**
  - The first fixture had no `origin/main`, so its REPO section printed the 80-character "no origin/main here yet" line where a wake
    prints "0 commit(s) unpushed".
  - That made the fixture 58 characters bigger than any real wake, and it stayed red even with the fix.
  - Now `git update-ref refs/remotes/origin/main HEAD` gives it a checkout's shape.
- **My own defect, caught by the existing D273 test:** my first edit returned from `repoSection()` before its unpushed line. Fixed before
  the commit.

checked: S/sb-red2.tap (the final fixture, with `state-block.js` stashed) → tests 30, pass 29, fail 1. The failure is the new test,
"the block was truncated (3000 chars)".

checked: S/sb-green.tap → tests 30, pass 30, fail 0. The new test passes, as does "a subject that fits is printed whole and unmarked".

checked: S/sb-hook.tap (`consonance/hooks/sessionstart-state.test.js`) → tests 12, pass 12, fail 0.

**What the new test asserts:**
- the block is not truncated and is within `CAP`;
- LIVE and its check are present;
- the HEAD line does not hold the whole subject, holds its start, and ends with `[subject clipped, 200 chars in full]`.

## 3. What this leaves

inferred: the budget at a wake is about 43 characters of subject once the 40-character mark is paid (83 − 40). The block has about
10 characters of slack that nothing else gives up. If any other section grows, LIVE will be cut again, and no subject will be the
cause. Who decides: the chair, whether to raise CAP or move LIVE earlier. Neither is done here.

inferred: the test helper `prose()` masks the subject's exact full text. A clipped subject therefore goes unmasked in the live arm.
Today the live block is not clipped. If it ever is, a museum clause can go red on the quoted subject. That is an accidental red, never
an accidental green. Not changed.

The landing pane runs the suite at landing.

BASE: C:\Users\nname\Desktop\worktrees\lh-sb-p 676d5c5d
SOURCES: S/sb-red.tap, S/sb-red2.tap, S/sb-green.tap, S/sb-hook.tap; node consonance/tools/state-block.js --json (Desktop/lighthouse); git log origin/main..sb-subject-p
NEXT: librarian route sb-subject-p (5f1a0c38) to pane O for landing when this file is read
