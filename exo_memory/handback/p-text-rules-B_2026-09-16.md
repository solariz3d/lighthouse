# P-NO-QUESTION-IN-LAP + P-NEXT-TRAILER · BRAVO — two rules into the chair's own brief, and the baseline before the gate

**B (pane `12fb81f6`), machine L, L062, 2026-09-16 ~06:5x.** Plan paragraph: `loop/plan_L062_loop_mechanics_2026-09-16.md` (e3a764e).
**One file edited: `consonance/src-tauri/brief/BUILDING.md`, +74 insertions, 0 deletions** — append-only, nothing
above any insertion point rewritten. No code. Nothing committed.

---

## 1 · WHICH FILE IS THE CHAIR'S OWN BRIEF — answered at source

**It is `consonance/src-tauri/brief/BUILDING.md`, and the packet's first guess (`brief/BOOT.md`) is half of the
answer.** Read at `consonance/src-tauri/src/main.rs`:

```
main.rs:6529  fn main_intake() -> String {            // the Main tab's shell, assembled at wake
main.rs:6532      "# The Main tab — the room, carried into Consonance\n\n…"
main.rs:6534      if let Ok(boot) = fs::read_to_string(room_master_path()) { s.push_str(&boot); }
main.rs:6542      if let Ok(building) = room_brief("BUILDING.md") { … s.push_str(&building); … }
```

So the chair wakes into exactly two documents: **the room master** (`room_master_path()` → `room_file()` → the
configurable room path, `main.rs:6494-6496`) and **BUILDING.md**. `COMMITTEE.md` is seated for *siblings*
(`main.rs:2864`) and `LIBRARIAN.md` for the librarian (`main.rs:7492`) — neither reaches the chair.

**Why both rules go into BUILDING.md rather than the room master:**
- The room master is shared by **every** seat. A chair-only procedural rule placed there is carried into every
  pane's shell — paying the shell-ceiling cost in four places to govern one.
- BUILDING.md is *"how a whole inquiry moves through the room"* (main.rs:6537-6538, its own seating comment), it is
  where both OWES lists already live, and it is in the chair's shell and nowhere else. **The rule about how a lap
  behaves belongs in the document that defines a lap.**
- The comment at that seating is itself the warning this packet repeats: BUILDING.md *"landed 5baf576 and read by
  NOTHING for its first hour: it sat in the bundle while no seat received it."* Landed is not shipped — which is why
  §4's last point is about the rebuild.

**Confirmed, as the packet asked:** the chair's memory file `no-questions-during-a-lap.md` is **not** the chair's
brief. It is under `C:\Users\zackn\.claude\projects\…\memory\`, outside the repo, on one machine, read by nothing at
wake. That is the carrier problem this room has recorded twice, and it is why the sentence now lives in a bundled
brief instead.

---

## 2 · WHAT LANDED, IN THE KEEPER'S WORDS

### (a) `BUILDING.md:650` — NO QUESTIONS TO THE USER INSIDE A LAP

Placed immediately after **WHEN THE LOOP APPLIES — chain vs freestyle** (`:545`), because the keeper's sentence
uses that section's own cut and would be ambiguous without it. It opens on the quote verbatim —
*"the orch shouldnt ask the user questions during a workchain loop lap however they still can when directly
interacting with the user"* — then states the cut (inside a chain, no; in the freestyle half, freely), then **why
it is a rule and not a manner**: a question mid-lap converts a running lap into a stall whose only exit is one
human, and the room is built to run through the hours when that human is asleep or at work.

The three allowed moves, as the packet specified them, in this order:

1. **RULE FROM THE RECORD** — cite `path:line` and proceed; usually the answer is already on disk.
2. **FILE IT ON THE ASK CHANNEL AND CONTINUE THE REVERSIBLE PARTS** — a lap that returns with three rows landed
   and one question filed is a lap that ran.
3. **PARK THE ROW AND SAY SO** — *"A parked row that is named is a result. A lap silently waiting is not."*

With a registered falsifier, in this document's own habit: if a lap after this date is found stalled on a question
put mid-chain and the return does not name it as parked, the rule is prose and belongs in the verb.

### (b) `BUILDING.md:197` — WHAT A DISPATCH OWES, item 6

The trailer, the keeper's words (*"each seat tells the next where to hand it to remind it"*), the shape
`NEXT: <station> <command> when <condition>`, and the reason it is a trailer rather than another banner — **the
stall line printed 345 times and the ferry reminder 167 times with nobody acting.** The sentence I put under it,
because it is the whole of his diagnosis: *a reminder that prints every turn is wallpaper; the same sentence in the
hand-off fires once, at the moment it is the next thing to do.*

### (c) `BUILDING.md:407` — WHAT A HAND-BACK OWES, item 6

The same trailer on the **ring**, with the baseline from §3 written into the brief so it can be checked rather than
claimed. It states explicitly that the trailer does not restate the finding — item 4's pointer rule still governs
everything above it.

---

## 3 · THE MEASUREMENT — compliance BEFORE any gate exists

Universe printed, not just the hits. Script: `scratchpad/trailer_baseline.js`, over
`C:\Consonance\data\board.jsonl` (31,001 rows), window **since 2026-09-16 05:27 local** (11:27Z), deduped on
`(pane, text)` the way `boundary-check.js` does because the board replays transcripts. A message counts as carrying
the trailer when its **last non-empty line** matches `/^NEXT:/i`.

```
$ node scratchpad/trailer_baseline.js
board rows total 30746 · since 2026-09-16T11:27:00.000Z deduped 232

  ring (pane->lib)       0 /   9
  ring (lib->chair)      0 /   9
  dispatch               7 /   9
  TOTAL                  7 /  27
```

**By speaker, and I am counting myself rather than sparing myself as instructed:**

| speaker | trailer / messages |
|---|---|
| chair | **7 / 9** |
| librarian | 0 / 9 |
| pane A | 0 / 3 |
| **pane B (me)** | **0 / 3** |
| pane C | 0 / 1 |
| pane E | 0 / 2 |

**And the hand-back files themselves: 0 of 7** written in the same window end with a `NEXT:` line
(`p-boundary-fixes-E`, `p-harness-revision-A`, `p-boundary-read-B`, `p-harness-read-B`, `t2-echo`,
`p-ferry-tests-B`, `p-blind-rows-C`).

**Three things in that table are worth more than the headline:**

1. **Every one of the seven is the chair's**, and five of them are the L062 dispatch burst at 12:40Z — the chair
   started doing it the moment the keeper said it. The two chair dispatches without a trailer (11:38:49, 11:54:08)
   were both to me.
2. **The return legs are at zero in both directions** — panes 0/9 and the librarian 0/9. The trailer is missing
   exactly where the room has been losing hand-offs, which is the return leg, not the outbound one.
3. **I rang three times and carried it zero times**, including twice after reading packets that carried it. That is
   the honest shape of the problem: the rule was visible in the message I was answering and I still did not mirror
   it, which is precisely the argument for a gate rather than a habit.

---

## 4 · THE GATE, DESIGNED (not built — no code this lap)

**The rule:** `chair_inject`, `call_librarian` and `call_chair` refuse a message whose **last non-empty line** is
not a `NEXT:` trailer, and the refusal is posted to the board like any other.

**Where it goes, so it is testable without Windows or a live pane:** a pure function beside the other pure guards —

```rust
// sync_launch.rs
pub fn next_trailer(text: &str) -> Result<(), String>
```

— called from the three verb bodies in `main.rs`. The precedent is `keep_awake_transition` (sync_launch.rs:1242):
the decision is pure and unit-tested, and only the plumbing lives in `main.rs`.

**What it checks, and deliberately no more:** the last non-empty line matches `^NEXT:\s+\S+(\s+\S+){2,}` — the
marker, then at least three words. **It does not parse `<station> <command> when <condition>`.** That grammar is
guidance in BUILDING.md and must stay there: a gate that requires the literal word *when* teaches seats to write
`when done`, and a trailer written to satisfy a parser is worth nothing to the seat receiving it. **Pin the shape
that can be checked; leave the meaning to the prose.** *(This is the one design call I would most expect to be
argued with, so it is stated as a call rather than as a fact.)*

**What the refusal must do, because a refusal here is expensive:**
- **Return the message intact in the error**, or name where it is held. A seat that composed a long dispatch and
  had it rejected must not have to rebuild it — that cost is how a gate gets worked around.
- **Print the required shape and one example**, in the error itself.
- **Post the refusal to the board**, as every other verb refusal is.

**Exemptions, named in advance rather than discovered:**
- **A refusal or an error reply is exempt.** Requiring a trailer on the message that says *you forgot the trailer*
  is a loop.
- **Nothing else.** In particular the librarian's return to the chair is not exempt: its next station is the chair
  closing or re-dispatching the lap, and that is expressible in one line. **0 of 9 of those carried one tonight**,
  which is the strongest argument that the return leg is where this is needed.

**Red-first tests the build should carry:**
1. each of the three verbs refuses a message with no trailer;
2. each accepts one whose last line is a trailer;
3. a message containing `NEXT:` in the middle but not last is **refused** — this is the shape test, and it is the
   one that separates a real gate from a substring search;
4. `NEXT:` alone, or `NEXT: done`, is refused (the three-word floor);
5. the refusal text contains the required shape and does not discard the message;
6. CONTROL: rewording an unrelated comment leaves every assertion green.

**The rollout order, and this comes straight out of §3.** On tonight's traffic the gate would have refused
**20 of 27 messages, including 18 of 18 rings.** So it must not land in the same breath as the rule: **the brief
text lands tonight, the gate lands next lap**, so every seat wakes carrying the rule before a verb starts enforcing
it. Landing both at once would make the room's first experience of the trailer a wall of refusals, and the thing
that gets blamed is the gate.

---

## 5 · WHAT I DID NOT VERIFY

1. **No rebuild, so no seat has actually woken into either rule yet.** BUILDING.md is a **bundled resource**
   (`tauri.conf.json` → `"brief/BUILDING.md": "BUILDING.md"`), and `main_intake()` reads it through `room_brief()`.
   Whether the running exe serves the edited file or the copy inside the last build is **not established here**,
   and it is the landed-is-not-shipped hazard the seating comment at `main.rs:6537-6541` is itself about. **Someone
   should confirm the chair's next wake carries §650 before this is called done.**
2. **I did not read the chair's memory file** `no-questions-during-a-lap.md` — I established it is outside the repo
   and not seated, which is all my ruling needed. Its *content* may say more than the keeper's sentence does, and
   nothing here merges it.
3. **The 345 and 167 counts are the packet's, quoted in the brief as the keeper's diagnosis.** I did not re-derive
   either.
4. **The window is one night on one machine.** 05:27→06:45 local, on L, board-local. No claim about D, and no claim
   about any night but this one.
5. **`ts_source` is `transcript` for most rows** — the board mirrors transcripts, so a message that never rendered
   in a receiving pane is not in my denominator. The dedup mirrors `boundary-check.js`, so it inherits whatever
   that rule gets wrong.
6. **I did not measure the chair's messages to the *human*** — only seat-to-seat traffic carrying a `[chair:`,
   `[pane:` or `[librarian:` stamp. A question put to the keeper mid-lap would not appear in this count, which
   means **§2(a)'s rule has no baseline** and its falsifier is the only instrument on it.
7. **No code, no gate, no tests written.** §4 is a design.

---

## 6 · WRONG (mine)

- **W1. I was about to put the no-questions rule in the room master** (`BOOT.md`), on the reasoning that it is "the
  chair's shell". It is — and it is every other seat's too. `main_intake()` (main.rs:6529-6546) shows the chair's
  shell is BOOT **plus** BUILDING, and only the second is chair-only. **Class: reading "the chair's brief" as one
  file before checking how the shell is assembled** — the exact thing the packet told me to find rather than guess,
  and I nearly guessed.
- **W2. My first gate sketch parsed the full `<station> <command> when <condition>` grammar.** Writing the test
  list is what killed it: every test I could write for the `when` clause was satisfiable by `when done`. A gate
  that can be satisfied by a word is a gate that teaches the word. **Class: checking the form of the rule instead
  of the part of it that can actually be enforced.**

---

## 7 · THE ONE LINE

**Both rules now live in the one document the chair wakes into and no other seat does — and the honest baseline
they have to move is 7 of 27, with the return leg at zero in both directions and my own three rings among the
misses.**

NEXT: librarian call_librarian with this path when this hand-back is written, then the chair lands
`consonance/src-tauri/brief/BUILDING.md` and confirms the next chair wake carries §650.
