#!/bin/bash
# ramp678.sh (pane E, D678): ramp678.js for F = 1 (c2591bf as it is, the control), 1.5, 2, 3, each on the scratch worktree with the one line replaced, then the file
# restored from git and checked clean. Never committed. usage: bash ramp678.sh <scratch worktree> <out file>
set -u
W="$1"; OUT="$2"; F_JS="$W/src/core/extend.js"
LINE='holdR = holdW === undefined ? undefined : startRampM(length, knotM);'
: > "$OUT"
for F in 1 1.5 2 3; do
  git -C "$W" checkout -q -- src/core/extend.js
  if [ "$F" != "1" ]; then
    node -e "const fs=require('fs');let s=fs.readFileSync(process.argv[1],'utf8');const a=process.argv[2];if(s.split(a).length!==2)throw new Error('anchor');s=s.replace(a,()=>'holdR = holdW === undefined ? undefined : Math.min(length, '+process.argv[3]+' * startRampM(length, knotM));');fs.writeFileSync(process.argv[1],s);" "$F_JS" "$LINE" "$F" || exit 1
  fi
  echo "# F $F: $(git -C "$W" diff --stat | tail -1)" >> "$OUT"
  node "$(dirname "$0")/ramp678.js" "$W" "$F" >> "$OUT" 2>&1
done
git -C "$W" checkout -q -- src/core/extend.js
echo "# restored: $(git -C "$W" status --short | wc -l) changed files" >> "$OUT"
