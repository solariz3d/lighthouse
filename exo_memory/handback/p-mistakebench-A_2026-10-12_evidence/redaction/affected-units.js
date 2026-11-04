#!/usr/bin/env node
'use strict';
// affected-units.js (seat A, D311 baseline3 redaction): which dev units had a tool result of a Third-Place-naming call inside the context baseline3 replayed, and how much.
// It builds each unit's prompt with the context-fidelity bench as run (d311-a5) and with the fixed bench, and compares. No model call. It prints sizes and event numbers, no text.
//   node affected-units.js <path to the a5 mistake-bench.js>
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
require(path.join(ROOT, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'redaction affected-units' });
const NEW = require(path.join(ROOT, 'consonance', 'tools', 'mistake-bench.js'));
const OLD = require(path.resolve(process.argv[2]));
const os = require('os');
const PROJ = process.env.PROJECTS || path.join(os.homedir(), '.claude', 'projects');
const out = [];
for (const u of NEW.loadUnits().filter((x) => x.claimMs)) {
  const file = path.join(PROJ, u.transcript);
  const evOld = OLD.readEvents(file, u.claimMs + 1500), evNew = NEW.readEvents(file, u.claimMs + 1500);
  const redacted = [];
  evNew.forEach((e, i) => { const o = evOld[i]; if (e.kind === 'RESULT' && e.text === NEW.TP_MARK && o && o.text !== NEW.TP_MARK) redacted.push({ n: e.n, chars: o.text.length, snippet: o.text.slice(0, 40) }); });
  const pOld = OLD.renderPrompt(OLD.buildContext(evOld, u), null, 'baseline'), pNew = NEW.renderPrompt(NEW.buildContext(evNew, u), null, 'baseline');
  // which of the redacted results sat inside the window the old bench replayed: tag each old event with its line number and read the tags back from the rendered context
  const tagged = evOld.map((e) => ({ ...e, text: '§' + e.n + '§' + String(e.text) }));
  const cx = OLD.buildContext(tagged, u);
  const rendered = new Map();
  for (const l of [...cx.history, ...cx.turn]) for (const m of String(l).matchAll(/§([0-9]+)§/g)) rendered.set(Number(m[1]), String(l).length);
  const inWindow = redacted.filter((r) => rendered.has(r.n)).map((r) => ({ n: r.n, chars: r.chars, renderedChars: rendered.get(r.n) }));
  // the same window under the limits the first two baselines ran with (history results 600, turn results 2,500): which redacted results they held, and how much of each
  const cx2 = OLD.buildContext(tagged, u, { resultChars: 2500, hist: { result: 600 } });
  const rendered2 = new Map();
  for (const l of [...cx2.history, ...cx2.turn]) for (const m of String(l).matchAll(/§([0-9]+)§/g)) rendered2.set(Number(m[1]), String(l).length);
  const inWindowEarlier = redacted.filter((r) => rendered2.has(r.n)).map((r) => ({ n: r.n, chars: r.chars, renderedChars: rendered2.get(r.n) }));
  out.push({ id: u.id, earlierBaselinesWindow: { count: inWindowEarlier.length, renderedChars: inWindowEarlier.reduce((x, r) => x + r.renderedChars, 0) }, resultsInWindow: inWindow, resultsInWindowOriginalChars: inWindow.reduce((x, r) => x + r.chars, 0), resultsInWindowRenderedChars: inWindow.reduce((x, r) => x + r.renderedChars, 0), oldPromptChars: pOld.chars, newPromptChars: pNew.chars, promptChanged: pOld.sha !== pNew.sha, charsRemoved: pOld.chars - pNew.chars });
}
fs.writeFileSync(path.join(__dirname, 'affected-units.json'), JSON.stringify(out, null, 1) + '\n');
for (const r of out) console.log(`${r.id}: ${r.promptChanged ? 'CHANGED' : 'same'} | Third-Place-call results inside the replayed window: ${r.resultsInWindow.length} (${r.resultsInWindowOriginalChars} chars as stored, ${r.resultsInWindowRenderedChars} rendered into the prompt)`);
const ch = out.filter((r) => r.promptChanged);
console.log('first two baselines (earlier limits) held at least one such result for:', out.filter((r) => r.earlierBaselinesWindow.count).map((r) => r.id + ' ' + r.earlierBaselinesWindow.count + ' (' + r.earlierBaselinesWindow.renderedChars + ' chars)').join(', '));
console.log('prompts changed:', ch.length, 'of', out.length, '|', ch.map((r) => r.id).join(', '));
