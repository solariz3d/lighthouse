// gen-env.js (D454 part 3, pane E): the environment for the contained first launch. This process's environment, with every CONSONANCE_*, CLAUDE*
// and ANTHROPIC_* variable removed, and the user's folders moved to the stranger home: USERPROFILE, HOME, APPDATA, LOCALAPPDATA, TEMP, TMP.
// WebView2 gets --mute-audio and a debugging port, so the page can be read and driven without being shown. Writes the names only to stdout.
'use strict';
const fs = require('fs'), path = require('path');
const [home, out, port] = process.argv.slice(2);
const env = { ...process.env };
// and every variable NAMED like a credential (TOKEN, KEY, SECRET, PASS, AUTH, CREDENTIAL): this file is written to disk, and a stranger's machine has none of them
for (const k of Object.keys(env)) if (/^(CONSONANCE_|CLAUDE|ANTHROPIC_)/i.test(k) || /^(NODE_OPTIONS|PYTHONPATH|PROBE_)/i.test(k) || /TOKEN|KEY|SECRET|PASS|AUTH|CREDENTIAL/i.test(k) || /^AMBIENT_/i.test(k)) delete env[k];   // AMBIENT_*: the app hands a pane its sky; a stranger has none
const roam = path.join(home, 'AppData', 'Roaming'), local = path.join(home, 'AppData', 'Local'), temp = path.join(local, 'Temp');
for (const d of [roam, local, temp]) fs.mkdirSync(d, { recursive: true });
Object.assign(env, { USERPROFILE: home, HOME: home, APPDATA: roam, LOCALAPPDATA: local, TEMP: temp, TMP: temp,
  WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: '--mute-audio --remote-debugging-port=' + (port || '9334') });
// a Windows env block: keys are case-insensitive, so drop duplicates that differ only by case (keep the last)
const seen = new Map(); for (const [k, v] of Object.entries(env)) seen.set(k.toUpperCase(), [k, v]);
fs.writeFileSync(out, [...seen.values()].map(([k, v]) => k + '=' + v).join('\n') + '\n');
console.log('wrote', out, 'with', seen.size, 'variables; removed:', Object.keys(process.env).filter((k) => !seen.has(k.toUpperCase()) || /^(CONSONANCE_|CLAUDE|ANTHROPIC_)/i.test(k)).join(' '));
