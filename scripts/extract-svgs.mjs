import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://copula.agency/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);

// Slow scroll
const totalH = await page.evaluate(() => document.body.scrollHeight);
for (let p = 0; p < totalH + 500; p += 500) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p);
  await page.waitForTimeout(300);
}
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(800);

const svgs = await page.evaluate(() => {
  const all = [...document.querySelectorAll('svg')];
  const seen = new Set();
  const out = [];
  all.forEach((s, i) => {
    const html = s.outerHTML;
    if (seen.has(html)) return;
    seen.add(html);
    out.push({
      i,
      vb: s.getAttribute('viewBox'),
      w: s.getAttribute('width'),
      h: s.getAttribute('height'),
      cls: (s.getAttribute('class') || '').slice(0, 80),
      parent: s.parentElement?.tagName + '.' + (s.parentElement?.className?.toString() || '').slice(0, 80),
      html,
    });
  });
  return out;
});

await writeFile('docs/research/svgs.json', JSON.stringify(svgs, null, 2));
console.log('Unique SVGs:', svgs.length);
await browser.close();
