#!/bin/bash
# counts.sh (D450 delete, pane E): the counts the ruling asks for, before and after
echo "at $(date -u +%FT%TZ)"
echo "worktrees Downloads repo: $(git -C /c/Users/nname/Downloads/t180-track-builder worktree list | wc -l)"
echo "worktrees Desktop repo: $(git -C /c/Users/nname/Desktop/t180-track-builder worktree list | wc -l)"
echo "t180-* in Downloads: $(ls -d /c/Users/nname/Downloads/t180-* 2>/dev/null | wc -l)"
echo "TEMP entries: $(ls -A /c/Users/nname/AppData/Local/Temp | wc -l)"
echo "C:/build: $(test -e /c/build && echo present || echo absent)"
echo "branches Downloads repo: $(git -C /c/Users/nname/Downloads/t180-track-builder branch --list | wc -l)"
df -B1 /c | tail -1
