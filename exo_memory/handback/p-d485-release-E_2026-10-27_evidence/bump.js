// bump.js (D485, pane E): 0.4.22 -> 0.4.23 in the three places the 0.4.22 bump changed, each exactly once; line endings kept
'use strict';
const fs = require('fs'), W = 'C:/Users/nname/Downloads/t180-wt-e485/src-tauri/';
const one = (f, from, to) => {
  const raw = fs.readFileSync(W + f, 'utf8');
  if (raw.split(from).length !== 2) throw new Error(`${f}: not exactly one ${JSON.stringify(from)}`);
  fs.writeFileSync(W + f, raw.replace(from, () => to)); console.log('bumped', f);
};
one('tauri.conf.json', '"version": "0.4.22",', '"version": "0.4.23",');
one('Cargo.toml', 'version = "0.4.22"', 'version = "0.4.23"');
const L = fs.readFileSync(W + 'Cargo.lock', 'utf8'), nl = L.includes('\r\n') ? '\r\n' : '\n';
const from = `name = "t180-track-builder"${nl}version = "0.4.22"`;
if (L.split(from).length !== 2) throw new Error('Cargo.lock: not exactly one t180-track-builder 0.4.22 entry');
fs.writeFileSync(W + 'Cargo.lock', L.replace(from, () => `name = "t180-track-builder"${nl}version = "0.4.23"`)); console.log('bumped Cargo.lock');
