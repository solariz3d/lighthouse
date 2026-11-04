// annot.js (D437, P): the printable strings of a minidump near its Crashpad annotations (ptype, v8-oom-*, oom-size, switches), read-only.
const fs = require('fs'); const b = fs.readFileSync(process.argv[2]); const strs = []; let st = -1;
for (let i = 0; i <= b.length; i++) { const c = i < b.length ? b[i] : 0; const ok = c >= 32 && c < 127; if (ok && st < 0) st = i; if (!ok && st >= 0) { if (i - st >= 3) strs.push({ at: st, s: b.toString('latin1', st, i) }); st = -1; } }
const keys = /^(ptype|pid|plat|prod|ver|channel|v8-oom|oom-size|num-switches|switch-|total-discardable|gpu-|browser|crash|lsb-release|osarch|blink|partition|renderer|field_trials|variations|bad_message|memory|commit|heap|webgl|gl_)/i;
const hits = strs.filter((x) => keys.test(x.s)); const windows = new Set();
for (const h of hits) { const k = Math.floor(h.at / 4096); windows.add(k); }
for (const k of [...windows].sort((a, b2) => a - b2)) { const lo = k * 4096, hi = lo + 4096; const w = strs.filter((x) => x.at >= lo && x.at < hi && x.s.length >= 3 && !/^[A-Za-z0-9+/=]{20,}$/.test(x.s)); if (w.length) { console.log(`--- window @${lo}`); console.log(w.map((x) => x.s).join(' | ').slice(0, 3000)); } }
