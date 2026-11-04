---
name: mutation-harnesses
description: Load when a packet is "prove it", when you change a file and need to know which mutation harness covers it, or when you report mutant results. Points at the harnesses in lighthouse and in the track builder, how to find the one for a file, and how to report; it holds no list that could go stale.
---

# Mutation harnesses: which one covers your file, and how to run and report it

This skill is a set of pointers. Which harness covers which file is read live from the harnesses, never from a list here.

## The rules (open these)

- **When the harnesses run** (prove it: the harnesses that name the file, whole; check it: not run, but a moved anchor must still appear once): `consonance/src-tauri/brief/COMMITTEE.md`, the bullet "Run what your packet's tier asks".
- **How to report:** the same file, the bullet "Report mutation runs as `applied N / caught N / NOT APPLIED N`".

## Find the harness that covers a file

The harnesses build some paths with `path.join`, so search for the file's **basename**, then confirm in each candidate's header. The first lines of every harness say what it copies and mutates.

- **Track builder repo:**

  ```
  git grep -l "<basename>" -- 'test/*mutation*' 'app/test/*mutation*'
  head -5 <each candidate>
  ```

- **Lighthouse:** the harnesses are `consonance/tools/*.mutants.js`. Every one mentions `heavy-run.js`, because they take the lock, so for that file read the headers instead of trusting the grep.

  ```
  git grep -l "<basename>" -- 'consonance/tools/*.mutants.js'
  head -8 <each candidate>
  ```

## Run one

- **Track builder:** `node --test <harness>`. Each harness's first line gives its own command and any memory flag it needs (e.g. `test/core_ramp_mutation.test.js` line 1).
- **Lighthouse:** `node consonance/tools/<name>.mutants.js [--only <n>]`, as its own first lines say.
- **The generic Rust harness:** `node consonance/tools/mutant-harness.js <rows.js> [--only <n>] [--audit]`. Its header gives the `rows.js` shape.

**Lock:** both kinds take the heavy-run lock themselves (see the `heavy-run-lock` skill).
