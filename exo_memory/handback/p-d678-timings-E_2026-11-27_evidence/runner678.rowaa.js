// runner678.js (pane E, D678 N3): B's d642run.js and sfrun.js (handback/p-l266-timings-B_2026-11-27_evidence/), one program for the three timings, plus drag-frame.
// One fresh node process a run, the whole test file, --test-concurrency=1, TAP kept; the two trees alternated, the first named first, N runs each.
// Differences from B's, each the order's: (1) HIS GAME STOPS THE SESSION (it does not wait): checked before every run and every 30 s during it by heavy-run's own rule
// (quiet678.js); a game found during a run ends my own test child (taskkill /T on its pid: my child and its Chrome, nothing else) and that run is not a sample; a process
// list that cannot be read counts as not clear. (2) Labels name the trees, so one commit can be run twice (the A/A). (3) drag-frame, which times under one heavy-run slot.
// sculpt-frame: before every run the other slot must be MY idle holder (its cmd says "held IDLE on purpose"), waited for up to 30 min, else the session stops; a run whose
// timed rows were skipped stops the session. <out>/done is written at the end however it ends, so an idle holder lets go.
// usage: node runner678.js <d642|sf|df> <out dir> <N> <label1>=<tree1> <label2>=<tree2> [<label3>=<tree3> <label4>=<tree4>]
// The row 9 A/A registration (after S7, at the librarian's ruling): FOUR trees make a round of two pairs, run in the order named (the A/A's pair, then the Even
// pair, each base first), N rounds. Before every round, the round must fit inside my hold's limit (holdage678.js); if it does not, the session stops at the last
// whole round and says so. Two trees: as before, with the same check.
'use strict';
const fs = require('fs'), path = require('path'), { spawn, spawnSync } = require('child_process');
const Q = require('./quiet678.js'), HA = require('./holdage678.js');
const [kind, out, nArg, ...pairs] = process.argv.slice(2), N = Number(nArg);
const FILE = { d642: 'app/test/core-extra-bank-drag-cost.test.js', sf: 'app/test/sculpt-frame.test.js', df: 'app/test/drag-frame.test.js' }[kind];
if (!FILE || !(N > 0) || ![2, 4].includes(pairs.length)) { console.error('usage: node runner678.js <d642|sf|df> <out dir> <N> <label1>=<tree1> <label2>=<tree2> [<label3>=<tree3> <label4>=<tree4>]'); process.exit(2); }
const trees = pairs.map((p) => { const i = p.indexOf('='); return [p.slice(0, i), p.slice(i + 1)]; });
const jl = path.join(out, `${kind}.jsonl`), done = path.join(out, 'done');
const log = (s) => { const l = `${new Date().toISOString()} ${s}`; console.log(l); fs.appendFileSync(path.join(out, `${kind}.log`), l + '\n'); };
const head = (d) => spawnSync('git', ['-C', d, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
const dirty = (d) => spawnSync('git', ['-C', d, 'status', '--short'], { encoding: 'utf8' }).stdout.trim().split(/\r?\n/).filter(Boolean).length;
function otherIsMyIdle() {
  const L = Q.locks(), slots = [L['heavy-run.lock'], L['heavy-run.2.lock']];
  const mine = slots.filter((s) => s && s.mine && s.alive).length, idle = slots.filter((s) => s && !s.mine && s.alive && /held IDLE on purpose/.test(s.cmd || '') && /^E D678 N3/.test(s.cmd || '')).length;
  return { ok: mine === 1 && idle === 1 && !L['heavy-run.3.lock'] && (!L['heavy-run.hold'] || /^E D678 N3/.test(L['heavy-run.hold'].cmd || '')), L };   // the chair's ruling (02:00:07Z): a sculpt-frame session now stands under MY exclusive hold
}
/** one run: the test file in `dir`, TAP to `tap`; polls his game every 30 s and ends MY child if one starts */
function runOnce(dir, tap) {
  return new Promise((resolve) => {
    const fd = fs.openSync(tap, 'w'), t0 = Date.now();
    const env = { ...process.env, CONSONANCE_DATA: Q.DATA };
    const c = spawn(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=tap', FILE], { cwd: dir, stdio: ['ignore', fd, fd], env, windowsHide: true });
    let game = null;
    const iv = setInterval(() => { const g = Q.games(); if (!g.ok && !game) { game = g.unreadable ? 'process list unreadable' : g.games.join(', '); spawnSync('taskkill', ['/PID', String(c.pid), '/T', '/F'], { windowsHide: true }); } }, 30000);
    c.on('exit', (code) => { clearInterval(iv); fs.closeSync(fd); resolve({ code, seconds: +((Date.now() - t0) / 1000).toFixed(1), t0, game }); });
  });
}
(async () => {
  try {
    log(`start ${kind}: ${trees.map(([l, d]) => `${l} = ${head(d).slice(0, 7)} (${dirty(d)} changes)`).join(' / ')}, ${N} runs each, alternated; my token ${process.env.CONSONANCE_HEAVY_RUN_TOKEN ? 'set' : 'NOT SET'}`);
    outer: for (let k = 1; k <= N; k++) for (const [label, dir] of trees) {
      if (label === trees[0][0]) {   // a round begins: it must fit inside my hold's limit (holdage678.js); no hold of mine stops the session, never a default
        let f; try { f = HA.roundFits(kind, HA.holdStarted(Q.DATA), Date.now(), trees.length); } catch (e) { log(`STOPPED before round ${k}: ${e.message}`); break outer; }
        if (!f.fits) { log(`STOPPED before round ${k}: my hold is ${f.ageMin} min old and the round needs up to ${f.needMin} min, past ${f.limitMin} (heavy-run ignores a hold at 90); ${k - 1} whole rounds kept`); break outer; }
      }
      const g = Q.games(); if (!g.ok) { log(`STOPPED before ${k} ${label}: ${g.unreadable ? 'the process list could not be read' : `his game runs (${g.games.join(', ')}); nothing closed`}`); break outer; }
      if (kind === 'sf') {
        let o = otherIsMyIdle(); const w0 = Date.now();
        while (!o.ok && Date.now() - w0 < 30 * 60000) { Q.sleepSync(5000); o = otherIsMyIdle(); }
        if (!o.ok) { log(`STOPPED before ${k} ${label}: the other slot is not my idle holder: ${JSON.stringify(o.L)}`); break outer; }
        if (Date.now() - w0 > 6000) log(`waited ${Math.round((Date.now() - w0) / 1000)} s for both slots to be mine before ${k} ${label}`);
      }
      const snap = Q.snapshot(), tap = path.join(out, `${kind}-${String(k).padStart(2, '0')}-${label}.tap`);
      const r = await runOnce(dir, tap);
      const text = fs.readFileSync(tap, 'utf8');
      const row = { timing: kind, k, label, sha: head(dir).slice(0, 7), start: new Date(r.t0).toISOString(), seconds: r.seconds, exit: r.code, game: r.game, snap };
      if (kind === 'd642') {
        const m = text.match(/rolling \(first drag\) p95 ([\d.]+) ms a move, early p95 ([\d.]+) ms: ([\d.]+) ×/);
        const line = (text.match(/^(not ok|ok) 1 - D642: dragging the extra bank back toward level[^\n]*/m) || [null])[0];
        Object.assign(row, { rolling: m ? +m[1] : null, early: m ? +m[2] : null, ratio: m ? +m[3] : null, bar: 2, verdict: line ? (line.startsWith('ok') ? 'pass' : 'fail') : 'no row 1' });
      } else {
        row.rows = [...text.matchAll(/^(not ok|ok) \d+ - (row \w+)[^\n]*/gm)].map((m) => ({ row: m[2], ok: m[1] === 'ok', skip: /# SKIP/.test(m[0]) }));
      }
      fs.appendFileSync(jl, JSON.stringify(row) + '\n');
      log(`${k} ${label} (${row.sha}): ${kind === 'd642' ? `ratio ${row.ratio} (rolling ${row.rolling}, early ${row.early}) ${row.verdict}` : row.rows.map((x) => `${x.row} ${x.skip ? 'SKIP' : x.ok ? 'ok' : 'FAIL'}`).join(', ')}; ${row.seconds} s; busy before ${snap.busyPct}%`);
      if (r.game) { log(`STOPPED during ${k} ${label}: ${r.game} found during the run; my test child was ended; this run is not a sample; nothing of his closed`); break outer; }
      if (kind !== 'd642' && row.rows.some((x) => x.skip && x.row !== 'row 5')) { log(`STOPPED: the timed rows were skipped at ${k} ${label} (its TAP says why)`); break outer; }
    }
    log('done');
  } catch (e) { log(`runner678 failed: ${e.stack}`); process.exitCode = 1; }
  finally { fs.writeFileSync(done, new Date().toISOString() + '\n'); }
})();
