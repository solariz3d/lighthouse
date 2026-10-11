const { strip, cut } = require('./sim4.js');
for (const [p, h] of [['map/M-2026-08-24.md', 'M — the librarian, its own words, 2026-08-24'], ['loop/p_value_note_2026-10-01.md', 'P-value: what a threshold of 0.05 does and does not tell a reader']]) console.log(JSON.stringify(cut(strip(p, h))), JSON.stringify(cut(h)));
