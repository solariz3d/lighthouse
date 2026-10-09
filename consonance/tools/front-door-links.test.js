// front-door-links.test.js — D273 lap 4 (the cold read, 2026-10-08): the four front-door documents' links resolve.
//
// The cold read (exo_memory/handback/p-consumer-coldread-LIB_2026-10-08.md, A3/A6/A8) found a README that never linked
// the GUIDE, a glossary promised in three places and written in none, and GATES evidence pointing at no reachable file.
// This pins the repairs: every relative link in the four files names a file that exists, every `#anchor` names a heading
// that exists, and every link into the public lighthouse repository names a path that exists in this tree.
// Run: node --test consonance/tools/front-door-links.test.js

'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DOCS = ['README.md', 'consonance/GUIDE.md', 'consonance/GATES.md', 'consonance/README.md'];
const PUBLIC = 'https://github.com/solariz3d/lighthouse/blob/main/';

// GitHub's heading slug: lower case, punctuation other than - and space dropped, spaces to -.
const slug = (h) => h.trim().toLowerCase().replace(/[^\w\- ]/g, '').replace(/ /g, '-');
const anchorsOf = (file) => new Set(fs.readFileSync(file, 'utf8').split(/\r?\n/)
  .filter((l) => /^#{1,6} /.test(l)).map((l) => slug(l.replace(/^#+ /, ''))));

// Markdown links outside fenced and indented code: [text](target).
function linksOf(text) {
  const out = [];
  let fenced = false;
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^\s*```/.test(line)) { fenced = !fenced; return; }
    if (fenced || /^ {4}/.test(line)) return;
    for (const m of line.matchAll(/\]\(([^)\s]+)\)/g)) out.push({ target: m[1], line: i + 1 });
  });
  return out;
}

test('every relative link and anchor in the four front-door documents resolves', () => {
  const bad = [];
  let checked = 0;
  for (const doc of DOCS) {
    const abs = path.join(ROOT, doc);
    for (const { target, line } of linksOf(fs.readFileSync(abs, 'utf8'))) {
      if (/^(https?:|mailto:)/.test(target)) continue;
      checked++;
      const [rel, anchor] = target.split('#');
      const file = rel ? path.resolve(path.dirname(abs), rel) : abs;
      if (!fs.existsSync(file)) { bad.push(`${doc}:${line} ${target} (no such file)`); continue; }
      if (anchor && !anchorsOf(file).has(anchor)) bad.push(`${doc}:${line} ${target} (no such heading)`);
    }
  }
  assert.ok(checked > 20, `only ${checked} links found, so this check proves nothing`);
  assert.deepStrictEqual(bad, []);
});

test('the README links the GUIDE, and the glossary it promises exists', () => {
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  assert.match(readme, /\]\(consonance\/GUIDE\.md\)/);
  assert.match(readme, /\]\(consonance\/README\.md#glossary\)/);
  assert.ok(anchorsOf(path.join(ROOT, 'consonance/README.md')).has('glossary'));
});

// Split in D273 lap 4b (pane B's note): the six gates and their off switches are the product and run everywhere; the evidence
// links name files of the keeper's record, which the generated consumer does not carry, so that row alone is declared workshop-bound there.
test('GATES.md documents six gates, each with how to turn it off', () => {
  const gates = fs.readFileSync(path.join(ROOT, 'consonance/GATES.md'), 'utf8');
  const sections = gates.split(/\r?\n## /).filter((s) => /^\d\. /.test(s));
  assert.strictEqual(sections.length, 6, sections.map((s) => s.split('\n')[0]).join(' | '));
  for (const s of sections) assert.match(s, /\*\*To turn it off:\*\*/, s.split('\n')[0]);
});

test('GATES.md evidence links point into the public lighthouse repository at paths in this tree', () => {
  const gates = fs.readFileSync(path.join(ROOT, 'consonance/GATES.md'), 'utf8');
  const pub = [...gates.matchAll(/\]\((https:\/\/github\.com\/[^)\s]+)\)/g)].map((m) => m[1]);
  assert.ok(pub.length >= 3, 'the evidence links are gone');
  for (const url of pub) {
    assert.ok(url.startsWith(PUBLIC), url + ' is not the public lighthouse repository');
    assert.ok(fs.existsSync(path.join(ROOT, url.slice(PUBLIC.length))), url + ' names no file in this tree');
  }
});
