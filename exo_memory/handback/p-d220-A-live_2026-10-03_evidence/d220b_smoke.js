// smoke: the INSTALLED reply-slot.js, temp data dir (NOT the live ledger). Librarian seat, keeper turn.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const HOOK = path.join(os.homedir(), '.claude', 'shell', 'hooks', 'reply-slot.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-smoke-'));
const tr = path.join(dir, 't.jsonl');
const entries = [
  { type: 'user', message: { role: 'user', content: 'earlier' } },
  { type: 'user', origin: { kind: 'human' }, message: { role: 'user', content: 'how is B doing?' } },
];
fs.writeFileSync(tr, entries.map((e) => JSON.stringify(e)).join('\n') + '\n');
const env = { ...process.env, CONSONANCE_DATA: dir, CONSONANCE_PANE: '0c0c0c0b-0000-4000-8000-00000000115b' }; delete env.CONSONANCE_DREAM;
const run = (reply, active) => spawnSync(process.execPath, [HOOK], { input: JSON.stringify({ session_id: 'smoke0001', transcript_path: tr, cwd: 'x', hook_event_name: 'Stop', stop_hook_active: active, last_assistant_message: reply }), env, encoding: 'utf8' });
const a = run('B is at 47/47, filed at exo_memory/handback/p-x.md.', false);
console.log('unbacked, first Stop  -> status', a.status, 'stdout', (a.stdout || '').slice(0, 330).replace(/\s+/g, ' '), 'stderr', JSON.stringify(a.stderr));
const b = run('B is at 47/47, filed at exo_memory/handback/p-x.md.', true);
console.log('unbacked, second Stop -> status', b.status, 'stdout', JSON.stringify(b.stdout));
const c = run('B is at 47/47.\n\nSources: none', false);
console.log('Sources: none         -> status', c.status, 'stdout', JSON.stringify(c.stdout));
const d = run('Understood.', false);
console.log('no claim              -> status', d.status, 'stdout', JSON.stringify(d.stdout));
const rows = fs.readFileSync(path.join(dir, 'reply-slot.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
console.log(rows.map((r) => r.kind + (r.blocked ? '+blocked' : '') + '/shadow=' + r.shadow).join(' | '));
fs.rmSync(dir, { recursive: true, force: true });
