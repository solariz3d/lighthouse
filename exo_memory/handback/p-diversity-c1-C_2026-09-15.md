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
