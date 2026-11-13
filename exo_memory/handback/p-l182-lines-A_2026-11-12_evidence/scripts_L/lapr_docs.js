// Lap R: the changelog entries (root CHANGELOG.md, chase/CHANGES.md). Anchors must each appear exactly once; CRLF-aware.
const fs = require('fs');
const WT = 'C:/Users/zackn/Downloads/dreamzone-3-a-l197/';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
function edit(file, from, to) {
  let s = fs.readFileSync(WT + file, 'utf8');
  const crlf = s.includes(CR + LF);
  s = s.split(CR + LF).join(LF);
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(file + ': anchor count ' + n + ' for ' + from.slice(0, 60));
  s = s.replace(from, () => to);
  if (crlf) s = s.split(LF).join(CR + LF);
  fs.writeFileSync(WT + file, s);
}

edit('CHANGELOG.md', '## [Unreleased]\n\n### Changed\n\n', `## [Unreleased]

### Changed

- **The run record has one version and carries the chasers' speed model** (Lap R, L197; pane A owns the record, the chair's
  09:37Z ruling). \`game/world/run_record.{h,cpp}\`, \`chase/speed.{h,cpp}\`, \`game/world/world_app.{h,cpp}\`.
  - **Why:** the speed model was not in the record at all. \`WorldApp::begin_run\` left \`cp.run.speed\` at the code default, so a
    replay used whatever default the build had, and any change to a default would silently change what every kept run
    replays to.
  - **What:** the text gains \`record_format = 1\` (before every other key; the one version number, none other anywhere) and a
    \`[speed]\` section listing every field of \`chase::SpeedModel\`. A text without them is format 0 and reads as
    \`SpeedModel{}\`; a field missing from \`[speed]\` keeps \`SpeedModel{}\`'s value (the behaviour of the day it was missing).
    A \`record_format\` above this build's is refused ("written by a newer build"); an unknown or invalid \`[speed]\` entry is
    refused, naming it.
  - **A new run begins with \`chase::shipped_speed()\`, which is \`SpeedModel{}\` today:** no behaviour changes and every chase,
    game and world test is unchanged. The chase flip (Lap F) edits that one function and is the first replay-changing lap
    through this gate.
  - **Carried in from C's \`8614983\`:** \`RunEnd::Saved\` and \`kept_score\` (a text without \`kept_score\` reads 0).
  - **To roll back:** revert this change. Records it wrote carry \`record_format = 1\` and a \`[speed]\` section, which an older
    build refuses loudly (\`unknown 'record_format'\`).

`);

edit('CHANGELOG.md', '### Fixed\n\n- **The hunter\'s lean no longer rocks back and forth**', `### Fixed

- **The headless streamed harness dropped the speed model** (Lap R). \`chase/streamed.cpp\` \`play_streamed\` built its run
  without \`PlayParams::speed\`, so it always played the default model: \`dz-chase run --world --speed ...\` ignored \`--speed\`,
  and the harness could not agree with an app run on any other model. With the default model nothing changes.

- **The hunter's lean no longer rocks back and forth**`);

edit('chase/CHANGES.md', '## 2026-11-11: a corner is braked for whole,', `## 2026-11-13: what a new run starts with is one function, and the streamed harness plays the model it is given (Lap R, pane A)

### Added

- **\`chase::shipped_speed()\`** (\`speed.h\`): the speed model a new run of the game starts with. It returns \`SpeedModel{}\`, whose
  defaults do not move: that is "the model of every run written before the run record carried one". Changing what new runs
  are given is a change to this function and goes through the record's gate (lighthouse
  \`exo_memory/handback/p-record-owner-A_2026-11-13.md\`). A row pins it equal to \`SpeedModel{}\` until the flip edits that row by name.

### Fixed

- **\`play_streamed\` dropped \`PlayParams::speed\`** (\`streamed.cpp\`): the headless streamed harness always played the default model.
  It now passes the model it is given. No fingerprint changes with the default.

## 2026-11-11: a corner is braked for whole,`);
console.log('Lap R docs written');
