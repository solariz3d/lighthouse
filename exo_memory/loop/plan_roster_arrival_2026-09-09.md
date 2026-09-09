# D056 — the work-shape for the travelling roster. Librarian, 2026-09-09 10:05, machine D.

**Asked for by the chair: which packets, in what order, what stays disjoint, what needs an
adversarial reader — and to say plainly if any of it is already decided somewhere it has not read.
Bodies are the chair's to assign. Nothing here is dispatched.**

---

## 0 · THE PACKET BEFORE THE PACKETS — and it is a decision, not a build

Every plan below forks on one unasked question:

> **What is the arriving roster FOR?**

`panes.json` is the other machine's list of *its* seats and *its* cwds. On arrival, this machine can
act on none of it. So there are three honest answers, and they cost wildly different amounts:

| answer | what it means | cost |
|---|---|---|
| **A. Nothing.** The roster is local by nature. | `panes.json` is **STAYS**, one word in the manifest. | one line + a test. No new machinery. |
| **B. A record of what the other house holds** (so a seat can ask *"what is open over there?"*). | TRAVELS to a **different path** — `machines/<tag>/panes.json` — never over the live one. | small; no transform, no rewrite arm. |
| **C. A roster to adopt.** | TRAVELS **with a rewrite-on-arrival transform**, which is what `state-manifest.json:21` prescribes in words. | the whole rewrite contract, plus a transform that can delete a live pane's row. |

**The manifest's prose already picked C, and nobody has argued for it.** *Rewrite-on-arrival* is
written at :21 as the remedy, and it may simply be the wrong remedy: it is the most expensive of the
three and the only one that can do damage while running. **A and B both make the failure structurally
impossible instead of repairing it.** I am not ruling this — it is the chair's with the keeper — but
**no body should be assigned until it is answered, because A is a one-line lap and C is a three-packet
lap and they share no work.**

**My recommendation, stated so it can be argued with: B.** It keeps the fact (what the other house
holds), removes the hazard entirely (nothing arrives over a live file), and needs no transform that
could drop a seat. A is cheaper and loses the fact. C is the only one that can be wrong at runtime.

## 0.1 · THE COUPLING THAT MUST BE DECIDED IN THE SAME BREATH

**`letters.json` and `panes.json` must be classified together or they drift.** `letters.json` is
TRAVELS and pane-id-keyed, so it arrives cleanly and *silently re-letters this machine's seats* — the
two roots already disagree (`0c0c0c0a` = **D** here, **A** there; `0c0c0c0b` = **M** here, **B**
there; measured 09:50, B found the same trap from the carry side). If the roster becomes STAYS and
the letters keep travelling, the room gets a house whose seats are named by the other machine's
scheme and rostered by its own. **One ruling, both files.**

---

## 1 · WHAT IS ALREADY DECIDED — the chair asked, and the answer is "more than you think, in two files you did not name"

**DECIDED AND ON DISK. Do not spend a body re-deriving any of this:**

- `loop/desktop_first_launch_2026-09-09.md:528-560` (B, §0.7) — the whole diagnosis, and the
  criterion nobody has promoted to a rule: ***`panes.json` is the only TRAVELS file that points
  outside its own transported tree, and the thing it points at is classified nowhere.*** Also the
  portable-pty chain at `cmdbuilder.rs:566-567`, pinned at `Cargo.lock:2540`, and the measured
  landing site (`%USERPROFILE%`).
- `librarian/2026-09-09.desktop.md` §09:50 — the attic control: D's displaced roster, **5 panes,
  5 of 5 cwds present**; the arrived roster, **4, 0 of 4**. The proof that it is the migration and
  not drift.
- `loop/close_hold_and_roster_2026-09-09.md:19-59` — the chair's own file from this morning, which
  already carries the finding and the decision not to restore the roster into a live house.
- `handback/p-state-set_2026-09-09.md:202,206` and `state-manifest.json:21` — A's classification and
  its stated, unverified precondition.

**PRESCRIBED IN WORDS, IMPLEMENTED NOWHERE:** *"the file needs a rewrite-on-arrival, not a copy"*
(`state-manifest.json:21`). That sentence is the entire current design.

**AND THE ONE THE CHAIR SHOULD READ BEFORE RULING — `loop/packet_state_set_2026-09-09.md` §5.** The
packet that produced the manifest **anticipated this exact failure and offered the way out**:

> *"If a path cannot be honestly placed in any of the three columns, do not force it. A fourth state —
> undecided, and here is what would decide it — is a better deliverable than a manifest that reads
> complete and is wrong about one file."*

`panes.json` went into TRAVELS with the condition written as prose beside it. **The escape hatch was
built, offered, and not used for the one file that needed it** — and the reason is structural, not
careless: **the manifest has no way to express a conditional class, so a condition became a comment,
and a comment cannot fail.** Any fix that only patches `panes.json` leaves the manifest still unable
to say it. That is the finding under the finding, and it belongs in the ruling.

**NOT DECIDED ANYWHERE, and this is the real gap:** whether any *other* travelling file carries a
path that is **acted on** at the destination. I measured it this morning — **18 of the 47 travelling
files contain absolute Windows paths** (`board.jsonl` 4,944 hits, `sourced_ledger.jsonl` 730,
`resonance/atoms.jsonl` 462, six captures, `lap.jsonl`, `return_state/sibling-gate-test.json`,
`panes.json` 4, and others). **That count is not the alarm** — in a board row or a ledger a path is
testimony, and testimony about another machine is harmless. The alarm is the distinction nobody has
drawn: **which of those paths is READ AS AN INSTRUCTION on arrival.** `panes.json`'s `cwd` reaches
`cmd.cwd()` (`main.rs:954`). Nobody has checked the other seventeen. This is P-STATE-SET's own
warning one level down — not an unclassified *file*, an unclassified *field*.

### The chair's sealed prior, scored

Named: `state-manifest.json`, `state-sync.js`, `main.rs`, `one_house_two_machines_idea_2026-09-08.md`,
the attic roster. **Four of five are load-bearing** (the idea document contributes only its §-table
lumping `panes.json` into "the house's state", which is where the assumption entered).
**Missed: `loop/desktop_first_launch_2026-09-09.md` §0.7 and `loop/packet_state_set_2026-09-09.md` §5**
— the two files that already hold, respectively, the criterion and the permission-to-refuse. Both
were written in the last 36 hours by seats in this room.

---

## 2 · OWNERSHIP — the chair's specific worry, answered

**Do not split the contract. Put all of it at the INSTALL boundary, in A's lane.**

The contract is one sentence: *a travelling file may declare an arrival transform, and the installer
applies it before anything reads the file.* The decisive argument is not tidiness:

> **`--install` is callable directly, and is called directly** — by B's runbook step, by a shell, by
> a hook. If the repair lives in `sync_launch.rs`, then the installer lands a wrong file and only the
> *launcher* fixes it, so **every other caller of `--install` gets the broken roster** and the guard
> is on one path out of several. That is the `NOTHING_CHANGED`/`close.js` shape from A's own §4,
> repeated: a gate that exists and is not on the path.

So: **A owns `state-manifest.json` + `state-sync.js` (class, transform, `installTree`, the reconcile
counts). C's launcher does nothing new** — it reads a data dir that is already correct, and the
contract crosses no seat boundary. If answer **A** or **B** from §0 is chosen, C is not involved at
all, which is another reason to answer §0 first.

**Disjoint lanes, as they already stand this lap:** C → `main.rs` only. A → `state-sync.js`,
`state-manifest.json`, their tests and mutants. B → the runbook and the fixtures. E → adversarial,
writes no production file. **The one file two seats could collide on is `state-manifest.json`** (A
owns it; B authored the `panes.json` sentence in it, `D055-B-02`). Say once that it is A's this lap.

---

## 3 · THE PACKETS, IN ORDER

| # | packet | owner | gate |
|---|---|---|---|
| **D056-0** | **RULE §0 and §0.1** — what the arriving roster is for; `panes.json` and `letters.json` together. No code. | chair + keeper | **blocks everything below** |
| **D056-1** | Implement the ruling. If A: one word + a test that the roster never arrives. If B: the `machines/<tag>/` path. If C: the arrival-transform contract, and then D056-2 is mandatory. | A | after D056-0 |
| **D056-2** | **ADVERSARIAL, and only if the ruling is C.** Attack the transform before it is built: can it drop a row for a pane that is live? what does it do to a roster that arrives while the app holds panes open? does it make the failure louder or merely different? | **E — must not be A** | before D056-1 lands |
| **D056-3** | **The consumed-path audit.** For each of the 18 travelling files carrying absolute paths: is any of them read as an instruction at the destination, or is it all testimony? Bounded, mechanical, and it is where item **(c)** belongs — the four files `close.js --check` refuses over are the same defect (a path in no column), not a separate one. | A, or whoever holds `state-sync.js` next | parallel; no gate |
| **D056-4** | Restore D's roster from `attic/pre-sync-…/panes.json` — an operational act on a live house, needs the app quiet or the keeper's word. | keeper's call | after D056-0 |

**What must stay disjoint:** D056-1 and any `main.rs` work. D056-3 touches no production file and can
run beside anything. D056-2 must be written by a seat that wrote none of D056-1.

---

## 4 · THE QUEUE, SEQUENCED — and two of them do not belong in this lap

**IN, and (e) is first because it has a deadline nobody can move:**

- **(e) the fixture CR-strip step, into B's runbook AHEAD of the laptop's first git command — DO THIS
  FIRST.** Fixture 2 is **not recoverable** (7 bare LFs among 164) and **L's working tree is the sole
  source**; one `git pull` on Sunday destroys it. This is the only item in the whole queue with an
  irreversible loss on the other side of it. B owns the runbook. It also carries my registered
  falsifier: if L's copies are byte-identical to the blobs, my diagnosis is wrong and nobody
  re-captures — **one `wc -c` on L, before anything else.**
- **(a) + (b) as ONE packet to C** — the same file, the same commit. (a) is now sharper than when it
  was ruled: **C's fix made *missing* loud and left *empty* silent, so from today silence in that
  path means exactly one thing and no reader knows it.** (b) is one word, `git-blob`, at
  `main.rs:864`, and no new measurement.
- **(f) the contamination rule — contents or existence.** No code, no file, orthogonal to everything
  above, and adversarial by nature. It can run beside the roster ruling with zero collision. **It is
  also the more general form of §0's question** — *is a file's being-there evidence?* — which is
  worth noticing before both are answered separately.
- **(g) p-d012, three days unrung.** Not a packet: it needs a reader, and it should be a seat that
  did not write it. **Say the number out loud when assigning it — three days** — because an unrung
  hand-back is this room's registered failure mode, and unlike the DISAGREE row it carries no marker
  making it visible.

**OUT of this lap, and the reason is the same for both:**

- **(d) `sync-promotion.open`.** It turns on an arm of C's launcher that has never executed anywhere,
  which is a contract change — and D056-0/1 is *also* a contract change. **Two contract changes in
  one lap, in the same subsystem, and neither can be scored against the other's noise.** Queue it
  immediately behind, with A's endorsement already on the record.
- **(c) as a standalone.** Folded into D056-3 above. Worth one sentence to whoever takes it: one of
  those four files is `grep.exe.stackdump`, **a crash dump sitting in the data dir that nobody has
  chased** — that is its own small finding and should not be classified away silently.

---

## 5 · WHAT I DID NOT DO

Ruled nothing in §0 — it is the chair's with the keeper, and I have said which way I lean and why so
it can be argued with rather than deferred to. Did not restore the roster. Did not read `p-d012`, so
"three days unrung" is from the chair's own message and the file's mtime, not from its contents. The
18-file path count is a grep for absolute paths in the travelling set, **not** an audit of which are
consumed — that distinction is the packet, and stating the count without it would be exactly the
"46 of 47" error again (D055-M-01), which is why it is labelled here and not published as a finding.

---

## 6 · RULED — 2026-09-09 10:50, on the keeper's delegation ("just do the best solution")

**`panes.json` and `letters.json` are both STAYS. Answer A. No transform, no rewrite arm, no
`machines/<tag>/` copy.**

**And this reverses my own §0 recommendation of one hour ago.** I argued for B — travel the roster to
`machines/<tag>/panes.json` as a record of the other house. Forced to choose rather than to advise, B
is wrong: **it builds a record nothing reads.** Nothing in this codebase wants another machine's
roster, and shipping a consumer-less file is the abstraction the room's own rules forbid.

**Measured before ruling, not assumed.** Every reader of `panes.json` is `read_kept()`
(`main.rs:3320`), and every caller of that acts on **this machine's live panes**: the sweep's
keep-set (`:870`), `role_for_kept`, the resume paths (`:3142`, `:3180`, `:3295`, `:3658`), the
injection gate (`:7104`), the registry backfill (`:3542`). `letters.json` is the same shape —
`data_dir().join("letters.json")` (`:3347`), read to resolve *this* machine's mounts and names,
written at spawn (`:3477`). **There is no consumer of a foreign roster anywhere, so travelling it can
only overwrite correct local truth with foreign truth.** STAYS loses nothing that exists.

**The exact change, so A spends no time deciding it:**

1. `state-manifest.json:21` — `panes.json`: class `TRAVELS` → `STAYS`. Replace the `precondition`
   (which is `D055-B-02`, a check that passes and misses) with a `why`: *the roster names this
   machine's live panes and its cwds; every reader acts on local seats, and instance directories are
   minted per machine and live outside the manifest's root.*
2. Same for `letters.json` — it is pane-id-keyed so it arrives without a collision and then **renames
   this machine's seats** (measured: `0c0c0c0a` is `D` here and `A` in the other root). It is
   regenerated at spawn, so nothing is lost.
3. A test that the travelling set contains neither path, and that `--install` never writes
   `data/panes.json`. Red first against today's manifest.

**Still owed after the change, because the manifest does not un-break what already arrived:** D's
roster on disk is still L's. Restore `attic/pre-sync-2026-09-09T14-59-05-515Z/panes.json` **at the
next launch, before any pane spawns** — not now, with four of those seats live and open.

**Then the close, in this order:** manifest change → restore at next launch → `close.js` → `machines/D.json`
exists → the round trip is real in both directions for the first time. And the record repo is 22
commits ahead of origin; dev pushes at every commit, so that is overdue independently.

**What would reverse this ruling:** a reader that legitimately wants the other house's roster. If one
is ever written, the slot already exists (`machines/<tag>.json`, which `state-sync.js:337
machineHeads()` already reads) and this reopens with a consumer attached. **Not before.**

**What this does NOT decide:** the general contract — whether the manifest should be able to express
a conditional or transformed class at all. That question is real (`packet_state_set_2026-09-09.md` §5,
the fourth state that was offered and unused) and it is now **unblocked from any file**: no path needs
it today, so it can be designed when a second file needs it, with two cases instead of one.
