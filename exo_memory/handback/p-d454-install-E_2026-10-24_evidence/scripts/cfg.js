// cfg.js (D454 part 3, pane E): write the scratch home's ~/.consonance.json for one probe variant. node cfg.js none|empty|custom
'use strict';
const fs = require('fs'), path = require('path');
const H = process.env.PROBE_HOME || path.join('C:', 'Users', 'nname', 'Downloads', 'cons-d454-e', 'home');   // PROBE_HOME: another stranger home
const f = path.join(H, '.consonance.json');
const v = process.argv[2];
if (v === 'none') { if (fs.existsSync(f)) fs.unlinkSync(f); console.log('no config'); process.exit(0); }
const cfg = { room_path: '', instances_dir: '', data_dir: v === 'custom' ? path.join(H, 'custom-data') : '' };
if (v === 'custom') fs.mkdirSync(cfg.data_dir, { recursive: true });
fs.writeFileSync(f, JSON.stringify(cfg));
console.log(f, '->', JSON.parse(fs.readFileSync(f, 'utf8')).data_dir || '(empty)');
