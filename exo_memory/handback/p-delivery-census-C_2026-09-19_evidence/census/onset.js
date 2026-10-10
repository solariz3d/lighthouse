// Read-only. When did the composer suggestion switch from GREY (Rgb 153, which typed_only strips) to DIM
// (SGR 2 at Default fg, which vt100 0.15.2 cannot see)? For each log: every composer-parked suggestion draw,
// i.e. a cursor park at column 3 (ESC[r;3H) followed within the same write by suggestion text, in either style.
// Offsets are bracketed against deliveries whose offsets and times control2-run3 already established.
const fs = require('fs');
const CAP = 'C:/Consonance/data/captures/';
const LOGS = ['0c0c0c0a-0000-4000-8000-000000000a01', '0c0c0c0b-0000-4000-8000-00000000115b', 'a2122153-a37e-41a6-a86f-534267ec0565',
  '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f', '12fb81f6-f4c0-4ef8-aad8-f0cdce091925', '0845a868-38f2-4cc2-b45a-431e0c088fb1'];
const DIM = /\x1b\[\d+;3H\x1b\[\?25h\x1b\[\?25l\x1b\[0?m\x1b\[2m([^\x1b]{2,})/g;
const DIM2 = /\xe2\x9d\xaf(?: |\x1b\[1C)\x1b\[2m([^\x1b]{2,})/g;                                   // "❯ " then dim (E's form)
const GREY = /\x1b\[\d+;3H\x1b\[\?25h\x1b\[\?25l\x1b\[0?m\x1b\[38;2;153;153;153m([^\x1b]{2,})/g;
for (const l of LOGS) {
  const s = fs.readFileSync(CAP + l + '.log').toString('latin1');
  const hits = [];
  for (const [re, k] of [[DIM, 'dim'], [DIM2, 'dim'], [GREY, 'grey']]) for (const m of s.matchAll(re)) hits.push({ at: m.index, k, t: Buffer.from(m[1], 'latin1').toString('utf8').slice(0, 40) });
  hits.sort((a, b) => a.at - b.at);
  const dims = hits.filter((h) => h.k === 'dim'), greys = hits.filter((h) => h.k === 'grey');
  console.log(`\n${l.slice(0, 8)}  log ${s.length} B  dim draws ${dims.length}  grey draws ${greys.length}`);
  if (dims.length) console.log(`  first dim  @${dims[0].at}  "${dims[0].t}"   last dim @${dims[dims.length - 1].at}`);
  if (greys.length) console.log(`  first grey @${greys[0].at}  "${greys[0].t}"   last grey @${greys[greys.length - 1].at} "${greys[greys.length - 1].t}"`);
}
