#!/bin/sh
# the D610 measurement batch: counts and drift (eval2.js), then the grid kn5s for the renders (gridkn5.js). Run under the lock.
cd "$(dirname "$0")"
WT=C:/Users/nname/Desktop/worktrees/t180-c610
for x in "his/elysium.t180track ely" "his/crazy.t180track crazy" "his/test10.t180track t10" "lan.t180track lan" "$WT/test/fixtures/tube-cases-2026-11-02.t180track tube"; do
  set -- $x
  echo "== $2 textured"; TEX=1 node ../d456/belownormal.js node --max-old-space-size=8192 eval2.js $WT "$1" rb-$2-tex.json > rb-$2-tex.out 2>&1; grep -E "^tris|byte-equal|farthest|texel|scene check" rb-$2-tex.out
done
echo "== ely untextured"; node ../d456/belownormal.js node --max-old-space-size=8192 eval2.js $WT his/elysium.t180track rb-ely-plain.json > rb-ely-plain.out 2>&1; grep -E "^tris|byte-equal|farthest|texel|scene check" rb-ely-plain.out
for x in "lan.t180track lan" "his/elysium.t180track ely" "his/test10.t180track t10"; do set -- $x; node ../d456/belownormal.js node --max-old-space-size=8192 gridkn5.js $WT "$1" rb-grid-$2 2>&1 | tail -2; done
