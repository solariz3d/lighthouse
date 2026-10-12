#!/usr/bin/env node
'use strict';
// overlap-check.js (seat A, D311 baseline3 redaction): does any stored reply or tool-request input repeat, word for word, text that was redacted from its unit's context
// (the results of tool calls that named the Third Place)? A line that shares an 8-word run with such a result is Third Place material by reuse, and is replaced by the removal marker.
// It prints COUNTS and unit ids, never a line. Paraphrase is NOT caught by this; that limit is stated in the hand-back.
//   node overlap-check.js check <runs.jsonl>...            counts only
//   node overlap-check.js clean <in runs.jsonl> <out runs.jsonl>   writes the cleaned copy (lines that reuse redacted text become the marker)
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
require(path.join(ROOT, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'redaction overlap' });
const B = require(path.join(ROOT, 'consonance', 'tools', 'mistake-bench.js'));
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const K = 8;
const words = (s) => String(s).toLowerCase().match(/[a-z0-9]+/g) || [];
const shingles = (s) => { const w = words(s), out = []; for (let i = 0; i + K <= w.length; i++) out.push(w.slice(i, i + K).join(' ')); return out; };

/** per unit: the set of 8-word runs of every Third-Place-call result that lies in ANY of the windows the three baselines replayed (history 2,500 / 600 and the whole-result turn). */
function redactedShingles() {
  const OLDMODE = (e) => e; // the fixed reader already marks the results; we need the originals, so read with a plain scan
  const map = {};
  for (const u of B.loadUnits().filter((x) => x.claimMs)) {
    const file = path.join(PROJ, u.transcript);
    const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
    const tp = new Set(), set = new Set();
    let count = 0;
    F.eachLine(file, (line, n) => {
      if (!line.startsWith('{')) return;
      const m = /"timestamp":"([^"]+)"/.exec(line); const t = m ? Date.parse(m[1]) : NaN;
      if (t > u.claimMs + 1500) return;
      let o; try { o = JSON.parse(line); } catch (_) { return; }
      if (o.isSidechain || !o.message || !Array.isArray(o.message.content)) return;
      for (const b of o.message.content) {
        if (b.type === 'tool_use' && B.THIRD.test(String(b.name) + ' ' + JSON.stringify(b.input || {}))) tp.add(b.id);
        else if (b.type === 'tool_result' && tp.has(b.tool_use_id)) {
          const text = Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : String(b.content || '');
          count++; for (const sh of shingles(text)) set.add(sh);
        }
      }
    });
    // keep only the runs of words that the fixed prompt (everything the model may now see) does not contain: reuse of those can only have come from the redacted result
    const visible = (() => { const p = B.renderPrompt(B.contextOfUnit(u), null, 'baseline'); return new Set(shingles(p.system + " " + p.prompt)); })();
    let uniqueOnly = 0; for (const sh of [...set]) { if (visible.has(sh)) set.delete(sh); else uniqueOnly++; }
    map[u.id] = { set, results: count, uniqueShingles: uniqueOnly };
  }
  return map;
}
const reuse = (line, set) => shingles(line).some((sh) => set.has(sh));
function cleanText(text, set) {
  let n = 0;
  const out = String(text).split('\n').map((l) => { if (reuse(l, set)) { n++; return B.TP_MARK; } return l; }).join('\n');
  return { out, n };
}
function cleanDeep(v, set, tally) {
  if (typeof v === 'string') { const r = cleanText(v, set); tally.n += r.n; return r.out; }
  if (Array.isArray(v)) return v.map((x) => cleanDeep(x, set, tally));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x, set, tally)]));
  return v;
}

const [cmd, ...files] = process.argv.slice(2);
const sh = redactedShingles();
if (cmd === 'check') {
  for (const f of files) {
    const rows = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    const per = {}; let runsHit = 0, linesHit = 0;
    for (const r of rows) {
      const set = (sh[r.unit] || { set: new Set() }).set, t = { n: 0 };
      cleanDeep([r.reply, r.toolRequests], set, t);
      if (t.n) { runsHit++; linesHit += t.n; per[r.unit] = (per[r.unit] || 0) + t.n; }
    }
    console.log(`${path.basename(path.dirname(f))}/${path.basename(f)}: ${rows.length} runs | runs with a line that reuses 8 words of a redacted result: ${runsHit} (${linesHit} lines) | units: ${Object.entries(per).map(([u, n]) => u + ' ' + n).join(', ') || 'none'}`);
  }
} else if (cmd === 'clean') {
  const [inF, outF] = files;
  const rows = fs.readFileSync(inF, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
  let linesHit = 0, runsHit = 0;
  const out = rows.map((r) => {
    const set = (sh[r.unit] || { set: new Set() }).set, t = { n: 0 };
    const reply = typeof r.reply === 'string' ? cleanText(r.reply, set) : null;
    const toolRequests = r.toolRequests ? cleanDeep(r.toolRequests, set, t) : r.toolRequests;
    const n = (reply ? reply.n : 0) + t.n;
    if (n) { runsHit++; linesHit += n; }
    return { ...r, ...(reply ? { reply: reply.out } : {}), ...(r.toolRequests ? { toolRequests } : {}) };
  });
  fs.writeFileSync(outF, out.map((r) => JSON.stringify(r)).join('\n') + '\n');
  console.log(`cleaned ${rows.length} runs; ${runsHit} runs changed, ${linesHit} lines replaced by the marker`);
} else throw new Error('usage: check <runs.jsonl>... | clean <in> <out>');
