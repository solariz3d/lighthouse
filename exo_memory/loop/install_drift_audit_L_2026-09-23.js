#!/usr/bin/env node
// install_drift_audit_L_2026-09-23.js — L103, pane A. READ-ONLY: reads the repo, git history, ~/.claude/shell and
// ~/.claude/settings.json; writes nothing but stdout (and throwaway files under the OS temp dir for git diff).
//
//   node exo_memory/loop/install_drift_audit_L_2026-09-23.js            # table
//   node exo_memory/loop/install_drift_audit_L_2026-09-23.js --diff     # plus a numstat of each content drift
//
// For each file install.ps1 -Check printed as DRIFT:
//   · raw sha256 of repo vs installed (what -Check compares, install.ps1:366 Get-FileHash)
//   · CRLF-normalised sha256 (\r\n -> \n, and a leading BOM stripped) — equal means line-ending/BOM-only drift
//   · which commit of the repo file the INSTALLED copy equals (normalised), searched over the file's whole git history;
//     NO MATCH means the installed copy holds content no commit ever had — a local edit an install would destroy
//   · commits to the repo file since that match
//   · whether settings.json registers it (exact resolved path of a hook command, never a substring — the 09-07
//     ready-stop.js / stop.js collision)
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const DEST = path.join(os.homedir(), '.claude', 'shell');
const SETTINGS = path.join(os.homedir(), '.claude', 'settings.json');
const DRIFT = [
  ['dev/shell/hooks/ready-stop.js', 'hooks/ready-stop.js'],
  ['dev/shell/hooks/ready-prompt.js', 'hooks/ready-prompt.js'],
  ['dev/shell/hooks/userprompt-submit.js', 'hooks/userprompt-submit.js'],
  ['dev/shell/hooks/stop.js', 'hooks/stop.js'],
  ['dev/shell/hooks/session-end.js', 'hooks/session-end.js'],
  ['dev/shell/hooks/l2-overseer.js', 'hooks/l2-overseer.js'],
  ['dev/shell/hooks/l3-overseer.js', 'hooks/l3-overseer.js'],
  ['consonance/hooks/blind.js', 'blind.js'],
  ['consonance/hooks/board-digest.js', 'board-digest.js'],
  ['consonance/hooks/transcript-watch.js', 'transcript-watch.js'],
];

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const norm = (b) => Buffer.from(b.toString('utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n'), 'utf8');
const crlfLines = (b) => (b.toString('utf8').match(/\r\n/g) || []).length;
const git = (...a) => execFileSync('git', a, { cwd: REPO, encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });

// Every hook command's resolved script path, from settings.json.
function registered() {
  const s = JSON.parse(fs.readFileSync(SETTINGS, 'utf8').replace(/^﻿/, ''));
  const out = [];
  for (const [event, groups] of Object.entries(s.hooks || {})) {
    for (const g of groups || []) for (const h of g.hooks || []) {
      const m = /([A-Za-z]:[\\/][^"]+?\.(?:js|py))/.exec(String(h.command || ''));
      if (m) out.push({ event, file: path.resolve(m[1]).toLowerCase() });
    }
  }
  return out;
}

function historyMatch(from, instNorm) {
  const shas = git('log', '--format=%H', '--follow', '--', from).toString().trim().split('\n').filter(Boolean);
  for (let i = 0; i < shas.length; i++) {
    let blob;
    try { blob = git('show', `${shas[i]}:${from}`); } catch { continue; }
    if (sha(norm(blob)) === sha(instNorm)) return { commit: shas[i], since: i, total: shas.length, newer: shas.slice(0, i) };
  }
  return { commit: null, since: null, total: shas.length, newer: [] };
}

const reg = registered();
const wantDiff = process.argv.includes('--diff');
for (const [from, to] of DRIFT) {
  const src = path.join(REPO, from), dst = path.join(DEST, to);
  const r = fs.readFileSync(src), d = fs.readFileSync(dst);
  const rn = norm(r), dn = norm(d);
  const events = reg.filter((x) => x.file === path.resolve(dst).toLowerCase()).map((x) => x.event);
  const row = {
    file: to,
    raw_equal: sha(r) === sha(d),
    norm_equal: sha(rn) === sha(dn),
    repo_crlf: crlfLines(r), inst_crlf: crlfLines(d),
    repo_bytes: r.length, inst_bytes: d.length,
    inst_mtime: fs.statSync(dst).mtime.toISOString(),
    registered: events.length ? events.join('+') : 'NO',
  };
  if (!row.norm_equal) {
    const h = historyMatch(from, dn);
    row.installed_is = h.commit ? `${h.commit.slice(0, 7)} (${h.since} commit(s) behind HEAD's version)` : 'NO COMMIT MATCHES — local content';
    row.newer = h.newer.map((c) => git('log', '-1', '--format=%h %ad %s', '--date=short', c).toString().trim().slice(0, 110));
    if (wantDiff) {
      const t = fs.mkdtempSync(path.join(os.tmpdir(), 'l103-'));
      fs.writeFileSync(path.join(t, 'repo'), rn); fs.writeFileSync(path.join(t, 'installed'), dn);
      let ns = '';
      try { ns = execFileSync('git', ['diff', '--no-index', '--numstat', path.join(t, 'installed'), path.join(t, 'repo')], { encoding: 'utf8' }); }
      catch (e) { ns = String(e.stdout || ''); }
      const m = /^(\d+)\s+(\d+)/.exec(ns.trim());
      row.diff_installed_to_repo = m ? `+${m[1]} −${m[2]}` : ns.trim();
    }
  }
  console.log(JSON.stringify(row));
}
