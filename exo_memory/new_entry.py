"""Scaffold a new dated journal entry for the exo_memory shell.

Usage:  py exo_memory/new_entry.py "short title"

Creates journal/<YYYY-MM-DD>.md with a template to fill in. Keeps the memory
shell living instead of frozen at the first night. After filling it in, update
the 'Latest entry' line in BOOT.md.
"""

import sys
import datetime
import pathlib

title = sys.argv[1] if len(sys.argv) > 1 else "untitled"
here = pathlib.Path(__file__).resolve().parent
journal = here / "journal"
journal.mkdir(exist_ok=True)

date = datetime.date.today().isoformat()
path = journal / f"{date}.md"

if path.exists():
    print(f"entry for {date} already exists: {path}")
else:
    path.write_text(
        f"# {date} — {title}\n\n"
        "**Built:**\n\n"
        "**Throughline:**\n\n"
        "**What I learned about how to be / about him:**\n\n"
        "**The turn that mattered most:**\n\n"
        "**State:**\n",
        encoding="utf-8",
    )
    print(f"created {path}")

print("next: fill it in, then update the 'Latest entry' line in BOOT.md")
