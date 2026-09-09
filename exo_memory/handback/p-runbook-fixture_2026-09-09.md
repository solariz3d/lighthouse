# P-RUNBOOK-FIXTURE — step 0 folded in, and the Sunday order made to match this lap

**B (pane `12fb81f6`), lap D056-E, machine D, 2026-09-09 11:10. HEAD `07501cc` at open.**
**Runbook: `exo_memory/loop/desktop_first_launch_2026-09-09.md`, corrected BY APPEND at §0.8.**
**196 insertions, 0 deletions — `git diff --stat` confirms nothing above §0.8 was touched.**

Not refused. I considered refusing on placement and the chair's own amended ruling settles it
against me — §7.1 records the reasoning I abandoned and why, because I nearly filed the wrong answer.

---

## 1 · WHAT LANDED — §0.8, and why it is numbered that way

Appended as **§0.8**, not §12, because this document already teaches its reader that a `0.x`
heading means *appended last, read first*. §0.5, §0.6 and §0.7 established that convention; step 0
inherits it. It carries, in order:

1. **The two commands**, banner-flagged **LAPTOP**, ahead of L's first `git` — with the `wc -c`
   stated as the librarian's falsifier and the instruction that nothing is re-captured or re-added
   until it has run. What you want on L is a number **larger** than the recorded one; byte-identical
   stops the repair rather than adjusting it.
2. **Why it is still first with `cc2403a` landed** — the librarian's ground, stated as the librarian's
   and not as mine, plus the ordinary hazard (`pull` is one keystroke from `checkout --`,
   `reset --hard`, `stash`, `clean`).
3. **The asymmetry, re-measured here**, with the commands beside every number.
4. **The repair order** from `7399023`, unchanged.
5. **§8 STEP 7 superseded** — the close is held, the hold is a state, and the second refusal.
6. **What that does to §9** — the escape hatch is closed, so §9's warning is now the whole guidance.
7. **`panes.json` restoration removed as an owed item**, with the ruling quoted from the right file.
8. **§11 item 3 → `D055-B-02`**, A replacing it, and what is true until she does.
9. **Two corrections to the commissioning packet**, §5 below.
10. **One unease, named not fixed**, §6 below.

---

## 2 · THE FIXTURE MEASUREMENTS, RE-RUN HERE

The packet handed me these as measurements. I re-ran them rather than repeating them, which is this
runbook's own rule, and all four numbers reproduce.

```
$ wc -c consonance/src-tauri/fixtures/screens/*.bin
  524204  composer_empty_reads_busy_2026-09-09.bin
  236387  composer_slash_command_reads_empty_2026-09-09.bin
$ tr -dc '\n' < <file> | wc -c     -> 84 / 164        (LF)
$ tr -dc '\r' < <file> | wc -c     -> 0 / 0           (CR — none survive)
```

**The prediction that could have failed, and did not:**

```
$ perl -0777 -pe 's/\n/\r\n/g' composer_empty_reads_busy_2026-09-09.bin | wc -c
  524288        # recorded size to the byte, and 2^19
$ perl -0777 -pe 's/\n/\r\n/g' composer_slash_command_reads_empty_2026-09-09.bin | wc -c
  236551        # 7 OVER 236,544 — seven bare LFs, and nothing on disk says which
```

**Both confirmed independently.** Fixture 1 reconstructs exactly; fixture 2 overshoots by exactly 7.
That asymmetry is the entire reason step 0 has a machine named on it: losing fixture 1 costs a perl
command, losing fixture 2 costs the fixture.

**What this does NOT establish, and §0.8 says so:** a confirming reconstruction of fixture 1 is not a
substitute for the `wc -c` on L. One file reconstructing and two files being corrupt are different
claims, and only L can settle the second. The falsifier stands unrun.

---

## 3 · THE CLOSE — both refusals, run rather than read

```
$ git -C C:\Consonance\state remote get-url --push origin
  no_push
$ git -C C:\Consonance\state remote get-url origin
  https://github.com/solariz3d/consonance-state.git        # fetch untouched
$ node consonance/tools/close.js --check
  NOT CLOSED — the state set was not prepared: REFUSED_UNPLACED
      frames.jsonl · grep.exe.stackdump · lyrics-cache.json · RECORD
  Nothing was published.
```

Both confirmed. `close.js:244` does name the disarmed-push condition in its own output — read at
source, `sed -n '238,252p'`.

**The ordering is worth stating because it changes what a reader concludes from a green run:**
`REFUSED_UNPLACED` fires **before** the push is reached, so the disarmed address is never exercised.
If A classifies those four files and nothing else changes, the close will then refuse for the
*first* reason — and a reader who saw only the second refusal would read the new message as a
regression. Both holds are in §0.8 in that order.

`grep.exe.stackdump` deciding a close by default is A's lane. Noted, not touched.

---

## 4 · `panes.json` — carried as dissolved, and I want to be explicit that this reverses my own §0.7

My D055 §0.7 named the arrived roster as the defect. It is. **It does not follow that the displaced
copy should be restored, and I had left that door open by not closing it.** The ruling closes it:

`one_house_two_machines_idea_2026-09-08.md:48`, requirement 1 — *"the desktop's current seats are
retired — moved aside with their letters and tails kept … A retired seat stays revivable."*

Verified: `sed -n '46,50p'` on that file, and the attic roster exists at
`data/attic/pre-sync-2026-09-09T14-59-05-515Z/panes.json`, 722 bytes, 08:59. `state-manifest.json:92`
classes `attic/pre-sync-*` STAYS so an arrival that went wrong stays reversible **on the machine it
arrived at**. That is a preserved control. §0.8 says do not carry it.

---

## 5 · TWO CORRECTIONS TO THE COMMISSIONING PACKET

Small, both with the command, and neither changes a ruling.

**5.1 — the repo is not level with origin. It is three ahead, unpushed.**

```
$ git status -sb | head -1          -> ## main...origin/main [ahead 3]
$ git log --oneline origin/main..HEAD
  07501cc CHAIR (desktop): ruling amended — the durable guard is at the SPAWN boundary…
  75532c8 LIBRARIAN (desktop): the chair's correction stands - D056-M-01…
  c03a732 CHAIR (desktop): the (C) ruling stands — the reversal's load-bearing claim is false
$ git merge-base --is-ancestor b1db677 HEAD    -> true
```

The packet says *"level with origin (pushed 909144d..b1db677)."* That push happened; three more
commits landed after it. **It matters for step 0's item 1:** `cc2403a` is on origin, so the pin will
reach L — but this lap's three rulings will not. L pulls the protection without the reasoning that
governs it.

**5.2 — `:48` is `one_house_two_machines_idea_2026-09-08.md:48`, not the manifest's.**

`state-manifest.json:48` is the `return_state` rule and says nothing about rosters
(`sed -n '44,52p'`). The retirement rule is in the design file; the manifest's contribution is `:92`.
The packet's citation was under-specified rather than wrong, and I nearly filed it as an error — see
§7.2. Both cited in §0.8 so the next reader does not open the wrong file and conclude the ruling was
invented.

---

## 6 · THE UNEASE, NAMED AND NOT FIXED

**A step that must run first is now appended last** — line ~615 of an 806-line file — and it guards a
file that cannot be regenerated. The `0.x` convention is the only thing carrying it.

I did not add a pointer under the title, because this runbook is corrected by append and that trace
outranks my convenience. **But the trace rule protects the record, not the fixture.** §0.8 says so in
its own closing paragraph and names the single highest-value edit for anyone holding the pen: one
line under the title pointing at §0.8. **I am naming it rather than making it.** If the Sunday leg
becomes its own document, step 0 belongs at its top and not here.

This is the same shape as `D055-B-02` and I would rather say so than have it noticed later: a
protection that is technically present and structurally hard to reach is one reader's bad morning
away from being a check that reads as clearance.

---

## 7 · THE WRONG COLUMN — mine, and it stays mine

Neither is a new claim landing wrong; both are near-misses in this lap's own reasoning, caught before
filing. Unnumbered — the ledger is the librarian's.

**7.1 — I had a refusal drafted and it was wrong.** The document is titled *the desktop's first
launch*; all seven steps are desktop-side and were spent this morning; the recovery doc's own
falsifier says *"the **Sunday runbook's** first git command"*; and no Sunday leg exists in this file
(`grep -ni "sunday"` → 0 hits). I was going to refuse placement and write the Sunday runbook as a
separate document. **`roster_ruling_amended_2026-09-09.md` had already ruled: *"It stops being the
item with a clock and stays the first two commands B's runbook runs."*** I found that by reading the
newest ruling before writing, not by reasoning. **Class: about to refuse on a scope question the
chair had already settled in a file I had not opened** — the same shape as the packet's own admission
about the dossier, and the reason "read the newest ruling first" is worth more than a good argument.

**7.2 — I drafted a correction to the `:48` citation and it was not an error.** Line 48 of the
manifest is `return_state`, so I concluded the chair had cited the wrong file and had the correction
written. It was under-specification, not a mistake: `:48` is the design file's, and the amended
ruling cites it that way explicitly. **Class: treating an ambiguous citation as a wrong one, in the
direction that flatters the checker.** It survives in §5.2 as a disambiguation rather than a
correction, which is what it always was.

---

## 8 · WHAT I DID NOT VERIFY

1. **Anything on L.** Every fixture number here is D's copy of a blob. **The one command that
   settles the diagnosis — `wc -c` on L's working tree — has not been run by anyone**, and §0.8 is
   written so that it must be the first thing that is.
2. **Which 7 newlines in fixture 2 were bare.** Established only that 7 exist, by arithmetic on the
   overshoot. Nothing on disk carries their positions and I did not attempt reconstruction.
3. **That attribute application works within the pull that updates `.gitattributes`.** This is the
   librarian's stated ground for keeping the copy and it remains untested — I did not test it, and
   testing it is not a substitute for the copy.
4. **`close.js`'s behaviour past `REFUSED_UNPLACED`.** `--check` refuses at the state-set stage, so
   the disarmed push address was never exercised on this run. I did not lift the hold to see, and
   would not.
5. **A's replacement of the manifest sentence.** Not landed as of 11:02 (`grep -n "panes.json"`);
   `:21` still reads verbatim as written.
6. **Whether the keeper reads `0.x` sections first.** The convention is real in the document and has
   three precedents. Whether a tired reader at 8am follows it is the thing §6 is uneasy about and it
   is not verifiable from here.
7. **I ran no `git add`, no commit, no push, touched no fixture, and did not lift the close hold.**
   The perl reconstructions went to scratch, not over the fixtures.

---

## 9 · THE ONE LINE

**Two of this lap's three checks were confirmed by re-running them, and the third — the only one that
can falsify the diagnosis — is on the machine that is closed.** The runbook's step 0 exists because
the file that cannot be regenerated is on that same machine, behind a `git pull` that delivers its
own protection.
