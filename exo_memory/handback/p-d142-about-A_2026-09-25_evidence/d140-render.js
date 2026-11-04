// D140: render README.md's about block into the About tab's HTML, and splice it into index.html's #about.
//   node d140-render.js          -> prints the rendered block
//   node d140-render.js --apply  -> replaces the About body's old sections (all but "The loop") with the block
const fs = require('fs');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const md = fs.readFileSync(REPO + '/README.md', 'utf8').replace(/\r\n?/g, '\n');
const b = md.indexOf('<!-- about:begin'), e = md.indexOf('<!-- about:end -->');
const block = md.slice(md.indexOf('-->', b) + 3, e).trim();

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  // code first, so its contents are not read as emphasis; links render as their words (the app has no opener)
  const codes = [];
  s = s.replace(/`([^`]*)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s)
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_, text, url) => `<span class="aboutlink" title="${url.replace(/"/g, '&quot;')}">${text}</span>`)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/—/g, '&mdash;');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
}

const out = [];
let section = false, list = null, para = [];
const flushPara = () => { if (para.length) { out.push(`            <p>${inline(para.join(' '))}</p>`); para = []; } };
const flushList = () => { if (list) { out.push('            <ul>', ...list.map((li) => `              <li>${inline(li)}</li>`), '            </ul>'); list = null; } };
for (const line of block.split('\n')) {
  if (/^## /.test(line)) {
    flushPara(); flushList();
    if (section) out.push('          </section>', '');
    out.push('          <section>', `            <h2>${inline(line.slice(3))}</h2>`);
    section = true;
  } else if (/^- /.test(line)) {
    flushPara(); (list = list || []).push(line.slice(2));
  } else if (/^\s+\S/.test(line) && list) {
    list[list.length - 1] += ' ' + line.trim();
  } else if (line.trim() === '') {
    flushPara(); flushList();
  } else {
    flushList(); para.push(line.trim());
  }
}
flushPara(); flushList();
if (section) out.push('          </section>');
const rendered = [
  '          <!-- about:begin — rendered from README.md\'s about block, word for word; edit README.md, never this copy.',
  '               about-readme.test.js fails if the two drift. -->',
  ...out,
  '          <!-- about:end -->',
].join('\n');

if (!process.argv.includes('--apply')) { console.log(rendered); process.exit(0); }

const F = REPO + '/consonance/ui/index.html';
const html = fs.readFileSync(F, 'utf8');
const crlf = html.includes('\r\n');
const lines = html.replace(/\r\n/g, '\n');
const openBody = '        <div class="aboutbody">\n';
const loopOpen = '          <section>\n            <h2>The loop</h2>';
const bodyAt = lines.indexOf(openBody, lines.indexOf('<section id="about"'));
const loopAt = lines.indexOf(loopOpen, bodyAt);
const loopEnd = lines.indexOf('          </section>\n', loopAt) + '          </section>\n'.length;
const bodyEnd = lines.indexOf('        </div>\n      </div>\n    </section>', loopEnd);
if (bodyAt < 0 || loopAt < 0 || bodyEnd < 0) throw new Error('anchor not found');
const loop = lines.slice(loopAt, loopEnd);
const next = lines.slice(0, bodyAt + openBody.length) + rendered + '\n\n' + loop + lines.slice(bodyEnd);
fs.writeFileSync(F, crlf ? next.replace(/\n/g, '\r\n') : next);
console.log('applied; kept "The loop" section; removed:', (lines.slice(bodyAt, bodyEnd).match(/<h2>[^<]*<\/h2>/g) || []).filter((h) => !h.includes('The loop')).join(' | '));
