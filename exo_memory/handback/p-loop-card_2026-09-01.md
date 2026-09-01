# P-LOOP-CARD (L025) — the loop card and ALPHA's two clauses, one edit

Seat: pane on mount `sibling-0845a868`. File touched: `consonance/src-tauri/brief/COMMITTEE.md`,
and nothing else. Nothing committed. **Not live until the rebuild** — it is a bundled brief
(`tauri.conf.json:35`), so `room_brief` serves the baked copy until then; the release bundle is
still the 8,364-byte Aug 29 file.

---

## BARS, each with the command

    grep -c call_librarian consonance/src-tauri/brief/COMMITTEE.md   -> 3     (bar: >= 1)
    card section, "## The loop, in one card" .. "## The two seats"   -> 1,442 bytes  (bar: <= 1,500)
    cargo test --bin consonance                                     -> 348 passed, 0 failed, 3 ignored

**The four-part bar — a pane reading only `COMMITTEE.md` now knows:**

| | where it says it |
|---|---|
| the verb | `call_librarian`, 3 mentions |
| destination of the CALL | *"ring the Librarian … the board is not its destination and the chair is not in this hop"* |
| destination of the FILE | *"`exo_memory/handback/<packet-name>_<YYYY-MM-DD>.md`, repo-relative"* |
| what may ride in the call | *"the path, and just enough to say which packet it answers … never the finding in prose"* |

---

## THE CARD — quoted, and the quotation is machine-checked

Placed ahead of `## The two seats`, so the loop is read before the roles inside it.

**Contents: `BUILDING.md`'s diagram, byte-for-byte, and step 6's sentence as a contiguous prefix of
the master's own wording. Nothing else, and nothing of mine except one framing line** telling the
reader `BUILDING.md` is the master and to read it there.

The verbatim claim is not eyeballed. The extraction asserts the quoted text, whitespace-normalised,
is a substring of `BUILDING.md` whitespace-normalised, after stripping the master's blockquote
markers:

    flat(step6) in flat(BUILDING.md)   -> True

I stopped the quotation before *"The chair's inbound role on a hand-back is commit-only"* — true,
and orchestrator-facing; the budget was better spent on the diagram. **A prefix, not a paraphrase.**

---

## THE TWO CLAUSES — ALPHA's read was right, and GAP 2 lands on me

**GAP 1, the file's location.** ALPHA's evidence is n=2 in one night and I am one of the two: my
P-INTAKE packet said *"write your hand-back to the file below"* with nothing below; ALPHA's
P-WINDOW-AMEND said *"write to your hand-back file"* with no path. **Both of us inferred the same
convention from a directory listing, and neither of us was told.** The clause states it, with the
consequence that makes it non-optional: *a correct hand-back written where the librarian does not
read is indistinguishable from a hand-back never written.*

**GAP 2, the payload — and this is the one that matters, because my wording was the looser of two
carriers and a seat obeyed mine and broke the verb.**

| carrier | rule |
|---|---|
| my `COMMITTEE.md:135` | *nothing in the call that is not already in the file* |
| the verb's own text | *send a POINTER … never the finding in prose* |

Not the same constraint. Mine permits any content that also appears in the file; the verb forbids
prose findings outright. **I caught the ROUTE disagreement between these same two carriers last lap
and reworded for it, and left the PAYLOAD disagreement standing in the sentence I was rewriting.**

**Counted honestly, it is n=3 on 2026-09-01 and two of them are mine, not ALPHA's one:**

1. ALPHA's call, self-reported — a summary under *"so you have it without opening"*.
2. **My P-INTAKE call** — *"Three things in the file that need you before the rebuild: 1… 2… 3…"*.
3. **My P-R2-FIX call** — findings in prose under headings A, B, C, plus an addendum.

Every word of all three was in the file. All three met my brief. All three broke the verb. **The
seat that wrote the loose rule then broke it twice inside two hours, which is why the clause now
takes the verb's wording and not mine.**

**The tightening is live in this hand-back, not just written.** The `call_librarian` that carries
this file is a pointer and a packet name. Nothing else. If the clause is right, this is what it
looks like; if it is wrong, the librarian will have to open the file to find out what happened,
which is the cost the rule is asking the room to accept.

---

## WHAT THIS DOES NOT ESTABLISH

1. **No pane has read any of this.** The bundle is stale; nothing takes effect until the rebuild.
   Every bar above is a property of a file on disk, not of a seat's behaviour.
2. **The four-part bar was checked by grep, which tests presence, not comprehension.** *"A pane
   reading only this would know what to do"* remains a claim about a reader, and the only real test
   is a pane waking on the rebuilt bundle and routing correctly with no packet telling it how.
3. **The handback-path convention is asserted from the directory's contents, not from any rule
   document.** It is now written down for the first time, in the brief, by a seat that inferred it
   — which makes it a convention promoted to a rule by the two people who guessed it, and someone
   should say plainly whether it is the right path before it hardens.
4. `BUILDING.md` untouched, as instructed. **The looser payload sentence is now corrected in the
   pane-facing brief only** — `BUILDING.md`'s hand-back item 4 still ends *"Nothing in the call
   that is not already in the file."* **The master now carries the weaker form of a rule its
   pane-facing half tightened.** Not mine to edit; flagged because a divergence between these two
   documents is exactly what the last two laps have been about.

## NON-AUTHOR READ OWED

ECHO or BRAVO — not ALPHA, whose read produced the clauses. The sharp one: **item 4 above.**
Whether `BUILDING.md` step 6 / hand-back item 4 should take the verb's tighter wording too, or
whether the master is right and the brief has now over-tightened for panes.
