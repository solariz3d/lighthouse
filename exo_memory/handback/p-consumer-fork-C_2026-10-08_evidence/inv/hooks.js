// hooks.js <settings.json> <transcript.jsonl>: the registered hooks, and the hook texts a seat actually received in a transcript (D277, C).
'use strict';
const fs = require('fs');
const [settings, transcript] = process.argv.slice(2);
const s = JSON.parse(fs.readFileSync(settings, 'utf8'));
console.log('REGISTERED');
for (const [ev, arr] of Object.entries(s.hooks || {})) for (const g of arr) for (const h of g.hooks || []) {
  const m = String(h.command).match(/"([^"]+\.(?:js|py|ps1))"/g) || [];
  console.log(' ', ev.padEnd(17), (g.matcher || '-').padEnd(30).slice(0, 30), m.map((x) => x.replace(/"/g, '').replace(/.*[\\/]/, '')).join(' '));
}
// the injected texts in the transcript: attachments / system-reminder hook content, by kind, with sizes
const kinds = new Map();
for (const line of fs.readFileSync(transcript, 'utf8').split('\n')) {
  if (!line) continue; let o; try { o = JSON.parse(line); } catch (_) { continue; }
  const a = o.attachment || (o.type === 'attachment' ? o : null);
  const txt = JSON.stringify(o);
  for (const k of ['hook_additional_context', 'hookAdditionalContext', 'additionalContext', 'hook_success', 'hook_blocking_error', 'hook_non_blocking_error', 'hookEvent']) {
    if (txt.includes(k)) { const e = kinds.get(k) || { n: 0, bytes: 0, sample: '' }; e.n++; e.bytes += txt.length; if (!e.sample) e.sample = txt.slice(0, 300); kinds.set(k, e); }
  }
  if (a && a.type) { const k = 'attachment:' + a.type; const e = kinds.get(k) || { n: 0, bytes: 0, sample: '' }; e.n++; e.bytes += txt.length; if (!e.sample) e.sample = txt.slice(0, 400); kinds.set(k, e); }
}
console.log('\nTRANSCRIPT ENTRY KINDS (hook-related)');
for (const [k, e] of kinds) console.log(' ', k.padEnd(40), 'n', e.n, 'bytes', e.bytes, '\n    ', e.sample.replace(/\s+/g, ' ').slice(0, 300));
