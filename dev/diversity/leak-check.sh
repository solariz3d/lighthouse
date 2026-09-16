#!/usr/bin/env bash
# leak-check.sh <pane-jsonl> <from-epoch-ms> <to-epoch-ms> <other-handback-path>...   exit 0 = clean, 1 = LEAK (cell VOID)
# Registered 2026-09-16 04:2x by the librarian, before any RUN 1 cell closed. Exact paths only, never a generic word.
f="$1"; from="$2"; to="$3"; shift 3; hits=0
win=$(node -e "const fs=require('fs');const a=fs.readFileSync(process.argv[1],'utf8').split('\n');let o='';for(const l of a){const m=l.match(/\"timestamp\":\"([^\"]+)\"/);if(!m)continue;const t=Date.parse(m[1]);if(t>=+process.argv[2]&&t<=+process.argv[3])o+=l+'\n';}process.stdout.write(o)" "$f" "$from" "$to")
[ -z "$win" ] && { echo "EMPTY WINDOW — nothing to check (exit 9)"; exit 9; }
for p in "$@"; do n=$(printf '%s' "$win" | grep -cF -- "$p"); [ "$n" -gt 0 ] && { echo "LEAK path $p x$n"; hits=$((hits+n)); }; done
n=$(printf '%s' "$win" | grep -cE '↳ (alpha|bravo|charlie|echo|main|hands):'); [ "$n" -gt 0 ] && { echo "LEAK digest-lines x$n"; hits=$((hits+n)); }
[ "$hits" -gt 0 ] && exit 1; echo "clean: $(printf '%s' "$win" | wc -l) records in window"; exit 0
