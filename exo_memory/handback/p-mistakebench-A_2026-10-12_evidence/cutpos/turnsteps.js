#!/usr/bin/env node
'use strict';
// turnsteps.js (seat A, D311 cut-position diagnostic): for a dev unit, list the erring turn as ASSISTANT STEPS (one step = one assistant message, which may
// hold text and/or several tool requests), with the bench's cut marked. No model call. It reads transcripts and prints; it changes nothing.
//   node turnsteps.js json                 the machine fields for all 22 dev units (cut, turn start, step counts) as JSON
//   node turnsteps.js show <id> [--all]    the steps of one unit's erring turn up to 4 steps past the cut (all steps with --all)
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const B = require(path.join(ROOT, 'consonance', 'tools', 'mistake-bench.js'));
const R = require(path.join(ROOT, 'consonance', 'tools', 'claim-replay.js'));
const F = require(path.join(ROOT, 'exo_memory', 'loop', 'claimrec', 'frame.js'));
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.map((b) => (b.type === 'text' ? b.text : '')).join('\n') : '');
const resultText = (b) => (Array.isArray(b.content) ? b.content.map((x) => x.text || '').join(' ') : String(b.content || ''));
const cut = (s, n) => { s = R.clean(String(s)).replace(/\s+/g, ' '); return s.length > n ? s.slice(0, n) + ` …[+${s.length - n}]` : s; };

/** The erring turn of a unit: items [{ n, ts, kind:'PROMPT'|'ASSIST'|'RESULT', mid, blocks:[{t:'text'|'call'|'result', name?, text}] }], from the prompt that starts it to the next real prompt. */
function readTurn(u) {
  const file = path.join(PROJ, u.transcript);
  const endMs = u.claimMs + 3 * 3600e3;
  const items = [];
  F.eachLine(file, (line, n) => {
    if (!line.startsWith('{')) return;
    const m = /"timestamp":"([^"]+)"/.exec(line); const t = m ? Date.parse(m[1]) : NaN;
    if (t > endMs || t < u.turnStartMs - 1500) return;
    let o; try { o = JSON.parse(line); } catch (_) { return; }
    if (o.isSidechain) return;
    if (o.type === 'user' && o.message) {
      const c = o.message.content;
      if (Array.isArray(c) && c.some((b) => b.type === 'tool_result')) { items.push({ n, ts: o.timestamp, kind: 'RESULT', blocks: c.filter((b) => b.type === 'tool_result').map((b) => ({ t: 'result', text: resultText(b) })) }); return; }
      if (F.isRealPrompt(o)) items.push({ n, ts: o.timestamp, kind: 'PROMPT', blocks: [{ t: 'text', text: textOf(c) }] });
    } else if (o.type === 'assistant' && o.message && Array.isArray(o.message.content)) {
      const bl = [];
      for (const b of o.message.content) { if (b.type === 'text' && (b.text || '').trim()) bl.push({ t: 'text', text: b.text }); else if (b.type === 'tool_use') bl.push({ t: 'call', name: b.name, text: JSON.stringify(b.input || {}) }); }
      if (bl.length) items.push({ n, ts: o.timestamp, kind: 'ASSIST', mid: o.message.id, blocks: bl });
    }
  });
  // the turn: from the first real prompt at or after the located turn start (the bench's rule), else the first item, to the next real prompt
  let s = items.findIndex((x) => x.kind === 'PROMPT' && Date.parse(x.ts) >= u.turnStartMs - 1000);
  const noPrompt = s < 0; if (noPrompt) s = 0;
  let e = items.findIndex((x, k) => k > s && x.kind === 'PROMPT'); if (e < 0) e = items.length;
  return { items: items.slice(s, e), noPrompt };
}

/** Group assistant lines into steps (one per message id, in order). Each step keeps the results that follow it. */
function steps(items) {
  const out = []; let cur = null;
  for (const it of items) {
    if (it.kind === 'ASSIST') { if (cur && cur.mid === it.mid) { cur.blocks.push(...it.blocks); cur.lastN = it.n; } else { cur = { idx: out.length + 1, mid: it.mid, firstN: it.n, lastN: it.n, ts: it.ts, blocks: [...it.blocks], results: [] }; out.push(cur); } }
    else if (it.kind === 'RESULT' && cur) cur.results.push(...it.blocks);
  }
  return out;
}

function analyse(u) {
  const { items, noPrompt } = readTurn(u);
  const st = steps(items);
  // the bench's cut: the first assistant text or call in the claim second; everything before it in the turn is replayed
  const inSec = (it) => it.kind === 'ASSIST' && Date.parse(it.ts) >= u.claimMs && Date.parse(it.ts) < u.claimMs + 1000;
  let cutItem = items.find(inSec) || items.find((it) => it.kind === 'ASSIST' && Date.parse(it.ts) >= u.claimMs && Date.parse(it.ts) < u.claimMs + 5000);
  const cutStep = cutItem ? st.find((s) => s.mid === cutItem.mid) : null;
  const prompt = items.find((x) => x.kind === 'PROMPT');
  return { id: u.id, seat: u.seat, noPrompt, promptN: prompt ? prompt.n : null, promptTs: prompt ? prompt.ts : null, steps: st, cutStepIdx: cutStep ? cutStep.idx : null, cutN: cutItem ? cutItem.n : null, cutTs: cutItem ? cutItem.ts : null,
    cutBlockKind: cutItem ? cutItem.blocks[0].t : null, turnSteps: st.length };
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const units = B.loadUnits().filter((u) => u.claimMs);
  if (argv[0] === 'json') {
    console.log(JSON.stringify(units.map((u) => { const a = analyse(u); return { id: a.id, seat: a.seat, promptN: a.promptN, promptTs: a.promptTs, cutN: a.cutN, cutTs: a.cutTs, cutStepIdx: a.cutStepIdx, turnSteps: a.turnSteps, noPrompt: a.noPrompt }; }), null, 1));
  } else if (argv[0] === 'show') {
    const u = units.find((x) => x.id === argv[1]); if (!u) throw new Error('unknown unit');
    const a = analyse(u), all = argv.includes('--all'), brief = argv.includes('--brief');
    console.log(`# ${u.id} seat ${u.seat}: prompt line ${a.promptN} ${a.promptTs}; cut = step ${a.cutStepIdx} (line ${a.cutN}, ${a.cutTs}, first block ${a.cutBlockKind}); turn has ${a.turnSteps} steps`);
    console.log('## CORRECTION: ' + cut(u.correction || '', brief ? 900 : 1400));
    const last = all ? Infinity : (a.cutStepIdx || 1) + 4;
    for (const s of a.steps) {
      if (s.idx > last) break;
      const mark = s.idx === a.cutStepIdx ? '  <== CUT (not replayed from here)' : s.idx < a.cutStepIdx ? '  [replayed]' : '  [after the cut]';
      console.log(`step ${s.idx} [${s.firstN}-${s.lastN}] ${s.ts.slice(11, 19)}${mark}`);
      for (const b of s.blocks) console.log(`    ${b.t === 'call' ? 'CALL ' + b.name : 'TEXT'}: ${cut(b.text, brief ? (b.t === 'call' ? 260 : 420) : (b.t === 'call' ? 450 : 700))}`);
      for (const r of s.results) console.log(`    -> RESULT: ${cut(r.text, brief ? 110 : 220)}`);
    }
  } else if (argv[0] === 'find') {
    // where a phrase first appears in the turn's assistant output (text or tool input): step, line, offset in the block, the characters around it
    const u = units.find((x) => x.id === argv[1]); if (!u) throw new Error('unknown unit');
    const a = analyse(u); const ph = argv.slice(2).map((p) => p.toLowerCase());
    console.log('# ' + u.id + ' cut = step ' + a.cutStepIdx + ' (line ' + a.cutN + ') of ' + a.turnSteps);
    for (const p of ph) {
      let hits = 0;
      for (const s of a.steps) for (const b of s.blocks) {
        const t = R.clean(b.text), i = t.toLowerCase().indexOf(p);
        if (i >= 0 && hits < 4) { hits++; console.log('  "' + p + '" step ' + s.idx + ' [' + s.firstN + '-' + s.lastN + '] ' + (b.t === 'call' ? 'CALL ' + b.name : 'TEXT') + ' block length ' + t.length + ' at offset ' + i + ': ...' + t.slice(Math.max(0, i - 120), i + p.length + 160).replace(/\s+/g, ' ') + '...'); }
      }
      if (!hits) console.log('  "' + p + '" not found in the assistant output of the turn');
    }
  } else throw new Error('usage: json | show <id> [--all]');
}
module.exports = { analyse, readTurn, steps };
