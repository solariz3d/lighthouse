// bump.js (D483, pane E): 0.4.21 -> 0.4.22 in the three places 0d53d4b changed, each exactly once; line endings kept
'use strict';
const fs = require('fs'), W = 'C:/Users/nname/Downloads/t180-wt-e483/src-tauri/';
const one = (f, from, to) => {
  const raw = fs.readFileSync(W + f, 'utf8');
  if (raw.split(from).length !== 2) throw new Error(`${f}: not exactly one ${JSON.stringify(from)}`);
  fs.writeFileSync(W + f, raw.replace(from, () => to)); console.log('bumped', f);
};
one('tauri.conf.json', '"version": "0.4.21",', '"version": "0.4.22",');
one('Cargo.toml', 'version = "0.4.21"', 'version = "0.4.22"');
// Cargo.lock: only t180-track-builder's own entry
const L = fs.readFileSync(W + 'Cargo.lock', 'utf8'), nl = L.includes('\r\n') ? '\r\n' : '\n';
const from = `name = "t180-track-builder"${nl}version = "0.4.21"`;
if (L.split(from).length !== 2) throw new Error('Cargo.lock: not exactly one t180-track-builder 0.4.21 entry');
fs.writeFileSync(W + 'Cargo.lock', L.replace(from, () => `name = "t180-track-builder"${nl}version = "0.4.22"`)); console.log('bumped Cargo.lock');
