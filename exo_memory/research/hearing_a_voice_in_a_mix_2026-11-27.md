# Hearing a voice inside a full mix: what has been published, and what it would mean for Listen (the Third Place on L, 2026-11-27)

*Asked for by the keeper at 03:59 as research for fun: "What would you want to research for fun if you could?" The
seat chose this because Listen logged 17 rows for the 2:24 song he has on replay (11-26, `heard.jsonl` rows 1941 to
1957), where "Valasy" gave 160. Read 04:0x from the pages named. Nothing was installed, downloaded or run. No speed or
memory figure below was measured on his machines.*

## 1. Why Listen misses a voice over drums (read in `consonance/src-tauri/src/cochlea.rs`, header)

- The cochlea reports ratios between sustained pitches in the whole mix, and emits only on change.
- Drums are broadband and short, so they mask the pitched parts. A sung or rapped voice glides and wavers, so it
  seldom holds long enough to count as settled.
- Seen: Yung Lean "Yoshi City" 78 rows in 3:45 (09-21); Asenssia remix 17 rows in 2:24 (11-26).

## 2. Separating the voice first: offline models

| model | vocals SDR on MUSDB18-HQ | parameters | source |
|---|---|---|---|
| Mel-RoFormer (extra training data) | 13.29 dB | 105M | arXiv 2409.04702, ISMIR 2024 |
| BS-RoFormer (extra training data) | 12.82 dB | not read | same table |
| Mel-RoFormer (MUSDB18-HQ only) | 12.08 dB | 105M | same table |
| Mel-RoFormer small, 24 kHz mono | 11.01 dB | 9.1M | same table |
| Sparse HT Demucs | 9.37 dB | not read | same table |
| HDemucs | 8.04 dB | not read | same table |

- The paper does not say the authors released weights. It points to two open implementations
  (`lucidrains/BS-RoFormer`, `ZFTurbo/Music-Source-Separation-Training`). Community checkpoints are listed there and on
  Hugging Face (viperx, KimberleyJensen); their SDR figures come from different test sets and are not comparable with
  the table above. No repository or licence was opened here.
- Inference speed is not stated in the paper.

## 3. Separating live: real-time models

From arXiv 2511.13146 (Nanjing University, Nov 2025), Table I, MUSDB18-HQ, cSDR in dB, timed on an RTX 3080 Ti with
1024 samples per frame:

| model | latency | vocals | all stems | parameters | GPU time per frame |
|---|---|---|---|---|---|
| RT-STT, quantized | 23 ms | 5.56 | 5.17 | 383K | 1.01 ms |
| HS-TasNet | 23 ms | 5.13 | 4.65 | 42M | 3.90 ms |
| HS-TasNet-Small | 23 ms | 5.21 | 4.48 | 16M | 2.10 ms |
| DTTNet (offline, for reference) | 6,000 ms | 10.12 | 8.06 | 20M | not stated |

- So a live separator is fast enough for any recent GPU and is about 4.5 dB worse on vocals than an offline model in
  the same table (5.56 against 10.12), and about 7 dB worse than the best RoFormer above.
- The paper does not say whether code or weights are released.

## 4. Getting the sung notes directly

- The same Mel-RoFormer paper fine-tunes the separation model into a vocal melody transcriber. It outputs notes
  (onset, pitch, offset) for a single melody line.
- On MIR-ST500 (98 songs): onset-and-pitch F-measure 0.798 for the large model (64.6M parameters) and 0.786 for the
  small one (14.5M); the earlier SpecTNT scored 0.778. On POP909: 0.842 and 0.805.
- Other melody extractors found by search (TONet, MTANet, VOCANO) are older; VOCANO's authors recommend separating
  the voice first.
- No released weights for the transcriber were found. Not checked further.

## 5. What this would mean for Listen (the seat's reading, not a plan)

- The quality gap between live and offline separation is large. The better route is to listen twice: once live, as
  now, and once after the track ends, on the buffered audio, with an offline separator.
- The cochlea would not need to change what it reports. It would be run on two inputs: the vocal stem alone, and
  everything else. The intervals between the sung line and the harmony under it are then one more comparison.
- A separator is a new dependency and a download, and it would run on the GPU, so it needs his yes. It costs no
  Claude usage. It is a second use for the cards he asked about on 11-26, beside the judge.
- Not known: speed and memory on the 5070 Ti; which community checkpoint is licensed for this use; how a separated
  rap vocal, which has little stable pitch, would read even when clean.

## Sources
- https://arxiv.org/abs/2409.04702 (read in the HTML version through a fetch agent)
- https://arxiv.org/abs/2511.13146 (read in the HTML version through a fetch agent)
- https://github.com/ZFTurbo/Music-Source-Separation-Training/blob/main/docs/pretrained_models.md (search summary only)
- https://huggingface.co/AEmotionStudio/roformer-models (search summary only)
- https://mvsep.com/en/algorithms (search summary only)
- https://sonicstate.com/news/2026/02/02/real-time-source-separation-on-gpu/ (search summary only)
- https://github.com/B05901022/VOCANO (search summary only)
