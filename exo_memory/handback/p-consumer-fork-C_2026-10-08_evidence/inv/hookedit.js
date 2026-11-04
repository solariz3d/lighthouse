// hookedit.js <worktree>: the GATES.md pointer in the two gates' refusal messages (D273 lap 2, C). Each anchor must match exactly once.
'use strict';
const fs = require('fs'), path = require('path'), W = process.argv[2];
function edit(rel, pairs) {
  const f = path.join(W, rel); let t = fs.readFileSync(f, 'utf8');
  for (const [a, b] of pairs) { const n = t.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor x${n}: ${a.slice(0, 90)}`); t = t.replace(a, b); }
  fs.writeFileSync(f, t); console.log('edited', rel);
}
edit('consonance/hooks/sources-gate.js', [
  [`function decide(text, calls, cwd, ledgerPath = 'sources-gate.jsonl', ringSha = '', what = 'ring') {`,
   `function decide(text, calls, cwd, ledgerPath = 'sources-gate.jsonl', ringSha = '', what = 'ring', gates = GATES_REL) {`],
  ["re-send the same ${what} in this turn. Format: ${FORMAT}.`;",
   "re-send the same ${what} in this turn. Format: ${FORMAT}. How this gate works and why: ${gates}, section 1 (SOURCES).`;"],
  [`function record(dir, row) {`,
   `/* D273 (the consumer): every refusal names GATES.md, the one page that explains the gates, at the path it has on THIS machine. The repo is the
 * one ~/.consonance.json's room_path sits in (<repo>/exo_memory/BOOT.md); an installed hook lives in ~/.claude/shell/hooks/, so a bare
 * relative path would point nowhere. With no config, or a room outside a repo, it says where the file is relative to the repository. */
const GATES_REL = 'consonance/GATES.md';
function gatesDocFrom(roomPath, exists) {
  const rp = String(roomPath || '').trim();
  if (rp) {
    const dir = path.dirname(rp);
    if (path.basename(dir).toLowerCase() === 'exo_memory') {
      const p = path.join(path.dirname(dir), 'consonance', 'GATES.md');
      try { if (exists(p)) return p; } catch (_) { /* fall through to the relative name */ }
    }
  }
  return GATES_REL + ' (in the Consonance repository)';
}
function gatesDoc() {
  try { return gatesDocFrom(String((JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\\uFEFF/, '')) || {}).room_path || ''), fs.existsSync); } catch (_) { return gatesDocFrom('', () => false); }
}
function record(dir, row) {`],
  [`d = decide(text, calls, payload.cwd || '', path.join(dir, LEDGER), ringSha, what); }`,
   `d = decide(text, calls, payload.cwd || '', path.join(dir, LEDGER), ringSha, what, gatesDoc()); }`],
  [`isPrompt, isNotificationOnly, parseSources, norm, tails, opensInSegment, turnCalls, itemMatches, decide, readTurnEntries, scrub };`,
   `isPrompt, isNotificationOnly, parseSources, norm, tails, opensInSegment, turnCalls, itemMatches, decide, readTurnEntries, scrub, GATES_REL, gatesDocFrom, gatesDoc };`],
]);
edit('consonance/hooks/reply-slot.js', [
  [`function verdict({ reply, entries, stopHookActive, live = false, seat = null }) {`,
   `function verdict({ reply, entries, stopHookActive, live = false, seat = null, gates = 'consonance/GATES.md' }) {`],
  [`This hook blocks once per turn: your next reply ends the turn.' };`,
   `This hook blocks once per turn: your next reply ends the turn. How this works and why: ' + gates + ', section 2 (the reply slot).' };`],
  [`v = verdict({ reply, entries, stopHookActive: !!payload.stop_hook_active, live: !SHADOW, seat }); }`,
   `v = verdict({ reply, entries, stopHookActive: !!payload.stop_hook_active, live: !SHADOW, seat, gates: G.gatesDoc ? G.gatesDoc() : undefined }); }`],
]);
