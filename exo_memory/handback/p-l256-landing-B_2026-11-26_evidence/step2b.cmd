@echo off
rem step2b.cmd (pane B, L256 step 2, l251): the touched tests of the l251 merge on landing-1126, each at BelowNormal, in order.
set S=<scratch>\l256\step2b
cd /d C:\Consonance\t180-wt-landing-1126
git log -1 --format="tip %%h %%s" > %S%\step2b-tip.txt
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/core-mark-labels.test.js app/test/markwindow.test.js app/test/theme.test.js app/test/handles.test.js > %S%\rows-labels-markwindow-theme-handles.txt 2>&1
echo labels-markwindow-theme-handles-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/reference-panel.test.js test/reference_ribbon.test.js > %S%\rows-reference.txt 2>&1
echo reference-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/markwindow-page.test.js > %S%\rows-markwindow-page.txt 2>&1
echo markwindow-page-exit %ERRORLEVEL%
start "" /belownormal /wait /b node --test --test-concurrency=1 app/test/texture-page.test.js > %S%\rows-texture-page.txt 2>&1
echo texture-page-exit %ERRORLEVEL%
