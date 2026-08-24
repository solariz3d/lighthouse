// carrier-drift-watch.js — fire consonance/tools/carrier-drift.js unbidden, and say nothing
// unless something is actually wrong.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHY THIS IS A Stop HOOK AND NOT THE PreCompact ONE THE PACKET NAMED.
//
// The pattern given to copy was "residue's": muscle_map.md:1049 says `residue.js` is now fired
// from `checkpoint.py`, which runs on the PreCompact hook. That is true on the DESKTOP. On this
// machine precompact.js resolves its script at
//
//     %USERPROFILE%\Desktop\lighthouse\exo_memory\loop\checkpoint.py     (precompact.js:27-30)
//
// and there is no C:\Users\zackn\Desktop at all, so the hook hits `if (!fs.existsSync(SCRIPT))
// process.exit(0)` — "different machine, no room here" — and residue has never run unbidden on
// the laptop. Copying that pattern would have shipped a trigger that fires on one machine and is
// a no-op on this one, which is registration 46's disease with a fresh coat: an instrument the
// record believes is running.
//
// Stop fires on every completed turn, on every machine, with no path assumption and no
// permission semantics to be dropped. That last part is not theoretical: the dispatch gate built
// four hours ago fires correctly and bypass-permissions mode DROPS its `ask` outcome (f8b64e8).
// A hook that needs a decision honoured is a hook that can be silently overridden here. This one
// only needs to be able to print.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// THE THREE WAYS THIS COULD BECOME NOISE, AND WHAT EACH ONE COSTS.
//
//   1. SPEAKING WHEN GREEN. dream-watch announced a deficiency every turn for 27 days and the
//      channel stopped being read. Silent when green, always.
//   2. SPEAKING THE SAME RED FOREVER. A red nobody has got to yet is not new information on turn
//      forty. Findings are fingerprinted; the same fingerprint speaks once and then holds for
//      COOLDOWN_H hours. A CHANGED fingerprint always speaks.
//   3. SPEAKING IN FIVE PANES AT ONCE. The state file lives in the shared data dir, so the first
//      seat to report a fingerprint claims it and the others stay quiet. One voice per finding,
//      machine-wide.
//
// AND THE FOURTH, WHICH IS THE ONE THAT ACTUALLY BIT SOMETHING TONIGHT: a hook that is silent
// because it is working is indistinguishable from a hook that is silent because it never ran.
// The dispatch gate's first probe went through with no prompt and no evidence either way, and
// the ledger added afterwards is the only reason anyone knows which it was. So EVERY firing is
// written to the ledger — the silent ones especially, because they are the ones nobody can see.
//
// Fail-open on every path. A sensor that can break a turn is worse than no sensor.
'use strict';

// THE DREAM GATE, first statement, per the cross-hook invariant in dream-gate.test.js. The
// gap-dream is an anti-instruction; a hook that appends to its prompt defeats it by existing.
if (process.env.CONSONANCE_DREAM) process.exit(0);

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO = process.env.CARRIER_DRIFT_REPO || 'C:\\Consonance\\lighthouse';
const DATA = process.env.CONSONANCE_DATA || 'C:\\Consonance\\data';
const STATE = path.join(DATA, 'carrier-drift.state.json');
const LEDGER = path.join(DATA, 'carrier-drift.jsonl');
const COOLDOWN_H = 6;

function fingerprint(findings) {
  const key = findings.map((f) => [f.kind, f.file, f.line].join(':')).sort().join('|');
  return crypto.createHash('sha1').update(key).digest('hex').slice(0, 12);
}

function main() {
  const tool = path.join(REPO, 'consonance', 'tools', 'carrier-drift.js');
  if (!fs.existsSync(tool)) return;                     // no repo here: nothing to measure

  const started = Date.now();
  const { scan } = require(tool);
  const res = scan({ root: REPO });
  const ms = Date.now() - started;

  const fp = res.red ? fingerprint(res.findings) : 'green';
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (_) { /* first run */ }

  const sameAsLast = prev.fp === fp;
  const withinCooldown = Number(prev.at || 0) > Date.now() - COOLDOWN_H * 3600 * 1000;
  const speak = res.red && !(sameAsLast && withinCooldown);

  if (speak) {
    const lines = ['CARRIER DRIFT — a withdrawn claim is being carried as live:'];
    for (const f of res.findings.slice(0, 6)) {
      lines.push('  ' + f.kind + '  ' + f.file + (f.line ? ':' + f.line : '') + ' — ' + f.detail.split('.')[0]);
    }
    if (res.findings.length > 6) lines.push('  … and ' + (res.findings.length - 6) + ' more');
    lines.push('  node consonance/tools/carrier-drift.js');
    process.stdout.write(lines.join('\n') + '\n');
    try {
      fs.mkdirSync(DATA, { recursive: true });
      fs.writeFileSync(STATE, JSON.stringify({ fp, at: Date.now() }));
    } catch (_) { /* state is an optimisation, never a precondition */ }
  } else if (!res.red && prev.fp && prev.fp !== 'green') {
    // clearing the state on the way back to green is what lets the NEXT red speak immediately
    try { fs.writeFileSync(STATE, JSON.stringify({ fp: 'green', at: Date.now() })); } catch (_) {}
  }

  // Every firing, spoken or not. This is the row that separates "silent because green" from
  // "silent because the hook is not installed", and there is no other way to tell them apart.
  try {
    fs.mkdirSync(DATA, { recursive: true });
    fs.appendFileSync(LEDGER, JSON.stringify({
      ts: new Date().toISOString(),
      pane: path.basename(process.cwd()),
      verdict: res.red ? 'RED' : 'GREEN',
      findings: res.findings.length,
      carriers: res.counts.carriers,
      fp,
      spoke: speak,
      ms,
    }) + '\n');
  } catch (_) { /* fail-open */ }
}

try { main(); } catch (_) { /* a sensor must never break a turn */ }
process.exit(0);
