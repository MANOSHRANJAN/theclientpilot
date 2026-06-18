import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';

await mkdir('docs/research', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://copula.agency/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);

const totalH = await page.evaluate(() => document.body.scrollHeight);
for (let p = 0; p < totalH + 1500; p += 400) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p);
  await page.waitForTimeout(280);
}
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(2000);

// Walk every direct child of <main> and extract structured content
const data = await page.evaluate(() => {
  const propsToCapture = [
    'fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textTransform',
    'backgroundColor','padding','margin','width','height','maxWidth','minHeight',
    'display','flexDirection','justifyContent','alignItems','gap','gridTemplateColumns',
    'borderRadius','border','position','top','right','bottom','left','zIndex',
    'opacity','transform','textAlign','overflow'
  ];
  function styleSnapshot(el) {
    const cs = getComputedStyle(el);
    const out = {};
    for (const p of propsToCapture) {
      const v = cs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)' && v !== 'static') out[p] = v;
    }
    return out;
  }

  function rectOf(el) {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  }

  function summarizeChild(el, depth = 0, maxDepth = 4) {
    const tag = el.tagName.toLowerCase();
    const cls = (el.className?.toString() || '').slice(0, 250);
    const isText = el.children.length === 0 && el.textContent.trim().length > 0;
    const text = isText ? el.textContent.replace(/\s+/g, ' ').trim().slice(0, 400) : null;
    const node = {
      tag, cls,
      text,
      rect: rectOf(el),
      styles: styleSnapshot(el),
    };
    if (tag === 'img') node.img = { src: el.src, alt: el.alt, srcset: el.srcset?.slice(0, 1500) };
    if (tag === 'video') node.video = { src: el.src || el.querySelector('source')?.src, poster: el.poster };
    if (tag === 'svg') node.svg = el.outerHTML.slice(0, 1200);
    if (tag === 'a') node.href = el.getAttribute('href');
    if (depth < maxDepth) {
      node.children = [...el.children].slice(0, 30).map(c => summarizeChild(c, depth + 1, maxDepth));
    }
    return node;
  }

  // Header
  const header = document.querySelector('header');
  // Top-level sections in main
  const main = document.querySelector('main');
  const mainSections = [...main.children].map((s, i) => ({ idx: i, ...summarizeChild(s, 0, 5) }));

  // Footer
  const footer = document.querySelector('footer');

  // Page-wide info
  return {
    bodyClass: document.body.className,
    htmlClass: document.documentElement.className,
    bodyStyles: (() => {
      const cs = getComputedStyle(document.body);
      return { fontFamily: cs.fontFamily, fontSize: cs.fontSize, color: cs.color, backgroundColor: cs.backgroundColor };
    })(),
    header: summarizeChild(header, 0, 6),
    main: { children: mainSections, totalSections: mainSections.length },
    footer: summarizeChild(footer, 0, 5),
  };
});

await writeFile('docs/research/sections.json', JSON.stringify(data, null, 2));
console.log('Extracted main sections:', data.main.totalSections);

await browser.close();
