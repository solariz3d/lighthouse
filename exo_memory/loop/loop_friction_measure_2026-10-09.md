# Loop friction, items 1 + 2: what the paperwork gates' refusals changed, and what they cost. Pane E, on D, 2026-10-09. Lap D276. MEASURE ONLY.

Plan and hypothesis, registered before this was measured: `exo_memory/loop/plan_loop_friction_2026-10-09.md`. After the librarian's RE-SPLIT (11:1x)
this file is **items 1 and 2 only**: A has item 3, C item 4 and B item 5. Nothing was changed. Every input was read only.

**How to re-run.** The scripts are in `exo_memory/handback/p-loop-friction-E_2026-10-09_evidence/`. Copy that folder to a scratch directory and run there,
because the `m1_*.js` scripts write their pair files (which hold message text) beside themselves:
`node m1_sources.js; node m1_replyslot.js; node m1_trailer.js; node labels.js`.

## The method, and why the diff is exact
- **Exact recovery.** The SOURCES ledger stores `ringSha = sha256(text)` (`consonance/hooks/sources-gate.js:319`), and the reply-slot ledger stores
  `replySha = sha256(last_assistant_message)` (`reply-slot.js:221-223`). So a transcript tool call or reply whose text hashes to the stored sha IS that message.
  Nothing is matched by time or by guess: **every one of the 131 SOURCES pairs and 34 reply-slot pairs was recovered by hash**
  (`m1_out.json`, `m1_reply_out.json`).
- **The NEXT-trailer gate** lives in the app, after the hooks, and logs no sha. Each of its refusals (its own board rows, `pane: "trailer-gate"`) was paired with the
  sender's tool call at or before the refusal (within 30 s). That is a time match, and 43 of 43 found one (`m1_trailer_out.json`).
- **Pairing.** A refusal is paired with the NEXT accepted send from the same session and tool, and, for `chair_inject`, the same TARGET seat.
  - **Self-correction:** my first pass paired on session and tool only, and it paired 8 `chair_inject` denies with a dispatch to a different seat. Adding the target
    moved `chair_inject` from 22 to 14 changed pairs. The numbers below use the corrected rule.
- **CONTENT, exactly as the plan defines it:** the message minus its `SOURCES:`/`Sources:`, `NEXT:` and `OUTPUT →` lines, trailing spaces trimmed. "Changed" means
  the two contents are not byte-equal.
- **Reading, not only diffing.** A byte-unequal content can be a fixed claim or a moved comma, so every changed pair was read word by word (`worddiff.js`)
  and given ONE label (definitions in `labels.js`). The labels are in `labels.json`, by ledger timestamp, with no message text. **The shares below re-derive
  from `node labels.js`** (`labels_out.json`, sha256 `a44d8532…`). The labels are my reading; a second reader is the obvious check, and I name it as not done.
- **Probes** (deliberate tests of a gate, each saying so in its own text) are excluded from every share: 4 SOURCES, 3 trailer, 0 reply slot.

## Item 1: per gate, the share of refusals whose re-send changed CONTENT
| gate | window | refusals (ex probes) | **content changed (the plan's test)** | of which a CLAIM changed | claim fixed / re-grounded | claim removed / blurred |
|---|---|---|---|---|---|---|
| SOURCES (`call_librarian`, `call_chair`, `chair_inject`) | 10-02 19:58Z → 10-09 17:07Z | 127 paired (128; 1 `chair_inject` never re-sent) | **42 (33.1%)** | 17 (13.4%) | 4 | 13 |
| reply slot (librarian, chair) | live 10-03 11:58Z → 10-09 | 34 | **23 (67.6%)** | 9 (26.5%) | 4 | 5 |
| NEXT trailer (`chair_inject`, `call_chair`) | 09-16 → 10-09 | 40 | **12 (30.0%)** | 2 (5.0%) | 0 | 2 |
| **pooled** | | **201** | **77 (38.3%)** | **28 (13.9%)** | **8 (4.0%)** | **20 (10.0%)** |

All from `node labels.js` → `labels_out.json`.
- **By tool, SOURCES only, raw:** `call_librarian` 39 denies, 12 changed; `call_chair` 51, 20; `chair_inject` 42, 14 (`m1_out.json`, probes included).
- **The trailer gate also WARNED, and never refused, on 86 `call_librarian` deliveries** (`m1_trailer_out.json`, `warnedDeliveredCallLibrarian`). Those have no re-send
  to diff.

**What the 77 changes were,** pooled (`labels_out.json`):
| label | n | |
|---|---|---|
| CLAIM-DROP | 20 | a figure, path:line or "checked" note removed or made vaguer, nothing in its place |
| META | 13 | a sentence about the refusal added ("the gate was right…") |
| WORDING | 12 | same claims, re-phrased |
| ADD | 10 | new content the sender added while re-sending, unrelated to the refused line |
| POINTER | 10 | a path's spelling only (absolute → repo-relative) |
| CLAIM-FIX | 8 | a claim corrected, re-grounded in what was checked, or a missing check-based fact added |
| CITE | 2 | a commit citation added to the body |
| FORMAT | 2 | a line moved into or out of the trailer |

Notes for the scorer, stated as observations:
- **The letter of the falsifier and its intent come apart here, and the librarian should rule which one scores.**
  - The plan's falsifier counts CONTENT changes, and **by that letter every gate is at or over 30%** (trailer exactly 30.0%, pooled 38.3%).
  - Its stated purpose is "the refusal made the seat fix a real claim, not just its wording". **The pairs where a claim changed at all are 13.9%;
    where it was fixed or re-grounded, 4.0%.**
- **The commonest claim change is a deletion.** 20 of the 28 claim changes removed or blurred a specific, and did not cite it. Examples by kind, without the text:
  an exe size dropped; a "(checked with …)" note dropped; a `path:line` reference dropped; "56% faster" became "much faster"; a figure the turn had not re-opened was
  dropped. **Whether the removed specifics were true was not measured.** Checking each against its source is the follow-up that would say whether the gate
  removed errors or removed true detail.
- **The 8 fixes are real catches**, e.g.:
  - a hand-off that said a lap's core was "in" became "a PAUSED WIP save, not running";
  - a reply telling the keeper he was on a safe footing for a BIOS flash became "it isn't safe to flash yet";
  - a claim read off a file's date was re-grounded in the process actually checked.
- **The chair's own dispatch for this lap (`chair_inject` → E, 17:06:49Z) is in the set.** Its covering note said the content was unchanged; **by the diff it changed.**
  The re-send dropped "(my count, from that file, just now)" and the count "10", and added the instruction to include that very dispatch. Labelled CLAIM-DROP.

## Item 2: the time per refusal
Wall-clock from the refusal to the accepted re-send (`m1_out.json`, `m1_reply_out.json`, `m1_trailer_out.json`):
| gate | pairs | median | p90 | max | total |
|---|---|---|---|---|---|
| SOURCES `call_librarian` | 39 | 6.8 s | 14.5 s | 140.7 s | 551 s |
| SOURCES `call_chair` | 51 | 11.2 s | 20.9 s | 38.4 s | 638 s |
| SOURCES `chair_inject` | 41 | 10.9 s | 19.7 s | 89.5 s | 659 s |
| reply slot | 34 | 6.9 s | 12.0 s | n/a | 258 s |
| NEXT trailer | 43 | 8.8 s | 15.9 s | n/a | 447 s |
| **all** | **208** | | | | **2,553 s ≈ 43 min** |

(Probes are included in this table; they are 7 of the 208, at 4–141 s. The "max" column was not computed for the last two gates.)
- **What this does NOT count.** These are seconds of latency from refusal to re-send. They leave out:
  - the model tokens of each extra round trip;
  - the turns spent writing the narration about the refusal (13 META re-sends);
  - any effect on how seats write BEFORE a refusal, which is item 4's question and C's.
  - **Re-sending is fast. The token cost is unmeasured.**
- **8 SOURCES refusals were followed by a SECOND refusal** before the accepted send (`m1_out.json` `chainedDeny`: `call_librarian` 3, `call_chair` 2,
  `chair_inject` 3). Not computed for the other two gates.

## What this measurement is not
- **Not a verdict on H.** The librarian scores it against the registered falsifier, and the keeper decides what loosens.
- **Not a measure of whether the gates made the room less wrong overall.** That is the 10-03 re-measure, which starts 10-10 05:55, and item 5 (B).
- **One reader's labels.** A second, blind labeller over `labels.json`'s 84 changed pairs (77 + 7 probes) would give an agreement figure.
  Not done.
