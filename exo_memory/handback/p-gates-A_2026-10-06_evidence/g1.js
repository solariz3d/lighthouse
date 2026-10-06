// g1.js: the non-author look at G1 (push-gate.js). A throwaway LOCAL bare repo is the only remote; nothing here reaches GitHub. Fake keys are assembled at runtime (this repo is public).
const L = require('./lib.js'); const { fs, path, hook, bash, check, verdict, spawnSync, rows, data } = L;
const R = path.join(__dirname, 'g1work'); fs.rmSync(R, { recursive: true, force: true }); fs.mkdirSync(R, { recursive: true });
const fw = (p) => p.replace(/\\/g, '/');
const git = (cwd, ...a) => { const r = spawnSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${a.join(' ')} in ${cwd}: ${r.stderr}`); return r.stdout; };
const FAKE = { vck: 'vck' + '_' + 'Q'.repeat(24), ant: 'sk' + '-ant-' + 'Q'.repeat(24), ghp: 'gh' + 'p_' + 'Q'.repeat(36), aws: 'AK' + 'IA' + 'QQQQQQQQQQQQQQQQ', pem: '-----BEGIN RSA PRIVATE ' + 'KEY-----' };
const G1 = (cmd, cwd, tool) => hook('push-gate', bash(cmd, cwd, tool));
let n = 0;
/** A local bare remote 'origin', a clone with one pushed commit on main and upstream set. */
function setup(name) {
  const bare = path.join(R, name + '.git'), work = path.join(R, name); git(R, 'init', '-q', '--bare', '-b', 'main', bare);
  git(R, 'clone', '-q', bare, work); git(work, 'config', 'user.email', 'a@b.c'); git(work, 'config', 'user.name', 'look'); git(work, 'checkout', '-q', '-b', 'main');
  fs.writeFileSync(path.join(work, 'README.md'), 'hello\n'); git(work, 'add', '.'); git(work, 'commit', '-q', '-m', 'init'); git(work, 'push', '-q', '-u', 'origin', 'main'); return { bare, work };
}
const commit = (work, file, text, msg = 'c' + ++n) => { fs.mkdirSync(path.dirname(path.join(work, file)), { recursive: true }); fs.writeFileSync(path.join(work, file), text); git(work, 'add', '.'); git(work, 'commit', '-q', '-m', msg); };
const noText = (h) => !JSON.stringify(h).includes('QQQQQ');

// ── 2. a key still refused, a clean push allowed (upstream set)
{ const { work } = setup('t1'); commit(work, 'clean.txt', 'nothing here\n');
  check('G1-a', 'git push, a clean commit', verdict(G1('git push', work)), 'allow');
  commit(work, 'cfg/app.env', `NAME=x\nKEY=${FAKE.vck}\n`); const h = G1('git push', work); check('G1-b', 'git push, a commit adding a vck_ key', verdict(h), 'deny', (h.reason || '').split('\n')[1] || ''); check('G1-b2', 'the reason shows file:line and the kind, not the key', /cfg\/app\.env:2/.test(h.reason || '') && noText(h), true);
  check('G1-c', 'git push --force, the key still there', verdict(G1('git push --force', work)), 'deny'); check('G1-c2', 'git push -f origin main', verdict(G1('git push -f origin main', work)), 'deny'); check('G1-c3', 'git push --force-with-lease', verdict(G1('git push --force-with-lease', work)), 'deny');
  git(work, 'reset', '-q', '--hard', 'HEAD~1'); commit(work, 'clean2.txt', 'ok\n'); check('G1-d', 'after the key commit is gone: git push --force', verdict(G1('git push --force', work)), 'allow'); check('G1-d2', 'git push -f (clean)', verdict(G1('git push -f', work)), 'allow');
  for (const [k, v] of Object.entries(FAKE)) { commit(work, `k_${k}.txt`, `x\n${v}\n`); check('G1-e-' + k, `each shape is refused: ${k}`, verdict(G1('git push', work)), 'deny'); git(work, 'reset', '-q', '--hard', 'HEAD~1'); }
  check('G1-f', 'a key the diff REMOVES (an earlier pushed key deleted now) is allowed', (() => { const { work: w2 } = setup('t1b'); commit(w2, 'old.txt', `${FAKE.ant}\n`); git(w2, 'push', '-q'); commit(w2, 'old.txt', 'gone\n'); return verdict(G1('git push', w2)); })(), 'allow'); }

// ── 3. NO UPSTREAM
{ const { work } = setup('t2'); git(work, 'checkout', '-q', '-b', 'feature'); commit(work, 'f.txt', 'plain\n'); check('G1-g', 'no upstream (a new branch), clean: allowed', verdict(G1('git push -u origin feature', work)), 'allow');
  const { work: w3 } = setup('t3'); git(w3, 'checkout', '-q', '-b', 'feature'); commit(w3, 'f.txt', `${FAKE.ghp}\n`); const h = G1('git push -u origin feature', w3); check('G1-h', 'no upstream (a new branch), a key: refused (scanned from the merge base with origin/main)', verdict(h), 'deny', ((h.reason || '').match(/since (.*)\./) || [])[1] || '');
  // the FIRST push to an EMPTY remote: origin has no refs at all, so there is no origin/main to take a merge base with
  const bare = path.join(R, 'empty.git'); git(R, 'init', '-q', '--bare', '-b', 'main', bare); const w4 = path.join(R, 'first'); fs.mkdirSync(w4); git(w4, 'init', '-q', '-b', 'main'); git(w4, 'config', 'user.email', 'a@b.c'); git(w4, 'config', 'user.name', 'look'); git(w4, 'remote', 'add', 'origin', bare);
  fs.writeFileSync(path.join(w4, '.env'), `SECRET=${FAKE.vck}\n`); git(w4, 'add', '.'); git(w4, 'commit', '-q', '-m', 'first'); const hf = G1('git push -u origin main', w4);
  check('G1-i', 'the FIRST push of a new repo to an empty remote, the first commit holds a key', verdict(hf), 'deny', 'HOLE if allow: no base to diff against, so it fails open and scans nothing');
  // a remote that is not called origin, no upstream
  const w5 = path.join(R, 'otherremote'); fs.mkdirSync(w5); git(w5, 'init', '-q', '-b', 'main'); git(w5, 'config', 'user.email', 'a@b.c'); git(w5, 'config', 'user.name', 'look'); git(w5, 'remote', 'add', 'backup', bare); fs.writeFileSync(path.join(w5, 'a.txt'), 'a\n'); git(w5, 'add', '.'); git(w5, 'commit', '-q', '-m', 'a'); git(w5, 'push', '-q', 'backup', 'main'); commit(w5, 'b.txt', `${FAKE.vck}\n`);
  check('G1-j', 'a remote NOT named origin and no upstream, a key in the unpushed commit', verdict(G1('git push backup main', w5)), 'deny', 'HOLE if allow: only refs/remotes/origin/* are tried'); }

// ── 4. what a diff of the net change cannot see
{ const { work } = setup('t4'); commit(work, 'tmp.cfg', `T=${FAKE.aws}\n`, 'add a key'); git(work, 'rm', '-q', 'tmp.cfg'); git(work, 'commit', '-q', '-m', 'oops, remove it');
  const h = G1('git push', work); const inHistory = git(work, 'log', '-p', '--format=', '@{upstream}..HEAD').includes('QQQQQ');
  check('G1-k', 'a key ADDED in one unpushed commit and REMOVED in the next: the push publishes the first commit', verdict(h), 'deny', 'HOLE if allow: the key is in the history being pushed (' + (inHistory ? 'confirmed in git log -p' : 'not in log?') + '), the net diff is clean'); }

// ── 5. the cd chain
{ const { work } = setup('t5'); commit(work, 'k.txt', `${FAKE.vck}\n`); const elsewhere = path.join(R, 'notarepo'); fs.mkdirSync(elsewhere, { recursive: true });
  const h1 = G1(`cd ${fw(work)} && git push`, elsewhere); check('G1-l', 'cd <repo with a key> && git push   (session cwd is not a repo)', verdict(h1), 'deny', 'HOLE if allow: the gate runs git in the session cwd, not the cd');
  const { work: clean } = setup('t5b'); commit(clean, 'c.txt', 'fine\n'); const h2 = G1(`cd ${fw(clean)} && git push`, work); check('G1-m', 'cd <clean repo> && git push   (session cwd = a repo holding a key)', verdict(h2), 'allow', 'FALSE POSITIVE if deny: it scanned the session repo, not the cd');
  check('G1-n', 'git -C <repo with a key> push (the form it does handle)', verdict(G1(`git -C ${fw(work)} push`, elsewhere)), 'deny'); check('G1-o', 'git -C <relative repo> push', verdict(G1(`git -C t5 push`, R)), 'deny');
  check('G1-p', 'PowerShell tool: git -C <repo> push', verdict(G1(`git -C "${work}" push`, elsewhere, 'PowerShell')), 'deny'); check('G1-q', 'a push in a chain after other commands', verdict(G1(`git status && git add -A ; git -C ${fw(work)} push`, elsewhere)), 'deny'); }

// ── 6. text that is not a push
{ const { work } = setup('t6'); commit(work, 'k.txt', `${FAKE.ant}\n`);
  check('G1-r', 'git status (not a push)', verdict(G1('git status', work)), 'allow'); check('G1-s', 'git log -1 (not a push)', verdict(G1('git log -1', work)), 'allow'); check('G1-t', 'git pull', verdict(G1('git pull', work)), 'allow');
  check('G1-u', 'git commit -m "notes on git push" with an unpushed key in the history', verdict(G1('git commit -m "notes on git push"', work)), 'allow', 'FALSE POSITIVE if deny (E names it): a commit refused because of the words'); check('G1-v', 'echo "git push later"', verdict(G1('echo "git push later"', work)), 'allow', 'same family'); }

// ── 7. fail open on its own errors
{ const { work } = setup('t7'); commit(work, 'k.txt', `${FAKE.vck}\n`); const bad = (id, label, input, env) => check(id, 'fails OPEN: ' + label, (() => { const h = hook('push-gate', input, env); return `status ${h.status}, stdout ${JSON.stringify(h.out)}`; })(), 'status 0, stdout ""');
  bad('G1-w1', 'not json', 'not json'); bad('G1-w2', 'empty stdin', ''); bad('G1-w3', 'no tool_name', JSON.stringify({ tool_input: { command: 'git push' } })); bad('G1-w4', 'command is a number', JSON.stringify({ tool_name: 'Bash', tool_input: { command: 7 } })); bad('G1-w5', 'not a shell tool', JSON.stringify({ tool_name: 'Read', tool_input: { command: 'git push' }, cwd: work }));
  bad('G1-w6', 'cwd does not exist', JSON.stringify(bash('git push', 'Z:/no/such/dir')));
  // git is not on the PATH
  const noGit = hook('push-gate', bash('git push', work), { PATH: 'C:/Windows/System32' }); check('G1-x', 'git not found on PATH: fails open (and says so in the ledger)', `status ${noGit.status}, stdout ${JSON.stringify(noGit.out)}`, 'status 0, stdout ""');
  // an unwritable ledger does not stop a deny
  const fileAsDir = path.join(R, 'ledger-file'); fs.writeFileSync(fileAsDir, 'x'); check('G1-y', 'an unwritable ledger does not stop the deny', verdict(hook('push-gate', bash('git push', work), { CONSONANCE_DATA: fileAsDir })), 'deny');
  // git hangs: a diff textconv that sleeps (the hook gives each git call 6 s and the whole hook 8 s)
  const { work: slow } = setup('t8'); fs.writeFileSync(path.join(slow, '.gitattributes'), '*.cfg diff=slow\n'); git(slow, 'config', 'diff.slow.textconv', 'sleep 30; cat'); git(slow, 'add', '.'); git(slow, 'commit', '-q', '-m', 'attr'); git(slow, 'push', '-q'); commit(slow, 'x.cfg', `K=${FAKE.vck}\n`);
  const hs = hook('push-gate', bash('git push', slow)); check('G1-z', 'git hangs (a textconv that sleeps 30 s) with a key in the diff: allowed, within the watchdog', `status ${hs.status}, deny ${hs.deny}, ${hs.ms < 9500 ? 'within 9.5 s' : 'TOO SLOW ' + hs.ms}`, 'status 0, deny false, within 9.5 s', hs.ms + ' ms: ' + 'FAILS OPEN on the timeout, by design; note the key goes unscanned'); }

// ── 8. speed on the real repos (read only: git diff)
for (const [label, dir] of [['lighthouse', 'C:/Users/nname/Desktop/lighthouse'], ['t180 main', 'C:/Users/nname/Desktop/t180-track-builder']]) { const h = G1('git push', dir); console.log(`   real repo ${label}: ${verdict(h)} in ${h.ms} ms`); }
// ── 9. the ledger never holds a key
const ledger = path.join(data, 'push-gate.jsonl'); const text = fs.existsSync(ledger) ? fs.readFileSync(ledger, 'utf8') : ''; check('G1-ledger', 'the ledger has file, line and kind, and no key text', text.length > 0 && !/QQQQQ/.test(text), true, text.split('\n').length - 1 + ' rows');
console.log('\nDIFFS:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none'); fs.writeFileSync(path.join(__dirname, 'g1_rows.json'), JSON.stringify(rows, null, 1));
