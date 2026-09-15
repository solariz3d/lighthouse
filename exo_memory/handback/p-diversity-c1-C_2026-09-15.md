# P-DIVERSITY-C1 · CHARLIE — STOPPED before any cosine: the controls cannot run under §8.2 as frozen

Lap on D (DESKTOP-EEGVFMT), 2026-09-15 ~08:55–09:40, seat C (Around).
Packet `exo_memory/loop/packet_diversity_c1_and_leave2_2026-09-15.md` (8a7d60d) PACKET 1 §1.
Draft `exo_memory/loop/anchor_similarity_registration_DRAFT_2026-09-15.md` §8 (b8c1113). Repo HEAD 8a7d60d.

**No cosine, primary or secondary, was computed for any pair.** The model was loaded offline and never run
forward. Per the packet — *"If a line of 8.2 cannot be implemented as written, stop and ring the librarian. Do not
choose a variant"* — and per §1's DEGENERATING clause, the rulings below have to exist before the first number
does. No repo edit except this file and one line in my map. Nothing installed in the repo.

---

## 0 · WHAT PASSED, WHAT STOPPED

| Step | Result |
|---|---|
| **Encoder hash on D, the keeper's byte-identical condition** | **PASS.** `onnx/model_quantized.onnx` is **146,540,971 B, sha256 `e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509`**, equal to L. `tokenizer.json` `cb374d6b…57a448` and `config.json` `23885468…6cbcab` are also equal to L. |
| Runtime | `@huggingface/transformers` **4.2.0**, pinned exactly, in `<scratchpad>/c1/` on D (381 MB `node_modules`); Node v24.14.1 |
| Offline | Model and tokenizer loaded with `allowRemoteModels=false` under the network-blocking preload: **`NETWORK_ATTEMPTS=0`** |
| P1 texts at their landing shas | All four match the packet's byte sizes exactly (§3) |
| **Controls first (draft §4)** | **CANNOT RUN AS WRITTEN — STOP 1** |
| §8.2's S40 as a reproducible step | **NOT REPRODUCIBLE FROM ITS WRITTEN FORM — STOP 2** |
| §8.2's PRIMARY and |m| | **Two definitions unwritten — STOP 3** |
| P2's pair set | **Four choices unwritten — STOP 4** (does not block P1) |

---

## 1 · STOP 1 — the positive control is void under §8.2 by construction

§8.2 applies S40 "to both sides of every pair" and voids "a pair with more than 50% of the hand-back stripped".
Draft §4's positive control is "the packet against itself with its first section removed". **A near-copy of the
anchor, stripped against the anchor, loses almost everything.** Measured with S40 as B described it (§2), on D,
text only:

| Near-copy of `packet_leave_window` @ed73e76 | near-copy stripped | brief stripped | tokens left, near-copy | void (>50%) |
|---|---|---|---|---|
| minus `## 0` (lines 12–23) | 8,247 of 9,230 B = **89.4%** | 8,249 of 9,910 B = 83.2% | 269 | **VOID** |
| minus title and preamble (lines 1–11) | 8,135 of 9,117 B = **89.2%** | 8,135 of 9,910 B = 82.1% | 267 | **VOID** |

So "controls first" can only report INSTRUMENT FAILED, and that verdict would say nothing about the instrument.
**B predicted this at its read** (`handback/anchor-registration-read-B_2026-09-15.md` §4.1: *"The positive control
cannot pass through the strip. A near-copy of the packet stripped with S40 against the packet is empty"*). §8
froze S40 on both sides without ruling on it.

**Also unnamed:** the negative control's file. B §4.1 asked for it to be named by path before scoring (*"A scorer who
picks it afterwards is picking a number"*). Neither §8 nor the packet names one.

**Options, for the chair (not chosen here):**
- **(a)** The positive control runs unstripped, and is reported as testing the encoder, not the strip pipeline (B's
  own description of what it can test).
- **(b)** Keep S40 on the control, and replace the near-copy with a text that survives the strip. That needs a
  paraphrase, which is its own instrument.
- **(c)** Replace the positive control with a different known-high pair, named by path.

Whichever is chosen, name the negative control's path in the same ruling.

## 2 · STOP 2 — S40 is not reproducible from its prose

§8.2 says only "normalised 40-character spans that occur in the other text are removed". The fuller definition is B's
prose (read §3, `:112`): *"collapses whitespace and drops the markdown markers `> * \` _ #` on both sides, then marks
every hand-back character inside a 40-character run that also occurs in the brief."* B's script `quote_strip.js` is in
L's scratchpad and is not in the repo.

**Implemented exactly as that sentence reads, it does not reproduce B's numbers** on the same, unchanged files (both
hand-backs have a single commit):

| Hand-back vs @ed73e76 | B measured | This implementation (`<scratchpad>/c1/s40.cjs`) |
|---|---|---|
| p-leave-read-B | 3.7% | **3.51%** (563 B) |
| p-leave-E | 1.7% | **1.46%** (521 B) |

Unwritten choices that change what gets embedded, not just the reported share:
1. **Case:** folded or not. The prose is silent; I did not fold.
2. **What is removed from the original:** only the characters that map to marked normalised positions, or also the
   dropped markers and collapsed whitespace inside a marked span. With the first reading, the positive control's
   "survivor" above is about 1 KB of leftover markdown punctuation.
3. **Which text is embedded:** the original minus spans (what I built), or the normalised text minus spans.
4. **Direction for the brief side:** the brief stripped of spans occurring in the hand-back (built that way), for
   every pair separately. In P2 that means the same packet is embedded differently for every hand-back.

**Ruling wanted:** freeze S40 as code in the repo (B's `quote_strip.js`, or this `s40.cjs`, either named and hashed),
not as a sentence.

## 3 · STOP 3 — the PRIMARY and |m| have two readings

§8.2: *"PRIMARY: the token-weighted mean of window-pair cosines … reported for every text: … |m| of the centroid"*;
*"SECONDARY: the renormalised-centroid cosine"*.
1. **The pair weight.** Is it the product `tᵢ·tⱼ` (hand-back window tokens × brief window tokens), or something
   else? With the product, PRIMARY equals the dot product of the two **token-weighted** mean vectors. B's algebra
   (§2) uses the **unweighted** mean `m`.
2. **Which centroid** carries `|m|` and gives the SECONDARY: token-weighted or unweighted. With 6 windows on E and a
   short tail window on most texts, the two differ.
3. **Token counts:** before or after the strip. I assume after, since windows are cut on the stripped text's token
   ids; please confirm.

For the record, the counts that decide the windows (stripped, with S40 as built):

| Text @sha | Bytes | Tokens (no specials) | Windows | Tokens after strip vs anchor | Windows after |
|---|---|---|---|---|---|
| anchor `packet_leave_window` @ed73e76 | 9,910 | 2,860 | 2 | 2,711 / 2,848 / 2,749 (vs B / A / E) | 2 |
| B-read `p-leave-read-B` @9e29daf | 16,050 | 5,278 | 3 | 5,129 | 3 |
| A `p-leave-A` @99649d8 | 21,298 | 5,812 | 4 | 5,800 | 4 |
| E `p-leave-E` @99649d8 | 35,743 | 9,560 | 6 | 9,382 | 6 |

## 4 · STOP 4 — P2's set needs four rulings (P1 does not depend on these)

The packets' §HAND-BACK sections name **patterns** (`handback/p-leave-<letter>_2026-09-14.md`), not files. The
literal rule resolves 9 packets to **16 hand-backs**: diverged A/E; diversity-c0 C/E; harness A/E; leave A/E;
no-console A/E; stick-build A/E; stick A/E; stick-preflight B/C. diversity-c1 has none yet.

1. **Reads outside the pattern.** `p-leave-read-B`, `p-leave-read2-B`, `p-diverged-read-C`, `p-diverged-read2-C`,
   `p-harness-read-B`, `anchor-registration-read-B` and `readme-audit` answer this week's packets, but do not match
   `<letter>`. Excluded by the literal rule — or included?
2. **Brief version.** Draft §3 says "the packet … at its dispatch sha". But most packets grew after dispatch, through
   the re-rules the panes built against: `packet_leave_window` 9,910 → 22,537 B (6 commits); `packet_stick_build`
   13,322 → 26,498; `packet_stick_module` 9,569 → 25,534; `packet_diverged` 9,667 → 13,530 (its §2.8, which A and E
   built). Scoring hand-backs against half the text they answered biases own-packet scores down. B §5 raised this
   ("version last received"); §8 did not rule on it.
3. **Hand-back version.** "At the commit that landed it": the first add, or the final state? Three changed after
   landing: `p-diverged-A` 16,996 → 19,673; `p-diversity-c0-C` 13,995 → 21,867 (§6, the trial); `p-no-console-A`
   14,907 → 23,600.
4. **"The other packets in the set":** does it include `packet_diversity_c1_and_leave2` (no hand-backs; its text is
   about this measurement), and the pairs a void would remove?

## 5 · WHAT I DID NOT DO, OR VERIFY

- **No embedding forward pass. No P1 score, no P2 score, no control score.**
- I did not choose a variant of S40, of the aggregator, or of the controls.
- **B's `quote_strip.js`** is on L's disk. I could not diff it against `s40.cjs`, so the 3.7% / 3.51% difference is
  shown but not explained.
- **Speed on D** was not measured this lap.
- **E has nothing to re-run yet.** The scripts E would re-run exist in `<scratchpad>/c1/`: `s40.cjs`, `prep.mjs`,
  `block-net.cjs`, `download.mjs`, `prep-out.txt`, and the four P1 texts extracted at their shas under `texts/`.
  The scoring script is not written, because it would encode the choices in §2–§4.

## 6 · COMMANDS

    npm install --save-exact @huggingface/transformers@4.2.0                 # in <scratchpad>/c1, D
    sha256sum models/Alibaba-NLP/gte-base-en-v1.5/onnx/model_quantized.onnx  # e7f6af7a…c326509, 146,540,971 B
    node --require ./block-net.cjs prep.mjs                                  # offline load, tokens, S40 shares; NETWORK_ATTEMPTS=0
    git log --diff-filter=A --format=%h -- <path> ; git cat-file -s <sha>:<path>   # landing shas and sizes, §3–§4


---

## 7 · S40 FROZEN AS CODE, per §8.7 R2 (aa5831c) — written and tested, AWAITING THE CHAIR'S COMMIT

**Still no cosine.** Per the ruling, nothing is computed until this code is committed and its hash recorded.

**Files (uncommitted, mine, by path):**

    dev/diversity/s40-strip.js        sha256 73917f673b7d98130fe8195cf953bd35c4fa3534dbf00c41da1492e039a4e087
    dev/diversity/s40-strip.test.js   sha256 22500f727f4b0114e85d8b9a7b2e5f1b34ff279ec21d0139bcb04f46d2c7bed6

**R2 as built** (`s40-strip.js`), one function, `s40Strip(text, other)`:

| R2 line | Code |
|---|---|
| normalise | drop `> * \` _ #`, then collapse every whitespace run to one space ("drop, then collapse": whitespace on both sides of a dropped marker becomes one run). No case fold. |
| mark | every 40-character run of normalised `text` that occurs in normalised `other` |
| embed | returns `text`: the normalised text minus the marked characters |
| share | `strippedChars / normalisedChars` |
| brief | the same function with the arguments swapped, per pair |

"Characters" are JavaScript string units, and every count uses the same unit.

**Tests:** `node dev/diversity/s40-strip.test.js` → **12 passed, 0 failed.**
- **The reproduction:** B's pair against `packet_leave_window` @ed73e76, read from git at that sha, with byte sizes
  asserted:
  - p-leave-read-B → **3.73%** (563 / 15,079 normalised characters), which rounds to B's **3.7**;
  - p-leave-E → **1.72%** (517 / 30,046), which rounds to B's **1.7**.
  - These equal the librarian's 3.73% / 1.72% (§8.7 R2). My §2 script's 3.51% / 1.46% measured raw bytes after
    residue, which R2 has now ruled out.
- **The edges:** markers dropped; whitespace collapsed, including across a dropped marker; no case fold; a 39-character
  shared run not stripped; exactly 40 stripped exactly; a quote hidden by markdown and re-wrapping still found; share
  over normalised characters, with the normalised remainder embedded; empty input; the brief side.
- **The reproduction needs git history** (`git show ed73e76:…`). Without it the test fails with a message naming why,
  never silently.
- **Two of my first fixtures were wrong, and I fixed the fixtures, not the code.** The 39-character case had a space
  on both sides, which extended the shared run to 40. The re-wrap case inserted a space the quote does not have. Both
  were caught on the first run.

**Mutants, on a scratch copy** (`<scratchpad>/c1/mut/mutate.js`; the tracked file's sha256 is unchanged after):
**7 applied, 7 caught, 0 survived, 0 NOT-APPLIED.**

| Mutant | Caught by |
|---|---|
| case folded | 3 tests |
| `#` kept | the markers test |
| whitespace not collapsed | 5 tests |
| span 41 | the p-leave-E reproduction only |
| raw text embedded instead of normalised | 4 tests |
| share over raw bytes | 4 tests |
| only the run's first character marked | 5 tests |

**The repo suite:** `node consonance/tools/js-suite.js` → 91 green, 6 failed, 1 canary, of 98.
- `dev/diversity/s40-strip.test.js` is discovered and **ok**.
- The six failures are portable-paths, gen-consumer, carrier-drift, actors.evidence, forget-rate and
  userprompt_pulse. **None names `dev/diversity` or s40.** portable-paths names two drive literals in `main.rs`
  (lines 5988 and 6169).
- **Not verified:** whether those six were red before these files existed. I ran no baseline without them.

**Owed next, in order, after the commit exists:** controls per R1, then P1, then P2 per R3/R4, appended here.


---

## 8 · THE MEASUREMENT — controls PASSED, P1 fires §8.3, P2's scale

Run on D, 2026-09-15 09:27–09:33, after the S40 strip landed at **5a2d3c0**.

**Frozen inputs, each hash-checked in code before use:**
- **Strip:** `dev/diversity/s40-strip.js` read from `git show 5a2d3c0:` (sha256 `73917f67…a087`).
- **Encoder:** gte-base-en-v1.5 q8, sha256 `e7f6af7a…c326509`.
- **Runtime and network:** `@huggingface/transformers` 4.2.0, offline, **`NETWORK_ATTEMPTS=0`** on both runs.
- **Final-state commit:** `1e944ac`.

**Interpretations fixed before any cosine:** `<scratchpad>/c1/PREREG-C1.txt`, sha256 `51ef51d3…80a2a`, timestamped
09:26:28. It covers:
- **Windows:** 1,800 token ids, CLS and SEP on every window, CLS pooling, L2.
- **PRIMARY (R3):** the dot product of the two token-weighted mean vectors.
- **Secondaries:** the centroid cosine and `|m|`, unweighted; the unstripped score, computed on `normalise()`
  text with nothing stripped.
- **Controls, P1 and P2:** exactly as tabled below.

**Artifacts for E:** `score.mjs` (sha256 `ecf03768…33eafb`), `results-c1.json` (sha256 `0d82c32c…554b71d`),
`score-out.txt`, `PREREG-C1.txt`, `block-net.cjs`, and `s40-strip@5a2d3c0.cjs`, all in `<scratchpad>/c1/` on D.
- **One correction, made openly.** The first run (`score.run1.mjs`, `results-c1.run1.json`) did not store §8.2's
  per-text window, token and `|m|` fields for P2 rows. I added those three report fields and re-ran.
- **Every number is identical across the two runs**, checked by script: controls, P1, the prediction, both
  distributions, and all 21 rows.

### 8.1 · Controls (R1) — BOTH PASS

| Control | Pair | PRIMARY | Centroid (secondary) | Criterion | Result |
|---|---|---|---|---|---|
| **Positive**, UNSTRIPPED, encoder test only | `packet_leave_window` @ed73e76 with `## 0` removed (lines 12–23, 9,230 B) against the same packet @ed73e76 | **0.8575** | 0.9337 | > every P1 PRIMARY (max 0.7200) | **PASS** |
| **Negative**, stripped | `handback/p-harness-E_2026-09-15.md` @1e944ac against `packet_leave_window` @ed73e76 (strip share 0%) | **0.4521** | 0.5268 | < every P1 PRIMARY (min 0.6401) | **PASS** |

### 8.2 · P1, polarity — against `loop/packet_leave_window_2026-09-14.md` @ed73e76 (9,910 B)

| Text | PRIMARY | Centroid | Unstripped | Hand-back S40: stripped / normalised chars (share) | Hand-back tokens · windows · abs m | Brief S40 stripped (share) | Brief tokens · windows · abs m |
|---|---|---|---|---|---|---|---|
| **A** `p-leave-A` @99649d8 (21,298 B) | **0.7200** | 0.8388 | 0.7334 | 43 / 18,961 (0.23%) | 5,375 · 3 · 0.9371 | 43 (0.49%) | 2,603 · 2 · 0.9229 |
| **B-read** `p-leave-read-B` @9e29daf (16,050 B) | **0.6880** | 0.8009 | 0.7003 | 563 / 15,079 (3.73%) | 4,398 · 3 · 0.9015 | 563 (6.37%) | 2,466 · 2 · 0.9350 |
| **E** `p-leave-E` @99649d8 (35,743 B) | **0.6401** | 0.7974 | 0.6721 | 517 / 30,046 (1.72%) | 8,641 · 5 · 0.8639 | 321 (3.63%) | 2,500 · 2 · 0.9422 |

No pair is void; the largest hand-back strip share is 3.73%. E is past 8,192 tokens before normalisation, and ran as
5 windows under the same rule.

**§8.3's prediction: FIRES.**
- The lower of A's and E's builds is E, at **0.6401**.
- B's contesting read scores **0.6880**: **0.0479 above** that build, where the prediction needed only "within 0.02
  of, or above".
- B's read sits **between** the two builds, under A by 0.0320.
- **By §8.3's own wording, this instrument measures CONTENT UPTAKE, not anchoring.** The claim must be renamed
  "content uptake", or paired with a polarity measure, before the header may say REGISTERED.
- The unstripped secondary gives the same order (A 0.7334 > B 0.7003 > E 0.6721), and so does the centroid
  secondary (0.8388 > 0.8009 > 0.7974). So the verdict does not depend on the strip or the aggregator.

### 8.3 · P2, scale — own packet minus the mean of the other packets (R4)

**The set:**
- **Packets:** 8, every `loop/packet_*_2026-09-1[45].md` except `packet_diversity_c1_and_leave2` (R4).
- **Hand-backs:** 21, being the 16 pattern-matched ones plus 5 of R4's seven reads, each assigned to the packet it read.
- **Texts:** each hand-back at `1e944ac`. Its own packet is read at the parent of the commit that first added the
  hand-back (R4).
- **Other packets:** each at `1e944ac`. R4 does not say which version, so the pre-registration chose the final state.
  A **sensitivity** column takes the other packets at the same parent commit instead; it is reported and never used
  to decide.

**Excluded, and why:**
- `handback/anchor-registration-read-B_2026-09-15.md`: its brief is the registration DRAFT, not a packet in the set.
- `handback/readme-audit_2026-09-14.md`: a Third Place hand-back at the keeper's ask, with no packet.
- `loop/packet_diversity_c1_and_leave2_2026-09-15.md`: excluded by R4.
- **Void pairs: none.** Own-pair hand-back strip share stays between 0.29% and 4.50%.

**THE DISTRIBUTION** (the PRIMARY delta):

| | n | min | Q1 | median | Q3 | max |
|---|---|---|---|---|---|---|
| **Primary: other packets at final state** | **21** | **0.0778** | **0.1160** | **0.1302** | **0.1382** | **0.1908** |
| Sensitivity: other packets at the hand-back's parent | 19 | 0.0542 | 0.0935 | 0.1075 | 0.1163 | 0.1593 |

The sensitivity column has n = 19 because `p-stick-A` and `p-stick-E` landed before any other packet in the set
existed at their parent.

**Every row:**

| Hand-back (@1e944ac) | Own packet @sha (parent of landing) | Own PRIMARY | Mean of 7 others | **Δ** | Hand-back strip share | Δ sensitivity |
|---|---|---|---|---|---|---|
| p-diverged-read-C_2026-09-14 | packet_diverged @6397e1a | 0.8059 | 0.6151 | **0.1908** | 3.57% | 0.1515 |
| p-diverged-E_2026-09-14 | packet_diverged @31fb65f | 0.7620 | 0.5936 | **0.1684** | 4.50% | 0.1277 |
| p-no-console-A_2026-09-14 | packet_no_console_windows @6174324 | 0.6908 | 0.5238 | **0.1670** | 1.25% | 0.1593 |
| p-stick-build-E_2026-09-14 | packet_stick_build @4085f2f | 0.7599 | 0.6028 | **0.1571** | 3.65% | 0.0977 |
| p-leave-A_2026-09-14 | packet_leave_window @b9b4cd1 | 0.7657 | 0.6127 | **0.1529** | 0.44% | 0.1112 |
| p-leave-read2-B_2026-09-14 | packet_leave_window @6d89e2d | 0.6941 | 0.5559 | **0.1382** | 1.72% | 0.1160 |
| p-diverged-read2-C_2026-09-14 | packet_diverged @5e21844 | 0.7501 | 0.6138 | **0.1363** | 1.59% | 0.1060 |
| p-stick-A_2026-09-14 | packet_stick_module @f93f42e | 0.7048 | 0.5708 | **0.1340** | 1.54% | — |
| p-harness-read-B_2026-09-15 | packet_harness_and_lib @faaaa7b | 0.6722 | 0.5392 | **0.1330** | 0.42% | 0.1292 |
| p-stick-preflight-B_2026-09-14 | packet_stick_preflight_read @6174324 | 0.7493 | 0.6174 | **0.1319** | 0.29% | 0.0965 |
| p-diverged-A_2026-09-14 | packet_diverged @31fb65f | 0.7519 | 0.6218 | **0.1302** | 3.47% | 0.1071 |
| p-stick-build-A_2026-09-14 | packet_stick_build @4085f2f | 0.7362 | 0.6090 | **0.1272** | 3.46% | 0.0686 |
| p-no-console-E_2026-09-14 | packet_no_console_windows @6174324 | 0.6482 | 0.5266 | **0.1216** | 3.58% | 0.1166 |
| p-harness-E_2026-09-15 | packet_harness_and_lib @2782af4 | 0.5972 | 0.4757 | **0.1215** | 0.72% | 0.1142 |
| p-stick-E_2026-09-14 | packet_stick_module @1346cb9 | 0.7016 | 0.5828 | **0.1188** | 0.47% | — |
| p-diversity-c0-E_2026-09-15 | packet_diversity_c0 @cf0ea20 | 0.5896 | 0.4736 | **0.1160** | 0.55% | 0.1160 |
| p-leave-E_2026-09-14 | packet_leave_window @b9b4cd1 | 0.6791 | 0.5632 | **0.1159** | 2.21% | 0.0904 |
| p-leave-read-B_2026-09-14 | packet_leave_window @9bc063f | 0.6880 | 0.5781 | **0.1099** | 3.73% | 0.0816 |
| p-diversity-c0-C_2026-09-15 | packet_diversity_c0 @cf0ea20 | 0.5087 | 0.4012 | **0.1075** | 0.82% | 0.1075 |
| p-harness-A_2026-09-15 | packet_harness_and_lib @faaaa7b | 0.6502 | 0.5543 | **0.0959** | 0.49% | 0.0879 |
| p-stick-preflight-C_2026-09-14 | packet_stick_preflight_read @6174324 | 0.7051 | 0.6273 | **0.0778** | 0.33% | 0.0542 |

**What the numbers say, and what they do not decide:**
- **Every one of the 21 hand-backs sits closer to its own packet than to the mean of the others** (Δ from 0.078 to
  0.191).
- **The provisional 0.10 lies below P2's Q1 (0.116)**, and near the sensitivity median (0.108). Here Δ is an
  own-task versus other-task gap. The claim's briefed-versus-unbriefed gap is measured on the *same* task, so there
  is no reason to expect it to be larger than this. **Setting the threshold is the chair's (8.1); these are its
  inputs, not a ruling.**
- **Reads do not score lower than non-read hand-backs.** The 7 reads (including stick-preflight B and C) have median
  Δ **0.1330**; the other 14 have median Δ **0.1244**. The highest Δ of all is a contesting read (`p-diverged-read-C`).
  This is the same picture as P1: the instrument sees how much of a packet a text engages, not whether it agrees.

### 8.4 · What this does NOT establish

- **Nothing about briefed against unbriefed panes.** Every text here was briefed. P2 is the scale, and P1 is
  polarity on one packet.
- **P1 is one packet, three texts, one encoder.** §8.3 fired by 0.048. I have no variance estimate for that margin:
  the run is deterministic, so a re-run changes nothing, and nothing was resampled.
- **The positive control is an encoder test only (R1).** It passing says nothing about the strip pipeline.
- **The unstripped secondary was computed for P1, not for P2's rows.** R4's P2 score is the PRIMARY delta, and P2's
  centroid secondary is stored per row in `results-c1.json`.
- **Which version of the "other packets" to use was my pre-registered choice**, because R4 is silent on it. The
  sensitivity column shows the alternative: the median moves 0.130 → 0.108 and the order is similar. The chair can
  rule it either way without a re-run; both are computed.
- **The scorer's stake, as the pre-registration states:** 4 of the 21 hand-backs are my own (p-diversity-c0-C,
  p-diverged-read-C, p-diverged-read2-C, p-stick-preflight-C). They include the highest Δ and the lowest. The run is
  mechanical, and **E has not re-run it yet.**
- **Two of R4's seven reads could not be included**, because they have no packet in the set (listed above).
- **Speed on D** was not recorded.
