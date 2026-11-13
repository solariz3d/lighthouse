# 00 Rank: the ten roots ranked by ledger rows BOTH scorers marked YES (ranker, Sonnet research agent, 2026-11-13)

Marks: [read] I opened it and saw it (path:line); [inferred] mine; [ours] a proposal. A count I made with a command says so.
Read whole: 00_roots.md, the plan, the verdict lines of all 10 adversary files, sections 0-6 of adversary_R01 and R02, the
ledger's head, totals and second-reader block (00_ledger.md:1-9, 1179-1228). The 20 score files I parsed by node (tables and
totals) and read in part. I opened no ledger primary except handback/p-d627-p1-flags-P_2026-11-03.md:45, and the ledger
rows L0301, L0307, L0586, L1079, L1085, L1088. Ranking rule, as asked: agreed YES rows, then cost covered, then groups
proposing. Nothing else.

## How the counts were made [read: command run]

A node script parsed every score table (`| Lnnnn | YES|PARTLY|NO |`). Five scorer files list only YES and PARTLY rows, and R10
scorer 1 used YES/PARTLY section headers; the script read each form. Its per-scorer totals equal the totals the scorers
printed in their own files, for all 20 files (e.g. R01 154/131 and 155/88; R02 91/51 and 96/30; R10 45/35 and 33/37).
"Agreed YES" = the row is YES in scorer 1 AND in scorer 2, row by row, over the 1,123 ledger ids. The script's output is
kept as `agreed.json` in this folder (a root id mapped to its agreed ids).

"Cost covered" = the stated minutes in the cost field of agreed rows, summed from a table I wrote by hand for the rows whose
cost field names a time [inferred: my selection; a time in the field is not always time LOST]. Left out as not a work cost:
L0003 (names another row), L0304 (4 h 26 m elapsed, "nothing lost"), L0076 (a dwell), rows in days, KB or characters (L0025,
L0133, L0398, L0788, L0593), L0785 and L1075 (a run time; a time to supply prior art), and token rows that are reads or units
(L0469, L0898, L1013, L0613). Rows that share one event (L0068 and L0074, both 80 min) are both counted, so sums can double
count [inferred]. Token cost is listed only for R08.

## (1) The table

Groups = how many of the four blind groups (g1-g4) proposed it [read: 00_roots.md "Proposed by"]. S1 and S2 = YES / PARTLY.

| id | title (short) | groups | plan | S1 Y/P | S2 Y/P | agreed YES | cost covered by agreed rows | adversary |
|----|---------------|--------|------|--------|--------|-----------:|-----------------------------|-----------|
| R01 | claim typed from memory, not from an instrument run | 3 (g1 g2 g3) | no, wider (see R06) | 154/131 | 155/88 | 135 | 217 min in 4 rows (3.6 h) | TOO BROAD TO TEST |
| R02 | done-state read off the sender's side, target not asked | 3 (g1 g2 g3) | its DELIVERED example sits here [inferred] | 91/51 | 96/30 | 80 | 2,324 min in 13 rows (38.7 h) | TOO BROAD TO TEST |
| R03 | control accepted without a run on a recorded failing case | 3 (g1 g2 g4) | its 98-of-98 example sits here [inferred] | 70/80 | 79/82 | 58 | 80 min in 1 row (1.3 h) | TOO BROAD TO TEST |
| R07 | stage end / alarm / finding has no consumer or wake path | 2 (g3 as a symptom, g4) | no | 68/48 | 65/53 | 52 | 3,157 min in 17 rows (52.6 h) | TOO BROAD TO TEST |
| R09 | fix or rule filed where its finder sits | 1 (g4) | no | 55/53 | 77/74 | 47 | 283 min in 7 rows (4.7 h) | TOO BROAD TO TEST as one root |
| R10 | reading of his meaning built on before his words reopened | 1 (g1) | no | 45/35 | 33/37 | 31 | 34 min in 1 row | SYMPTOM OF R06 |
| R05 | send/hold/stop has no receipt and does not bind | 3 (g2 g3 g4) | no | 32/15 | 35/30 | 26 | 162 min in 4 rows (2.7 h) | TOO BROAD TO TEST |
| R06 | carried copy trusted in place of the original | 3 (g1 g3 g4) | yes (its candidate) | 50/56 | 30/47 | 25 | 60 min in 1 row | SYMPTOM OF R01 |
| R04 | lock/gate records a holder, not liveness | 3 (g2 g3 g4) | no | 32/20 | 23/31 | 22 | 2,162 min in 10 rows (36.0 h) | SYMPTOM OF R09 (R07 behind it) |
| R08 | token cost of wake/ping/compaction not metered | 1 (g2) | no | 12/14 | 12/12 | 11 | 64,963,949 tokens in 5 rows; no minutes | TOO BROAD TO TEST |

Sources for the verdict column [read]: the first verdict line of each adversary file (adversary_R01.md:8-10, R02:9-13,
R03:9-14, R04:7-13, R05:165-169, R06:7-11, R07:6-11, R08:7-9, R09:9-12, R10:6-10). No root was marked as surviving whole.
R08's token sum is rows L0010, L0257, L0371, L1093, L1094 (1.73 M plus 141,704 in the last) [script over the ledger cost
field]; the rows may overlap (L0010 and L0371 both concern idle or cold wakes) [inferred].
Distinct ids that are agreed YES for at least one root: 394 of 1,123 [read: script]. Roots dropped by the cap: none; ten
roots were scored against a limit of twelve [read: 00_roots.md, "Ten roots; none dropped (limit 12)"].

## (2) The ranking, by agreed YES rows only

No tie occurred, so the cost and group tie-breaks were not used. The order by stated cost is different (shown after).

1. R01, 135 agreed rows, 217 min stated, TOO BROAD TO TEST
2. R02, 80 agreed rows, 2,324 min stated, TOO BROAD TO TEST
3. R03, 58 agreed rows, 80 min stated, TOO BROAD TO TEST
4. R07, 52 agreed rows, 3,157 min stated, TOO BROAD TO TEST
5. R09, 47 agreed rows, 283 min stated, TOO BROAD TO TEST as one root
6. R10, 31 agreed rows, 34 min stated, SYMPTOM OF R06
7. R05, 26 agreed rows, 162 min stated, TOO BROAD TO TEST
8. R06, 25 agreed rows, 60 min stated, SYMPTOM OF R01
9. R04, 22 agreed rows, 2,162 min stated, SYMPTOM OF R09
10. R08, 11 agreed rows, 64.96 M tokens stated, TOO BROAD TO TEST

[inferred] Order by stated minutes would be R07, R02, R04, R09, R01, R05, R03, R10, R06. I did not use it. The two orders
agree only that R02 is near the top. This is the mismatch the plan warns of (plan, "How this one chooses", step 3: "a root
that explains one loud incident loses to one that explains twelve quiet ones"), and it is why the count is not the whole
decision (section 6).

## (3) The top two

### R01. A claim of fact is typed from memory, not copied from an instrument run

**Statement** [read: 00_roots.md:9-14]. A figure, clock time, sha, count, line citation or "no X exists" enters a ring,
hand-back or note from the writer's head, a summary or a cut read, with no command in the same call that printed it, and later
seats treat it as measured.

**Agreed YES rows, 135 ids** [read: script]:
L0007 L0014 L0033 L0035 L0036 L0040 L0044 L0047 L0049 L0053 L0054 L0055 L0056 L0059 L0066 L0071 L0073 L0081 L0083 L0086
L0087 L0088 L0097 L0107 L0109 L0110 L0116 L0117 L0118 L0153 L0157 L0160 L0169 L0170 L0171 L0172 L0174 L0190 L0192 L0197
L0200 L0206 L0208 L0212 L0214 L0225 L0250 L0262 L0266 L0273 L0295 L0301 L0307 L0351 L0397 L0410 L0419 L0495 L0507 L0528
L0531 L0557 L0566 L0573 L0584 L0585 L0586 L0587 L0588 L0625 L0639 L0643 L0657 L0663 L0691 L0699 L0709 L0719 L0728 L0735
L0759 L0775 L0778 L0779 L0795 L0800 L0814 L0840 L0846 L0861 L0867 L0868 L0869 L0874 L0882 L0883 L0897 L0903 L0904 L0905
L0911 L0927 L0930 L0939 L0945 L0947 L0954 L0964 L0985 L0986 L0990 L0992 L0995 L0997 L1002 L1006 L1009 L1010 L1011 L1043
L1049 L1062 L1066 L1075 L1076 L1077 L1090 L1096 L1097 L1098 L1101 L1105 L1111 L1118 L1119
Of these, 104 are agreed YES for no other root [read: script]. Cost: four agreed rows carry a stated time (L0295 60 min,
L0585 43, L0587 3, L0643 6,670 s = 111 min of mutant runs); the other 131 carry none [inferred from my minutes table].

**Adversary's strongest point** [read: adversary_R01.md:8-10, 90-108]. The fix of exactly this kind was built twice and
replayed on recorded cases and did not pass: the point-of-claim check caught 5 of 16 held-out turns (31.3% against a 40%
floor) and was ruled DON'T BUILD; the SOURCES gate showed 0 catches in 383 refusals (cited from the adversary's primaries
plan_claim_check_d305_2026-10-11.md:48-54 and handback/p-scoreboard-E_2026-10-11.md:11; I did not open those two).
A second point [read: adversary_R01.md:54-73]: five rows the proposers claim are rows where an instrument DID run and the
number was still wrong (L0034, L0413, L0586, L0709, L0754).
**Do the scores answer it?** No [inferred from the tables]. Both scorers marked L0586 and L0709 YES although a command ran in
each (scorer 2's mechanism text for L0586 reads "line count by wc (13,933), not 13,085" [read: score_R01_2.md]); L0413 and
L0754 were YES in one scorer and PARTLY in the other; L0034 was PARTLY and NO. So the scorers read "would an instrument
run have shown it" more widely than R01's own words "no command in the same call", and the 135 includes rows the adversary
says a copy-from-instrument rule would not stop. The count supports R01 as a wide pattern, not as one fix.

**The one recorded case on which a fix could be shown to fail today:** L0586, "main.rs 13,085 lines" (the file has 13,933;
PowerShell `Measure-Object -Line` drops blank lines). [read: 00_ledger.md:625 and handback/p-d627-p1-flags-P_2026-11-03.md:45,
both opened.] A fix "put the number from a command run in the same call" passes this case, because a command did run; only a
check on the unit or the count method would catch it. Same shape: L0709 (matches, not lines).

### R02. A done-state is read off the sender's side and the target is not asked

**Statement** [read: 00_roots.md:16-21]. DELIVERED, working, idle, landed, installed, "the hold is on disk" or "the gate
exists" is taken as the effect, and nobody asks the pane, the process list, the installed copy or the remote what it now holds.

**Agreed YES rows, 80 ids** [read: script]:
L0003 L0008 L0020 L0022 L0023 L0036 L0046 L0051 L0068 L0074 L0089 L0092 L0099 L0112 L0176 L0205 L0207 L0231 L0244 L0256
L0260 L0288 L0292 L0293 L0296 L0301 L0304 L0377 L0392 L0398 L0418 L0448 L0465 L0471 L0472 L0487 L0525 L0538 L0544 L0563
L0565 L0592 L0613 L0623 L0627 L0648 L0657 L0698 L0699 L0702 L0705 L0708 L0710 L0719 L0728 L0746 L0765 L0778 L0857 L0862
L0863 L0880 L0912 L0940 L0966 L0971 L0972 L0995 L0996 L1005 L1036 L1044 L1061 L1079 L1084 L1085 L1087 L1088 L1092 L1122
Of these, 31 are agreed YES for no other root [read: script]. 17 of the adversary's 19 "installed copy older than the repo"
rows are in this list (the two outside it: L0021 and L1086) [read: script against adversary_R02.md:26-27]. Thirteen agreed
rows carry a stated time; the largest are L0710 (a 12 h declared session on the lock, not time lost), L0563 (10 h 34 min
unseen), L0525 (about 8 h), L0863 (about 3 h) [read: ledger cost fields via script].

**Adversary's strongest point** [read: adversary_R02.md:9-13, 15-38]. TOO BROAD: R02 is three faults a clerk merged (install
drift, delivery read as acted on, lock holder read as alive), and each half has an upstream root on the list (R03, R05, R04).
Only 23 of its 236 claimed ids were claimed by all three groups, and about 19 of those say one narrow thing.
**Do the scores answer it?** Partly, and against R02 as one root [inferred]. 17 of the 19 install-drift rows are agreed YES,
so that half is real and counted. Scorer 2 itself wrote that install-copy rows "carry much of the YES count; they are one
mechanism seen many times, not many independent faults" [read: score_R02_2.md:1155]. The agreed set also overlaps R07 (14
rows), R05 (10), R03 (9), R04 (9) (section 5), which is the layering the adversary describes. The scores confirm the count
and do not remove the "bag of mechanisms" point.

**The one recorded case on which a fix could be shown to fail today:** L1079 with L1085-L1088. On 11-13 the [panes] digest
fix could not be installed because `install.ps1 -Check` lists DRIFT and ABSENT (15 DRIFT, 9 ABSENT on L; 10 DRIFT, 3 ABSENT
on D) and installing syncs all at once [read: 00_ledger.md:1118 and 1127; the primaries map/B.md:2186 and map/M.md:1030
not opened by me]. Any R02 fix is red on D until `-Check` prints 0 DRIFT and 0 ABSENT; that is a check that runs on a
recorded case [inferred] (the adversary reaches the same test at adversary_R02.md:68-76). It would test half A only.

## (4) Where the blind groups split

- No root was proposed by all four groups [read: 00_roots.md "Proposed by" lines]. Six roots were proposed by three.
- g4 proposed neither R01 nor R02. It put R01-type rows into its R06 (the adversary counted 88 of R01's 203 claimed ids
  there) [read: adversary_R01.md:23-27]. R01 and R06 share 13 of R06's 25 agreed rows [read: script].
- Only one group proposed R08 (g2), R09 (g4), R10 (g1). R07 was proposed by g3 (as a symptom of its own R05 and R02) and g4.
- Borne out by the scorers: R09 was proposed by one group and finished fifth, 47 agreed rows, ahead of R05, R06 and R04, which
  three groups each proposed [read: table]. Scorer 2 gave R09 YES on 77 rows and scorer 1 on 55. The adversary says it holds
  three mechanisms and the testable one (the shell-hazard rows) is the cheapest [read: adversary_R09.md:9-12].
- Not borne out: R10 (g1 only), 31 agreed rows; its adversary calls it a symptom of R06, and the two scorers split 45 and 33.
  R08 (g2 only), 11 agreed rows; the adversary says its cost rows are the price of other roots [read: adversary_R08.md:9].
- The plan's registered failure "the blind groups' top roots share nothing and the swarm reports one anyway" did not occur
  [inferred]: R01 and R02 were each proposed by three groups. The other registered failure, a top root that is not on the
  ledger's count, did not occur: R01 is first by the count [read: plan, "Registered before it runs"].

## (5) Overlap among the top four (agreed YES rows shared) [read: script]

| pair | shared rows | share of the smaller set |
|------|------------:|-------------------------:|
| R01 and R02 | 8 | 8 of 80 (10%) |
| R01 and R03 | 1 | 1 of 58 |
| R01 and R07 | 1 | 1 of 52 |
| R02 and R03 | 9 | 9 of 58 (16%) |
| R02 and R07 | 14 | 14 of 52 (27%) |
| R03 and R07 | 1 | 1 of 52 |

No pair among the top four shares most of its rows, so by this measure none looks like one root seen twice. The largest is R02
with R07, 27% of R07's rows. The union of R01 and R02 is 207 distinct agreed rows; the union of the top four is 292 of 394.
Outside the top four, R06 shares 13 of its 25 agreed rows with R01 (52%), and its adversary calls it a symptom of R01
[read: adversary_R06.md:7-11], so R06 may be R01 seen from the carry side [inferred]. R10 shares only 4 of 25 with R06.
R02's other overlaps are R05 (10) and R04 (9).

## (6) What the count CANNOT tell

- **Cost.** Stated time exists in few agreed rows: R01 4 of 135, R02 13 of 80, R03 1 of 58, R07 17 of 52, R09 7 of 47, R10 1 of
  31, R05 4 of 26, R06 1 of 25, R04 10 of 22 [inferred: my minutes table]. R01 shows 217 minutes against 135 rows; R07 shows
  3,157 minutes against 52. The count and the minutes point at different roots. I ranked by the count as asked; the cost
  column is a warning, not an adjustment. Several large figures are not work lost (L0710 12 h session, L0304 elapsed, L0076
  dwell) or are one stall counted in two rows (L0143 8 h 57 m and L0144 9 h; L0068 and L0074) [inferred].
- **Rows with no cost recorded.** The scorers report most YES rows with no minutes or tokens (R01 150 of 154 and 153 of 155;
  R09 46 of 55 and 59 of 77) [read: score files, "YES rows with no ... recorded" lines]. A root whose rows are quiet and
  unpriced is under-counted in cost.
- **The ledger's unreliable share.** The ledger's second reader put about 10% of rows as unreliable as written: about 7% (75
  rows, plausible range 2% to 16%) to remove as not an incident, about 3% (35 rows) with a small wrong figure, plus 3
  duplicates already marked REMOVE (L0255, L0299, L0300) [read: 00_ledger.md:1219-1225]. The commit-subject rows (120 to 165,
  estimated 20% bad) are the weak class. Seven rows were skipped as REMOVE by most scorers (L0029 L0162 L0255 L0299 L0300
  L0390 L0409). None of this was subtracted from the counts.
- **Scorers read rows, not primaries.** R01 scorer 1 says it opened no primary [read: score_R01_1.md, "What I did not open"];
  the same is likely for the others [inferred]. A thin commit-subject row may hide a fault scored NO.
- **Scorer disagreement.** YES counts differ by 15 or more on R06 (50 vs 30), R09 (55 vs 77) and R10 (45 vs 33); R04 differs
  32 vs 23. The agreed column removes single-scorer YES rows: R01 drops 19 and 20, R06 drops 25 and 5 [read: script].
- **Wideness.** No root passed the adversaries untouched: all ten came back TOO BROAD or SYMPTOM. R01 and R02 are the widest by
  the groups' own id lists (203 and 236 claimed ids) [read: adversary_R01.md:14-15; adversary_R02.md:11-12].
- **The dates.** The ledger covers 2026-06-30 to 2026-11-13; October holds 162 of the R01 union's dated rows against 633 for
  11-01 to 11-13 [read: adversary_R01.md:104-106, from the adversary's script]. Any root measured across months inherits that thin month.
- **What the count says about the vector.** [ours] The count puts R01 first by a wide margin (135 against 80) and R02 second.
  R02's count rests largely on one narrow mechanism (installed hooks older than the repo), and its stated minutes are the
  largest after R07. If either goes to the Opus level it should start from the adversaries' narrower forms: R01's "a claim
  whose source was already in context, or one command away, goes out unchecked" [read: adversary_R01.md:121-124], and R02's
  half A.

## What I did not open

- Every ledger primary except the ones named in the second paragraph; the four group files roots_g1 to roots_g4; the 12 ledger
  part files.
- The scorers' mechanism text for each row beyond the rows I quote; I took the verdicts from their tables by script.
- Adversary files R03 to R10 beyond their verdict lines and the lines I cite (R01 and R02 read in sections 0-6).
- plan_claim_check_d305_2026-10-11.md, handback/p-scoreboard-E_2026-10-11.md, map/B.md, map/M.md, install.ps1 (not run).
- Whether any stated cost is time LOST rather than elapsed; my minutes table was made by hand from ledger cost fields.
