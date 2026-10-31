# p-d589-hover-cull-A, 2026-10-31: the hover pick culls stations by box, with the same answer

Seat A. Branch d589-a off d584-a (82c629e), worktree C:\Users\nname\Downloads\t180-wt-a589. One commit, 8846941, not pushed. Tier CHECK IT.

S = C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\d584.

Everything ran headless (zz-headless-test, --mute-audio, BelowNormal). acs.exe was not running at any check (tasklist before each timed run, and at the end).

## 1. What the slow part was (measured before changing anything)

My D584 §6 called this projecting every station. That was half the story: on ELYSIUM the cost was the half-width.

**The ELYSIUM profile**
- checked: CPU profile of the ELYSIUM overview look, `S/p589-ely.look.cpuprofile`, with `callers.js` → 17.2 s of pickAcross's 17.45 s is `halfWidth`.
- `halfWidth` is spanOf(readAt(g, 0)) on an unfrozen copy, which sums from the centre for every knot: O(n²) on 137 knots, about 1.5 ms a chord.

**pickAcross alone, in node, 60 picks along a moving pointer, base d584-a** (checked: `S/picktime.js`)

| | first pick | then median | then p95 |
|---|---|---|---|
| ELYSIUM, overview | 15,579 ms (every chord's half-width) | 5.9 ms | 8.6 ms |
| ELYSIUM, above the road | | 2.6 ms | 3.6 ms |
| 100 km, overview | | 27.4 ms | 37.3 ms |
| 100 km, above the road | | 11.2 ms | 14.6 ms |

On 100 km, each pick projects all 50,396 stations.

## 2. The change (app/preview/preview.js only)

**Boxes.** The stations go in blocks of 32 and groups of 32 blocks (`cullBlocks`), memoised by path, segments, station count, and the first and last station. Each box is its stations' centreline box, widened by `halfBound`:
- the largest |u| of the segment's profile and of its blend.from;
- along a section |dX/du| = |cos ψ| ≤ 1, and a blended section's edges lie between its two profiles', so the real half-width is never more.

A box wholly in front of the eye projects inside the screen rectangle of its corners. When that rectangle is more than maxPx + 1 px from the pointer, every station in it would be passed over, and it is skipped unread.

**A lower bound per station.** In front of the eye, the exact rim projects onto the screen segment from the centre to pos ± halfBound·L. So the distance to the bounded rim-centre-rim line is a lower bound on the station's real distance.

**Two passes.**
1. Collect the stations the boxes leave, in order, with their centres. T = the 4th-smallest centre distance (a centre distance is an upper bound on the real distance).
2. The original test, unchanged and in the same order, on each station whose lower bound is not past min(maxPx, T) + 1e-6.

The keep ends as the 4 smallest by (distance, order): an incoming station is refused when it is not better than the 4th, and one leaves only for a strictly better one. So a station past T is in no answer, and leaving it out changes nothing.

**The half-width is read from a sealed copy:** `spanOf(sealed(readAt(g, 0)))`.
- Its offsets come from running sums (profile.js sumsOf), the same additions in the same order, so the same doubles.
- That is checked over 65,000+ segments (§3), not assumed.
- The camera's span already does the same (preview.js, under core_cup_mutation M38's anchor).

**`cull: false`** reads every station exactly as before. It is the test's reference.

## 3. Proof: the answer is the same

**app/test/pick-cull.test.js (new, 2 rows): 2/2.**
- Row 1: the sealed half-width is the plain one by Object.is on every segment of F1–F8, the ELYSIUM fixture and a 100 km track.
- Row 2: deepStrictEqual of the cull pick against the reference.
  - Five views of each track: an overview, three above the road, and one low along the road, which puts some boxes behind the eye.
  - The pointers: a 16 × 10 grid, plus three points beside every 97th station on screen.

Three deliberate breakages of the cull were each caught by row 2:
- the box rectangle's margin 1 → −25 px;
- the station bound's cut × 0.7;
- halfBound ÷ 3.

**Across trees** (checked: `S/proofpick.js`, d584-a's pickAcross against d589-a's on the same paths, views and pointers; `S/proofpick.out`): differ 0 on every track.

| track | pointers | on the road | answers' digest |
|---|---|---|---|
| eq-ELYSIUM (his save, a copy) | 1,325 | 913 | sha256 c07a7f75… |
| the ELYSIUM fixture | 1,325 | 913 | c07a7f75…, the same |
| 100 km | 2,882 | 2,464 | |
| F1–F8 | 809–839 each | | |

In all, 12,085 pointer positions. F9 is empty.

## 4. The frame bar (headless page, gl.finish() inside every frame, 3 s of the right-button look with the pointer moving)

checked: `S/f2-{a584,a589}-{synth100,eq-ELYSIUM}.json`, from `fin2.sh`, the same window, d584-a → d589-a:

| | d584-a | d589-a |
|---|---|---|
| 100 km, overview | p95 17.9 ms, 235 of 459 over 6.9 | p95 0.6 ms, 4 of 5,962 over |
| 100 km, above the road | p95 8.2 ms, 221 over | p95 0.6 ms, 1 over |
| ELYSIUM, overview | p95 4.1, p99 122.1 ms, 19 of 918 over | p95 1.1, p99 7.1 ms, 48 of 4,643 over |
| ELYSIUM, above the road | p95 0.4 ms | p95 0.5 ms |

- inferred: the machine was quieter than at D584; d584-a's ELYSIUM overview read p95 295 ms then.
- d589-a's 48 slow frames on ELYSIUM (1%) are the first exact work as the pointer reaches new chords. Node shows the same: the first pick 44.6 ms, then p95 10.5 ms.

**Its test row, app/test/preview-lod-frame.test.js row 4 (new):** the overhead view of the 100 km track, the pointer moving, p95 ≤ 6.9 ms.
- d584-a red: p95 42.1 and 43.5 ms (84 of 85 and 78 of 81 frames over).
- d589-a green: p95 1.8 ms, 7 of 2,590 over.
- Rows 1–3 green on both trees.
- To run it on d584-a, the file was copied in and the tree's own copy put back after; `git status` is clean there.

pickAcross alone after the change (node): ELYSIUM overview first pick 44.6 ms, then median 3.6 ms, p95 10.5 ms; 100 km overview p95 3.4 ms.

## 5. The checks CHECK IT asks for

**The existing tests for the touched file** (every test that requires preview.js; checked: `S/t589.tap`, 26 files under the lock): tests 483, pass 482, fail 0, todo 1.
- The todo is preview.test.js's list row, a TODO before this change too.

**The mutation harnesses that name preview.js** (not run, per the tier). Their anchors on it were checked: all 42 occur exactly once.
- checked: `S/anchors589.js` → 40 by the script.
- The other 2 (mutation N20, core_cup M38) the script misread, on d584-a as on d589-a. Each is found exactly once by grep.

## 6. Overlap and scope

- One file of code, app/preview/preview.js. halfWidth also serves the sculpt hatch lines (acrossLines), with the same values to the bit (§3 row 1).
- CHANGELOG.md (one bullet) and MAP.md (the 3D preview row) are also edited. CHANGELOG.md is the file C's branch shares.
- Not touched: the readouts' other picks (pickAt, labels' sharedPick, which calls this).

## 7. Commit, map, leftovers

- 8846941 "The hover pick skips the stretches of track that cannot be under the pointer, with the same answer, so a long track no longer stalls on a pointer move": app/preview/preview.js, app/test/pick-cull.test.js, app/test/preview-lod-frame.test.js, MAP.md, CHANGELOG.md.
- exo_memory/map/A.md: one line.

leftovers.js at 17:41:17Z, as it prints:
```
leftovers · 2026-10-31T17:41:17.036Z · read-only
tab proxies          UNCALIBRATED (read 0, and the control made none (0 → 0 → 0))
worktrees            Desktop/lighthouse 38 linked + main
strays               not scanned (give --strays <folder> --prefix <name>-)
fake roots           0
orphan browsers      0 headless roots whose parent is gone
our long-running     0 (older than 120 min, infrastructure left out)
```

t180-wt-a589 stays until the landing takes d589-a.

CORRECTION, mine: D584 §6 called the cost "projects every station". On ELYSIUM it was the half-width, 17.2 of 17.45 s. The projection is the cost on the 100 km track.
