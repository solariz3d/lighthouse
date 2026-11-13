// events.js: every right stride's hip and knee at strike, take-off and swing peak, the knee's yield after strike
// (stance maximum minus strike), and the 2D thigh, from an angles.js JSON. node events.js <angles json>
'use strict';
const r = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
const f = (v) => v.toFixed(1);
console.log(`cut-off ${r.cutoff} Hz; standing: hip C3 ${f(r.standing.hipC3)}, knee C3 ${f(r.standing.kneeC3)}, knee 2D ${f(r.standing.knee2)}, thigh 2D ${f(r.standing.thigh2)}, hip 2D (C7 trunk) ${f(r.standing.hip2)}`);
for (const t of r.trials)
  t.strides.forEach((s, i) => {
    const k = s.kneeC3, k2 = s.knee2, h = s.hipC3, th = s.thigh2, h2 = s.hip2;
    console.log(`${t.speed} m/s stride ${i + 1} (toe-off at ${s.toPct.toFixed(1)} %)`);
    console.log(`  hip C3:  strike ${f(h.strike)}, take-off ${f(h.takeoff)}, swing max ${f(h.swingMax)}, min ${f(h.min)}`);
    console.log(`  knee C3: strike ${f(k.strike)}, take-off ${f(k.takeoff)}, swing max ${f(k.swingMax)}, yield ${f(k.stanceMax - k.strike)}`);
    console.log(`  knee 2D: strike ${f(k2.strike)}, take-off ${f(k2.takeoff)}, swing max ${f(k2.swingMax)}, yield ${f(k2.stanceMax - k2.strike)}`);
    console.log(`  thigh 2D to vertical: strike ${f(th.strike)}, take-off ${f(th.takeoff)}; hip 2D (C7 trunk): strike ${f(h2.strike)}, take-off ${f(h2.takeoff)}`);
  });
