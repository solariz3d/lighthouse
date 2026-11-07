// top-level test blocks of a test file: { start, end, title } (0-based line indexes, inclusive), with the contiguous // comment lines directly above attached
module.exports = function blocks(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^(test|for) ?\(/.exec(lines[i]);
    if (!m || /^test\.(before|after)/.test(lines[i])) continue;
    const close = m[1] === 'test' ? '});' : '}';
    let j = i; while (j < lines.length && lines[j] !== close) j++;
    if (j === lines.length) throw new Error(`no close for line ${i + 1}`);
    let s = i; while (s > 0 && /^\/\//.test(lines[s - 1])) s--;
    const t = /(?:test\(\s*[`'])(.*?)(?:[`'],)/.exec(lines.slice(i, j + 1).join('\n'));
    out.push({ start: s, head: i, end: j, title: t ? t[1] : lines[i].slice(0, 80) });
    i = j;
  }
  return out;
};
