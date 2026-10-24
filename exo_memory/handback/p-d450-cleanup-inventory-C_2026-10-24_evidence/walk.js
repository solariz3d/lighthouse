// walk.js: read-only size / newest write / links under a directory. lstat only: a junction or symlink is recorded, never followed.
'use strict';
const fs = require('fs'), path = require('path');
function walk(root, { skip = [] } = {}) {
  let bytes = 0, files = 0, newest = 0, links = [], errors = 0;
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    let ents;
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { errors++; continue; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      let st;
      try { st = fs.lstatSync(p); } catch { errors++; continue; }
      if (st.isSymbolicLink()) { let t = ''; try { t = fs.readlinkSync(p); } catch {} links.push(p + ' -> ' + t); continue; }
      if (st.mtimeMs > newest) newest = st.mtimeMs;
      if (st.isDirectory()) { if (!skip.includes(e.name)) stack.push(p); }
      else { bytes += st.size; files++; }
    }
  }
  return { bytes, files, newest: newest ? new Date(newest).toISOString().slice(0, 16) + 'Z' : '', links, errors };
}
module.exports = { walk };
if (require.main === module) console.log(JSON.stringify(walk(process.argv[2]), null, 1));
