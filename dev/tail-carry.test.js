// tail-carry.test.js — run with: node dev/tail-carry.test.js
//
// WHAT THIS FILE IS GUARDING. The command it tests writes to a machine the person running it
// cannot see. The failure it exists to prevent is not a crash and not a lost byte — it is A CARRY
// THAT REPORTS SUCCESS OVER A FILE IN WHICH TWO FUTURES OF ONE CONVERSATION HAVE BEEN
// CONCATENATED. Every record in such a file parses; nothing anywhere reports an error; the seat
// wakes into a history that never happened.
//
// So the load-bearing test in here is `the literal bar-(2) check passes on a forked destination` —
// it builds the exact state the plan's own wording would have appended onto, shows the specified
// check returning "identical", and requires this tool to refuse. The spec hole is DEMONSTRATED,
// not argued.
//
// EVERY TEST RUNS AGAINST FIXTURES — two fake machines with their own projects roots, instances
// roots, rosters and a fake stick between them. Nothing here reads C:\Consonance, ~/.claude, or a
// real USB drive, and this file must pass identically on a machine that has none of them. The one
// exception is deliberate: `seats()` is pointed at the REAL main.rs, because the three fixed seats'
// ids live only there and a fixture copy of them would be a copy that can go stale silently.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

// THE ONE SEAM, AND IT BELONGS TO THE MUTATION HARNESS. `tail-carry.mutants.js` writes each mutant into
// a COPY beside the real file and points this suite at the copy through TAIL_CARRY_UNDER_TEST, so no run
// — killed or not — ever writes the tracked source (L059 §5: on this machine a kill runs no handler, so a
// restore-on-signal protects nothing). The copy must sit in THIS directory: the tool resolves
// `./place-conversations.js`, `../consonance/tools/state-sync.js` and main.rs relative to itself, and a
// copy anywhere else would test different code. Refused loudly otherwise; unset, nothing changes.
const TOOL = (() => {
  const u = process.env.TAIL_CARRY_UNDER_TEST;
  if (!u) return path.join(__dirname, 'tail-carry.js');
  const p = path.resolve(u);
  if (path.dirname(p) !== __dirname || !fs.existsSync(p)) {
    throw new Error(`TAIL_CARRY_UNDER_TEST must name an existing file in ${__dirname}; got ${u}`);
  }
  return p;
})();
const T = require(TOOL);
const sync = require(path.join(__dirname, '..', 'consonance', 'tools', 'state-sync.js'));
const place = require(path.join(__dirname, 'place-conversations.js'));

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tail-'));
let seq = 0;

const SID = 'aaaaaaaa-1111-4111-8111-111111111111';

/** Records shaped like the vendor's: a header with no timestamp, then timestamped turns. */
function head(sid) {
  return [
    JSON.stringify({ type: 'mode', mode: 'normal', sessionId: sid }),
    JSON.stringify({ type: 'permission-mode', permissionMode: 'bypassPermissions', sessionId: sid }),
  ].join('\n') + '\n';
}
function turns(sid, stamps, tag) {
  return stamps.map((ts, i) => JSON.stringify({
    type: i % 2 ? 'assistant' : 'user', sessionId: sid, timestamp: ts, uuid: `${tag || 'u'}${i}`,
  })).join('\n') + '\n';
}
const conversation = (sid, stamps, tag) => head(sid) + turns(sid, stamps, tag);

/**
 * A world: a fake stick and two fake machines, each with a projects root, an instances root and a
 * roster naming ONE pane. The fixed seats exist in the roster derivation but have no files unless
 * a test makes them, so most tests see a single seat and stay legible.
 */
function world(opts) {
  opts = opts || {};
  const dir = path.join(tmp, 'case' + (++seq));
  const stick = path.join(dir, 'stick');
  fs.mkdirSync(stick, { recursive: true });
  const mk = (tag) => {
    const root = path.join(dir, tag);
    const projectsRoot = path.join(root, 'projects');
    const instancesRoot = path.join(root, 'instances');
    const cwd = path.join(instancesRoot, 'sibling-x');
    fs.mkdirSync(projectsRoot, { recursive: true });
    const panesPath = path.join(root, 'panes.json');
    fs.writeFileSync(panesPath, JSON.stringify([{ pane: SID, cwd, label: 'x' }]));
    return { machine: tag, projectsRoot, instancesRoot, panesPath, cwd, stick,
      dest: place.paneJsonl(projectsRoot, cwd, SID) };
  };
  return { dir, stick, D: mk('D'), L: mk('L') };
}

function write(m, body) {
  fs.mkdirSync(path.dirname(m.dest), { recursive: true });
  fs.writeFileSync(m.dest, body);
  // Every fixture file is aged past the settle window, so no test is a race against SETTLE_MS.
  const old = new Date(Date.now() - 60_000);
  fs.utimesSync(m.dest, old, old);
  return m.dest;
}

const quiet = () => { const lines = []; return { out: (s) => lines.push(s), lines, text: () => lines.join('\n') }; };
function go(m, mode, extra) {
  const q = quiet();
  const r = T.run(Object.assign({ out: q.out, stick: m.stick, mode, machine: m.machine, appRunning: false,
    projectsRoot: m.projectsRoot, instancesRoot: m.instancesRoot, panesPath: m.panesPath }, extra || {}));
  r.text = q.text();
  return r;
}
const rowFor = (r, sid) => r.plan.rows.find((x) => x.sid === (sid || SID));

/** Where this fixture machine's attic keeps a seat — the shape `sync_launch::attic_for` writes. */
const atticDir = (m) => path.join(path.dirname(m.projectsRoot), 'consonance-attic', place.encodeCwd(m.cwd));
const ATTIC_NAME = (why) => new RegExp(`^${SID}\\.\\d{8}-\\d{6}-${why}(-\\d+)?\\.jsonl$`);
const inAttic = (m, why) => (fs.existsSync(atticDir(m)) ? fs.readdirSync(atticDir(m)) : [])
  .filter((f) => ATTIC_NAME(why).test(f));
/** Anything a retirement left beside the live transcript — which is exactly what must not exist now. */
const besideLive = (m) => fs.readdirSync(path.dirname(m.dest)).filter((f) => f !== path.basename(m.dest));

/** Every file under a root, with size, mtime and sha — the "nothing moved" instrument. */
function snapshot(root) {
  const out = {};
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else { const s = fs.statSync(p); out[p] = `${s.size}|${s.mtimeMs}|${T.sha256(fs.readFileSync(p))}`; }
    }
  };
  walk(root);
  return out;
}

console.log('tail-carry.test.js');

// ── the roster, derived from the app rather than typed ──

test('seats() parses the three fixed seats out of the REAL main.rs, plus the panes', () => {
  const w = world();
  const s = T.seats({ instancesRoot: w.D.instancesRoot, panesPath: w.D.panesPath });
  assert.ok(s.seats, s.why);
  const fixed = s.seats.filter((x) => x.kind === 'fixed');
  assert.strictEqual(fixed.length, 3, `expected 3 fixed seats, got ${fixed.map((f) => f.seat).join(',')}`);
  for (const f of fixed) assert.match(f.sid, /^[0-9a-f]{8}-/, `${f.seat} has no sid`);
  assert.strictEqual(new Set(fixed.map((f) => f.sid)).size, 3, 'two fixed seats share a sid');
  assert.deepStrictEqual(fixed.map((f) => path.basename(f.cwd)).sort(), ['librarian', 'main', 'third-place']);
  assert.strictEqual(s.seats.filter((x) => x.kind === 'pane').length, 1);
});

test('seats() REFUSES rather than returning a short list when main.rs stops declaring a seat', () => {
  const w = world();
  const fake = path.join(w.dir, 'main.rs');
  fs.writeFileSync(fake, 'const MAIN_SID: &str = "0c0c0c0a-0000-4000-8000-000000000a01";\n');
  const s = T.seats({ mainRs: fake, instancesRoot: w.D.instancesRoot, panesPath: w.D.panesPath });
  assert.strictEqual(s.seats, null);
  assert.match(s.why, /no longer declares the/);
});

// ── the key: identity of a conversation, not of a path ──

test('a FRESH file under the same sid has a byte-identical first record and a different key', () => {
  const w = world();
  const a = path.join(w.dir, 'a.jsonl'), b = path.join(w.dir, 'b.jsonl');
  fs.writeFileSync(a, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  fs.writeFileSync(b, conversation(SID, ['2026-09-12T04:05:00.000Z']));
  assert.strictEqual(fs.readFileSync(a).subarray(0, 60).toString(), fs.readFileSync(b).subarray(0, 60).toString(),
    'the fixture is pointless unless the FIRST record really is identical');
  assert.notStrictEqual(T.conversationKey(a).key, T.conversationKey(b).key);
});

test('conversationKey refuses a transcript with no timestamped record rather than keying on something weaker', () => {
  const w = world();
  const p = path.join(w.dir, 'nokey.jsonl');
  fs.writeFileSync(p, head(SID));
  const k = T.conversationKey(p);
  assert.strictEqual(k.key, null);
  assert.match(k.why, /no record carrying a "timestamp"/);
});

test('conversationKey never keys on a line it only half read', () => {
  const w = world();
  const p = path.join(w.dir, 'torn.jsonl');
  const body = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  fs.writeFileSync(p, body);
  // scan window ends mid-way through the only timestamped line
  const k = T.conversationKey(p, body.indexOf('timestamp') + 4);
  assert.strictEqual(k.key, null, 'a partial line must not become an identity');
});

test('a record that ENDS exactly at the scan window is not keyed on — a whole-looking line may not be whole', () => {
  const w = world();
  const p = path.join(w.dir, 'edge.jsonl');
  const body = conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']);
  fs.writeFileSync(p, body);
  // Cut the window at the exact byte after the first timestamped record's closing brace. The line
  // parses. It is still a line this read cannot know is complete, and the conservative answer —
  // refuse and let a wider read decide — is the one that cannot key two machines differently.
  const end = body.indexOf('\n', body.indexOf('timestamp')) ;
  const k = T.conversationKey(p, end);
  assert.strictEqual(k.key, null, 'a line the read stopped on is not evidence of anything');
  assert.strictEqual(T.conversationKey(p).key !== null, true, 'and the same file keys fine when read normally');
});

// ── the settle gate, reused rather than retyped ──

test('the settle gate uses state-sync\'s own constants, not copies of them', () => {
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.match(src, /sync\.STABLE_TRIES/, 'STABLE_TRIES must come from state-sync.js');
  assert.match(src, /sync\.SETTLE_MS/, 'SETTLE_MS must come from state-sync.js');
  assert.doesNotMatch(src, /SETTLE_MS\s*=\s*\d/, 'a retyped constant is a second thing to drift');
  assert.strictEqual(typeof sync.SETTLE_MS, 'number');
});

test('the settle gate refuses a FUTURE mtime instead of waiting for it to become old', () => {
  const w = world();
  const p = write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const soon = new Date(Date.now() + 60_000);
  fs.utimesSync(p, soon, soon);
  const g = T.settledStat(p);
  assert.strictEqual(g.st, null);
  assert.match(g.why, /FUTURE_MTIME/);
});

test('the settle gate refuses a file that never goes quiet, and names it', () => {
  const w = world();
  const p = write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  // now() frozen at the file's own mtime: the file is forever "just written".
  const g = T.settledStat(p, { now: () => fs.statSync(p).mtimeMs, tries: 2, settleMs: 5 });
  assert.strictEqual(g.st, null);
  assert.match(g.why, /never went quiet/);
});

test('an unsettled source refuses the export and carries nothing', () => {
  const w = world();
  const p = write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const soon = new Date(Date.now() + 60_000);
  fs.utimesSync(p, soon, soon);
  const r = go(w.D, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED');
  assert.match(rowFor(r).why, /will not settle/);
  assert.strictEqual(fs.existsSync(path.join(w.stick, T.LEDGER_DIR)), false, 'a refused export must not even make the directory');
});

// ── the round trip ──

test('first carry is FULL, second is a TAIL, and the far file ends byte-identical to the source', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']);
  write(w.D, v1);

  let r = go(w.D, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'FULL', r.text);
  r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'FULL', r.text);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), v1);

  // D takes two more turns; L stays closed.
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  write(w.D, v2);
  r = go(w.D, 'export', { apply: true });
  const row = rowFor(r);
  assert.strictEqual(row.verdict, 'TAIL', r.text);
  assert.strictEqual(row.offset, v1.length);
  assert.strictEqual(row.bytes, v2.length - v1.length);

  r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'APPEND', r.text);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), v2, 'the far file must be the source, byte for byte');
  assert.match(r.text, /VERIFIED WHOLE/);
});

test('the carry runs BOTH ways: L exports its own turns back and D appends them', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });

  const v2 = v1 + turns(SID, ['2026-09-12T09:00:00.000Z'], 'l');
  write(w.L, v2);
  let r = go(w.L, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'TAIL', r.text);
  r = go(w.D, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'APPEND', r.text);
  assert.strictEqual(fs.readFileSync(w.D.dest, 'utf8'), v2);
});

// ── the receipt the launch reads (L, 2026-09-14: placed seats retired by a migrate a minute later) ──

test('an import leaves a receipt naming the conversation it placed, beside the projects root', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-06-30T05:00:00.000Z', '2026-09-12T12:00:00.000Z']));
  go(w.D, 'export', { apply: true });
  const r = go(w.L, 'import', { apply: true });
  const p = T.carriedPath(w.L.projectsRoot);
  assert.strictEqual(path.dirname(p), path.dirname(w.L.projectsRoot), 'the receipt must sit where the app looks: ~/.claude/');
  const rec = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(rec.seats[SID].line, T.conversationKey(w.L.dest).line, r.text);
  assert.strictEqual(rec.seats[SID].from, 'D');
});

test('a refused import writes no receipt, so nothing it did not place is exempt from the retire', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-06-30T05:00:00.000Z']));
  go(w.D, 'export', { apply: true });
  write(w.L, conversation(SID, ['2026-09-11T00:27:29.000Z']));   // a different conversation under the sid
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.ok(!fs.existsSync(T.carriedPath(w.L.projectsRoot)), 'a refused seat must not be on the receipt');
});

test('the receipt merges: a second carry keeps the seats the first one placed', () => {
  const w = world();
  const p = T.carriedPath(w.L.projectsRoot);
  T.writeCarried(w.L.projectsRoot, [{ sid: 'bbbbbbbb-2222', seat: 'main', line: '{"timestamp":"x"}', size: 1, from: 'D' }], Date.now());
  write(w.D, conversation(SID, ['2026-06-30T05:00:00.000Z']));
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const rec = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.ok(rec.seats['bbbbbbbb-2222'] && rec.seats[SID]);
});

test('a second import of the same tail is a no-op, not a second append', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const before = fs.readFileSync(w.L.dest, 'utf8');
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'NOTHING_PENDING', r.text);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), before);
});

test('a seat that is up to date carries nothing', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const r = go(w.D, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'UP_TO_DATE', r.text);
});

// ══ THE ONE THIS FILE EXISTS FOR ═════════════════════════════════════════════════════════════

test('THE SPEC HOLE: plan §8 bar (2)\'s content check PASSES on a forked destination, and this tool refuses it', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });

  // Both machines now hold v1. BOTH run: D takes a turn, and L takes a different one.
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  write(w.L, v1 + turns(SID, ['2026-09-12T09:00:00.000Z'], 'l'));

  const led = T.readLedger(w.stick);
  const agreed = led.seats[SID].agreed;

  // The check the plan specifies, run literally: "the destination's prefix hash at the ledger's
  // offset". It says the copies are identical — because L's own turn is entirely AFTER the offset.
  assert.strictEqual(T.hashRange(w.L.dest, 0, agreed.offset), agreed.prefixSha,
    'the fixture is pointless unless the specified check really does pass here');

  go(w.D, 'export', { apply: true });
  const r = go(w.L, 'import', { apply: true });
  const row = rowFor(r);
  assert.strictEqual(row.verdict, 'DIVERGED', r.text);
  assert.match(row.why, /written \d+ bytes of its OWN/);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), v1 + turns(SID, ['2026-09-12T09:00:00.000Z'], 'l'),
    'the forked file must be left exactly as it was — no append, no truncation, no rename');
  assert.strictEqual(r.code, 1, 'a fork must fail the run, not be printed past');
});

test('a divergence leaves the ledger\'s pending tail in place so the other machine can still be told', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  write(w.L, v1 + turns(SID, ['2026-09-12T09:00:00.000Z'], 'l'));
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const led = T.readLedger(w.stick);
  assert.ok(led.seats[SID].pending, 'a refused import must not consume the tail it refused');
});

// ── the interrupted carry ──

test('an interrupted carry is told APART from a fork, by whether the extra bytes ARE the tail', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  write(w.D, v2);
  go(w.D, 'export', { apply: true });

  // a carry that died halfway through the append
  const half = v1.length + Math.floor((v2.length - v1.length) / 2);
  write(w.L, v2.slice(0, half));

  let r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'INTERRUPTED', r.text);
  assert.match(rowFor(r).why, /--repair/);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8').length, half, 'naming it is not repairing it');

  r = go(w.L, 'import', { apply: true, repair: [SID] });
  assert.strictEqual(rowFor(r).verdict, 'REPAIR', r.text);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), v2);
});

test('the repair keeps the pre-truncate copy', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  write(w.D, v2);
  go(w.D, 'export', { apply: true });
  const half = v1.length + Math.floor((v2.length - v1.length) / 2);
  const torn = v2.slice(0, half);
  write(w.L, torn);
  go(w.L, 'import', { apply: true, repair: [SID] });
  // CHANGED 2026-09-14 (P-STICK §2): the kept copy lives in the ATTIC now, not beside the live file.
  // This test used to assert the in-place name; the packet changed the requirement, not the test's rigour.
  const kept = inAttic(w.L, 'pre-truncate');
  assert.strictEqual(kept.length, 1, `expected one pre-truncate copy in the attic, found ${kept.join(', ')}`);
  assert.strictEqual(fs.readFileSync(path.join(atticDir(w.L), kept[0]), 'utf8'), torn);
  assert.deepStrictEqual(besideLive(w.L), [], 'nothing may be left beside the live transcript');
});

test('atticPath never returns a name that already exists — the main.rs:835-836 scar', () => {
  const root = path.join(tmp, 'x', '.claude', 'projects');
  const now = Date.parse('2026-09-12T10:15:00.000Z');
  const st = T.atticStamp(now);
  const dir = path.join(tmp, 'x', '.claude', 'consonance-attic', 'C--slug');
  const taken = new Set([path.join(dir, `${SID}.${st}-pre-truncate.jsonl`), path.join(dir, `${SID}.${st}-pre-truncate-2.jsonl`)]);
  assert.strictEqual(T.atticPath(root, 'C--slug', SID, 'pre-truncate', now, (q) => taken.has(q)),
    path.join(dir, `${SID}.${st}-pre-truncate-3.jsonl`));
});

test('atticPath is attic_for\'s shape: <.claude>/consonance-attic/<slug>/<sid>.<YYYYMMDD-HHMMSS>-<why>.jsonl', () => {
  const root = path.join(tmp, 'y', '.claude', 'projects');
  const p = T.atticPath(root, 'C--Consonance-instances-librarian', SID, 'retire-far', Date.now(), () => false);
  assert.strictEqual(path.dirname(p), path.join(tmp, 'y', '.claude', 'consonance-attic', 'C--Consonance-instances-librarian'));
  assert.match(path.basename(p), ATTIC_NAME('retire-far'));
  assert.doesNotMatch('x.jsonl.retired-20260914T063637Z', ATTIC_NAME('retire-far'), 'the shape test must be able to fail');
});

test('atticStamp is LOCAL YYYYMMDD-HHMMSS, the format main.rs hands attic_for', () => {
  const d = new Date(2026, 8, 14, 0, 36, 37);            // local, by construction
  assert.strictEqual(T.atticStamp(d.getTime()), '20260914-003637');
});

test('a ledger whose pending tail does not start at the agreed state is refused, not half-trusted', () => {
  // The prefix check hashes the destination at `pending.offset` and compares it to a hash recorded
  // at `agreed.offset`. Those are equal in every run this tool produces — and a hand-edited or
  // half-written ledger where they differ would make the comparison meaningless. Found by a test
  // that built the mismatch, which is the only reason it is guarded.
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd');
  write(w.D, v2);
  go(w.D, 'export', { apply: true });
  const led = T.readLedger(w.stick);
  led.seats[SID].agreed.offset = v1.length - 1;       // one byte out of step with the pending tail
  T.writeLedger(w.stick, led);
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /the ledger disagrees with itself/);
});

// ── surprises at the far end ──

test('a destination that is missing while the tail is a DELTA is refused, not rebuilt from half a file', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  go(w.D, 'export', { apply: true });
  fs.unlinkSync(w.L.dest);
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /a tail cannot rebuild it/);
  assert.strictEqual(fs.existsSync(w.L.dest), false);
});

test('a far machine holding a DIFFERENT conversation under the same sid is refused, and names the flag', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  write(w.L, conversation(SID, ['2026-09-11T00:27:29.000Z'], 'own'));
  go(w.D, 'export', { apply: true });
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /--retire-far/);
  assert.match(fs.readFileSync(w.L.dest, 'utf8'), /2026-09-11T00:27:29/, 'the far machine\'s own conversation must be untouched');
});

test('--retire-far moves the far copy aside, keeps it, and only then writes the carried one', () => {
  const w = world();
  const mine = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  const theirs = conversation(SID, ['2026-09-11T00:27:29.000Z'], 'own');
  write(w.D, mine);
  write(w.L, theirs);
  go(w.D, 'export', { apply: true });
  const r = go(w.L, 'import', { apply: true, retireFar: [SID] });
  assert.strictEqual(rowFor(r).verdict, 'RETIRE_THEN_FULL', r.text);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), mine);
  // CHANGED 2026-09-14 (P-STICK §2): retired into the attic in attic_for's shape, never beside the live file.
  const kept = inAttic(w.L, 'retire-far');
  assert.strictEqual(kept.length, 1, `expected one retirement in ${atticDir(w.L)}, found ${kept.join(', ')}`);
  assert.strictEqual(fs.readFileSync(path.join(atticDir(w.L), kept[0]), 'utf8'), theirs);
});

test('a --retire-far lands under consonance-attic/<slug>/ and NOT beside the live file', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'launchborn'));
  go(w.D, 'export', { apply: true });
  const r = go(w.L, 'import', { apply: true, retireFar: [SID] });
  assert.strictEqual(rowFor(r).verdict, 'RETIRE_THEN_FULL', r.text);
  assert.deepStrictEqual(besideLive(w.L), [], 'the projects/ directory must hold only the live transcript');
  assert.strictEqual(inAttic(w.L, 'retire-far').length, 1);
  assert.match(r.text, /consonance-attic/, 'the run must say where the retired conversation went');
});

test('--retire-far is refused when the tail is a delta, because a delta cannot replace a conversation', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  go(w.D, 'export', { apply: true });
  write(w.L, conversation(SID, ['2026-09-11T00:27:29.000Z'], 'own'));   // L replaced its file entirely
  const r = go(w.L, 'import', { apply: true, retireFar: [SID] });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /Export this seat whole first/);
});

test('a source that SHRANK is refused — a transcript that is not append-only is not carryable', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const r = go(w.D, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /SHORTER than the agreed state/);
});

test('a rewritten history inside the agreed prefix is refused on export', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  write(w.D, v1.replace('2026-09-09T17:06:33.328Z', '2026-09-09T17:06:33.999Z') + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  const r = go(w.D, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /DIVERGED from the agreed state/);
});

test('the EXPORT refuses too when this machine\'s file is a different conversation under the agreed sid', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  // longer than the agreed state, so the size check cannot be what catches it
  write(w.D, conversation(SID, ['2026-09-12T04:05:00.000Z', '2026-09-12T04:06:00.000Z', '2026-09-12T04:07:00.000Z'], 'new'));
  const r = go(w.D, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /DIFFERENT conversation/);
});

test('a tail whose length disagrees with the span the ledger claims is refused', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  const led = T.readLedger(w.stick);
  led.seats[SID].pending.toOffset -= 1;          // the bytes are fine; the ledger's arithmetic is not
  T.writeLedger(w.stick, led);
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /but the ledger says it spans/);
  assert.strictEqual(fs.existsSync(w.L.dest), false);
});

test('a rejoined file whose full sha256 is not the one the ledger recorded FAILS the run', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  const led = T.readLedger(w.stick);
  led.seats[SID].pending.fullSha = 'f'.repeat(64);   // the tail is intact; the end-to-end claim is wrong
  T.writeLedger(w.stick, led);
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(r.ok, false, r.text);
  assert.strictEqual(r.code, 1);
  assert.match(r.text, /FAILED/);
  assert.doesNotMatch(r.text, /VERIFIED WHOLE/);
  const after = T.readLedger(w.stick);
  assert.ok(after.seats[SID].pending, 'a failed verification must not advance the agreed state');
  assert.strictEqual(after.seats[SID].agreed, null);
});

test('a source that grew between the plan and the read is not written as though it had not', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  const plan = T.planExport({ stick: w.stick, machine: 'D', projectsRoot: w.D.projectsRoot,
    instancesRoot: w.D.instancesRoot, panesPath: w.D.panesPath });
  const row = plan.rows.find((x) => x.sid === SID);
  assert.strictEqual(row.verdict, 'FULL');
  // the app takes a turn in the window between the plan's stat and the export's read
  fs.appendFileSync(w.D.dest, turns(SID, ['2026-09-12T04:20:00.000Z'], 'late'));
  const done = T.applyExport(plan, Date.now());
  const d = done.find((x) => x.row.sid === SID);
  assert.strictEqual(d.ok, false);
  assert.match(d.why, /grew while it was being read/);
});

test('an export refuses to write over a tail the other machine has not imported yet', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });          // D's tail is on the stick, unimported
  write(w.L, v1);                              // L happens to hold the same conversation
  const r = go(w.L, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /unimported tail from D/);
});

test('a tail damaged on the stick is caught by its own sha256 before anything is appended', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  const led = T.readLedger(w.stick);
  const tp = path.join(w.stick, T.LEDGER_DIR, led.seats[SID].pending.tailFile);
  const b = fs.readFileSync(tp); b[10] ^= 0xff; fs.writeFileSync(tp, b);
  const r = go(w.L, 'import', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'REFUSED', r.text);
  assert.match(rowFor(r).why, /does not match its own recorded sha256/);
  assert.strictEqual(fs.existsSync(w.L.dest), false);
});

test('a ledger from a future version is refused rather than half-understood', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  fs.mkdirSync(path.join(w.stick, T.LEDGER_DIR), { recursive: true });
  fs.writeFileSync(path.join(w.stick, T.LEDGER_DIR, T.LEDGER_NAME), JSON.stringify({ version: 99, seats: {} }));
  const r = go(w.D, 'export', { apply: true });
  assert.strictEqual(r.ok, false);
  assert.match(r.text, /ledger version 99/);
});

test('a seat the ledger knows but this machine has no file for is reported, not skipped quietly', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  fs.unlinkSync(w.D.dest);
  const r = go(w.D, 'export', { apply: true });
  assert.strictEqual(rowFor(r).verdict, 'ABSENT_HERE');
  assert.strictEqual(r.code, 1, 'a seat that vanished must not read as a clean carry');
});

// ── the app, open ──

test('an IMPORT refuses while Consonance is running, and appends nothing', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  const before = snapshot(w.dir);
  const r = go(w.L, 'import', { apply: true, appRunning: true });
  assert.strictEqual(r.ok, false);
  assert.match(r.text, /REFUSED — Consonance is running/);
  assert.deepStrictEqual(snapshot(w.dir), before);
});

test('an import refuses when it cannot tell whether the app is running', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  go(w.D, 'export', { apply: true });
  const r = go(w.L, 'import', { apply: true, appRunning: null });
  assert.strictEqual(r.ok, false);
  assert.match(r.text, /cannot tell whether Consonance is running/);
});

test('an EXPORT does not need the app closed — it only reads', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const r = go(w.D, 'export', { apply: true, appRunning: true });
  assert.strictEqual(r.ok, true, r.text);
  assert.strictEqual(rowFor(r).verdict, 'FULL');
});

test('an import REHEARSAL does not need the app closed either', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  go(w.D, 'export', { apply: true });
  const r = go(w.L, 'import', { appRunning: true });
  assert.strictEqual(r.ok, true, r.text);
  assert.strictEqual(rowFor(r).verdict, 'FULL');
  assert.doesNotMatch(r.text, /REFUSED — Consonance is running/);
});

// ── the rehearsal ──

test('the rehearsal writes NOTHING, on either side, and prints the whole plan', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']);
  write(w.D, v1);
  const before = snapshot(w.dir);
  const r = go(w.D, 'export');
  assert.strictEqual(r.ok, true, r.text);
  assert.deepStrictEqual(snapshot(w.dir), before, 'a rehearsal must leave every byte and every mtime alone');
  assert.match(r.text, /rehearsal — nothing will be written/);
  assert.match(r.text, /FULL/);
  assert.match(r.text, /the whole file: \d+ B/);
  assert.match(r.text, /Rehearsal only\. Nothing was written\./);
});

test('the import rehearsal writes nothing either, and still names what it would do', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  const before = snapshot(w.dir);
  const r = go(w.L, 'import');
  assert.deepStrictEqual(snapshot(w.dir), before);
  assert.match(r.text, /FULL/);
  assert.match(r.text, /would be appended here/);
});

test('the rehearsal shows the byte count that makes the tail worth having', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  const r = go(w.D, 'export');
  assert.match(r.text, /TAIL/);
  assert.match(r.text, /from offset \d+ of \d+  ->  \d+ B/);
});

// ══ THE --json CONTRACT (P-STICK, L058) ══════════════════════════════════════════════════════
//
// These go through `main` — the real argument parser and the real stdout discipline — with only the
// fixture machine's roots injected. A test of `toJson` alone would pass while `main` printed a
// banner above the object, which is the failure an app reading stdout would actually meet.

// CHANGED 2026-09-14 (L059 §3 re-rule at 60e1ccf): +carriedFirstTimestamp on every row (E-3) and +staleLock at
// the top (A-3, "a row naming the stale lock"). Additive; these lists still pin the exact shape.
const FIELDS = ['seat', 'sid', 'kind', 'verdict', 'reason', 'why', 'stops', 'carries', 'bytes', 'offset',
  'toOffset', 'path', 'localSize', 'localFirstTimestamp', 'carriedFirstTimestamp', 'exportedAt', 'exportedFrom', 'retirable', 'takeable', 'ownBytes', 'result'];
// CHANGED 2026-09-19 (D080 P-FLUSH-BEFORE-DONE): +flush at the top — `[{ dir, result }]` after an --apply, else null.
// Additive, by the same rule as staleLock; the list still pins the exact shape.
const TOP = ['tool', 'contract', 'mode', 'apply', 'machine', 'stick', 'code', 'outcome', 'why', 'rows', 'receipt', 'staleLock', 'flush'];

/** Run main with --json against a fixture machine; return the parsed object, the raw streams, the code. */
function J(m, argv, extra) {
  let stdout = '', stderr = '';
  const code = T.main(argv.concat(['--json']), { stdout: (s) => { stdout += s; }, stderr: (s) => { stderr += s; } },
    Object.assign({ machine: m.machine, appRunning: false, projectsRoot: m.projectsRoot,
      instancesRoot: m.instancesRoot, panesPath: m.panesPath }, extra || {}));
  const lines = stdout.split('\n');
  assert.strictEqual(lines.length, 2, `stdout must be ONE line plus its newline; got ${lines.length - 1} line(s):\n${stdout.slice(0, 400)}`);
  assert.strictEqual(lines[1], '', 'nothing may follow the object on stdout');
  const obj = JSON.parse(lines[0]);
  return { obj, code, stdout, stderr };
}
const Jrow = (res, sid) => res.obj.rows.find((x) => x.sid === (sid || SID));

/** The field set, the types, and the REFUSED<->reason rule, checked on every row of every object. */
function wellFormed(obj) {
  assert.deepStrictEqual(Object.keys(obj).sort(), [...TOP].sort(), 'top-level fields');
  assert.strictEqual(obj.contract, T.CONTRACT_VERSION);
  for (const r of obj.rows) {
    assert.deepStrictEqual(Object.keys(r).sort(), [...FIELDS].sort(), `row ${r.verdict} must carry every field, null where n/a`);
    assert.ok(['fixed', 'pane'].includes(r.kind), `kind ${r.kind}`);
    assert.strictEqual(r.reason !== null, r.verdict === 'REFUSED', `reason is non-null EXACTLY on REFUSED (${r.verdict}/${r.reason})`);
    if (r.reason !== null) assert.ok(T.REASONS.includes(r.reason), `unknown reason ${r.reason}`);
    assert.strictEqual(r.stops, T.STOPS.includes(r.verdict));
    assert.strictEqual(typeof r.bytes, 'number');
    // P-DIVERGED D-7: the one exception — a DIVERGED row names the stick's tail it would take.
    if (!r.carries && r.verdict !== 'DIVERGED') assert.strictEqual(r.bytes, 0, 'a seat that does not carry carries 0 bytes');
    if (r.retirable !== null) assert.strictEqual(r.reason, 'OTHER_CONVERSATION');
    if (r.takeable !== null) assert.deepStrictEqual([r.takeable, r.verdict], [true, 'DIVERGED'], 'takeable is non-null exactly on DIVERGED');
    if (r.ownBytes !== null) assert.ok(['DIVERGED', 'RETIRE_THEN_APPEND', 'APPLIED_AND_GREW'].includes(r.verdict), `ownBytes on ${r.verdict}`);
  }
  assert.doesNotMatch(JSON.stringify(obj), /"type":"Buffer"/, 'the carried bytes must never cross the process boundary');
}

test('--json: every EXPORT verdict path emits one well-formed object', () => {
  const seen = new Set();
  // NOTHING_YET
  let w = world();
  let r = J(w.D, ['--stick', w.stick, '--export']); wellFormed(r.obj); seen.add(Jrow(r).verdict);
  // FULL (rehearsal) then FULL (--apply)
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  r = J(w.D, ['--stick', w.stick, '--export']); wellFormed(r.obj); seen.add(Jrow(r).verdict);
  r = J(w.D, ['--stick', w.stick, '--export', '--apply']); wellFormed(r.obj);
  assert.strictEqual(Jrow(r).result.ok, true);
  assert.match(Jrow(r).result.tailFile, /\.tail$/);
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  // UP_TO_DATE
  r = J(w.D, ['--stick', w.stick, '--export']); wellFormed(r.obj); seen.add(Jrow(r).verdict);
  // TAIL
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']) + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  r = J(w.D, ['--stick', w.stick, '--export']); wellFormed(r.obj); seen.add(Jrow(r).verdict);
  // REFUSED (SHRANK)
  write(w.D, head(SID));
  r = J(w.D, ['--stick', w.stick, '--export']); wellFormed(r.obj); seen.add(Jrow(r).verdict);
  // ABSENT_HERE
  fs.unlinkSync(w.D.dest);
  r = J(w.D, ['--stick', w.stick, '--export']); wellFormed(r.obj); seen.add(Jrow(r).verdict);
  assert.deepStrictEqual([...seen].sort(), ['ABSENT_HERE', 'FULL', 'NOTHING_YET', 'REFUSED', 'TAIL', 'UP_TO_DATE']);
});

test('--json: every IMPORT verdict path emits one well-formed object', () => {
  const seen = new Set();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  let w = world();
  let r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);        // NOTHING_PENDING
  write(w.D, v1); J(w.D, ['--stick', w.stick, '--export', '--apply']);
  r = J(w.D, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // OURS
  r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // FULL
  r = J(w.L, ['--stick', w.stick, '--import', '--apply']); wellFormed(r.obj);
  assert.strictEqual(Jrow(r).result.ok, true);
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  write(w.D, v2); J(w.D, ['--stick', w.stick, '--export', '--apply']);
  r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // APPEND
  const half = v1.length + Math.floor((v2.length - v1.length) / 2);
  write(w.L, v2.slice(0, half));
  r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // INTERRUPTED
  r = J(w.L, ['--stick', w.stick, '--import', '--repair', SID]); wellFormed(r.obj); seen.add(Jrow(r).verdict); // REPAIR
  write(w.L, v2);
  r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // ALREADY_APPLIED
  write(w.L, v1 + turns(SID, ['2026-09-12T09:00:00.000Z'], 'l'));
  r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // DIVERGED
  r = J(w.L, ['--stick', w.stick, '--import', '--take-stick', SID]); wellFormed(r.obj); seen.add(Jrow(r).verdict); // RETIRE_THEN_APPEND
  write(w.L, v2 + turns(SID, ['2026-09-14T11:00:00.000Z'], 'l'));
  r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // APPLIED_AND_GREW
  // REFUSED and RETIRE_THEN_FULL on a fresh world, where the tail is whole
  w = world();
  write(w.D, v1); write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  r = J(w.L, ['--stick', w.stick, '--import']); wellFormed(r.obj); seen.add(Jrow(r).verdict);            // REFUSED
  r = J(w.L, ['--stick', w.stick, '--import', '--retire-far', SID]); wellFormed(r.obj); seen.add(Jrow(r).verdict); // RETIRE_THEN_FULL
  r = J(w.L, ['--stick', w.stick, '--import', '--retire-far', SID, '--apply']); wellFormed(r.obj);
  assert.match(Jrow(r).result.aside, /consonance-attic/, 'result.aside names the attic address');
  assert.deepStrictEqual([...seen].sort(),
    ['ALREADY_APPLIED', 'APPEND', 'APPLIED_AND_GREW', 'DIVERGED', 'FULL', 'INTERRUPTED', 'NOTHING_PENDING', 'OURS', 'REFUSED', 'REPAIR', 'RETIRE_THEN_APPEND', 'RETIRE_THEN_FULL']);
});

test('--json: stderr carries the human lines, stdout carries none of them', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const r = J(w.D, ['--stick', w.stick, '--export']);
  assert.match(r.stderr, /tail-carry · EXPORT/);
  assert.doesNotMatch(r.stdout, /tail-carry · EXPORT|Rehearsal only/);
});

test('--json: a bad argument still produces ONE object, code 2, whichever side of --json it is on', () => {
  const w = world();
  for (const argv of [['--yolo', '--stick', w.stick], ['--stick', w.stick, '--yolo']]) {
    const r = J(w.D, argv);
    assert.strictEqual(r.code, T.EXIT.RAN_NOT);
    assert.strictEqual(r.obj.code, 2);
    assert.strictEqual(r.obj.outcome, 'CANNOT_RUN');
    assert.deepStrictEqual(r.obj.rows, []);
    wellFormed(r.obj);
  }
});

// ── the exit codes: one test per code, each through the object AND the return value ──

test('exit 0 · NOTHING_TO_DO — a rehearsal with nothing to carry', () => {
  const w = world();
  const r = J(w.L, ['--stick', w.stick, '--import']);
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome], [0, 0, 'NOTHING_TO_DO']);
});

test('exit 0 · REHEARSED — a rehearsal that would carry, and nothing stops', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const r = J(w.D, ['--stick', w.stick, '--export']);
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome], [0, 0, 'REHEARSED']);
});

test('exit 0 · CARRIED — an --apply that carried and verified whole', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome], [0, 0, 'CARRIED']);
});

test('exit 1 · STOPPED — a seat refused', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const r = J(w.L, ['--stick', w.stick, '--import']);
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome], [1, 1, 'STOPPED']);
});

test('exit 1 · STOPPED — an INTERRUPTED carry stops the rehearsal (it used to exit 0)', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  write(w.D, v2);
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  write(w.L, v2.slice(0, v1.length + 10));
  const r = J(w.L, ['--stick', w.stick, '--import']);
  assert.strictEqual(Jrow(r).verdict, 'INTERRUPTED');
  assert.strictEqual(Jrow(r).stops, true);
  assert.deepStrictEqual([r.code, r.obj.outcome], [1, 'STOPPED'], 'a seat that has not carried is not "nothing to decide"');
});

test('exit 1 · FAILED — a seat was written but did not verify whole', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const led = T.readLedger(w.stick);
  led.seats[SID].pending.fullSha = 'f'.repeat(64);
  T.writeLedger(w.stick, led);
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome], [1, 1, 'FAILED']);
  assert.strictEqual(Jrow(r).result.ok, false);
  assert.ok(Jrow(r).result.why);
});

test('exit 2 · CANNOT_RUN — no such stick; nothing read, no rows', () => {
  const w = world();
  const r = J(w.D, ['--stick', path.join(w.dir, 'not-a-stick'), '--export']);
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome, r.obj.rows.length], [2, 2, 'CANNOT_RUN', 0]);
  assert.match(r.obj.why, /no such stick/);
});

test('exit 2 · APP_RUNNING — an --import --apply while Consonance runs; nothing read, no rows', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  for (const running of [true, null]) {
    const r = J(w.L, ['--stick', w.stick, '--import', '--apply'], { appRunning: running });
    assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome, r.obj.rows.length], [2, 2, 'APP_RUNNING', 0], `appRunning=${running}`);
  }
  assert.strictEqual(fs.existsSync(w.L.dest), false);
});

test('exit 3 · CRASHED — an exception mid-apply still produces ONE object, and says it may be partly written', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  // a broken receipt throws, loudly, AFTER the seat has been written — the real partial case
  const receipt = T.carriedPath(w.L.projectsRoot);
  fs.mkdirSync(path.dirname(receipt), { recursive: true });
  fs.writeFileSync(receipt, '{ this is not json');
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome], [3, 3, 'CRASHED']);
  assert.ok(r.obj.why);
  assert.match(r.stderr, /CRASHED/);
});

test('the process exit status IS the code — checked on a real child, not on a return value', () => {
  const run = (args) => { try { execFileSync(process.execPath, [TOOL, ...args], { stdio: 'pipe' }); return 0; } catch (e) { return e.status; } };
  assert.strictEqual(run(['--stick', path.join(tmp, 'nope'), '--export', '--json']), 2);
  let out = '';
  try { execFileSync(process.execPath, [TOOL, '--stick', path.join(tmp, 'nope'), '--export', '--json'], { stdio: 'pipe' }); }
  catch (e) { out = String(e.stdout); }
  const o = JSON.parse(out);
  assert.strictEqual(o.code, 2);
});

// ── what the app's retire rule reads ──

test('a REFUSED row stops ONLY its own seat: the other seat carries in the same --apply run', () => {
  const OTHER = 'bbbbbbbb-2222-4222-8222-222222222222';
  const w = world();
  for (const m of [w.D, w.L]) {
    fs.writeFileSync(m.panesPath, JSON.stringify([
      { pane: SID, cwd: m.cwd, label: 'x' },
      { pane: OTHER, cwd: path.join(m.instancesRoot, 'sibling-y'), label: 'y' },
    ]));
  }
  const otherDest = (m) => place.paneJsonl(m.projectsRoot, path.join(m.instancesRoot, 'sibling-y'), OTHER);
  const put = (p, body) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body); const t = new Date(Date.now() - 60_000); fs.utimesSync(p, t, t); };
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  put(otherDest(w.D), conversation(OTHER, ['2026-09-09T15:00:00.000Z'], 'o'));
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));       // SID will refuse on L
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(Jrow(r, SID).verdict, 'REFUSED');
  assert.strictEqual(Jrow(r, SID).result, null, 'the refused seat was not written');
  assert.strictEqual(Jrow(r, OTHER).verdict, 'FULL');
  assert.strictEqual(Jrow(r, OTHER).result.ok, true, 'the other seat DID carry — the documented, per-seat behaviour');
  assert.ok(fs.existsSync(otherDest(w.L)));
  assert.deepStrictEqual([r.code, r.obj.outcome], [1, 'STOPPED']);
});

test('FAILED wins over STOPPED when one seat refused and another failed its verification', () => {
  const OTHER = 'cccccccc-3333-4333-8333-333333333333';
  const w = world();
  for (const m of [w.D, w.L]) {
    fs.writeFileSync(m.panesPath, JSON.stringify([
      { pane: SID, cwd: m.cwd, label: 'x' },
      { pane: OTHER, cwd: path.join(m.instancesRoot, 'sibling-z'), label: 'z' },
    ]));
  }
  const otherDest = (m) => place.paneJsonl(m.projectsRoot, path.join(m.instancesRoot, 'sibling-z'), OTHER);
  const put = (p, body) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body); const t = new Date(Date.now() - 60_000); fs.utimesSync(p, t, t); };
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  put(otherDest(w.D), conversation(OTHER, ['2026-09-09T15:00:00.000Z'], 'o'));
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));       // SID refuses on L
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const led = T.readLedger(w.stick);
  led.seats[OTHER].pending.fullSha = 'f'.repeat(64);                         // OTHER will fail its verify
  T.writeLedger(w.stick, led);
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(Jrow(r, SID).stops, true);
  assert.strictEqual(Jrow(r, OTHER).result.ok, false);
  assert.deepStrictEqual([r.code, r.obj.outcome], [1, 'FAILED'], 'a written-but-wrong seat is the worse news and must be the one named');
});

test('retirable is true for a different conversation when the carried tail is whole', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const row = Jrow(J(w.L, ['--stick', w.stick, '--import']));
  assert.deepStrictEqual([row.verdict, row.reason, row.retirable], ['REFUSED', 'OTHER_CONVERSATION', true]);
});

test('retirable is FALSE when the tail is a delta — --retire-far would only refuse again', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));
  const row = Jrow(J(w.L, ['--stick', w.stick, '--import']));
  assert.deepStrictEqual([row.verdict, row.reason, row.retirable], ['REFUSED', 'OTHER_CONVERSATION', false]);
  // and the prediction holds: naming it gets a refusal, not a retirement
  const again = Jrow(J(w.L, ['--stick', w.stick, '--import', '--retire-far', SID]));
  assert.strictEqual(again.verdict, 'REFUSED');
});

test('the row carries ARRIVING\'s inputs: kind, this machine\'s first timestamp, and when the tail was exported', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));
  const now = Date.parse('2026-09-14T06:30:00.000Z');
  T.main(['--stick', w.stick, '--export', '--apply', '--json'], { stdout: () => {}, stderr: () => {} },
    { machine: 'D', appRunning: false, projectsRoot: w.D.projectsRoot, instancesRoot: w.D.instancesRoot, panesPath: w.D.panesPath, now });
  const row = Jrow(J(w.L, ['--stick', w.stick, '--import']));
  assert.strictEqual(row.kind, 'pane');
  assert.strictEqual(row.localFirstTimestamp, '2026-09-14T06:36:37.000Z');
  assert.strictEqual(row.exportedAt, '2026-09-14T06:30:00.000Z');
  assert.strictEqual(row.exportedFrom, 'D');
  assert.strictEqual(row.path, w.L.dest, 'the path is the file this tool judged, not a search result');
  assert.strictEqual(row.localSize, fs.statSync(w.L.dest).size);
});

test('a seat whose file was never read reports localSize null, never 0', () => {
  const w = world();
  const row = Jrow(J(w.D, ['--stick', w.stick, '--export']));
  assert.strictEqual(row.verdict, 'NOTHING_YET');
  assert.strictEqual(row.localSize, null);
  assert.strictEqual(row.localFirstTimestamp, null);
});

test('fixed seats are reported as kind "fixed", from the real main.rs', () => {
  const w = world();
  const r = J(w.D, ['--stick', w.stick, '--export']);
  assert.deepStrictEqual(r.obj.rows.filter((x) => x.kind === 'fixed').map((x) => x.seat).sort(), ['librarian', 'main', 'third place']);
});

// ══ L059 §3 AS RE-RULED — the transfer set, the verifier, the lock ═══════════════════════════════

const VERIFY_TOP = ['tool', 'contract', 'mode', 'stick', 'code', 'layout', 'missing', 'mismatched', 'extra', 'why'];
function V(m, stick) {
  const r = J(m, ['--stick', stick, '--verify-set']);
  assert.deepStrictEqual(Object.keys(r.obj).sort(), [...VERIFY_TOP].sort(), 'verify-set top-level fields');
  assert.strictEqual(r.code, r.obj.code, 'exit equals code');
  return r.obj;
}
/** One carried seat: D exports it with --apply, which writes the ledger, the HANDOFF and the MANIFEST. */
function carried() {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  return w;
}
const manifestOf = (w) => JSON.parse(fs.readFileSync(path.join(w.stick, T.TRANSFER_DIR, T.MANIFEST_NAME), 'utf8'));

test('--verify-set · code 0 "manifest": an export writes a set that verifies', () => {
  const w = carried();
  const v = V(w.D, w.stick);
  assert.deepStrictEqual([v.code, v.layout, v.missing, v.mismatched], [0, 'manifest', [], []]);
  const names = manifestOf(w).members.map((x) => x.path);
  assert.ok(names.includes('consonance-tails/ledger.json'));
  assert.ok(names.some((x) => /^consonance-tails\/.+\.tail$/.test(x)), 'the pending tail is a member');
  assert.ok(names.some((x) => /^HANDOFF-\d{4}-\d{2}-\d{2}\.md$/.test(x)), 'the generated HANDOFF is a member');
});

test('--verify-set · code 1: a MISSING member is named', () => {
  const w = carried();
  const tail = manifestOf(w).members.find((x) => x.path.endsWith('.tail')).path;
  fs.unlinkSync(path.join(w.stick, ...tail.split('/')));
  const v = V(w.D, w.stick);
  assert.deepStrictEqual([v.code, v.layout, v.missing, v.mismatched], [1, 'manifest', [tail], []]);
});

test('--verify-set · code 1: a MISMATCHED member is named — same size, different bytes', () => {
  const w = carried();
  const tail = manifestOf(w).members.find((x) => x.path.endsWith('.tail')).path;
  const p = path.join(w.stick, ...tail.split('/'));
  const b = fs.readFileSync(p); b[5] ^= 0xff; fs.writeFileSync(p, b);
  const v = V(w.D, w.stick);
  assert.deepStrictEqual([v.code, v.missing, v.mismatched], [1, [], [tail]]);
});

test('--verify-set · code 0 "older": a ledger and no MANIFEST IS a stick (tonight\'s real stick)', () => {
  const w = carried();
  fs.rmSync(path.join(w.stick, T.TRANSFER_DIR), { recursive: true });
  const v = V(w.D, w.stick);
  assert.deepStrictEqual([v.code, v.layout, v.missing, v.mismatched], [0, 'older', [], []]);
});

test('--verify-set · code 2: no marker at all is not a stick, and says so', () => {
  const w = world();
  const v = V(w.D, w.stick);
  assert.deepStrictEqual([v.code, v.layout], [2, null]);
  assert.match(v.why, /no stick marker/);
});

test('--verify-set · code 2: an unreadable MANIFEST cannot be verified, and is not guessed at', () => {
  const w = carried();
  fs.writeFileSync(path.join(w.stick, T.TRANSFER_DIR, T.MANIFEST_NAME), '{ nope');
  const v = V(w.D, w.stick);
  assert.strictEqual(v.code, 2);
  assert.match(v.why, /not readable JSON/);
});

test('--verify-set · extra is informational: an old tail the manifest no longer names is listed, code stays 0', () => {
  const w = carried();
  fs.writeFileSync(path.join(w.stick, T.LEDGER_DIR, 'old-carry.tail'), 'kept, never deleted');
  const v = V(w.D, w.stick);
  assert.deepStrictEqual([v.code, v.extra], [0, ['consonance-tails/old-carry.tail']]);
});

test('--verify-set · a member path that escapes the stick is mismatched, never read', () => {
  const w = carried();
  const man = manifestOf(w);
  man.members.push({ path: '../outside.txt', bytes: 1, sha256: 'x' });
  fs.writeFileSync(path.join(w.stick, T.TRANSFER_DIR, T.MANIFEST_NAME), JSON.stringify(man));
  const v = V(w.D, w.stick);
  assert.deepStrictEqual([v.code, v.mismatched], [1, ['../outside.txt']]);
});

test('--verify-set writes nothing', () => {
  const w = carried();
  const before = snapshot(w.stick);
  V(w.D, w.stick);
  assert.deepStrictEqual(snapshot(w.stick), before);
});

test('--verify-set refuses to combine with --import or --export', () => {
  const w = carried();
  const r = J(w.D, ['--stick', w.stick, '--verify-set', '--import']);
  assert.strictEqual(r.obj.code, 2);
});

// ── A-2: the success path leaves a set that verifies ──

test('A-2: after a successful IMPORT the manifest still verifies — the defect measured at 85a665e is closed', () => {
  const w = carried();
  const before = manifestOf(w).members.find((x) => x.path === 'consonance-tails/ledger.json').sha256;
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(r.obj.outcome, 'CARRIED', r.stderr);
  const after = manifestOf(w).members.find((x) => x.path === 'consonance-tails/ledger.json').sha256;
  assert.notStrictEqual(after, before, 'the import did rewrite the ledger — the fixture reaches the case');
  assert.deepStrictEqual([V(w.L, w.stick).code, V(w.L, w.stick).mismatched], [0, []], 'and the manifest moved with it');
});

test('A-2: the manifest names only tails the ledger still names as pending', () => {
  const w = carried();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.deepStrictEqual(manifestOf(w).members.filter((x) => x.path.endsWith('.tail')), [], 'imported: nothing pending, no tail member');
  assert.strictEqual(V(w.L, w.stick).extra.length, 1, 'the carried tail is kept on the stick, as extra');
});

// ── the generated HANDOFF ──

test('the HANDOFF is deterministic from the ledger: same ledger, same bytes, same name', () => {
  const w = carried();
  const led = T.readLedger(w.stick);
  const copy = JSON.parse(JSON.stringify(led));
  assert.strictEqual(T.renderHandoff(led), T.renderHandoff(copy));
  assert.strictEqual(T.handoffName(led), T.handoffName(copy));
  // and it does not read the clock: rendering again later changes nothing
  const first = T.renderHandoff(led);
  const later = T.renderHandoff(JSON.parse(JSON.stringify(led)));
  assert.strictEqual(first, later);
});

test('the HANDOFF on the stick is exactly renderHandoff(the ledger on the stick)', () => {
  const w = carried();
  const led = T.readLedger(w.stick);
  const onStick = fs.readFileSync(path.join(w.stick, T.handoffName(led)), 'utf8');
  assert.strictEqual(onStick, T.renderHandoff(led));
  assert.strictEqual(onStick.split('\n')[0], T.GENERATED_MARK);
});

test('the HANDOFF names the seat, its bytes, the incoming first timestamp and the one-machine-open rule', () => {
  const w = carried();
  const text = T.renderHandoff(T.readLedger(w.stick));
  assert.match(text, new RegExp(SID));
  assert.match(text, /began 2026-09-09T14:59:19\.013Z/);
  assert.match(text, /expected at the far end: FULL/);
  assert.match(text, /Consonance may be open on exactly one machine/);
});

test('a HANDOFF a PERSON wrote at the generated name stops the carry before any seat is written', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const now = Date.parse('2026-09-12T10:00:00.000Z');
  fs.writeFileSync(path.join(w.stick, 'HANDOFF-2026-09-12.md'), '# typed by the librarian\n');
  const before = snapshot(w.stick);
  const r = J(w.D, ['--stick', w.stick, '--export', '--apply'], { now });
  assert.deepStrictEqual([r.obj.code, r.obj.outcome], [2, 'CANNOT_RUN']);
  assert.match(r.obj.why, /written by a person/);
  assert.deepStrictEqual(snapshot(w.stick), before, 'no tail, no ledger, no manifest — and the typed file untouched');
});

// ── E-3: the incoming conversation's first timestamp ──

test('E-3: a full export records carriedFirstTimestamp; the import row carries it', () => {
  const w = carried();
  assert.strictEqual(T.readLedger(w.stick).seats[SID].firstTimestamp, '2026-09-09T14:59:19.013Z');
  const row = Jrow(J(w.L, ['--stick', w.stick, '--import']));
  assert.strictEqual(row.carriedFirstTimestamp, '2026-09-09T14:59:19.013Z');
});

test('E-3: a later DELTA export keeps the first timestamp the full carry recorded', () => {
  const w = carried();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']) + turns(SID, ['2026-09-14T04:00:00.000Z'], 'd'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const e = T.readLedger(w.stick).seats[SID];
  assert.ok(e.pending.offset > 0, 'the fixture reaches a delta');
  assert.strictEqual(e.firstTimestamp, '2026-09-09T14:59:19.013Z');
});

test('R-4: a DELTA export fills a first timestamp the entry lacks — tonight\'s real stick is not "unknown" for ever', () => {
  const w = carried();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  const led = T.readLedger(w.stick);
  delete led.seats[SID].firstTimestamp;               // a ledger written before E-3
  T.writeLedger(w.stick, led);
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']) + turns(SID, ['2026-09-14T04:00:00.000Z'], 'd'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const e = T.readLedger(w.stick).seats[SID];
  assert.ok(e.pending.offset > 0, 'the fixture reaches a delta, not a full carry');
  assert.strictEqual(e.firstTimestamp, '2026-09-09T14:59:19.013Z');
  assert.strictEqual(Jrow(J(w.L, ['--stick', w.stick, '--import'])).carriedFirstTimestamp, '2026-09-09T14:59:19.013Z');
});

test('R-4: a DELTA export never overwrites a first timestamp that is already set', () => {
  const w = carried();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  const led = T.readLedger(w.stick);
  led.seats[SID].firstTimestamp = '2026-01-01T00:00:00.000Z';   // set, and deliberately NOT the source's own
  T.writeLedger(w.stick, led);
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']) + turns(SID, ['2026-09-14T04:00:00.000Z'], 'd'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const e = T.readLedger(w.stick).seats[SID];
  assert.ok(e.pending.offset > 0);
  assert.strictEqual(e.firstTimestamp, '2026-01-01T00:00:00.000Z', 'a set value is never replaced by a delta');
});

test('E-3: a ledger that never recorded it gives null — "unknown", never guessed', () => {
  const w = carried();
  const led = T.readLedger(w.stick);
  delete led.seats[SID].firstTimestamp;
  T.writeLedger(w.stick, led);
  assert.strictEqual(Jrow(J(w.L, ['--stick', w.stick, '--import'])).carriedFirstTimestamp, null);
});

// ── the killed import: ALREADY_APPLIED is settled, or the seat wedges for good ──

/** The state a hard kill leaves: the tail bytes are in the destination, the ledger still says pending. */
function killedAfterAppend() {
  const w = carried();
  const led = T.readLedger(w.stick);
  const tail = fs.readFileSync(path.join(w.stick, T.LEDGER_DIR, led.seats[SID].pending.tailFile));
  write(w.L, tail.toString('utf8'));          // offset 0: the tail IS the conversation
  return w;
}

test('b258fc2: ONE import heals the wedged ledger — pending cleared, agreed recorded, and the row says it advanced', () => {
  const w = killedAfterAppend();
  // the wedge, confirmed before the heal: pending on the stick, the tail already whole here
  assert.ok(T.readLedger(w.stick).seats[SID].pending, 'the fixture builds the wedged ledger');
  assert.strictEqual(Jrow(J(w.L, ['--stick', w.stick, '--import'])).verdict, 'ALREADY_APPLIED', 'and a rehearsal reads it clean');
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(Jrow(r).verdict, 'ALREADY_APPLIED');
  assert.strictEqual(r.obj.outcome, 'CARRIED', r.stderr);
  const e = T.readLedger(w.stick).seats[SID];
  assert.strictEqual(e.pending, null, 'the pending tail must be cleared');
  assert.strictEqual(e.agreed.offset, fs.statSync(w.L.dest).size);
  assert.strictEqual(e.agreed.prefixSha, T.hashRange(w.L.dest, 0, fs.statSync(w.L.dest).size));
  assert.strictEqual(Jrow(r).result.ok, true);
  assert.strictEqual(Jrow(r).result.advanced, true, 'the row must say the ledger advanced');
  assert.match(r.stderr, /advanced .* the ledger ADVANCED to agree/);
});

test('b258fc2: APPLIED_BUT_DIFFERENT stays a refusal under --apply — nothing advanced, pending kept', () => {
  const w = killedAfterAppend();
  // same length, different bytes: every tail byte "present" by size, the whole-file sha wrong
  const led = T.readLedger(w.stick);
  led.seats[SID].pending.fullSha = 'f'.repeat(64);
  T.writeLedger(w.stick, led);
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  const row = Jrow(r);
  assert.deepStrictEqual([row.verdict, row.reason, row.result], ['REFUSED', 'APPLIED_BUT_DIFFERENT', null]);
  assert.ok(T.readLedger(w.stick).seats[SID].pending, 'a refusal advances nothing');
  assert.strictEqual(r.obj.code, 1);
});

test('result.advanced is true on an ordinary carried import and false on every export', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const exp = J(w.D, ['--stick', w.stick, '--export', '--apply']);
  assert.strictEqual(Jrow(exp).result.advanced, false);
  const imp = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(Jrow(imp).result.advanced, true);
});

test('after the settle, this machine can EXPORT that seat again — the wedge is gone', () => {
  const w = killedAfterAppend();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  fs.appendFileSync(w.L.dest, turns(SID, ['2026-09-14T11:00:00.000Z'], 'l'));
  const old = new Date(Date.now() - 60_000); fs.utimesSync(w.L.dest, old, old);
  const r = J(w.L, ['--stick', w.stick, '--export']);
  assert.strictEqual(Jrow(r).verdict, 'TAIL', 'not REFUSED UNIMPORTED_TAIL');
});

test('the settle puts the seat on the carried receipt, so the launch keeps it', () => {
  const w = killedAfterAppend();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  const rec = JSON.parse(fs.readFileSync(T.carriedPath(w.L.projectsRoot), 'utf8'));
  assert.ok(rec.seats[SID], 'the receipt must name the settled seat');
});

test('the settle rewrites the manifest with the ledger (A-2 on this path too)', () => {
  const w = killedAfterAppend();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(V(w.L, w.stick).code, 0);
});

test('a REHEARSAL over ALREADY_APPLIED still writes nothing', () => {
  const w = killedAfterAppend();
  const before = snapshot(w.dir);
  J(w.L, ['--stick', w.stick, '--import']);
  assert.deepStrictEqual(snapshot(w.dir), before);
});

test('a file that changed between the plan and the apply is NOT settled, and the pending tail stays', () => {
  const w = killedAfterAppend();
  const plan = T.planImport({ stick: w.stick, machine: 'L', projectsRoot: w.L.projectsRoot, instancesRoot: w.L.instancesRoot, panesPath: w.L.panesPath });
  assert.strictEqual(plan.rows.find((x) => x.sid === SID).verdict, 'ALREADY_APPLIED');
  fs.appendFileSync(w.L.dest, 'x');
  const done = T.applyImport(plan, Date.now());
  const d = done.find((x) => x.row.sid === SID);
  assert.strictEqual(d.ok, false);
  assert.match(d.why, /changed between the rehearsal and the apply/);
  assert.ok(T.readLedger(w.stick).seats[SID].pending, 'nothing settled over a file that moved');
});

// ── A-3: one lock, every writer ──

const lockPath = (w) => path.join(w.stick, T.LEDGER_DIR, T.LOCK_NAME);
function plantLock(w, rec) { fs.mkdirSync(path.join(w.stick, T.LEDGER_DIR), { recursive: true }); fs.writeFileSync(lockPath(w), JSON.stringify(rec)); }

test('A-3: a LIVE holder of the named image refuses the write — exit 2, LEDGER_LOCKED, nothing written', () => {
  const w = carried();
  plantLock(w, { pid: 424242, image: 'node', script: 'stick-waiter.js', at: '2026-09-14T08:00:00.000Z' });
  const before = snapshot(w.stick);
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply'], { imageOf: () => 'node' });
  assert.deepStrictEqual([r.code, r.obj.code, r.obj.outcome, r.obj.rows.length], [2, 2, 'LEDGER_LOCKED', 0]);
  assert.match(r.obj.why, /pid 424242/);
  assert.deepStrictEqual(snapshot(w.stick), before, 'refused means refused: the lock, the ledger and every tail untouched');
  assert.strictEqual(fs.existsSync(w.L.dest), false);
});

test('A-3: when the holder cannot be checked (tasklist fails), it is treated as LIVE — never let a second writer through', () => {
  const w = carried();
  plantLock(w, { pid: 424242, image: 'node', script: 'x', at: 'x' });
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply'], { imageOf: () => undefined });
  assert.strictEqual(r.obj.outcome, 'LEDGER_LOCKED');
});

test('A-3: a DEAD holder\'s lock is taken over, the run carries, and staleLock names whose it was', () => {
  const w = carried();
  plantLock(w, { pid: 424242, image: 'node', script: 'stick-apply.js', at: '2026-09-14T08:00:00.000Z' });
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply'], { imageOf: () => null });
  assert.strictEqual(r.obj.outcome, 'CARRIED', r.stderr);
  assert.deepStrictEqual(r.obj.staleLock, { pid: 424242, image: 'node', script: 'stick-apply.js', at: '2026-09-14T08:00:00.000Z' });
  assert.match(r.stderr, /took over a STALE ledger lock: pid 424242/);
});

test('A-3: a pid now running a DIFFERENT image (pid reuse) is a stale lock, not a live one', () => {
  const w = carried();
  plantLock(w, { pid: 424242, image: 'node', script: 'stick-apply.js', at: 'x' });
  const r = J(w.L, ['--stick', w.stick, '--import', '--apply'], { imageOf: () => 'explorer' });
  assert.strictEqual(r.obj.outcome, 'CARRIED', r.stderr);
  assert.strictEqual(r.obj.staleLock.pid, 424242);
});

test('A-3: the lock is released when the run ends — carried, refused or crashed', () => {
  let w = carried();
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(fs.existsSync(lockPath(w)), false, 'after CARRIED');
  w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(fs.existsSync(lockPath(w)), false, 'after STOPPED');
  w = carried();
  const receipt = T.carriedPath(w.L.projectsRoot);
  fs.mkdirSync(path.dirname(receipt), { recursive: true });
  fs.writeFileSync(receipt, '{ broken');
  assert.strictEqual(J(w.L, ['--stick', w.stick, '--import', '--apply']).obj.outcome, 'CRASHED');
  assert.strictEqual(fs.existsSync(lockPath(w)), false, 'after CRASHED');
});

test('A-3: a rehearsal takes no lock — a held lock does not block reading', () => {
  const w = carried();
  plantLock(w, { pid: 424242, image: 'node', script: 'x', at: 'x' });
  const r = J(w.L, ['--stick', w.stick, '--import'], { imageOf: () => 'node' });
  assert.strictEqual(r.obj.outcome, 'REHEARSED');
  assert.ok(fs.existsSync(lockPath(w)), 'and it did not touch the holder\'s lock');
});

test('A-3: an export with nothing to carry still writes nothing — the lock\'s directory goes with it', () => {
  const w = world();
  const r = J(w.D, ['--stick', w.stick, '--export', '--apply']);
  assert.strictEqual(r.obj.outcome, 'NOTHING_TO_DO');
  assert.strictEqual(fs.existsSync(path.join(w.stick, T.LEDGER_DIR)), false);
});

test('A-3: the lost update that wedged a seat cannot happen — the second writer is refused while the first holds the lock', () => {
  // The interleaving measured at the §6 stop: the waiter planned an export, the applier imported, the waiter
  // wrote the ledger it had read. Under the lock the second writer never plans at all.
  const w = carried();
  // The first writer is a planted lock naming another live node process, so the refusal cannot come from
  // the same-process shortcut in holderLive — it has to come from the image check.
  plantLock(w, { pid: 424242, image: 'node', script: 'stick-apply.js', at: '2026-09-14T09:00:00.000Z' });
  const first = { release: () => fs.unlinkSync(lockPath(w)) };
  const second = J(w.L, ['--stick', w.stick, '--export', '--apply'], { imageOf: () => 'node' });
  assert.strictEqual(second.obj.outcome, 'LEDGER_LOCKED');
  first.release();
  assert.strictEqual(fs.existsSync(lockPath(w)), false);
});

// ── the wiring, nothing injected ──

test('the CLI refuses without a direction, and exits 2', () => {
  let code = 0;
  try { execFileSync(process.execPath, [TOOL, '--stick', tmp], { encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { code = e.status; }
  assert.strictEqual(code, 2);
});

test('the CLI refuses an unknown argument rather than guessing', () => {
  let code = 0;
  try { execFileSync(process.execPath, [TOOL, '--yolo'], { encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { code = e.status; }
  assert.strictEqual(code, 2);
});

test('the CLI --help names both directions and --apply', () => {
  const out = execFileSync(process.execPath, [TOOL, '--help'], { encoding: 'utf8' });
  assert.match(out, /--export\|--import/);
  assert.match(out, /--apply/);
  assert.match(out, /--repair <sid>/);
});

// ══ P-DIVERGED (L058, third use) — §2.1-2.4 as re-ruled by §2.8, pane A ══════════════════════════

/**
 * A TRUE FORK, the shape the keeper's 871ad66 choice is about: both machines hold v1 as agreed, then D takes
 * turns and exports them, and L — the importing machine — took different turns of its own on the same prefix.
 */
function forked() {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const dPart = turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  const lPart = turns(SID, ['2026-09-12T09:00:00.000Z'], 'l');
  write(w.D, v1 + dPart);
  write(w.L, v1 + lPart);
  go(w.D, 'export', { apply: true });
  return { w, v1, dPart, lPart };
}

test('P-DIVERGED 2.1: --take-stick is parsed beside --retire-far and --repair, and --help names it', () => {
  const f = forked();
  const r = J(f.w.L, ['--stick', f.w.stick, '--import', '--take-stick', SID]);
  assert.strictEqual(Jrow(r).verdict, 'RETIRE_THEN_APPEND', r.stderr);
  const out = execFileSync(process.execPath, [TOOL, '--help'], { encoding: 'utf8' });
  assert.match(out, /--take-stick <sid>/);
});

test('P-DIVERGED 2.2: a DIVERGED seat named with --take-stick becomes RETIRE_THEN_APPEND, and the rehearsal writes nothing', () => {
  const f = forked();
  assert.strictEqual(Jrow(J(f.w.L, ['--stick', f.w.stick, '--import'])).verdict, 'DIVERGED', 'the fixture is a real fork');
  const before = snapshot(f.w.dir);
  const r = J(f.w.L, ['--stick', f.w.stick, '--import', '--take-stick', SID]);
  wellFormed(r.obj);
  const row = Jrow(r);
  assert.deepStrictEqual([row.verdict, row.stops, row.carries, row.bytes], ['RETIRE_THEN_APPEND', false, true, Buffer.byteLength(f.dPart)]);
  assert.deepStrictEqual(snapshot(f.w.dir), before, 'a rehearsal of a take writes nothing — not the attic, not the seat');
});

test('P-DIVERGED 2.3: the take copies this machine\'s WHOLE file to the attic, truncates to the shared prefix, appends, and verifies whole', () => {
  const f = forked();
  const pend = T.readLedger(f.w.stick).seats[SID].pending;
  const r = J(f.w.L, ['--stick', f.w.stick, '--import', '--take-stick', SID, '--apply']);
  wellFormed(r.obj);
  const row = Jrow(r);
  assert.strictEqual(r.obj.outcome, 'CARRIED', r.stderr);
  assert.strictEqual(fs.readFileSync(f.w.L.dest, 'utf8'), f.v1 + f.dPart, 'the seat continues as the stick\'s future');
  assert.strictEqual(fs.statSync(f.w.L.dest).size, pend.toOffset);
  assert.strictEqual(T.hashRange(f.w.L.dest, 0, pend.toOffset), pend.fullSha);
  const kept = inAttic(f.w.L, 'take-stick');
  assert.strictEqual(kept.length, 1, `one take-stick file in the attic; found ${kept.join(', ')}`);
  assert.strictEqual(fs.readFileSync(path.join(atticDir(f.w.L), kept[0]), 'utf8'), f.v1 + f.lPart,
    'the attic holds this machine\'s WHOLE pre-truncate file, shared prefix included');
  assert.strictEqual(row.result.aside, path.join(atticDir(f.w.L), kept[0]));
  assert.deepStrictEqual([row.result.ok, row.result.advanced], [true, true]);
  assert.deepStrictEqual(besideLive(f.w.L), [], 'nothing left beside the live transcript');
  const e = T.readLedger(f.w.stick).seats[SID];
  assert.deepStrictEqual([e.pending, e.agreed.offset, e.agreed.prefixSha], [null, pend.toOffset, pend.fullSha]);
  assert.strictEqual(Jrow(J(f.w.L, ['--stick', f.w.stick, '--import'])).verdict, 'NOTHING_PENDING', 'falsifier (i): not DIVERGED after the take');
});

test('P-DIVERGED 2.3: a take that is verified goes on the carried receipt, and the manifest is rewritten with the ledger', () => {
  const f = forked();
  J(f.w.L, ['--stick', f.w.stick, '--import', '--take-stick', SID, '--apply']);
  const rec = JSON.parse(fs.readFileSync(T.carriedPath(f.w.L.projectsRoot), 'utf8'));
  assert.ok(rec.seats[SID], 'the launch must keep the seat it was just handed');
  assert.strictEqual(V(f.w.L, f.w.stick).code, 0);
});

test('P-DIVERGED 2.3: a take whose attic copy does not read back equal truncates NOTHING — the fork stays whole, the run FAILS', () => {
  const f = forked();
  // The tool shares this process's `fs`; the copy is made short for this one call, then restored.
  const real = fs.copyFileSync;
  fs.copyFileSync = (a, b) => { real(a, b); fs.truncateSync(b, 10); };
  let r;
  try { r = J(f.w.L, ['--stick', f.w.stick, '--import', '--take-stick', SID, '--apply']); }
  finally { fs.copyFileSync = real; }
  const row = Jrow(r);
  assert.deepStrictEqual([r.obj.outcome, row.result.ok], ['FAILED', false], r.stderr);
  assert.match(row.result.why, /did not read back equal/);
  assert.strictEqual(fs.readFileSync(f.w.L.dest, 'utf8'), f.v1 + f.lPart, 'this machine\'s future is untouched');
  assert.ok(T.readLedger(f.w.stick).seats[SID].pending, 'nothing agreed');
});

test('P-DIVERGED 2.2: --take-stick on a seat that is NOT DIVERGED leaves its verdict unchanged, and takes nothing', () => {
  // APPEND
  let w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1); go(w.D, 'export', { apply: true }); go(w.L, 'import', { apply: true });
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  write(w.D, v2); go(w.D, 'export', { apply: true });
  assert.strictEqual(Jrow(J(w.L, ['--stick', w.stick, '--import', '--take-stick', SID])).verdict, 'APPEND');
  // INTERRUPTED — named for a take, it stays INTERRUPTED and --apply writes nothing to it
  const half = v1.length + Math.floor((v2.length - v1.length) / 2);
  write(w.L, v2.slice(0, half));
  const r = J(w.L, ['--stick', w.stick, '--import', '--take-stick', SID, '--apply']);
  assert.strictEqual(Jrow(r).verdict, 'INTERRUPTED');
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), v2.slice(0, half));
  assert.strictEqual(inAttic(w.L, 'take-stick').length, 0);
  // REFUSED OTHER_CONVERSATION
  w = world();
  write(w.D, v1); write(w.L, conversation(SID, ['2026-09-14T06:36:37.000Z'], 'own'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const o = Jrow(J(w.L, ['--stick', w.stick, '--import', '--take-stick', SID, '--apply']));
  assert.deepStrictEqual([o.verdict, o.reason], ['REFUSED', 'OTHER_CONVERSATION']);
  assert.strictEqual(inAttic(w.L, 'take-stick').length, 0);
});

test('P-DIVERGED 2.4: takeable and ownBytes — true and this machine\'s own bytes on DIVERGED; null elsewhere', () => {
  const f = forked();
  const pend = T.readLedger(f.w.stick).seats[SID].pending;
  const d = Jrow(J(f.w.L, ['--stick', f.w.stick, '--import']));
  assert.deepStrictEqual([d.verdict, d.takeable, d.ownBytes], ['DIVERGED', true, Buffer.byteLength(f.lPart)]);
  assert.strictEqual(d.ownBytes, fs.statSync(f.w.L.dest).size - pend.offset);
  // D-7: a DIVERGED row names the stick's tail it would take, so the window has both counts
  assert.deepStrictEqual([d.carries, d.bytes], [false, pend.bytes]);
  const t = Jrow(J(f.w.L, ['--stick', f.w.stick, '--import', '--take-stick', SID]));
  assert.deepStrictEqual([t.takeable, t.ownBytes], [null, Buffer.byteLength(f.lPart)]);
  const e = Jrow(J(f.w.D, ['--stick', f.w.stick, '--export']));
  assert.deepStrictEqual([e.takeable, e.ownBytes], [null, null], 'export rows carry neither');
  const ours = Jrow(J(f.w.D, ['--stick', f.w.stick, '--import']));
  assert.deepStrictEqual([ours.verdict, ours.takeable, ours.ownBytes], ['OURS', null, null]);
});

test('P-DIVERGED D-7: RETIRE_THEN_APPEND is in CARRIES.import, and nothing that is not a take joined it', () => {
  assert.deepStrictEqual(T.CARRIES.import, ['APPEND', 'FULL', 'REPAIR', 'RETIRE_THEN_FULL', 'RETIRE_THEN_APPEND']);
});

/** C's probe case B, as a delta: L holds exactly the carried tail on the agreed prefix, the ledger still pending. */
function killedAfterDeltaAppend() {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1); go(w.D, 'export', { apply: true }); go(w.L, 'import', { apply: true });
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z', '2026-09-12T04:21:00.000Z'], 'd');
  write(w.D, v2); go(w.D, 'export', { apply: true });
  write(w.L, v2);                                   // the append landed; the ledger write did not
  return { w, v1, v2, own: turns(SID, ['2026-09-14T11:00:00.000Z'], 'l') };
}

test('P-DIVERGED D-1: the carried tail already here AND this machine grew past it reads APPLIED_AND_GREW, not DIVERGED', () => {
  const k = killedAfterDeltaAppend();
  assert.strictEqual(Jrow(J(k.w.L, ['--stick', k.w.stick, '--import'])).verdict, 'ALREADY_APPLIED', 'before growth');
  write(k.w.L, k.v2 + k.own);
  const r = J(k.w.L, ['--stick', k.w.stick, '--import']);
  wellFormed(r.obj);
  const row = Jrow(r);
  assert.deepStrictEqual([row.verdict, row.stops, row.carries, row.takeable, row.ownBytes],
    ['APPLIED_AND_GREW', false, false, null, Buffer.byteLength(k.own)]);
  assert.strictEqual(r.obj.code, 0, 'not a stop');
});

test('P-DIVERGED D-1: APPLIED_AND_GREW SETTLES under --apply — agreed at the tail\'s end, pending cleared, the seat\'s file untouched', () => {
  const k = killedAfterDeltaAppend();
  write(k.w.L, k.v2 + k.own);
  const pend = T.readLedger(k.w.stick).seats[SID].pending;
  const fileBefore = fs.readFileSync(k.w.L.dest);
  const r = J(k.w.L, ['--stick', k.w.stick, '--import', '--apply']);
  const row = Jrow(r);
  assert.strictEqual(r.obj.outcome, 'CARRIED', r.stderr);
  assert.deepStrictEqual([row.result.ok, row.result.advanced], [true, true]);
  assert.ok(fs.readFileSync(k.w.L.dest).equals(fileBefore), 'nothing is written to the seat\'s file');
  const e = T.readLedger(k.w.stick).seats[SID];
  assert.deepStrictEqual([e.pending, e.agreed.offset, e.agreed.prefixSha], [null, pend.toOffset, pend.fullSha]);
  assert.strictEqual(inAttic(k.w.L, 'take-stick').length, 0);
  // this machine's later turns now export as an ordinary TAIL from the tail's end
  const x = Jrow(J(k.w.L, ['--stick', k.w.stick, '--export']));
  assert.deepStrictEqual([x.verdict, x.offset, x.bytes], ['TAIL', pend.toOffset, Buffer.byteLength(k.own)]);
});

test('P-DIVERGED D-1: --take-stick named on APPLIED_AND_GREW does not truncate this machine\'s later turns', () => {
  const k = killedAfterDeltaAppend();
  write(k.w.L, k.v2 + k.own);
  const row = Jrow(J(k.w.L, ['--stick', k.w.stick, '--import', '--take-stick', SID, '--apply']));
  assert.strictEqual(row.verdict, 'APPLIED_AND_GREW');
  assert.strictEqual(fs.readFileSync(k.w.L.dest, 'utf8'), k.v2 + k.own);
});

test('P-DIVERGED D-1: a file whose carried span changed between the plan and the apply is NOT settled', () => {
  const k = killedAfterDeltaAppend();
  write(k.w.L, k.v2 + k.own);
  const plan = T.planImport({ stick: k.w.stick, machine: 'L', projectsRoot: k.w.L.projectsRoot, instancesRoot: k.w.L.instancesRoot, panesPath: k.w.L.panesPath });
  assert.strictEqual(plan.rows.find((x) => x.sid === SID).verdict, 'APPLIED_AND_GREW');
  const buf = fs.readFileSync(k.w.L.dest); buf[k.v1.length + 5] ^= 1; fs.writeFileSync(k.w.L.dest, buf);
  const done = T.applyImport(plan, Date.now());
  assert.strictEqual(done.find((x) => x.row.sid === SID).ok, false);
  assert.ok(T.readLedger(k.w.stick).seats[SID].pending, 'nothing settled over a file that moved');
});

test('P-DIVERGED D-1: a real fork one byte longer than the tail is still DIVERGED — the new verdict needs the whole sha', () => {
  const k = killedAfterDeltaAppend();
  const forkedLong = k.v1 + turns(SID, ['2026-09-12T09:00:00.000Z', '2026-09-12T09:01:00.000Z', '2026-09-12T09:02:00.000Z'], 'l');
  assert.ok(forkedLong.length > k.v2.length, 'the fixture must be longer than the carried file');
  write(k.w.L, forkedLong);
  assert.strictEqual(Jrow(J(k.w.L, ['--stick', k.w.stick, '--import'])).verdict, 'DIVERGED');
});

// ── the three debts, each red-first ──

test('P-DIVERGED debt (a): a NOTHING_PENDING row reads this machine\'s file — localSize and localFirstTimestamp are not null', () => {
  const w = world();
  write(w.L, conversation(SID, ['2026-09-10T01:02:03.004Z']));
  const row = Jrow(J(w.L, ['--stick', w.stick, '--import']));
  assert.deepStrictEqual([row.verdict, row.localSize, row.localFirstTimestamp],
    ['NOTHING_PENDING', fs.statSync(w.L.dest).size, '2026-09-10T01:02:03.004Z']);
});

test('P-DIVERGED debt (a): an OURS row reads this machine\'s file too (the reopen after this machine\'s own export)', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-10T01:02:03.004Z']));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const row = Jrow(J(w.D, ['--stick', w.stick, '--import']));
  assert.deepStrictEqual([row.verdict, row.localFirstTimestamp], ['OURS', '2026-09-10T01:02:03.004Z']);
});

test('P-DIVERGED debt (a): with no file here, NOTHING_PENDING still reports null — never a guessed 0', () => {
  const w = world();
  const row = Jrow(J(w.L, ['--stick', w.stick, '--import']));
  assert.deepStrictEqual([row.verdict, row.localSize, row.localFirstTimestamp], ['NOTHING_PENDING', null, null]);
});

test('P-DIVERGED debt (b): right after this machine\'s own FULL export, its export rehearsal carries nothing', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const r = J(w.D, ['--stick', w.stick, '--export']);
  const row = Jrow(r);
  assert.deepStrictEqual([row.verdict, row.carries, row.bytes], ['UP_TO_DATE', false, 0], r.stderr);
  assert.strictEqual(r.obj.outcome, 'NOTHING_TO_DO', 'the reopen must not read "the stick does not have your last session"');
});

test('P-DIVERGED debt (b): right after this machine\'s own DELTA export, its export rehearsal carries nothing', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1); J(w.D, ['--stick', w.stick, '--export', '--apply']); J(w.L, ['--stick', w.stick, '--import', '--apply']);
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const row = Jrow(J(w.D, ['--stick', w.stick, '--export']));
  assert.deepStrictEqual([row.verdict, row.carries], ['UP_TO_DATE', false]);
});

test('P-DIVERGED debt (b): rewritten at the SAME size after its own export, the file is not "already on the stick" — the sha decides', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1); J(w.D, ['--stick', w.stick, '--export', '--apply']); J(w.L, ['--stick', w.stick, '--import', '--apply']);
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd');
  write(w.D, v2); J(w.D, ['--stick', w.stick, '--export', '--apply']);
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'x'));     // same length, different bytes after the agreed state
  assert.strictEqual(fs.statSync(w.D.dest).size, v2.length, 'the fixture must keep the length');
  const row = Jrow(J(w.D, ['--stick', w.stick, '--export']));
  assert.deepStrictEqual([row.verdict, row.offset], ['TAIL', v1.length]);
});

test('P-DIVERGED debt (b): grown past its own pending tail, the export re-carries from the AGREED state and the far import lands whole', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1); J(w.D, ['--stick', w.stick, '--export', '--apply']); J(w.L, ['--stick', w.stick, '--import', '--apply']);
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd');
  write(w.D, v2); J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const v3 = v2 + turns(SID, ['2026-09-12T05:00:00.000Z'], 'e');
  write(w.D, v3);
  const x = Jrow(J(w.D, ['--stick', w.stick, '--export', '--apply']));
  assert.deepStrictEqual([x.verdict, x.offset, x.toOffset], ['TAIL', v1.length, v3.length],
    'the far machine has not imported the first tail, so the new one starts where it agrees: the agreed state');
  const imp = J(w.L, ['--stick', w.stick, '--import', '--apply']);
  assert.strictEqual(Jrow(imp).verdict, 'APPEND', imp.stderr);
  assert.strictEqual(fs.readFileSync(w.L.dest, 'utf8'), v3);
});

test('P-DIVERGED debt (c): the HANDOFF for a DELTA does not promise APPEND — it says when it is APPEND and when DIVERGED', () => {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z']);
  write(w.D, v1); J(w.D, ['--stick', w.stick, '--export', '--apply']); J(w.L, ['--stick', w.stick, '--import', '--apply']);
  write(w.D, v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd'));
  J(w.D, ['--stick', w.stick, '--export', '--apply']);
  const text = T.renderHandoff(T.readLedger(w.stick));
  assert.doesNotMatch(text, /expected at the far end: APPEND \(a tail on the agreed state\)/);
  assert.match(text, /expected at the far end: APPEND if that machine has written nothing of its own to this seat since the agreed state/);
  assert.match(text, /DIVERGED if it has — the keeper chooses there/);
  assert.match(T.renderHandoff({ seats: { [SID]: { seat: 'x', pending: { offset: 0, toOffset: 5, bytes: 5, from: 'D', at: '2026-09-12T00:00:00.000Z', tailFile: 't', tailSha: 's' } } } }),
    /expected at the far end: FULL/, 'a whole conversation is still FULL');
});


// ── D067 P-CARRY-EXCLUDE: a directory carry that leaves build output behind, BY SIGNATURE ──
//
// The 312 MB (408 MB allocated on the exFAT stick) that rode to work on 09-14 was a Cargo `target/`
// inside a pane's scratch folder, copied by hand. These tests pin the rule that would have left it:
// a directory is excluded because it SAYS it is a cache (CACHEDIR.TAG, first 43 octets exact) or an
// installed dependency tree (a package manager's own marker inside node_modules) — never because of
// its NAME. A folder that merely shares the name is carried, and flagged so a person can look.

function dirWorld() {
  const root = path.join(tmp, 'dir' + (++seq));
  const src = path.join(root, 'scratch');
  const put = (rel, body) => {
    const p = path.join(src, ...rel.split('/'));
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
    return p;
  };
  return { root, src, dest: path.join(root, 'on-stick', 'scratch'), put };
}
const TAG = 'Signature: 8a477f597d28d172789f06886806bc55\n# a cache directory tag\n';

test('carry-dir: a directory carrying a valid CACHEDIR.TAG is excluded WHATEVER its name, with its entries and bytes counted', () => {
  const d = dirWorld();
  d.put('cell.jsonl', 'kept\n');
  d.put('build-out/CACHEDIR.TAG', TAG);
  d.put('build-out/release/app.exe', 'x'.repeat(1000));
  d.put('build-out/release/deps/a.rlib', 'y'.repeat(500));
  const p = T.planDirCarry(d.src);
  assert.deepStrictEqual(p.files.map((f) => f.rel), ['cell.jsonl'], 'only the real work is carried');
  assert.strictEqual(p.excluded.length, 1);
  assert.strictEqual(p.excluded[0].rel, 'build-out');
  assert.match(p.excluded[0].reason, /CACHEDIR\.TAG/);
  // entries: the excluded root and everything beneath it — build-out, CACHEDIR.TAG, release, app.exe, deps, a.rlib
  assert.strictEqual(p.excluded[0].entries, 6);
  assert.strictEqual(p.excluded[0].bytes, TAG.length + 1000 + 500);
  assert.strictEqual(p.excludedEntries, 6);
  assert.strictEqual(p.excludedBytes, TAG.length + 1500);
});

test('carry-dir: THE NAMED RISK — a folder called target with no tag is CARRIED, and flagged, not excluded', () => {
  const d = dirWorld();
  d.put('target/my-notes.md', 'real work that happens to live in a folder called target\n');
  const p = T.planDirCarry(d.src);
  assert.deepStrictEqual(p.files.map((f) => f.rel), ['target/my-notes.md'], 'the name alone must never exclude');
  assert.strictEqual(p.excluded.length, 0);
  assert.deepStrictEqual(p.suspects.map((s) => s.rel), ['target'], 'but a person is told to look');
});

test('carry-dir: a CACHEDIR.TAG that does not BEGIN with the 43-octet signature does not exclude', () => {
  const d = dirWorld();
  d.put('target/CACHEDIR.TAG', ' ' + TAG);            // one leading space: the spec says no characters before the S
  d.put('target/keep.txt', 'k');
  d.put('other/CACHEDIR.TAG', 'Signature: 8a477f597d28d172789f06886806bc5');   // one octet short
  d.put('other/keep.txt', 'k');
  const p = T.planDirCarry(d.src);
  assert.strictEqual(p.excluded.length, 0, JSON.stringify(p.excluded));
  assert.ok(p.files.some((f) => f.rel === 'target/keep.txt'));
  assert.ok(p.files.some((f) => f.rel === 'other/keep.txt'));
});

test('carry-dir: node_modules is excluded only with a package-manager marker inside; without one it is carried and flagged', () => {
  const d = dirWorld();
  d.put('a/node_modules/.package-lock.json', '{}');
  d.put('a/node_modules/left-pad/index.js', 'module.exports=1');
  d.put('b/node_modules/handwritten.js', 'real');
  const p = T.planDirCarry(d.src);
  assert.deepStrictEqual(p.excluded.map((e) => e.rel), ['a/node_modules']);
  assert.match(p.excluded[0].reason, /\.package-lock\.json/);
  assert.ok(p.files.some((f) => f.rel === 'b/node_modules/handwritten.js'), 'no marker: carried');
  assert.deepStrictEqual(p.suspects.map((s) => s.rel), ['b/node_modules']);
});

test('carry-dir: the summary line is exact, and it prints when NOTHING was excluded — a rule nobody can see firing is silent', () => {
  const d = dirWorld();
  d.put('only.txt', 'abc');
  const p = T.planDirCarry(d.src);
  assert.strictEqual(p.line, 'excluded 0 entries, 0 bytes');
  const d2 = dirWorld();
  d2.put('t/CACHEDIR.TAG', TAG);
  assert.strictEqual(T.planDirCarry(d2.src).line, `excluded 2 entries, ${TAG.length} bytes`);
  const q = quiet();
  const r = T.run({ out: q.out, carryDir: d2.src, to: d2.dest });
  assert.ok(q.lines.includes(`excluded 2 entries, ${TAG.length} bytes`), q.text());
  assert.strictEqual(r.code, 0);
});

test('carry-dir: an excluded directory nested deep inside is still excluded, and nothing beneath it is listed', () => {
  const d = dirWorld();
  d.put('logs/run.txt', 'l');
  d.put('seatcwd/proj/target/CACHEDIR.TAG', TAG);
  d.put('seatcwd/proj/target/debug/huge.bin', 'z'.repeat(2048));
  d.put('seatcwd/proj/src/main.rs', 'fn main(){}');
  const p = T.planDirCarry(d.src);
  assert.deepStrictEqual(p.excluded.map((e) => e.rel), ['seatcwd/proj/target']);
  assert.deepStrictEqual(p.files.map((f) => f.rel).sort(), ['logs/run.txt', 'seatcwd/proj/src/main.rs']);
  assert.ok(!p.files.some((f) => f.rel.startsWith('seatcwd/proj/target/')));
});

test('carry-dir: without --apply it is a rehearsal — the destination is not created', () => {
  const d = dirWorld();
  d.put('a.txt', 'a');
  d.put('target/CACHEDIR.TAG', TAG);
  const q = quiet();
  const r = T.run({ out: q.out, carryDir: d.src, to: d.dest });
  assert.strictEqual(r.outcome, 'REHEARSED');
  assert.strictEqual(fs.existsSync(d.dest), false, 'a rehearsal wrote the destination');
  assert.strictEqual(fs.existsSync(path.dirname(d.dest)), false, 'nor its parent');
});

test('carry-dir --apply copies the kept files byte for byte, none of the excluded ones, and leaves the source untouched', () => {
  const d = dirWorld();
  d.put('cellA.jsonl', '{"a":1}\n');
  d.put('logs/x.log', 'log line\n');
  d.put('target/CACHEDIR.TAG', TAG);
  d.put('target/release/big.exe', 'q'.repeat(4096));
  const before = snapshot(d.src);
  const q = quiet();
  const r = T.run({ out: q.out, carryDir: d.src, to: d.dest, apply: true });
  assert.strictEqual(r.outcome, 'CARRIED', q.text());
  assert.strictEqual(r.code, 0);
  assert.strictEqual(fs.readFileSync(path.join(d.dest, 'cellA.jsonl'), 'utf8'), '{"a":1}\n');
  assert.strictEqual(fs.readFileSync(path.join(d.dest, 'logs', 'x.log'), 'utf8'), 'log line\n');
  assert.strictEqual(fs.existsSync(path.join(d.dest, 'target')), false, 'the excluded directory was carried');
  assert.deepStrictEqual(snapshot(d.src), before, 'the source moved');
});

test('carry-dir --apply refuses when the destination already exists, and writes nothing into it', () => {
  const d = dirWorld();
  d.put('a.txt', 'a');
  fs.mkdirSync(d.dest, { recursive: true });
  fs.writeFileSync(path.join(d.dest, 'already.txt'), 'someone else');
  const q = quiet();
  const r = T.run({ out: q.out, carryDir: d.src, to: d.dest, apply: true });
  assert.strictEqual(r.outcome, 'CANNOT_RUN', q.text());
  assert.strictEqual(r.code, T.EXIT.RAN_NOT);
  assert.match(r.why || '', /already exists/, 'refused, but not because the destination exists: ' + (r.why || ''));
  assert.deepStrictEqual(fs.readdirSync(d.dest), ['already.txt']);
});

test('carry-dir on the CLI prints ONE json object naming the excluded roots and the suspects', () => {
  const d = dirWorld();
  d.put('a.txt', 'a');
  d.put('target/CACHEDIR.TAG', TAG);
  d.put('node_modules/mine.js', 'm');
  const w = world();
  const res = J(w.L, ['--carry-dir', d.src, '--to', d.dest]);
  assert.strictEqual(res.code, 0, res.stderr);
  assert.strictEqual(res.obj.mode, 'carry-dir');
  assert.strictEqual(res.obj.outcome, 'REHEARSED');
  assert.strictEqual(res.obj.excludedEntries, 2);
  assert.deepStrictEqual(res.obj.excluded.map((e) => e.rel), ['target']);
  assert.deepStrictEqual(res.obj.suspects.map((s) => s.rel), ['node_modules']);
});

// ── D067 P-PRUNE: tails below the agreed offset, LISTED first, deleted only on a second flag ──
//
// A tail file `<sid>.<from>-<to>.tail` whose `to` is at or below the ledger's agreed offset holds bytes
// both machines already agree on. The door lists them; it deletes only when handed back the DIGEST of
// the listing a person read, so nothing is deleted that was not on the page they read. Everything that
// is NOT a candidate is listed with its reason — silence about a file is the failure this room keeps
// finding under rocks.

/** Two rounds of D -> L, leaving two tails below agreed: exactly how the stick accumulated 81. */
function agreedTwice() {
  const w = world();
  const v1 = conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']);
  write(w.D, v1);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  const v2 = v1 + turns(SID, ['2026-09-12T04:20:00.000Z'], 'd');
  write(w.D, v2);
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });
  return { w, v1, v2 };
}
const tailsDir = (w) => path.join(w.stick, T.LEDGER_DIR);
const P = (m, extra) => { const q = quiet(); const r = T.run(Object.assign({ out: q.out, stick: m.stick, prune: true, machine: m.machine,
  projectsRoot: m.projectsRoot, instancesRoot: m.instancesRoot, panesPath: m.panesPath }, extra || {})); r.text = q.text(); return r; };

test('prune: after two agreed carries both tails are candidates, and the listing deletes NOTHING', () => {
  const { w, v1, v2 } = agreedTwice();
  const before = snapshot(w.stick);
  const r = P(w.L);
  assert.strictEqual(r.outcome, 'LISTED', r.text);
  assert.strictEqual(r.code, 0);
  assert.deepStrictEqual(r.prune.candidates.map((c) => c.name).sort(),
    [`${SID}.0-${v1.length}.tail`, `${SID}.${v1.length}-${v2.length}.tail`].sort());
  assert.strictEqual(r.prune.bytes, v2.length);
  assert.match(r.prune.digest, /^[0-9a-f]{16}$/);
  assert.deepStrictEqual(snapshot(w.stick), before, 'a listing changed the stick');
});

test('prune: the ledger, a torn .writing- file and a corrupt-ledger copy are never candidates, and each is LISTED with its reason', () => {
  const { w, v1 } = agreedTwice();
  fs.writeFileSync(path.join(tailsDir(w), `${SID}.0-${v1.length}.tail.writing-4242`), 'torn');
  fs.writeFileSync(path.join(tailsDir(w), `${T.LEDGER_NAME}.corrupt-20260915T084005`), '{');
  const r = P(w.L);
  const names = r.prune.candidates.map((c) => c.name);
  for (const n of [T.LEDGER_NAME, `${SID}.0-${v1.length}.tail.writing-4242`, `${T.LEDGER_NAME}.corrupt-20260915T084005`]) {
    assert.ok(!names.includes(n), `${n} became a candidate`);
    assert.ok(r.prune.notCandidates.some((x) => x.name === n && x.why), `${n} was not listed with a reason`);
  }
});

test('prune: a tail ABOVE the agreed offset (a pending carry) is not a candidate', () => {
  const { w, v2 } = agreedTwice();
  write(w.D, v2 + turns(SID, ['2026-09-13T01:00:00.000Z'], 'e'));
  go(w.D, 'export', { apply: true });                        // pending, not yet imported
  const pend = T.readLedger(w.stick).seats[SID].pending;
  assert.ok(pend && pend.tailFile, 'fixture: a pending tail exists');
  const r = P(w.L);
  assert.ok(!r.prune.candidates.some((c) => c.name === pend.tailFile), 'the pending tail was listed for deletion');
  assert.ok(r.prune.notCandidates.some((x) => x.name === pend.tailFile));
});

test('prune: a tail for a seat the ledger does not know is not a candidate', () => {
  const { w } = agreedTwice();
  const stranger = 'bbbbbbbb-2222-4222-8222-222222222222';
  fs.writeFileSync(path.join(tailsDir(w), `${stranger}.0-10.tail`), '0123456789');
  const r = P(w.L);
  assert.ok(!r.prune.candidates.some((c) => c.sid === stranger));
  assert.ok(r.prune.notCandidates.some((x) => x.name === `${stranger}.0-10.tail` && /ledger/.test(x.why)));
});

test('prune: a below-agreed tail the transfer MANIFEST names is not a candidate', () => {
  const { w, v1 } = agreedTwice();
  const name = `${SID}.0-${v1.length}.tail`;
  const dir = path.join(w.stick, T.TRANSFER_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const abs = path.join(tailsDir(w), name);
  fs.writeFileSync(path.join(dir, T.MANIFEST_NAME), JSON.stringify({ format: 1, members: [
    { path: `${T.LEDGER_DIR}/${name}`, bytes: fs.statSync(abs).size, sha256: T.hashRange(abs, 0, fs.statSync(abs).size) }] }));
  const r = P(w.L);
  assert.ok(!r.prune.candidates.some((c) => c.name === name), 'a manifest member was listed for deletion');
  assert.ok(r.prune.notCandidates.some((x) => x.name === name && /manifest/.test(x.why)));
});

test('prune: THIS machine must PROVE it holds the agreed bytes — a local transcript that disagrees makes its tails non-candidates', () => {
  const { w, v2 } = agreedTwice();
  write(w.L, 'X' + v2.slice(1));                               // same length, different first byte
  const r = P(w.L);
  assert.strictEqual(r.prune.candidates.length, 0, 'deleted bytes this machine cannot show it holds');
  assert.ok(r.prune.notCandidates.every((x) => !/\.tail$/.test(x.name) || /cannot show|prefix/.test(x.why)), r.text);
  const gone = world();                                        // and a machine with no transcript at all
  const r2 = P(Object.assign({}, gone.L, { stick: w.stick }));
  assert.strictEqual(r2.prune.candidates.length, 0);
});

test('prune --delete-listed <digest> deletes EXACTLY the listed candidates and nothing else on the stick', () => {
  const { w } = agreedTwice();
  fs.writeFileSync(path.join(tailsDir(w), 'unrelated.txt'), 'keep me');
  const listed = P(w.L);
  const keepBefore = Object.fromEntries(Object.entries(snapshot(w.stick))
    .filter(([p]) => !listed.prune.candidates.some((c) => p.endsWith(path.sep + c.name))));
  const r = P(w.L, { deleteListed: listed.prune.digest });
  assert.strictEqual(r.outcome, 'PRUNED', r.text);
  assert.strictEqual(r.code, 0);
  for (const c of listed.prune.candidates) assert.strictEqual(fs.existsSync(path.join(tailsDir(w), c.name)), false, `${c.name} survived`);
  assert.deepStrictEqual(snapshot(w.stick), keepBefore, 'something not on the listing changed');
});

test('prune --delete-listed with a digest that does not match the listing NOW refuses and deletes nothing', () => {
  const { w } = agreedTwice();
  const listed = P(w.L);
  const before = snapshot(w.stick);
  const r = P(w.L, { deleteListed: '0000000000000000' });
  assert.strictEqual(r.outcome, 'LISTING_CHANGED', r.text);
  assert.notStrictEqual(r.code, 0);
  assert.deepStrictEqual(snapshot(w.stick), before);
  assert.match(r.text, new RegExp(listed.prune.digest), 'the refusal names the digest of the listing as it stands');
});

test('prune: a new candidate appearing after the listing was read makes the old digest refuse', () => {
  const { w, v2 } = agreedTwice();
  const listed = P(w.L);
  write(w.D, v2 + turns(SID, ['2026-09-13T01:00:00.000Z'], 'e'));
  go(w.D, 'export', { apply: true });
  go(w.L, 'import', { apply: true });                        // a third tail is now below agreed
  const before = snapshot(w.stick);
  const r = P(w.L, { deleteListed: listed.prune.digest });
  assert.strictEqual(r.outcome, 'LISTING_CHANGED', r.text);
  assert.deepStrictEqual(snapshot(w.stick), before, 'deleted against a listing nobody read');
});

test('prune refuses on an unreadable ledger and deletes nothing', () => {
  const { w } = agreedTwice();
  const listed = P(w.L);
  fs.writeFileSync(path.join(tailsDir(w), T.LEDGER_NAME), '{ not json');
  const before = snapshot(w.stick);
  const r = P(w.L, { deleteListed: listed.prune.digest });
  assert.strictEqual(r.outcome, 'CANNOT_RUN', r.text);
  assert.strictEqual(r.code, T.EXIT.RAN_NOT);
  assert.deepStrictEqual(snapshot(w.stick), before);
});

test('prune --delete-listed refuses while another live process holds the ledger lock', () => {
  const { w } = agreedTwice();
  const listed = P(w.L);
  plantLock(w, { pid: 4242, image: 'node.exe', script: 'tail-carry.js', at: new Date().toISOString() });
  const before = snapshot(w.stick);
  const r = P(w.L, { deleteListed: listed.prune.digest, imageOf: () => 'node.exe' });
  assert.notStrictEqual(r.outcome, 'PRUNED', r.text);
  assert.deepStrictEqual(snapshot(w.stick), before);
});

test('prune on the CLI: --delete-listed ALONE does nothing, and the prune does not combine with --import, --export or --apply', () => {
  const { w } = agreedTwice();
  const listed = P(w.L);
  const before = snapshot(w.stick);
  for (const argv of [
    ['--stick', w.stick, '--delete-listed', listed.prune.digest],
    ['--stick', w.stick, '--prune-below-agreed', '--import', '--delete-listed', listed.prune.digest],
    ['--stick', w.stick, '--prune-below-agreed', '--export'],
    ['--stick', w.stick, '--prune-below-agreed', '--apply'],
  ]) {
    const res = J(w.L, argv);
    assert.strictEqual(res.code, T.EXIT.RAN_NOT, `${argv.join(' ')} -> ${res.code}`);
    assert.deepStrictEqual(snapshot(w.stick), before, `${argv.join(' ')} changed the stick`);
  }
  const ok = J(w.L, ['--stick', w.stick, '--prune-below-agreed']);
  assert.strictEqual(ok.code, 0);
  assert.strictEqual(ok.obj.mode, 'prune-below-agreed');
  assert.strictEqual(ok.obj.digest, listed.prune.digest);
});


// ── D067, added AFTER the first mutant run — each test below exists because a named mutant survived it ──
// (`handback/p-carry-exclude-C_2026-09-16.md` §4 has run 1's survivors; these close them.)

test('carry-dir: at ZERO excluded the command itself still PRINTS the line (mutant #5 survived the plan-only check)', () => {
  const d = dirWorld();
  d.put('only.txt', 'abc');
  const q = quiet();
  T.run({ out: q.out, carryDir: d.src, to: d.dest });
  assert.ok(q.lines.includes('excluded 0 entries, 0 bytes'), `the zero line was not printed:\n${q.text()}`);
});

test('prune: a tail ABOVE agreed that is NOT pending — the first of two exports before an import — is never a candidate (mutant #9: it would be deleted holding unagreed bytes)', () => {
  const { w, v2 } = agreedTwice();
  const v3 = v2 + turns(SID, ['2026-09-13T01:00:00.000Z'], 'e');
  write(w.D, v3);
  go(w.D, 'export', { apply: true });                        // pending: agreed -> v3
  const first = T.readLedger(w.stick).seats[SID].pending.tailFile;
  write(w.D, v3 + turns(SID, ['2026-09-13T02:00:00.000Z'], 'f'));
  go(w.D, 'export', { apply: true });                        // the SAME machine again: pending replaced, `first` orphaned
  const led = T.readLedger(w.stick).seats[SID];
  assert.notStrictEqual(led.pending.tailFile, first, 'fixture: the second export replaced the pending tail');
  assert.ok(fs.existsSync(path.join(tailsDir(w), first)), 'fixture: the first tail is still on the stick');
  const r = P(w.L);
  assert.ok(!r.prune.candidates.some((c) => c.name === first), 'an unagreed, un-pending tail was listed for deletion');
  assert.ok(r.prune.notCandidates.some((x) => x.name === first && /above the agreed/.test(x.why)), r.text);
});

test('prune: a pending tail whose range sits AT OR BELOW agreed is never a candidate — a ledger no current writer produces, but a hand-repaired or corrupt one can (mutant #10)', () => {
  const { w, v1 } = agreedTwice();
  const name = `${SID}.0-${v1.length}.tail`;
  const led = T.readLedger(w.stick);
  led.seats[SID].pending = { from: 'D', offset: 0, toOffset: v1.length, tailFile: name, tailSha: 'x', fullSha: 'y', bytes: v1.length, at: new Date().toISOString() };
  fs.writeFileSync(path.join(tailsDir(w), T.LEDGER_NAME), JSON.stringify(led, null, 2));
  const r = P(w.L);
  assert.ok(!r.prune.candidates.some((c) => c.name === name), 'a tail the ledger names as pending was listed for deletion');
  assert.ok(r.prune.notCandidates.some((x) => x.name === name && /pending/.test(x.why)), r.text);
});

test('prune: a transcript SHORTER than the agreed offset keeps that seat\'s tails and the listing still runs (mutant #14: hashRange throws past EOF and would refuse the whole prune)', () => {
  const { w, v2 } = agreedTwice();
  write(w.L, v2.slice(0, 10));
  const r = P(w.L);
  assert.strictEqual(r.outcome, 'LISTED', r.text);
  assert.strictEqual(r.prune.candidates.length, 0);
  assert.ok(r.prune.notCandidates.some((x) => /\.tail$/.test(x.name) && /transcript is 10 B/.test(x.why)), r.text);
});

test('prune: a candidate that CHANGED SIZE since the listing was read makes the old digest refuse (the digest carries size)', () => {
  const { w, v1 } = agreedTwice();
  const listed = P(w.L);
  fs.writeFileSync(path.join(tailsDir(w), `${SID}.0-${v1.length}.tail`), 'torn');
  const before = snapshot(w.stick);
  const r = P(w.L, { deleteListed: listed.prune.digest });
  assert.strictEqual(r.outcome, 'LISTING_CHANGED', r.text);
  assert.deepStrictEqual(snapshot(w.stick), before, 'deleted a file that was not the one read');
});

test('prune: --delete-listed on its own refuses BY ITS OWN RULE, not by an unrelated one', () => {
  const { w } = agreedTwice();
  const listed = P(w.L);
  const q = quiet();
  const r = T.run({ out: q.out, stick: w.stick, deleteListed: listed.prune.digest });
  assert.strictEqual(r.code, T.EXIT.RAN_NOT);
  assert.match(r.why || '', /does nothing on its own/, `refused, but for: ${r.why}`);
});

// ── P-FLUSH-BEFORE-DONE (D080): DONE is said only after the stick has the bytes ──
//
// The case (handback/p-stick-fault-cause-C_2026-09-19.md §1, §6): on 09-14 a directory write to the stick was
// still failing 53 s after the last write call had returned, and "DONE — you can unplug it now" was conditioned
// on those calls returning. These drive the one seam, `T.IO.fsync(fd, path)`, and always put it back.

/** Run `fn` with `T.IO.fsync` replaced; the real one is restored whatever happens. */
function withFsync(fake, fn) {
  const real = T.IO.fsync;
  T.IO.fsync = fake;
  try { return fn(); } finally { T.IO.fsync = real; }
}
/** A spy that records every path flushed and then flushes for real. */
function spyFsync() {
  const seen = [];
  const real = T.IO.fsync;
  return { seen, fn: (fd, p) => { seen.push(p); return real(fd, p); } };
}
const allFiles = (root) => Object.keys(snapshot(root));
const ioError = (code) => Object.assign(new Error(`${code}: injected flush failure`), { code });

test('flush: every file an export leaves on the stick was fsynced under its temp name before the rename', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']));
  const spy = spyFsync();
  const r = withFsync(spy.fn, () => go(w.D, 'export', { apply: true }));
  assert.strictEqual(r.outcome, 'CARRIED', r.text);
  const files = allFiles(w.stick);
  assert.ok(files.length >= 4, `expected ledger, tail, HANDOFF and MANIFEST; got ${files.map((f) => path.basename(f))}`);
  for (const f of files) {
    const flushedAsTemp = spy.seen.some((p) => typeof p === 'string' && p.startsWith(`${f}.writing-`));
    assert.ok(flushedAsTemp, `${path.relative(w.stick, f)} reached the stick without a file flush; flushed: ${spy.seen.map((p) => path.relative(w.stick, p)).join(', ')}`);
  }
});

test('flush: an export flushes every directory it wrote into, and says so in its result', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const spy = spyFsync();
  const r = withFsync(spy.fn, () => go(w.D, 'export', { apply: true }));
  assert.strictEqual(r.outcome, 'CARRIED', r.text);
  const want = [w.stick, path.join(w.stick, T.LEDGER_DIR), path.join(w.stick, T.TRANSFER_DIR)].map((d) => path.resolve(d));
  for (const d of want) assert.ok(spy.seen.map((p) => path.resolve(p)).includes(d), `directory not flushed: ${d}`);
  assert.ok(Array.isArray(r.flush) && r.flush.length === want.length, `result.flush: ${JSON.stringify(r.flush)}`);
  for (const f of r.flush) assert.strictEqual(f.result, 'flushed', JSON.stringify(f));
  assert.deepStrictEqual(T.toJson(r, { mode: 'export', apply: true, stick: w.stick }).flush, r.flush, 'the --json object must carry the flush record');
});

test('flush: a failure at ANY single flush of an export is a named NOT DONE (NOT_FLUSHED, code 1) — never CARRIED, never CRASHED', () => {
  // Count the flushes a clean export makes, then fail each one in turn on a fresh world.
  const probe = world();
  write(probe.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const spy = spyFsync();
  withFsync(spy.fn, () => go(probe.D, 'export', { apply: true }));
  const n = spy.seen.length;
  assert.ok(n >= 7, `a clean export made only ${n} flushes`);
  for (let k = 0; k < n; k++) {
    const w = world();
    write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
    let i = 0;
    const r = withFsync((fd, p) => { if (i++ === k) throw ioError('EIO'); return fs.fsyncSync(fd); },
      () => go(w.D, 'export', { apply: true }));
    assert.strictEqual(r.outcome, 'NOT_FLUSHED', `flush #${k + 1} of ${n} failed and the export said ${r.outcome}: ${r.text}`);
    assert.strictEqual(r.code, T.EXIT.SEAT, `flush #${k + 1}: code ${r.code}`);
    assert.match(r.why || '', /EIO/, `flush #${k + 1}: the reason does not name the error: ${r.why}`);
  }
});

test('flush: a directory that reports the flush UNSUPPORTED is carried and named as such; an I/O error on it is NOT DONE', () => {
  const unsupported = world();
  write(unsupported.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (_) { return false; } };
  let r = withFsync((fd, p) => { if (isDir(p)) throw ioError('ENOTSUP'); return fs.fsyncSync(fd); },
    () => go(unsupported.D, 'export', { apply: true }));
  assert.strictEqual(r.outcome, 'CARRIED', r.text);
  assert.ok(r.flush.every((f) => /^unsupported \(ENOTSUP/.test(f.result)), JSON.stringify(r.flush));
  assert.match(r.text, /unsupported/, 'an unflushed directory must be said out loud, not only recorded');

  const broken = world();
  write(broken.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  r = withFsync((fd, p) => { if (isDir(p)) throw ioError('EIO'); return fs.fsyncSync(fd); },
    () => go(broken.D, 'export', { apply: true }));
  assert.strictEqual(r.outcome, 'NOT_FLUSHED', r.text);
});

test('flush: an import whose ledger flush fails is a named NOT DONE, not CRASHED', () => {
  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  assert.strictEqual(go(w.D, 'export', { apply: true }).outcome, 'CARRIED');
  const ledgerTmp = path.join(w.stick, T.LEDGER_DIR, T.LEDGER_NAME + '.writing-');
  const r = withFsync((fd, p) => { if (String(p).startsWith(ledgerTmp)) throw ioError('EIO'); return fs.fsyncSync(fd); },
    () => go(w.L, 'import', { apply: true }));
  assert.strictEqual(r.outcome, 'NOT_FLUSHED', r.text);
  assert.strictEqual(r.code, T.EXIT.SEAT);
});

test('flush: an import flushes the stick directories it rewrote, and an I/O error there is a named NOT DONE (mutant #100)', () => {
  const clean = world();
  write(clean.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  assert.strictEqual(go(clean.D, 'export', { apply: true }).outcome, 'CARRIED');
  const spy = spyFsync();
  let r = withFsync(spy.fn, () => go(clean.L, 'import', { apply: true }));
  assert.strictEqual(r.outcome, 'CARRIED', r.text);
  for (const d of [clean.stick, path.join(clean.stick, T.LEDGER_DIR), path.join(clean.stick, T.TRANSFER_DIR)]) {
    assert.ok(spy.seen.map((p) => path.resolve(p)).includes(path.resolve(d)), `import did not flush ${d}`);
  }

  const w = world();
  write(w.D, conversation(SID, ['2026-09-09T14:59:19.013Z']));
  assert.strictEqual(go(w.D, 'export', { apply: true }).outcome, 'CARRIED');
  const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (_) { return false; } };
  r = withFsync((fd, p) => { if (isDir(p)) throw ioError('EIO'); return fs.fsyncSync(fd); }, () => go(w.L, 'import', { apply: true }));
  assert.strictEqual(r.outcome, 'NOT_FLUSHED', r.text);
});

// ── D082 P-CARRY-DIR-FLUSH: --carry-dir says CARRIED only after the copy is on the device ──
// The same bar as D080, for applyDirCarry's fs.cpSync (handback/p-flush-before-done-C_2026-09-19.md §5).

/** A small tree with a nested directory and an EMPTY one, applied through the one seam. */
function carryTree() {
  const d = dirWorld();
  d.put('a.jsonl', '{"a":1}\n');
  d.put('logs/deep/x.log', 'log line\n');
  fs.mkdirSync(path.join(d.src, 'empty'), { recursive: true });
  return d;
}
const allDirs = (root) => {
  const out = [root];
  for (const e of fs.readdirSync(root, { withFileTypes: true })) if (e.isDirectory()) out.push(...allDirs(path.join(root, e.name)));
  return out;
};

test('carry-dir flush: every file the carry copied is fsynced, at its place in the copy', () => {
  const d = carryTree();
  const spy = spyFsync();
  const q = quiet();
  const r = withFsync(spy.fn, () => T.run({ out: q.out, carryDir: d.src, to: d.dest, apply: true }));
  assert.strictEqual(r.outcome, 'CARRIED', q.text());
  const seen = spy.seen.map((p) => path.resolve(p));
  for (const f of allFiles(d.dest)) assert.ok(seen.includes(path.resolve(f)), `copied but never flushed: ${path.relative(d.dest, f)}`);
});

test('carry-dir flush: every directory of the copy, and the parent that received it, is flushed and recorded', () => {
  const d = carryTree();
  const spy = spyFsync();
  const q = quiet();
  const r = withFsync(spy.fn, () => T.run({ out: q.out, carryDir: d.src, to: d.dest, apply: true }));
  assert.strictEqual(r.outcome, 'CARRIED', q.text());
  const want = [...allDirs(d.dest), path.dirname(d.dest)].map((x) => path.resolve(x));
  const seen = spy.seen.map((p) => path.resolve(p));
  for (const w of want) assert.ok(seen.includes(w), `directory not flushed: ${w}`);
  assert.ok(Array.isArray(r.flush) && r.flush.length === want.length && r.flush.every((f) => f.result === 'flushed'), JSON.stringify(r.flush));
});

test('carry-dir flush: a failure at ANY single flush is NOT_FLUSHED, code 1 — never CARRIED', () => {
  const probe = carryTree();
  const spy = spyFsync();
  withFsync(spy.fn, () => T.run({ out: quiet().out, carryDir: probe.src, to: probe.dest, apply: true }));
  const n = spy.seen.length;
  assert.ok(n >= 7, `a clean carry made only ${n} flushes`);
  for (let k = 0; k < n; k++) {
    const d = carryTree();
    let i = 0;
    const q = quiet();
    const r = withFsync((fd, p) => { if (i++ === k) throw ioError('EIO'); return fs.fsyncSync(fd); },
      () => T.run({ out: q.out, carryDir: d.src, to: d.dest, apply: true }));
    assert.strictEqual(r.outcome, 'NOT_FLUSHED', `flush #${k + 1} of ${n} failed and the carry said ${r.outcome}: ${q.text()}`);
    assert.strictEqual(r.code, T.EXIT.SEAT);
    assert.match(r.why || '', /EIO/);
    assert.match(q.text(), /NOT DONE/);
  }
});

test('carry-dir flush: a READ-ONLY file is flushed AND still arrives read-only (the bit is lifted on the copy only, then put back)', () => {
  const d = carryTree();
  const ro = d.put('objects/ab/cdef', 'git object');
  fs.chmodSync(ro, 0o444);
  const spy = spyFsync();
  const q = quiet();
  let r;
  try { r = withFsync(spy.fn, () => T.run({ out: q.out, carryDir: d.src, to: d.dest, apply: true })); }
  finally { fs.chmodSync(ro, 0o644); }
  assert.strictEqual(r.outcome, 'CARRIED', q.text());
  const copy = path.join(d.dest, 'objects', 'ab', 'cdef');
  assert.ok(spy.seen.map((p) => path.resolve(p)).includes(path.resolve(copy)), 'the read-only copy was not flushed');
  assert.strictEqual(fs.statSync(copy).mode & 0o200, 0, 'the copy lost its read-only bit');
  // Windows keeps only the read-only bit, so chmod 0o644 reads back as 0o666: assert writability, not an exact mode.
  assert.notStrictEqual(fs.statSync(ro).mode & 0o200, 0, 'the test did not restore the source to writable');
});

test('carry-dir flush: directories that decline the flush are CARRIED and said out loud; the files were still flushed', () => {
  const d = carryTree();
  const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (_) { return false; } };
  const q = quiet();
  const r = withFsync((fd, p) => { if (isDir(p)) throw ioError('ENOTSUP'); return fs.fsyncSync(fd); },
    () => T.run({ out: q.out, carryDir: d.src, to: d.dest, apply: true }));
  assert.strictEqual(r.outcome, 'CARRIED', q.text());
  assert.ok(r.flush.length > 0 && r.flush.every((f) => /^unsupported \(ENOTSUP/.test(f.result)), JSON.stringify(r.flush));
  assert.match(q.text(), /unsupported/);
});

test('carry-dir flush: the --json object carries the flush record', () => {
  const d = carryTree();
  const w = world();
  const res = J(w.L, ['--carry-dir', d.src, '--to', d.dest, '--apply']);
  assert.strictEqual(res.obj.outcome, 'CARRIED', res.stderr);
  assert.ok(Array.isArray(res.obj.flush) && res.obj.flush.length > 0, JSON.stringify(res.obj.flush));
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
