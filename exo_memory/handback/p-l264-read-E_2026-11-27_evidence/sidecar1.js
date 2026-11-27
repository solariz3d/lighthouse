// sidecar1.js: the first undo sidecar (name order) and its track, in two copy sets: does the sidecar's present match the track text byte for byte? No names printed.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const h8 = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 8);
for (const dir of process.argv.slice(2)) {
  const u = fs.readdirSync(dir).filter((f) => f.endsWith('.t180undo')).sort()[0], t = u.replace(/\.t180undo$/, '.t180track');
  const U = JSON.parse(fs.readFileSync(path.join(dir, u), 'utf8')), T = fs.readFileSync(path.join(dir, t), 'utf8');
  const st = (f) => fs.statSync(path.join(dir, f)).mtime.toISOString().slice(0, 19) + 'Z';
  console.log(JSON.stringify({ set: path.basename(path.dirname(dir)) + '/' + path.basename(dir), trackBytes: T.length, trackSha: h8(T), trackMtime: st(t), sidecarMtime: st(u), past: (U.past || []).length,
    presentEqualsTrack: U.present === T, presentBytes: U.present.length, presentSha: h8(U.present), trackSchema: (/"schema"\s*:\s*"([^"]*)"/.exec(T) || [])[1], presentSchema: (/"schema"\s*:\s*"([^"]*)"/.exec(U.present) || [])[1] }));
}
