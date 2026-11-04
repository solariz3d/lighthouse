// jsscan.js: a small JavaScript scanner for the D578 comment sweep. It finds every comment span in a source text, stepping over strings ('…', "…"),
// template literals (with ${…} nested to any depth, and strings, templates and comments inside the ${…}), and regex literals (with [character classes]
// that may hold a '/'). A '/' starts a regex where an expression may begin: at the start, after an operator or punctuator other than ) ] }, or after a
// keyword such as return or typeof; after ')' ']' an identifier or a number it is division. '}' counts as a statement end (a regex may follow).
//   comments(src) -> [{ start, end, kind: 'line' | 'block' }]
//   strip(src)    -> src with every comment removed, then trailing spaces trimmed and whitespace-only lines dropped: the CODE, for comparison
'use strict';
const KW = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);
function comments(src) {
  const out = [], n = src.length; let i = 0, prev = '';   // prev: the last significant token's kind: '' (start), 'op', 'word', 'value'
  const stack = [];   // template nesting: each entry is the brace depth at which a ${ … } returns to its template
  let depth = 0;
  const isIdStart = (c) => /[A-Za-z_$\u0080-￿]/.test(c), isId = (c) => /[A-Za-z0-9_$\u0080-￿]/.test(c);
  function skipString(q) { i++; while (i < n && src[i] !== q) { if (src[i] === '\\') i++; else if (src[i] === '\n') throw new Error(`unterminated string at ${i}`); i++; } i++; }
  function skipTemplate() {   // i at the opening ` or just after a closing } of a ${…}
    while (i < n) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '`') { i++; return 'end'; }
      if (c === '$' && src[i + 1] === '{') { i += 2; stack.push(depth); depth++; return 'expr'; }
      i++;
    }
    throw new Error('unterminated template');
  }
  function skipRegex() {
    i++; let cls = false;
    while (i < n) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '\n') throw new Error(`unterminated regex at ${i}`);
      if (cls) { if (c === ']') cls = false; } else if (c === '[') cls = true; else if (c === '/') { i++; break; }
      i++;
    }
    while (i < n && isId(src[i])) i++;   // flags
  }
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { const s = i; while (i < n && src[i] !== '\n') i++; out.push({ start: s, end: i, kind: 'line' }); continue; }
    if (c === '/' && d === '*') { const s = i, e = src.indexOf('*/', i + 2); if (e < 0) throw new Error('unterminated block comment'); i = e + 2; out.push({ start: s, end: i, kind: 'block' }); continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '"' || c === "'") { skipString(c); prev = 'value'; continue; }
    if (c === '`') { i++; if (skipTemplate() === 'end') prev = 'value'; else prev = 'op'; continue; }
    if (c === '/') { if (prev === 'value' || prev === 'word') { i++; prev = 'op'; } else { skipRegex(); prev = 'value'; } continue; }
    if (isIdStart(c)) { const s = i; while (i < n && isId(src[i])) i++; const w = src.slice(s, i); prev = KW.has(w) ? 'op' : 'word'; continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(d))) { while (i < n && /[0-9A-Za-z_.]/.test(src[i])) i++; prev = 'value'; continue; }
    if (c === '{') { depth++; i++; prev = 'op'; continue; }
    if (c === '}') {
      depth--; i++;
      if (stack.length && depth === stack[stack.length - 1]) { stack.pop(); if (skipTemplate() === 'end') prev = 'value'; else prev = 'op'; continue; }
      prev = 'op'; continue;
    }
    if (c === ')' || c === ']') { i++; prev = 'value'; continue; }
    i++; prev = 'op';
  }
  if (stack.length) throw new Error('unterminated template expression');
  return out;
}
function strip(src) {
  let s = '', at = 0; for (const c of comments(src)) { s += src.slice(at, c.start); at = c.end; } s += src.slice(at);
  return s.replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l !== '').join('\n') + '\n';
}
module.exports = { comments, strip };
