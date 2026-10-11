// D300 mutants on the fix (one lock/slot pair per dirs_guard row). [name, [[from, to], ...]]
// Each is applied to the FIXED source in a copy tree, with the dose on, and run in module mode.
module.exports = [
  ['F0 control', []],
  ['F1 the panicking row shares the writer row pair again', [
    ['DirsGuard::on(&PANICKER_LOCK, &PANICKER_SLOT);\n            *PANICKER_SLOT', 'DirsGuard::on(&WRITER_LOCK, &WRITER_SLOT);\n            *WRITER_SLOT'],
    ['!slot_is_set(&PANICKER_SLOT)', '!slot_is_set(&WRITER_SLOT)'],
  ]],
  ['F2 the guard restores nothing', [
    ['*self.slot.lock().unwrap_or_else(|e| e.into_inner()) = self.prev.take();', 'let _ = self.prev.take();'],
  ]],
  ['F3 the guard restores only on the normal path', [
    ['*self.slot.lock().unwrap_or_else(|e| e.into_inner()) = self.prev.take();', 'if !std::thread::panicking() { *self.slot.lock().unwrap_or_else(|e| e.into_inner()) = self.prev.take(); }'],
  ]],
];
