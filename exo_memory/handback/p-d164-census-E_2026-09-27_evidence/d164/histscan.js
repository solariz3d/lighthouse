'use strict';
// D164 (pane E): count exact occurrences of the gateway key in EVERY blob of a repo's history (all refs), without the key
// ever touching argv, a file or stdout. The key comes from this process's environment only. Prints counts and blob/commit
// ids, never content.
const { spawn, execFileSync } = require('child_process');
const repo = process.argv[2];
const key = (process.env.AI_GATEWAY_API_KEY || '').trim();
if (!key || key.length < 20) { console.log('no key in process env — cannot scan'); process.exit(2); }
const keyBuf = Buffer.from(key, 'latin1');
const list = execFileSync('git', ['-C', repo, 'rev-list', '--all', '--objects'], { maxBuffer: 1 << 30 }).toString().trim().split('\n');
const ids = list.map((l) => l.split(' ')[0]);
const types = execFileSync('git', ['-C', repo, 'cat-file', '--batch-check'], { input: ids.join('\n') + '\n', maxBuffer: 1 << 30 }).toString().trim().split('\n');
const blobs = types.map((l) => l.split(' ')).filter((p) => p[1] === 'blob').map((p) => p[0]);
const pathOf = new Map(list.map((l) => { const i = l.indexOf(' '); return i > 0 ? [l.slice(0, i), l.slice(i + 1)] : [l, '']; }));
const cat = spawn('git', ['-C', repo, 'cat-file', '--batch']);
let buf = Buffer.alloc(0), hits = [], scanned = 0;
cat.stdout.on('data', (d) => {
  buf = Buffer.concat([buf, d]);
  for (;;) {
    const nl = buf.indexOf(10); if (nl < 0) return;
    const head = buf.slice(0, nl).toString().split(' '); const size = +head[2];
    if (buf.length < nl + 1 + size + 1) return;
    const body = buf.slice(nl + 1, nl + 1 + size);
    let c = 0, i = 0; while ((i = body.indexOf(keyBuf, i)) !== -1) { c++; i += keyBuf.length; }
    if (c) hits.push({ blob: head[0], path: pathOf.get(head[0]) || '?', count: c });
    scanned++; buf = buf.slice(nl + 1 + size + 1);
  }
});
cat.on('close', () => {
  console.log(repo, 'blobs scanned', scanned, 'of', blobs.length, 'blobs containing the key', hits.length, 'occurrences', hits.reduce((a, h) => a + h.count, 0));
  for (const h of hits.slice(0, 20)) console.log('   blob', h.blob.slice(0, 12), h.path, 'x' + h.count);
});
cat.stdin.end(blobs.join('\n') + '\n');
