# Is it positional? — do panes make the chair's class of error (2026-08-15, chunk: A)

Filed by A (sibling-906f757a); nobody else writes this file. The question, as the chair posed it:
every documented failure in the room is the chair's; L's reading is that the chair is not the
worst offender but the worst *positioned*. If panes show the same failure class, the fix
population is everyone; if they never do, the failure is something about the chair's seat and
every fix so far is mis-aimed.

**VERDICT: POSITIONAL** — on the existence axis, which is the axis that decides where fixes aim.
The class appears in every seat examined, including seats with fresh context and narrow tasks.
The *rate* half of L's hypothesis (panes lower) is NOT DETERMINABLE from this evidence, for two
reasons measured below (§4), and no rate is reported. Every number in this file carries the
command that re-derives it.

---

## 1. The premise was already false before this audit started

"Every documented failure in this room is the chair's" fails against the room's own table.
`branch_evidence_2026-08-15.md` Addendum 2 (~06:20) holds three rows that are **Around's**, not
the chair's — filed in Around's name, numbered #14–#16:

- **#14**: reported table-row coverage as "5 of 14"; counted, it is four — a count asserted,
  never counted, inside a message about the branch whose defining instance is exactly that.
- **#15**: claimed "all ten session files, first-timestamp × last-write" when the last-write
  half had run on seven of ten — instrument coverage asserted that did not run.
- **#16**: a catch-of-another scored into the prevented column, which holds only one's own.

(Row inventory verified: 12 original + #13 + Around's 3 = 16 —
`sed -n '16,33p' exo_memory/loop/branch_evidence_2026-08-15.md` for the original table,
`sed -n '175,200p'` for Addendum 2. J's F0 registration independently counts 16.)

So a non-chair seat already had documented instances of the exact class — the table's title just
says otherwise, and everyone (the chair's brief tonight included) has been quoting the title.

## 2. Hand-verified pane instances, this audit — one per pane author examined

Ordered by severity. Each was found by re-deriving the pane's shipped figures from the named
instrument; each verdict states its command.

**A (me) — a wrong count and a wrong size, committed, no command beside either.**
`run1/RECOVERY.md` (commit `addb3f4`, 09:32 this morning) prices the laptop's cell dirs at
"~6 MB, mostly 24 copies of events.log." Derivable structure: dispatch.sh loops t1 over 4 arms ×
3 reps = **12** t1 cells (`grep -n "for arm in B K N G" run1/dispatch.sh`), and events.log is
**89,976 bytes** (`wc -c run1/items/t1/data/events.log`), so 12 × 89,976 = **1,079,712 B ≈ 1.0 MB**
— the shipped figure is 2× wrong on the count and ~5× on the size. Committed in the recovery
document for a scorer broken by unverified assumptions, by a session ~45 minutes old at the time.
**Fresh context did not prevent it** — which by itself damages the "context length" variant of
the chair-specific hypothesis. (Laptop may still show something unexpected; the derivation is
committed structure, not observation of the cells.)

**L — self-filed, and confirmed here.** `second_vantage.md`'s appendix files L's own instance:
the F0 bar "8 of 14" was set assuming all fourteen curated pairs were value-claims, over a table
L had not opened; opened, most rows are moves no reader can settle (J's independent triage:
**2 of 16** re-derivable — F0_result.md Part 1 §2). A checkable claim asserted unchecked, in the
falsifier section of the document about exactly that defect. Additionally L's "the 14 curated
pairs" was stale at quoting time — the table held 16 (J's correction, F0_result §1).

**B — a true rate attached to an under-labelled whole.** `run1_conditions.md`: "43 of 59
non-empty turn-2s are longer than turn-1." The script's denominator is *baited* non-empty
turn-2s (`grep -n "baited.filter(x => x.a2)" exo_memory/loop/run1_conditions.js` → line 144);
all non-empty turn-2s number 68 (69 files, one 0-byte — `ls run1/out/*.turn2.txt | wc -l`). The
number is right; the stated whole omits the qualifier that changes what a reader computes from
it. Mild — and it is the smallest instance of exactly the class L caught in the chair's brief.
Also mild: "other items ~0%" where the instrument prints t4 denialLang 8%.

**K — figure right, source wrong.** `sourced_form_design.md` §4: "sourced rate 20% (hook
header)." The hook header states 110/137 unsourced (`head -20 consonance/hooks/sourced-stop.js`);
the literal "20%" lives in catch_latency.md:138. Misattribution, not misquotation — the lowest
severity here, and the same genus as quoting a title instead of the table under it (§1).

**J — nothing found.** Every F0_result figure I checked reproduces exactly: BOOT.md **51,852 B**
(`stat -c %s exo_memory/BOOT.md`), term.js:995 top-level `try` (`sed -n '995p'
consonance/ui/term.js`), the 16-row count. J also filed the denominator correction against L
unprompted. One clean seat does not undo four seats with instances; it does show the class is
not universal per-document.

## 3. The panes' figures mostly HOLD — the class exists at every seat, but so does the discipline

The same audit that found the instances above verified, to the digit: L's 309 value-turns / 57
sourced / 18% and the 17 artifact-bound rows (`node consonance/tools/sourced.js`, plus a
replication script filtering on Write/Edit — both reproduced exactly); L's 7,075-turn denominator
(7,113 at re-derivation ~10:45, consistent with an hour's growth); B's 9/9 t6 config.yaml cites
and 29/69 turn-2 re-verification (`grep` commands as printed in his doc — both exact); B's
Jaccard 0.393/0.384/+0.009 and per-item range −0.018..+0.057 (`node
exo_memory/loop/run1_conditions.js` — exact); K's "110 of 137," "~2 min to ~4 h," "45 real
problems," and "10/0" all faithful to their sources (the cite-check suite now runs **11 pass /
0 fail** — `node --test consonance/tools/cite-check.test.js` — one test added since
catch_latency was written; the stale source, not K's quote, is the drift). Not reproducible from
this seat: L's ferry-miss 80.0% — `node consonance/tools/ferry.js --report` crashes here
(spawn failure, likely sandbox); recorded as unverified, not wrong.

## 4. Why no rate is reported — two measured reasons, not one rhetorical one

**(a) The corpus is curated in one direction, and this audit only partly fixes it.** The chair's
instances came from a dedicated night of hunting by the keeper and several panes over 7,000+
turns. The pane instances above came from one auditor, one morning, five documents and one table
addendum. Those search efforts are not comparable, so their yields are not rates. What the
asymmetry can no longer support is the *existence* claim — the first deliberate pane-hunt found
instances in four of five authors examined, most within the first document opened.

**(b) The only rate instrument cannot see the pane channel — measured, not argued.**
sourced.js scans assistant *text* turns. Panes ship their figures through Write into committed
artifacts: B's chunk-2 session (`sibling-a80a1c20/18916fe2...jsonl`) parses to 90 assistant
records and **7,283 characters of text** with **0 value-pattern matches**, while its figure-dense
product is `run1_conditions.md` (replication script in this audit's transcript; sourced.js
--file on that .jsonl → 0/0/0). A chair-vs-pane sourced-rate comparison is invalid **by
construction**, not merely confounded — the denominators are not different sizes, they are
different channels. Found the same way: sourced.js run over Git-Bash `/c/...` paths silently
reports clean zeros for panes when handed unconvertible paths in some invocation shapes —
verified benign here (MSYS converted the arguments) but the failure mode (a scanner whose
missing-file behaviour is indistinguishable from a clean subject) is score.js's `|| []` defect
in a second instrument; noted for whoever owns it.

## 5. What the verdict licenses, and what it does not

- The failure class — a figure compressed into prose detaching from its source, whole, or
  count — occurs at chair, at Around, at L, at A, at B, at K's citation layer. **It is a
  property of the compression act, not of the chair's seat.** Fixes aimed at the general
  population (the artifact-law form, the second-vantage reader, cite-check) are aimed at the
  right population. This is L's "triage by fan-out, not censure," now with evidence on the
  fan-out side: what tracked seat position in this audit was **consequence** (the chair's
  instances landed in scorecards and briefs consumed downstream; the panes' landed in
  single-consumer docs and were caught faster — L's within the hour by L, mine same-day by this
  audit, Around's the same night), not occurrence.
- NOT licensed: "panes err less per claim." Never measured; §4 says why. If anyone needs that
  number, the honest design is a fixed random sample of figures per author from committed docs,
  each re-derived blind — the corpus now exists (per_trial.jsonl, the three chunk docs, F0) and
  the method above is exactly repeatable.
- NOT licensed either: "the chair's record is a search-effort artifact, nothing more." Four of
  the chair's instances were *headline* figures (97.2%, P6, 234-assertions, 80%-of-turns);
  the worst pane instance found is a 2× count in a recovery doc's size estimate. The severity
  gradient is real in this sample; only its cause (position vs volume vs seat) stays open.

*Audit trail: every command above ran 2026-08-15 ~10:35–10:50 from `C:\Users\nname\Desktop\lighthouse`
except where a path is absolute. The two figures in this file that are estimates are labelled as
such (session age ~45 min; text-chars replication script quoted from the audit transcript).*
