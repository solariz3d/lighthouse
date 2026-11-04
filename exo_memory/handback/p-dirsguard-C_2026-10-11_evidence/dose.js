// D300: the dose — widen the dirs_guard rows' windows in a COPY of main.rs, never the commit tree.
//   require('./dose.js')(src) -> patched src (throws unless every anchor is found exactly as expected)
// 20 ms inside each row's critical section (after it sets the slot), 2 ms between each row releasing
// its guard and its after-the-guard assertion. With one shared pair, whichever row finishes first
// then asserts while the other holds the slot set; with a pair per row the dose changes nothing.
module.exports = function dose(src) {
  const a = src.indexOf('mod dirs_guard_tests {'), b = src.indexOf('mod seed_upgrade_tests {');
  if (a < 0 || b < a) throw new Error('module anchors not found');
  let m = src.slice(a, b);
  const SLEEP = (ms) => `std::thread::sleep(std::time::Duration::from_millis(${ms})); `;
  const sets = m.match(/\*\w+\.lock\(\)\.unwrap\(\) = Some\(a_dirs\(\)\);/g) || [];
  if (sets.length !== 2) throw new Error('expected 2 slot sets, found ' + sets.length);
  m = m.replace(/(\*\w+\.lock\(\)\.unwrap\(\) = Some\(a_dirs\(\)\);)/g, (x) => x + ' ' + SLEEP(20));
  const posts = [/(\n\s*)(assert!\(!slot_is_set\([^)]*\), "the guard must restore)/, /(\n\s*)(assert!\(out\.is_err\(\))/];
  for (const re of posts) { if (!re.test(m)) throw new Error('post anchor missing ' + re); m = m.replace(re, (x, ws, rest) => ws + SLEEP(2) + rest); }
  return src.slice(0, a) + m + src.slice(b);
};
