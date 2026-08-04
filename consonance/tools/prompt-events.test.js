#!/usr/bin/env node
/* prompt-events.test.js — the two ways of miscounting this, each with a fixture whose right
 * answer is known in advance, plus the negative controls that keep the discriminators honest.
 *
 * Both failure modes were committed by the chair before the tool existed, which is why they
 * are the tests rather than an afterthought:
 *   1. counting a MENTION (somebody grepping for the phrase) as a firing
 *   2. counting a REDRAW (the terminal repainting one prompt) as a second firing
 *
 * The negative controls matter more than the positives here: a tool that merges everything
 * reports 1 and looks calm, and a tool that merges nothing reports 10 and looks thorough.
 * Both are wrong and neither announces it.
 */
"use strict";
const assert = require("assert");
const { strip, mergeRedraws, similarity, PHRASE, DOCS, AFFORD } = require("./prompt-events.js");

let n = 0;
const ok = (cond, msg) => { n++; assert.ok(cond, msg); console.log("  ok  - " + msg); };

// ---- the signature that separates a firing from a mention -------------------------------
{
  const realRender = `${PHRASE} to help us improve Claude Code? Learn more: https://code.claude.com/docs/en/${DOCS} y: Yes n: No d: Don't ask again`;
  ok(realRender.includes(DOCS) && AFFORD.test(realRender),
     "a genuine render carries BOTH the docs line and the y/n/d affordance");

  const grepping = `${PHRASE}"; const strip = s => s.replace(/x1b/g, "")`;
  ok(!(grepping.includes(DOCS) && AFFORD.test(grepping)),
     "a shell command containing the phrase is NOT a firing");

  // the negative control that keeps the AND honest: half the signature must not pass
  const halfOnly = `${PHRASE} to help us improve Claude Code? Learn more: https://code.claude.com/docs/en/${DOCS}`;
  ok(!(halfOnly.includes(DOCS) && AFFORD.test(halfOnly)),
     "docs line WITHOUT the affordance does not count — the test is a conjunction, not an OR");

  // narrow terminals wrap the affordance differently; the rule must survive that
  const wrapped = `${PHRASE} ... ${DOCS} y:  Yes   n:  No  d: Don't ask again`;
  ok(wrapped.includes(DOCS) && AFFORD.test(wrapped),
     "and it still matches when the terminal wraps the affordance with extra spacing");
}

// ---- REGRESSION: the bound is in STRIPPED chars, not raw bytes ---------------------------
{
  /* The first version of this tool read 400 RAW bytes and tested the signature against the
   * stripped result. Escape density varies hugely between renders, so on 3 of 11 real hits
   * those 400 bytes stripped to less than the signature's ~170 characters and genuine
   * firings were filed as mentions — including the one the keeper had screenshotted, which
   * is the only reason it was caught.
   *
   * This fixture is a render at realistic escape density: the same visible text, padded
   * with the ANSI a repaint actually carries. Under the old rule it fails. */
  const esc = "\x1b[38;2;153;153;153m\x1b[0m\x1b[K\x1b[2m\x1b[22m";
  const dense = PHRASE + esc.repeat(20) + " to help us improve Claude Code?" + esc.repeat(20) +
                ` Learn more: https://code.claude.com/docs/en/${DOCS}` + esc.repeat(20) +
                " y: Yes n: No d: Don't ask again";

  const oldRule = strip(dense.slice(0, PHRASE.length + 400));
  ok(!(oldRule.includes(DOCS) && AFFORD.test(oldRule)),
     "the OLD raw-byte bound MISSES this render — the bug, reproduced");

  const newRule = strip(dense).slice(0, 240);
  ok(newRule.includes(DOCS) && AFFORD.test(newRule),
     "bounding in stripped characters finds it — the fix, demonstrated");
}

// ---- redraw merging, and the control that stops it merging everything --------------------
{
  const sameScreen = "…and that is why the tangent is shared across the boundary.";
  const other = "…entirely different text on screen at this point, nothing alike.";

  /* REGRESSION: capture is LOSSY, so two repaints of one screen are NOT byte-identical.
   * These two strings are the real pair from the main pane's log, and an exact-match rule
   * treated them as separate firings — it merged the one clean pair and double-counted the
   * dirty one, which is a rule that works by luck. */
  const lossyA = "is the tightest thing anyone has said about this projec including me. Thatwa worth the relay.";
  const lossyB = "is the tightest thing anyone has said about th project  including me. That was worth the relay.";
  ok(lossyA !== lossyB, "the two real captures of one screen are genuinely not identical");
  ok(similarity(lossyA, lossyB) > 0.9, `lossy repaints of one screen score high (${similarity(lossyA, lossyB).toFixed(3)})`);
  ok(similarity(lossyA, other) < 0.5, `two different screens score low (${similarity(lossyA, other).toFixed(3)})`);
  ok(mergeRedraws([{ at: 1, firing: true, context: lossyA }, { at: 30000, firing: true, context: lossyB }]).length === 1,
     "so a lossy repaint merges — the bug this replaced would have counted it twice");

  const twoRedraws = mergeRedraws([
    { at: 1000, firing: true, context: sameScreen },
    { at: 27000, firing: true, context: sameScreen },   // observed gap was ~27 KB
  ]);
  ok(twoRedraws.length === 1, "one prompt repainted close by counts once");
  ok(twoRedraws[0].redraws === 1, "and the repaint is recorded rather than silently dropped");

  const twoRealFirings = mergeRedraws([
    { at: 1000, firing: true, context: sameScreen },
    { at: 2000, firing: true, context: other },
  ]);
  ok(twoRealFirings.length === 2,
     "NEGATIVE CONTROL — two firings close together but on different screens stay separate");

  const farApart = mergeRedraws([
    { at: 1000, firing: true, context: sameScreen },
    { at: 40_000_000, firing: true, context: sameScreen },
  ]);
  ok(farApart.length === 2,
     "NEGATIVE CONTROL — identical context 40 MB apart is a second firing, not a redraw");
}

// ---- the stripper, because every rule above runs on its output ---------------------------
{
  const raw = "\x1b[38;2;153;153;153m\x1b[0mhello\x1b]0;title\x07   world\x1b[K";
  ok(strip(raw) === "hello world", "ANSI, OSC and control bytes are removed and space collapsed");
  ok(strip("a\x00\x01b") === "a b", "raw control bytes become whitespace rather than vanishing");
}

console.log(`\n${n} passed`);
