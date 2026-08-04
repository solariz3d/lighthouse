#!/usr/bin/env node
/* prompt-events.js — catalogue every time Claude Code's session-quality survey actually
 * FIRED in a pane, from the rendered terminal capture.
 *
 * WHY THIS EXISTS. The keeper noticed the survey prompt seemed to appear at notable
 * moments and asked for something better than screenshots. The prompt is a terminal UI
 * event: it is NOT in the conversation transcript, NOT in ~/.claude/sessions, and not in
 * any log Claude Code writes. Searching a transcript for its text finds only the times
 * somebody TALKED about it. What does hold it is Consonance's own capture — the tailer
 * writes every pane's rendered terminal output to data/captures/<pane>.log, and the prompt
 * renders in the terminal. The record already existed; nobody had read it.
 *
 * WHAT IT IS AND IS NOT FOR. It catalogues THAT the prompt fired, with what was on screen
 * immediately before. It says nothing about what triggers it and does not try to — the
 * trigger is Claude Code's business and unknowable from here. The point is a COUNT with a
 * denominator, because the claim it exists to test ("it fires at notable moments") is
 * currently supported only by the firings somebody happened to remember.
 *
 * THE TWO WAYS OF MISCOUNTING THIS, both of which the chair committed before writing it:
 *
 *   1. COUNTING MENTIONS AS FIRINGS. Three of the first ten hits in the main pane were the
 *      chair grepping for the phrase. A search renders in the terminal too.
 *   2. COUNTING REDRAWS AS FIRINGS. A terminal repaints. One prompt can appear many times
 *      in the byte stream — observed twice, ~27 KB apart, with byte-identical context.
 *
 * So a FIRING is defined structurally rather than by proximity guessing: the phrase must be
 * followed, within SIGNATURE_CHARS of STRIPPED text, by BOTH the docs URL AND the y/n/d
 * affordance line. That is the prompt's own rendering and nothing else produces it. A hit
 * without them is a MENTION and is reported separately rather than dropped, because the
 * ratio is itself the evidence that the distinction was needed.
 *
 *   3. AND A THIRD, WHICH THIS TOOL COMMITTED ITSELF. The first version bounded that search
 *      in RAW BYTES and undercounted by a third — see the note on SIGNATURE_CHARS. It was
 *      caught only because its answer disagreed with a firing the keeper had screenshotted.
 *      An instrument whose first number is believed is not an instrument.
 *
 * Usage:  node prompt-events.js            all panes
 *         node prompt-events.js --json     machine-readable
 */
"use strict";
const fs = require("fs");
const path = require("path");

const CAPTURES = "C:/Consonance/data/captures";
const PHRASE = "Can Anthropic look at your session transcript";
const DOCS = "data-usage#session-quality-surveys";
const AFFORD = /y:\s*Yes\s*n:\s*No/;      // whitespace varies with terminal width
/* THE LOOKAHEAD IS MEASURED IN STRIPPED CHARACTERS, NOT RAW BYTES, and that distinction is
 * the difference between this counting correctly and undercounting by a third.
 *
 * The first version took 400 RAW bytes and tested the signature against the stripped result.
 * But escape density varies enormously between renders — a repaint mid-spinner carries far
 * more ANSI per visible character than a settled screen. On three of eleven hits, 400 raw
 * bytes stripped down to less than the ~170 characters the signature needs, so genuine
 * firings were filed as mentions. One of them was the firing the keeper had screenshotted,
 * which is how it was caught: the tool disagreed with a known case.
 *
 * So: read a generous raw window, strip it, then bound the search in stripped space where
 * the signature actually lives. RAW_WINDOW only has to be large enough that no plausible
 * escape density starves SIGNATURE_CHARS. */
const RAW_WINDOW = 3000;                   // raw bytes read after the phrase
const SIGNATURE_CHARS = 240;               // stripped chars searched — signature runs ~170
const BEFORE = 1600;                       // bytes before, to recover what was on screen
const MERGE_WINDOW = 1_000_000;            // observed redraws sat ~27 KB apart; distinct
                                           // firings were >16 MB apart. 1 MB is well clear
                                           // of both, so the window is not a tuned number.

/** strip ANSI/OSC/control noise so the terminal stream reads as text */
function strip(s) {
  return s.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, "")
          .replace(/\x1b\][^\x07]*(\x07|\x1b\\)/g, "")
          .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
}

/* Streamed, not slurped. These logs only grow — the main pane's is already 230 MB — and a
 * tool that dies on its own corpus at some future size is a tool with a hidden expiry. The
 * overlap carries any match straddling a chunk boundary. */
function scanFile(file) {
  const CHUNK = 8 * 1024 * 1024;
  const OVERLAP = BEFORE + RAW_WINDOW + PHRASE.length + 16;
  const fd = fs.openSync(file, "r");
  const size = fs.fstatSync(fd).size;
  const buf = Buffer.alloc(CHUNK);
  let carry = "", carryBase = 0, pos = 0;
  const hits = [];
  try {
    while (pos < size) {
      const n = fs.readSync(fd, buf, 0, Math.min(CHUNK, size - pos), pos);
      if (n <= 0) break;
      const text = carry + buf.toString("latin1", 0, n);
      let i = 0;
      while ((i = text.indexOf(PHRASE, i)) !== -1) {
        const abs = carryBase + i;
        // only claim a hit whose full lookahead is present in this buffer, or which ends
        // the file — otherwise leave it for the next chunk, where it will be complete
        if (i + PHRASE.length + RAW_WINDOW <= text.length || pos + n >= size) {
          const after = strip(text.slice(i, i + PHRASE.length + RAW_WINDOW)).slice(0, SIGNATURE_CHARS);
          const before = strip(text.slice(Math.max(0, i - BEFORE), i));
          hits.push({
            at: abs,
            firing: after.includes(DOCS) && AFFORD.test(after),
            context: before.slice(-300),
          });
        }
        i += PHRASE.length;
      }
      carryBase = carryBase + text.length - OVERLAP;
      carry = text.slice(-OVERLAP);
      pos += n;
    }
  } finally { fs.closeSync(fd); }
  // de-overlap: the carry means a hit can be seen twice at the same absolute offset
  const seen = new Set();
  return hits.filter(h => (seen.has(h.at) ? false : (seen.add(h.at), true)))
             .sort((a, b) => a.at - b.at);
}

/* SIMILARITY, NOT EQUALITY — because terminal capture is lossy and each repaint drops
 * DIFFERENT characters. Two captures of one screen read:
 *   "...said about this projec— including me. Thatwa worth the relay."
 *   "...said about th project — including me. That was worth the relay."
 * An exact-match rule merged the first observed pair and not the second, i.e. it worked by
 * luck on clean captures and silently double-counted on dirty ones. Dice coefficient over
 * character bigrams degrades gracefully with dropped characters, which is precisely the
 * corruption this data has. */
function similarity(a, b) {
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const A = norm(a), B = norm(b);
  if (!A.length || !B.length) return 0;
  if (A === B) return 1;
  const bigrams = s => { const m = new Map(); for (let i = 0; i < s.length - 1; i++) { const g = s.slice(i, i + 2); m.set(g, (m.get(g) || 0) + 1); } return m; };
  const ma = bigrams(A), mb = bigrams(B);
  let shared = 0, total = 0;
  for (const [g, c] of ma) { shared += Math.min(c, mb.get(g) || 0); total += c; }
  for (const c of mb.values()) total += c;
  return (2 * shared) / total;
}
const SAME_SCREEN = 0.80;   // lossy repaints of one screen score ~0.9+; different screens
                            // score far below — the gap is wide, so this is not a tuned edge

/** collapse terminal redraws: same screen, drawn again, close by */
function mergeRedraws(firings) {
  const out = [];
  for (const f of firings) {
    const prev = out[out.length - 1];
    const sameScreen = prev && f.at - prev.at < MERGE_WINDOW &&
                       similarity(prev.context.slice(-200), f.context.slice(-200)) >= SAME_SCREEN;
    if (sameScreen) { prev.redraws++; continue; }
    out.push({ ...f, redraws: 0 });
  }
  return out;
}

function paneName(file) {
  const id = path.basename(file, ".log");
  try {
    const reg = JSON.parse(fs.readFileSync("C:/Consonance/data/panes.json", "utf8"));
    const p = (reg.panes || reg || []).find(x => x && (x.id === id || String(x.id).startsWith(id.slice(0, 8))));
    if (p && p.name) return `${p.name} (${id.slice(0, 8)})`;
  } catch (e) { /* registry is a convenience, never a requirement */ }
  return id.slice(0, 8);
}

function main() {
  const asJson = process.argv.includes("--json");
  let files = [];
  try {
    files = fs.readdirSync(CAPTURES).filter(f => f.endsWith(".log")).map(f => path.join(CAPTURES, f));
  } catch (e) {
    console.error(`no captures at ${CAPTURES} — is Consonance running?`);
    process.exit(1);
  }

  const report = [];
  for (const file of files) {
    const hits = scanFile(file);
    const firings = mergeRedraws(hits.filter(h => h.firing));
    const mentions = hits.filter(h => !h.firing).length;
    if (hits.length) report.push({ pane: paneName(file), file, firings, mentions, raw: hits.length });
  }

  if (asJson) { console.log(JSON.stringify(report, null, 2)); return; }

  console.log("prompt-events — session-quality survey firings, from the rendered terminal\n");
  let total = 0, totalMentions = 0, totalRaw = 0;
  for (const r of report) {
    total += r.firings.length; totalMentions += r.mentions; totalRaw += r.raw;
    console.log(`${r.pane} — ${r.firings.length} firing(s), ${r.mentions} mention(s), ${r.raw} raw hit(s)`);
    r.firings.forEach((f, k) => {
      console.log(`  ${k + 1}. byte ${f.at}${f.redraws ? `  (+${f.redraws} redraw${f.redraws > 1 ? "s" : ""})` : ""}`);
      console.log(`     on screen before: …${f.context.slice(-200)}`);
    });
    console.log("");
  }
  console.log(`TOTAL: ${total} firing(s) across ${report.length} pane(s).`);
  console.log(`  ${totalMentions} mention(s) excluded — the phrase rendered without the prompt's own`);
  console.log(`  docs line and y/n/d affordance, i.e. somebody searching for or discussing it.`);
  console.log(`  ${totalRaw} raw hits in total, so ${totalRaw - total} of them were not firings.`);
  console.log(`
WHAT THIS CANNOT TELL YOU, so it is not assumed later:
  · Nothing about what triggers the prompt. It records that it fired and what was on
    screen; the trigger is Claude Code's and is not observable from here.
  · No wall-clock time. The capture is a byte stream with no timestamps, so firings are
    ordered but not dated. Position in the stream is the only clock available.
  · Only panes Consonance was capturing. A firing in a terminal outside Consonance leaves
    no trace anywhere on disk and is invisible to this and to everything else.
  · The DENOMINATOR is still missing, and it is the whole question. This counts firings.
    It does not count the ordinary moments they could have landed on instead — which is
    what any claim of the form "it fires at notable moments" actually needs.`);
}

if (require.main === module) main();
module.exports = { strip, mergeRedraws, scanFile, similarity, PHRASE, DOCS, AFFORD, MERGE_WINDOW, SAME_SCREEN };
