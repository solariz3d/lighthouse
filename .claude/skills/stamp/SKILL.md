---
name: stamp
description: Load before writing a dated or timed entry into a master (a journal, the librarian's day file, a map), whenever you would otherwise type a time like "02:40". Points at the stamp tool, which reads the clock in the same call that writes.
---

# stamp: a dated entry with the time read from the clock

**Master:** the header of `consonance/tools/stamp.js`: its WHY paragraph, then `// Usage:`.

## The commands

```
node consonance/tools/stamp.js <file> --text "entry"          # master shape:  ## HH:MM — entry
node consonance/tools/stamp.js <file> --map --text "line"     # map shape:     - HH:MM line
node consonance/tools/stamp.js <file> [--map] < text           # text from stdin (quotes are safe)
```

- Run `node consonance/tools/stamp.js` with no arguments for its usage line.
- It exits 0 and prints the written line, or exits 2 and writes nothing.
- It refuses text that begins with a time (a typed stamp is the failure it exists to catch), and a file that does not exist.
- Its tests: `consonance/tools/stamp.test.js`.
