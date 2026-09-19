'use strict';
// s40-strip.js — the S40 quotation strip for anchor similarity, frozen as code.
//
// Definition: loop/anchor_similarity_registration_DRAFT_2026-09-15.md §8.7 R2. It is code because the prose form had
// three readings of the same files (B 3.7% / 1.7%, C 3.51% / 1.46%, the librarian 3.73% / 1.72%). This file is the
// definition now; its sha256 is recorded in the registration when it lands, and a change to it is a new registration.
//
//   normalise   drop the characters > * ` _ #, then collapse every run of whitespace to one space; no case folding
//   mark        every 40-character run of the normalised text that occurs anywhere in the normalised other text
//   embed       the NORMALISED text minus the marked characters
//   share       marked characters over normalised characters
//   per pair    the hand-back is stripped against its brief, and the brief against that same hand-back, by this
//               one function with the arguments swapped
//
// "Drop, then collapse": a dropped marker leaves no character behind, so the whitespace on either side of it becomes
// one run and collapses to one space.

const SPAN = 40;
const DROPPED = new Set(['>', '*', '`', '_', '#']);

function normalise(text) {
  let out = '';
  let inSpace = false;
  for (const ch of String(text)) {
    if (DROPPED.has(ch)) continue;
    if (/\s/.test(ch)) {
      if (!inSpace) out += ' ';
      inSpace = true;
      continue;
    }
    out += ch;
    inSpace = false;
  }
  return out;
}

/**
 * Strip from `text` every normalised 40-character run that also occurs in `other`.
 * Returns the text to embed (normalised, marked characters removed) and the counts the registration reports.
 */
function s40Strip(text, other) {
  const t = normalise(text);
  const o = normalise(other);
  const runs = new Set();
  for (let i = 0; i + SPAN <= o.length; i++) runs.add(o.slice(i, i + SPAN));
  const marked = new Uint8Array(t.length);
  for (let i = 0; i + SPAN <= t.length; i++) {
    if (runs.has(t.slice(i, i + SPAN))) marked.fill(1, i, i + SPAN);
  }
  let kept = '';
  let strippedChars = 0;
  for (let i = 0; i < t.length; i++) {
    if (marked[i]) strippedChars++;
    else kept += t[i];
  }
  return {
    text: kept,
    normalisedChars: t.length,
    strippedChars,
    share: t.length === 0 ? 0 : strippedChars / t.length,
  };
}

module.exports = { SPAN, DROPPED, normalise, s40Strip };
