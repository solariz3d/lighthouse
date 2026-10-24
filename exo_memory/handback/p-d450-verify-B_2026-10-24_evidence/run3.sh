#!/bin/sh
# run3.sh (D450 verify, B): refresh the git/record checks at read time, then the board context of every open-lap mention. Under lowio.ps1.
D=C:/Users/nname/Downloads/t180-d450v; cd /c/Users/nname/Downloads/t180-d450v || exit 9
LOW="powershell -NoProfile -ExecutionPolicy Bypass -File $D/lowio.ps1"
echo "checks start $(date -u +%H:%M:%SZ)"; $LOW node $D/checks.js $D/checks.json; echo "checks end $(date -u +%H:%M:%SZ)"
echo "boardctx start $(date -u +%H:%M:%SZ)"; $LOW node $D/boardctx.js $D/checks.json > $D/boardctx.out; echo "boardctx end $(date -u +%H:%M:%SZ) lines $(wc -l < boardctx.out)"
