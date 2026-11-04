// dmpoom.js <dmp>...: the crash keys Chromium writes on a V8 out-of-memory (v8-oom-*), each with the value that follows it. Read-only.
'use strict';
const fs = require('fs');
for (const F of process.argv.slice(2)) {
  const b = fs.readFileSync(F);
  const strs = []; let cur = '', start = 0;
  for (let i = 0; i < b.length; i++) { const c = b[i]; if (c >= 32 && c < 127) { if (!cur) start = i; cur += String.fromCharCode(c); } else { if (cur.length >= 1) strs.push(cur); cur = ''; } }
  const keys = {};
  for (let i = 0; i < strs.length - 1; i++) if (/^v8-oom-|^v8_isolate/.test(strs[i]) && !keys[strs[i]]) { let v = strs[i + 1]; let j = i + 1; while (v.length < 2 && j < i + 4) v = strs[++j]; keys[strs[i]] = v.slice(0, 400); }
  console.log(`== ${require('path').basename(F)}`);
  for (const k of Object.keys(keys).sort()) if (/stack|heap|old-space|large|size|limit|allocated|external|reason|detail|isolate/.test(k)) console.log(`  ${k} = ${keys[k]}`);
}
