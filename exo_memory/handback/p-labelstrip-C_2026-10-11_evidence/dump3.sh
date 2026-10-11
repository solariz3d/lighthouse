#!/bin/bash
# D297: strict + light dumps of base (main 5d5740b4, D296 code) and new (d297-c) against the D296
# snapshot, unchanged (G:/consonance-scratch/c-d296/snap is NOT re-taken). The D296 way (dump2.sh):
# mirror the snapshot into each worktree's exo_memory, dump, diff-check, restore.
set -u
SNAP=G:/consonance-scratch/c-d296/snap; O=G:/consonance-scratch/c-d297
rm -rf $O/base3 $O/new3; mkdir -p $O
echo "snap files $(find $SNAP -type f | wc -l)"
for W in c-d297-base c-d297-wt; do
  find G:/worktrees/$W/exo_memory -mindepth 1 -maxdepth 1 ! -name third_place -exec rm -rf {} + && tar -C $SNAP -cf - . | tar -C G:/worktrees/$W/exo_memory -xf -; echo "mirror $W rc $? files $(find G:/worktrees/$W/exo_memory -type f ! -path "*/third_place/*" | wc -l) head $(git -C G:/worktrees/$W log -1 --format=%h)"
done
date -u +"dump start %FT%T.%NZ"
(cd G:/worktrees/c-d297-base/consonance/src-tauri && INTAKE_DUMP_DIR=$O/base3 CARGO_TARGET_DIR=G:/ctarget/c-d296-base ~/.cargo/bin/cargo.exe test --bin consonance dump_intakes_for_measure -- --ignored 2>&1 | grep 'test result')
date -u +"base dumped %FT%T.%NZ"
(cd G:/worktrees/c-d297-wt/consonance/src-tauri && INTAKE_DUMP_DIR=$O/new3 CARGO_TARGET_DIR=G:/ctarget/c-d296-new ~/.cargo/bin/cargo.exe test --bin consonance dump_intakes_for_measure -- --ignored 2>&1 | grep 'test result')
date -u +"new dumped %FT%T.%NZ"
diff -rq $SNAP G:/worktrees/c-d297-base/exo_memory --exclude=third_place && echo "base tree == snapshot after dump"
diff -rq $SNAP G:/worktrees/c-d297-wt/exo_memory --exclude=third_place && echo "new tree == snapshot after dump"
for W in c-d297-base c-d297-wt; do
  git -C G:/worktrees/$W checkout -q -- exo_memory && git -C G:/worktrees/$W clean -fdq -- exo_memory && echo "restored $W: $(git -C G:/worktrees/$W status --short | wc -l) dirty"
done
sha256sum $O/base3/* $O/new3/*; wc -c $O/base3/* $O/new3/*
