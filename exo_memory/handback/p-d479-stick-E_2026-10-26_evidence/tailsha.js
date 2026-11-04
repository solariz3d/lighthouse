// tailsha.js (D479, pane E): READ-ONLY. Each pending tail the stick's ledger names, hashed (sha256) and compared with the ledger's tailSha.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = 'D:/consonance-L-20260911/consonance-tails', j = JSON.parse(fs.readFileSync(path.join(dir, 'ledger.json'), 'utf8'));
(async () => {
  for (const [sid, s] of Object.entries(j.seats)) {
    const p = s.pending; if (!p) { console.log(sid.slice(0, 8), 'no pending'); continue; }
    const h = crypto.createHash('sha256'), t0 = Date.now();
    await new Promise((res, rej) => fs.createReadStream(path.join(dir, p.tailFile), { flags: 'r', highWaterMark: 4 << 20 }).on('data', (b) => h.update(b)).on('end', res).on('error', rej));
    const got = h.digest('hex');
    console.log(`${s.seat.padEnd(14)} ${sid.slice(0, 8)} sha256 ${got.slice(0, 8)}… ledger ${p.tailSha.slice(0, 8)}… ${got === p.tailSha ? 'EQUAL' : 'DIFFERENT'} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
