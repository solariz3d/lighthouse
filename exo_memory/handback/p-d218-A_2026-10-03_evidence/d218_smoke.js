// smoke: run the INSTALLED hook (~/.claude/shell/hooks/reply-slot.js) with a mock Stop payload and a temp data dir (NOT the live ledger)
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-smoke-'));
const t = path.join(dir, 't.jsonl');
const E = [{ type: 'user', message: { role: 'user', content: 'how is it going?' }, origin: { kind: 'human' } }];
fs.writeFileSync(t, E.map((e) => JSON.stringify(e)).join('\n') + '\n');
const hook = 'C:/Users/nname/.claude/shell/hooks/reply-slot.js';
const env = { ...process.env, CONSONANCE_DATA: dir, CONSONANCE_PANE: '0c0c0c0b-0000-4000-8000-00000000115b' }; delete env.CONSONANCE_DREAM;
const r = spawnSync(process.execPath, [hook], { input: JSON.stringify({ session_id: 'smoke123456', transcript_path: t, cwd: 'C:/Consonance/instances/librarian', stop_hook_active: false, last_assistant_message: 'It is 47/47 green at exo_memory/loop/x.md.' }), env, encoding: 'utf8' });
console.log('exit', r.status, 'stdout', JSON.stringify(r.stdout), 'stderr', JSON.stringify(r.stderr));
console.log(fs.readFileSync(path.join(dir, 'reply-slot.jsonl'), 'utf8').trim());
const live = 'C:/Consonance/data/reply-slot.jsonl';
console.log('live ledger exists:', fs.existsSync(live), fs.existsSync(live) ? fs.readFileSync(live, 'utf8').split('\n').filter(Boolean).length + ' rows' : '');
