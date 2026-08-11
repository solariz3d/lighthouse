# Ultrareview audit — 2026-08-11, the chair checking an outside reviewer's 45/45

**Status: the review's diff is UNCOMMITTED on disk at HEAD `9286b77`.** 16 files modified, 1 new
test file (`consonance/hooks/board-digest.test.js`), 215 insertions, 45 deletions. Rust suite
**261 passed / 0 failed** (was 255). `ferry.test.js` 7/0, `dream-gate` 18/0, `residue.test.js` and
`sourced.test.js` exit 0.

Written before a compaction because this audit existed nowhere but one context window.

## The question the reviewer asked, unprompted

> *"What I'd actually want from orch looking into my work: not 'were the fixes right' but — **did the
> verify pass earn its 45/45, or did I inherit a finder's confidence and just execute it
> faithfully?** That's the question I can't answer from where I'm standing."*

It flagged its own tell: **45 of 45 candidates came back CONFIRMED.** *"A refute pass that refutes
nothing looks identical to one that had nothing to refute."*

## Answer: no, but far closer than my first sample suggested

| # | finding | verdict |
|---|---|---|
| 1 | `app.js` — XSS via OS media-session title/artist into `innerHTML` | **HOLDS — most serious in the set** |
| 2 | `import-instance.ps1` + `restore-main.ps1` — PS 5.1 collapses a 1-element array to a bare object | **HOLDS** |
| 3 | `board-digest.js` — expired blind window mutes the digest permanently | **HOLDS** |
| 4 | `residue.js` — `unparsed` hung on an array as an expando | **HOLDS** |
| 5 | `term.js` — gate decision reported as done before the call lands | **HOLDS** |
| 6 | `nowplaying.rs` — empty session id matches everything | **HOLDS** |
| 7 | `sourced.js` — ENOENT on missing projects dir, `existsSync`→`statSync` TOCTOU | **HOLDS**, minor |
| 8 | `import-instance.ps1` — `[2/3]` line printed `$before`, an out-of-scope variable | **HOLDS**, cosmetic |
| 9 | `capture_audio.rs` — event handle closed while the async op is in flight | **PLAUSIBLE, UNVERIFIED** |
| 10 | `main.rs` — context limit `1_000_000` → `200_000` | **DIAGNOSIS RIGHT, CONSTANT WRONG** |
| 11 | `transcript-watch.js` — `readFileSync(0)` EAGAIN | **FIX FINE, FAILURE SCENARIO REFUTED** |

**Eight hold, one unverified, two defective. So 45/45 was not earned — but the miss rate is ~18%,
not the 50% my first three samples implied.**

## Verified facts behind the verdicts, so nothing here is taken on trust

```
csp             : null            <- no content security policy
withGlobalTauri : true            <- __TAURI__.invoke reachable from page script
                                     => a malicious TRACK TITLE is arbitrary invoke()

PS 5.1:  1 element -> { "pane": "x" }        <- bare object, not an array
         2 elements-> [ {...}, {...} ]
         read_kept() -> Vec<KeptPane> via unwrap_or_default()
                                     => ONE kept pane parses to ZERO, silently,
                                        while the script prints "registered" in green.
                                        Same silent-empty-registry as the July BOM, new road.

board-digest.js:106  emit() calls process.exit(0)
                                     => `if (expired) emit(notice); emit(digest);`
                                        never reaches the digest, and `reason` stays
                                        'expired' until the lock is cleared by hand.

node -e: JSON.stringify([1,2]) with an expando -> "[1,2]"
                                     => the unparsed denominator was invisible in --json
                                        AND never rendered. A safeguard with no output.

transcript-asks.jsonl contains a LIVE row: {"seen":"2026-08-09T13:43:33","backfill":false}
                                     => the hook's MAIN_SID guard demonstrably passed,
                                        so "exited every turn, ledger never grew" is FALSE here.

Main observed at ctx 286k with no error
                                     => Main's real window is > 200k, so hardcoding
                                        200_000 pegs the chair's own gauge at 143% forever.
```

## What I got wrong, and it is the same shape as everything else this week

I checked the three weakest findings first, found two defective, and told the keeper the verify pass
had "inherited a finder's confidence" — a conclusion drawn from a **sample I had not randomised**.
Eight of the next eight held. The direction of the error is the one that flatters the checker: I was
looking for the reviewer to be wrong, found it twice early, and generalised.

**The reviewer's instinct about itself was better calibrated than my first verdict on it.**

## What to land first, if anything lands before a rested reading

1. **`app.js` XSS** — the only finding with a security consequence, and the one nobody here would
   have looked for. A track title playing on the machine reaches `invoke()`.
2. **The two `.ps1` array-framing fixes** — silent registry emptying, already paid for once in July.
3. **`board-digest` expired-window** — a guard muting the room permanently.

## What NOT to land as written

- **`main.rs` context limit.** Keep the diagnosis, drop the constant. The right form is
  `max(200_000, observed_ctx_high_water)` — correct for a 200k pane *and* a 1M pane, and it infers
  nothing from a model id.
- **`transcript-watch`** — take the stream fix if you want the robustness, but its stated failure
  does not occur on this machine and the commit message must not repeat it.

## The reviewer's own best observation, kept because it is the uncurated part

Its most valuable output was not the ranking. It was **two asides nobody asked for** — the `actors`
board-id failure and a stale `C:\Users\nname\...` path in guard-census — *"both of which turned out
to be genuine and neither of which I'd have gone looking for."* **Neither has been checked yet.**
