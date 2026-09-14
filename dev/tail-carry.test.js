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

const TOOL = path.join(__dirname, 'tail-carry.js');
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
  const dir = path.dirname(w.L.dest);
  const kept = fs.readdirSync(dir).filter((f) => f.includes('.pre-truncate-'));
  assert.strictEqual(kept.length, 1, `expected one pre-truncate copy, found ${kept.join(', ')}`);
  assert.strictEqual(fs.readFileSync(path.join(dir, kept[0]), 'utf8'), torn);
});

test('asidePath never returns a name that already exists — the main.rs:835-836 scar', () => {
  const dest = path.join(tmp, 'x', 'y.jsonl');
  const now = Date.parse('2026-09-12T10:15:00.000Z');
  const taken = new Set([`${dest}.pre-truncate-20260912T101500Z`, `${dest}.pre-truncate-20260912T101500Z-2`]);
  assert.strictEqual(T.asidePath(dest, 'pre-truncate', now, (q) => taken.has(q)),
    `${dest}.pre-truncate-20260912T101500Z-3`);
  assert.strictEqual(T.asidePath(dest, 'retired', now, () => false), `${dest}.retired-20260912T101500Z`);
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
  const kept = fs.readdirSync(path.dirname(w.L.dest)).filter((f) => f.includes('.retired-'));
  assert.strictEqual(kept.length, 1);
  assert.strictEqual(fs.readFileSync(path.join(path.dirname(w.L.dest), kept[0]), 'utf8'), theirs);
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

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
