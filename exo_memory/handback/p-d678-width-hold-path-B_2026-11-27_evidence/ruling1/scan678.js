// scan678.js (pane B): the credential scan in node (grep crashed to an empty count on 2026-11-27): token, key and password patterns, the git identity's
// email local part (read from stdin, never printed), and "keeper" (commit messages only: pass them after --msg). Prints counts only; an unread local part
// stops the scan. usage: git config user.email | node scan678.js <file>... [--msg <file>...]
'use strict';
const fs = require('fs');
const args = process.argv.slice(2), at = args.indexOf('--msg');
const files = at < 0 ? args : args.slice(0, at), msgs = at < 0 ? [] : args.slice(at + 1);
const lp = fs.readFileSync(0, 'utf8').trim().split('@')[0].toLowerCase();
if (lp.length < 3) { console.error('the email local part was not read; scan NOT RUN'); process.exit(1); }
const re = /ghp_|gho_|github_pat_|sk-[a-z0-9]{10}|AKIA[0-9A-Z]{12}|-----BEGIN|password|passwd|secret|api[_-]?key|bearer |\btoken\b/gi;
let cred = 0, local = 0, keeper = 0;
for (const f of [...files, ...msgs]) { const s = fs.readFileSync(f, 'utf8'); cred += (s.match(re) || []).length; local += s.toLowerCase().split(lp).length - 1; }
for (const f of msgs) keeper += (fs.readFileSync(f, 'utf8').match(/keeper/gi) || []).length;
console.log(`credential patterns ${cred}; email local part ${local}; "keeper" in the messages ${keeper}`);
