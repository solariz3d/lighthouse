const WT = 'C:/Users/nname/Desktop/c-d190-wt';
const { createCoreShell } = require(WT + '/app/core/coreshell.js');
(async () => {
  const s = await createCoreShell({ brushFn: null });
  const o = Object.create(s);
  console.log('own keys', Object.keys(s).length, 'getState via proto', typeof o.getState);
  s.extend({ length: 100, targets: {} }); console.log('extend 100 {}:', s.getState().history.present.pieces.length, s.getState().message);
  try { console.log('candidateReadout', JSON.stringify(s.candidateReadout({ length: 100, targets: {} })).slice(0, 120)); } catch (e) { console.log('cr threw', e.message); }
  console.log('frozen?', Object.isFrozen(s));
})();
