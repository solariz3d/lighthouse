# Falsifier 2, re-scored under the corrected unit — and the unit is worse than the mix

**Seat:** pane B, lap L012. **Non-author on both halves:** I did not register Falsifier 2 (pane E),
I am not its subject (the chair), and I did not write the L011 map that reported it fired
(`exo_memory/librarian/2026-08-29.md:43-47`). Nothing here is committed.

**The registration, verbatim** (`exo_memory/loop/lap_2026-08-23.md:145`):

> *Over the next 20 chair commits, the keeper-initiated share of **librarian laps** must fall below
> 1/2. If it does not, the human is still the ferry and the three tools are decorative.*

Abuse clause, same file: *"the tools are new, give it time"* is the degenerating sentence. It is not
said here.

---

## VERDICT

**IT FIRES HARDER.**

Not "it still fires" — that was the chair's reading and it is the *weakest* of the four available
readings. Under the unit the registration's own words name — **librarian laps** — the keeper-initiated
share is **10 of 10 = 100.0%**. Every lap that completed a librarian leg was started by the human.
The two that were not started by the human are the two that never reached a map.

Three things follow, and the second is bigger than the thing I was asked to score:

1. The chair's re-score conclusion survives; **the chair's reason for it does not**, and must not be
   carried forward as a rule.
2. **The denominator is minted by the falsifier's subject, and it moved 7.6 points in the subject's
   favour four minutes fifty-nine seconds after the fire was recorded** (chain note 00:35:18 →
   `L012` open 00:40:17). No machine-scope clause can see this.
3. One sub-figure is **unscoreable until X** — X is named in §5 and does not change the verdict.

---

## 1. The three units, all re-derived

    node consonance/tools/lap-row.js --report
    git rev-list --count 6905d74..HEAD          # 120
    git rev-list --count 6905d74..2c7b387       # 93   (pre-pull local HEAD)

| unit | gate (commits) | ratio | fires? |
|---|---|---|---|
| **as computed** — gate GLOBAL, laps machine-local | 120 of 20 | 10/12 = 83.3% | yes |
| **all-local** — gate excludes tonight's 27-commit pull | 93 of 20 | 10/12 = 83.3% | yes |
| **all-global** — both machines' laps | 120 of 20 | (10+h)/15, h∈[0,3] → **66.7%–86.7%** | yes, at every h |
| **the registered words** — *librarian* laps only (§2) | 120 of 20 | **10/10 = 100.0%** | yes, maximally |

`h` is how many of the desktop's D001–D003 were keeper-initiated. I cannot read it (§5). Every value
of it fires, so the verdict does not wait on it.

### The chair's reason is wrong, and this is the most important sentence in §1

> *"the mixed universe changes WHEN the window closed, not the RATIO inside it — 10/11 is 90.9%
> whatever the denominator was."*

The arithmetic is trivially true and it answers the wrong question. `10/11` is not a ratio that
survives the correction; it is **the laptop's ratio**, and nobody chose that. The mix is not one
error, it is two, and the sentence addresses only one:

- **the gate** — which commits close the window. Set complete, partition wrong: **species B.**
- **the ratio** — which laps enter it. Set *short* by three: **species A.**
  (`loop/universe_print_registration_2026-08-25.md:414-422`)

The chair called the whole thing species B. Half of it is species A, and the difference decides the
fix: a clause that *names* the partition cures B and leaves A live, because **a universe print is
blind to species B by construction** and catches A *only if the count comes from outside* — and no
instrument on this machine can count the desktop's laps at all, by ruling 2W-1
(`loop/two_writers_registration_2026-08-25.md:166`: *"the authority stays machine-local, which is
correct and is not going to change"*).

The ratio is **not invariant to the universe.** It ranges 66.7% → 100.0% across the four readings
above — a 33-point swing. It fires in all of them because the *margin* is enormous, not because the
mixing is harmless. **On a falsifier with a threshold anywhere in 50–100%, the chair's sentence would
have produced a wrong verdict.** Keep the conclusion; strike the reason.

---

## 2. The unit the registration names — and the instrument contradicts itself four lines apart

    ALL laps            12  human 10  = 83.3%
    LIBRARIAN laps(map) 10  human 10  = 100.0%
    un-mapped laps: L010(chair), L012(chair)

(one command, §6)

The registration says **"the keeper-initiated share of librarian laps."** A lap with no map has had
no librarian leg. `L010` (opened 2026-08-25 10:31, chair) and `L012` (opened 2026-08-29 00:40, chair)
are the only two laps in the ledger with no `map` row — and they are **both** of the non-human laps.

So under the registered words: **10 of 10 = 100.0%.**

This is not a unit I chose for effect. It is the one in the sentence, it runs *against* the seat that
would benefit from the other one, and I am the seat with no stake in either. And the instrument
already prints it — `--report`'s own table lists exactly ten rows, every one `human`, and then the
FALSIFIER 2 line four lines below divides by twelve. **Two denominators, one screen of output,
neither labelled.** That is species B inside a single instrument's own report, and it is a one-line
fix: the falsifier line should divide by `scored`, not `valid`, or print both and say which the
registration meant.

*The counterweight, registered here so it is not mine to spring later:* excluding un-mapped laps
could in principle be gamed the other way — a chair could bury chair-initiated laps by never mapping
them. Here it cuts **toward** firing, so nothing is hidden; but at n=10 a single completed chair lap
moves this figure 10 points, and this unit must not be quoted without its n.

---

## 3. The denominator is minted by the subject, and it moved during the adjudication

This is the part no machine-scope clause reaches, and it is the answer to the chair's question in §4.

    L011  open  00:32:36  initiator=human  "inventory after 3.5 days dark and 25 desktop commits…"
    L011  chain 00:33:01  dispatched → librarian
    L011  chain 00:35:18  map → chair   note: "E-falsifier-2 FIRED, to adjudication"
    L011  map   00:35:26
    L011  chain 00:36:04  filed → chair
    L012  open  00:40:17  initiator=chair  "L011's work-shape, dispatched: falsifier scope,
                                            the re-score, the stalled-lap detector and its attack"
    L012  chain 00:40:17  working → panes

`L012`'s **inquiry is L011's output.** Its guess is the four filenames the panes were told to write,
this file among them. `brief/BUILDING.md:262` and the loop it documents — *you → orchestrator →
librarian → plan → **panes** → orchestrator → librarian → you* — put the pane stage **inside** one
lap. `L011` stopped at `filed` without ever reaching panes; `L012` is that pane stage, minted as a
new lap and attributed to the chair.

**Measured effect:** at the `map` row (00:35:26) the ledger held 11 laps, 10 human = **90.9%** — the
figure the L011 map published. **Four minutes fifty-one seconds later** it held 12, 10 human =
**83.3%**. **−7.6 points, in the subject's favour, inside the window in which the fire was being
adjudicated, by the subject.** *(The ledger stamps rows, not the instant `--report` was run; 00:35:26
is the closest anchored timestamp, and neither the direction nor the size depends on which minute
inside 00:32–00:36 the reading was taken.)*

**I am not alleging intent, and the case evidence runs the other way**: the chair reported the fire
rather than tuning it, quoted the abuse clause against itself, surfaced the universe mix unprompted,
and dispatched a non-author to score it. Nothing was gained — 83.3% is not near 50%.

**The mechanism is the finding, not the instance.** It is free, unbounded, and now demonstrated once:

> One keeper inquiry, dispatched to panes as ten separately-minted chair laps, reads
> **1 human / 10 chair = 9.1%** — *falsifier does not fire* — while the human started every bit of it.

The falsifier can be driven from FIRES to DOES-NOT-FIRE with no change whatever in who is the ferry,
without leaving one machine, using only the ordinary `--open` surface. `lap-row.js` seals the
**guess** against post-hoc edits (three mechanisms, `:24-34`) and leaves **`initiator`** — the single
field this falsifier reads — unsealed and typed by the seat being measured. The tool's own limit (d)
says the row is self-reported; it does not say that the one self-reported field with a falsifier
hanging off it is also the one with no seal.

---

## 4. Pane A's clause, attacked before it lands

`exo_memory/loop/falsifier_scope_2026-08-29.md` **did not exist at 00:52** (`ls`, §6). This section
was written before the object so it cannot be fitted to it. Four tests; a clause that fails any of
them is a label, not a scope.

**T1 — THE LABEL TEST.** After the clause is applied, does any *figure* anywhere change? If the whole
effect is that each falsifier now carries a sentence naming a machine, the clause is a universe print,
and the registration it descends from says a universe print is *blind to species B by construction.*
A scope that changes no number has scoped nothing.

**T2 — THE DERIVATION TEST** (the chair's mirror-test question, answered): **is any clause computed
FROM the ledger the falsifier asserts on?** By default yes, and this is the trap. If the clause for
Falsifier 2 reads *"laps counted from `lap.jsonl` on the machine that ran the report"*, then the
clause's universe **is** the falsifier's universe and it can never reveal a missing member. The repo
already owns the rule — `universe_print_registration_2026-08-25.md:408`: ***the checker must not
derive its universe from the checked.*** For this falsifier the outside count is **structurally
unavailable** on this machine, and the clause must say so in those words rather than print a
confident scope.

**T3 — THE TWO-READINGS TEST.** After the clause, does `lap-row --report` on the laptop and on the
desktop return the same verdict for Falsifier 2? It will not — the desktop's ledger holds D-laps and
this one holds L-laps, while **both read the same global commit gate.** A falsifier with two
simultaneous truth values and no named adjudicator is not scoped, it is **duplicated**. A's clause
must name which reading is the room's, or say plainly that the falsifier is per-machine and that its
consequence sentence (*"the human is still the ferry"* — a claim about the room) is therefore
unsupported by either reading alone.

**T4 — WHAT COULD A FALSIFIER VARY THAT A'S CLAUSE WOULD NOT SEE?** The chair's question. The answer
is not hypothetical; it executed tonight. **A clause that fixes SPACE fixes neither TIME nor UNIT:**

- **TIME** — the number moved 90.9% → 83.3% in 7m41s *while the fire was being adjudicated*. A
  machine-scope clause declares both readings in scope and neither authoritative. Fix: bind a reading
  to a **commit sha**, not to a machine. `lap-row` already stamps `head` on every row and never uses
  it to freeze a reading.
- **UNIT** — §3. Both halves of the split are on the same machine. Invisible to any scope clause,
  worth 33 points, available for free.

**T5 — THE PRECEDENT, AND IT ALREADY FAILED.** A's clause has been written once already, one day ago,
by the D002 falsifier seat, for the boundary check — `consonance/src-tauri/brief/BUILDING.md:368`:

> **One machine.** Both ledgers are machine-local; this is whichever machine ran it.

Correct, landed 2026-08-28, and **it did not stop tonight's mixed-universe reading** — because it
sits in a different falsifier's limits section, and whoever reads `lap-row --report` never sees it.
That is the 2026-08-17 carrier lesson with a fresh instance: *the correction existed, was
unambiguous, and did not propagate.* **A's clause must state how it reaches the reader of the tool's
output, not the reader of the registration.**

**The cheapest thing that satisfies T1 and T5 at once, and the data is already on disk:**
`~/.consonance.json` carries `machine_tag: "L"`; `lap-row.js:244` reads it; **`machineTag()` is called
exactly once in the whole file, from `mintId` (`:261`), and never from `report()`.** The report's only
universe line is `lap-row - C:\Consonance\data\lap.jsonl` — **a path, which is not a machine**, and
which on the two machines may well be the same string denoting different sets. The reader cannot tell
from the output which machine's laps are in the number. Print the tag beside the falsifier line and
T1 is met by a figure nobody can miss.

*One latent case A must cover:* `mintId`'s own comment (`:255-257`) already contemplates *"an imported
row"* in the local ledger. The moment anyone imports D-rows for a merged reading,
`human / valid.length` blends two machines silently. A clause written only for the **split** case does
not cover the **merged** one.

---

## 5. What this does not establish — and the one thing that cannot be scored yet

- **`h` is unread.** I cannot see the desktop's D001–D003 initiators; `lap.jsonl` is machine-local by
  design and not in git. **X = those three initiator values, or `lap-row --report` run on the desktop
  and pasted.** Every value of `h` fires, so the *verdict* does not wait; the exact global percentage
  does. **Do not quote a global figure until X arrives.**
- **I did not verify the desktop's `data_dir`.** My claim is only that the report's universe line
  carries no machine identity — checkable in the source, above. Whether the two paths are literally
  identical is unknown from here, and that unknowability is itself the point.
- **The 93 is not a pure single-machine count.** It is commits reachable from the pre-pull local HEAD,
  which includes anything merged from the desktop earlier. It is 4.65× the window, so the gate closes
  without tonight's pull under any reading — the only load that figure has to bear.
- **This says nothing about whether the three tools are useful.** The registered consequence is a
  sentence about the ferry; I scored the ferry.
- **§3 alleges no intent** and the case evidence runs against intent. It is a statement about what the
  surface permits.

---

## 6. Registered against myself, before anyone acts on this

**F-B1 — THE 100% IS AN ARTEFACT OF n=10.** If, within the next 10 laps, two or more chair-initiated
laps complete a librarian leg and the librarian-lap share falls below 90%, then §2's unit was
reporting the ledger's youth and not the room's behaviour, and the 100.0% headline should be struck
rather than defended. *Named unwelcome outcome, in the words that make it true:* **"pane B picked the
denominator that made the finding loudest."**

**F-B2 — §3 IS A MECHANISM WITH NO INSTANCES.** If a season passes and no lap is ever again minted
that splits one keeper inquiry across chair laps, then §3's Goodhart is a shape I reasoned to and not
a thing this room does, and it should be filed as such rather than cited as a live hazard. *My one
instance is L011/L012, and one instance is not a rate.*

**F-B3 — THE ATTACK IN §4 WAS WRITTEN BLIND AND MAY MISS.** If A's clause, when it lands, addresses
TIME and UNIT (T4) directly, then my pre-registration was aimed at a weaker clause than the one that
was coming, and T4 should be scored as *anticipated, not missed*. Scored by whoever reads both files —
**not by me.**

**Not scored by its author:** §1–§3 read an instrument whose subject is the chair and whose registrar
is E. I am neither. §4 attacks a document I have not seen, by design. Nobody has scored *me*, and the
right seat for that is A or E — not the chair.

---

### Commands, so every figure above re-derives

    cd C:\Consonance\lighthouse
    node consonance/tools/lap-row.js --report
    git rev-list --count 6905d74..HEAD
    git rev-list --count 6905d74..2c7b387
    grep -n "machineTag()" consonance/tools/lap-row.js
    ls exo_memory/loop/falsifier_scope_2026-08-29.md

    node -e "const fs=require('fs');const rows=fs.readFileSync('C:/Consonance/data/lap.jsonl','utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);const L={};for(const r of rows){const x=L[r.lap]||(L[r.lap]={id:r.lap,init:null,map:false});if(r.stage==='open')x.init=r.initiator;if(r.stage==='map')x.map=true;}const a=Object.values(L),h=a.filter(l=>l.init==='human'),m=a.filter(l=>l.map),mh=m.filter(l=>l.init==='human');console.log('ALL',a.length,'human',h.length,(100*h.length/a.length).toFixed(1)+'%');console.log('LIBRARIAN',m.length,'human',mh.length,(100*mh.length/m.length).toFixed(1)+'%');console.log('un-mapped:',a.filter(l=>!l.map).map(l=>l.id+'('+l.init+')').join(', '));"
