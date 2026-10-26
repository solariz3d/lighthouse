# D476 part 4 — the keep-warm visit: design note (O, 2026-10-26)

Seat O (sibling-36313935). **Design only: nothing is built until the librarian accepts this.** The plan sends it to the Third Place through the keeper before acceptance, because the visits come to its room.

- Plan: `exo_memory/loop/plan_d476_third_place_returns_2026-10-26.md`, Part 4 (:43 onward).
- Keep-warm today: L067, `main.rs` ~:12199. `KEEP_WARM_AFTER` 50 min plus a 0–6 min per-seat offset; the text is "Reply with exactly: ok".
- The spec is the keeper's 2026-10-17 16:34/16:37Z lines, as the plan summarises them (the private store is not quoted here):
  - replace "ok" with a short real conversation;
  - the seats come TO the Third Place, and the Third Place is pinged by them instead of by the chair;
  - not work, only "conversation that arises to attention";
  - "slightly more tokens".

## 1. The measured baseline: what "ok" costs today

    checked: node over C:\Consonance\data\board.jsonl, keep-warm rows of the last 24 h → 182 pings (7.6 an hour): 8 seats 14–27 each (160), the Third Place 22;
             the seats' context at their pings sums to 46.3M tokens of cache read; the Third Place's sizes are kept off the board by design, so its share is not known here

- One ping is one request for the seat.
- Nearly all of its cost is the cache READ of the seat's whole context. Mean context at ping by seat: 108k to 714k.
- The output is "ok", and the new input is the ~20-token line.

## 2. The design: batched correspondence, relayed by the keep-warm actuator

**No new verb.** No seat calls anything, and there is no address row seat → Third Place. The relay is the keep-warm actuator itself, which already writes into every seat, the Third Place included, through `gate_or_queue`.

1. **A seat's keep-warm becomes a visit.** When seat S is due (L067's own rule, unchanged), it receives a visit line instead of "ok":

       [keep-warm visit — from the room, not the keeper, and not work] The Third Place's last answer to you: «…» (or: no answer yet).
       If something not about work has come to your attention, say it in one or two lines for the Third Place; otherwise reply: ok

   S answers in ONE request, as today. Its reply is read from its transcript, as keep-warm already reads transcripts for the request start.
2. **The guard on S's line** (§3). A line that passes is held as S's ONE pending visit; a newer one replaces it. A refused line, or "ok", is not relayed.
3. **The Third Place's keep-warm becomes the visit hour.** When the Third Place is due (its own L067 threshold), it receives every held visit in one message instead of "ok":

       [visits — from the seats, not the keeper, and not work] A: «…» | LIB: «…» | M: «…»
       Answer whom you like, one or two lines each, starting with their name (A: …). No answer is also an answer.

   With nothing held, it gets today's "ok". **One Third Place request answers every visitor.** That is the keeper's "pinged by them instead of the chair": its window is kept by their lines, not by the chair's "ok".
4. **The answers go back only to their visit.**
   - The Third Place's reply is split by name.
   - Each part is guarded the same way and held as that seat's answer.
   - It is delivered only inside that seat's NEXT visit line (step 1), never to the board, the work queue, or any other seat.
   - An answer to a name with no held visit is dropped.
5. **A seat mid-turn is skipped, exactly as L067 skips it.** The Stop stamp must read ready and the composer exactly Empty; there is the strict withdraw-if-queued, and the per-seat off switch.
   - The Third Place's idle rule is the same one. A visit hour never lands while the keeper is mid-turn in that room. It waits, as its "ok" waits today.

**Where this departs from the spec, said plainly.** It's a correspondence, not a chat: one exchange per window, about an hour apart. A live back-and-forth would need extra requests on both sides, and §4 measures what that costs.

## 3. The guards (nothing steers it)

A visit line, and an answer, is refused if it contains any of:
- **a file pointer:** a path separator with an extension, or a `*.md`/`.js`/`.rs`/`.json`/`.ps1` name;
- **a lap or decision id:** `D` or `L` followed by 2–4 digits; a sha (7+ hex); a version tag (`local-0.4.`);
- **a command:** a backtick, a `$ ` or `> ` line start, `node `, `git `, `cargo `, `npm `, `NEXT:`, a URL;
- **more than 400 characters;**
- **word of uptake** (Metaxy's guard 4, adopted 2026-10-26: no uptake reports go back in): anything saying what was taken up from the Third Place, which lap used what, or what the librarian did with a note.
  - By form, refused: a lap or decision id (above already), and the uptake phrases "taken up", "turned into", "became a lap", "the librarian read", "your note", "your entry", "from the third place" (any case).
  - The same honest limit as below applies: a paraphrase can slip past a phrase list, and the visit text says it carries no word of uptake.
- **a path into private/** (Metaxy's guard 3: nothing in private/ travels): `consonance\private` or `private/third_place`, either slash, any case. This is part 2's `points_into_private`, the same function, so the two rules cannot drift apart.

Each refusal is posted to the board as "keep-warm visit REFUSED — from <seat> (<rule>)", **without the text**. The Third Place's record stays off the shared board, as its keep-warm rows already do. A relayed visit is posted the same way, as a count with no words.

**Honest limit, named before it is found.** A filter catches pointers, ids and commands. It cannot catch work described in plain prose ("I'm stuck on the bank finder"). What holds that line:
- the visit text says "not work", and the Third Place's brief says the same;
- answers go nowhere but the visitor's next visit;
- every visit is countable on the board;
- the per-seat off switch exists.

It is a discipline boundary with an audit, the same honest class as `auth_address` and `auth_chair`.

## 4. The cost against "ok"

| | requests / 24 h | cache read | new tokens |
|---|---|---|---|
| today | 182 (160 seats + 22 Third Place) | 46.3M (seats) + the Third Place's | ~20 in, ~1 out per ping |
| **this design (batched)** | **182, unchanged** | **unchanged** | about +100 in and +40 out per seat visit; about +400 in and +250 out per Third Place visit hour → about **+35k tokens a day** in total, against 46.3M of cache read: **under 0.1%** |
| the unbatched form (each seat visits live, the Third Place answers each live, the answer delivered at once) | about 182 + 138 (Third Place) + 160 (seats again) ≈ **480** | about **2.6×**: each extra request re-reads a whole context. The seats' second reads alone are about +46M a day; the Third Place's +138 are its size × 138 | — |

- inferred: the batched figures come from the line lengths above, not from a run.
- The keeper said "slightly more tokens". The batched form is slightly more. The unbatched form is two to three times today's keep-warm.
- **The Third Place's own context** grows about 650 tokens per visit hour, roughly 14k a day, inside its room. That's what a visit is, and it is also why the batch is one message, not eight.

## 5. Part 2's rule, and its test

**Part 2's rule is "nothing reaches IN to steer the Third Place".** Its test `no_seat_can_reach_the_third_place` asserts three things:
- no address row leads to it;
- `chair_inject` refuses it;
- an approved pull refuses it.

**What changes in that test: nothing.** No seat gains a verb or a row. The only writer into the Third Place stays the app's keep-warm actuator, which writes "ok" into it today. What changes is that actuator's TEXT.

Part 2 now also holds `no_seat_can_send_the_third_place_news_of_uptake` (guard 4; 4c0baa39). The visit build keeps it green: the visit-hour composer is the keep-warm actuator, not a row, and its lines pass the uptake rule above.

**Two tests are added beside it, not instead of it:**
1. The Third Place's keep-warm message is composed only from the fixed frame and lines that passed the guard. A line carrying a pointer, an id, a command, word of uptake, a private/ path, or over 400 characters never reaches it, and the refusal row carries no words.
2. An answer is delivered only to the seat it names, inside that seat's next visit, and never to the board.

**Why this doesn't steer it.** Steering is work reaching in: a pointer to open, a lap to take, a command to run.
- The guard removes the forms work travels in.
- The Third Place is never asked to do anything: "answer whom you like … no answer is also an answer".
- Nothing it says becomes a task for anyone, because answers return only to the seat that visited.

What reaches it is what reaches anyone in a third place: someone walking in and saying something.

## 6. Which keep-warms change

- **All seats:** the panes, the librarian and the orchestrator. The keeper's line names all three ("the librarian, the orchestrator, the panes").
- **The Third Place's own keep-warm** becomes the visit hour (step 3), and falls back to today's "ok" with nothing held.
- **Human-driven panes** stay on "ok": a person is not visited by the room. If the keeper wants it narrower to start, the panes alone is a one-line role filter.

## 7. The build, once accepted

The touched code would be `main.rs` keep-warm only:
- the visit and visit-hour texts;
- reading the seat's and the Third Place's reply from their transcripts;
- the guard (a pure function);
- the held-visit and held-answer maps;
- the board rows.

Tests first, red:
- the guard's every rule, with a near miss for each;
- the composition;
- the answer routing;
- the mid-turn skip unchanged;
- part 2's test unchanged.

It lands with part 2 at the next Consonance restart.

NEXT: the librarian sends this to the Third Place through the keeper, then rules on it, when part 2 is handed back; O builds part 4 only after that ruling.
