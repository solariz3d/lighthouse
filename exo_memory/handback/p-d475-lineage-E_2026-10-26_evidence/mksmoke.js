// mksmoke.js (D475, pane E): the dream cycle's lineage block, verbatim, in a small script with a Log that prints and a -RipOverride for the failure case
'use strict';
const fs = require('fs');
const repo = 'C:/Users/nname/Desktop/worktrees/lh-d475-e';
const s = fs.readFileSync(repo + '/dev/dream/dream_cycle.ps1', 'utf8');
const a = s.indexOf('if (-not $NoLineage) {'), b = s.indexOf('# Guard 2:');
if (a < 0 || b < a) throw new Error('block not found');
const blk = s.slice(a, b);
const line = "$rip = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'consonance\\tools\\lineage-rip.js'";
if (blk.split(line).length !== 2) throw new Error('rip line not found');
const body = blk.replace(line, () => `$rip = if ($RipOverride) { $RipOverride } else { '${repo}/consonance/tools/lineage-rip.js' }`);
const head = 'param([switch]$NoLineage, [string]$RipOverride)\n$ErrorActionPreference = "Stop"\nfunction Log([string]$msg) { Write-Output ("LOG  " + $msg) }\n';
fs.writeFileSync(process.argv[2], '\ufeff' + head + body + 'Write-Output "after the block: the cycle goes on"\n');
console.log('smoke written');
