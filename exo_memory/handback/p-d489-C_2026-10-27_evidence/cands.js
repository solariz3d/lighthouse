// cands.js (C, D489): the candidate aurora techniques as sky patterns, for skypass.js to time (CASES_FILE=cands.js). Scratch code for measuring cost
// only: none of it is for the app (a build writes its own). Each keeps the current sky's night gradient and stars, so a case is a whole sky.
// The aurora slab is 1 to 3 units above the eye on a flat sky (about 100 to 300 km scaled), its far end capped at 40 units along the ray.
'use strict';
module.exports = (AU, part) => {
  const NIGHT = 'vec3 night = mix(uSkyC, uSky, smoothstep(0.0, 0.42, el)); night = mix(night, mix(uSkyC, uSky, 0.5), 1.0 - smoothstep(-0.35, 0.0, el));';
  const STARS = 'float stars = aurora_stars(dir, t) * smoothstep(0.17, 0.35, el);';
  const OUT = 'return 1.0 - (1.0 - night) * (1.0 - clamp(au, 0.0, 1.0)) + vec3(0.85, 0.9, 1.0) * stars;';
  // A. sheets: horizontal planes through the slab, spaced closer low down (i^1.4), each sampled with a folded triangle-wave 2D noise of ITER rounds,
  //    the shape of the Shadertoy "Auroras" loop (XtGGRt) as carried in its ports; colour by plane height, green low, violet high
  const tri = `
float c_tri(float x) { return abs(fract(x) - 0.5); }
vec2 c_tri2(vec2 p) { return vec2(c_tri(p.x) + c_tri(p.y), c_tri(p.y + c_tri(p.x))); }
float c_triN(vec2 p, float t, int iter) {
  float z = 1.8, z2 = 2.5, rz = 0.0; mat2 m = mat2(0.95534, 0.29552, -0.29552, 0.95534); vec2 bp = p;
  for (int i = 0; i < 6; i++) { if (i >= iter) break; vec2 d = c_tri2(bp * 1.85) * 0.75; d = m * d; p -= d / z2; bp *= 1.3; z2 *= 0.45; z *= 0.42; p *= 1.21 + (rz - 1.0) * 0.02; rz += c_tri(p.x + c_tri(p.y)) * z; p = m * -p; p += t * 0.05; }
  return clamp(1.0 / pow(rz * 29.0, 1.3), 0.0, 0.55);
}`;
  const sheets = (N, iter) => [`A. sheets, ${N} planes x ${iter}-round noise`, 'aurora', part(`${NIGHT} ${STARS} vec3 au = vec3(0.0);
    if (dir.y > 0.02) { for (int i = 0; i < ${N}; i++) { float f = float(i) / ${N}.0; float h = 1.0 + 2.0 * pow(f, 1.4); float d = min(h / dir.y, 40.0); vec2 p = dir.xz * d * 0.12;
      float n = c_triN(p, t, ${iter}); vec3 c = mix(uSkyA, uSkyB, smoothstep(0.1, 0.8, f)); au += c * n * (1.0 - f) * (6.0 / ${N}.0); } }
    au *= smoothstep(0.02, 0.2, dir.y); ${OUT}`).replace('vec3 skyPattern', tri + '\nvec3 skyPattern')];
  // B. curtains: N steps through the slab; at each, the distance in the ground plane to K curtain lines z = c_k + fold(x), the fold a 3-octave value noise
  //    drifting in time (a noise-displaced height field: the curtain is vertical, so its rays are vertical in 3D and converge overhead by perspective, the
  //    corona with depth), emission by height (a sharp hem, a long tail) times rays along the curtain (1 more noise octave); colour by height
  const vn = `
float c_h(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float c_vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(c_h(i), c_h(i + vec2(1.0, 0.0)), f.x), mix(c_h(i + vec2(0.0, 1.0)), c_h(i + vec2(1.0, 1.0)), f.x), f.y); }
float c_fold(float x, float t, float k) { return 1.6 * c_vn(vec2(x * 0.08 + t * 0.01, k)) + 0.6 * c_vn(vec2(x * 0.23 - t * 0.02, k + 7.0)) + 0.2 * c_vn(vec2(x * 0.7 + t * 0.05, k + 13.0)); }`;
  const curtains = (N, K) => [`B. curtains, ${N} steps x ${K} curtain${K > 1 ? 's' : ''}`, 'aurora', part(`${NIGHT} ${STARS} vec3 au = vec3(0.0);
    if (dir.y > 0.02) { float t0 = 1.0 / dir.y, t1 = min(3.0 / dir.y, 40.0); float dt = (t1 - t0) / ${N}.0, j = aurora_hash(vec3(gl_FragCoord.xy, 1.0));
      for (int i = 0; i < ${N}; i++) { float s = t0 + (float(i) + j) * dt; vec3 p = dir * s; float h = p.y - 1.0;
        for (int k = 0; k < ${K}; k++) { float fk = float(k); float z = p.z - (4.0 + 5.0 * fk) - c_fold(p.x, t, fk * 3.0); float w = 0.06 + 0.03 * fk;
          float sheet = exp(-z * z / (w * w)); float ray = 0.35 + 0.65 * c_vn(vec2(p.x * 9.0 + t * 0.2, fk * 5.0 + 3.0));
          float hem = 0.25 * c_vn(vec2(p.x * 0.5, fk + 20.0)); float hh = h - hem; float em = smoothstep(-0.02, 0.02, hh) * (0.6 * exp(-max(hh, 0.0) / 0.15) + 0.4 * exp(-max(hh, 0.0) / (0.6 * ray + 0.2)));
          vec3 c = mix(uSkyA, uSkyB, smoothstep(0.2, 1.2, hh)); au += c * sheet * em * ray * dt * 0.9; } } }
    ${OUT}`).replace('vec3 skyPattern', vn + '\nvec3 skyPattern')];
  return [
    ['current aurora (for reference)', 'aurora', part('return aurora_full(dir, t);')],
    sheets(30, 4), sheets(50, 5),
    curtains(24, 1), curtains(32, 2), curtains(48, 3), curtains(64, 3), curtains(96, 3),
  ];
};
