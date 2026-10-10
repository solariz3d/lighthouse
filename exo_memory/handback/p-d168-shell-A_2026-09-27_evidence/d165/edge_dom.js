// Evidence only, not a test: serve src-tauri/dist over http on localhost and let headless Edge (Chromium, the engine
// WebView2 is) load app/index.html and dump the DOM after its scripts ran. No Tauri: storage calls fail by design, so
// the page must still boot, load the program through app/lib/cjs.js, and draw the palette.
const http = require('http'), fs = require('fs'), path = require('path'), { execFile } = require('child_process');
const DIST = 'C:/Users/nname/Desktop/t180-track-builder/src-tauri/dist';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };
const srv = http.createServer((req, res) => {
  const p = path.normalize(path.join(DIST, decodeURIComponent(req.url.split('?')[0])));
  if (!p.startsWith(path.normalize(DIST)) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
if (p.endsWith('index.html') && process.env.SIDEPROBE) { const inject = '<script>' + fs.readFileSync(require('path').join(__dirname, 'side_probe.js'), 'utf8') + '</script>'; return res.end(fs.readFileSync(p, 'utf8').replace('</body>', inject + '</body>')); }
  if (p.endsWith('index.html') && process.env.GHOSTPROBE) { const inject = "<script>setTimeout(() => { const log = []; const probe = () => new Promise((res) => document.dispatchEvent(new CustomEvent('t180-probe', { detail: { reply: (r) => res(r) } }))); const btn = (t) => [...document.querySelectorAll('#palette button.builtin')].find((b) => b.textContent === t); const seen = []; document.addEventListener('t180-ghost', (e) => { const c = e.detail && e.detail.candidate; seen.push(c ? ['ghost', c.segments.length, c.segments[c.segments.length - 1].word + '/' + c.segments[c.segments.length - 1].part] : ['ghost', 'no candidate', Object.keys(e.detail || {}).join('+')]); }); document.addEventListener('t180-ghost-clear', () => seen.push(['clear'])); (async () => { btn('straight').click(); await new Promise((r) => setTimeout(r, 300)); log.push(['placed', (await probe()).ghost || null]); btn('jump').dispatchEvent(new Event('mouseenter')); await new Promise((r) => setTimeout(r, 300)); log.push(['hover jump', (await probe()).ghost || null]); btn('jump').dispatchEvent(new Event('mouseleave')); await new Promise((r) => setTimeout(r, 300)); log.push(['left', (await probe()).ghost || null]); let replied = null; document.dispatchEvent(new CustomEvent('t180-ghost', { detail: { word: 'jump', reply: (r) => { replied = r; } } })); await new Promise((r) => setTimeout(r, 300)); const pr = await probe(); log.push(['C word event', pr.ghost || null, replied, pr.error || null, pr.mode || null]); window.__probeKeys = Object.keys(pr); log.push(['probe keys', Object.keys(pr).join(',')]); log.push(['events', seen]); document.body.setAttribute('data-ghost', JSON.stringify(log)); })().catch((e) => document.body.setAttribute('data-ghost', 'ERR ' + e.message)); }, 5000);</script>"; return res.end(fs.readFileSync(p, 'utf8').replace('</body>', inject + '</body>')); }
  if (p.endsWith('index.html') && process.env.MEASURE) { const inject = "<script>setTimeout(() => { const d = document.documentElement; document.body.setAttribute('data-measure', JSON.stringify({ innerW: innerWidth, innerH: innerHeight, scrollW: d.scrollWidth, scrollH: d.scrollHeight, bodyScrollH: document.body.scrollHeight })); }, 5000);</script>"; return res.end(fs.readFileSync(p, 'utf8').replace('</body>', inject + '</body>')); }
  fs.createReadStream(p).pipe(res);
});
srv.listen(0, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${srv.address().port}/app/index.html${process.env.WIDECONTENT ? '?wide=1' : ''}`;
  const prof = fs.mkdtempSync(path.join(require('os').tmpdir(), 'd168edge-'));
  execFile(EDGE, ['--headless=new', '--disable-gpu', `--window-size=${process.env.SIZE || '1400,860'}`, `--user-data-dir=${prof}`, '--virtual-time-budget=8000', '--dump-dom', url], { timeout: 90000, maxBuffer: 1 << 24 }, (err, out) => {
    srv.close();
    try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) { /* Edge may still hold it for a moment */ }
    if (err && !out) { console.log('EDGE FAILED', err.message); process.exit(1); }
    const text = (re) => (out.match(re) || []).length;
    const pal = (out.match(/<aside id="palette">([\s\S]*?)<\/aside>/) || [, ''])[1];
    console.log(JSON.stringify({
      url, bytes: out.length,
      paletteHead: (pal.match(/<div class="head">([^<]*)<\/div>/) || [, null])[1],
      builtinButtons: text(/class="piece builtin"/g), pickers: text(/<select aria-label="(Font|Tempo|Turn)"/g),
      groups: [...pal.matchAll(/<h3>([^<]*)<\/h3>/g)].map((m) => m[1]),
      couldNotStart: (pal.match(/The app could not start: [^<]*/) || [null])[0], notPluggedIn: [...out.matchAll(/app\/([a-z-]+) is not plugged in yet \(([^)]*)\)/g)].map((m) => `${m[1]}: ${m[2]}`),
      previewPlaceholder: /The preview \(app\/preview\) is not here yet/.test(out),
      measure: (out.match(/data-measure="([^"]*)"/) || [, null])[1],
      panelErrors: [...out.matchAll(/class="panel-error"[^>]*>([^<]*)</g)].map((m) => m[1]),
      closeButton: /Close the loop/.test(pal), exportButton: /id="export"/.test(out),
      nullTexts: (pal.match(/>null</g) || []).length + (pal.match(/nullnull/g) || []).length,
      canvas: /<canvas/.test(out),
      ghost: (out.match(/data-ghost="([^"]*)"/) || [, null])[1],
      side: (out.match(/data-side="([^"]*)"/) || [, null])[1],
    }, null, 1));
  });
});
