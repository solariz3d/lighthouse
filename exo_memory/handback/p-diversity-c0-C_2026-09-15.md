# P-DIVERSITY-C0 · CHARLIE — which local embedding model, measured on paper

Lap: none open. 2026-09-15 ~06:45–07:40, machine L (ZachsLEGION), seat C (Around).
Packet `exo_memory/loop/packet_diversity_c0_2026-09-15.md` (57f21c7) §1.

- **Installed nothing, anywhere.**
- **Read-only calls only:** `npm view` (registry metadata), the Hugging Face model API and each model's
  `config.json` / `README.md` / `1_Pooling/config.json` via `curl`, the paper's public code through `gh api`, and
  official docs pages. No model weights were downloaded.
- No repo edit other than this file and one line in my map.

---

## 0 · THE ANSWER

**Recommendation: `@huggingface/transformers` 4.2.0 running `nomic-ai/nomic-embed-text-v1.5`**: 768-dim,
Apache-2.0, ~137 MB quantized or ~547 MB full-precision ONNX, mean pooling with the `clustering: ` prefix. It must
first pass a trial the keeper approves.

**Why this one:**
- **It is the only small candidate that reads a whole median hand-back.** Hand-backs here are long (§2). Every
  512-token model would measure the opening ~2 KB of an answer and call it the answer.
- **Its licence is permissive**, and **its model card carries an official Transformers.js snippet for the exact
  package version line recommended.**

**Two findings the registration has to carry regardless of which encoder is chosen:**
1. **The paper's 0.627 against 0.441 is an OpenAI `text-embedding-3-large` cosine** (3,072-dim, API only). **No local
   model can reproduce that number, so the calibration does not transfer as a number.** What can transfer is its
   *direction*: briefed above unbriefed. That is exactly what §3's registered claim already tests (a ≥0.1 gap
   inside one encoder), so the claim survives the change of encoder. The 0.627/0.441 pair must not be quoted as a
   threshold for our model.
2. **nomic's 8,192-token context is extrapolated from 2,048 trained positions**
   (`max_trained_positions: 2048`, `n_positions: 8192`). Whether the ONNX export under Transformers.js holds past
   2,048 tokens is **unverified** and is the trial's first check. If it fails there, §3 of this file names the
   fallback.

---

## 1 · WHAT CHEN ET AL. EMBEDDED WITH — read in their code, not the abstract

The abstract and the arXiv HTML I could fetch do not name the encoder. Their method appendix (App. C) was truncated
in every fetch, and the PDF could not be rendered here without installing poppler, which I did not do. **The
released code names it.** Repo `Xtra-Computing/MAS_Diversity`, HEAD `7ee05c176c` (2026-04-23), read with `gh api`:

| Where | What it embeds with |
|---|---|
| Vendi and order parameter, `analysis/metrics/compute_vendi_and_order.py:72,196` | `get_openai_embeddings(texts, model="text-embedding-3-large")` |
| The anchor analysis, `analysis/figures/fig09_trajectory.py:29,90-98` | text-embedding-3-large; `# Anchor: 第一轮发言` ("first-round turn"): `anchor_vec = …get_embedding(turns[0]['text'])`, then `cosine_similarity(vec, anchor_vec)` for each later turn |
| Same metric, `fig10_topology_dynamics.py:52,134-143` | text-embedding-3-large |
| Dimension, `fig12_task_spectrum.py:57` | `np.zeros(3072)  # text-embedding-3-large 维度` ("dimension"); OpenAI's docs agree: 3,072 default, 8,192 input tokens |
| **Their own encoder-sensitivity check**, `compute_vendi_sensitivity.py:110` | `SentenceTransformer('BAAI/bge-large-en-v1.5')` |
| A secondary proposal-metrics script, `compute_proposal_metrics.py:54-63` | `all-MiniLM-L6-v2`, with a TF-IDF fallback |

**What this establishes:** the paper's anchoring metric is a cosine of each later turn to the *first turn*, in
text-embedding-3-large. The third-place review had already recorded this
(`third_place/REVIEW_MAS_Diversity_2026-09-14.md:15`); it is now confirmed at the code.

**What it does not:** I found no script that prints Table 6 itself. That Table 6's 0.627/0.441 used the same encoder
as `fig09` is a strong inference from the metric's identical definition, not a read.

**Why the number cannot travel.** Cosine distributions are specific to the encoder that produced them. BGE-family
and nomic models place unrelated English texts at much higher baseline cosines than OpenAI's v3 models do, so a gap
of 0.19 in one encoder says nothing about the size of the gap in another. The paper itself used a second encoder
(bge-large) only to check that *rankings* held, never to transfer values. **Our registration should do the same.**

---

## 2 · THE CONSTRAINT THAT DECIDES IT: THE TEXTS ARE LONG

The texts the instrument will embed, measured on disk: the 28 hand-backs and packets dated 09-14 and 09-15
(`ls -l exo_memory/handback/*2026-09-1[45]*.md exo_memory/loop/packet_*2026-09-1[45]*.md`):

    median 16,050 B · max 35,743 B · smallest packet 3,578 B

At roughly 4 bytes per token of English markdown (an estimate, not tokenized):

| Text | Approx. tokens |
|---|---|
| Median hand-back | ~4,000 |
| Largest hand-back | ~9,000 |
| Briefs | ~900–6,600 |

What each class of encoder can see:

| Encoder class | Reads | Share of a median hand-back |
|---|---|---|
| 256 tokens (all-MiniLM-L6-v2) | ~1 KB | ~6% |
| 512 tokens (every BGE, mxbai, e5-class) | ~2 KB | ~13% |
| 2,048 tokens (EmbeddingGemma; nomic's trained length) | ~8 KB | about half |
| 8,192 tokens (nomic claimed, gte-v1.5, text-embedding-3-large) | ~33 KB | all but the largest |

**A pane's answer to a brief usually opens by restating the brief.** An encoder that sees only the opening measures
exactly the anchoring we are trying to detect, by construction. That is a manufactured positive, in the room's own
failure shape. So context length is not a nicety here; it decides whether the instrument can be wrong in the
direction that matters.

---

## 3 · CANDIDATES

### 3a · Runtimes (npm metadata via `npm view`, 2026-09-15)

| Package | Version | Licence | What it pulls | Offline after first fetch | Notes |
|---|---|---|---|---|---|
| **`@huggingface/transformers`** | **4.2.0** (latest; GitHub release 2026-04-23) | Apache-2.0 | `onnxruntime-node` 1.24.3 (MIT; win32 in `os`; 220 MB unpacked across all platforms), `sharp` 0.34.5 (image library, native `@img/sharp-win32-x64`), `@huggingface/tokenizers`, `@huggingface/jinja` | Yes, per docs: `env.allowRemoteModels = false` plus `env.localModelPath` | The official HF path. Every model below except the GGUF route has its ONNX here. |
| `fastembed` (Qdrant, fastembed-js) | 2.1.0 (2025-12) | MIT | `onnxruntime-node` 1.21.0, `@anush008/tokenizers`, `@huggingface/hub`, `tar` | Cache dir, yes | **Fixed model list: bge-small/base-en(-v1.5), all-MiniLM-L6-v2, bge-base-zh.** All 256–512 tokens, so §2 excludes it. |
| `node-llama-cpp` | 3.21.1 (2026-09-12) | MIT | 29 runtime deps including `cmake-js`, `simple-git`, `ipull`; downloads llama.cpp prebuilt binaries | Yes, with a local `.gguf` | Embedding API `createEmbeddingContext().getEmbeddingFor()` (docs `guide/embedding.md`). Heaviest dependency tree, and the GGUF conversions are community builds, not the model authors'. |
| Ollama (outside Node) | — | — | A separate system service | Yes | Not "in Node": a daemon to install and keep running. Named for completeness, not recommended. |

**Every option makes this repo's first npm dependency.** There is no `package.json` in the tree today
(`find . -name package.json -not -path '*/node_modules/*'` found nothing), and every tool is Node standard library.
So the approval is also for introducing `package.json` and `node_modules/`, plus a manifest rule for the model
files (§4).

### 3b · Models (HF API and official model cards; dimension from `config.json`, context from `sentence_bert_config.json`)

| Model (ONNX repo) | Dim | Context | Licence | ONNX size: full / int8-quantized | Pooling (upstream config) | Card shows Transformers.js | Fit |
|---|---|---|---|---|---|---|---|
| **`nomic-ai/nomic-embed-text-v1.5`** | 768 (Matryoshka to 512/256) | **8,192** claimed; 2,048 trained | **Apache-2.0** | 547 MB / 137 MB | mean | yes, `@huggingface/transformers` | **Recommended** |
| `Alibaba-NLP/gte-base-en-v1.5` | 768 | 8,192 | Apache-2.0 | 556 MB / 147 MB | CLS | card shows **v2** `@xenova/transformers` only; custom `NewModel` architecture, **v4 support unverified** | fallback 1 |
| `onnx-community/Qwen3-Embedding-0.6B-ONNX` | 1,024 | 32,768 | Apache-2.0 (base model) | 2,401 MB (`.onnx` + `.onnx_data`) / 614 MB | last token; queries take `Instruct:` | yes | fallback 2: covers every text whole, ~4x the parameters of nomic, slowest |
| `onnx-community/embeddinggemma-300m-ONNX` | 768 | 2,048 | **Gemma terms of use** (not OSI; upstream gated) | 1,235 MB / 309 MB | model-specific prefixes | yes (no fp16) | licence and length both weaker |
| `Xenova/bge-large-en-v1.5` | 1,024 | **512** | MIT | 1,337 MB / 336 MB | **CLS** (the Xenova card's example uses `mean`, which does not match upstream) | yes | the **paper's own sensitivity encoder**; reads too little for the main instrument |
| `Xenova/bge-small-en-v1.5` | 384 | 512 | MIT | 133 MB / 34 MB | CLS | yes | reads too little |
| `Xenova/all-MiniLM-L6-v2` | 384 | **256** | Apache-2.0 | 90 MB / 23 MB | mean | yes | reads too little |

Machine L, where a trial would run first: AMD Ryzen 9 9955HX, 16 cores / 32 threads, 31.8 GB RAM, 628 GB free.
Every model above fits. **D's hardware was not read.**

---

## 4 · WHAT THE KEEPER WOULD BE APPROVING — the trial, and the conditions that come with any encoder

**The trial** (nothing runs until approved):
1. `npm install @huggingface/transformers@4.2.0`, pinned exactly, in a **scratch directory, not the repo**.
2. Download `nomic-ai/nomic-embed-text-v1.5` once. Then set `env.allowRemoteModels = false` and re-run with the
   network disabled to prove offline.
3. Measure load time, and seconds per 16 KB text on L.
4. **The long-context check (decides the model):**
   - Embed one real ~16 KB hand-back whole, with nomic.
   - Embed the same text in 1,800-token chunks and take the mean.
   - Report the cosine between the two results.
   - If whole-text output degrades past 2,048 tokens (cosine to the chunk-mean clearly low, or a runtime error),
     move to fallback 1, then fallback 2.
5. Hash the exact model file used (sha256).

**Conditions for the registration, whichever encoder wins:**
- **Name and hash the encoder before any pane computes a number, and freeze it** (the librarian's 06:41 condition,
  `librarian/2026-09-14.md`; the relevance registration's "named and hashed", `relevance_retriever_registration_2026-08-30.md:137-138`).
- **One encoder file, byte-identical on both machines.** Cosines from two builds are not one instrument. The model
  files (137 MB–2.4 GB) need a place in `state-manifest.json`; that is A's call. An unplaced file under the data dir
  would make `close.js` refuse.
- **State the text policy before scoring:** the prefix (`clustering: ` for nomic), the truncation or chunking rule,
  the pooling, and normalization. Each changes the number.
- **Compare within one encoder only.** The §3 claim (briefed exceeds unbriefed by ≥0.1) is well-formed for that.
  **Do not borrow the paper's 0.627/0.441.**
- **An optional rankings cross-check, as the paper did:** re-score the same pairs with `bge-large-en-v1.5` (the
  paper's sensitivity encoder, `pooling: 'cls'`) and report only whether the *ordering* holds. At 512 tokens it
  sees ~13% of each text, so this cannot stand in for the main encoder. This is the keeper's choice; I am not
  recommending a second dependency.

---

## 5 · WHAT I DID NOT VERIFY

- **Nothing ran.** No speed, memory, load time or output of any model was measured; §4 is where they would be.
- **nomic beyond 2,048 tokens under Transformers.js ONNX.** The card claims 8,192. Whether this runtime reaches it
  is the trial's first question.
- **gte-base-en-v1.5 on Transformers.js v4.** Its card shows only the v2 package, and its architecture is custom.
- **Table 6's encoder, read directly.** I read the code that defines the same anchor metric (fig09/fig10), not the
  code that prints Table 6. The PDF could not be rendered without installing a tool.
- **Whether Transformers.js makes any network call at inference beyond model loading** (telemetry or version
  checks). I have only the docs' `allowRemoteModels`/`localModelPath` settings. The trial's network-off run is the
  check.
- **The size of the full dependency install.** `onnxruntime-node` alone is 220 MB unpacked across platforms;
  `sharp`'s Windows binaries and the rest were not totalled.
- **Tokens per byte for this corpus.** The ~4 B/token figure is an estimate, not a tokenizer count.
- **D's hardware.**

## SOURCES

- Chen et al., arXiv 2604.18005: https://arxiv.org/abs/2604.18005 · code https://github.com/Xtra-Computing/MAS_Diversity (HEAD 7ee05c176c) · ACL Findings https://aclanthology.org/2026.findings-acl.13/
- OpenAI embeddings guide (text-embedding-3-large: 3,072 dim, 8,192 tokens): https://developers.openai.com/api/docs/guides/embeddings
- Transformers.js custom usage (offline settings): https://huggingface.co/docs/transformers.js/custom_usage · releases https://github.com/huggingface/transformers.js/releases · npm https://www.npmjs.com/package/@huggingface/transformers
- ONNX Runtime Node platform table: https://github.com/microsoft/onnxruntime/blob/main/js/node/README.md
- fastembed-js: https://github.com/Anush008/fastembed-js · node-llama-cpp embedding guide: https://github.com/withcatai/node-llama-cpp/blob/master/docs/guide/embedding.md
- Model cards: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5 · https://huggingface.co/Alibaba-NLP/gte-base-en-v1.5 · https://huggingface.co/onnx-community/Qwen3-Embedding-0.6B-ONNX · https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX · https://huggingface.co/Xenova/bge-large-en-v1.5 · https://huggingface.co/BAAI/bge-large-en-v1.5 · https://huggingface.co/Xenova/bge-small-en-v1.5 · https://huggingface.co/Xenova/all-MiniLM-L6-v2
