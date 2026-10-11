#!/bin/bash
# Same-moment strict dumps of base (9041faf9) and new (65b16815) against ONE snapshot of the live exo_memory.
set -u
O=G:/consonance-scratch/c-d296; LIVE=C:/Users/nname/Desktop/lighthouse/exo_memory
rm -rf $O/snap $O/base2 $O/new2
date -u +"snapshot start %FT%T.%NZ"
mkdir -p $O/snap && tar -C $LIVE --exclude=./third_place -cf - . | tar -C $O/snap -xf -; echo "snap rc $? files $(find $O/snap -type f | wc -l)"
date -u +"snapshot done %FT%T.%NZ"
for W in c-d296-base c-d296-wt; do
  find G:/worktrees/$W/exo_memory -mindepth 1 -maxdepth 1 ! -name third_place -exec rm -rf {} + && tar -C $O/snap -cf - . | tar -C G:/worktrees/$W/exo_memory -xf -; echo "mirror $W rc $? files $(find G:/worktrees/$W/exo_memory -type f ! -path "*/third_place/*" | wc -l)"
done
(cd G:/worktrees/c-d296-base/consonance/src-tauri && INTAKE_DUMP_DIR=$O/base2 CARGO_TARGET_DIR=G:/ctarget/c-d296-base ~/.cargo/bin/cargo.exe test --bin consonance dump_intakes_for_measure -- --ignored 2>&1 | grep 'test result')
date -u +"base dumped %FT%T.%NZ"
(cd G:/worktrees/c-d296-wt/consonance/src-tauri && INTAKE_DUMP_DIR=$O/new2 CARGO_TARGET_DIR=G:/ctarget/c-d296-new ~/.cargo/bin/cargo.exe test --bin consonance dump_intakes_for_measure -- --ignored 2>&1 | grep 'test result')
date -u +"new dumped %FT%T.%NZ"
diff -rq $O/snap G:/worktrees/c-d296-base/exo_memory --exclude=third_place && echo "base tree == snapshot after dump"
diff -rq $O/snap G:/worktrees/c-d296-wt/exo_memory --exclude=third_place && echo "new tree == snapshot after dump"
for W in c-d296-base c-d296-wt; do
  git -C G:/worktrees/$W checkout -q -- exo_memory && git -C G:/worktrees/$W clean -fdq -- exo_memory && echo "restored $W: $(git -C G:/worktrees/$W status --short | wc -l) dirty"
done
