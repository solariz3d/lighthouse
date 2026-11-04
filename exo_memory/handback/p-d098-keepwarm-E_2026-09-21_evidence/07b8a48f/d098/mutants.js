// D098 mutants (pane E): mutate a COPY of main.rs in scratch/d098/crate, run `cargo test --bin consonance keep_warm`.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const DIR = path.join(__dirname, 'crate', 'consonance', 'src-tauri');
const F = path.join(DIR, 'src', 'main.rs');
const live = fs.readFileSync('C:/Users/nname/Desktop/lighthouse/consonance/src-tauri/src/main.rs', 'utf8');
const rows = [
  ['pre-flight', null],
  ['item 1: the origin marker removed',
    ['            || v.get("origin").and_then(|o| o.get("kind")).and_then(|k| k.as_str()) == Some("task-notification")\n', '']],
  ['item 1: the text marker removed',
    ['matches!(text, Some(t) if !t.trim_start().starts_with("<task-notification>"))', 'text.is_some()']],
  ['item 1: isMeta no longer excluded',
    ['            || v.get("isMeta").and_then(|x| x.as_bool()) == Some(true)\n', '']],
  ['item 1: a prompt before launch counts',
    ['        if ts < start {\n            return false;\n        }\n', '        let _ = ts;\n']],
  ['item 1: a tool result counts as a turn start',
    ['matches!(text, Some(t) if !t.trim_start().starts_with("<task-notification>"))',
     'text.map_or(true, |t| !t.trim_start().starts_with("<task-notification>"))']],
  ['item 2: >= 60 becomes > 60', ['since_start.is_some_and(|s| s >= Duration::from_secs(60 * 60))', 'since_start.is_some_and(|s| s > Duration::from_secs(60 * 60))']],
  ['item 2: reported-once ignored', ['activated && !already_reported && since_start', 'activated && since_start']],
  ['item 2: activation ignored', ['activated && !already_reported && since_start', '!already_reported && since_start']],
  ['item 2: the row loses its reason', ['its next ping re-reads it whole. Last reason it was not pinged: {why}",', 'its next ping re-reads it whole.",']],
];
let n = 0, k = 0;
for (const [name, m] of rows) {
  let src = live;
  if (m) { if (src.split(m[0]).length !== 2) { console.log('ANCHOR NOT UNIQUE:', name); process.exit(2); } src = src.replace(m[0], m[1]); n++; }
  fs.writeFileSync(F, src);
  const r = cp.spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['test', '--bin', 'consonance', 'keep_warm'], { cwd: DIR, encoding: 'utf8', env: { ...process.env, CARGO_TARGET_DIR: path.join(__dirname, 'target') } });
  const o = r.stdout + r.stderr;
  const mm = /test result: (\w+)\. (\d+) passed; (\d+) failed/.exec(o);
  const v = !mm ? 'NO RESULT' : !m ? (mm[3] === '0' ? 'GREEN ' : 'PREFLIGHT-RED') : (mm[3] !== '0' ? 'KILLED' : 'SURVIVED');
  if (m && v === 'KILLED') k++;
  console.log(`${v}  ${mm ? mm[2] + '/' + mm[3] : ''}  ${name}`);
  if (!mm) console.log(o.split('\n').filter((l) => /^error/.test(l)).slice(0, 5).join('\n'));
}
console.log(`${n} listed · ${k} killed · ${n - k} survived`);
