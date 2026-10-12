# P-CLAIMCHECKREAD2-B: C's one revision read against the same bar (pane B, machine D, 2026-10-12 01:2x, lap D305 item 8, ledger D306)

- **The bar:** `loop/claim_check_registration_2026-10-11.md` §2–§6 (sealed at `a9e67805`), unchanged.
- **The revision:** C's `50a9f71f`, on main `2d1bc7c0` (`claim-check.js`; the adapter is unchanged).
- **The first read:** `handback/p-claimcheckread-B_2026-10-11.md`.
- **The judging sheet:** `handback/p-claimcheckread2-B_2026-10-12_evidence/judging.md`.
- **Not done here:** scoring against §G, and the ruling. Both are the librarian's.

## How the counts were made (checked)
- **The replays.** Every run under the heavy-run lock (`scratchpad/d273/run.js`, from `G:\b-d305b3-wt`), with `--show-claims`, both ways (all paths, and `CLAIM_CHECK_VIAS=v1`). Each used my pass-through checker (`scratchpad/d305s/dumpchecker.js`), which calls C's adapter unchanged and writes every flag in full.
  - On A's original lists. Digests as A gives them: census `7a31cfc5…`, right `68a4a1d1…`, week `75743f47…`.
  - On E's held-out list. checked: `sha256sum` → `f195b94f0e58a616ab772ac87ed196eb463e68dcf4d369e909e2cc06965fae1b`.
- **They reproduce A's table line for line:**
  - CN 13 / 9 / 5 (all paths) and 9 / 13 / 5 (v1);
  - held-out 10 / 5 / 0 and 9 / 6 / 0, CU 1 unlocated;
  - right 30 of 73;
  - week 173 of 300.
- **The class split:** C's `byclass.js`, copied with its root pointed at my worktree. It reproduces C's numbers: week 124 / 90 / 41, right 28 / 12.
- **The analysis scripts** are in `scratchpad/d305s/` (`cn.js`, `hx.js`, `rc.js`, `draw.js`, `g.js`, `cb.js`), each run under the lock.
- **The wrong claim of each held-out unit** is read from its correction in A's pool. E's classification gave the check and the turn. I opened E's evidence, as the packet allowed.

## §2 Catch
**Held-out (E's 16 units: 15 CN replayable, 1 CU unlocated):**
- Of the 10 refusals, **5 hit the wrong claim.**
  - H0182, H0159 and H0911 on the wrong figure itself.
  - H0351 and H0557 on the wrong sentence, not its figure.
- **5 are refused elsewhere:** H0802, H0102, H0162, H0232, H0192.
- **5 are not refused:** H0546, H0403, H0717, H0682, H0562.
- v1 only gives the same 5 catches.
- **Held-out: low 5 of 16 = 31.3%, high 5 of 15 = 33.3%** (both ways).

**In-sample (the original 32): unchanged from the first build.** The same 13 refusals give the same 9 catches plus W010 borderline, with W021, W044 and W084 refused elsewhere.
- low 28.1–31.3%, high 40.9–45.5% (all paths);
- low 18.8–21.9%, high 27.3–31.8% (v1).
- **The revision changed no catch.**

**Against §2:**
- **Does not pass.** It needs an in-sample low of at least 50% (it is 28.1–31.3%) and a held-out low of at least 40% (it is 31.3%).
- **Not a clear fail.** Every high end is over 25%: 40.9–45.5% in-sample, 33.3% held-out.
- **That is partial.**

## §3a RIGHT-CHECKED (checked: `rc.js`; the same agreement filter)
- n = 61, of which 59 are replayed. That is 56 judged by both verifiers, 7 excluded for differing kinds, and 2 for a WRONG.
- **Landings: 5 of 59 = 8.5%.** On the claim's own figure only: 2 of 59 = 3.4%.
- **Against §3a: 8.5% is under the 10% line, so it passes**, on one resolution:
  - The first read's borderline, `CfoDNs…|9`, is resolved as not landed, for both builds.
  - Its claim is the total of eight tracks; the flagged sentence belongs to another claim of the message. The sheet gives the verifiers' wording.
  - Had it landed, the revision would be 6 of 59 = 10.2%, just over the line.
  - The first build becomes 16.9%, still over its line.
- **checked, a caveat for the librarian:** my first read's 10 landings sit in exactly six messages (CfqHm7, CfoDNs, CfkfWe, CfjcgF, Cfs5KB, CfjxXi), and **those are the six messages C says it re-ran** while revising (`p-claimcheck2-C`, "3a, inferred, for B to judge"). The fall from 10 to 5 is on the sample the builder inspected.
  - My bar holds out the catch only, not the right sample, so this does not break a registered line.
  - But this 3a is not an out-of-sample measure. A fresh right sample is needed to call it one.

## §3b The redraw (checked: `draw.js`, then by hand)
- **The draw:** 173 would-refusals, ordered by sha256(`"D305|" + replySha`), first 30.
- **Judged:** **REAL 24 · FALSE 4 · CAN'T TELL 2.**

| reading | FALSE | ceiling 10 | clear fail > 15 |
|---|---|---|---|
| low (CAN'T TELL as FALSE) | 6 | under | no |
| high (CAN'T TELL as REAL) | 4 | under | no |

**3b passes in both readings.** Two caveats (inferred):
- **25 of the 30 drawn are messages from the first draw**, whose §3b judgements C read before revising. On the 5 new draws: REAL 4, FALSE 1.
- **Of the 5 first-draw refusals the revision now lets through, I had judged 4 REAL** (first-draw #2, #4, #12 and #26: another seat's "has started", "is working", "running right now", none read in the turn) **and 1 FALSE** (#19).
  - The seat-state change (a seat's own ring as backing, and a command sharing a 4+ letter word) dropped real unbacked status claims along with misfires.
  - The cost of that is invisible to 3b, which judges only refusals.

## §3c Cost (reported, not a bar; checked: `cb.js`)
- **Week:** 267 of 300 replies are claim-bearing, and **173 are refused: 64.8%** of those (57.7% of all). The first build was 74.0%.
- **Right sample:** 68 claim-bearing, 30 refused.

## §5 By class
| class | in-sample: units / caught / low / high | held-out: units / caught / low / high | 3a landings |
|---|---|---|---|
| figure | 15 / 6 / 40.0% / 60.0% | 10 / 4 / 40.0% / 44.4% | 5 of 5 |
| state | 15 / 4 / 26.7% / 40.0% | 5 / 1 / 20.0% / 20.0% | 0 |

- One held-out unit (H0546) is neither class.
- The week, from `byclass.js`: figure alone refuses 124, state alone 90, both 41.
- **Neither class passes §2 on its own:** figure's in-sample low is 40.0%, under 50%. **No class passes all three lines.**

## §6 (each checked)
1. **Enough units:** in-sample replayable 22, at least 20. **Held-out replayable 15, at least 12, so the condition that fired on the first build is met now.** Does not fire.
2. **Enough data:** RIGHT-CHECKED 61, at least 30. Week claim-bearing 267, at least 60. Would-refusals 173, at least 30. Does not fire.
3. **Always-refuse:** 64.8% of claim-bearing week replies, under 90%. Does not fire.
   - **The stubs:**
     - on the held-out list, E's run gives never-refuse 0 / 15 and always-refuse 15 / 15;
     - on the original lists, A's stub reports were made on the 10-11 harness.
   - **Gap, inferred:** the harness has changed since (C's `15ae7d8f`, A's `39fcef40`), and the stubs were not re-run on the original lists with it. The stub-free counts reproduce exactly, so I read the harness as still counting.
4. **In-sample only:** the full catch does not pass, so it is moot. The held-out catch, 31.3%, is not below 25%.

## Where the lines fall (not a ruling)
| line | first build | revision |
|---|---|---|
| catch, in-sample low / high | 28.1–31.3% / 40.9–45.5% | **the same** |
| catch, held-out low / high | none replayable (§6.1 fired) | **31.3% / 33.3%** |
| 3a | 16.9% | **8.5%** (10.2% if the borderline landed) |
| 3b FALSE (low / high reading) | 6 / 4 | **6 / 4** |
| any class passing all three | no | **no** |
| clear-fail line crossed | no | **no** |

**The revision's lines sit where §5's "OFF, one revision" row describes:**
- the catch does not pass;
- no class passes;
- no clear-fail line is crossed.

**This was that row's one revision.** The row's own clause reads: *"the revision is re-replayed against this same bar, unchanged; a second miss is 'don't build'"*. By that clause the lines read **"don't build"**. The ruling is the librarian's.

What moved and what didn't:
- The revision bought its 3a and 3c gains without changing a single catch.
- The catch is where it failed, both in-sample and on units no one tuned on.

## Corrections to myself
- **The first read's 3a borderline**, `CfoDNs…|9`, is resolved as not landed, for both builds. So the first build's 3a is 16.9%, not 16.9–18.6%. Its position against the lines is unchanged.
- **A slip with no effect:** my first held-out matcher run had no keys for the H units. I wrote them through a `node -e` with a Git Bash path, which did not resolve, so the run printed "no flag matches" for every unit. I added the keys with the Edit tool and re-ran. No count came from the keyless run.

NEXT: librarian rules D305 under §5, revision lines beside the first build's, when it has read this beside A's and C's hand-backs
