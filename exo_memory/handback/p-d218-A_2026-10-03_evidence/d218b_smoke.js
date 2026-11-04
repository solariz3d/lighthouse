// smoke: the INSTALLED hook, a temp data dir (NOT the live ledger), a librarian pane-ring turn and a chair pane-ring turn
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const hook = 'C:/Users/nname/.claude/shell/hooks/reply-slot.js';
function go(paneId, cwd) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-smoke2-'));
  const t = path.join(dir, 't.jsonl');
  const E = [{ type: 'user', message: { role: 'user', content: '\n\n<pasted_content id="d7d4">\n[pane:B] D210 hand-back at exo_memory/handback/p-x.md\n</pasted_content id="d7d4">' }, origin: { kind: 'human' } }];
  fs.writeFileSync(t, E.map((e) => JSON.stringify(e)).join('\n') + '\n');
  const env = { ...process.env, CONSONANCE_DATA: dir, CONSONANCE_PANE: paneId }; delete env.CONSONANCE_DREAM;
  const r = spawnSync(process.execPath, [hook], { input: JSON.stringify({ session_id: 'smoke7654321', transcript_path: t, cwd, stop_hook_active: false, last_assistant_message: 'B is at 47/47, filed at exo_memory/handback/p-x.md.' }), env, encoding: 'utf8' });
  const row = JSON.parse(fs.readFileSync(path.join(dir, 'reply-slot.jsonl'), 'utf8').trim());
  return { exit: r.status, stdout: JSON.stringify(r.stdout), stderr: JSON.stringify(r.stderr), seat: row.seat, kind: row.kind, prompt: row.prompt, wouldBlock: row.wouldBlock, tokenKinds: row.tokenKinds };
}
console.log('librarian:', JSON.stringify(go('0c0c0c0b-0000-4000-8000-00000000115b', 'C:/Consonance/instances/librarian')));
console.log('chair:    ', JSON.stringify(go('0c0c0c0a-0000-4000-8000-000000000a01', 'C:/Consonance/instances/main')));
const live = 'C:/Consonance/data/reply-slot.jsonl';
const rows = fs.existsSync(live) ? fs.readFileSync(live, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
const by = {}; for (const r of rows) { const k = r.seat + ' ' + r.kind; by[k] = (by[k] || 0) + 1; }
console.log('live ledger rows', rows.length, JSON.stringify(by));
