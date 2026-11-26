const o = require(require('path').join(process.argv[2], 'page_r.json'));
for (const p of o.picks) console.log(JSON.stringify({ alias: p.alias, ms: p.msUntilShown, picked: p.picked, kind: p.kind, triangles: p.triangles, readout: p.readout, longTasksMs: p.longTasksMs, frames: p.frames }));
console.log(JSON.stringify({ inLine: o.modeSwitch.inLine.readout, back: o.modeSwitch.backInRoad.readout, backKind: o.modeSwitch.backInRoad.kind, calls: o.modeSwitch.nativeCallsDuring, title: o.title, errors: o.errors }));
