#!/usr/bin/env bash
# leak-check.sh <pane-jsonl> <from-epoch-ms> <to-epoch-ms> <other-handback-path>...   exit 0 = clean, 1 = LEAK (cell VOID)
# Registered 2026-09-16 04:2x by the librarian, before any RUN 1 cell closed. Exact paths only, never a generic word.
#
# REFINEMENT, L061 (pane A, from RUN 1): A FILENAME IS NOT THE FINDING. The two were one rule tonight, and
# as written it VOIDED a cell that had only ever seen a name in a status listing.
#   EXPOSURE  a path or filename appears (a status listing, a pane digest, a directory listing). The cell is
#             SCORED, and the exposure is recorded BESIDE it, so a reader can discount it knowingly.
#   VOID      the CONTENT came back — a quotation, a figure, a verdict, anything read OUT of the other seat's
#             file. Only this destroys the cell, because only this could have moved the answer.
# The cut is what the seat could have LEARNED, not what it could have NAMED. A name tells you a file exists;
# it cannot tell you what the file says.
#
# NOT BUILT TONIGHT, deliberately: this script still exits 1 on either, so today it is the READER who applies
# the cut when they see the line. A rule a reader applies is worth having and must be labelled as that —
# nobody may read this script's exit 1 as "the cell is void", only as "go look at which of the two it was".
f="$1"; from="$2"; to="$3"; shift 3; hits=0
win=$(node -e "const fs=require('fs');const a=fs.readFileSync(process.argv[1],'utf8').split('\n');let o='';for(const l of a){const m=l.match(/\"timestamp\":\"([^\"]+)\"/);if(!m)continue;const t=Date.parse(m[1]);if(t>=+process.argv[2]&&t<=+process.argv[3])o+=l+'\n';}process.stdout.write(o)" "$f" "$from" "$to")
[ -z "$win" ] && { echo "EMPTY WINDOW — nothing to check (exit 9)"; exit 9; }
for p in "$@"; do n=$(printf '%s' "$win" | grep -cF -- "$p"); [ "$n" -gt 0 ] && { echo "LEAK path $p x$n"; hits=$((hits+n)); }; done
n=$(printf '%s' "$win" | grep -cE '↳ (alpha|bravo|charlie|echo|main|hands):'); [ "$n" -gt 0 ] && { echo "LEAK digest-lines x$n"; hits=$((hits+n)); }
[ "$hits" -gt 0 ] && exit 1; echo "clean: $(printf '%s' "$win" | wc -l) records in window"; exit 0
