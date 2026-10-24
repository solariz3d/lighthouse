#!/bin/sh
# run2.sh: walk + rmopen only (re-run after lowio.ps1 bound -Out as a common parameter in the first run; checks.json from run 1 stands).
# run.sh (D450 verify, B): the walk (links, bytes), the open-file query over G4, then the git and record checks. Read-only throughout. Every step runs
# under lowio.ps1 (BelowNormal CPU and very low I/O priority, inherited by children) and reads in small batches.
D=C:/Users/nname/Downloads/t180-d450v; cd /c/Users/nname/Downloads/t180-d450v || exit 9
LOW="powershell -NoProfile -ExecutionPolicy Bypass -File $D/lowio.ps1"
echo "walk start $(date -u +%H:%M:%SZ)"; $LOW powershell -NoProfile -ExecutionPolicy Bypass -File $D/walk.ps1 -List $D/walk.list -Out $D/walk.out; echo "walk end $(date -u +%H:%M:%SZ) rows $(wc -l < walk.out)"
tr -d '\r' < C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d450-cleanup-inventory-C_2026-10-24_evidence/g4.paths > g4.list
echo "rmopen start $(date -u +%H:%M:%SZ)"; $LOW powershell -NoProfile -ExecutionPolicy Bypass -File $D/rmopen.ps1 -List $D/g4.list -Out $D/rmopen.out; echo "rmopen end $(date -u +%H:%M:%SZ) rows $(wc -l < rmopen.out)"
