# D224 — HOTFIX: the track does not render after Extend (the Third Place's build). Librarian, on D, 2026-10-03 07:3x.

The keeper, 07:26: "something breaks when I press extend, its like the track doesnt render".

## Diagnosis (checked in the Third Place's clone `C:\Users\nname\Downloads\t180-track-builder`, branch `fix/ac-export-in-game`)
- `5debee8` (road is lit) changed `app/preview/aclook.js`, the PREVIEW renderer. It added two top-level Node requires (`aclook.js:88-89`,
  `require('../../src/export/acready.js')` and `require('../../src/texture/dds.js')`). At `dbb92b6` that file had **0** `require(` calls.
- `resolveLook` now calls `ensureDiffuse`, and `src/export/acready.js:134` builds the texture with **`Buffer.from(...)`**, which is Node-only.
- **inferred (strong, not reproduced):** in the app's WebView, `require` and/or `Buffer` are undefined. The empty-track view never calls
  `resolveLook`. The first Extend gives the preview a mesh, `resolveLook` throws, and nothing draws. The Third Place tested this path in
  Node (where both exist) and with a headless render that "can't run the app's scripts", so this path was never exercised in a real window.

## The fix (FEEL tier, but the keeper is blocked: targeted tests + one REAL-window check; A, on top of `527ed0e`)
- The preview must not depend on Node.
  - `ensureDiffuse` (or a preview-side twin) returns plain `Uint8Array` data. The export wraps it in `Buffer` at write time.
  - `aclook.js` gets `ensureDiffuse` / `ddsLevel` the way the app's other preview modules get shared code (check how the app loads
    `src/` modules in the WebView), or computes the solid diffuse in-browser.
- **The test that would have caught it:** load `aclook.js` in a context WITHOUT `require` and `Buffer` (the app's real loading path), and
  resolve the look of an extended track. It must be red at `527ed0e` and green after.
- **The real-window check:** build, launch, Extend a piece, and confirm the track draws (a screenshot or a pixel probe of the preview canvas).
- Then the librarian rebuilds from the fix commit and installs to `%LOCALAPPDATA%\T-180 Track Builder`, keeping the current exe beside it.
- D222 (B's integration) rebases onto this commit before its full suite.

NEXT: chair dispatch D224 to A NOW (the keeper is blocked) when this plan is read; tell B to rebase D222 onto it
