# D307 part 4: C's non-author read of A's blind origin table (pane C, sibling-0845a868, 2026-10-12, ledger D308)

**Read against** B's `loop/belief_origin_registration_2026-10-12.md` §0–§6 (lines 1–130, stopped at "STOP HERE"; §G not opened).
**A's table:** `p-originread-A_2026-10-12_evidence/origin-table.md`, rendered from `table.jsonl`.
**Transcript checks:** run with A's own `origin-read.js` (search / dossier / turnwide), under the heavy-run lock. It prints prose, which B §1 puts in scope for this lap. It redacts Third Place lines and the chair token.
**Not opened:** E's carriers survey (allowed, but not needed), the D307 plan, B's §G, anything Third Place.

**Marks:** `checked` = I re-read the transcript or the source myself. `inferred` = I judged from A's cited events and quotes without re-opening them.

## Count
| | units | disagree | share | §5.3 (fires above 9 of 42) |
|---|---:|---:|---:|---|
| **class** | 42 | **3** (W092 firm; W082, H0159 soft) | 7.1% | does not fire |
| as-of flag (counted apart) | 21 carriers | 1 (W100) | — | — |

**With my three classes in place of A's:**
- PROXY 14, RING 14, INFER 5, DIGEST 4, CARRY 2, OWN-NOTE 1, NONE 1, NT 1.
- PROXY and RING tie at 33.3%. The carrier set is still 21. It has 18 `as-of = no` with A's flags (W082, a "no", leaves RING; W092, a "no", enters), and 19 with W100's flag moved (below).
- These are counts, not a score.

## The units A asked me to look at hardest
### The four PROXY "letter-tension" units: W012, W028, W096, H0911. **Agree, PROXY** (inferred, on A's cited outputs)
- B's §2 class 4 says "W itself is not in the output". But B's own examples for PROXY include **"a run from the wrong folder"**. There the run prints the claimed figure itself ("0 hooks"), about a different configuration.
- So B's examples already admit a printed figure about the wrong object. In all four units the printed number counts another object:
  - rows of a different kind (W012);
  - file stems with backups folded in (W028);
  - growth since an offset that includes the seat's own turns (W096);
  - two test files run together (H0911).
- Read against B's order, none of them is RING, DIGEST or OWN-NOTE (the earliest text is the seat's own tool output).
- CARRY needs a lost source, and here the source is right there.
- INFER needs "no observation of the claimed object" (or close to it), and these seats observed something and misread it.
- So class 4 is the first that fits. A's PROXY rule matches B's examples, not only A's reading.

### The four soft RING units
- **W082: disagree, RING → INFER (soft; checked).** A placed the claim at 12896; in `turnwide W082`, that call_chair is the 13:54:20Z ring to the chair.
  - Nothing before it states that the chair is idle, or a premise for it:
    - the chair's opening ring (12878) says the handoff is written, item 3 is done, and "read §0 FIRST";
    - the `[panes]` digest (12880) says "MAIN 44 exch today · last 3m";
    - the seat's own result (12891) even printed an earlier "chair QUEUED … stamp=working".
  - "Idle" is the seat's own step from "the chair just rang me". That is reasoning from a convention with no observation of the chair's state: class 6.
  - Soft, because the ring's "done" can be read as the premise "its work is finished". A marked this one low-confidence too.
- **W084: agree, RING (inferred).** The source note is the DESKTOP librarian's. The room keeps the laptop and desktop librarians as separate lineages (separate WRONG columns, "laptop lineage" in the corrections). So for the laptop seat it is another seat's text: RING comes before OWN-NOTE.
- **W088: agree, RING (checked, `dossier W088`).**
  - The chair's ring that opens the turn (13276, 08:20:20Z) states the premise in its own words: "The four committee cwds in panes.json EXIST on D, each with a matching project slug". That is directory existence standing in for resumability.
  - The seat's `panes_check.js` (13297–13298, "dir true | project true … both exist 4") only confirms it, 34 s later.
  - The earliest text is the ring.
- **H0546: agree, RING (inferred).** The ring states the premise the seat widened ("not directives"). B's "or the premise W rests on" takes it.
- **A's sensitivity, as I read it:** none of the four letter-tension units leaves PROXY, and one soft RING (W082) leaves RING for INFER, not for PROXY. So neither of A's "leading" scenarios happens in my read.

## The other disagreements
- **W092: disagree, PROXY → RING (firm; checked, `search W092`).** B's order classifies by the EARLIEST text stating W or the premise it rests on. Here that text predates the 10:45 process check A cites:
  - **09:44:18Z** (event 15549): a tool result prints A's own report, "The tail-carry mutation run is 31 of 67 through with no survivors". This is another party's text saying A is running the tail-carry mutants.
  - **09:59:09Z** (15606): a result prints A's hand-back lines naming a 69-mutant run.
  - **10:37:00Z** (15815): the seat's own text already says "A's last mutation run, 69 mutants on a copy of its file, going since 04:15".
  - **10:45:59Z** (15863): only then the lock and process read A cites.
  - So the belief that the live run is A's came from A's own messages. The process read confirmed nothing new.
  - Class 1, RING. carried: turns; as-of: no (A's report gives no time). A named RING as a neighbour itself.
- **H0159: disagree, INFER → NONE (soft; checked, `dossier H0159`).**
  - The turn shows the seat measuring (sizing runs printing per-class member and prose counts: 14102, 14125, 14137, 14144). No output gives 47 and no reasoning toward 47 is visible.
  - B's INFER needs the turn to show reasoning from code, a name, a convention, arithmetic or general knowledge. NONE is "no visible basis at all", and that is what this is.
  - Soft, because the correction says 47 was carried from an earlier looser run. If that run's output were found, it would be CARRY.

## Every unit
| unit | A | C | mark |
|---|---|---|---|
| W006 | RING | agree | inferred |
| W010 | PROXY | agree | inferred |
| W012 | PROXY | agree | inferred (letter tension, above) |
| W018 | DIGEST | agree | inferred |
| W019 | PROXY | agree | inferred |
| W020 | DIGEST | agree | inferred |
| W021 | DIGEST | agree | inferred |
| W022 | CARRY | agree | inferred (soft: a conditional plan line as the carried premise) |
| W028 | PROXY | agree | inferred (letter tension) |
| W032 | PROXY | agree | inferred |
| W034 | RING | agree | inferred |
| W082 | RING | **INFER** | checked (soft) |
| W084 | RING | agree | inferred (lineage) |
| W088 | RING | agree | checked |
| W090 | PROXY | agree | inferred |
| W092 | PROXY | **RING** | checked (firm) |
| W096 | PROXY | agree | inferred (letter tension) |
| W100 | DIGEST | agree | inferred |
| W101 | PROXY | agree | inferred |
| W079 | RING | agree | inferred |
| W080 | RING | agree | inferred |
| W044 | RING | agree | inferred |
| W049 | RING | agree | inferred |
| W053 | PROXY | agree | inferred (the observed list is injected context, not a tool output; B's "sed window miscounted" is the nearest example) |
| W054 | INFER | agree | inferred |
| W056 | RING | agree | inferred |
| W058 | INFER | agree | inferred |
| H0182 | RING | agree | inferred |
| H0546 | RING | agree | inferred |
| H0802 | PROXY | agree | inferred (B's own sed example) |
| H0102 | PROXY | agree | inferred (B's own wrong-folder example) |
| H0162 | INFER | agree | inferred |
| H0351 | PROXY | agree | inferred |
| H0159 | INFER | **NONE** | checked (soft) |
| H0403 | CARRY | agree | inferred |
| H0557 | RING | agree | inferred |
| H0232 | PROXY | agree | inferred |
| H0192 | INFER | agree | inferred (the "general knowledge" reading; NONE would be the alternative) |
| H0717 | OWN-NOTE | agree | inferred |
| H0911 | PROXY | agree | inferred (letter tension) |
| H0682 | NT | agree | inferred |
| H0562 | RING | agree | inferred |

## The as-of flag, counted apart
- **W100: yes → no.** The digest's "last 7s" is the age of the pane's last exchange, not of the state claimed (that a file does not exist). A names this stricter reading itself.
- **W020 stays yes.** "idle 6m" dates the idleness that W's premise rests on.
- **W092 (my RING):** as-of no.
- **Carrier set under my classes:** 21 units, 19 `as-of = no` with W100 moved (18 with A's W100). Either way it is above 2/3.
