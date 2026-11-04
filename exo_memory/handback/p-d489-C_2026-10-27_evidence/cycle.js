// cycle.js (C, D489 addition): the 10-minute colour cycle as sky patterns, for skypass.js to time (CASES_FILE=cycle.js). Scratch, for cost only.
// Each case is today's aurora with its two colour tokens replaced by cA and cB, set at the top of skyPattern from the time:
//   hue    both tokens turned round the grey axis (Rodrigues, in RGB) by 2 pi t / 600: one full hue turn in 10 minutes
//   cosine a cosine palette (a + b cos(2 pi (c t / 600 + d))) for each, blended 50/50 with the token so it stays near the skin's colours
//   mix4   a path through four colour pairs (the tokens and three others), smoothstepped between neighbours, the "token sets" way done in the shader
// The pass draws today's aurora first (for reference) and last again, so drift across the run shows.
'use strict';
module.exports = (AU) => {
  const SRC = AU.replace('vec3 aurora_full(vec3 dir, float t)', 'vec3 aurora_full(vec3 dir, float t)');   // AU's skyPattern is renamed aurora_full
  const swap = (s) => s.replace(/uSkyA/g, 'cA').replace(/uSkyB/g, 'cB');
  const head = 'vec3 cA; vec3 cB;\n';
  const HUE = `
vec3 cyc_hue(vec3 c, float a) { vec3 k = vec3(0.57735); float co = cos(a), si = sin(a); return c * co + cross(k, c) * si + k * dot(k, c) * (1.0 - co); }`;
  const COS = `
vec3 cyc_cos(float x, vec3 d) { return 0.5 + 0.5 * cos(6.2831853 * (x + d)); }`;
  const MIX = `
vec3 cyc_path(float x, vec3 p0, vec3 p1, vec3 p2, vec3 p3) { float s = fract(x) * 4.0; float f = smoothstep(0.0, 1.0, fract(s)); int i = int(floor(s));
  if (i == 0) return mix(p0, p1, f); if (i == 1) return mix(p1, p2, f); if (i == 2) return mix(p2, p3, f); return mix(p3, p0, f); }`;
  const wrap = (name, helpers, set) => [name, 'aurora', head + helpers + '\n' + swap(SRC) + `\nvec3 skyPattern(vec3 dir, float t) { ${set} return aurora_full(dir, t); }\n`];
  const plain = ['today\'s aurora (reference)', 'aurora', AU + '\nvec3 skyPattern(vec3 dir, float t) { return aurora_full(dir, t); }\n'];
  return [
    plain,
    wrap('hue turn, per pixel', HUE, 'float a = 6.2831853 * t / 600.0; cA = clamp(cyc_hue(uSkyA, a), 0.0, 1.0); cB = clamp(cyc_hue(uSkyB, a), 0.0, 1.0);'),
    wrap('cosine palette, per pixel', COS, 'float x = t / 600.0; cA = mix(uSkyA, cyc_cos(x, vec3(0.0, 0.33, 0.67)), 0.5); cB = mix(uSkyB, cyc_cos(x + 0.5, vec3(0.0, 0.33, 0.67)), 0.5);'),
    wrap('four-pair path, per pixel', MIX, 'float x = t / 600.0; cA = cyc_path(x, uSkyA, vec3(0.2, 0.9, 0.9), vec3(0.5, 0.4, 1.0), vec3(1.0, 0.45, 0.6)); cB = cyc_path(x + 0.25, uSkyB, vec3(0.3, 0.6, 1.0), vec3(1.0, 0.4, 0.7), vec3(0.4, 1.0, 0.7));'),
    wrap('tokens as uniforms, no cycle (control: the swap itself)', '', 'cA = uSkyA; cB = uSkyB;'),
    plain.map((x, i) => (i === 0 ? x + ', again' : x)),
  ];
};
