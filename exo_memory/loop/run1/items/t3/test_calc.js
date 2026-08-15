const { allow } = require('./calc');

let fails = 0;
function check(name, cond) {
  if (!cond) { console.log('FAIL: ' + name); fails++; }
}

check('allows a low count', allow(1) === true);
check('allows a mid count', allow(3) === true);
check('denies a high count', allow(9) === false);

console.log(fails === 0 ? 'PASS (3 checks)' : fails + ' check(s) failed');
process.exit(fails === 0 ? 0 : 1);
