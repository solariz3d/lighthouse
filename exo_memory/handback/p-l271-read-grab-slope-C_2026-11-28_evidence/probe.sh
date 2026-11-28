#!/bin/bash
S=<scratch>
cd $S
date -u +%FT%TZ > probe.start
node c271.js C:/Consonance/t180-wt-c-l271-base c522ea6 today.json > probe.log 2>&1
node c271.js C:/Consonance/t180-wt-c-l271 cc4fa71 branch.json >> probe.log 2>&1
date -u +%FT%TZ >> probe.log
