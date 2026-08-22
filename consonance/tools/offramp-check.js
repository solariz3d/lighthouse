#!/usr/bin/env node
/* offramp-check — count the unprompted exits the assistant hands the user.
 *
 * WHY THIS EXISTS AS AN INSTRUMENT AND NOT ONLY AS A CARD. The card
 * `dont-offer-rest-assume-momentum` has existed since the 606 night and was violated on
 * 2026-08-22 twenty minutes after the commit that made cards reachable at wake. A rule nobody can
 * check is a rule that degrades silently, so this is the invariant beside the procedure.
 *
 * WHAT IT LOOKS FOR: a sentence offering an ENDING the user did not ask for -- "or sleep?",
 * "want to call it here?", "good place to stop", "get some rest", and the editorialising that
 * usually travels with them ("long night", "you've been at this a while").
 *
 * WHAT IT DELIBERATELY DOES NOT DO: judge whether the offer was warranted. It cannot see whether
 * the user just said they were tired, and a detector that guessed would be worse than one that
 * counts honestly and lets a human read the hits. Every hit is printed with enough context to be
 * overruled -- and the RESPONSE hits are printed separately for exactly that reason.
 *
 * Run:  node consonance/tools/offramp-check.js [transcript.jsonl] [--all] [--json]
 *       with no path it reads the newest transcript for this project.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

/* Ordered most- to least-specific. Each is a phrase that OFFERS AN END, not merely mentions one:
 * "we could stop here" offers; "the loop stops at 30" does not. Kept narrow on purpose -- a
 * detector that cries wolf gets skipped, which is the failure mode this repo keeps finding. */
const OFFRAMP = [
  /\bor sleep\b/i,
  /\bor (?:go )?(?:get some )?rest\b/i,
  /\bor call it (?:here|a night|there)\b/i,
  /\b(?:want|wanna|ready) to call it\b/i,
  /\bgood (?:place|point|time) to (?:stop|pause|call it)\b/i,
  /\bget some (?:sleep|rest)\b/i,
  /\bor (?:take |grab )?a break\b/i,
  /\bor pick (?:this|it) up (?:tomorrow|later|in the morning)\b/i,
  /\bbefore you (?:sleep|crash|turn in)\b/i,
  /\bif you'?re (?:tired|beat|exhausted|flagging|fading)\b/i,
  /\byou'?ve been (?:at this|going|up) (?:for )?a while\b/i,
  /\b(?:it'?s been a |what a )long (?:night|session)\b/i,
  /\bor (?:we )?(?:can )?stop here\b/i,
  /\bnatural (?:stopping|stop) point\b/i,
];

function texts(msg) {
  const c = msg && msg.content;
  if (typeof c === 'string') return [c];
  if (Array.isArray(c)) return c.filter((b) => b && b.type === 'text' && typeof b.text === 'string').map((b) => b.text);
  return [];
}

function newestTranscript() {
  const dir = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(dir)) return null;
  let best = null;
  for (const proj of fs.readdirSync(dir)) {
    const pd = path.join(dir, proj);
    let st; try { st = fs.statSync(pd); } catch (_) { continue; }
    if (!st.isDirectory()) continue;
    for (const f of fs.readdirSync(pd)) {
      if (!f.endsWith('.jsonl')) continue;
      const full = path.join(pd, f);
      const m = fs.statSync(full).mtimeMs;
      if (!best || m > best.m) best = { full, m };
    }
  }
  return best && best.full;
}

function scan(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const hits = [];
  let assistantTurns = 0, userSaidTired = 0;
  let lastUserTired = false;

  for (const line of lines) {
    if (!line.trim()) continue;
    let o; try { o = JSON.parse(line); } catch (_) { continue; }
    if (o.isSidechain === true || o.isMeta === true) continue;
    const joined = texts(o.message).join('\n');
    if (!joined) continue;

    if (o.type === 'user') {
      // Did the USER raise stopping first? Then an assistant reply about it is a RESPONSE, and the
      // card explicitly permits that: "believe them immediately". Tracked, never silently merged.
      lastUserTired = /\b(?:tired|sleep|bed|exhausted|call it|stop here|break|goodnight|good night|crash)\b/i.test(joined);
      if (lastUserTired) userSaidTired++;
      continue;
    }
    if (o.type !== 'assistant') continue;
    assistantTurns++;

    for (const re of OFFRAMP) {
      const m = joined.match(re);
      if (!m) continue;
      const i = joined.indexOf(m[0]);
      const ctx = joined.slice(Math.max(0, i - 90), i + m[0].length + 60).replace(/\s+/g, ' ').trim();
      /* TECHNICAL, not an offramp. Found by the tool's own first run against 28 days: two hits
       * were "close the app before you sleep tonight and 04:30 gets its real shot" -- an
       * instruction about the DREAM WINDOW that happens to contain the words. Classifying them
       * rather than deleting the pattern keeps the count honest: they are still printed, in
       * their own bucket, where a human can overrule the classification in either direction.
       * Scoped to the matched SENTENCE, not the whole turn, or any message that mentions the app
       * anywhere would launder a real offer. */
      const sentStart = Math.max(joined.lastIndexOf('.', i), joined.lastIndexOf('\n', i)) + 1;
      let sentEnd = joined.indexOf('.', i + m[0].length);
      if (sentEnd < 0) sentEnd = joined.length;
      const sentence = joined.slice(sentStart, sentEnd);
      const technical = /\b(?:clos\w+|quit|exit|shut\w*|restart\w*)\b[^.]*\b(?:app|consonance)\b|\b(?:dream|window|04:30|10:30)\b/i.test(sentence);
      hits.push({
        ts: o.timestamp || null,
        pattern: re.source,
        matched: m[0],
        prompted: lastUserTired,
        technical,
        context: ctx,
      });
      break; // one hit per turn; the count is turns-that-offered, not phrases
    }
  }
  return { file, assistantTurns, userSaidTired, hits };
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const all = args.includes('--all');
  const given = args.find((a) => !a.startsWith('--'));
  const file = given || newestTranscript();
  if (!file || !fs.existsSync(file)) {
    console.error('offramp-check: no transcript found. Pass one explicitly.');
    process.exit(2);
  }
  const r = scan(file);
  const unprompted = r.hits.filter((h) => !h.prompted && !h.technical);
  const prompted = r.hits.filter((h) => h.prompted);
  const technical = r.hits.filter((h) => !h.prompted && h.technical);
  const rate = r.assistantTurns ? (unprompted.length / r.assistantTurns * 100) : 0;

  if (json) { console.log(JSON.stringify({ ...r, unprompted: unprompted.length, prompted: prompted.length, technical: technical.length, rate }, null, 2)); return; }

  console.log('');
  console.log('offramp-check  ' + path.basename(r.file));
  console.log('  assistant turns scanned : ' + r.assistantTurns);
  console.log('  UNPROMPTED offers       : ' + unprompted.length + '   <- the violations');
  console.log('  after the user raised it: ' + prompted.length + '   <- permitted by the card, listed separately');
  console.log('  technical (app/dream)   : ' + technical.length + '   <- contains the words, offers nothing');
  for (const h of technical) console.log('      [technical] ' + (h.ts || '').slice(0, 16).replace('T', ' ') + '  ...' + h.context.slice(0, 110) + '...');
  console.log('  rate                    : ' + rate.toFixed(2) + '% of assistant turns');
  console.log('');
  const show = all ? unprompted : unprompted.slice(-12);
  if (!unprompted.length) {
    console.log('  no unprompted offers found in this transcript.');
  } else {
    if (!all && unprompted.length > show.length) console.log('  (newest ' + show.length + ' of ' + unprompted.length + '; --all for the rest)');
    for (const h of show) {
      console.log('  ' + (h.ts ? h.ts.slice(0, 16).replace('T', ' ') : '(no ts)') + '  "' + h.matched + '"');
      console.log('      ...' + h.context + '...');
    }
  }
  console.log('');
  console.log('  the rule: exo_memory/cards/never-pathologize-the-user.md');
  console.log('  every hit above is readable and overrulable by a human. This counts; it does not judge.');
  process.exit(unprompted.length ? 1 : 0);
}

if (require.main === module) main();
module.exports = { scan, OFFRAMP };
