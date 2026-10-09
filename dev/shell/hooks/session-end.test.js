// session-end.test.js - the SessionEnd hook's first-human-line read, and the one thing it must never do: load a whole transcript as one string.
//
// WHY (D273 devreds, from the sourced.js repair). `firstHumanLine()` read the session transcript with `fs.readFileSync(path, 'utf8').split('\n')` inside a
// `try { … } catch (e) { /* silent */ }` that returns null. V8's longest string is 0x1fffffe8 = 536,870,888 bytes, and a long session's transcript passes it (the chair's
// was 539,727,123 B on 2026-10-08): the read threw, the silent catch swallowed it, and the digest recorded NO opening line for exactly the sessions that had the most to say.
// A swallowed error is the failure's disguise, so these rows do not look for an error: they look for the LINE.
//
// The hook runs LIVE at every session end. Nothing here touches the real ~/.claude/shell: CONSONANCE_SHELL_DIR (the seam shell-dir-seam.test.js pins) points at a temp
// dir for every spawned process and for the in-process module, and every transcript is a temp file.
//
//   1  the behaviours that already held: tag-wrapped, Caveat and system-reminder lines are skipped, the dream anti-instruction returns null, blank and non-JSON lines are
//      skipped, only user events count, a long line is flattened and cut at 160, a missing file or no path gives null
//   2  the same answers at every chunk size, including sizes that cut a multi-byte character and a CRLF
//   3  it stops at the first human line: a 12 MB transcript is not read past its first chunk, and readFileSync is never called on it
//   4  a transcript BIGGER THAN V8's STRING LIMIT still gives its first human line (a 560 MB file made by extending a one-line file), in-process and through the real hook
//
// Run: node --test dev/shell/hooks/session-end.test.js   (the js-suite finds it by name)
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const HOOK = path.join(__dirname, 'session-end.js');
const SHELL = fs.mkdtempSync(path.join(os.tmpdir(), 'session-end-shell-'));
const dirs = [SHELL];
test.after(() => { for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* a temp folder Windows still holds */ } } });
process.env.CONSONANCE_SHELL_DIR = SHELL;   // BEFORE the hook is required: it reads this at load

const scratch = (name, bytes) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'session-end-t-')); dirs.push(d); const f = path.join(d, name); fs.writeFileSync(f, bytes); return f; };
const rec = (o) => JSON.stringify(o);
const user = (content) => rec({ type: 'user', message: { role: 'user', content } });
const asst = (text) => rec({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text }] } });
const WORK = path.join(os.tmpdir(), 'work', 'project');   // an ordinary working directory
const ROOM = ['', 'Consonance', 'instances', 'x'].join('\\');   // \Consonance\instances\x: the hook leaves panes and dream rooms alone
const cleanEnv = () => { const e = { ...process.env, CONSONANCE_SHELL_DIR: SHELL }; delete e.CONSONANCE_DREAM; return e; };
const runHook = (payload) => spawnSync(process.execPath, [HOOK], { input: JSON.stringify(payload), encoding: 'utf8', env: cleanEnv(), timeout: 60000 });
const pulseNotes = () => { const dir = path.join(SHELL, 'pulse'); if (!fs.existsSync(dir)) return []; return fs.readdirSync(dir).flatMap((f) => fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))); };

/** The module, or a clear failure when this build does not export it (the hook ran `main()` at load, so requiring it would read stdin). */
function load() {
  const src = fs.readFileSync(HOOK, 'utf8');
  assert.ok(/module\.exports\s*=\s*\{[^}]*firstHumanLine/.test(src), 'session-end.js does not export firstHumanLine, so its read cannot be tested without running the hook');
  return require(HOOK);
}

test('1: the behaviours that already held', () => {
  const { firstHumanLine } = load();
  const t = (lines) => firstHumanLine(scratch('t.jsonl', lines.join('\n') + '\n'));
  assert.equal(t([user('hello there')]), 'hello there', 'a string user message');
  assert.equal(t([user([{ type: 'text', text: 'array form' }])]), 'array form', 'an array of parts: the first text part');
  assert.equal(t([asst('not a human'), user('the human')]), 'the human', 'assistant events are not the human');
  assert.equal(t(['', 'this is not json', user('after the noise')]), 'after the noise', 'blank and non-JSON lines are skipped');
  assert.equal(t([user('<local-command-caveat>x</local-command-caveat>'), user('<command-name>/clear</command-name>'), user('<system-reminder>r</system-reminder>'), user('the real one')]), 'the real one', 'tag machinery is skipped');
  assert.equal(t([user('Caveat: the messages below were generated'), user('the real one')]), 'the real one', 'Caveat: lines are skipped');
  assert.equal(t([user('   '), user([{ type: 'tool_result', content: 'x' }]), user('only this')]), 'only this', 'empty text and parts without text are skipped');
  assert.equal(t([user('This is a gap-dream cycle. you have no user.'), user('a later human line')]), null, 'the dream anti-instruction ends the search with null: never eat the weld');
  assert.equal(t([asst('nobody spoke')]), null, 'a session in which no human said anything real');
  assert.equal(t(['   ', '']), null);
  const long = 'word  '.repeat(60);
  const got = t([user(long)]); assert.equal(got.length, 163, 'cut at 160 plus "..."'); assert.ok(got.endsWith('...')); assert.ok(!/\s{2}/.test(got), 'whitespace flattened');
  assert.equal(firstHumanLine(path.join(os.tmpdir(), 'session-end-no-such-file.jsonl')), null, 'a missing file gives null');
  assert.equal(firstHumanLine(undefined), null); assert.equal(firstHumanLine(''), null);
  assert.equal(firstHumanLine(scratch('empty.jsonl', '')), null, 'an empty file');
});

test('1e: the same behaviours through the real hook, on the code as it stood (green before and after the change)', () => {
  const note = (lines, cwd = WORK) => {
    const before = pulseNotes().length, f = scratch('e2e.jsonl', lines.join('\n') + '\n');
    const r = runHook({ transcript_path: f, cwd }); assert.equal(r.status, 0, r.stderr);
    const n = pulseNotes(); return n.length > before ? n[n.length - 1].note : null;
  };
  assert.equal(note([user('please look at the build')]), 'please look at the build');
  assert.equal(note([user('<command-name>/clear</command-name>'), user('Caveat: generated'), user('after the machinery')]), 'after the machinery');
  assert.equal(note([user('This is a gap-dream cycle. no user.'), user('too late')]), null, 'the dream anti-instruction: no note');
  assert.equal(note([asst('only the assistant spoke')]), null);
  assert.equal(note([user('a Consonance room is not noted')], ROOM), null, 'panes and dream rooms under a Consonance folder are excluded');
});

test('2: the same answers at every chunk size, including sizes that cut a multi-byte character and a CRLF', () => {
  const { firstHumanLine } = load();
  const body = [asst('x'), '', 'junk line', user('<command-name>/x</command-name>'), user('héllo — “wörld” 🙂 ok'), user('second human')].map((l, i) => l + (i % 2 ? '\r\n' : '\n')).join('').replace(/\r?\n$/, '');
  const f = scratch('t.jsonl', body);
  const sizes = [...Array.from({ length: 48 }, (_, i) => i + 1), 63, 64, 65, 127, 128, 129, 4096, 1 << 20];
  for (const chunk of sizes) assert.equal(firstHumanLine(f, chunk), 'héllo — “wörld” 🙂 ok', 'chunk ' + chunk);
  assert.equal(firstHumanLine(f), 'héllo — “wörld” 🙂 ok', 'and the default chunk size');
  // the first human line is also the LAST line, with no newline after it
  assert.equal(firstHumanLine(scratch('last.jsonl', asst('a') + '\n' + user('final line, no newline')), 7), 'final line, no newline');
});

test('2b: eachLine() hands over exactly the lines of the file: no phantom empty line from the stale bytes after a short last read, none after a final newline, and returning true stops it', () => {
  const { eachLine } = load();
  const lines = (text, chunk, stopAt) => { const f = scratch('l.txt', text), got = []; eachLine(f, (l) => { got.push(l); return got.length === stopAt; }, chunk); return got; };
  // chunk 5: the second read leaves 'bbb\n' behind the one byte the last read returns, so a search of the whole buffer would find a newline that is not in the file
  assert.deepEqual(lines('aaaa\nbbbb\nc', 5), ['aaaa', 'bbbb', 'c']);
  assert.deepEqual(lines('aaaa\nbbbb\n', 5), ['aaaa', 'bbbb']);
  assert.deepEqual(lines('aaaa\nbbbb\nc', 4096), ['aaaa', 'bbbb', 'c']);
  assert.deepEqual(lines('', 5), []);
  assert.deepEqual(lines('aaaa\nbbbb\ncccc\n', 5, 2), ['aaaa', 'bbbb'], 'true from the callback stops the read');
});

test('3: it stops at the first human line and never loads the whole file', () => {
  const { firstHumanLine } = load();
  const first = user('opening words') + '\n';
  const f = scratch('big.jsonl', first);
  fs.appendFileSync(f, Buffer.alloc(12 * 1024 * 1024, 0x78));   // 12 MB of 'x' behind it: one giant, newline-free "line"
  const realRead = fs.readSync, realFile = fs.readFileSync; let bytes = 0, whole = 0;
  fs.readSync = function (fd, buf, off, len, pos) { const n = realRead.apply(this, arguments); bytes += n; return n; };
  fs.readFileSync = function (p) { if (typeof p === 'string' && p === f) whole++; return realFile.apply(this, arguments); };
  try { assert.equal(firstHumanLine(f, 64 * 1024), 'opening words'); } finally { fs.readSync = realRead; fs.readFileSync = realFile; }
  assert.equal(whole, 0, 'readFileSync was never called on the transcript');
  assert.ok(bytes <= 128 * 1024, `read ${bytes} bytes of a 12 MB file: it must stop after the chunk holding the first human line`);
});

// A file longer than V8's longest string, made without writing it: one real line, then the file is extended (the tail is never read by a reader that stops at the line).
const LIMIT = 0x1fffffe8, BIG = LIMIT + 32 * 1024 * 1024;
function bigTranscript() {
  const f = scratch('huge.jsonl', user('what the pulse was for, in a huge session') + '\n');
  try { fs.truncateSync(f, BIG); } catch (e) { return { skip: 'could not extend a temp file to ' + BIG + ' bytes: ' + e.message }; }
  assert.ok(fs.statSync(f).size > LIMIT, 'control: the file really is longer than V8\'s longest string');
  return { f };
}

test('4a: a transcript longer than V8\'s string limit still gives its first human line', (t) => {
  const { firstHumanLine } = load();
  const b = bigTranscript(); if (b.skip) return t.skip(b.skip);
  assert.throws(() => fs.readFileSync(b.f, 'utf8'), /string longer|ERR_STRING_TOO_LONG|Cannot create a string/, 'control: the old whole-file read does throw on this file');
  assert.equal(firstHumanLine(b.f), 'what the pulse was for, in a huge session');
});

test('4b: the real hook, given that transcript at session end, records the opening line in the pulse notes and writes the digest', (t) => {
  const b = bigTranscript(); if (b.skip) return t.skip(b.skip);
  const before = pulseNotes().length;
  const r = runHook({ session_id: 's', transcript_path: b.f, cwd: WORK, hook_event_name: 'SessionEnd' });
  assert.equal(r.status, 0, r.stderr); assert.equal(r.stdout, '{}');
  const notes = pulseNotes(); assert.equal(notes.length, before + 1, 'one new pulse note');
  assert.equal(notes[notes.length - 1].note, 'what the pulse was for, in a huge session');
  assert.ok(fs.readdirSync(path.join(SHELL, 'digests')).some((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)), 'and the digest was written, in the temp shell dir');
});

test('5: the hook still tolerates a missing transcript and a payload with none', () => {
  const before = pulseNotes().length;
  for (const payload of [{ transcript_path: path.join(os.tmpdir(), 'session-end-nope.jsonl'), cwd: WORK }, { cwd: WORK }, {}]) {
    const r = runHook(payload); assert.equal(r.status, 0, r.stderr); assert.equal(r.stdout, '{}');
  }
  assert.equal(pulseNotes().length, before, 'no note is made up for a session with no transcript');
});
