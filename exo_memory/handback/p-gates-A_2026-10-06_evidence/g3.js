// g3.js: the non-author look at G3 (ask-ending.js, a Stop hook in SHADOW). It must never block, never print, and never log a secret. Transcripts are planted in a temp dir.
const L = require('./lib.js'); const { fs, path, hook, check, rows } = L;
const R = path.join(__dirname, 'g3work'); fs.rmSync(R, { recursive: true, force: true }); fs.mkdirSync(R, { recursive: true });
const DATA = path.join(R, '_data'); const ledger = path.join(DATA, 'ask-ending.jsonl');
const run = (transcript, extra = {}, env = {}) => hook('ask-ending', { hook_event_name: 'Stop', session_id: 'look-a', transcript_path: transcript, cwd: 'C:/proj/demo', ...extra }, { CONSONANCE_DATA: DATA, ...env });
const silent = (h) => `status ${h.status}, stdout ${JSON.stringify(h.out)}, stderr ${JSON.stringify(h.err.slice(0, 40))}`; const SILENT = 'status 0, stdout "", stderr ""';
const jl = (...es) => es.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))).join('\n') + '\n';
const U = (t) => ({ type: 'user', message: { content: t } }), A = (t) => ({ type: 'assistant', message: { content: [{ type: 'text', text: t }] } });
const T = (name, text) => { const p = path.join(R, name); fs.writeFileSync(p, text); return p; };
const rowsNow = () => (fs.existsSync(ledger) ? fs.readFileSync(ledger, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);
const last = () => rowsNow().slice(-1)[0];

// ── what it logs
let h = run(T('m1.jsonl', jl(U('please fix the bug'), A('Done. All tests pass.\n\nWant me to also tidy the changelog?'))));
check('G3-a', 'a matched ending: no block, no output', silent(h), SILENT); check('G3-a2', 'the row: matched, promptKind user, the line kept', `${last().matched} ${last().promptKind} ${/changelog/.test(last().line || '')}`, 'true user true');
h = run(T('m2.jsonl', jl(U('please fix the bug'), A('Done. All tests pass.')))); check('G3-b', 'an unmatched ending: logged without text', `${last().matched} ${'line' in last()}`, 'false false');
h = run(T('m3.jsonl', jl(U('[keep-warm, from the chair] Reply with exactly: ok'), A('ok')))); check('G3-c', 'a keep-warm turn is promptKind relay', last().promptKind, 'relay');
h = run(T('m4.jsonl', jl(U('x'), { type: 'assistant', message: { content: [{ type: 'tool_use', name: 'AskUserQuestion', input: {} }, { type: 'text', text: 'Should I use option A?' }] } }))); check('G3-d', 'AskUserQuestion is recorded (auq true) and the matched line kept', `${last().auq} ${last().matched}`, 'true true');

// ── NEVER BLOCKS: any reply shape
const shapes = {
  'empty file': '', 'only newlines': '\n\n\n', 'garbage text': 'this is not json\nnor this\n', 'binary garbage': Buffer.from(Array.from({ length: 4000 }, (_, i) => (i * 37) % 256)),
  'partial last line': jl(U('q'), A('Want me to go on?')) + '{"type":"assistant","message":{"content":[{"type":"text","te',
  'assistant content is a string': jl(U('q'), { type: 'assistant', message: { content: 'Shall I continue?' } }), 'content null': jl(U('q'), { type: 'assistant', message: { content: null } }), 'message null': jl(U('q'), { type: 'assistant', message: null }),
  'blocks with nulls': jl(U('q'), { type: 'assistant', message: { content: [null, 7, 'x', { type: 'text' }, { type: 'text', text: null }, { type: 'text', text: 'Should I?' }] } }), 'entries that are not objects': jl('1', 'null', '"str"', '[]', U('q'), A('Want me to?')),
  'user content array with tool_result': jl({ type: 'user', message: { content: [{ type: 'tool_result', content: 'x' }] } }, A('Want me to continue?')), 'no user entry at all': jl(A('Want me to continue?')),
  'reply ends in ?** markdown': jl(U('q'), A('**Want me to continue?**')), 'a 3 MB single line': jl(U('q'), A('word '.repeat(600000) + '\nWant me to stop?')), 'a very long matched line': jl(U('q'), A('Should I ' + 'x'.repeat(500000) + '?')),
  'CRLF': jl(U('q'), A('line one\r\nWant me to go?\r\n')), 'unicode': jl(U('q'), A('Voulez-vous que je continue ? 🎉 Want me to go on?')),
};
let k = 0; for (const [name, body] of Object.entries(shapes)) { const hh = run(T('s' + ++k + '.jsonl', body)); check('G3-n' + k, `never blocks, never prints: ${name}`, silent(hh), SILENT); }
// transcript path problems
check('G3-p1', 'transcript_path missing from the payload', silent(hook('ask-ending', { hook_event_name: 'Stop', session_id: 's' }, { CONSONANCE_DATA: DATA })), SILENT);
check('G3-p2', 'transcript file does not exist', silent(run(path.join(R, 'nope.jsonl'))), SILENT); check('G3-p3', 'transcript_path is a directory', silent(run(R)), SILENT); check('G3-p4', 'transcript_path is a number', silent(run(12345)), SILENT); check('G3-p5', 'payload is not json', silent(hook('ask-ending', 'not json', { CONSONANCE_DATA: DATA })), SILENT); check('G3-p6', 'empty stdin', silent(hook('ask-ending', '', { CONSONANCE_DATA: DATA })), SILENT);
check('G3-p7', 'no data dir configured at all', silent(hook('ask-ending', { transcript_path: T('m5.jsonl', jl(U('q'), A('Want me to?'))) }, { CONSONANCE_DATA: '', HOME: R, USERPROFILE: R })), SILENT);
const fileAsDir = path.join(R, 'ledger-file'); fs.writeFileSync(fileAsDir, 'x'); check('G3-p8', 'the ledger dir cannot be written', silent(run(T('m6.jsonl', jl(U('q'), A('Want me to?'))), {}, { CONSONANCE_DATA: fileAsDir })), SILENT);
// a very big transcript (60 MB): only the tail is read; and it is fast
const big = path.join(R, 'big.jsonl'); const fd = fs.openSync(big, 'w'); const line = jl(U('filler ' + 'y'.repeat(900)), A('reply ' + 'z'.repeat(900))); for (let i = 0; i < 30000; i++) fs.writeSync(fd, line); fs.writeSync(fd, jl(U('last prompt'), A('Done.\nShould I go on?'))); fs.closeSync(fd);
h = run(big); check('G3-big', `a ${Math.round(fs.statSync(big).size / 1e6)} MB transcript: silent and fast`, `${silent(h)} ${h.ms < 4000 ? 'fast' : 'SLOW ' + h.ms}`, SILENT + ' fast', h.ms + ' ms'); check('G3-big2', 'and it read the LAST turn', `${last().matched} ${last().promptKind}`, 'true user');
// the dream gate
check('G3-dream', 'CONSONANCE_DREAM set: nothing at all', silent(run(T('m7.jsonl', jl(U('q'), A('Want me to?'))), {}, { CONSONANCE_DREAM: '1' })), SILENT);

// ── NEVER LOGS A SECRET: a matched line carrying key-like text of several shapes. The shapes the hook scrubs, and the ones it does not.
const Q = 'Q'.repeat(30);
const secrets = {
  'vck_ gateway': 'vck' + '_' + Q, 'anthropic': 'sk' + '-ant-' + Q, 'sk- (openai style)': 'sk' + '-' + 'proj-' + Q, 'github ghp_': 'gh' + 'p_' + 'Q'.repeat(36), 'aws AKIA': 'AK' + 'IA' + 'Q'.repeat(16), 'bearer': 'Bearer ' + Q, 'TOKEN=value': 'MY_TOKEN=' + Q, 'password: value': 'password: ' + Q,
  'stripe sk_live_': 'sk' + '_live_' + Q, 'slack xoxb-': 'xo' + 'xb-' + '1234567890-' + Q, 'google AIza': 'AI' + 'za' + 'Q'.repeat(35), 'jwt': 'ey' + 'J' + 'Q'.repeat(20) + '.' + 'ey' + 'J' + 'Q'.repeat(20) + '.' + 'Q'.repeat(20), 'npm_ token': 'npm' + '_' + 'Q'.repeat(36), 'gitlab glpat-': 'glp' + 'at-' + 'Q'.repeat(20), 'a bare 40-hex': 'Q0'.repeat(20), 'url with credentials': 'https://user:' + Q + '@example.com/x',
};
const leaked = [], scrubbed = [];
for (const [name, s] of Object.entries(secrets)) { run(T('sec.jsonl', jl(U('q'), A(`Want me to deploy with ${s} now?`)))); const r = last(); const kept = r && r.matched && (r.line || '').includes('QQQQQ') || (r && (r.line || '').includes(s)); (kept ? leaked : scrubbed).push(name); }
check('G3-sec-a', 'secret shapes the hook scrubs', scrubbed.join(' | '), scrubbed.join(' | ')); console.log('   scrubbed:', scrubbed.length, ' NOT scrubbed (the text reaches the ledger):', JSON.stringify(leaked));
check('G3-sec-b', 'every secret shape is scrubbed', leaked.length, 0, leaked.length ? 'NOT scrubbed: ' + leaked.join(', ') : '');
// the ledger as a whole: nothing from an UNMATCHED line, nothing but the fields it names
run(T('un.jsonl', jl(U('q'), A('The key is ' + 'vck' + '_' + Q + '. Done.')))); const ur = last(); check('G3-sec-c', 'an UNMATCHED ending that holds a key: its text is not logged at all', 'line' in ur, false);
const fields = new Set(rowsNow().flatMap((r) => Object.keys(r))); console.log('   ledger fields seen:', [...fields].join(', '));
console.log('\nDIFFS:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none'); fs.writeFileSync(path.join(__dirname, 'g3_rows.json'), JSON.stringify(rows, null, 1));
