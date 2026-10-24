// tables.js: turns inv12.json + inv345.json + names.json (and a few read-only walks) into the D450 hand-back's tables (tables.md) and totals.
// The verdicts are rules written here, each beside the row kind it applies to; the hand-back states them.
'use strict';
const fs = require('fs'), path = require('path');
const { walk } = require('./walk.js');
const A = require('./inv12.json'), B = require('./inv345.json'), N = Object.fromEntries(require('./names.json').map((n) => [n.name, n]));
const GB = (b) => (b / 2 ** 30).toFixed(2), MB = (b) => (b / 2 ** 20).toFixed(1);
const L = [], T = {};
const add = (k, v, b) => { const t = T[k] || (T[k] = {}); t[v] = (t[v] || 0) + b; };
const row = (...c) => L.push('| ' + c.join(' | ') + ' |');

// ---- item 1
const LIVE1 = {
  't180-track-builder': 'main checkout; branch docs/readme-0.4x has 1 unlanded README commit (e59991e)',
  't180-wt-land418': "A's 0.4.18 landing (chair)", 't180-wt-e43': 'D402, until A merges it (chair)',
  't180-wt-o18': 'D447 (chair)', 't180-wt-o19-before': 'D447 (O, born 10-24)', 't180-wt-o20-83eaf20': 'D447 (O)', 't180-wt-o21-2c13316': 'D447 (O)', 't180-wt-o22-f2459fe': 'D447 (O)',
  't180-wt-p447': "D447, P's review", 't180-wt-p447f': "D447, P's review", 't180-wt-p447g': "D447, P's review", 't180-wt-p447h': "D447, P's review", 't180-wt-p402': "D402, P's review",
  't180-wt-a29': 'D407b PARKED: d407b-a 4becdd5, 4 commits not landed, a resume item (librarian 2026-10-18 01:33)',
};
const NOTE1 = {
  't180-wt-a33': 'patch landed by another commit (git cherry: 0 unlanded)', 't180-wt-a35': 'integration only, "not to land"', 't180-wt-o2': 'integration only, "not to land"',
  't180-wt-e28': 'measurement merge, 0 unlanded patches', 't180-wt-e33': 'measurement merge, 0 unlanded patches',
  't180-wt-e23': 'd403-a: both commits landed as cherry-picks via d403-on-0413 2ccee1e (map/E.md:2501); lap row D403 still open',
  't180-wt-e26': 'version-bump install build, "not a release"', 't180-wt-e29': 'version-bump install build', 't180-wt-e31': 'version-bump install build', 't180-wt-e34': 'version-bump install build',
  't180-wt-o6-scratch': 'a merge left in progress (MERGE_HEAD 3c870e3, in 0.4.17), nothing committed', 't180-wt-o10-kn5': 'merge in progress, MERGE_HEAD 3c870e3 in 0.4.17', 't180-wt-o11-kn5a': 'merge in progress, MERGE_HEAD 3c870e3 in 0.4.17', 't180-wt-o13-kn5': 'merge in progress, MERGE_HEAD 3c870e3 in 0.4.17',
};
L.push('### Item 1: the 80 registered worktrees of Downloads\\t180-track-builder', '', '| worktree | branch @ head | merged into | dirty | size MB | last write | links | verdict | note |', '|---|---|---|---|---|---|---|---|---|');
const del1 = [];
for (const w of A.worktrees) {
  const n = path.basename(w.path), live = LIVE1[n];
  const v = live ? 'ours-live' : 'ours-done';
  add('1', v, w.bytes);
  if (!live) del1.push({ n, b: w.bytes, dirty: w.dirty });
  row(n, `${w.branch} @ ${w.head}`, (w.mergedInto || 'no').replace('refs/heads/', ''), w.dirty, MB(w.bytes), w.newest, w.links.length, v, live || NOTE1[n] || '');
}
// ---- item 2
const LIVE2 = { 't180-d402-e': 'D402 evidence, until A merges it', 't180-archive': 'the D420 backup bundle (keep: it is the backup)' };
const KEEP2 = { 't180-tutorial': 'TREATMENT.md draft of a tutorial video, no author named and 0 record mentions: ask', 't180-handoff': 'CATCH-UP.md, the 10-15 handoff' };
L.push('', '### Item 2: the 77 t180-* entries in Downloads that are not worktrees of that repo', '', '| entry | kind | what it holds | size MB | last write | record mentions (newest) | verdict |', '|---|---|---|---|---|---|---|');
const del2 = [];
for (const o of A.others) {
  const m = N[o.name] || { count: 0, newest: '' };
  let v = LIVE2[o.name] ? 'ours-live' : KEEP2[o.name] ? 'ask' : 'ours-done';
  let what = o.git ? `WORKTREE OF Desktop\\t180-track-builder (${o.branch} @ ${String(o.head).slice(0, 7)}, merged ${String(o.inMain).replace('refs/heads/', '')})` : (o.top || '').split(' ').slice(0, 6).join(' ');
  if (o.git) v = "ours-done, but registered in the Desktop repo";
  add('2', v, o.bytes);
  if (v === 'ours-done') del2.push({ n: o.name, b: o.bytes, cited: m.count });
  row(o.name, o.kind, what, MB(o.bytes), o.newest, `${m.count}${m.newest ? ' (' + m.newest + ')' : ''}`, v + (LIVE2[o.name] || KEEP2[o.name] ? ': ' + (LIVE2[o.name] || KEEP2[o.name]) : ''));
}
// ---- item 3: per instance, per session
L.push('', '### Item 3: scratchpads under %LOCALAPPDATA%\\Temp\\claude', '', '| instance folder | sessions | size MB | last write | verdict |', '|---|---|---|---|---|');
const CL = 'C:/Users/nname/AppData/Local/Temp/claude', TODAY = '2026-10-24';
const del3 = [];
for (const s of B.scratch.sort((a, b) => b.bytes - a.bytes)) {
  if (s.bytes < 1 << 20) { add('3', 'tiny (<1 MB each)', s.bytes); continue; }
  const p = path.join(CL, s.name);
  let old = 0, oldN = 0;
  if (fs.statSync(p).isDirectory()) for (const d of fs.readdirSync(p)) { const w = walk(path.join(p, d)); if (w.newest && w.newest.slice(0, 10) < TODAY) { old += w.bytes; oldN++; } }
  const v = (/third-place/.test(s.name) ? 'the Third Place seat: size only, never opened; ' : '') + (s.newest.slice(0, 10) >= TODAY ? `ours-live: one live session holds it all (its other ${s.sessions - 1} session folders are empty)` : 'ours-done');
  add('3', 'all', s.bytes); if (old) del3.push({ n: s.name, b: old, oldN });
  row(s.name, s.sessions, MB(s.bytes), s.newest, v);
}
row('(' + B.scratch.filter((s) => s.bytes < 1 << 20).length + ' more, each under 1 MB)', '', MB(T['3']['tiny (<1 MB each)'] || 0), '', 'ours-done');
// ---- item 4
const ourTemp = (r) => /^t180/i.test(r.name) ? 't180 test temp dir (Chrome profile or tree copy)' : /^[a-z]\d{3,4}[a-z]+-[A-Za-z0-9]{6}$/i.test(r.name) ? 'lap-named temp dir (seat letter + lap)' : /^v\d{4}\.[A-Za-z0-9]{4}$/.test(r.name) ? 'lap-named temp dir' : /^scoped_dir\d+_\d+$/.test(r.name) ? 'Chrome scoped_dir' : /^puppeteer_dev/.test(r.name) ? 'puppeteer profile' : /^(d\d{3}|node-compile-cache)/i.test(r.name) ? 'ours by name' : '';
const groups = {};
for (const r of B.temp) { const k = ourTemp(r) || 'not ours by evidence'; const g = groups[k] || (groups[k] = { n: 0, b: 0, live: 0, liveB: 0, old: '9', nw: '' }); g.n++; g.b += r.bytes || 0; const live = (r.newest || '') >= '2026-10-24T13:45Z'; if (live && k !== 'not ours by evidence') { g.live++; g.liveB += r.bytes || 0; } if (r.newest && r.newest < g.old) g.old = r.newest; if ((r.newest || '') > g.nw) g.nw = r.newest; }
L.push('', '### Item 4: %TEMP% (C:\\Users\\nname\\AppData\\Local\\Temp), top-level entries, claude\\ excluded', '', '| kind | entries | size MB | oldest .. newest write | of which written since 13:45Z today (a run going now) | verdict |', '|---|---|---|---|---|---|');
for (const [k, g] of Object.entries(groups).sort((a, b) => b[1].b - a[1].b)) { add('4', k === 'not ours by evidence' ? 'not ours' : 'ours', g.b); row(k, g.n, MB(g.b), `${g.old} .. ${g.nw}`, `${g.live} (${MB(g.liveB)} MB)`, k === 'not ours by evidence' ? 'leave (other software: VS installer cache 2ktw2hl1 1985 MB, an app\'s uuid .tmp* cache, LWSDebugOut.txt, Razer, Adobe)' : 'ours-done, except the live ones'); }
const del4 = B.temp.filter((r) => ourTemp(r) && (r.newest || '') < '2026-10-24T13:45Z');
// ---- item 5
L.push('', '### Item 5: fake AC roots and exported tracks outside a scratchpad', '', 'Fake AC roots at a drive root (C:, D:, E:, F:, G: `fake*`): **none**.', '', '| folder | size MB | last write | verdict |', '|---|---|---|---|');
const del5 = [];
const tv = (d) => /Desktop\/(Assetto tracks|Zunubia|Miandros|hazenloop|City Rush|ThunderHead|thunderhead|logendammring|content\/)/.test(d) ? 'his' : /Documents\/t180b_untitled/.test(d) ? 'his folder, ours-made: a C run exported it there by accident on 09-27 (p-d170-bvh-fix-C_2026-09-27.md:36); his call' : /Documents\/Assetto Corsa/.test(d) ? 'his AC user folder; who wrote it is not in the record I searched; his' : /Documents\//.test(d) ? 'his (0 record mentions)' : /p-d447-O/.test(d) ? 'ours-live (D447)' : 'ours-done';
const trk = new Map();
for (const t of B.tracks) { const top = t.dir.replace(/\/ui$/, ''); if (!trk.has(top)) trk.set(top, t); }
const sum5 = {};
for (const [d, t] of trk) { const v = tv(d); const grp = /p-d447-O.*fakeac/.test(d) ? 'lighthouse p-d447-O evidence fakeac/ (21 exported tracks)' : null; if (grp) { const g = sum5[grp] || (sum5[grp] = { b: 0, nw: '' }); g.b += t.bytes; if (t.newest > g.nw) g.nw = t.newest; continue; } add('5', v.split(' ')[0].replace(/[;:,]$/, ''), t.bytes); if (v === 'ours-done') del5.push({ n: d, b: t.bytes }); row(d.replace('C:/Users/nname/', '~/'), MB(t.bytes), t.newest, v); }
for (const [g, x] of Object.entries(sum5)) { add('5', 'ours-live', x.b); row(g, MB(x.b), x.nw, 'ours-live (D447); untracked in the PUBLIC lighthouse repo: must never be committed'); }
for (const z of ['ELYSIUM (T-180 track).before-d364.zip', 'ELYSIUM (T-180 track).before-scifi.zip']) { const s = fs.statSync('C:/Users/nname/Desktop/' + z); add('5', 'his', s.size); row('~/Desktop/' + z, MB(s.size), s.mtime.toISOString().slice(0, 16) + 'Z', 'his folder; a backup of his zip that we made (plan_t180_handoff_2026-10-15.md:1583, :1869): his call'); }
const BUILD = 'C:/build';
let bsum = 0; const del5b = [];
for (const d of fs.readdirSync(BUILD)) { const w = walk(path.join(BUILD, d)); bsum += w.bytes; del5b.push({ n: 'C:/build/' + d, b: w.bytes }); }
add('5', 'ours-done (C:\\build)', bsum);
row('C:/build/* (7 cargo target dirs, a-d098 .. b-d170, Sep 21-27)', MB(bsum), '2026-09-27', 'ours-done (other leftover: our cargo builds)');
// ---- item 6
const LH = 'C:/Users/nname/Desktop/lighthouse';
L.push('', '### Item 6: untracked files in the shared lighthouse checkout', '', '| path | files | size MB | of which .kn5 / track folders MB | sorted | note |', '|---|---|---|---|---|---|');
const UNTR = ['p-d424-landing-O_2026-10-22_evidence/rerun', 'p-d431-review-P_2026-10-22_evidence', 'p-d433-P_2026-10-22_evidence', 'p-d434-O_2026-10-22_evidence/tracks', 'p-d436-P_2026-10-22_evidence', 'p-d437-P_2026-10-22_evidence', 'p-d437b-B_2026-10-22_evidence', 'p-d438-O_2026-10-22_evidence/tracks', 'p-d438-build-O_2026-10-22_evidence/tracks', 'p-d439-O_2026-10-23_evidence/tracks', 'p-d447-O_2026-10-23_evidence/fakeac'];
const kn5Bytes = (p) => { let b = 0; const st = [p]; while (st.length) { const d = st.pop(); for (const e of fs.readdirSync(d, { withFileTypes: true })) { const q = path.join(d, e.name); if (e.isDirectory()) st.push(q); else if (/\.(kn5|bin|ini|dds|png|json|zip)$/i.test(e.name) && /t180b_|tracks|fakeac|out/.test(q)) b += fs.statSync(q).size; } } return b; };
for (const u of UNTR) {
  const p = path.join(LH, 'exo_memory/handback', u), w = walk(p), k = /tracks|fakeac/.test(u) ? w.bytes : kn5Bytes(p);
  const s = /tracks|fakeac/.test(u) ? 'other: exported tracks, not to commit' : 'hand-back evidence to commit' + (k > 1 << 20 ? ', without its exported track' : '');
  add('6', s.startsWith('other') ? 'other' : 'commit', w.bytes);
  row('exo_memory/handback/' + u + '/', w.files, MB(w.bytes), MB(k), s, /p-d447/.test(u) ? 'ours-live (D447)' : '');
}
for (const f of fs.readdirSync(path.join(LH, 'exo_memory/loop')).filter((f) => /^plan_(batch_041[567]|d43[0-8]|d446)/.test(f))) { const s = fs.statSync(path.join(LH, 'exo_memory/loop', f)); add('6', 'commit', s.size); }
row('exo_memory/loop/plan_*.md (12 plans, D430-D438, D446, batches 0.4.15-0.4.17)', 12, '0.1', '0', 'other: loop plans, to commit (the record)', '');
row('grep.exe.stackdump (repo root, 2026-10-20)', 1, '0.0', '0', 'other: a crash dump, to delete', '');
// ---- item 7
L.push('', '### Item 7: long-running processes we started that are not infrastructure', '', 'At 14:18Z: **none older than today**. Infrastructure, not counted: consonance.exe 18572 (10-21 20:31 local), stick-waiter node 21676 (10-21 20:31), world-sense node 29240 (10-21 20:32). Everything else of ours was started 07:52-08:18 local today by a seat working now:', '', '| pid | started (local) | command | whose |', '|---|---|---|---|');
for (const [p, t, c, o] of [[18812, '10-24 07:52', 'lockrun.js "A local-0.4.18 ful…" (and its node --test 9636 with children, Chrome headless 41368 / 38712 on t180snd-test / t180crisp profiles)', "A's 0.4.18 full suite"], [25772, '10-24 08:11', 'node run447o.js → node --test core_close_* 41868', 'O, D447'], [21724, '10-24 08:11', 'node run447p.js → copies-bytes.js 9068', 'P, D447'], [5836, '10-24 08:18', 'node inv345.js (exited)', 'this inventory']]) row(p, t, c, o);
// ---- item 8
L.push('', '### Item 8: t180 branches merged into local-0.4.17 or later with no worktree', '', '| branch | head | last commit | merged into |', '|---|---|---|---|');
const nm = (b) => b.name.replace(/^heads\//, '');   // refname:short prints heads/X where a tag X also exists (local-0.4.14..17 have both)
const used8 = new Set(A.worktrees.map((w) => w.branch));
const b8 = A.branches.filter((b) => !used8.has(nm(b)) && b.mergedInto);
for (const b of b8) row(b.name, b.sha, b.date.slice(0, 16), b.mergedInto.replace('refs/heads/', '') + (b.name === 'main' ? ' (keep: the default branch)' : ''));
const unm = A.branches.filter((b) => !used8.has(nm(b)) && !b.mergedInto);
L.push('', `Not merged and no worktree: ${unm.length ? unm.map((b) => b.name + ' ' + b.sha).join(', ') : 'none'}.`);
// ---- totals and delete list
const LHT = ['p-d433-P_2026-10-22_evidence/out', 'p-d433-P_2026-10-22_evidence/out-re', 'p-d434-O_2026-10-22_evidence/tracks', 'p-d438-O_2026-10-22_evidence/tracks', 'p-d438-build-O_2026-10-22_evidence/tracks', 'p-d439-O_2026-10-23_evidence/tracks'].map((u) => path.join(LH, 'exo_memory/handback', u));
fs.writeFileSync(path.join(__dirname, 'g6.paths'), LHT.join('\n') + '\n');
const sum = (a) => a.reduce((s, x) => s + x.b, 0);
const D = { '1 worktrees (ours-done, via git worktree remove)': sum(del1), '2 Downloads t180-* (ours-done, plain folders)': sum(del2), '4 %TEMP% dirs of ours, not written since 13:45Z': del4.reduce((s, r) => s + (r.bytes || 0), 0), '5 C:\\build cargo targets': bsum, '6 lighthouse exported-track evidence of filed laps': LHT.reduce((a, p) => a + walk(p).bytes, 0) };
fs.writeFileSync(path.join(__dirname, 'tables.md'), L.join('\n') + '\n');
fs.writeFileSync(path.join(__dirname, 'totals.json'), JSON.stringify({ T, D, del1: del1.map((x) => x.n), del2: del2.map((x) => x.n), del3, del4: del4.map((r) => r.name), b8: b8.map((b) => b.name), counts: { del1: del1.length, del2: del2.length, del4: del4.length, b8: b8.length } }, null, 1));
for (const [k, v] of Object.entries(T)) console.log('item', k, Object.entries(v).map(([a, b]) => `${a} ${GB(b)} GB`).join('; '));
for (const [k, v] of Object.entries(D)) console.log('DELETE', k, GB(v), 'GB');
console.log('DELETE total', GB(Object.values(D).reduce((a, b) => a + b, 0)), 'GB; counts', JSON.stringify({ del1: del1.length, del2: del2.length, del4: del4.length, b8: b8.length }));
