// verdict.js (D450 verify, B): the PASS and FAIL lists, each path with its reason, from checks.json + walk.out + rmopen.out (all read-only
// outputs of this folder) and the hand judgments in JUDGED (each one says what it rests on). Prints markdown.
//   node verdict.js > verdict.md
'use strict';
const fs = require('fs');
const j = JSON.parse(fs.readFileSync(process.env.CK||'checks.json', 'utf8'));
const W = {}; for (const r of fs.readFileSync('walk.out', 'utf8').trim().split('\n').map(JSON.parse)) if (r.root) W[r.root.replace(/\\/g, '/').toLowerCase()] = r;
const R = {}; for (const r of fs.readFileSync('rmopen.out', 'utf8').trim().split('\n').map(JSON.parse)) R[r.path.toLowerCase()] = r;
const w = (p) => W[p.replace(/\\/g, '/').toLowerCase()];
const short = (p) => p.replace(/\\/g, '/').replace('C:/Users/nname/', '~/');
const OPENSET = new Set(j.openLaps.map((o) => o.lap));
// hand judgments: path suffix -> FAIL reason (each re-derived in this session; the hand-back gives the check beside each)
const JUDGED = {
  'Downloads/t180-d413': 'live tool: holds lockrun.js (the heavy-run lock wrapper) and tapmut.js; this verify\'s own runs call it (run.log, run2.log, run3.log)',
  'Downloads/t180-d358': 'holds the only record of the .before-scifi zip digest (HANDBACK_A.md:35); no exo_memory file carries it. Passes once the digests are recorded elsewhere (this hand-back records them)',
  'Downloads/t180-d364': 'holds the only record of the ELYSIUM and .before-d364 zip digests (HANDBACK_A.md:70-71); no exo_memory file carries them. Passes once recorded elsewhere (this hand-back records them)',
  ...(JSON.parse(fs.existsSync('board-judged.json') ? fs.readFileSync('board-judged.json', 'utf8') : '{}')),
};
const judged = (p) => { const k = Object.keys(JUDGED).find((s) => p.replace(/\\/g, '/').endsWith(s)); return k ? JUDGED[k] : null; };
const named = (n) => { const r = []; if (n.lapRows.length) r.push(`open-lap row names it (${n.lapRows.join(', ')})`); if (n.plansOpen.length) r.push(`plan under an open-lap heading names it (${[...new Set(n.plansOpen.map((p) => `${p.file}:${p.line} ${p.open.join('+')}`))].join('; ')})`); if (n.lapOfName.length) r.push(`its own lap is open (${n.lapOfName.join(', ')})`); return r; };
const PASS = [], FAIL = [];
const put = (grp, p, fails, okWhy) => { const x = w(p), bytes = x ? x.bytes : 0, links = x ? x.links.length : null; if (links) fails.push(`${links} junction/symlink inside`); if (x && !x.exists) fails.push('missing at walk time'); const jd = judged(p); if (jd) fails.push(jd); (fails.length ? FAIL : PASS).push({ grp, p: short(p), bytes, why: fails.length ? fails.join('; ') : okWhy }); };
const kept = new Set(j.kept.map((k) => k.kept.toLowerCase())), live = new Set(j.liveTreesNow.map((p) => p.toLowerCase()));
for (const r of j.g1) {
  const f = [];
  if (kept.has(r.path.toLowerCase()) || live.has(r.path.toLowerCase())) f.push('kept by ruling / live tree');
  if (!r.registered) f.push('not a registered worktree'); if (r.locked) f.push('locked');
  if (r.dirty.length) f.push(`not clean: ${r.dirty.length} entr${r.dirty.length > 1 ? 'ies' : 'y'} (${r.dirty.every((d) => d.startsWith('??')) ? 'untracked only: ' : ''}${r.dirty.slice(0, 3).map((d) => d.slice(3)).join(', ')}${r.dirty.length > 3 ? ', …' : ''})`);
  if (r.mergeHead) f.push('merge in progress (MERGE_HEAD)');
  if (!r.in17 && !r.in18 && r.cherryPlus !== 0) f.push(`head ${r.head.slice(0, 7)} not in 0.4.17/0.4.18 and git cherry shows ${r.cherryPlus} patch(es) not landed`);
  f.push(...named(r.named));
  put('G1', r.path, f, `clean, head ${r.head.slice(0, 7)} ${r.in17 ? 'in local-0.4.17' : r.in18 ? 'in local-0.4.18' : 'not an ancestor but git cherry 0'}, no open lap or plan names it, no link inside`);
}
for (const r of j.g2) { const f = named(r.named); if (r.registeredWorktree) f.push('a registered worktree'); put('G2', r.path, f, `${r.kind}${r.git ? '' : ', no .git'}; ${w(r.path) ? `${w(r.path).files} files, newest ${String(w(r.path).newest).slice(0, 10)}` : ''}; no open lap or plan names it`); }
for (const r of j.g4) {
  const f = [], o = R[r.path.toLowerCase()] || {};
  if (o.held) f.push(`open by ${o.held}`); if (o.cmdline) f.push(`named on a running command line: ${o.cmdline}`);
  if (r.uuid) f.push(`not shown ours: a uuid temp file (magic ${r.magic}${r.magic === 'Cr24' ? ', a Chrome extension package' : ''}), one of ~1,600 such in TEMP across every hex first letter (d=${j.uuidTmpInTemp.d}); C's regex /^(…|d\\d{3}|…)/ caught the d-ones by accident`);
  if (r.name === 'node-compile-cache') f.push('not shown ours: node\'s shared compile cache (any node on the machine writes it, Claude Code included)');
  const why = r.name.startsWith('scoped_dir') ? 'Chrome scoped extension-install dir left by a dead process (CRX_INSTALL tmp only), none open' : r.kind === 'dir' ? `ours by content (${(r.top || []).slice(0, 3).join(', ')}…), none of its files open` : r.mentionsOurs ? 'ours by content (names t180/test paths), not open' : r.size === 0 ? 'empty file, name of filed lap, not open' : 'ours by content (t180 test TAP read in this session), not open';
  put('G4', r.path, f, why);
}
{ const g = j.g5, f = []; if (g.env.CARGO_TARGET_DIR || g.regUser || g.regMachine) f.push('CARGO_TARGET_DIR points somewhere'); if (g.cargoConfigs.length) f.push(`cargo config target-dir: ${g.cargoConfigs.join(', ')}`); f.push(...named(g.named)); put('G5', g.path, f, `7 cargo target dirs of laps D098/D111/D164/D168/D169/D170 (none open); newest write ${String(w(g.path).newest).slice(0, 10)}; no CARGO_TARGET_DIR (env, HKCU, HKLM) and no cargo config names it`); }
for (const r of j.g6) { const f = []; if (r.lapState !== 'filed') f.push(`its lap ${r.lap} is open (${r.lapState})`); if (r.tracked) f.push(`${r.tracked} tracked file(s)`); put('G6', r.path, f, `untracked evidence copy, lap ${r.lap} filed`); }
for (const b of j.branches) (b.dWouldSucceed ? PASS : FAIL).push({ grp: 'branch', p: b.branch, bytes: 0, why: b.dWouldSucceed ? `${b.sha.slice(0, 7)} merged into HEAD (e59991e), not checked out: git branch -d succeeds` : `${b.sha.slice(0, 7)} is in local-0.4.17 but NOT merged into HEAD (${j.tips.headBranch.replace('refs/heads/', '')} @ ${j.tips['HEAD (main checkout)'].slice(0, 7)}), no upstream: git branch -d refuses ("not fully merged")${b.named.lapOfName.length ? `; its lap is open (${b.named.lapOfName.join(', ')})` : ''}` });
const h = j.his;
for (const k of ['t180b_untitled', 't180b_test_oval']) { const x = h[k], m = JSON.parse(x.marker || '{}'), names = x.files.map((s) => s.replace(/ \d+$/, '')), ok = m.tool === 't180-track-builder' && m.files.every((f) => names.includes(f)) && names.every((n) => n === '.t180b-builder.json' || m.files.includes(n)); put('his', x.path, ok ? [] : ['files do not match the builder marker'], `builder-made: .t180b-builder.json says tool t180-track-builder (${m.module}, written ${String(m.written).slice(0, 10)}), its 9 listed files are exactly the folder's files`); }
for (const r of h.desktopWorktrees) { const f = []; if (r.dirty.length) f.push('not clean'); if (!r.in17 && !r.in18) f.push('not merged'); f.push(...named(r.named)); put('his', r.path, f, `clean, head ${r.head.slice(0, 7)} (${r.branch}) in local-0.4.17, no open lap or plan names it`); }
const zips = h.zips.map((z) => `${z.k}: ${z.exists ? 'present' : 'MISSING'}, ${z.size} B, sha256 ${z.sha256} ${z.matches ? '= recorded' : '≠ recorded ' + z.recorded}`);
// keep-check: nothing kept appears in either list
const all = [...PASS, ...FAIL].map((x) => x.p.toLowerCase()); const keptHit = j.kept.filter((k) => all.includes(short(k.kept).toLowerCase()) && PASS.some((x) => x.p.toLowerCase() === short(k.kept).toLowerCase()));
const sum = (a) => a.reduce((s, x) => s + x.bytes, 0), gib = (b) => (b / 2 ** 30).toFixed(2);
const tbl = (a) => a.map((x) => `| ${x.grp} | \`${x.p}\` | ${x.bytes.toLocaleString('en')} | ${x.why} |`).join('\n');
const byGrp = (a) => ['G1', 'G2', 'G4', 'G5', 'G6', 'branch', 'his'].map((g) => { const s = a.filter((x) => x.grp === g); return `${g} ${s.length} (${gib(sum(s))} GiB)`; }).join(', ');
console.log(`checks.json at ${j.at}; walk.out and rmopen.out of run2 (19:37–19:43Z)\n`);
console.log(`PASS ${PASS.length} entries, ${sum(PASS).toLocaleString('en')} B apparent (${gib(sum(PASS))} GiB): ${byGrp(PASS)}`);
console.log(`FAIL ${FAIL.length} entries, ${sum(FAIL).toLocaleString('en')} B apparent (${gib(sum(FAIL))} GiB): ${byGrp(FAIL)}`);
console.log(`kept items in PASS: ${keptHit.length}\n\nzips (his item, kept): \n- ${zips.join('\n- ')}\n`);
console.log(`### PASS\n\n| group | path | bytes | reason |\n|---|---|---:|---|\n${tbl(PASS)}\n\n### FAIL\n\n| group | path | bytes | reason |\n|---|---|---:|---|\n${tbl(FAIL)}`);
