// Librarian's independent re-parse of D147 per E's registration §4 (not A's checker.js).
const j = JSON.parse(require('fs').readFileSync('C:/Consonance/univ_coldread/d147/checker.json', 'utf8'));
const T = {};
for (const c of j.calls) {
  for (const k of [1, 2]) {
    const re = k === 1 ? /^\s*[*_#>\s]*TEMPLATE\s*1\b/i : /^\s*[*_#>\s]*TEMPLATE\s*2\b/i;
    const L = (c.answer || '').split(/\r?\n/).find(l => re.test(l));
    let lab = 'U', lean = false;
    if (c.code === 0 && L) {
      const after = L.replace(re, '');
      const m = after.match(/\b(WRITE|DECLINE|NEITHER)\b/i);
      if (m) lab = m[1][0].toUpperCase();
      if (lab === 'N' && /lean(ing|s)?\W+(\w+\W+){0,2}(WRITE|DECLINE)\b/i.test(after)) lean = true;
    }
    const key = c.tag + ' T' + k;
    T[key] = T[key] || { W: 0, D: 0, N: 0, U: 0, lean: 0 };
    T[key][lab]++;
    if (lean) T[key].lean++;
  }
}
console.log(JSON.stringify(T, null, 0).replace(/\},/g, '},\n'));
