#!/bin/bash
# run.sh (D450 delete, pane E): del.ps1 for one phase and mode, under B's lowio.ps1. Usage: run.sh A dry
cd /c/Users/nname/Downloads/t180-d450-e || exit 1
L="C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d450-verify-B_2026-10-24_evidence/lowio.ps1"
[ "$2" = dry ] && rm -f "result-$1-$2.jsonl"
powershell -NoProfile -ExecutionPolicy Bypass -File "$L" powershell -NoProfile -ExecutionPolicy Bypass -File del.ps1 -Phase "$1" -Mode "$2" > "con-$1-$2.out" 2>&1
echo "del.ps1 $1 $2 exit $?"
node sum.js "result-$1-$2.jsonl"
