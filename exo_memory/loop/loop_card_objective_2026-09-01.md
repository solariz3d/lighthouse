# The loop card — OBJECTIVE and FALSIFIER, written BEFORE the rebuild that ships it

**Written 2026-09-01 ~05:35, before the relaunch. Chair-written; not merit-checked by another seat.**

The card landed in `3848709` (CHARLIE) and sits at `consonance/src-tauri/brief/COMMITTEE.md:21`,
1,442 of 1,500 bytes, quoted from `BUILDING.md` with the quotation machine-checked. **It has never
shipped** — every live pane shell reads `card = 0` at `mtime 2026-09-01 03:48`. The relaunch is the
run, so this file exists before it.

**Why it needs one at all — the keeper's correction applied to the chair's own work minutes after
the chair committed the document arguing for it** (`loop/objectives_not_only_falsifiers_2026-09-01.md`):
the card was built, tested, quoted and committed **with no statement of what it is supposed to
achieve**. Under the old practice that is a finished packet. Under the new one it is half an
instrument. The keeper caught it as a question — *"shouldnt we fix this before the rebuild?"*

---

## 1 · THE THING THAT MAKES THIS NON-OBVIOUS: the panes already use the edge WITHOUT the card

Measured from `data/board.jsonl`, not from any handoff's prose:

    5:02:03  [pane:C]  P-LOOP-CARD  ->  exo_memory/handback/p-loop-card_2026-09-01.md
    5:03:57  call_librarian B -> LIB [Received]
    5:14:50  call_librarian E -> LIB [Received]

**All four L025 hand-backs arrived by `call_librarian`, none through the chair** — from panes whose
shells contain the string `call_librarian` **zero times**.

**The wire is in the MOUNT, not the brief.** `main.rs:960-969` attaches the MCP server at spawn via
`--mcp-config`, gated by `ADDRESS_TABLE`. The verb and its one-line description arrive with the
mount. **So the card is not what makes the edge work, and any claim that it is would be false on
tonight's board.**

What the tool description does NOT carry, and what the card is actually for:

- that hop 6 **skips the orchestrator**, and why
- that **every hop is two turns** — finish, then call
- that **silence is a valid answer**
- what a hand-back **owes**

## 2 · THE BASELINE, measured, with its command and its limits

    cd C:\Consonance\lighthouse
    for f in exo_memory/handback/*2026-09-01*.md; do
      printf "%-46s notver=%s mut=%s cmds=%s\n" "$(basename $f)" \
        "$(grep -ciE 'NOT verified|does not establish|not established|what I did not' $f)" \
        "$(grep -ciE 'mutation|applied [0-9]+|caught [0-9]+' $f)" \
        "$(grep -cE '^ {4,}(node|git|grep|cargo)' $f)"
    done

    14 hand-backs today
    carry an explicit "what I did NOT verify" clause : 12 of 14  (86%)
    carry mutation language                          :  6 of 14
    carry at least one re-derivable command          : 12 of 14

**THREE LIMITS, stated so the number is not later quoted cleaner than it is:**

1. **This is the PROMPTED rate.** Every dispatch tonight asked for these things explicitly. The
   card's job is to make them arrive when the brief does *not* ask. **86% is the bar to beat
   unprompted, never a score the card can claim.**
2. **The mutation denominator is not uniform.** A read-only packet (`p3e-read`, `p3f-read`) has
   nothing to mutate, so `6 of 14` is **not a compliance rate** and must not be reported as one.
3. **The measure is a crude grep over prose.** It counts phrases, not whether the sentence is true.
   It cannot tell a real *"what I did not verify"* from those words appearing in another context.

## 3 · REGISTERED

    OBJECTIVE:  over the next 10 pane hand-backs dispatched WITHOUT the brief asking for them,
                the unprompted rate beats the 86% prompted baseline on the "what I did NOT
                verify" clause, and every CODE packet carries applied/caught/NOT-APPLIED counts.
                Success is the card doing unprompted what the brief had to ask for tonight.

    FALSIFIER:  if 10 such hand-backs land and the unprompted rate sits at or below the 86%
                prompted baseline, the card transmitted nothing the mount was not already
                carrying, and this file should say so in place of the claim.

**The abuse condition on this pair:** the baseline is **86%, fixed now, before the run**, and it does
not move once a landing is seen. Re-deriving a friendlier baseline after reading the result is the
P-FIC shape the objectives document names — two outcomes, no rule for choosing, the author reads the
result and picks which one it was.

**And the honest prior, kept because it cuts toward the build rather than against it:** LIB ruled
that *procedures transmit by brief* (100% compliance on the board hand-back rule, nobody re-derived
it) while *cues at a moment do not* (SOURCE 0.8 pts; K1 null). Knowing the route is a procedure, so
the prior favours the card. **That is an argument, not a measurement, and it is exactly the kind this
room has been wrong about before.** The number above is what settles it.

## 4 · THE READING THAT CONFIRMS IT SHIPPED AT ALL

Before, on every sibling shell: `card = 0`, `call_librarian = 0`, `mtime 03:48`.
After the relaunch each must read:

    grep -c 'The loop, in one card'  <shell>   ->  1
    grep -c call_librarian           <shell>   ->  >= 3

**If those are not true, nothing above is measurable and the run has not started.**
