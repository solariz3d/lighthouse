// cmp258.js: base against tip, per track, from tracks258.js's two outputs. usage: node cmp258.js <base.json> <tip.json>
'use strict';
const [b, t] = process.argv.slice(2).map((f) => require(require('path').resolve(f)));
const pick = (r) => r.open && r.open.bad ? { bad: r.open.bad } : { serSha: r.open.serSha, stable: r.open.stable, sameBytes: r.open.sameBytes, schema: r.open.schema, opened: r.shell && r.shell.opened, undoDepth: r.shell && r.shell.undoDepth,
  openMsg: r.shell && r.shell.message, savedSha: r.shell && r.shell.savedSha, savedEqSer: r.shell && r.shell.savedEqSer, sidecarSame: r.shell && r.shell.sidecarSame, sidecarSha: r.shell && r.shell.sidecarSha,
  shown: r.panel && r.panel.shownBank, head: r.panel && r.panel.headBankDeg, opts: r.panel && r.panel.optionsSha, laid: r.typed && r.typed.laid, typedHead: r.typed && r.typed.headBankDeg, doc: r.typed && r.typed.docSha, msg: r.typed && r.typed.message, err: r.panelError || r.error };
let same = 0; const diff = [];
for (const rb of b.tracks) { const rt = t.tracks.find((x) => x.track === rb.track), pb = pick(rb), pt = pick(rt); const keys = Object.keys({ ...pb, ...pt }).filter((k) => JSON.stringify(pb[k]) !== JSON.stringify(pt[k]));
  const tag = pb.bad ? `BAD ${pb.bad}` : `schema ${pb.schema} sameBytes ${pb.sameBytes} stable ${pb.stable} savedEqSer ${pb.savedEqSer} sidecar ${pb.sidecarSame} undo ${pb.undoDepth} shown ${pb.shown} head ${pb.head} laid ${pb.laid}${pb.err ? ' ERR ' + pb.err : ''}`;
  if (!keys.length) same++; else diff.push(rb.track);
  console.log(`${rb.track}  ${keys.length ? 'DIFFERS in ' + keys.join(',') : 'same'}  | ${tag}`);
  for (const k of keys) console.log(`     ${k}: base ${JSON.stringify(pb[k])}  tip ${JSON.stringify(pt[k])}`); }
console.log(`${b.head} vs ${t.head}: ${b.tracks.length} tracks, ${same} the same in every field, ${diff.length} differ (${diff.join(' ')})`);
