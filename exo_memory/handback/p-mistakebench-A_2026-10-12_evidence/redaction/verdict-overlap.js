#!/usr/bin/env node
'use strict';
// verdict-overlap.js (seat A, D311 baseline3 redaction): the judges' verdict files quote and paraphrase replies. Same test as overlap-check.js, run over every string in a verdict file:
// does it repeat 8 words of a redacted result (and not of the fixed prompt) from the unit the reply belongs to? COUNTS only; nothing is printed or changed.
//   node verdict-overlap.js <verdicts.json>:<blind.json> ...
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
require(path.join(ROOT, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'redaction verdict overlap' });
const B = require(path.join(ROOT, 'consonance', 'tools', 'mistake-bench.js'));
const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const words = (s) => String(s).toLowerCase().match(/[a-z0-9]+/g) || [];
const shingles = (s) => { const w = words(s), o = []; for (let i = 0; i + 8 <= w.length; i++) o.push(w.slice(i, i + 8).join(' ')); return o; };
const sets = {};
for (const u of B.loadUnits().filter((x) => x.claimMs)) {
  const tp = new Set(), set = new Set();
  F.eachLine(path.join(PROJ, u.transcript), (line) => {
    if (!line.startsWith('{')) return;
    const m = /"timestamp":"([^"]+)"/.exec(line); if (m && Date.parse(m[1]) > u.claimMs + 1500) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.isSidechain || !o.message || !Array.isArray(o.message.content)) return;
    for (const b of o.message.content) {
      if (b.type === 'tool_use' && B.THIRD.test(String(b.name) + ' ' + JSON.stringify(b.input || {}))) tp.add(b.id);
      else if (b.type === 'tool_result' && tp.has(b.tool_use_id)) for (const sh of shingles(Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : String(b.content || ''))) set.add(sh);
    }
  });
  const p = B.renderPrompt(B.contextOfUnit(u), null, 'baseline'); const vis = new Set(shingles(p.system + ' ' + p.prompt));
  for (const sh of [...set]) if (vis.has(sh)) set.delete(sh);
  sets[u.id] = set;
}
const strings = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, out)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out)); return out; };
for (const pair of process.argv.slice(2)) {
  const [vf, bf] = pair.split('|');
  const verdicts = JSON.parse(fs.readFileSync(vf, 'utf8')), blind = JSON.parse(fs.readFileSync(bf, 'utf8'));
  const unitOf = Object.fromEntries(blind.map((b) => [b.blindId, b.unit]));
  const hit = {}; let rows = 0;
  const vlist = verdicts.verdicts || verdicts;   // B wraps its list in { verdicts: [ { id, ... } ] }
  for (const [id, v] of (Array.isArray(vlist) ? vlist.map((x) => [x.id, x]) : Object.entries(vlist))) {
    if (!unitOf[id]) continue; rows++;
    const set = sets[unitOf[id]] || new Set();
    const n = strings(v).filter((s) => s.split('\n').some((l) => shingles(l).some((sh) => set.has(sh)))).length;
    if (n) hit[id] = n;
  }
  console.log(`${path.basename(path.dirname(vf))}/${path.basename(vf)}: ${rows} rows | rows with a string that repeats 8 words of a redacted result: ${Object.keys(hit).length} ${Object.keys(hit).length ? '(' + Object.keys(hit).join(' ') + ')' : ''}`);
}
