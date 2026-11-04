// D096: move BOOT's dated pointer tail VERBATIM into exo_memory/journal/POINTERS.md, one line left behind.
// Works in BYTES: the tail is cut at the first "**Latest entry:**" line, and nothing before it is touched.
const fs = require('fs');
const R = 'C:/Users/nname/Desktop/lighthouse/exo_memory';
const BOOT = `${R}/BOOT.md`, IDX = `${R}/journal/POINTERS.md`;
if (fs.existsSync(IDX)) throw new Error('POINTERS.md already exists - refusing to overwrite');
const buf = fs.readFileSync(BOOT);
const marker = Buffer.from('\n**Latest entry:**');
const at = buf.indexOf(marker);
if (at < 0 || buf.indexOf(marker, at + 1) >= 0) throw new Error('the Latest-entry marker is not there exactly once');
const cut = at + 1;                                   // the tail starts at the marker line itself
const body = buf.subarray(0, cut), tail = buf.subarray(cut);
if (body.length !== 39608 || tail.length !== 25368) throw new Error(`unexpected split ${body.length}/${tail.length}`);

const line = '**Latest entry:** the dated journal pointers — the Latest, the Previous and the superseded ' +
  'paragraph, 25,368 bytes — moved out of this master VERBATIM on 2026-09-21 (D096, at the keeper\'s word) ' +
  'and live in `journal/POINTERS.md`; nothing was reworded or deleted. The **Previous:** pointer the ' +
  '2026-08-23 amendment above cites at `:153` is there now. Add a new entry\'s pointer to that file, never ' +
  'back into this one.\n';
const header = '# The master\'s dated journal pointers — moved out of BOOT.md, verbatim\n\n' +
  '> Moved 2026-09-21 (D096, pane C, at the keeper\'s word: *"lets do the removing the 39% from the boot"*).\n' +
  '> Everything below the rule is `exo_memory/BOOT.md` from its `**Latest entry:**` line to its end, byte for\n' +
  '> byte as it stood at `c2109bd`: 25,368 of 64,976 bytes, three dated paragraphs that every seat pasting the\n' +
  '> master whole carried at every wake. Nothing was reworded or deleted; BOOT keeps one line pointing here.\n' +
  '> These are dated traces (the 2026-08-17 precedent BOOT\'s 08-23 amendment names: *the pointer keeps its\n' +
  '> wording*). A new entry\'s pointer is added HERE, not in BOOT.\n' +
  '>\n' +
  '> Proof of verbatim: `tail -c 25368 exo_memory/journal/POINTERS.md | cmp - <(git show c2109bd:exo_memory/BOOT.md | tail -c 25368)`\n\n' +
  '---\n\n';
fs.writeFileSync(IDX, Buffer.concat([Buffer.from(header), tail]));
fs.writeFileSync(BOOT, Buffer.concat([body, Buffer.from(line)]));
console.log(`BOOT ${buf.length} -> ${fs.statSync(BOOT).size} B; POINTERS.md ${fs.statSync(IDX).size} B (header ${Buffer.byteLength(header)} + tail ${tail.length})`);
