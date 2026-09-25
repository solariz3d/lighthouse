# Battery run 2 — the sealed rows, prepared by B (D136). **NOT FOR LANDING as they stand: no kind has a fieldable pair.**

No task text, key, plant, cold answer or score text is in this file or anywhere in the repository. The keys, objects and
cold results live off-repo in three separate roots on D (object / key / cold, A5); their location is deliberately not named here.
Every digest below is re-derivable by `node <B scratch>/d136/seal.js digests` on D.

    AUTHORED AGAINST   05667349fde0f3e171c313adc52f404a2a5836b7  (a `git archive` of that commit; every process ran on claude-opus-5-5, isolated, non-persisting)
    SEAL               the commit that lands this file, this path, and each sha256 below (COMMITTEE seal-row exception: one file)
    REVEAL             after scoring, each task's sealed key and cold results are committed at
                       exo_memory/loop/battery_run2_reveal/<task>/ and must hash to the values below
    SUBJECTS           A, C, E. B is out (draft §7). Floor: every subject ≤ 2 of N → VOID.

## The rows

| task | status | object (tree sha256) | sealed key (sha256) | criteria / X | cold 1 (tree sha256) | cold 2 |
|---|---|---|---|---|---|---|
| T1a | DROPPED §2 — one semantic mark survived two rewrites (its cold-1 digest is the FIRST version's; the replacement was never cold-read) | `4b4bf321b9792f8705129faea0ceedabeb535d27ec0886e6c693b343253bebd2` | — (no sealed key: dropped at §2) | - / - | `42150d16eef1fe0679327d98dd82cf3870ba99482521d1d3e5ca3cc57b4b2992` | not run |
| T1b | DROPPED §1 — cold reader 1 caught 17 of 20 mutants after the one retry (3 remain < 6) | `02cd2c1fb7045fa2af2d30c1bd2bedbf73cc547421048f0925ed925f4d3bfd28` | `0ca7a087860d4a512e7d6624398e4dcc7bc277986d5772b77b9802ffb3e1a046` | 3 / 3 | `6f6c02eeeb9d7d502b5fd18bff71dcc7a4b9a1a163dfee5558fbad5bab8f0fe9` | not run |
| T2a | DROPPED §1 — cold reader 1 found 14 of 14 plants after the one retry | `82fdd5c87d42a89a52da996d730494b17e08deca8ca7189813b963b6bf030c88` | `a23aa639bb1a8cd7f4244f4f5893e3eb307bd8500a86448faf791ccb16464361` | 0 / 0 | `91563b265a4bc2e279a2faa7ef320060825613cc0bd57946c1f33d722549c247` | not run |
| T2b | DROPPED §1 — cold reader 1 found 16 of 16 plants after the one retry | `f9b56768074502574f1843465ee9acd3676678e48928b5e07dfa3ab96b7c2fe3` | `a11ed310b31f6e2291961461ef5a9f47f7e507d9c149a0b7dedc601110ac0e38` | 0 / 0 | `b27644794715f21ea20379bad85f0aa01355249b0cd2feed70eabc3f63b86685` | not run |
| T3a | DROPPED §1 — cold reader 1 found 12 of 12 key paths after the one retry | `8b7942f4669148619a1c44acb40a2015f77cd93281b1ccdd59f38ee17c80bb44` | `8513b7a450cfda6c0a8b63093e6715f2d3d0764f89c0a133741b5fcf4b727a1d` | 12 / 0 | `7d35051e76a4ea9df75556a165aa91efd128ece439a5a8455e802bff07a98a5c` | not run |
| T3b | PASSES §1 by the draft's rule (7 of 13 < X=13; 6 not GREP-REACHABLE) — but T3a failed, so T3 has no pair (R2-5) | `d7c40f957d07984a8df41b9c8253dacc66bc704f1c0c6c65cdd324b7b19fb65f` | `bbf9ed738bc206c72e64a33797d5c30a31ade9387785faa66f83b84cf45075e5` | 13 / 6 | `300c85cadc51a7dbeb0ba013e3ae72c8d1964b225d6f1475f674fed5b10ea666` | not run |
| T5a | PASSES §1 — cold reader 1 found 4 of 17; 13 remain, X=13 — but T5b failed, so T5 has no pair (R2-5) | `bf786791a278bc8e78eb35738541d69f17a354aa7582cc0e236d62a0694f4eb3` | `6446581e4f4870942602d5d09d1c2b47b454921ed6d1241ca966c84e7ab1c3a9` | 13 / 13 | `033aaf7ae5b9b234bfdc67ef12feea79bb05b376e5c20af842d7d5fdd5c0ee70` | not run |
| T5b | DROPPED §1 — cold reader 1 found 10 of 14 after the one retry (4 remain < 8); its first cold run wrote no answer and was rerun | `19a6b94741125c2a0dfcffc6701620b6cad40fae2958383e8ee48b3e625ec807` | `c809be7a3fe31e80915c059db73a2005c5368aa22ca9c2b239de1f4420c752ab` | 4 / 4 | `4da7fb1872493a909f2436309fecbebdb98634a0c128d7736de5fb05a073d3d7` | not run |

The tree sha256 is the sha256 of the sorted lines `relative/path<TAB>sha256(file)` of that directory, each line ending in a newline.

## A6 — the a/b order per subject, fixed here before any dispatch

| subject | T1 | T2 | T3 | T5 |
|---|---|---|---|---|
| A | a then b | b then a | a then b | b then a |
| C | b then a | a then b | b then a | a then b |
| E | a then b | b then a | a then b | b then a |

## Why cold reader 2 was not run

A2's second cold reader is the BASE RATE for a task that goes to subjects. After §1 no kind has both a and b passing, so under
R2-5 no task goes to a subject, and a base rate for a task nobody takes measures nothing. It is one command per task
(`orch.js cold cr2 <task>` then `orch.js score cr2 <task>`) if the keeper fields single tasks.
