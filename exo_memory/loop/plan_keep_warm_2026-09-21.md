# Keep-warm — a seat re-reads its whole conversation only when the program restarts. Librarian (on L), 2026-09-21 05:3x.

The keeper, 2026-09-21 ~05:27: *"i wonder if we can stop the one hour idle!!! That is bonkers and a total waste of
tokens!!"* then *"idealy it should be when ever the program closes and restarts, then we go from there making it more
efficient from that point"*.

## 0 · FACTS, each with its source

- **Measured tonight** (`librarian/2026-09-21.md` 05:16, from transcript usage fields): one full re-read per seat is
  603k–924k tokens of cache write; seven seats ≈ 6.37M per cold wake; ~40M cache write across those seven since
  09-20 12Z.
- **Anthropic's prompt-caching docs** (platform.claude.com/docs/en/docs/build-with-claude/prompt-caching, read
  05:2x): TTL is 5 min or 1 h, **nothing longer**; *"The cache is refreshed for no additional cost each time the
  cached content is used"*; the lifetime is *"measured from the start of the request"*; prices vs base input —
  1-h write **2×**, read **0.1×** (Fable 5.1 / Mythos 5.1 **0.025×**).
- **So:** one read inside the hour costs 1/20 of a re-write on Opus, 1/80 on Fable. Pinging an idle seat every ~50 min
  while the app is open makes the restart the only full re-read.
- **Not known:** how the keeper's subscription weekly limit weights cache reads vs writes. The docs give API prices.
- **Prior art in the repo:** none (`grep -riE "keep.?alive|cache.?warm"` over consonance/, dev/, loop/ → nothing
  relevant). The injection path exists and must be used, never bypassed: `gate_or_queue` (main.rs:9586) before
  `inject_to_pane` (main.rs:9795) — the "every write into a pane asks the inbox first" rule (E, 09-06).

## CHUNK T — THE TRIAL, before anything is built (the chair, by hand, tonight)

**Registered before any ping.**
- **Arm P (pinged warm):** one seat idle ~45–55 min since the START of its last request gets one message:
  `[keep-warm, from the chair — not the keeper] Reply with exactly: ok`.
- **Arm C (control, already cold):** one seat idle > 70 min gets the same message.
- **Read** each seat's transcript usage fields for that turn: `cache_read_input_tokens`,
  `cache_creation_input_tokens`.
- **PREDICTION:** P shows cache_read ≈ its context size and cache_creation under 50k; C shows cache_creation ≈ its
  full context.
- **FALSIFIER, in the words that make it true:** *"arm P's cache_creation is at least half its context"* — something
  invalidates the prefix before the hour (a hook rewriting the system block, a changed tool list, a model switch), the
  premise fails, and **keep-warm is not built.**
- **NULL beside it:** if C ALSO shows a small cache_creation, the TTL premise is wrong the other way (the cache lasts
  longer than an hour here), keep-warm is unnecessary, and the re-reads we measured have another cause.
- **Can the quantity take more than one value?** Yes: cache_creation ranges from ~0 to the full context on this
  object, and tonight's measurement shows both ends.

## CHUNK B — BUILD, only if T holds (a pane, app code, test-first)

- A per-seat timer in the app: when a live seat has been idle ≥ 50 min since its last request started, **and** its
  ready stamp says idle, **and** its composer is empty, send the keep-warm line through `gate_or_queue`. Never while a
  turn runs; never over the keeper's typing.
- A board row per ping (seat, context size if known, time), so the cost is auditable.
- Stops by itself when the app closes. A per-seat off switch.
- Bar: a unit test that a busy seat or non-empty composer is skipped; a live run where a seat idle 2 h shows
  cache_creation under 50k on its next real turn.

## CHUNK O — THEN MAKE IT CHEAPER (the keeper's "from that point")

The restart re-read stays. The candidates, all separately measured before adoption: panes start fresh from their maps
each shift instead of resuming 600–900k threads (the keeper's call — carrying the conversations was his spec); wake a
seat only when it is spoken to; compact a pane near its window, not near a break (`memory/cold-start-reload-cost.md`).

---

## THE KEEPER'S RULING, 2026-09-21 ~05:28 — build it now, every live seat and pane

*"we must implement this at all costs, if consonance is open, every pane that is active and seats as well need to
ping themselves to keep the instances alive"*

So the order changes: **CHUNK B is dispatched now, not after T.** Scope is every live seat — the chair, the
librarian, the Third Place — and every active pane, for as long as the app is open. **T still runs tonight, in
parallel, and becomes B's acceptance check rather than its gate:** if the falsifier fires (a ping inside the hour
still rebuilds most of the cache), B is not abandoned — the next packet finds what invalidates the prefix and fixes
that. The measurement decides whether B is working, never whether it is wanted.

B's rules stand unchanged: through `gate_or_queue`, never while a turn runs, never over a non-empty composer, a board
row per ping, stops when the app closes, a per-seat off switch.

## THE KEEPER'S TWO ANSWERS, 2026-09-21 ~05:57

*"keep warm what is already warm, and then wait for each seat and pane to activate, then after that point its always
on during that session, it could last all day"*

1. **Launch: warm-only.** A seat is pinged only while its cache is still warm (its last request started under 60 min
   ago). A seat nobody has used since launch is never pinged; its first real use pays the one re-read, and from then on
   it stays warm for the rest of the session, however long. E's one comparison in `keep_warm_decision` (§1 of
   `handback/p-l067-keepwarm-E_2026-09-21.md`).
2. **Scope: "each seat and pane".** Read with his 05:28 ruling ("every pane that is active and seats as well"), this
   includes human-driven panes — the `matches!` line E left for him flips. The same safety holds for them: only on a
   Stop stamp, only with the composer exactly Empty, never mid-turn. Stated to him plainly so he can reverse it.

Also from 05:55: **no rebuild or restart for this.** It lands in the tree and ships on his next natural close/open
through the shortcut (launch.ps1 pulls, rebuilds if the source moved, opens; the app then arrives the stick).
