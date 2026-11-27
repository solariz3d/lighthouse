@echo off
rem timing.cmd (pane B, L258): the suite's two timing reds, drag-frame row 8 and release-frame row 1, at base f3cd425 and on the branch, alternately, twice each,
rem under heavy-run's exclusive hold (started by heavy-run itself, at BelowNormal). The tip worktree's changes are to test files only; these two files are unchanged.
set S=<scratch>\timing
for %%R in (1 2) do (
  cd /d <Downloads>\t180-b-l258-base
  node --test --test-reporter=spec --test-name-pattern="row 8: a 1,000 m piece with a left edge typed" app/test/drag-frame.test.js > %S%\base-%%R-drag8.txt 2>&1
  node --test --test-reporter=spec --test-name-pattern="row 1: letting go of a 1,000 m turn and length handle" app/test/release-frame.test.js > %S%\base-%%R-release1.txt 2>&1
  cd /d <Downloads>\t180-b-l258-wr
  node --test --test-reporter=spec --test-name-pattern="row 8: a 1,000 m piece with a left edge typed" app/test/drag-frame.test.js > %S%\tip-%%R-drag8.txt 2>&1
  node --test --test-reporter=spec --test-name-pattern="row 1: letting go of a 1,000 m turn and length handle" app/test/release-frame.test.js > %S%\tip-%%R-release1.txt 2>&1
)
