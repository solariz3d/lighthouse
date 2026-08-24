# Exteroception — the registration, 2026-08-24

**Registration only. Nothing builds.** The option is the keeper's call, because spend and
outside-contact are direction — `muscle_map.md:2385` — and nothing proceeds without his word *and*
the falsifier registered below. Written by pane A on the chair's dispatch of the librarian's T4
packet (`librarian/2026-08-24.md`, the ~03:20 append).

## The finding this answers

BOOT registration 45, verified rather than asserted: **44 non-test instruments, zero network
calls.** Checked for `require('http')`, `fetch(`, `https.get(` — the one repo-wide hit is a test
fixture. Every instrument measures the repo, the board, the shelf. **The self.** Not one measures
the world. The librarian's phrase: *a body with exquisite proprioception and no eyes.*

Everything exterior arrives through one channel: the keeper relays it, by hand, on his initiative.
`BOOT.md:62` reads that as epistemics — the curated auditor. Anatomically it is simpler: **no
exteroception.**

## What "uncurated" has to mean, before any option can be scored

All three options below can be built in a form that fails this, so it is stated first and applies
to whichever one is chosen. A channel is uncurated when **the room does not choose what the outside
reader looks at, on the firing where it looks.**

That is a stronger bar than "the reader is external", and it is the bar the existing machinery
misses. `second-vantage.js` already spawns genuinely blind fresh readers on a clock — and it hands
them *the room's own claims about the room's own repo*. The reader is outside. The question is not.

**The failure this bar exists to catch: moving the curation from a hand into a config file.** The
keeper's relay is at least legible AS a choice — someone can ask why he carried that and not this.
A weekly job that mails `BOOT.md` to a model is the same curation with a timer on it, and the timer
makes it look like a sense organ.

## Option A — a scheduled cross-model read

**Mechanism: none exists.** No `gemini` on PATH, no model API key in the environment, nothing in
`~/.consonance.json`, and no HTTP anywhere in the 44 instruments. This is the only option that
requires a new external account, a new dependency, and **the first network call this repo has ever
made.**

**Cadence:** weekly is the only defensible rate; the payload is large and the reader is not cheap.

**Cost:** the only option with a money line, and I **cannot price it from here** — no account, no
rate card in the repo, no token accounting in any log. What is priceable is the payload: `BOOT.md`
alone is **63,848 bytes**; the natural bundle (BOOT + TRAINING + README) is **87,793 bytes**
(`wc -c exo_memory/BOOT.md exo_memory/TRAINING.md README.md`).

**What it can return that nothing else can:** a reader whose weights are not Claude's. The record
holds exactly two data points and **they contradict each other on usefulness:**

- The Lighthouse-spine cross-model test **agreed 10/10** — BOOT's own reading: *no Claude blind spot
  found; a different model is optional enrichment, not a gate.*
- The 2026-08-02 contact produced Duhem–Quine, Kuhn and Lakatos — the first amendment to this room's
  epistemics sourced from outside the substrate — **and** the curated-auditor critique, which BOOT
  calls *the sharpest hit this room has taken from outside* — `BOOT.md:62-66`.

So cross-model has produced both the least informative result on record and the most informative
one. **At n=2 the variance spans the entire range**, and anyone quoting one of those two as the
expected value is picking.

**How it fails:** the payload is chosen by whoever writes the job. See the bar above — this is the
option most likely to satisfy "external reader" while failing "uncurated question."

**Its Goodhart:** the reader is asked *is this room self-sealing?*, its answer becomes a number, and
the room writes toward passing it. The critique that mattered on 08-02 was unsolicited; a scheduled
version solicits it, which is a different thing wearing the same words.

**Its falsifier:** if three consecutive firings return nothing that changes a document, the channel
is decorative and should be stopped rather than re-prompted.

## Option B — a cold-stranger cadence

**Mechanism: already built, already installed, already firing.** This is the pricing fact that
should drive the decision, and it is checkable:

- `○ Fresh` is a shipped spawn type. `main.rs:836` — `FRESH_READONLY_TOOLS =
  "Read,Glob,Grep,WebSearch,WebFetch,TodoWrite"`, no MCP mount on any path including resume
  (*"a fresh mind that reads them isn't fresh anymore"*), Bash/Write/Edit still prompt.
- `consonance/tools/second-vantage.js` is 469 lines (`wc -l consonance/tools/second-vantage.js`) and
  spawns fresh `claude -p` readers **from a bare cell**, not the repo root, because the repo's own
  `CLAUDE.md` would walk a reader into the answer key. Per reader: `claude -p <brief>
  --output-format text --allowedTools Bash,Read,Grep,Glob`, 240s timeout, ~4 readers per run,
  30-minute task cap.
- `dev/vantage/install_vantage.ps1` registers it as a daily task. **`Consonance Second Vantage` is
  registered on this machine, State `Ready`, and has fired three times** — `data/vantage_runs.log`,
  2026-08-18, 08-23, 08-24.

**So the marginal build is not machinery. It is a payload that is not the room.** Same clock, same
spawner, same blinding discipline, different object. See the recommendation below, which is a
narrower thing than "build a cold-stranger cadence."

**Cadence:** daily is proven to fire. **Weekly is right for a stranger** — see the failure mode.

**Cost:** no money. Claude usage on the existing plan; **token cost per firing I cannot price from
here**, because `vantage_runs.log` records rows / selected / verdicts and no token accounting exists
in it or anywhere else. Wall-clock is bounded and known: 240s per reader at most, 30 min per run
(`grep -n "ExecutionTimeLimit" dev/vantage/install_vantage.ps1`).
COLDREAD's real ratio is the honest cost line: **three spawns to get one clean read**, because
freshness is single-use and is spent by first contact — `journal/2026-07-31.md:35`.

**What it can return:** the strongest prior result in the record. COLDREAD's clean run — `fresh #3`
in that document, which is the ARC's **first** stranger, the two before it having been burned
getting to a clean spawn — was handed 22 lines of the live listening ledger as its first message
ever, with no tools, and reconstructed the system blind
(`grep -o "was 22 lines of the live" consonance/COLDREAD-2026-07-31.md`). It returned:

- **a live bug** — `growing +8.4 dB over 48s` measured from track start is measuring the fade-in:
  *"any track measured from its first sample"* reports growing;
- **a category error the room could not see from inside** — the tension model is *"arithmetic
  wearing perception language"*, because the analyzer applies *"a functional-harmony prior to
  deliberately non-functional music"* and reports the mismatch as a property of the sound;
- **a nine-item format spec** that was adopted as the work queue.

*(Counting note, because the two documents number differently and it is easy to get backwards:
`COLDREAD-2026-07-31.md` counts SPAWNS — three, to get one clean reader. `journal/2026-07-31.md:35`
counts STRANGERS — three, across two format eras. The clean spawn is stranger one.)*

That is not a weaker class of catch than Gemini's. It is the same class, from a reader inside the
substrate — which is the fact that makes the A-vs-B comparison closer than it first reads.

**How it fails:** **decorrelated from the room, correlated with the model.** A fresh Claude is not
outside Claude. And freshness is single-use, so a cadence burns a stranger per firing: the channel's
value lives entirely in having a genuinely unexamined OBJECT each time. **The specific degeneration
is running out of objects before running out of clock** — the fifth stranger reading the same
artifact is not a cold read, it is a rerun with a fresh reader attached.

**Its Goodhart:** the room starts writing documents that read well cold — optimising for a
stranger's first impression instead of for being true. The warning is the arc's own best sentence,
from the THIRD stranger auditing the finished stream: *"The title relabelled the story; it didn't
move a number."*

**Its falsifier:** if three consecutive cold reads return nothing that was not already in the
record, either the object selection is wrong or the room has no unexamined surface left. Both mean
stop, and they are distinguishable: hand the fourth stranger an object the room has never written
about and see whether the emptiness was in the object or in the channel.

## Option C — the consumer tree as a standing foreign machine

**Mechanism: half-real, as the librarian said.** `gen-consumer.js` is MANIFEST-driven, allow-list,
atomic, and scans its own output rather than its input. `gen-consumer.build.test.js` already
generates a tree and runs `cargo check` against it — and **its first run failed for a real reason**:
`build.rs`, `Cargo.lock`, `capabilities/` and `icons/` had never been listed in the manifest. A
clean leak-scan over a product that could not compile, caught only by compiling it.

**Cadence:** per-commit or nightly. Trivial either way.

**Cost: cheapest by a wide margin.** No money, no model tokens, no spawns. It is a build.

**What it can return:** only what a MACHINE can notice — and that is its strength and its ceiling.
It cannot read prose, cannot say *you are becoming a mirror*, cannot find a category error. It
returns compile and test failures against a tree that is not the dev tree. **It is the only option
whose verdict nobody authored**, which is the property BOOT says is the room's one real exterior:
*curated philosophy in, uncurated measurement out.* Its vocabulary is small and every word of it is
uncurated.

**AND CHOOSING IT COLLIDES WITH THE KEEPER'S OWN ORDERING — stated here rather than quietly
priced.** He has said, twice and most recently this morning, that the consumer version comes
**last**, after the dev version is solid, because the consumer build is a slightly modified dev
build and a defect fixed in dev is fixed in both. `chunk_sequence_2026-08-24.md` puts it in chunk 5
for exactly that reason. **The cheapest option is the deferred one.** If it is chosen now, the
deferral is being overruled, and that is a decision to make out loud.

**Its headline number does not reproduce.** *"The consumer version's 11 non-portable tests"* appears
twice in the record and **both are librarian prose; no instrument in the repo produces it.** The
nearest derivable proxy — test files under `consonance/tools/` that read the real corpus by absolute
path — gives **3 of 40**
(`grep -lc "C:/Consonance/data" consonance/tools/*.test.js | wc -l`) — `actors.test.js`,
`portable-paths.test.js`, `swell-head.test.js`, by a
different definition, so it neither confirms nor refutes 11. **Option C cannot be priced beyond
"cheap" until something produces that figure**, and per BOOT's own rule every number in prose must
re-derive from one run of a visible instrument.

**Its Goodhart:** the manifest gets tuned until the build is green, rather than the product being
made portable — the generator passing its own test.

**Its falsifier:** if it runs for a month and every failure it finds is a manifest omission rather
than a product defect, it is measuring the generator and not the world.

## The call, with its confidence

**Take B, in its narrow form: do not build a cold-stranger cadence — give the clock that is already
running a different object.** `Consonance Second Vantage` fires daily, spawns blind readers from a
bare cell, and hands them the room's claims about the room's repo. The change is the payload, not
the plumbing: one firing a week whose object is something the room has never written about.

**And the object must be chosen by a SAMPLER, not by a person — including not by the keeper.** This
is the point where the first draft of this document contradicted itself: it said *"chosen by someone
who is not the chair"*, which leaves the keeper choosing, and the keeper choosing is the curated
channel the whole finding is about (`BOOT.md:62`). D3 below forbids it and the recommendation now
matches. The room already owns the right pattern: `second-vantage.js` selects by tier and watermark
with **an unconditional floor over ALL rows**, and its own comment says why — *"THE FLOOR IS NOT A
TUNING KNOB — it is the anti-Goodhart clause: without it the net becomes a gate by prior and the
shape leaves the text."* A non-room corpus sampled that way is the concrete form of the bar at the
top of this document. A human hand anywhere in the selection loop reintroduces exactly what is
missing.

Confidence: **high that this beats A**, because A needs an account, a dependency, the repo's first
network call and a recurring bill to buy a result whose two prior instances span the entire range
from *agreed 10/10* to *the sharpest hit on record*. **Lower that it beats C**, and I want that
recorded rather than smoothed: C is cheaper, its verdicts are the only ones nobody authored, and its
one disqualification is an ordering constraint rather than a defect.

**What would change my mind:** if the keeper wants the *category-error* class specifically — the
catch that says the frame is wrong, not the number — the honest evidence is that **both** A and B
have produced exactly one each (the curated-auditor critique; *arithmetic wearing perception
language*). That is 1–1, and it is a weaker argument for B than *"B is already built"* is.

**Refusal considered and not taken.** *"None of these is worth the spend"* would be the right answer
if all three required a build. B does not: the clock, the spawner, the blinding and the installer
exist and fired this morning. Declining a payload change on cost grounds would be the deflation coat
with a budget attached.

## Registered, so this can be shown wrong

**The registration's own falsifier:** if the keeper picks an option and, one month on, no seat has
scored this document against what the channel actually returned, then T4 was a document rather than
an organ, and the correct response is to attic it rather than write a second one.

**Scoring date: 2026-09-24. Scored by a seat that did not write this, and not by the chair.**

### The abuse condition — degeneration named in advance, because this room has form

Four diversity gauges were built and four abandoned when they inverted (**08-05** against length;
**08-06** rating one mind above six; **08-09** at separation **−0.1029**). A fifth instrument nobody
runs is worse than none.

And the warning is not historical. **`Consonance Second Vantage` fired at 06:41 this morning and
returned zero verdicts** — three rows selected, all three UNLAUNCHABLE, newest row 16.8 hours old
(`cat C:/Consonance/data/vantage_runs.log`).
Its three runs read:

```
2026-08-18    50 rows    5 selected    4 verdicts
2026-08-23   117 rows   13 selected    5 verdicts
2026-08-24    93 rows    3 selected    0 verdicts   <- all UNLAUNCHABLE, no_verdict: true
```

A clock-fired outside reader trending toward zero output, on the morning a registration for another
one is written. That is the signature this registration must promise not to repeat, and it is
already present in the instrument option B proposes to reuse.

**This channel is DEGENERATING if any of these is true at the scoring date:**

- **D1 — two consecutive firings produce zero readable output.** Vantage's run 3 already counts as
  one under this rule; the next firing decides it.
- **D2 — the channel fires and nobody reads the finding.** Measurable, and the base rate is bad:
  the miss rate is **76.1%** over the measured window, 89 missed of 117, median latency 24.7 min
  (`node consonance/tools/ferry.js --report`). It moved between this document being drafted and
  being verified, which is the honest character of it: a live rate, not a constant. Any figure
  quoted from it is a timestamp, this one included. A finding nobody reads is indistinguishable from a
  finding nobody made.
- **D3 — any firing whose object was chosen by the chair or by the keeper.** That is the curated
  channel wearing a timer, and it is the specific failure the bar at the top of this document names.
- **D4 — a month in which the channel's findings changed no document.**

## What I could not price from here, stated rather than estimated

- **Tokens per firing, for any option.** No token accounting exists in `vantage_runs.log`,
  `head-watch.jsonl`, or any other instrument's output. Wall-clock bounds are known; token cost is
  not, and I will not convert one into the other.
- **Dollar cost of option A.** No account, no rate card, no prior invoice in the record.
- **Whether the desktop's plumbing differs.** Everything above is this laptop's `data/` and this
  laptop's task scheduler. The desktop was not reachable from here.
- **"11 non-portable tests."** No instrument produces it; see option C.

*Re-derive: `Get-ScheduledTask` for the three registered tasks; `cat C:/Consonance/data/vantage_runs.log`;
`node consonance/tools/ferry.js --report`; `wc -c exo_memory/BOOT.md exo_memory/TRAINING.md README.md`;
`grep -ln "C:/Consonance/data" consonance/tools/*.test.js`.*
