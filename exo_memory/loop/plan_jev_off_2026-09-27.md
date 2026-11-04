# Jev off: the app stops calling it, the docs stop promising it. Librarian, on D, 2026-09-27 11:4x. Lap D164.

**The keeper, 11:34:** *"just dont use jev, revoke key"*.

**Done by the librarian before this lap:**
- `AI_GATEWAY_API_KEY` is removed from D's user environment (checked: user-level unset, no machine-level key).
- The running `jev-shadow-runner.js` (pid 10992) is stopped.
- **The key's revocation on the gateway itself is the keeper's, in his Vercel account.** No seat has access to it.

**Why the code change is still owed:** `main.rs:13652` calls `start_jev_shadow()` on every launch. Without a key the
runner cannot reach Jev, but it still starts, logs failures and keeps saving turns to judge (1,415 files, 15 MB on D as
of 11:1x). The README and the About page still describe Jev as the room's judge.

**D162 closes NOT RUN.** The keeper declined the spend and retired the judge. The 409ae2b falsifier stays untested, not
fired and not passed. Record it that way.

## The lap, split along the grain (strict wait-for-all)

| seat | job |
|---|---|
| A | `main.rs`: Consonance no longer spawns the Jev runner. Take the smallest change that keeps the code as a trace: the call at `:13652` removed or gated off, with a dated comment citing this plan. Tests that pin the spawn are updated to pin its absence. `cargo test --bin consonance` in its own target dir, and do not rebuild the running app. Commit by path. |
| C | The words: `README.md`, `consonance/ui/index.html` (the About page), and any shipped brief that tells a seat Jev judges it. Say plainly that Jev was retired on 2026-09-27 at the keeper's word, and point to `loop/jev_the_question_not_the_judge_2026-09-27.md` for why. Keep the dated history, rewrite nothing old. Keep `ui/third-place-wiring.test.js` green. Commit by path. |
| E | Census: every place in this checkout, `~/.claude/settings.json` and the scheduled tasks that would still call the AI Gateway or read `AI_GATEWAY_API_KEY` automatically. Record it by path:line, with the command beside it. Expected: none after A's change. Anything else found goes into the hand-back, and is not fixed by E. |
| B | The non-author read of A's and C's commits, after both land: the diff, cargo and js-suite results, and whether anything else still starts Jev. |

B runs after A and C are in. The librarian scores. The change reaches the app at the keeper's next rebuild.
