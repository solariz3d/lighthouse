# P-BATON-WAKE — hand-back, 2026-09-03

**Seat:** committee pane, `C:\Consonance\instances\sibling-eeb329ed` (desktop).
**Packet:** LAP D005 · P-BATON-WAKE, from the chair.
**Commits:** named below. Nothing pushed.

---

## 1 · THE ANSWER TO THE QUESTION ASKED — something DOES wake a holder

The packet said to establish this rather than assume it, and the assumption would have been wrong.

**A ring wakes an idle pane, unattended, and the record proves it.** At **01:06:45** the librarian
called `call_chair`; the chair — with no keeper typing into it — produced work at **01:07:21**.
**36 seconds, ring to work, at 1 a.m.** Re-derive:

    node -e 'const fs=require("fs");const r=fs.readFileSync("C:/Consonance/data/board.jsonl","utf8").trim().split("\n").map(l=>{try{return JSON.parse(l)}catch(e){return null}}).filter(Boolean);const lo=Date.parse("2026-09-03T07:06:00Z"),hi=Date.parse("2026-09-03T07:08:00Z");for(const x of r.filter(x=>(x.ts||x.at)>=lo&&(x.ts||x.at)<=hi))console.log(new Date(x.ts||x.at).toLocaleTimeString("en-CA",{timeZone:"America/Regina"}),String(x.text).slice(0,90).replace(/\n/g," "))'

So **the wake channel exists and no new one was needed.** Building one would have been the third
instance of the pattern the D003 map named — answering a REACHING problem with MORE SURFACE — and
`ask.js` was already named as the second. That is the main reason nothing here is a new channel.

What is missing is only the TRIGGER: `lap-row.js` writes the row and tells nobody.

    grep -c 'post_board\|inject\|notify' consonance/tools/lap-row.js     -> 0

## 2 · THE DEFECT IS SHARPER THAN "NOTHING WAKES A HOLDER", AND IT MOVES THE FIX

`mcp.rs:397` gates every speaking verb on the CURRENT holder:

    chair_inject    needs holder == chair       (the chair's only verb)
    call_chair      needs holder == librarian   (the librarian's only verb)
    call_librarian  needs holder == panes       (a pane's only verb)

Each seat has exactly one verb, and **its required holder is that seat itself.** Writing
`--holder <someone else>` sets holder to the other seat, and from that instant the outgoing seat's
only verb is REFUSED OUT OF TURN.

> **The act of handing off destroys the ability to announce it.**

The machinery does not merely fail to wake the holder — it **forbids the wake at exactly the moment
one is owed.** So the fix is not a channel. It is an **ORDER: ring first, write the row second.**

**And the workaround was already found by being refused, twelve hours ago, with nothing teaching
it.** The librarian hit this at 10:24, was refused, re-took the baton for 30 seconds, rang, and
handed off again — three ledger rows for one hand-off, visible in `lap.jsonl` D005 at 10:06:59 /
10:07:35 / 10:07:55, and its own row note says so.

## 3 · AND THE CHAIR'S REPLACEMENT DIAGNOSIS IS ALSO NOT THE CAUSE OF THE 9 HOURS

The packet is right that D005 is not the chair-was-slow case — the chair's step took **6 seconds**
(open 01:07:24, blind seal 01:07:30). But "nothing wakes a holder" is not what cost nine hours
either, and the difference matters for what to expect from this build.

**The board is silent from 01:07:51 to 10:04:08.** Not sparse — silent. Nothing in the house ran.

    node -e 'const fs=require("fs");const r=fs.readFileSync("C:/Consonance/data/board.jsonl","utf8").trim().split("\n").map(l=>{try{return JSON.parse(l)}catch(e){return null}}).filter(Boolean);const lo=Date.parse("2026-09-03T07:07:52Z"),hi=Date.parse("2026-09-03T16:04:07Z");console.log(r.filter(x=>(x.ts||x.at)>=lo&&(x.ts||x.at)<=hi).length)'
    -> 0

The librarian went idle at 01:07:06 having finished its turn. The chair wrote `holder librarian` at
01:07:30 and said *"my step is done"* **into its own pane**. Then the keeper slept.

> **The keeper is the relay, and the relay slept.**

The 9 h is not a holder ignoring a baton. It is a hand-off announced only to whoever happens to be
watching — and at 1 a.m. nobody is. **That is why the fix had to reach the SEAT and not the
transcript**, and it is the reason the thing built below blocks rather than prints.

## 4 · WHAT WAS BUILT, AND WHY AT Stop

**No hook in the holder's own session can wake it.** An idle seat fires no hook: SessionStart is
spent, UserPromptSubmit needs a prompt, Stop already fired. Only the injection plane reaches an idle
pane and only a live seat can invoke it. So the single reachable lever is the **outgoing** seat, at
the end of the turn in which it handed off — still running, still allowed to speak.

    consonance/tools/baton-wake.js          the reader (pure core + CLI)
    consonance/tools/baton-wake.test.js     37 tests
    consonance/hooks/baton-wake-stop.js     the Stop registration
    consonance/hooks/baton-wake-stop.test.js  14 tests, real child process, fake data dir
    dev/mutation/mutate-baton-wake.js       16 mutants

**Green, re-derivable:**

    node consonance/tools/baton-wake.test.js        -> 37 passed, 0 failed
    node consonance/hooks/baton-wake-stop.test.js   -> 14 passed, 0 failed
    node dev/mutation/mutate-baton-wake.js          -> 16/16 caught

**It blocks, and that needed pricing.** A Stop hook's stdout reaches the transcript — i.e. the
keeper — i.e. the relay that was asleep. A line only he can see rebuilds the nine hours.
`decision: block` is the one channel from that moment back into the seat.

**Why a block is defensible here when `sourced-stop.js` refused one.** That file priced its gate at
110-of-137 value-turns and called it a nag. This one's ceiling, measured on the same ledgers:

    holder CHANGES in the entire ledger, all laps, all time :       6
    board lines over the same span                          : 141,053
    ceiling on how often it can fire                        :   0.004%

Six events, ever — the opposite end of the same axis. **If that rate climbs, sourced-stop's refusal
applies and this should be demoted to a printer.**

**A wedge is impossible by construction, three ways**, because an un-uninstallable spin at 3 a.m. is
worse than the silence: `stop_hook_active` short-circuits a continuation; a `fired` marker keyed on
`(lap, holder, row.at)` blocks at most once per hand-off; every failure path exits 0 with no
decision. All three are mutation-tested.

## 5 · THE TRAP — the FACT, not the category

The line carries the lap, the stage, the holder, the age, **and the row's own note** — the sentence
naming what is owed and where it was written. When the note is null it **says** the note is null,
because a hand-off carrying no fact is itself the finding. Retrodicted against the real 01:07 row:

    BATON HANDED, NOBODY TOLD — D005 · inquiry · holder librarian · 20s, no audited delivery to
    librarian since the row landed.
    WHAT IS OWED, from the row: door two: keeper went straight to the librarian; chair sealed blind
    before reading e5fb20c or db33412
    Your verb is chair_inject and it needs holder chair (mcp.rs:397) — writing the row took your
    standing to send it. To ring: re-take the baton (node consonance/tools/lap-row.js --stage D005
    --holder <you>), send, then hand off again — ring BEFORE the row. Rows only: this sees audited
    deliveries, not a relay by hand.

**20 seconds, not 9 hours.**

## 6 · THE DISCRIMINATOR, ON THE REAL LEDGER — and this is the only result worth trusting

Both of D005's hand-offs, retrodicted:

    01:07:51  chair, row-only hand-off (cost 9h)      ->  FIRES
    10:07:55  librarian, ring-then-row (done right)   ->  silent

No threshold and no clock — the same shape `chain-status.js` used when it refused a duration axis.
A rule that fired on both would be counting hand-offs, not catching stalls.

## 7 · THE CORRECTIONS I MADE TO MYSELF — three, and two were found after green

**(a) The window was inverted, and it argued against the discipline it exists to teach.** The first
draft counted only deliveries with `ts >= row.at`, so it **fired on the hand-off that was done
correctly** — the librarian rang at 10:07:43 and wrote the row at 10:07:55, ring-then-row, twelve
seconds apart. An instrument that fires on correct behaviour does not merely miss; it argues loudest
at the moment a seat did the hard part. **Caught by retrodicting BOTH hand-offs rather than only the
one that stalled** — no test would have found it, because every test I had written encoded the same
misreading. The window is now the TURN: *during the turn you handed off, did you tell them* — before
or after the row, either way.

**(b) The verb was keyed on the holder instead of the sender.** It printed *"call_librarian needs
holder librarian"*; `required_station('call_librarian')` is `panes` (mcp.rs:399), and the chair may
not use that verb at all. Caught by reading the tool's own retrodicted output. The mapping is now
asserted as a matrix.

**(c) A guard that did nothing.** An explicit `reserved.length > 1 -> unknown` line was written and
then removed: mutation showed deleting it changed no behaviour, because an ambiguous prefix falls
through to `unknown` anyway. A guard whose removal no test can detect is not a guard — the
absent-guard-reads-as-passing-guard shape, nearly shipped inside a tool built on that finding.

**And three of my own tests were passing for the wrong reason**, each found by mutation and not by
reading: the once-per-hand-off guard (the turn boundary was silencing the second call, not the
guard); the `fired` marker (never asserted as written, so the guard could have been permanently
unarmed); and the per-pane filter on `since` (with 5+ panes sharing one ledger, any other seat
stopping would have swallowed the block — the busier the room, the more reliably it goes quiet).

## 8 · WHAT I DID NOT VERIFY — and one of these bounds the whole build

- **NOT VERIFIED: that a block actually re-prompts the seat in this harness.** Everything above is
  tested against a child process and asserted on its JSON output. **No seat in this room can observe
  a pane** (the 2026-09-02 SCRIBE finding), so whether `decision: block` lands as a turn in a live
  Consonance pane is unobserved by me. **If it does not, this build reduces to a transcript line and
  the nine hours return.** That is the single assumption the value rests on and it is the keeper's
  or the chair's to check in one live hand-off.
- **NOT INSTALLED.** It is not registered in `~/.claude/settings.json`. Registering a *blocking*
  Stop hook changes the behaviour of every seat on this machine while A, B, J and L are live on
  disjoint packets, and that is not a pane's call. The precedent for a seat wiring its own hook is
  `ask-surface.js` — but that one only adds context and cannot stop anyone. **One object, after the
  existing `Stop` entries:**

      { "type": "command",
        "command": "\"C:\\Program Files\\nodejs\\node.exe\" \"C:\\Users\\nname\\Desktop\\lighthouse\\consonance\\hooks\\baton-wake-stop.js\"" }

  Removal is deleting that object. **UNWIRED it is a tool nobody runs, which is exactly the failure
  `ask.js` measured** (hooks 67% forward, tools 62% backward) — so leaving it uninstalled is not a
  neutral outcome, it is the known-dead one.
- **NOT DONE: the right home.** The correct place for this is `lap-row.js` — refuse a hand-off row
  unless a ring preceded it, which makes the ordering unforgettable instead of merely reported. The
  packet ruled that file off-limits this pass. The hook is the second-best lever, and it reports
  where the tool would enforce.
- **Machine-local.** `lap.jsonl`, `board.jsonl` and `panes.json` are per-machine; the laptop is
  untouched, and a cross-machine hand-off is invisible to this.
- **Rows only.** It sees audited deliveries. The keeper telling a seat by hand leaves no row and
  reads as silence — the same self-report limit `lap-row.js` states as its limit (d).
- **Two hardcoded session ids.** `MAIN_SID` / `LIBRARIAN_SID`, copied from `main.rs:4414` and
  `:4544` because panes.json lists neither, and those two seats are exactly the ones that pass
  batons. If either constant changes, this degrades to `unknown` — which fires and says so, the safe
  direction.
- **The base rate is n=6.** Every claim about how rarely this fires rests on six events. It is a
  floor, not a census.

## 9 · FALSIFIERS, registered here rather than after the fact

1. **If a hand-off stalls again while this hook is installed and it did not fire**, the trigger is
   in the wrong place and the answer is the `lap-row.js` gate, not a hook.
2. **If it fires on a hand-off that was correctly rung**, the turn window is still wrong — the same
   bug as §7(a), and the correction did not go deep enough.
3. **If it blocks a seat twice for one row**, the marker is not being written and the wedge guards
   are decorative.
4. **If `holder` changes climb above ~50 in a season**, the base-rate argument for blocking is dead
   and this must become a printer, on `sourced-stop.js`'s reasoning.
5. **If it is still uninstalled a week from now**, it is the third instance of the pattern it was
   built to break, and the honest move is to say so rather than let it sit as a green test count.

## 10 · WHAT THIS DOES NOT ESTABLISH

It does not establish that unattended overnight work is *wanted*. §1 proves a rung pane runs at
1 a.m.; whether the librarian *should* have mapped D005 while the keeper slept is his call, not an
instrument's. This build only removes the case where a seat sat idle **because nobody could tell
it** — it takes no position on a seat that is told and waits.

Nor does it establish that the chair's self-diagnosis was wrong in general. `from-map 0, opened 0`
on D001, D003 and D004 stands. It is wrong for **D005**, which is what the packet already said.
