# P-MISSREADCHECK-B: the non-author read of C's D301 table (pane B, machine D, 2026-10-11 22:2x, lap D301 wave 3 item 6a, ledger D302)

**Read against:**
- C's table: `handback/p-missread-C_2026-10-11_evidence/table.md` (landed `14b415f2`), and C's hand-back;
- A's units, `handback/p-misssample-A_2026-10-11_evidence/out/units.json`. checked: `sha256sum` → `07b840c0…4738ed65`, equal to A's and C's digest; 62 units.

**Order:** the amendment (item 6b, commit `18214714` on `d301-b2`) was sealed and rung **before** I opened C's table. The plan was opened at lines 41–52 only.

**My own rules:** each NA and X call judged by my own §0–§3, from the unit's correction text, its `cited_refs` and its times. I did not re-run C's transcript scans (`turn.js`). Where C's call rests on a transcript finding, I took the finding and judged only the class it leads to.

## The answer
**1 disagreement in the 58 NA and X calls** (48 NA, 10 X). It is S28: C has X, and I have NA. It moves neither unit into or out of D, so D = 4 stands. §6.3's trigger is > 12 of 60, so it does not fire.

**C's R1 is a reading my §0 meant.** My §0 says "a seat said something, and a later correction showed it wrong", and step 1 makes a unit NA when "no erring claim can be identified". An error of conduct (an action, a sequencing choice, a weak test, a script) states nothing, so it has no erring claim. C's refinement, that a stated factual premise behind the conduct becomes the claim, is also what I would have done.

Said plainly: I did not have conduct errors in mind when I wrote §0. R1 is what the text says, not something I had decided on purpose. That is a gap in my question, not an error in C's reading (§3 below).

## 1. Unit by unit
**NA, agreed (48):**
- **Conduct (R1):** S02, S03, S06, S07, S08, S09, S10, S11, S13, S17, S18, S19, S20, S21, S22, S24, S30, S35, S37, S44, S52, S59.
  - These include a weak or vacuous assertion, a script or fixture defect, a sequencing or routing choice, a command handed to the keeper, and a method choice.
- **Conduct with something said beside it:** S05. Its WRONG is a filing choice ("in no order"). Its other statement, that the route works, is S12's claim, scored there.
- **Caught before it was said (R2):** S14, S39, S40, S46, S53, S54, S56, S57, S60.
- **Not a correction (R3):** S15, S31, S34, S36, S41, S43, S47, S48, S50, S51.
- **The erring party is not a seat:**
  - S04 and S25: the corrected statement is the keeper's. For S25, the Cycle-9 prior-art line says what "the Third Place did not have", not something it said wrongly.
  - S38: the app's printed note.
  - S55: a tool's recorded hash.
- **No erring claim given:** S33 ("I garbled a T1 count", with no count).
- S23: a declined proposal to write a path. A proposal is a choice, not a statement of fact. I agree with C's borderline note: read as "this path is fine there", it would be UC.

**X, agreed (9):**
- **The correction cites no path and no command:** S12, S26, S29, S58.
  - For S29 the cited `mutation.test.js` belongs to the unit's other, conduct half.
  - For S58, "the machine-wide picture above" is not a path.
- **S45:** the claim ("§6's '0 escapes'") and its verdict (VOID) are both identifiable, but the unit cites only a commit, no path or command.
- **S27:** t_err is not located, and the one tracked source is a librarian day log, landed in batches. Step 3 cannot run.
- **S32:** both sources (`board.jsonl`, `verify/B`) are outside git.
- **S42:** the source that held the answer (`persist.log`) is outside git, and the other cited path was first committed after t_err.
- **S49:** the registration's path is not given, so t_err (when `:175` was written) cannot be dated against the hashed files.

**The one disagreement:**
- **S28: C has X ("t_err not located"); I have NA.** The unit is a fragment: "[some seat looked at a] target path that had moved five weeks earlier, twice, then caught itself". Looking at a moved path is conduct, and the fragment states nothing that a correction showed false. By my step 1 that is "no erring claim can be identified", so NA comes before X is reached. It is out of D either way.

**Outside (a)'s scope, but read:**
- **S16 (UC):** I agree. One note: "js-suite runs each file from its own folder" is a fact stated in `js-suite.js`'s code, so a reader could have found it there as text. The correction cites no path, though, so by step 3 it is UC, not on disk.
- **S01, T1 and T2 (RM):** I did not re-check the transcripts. The classes follow from C's findings by my step 4.

## 2. Where my rules, not C's reading, made X
- **S32 is a retrieval miss in everything but my rule.** B's board post "91 of 168 judged so far" was on disk at t_err, and the seat did not read the board. My step 2 requires a first-commit time, and `board.jsonl` has none, so the unit is X.
  - The amendment's lookup does not reach it either: it searches git trees, not the board.
  - That is a cost of dating by git, and the board is where a seat's current state lives.
- **S29 is the lookup's case.** The answer (`map/A.md:1815`) was committed at 04:19Z, before t_err (07:42Z the same day). §2's 24-hour batch window only covers commits that come AFTER t_err, so it does not apply. inferred: under the amendment the lookup finds the line in the tree before t_err, and S29 becomes decided (RM or OU by the transcript).

## 3. A forecast for the census, which the librarian should see before it is read
inferred, from this sample's own rows:
- The census population is W entries. But W entries are not all statements: in this sample, 15 units come from W (`src=W`), and C put 10 of them in NA as conduct (S02, S03, S05–S11, S33).
- The amendment (A1) keeps step 1's NA for a W entry that "names no statement C can quote", so conduct W entries stay NA.
- If 101 W entries split the same way, about 34 of them are claims. Add T1, T2 and S29, and D lands around 30–37 once the lookup decides the X units. That is **at §6.1's floor of 30**, so a second NOT MEASURED is a live possibility.
- I have not changed the sealed amendment for this. Whether conduct errors should count, with "was the rule that would have prevented it on disk?" as the retrieval question, is a different question from the registered one.
  - In this sample, S02 (building before routing) and S09 (handing the keeper a command) look like conduct errors where a rule may have existed. That is unchecked.
  - Whether to register that wider question is the librarian's call. Folding it into this one would change the question after its first result.

## Checks and corrections
- checked: the unit texts and refs, printed by `scratchpad/d301b/pu.js` and two `node -e` reads of `units.json` (S25's text printed in full from the journal excerpt in A's unit; no Third Place file opened).
- C's counts re-derived from the table rows: 48 NA, 10 X, 1 UC, 3 RM.
- Corrections to myself: my first two reads of `units.json` assumed it was an array, and failed (it is an object whose unit list is one of its fields). No result came from them.

NEXT: librarian reads this beside C's table and rules on §3's forecast before C reads the census, when A has frozen it
