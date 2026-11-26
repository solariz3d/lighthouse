const o = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8').replace(/^[^{]*/, ''));
console.log(o.chrome);
for (const r of o.rows) console.log(r.look.padEnd(13), r.size, 'left', JSON.stringify(r.left), 'scrollH', r.leftScrollH, 'cw', r.leftClientW, 'm', r.margin, 'rad', r.radius, 'op', r.opacity, 'clip', (r.clip || '').slice(0, 30), 'maxH', r.maxH, 'cols', r.cols,
  '\n   hud', JSON.stringify(r.hud), r.hudText, 'hudTop', r.hudTop, 'values', JSON.stringify(r.values), 'guideOpen', JSON.stringify(r.guideOpen), 'card', JSON.stringify(r.guideCard),
  '\n   camBar', JSON.stringify(r.cameraBar), 'keys', JSON.stringify(r.cameraKeys), 'canvas', JSON.stringify(r.canvas), 'xb', JSON.stringify(r.exportBanner), 'open', r.openSupported, 'theme', r.theme, 'banner', JSON.stringify(r.banner), 'header', JSON.stringify(r.header));
