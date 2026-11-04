#!/usr/bin/env node
'use strict';
// hr.js — D411 lock wrapper. `node hr.js -- <command ...>` takes the room's heavy-run lock
// (consonance/tools/heavy-run.js) and then runs the command as given, in the current directory.
// With CONSONANCE_HEAVY_SLOTS=1 in the environment every live lock blocks, so an arm's test run
// never overlaps another heavy run on this machine. Exit code is the command's.
const { spawnSync } = require('child_process');
const HR = 'C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js';
const i = process.argv.indexOf('--');
const args = process.argv.slice(i < 0 ? 2 : i + 1);
if (!args.length) { process.stderr.write('usage: node hr.js -- <command ...>\n'); process.exit(2); }
const cmd = args.join(' ');
require(HR).hold({ cmd: `${process.env.D411_LABEL || 'd411'}: ${cmd}` });
const r = spawnSync(cmd, { stdio: 'inherit', shell: true, windowsHide: true });
process.exit(r.status === null ? 1 : r.status);
