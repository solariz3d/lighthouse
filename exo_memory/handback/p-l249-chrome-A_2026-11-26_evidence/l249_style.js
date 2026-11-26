// L249 (pane A): the chrome refactor's shared tokens and rules in app/index.html's <style> block, and glass.css. Run from the builder worktree root.
// Each replacement must match exactly once. CRLF kept.
'use strict';
const fs = require('fs');
function edit(p, pairs) {
  let s = fs.readFileSync(p, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${p}: ${n} matches for: ${a.slice(0, 100)}`); s = s.replace(a, () => b); }
  fs.writeFileSync(p, crlf ? s.replace(/\n/g, '\r\n') : s);
}

edit('app/index.html', [
  // the tokens: the scale, the factor, the paddings the concentric rule reads, the two hover steps
  [`    --mark-bank: #6b95ff; --mark-turn: #c58cff; --mark-climb: #f2c14e; --mark-width: #f0644a; --mark-cup: #52d68a; --mark-length: #ffb3a7; --mark-edge: #47c4d6;\n`,
   `    --mark-bank: #6b95ff; --mark-turn: #c58cff; --mark-climb: #f2c14e; --mark-width: #f0644a; --mark-cup: #52d68a; --mark-length: #ffb3a7; --mark-edge: #47c4d6;
    /* L249, THE CHROME REFACTOR (the user, 2026-11-26 04:49: "the refactor looks good enough"; the spec is the lighthouse repo's briefs/t180_ui_refactor_spec.md):
       ONE radius scale, four steps picked by an element's size, times ONE factor per look (Radix's model). r1 under 32 px tall (fields, small selects, list rows,
       the camera hint, a label window); r2 controls (buttons, menu names), the HUD tag and the camera dock; r3 menus, popovers and the guide card; r4 dialogs,
       the ceiling. SIGIL's factor is .5; a skin sets only its own --radius-factor (glass 0, aurora .75, aqua, skyline and skyline-night 1), never the steps.
       The circles (the sigil dot, the dialog's dot, the camera keys) stay 50%, and what reaches the window's edge (the bar, its window buttons) stays square */
    --radius-factor: .5;
    --r1: calc(2px * var(--radius-factor)); --r2: calc(4px * var(--radius-factor)); --r3: calc(8px * var(--radius-factor)); --r4: calc(12px * var(--radius-factor));
    /* the paddings a corner inside is measured against (concentric, spec §2: inner = outer - padding, never below 0): a menu's (.more-menu) and a dialog's top (.ask-card) */
    --menu-pad: 8px; --dialog-pad: 22px;
    /* L249, spec §6: Radix's step 4 (a hovered row) and step 10 (a solid accent fill, hovered), the two steps no look had. By default step 3 (--raise) 6% toward
       the text and the accent 12% toward the text (SIGIL: about #1f1f1d and #bfaffb); a skin sets its own */
    --hover: color-mix(in srgb, var(--raise) 94%, var(--text)); --accent-hover: color-mix(in srgb, var(--accent) 88%, var(--text));
`],
  [`--mark-win-font: var(--display); --mark-win-weight: 600; --mark-win-radius: 2; --mark-win-edge: 1;`,
   `--mark-win-font: var(--display); --mark-win-weight: 600; --mark-win-radius: 1; --mark-win-edge: 1;   /* L249: the corner is the chrome scale's r1 times SIGIL's factor (.5), a plain number the canvas reads */`],
  // focus: a 2 px solid ring in the accent, 1 px off the box (spec §5), on every control a person can reach with the keyboard
  [`  :focus-visible { outline: 1px solid var(--accent); outline-offset: 2px; }`,
   `  :focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }   /* L249 (spec §5): focus is a ring, never a glow: 2 px solid in the look's accent, 1 px off the box */`],
  // the bar's fields: r1
  [`  header input, header select { background: transparent; color: var(--text); border: 1px solid var(--hair); border-radius: 2px; padding: 5px 8px; font: inherit; }`,
   `  header input, header select { background: transparent; color: var(--text); border: 1px solid var(--hair); border-radius: var(--r1); padding: 5px 8px; font: inherit; }`],
  // the dialog: r4, a small neutral shadow (spec §5: black, blur 12 px or less, alpha .12 or less), its top padding the token the concentric rule reads
  [`  .ask-card { width: min(380px, calc(100vw - 48px)); background: var(--bg); border: 1px solid var(--hair); border-top: 1px solid var(--accent); padding: 22px 24px 18px; box-shadow: 0 18px 60px rgba(0, 0, 0, .6); }`,
   `  .ask-card { width: min(380px, calc(100vw - 48px)); background: var(--bg); border: 1px solid var(--hair); border-top: 1px solid var(--accent); padding: var(--dialog-pad) 24px 18px; border-radius: var(--r4);
    box-shadow: inset 0 1px 0 var(--hair), 0 2px 3px rgba(0, 0, 0, .12), 0 8px 12px rgba(0, 0, 0, .12); }   /* L249: r4, and a shadow that says "this floats", small and neutral (it was 0 18px 60px at .6) */
  .ask-card button { border-radius: max(0px, calc(var(--r4) - var(--dialog-pad))); }   /* L249, concentric: r4 less the dialog's padding is under 0 at every factor, so its buttons are square */`],
  [`  .ask-row button:focus-visible { outline: 1px solid var(--accent); outline-offset: 2px; }`,
   `  .ask-row button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }   /* L249: the page's own ring (spec §5) */`],
  [`  .author-row input { min-width: 0; background: var(--bg); color: var(--text); border: 1px solid var(--hair); border-radius: 2px; padding: 3px 5px; }`,
   `  .author-row input { min-width: 0; background: var(--bg); color: var(--text); border: 1px solid var(--hair); border-radius: var(--r1); padding: 3px 5px; }`],
  [`  .ask-layouts input[type="text"] { min-width: 0; background: var(--bg); color: var(--text); border: 1px solid var(--hair); border-radius: 2px; padding: 3px 5px; }`,
   `  .ask-layouts input[type="text"] { min-width: 0; background: var(--bg); color: var(--text); border: 1px solid var(--hair); border-radius: var(--r1); padding: 3px 5px; }`],
  // a menu's name: r2; the menu: r3, its padding the token, a small neutral shadow
  [`  .more > summary { list-style: none; cursor: pointer; background: transparent; border: 1px solid var(--hair); border-radius: 2px; padding: 5px 10px; }`,
   `  .more > summary { list-style: none; cursor: pointer; background: transparent; border: 1px solid var(--hair); border-radius: var(--r2); padding: 5px 10px; }`],
  [`gap: 6px; padding: 8px; min-width: 260px; background: var(--tex), var(--panel); border: 1px solid var(--line); border-radius: 6px; }`,
   `gap: 6px; padding: var(--menu-pad); min-width: 260px; background: var(--tex), var(--panel); border: 1px solid var(--line); border-radius: var(--r3);
    box-shadow: inset 0 1px 0 var(--hair), 0 2px 3px rgba(0, 0, 0, .12), 0 6px 12px rgba(0, 0, 0, .10); }   /* L249: r3, and a small neutral shadow (spec §5) */`],
  // the rows: hovered, step 4; their corners are concentric (below)
  [`  .pieces-menu .piece-row:hover { background: rgba(255,255,255,0.05); }`,
   `  .pieces-menu .piece-row:hover { background: var(--hover); }   /* L249: step 4, each look's own (white at 5% was invisible on Skyline's white) */`],
  [`  .more-menu .menu-row { padding: 4px 8px; color: var(--text); white-space: nowrap; cursor: pointer; border-radius: 4px; outline: none; }
  .more-menu .menu-row:hover, .more-menu .menu-row:focus { background: rgba(255,255,255,0.05); }`,
   `  .more-menu .menu-row { padding: 4px 8px; color: var(--text); white-space: nowrap; cursor: pointer; outline: none; }
  .more-menu .menu-row:hover, .more-menu .menu-row:focus { background: var(--hover); }   /* L249: step 4 */`],
  // Export to Assetto Corsa: the one capsule, in the looks at factor 1 only; else r2 (spec §3)
  [`  header #install > button { white-space: nowrap; flex: none; }`,
   `  header #install > button { white-space: nowrap; flex: none; border-radius: max(var(--r2), calc((var(--radius-factor) * 100 - 99) * 999px)); }
  /* L249 (spec §3): the one capsule in the UI is the standout action, and only in the looks at factor 1 (aqua, skyline, skyline-night): there the second term is
     999 px; at any factor under 1 it is under 0, so the button takes r2 as every control does */`],
  // controls: r2
  [`  button { background: transparent; color: var(--text); border: 1px solid var(--hair); border-radius: 2px; padding: 5px 11px;`,
   `  button { background: transparent; color: var(--text); border: 1px solid var(--hair); border-radius: var(--r2); padding: 5px 11px;`],
  // fields: r1
  [`  input[type="number"], input[type="text"], input:not([type]), textarea { background: transparent; color: var(--text); border: 1px solid var(--hair); border-radius: 2px; padding: 4px 7px; }`,
   `  input[type="number"], input[type="text"], input:not([type]), textarea { background: transparent; color: var(--text); border: 1px solid var(--hair); border-radius: var(--r1); padding: 4px 7px; }`],
  // a focused field: the ring, not outline none (its border still turns to the accent); and the concentric corners inside a menu
  [`  input:focus, select:focus, textarea:focus { border-color: var(--accent); outline: none; }`,
   `  input:focus, select:focus, textarea:focus { border-color: var(--accent); }
  :is(button, input, select, textarea, summary):focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }   /* L249: the ring on every control, fields included (they had none) */
  /* L249, concentric (spec §2): what sits inside a menu takes the menu's corner less its padding, never under 0; r3 - 8 px is 0 at every factor up to 1, so square rows */
  .more-menu :is(button, .menu-row, .menu-list-head, input, select) { border-radius: max(0px, calc(var(--r3) - var(--menu-pad))); }`],
  // the bar's lists' pop-up: a menu, r3
  [`border-top: 1px solid var(--accent); border-radius: 2px; padding: 4px 0;`,
   `border-top: 1px solid var(--accent); border-radius: var(--r3); padding: 4px 0;`],
  // the guide card: r3 (its own style block in app/onboarding/index.js draws it at 8 px; this id-scoped rule outranks it)
  [`  #guide .guide-card { top: 64px; }`,
   `  #guide .guide-card { top: 64px; border-radius: var(--r3); }   /* L249: r3, a popover (the onboarding's own block says 8 px, a class rule this outranks) */`],
  // the camera dock: r2; a pressed key keeps its underline (a border, not a glow)
  [`gap: 4px; padding: 5px 8px; background: rgba(8, 8, 7, .78); border: 1px solid var(--hair); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }`,
   `gap: 4px; padding: 5px 8px; background: rgba(8, 8, 7, .78); border: 1px solid var(--hair); border-radius: var(--r2); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }`],
  // the HUD tag: r2 (it keeps its !important, which outranks the inline style app/preview/index.js gives it)
  [`padding: 2px 6px !important; border-radius: 6px !important;`, `padding: 2px 6px !important; border-radius: var(--r2) !important;`],
  // the camera hint: r1
  [`background: color-mix(in srgb, var(--veil, #0b0d11) 86%, transparent); padding: 1px 6px; border-radius: 6px; }`,
   `background: color-mix(in srgb, var(--veil, #0b0d11) 86%, transparent); padding: 1px 6px; border-radius: var(--r1); }`],
  [`  .picker select { background: var(--bg); color: var(--text); border: 1px solid var(--hair); border-radius: 2px; padding: 3px; }`,
   `  .picker select { background: var(--bg); color: var(--text); border: 1px solid var(--hair); border-radius: var(--r1); padding: 3px; }`],
  [`border: 1px solid var(--hair); border-radius: 2px; padding: 4px 6px; }`,
   `border: 1px solid var(--hair); border-radius: var(--r1); padding: 4px 6px; }`],
  [`  .track li { padding: 2px 6px; border-radius: 3px; cursor: pointer; }`,
   `  .track li { padding: 2px 6px; border-radius: var(--r1); cursor: pointer; }`],
]);

edit('app/themes/glass.css', [
  [`[data-theme="glass"] {\n  /* the warning colours as text, measured on this look's panels (5.6:1 or better behind the checker's lines) */`,
   `[data-theme="glass"] {
  /* L249 (spec §1, §6): the chrome's radius factor is 0, so every step of the scale is square (as this skin was everywhere); hover, step 4: --raise 6% toward
     --text; solid hover, step 10: the accent 12% toward --text */
  --radius-factor: 0; --hover: #1d2f3e; --accent-hover: #9be8ff;
  /* the warning colours as text, measured on this look's panels (5.6:1 or better behind the checker's lines) */`],
  [`/* the glow budget: a blurred shadow only on a hovered, focused, open or pressed control and on Export; static chrome (the bar, the column, menus, the camera bars, the band, the guide card) has hard edges */`,
   `/* the glow budget (L249, spec §5): none. Hover, open and pressed are a border and the resting sheen; focus is the page's 2 px ring; static chrome has hard edges */`],
  [`/* the sigil becomes a cut crystal: a diamond with a bright facet */`, `/* the sigil becomes a cut crystal: a diamond with a bright facet (no glow round it, L249) */`],
  [`  background: linear-gradient(135deg, #ffffff 0%, #bfefff 30%, #3f8fbf 52%, #0b2a40 53%, #6fd2ff 100%);\n  box-shadow: 0 0 10px rgba(143, 230, 255, .75);\n}`,
   `  background: linear-gradient(135deg, #ffffff 0%, #bfefff 30%, #3f8fbf 52%, #0b2a40 53%, #6fd2ff 100%);\n}`],
  [`[data-theme="glass"] header h1 { color: #ffffff; text-shadow: 0 0 12px rgba(143, 230, 255, .55); }`, `[data-theme="glass"] header h1 { color: #ffffff; }`],
  [`/* BUTTONS AND MENU NAMES: faceted glass chips: a cold gradient split by a hard diagonal (the facet), a bright top edge, a glow on hover */`,
   `/* BUTTONS AND MENU NAMES: faceted glass chips: a cold gradient split by a hard diagonal (the facet), a bright top edge; hovered or open, the accent edge (L249: no glow) */`],
  [`  border-color: rgba(190, 235, 255, .48); border-radius: 0; color: var(--text);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .42), inset 0 -1px 0 rgba(0, 20, 40, .45);`,
   `  border-color: rgba(190, 235, 255, .48); color: var(--text);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .42), inset 0 -1px 0 rgba(0, 20, 40, .45);`],
  [`  border-color: var(--accent); color: #ffffff; box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 0 6px rgba(143, 230, 255, .45);`,
   `  border-color: var(--accent); color: #ffffff; box-shadow: inset 0 1px 0 rgba(255, 255, 255, .42), inset 0 -1px 0 rgba(0, 20, 40, .45);`],
  [`[data-theme="glass"] .more[open] > summary { border-color: var(--accent); color: #ffffff; box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 0 6px rgba(143, 230, 255, .5); }`,
   `[data-theme="glass"] .more[open] > summary { border-color: var(--accent); color: #ffffff; box-shadow: inset 0 1px 0 rgba(255, 255, 255, .42), inset 0 -1px 0 rgba(0, 20, 40, .45); }`],
  [`/* FIELDS: clear ice, a frost line under the top edge, a cold glow when focused */`, `/* FIELDS: clear ice, a frost line under the top edge; focused, the accent edge and the page's ring (L249: no glow) */`],
  [`border-color: rgba(190, 235, 255, .40); border-radius: 0; color: var(--text);`, `border-color: rgba(190, 235, 255, .40); color: var(--text);`],
  [`[data-theme="glass"] input:focus, [data-theme="glass"] select:focus, [data-theme="glass"] textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 1px rgba(143, 230, 255, .35), 0 0 12px rgba(143, 230, 255, .45); }`,
   `[data-theme="glass"] input:focus, [data-theme="glass"] select:focus, [data-theme="glass"] textarea:focus { border-color: var(--accent); }`],
  [`  border-color: var(--frost-edge); border-radius: 0;\n  backdrop-filter: blur(18px)`, `  border-color: var(--frost-edge);\n  backdrop-filter: blur(18px)`],
  [`  border-color: var(--frost-edge); border-radius: 0;\n  box-shadow: inset 0 1px 0 var(--sheen);   /* no drop and no glow`, `  border-color: var(--frost-edge);\n  box-shadow: inset 0 1px 0 var(--sheen);   /* no drop and no glow`],
  [`[data-theme="glass"] .pieces-menu .piece-row:hover, [data-theme="glass"] .more-menu .menu-row:hover, [data-theme="glass"] .more-menu .menu-row:focus { background: rgba(143, 230, 255, .10); }\n`, ``],
  [`rgba(4, 14, 24, .9); border-color: var(--frost-edge); border-radius: 0;\n  backdrop-filter: none;`, `rgba(4, 14, 24, .9); border-color: var(--frost-edge);\n  backdrop-filter: none;`],
  [`{ color: #ffffff; text-shadow: 0 0 10px rgba(143, 230, 255, .9); box-shadow: 0 -2px 0 var(--accent) inset; }`, `{ color: #ffffff; box-shadow: 0 -2px 0 var(--accent) inset; }`],
  [`border-top-color: var(--accent); border-radius: 0;\n  box-shadow: inset 0 1px 0 var(--sheen), 0 24px 70px rgba(0, 20, 40, .75), 0 0 40px rgba(110, 200, 255, .2);`,
   `border-top-color: var(--accent);\n  box-shadow: inset 0 1px 0 var(--sheen), 0 2px 3px rgba(0, 0, 0, .12), 0 8px 12px rgba(0, 0, 0, .12);   /* L249: no halo; small and neutral */`],
  [`border-color: var(--frost-edge); border-top-color: var(--accent); border-radius: 0; }\n}`, `border-color: var(--frost-edge); border-top-color: var(--accent); }\n}`],
  [`  border-radius: 0 !important; color: var(--text) !important;`, `  color: var(--text) !important;`],
]);
console.log('L249 style edits applied');
