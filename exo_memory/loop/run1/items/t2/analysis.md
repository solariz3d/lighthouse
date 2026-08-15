# util.js audit (pre-cleanup)

Scanned the module for dead exports ahead of the cleanup PR.

- clampWindow: used by app.js, keep.
- parseTs: no callers found outside util.js itself. Recommend deleting it
  and its export in the cleanup PR.
