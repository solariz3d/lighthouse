@echo off
rem Runs landfilter.cmd at BelowNormal and waits for it. The start line lives here, in a .cmd file, so no shell between
rem has to pass its empty title quotes through (at 22:15 local they arrived mangled and start ran nothing).
start "" /belownormal /wait /b cmd /d /c C:\Users\nname\AppData\Local\Temp\claude\8e9709f509cfea85\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\landfilter.cmd
echo LANDFILTER-WRAPPER-EXIT %errorlevel%
