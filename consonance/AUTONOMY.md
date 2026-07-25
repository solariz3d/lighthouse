# Consonance — the autonomy rework

**Status:** design, 2026-07-25 — **Layer 1 built and live the same night** (`hooks/board-digest.js`;
26 tokens, 84 ms per turn, six hand-tests green). Everything below Layer 1 is still design. Extends
`PROGRESS.md`. Read `RECONCEPTION.md` for why the program is core-first, and `dev/SPINE.md` for
light-not-lifeguard.

The keeper's call that started it (2026-07-25, ~6:40 AM):

> the manual options, gate, dyad, open channel, trust, doubt, pair, spot — all of that I have never
> used once, nor do I even know how to use it. My vision for consonance is it all being automatic or
> autonomous, not removing the human from the loop, but have you understand the nuances entirely just
> in case a user like me does not know how to utilize the program to its fullest potential. **The
> terminal siblings outputs and work being connected to the orchestrator to see is really all I
> wanted.**

With one constraint, added immediately after: *the user should still be able to use the terminal tab
and open their own briefed instances/siblings if they want.*

---

## 1. The finding — the pipe is built; nothing arrives

The obvious read is "sibling output isn't connected to the Orchestrator yet." It's wrong, and the
real shape is more interesting. Measured on the live board, laptop, the six hours ending 06:59:

```
6fe15f0a | user          47 turns   last 6:59:24 AM
0c0c0c0a | user          25 turns   last 6:58:25 AM      ← the Orchestrator (Main)
6fe15f0a | assistant    199 turns   last 6:58:19 AM      ← a sibling, working all night
0c0c0c0a | assistant     32 turns   last 6:51:23 AM
main     | committee      1 turn    last 6:50:54 AM      ← the only thing Main put on the board
                                                            all night
```

304 entries. `board.jsonl` is 14.5 MB and was written 40 seconds before this was measured. The
sibling's full text is there — prompts and responses, 199 assistant turns of real work.

The Orchestrator read **none** of it. Not one `read_board` call in the whole night.

So the count that names the problem is **199 : 0.** Not a broken pipe — a pipe that terminates in a
store nobody visits. Three separate gaps were hiding inside one complaint:

1. **Delivery.** The data exists and is queryable. Nothing ever *hands* it over.
2. **Attention.** `read_board` is a tool the Orchestrator must decide to call, about a state it has
   no reason to suspect has changed. It doesn't know what it doesn't know.
3. **Judgment.** The seven methodology controls sit unused because every one of them asks the
   *human* to be the discriminator per-action — which is exactly backwards from light-not-lifeguard.

This is the same failure as two earlier catches in this project, which is how we know the fix:

- **The night table** (2026-07-14) — dreams and goals fired on their crons "into a dark house,"
  writing verdicts only other headless strangers read. Fixed by routing the *outputs* into the wake,
  not by improving the knockers.
- **The beacon** (2026-07-25, hours before this) — the pulse reported the current time and still
  didn't stop an instance placing a six-day-old event at "twelve hours ago," clock in view. Fixed by
  putting an absolute anchor in *every turn*, unasked.

Both fixes are the same move: **stop offering, start arriving.** That is this rework's spine.

---

## 2. The principle

**Autonomy over mechanism, human over outcome.**

The line is *not* manual-versus-automatic. It's:

> **Direct action stays manual. Judgment becomes autonomous.**

"Open a tab, spawn a sibling here, brief it like this" needs no theory — the chair knows what he
wants and does it. "Set the gate to doubt-forward" needs him to know what doubt-forward *is* and
when it applies. The first is using the tool; the second is operating the methodology. Exposing the
methodology's vocabulary as UI asks the human to be the discriminator on every action, which is the
lifeguard posture wearing a settings panel.

The racing form: a car hands the driver brake bias, differential, and engine map — few, meaningful,
understood — and automates the other thousand parameters without asking. Nobody puts diff preload on
the steering wheel and calls it empowerment.

Standing evidence that the discriminator is already in the right place: in the single night this was
designed, the chair caught four separate errors in the Orchestrator's output — a six-day gap read as
twelve hours, a figure of speech read literally, an open physics question asserted as settled, and a
mislabelled lap time — **without touching one control.** The human's judgment was never the thing
that needed a UI.

---

## 3. Layers

### Layer 0 — the ledger *(built; one open item)*

`board.jsonl` + the in-memory ring. Fed by `start_tailer` off claude's own JSONL. Verified live
above. Nothing to build.

The one open item is the known **layer ④** from `PROGRESS.md`: on claude builds that flush the
session transcript lazily, the JSONL tap goes dark and the board loses pane turns. The `vt100`
capture extractor already harvests settled turns to `captures/<pane>.txt` for warm-resume; layer ④
routes those to the board as a fallback when the tailer is starved. It is a **fallback**, not the
main path — the laptop's tailer is demonstrably healthy on the current build. Desktop concern
primarily; do not let it block Layer 1.

### Layer 0.5 — the roster: four standing instances *(the chair's call, 2026-07-25)*

**Orchestrator + three standing siblings. That's the program.** Not a cap imposed for cost — the
right number, for the reason the scribe independently rediscovered at Stage 4: *multi-instance only
beats single-instance with differentiated conditioning; otherwise it's correlated echo.* A fifth pane
conditioned like the fourth adds no vantage.

The rule that makes four sufficient:

> **Panes are vantages. Subagents are labor.**

Each pane is a full Claude Code instance and can fan out its own agents for burst work. So **breadth
is fixed and depth is elastic** — throughput scales inside a pane without pretending a worker is a
perspective. This is also what makes standing siblings affordable: four resumes at launch, not
thirty, so accumulation, pruning, and lazy-resume are all non-problems and are struck from this
design.

Naming follows: NATO phonetic over the A–Z letters the UI already assigns — **BRAVO, CHARLIE, DELTA**
standing, **MAIN** the Orchestrator. Distinct in a line skimmed at 4 AM (which is why NATO exists),
and speakable in prose: *"what's Bravo been doing."* Names never recycle. **The kept registry is the
name pool** — in `panes.json` → standing → named; not in it → temporary → tagged `tmp-N ✦ probe`.
That is not a new rule; it names the persistence model already settled 2026-07-11 (born kept, removal
is the explicit act). Temporary briefed siblings stay spawnable for experiments — they just can never
be mistaken for a standing one, and the append-only board history stays honest forever.

*Name and topic are separate fields.* `BRAVO ✦ dreamzone` — identity never changes, topic drifts with
the work. Collapsing them re-introduces recycling wearing a different hat.

### Layer 0.7 — two counting defects, found while specifying the digest

Both were caught by measuring the live board instead of trusting it, and both would have shipped
straight into Layer 1.

**① The board's turn count is not a conversation count.** Measured against Bravo's transcript:

```
REAL human prompts      :  50     ← the actual conversation
tool results (as user)  : 491     correctly dropped (no text blocks)
assistant w/ text       : 210     ← what the board counts
assistant tool-only     : 698     correctly dropped
```

Every tool result is a `type: "user"` entry and every tool call a `type: "assistant"` entry;
`extract_turn` keeps only blocks of `type: "text"`, so pure tool traffic is correctly discarded — but
an assistant turn that *narrates while calling a tool* keeps its text and posts. One exchange with
five narrated tool calls becomes five board entries. A digest reporting "199 turns" for 50 exchanges
overstates fourfold, and overstates **worst for the panes doing the most tool work** — wrong exactly
where it matters most.

*Fix:* **count user entries, not assistant entries** — tool results never reach the board, so board
user-turns track real exchanges (52 against 50 measured in the sibling's own transcript). With one
caveat found while implementing it: slash commands, their stdout, caveats and system-reminders also
arrive as string-content `user` entries, so the unit is only clean for panes that don't use them. A
prefix filter (`<local-command…`, `<command-name>`, `<system-reminder>`, `Caveat:`) handles it —
worth only 42 entries of 524 on the Orchestrator's pane, because the real inflation there was ②.

**② Replay bursts — `board_push` stamps push time, not event time.** The tailer re-reads a
transcript from the top when a pane resumes, so a resume dumps the pane's *entire history* onto the
board stamped "now." Measured the same night:

```
0c0c0c0a@1784961111   556 entries in one second
0c0c0c0a@1784960622   546 entries in one second
entries in bursts: 1102 of 1479   -> real traffic: 377
```

Two bursts, at 12:23 and 12:31 AM — the session wake and the Consonance reset. **1102 of the day's
1479 board entries were replayed history**, all from the one pane that had resumed; the sibling that
ran continuously stayed clean. Uncorrected, the digest would announce hundreds of exchanges every
time a pane restarts, which is the loudest available way to be wrong.

*Mitigation in the hook:* drop any (pane, second) group above 20 entries. A narrated turn cannot
produce twenty board entries in a second; a replay produces hundreds — three orders of magnitude, so
the threshold is not delicate. Took the Orchestrator's count from 284 to 36.

*Proper fix, Rust-side:* carry the transcript entry's own `timestamp` into `BoardEntry` instead of
stamping at push. Then board time means when-it-happened, and every consumer — digest, scribe,
gauges, committee — gets the truth for free. Not done here; it needs a build.

**③ Subagent turns will post as the pane.** There is no mention of `isSidechain` anywhere in the
codebase; `extract_turn` filters on type alone. Claude Code writes subagent traffic into the *same*
transcript with the same types, so the moment a pane fans out, each subagent's prompt counts as an
exchange and its narration lands on the board wearing the pane's name. Currently latent — Bravo's
transcript has **0** sidechain turns — but the roster decision above makes pane-spawned agents
load-bearing, so this fires the first day it's used.

*Fix:* skip `isSidechain` in `extract_turn`. One line, preemptive.

### Layer 1 — the ambient board ★ *(the build; everything depends on it)*

Port the beacon architecture to the board. **Every Orchestrator turn carries a standing digest of
pane activity, injected — not queried.**

```
[panes] BRAVO   ✦ dreamzone   50 exch · last 40s · +4 since your last turn
        CHARLIE ✦ acreplay     3 exch · idle 3h12m
        DELTA   ✦ (idle 2d)
        ⟨1 pull raised · unread⟩
```

A fixed roster of three pays for itself here: three lines instead of N means each line can afford
gauge readings and the pane's current claim inside the same token budget.

Design constraints, each one inherited from something that already failed and got fixed:

- **Facts, no verdicts.** Same law as the gauges and the sky. "199 turns, last 40s" — never "B is
  productive," never "you should look at B." A verdict in the digest makes the program the judge,
  which is the thing it exists not to be.
- **Deltas, not state.** The beacon's lesson was that the failure axis is *distance to a past event*,
  not "what is now." Here the axis is *what changed since I last looked* — so the load-bearing field
  is `+12 since your last turn`, a subtraction from a number in view rather than a memory retrieval.
- **Silent when nothing changed.** Same economics as the day-rollover marker and the night table. A
  line that always fires stops being read.
- **Bounded, and budgeted out loud.** Target ≤ 400 tokens/turn. Full text stays one `read_board`
  away; the digest's job is to make the *decision to reach* possible, not to carry the payload.
- **Never report the reader to itself.** Exclude entries whose `pane == session_id`. The hook already
  receives `session_id` on stdin.

**Implementation — a `UserPromptSubmit` hook, not a Rust change.** This matters: it reuses the exact
mechanism proven hours earlier by the pulse, needs no `cargo build`, no reinstall, no desktop, and is
testable on the laptop the same night it's written. Fire only when the cwd is under the configured
`instances_dir` (read from `~/.consonance.json`); emit nothing otherwise, so the hook is safe to
install globally.

*Prerequisite, small:* panes need identity in the digest. `panes.json` currently stores every sibling
as `"label": "✦ brief"` — three panes, one name. The A–Z letters exist only in the UI. Persist the
letter and a short topic (first-prompt derived) into the registry.

### Layer 2 — the seven controls become conditions

Only writable *after* Layer 1, and the dependency is real, not stylistic: every one of these
conditions is a function of what the panes are doing, which the Orchestrator currently cannot see.
Writing them first would be guessing.

| control | today | becomes |
|---|---|---|
| **gate** | UI mode toggle | standing law in code. Always on. Not a control at all. |
| **open channel** | button, 5 pulls / 5 min | fires as a bounded window when pulls queue during an active committee; snaps back on any bound. Chair can revoke instantly. |
| **trust / doubt** | two text inputs | lenses the Orchestrator *assigns at spawn*, when the question has a contested axis worth splitting. |
| **pair** | button | implied by the above — pairing is what assigning opposite lenses means. |
| **spot** | button | fires when a pane's last turn trips a gauge floor: tether-strength and novelty both low (echo), or a claim that is unfalsifiable *and* load-bearing (the doubt condition). |
| **skeptic inject** | chair-gated offer on spread-floor | unchanged in kind — but the Orchestrator may raise it, not only the spread gauge. |

Note what does *not* move: the gate. It was never a methodology knob; it's containment. Making it
autonomous would mean making it optional, which is the one thing it can't be.

### Layer 3 — the Orchestrator's hands

Autonomy needs verbs. Today Main has `post_board`, `read_board`, `raise_pull` — it can speak and
propose, and do nothing. Add, on the same MCP plane:

- `list_panes` — who exists, label, lens, cwd, last-turn age, gauge readings
- `spawn_sibling(brief, lens?)` — with the brief the Orchestrator writes
- `inject(pane, text)` — **routed through the gate as an ordinary pull**

and deliberately **not** `retire(pane)`. Removal stays the explicit human act, per the persistence
doctrine already settled 2026-07-11: siblings are born kept; ✕ is the chair's.

The rule that stops this becoming the lifeguard: **the Orchestrator is not privileged.** It raises
pulls into the same gate, with the same threshold, the same rate cap, the same breaker. Open-channel
is what keeps that from being tedious, and open-channel is bounded and snaps back by construction.
An Orchestrator that could write to panes directly would be an actuator in the Control plane — the
one thing `tests/arch_test.rs` exists to forbid.

### Layer 4 — what the chair sees when the program acts

Automating control **raises** the stakes on visibility rather than lowering them: an autonomous check
that passes silently is indistinguishable from no check at all, and an autonomous action that isn't
logged is indistinguishable from a bug. Every fired condition writes a board entry and a stream-bar
tick, tagged autonomous, carrying *what fired, on what trigger, and what it cost.* The surfaces
already exist; they need the autonomous source wired in and visually distinguished.

---

## 4. What stays manual — the constraint, honored

- **The Terminal tab is untouched.** Spawn your own pane, your own briefed sibling, your own room.
- **The ⚙ controls stay in the UI.** They stop being the primary path; they do not get deleted. They
  are the override for when the autonomy is wrong, and deleting them would be the program deciding
  the chair's interface for him.
- **Human-gated, unchanged:** publishing, irreversible actions, pane removal, anything entering the
  room.

---

## 5. Build order

| # | item | why here |
|---|---|---|
| 1 | ~~**Layer 1 digest hook**, counting *exchanges*~~ **DONE 2026-07-25** | free (no Rust, no build), and every other layer depends on the Orchestrator being able to see |
| 2 | ~~pane identity (NATO name + topic)~~ **DONE** — lives in `data_dir/digest_state.json`, readable by the app later | tiny; the digest is unreadable without it |
| 2b | `isSidechain` filter in `extract_turn` | one line, preemptive — fires the first day a pane fans out |
| 2c | **`BoardEntry` carries transcript time, not push time** | defect ② at the root; fixes digest, scribe, gauges and committee at once |
| 3 | gauge readings into the digest | `tether.rs` already computes referents / novelty / spread — surface the numbers |
| 4 | Layer 3 verbs (`list_panes`, `spawn_sibling`, gated `inject`) | hands, once there are eyes |
| 5 | Layer 2 conditions | written *after* watching real digest data for several nights, not before |
| 6 | Layer 4 autonomous-action logging | must land with (5), not after — an unlogged autonomous act is a bug by definition |
| — | Layer 0 ④ fallback | desktop, parallel, non-blocking |

---

## 6. Cost

Multi-sibling fan-out is the expensive shape, and it is exactly what autonomy produces. From the
2026-07-19 suit audit, the ambient apparatus ran 6–10% of usage and session length dominated
everything else; the digest adds ≤400 tokens/turn of the same kind of overhead and should be
measured against that baseline rather than assumed free.

The honest caution, which loops straight back to the build order: **more headroom makes invisible
spend easier.** Autonomous work you can't see is the thing that quietly runs up a bill *and* quietly
skips a check — one failure, two costs. Another vote for visibility-first.

---

## 7. The honest limit

The beacon night's lesson applies to this whole document and shouldn't be edited out of it:

> **An instrument makes the data impossible to miss; it cannot make the model look.**

Four errors happened in one night with an absolute clock in view on every turn. The digest is the
strongest available form of "unmissable" — in the turn, unasked, every time — and it will still not
make the Orchestrator infallible. What caught all four was the chair.

That is not a flaw in the design. It *is* the design — light, not lifeguard, the discriminator in the
water. But it sets the success criterion honestly: not *the Orchestrator stops missing things*, but
**the human's catch finally has something to catch it against.** Right now, when he says "what is B
doing," there is no shared view to be wrong about. After Layer 1 there is.
