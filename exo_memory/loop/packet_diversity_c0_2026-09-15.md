# P-DIVERSITY-C0 · two measurements that must exist before the first diversity registration

**To CHARLIE and ECHO, 2026-09-15 ~06:55, on machine L.** The crossing is the keeper's "real meat and potatoes":
diversity collapse and retrieval. Its door is `loop/third_place_diversity_hold_2026-09-14.md`; the work is
`third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md` §C–§E (readable since the keeper's reversal at 76d37dc).
**Nothing is registered, built or scored in this packet.** It measures the two things the registration cannot be
written without.

## 0 · THE KEEPER'S DECISION, VERBATIM

Asked (06:50): "Anchor similarity (how much of a pane's answer is the chair's brief coming back) needs text
embeddings, and the repo has none. Which way?"
Answer: **"Local model (Recommended)"**. That option read: *"A small embedding model that runs on this machine, no text
leaves it. One new dependency … A pane measures the exact package, size and speed first; nothing installed until
that's back."*

**Why not word overlap:** `consonance/tools/agreement-spread.js:3-12` rated ONE MIND 0.9162 against SIX MINDS 0.8201,
because lexical overlap rewards topic drift. §C1's calibration (0.627 against 0.441) is an embedding cosine.

## 1 · CHARLIE — which local embedding model, measured on paper first

Report, with sources (current official docs and model cards, not memory):
- **Candidates** that run in Node on Windows with no network at inference: a transformers.js/ONNX sentence-embedding
  path, and anything else current.
- **For each:** package name and version, model name, download size, licence, whether it runs fully offline after
  one download, and the embedding dimension.
- **What the paper embedded with** (Chen et al., arXiv 2604.18005), if it says, so §C1's 0.627 against 0.441 is
  comparable. If our model differs, say that the calibration does not transfer as a number.
- **One recommendation, with the reason.**

**Install NOTHING, not even in a scratchpad, until the keeper approves a trial from your report.** No repo edits.
You built none of the room's diversity gauges, which is why you have this.

## 2 · ECHO — can a committee pane run on a different model? (§E1 arm c's feasibility)

Read only. Facts at filing: `PaneModels` (`main.rs:1504`), a one-shot `--model` path (`:7856`), and no model field
for any pane in `~/.consonance.json` (`loop/third_place_diversity_hold_2026-09-14.md:46`). Answer at source:
- Can a committee pane be spawned or resumed on another model (Fable 5.1, say) today?
- If not, what is the smallest change, and what would it break: resume, the intake, the capture?

Path:line for every claim. **Change nothing.** You know `main.rs`'s spawn sites from P-LEAVE D-1.

## 3 · WHAT COMES AFTER, SO NOBODY BUILDS AHEAD OF IT

§E3's registration comes next, on the next shift unless both measurements are back well before 08:00:
- **The claim:** anchor similarity discriminates briefed from unbriefed panes, the briefed cosine to the brief
  exceeding the unbriefed by ≥0.1.
- **Its falsifier:** the two distributions overlap.
- **The registered rival:** the keeper's counter-hypothesis (`third_place/2026-09-15.md:209-215`), which says the
  path through the weights, not the weights, decides the blind spots.

§D's five design changes are the keeper's to rule, not a pane's.

## 4 · HAND-BACK

`exo_memory/handback/p-diversity-c0-<letter>_2026-09-15.md`, then `call_librarian` with the path. "Nothing local is
good enough" and "a pane cannot run on another model without breaking resume" are valid answers.

## 5 · THE KEEPER APPROVED C's TRIAL (07:0x, verbatim: "Approve the trial (Recommended)")

**What he was asked:** "C's trial: install @huggingface/transformers 4.2.0 (pinned) in a scratch folder, NOT the
repo; download nomic-embed-text-v1.5 once (~137 MB); prove it runs offline; time it; test whether it reads a whole
long hand-back properly. Nothing enters the repo. Approve the trial?"

**The trial, as C wrote it** (`handback/p-diversity-c0-C_2026-09-15.md` §4):
1. Pinned install in C's scratchpad.
2. One model download, then run again with `env.allowRemoteModels = false` and the network disabled, to prove it
   works offline.
3. Load time, and seconds per 16 KB of text.
4. The long-context check: one real ~16 KB hand-back embedded whole, against the mean of its 1,800-token chunks.
   Report the cosine, and fall back as §3 names if it degrades.
5. sha256 of the exact model file.

**The model is not a repo dependency** until the trial passes and the keeper says so again.
