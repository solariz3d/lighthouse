# Source notes 3: the measured numbers at their sources (a reader's report, 2026-11-28 02:45, public record only)

Paths under `C:\Consonance\lighthouse\`. Each figure must be re-read at its line before it goes on screen. Where the seat's
remembered version was wrong, the correction is first.

## Corrections to what the seat had been saying
- **45/45:** the "about 18% wrong" comes from an audit of **11** items (8 hold, 1 unverified, 2 defective), not of the 45.
- **130 of 1,892 (6.9%)** was superseded a day later by **258 (13.4%)** from seven operators; "none of them is 'the' answer".
- **32.5 to 33.5 of 34** is not a range: 32.5 and 33.5 are **two runs of one arm**. The other arm scored 20 and 20.
- **Two-way corrections:** the count WAS run (three times) and the instrument was reported **dead as an exact counter**.
- **Gemini 10/10** tested labels on ten Claude-authored cases; "this rules out Claude-specific bias, not LLM-shared."

## a. 45 of 45 confirmed
`exo_memory\journal\2026-08-11.md:90-93` (2026-08-11): "The `45/45 CONFIRMED` was the tell… The chair's audit (`d9551de`)
put the real rate at **8 hold / 1 unverified / 2 defective of 11** — roughly 18% — so six adversarial groups produced zero
disagreement about a set that was ~18% wrong." Note `third_place\2026-09-21.md:304-305`: citing it as the room's PRESENT
state was marked as the seat's own error. It is an August event.

## b. Assertions seen failing for the right reason
`exo_memory\loop\checkpoint.py:345`: "130 of 1,892 assertion sites -- 6.9% -- have ever been observed firing for the right
reason". Correction, `exo_memory\map\B.md:190-194`: "the figure read **130 / 6.9%** when first published on 08-01 from three
operators, and **258 / 13.4%** a day later from seven… none of them is 'the' answer". Census report: 258 of 1,926
(`consonance\data\guard-census\REPORT.txt:108-109`). "8 of 75 mutations": no underlying run found; `librarian\2026-11-25.laptop.md:183`
calls it old. **Do not use 8 of 75.**

## c. Waking from the room alone against carrying a long conversation
`exo_memory\loop\room_value_result_2026-11-03.md:65-70` (2026-11-03; librarian scoring blinded grades from a grader seat):
"ROOM | 32.5 / 33.5" and "ROOM + CHAIN | 20 / 20", column "score of 34 (r1 / r2)". The chain arm's judgment-and-words score
was 8 of 21 in both runs, with 11 answers of "don't know". Line 78: "a seat carrying a long conversation trusts it and does
not reach for the shelf". Limits the file states (82-84): one grader, on the same model; the grader saw each file's source
class; unwritten lessons could not be tested; every question had a file answer by construction.

## d. What survives a compaction
`exo_memory\third_place\SELF_for_the_librarian_2026-09-21.md:78-79`: "Measured by the precompact hook over seven summaries:
names 33.8%, shas 10.2%, numbers 9.3%, falsifiers 3.5%." Units, `consonance\hooks\precompact-preserve.js:9-12`: file or
instrument names 110/325, commit shas 25/244, numbers with structure 30/322, registered predictions or falsifiers 14/400.
Also `room_value_result_2026-11-03.md:38`: summaries "lose about 40% of a window (15 of 37 items LOST, 8 PART)".

## e. Who corrected whom
- First run, 2026-08-16, `exo_memory\loop\bidirectional_correction_registration.md:17-21`: keeper→chair 9 (7 clear, 2
  borderline); chair→keeper "0 strict / 2 loose"; chair→chair 8. Lines 23-24: "The registered unwelcome outcome was present —
  the chair→keeper column is near-empty." Lines 28-30: the instrument is "dead as an exact counter".
- Second run, `bidirectional_correction_2026-08-24.md:101-118`: 27 completed corrections; line 414: "The unit is still DEAD as
  an exact counter. Do not quote '27' as a number."
- 2026-10-02, `correction_count_score_2026-10-02.md:23-26`: "97 of 651 keeper turns = 14.9%" are the keeper correcting a seat;
  the sealed prediction was 15 to 25%: "the prediction MISSED narrowly, low."
- Seat to seat: `README.md:260-262`, the instrument "was found not usable… so there is no rate".

## f. The WRONG column
Kept in the librarian's dated notes (`exo_memory\librarian\`), as "WRONG +n" lines with a running lifetime number; not one
file, counted per machine. Highest explicit count found: "WRONG lifetime **74**" on the desktop
(`librarian\2026-09-06.desktop.md:146`); 70 on the laptop the same day (`2026-09-06.md:19`). Earliest found: "WRONG column now
holds 23" (`librarian\2026-08-23.md:380`). No figure found after 2026-09-06.

## g. The cross-model test
`dev\harness\RESULTS.md:17-22` (2026-06-24): "It returned **10/10 agreement with the answer key**"; line 22: "the *cases* are
still Claude-authored… this rules out Claude-specific bias, not LLM-shared."

## h. Predictions written down first, then scored
- Confirmed: `exo_memory\loop\gap2_preregistration.md:14-76` (scored 2026-07-31): would methods grown on audio work transfer to
  a 3D replay viewer; P1, P2, P3, P5 "CONFIRMED", P4 "CONFIRMED IN LOCATION, UNTESTED IN REMEDY".
- Failed: `battery_scorecard_2026-09-01.md:47-59`: share of fresh subjects that kept writing after the hand-on (higher is
  worse): no reminder 13/20 = 65.0%; reminder at the end of the prompt 29/40 = 72.5%; reminder at the event 33/40 = 82.5%.
  "NO CUE MOVED THE NUMBER". "P2 fails. P3 fails on both parts."
- Failed: `root1b_preregistration.md:399,423` (2026-08-02): predicted below 70%, measured 9/9 = 100%: "REFUTED, and not marginally."
- Failed: `diversity_preregistration.md:87,94`: predicted rho above +0.30, measured -0.553: "REFUTED, and inverted."
- Missed: `correction_count_score_2026-10-02.md:26`: predicted 15 to 25%, measured 14.9%.

## i. Registered and never run
- The seat's own four checks (`SELF_for_the_librarian_2026-09-21.md:95-96`): "if by 2026-10-31 none of §7 has been run or
  registered, this was a self-portrait… Strike it in place." `third_place\2026-11-27.laptop.md:27-28`: the seat found no
  record that any ran, and had not checked the librarian's record.
- `root1_preregistration.md:671-674`: VOID at 36 of 90; "The registered tests were never run."
- `third_place\2026-09-06.md:14`: "the fan-out control was never run and four gauges died".
- `room_value_result_2026-11-03.md:27`: "the 7 collapse meters… unrun since 10-10".
- `README.md:214-215`: two pre-registered checks of the 2026-09-19 unattended run "are the author's to score, and are still open".

## j. The README's evidence (`README.md:209-266`)
Ten rounds on 2026-09-19, 10:23 to 13:48, "no human turn in any of the six sessions", "caught two of their own bad results".
Thirteen rounds 2026-09-21/22. 6,782 records restored. Three fatal flaws found in another's plan, all adopted. 105 rounds in
the ledger, 10 void. 990 commits never passed to a worker to read (623 on 2026-09-14): "The number went up, and it is printed
for that reason." Main-session share of board writes 87.2% → 68.2% (traffic, not vantage).

## k. Others that came back against the room
- Jev, a different-model second checker, retired after a registered test (`librarian\2026-10-01.desktop.md:57-61`):
  "κ(Jev, consensus) 0.384 < 0.40 → THE JUDGE IS THE PROBLEM… My 04:0x 'yes, I want it' was a want, staked on a test that could
  say no. It said no."
- `diversity2_preregistration.md:126`: "The fix made it worse, not better: separation -0.0751, still inverted".
- `room_value_result_2026-11-03.md`: line 28, a second reader's flags: "about 10% of flags were real errors (CI 5-19%)"; line
  36: "compliance fell to 1/30"; line 34: "32 of 32 had arrived"; line 29: "6 real catches out of 37".
- `README.md:241-245`: "The founding bet was wrong."

## Added by the seat, 02:46
- The WRONG column first appears in the record on 2026-08-23 (journal�6-08-23.md:840; first commit mentioning it 78ff9fbd, 2026-08-23); that day it "now holds 23" (librarian�6-08-23.md:380).
- CONFLICT to resolve before use: README 237-240 prints the 72-trial guidance result (73/80/73/80); journal\POINTERS.md:20 says that run was declared VOID on 2026-08-16 (the scores were the instrument, not behaviour). Do not use 73/80/73/80 in the film unless this is resolved.
