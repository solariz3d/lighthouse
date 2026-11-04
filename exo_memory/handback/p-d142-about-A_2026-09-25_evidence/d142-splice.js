// D142: replace the WHOLE About body with the rendered README block (the loop diagram goes, per the keeper), and put
// the README's lead line under the tagline in the hero. Rendering is d140-render.js's (printed, not applied).
const fs = require('fs'), { execFileSync } = require('child_process'), path = require('path');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const rendered = execFileSync(process.execPath, [path.join(__dirname, 'd140-render.js')], { encoding: 'utf8' }).replace(/\n$/, '');
const md = fs.readFileSync(REPO + '/README.md', 'utf8').replace(/\r\n?/g, '\n');
// the lead line: the bold paragraph right after the tagline, README.md:5-6
const lead = /^\*Instances, in concert\.\*\n\n\*\*([^*]+)\*\*\n/m.exec(md);
if (!lead) throw new Error('README lead line not found under the tagline');
const leadHtml = lead[1].replace(/\s*\n\s*/g, ' ').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/—/g, '&mdash;');

const F = REPO + '/consonance/ui/index.html';
const html = fs.readFileSync(F, 'utf8');
const crlf = html.includes('\r\n');
let s = html.replace(/\r\n/g, '\n');
const openBody = '        <div class="aboutbody">\n';
const bodyAt = s.indexOf(openBody, s.indexOf('<section id="about"'));
const bodyEnd = s.indexOf('        </div>\n      </div>\n    </section>', bodyAt);
if (bodyAt < 0 || bodyEnd < 0) throw new Error('about body anchors not found');
const removed = (s.slice(bodyAt, bodyEnd).match(/<h2>[^<]*<\/h2>/g) || []);
s = s.slice(0, bodyAt + openBody.length) + rendered + '\n' + s.slice(bodyEnd);

const tag = '          <p class="tagline">Instances, in concert.</p>\n';
if (s.split(tag).length !== 2) throw new Error('hero tagline not found exactly once');
s = s.replace(tag, tag + `          <p class="lead">${leadHtml}</p>\n`);
fs.writeFileSync(F, crlf ? s.replace(/\n/g, '\r\n') : s);
console.log('applied. the body held:', removed.join(' | '));
console.log('lead:', leadHtml);
