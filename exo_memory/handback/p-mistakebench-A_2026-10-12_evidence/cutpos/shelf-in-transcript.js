#!/usr/bin/env node
'use strict';
// shelf-in-transcript.js (seat A, D311 cut-position diagnostic): for each dev unit, the last `instructions` attachment (the seat's CLAUDE.md files as loaded) and the last
// `prompt_snapshot` (the system prompt) in its transcript before the erring turn. Reads and prints; no model call; no text of either file is printed or kept, only sizes and times.
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
require(path.join(ROOT, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'cutpos shelf survey' });
const B = require(path.join(ROOT, 'consonance', 'tools', 'mistake-bench.js'));
const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const units = B.loadUnits().filter((u) => u.claimMs);
const byFile = {};
for (const u of units) (byFile[u.transcript] = byFile[u.transcript] || []).push(u);
const found = {};
for (const [rel, us] of Object.entries(byFile)) {
  const inst = [], snap = [];
  F.eachLine(path.join(PROJ, rel), (line, n) => {
    const isInst = line.includes('"type":"instructions"'), isSnap = line.includes('"type":"prompt_snapshot"');
    if (!isInst && !isSnap) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    const a = o.attachment || {};
    const t = Date.parse(o.timestamp);
    if (a.type === 'instructions') inst.push({ n, t, ts: o.timestamp, reason: a.reason, changed: a.changed, files: (a.files || []).map((x) => ({ p: String(x.path).replace(/^.*[\/]/, ''), len: String(x.content || '').length })), removed: (a.removed || []).length });
    else if (a.type === 'prompt_snapshot') snap.push({ n, t, ts: o.timestamp, sys: String(a.systemPrompt || '').length, tools: JSON.stringify(a.tools || '').length });
  });
  for (const u of us) {
    const iBefore = inst.filter((x) => x.t <= u.turnStartMs + 1000), sBefore = snap.filter((x) => x.t <= u.turnStartMs + 1000);
    found[u.id] = { lastInstructions: iBefore[iBefore.length - 1] || null, lastSnapshot: sBefore[sBefore.length - 1] || null, instructionsCount: iBefore.length, turnStart: new Date(u.turnStartMs).toISOString() };
  }
}
const out = {};
for (const u of units) {
  const f = found[u.id], i = f.lastInstructions, s = f.lastSnapshot;
  out[u.id] = { turnStart: f.turnStart, instructions: i ? { line: i.n, ts: i.ts, reason: i.reason, files: i.files, ageMin: Math.round((Date.parse(f.turnStart) - i.t) / 60000) } : null, systemPrompt: s ? { line: s.n, ts: s.ts, chars: s.sys, toolsChars: s.tools, ageMin: Math.round((Date.parse(f.turnStart) - s.t) / 60000) } : null };
  console.log(`${u.id}: instructions ${i ? `line ${i.n} (${i.reason}, ${Math.round((Date.parse(f.turnStart) - i.t) / 60000)} min before the turn; ` + i.files.map((x) => x.p + ' ' + x.len).join(', ') + ')' : 'NONE before the turn'} | system prompt ${s ? `line ${s.n}, ${s.sys} chars, ${Math.round((Date.parse(f.turnStart) - s.t) / 60000)} min before` : 'NONE'}`);
}
fs.writeFileSync(path.join(__dirname, 'shelf-in-transcript.json'), JSON.stringify(out, null, 1) + '\n');
console.log('instructions found for', Object.values(out).filter((x) => x.instructions).length, 'of', units.length, '; system prompt for', Object.values(out).filter((x) => x.systemPrompt).length);
