# The stalled-lap detector — the work-leg clause

**Pane C (Around) · 2026-08-29 · `consonance/tools/chain-status.js` + `.test.js` · uncommitted**

Briefed to make `chain-status.js` say when a lap has stalled at MAP, with the *definition* named as
the deliverable and an explicit warning not to invent a threshold to look decisive.

**The definition is a sequence property, not a duration.** Both candidate time-shaped axes were
tested against the real ledger and both were refuted before anything was written. Pane E attacked
the result while it was being built and landed three findings; all three are repaired below and
verified with E's own reproductions, not with my tests.

---

## 1 · The definition

> **A lap's work leg is UNWITNESSED when the lap is FILED and carries none of `working`,
> `handbacks-in`, `return-leg`.**

No threshold, no clock, nothing to tune. Membership, never ordering — `lap-row.js` declares the
vocabulary as `map → dispatched` and every real lap on this ledger writes `dispatched → map`, so any
"did it get past stage N" rule misreads the entire record.

**The sparing is the test of the rule, not the firing.**

```
node -e "const m=require('./consonance/tools/chain-status.js');const fs=require('fs');
 const a=fs.readFileSync('C:/Consonance/data/lap.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
 for(const L of m.chainLaps(a)) console.log(L.lap, L.filed, L.attested, L.rows.map(r=>r.chain).join('>'))"
```
| lap | chain | verdict |
|---|---|---|
| L008 | `dispatched>map>working>handbacks-in>return-leg>filed` | healthy |
| L009 | `dispatched>return-leg>filed` | **spared** — no `working` row, but the panes demonstrably worked (four hand-backs, per that row's own note). Bookkeeping gap, not a chain death. |
| L010 | `dispatched>map>filed` | **UNWITNESSED** |
| L011 | `dispatched>map>filed` | **UNWITNESSED** |
| L012 | `working` | healthy, open |

A definition that caught L009 would be counting paperwork. E had independently reached
"filed with no `working` row" and priced it as failing on L009; `WORK_ATTESTING` is what spares it.

---

## 2 · The two axes that were refuted, with the numbers

**Elapsed time.** From `--stage` transitions on the live ledger:

| | span | class |
|---|---|---|
| L009 `dispatched→return-leg` | **3554s** | healthy — panes worked |
| L010 `map→filed` | **3557s** | dead |
| L011 `map→filed` | 47s | dead |
| L008 `map→working` | 287s | healthy |

Three seconds apart at one end; at the other, a threshold low enough to catch L011 fires on the
healthy L008 six times over. **No duration separates these**, so none is used.

**Commits — my own second attack, and it failed.** `git rev-list --count` across each lap's pre-work
span: healthy **L008 = 1**, dead **L011 = 1**, dead L010 = 8. The healthy lap and a dead lap are
identical on this axis. Recorded rather than dropped: a discarded attack is the only evidence the
surviving axis was chosen rather than reached for.

```
for p in 6b58c63..cdc82d0 c785b8d..e60344f b601440..f632916; do git rev-list --count $p; done   # 1 8 1
```

**Why it cannot speak earlier.** Before the `filed` row there is no observable separating a lap
being worked from one being abandoned — that is exactly what the two refutations establish. In
practice the delay is near-nil: L011 was filed 47s after its map. A lap *abandoned and never filed*
is a different shape and was never invisible — it stays open and the line has always printed its age.

---

## 3 · Pane E's three findings, all repaired

E attacked as a non-author and found three live defects. Each is reproduced with E's own script
before and after, not with my tests.

**3.1 — the alarm was a passenger on an open lap.** v1 gated the all-filed speak-up on the newest
lap being the dead one. E swept eleven fixtures with L012 closed healthily: **stdout empty at all
eleven**, the finding surviving only on `--why`, which `userprompt_pulse.py:151-153` deliberately
does not read. The instrument was loudest while the loop ran and mute once it stopped — and a quiet
ledger is exactly what a stalled loop produces. **I had observed this myself and filed it as design;
E was right that it guts the instrument.** The work-leg claim now has its own exit from `line()`.
Re-running E's sweep against the repair — speaks at all eleven:

```
+0 .. +7   chain: no open lap · 2 of N chained laps unwitnessed (L011,L010) · this machine only · rows only
+8         chain: no open lap · 1 of 10 … (L011) · 1 older beyond the 10-lap window · …
+9, +10    chain: no open lap · 0 of 10 … · 2 older beyond the 10-lap window · …
```

**3.2 — the window cap dropped laps silently.** L010 left the count at +8 healthy laps and L011 at
+9, after which `--why` reported *"every lap with a baton row is filed"* over a ledger holding two
chain deaths. The cap stays; its silence does not — `N older beyond the 10-lap window` now rides the
line, and the count never reaches zero without saying what left it.

**3.3 — a destroyed ledger read as a clean one, and schema damage manufactured chain deaths.**
`led.unreadable` was computed on every path and appended only where a line already printed, so all
three silent returns threw it away. And `attested` reads a `chain` field, so a `working` row whose
field is damaged **un-attests a healthy lap and reports it as a chain death** — corruption
manufacturing the exact finding the tool exists to report.

```
printf 'not json\n{broken\ngarbage\n' > /tmp/corrupt.jsonl
node consonance/tools/chain-status.js --ledger /tmp/corrupt.jsonl
-> chain: no open lap · dirty 6 repo-wide · 3 unreadable · this machine only · rows only     (was: silent)
head -c 200 C:/Consonance/data/lap.jsonl > /tmp/trunc.jsonl   -> 1 unreadable                (was: silent)
chain row with the `chain` field deleted:
-> chain: L900 MALFORMED · holder panes · … · 1 lap(s) UNKNOWN, damaged rows · …             (was: L900 UNDEFINED, counted dead)
```

Damaged laps are excluded from the count and reported separately: **unknown is not absent**
(residue.js, 2026-08-17).

---

## 4 · A defect of mine that the record caught before it shipped

The first version of `unwitnessed()` returned the in-window array with `.older` and `.damaged` hung
off it as expandos. That is **verbatim** the defect pane B landed on 2026-08-17 — residue's
count-what-you-cannot-parse safeguard invisible in every output mode, always, because it was an
expando on an Array. It survives a `.filter`, survives a `.slice`, dies in JSON, and reads as zero.
It is now a plain object. **Caught only because the record names the shape**; nothing in the tests I
had written would have failed on it.

---

## 5 · Mutation proof — eight mutations, eight caught

The tests are load-bearing, checked by breaking each mechanism against the shipped file and
confirming the sed actually applied (a no-op sed reads as a passing mutation, which is its own false
green — M7 no-op'd once on the multibyte separator and was re-run).

| # | mutation | result |
|---|---|---|
| M1 | drop `return-leg`/`handbacks-in` from attesting | 2 red |
| M2 | `filed` = any row rather than the newest | 1 red |
| M3 | remove the loud clause | 3 red |
| M4 | print the `rows only` limit unconditionally | 1 red |
| M5 | revert E-3.1 — claim rides a head again | 5 red |
| M6 | count damaged laps as chain deaths | 1 red |
| M7 | window cap goes silent again | 1 red |
| M8 | corrupt ledger reads clean again | 1 red |

Restored: **34 pass / 0 fail**, file `md5 57492355596bb93bb4a77deb3854fff2` identical to the
pre-mutation copy.

**One of my own tests was not load-bearing and M2 found it.** The resumed-lap fixture used a
`working` row after the `filed`, which made `attested` true and let *both* definitions report the
lap healthy — it passed under the mutation it was written to catch. Fixture changed to stay
pre-work after the file; M2 now bites. It is only known to bite because the mutation was run.

---

## 6 · A pre-existing test I NARROWED — check this first

`chain-status.test.js:112` asserted `!/L007/.test(r.text)` — *"the filed lap must not appear"*. Its
fixture's L007 carries a single `filed` row and no work-leg row, so it is exactly the shape the new
clause counts, and the assertion went red.

I did not weaken it to vagueness. The property it protected — a finished lap must not be reported as
the chain's position — is asserted directly (`doesNotMatch(/^chain: L007/)`, stricter about position
than the old form), and the id is then **pinned to one segment** by `deepStrictEqual`, so a leak
anywhere else still fails. The reasoning is written in-line at the assertion, not only here.

**This is the one edit in this hand-back that a reader should distrust on principle**, because I
changed a test that was failing because of my own code. It is flagged rather than buried.

---

## 7 · What this does NOT establish

- **It cannot move Falsifier 2, and E is right to say so.** That falsifier counts *who initiates
  laps* (human 10, chair 1 over L001–L011). This counts *laps that die before the panes*. Different
  failures; a tool that notices chain deaths initiates nothing. The dispatch called it a candidate
  mechanism for the 90.9%; **on the evidence available it is not one**, and selling it as one is the
  move that later reads as a patch. One adjacency, recorded without inflation: L010 — the single
  chair-initiated lap of the eleven — is one of the two that died at the map. **n=1. Do not
  headline it.**
- **`UNWITNESSED` is a statement about ROWS, never about the world.** This ledger is self-report
  (`lap-row.js` limit d). A lap where the panes worked and *nothing* was written afterwards reads
  identically to one that died. L009 is spared only because a later row happened to attest. `rows
  only` rides the line for this reason.
- **Not every unwitnessed lap is a fault.** An inquiry can dissolve and be correctly closed. The
  tool reports the shape; the `note` on the filed row is where a seat says which it was. Both L010's
  and L011's filed rows carry `note: null`, which is why neither could be told apart from outside.
- **This machine only**, unchanged and still printed every line.
- **`chain-status.js` has no runtime coverage of the pulse hook itself.** The tests assert one line
  on stdout and exit 0, which is what the hook consumes; they do not exercise the hook.

**PANE A'S SCOPE CLAUSE WAS NOT CONSUMED.** `exo_memory/loop/falsifier_scope_2026-08-29.md` does not
exist as of this writing (`ls exo_memory/loop/*2026-08-29*` returns only B's re-score and E's
attack). Per the brief I built the detection shape and its test and did not guess the clause. What
that leaves open: whether a lap that died on the desktop counts as the same event as one that died
here. The line's standing `this machine only` is the honest placeholder, not an answer.

---

## 8 · Suite state

`node consonance/tools/js-suite.js` → **63 green · 1 failed** (of 64), unchanged from before this
work. The failure is `actors.evidence.test.js`, and it is **not mine** — verified rather than
assumed:

```
git stash push -- consonance/tools/chain-status.js consonance/tools/chain-status.test.js
node --test consonance/tools/actors.evidence.test.js     # pass 4 fail 1 — identical at clean HEAD
git stash pop
grep -c chain-status consonance/tools/actors.evidence.test.js    # 0
```

Nothing committed. Dirty: `chain-status.js`, `chain-status.test.js`, and this file.

---

## 9 · Registered falsifier, with its unwelcome outcome named in advance

**The clause is decorative if, over the next ten chained laps, a lap dies at the map, the line fires,
and nothing changes** — the lap stays unwitnessed, no seat re-dispatches it, and the count only
grows. That outcome would establish that the failure was never an information problem, and that
building a detector was the wrong response to it. Registered now, in the words that would make it
true, because *"it raised awareness"* is available afterwards and unfalsifiable.

**And the degeneration marker, per BOOT's abuse condition:** this line of work is degenerating if the
count is still being printed a month from now having never once been read aloud by a seat that then
acted on it. Check it against `git log -S"unwitnessed"` and the board.

*Scored by someone other than me. I built it; I do not read its dial.*
