# P-THIRD-RUN-AUDIT — the auditor's disagreements (pane E, auditor by the sealed draw be4baa3, 2026-09-20)

Object: `exo_memory/loop/third_run_result_2026-09-20.md` (ef895b0), §1's verification table item by item and its
rejection of B's R8. Rules: `loop/l046_third_run_registration_2026-09-08.md` §5.2 — **name disagreements, do not
re-score, report them ahead of the edge.** Started 01:51:21, filed 01:55 (`date +%T` at both ends). Machine L. Nothing committed.

**I do not re-score. No count below replaces the scorer's.** Where I disagree, the disagreement is the finding.

## 0 · The scope I read under, and the design defect it exposes — read this first, it bounds everything after

My read-lap voiding list forbade `exo_memory/loop/`, `exo_memory/handback/`, `exo_memory/librarian/` and
`exo_memory/map/<LETTER>.md`. This dispatch says that list still binds AND names an object inside `exo_memory/loop/`.
I took the narrow reading and did not raise it, because the dispatch names its own object: **I read exactly the result
file and the registration it cites, the two object files, my own hand-back, and the world by command. I did not open
A's or B's hand-backs.**

**Consequence, and it is a defect in the design rather than in the scorer:** §5.2 asks the auditor to check the
scorer's list, and the exclusivity half of every edge item — "found by B, found by neither A nor E" — can only be
settled against A's and B's files, which my condition forbids. So **this audit can confirm the CLAIMS and cannot
confirm the EXCLUSIVITY, except against my own list, where I did check all five.** Any future run must either
release the auditor from the reader list (keeping the self-hit rule) or give exclusivity to a second seat. As it
stands, §5.2's audit is only partly performable by the seat §5.2 names.

## 1 · DISAGREEMENTS, ahead of the edge

**D1 · The rejection of R8 is not settled by the command given, and it is the one rejection I would not have made.**
The scorer excluded B's R8 (the README's `S3` requirement may be unmeetable on modern machines) because
`powercfg /a` reports Standby (S3) available here. I ran it:

    powercfg /a   →   available: Standby (S3), Hibernate, Fast Startup
                      NOT available: S1, S2, "Standby (S0 Low Power Idle) — the system firmware does not support this"

The fact is right and the inference does not follow. **B's claim is about the README's requirement travelling to other
machines, not about this one** — and the runner ships expressly for other machines (`dream_cycle.ps1:84-85`, "The
FRAMEWORK ships instead (dev/dream/, dev/shell/) so anyone can grow their own"). A one-machine probe cannot settle a
portability claim, and **this machine is precisely outside the population B named**: it is an S3 machine that does not
support S0 Low Power Idle, i.e. the opposite of the modern-standby laptops the item is about. I would have recorded R8
as **UNSETTLED BY THIS COMMAND** — B marked it unsure — rather than excluded. Note the direction: this disagreement
would ENLARGE the edge, against my own stake (§3).

**D2 · Item 2's cited command does not settle item 2's claim.** `sed -n '33,36p' dev/dream/dream_cycle.test.js` shows
`const RAW = fs.readFileSync(SCRIPT, 'utf8')` at module scope — the location only. It does not show "throws before any
test registers", nor "surfaces as a stack trace, not as a named failing guard". Those are runtime claims. I settled
them by running it:

    cp dev/dream/dream_cycle.test.js <scratch>/noscript/ ; cd <scratch>/noscript ; node dream_cycle.test.js
      → node exit 1 · stdout 0 lines (`grep -c "" out.txt` → 0) · stderr: ENOENT ... open '...\dream_cycle.ps1'

Zero lines of stdout means no test registered and no named guard failed. **The claim is TRUE and is now settled — by a
run, not by the sed.** The disagreement is with the evidence column, not the verdict.

**D3 · Item 2's type, and a gap in §3.3 the run exposed.** §3.3 defines PAGE-REVEALED as "on the page and requires
only reading it correctly". Discovering item 2 needs only the page, so PAGE-REVEALED is right for the ITEM — but its
verification required executing (D2), and §3.3 types items, not verifications. I keep the scorer's label and record
that **"the item is PAGE-REVEALED and its verification is RUN-REVEALED" has no cell in the registration.** Not an
error by the scorer; a definitional gap to fix before a run 4 quotes these types.

**D4 · Item 1 is verified, and the cited command verifies less than the item says.** `sed -n '71p'` prints
`assert.match(CODE, /\$idle\s+-lt\s+\$IdleMinutes/,` — the regex, not the consequence. The item's claim is that an
equivalent reversed comparison fails while the property holds. I settled it by mutating a copy:

    <scratch>/reversed: `if ($idle -lt $IdleMinutes)` → `if ($IdleMinutes -gt $idle)` ; node dream_cycle.test.js
      → 6 pass, 1 fail — the failing test is "the idle threshold is a parameter, not a literal in the branch" (:68-73)

Equivalent semantics, same property, test red. **Item 1 STANDS on a stronger footing than the table gives it.**

**D5 · Item 1 is site-exclusive, not class-exclusive, and the table does not say so.** Under §3.4 (same site AND same
wrong thing) item 1 is correctly exclusive: B's site is `:71` (operand order), mine was `:53` (the quoting of
`-Name "consonance"`, my item 25, "the same code written `-Name 'consonance'` fails the test with no defect
present"). **Same class — an assertion pinned to an incidental lexical form — at two different sites.** By the
registration's own unit the scorer's treatment is right and I do not re-score it. I record what the unit buys:
**under a class-level unit the edge would be four items, not five**, and since §3.4 exists because L045's units moved
after the fact, the alternative number belongs beside the member list rather than only in an auditor's file.

**D6 · Item 4 is thin and is published without its weakness.** `sed -n '18,20p' dev/dream/README.md` confirms the
block is `git pull` then `powershell -ExecutionPolicy Bypass -File dev\dream\install_dream.ps1`, and confirms the
claim that no working directory is stated. But the failure mode is loud, not silent: `git pull` in a non-repo
directory fails with a message before the second line runs, so a new machine gets an error rather than a wrong
install. I would have kept the item and published that qualification with it.

**D7 · An item I verified that the scorer's command does not reach — item 3's second half.** `sed -n '26,41p'`
shows five bullets; the claim is that two of them are not guards. I checked the stronger form — that nothing in the
runner implements them:

    grep -cin "powered-off\|mine the dream\|never mine" dev/dream/dream_cycle.ps1   →   0

So "Powered-off nights are dreamless sleep" and "Never mine the dreams" correspond to no check in the runner at all.
**Item 3 stands, and on this evidence rather than on reading alone.**

**D8 · §5's finding about me is CORRECT and I concede it.** `grep -n` on my own hand-back: `:5` reads
"~7 minutes", `:125` still reads "I time-boxed at ~31 minutes". The carrier-problem reading is right — I fixed the
figure where I found it and left the copy fourteen lines on. **I have not edited the file**: it is the scored
artifact, and repairing it after scoring would destroy the evidence the finding rests on.

## 2 · WHERE I AGREE — the five edge items, re-run

Every command in §1's table reproduces, run by me on L:

    1  sed -n '71p' dev/dream/dream_cycle.test.js         the regex is /\$idle\s+-lt\s+\$IdleMinutes/        CONFIRMED (+D4)
    2  sed -n '33,36p' dev/dream/dream_cycle.test.js      readFileSync at module scope                       CONFIRMED (+D2)
    3  sed -n '26,41p' dev/dream/README.md                5 bullets; 2 are doctrine/prompt rule, not checks  CONFIRMED (+D7)
    4  sed -n '18,20p' dev/dream/README.md                pull + repo-relative -File, no cwd stated          CONFIRMED (+D6)
    5  grep -ci "test" dev/dream/README.md                → 0                                                CONFIRMED

**Exclusivity against MY list, the half I am permitted to check** (`grep -in` over
`handback/p-third-run-read-E_2026-09-20.md`): `:71` absent (0 hits); `dream_cycle.test.js:35` absent (my only `:35`
is `install_dream.ps1:35-46`, my only "load" hit is the phrase "all load-bearing"); "not guards" absent — my `:26-35`
item is the OMISSION of the presence guard, a different wrong-thing at the same site, so §3.4 keeps them distinct;
"working directory"/"repo root" absent; "how to run"/"never mentions a test" absent. **All five are genuinely not
mine.** Against A's list I cannot check (§0).

I also agree with three rulings I could test the reasoning of: P2's inference WITHHELD at one reader per condition
(§2); P3 printed and declared uninformative (§3); and the §4 finding that the brief's map-line order is a defect in
the brief — it split the two no-open readers, which is L045's ambiguity in a weaker place.

## 3 · My stake, named where it bites

I am the world reader auditing the list my own condition had the most access to produce, and the edge is five items my
condition did not find — every one of them a mark against my read. **My incentive runs toward shrinking this edge.**
What I did with it: all five confirmed, two strengthened (D2, D4), one rejection challenged in the direction that
would make the edge LARGER (D1), and the one finding against me conceded and left unedited (D8). The disagreements
that matter here run against my stake, which is the only evidence about it I can offer from inside.

The chair's replacement rule (had the draw named the text-only reader, the auditor alone would be redrawn) is not
mine to relitigate and I do not.

## 4 · NOT VERIFIED

- **Exclusivity against A's list, and every overlap ruling** — the scorer's "B's R2, R6, R9, R12 and C2 overlap A's or
  E's items" is unchecked by me: it needs A's and B's hand-backs, which my condition forbids (§0).
- **That B's ids (T10, T15, R5, R11, R13) carry the claims the table attributes to them.** I audited the claims as the
  table states them, not as B wrote them.
- **§5's figures for A and B** ("about 4 minutes wall", "about 15 minutes") — same reason. Only my own row is checked.
- **The pre-known item declared in §6** — that the chair had to show a non-empty text-only list was producible. I take
  the declaration as given; I did not try to identify which item it was, and identifying it would need the object
  choice's own file.
- **F3's echo check and the sealed-assignment comparison** — done by the scorer before the reads; I did not repeat it.
- **Whether S0-only machines actually break the dream** (D1). I showed the command does not settle B's claim; I did
  not show B's claim is true. It needs a machine that reports no S3, which I do not have.
- **The scorer's `[unverified]` discipline** — §5.2(1) requires items verified with no reproducible check to be marked
  and excluded. Every item in §1 carries a command, so I had nothing to test that rule against.
