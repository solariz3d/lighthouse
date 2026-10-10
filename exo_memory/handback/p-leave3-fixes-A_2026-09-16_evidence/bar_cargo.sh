#!/bin/bash
# The cargo bar. It FAILS ON AN EMPTY STREAM: cargo is not on bash's PATH here, so a missing binary,
# a broken pipe or a build that printed nothing must read as a failed bar, never as a silent pass.
set -o pipefail
OUT="$1"
cd C:/Users/nname/Desktop/lighthouse/consonance/src-tauri || exit 9
"$USERPROFILE/.cargo/bin/cargo.exe" test --bin consonance -- --test-threads=1 > "$OUT" 2>&1
code=$?
if [ ! -s "$OUT" ] || ! grep -q "^test result:" "$OUT"; then
  echo "BAR FAILED: no 'test result:' line in $OUT — empty or broken stream; cargo exit $code"
  tail -5 "$OUT" 2>/dev/null
  exit 9
fi
grep -E "^test result:|FAILED|^error(\[|:)" "$OUT" | head -40
exit $code
