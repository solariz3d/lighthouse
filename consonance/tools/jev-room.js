#!/usr/bin/env node
/* jev-room.js — WHERE A JEV TOOL FINDS THINGS. L105, pane A, 2026-09-23.
 *
 * One resolver for every Jev tool (jev-judge, jev-shadow, jev-shadow-runner), so none of them reads a path relative to where
 * its own file happens to sit. That is what an installed or standalone copy breaks on: `__dirname/../..` is a checkout only
 * when the file is IN one. Three questions, each answered from config first, the checkout second, and LOUDLY when neither
 * answers:
 *   roomOf           — the checkout holding consonance/src-tauri/src/main.rs (the seat ids, the L2 hooks)
 *   dataDirOf        — Consonance's data dir (panes.json, letters.json)
 *   disciplineDirOf  — where METHOD.md and WELFARE.md are: the discipline the judged prompt carries
 * It requires nothing but node built-ins, so a copy of this one file works anywhere.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * WHERE THE ROOM IS — L099, 2026-09-23. The checkout that holds consonance/src-tauri/src/main.rs, tried in order:
 *   1. `repo` as given (the runner passes its own checkout), so the hooks and main.rs come from ONE tree;
 *   2. `room_path` in ~/.consonance.json (it is `<repo>/exo_memory/BOOT.md`, read the way jev-flags.js mainRsPath and
 *      the peer hooks read it) — the only way an INSTALLED copy, not inside a checkout, can find the room;
 *   3. the checkout this file sits in.
 * Before L099 only 1 and 3 existed, and a miss was a silent `catch`: an installed copy judged the roster alone and
 * dropped Main, the librarian and the Third Place with no line anywhere (L089's jev-flags bug, in its sibling).
 * MOVED HERE from jev-judge.js at L105, unchanged, so every Jev tool shares it. NOT required by jev-flags.js: that hook is
 * installed as ONE file, so a require from it is the path that breaks (L089). jev-flags.test.js pins the two to one answer.
 * `{ root, file, tier }` when found; `{ root: null, file: null, why }` naming every place tried, when not.
 */
function roomOf({ repo, home = os.homedir() } = {}) {
  const tried = [];
  const rsOf = (root) => path.join(root, 'consonance', 'src-tauri', 'src', 'main.rs');
  if (repo) {
    if (fs.existsSync(rsOf(repo))) return { root: repo, file: rsOf(repo), tier: 'the repo passed in' };
    tried.push(`the repo passed in (${repo}) holds no consonance/src-tauri/src/main.rs`);
  }
  let cfg = null;
  try {
    cfg = JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    tried.push(e && e.code === 'ENOENT' ? '~/.consonance.json does not exist' : '~/.consonance.json could not be read as JSON');
  }
  if (cfg) {
    const room = cfg.room_path != null ? String(cfg.room_path).trim() : '';
    if (room) {
      const root = path.dirname(path.dirname(room));
      if (fs.existsSync(rsOf(root))) return { root, file: rsOf(root), tier: '~/.consonance.json room_path' };
      tried.push(`room_path ${room} does not lead to consonance/src-tauri/src/main.rs`);
    } else {
      tried.push('~/.consonance.json has no room_path');
    }
  }
  const local = path.resolve(__dirname, '..', '..');
  if (local !== repo) {
    if (fs.existsSync(rsOf(local))) return { root: local, file: rsOf(local), tier: 'the checkout beside this file' };
    tried.push('no checkout beside this file');
  }
  return { root: null, file: null, why: tried.join('; ') };
}

/**
 * CONSONANCE_DATA, else ~/.consonance.json data_dir, else null — the same order as every other tool here. MOVED HERE from
 * jev-shadow-runner.js at L105; the one change is `home`, so a test can point it at a fixture instead of the real one.
 */
function dataDirOf(env = process.env, home = os.homedir()) {
  const e = String((env && env.CONSONANCE_DATA) || '').trim();
  if (e) return e;
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\uFEFF/, ''));
    return cfg && cfg.data_dir ? String(cfg.data_dir) : null;
  } catch { return null; }
}

/**
 * WHERE THE DISCIPLINE IS — METHOD.md (L2) and WELFARE.md (L3), at the room's root. L105: this replaces
 * `env.JEV_SHADOW_DISCIPLINE || path.resolve(__dirname, '..', '..')` in jev-shadow.js and jev-shadow-runner.js, which from an
 * installed copy named whatever directory the copy sat two levels under. Order: JEV_SHADOW_DISCIPLINE (non-blank), then the
 * room roomOf finds. `{ dir, tier }`, or `{ dir: null, why }` with the fix in it.
 */
function disciplineDirOf({ env = process.env, home = os.homedir(), repo } = {}) {
  const e = String((env && env.JEV_SHADOW_DISCIPLINE) || '').trim();
  if (e) return { dir: e, tier: 'JEV_SHADOW_DISCIPLINE' };
  const room = roomOf({ repo, home });
  if (room.root) return { dir: room.root, tier: `the room (${room.tier})` };
  return { dir: null, why: `cannot find the discipline dir (METHOD.md, WELFARE.md): JEV_SHADOW_DISCIPLINE is unset; ${room.why}. Fix: set room_path in ~/.consonance.json, or JEV_SHADOW_DISCIPLINE` };
}

module.exports = { roomOf, dataDirOf, disciplineDirOf };
