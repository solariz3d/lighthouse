// randprobe.js: at d582c9e, with Random already saved/ticked (the default), does clicking Random again change the look?
const P = require('./pagelib.js');
(async () => {
  const h = await P.open('C:/Users/nname/Downloads/t180-wt-a21', { args: [] });
  try {
    const res = [];
    for (let run = 0; run < 3; run++) {
      await h.load({ storage: { 't180.guide.done': '1' } });
      const look = () => h.ev("return document.documentElement.getAttribute('data-theme');");
      const before = await look();
      await h.ev("const d = document.getElementById('m-settings'); d.querySelector('summary').click(); await new Promise((r) => setTimeout(r, 150)); return true;");
      const ticked = await h.ev("const e = [...document.querySelectorAll('#m-settings label')].find((x) => x.textContent.trim() === 'Random'); return e.querySelector('input').checked;");
      const clicks = [];
      for (let k = 0; k < 4; k++) {
        await h.ev("const e = [...document.querySelectorAll('#m-settings label')].find((x) => x.textContent.trim() === 'Random'); e.click(); await new Promise((r) => setTimeout(r, 300)); return true;");
        clicks.push(await look());
      }
      res.push({ before, randomTicked: ticked, afterClicks: clicks });
    }
    console.log(JSON.stringify(res));
  } finally { await h.close(); }
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
