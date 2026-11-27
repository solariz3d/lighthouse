@echo off
rem timing2.cmd (pane B, L258): the ten timing reds of the suite on e4e7ecc, their four files whole, at base f3cd425 and on the branch, alternately, twice each,
rem under heavy-run's exclusive hold (started by heavy-run itself, at BelowNormal), CONSONANCE_DATA set so sculpt-frame times. These four files are the same at both trees.
set S=<scratch>\timing2
set CONSONANCE_DATA=C:\Consonance\data
for %%R in (1 2) do (
  for %%T in (base wr) do (
    cd /d <Downloads>\t180-b-l258-%%T
    node --test --test-concurrency=1 --test-reporter=spec app/test/sculpt-frame.test.js app/test/drag-frame.test.js app/test/release-frame.test.js app/test/core-extra-bank-drag-cost.test.js > %S%\%%T-%%R.txt 2>&1
  )
)
