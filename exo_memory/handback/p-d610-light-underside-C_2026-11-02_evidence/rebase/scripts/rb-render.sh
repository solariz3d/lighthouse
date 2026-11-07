#!/bin/sh
# the rebased renders: TEST 10 (p4, p5, their joint) and ELYSIUM bank-under, full and light, on the corrected skin; then each pair's difference
cd "$(dirname "$0")"
WT=C:/Users/nname/Desktop/worktrees/t180-c610
mkdir -p rbr
for x in "t10 views-t10.json" "ely views-bankunder.json"; do set -- $x
  for k in full light; do [ -f rb-grid-$1-$k.kn5 ] && node ../d456/belownormal.js node --max-old-space-size=8192 render3.js rb-grid-$1-$k.kn5 $2 rbr $1-$k- 1280 720 2>&1 | tail -1; done
done
for f in rbr/*-full-*.png; do b=$(basename $f); v=${b#*-full-}; p=${b%%-full-*}; node diffpng.js $WT $f rbr/$p-light-$v rbr/$p-diff-$v | tail -1; done
