// gpuinfo.js (C, D489): which WebGL renderer headless Chrome gives, under a set of flags. node gpuinfo.js <t180 tree> [flags...]
'use strict';
const path = require('path');
const { chromePath, launchChrome, connect } = require(path.join(path.resolve(process.argv[2]), 'app', 'test', 'soundrender.js'));
(async () => {
  const { ch, dir, tgt } = await launchChrome(chromePath(), process.argv.slice(3), 't180c489-');
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, () => {});
  const d = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => { document.title = 'zz-headless-test'; const c = document.createElement('canvas'), gl = c.getContext('webgl'); if (!gl) return 'no webgl'; const e = gl.getExtension('WEBGL_debug_renderer_info'); return [e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), !!gl.getExtension('EXT_disjoint_timer_query'), !!(document.createElement('canvas').getContext('webgl2') || {getExtension(){}}).getExtension('EXT_disjoint_timer_query_webgl2')]; })()` });
  console.log(JSON.stringify(process.argv.slice(3)), '->', JSON.stringify(d.result.result.value));
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); await new Promise((r) => setTimeout(r, 400)); try { require('fs').rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
