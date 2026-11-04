// msg.js: git filter-branch --msg-filter for the 0.4.35 landing. Every message becomes its subject line alone plus the repository's one trailer;
// seven subjects are replaced by name (lap ids, merge-of-branch lines, room words). Reads the old message on stdin and the commit on GIT_COMMIT.
'use strict';
const OVERRIDE = {
  '708f2fa': "Fixture seal: amend F1 F2's kn5 for the visual lip, and guard the rest by name",
  '5027841': 'Merge: Save and Export to Assetto Corsa ask before writing over another track',
  'dacdfc3': 'Merge: Every export shows one banner while it runs and when it ends',
  '0a8899e': 'Comments in app/core: the last author letters and "ruling" notes dropped (code unchanged)',
  '8305a67': 'Comments in app/core stand alone: no decision numbers, internal paths or author names (code unchanged)',
  '9131702': 'Comments in src/markers stand alone: no decision numbers or author names (code unchanged)',
  '40145cb': 'Comments in src/validate stand alone: no decision numbers, internal paths or author names (code unchanged)',
};
const sha = (process.env.GIT_COMMIT || '').slice(0, 7);
let text = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => { text += d; });
process.stdin.on('end', () => {
  const subject = OVERRIDE[sha] || (text.split(/\r?\n/).find((l) => l.trim()) || '').trim();
  if (!subject) { process.stderr.write(`msg.js: ${sha} has no subject\n`); process.exit(1); }
  process.stdout.write(`${subject}\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n`);
});
