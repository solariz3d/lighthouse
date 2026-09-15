'use strict';
// phase-window.js — the phase windowing for anchor similarity, frozen as code.
//
// Definition: loop/anchor_similarity_registration_DRAFT_2026-09-15.md §8.8.1 R8e (57a299b), in the S40 precedent
// (§8.7 R2): this file is the definition, its sha256 is recorded in the registration when it lands, and a change to it
// is a new registration.
//
//   phases    PHASE ∈ {0, 300, 600, 900, 1200, 1500}
//   windows   a first window of PHASE token ids, then consecutive 1,800-id windows; the last takes the remainder
//   PHASE 0   §8.2 exactly: consecutive 1,800-id windows from the first id (C's score.mjs run 2, lines 46-48)
//   short     a phase at or past the text's length gives one window
//   wrap      CLS and SEP on every window; `tokens` is the window's id count WITHOUT them (§8.7 R3's weight)
//
// The same phase on both sides of a pair, and the mean over the six phases, are the scorer's; this file only cuts.
//
// AN EMPTY TEXT IS REFUSED. At zero ids the two frozen clauses disagree: PHASE 0 as §8.2 cuts no window at all, while
// "a phase at or past a text's length gives one window" would cut one window with no ids in it. The scorer voids an
// empty stripped text before it windows (score.mjs:76), so the case is unreachable there; refusing it here keeps this
// file from choosing between the clauses.
//
// Prior art: E's scratch phase.mjs (handback/p-diversity-c1-E_2026-09-15.md §5.2), whose table this must reproduce.

const PHASES = Object.freeze([0, 300, 600, 900, 1200, 1500]);
const WINDOW = 1800;

/** The [start, end) id ranges of the windows for a text of `length` ids at `phase`. */
function windowBounds(length, phase) {
  if (!Number.isInteger(phase) || phase < 0) throw new Error(`phase must be a non-negative integer, got ${String(phase)}`);
  if (!Number.isInteger(length) || length < 0) throw new Error(`length must be a non-negative integer, got ${String(length)}`);
  if (length === 0) throw new Error('an empty text has no windows under both clauses of R8e; the caller must void it first');
  const bounds = [];
  let start = 0;
  // The head window: PHASE ids, unless the phase is 0 (no head) or at/past the length (the whole text is the head).
  if (phase > 0) {
    const end = Math.min(phase, length);
    bounds.push([0, end]);
    start = end;
  }
  for (; start < length; start += WINDOW) bounds.push([start, Math.min(start + WINDOW, length)]);
  return bounds;
}

/**
 * The windows of `ids` at `phase`, each `{ ids: [cls, ...body, sep], tokens: body.length }`.
 * `cls` and `sep` are required: a default would be a guess about the tokenizer.
 */
function phaseWindows(ids, phase, { cls, sep } = {}) {
  if (!Number.isInteger(cls)) throw new Error('the CLS token id is required');
  if (!Number.isInteger(sep)) throw new Error('the SEP token id is required');
  if (!Array.isArray(ids)) throw new Error('ids must be an array of token ids');
  return windowBounds(ids.length, phase).map(([a, b]) => {
    const body = ids.slice(a, b);
    return { ids: [cls, ...body, sep], tokens: body.length };
  });
}

module.exports = { PHASES, WINDOW, windowBounds, phaseWindows };
