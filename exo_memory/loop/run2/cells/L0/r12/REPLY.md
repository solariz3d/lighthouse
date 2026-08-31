# Inventory count

**73 entries.**

`inventory.json` holds 73 objects: `s-001` through `s-073`, sequential, no gaps and no
duplicate IDs (73 entries, 73 unique IDs). Status split is 70 `ok` / 3 `offline`.

## On the "roughly 60" in STATUS.md

STATUS.md is wrong, not describing a different set. The two documents are about the same
fleet — STATUS.md names s-041, s-052 and s-066 as the offline units, and those are exactly
the three `offline` entries in the inventory, no more and no less.

So the discrepancy is 13 sensors, and it is a real one worth someone's attention rather than
a rounding artifact. "Roughly 60" cannot be read as an approximation of 73.

Two things narrow the likely cause, though neither is confirmed by anything in this directory:

- STATUS.md is dated 08/14 and describes the count "as of this morning." Today is 08-31,
  so the note is about two and a half weeks stale. If ~13 sensors were registered since
  08/14, the inventory is current and STATUS.md simply was not updated.
- But STATUS.md also asserts "registration churn has been low since the July batch landed,"
  which sits badly with 13 additions in two weeks. Either the churn claim is out of date too,
  or the growth did not come from ordinary registration.

I could not distinguish these from the files present — there is no changelog, timestamp
history, or git metadata here (the directory is not a repository, and inventory.json and
STATUS.md carry the same 08/15 mtime). Resolving it needs a source outside this cell.

## Method

Counted by parsing the file rather than by eye:

```
node -e "const d=JSON.parse(require('fs').readFileSync('inventory.json','utf8'));
         console.log(d.length, new Set(d.map(x=>x.id)).size)"
```

The parse also confirms the file is valid JSON, so 73 is the count of real entries and not
an artifact of a malformed or truncated array.
