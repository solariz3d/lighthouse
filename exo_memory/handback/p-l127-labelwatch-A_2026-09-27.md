# L127 — label-watch NARROWED per B's read. Pane A, 2026-09-27

Packet: `[chair:MAIN] L127 — NARROW label-watch per B's read`. **Committed by path at
`9e7037b0bf1d5d093adc589f163adc0053acf728`** (`consonance/tools/label-watch.js` +64/−30,
`consonance/tools/label-watch.test.js` +39/−0). **Not pushed.**

**The ruling it follows:** the registered W§1(a) and W§3 stay E's and run through the claimrec harness. label-watch keeps
two jobs: the **DELIVERY reporter** (W§1.4), and a **PROXY** printed under that name.

## 1. Diff summary

1. **`LABEL_RE` counts a marker ONLY at a line or bullet start.** It is now
   `/^\s*(?:(?:[-*+]|\d+[.)])\s+|#{1,6}\s+)?(checked|inferred):/`: optional indentation, then at most one structural
   prefix, a bullet or a heading's `#`s, then the lowercase marker and its colon. One label per line.
   - **Never inside a code span or block.** A line starting with a backtick never matches, and fenced blocks were already
     skipped.
   - **Quotes: a marker after `>` is NOT counted.** A quoted label is someone else's, not the writer's (B's C10, which B
     left open; ruled here).
   - **Bold** (`**checked:**`) is not counted either, because item 7's layout is plain.
   - **Not counted, and why:**
     - mid-sentence ("What I checked: …", B's C11) and a second marker later on the same line (C12) are mentions;
     - the KIND word `CHECKED` and `unchecked:` still do not match.
   - **Named reading:** a heading prefix (`### inferred: …`) counts as "line start", because W§1.3's coverage rule needs
     heading labels to exist.
2. **Coverage:** a bullet is covered only by its **nearest parent's OWN label**, not a grandparent's (B's C13, W§1.3
   "the nearest preceding … bullet parent"). An indented continuation line belongs to its own bullet.
3. **Not claims (B's C6, C7):** a line ending in `?` (a question) and a plan phrased without an opener (`will`,
   `going to`, `next step`, `plan to`) owe no label. **A proxy:** a claim phrased with "will" about a system's
   behaviour is dropped too.
4. **Renamed.** Every printed and JSON measure except the raw label counts is now `proxy_*`:
   - `proxy_lines_owing_a_label`, `proxy_owing_lines_labelled`, `proxy_owing_lines_unlabelled`, `proxy_line_label_share`;
   - `proxy_checked_line_shows_command_inline`, `…_block`, `proxy_checked_line_shows_no_command`.
   - **Under a one-line header**, printed and also in the JSON as `proxy_note`: *"PROXY ONLY — line-level stand-ins. The
     registered measures, W§1(a) (the claim-level labelled share, extracted per W§1.2) and W§3 (self-label vs the
     verifiers' agreed kind), run through the claimrec harness, not this tool."*
   - `analyzeText`'s internal count names are unchanged, so the existing tests are untouched.
   - New exports: `proxyTotals` and `PROXY_HEADER`.

## 2. Tests — 25/25 (9 existing, unchanged; 16 new)

- **Red first:** 17 pass / **8 fail**. The 8 were exactly B's five divergences (C6, C7, C9, C11, C13), my rulings on
  C10 and C12, and the proxy-naming test.
- **One test per B row, C1–C15** (`L127 C1 …` through `L127 C15 …`):

  | row | case | expected |
  |---|---|---|
  | C1 | shown check | label, shown inline |
  | C2 | no check | label, no command shown |
  | C3 | inferred figure | labelled, owes 0 |
  | C4 | unlabelled figure | owes |
  | C5 | "I will …" | owes 0 |
  | C6 | question | owes 0 |
  | C7 | "the next step is …" | owes 0 |
  | C8 | marker in a fenced block | not a label |
  | C9 | marker in inline code | not a label |
  | C10 | `>` quote | not a label; the figure owes |
  | C11 | mid-sentence | not a label; the figure owes |
  | C12 | two markers on one line | one label, shown inline |
  | C13 | grandparent labelled only | the figure owes |
  | C14 | empty | zeros |
  | C15 | CRLF verdict | owes |

- **Proxy naming:** every measure but `checked` and `inferred` starts `proxy_`, the share is labelled ÷ owing, and the
  header names claimrec and §1.2.
- **My test, strengthened before commit:** its first fixture had 1 labelled and 1 unlabelled line. The share and its
  complement were both 0.5, so mutant N7 survived. It is now 2 labelled and 1 unlabelled (⅔).
- **Command:** `NO_COLOR=1 node --test consonance/tools/label-watch.test.js` → `tests 25 · pass 25 · fail 0`.

## 3. Mutants — on copies (`scratchpad/l127/mutants.js`, control 0 failing)

- **listed 17 · applied 17 · caught 17 · survived 0 · NOT APPLIED 0 · NO RESULT 0.**
- **New for L127 (N1–N9):**
  - N1 the regex unanchored (caught by C9, C10, C11);
  - N2 blockquote markers counted (C10);
  - N3 a grandparent covers (C13);
  - N4 the question rule removed (C6);
  - N5 the plan rule removed (C7);
  - N6 the regex case-insensitive (the vocabulary guard);
  - N7 the share computed from the unlabelled lines (proxy test, after the fix above);
  - N8 the header stops naming claimrec (proxy test);
  - N9 a field loses its `proxy_` name (proxy test).
- **L126's, re-pointed:** M3, M5, M6, M7, M9, M10, M12, M13, all still caught.

## 4. The control, before and after — the same pre-R set

`node consonance/tools/label-watch.js --control`. Before: `C:\Consonance\retrieval\l126\control.txt` (L126 code).
After: `…\control-l127.txt`.

| | before (L126) | after (L127) |
|---|---|---|
| H markers, checked / inferred | 6 / 3 | **0 / 0** |
| H lines owing a label · labelled | 1,052 · 1 (0.1%) | 1,042 · 0 (**0.0%**) |
| H checked: lines (inline / block / none) | 6 (2 / 0 / 4) | 0 |
| K lines owing a label · labelled | 82 · 0 (0.0%) | 76 · 0 (0.0%) |
| DG-A1 (H, K) | does not fire, does not fire | does not fire, does not fire |

- **All 9 pre-rule "labels" were mentions:** the marker quoted in C's rule draft and B's merge note. That is B's C9
  concern exactly, and it is now 0.
- **The owing lines fell by 10 (H) and 6 (K):** questions and plan lines.
- **The post-rule window** (`node consonance/tools/label-watch.js`, `…\post-l127.txt`): still **all six seats NOT
  DELIVERED** and **0 units**. 15 hand-backs are excluded: the 4 new ones are L126's, all from undelivered seats or the
  landing lap. No post-rule unit has been analyzed by either version.
- **portable-paths:** `green — 334 files in scope, 223 known sites, 0 new`.

## 5. What was NOT verified

- **The proxy against a human reading** (still), and whether "will" drops real claims about system behaviour (C7's
  rule).
- **The quote and bold rulings (C10, bold):** mine, where W is silent. E or the librarian may rule otherwise, and the
  change would be one prefix in `LABEL_RE`.
- **`LABEL_RE` is still not pinned in E's registration file** (W§1.3). This line-start form is the candidate, and no
  post-rule unit has been read by either version.
- **Delivery.** Unchanged, and still the gate on any number.
- **The full suite.** Not run: only these two files changed, and no shared code.

NEXT: librarian — hold for the keeper's rebuild (delivery), unless the C10 / bold rulings need E
