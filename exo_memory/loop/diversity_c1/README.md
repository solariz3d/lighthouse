# diversity_c1 — the P-DIVERSITY-C1 record, carried out of the scratchpads

Carried 2026-09-19 by pane E (lap D079, packet P-SCORER-INTO-THE-REPO,
`loop/plan_small_fixes_2_2026-09-19.md` row E), per the order in
`loop/handoff_librarian_2026-09-16_morning.md` item 2 and `librarian/2026-09-16.md:27`. Every file is a
byte-for-byte copy of a scratchpad file on D; no scorer was edited. The hand-back with the before/after
shas and the reproduction run is `handback/p-scorer-into-repo-E_2026-09-19.md`.

## What is where

    dev/diversity/score.mjs                 sha256 19c97ab5…9e2a   E's step-0 scorer (was score-step0.mjs) — THE instrument
    dev/diversity/s40-strip@5a2d3c0.cjs     sha256 73917f67…e087   the strip the scorer loads BY THIS NAME (= dev/diversity/s40-strip.js)
    dev/diversity/PREREG-C1.txt             sha256 51ef51d3…0a2a   C's pre-registration; the scorer reads and hashes it from its own directory
    dev/diversity/block-net.cjs             sha256 03fcb5b1…cd5f   the network-blocking preload the run command requires
    dev/diversity/score-deps/               package.json + package-lock.json of the run (@huggingface/transformers 4.2.0)
    loop/diversity_c1/score-c1-run2.mjs     sha256 ecf03768…eafb   C's run-2 scorer (was score.mjs) — the record step 0 diffs against
    loop/diversity_c1/score-step0.diff      sha256 ecacc774…1a4a   exactly what step 0 adds to C's run-2 scorer
    loop/diversity_c1/results-c1.json       sha256 0d82c32c…b71d   C's run 2 output
    loop/diversity_c1/results-step0.json    sha256 60c7d726…b1d0   the step-0 scorer's output

`PREREG-C1.txt` and the strip copy sit beside the scorer, not here, because the scorer resolves both from
its own directory (`path.join(here, …)`) and nothing in it was to be edited. The strip copy duplicates
`dev/diversity/s40-strip.js` byte for byte; the scorer hash-checks it and loads it by the `@5a2d3c0.cjs` name.
`score-deps/` is a subdirectory so its `"type": "module"` cannot reach the CommonJS files in `dev/diversity/`.

## NOT in the repo — the externals, named

**The encoder**, `Alibaba-NLP/gte-base-en-v1.5`, fetched from the Hugging Face hub by
`AutoModel.from_pretrained(id, { dtype: 'q8' })` with NO revision pinned. The scorer refuses to run unless
the onnx file hashes to the frozen value, so a hub change fails loudly rather than scoring silently.
Expected under `<scorer dir>/models/Alibaba-NLP/gte-base-en-v1.5/`:

    onnx/model_quantized.onnx   146,540,971 B   sha256 e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509   (checked by the scorer)
    tokenizer.json                  711,661 B   sha256 cb374d6bc042c22455946f4e09a89d29882a199fdaf8fb25be00dc8b8857a448   (not checked)
    tokenizer_config.json             1,383 B   sha256 1ca2f5edb2909927472409df7680004ba44f915c0412c71375acd859e7ab3bd6   (not checked)
    config.json                       1,348 B   sha256 238854682d429ce12c49ed3d1a31b6d1b9622d2afbcf50a17243da18926cbcab   (not checked)

On D a copy lives in E's and C's scratchpads (`…sibling-07b8a48f/a2122153…/scratchpad/c1read/c1/models`,
`…sibling-0845a868/0845a868…/scratchpad/c1/models`). Nothing of it is on L.

**The runtime**: `@huggingface/transformers` 4.2.0 (lock in `score-deps/`), which brought
`onnxruntime-node` 1.24.3. Node v24.14.1 on D on 2026-09-19; the node of the 09-15 runs was not recorded.

**The texts** are read from git at fixed commits inside the scorer (`git -C C:/Users/nname/Desktop/lighthouse
show <sha>:<path>`), and `dev/diversity/phase-window.js` from that same absolute path, hash-checked. The repo
path is hard-coded, so the scorer runs as written only on a machine with the checkout at that path.

## Run

    <dir> = a directory holding the four dev/diversity files above, models/ as listed, and node_modules
            from `npm ci` in score-deps/ (or a junction to one)
    cd <dir> && node --require ./block-net.cjs score.mjs        # writes <dir>/results-step0.json
    sha256sum results-step0.json                                 # the registered output is 60c7d726…b1d0

Do not run it inside `dev/diversity/`: it writes `results-step0.json` beside itself, and it needs the
147 MB encoder beside itself too.
