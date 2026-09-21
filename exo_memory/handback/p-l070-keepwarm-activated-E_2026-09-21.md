# P-L070-KEEPWARM-ACTIVATED — "activated this session", not "last request under 60 min" (pane E, L070, 2026-09-21)

Packet: the chair's L070 packet E. The rule is the keeper's 05:57 line, verbatim at the end of
`exo_memory/loop/plan_keep_warm_2026-09-21.md`; the mistranslation is recorded in librarian notes `a52b2d8`.
Started 07:34:50, mutants finished 07:38:20 (`date +%T`). Machine L, HEAD `a52b2d8` at the start, `6c56155` at the
end (another seat's commit). **Nothing committed; no rebuild, no relaunch.** `git diff --numstat` → `main.rs` 67/33.

## 0 · Headline

**The 60-minute ceiling is gone, and activation is now a fact about THIS SESSION:** a request since the app started.
- A seat that has **not** spoken since launch is never pinged, however recent its pre-launch request was.
- A seat that **has** spoken is pinged at ≥ 50 min idle with **no ceiling**, so a missed ping no longer abandons it
  for the rest of the session.
- The safety is unchanged: its own Stop stamp, the composer exactly Empty, never mid-turn, and at most one ping per
  50 min.

    RED   cargo test --bin consonance keep_warm -- --test-threads=1     21 tests · 18 passed · 3 failed
          FAILED a_seat_activated_this_session_is_pinged_however_long_it_has_been_idle   ← the chair's case, red today
                 a_seat_never_used_since_launch_is_not_pinged_even_inside_the_window
                 activation_is_a_request_since_the_app_started
    GREEN same command                                                  21 / 0
    CRATE cargo test --bin consonance                                   855 passed · 0 failed · 4 ignored
                                                                        (last 854/0/4; +3 new tests, −2 replaced)

## 1 · The two tests that encoded the mistranslation — replaced, and why that is not weakening

The chair named one. **There were two**, both mine, both added in the L067 amendment (§9 of
`p-l067-keepwarm-E_2026-09-21.md`):

1. **`a_seat_at_sixty_minutes_or_more_is_skipped`** asserted Skip at 60, 61 and 90 min for an active seat. Under the
   rule as spoken ("after that point its always on during that session"), an activated seat at 90 min **must** be
   pinged. The assertion is the mistranslation, so it is verifiably wrong. It is replaced by
   `a_seat_activated_this_session_is_pinged_however_long_it_has_been_idle` (60, 90 and 183 min → Ping).
2. **`a_seat_never_used_since_launch_is_never_pinged`** modelled "never used since launch" as **"idle 183 min"**.
   That is the same conflation of activation with recency, and after this fix that input (an activated seat at 183)
   is a Ping. It is replaced by `a_seat_never_used_since_launch_is_not_pinged_even_inside_the_window`, where the seat
   is not activated and its last request is **55 min** old: inside the old window, and it still waits. That is the
   sharper test of the actual rule.

Plus `activation_is_a_request_since_the_app_started` for the new pure helper: after launch → activated; before
launch → not ("resuming a seat is not activating it"); no request → not; **an unreadable start time → nobody**, so
the failure cannot ping every cold seat. The other 18 keep-warm tests are untouched except for one appended
argument (§3).

## 2 · How "activated" is established

`activated_this_session(app_start_ms, last)` is `true` iff both are known and `last.started_ms >= app_start_ms`.
- **The start** is `app_started_at()` (`main.rs`, the P-LEAVE-2 clock), recorded once in `main` at launch, so
  keep-warm and the Leave read one clock. It is an RFC 3339 `…Z` string, parsed by the same `iso_utc_ms` keep-warm
  already used.
- **The request start** is `last_request`'s earliest bound (the line before the last `requestId`'s first assistant
  line), so a seat that spoke after launch can only be dated at or after launch.

**What activation now costs, stated because the keeper chose it:** with no ceiling, a seat that misses a ping and
crosses the one-hour TTL is pinged anyway, and that ping is a **full cache re-write** (603k–924k tokens per seat,
tonight's measurement). That is the price of "always on", and it is bounded to seats he has used this session.

## 3 · Corrections, including mine

- **The mistranslation was carried into code by me, with tests that made it look settled.** The librarian's note
  owns the translation. I built it without checking it against the keeper's own words, which were in the same file
  I cited. Two tests then pinned the wrong rule, so a green suite **defended** the error.
- **My first red run reported 4 failed out of 22 while only 21 tests exist.** My replacement edit started at the
  `fn` line and left the old `#[test]` attribute above my new comment block. The first new test therefore carried
  **two** `#[test]` attributes, and libtest registered and ran it twice. It showed up in `--test-threads=1` output
  as one name printed twice. The orphan attribute was removed, and the red became 18/3 of 21. **A count that
  disagrees with the unique names is a defect in the test file, not noise.**
- **The first L070 mutant runner never ran.** A shell-quoted generator produced a syntax error. It was rewritten
  with the Write tool (`scratchpad/l067/mutants3.js`).
- **The 16 existing test calls were updated mechanically** (a Node script that matches the parentheses of each
  `keep_warm_decision(` call in the test module and appends `, true`). `true` keeps every one of them meaning what
  it meant: an activated seat.

## 4 · Mutants — a copy of the crate, its own target dir

    node scratchpad/l067/mutants3.js
    GREEN  21/0  pre-flight
    KILLED 20/1  the activation check removed
    KILLED 20/1  the 60-min ceiling reintroduced (the mistranslation itself)
    KILLED 20/1  activation compares the wrong way
    KILLED 20/1  an unknown start time activates every seat
    4 listed · 4 killed · 0 survived

**Not mutated: the tick passing `activated = true` regardless.** The tick is not reachable from a unit test (it
needs the running app), so that row would survive by construction and prove nothing. It belongs to the live step.

## 5 · NOT verified

- **No live run.** It ships at the keeper's next natural close/open (his 05:55 word). Whether seats resumed at launch
  are correctly read as NOT activated depends on the app sending them nothing at launch. **If anything auto-prompts a
  seat at launch** (a warm brief delivered as a prompt, a chair ring), that seat counts as activated and is kept warm.
  I did not trace launch-time delivery.
- **The frozen ready stamps on L (§2 of the L067 hand-back) still stand**, so "never mid-turn" on L rests on the
  gate's screen check.
- **A seat that crosses 60 min is still not reported** as having missed its window. With no ceiling it is now
  re-warmed rather than abandoned, but the missed-window row suggested in L067 §9 is still unbuilt.
