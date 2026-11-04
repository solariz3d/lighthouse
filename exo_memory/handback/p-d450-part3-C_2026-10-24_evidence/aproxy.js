// aproxy.js <jsonl>: stream a transcript line by line (it is 900 MB) at the lowest CPU priority, and print the timestamp and text of each tool
// result that reports a TabProxyWindow count or the explorer pids. Read-only.
const os = require('os'), fs = require('fs'), readline = require('readline');
try { os.setPriority(0, os.constants.priority.PRIORITY_LOW); } catch (_) {}
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2], { highWaterMark: 1 << 16 }), crlfDelay: Infinity });
const want = /total TabProxyWindow|TabProxyWindow top-level|explorer pids|explorer session/;
rl.on('line', (line) => {
  if (!want.test(line)) return;
  let o; try { o = JSON.parse(line); } catch (_) { return; }
  const c = o && o.message && o.message.content; if (!Array.isArray(c)) return;
  for (const b of c) if (b.type === 'tool_result') { const s = JSON.stringify(b.content); if (want.test(s)) console.log(o.timestamp, s.slice(0, 420)); }
});
