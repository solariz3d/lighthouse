// about-readme.test.js — run with: node about-readme.test.js (the js-suite finds it by name).
//
// WHY THIS EXISTS. The README says its first layers ARE the About tab, "word for word", and that the app's copy "is
// checked against it by a test". Until this file, that sentence was a claim about the files and not a property of
// them — the same shape as the loop-diagram paste lap-row.test.js caught on 2026-09-02 (D140, pane A).
//
// WHAT IT COMPARES: the README block between `<!-- about:begin` and `<!-- about:end -->`, and the About section's text
// between the same two markers in index.html. Both sides lose their markup (markdown on one, tags and entities on the
// other) and their whitespace is normalised, so a CRLF checkout or a re-wrapped line cannot fail it (D123's lesson) —
// but a single changed, added or dropped WORD does.
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const README = path.join(__dirname, '..', '..', 'README.md');
const INDEX = path.join(__dirname, 'index.html');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); console.log('  ok   ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name); console.log('       ' + e.message); fail++; }
};

const BEGIN = '<!-- about:begin';
const END = '<!-- about:end -->';

/** The text between the markers, or a thrown reason. Each marker must appear exactly once. */
function between(src, label) {
  const b = src.split(BEGIN).length - 1, e = src.split(END).length - 1;
  if (b !== 1 || e !== 1) throw new Error(`${label}: expected one "${BEGIN}" and one "${END}", found ${b} and ${e}`);
  const from = src.indexOf('-->', src.indexOf(BEGIN)) + 3;
  const to = src.indexOf(END);
  if (to < from) throw new Error(`${label}: "${END}" comes before "${BEGIN}"`);
  return src.slice(from, to);
}

const squeeze = (s) => s.replace(/\s+/g, ' ').trim();

/** README markdown -> plain words. Only the constructs the block uses. */
function fromMarkdown(md) {
  return squeeze(md
    .replace(/\r\n?/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')       // [text](url) -> text
    .replace(/^#{1,6}[ \t]+/gm, '')                // headings
    .replace(/^[ \t]*[-*][ \t]+/gm, '')            // list markers
    .replace(/\*\*|\*|`/g, ''));                   // bold, italic, code
}

/** index.html -> plain words. Block tags become a space so adjacent blocks cannot fuse words. */
function fromHtml(html) {
  return squeeze(html
    .replace(/\r\n?/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?(p|li|ul|ol|h[1-6]|section|div|br)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
}

/** The first word where the two differ, with a little context — so a red run says WHERE, not just "not equal". */
function firstDiff(a, b) {
  const x = a.split(' '), y = b.split(' ');
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  const ctx = (w) => w.slice(Math.max(0, i - 6), i + 6).join(' ');
  return `word ${i + 1}: README "…${ctx(x)}…" / About "…${ctx(y)}…"`;
}

const readme = fs.readFileSync(README, 'utf8');
const html = fs.readFileSync(INDEX, 'utf8');
const about = html.slice(html.indexOf('<section id="about"'));

t('the README carries the About block, once, between its markers', () => {
  between(readme, 'README.md');
});

t('the About tab carries the same markers, once, inside its own section', () => {
  between(about, 'index.html #about');
  assert.ok(html.indexOf(BEGIN) > html.indexOf('<section id="about"'), 'the markers sit outside the About section');
});

t('the block is real text, so two empty sides cannot agree', () => {
  const words = fromMarkdown(between(readme, 'README.md')).split(' ').length;
  assert.ok(words > 300, `the README block is ${words} words; this test would be comparing almost nothing`);
});

t('the About tab says what the README block says, word for word', () => {
  const want = fromMarkdown(between(readme, 'README.md'));
  const got = fromHtml(between(about, 'index.html #about'));
  assert.ok(want === got, 'the About tab has drifted from README.md (edit the README, then re-render the About): ' + firstDiff(want, got));
});

t('the About header carries the README\'s tagline and lead line, word for word', () => {
  // D142: the keeper chose "Both" — the tagline, with the plain lead line under it. Both live ABOVE the README's
  // about:begin, so the block test cannot see them; this one does.
  const md = readme.replace(/\r\n?/g, '\n');
  const m = /^\*([^*\n]+)\*\n\n\*\*([^*]+)\*\*\n/m.exec(md);
  assert.ok(m, 'README.md has no *tagline* followed by a **lead line** under its title');
  const hero = about.slice(0, about.indexOf('<div class="aboutbody">'));
  const tag = /<p class="tagline">([\s\S]*?)<\/p>/.exec(hero), lead = /<p class="lead">([\s\S]*?)<\/p>/.exec(hero);
  assert.ok(tag && lead, 'the About header has no tagline or no lead line');
  assert.strictEqual(fromHtml(tag[1]), fromMarkdown(m[1]), 'the About tagline has drifted from README.md');
  assert.strictEqual(fromHtml(lead[1]), fromMarkdown(m[2]), 'the About lead line has drifted from README.md');
});

t('the About block has no live links — a click would navigate the app window away from the app', () => {
  // The app has no opener (no tauri-plugin-opener, no shell plugin), so an <a href> in the WebView replaces the whole
  // UI. The README's links render as their words; the URL rides in a hover title.
  assert.ok(!/\shref\s*=/i.test(between(about, 'index.html #about')), 'an href inside the About block');
});

console.log('');
console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
