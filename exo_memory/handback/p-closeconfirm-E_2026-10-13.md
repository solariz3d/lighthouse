# D317 part 2, pane E: the window's X asks before ending working seats (the UI) — 2026-10-13

**Packet:** the chair's D317 part 2 ring, 14:12. **Plan:** `exo_memory/loop/plan_close_confirm_2026-10-13.md` (`c39e51cb`).
The keeper's words are at its :3-4. The plan named C for this part; the chair gave it to E on the dossier row for the chip/DOM layer
(`handback/p-aura_2026-09-02.md` §10–§13). B builds the Rust side.
**Commit:** lighthouse `2819983e` on `c39e51cb`, branch `d317-e`, worktree `Desktop/worktrees/e-d317-wt`. Files: `consonance/ui/leave.js`,
`consonance/ui/leave.test.js`. Not committed to main; the chair lands it.

## 1. What it does

- **The event.** `leave.js` listens for `close-confirm` `{ working: [{ label, gate }] }`, the plan's contract. It asks in the
  `#leave` panel itself, so the question is in the Leave panel's style with no new element or CSS. If the keeper closes, the
  Leave's own screens take the panel over from there.
- **The text.** "N seats are working: <labels>. Close Consonance and end them?" Under it, each seat with its gate, so an
  Unstamped or Contradicted seat reads as what it is.
- **[Keep working].** It is focused when the question shows, and it is what Escape does. It hides the question and invokes
  nothing.
- **[Close].** It invokes `leave_confirmed` once, however often it is pressed. If refused, it shows the reason and can be pressed
  again. Once it succeeds, Escape no longer takes the screen away.
- **Edges:**
  - Any `leave` event ends the question, so Escape can never hide a Leave screen.
  - A question that arrives while a Leave screen is up is ignored; the Leave's own "busy" answers a second close.
  - A second question while one is up adds nothing (one question, one Escape listener).
  - Labels and gates are escaped.
- **Two choices of mine, beyond the plan's words:**
  - One seat reads "1 seat is working: … end it?" instead of "1 seats are working".
  - An empty or malformed `working` still asks ("Some seats may be working. Close Consonance and end them?"). Rust has already
    prevented the close by then, so showing nothing would leave the X doing nothing at all. The contract says Rust sends the
    event only when some seat isn't Ready, so this path should not occur.
- **Not touched:** `index.html` (no new file, so no script tag), `main.rs` (B's), `app.css`, `consonance/CHANGELOG.md`. The plan
  asks for the changelog's Added line, and it isn't in my file list; it is for whoever lands D317.

## 2. Checks

```
checked: node consonance/ui/leave.test.js (worktree, under the heavy-run lock), before leave.js changed → 24 passed, 16 failed
         (every new test, failing because nothing listened for close-confirm)
checked: node consonance/ui/leave.test.js, after → 41 passed, 0 failed (24 existing + 17 new; the 17th, a Leave screen arriving
         while the question is up, was added after the first green, and the code it pins was added with it)
checked: node consonance/ui/scripts-load.test.js → 4 passed, 0 failed
checked: mutants on leave.js (scratchpad mut_d317.sh, in the worktree under the lock) → applied 8 / caught 8 / NOT APPLIED 0:
         no double-click guard; no focus; Escape on any key; [Keep working] invoking leave_confirmed; a leave event not ending
         the question; a question over a Leave screen; a refusal not re-arming [Close]; labels unescaped. Each was caught by
         the test written for it.
checked: headless Chrome, leave.js with the app's own app.css and stub Tauri (scratchpad d317_look/) → renders as the Leave
         panel, [Keep working] focused (document.activeElement.id = closeconfirm-keep); Escape hides it and invokes nothing.
         Screenshot: p-closeconfirm-E_2026-10-13_evidence/confirm.png
```

- **Not run:** the full suite (the collator's), and the real exe. Go-live needs B's part 1 and a rebuild, per the plan.

## 3. Corrections, mine

- My first patch file broke on a heredoc and never ran; nothing was written. I rewrote the last line and ran it.
- My first mutant tally grepped `FAIL` and also counted an existing test named "FAILED: NOT CLOSED…". The tally above reads
  each mutant's own failing test (`^  FAIL `).

## 4. For B

The UI uses exactly the plan's contract: event name `close-confirm`; payload key `working`, each item `{ label, gate }`, with
gate shown as sent; command `leave_confirmed` with no arguments. If the Rust side sends a different name or shape, the
question will not show.

**Calls and wall time:** 2 test runs and 8 mutants under the lock, 1 headless render; about 30 min.

SOURCES: exo_memory/loop/plan_close_confirm_2026-10-13.md · consonance/ui/leave.js · consonance/ui/leave.test.js
NEXT: librarian read this when it lands; then the collator's full suite once B's part 1 is in (plan default)
