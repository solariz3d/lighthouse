@echo off
rem step2.cmd (pane B, L256 step 2, l254): the touched tests of the l254 merge on landing-1126, each at BelowNormal, in order; then the panel-against-column probe.
set S=<scratch>\l256\step2
cd /d C:\Consonance\t180-wt-landing-1126
git log -1 --format="tip %%h %%s" > %S%\step2-tip.txt
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/reference-panel.test.js test/reference_ribbon.test.js > %S%\rows-reference.txt 2>&1
echo reference-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/theme.test.js app/test/markwindow.test.js > %S%\rows-theme-markwindow.txt 2>&1
echo theme-markwindow-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/texture-page.test.js > %S%\rows-texture-page.txt 2>&1
echo texture-page-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/leftcolumn-page.test.js > %S%\rows-leftcolumn-page.txt 2>&1
echo leftcolumn-page-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/core-pieces-ui.test.js app/test/layout-css.test.js app/test/menubar-page.test.js app/test/sculpt-cues.test.js app/test/sculpt-subscribers.test.js app/test/shell-layout.test.js > %S%\rows-p-touched.txt 2>&1
echo p-touched-exit %ERRORLEVEL%
set TREE=C:/Consonance/t180-wt-landing-1126
start "" /belownormal /wait /b node %S%\..\col256.js C:\Consonance\t180-wt-landing-1126\out\l256-pictures\step2 > %S%\col256.json 2> %S%\col256.err
echo col-exit %ERRORLEVEL%
