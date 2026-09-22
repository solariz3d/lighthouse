# For D — declare `state_dir` before trusting state-sync. Librarian (on L), 2026-09-21 04:0x.

**Whoever wakes first on D: do this before anything touches `state-sync.js`, `close.js` or `live-follow.js`.**

## Why

L058–L065 (on L, 2026-09-21) removed the hardcoded `C:\Consonance\state` fallback from `live-follow.js`,
`live-mirror-stop.js` and (L065) `state-sync.js:141`. Those tools now **refuse loudly** when no state location
is declared, instead of guessing. On L the keeper said yes and the librarian added the line
(`librarian/2026-09-21.md`, 03:54). **D's `~/.consonance.json` has not been given it.** Until it is, on D:
`live-follow --status` refuses (exit 2), and once L065 lands, the app's launch pull and `close` refuse too.

The keeper's word, 2026-09-21 ~04:00: *"put it on the repo for desktop to pull"* — so this is authorised; no need
to ask him again.

## Do this on D

1. Check first: `node -e "console.log(require(process.env.USERPROFILE+'/.consonance.json').state_dir)"`
   → prints `C:\Consonance\state` means it is already done; stop.
2. Confirm the folder exists: `ls -d C:/Consonance/state`. If it does not, **stop and tell the keeper** — D's state
   repo lives somewhere else and the value below would be wrong.
3. Back up: `cp ~/.consonance.json ~/.consonance.json.bak-state_dir`
4. Add the key, keeping every other key byte-equal (the script L used, verbatim):

```js
const fs = require('fs');
const p = process.env.USERPROFILE + '/.consonance.json';
const raw = fs.readFileSync(p, 'utf8');
const bom = raw.charCodeAt(0) === 0xFEFF;
const j = JSON.parse(bom ? raw.slice(1) : raw);
if (j.state_dir) { console.log('already set:', j.state_dir); process.exit(0); }
j.state_dir = 'C:\\Consonance\\state';
fs.writeFileSync(p, (bom ? '\uFEFF' : '') + JSON.stringify(j, null, 2) + (raw.endsWith('\n') ? '\n' : ''));
const back = JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const keys = Object.keys(JSON.parse(bom ? raw.slice(1) : raw));
console.log('set state_dir =', back.state_dir, '| other keys unchanged:', keys.every(k => JSON.stringify(back[k]) === JSON.stringify(j[k])));
```

   Save it to a scratch file and run it with `node <file>`. (Do not paste it into `node -e`: the backslashes do not
   survive the shell — that failed on L tonight.)
5. Verify: `node consonance/tools/live-follow.js --status` → exit **0** (read `$?` directly, never through a pipe);
   `node consonance/tools/state-sync.test.js` → all pass.

Then append one line under this file saying it is done, with the time, so the next seat does not redo it.

**Appended 04:1x, after L065:** once L065 is on D, the app's launch-time `state-sync --pull` and `close` will
**refuse** until this is done — the refusal names the fix (`state_dir` / `CONSONANCE_STATE`). That refusal is the
designed loud state, not a break; nothing is lost. Doing the steps above clears it. Note the two env names:
`state-sync.js`/`close.js` read `CONSONANCE_STATE`, `live-follow.js`/`live-mirror-stop.js` read
`CONSONANCE_STATE_REPO` — the `state_dir` key in `~/.consonance.json` satisfies all four, so prefer it over env.

**Appended after L069:** the two env names are now ONE — `CONSONANCE_STATE`. `CONSONANCE_STATE_REPO` is retired
(`handback/p-l069-envname-E_2026-09-21.md`). The `state_dir` key is still the thing to set on D.

- **DONE on D, 2026-09-21 08:4x, by the librarian** (at the keeper's earlier word, recorded above): `state_dir = C:\Consonance\state` set, other keys unchanged, backup `~/.consonance.json.bak-state_dir`; live-follow --status exit 0; state-sync.test 78/0.
