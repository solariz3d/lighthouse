// D301 wave 4: B's A2 lookup, run exactly as registered, with the queries committed in queries.md (25d25b26).
//   node lookup.js <repo> <units.json> > lookup.out
// For each unit and query: git grep -n -i -F at the sha before t_err (and, for day-start units, also at the
// sha before the correction: the librarian's note 2), Third Place excluded. Prints every hit, up to 40 per query,
// for judging by hand; the judging is in table.md, not here.
const cp = require('child_process'), fs = require('fs');
const [repo, unitsPath] = process.argv.slice(2);
const units = Object.fromEntries(JSON.parse(fs.readFileSync(unitsPath, 'utf8')).units.map((u) => [u.id, u]));
const Q = {
  W010: ['SleepInProgress', 'BugcheckCode 59', 'power lost while the machine was asleep'],
  W016: ['104,857,600', '100 MiB'], W018: ['C had already logged in'],
  W019: ['6 hooks fired', 'settings ARE the user file'], W020: ['03:22:23'], W023: ['Solid'],
  W026: ['stage-2 coder', 'stage 2 coder', 'stage-2 code'], W028: ['92 journals'],
  W029: ['114 daily digests', '06-10 is missing'], W033: ['55 / 65 / 95', '55/65/95'],
  W034: ['FRICTION=0.82', 'FRICTION = 0.82', 'tyre grip'], W036: ['corpus.corners', 'runs are fragments'],
  W038: ['ctx() is null', 'p-d195-E-lag'],
  W041: ['public community track', 'a track in the community', 'D262 CANCELLED'],
  W042: ['public community track', 'a track in the community', 'D262 CANCELLED'],
  W051: ['unconfirmed'], W064: ["os.getenv('HOME')", 'os.getenv("HOME")'], W080: ['replay artifact'],
  W082: ['was mid-turn'], W084: ['4 of 4 committee cwds exist'], W085: ['just use the repo'],
  W091: ['whether or not it were true', 'ASK-008', 'the truth as well cannot lose'], W096: ['357,388'],
  W097: ['phase noise', '±0.04'],
};
const grep = (sha, q) => {
  const r = cp.spawnSync('git', ['-C', repo, 'grep', '-n', '-i', '-F', '-e', q, sha, '--', '.', ':!exo_memory/third_place', ':!**/THIRD_PLACE.md'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status > 1) throw new Error(`git grep failed at ${sha}: ${r.stderr}`);
  return (r.stdout || '').split('\n').filter(Boolean);
};
for (const [id, qs] of Object.entries(Q)) {
  const u = units[id];
  const shas = [['t_err', u.sha_before_t_err_committer_date]];
  if (/^day-start/.test(u.t_err_basis) && u.sha_before_correction && u.sha_before_correction !== u.sha_before_t_err_committer_date) shas.push(['corr', u.sha_before_correction]);
  console.log(`\n##### ${id} t_err ${u.t_err} (${u.t_err_basis.slice(0, 20)})`);
  for (const [b, sha] of shas) for (const q of qs) {
    const hits = grep(sha, q);
    console.log(`--- ${id} [${b} ${sha}] "${q}": ${hits.length} hit(s)`);
    for (const h of hits.slice(0, 40)) console.log('   ' + h.replace(/^[0-9a-f]+:/, '').slice(0, 260));
  }
}
