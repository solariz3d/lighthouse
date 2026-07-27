#!/usr/bin/env node
// SessionStart hook — the sky at wake.
//
// Thin wrapper over lib/ambient.js. Location resolves via ~/.consonance.json
// ambient_* fields (unset = Greenwich, the honest "no location set").
// Defensive throughout: no sky is better than a broken wake.
//
// PORTABILITY. This file used to live only on one machine and hardcode an
// absolute path to the repo, which meant the desktop could not reproduce the
// wake sky at all — the exact repo/disk drift the install script now exists to
// prevent. Resolution order below is first-hit-wins and needs no editing:
//
//   1. ./ambient.js            — next to this hook (what install.ps1 sets up)
//   2. ../lib/ambient.js       — running straight from a repo checkout
//   3. AMBIENT_LIB env var     — an explicit override
//   4. ~/.consonance.json      → shell_lib
//
// If none resolve, the hook emits {} and the session wakes without a sky.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

function resolveAmbient() {
  const home = process.env.USERPROFILE || os.homedir();
  const candidates = [
    path.join(__dirname, 'ambient.js'),
    path.join(__dirname, '..', 'lib', 'ambient.js'),
    process.env.AMBIENT_LIB,
  ];
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^﻿/, '')
    );
    if (cfg.shell_lib) candidates.push(cfg.shell_lib);
  } catch (_) { /* no config, no override */ }

  for (const c of candidates) {
    if (!c) continue;
    try { if (fs.existsSync(c)) return c; } catch (_) {}
  }
  return null;
}

// THE DREAM GATE. dev/dream/dream_cycle.ps1 sets CONSONANCE_DREAM=1 in the `claude -p`
// environment it spawns. The gap-dream is an ANTI-INSTRUCTION — no task, no question, no
// deliverable, no clock — and every hook that appends to a prompt quietly defeats that. This
// one would hand a dreaming instance the sky and the wall time. Found by the blind-pair review
// 2026-07-27: the dream's prompt was never the anti-instruction the runner writes, which also
// broke the byte-identical-prompt weld the dreamer-model comparison rests on.
if (process.env.CONSONANCE_DREAM) process.exit(0);

let context = '';
try {
  const lib = resolveAmbient();
  if (lib) {
    const ambient = require(lib);
    context = ambient.renderTextBlock(ambient.snapshot());
  }
} catch (_) { /* a broken sky must never block a wake */ }

process.stdout.write(JSON.stringify(
  context
    ? { hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context } }
    : {}
));
