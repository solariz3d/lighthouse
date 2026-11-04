#!/bin/sh
# probes.sh (D437b, B): the real-OOM probes, logged. A bare worker vs a worker in a sandboxed iframe, in headless Chrome and headless Edge 155,
# plus the ArrayBuffer and cross-site controls. Each probe fills a V8 heap until V8 dies (or an ArrayBuffer allocation fails). One heavy slot.
O="C:/Users/nname/Downloads/t180-d437b"; WT="C:/Users/nname/Downloads/t180-wt-b437"; EV="$1"
EDGE="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
cd "$O" || exit 9
run() { echo "=== $(date -u +%H:%M:%SZ) $*"; timeout 200 node "$@" 2>&1 | sed 's/\x1b\[[0-9;]*m//g'; }
{
  echo "Chrome: $(powershell -NoProfile -Command "(Get-Item 'C:/Program Files/Google/Chrome/Application/chrome.exe').VersionInfo.ProductVersion")  Edge: $(powershell -NoProfile -Command "(Get-Item '$EDGE').VersionInfo.ProductVersion")"
  sed -i "s#http://tauri.localhost:#http://127.0.0.1:#; s#f.src = 'http://exp.localhost:#f.src = 'http://127.0.0.1:#" oomprobe2.js
  run oomprobe2.js "$WT" objects
  run oomprobe2.js "$WT" buffers
  run oomprobe2.js "$WT" objects --iframe
  sed -i "s#f.src = 'http://127.0.0.1:#f.src = 'http://exp.localhost:#; s#url: \`http://127.0.0.1:\${s1.address().port}/\`#url: \`http://tauri.localhost:\${s1.address().port}/\`#" oomprobe2.js
  echo "(the next run: page on tauri.localhost, frame on exp.localhost, two sites)"; run oomprobe2.js "$WT" objects --iframe
  sed -i "s#http://tauri.localhost:#http://127.0.0.1:#; s#f.src = 'http://exp.localhost:#f.src = 'http://127.0.0.1:#" oomprobe2.js
  run oomprobe3.js "$WT" main
  run oomprobe3.js "$WT" worker
  echo "(Edge 155 from here: CHROME_PATH=msedge.exe, --headless=new through the probes)"
  (export CHROME_PATH="$EDGE"; run oomprobe2.js "$WT" objects)
  (export CHROME_PATH="$EDGE"; run oomprobe3.js "$WT" worker)
  echo "=== done $(date -u +%H:%M:%SZ)"
} > "$EV/probes.log" 2>&1
