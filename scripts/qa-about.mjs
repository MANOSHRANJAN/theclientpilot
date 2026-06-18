import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
await mkdir('docs/design-references/qa', { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1500);

// Find About section: it's the 7th main section. Get its top.
const aboutTop = await p.evaluate(() => {
  const sections = document.querySelectorAll('main > section');
  const about = sections[6]; // 0-Hero 1-Manifesto 2-Services 3-Cta 4-Featured 5-Clients 6-About
  return about.getBoundingClientRect().top + window.scrollY;
});

const offsets = [0, 600, 1200, 1800, 2400, 3000, 3600, 4200, 4800];
for (let i = 0; i < offsets.length; i++) {
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), aboutTop + offsets[i]);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `docs/design-references/qa/about-${i}.png` });
}
await b.close();
console.log('done', aboutTop);
