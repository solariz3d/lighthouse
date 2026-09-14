# P-DIVERGED · CHARLIE's second read — both hand-backs against the landed code, and the falsifiers on D

Lap L058 (third use), 2026-09-14 ~08:47–09:20, **machine D** (DESKTOP-EEGVFMT), seat C (Around).
- **Read at:** `C:\Users\nname\Desktop\lighthouse`, HEAD `108746b`. The P-DIVERGED code is `862509f`, merged at
  `158fd1e`. No commit since touches `dev/` or `consonance/` apart from `dev/TAKE-STICK.ps1`.
- **Packet:** `exo_memory/loop/packet_diverged_2026-09-14.md`, §2 as re-ruled in §2.8 (6397e1a).
- **Hand-backs:** `handback/p-diverged-A_2026-09-14.md`, `handback/p-diverged-E_2026-09-14.md`.
- **No edits.** What I ran: the three JS suites, one `cargo test` into a scratch target (`consonance.exe` pid 4792
  runs from `target/release`, which was never written), and two read-only node scripts over D's transcripts, the
  attic, the receipt and the stick's ledger. Nothing touched the stick except reads. A's mutation harness was running
  on its own copy throughout (`dev/.tail-carry.mutant-25044.js` present); I did not run mutants.

---

## 0 · VERDICTS

1. **A built §2.1–2.4, the forwarding half of §2.6, D-1 and D-7 as ruled.** A made three additions; I accept all
   three (§1).
2. **E built §2.5, the app half of §2.6, D-2 to D-6, D-1's window half and (e) as ruled.**
3. **E's addition — `rehearsal_is_quiet` false on ALREADY_APPLIED and APPLIED_AND_GREW — is RULED: ACCEPT.**
   Without it D-1's window half cannot be reached (§2).
4. **None of packet §4's four falsifiers fired on D's real run at 08:41**, each re-derived independently of the
   librarian's scoring (§3). Falsifier (iii) is now proved byte for byte for main, not by size alone.
5. **I found no defect in the landed code against §4.** The findings in §4 are a cargo count that differs from E's,
   a corrected probe of my own, a record point, and a prediction for the return leg.

---

## 1 · A's HALF, AGAINST THE CODE

| Ruling | Landed at | As ruled |
|---|---|---|
| §2.1 flag | `tail-carry.js:1399` parse; `:1401` help; `:1372` default `takeStick: []` | yes |
| D-1 verdict | `:937`: `size > pend.toOffset && hashRange(dest, 0, pend.toOffset) === pend.fullSha` → APPLIED_AND_GREW. Placed after the ALREADY_APPLIED and INTERRUPTED tests, before the take. | yes |
| §2.2 take | `:943-947`: only a row that would otherwise reach DIVERGED at `:948`. No earlier branch reads `takeStick` (`:787` is its only other use). | yes |
| D-1 settle | `:1001` SETTLES; `:1009-1015`: `grew` settles at `pend.toOffset`, needs `fileSize > toOffset` and the span sha. The seat's file is not written. | yes |
| §2.3 apply | `:1041-1057`: `atticPath(…'take-stick'…)`, then copy, read-back, truncate to `pend.offset`, append, verify whole (`:1066`), advance the ledger | yes, plus addition 1 |
| D-7 | `:173` CARRIES.import includes RETIRE_THEN_APPEND; a DIVERGED row carries `bytes` | yes |
| §2.4 fields | `:1302-1307` ownBytes (APPLIED_AND_GREW counted past `toOffset`), `:1329` takeable | yes |
| §2.6 forward | `stick-apply.js:80` accepts and forwards `--take-stick` | yes |

**The three additions, each ruled:**
1. **The attic copy is read back before the truncate** (`:1051`). ACCEPT. It is the only step that destroys this
   machine's continuation on purpose, and on failure nothing is truncated. It costs extra reads, which the real run
   absorbed: main is 260,898,687 B.
2. **Debt (a) extended to OURS.** ACCEPT. The read does no settle-wait and decides no verdict; it fills the column
   the keeper saw as "unknown" on the reopen after his own export.
3. **D-7 breaks the "bytes is 0 when carries is false" invariant for DIVERGED rows.** ACCEPT. Its consumers are
   `stick.js`'s DIVERGED cell (`:100`) and `diverged_offer` (`sync_launch.rs:1282`). Nothing sums it.

**A's counts, re-run on D's tree:**

    node dev/tail-carry.test.js       129 passed, 0 failed
    node dev/stick-apply.test.js       27 passed, 0 failed

**Not verified by me:** A's mutation run. It was 62 of 90 at the handback, with none of the 21 new mutants scored;
A is scoring it now.

---

## 2 · E's HALF, AND THE RULING ON E's ADDITION

| Ruling | Landed at | As ruled |
|---|---|---|
| D-3 | `sync_launch.rs:1243` `diverged_offer`, beside `offer_for` | yes |
| — | `:1264` `offers_for_rows`, the single builder | yes |
| D-4 | `SeatChoice::None` with tag `"none"` (`:955`); `stick.js:88` checks neither radio | yes |
| D-5 | `stick.js:141` routes TAKE by `data-verdict`: DIVERGED → `take_stick` | yes |
| D-6 | `stick.js:158` change listener; `complete()` excludes kept rows | yes |
| §2.6 | `main.rs:10662` `take_stick: Vec<String>`; `:10667` is_sid chain; `:10691` forwarded; `:10711` logged | yes |
| D-2 | `sync_launch.rs:1210-1214`: an export stop is quiet only when its reason is UNIMPORTED_TAIL and its sid is in `kept_sids`, which is filled from kept import stops | yes |
| D-1 (E) | `stick.js:111-112`: HEALS make Carry actionable | yes |
| (e) | `sync_launch.rs:1297` `withheld_line`; persist.log 1789396830 shows the new sentence four times | yes |

**The ruling on E's addition (`sync_launch.rs:1194`): ACCEPT.** Checked at source:
- `stick.js:190` releases the seats and never renders when `reh.quiet && !state.result`.
- A row that is ALREADY_APPLIED or APPLIED_AND_GREW neither carries nor stops.
- Without `:1194`, the Carry that D-1 (E) enables at `stick.js:111` would sit in a window that closed before
  anyone saw it, and the heal still could not start from the window. `:1194` is what makes D-1's ruling reachable.

What it costs, and why that is acceptable:
- Such a seat reopens the window at every launch until a Carry heals it.
- That was already true in practice: the same seat's export refuses UNIMPORTED_TAIL, and D-2 quiets that only for
  a *kept* seat. A heal row gets no offer, so it cannot be kept.
- The addition therefore adds no new window openings. It changes only which side names the reason.
- **No loop:** after a successful Carry, `pending` is null and the row reads NOTHING_PENDING. The 08:41:17 relaunch
  shows `quiet=true` after a take.

E's own caveat is right: a Continue leaves the ledger wedged, and the next launch asks again. That is the correct
behaviour for a wedge.

**E's counts, on D's tree:**

    node consonance/ui/stick.test.js                      15 passed, 0 failed
    cargo test --bin consonance -- --test-threads=1       608 passed, 1 failed, 4 ignored   (scratch CARGO_TARGET_DIR)

The one failure is not E's; see §4 F-1.

---

## 3 · THE FALSIFIERS ON D'S REAL RUN — re-derived, not quoted

**The run, from `C:\Consonance\data\persist.log`:**

| Epoch | Row |
|---|---|
| 1789396830 (08:40:30) | STICK FOUND; RESUME, effects HELD |
| 1789396831 | `STICK REHEARSED quiet=false verify=0 import=1 export=1` |
| 1789396870 | `STICK APPLIER started … take_stick=[` all seven sids `]` |
| 1789396876 | relaunch, STICK RESULT present |
| 1789396877 | `quiet=true verify=0 import=0 export=0` |
| 1789396888 | RELEASED, 0 kept |
| 1789396890-907 | four panes `-> RESUMED`, three fixed seats `confirm held` |

**My script** (`<scratchpad>/falsify.js`, using the tool's own `hashRange` and `place.paneJsonl`) reads, for all seven
seats in the stick's `ledger.json`, the transcript, the attic, and `~/.claude/consonance-carried.json`:

| Seat | pending | agreed.offset | live | prefix [0, agreed) == prefixSha | attic `*-take-stick.jsonl` |
|---|---|---|---|---|---|
| main | null | 271,529,253 | 272,076,467 | **true** | 1, 260,898,687 B |
| librarian | null | 50,883,382 | 51,519,998 | **true** | 1, 44,618,042 B |
| third place | null | 41,061,820 | 41,415,481 | **true** | 1, 36,698,651 B |
| 6fe15f0a | null | 10,331,886 | 10,737,040 | **true** | 1, 2,745,565 B |
| 12fb81f6 | null | 2,241,298 | 2,241,567 | **true** | 1, 1,323,399 B |
| 0845a868 | null | 3,204,352 | 3,844,286 | **true** | 1, 1,484,353 B |
| a2122153 | null | 6,839,686 | 6,839,956 | **true** | 1, 2,358,589 B |

- **(i) still DIVERGED after TAKE: did not fire.** `pending` is null on all seven, and the relaunch rehearsal is
  `import=0 … quiet=true`.
- **(ii) fresh, or a launch-minute first timestamp: did not fire.** Each transcript's first timestamp is its
  conversation's first (main 2026-06-30T08:05:32Z, librarian 2026-09-01T13:36:17Z, third place 2026-08-25T17:13:55Z;
  panes 09-09 and 09-12), and none is the launch minute. For main and the librarian I checked the receipt's `line`
  against the tool's `conversationKey(file).line`: **equal** (`<scratchpad>/attic_vs_stray.js`).
- **(iii) no attic file holding D's pre-truncate bytes: did not fire, and proved byte for byte for main.** The attic
  file `0c0c0c0a-…a01.20260914-084111-take-stick.jsonl` has the **same sha256 over its whole length** as D's own torn
  09-12 22:58 export still on the stick (`…0-260898687.tail.writing-25288`), which my preflight identified as D's
  12:53–12:57 turns. Its `[0, 260,427,744)` also hashes to the old agreed `8071c253…`. So the attic holds exactly D's
  fork: shared prefix plus D's own continuation. The other six are shown present and stamped, not byte-compared.
- **(iv) size or sha different from the carried record: did not fire.** A successful apply writes
  `agreed = {size, sha}` only when `size === toOffset && sha === fullSha` (`tail-carry.js:1063-1071`). The current
  file's `[0, agreed.offset)` still hashes to `agreed.prefixSha` on all seven. What lies past `agreed` (269 B to
  639,934 B) is D's own writing since 08:41: resume appends and this morning's turns.
- **The idea file's third falsifier** (an export reports DONE while a carried seat's file is longer than its written
  `toOffset`): no export has run on D since the take, so it is **un-run**. Two things bound it:
  - Debt (b)'s new UP_TO_DATE requires `size === pend.toOffset`, so it cannot produce the "longer" case.
  - `stick-waiter.js:330` reports NOT DONE for any non-zero export code, so a stopped seat cannot read DONE.

---

## 4 · FINDINGS — each a sentence that could be wrong

**F-1 · `cargo test` on D is 608/1/4, not E's 609/0/4.** The one failure is
`ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`, panicking at `main.rs:15124`.
It is the same D-only failure I measured red at HEAD on this machine on 09-09 (`handback/p-seat-sweep_2026-09-09.md`
§5), before any P-DIVERGED code existed. The totals agree (608 + 1 = 609). **Not a P-DIVERGED defect**, but "609/0/4"
is L's figure and should not be quoted for D.

    cd consonance/src-tauri && CARGO_TARGET_DIR=<scratch> cargo test --bin consonance -- --test-threads=1

**F-2 · A self-correction before anything was kept.** My first script compared the receipt's first timestamp to the
file's by regex. They differed in the millisecond (main `.435Z` vs `.436Z`), because the regex took the first
`"timestamp"` key rather than the first timestamped *line*. Against the tool's own `conversationKey`, the lines are
**equal**. No defect.

**F-3 · The take covered seven seats; the recorded decision names two.**
- `loop/keeper_decisions_2026-09-11.md` (871ad66) records "The laptop's (Recommended)" for main and the librarian.
- The window required an explicit per-seat choice (`complete()`, `stick.js:151-154`, nothing preselected), and
  persist.log 1789396870 shows TAKE forwarded for all seven. So the keeper's word covers seven, given at the window.
- **A record point, not a code defect:** the decisions file is now a carrier that under-states what was chosen.
- D's own bytes past the old agreed state were small for three seats: 12fb81f6 3,735 B, a2122153 3,684 B, 0845a868
  3,635 B (attic size minus old offset). That is consistent with launch appends rather than work.

**F-4 · The return leg will read DIVERGED on L for any seat L resumed after its 07:59 export.**
- The stick's ledger agreed state is now L's 07:59 `toOffset` (main 271,529,253; tail file
  `…260427744-271529253.tail`, 07:59).
- If L launched even once after that export, each resumed seat on L grew about 267 B (handoff (b)). Tonight's import
  there would then read DIVERGED with `ownBytes` of a few hundred B.
- The door exists on L now, so this is a choice rather than a wedge. The keeper should expect it, and the window's
  `ownBytes` will say how small L's side is.
- **Not verified:** whether L launched after 07:59. That needs L's `persist.log`.

---

## 5 · WHAT I DID NOT VERIFY

- **A's mutation run** (in progress, A's), and **E's 16 mutants**: I read E's table only and did not re-run it.
- **The window as rendered in WebView2.** I read `stick.js` and ran its stub-DOM suite; I did not watch the 08:41
  window.
- **The per-row verdicts of the 08:41 apply.** `stick-apply.result.json` is deleted after it is shown
  (`stick_ack_result`). A take-stick attic file exists for all seven and that tag is written only in the
  RETIRE_THEN_APPEND branch (`:1047`), but I did not see the rows themselves.
- **Byte-level (iii) for the six seats other than main**: present and stamped, not compared, because no
  independent copy of D's pre-take files exists for them.
- **A hard kill mid-take**: reasoned at my first read, not run.
- **Anything on L**, including F-4's precondition.
