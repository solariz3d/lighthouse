// checks.js (D450 verify, B): re-derives, read-only, every verdict C's delete list rests on, at the time of the run. Writes checks.json beside it.
//   node checks.js <out.json>
// Git runs with --no-optional-locks (no index refresh, no write). Launched by lowio.ps1: BelowNormal and very low I/O, both inherited by the git
// children; disk-heavy steps go in small batches (a pause per worktree, 8 MB reads with pauses for the board and the hashes).
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);

const HOME = 'C:/Users/nname', DL = `${HOME}/Downloads`, REPO = `${DL}/t180-track-builder`, DESK = `${HOME}/Desktop/t180-track-builder`;
const LH = `${HOME}/Desktop/lighthouse`, EVC = `${LH}/exo_memory/handback/p-d450-cleanup-inventory-C_2026-10-24_evidence`;
const R17 = 'refs/heads/local-0.4.17', R18 = 'refs/heads/local-0.4.18';
const lines = (f) => fs.readFileSync(f, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
const git = (cwd, ...a) => { try { return { ok: true, out: execFileSync('git', ['--no-optional-locks', '-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).trim() }; } catch (e) { return { ok: false, out: String(e.stdout || '').trim(), err: String(e.stderr || e.message).trim().slice(0, 300), code: e.status }; } };
const nap = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);   // small batches: a pause between disk-heavy steps
/** A file's text read in 8 MB pieces with a pause between (the board is 160 MB). */
const readPaced = (f) => { const fd = fs.openSync(f, 'r'), parts = [], b = Buffer.alloc(8 << 20); let n; while ((n = fs.readSync(fd, b, 0, b.length, null)) > 0) { parts.push(Buffer.from(b.subarray(0, n))); nap(40); } fs.closeSync(fd); return Buffer.concat(parts); };
const isAnc = (cwd, a, b) => git(cwd, 'merge-base', '--is-ancestor', a, b).ok;
const norm = (p) => p.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
const out = { at: new Date().toISOString(), priority: os.getPriority(0), tips: {} };

// ── open laps: the newest chain row per lap whose state is not "filed"; D450 (this cleanup) is left out, since its own papers name every path
const LAP = fs.readFileSync('C:/Consonance/data/lap.jsonl', 'utf8').split('\n').map((l) => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean);
const last = {}, noteOf = {}; for (const r of LAP) { if (r.chain) last[r.lap] = r; if (r.note) noteOf[r.lap] = r.note; }
const open = Object.values(last).filter((r) => r.chain !== 'filed' && r.lap !== 'D450').map((r) => ({ lap: r.lap, chain: r.chain, since: new Date(r.at).toISOString(), note: noteOf[r.lap] || null }));
const OPEN = new Set(open.map((o) => o.lap)); out.openLaps = open;
const openRows = LAP.filter((r) => OPEN.has(r.lap)).map((r) => ({ lap: r.lap, text: JSON.stringify(r) }));

// ── the record to search: every file in exo_memory/loop (the plans), and board lines that name an open lap
const LOOP = `${LH}/exo_memory/loop`, loopFiles = fs.readdirSync(LOOP).filter((n) => /\.(md|txt|json|jsonl)$/i.test(n)).map((n) => ({ n, text: fs.readFileSync(path.join(LOOP, n), 'utf8') }));
const openRe = new RegExp(`\\b(${[...OPEN].join('|')})\\b`);
const boardOpen = []; { const B = readPaced('C:/Consonance/data/board.jsonl').toString('utf8').split('\n'); for (const l of B) if (openRe.test(l)) boardOpen.push(l); }
out.searched = { loopFiles: loopFiles.length, boardLinesNamingAnOpenLap: boardOpen.length, openLapRows: openRows.length };
const tokRe = (t) => new RegExp(`(^|[^A-Za-z0-9_.-])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_-])`, 'i');
const lapOf = (t) => { const m = /(?:^|[^a-z0-9])d(\d{3})(?![0-9])/i.exec(t) || /^t180-wt-[abcepo](\d{3})[a-z]?$/i.exec(t); return m ? `D${m[1]}` : null; };
/** Where the record names any of the tokens: open-lap rows, plans (with the lap of the nearest heading above the hit), and board lines of open laps. */
function namedBy(tokens) {
  const res = { lapRows: [], plans: [], board: 0, boardLaps: new Set(), lapOfName: [] };
  for (const t of tokens) {
    const re = tokRe(t);
    for (const r of openRows) if (re.test(r.text)) res.lapRows.push(r.lap);
    for (const f of loopFiles) {
      if (!re.test(f.text)) continue;
      const L = f.text.split('\n'); let heading = '';
      for (let i = 0; i < L.length; i++) {
        if (/^#{1,4} /.test(L[i])) heading = L[i];
        if (re.test(L[i])) { const laps = [...new Set([...(heading.match(/\bD\d{3}\b/g) || []), ...(f.n.match(/d\d{3}/gi) || []).map((x) => x.toUpperCase())])]; res.plans.push({ file: f.n, line: i + 1, laps, open: laps.filter((x) => OPEN.has(x)) }); }
      }
    }
    for (const l of boardOpen) if (re.test(l)) { res.board++; for (const m of l.match(openRe) || []) res.boardLaps.add(m); }
    const lp = lapOf(t); if (lp && OPEN.has(lp)) res.lapOfName.push(lp);
  }
  const plansOpen = res.plans.filter((p) => p.open.length);
  return { lapRows: [...new Set(res.lapRows)], plansOpen, plansOther: res.plans.length - plansOpen.length, plansOtherFiles: [...new Set(res.plans.filter((p) => !p.open.length).map((p) => p.file))], board: res.board, boardLaps: [...res.boardLaps], lapOfName: [...new Set(res.lapOfName)] };
}

// ── the tips
for (const [k, r] of [['local-0.4.17', R17], ['local-0.4.18', R18], ['HEAD (main checkout)', 'HEAD']]) out.tips[k] = git(REPO, 'rev-parse', r).out;
out.tips.headBranch = git(REPO, 'symbolic-ref', 'HEAD').out; out.tips['0.4.17 in 0.4.18'] = isAnc(REPO, R17, R18);

// ── the registered worktrees of the Downloads repo
const wtl = git(REPO, 'worktree', 'list', '--porcelain').out.split(/\n\n/).map((b) => { const o = {}; for (const l of b.split('\n')) { const [k, ...v] = l.split(' '); o[k] = v.join(' ') || true; } return o; });
const wtBy = new Map(wtl.map((w) => [norm(w.worktree), w])); out.registered = wtl.length;
const checkedOut = new Set(wtl.map((w) => w.branch).filter((b) => typeof b === 'string'));

function worktree(p, repo = REPO) {
  const w = (repo === REPO ? wtBy : deskBy).get(norm(p));
  const r = { path: p, registered: !!w, locked: !!(w && w.locked), prunable: !!(w && w.prunable) };
  if (!fs.existsSync(p)) { r.exists = false; return r; }
  r.exists = true; nap(400);
  r.head = git(p, 'rev-parse', 'HEAD').out; const br = git(p, 'symbolic-ref', '-q', '--short', 'HEAD'); r.branch = br.ok ? br.out : null;
  const st = git(p, 'status', '--porcelain=v1', '--untracked-files=all'); r.statusOk = st.ok; r.dirty = st.ok ? st.out.split('\n').filter(Boolean) : null;
  r.mergeHead = fs.existsSync(path.join(git(p, 'rev-parse', '--git-dir').out.replace(/^(?![A-Za-z]:)/, p + '/'), 'MERGE_HEAD'));
  r.in17 = isAnc(REPO, r.head, R17); r.in18 = isAnc(REPO, r.head, R18);
  if (!r.in17 && !r.in18) { const c = git(REPO, 'cherry', R18, r.head); r.cherryPlus = c.ok ? c.out.split('\n').filter((l) => l.startsWith('+')).length : `ERR ${c.err}`; }
  r.named = namedBy([path.basename(p), ...(r.branch ? [r.branch] : [])]);
  return r;
}

// ── G1
out.g1 = lines(`${EVC}/g1.paths`).map((p) => worktree(p));

// ── G2: what each holds is the walk's (walk.out); here, whether it is a repository, and who names it
out.g2 = lines(`${EVC}/g2.paths`).map((p) => {
  const r = { path: p, exists: fs.existsSync(p) }; if (!r.exists) return r;
  const st = fs.lstatSync(p); r.kind = st.isDirectory() ? 'dir' : 'file';
  const g = path.join(p, '.git'); r.git = fs.existsSync(g) ? (fs.lstatSync(g).isDirectory() ? 'dir' : fs.readFileSync(g, 'utf8').trim()) : null;
  r.registeredWorktree = wtBy.has(norm(p));
  if (r.git === 'dir') { const heads = git(p, 'for-each-ref', '--format=%(refname) %(objectname)').out.split('\n').filter(Boolean); r.heads = heads.map((h) => { const [ref, sha] = h.split(' '); return { ref, sha, inRepo: git(REPO, 'cat-file', '-e', sha).ok, in18: isAnc(REPO, sha, R18) }; }); }
  r.named = namedBy([path.basename(p)]);
  return r;
});

// ── G4: ownership evidence by name (the open-file query is rmopen.out)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp/i;
const TEMP = `${HOME}/AppData/Local/Temp`;
out.uuidTmpInTemp = (() => { const c = {}; for (const n of fs.readdirSync(TEMP)) if (UUID.test(n)) c[n[0]] = (c[n[0]] || 0) + 1; return c; })();
out.g4 = lines(`${EVC}/g4.paths`).map((p) => {
  const n = path.basename(p), r = { path: p, name: n, exists: fs.existsSync(p) }; if (!r.exists) return r;
  const st = fs.statSync(p); r.mtime = st.mtime.toISOString(); r.kind = st.isDirectory() ? 'dir' : 'file';
  if (UUID.test(n)) { const b = Buffer.alloc(4); const fd = fs.openSync(p, 'r'); fs.readSync(fd, b, 0, 4, 0); fs.closeSync(fd); r.magic = b.toString('latin1'); r.uuid = true; }
  else if (r.kind === 'file' && st.size < 4e6) { const t = fs.readFileSync(p, 'latin1'); r.mentionsOurs = /t180|lighthouse|consonance|exo_memory|app[\\/]test|src[\\/](geom|export|core)/i.test(t); r.size = st.size; }
  else if (r.kind === 'dir') r.top = fs.readdirSync(p).slice(0, 8);
  return r;
});

// ── G5: C:\build, and whether anything points a build at it now
out.g5 = { path: 'C:/build', exists: fs.existsSync('C:/build'), top: fs.existsSync('C:/build') ? fs.readdirSync('C:/build') : [] };
out.g5.env = { CARGO_TARGET_DIR: process.env.CARGO_TARGET_DIR || null };
out.g5.regUser = (() => { try { return execFileSync('reg', ['query', 'HKCU\\Environment', '/v', 'CARGO_TARGET_DIR'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch (e) { return null; } })();
out.g5.regMachine = (() => { try { return execFileSync('reg', ['query', 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment', '/v', 'CARGO_TARGET_DIR'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch (e) { return null; } })();
out.g5.cargoConfigs = []; for (const base of [REPO, LH, `${HOME}/.cargo`, `${LH}/consonance`, `${LH}/consonance/src-tauri`]) for (const f of ['.cargo/config.toml', '.cargo/config', 'config.toml', 'config']) { const p = path.join(base, f); if (fs.existsSync(p) && fs.statSync(p).isFile()) { const t = fs.readFileSync(p, 'utf8'); out.g5.cargoConfigs.push({ file: p, targetDir: (t.match(/target-dir\s*=\s*.*/g) || []) }); } }
out.g5.named = namedBy(['C:\\build', 'C:/build']);

// ── G6: untracked, and whose lap
out.g6 = lines(`${EVC}/g6.paths`).map((p) => {
  const rel = path.relative(LH, p).replace(/\\/g, '/'), r = { path: p, rel, exists: fs.existsSync(p) };
  r.tracked = git(LH, 'ls-files', '--', rel).out.split('\n').filter(Boolean).length; r.ignored = git(LH, 'check-ignore', '-q', '--', rel).ok;
  const lap = (/p-(d\d{3})/i.exec(rel) || [])[1]; r.lap = lap ? lap.toUpperCase() : null; r.lapState = r.lap ? (last[r.lap] ? last[r.lap].chain : 'no row') : null;
  r.top = r.exists ? fs.readdirSync(p) : [];
  return r;
});

// ── the 3 branches
out.branches = ['d427-a', 'd446-e', 'land-0.4.8'].map((b) => {
  const r = { branch: b, exists: git(REPO, 'rev-parse', '--verify', '-q', `refs/heads/${b}`).ok };
  if (!r.exists) return r;
  r.sha = git(REPO, 'rev-parse', `refs/heads/${b}`).out; r.in17 = isAnc(REPO, r.sha, R17);
  r.inHEAD = isAnc(REPO, r.sha, 'HEAD'); r.upstream = git(REPO, 'config', `branch.${b}.merge`).out || null;
  r.checkedOut = checkedOut.has(`refs/heads/${b}`);
  r.dWouldSucceed = r.inHEAD && !r.checkedOut;   // git branch -d: merged into HEAD (no upstream set), and not checked out anywhere
  r.named = namedBy([b]);
  return r;
});

// ── his items
const sha = (f) => { const h = crypto.createHash('sha256'), fd = fs.openSync(f, 'r'), b = Buffer.alloc(8 << 20); let n; while ((n = fs.readSync(fd, b, 0, b.length, null)) > 0) { h.update(b.subarray(0, n)); nap(40); } fs.closeSync(fd); return h.digest('hex'); };
const listTree = (d) => { const o = []; (function w(x) { for (const n of fs.readdirSync(x)) { const p = path.join(x, n), s = fs.lstatSync(p); if (s.isSymbolicLink()) o.push(`${path.relative(d, p)} LINK`); else if (s.isDirectory()) w(p); else o.push(`${path.relative(d, p).replace(/\\/g, '/')} ${s.size}`); } })(d); return o; };
out.his = {};
for (const [k, d] of [['t180b_untitled', `${HOME}/Documents/t180b_untitled`], ['t180b_test_oval', `${HOME}/Documents/Assetto Corsa/content/tracks/t180b_test_oval`]]) {
  const r = { path: d, exists: fs.existsSync(d) };
  if (r.exists) { r.files = listTree(d); const m = path.join(d, '.t180b-builder.json'); r.marker = fs.existsSync(m) ? fs.readFileSync(m, 'utf8').slice(0, 400) : null; }
  out.his[k] = r;
}
const Z = `${HOME}/Desktop/ELYSIUM (T-180 track)`;
out.his.zips = [['zip', `${Z}.zip`, '765f20de4dcde5c95cdbe79f40095d953e1ff8286375dc9a23918faa01d73845', 108406726], ['before-d364', `${Z}.before-d364.zip`, 'a678faa9014ab108575d7bb653976a34d2d431a9a7c263c2a999c80ffe26b632', 108528781], ['before-scifi', `${Z}.before-scifi.zip`, '206e00bf', null]]
  .map(([k, f, want, bytes]) => { if (!fs.existsSync(f)) return { k, f, exists: false }; const s = fs.statSync(f), h = sha(f); return { k, f, exists: true, size: s.size, mtime: s.mtime.toISOString(), sha256: h, recorded: want, matches: h.startsWith(want) && (bytes == null || s.size === bytes) }; });

// e19-e24: worktrees of the Desktop repo (read-only git there; nothing written)
const deskL = git(DESK, 'worktree', 'list', '--porcelain').out.split(/\n\n/).map((b) => { const o = {}; for (const l of b.split('\n')) { const [k, ...v] = l.split(' '); o[k] = v.join(' ') || true; } return o; });
var deskBy = new Map(deskL.map((w) => [norm(w.worktree), w]));
out.his.desktopWorktrees = ['e19', 'e20', 'e21', 'e22', 'e24'].map((n) => {
  const p = `${DL}/t180-wt-${n}`, r = worktree(p, DESK);
  r.inDesktopRepo = git(DESK, 'cat-file', '-e', r.head || 'x').ok; r.inDownloadsRepo = git(REPO, 'cat-file', '-e', r.head || 'x').ok;
  return r;
});

// ── kept by ruling: none may be in a list
const lists = { g1: lines(`${EVC}/g1.paths`), g2: lines(`${EVC}/g2.paths`), g4: lines(`${EVC}/g4.paths`), g5: lines(`${EVC}/g5.paths`), g6: lines(`${EVC}/g6.paths`) };
const all = Object.entries(lists).flatMap(([g, ps]) => ps.map((p) => ({ g, p: norm(p) })));
const KEPT = [`${DL}/t180-tutorial`, `${DL}/t180-handoff`, `${DL}/t180-archive`, `${DL}/t180-d402-e`, `${DL}/t180-track-builder`, `${DL}/t180-wt-a29`, `${DL}/t180-wt-land418`, `${DL}/t180-wt-e43`,
  ...['o18', 'o19-before', 'o20-83eaf20', 'o21-2c13316', 'o22-f2459fe', 'p402', 'p447', 'p447f', 'p447g', 'p447h'].map((n) => `${DL}/t180-wt-${n}`), `${LH}/exo_memory/handback/p-d447-O_2026-10-23_evidence/fakeac`,
  `${HOME}/AppData/Local/Temp/claude/C--Consonance-instances-third-place`, DESK];
out.kept = KEPT.map((k) => ({ kept: k, inList: all.filter((a) => a.p === norm(k) || a.p.startsWith(norm(k) + '/') || norm(k).startsWith(a.p + '/')).map((a) => `${a.g}:${a.p}`) }));
// every P tree registered now, and every worktree registered now that is in no list and not kept (for the record of what is left)
out.liveTreesNow = wtl.map((w) => w.worktree).filter((p) => !all.some((a) => a.p === norm(p)) && !KEPT.some((k) => norm(k) === norm(p)));

fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log('checks done', out.at, 'priority', out.priority);
