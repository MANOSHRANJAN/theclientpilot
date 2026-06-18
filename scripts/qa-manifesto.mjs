import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
await mkdir('docs/design-references/qa', { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1500);
const heroH = await p.evaluate(() => document.querySelector('main > section').offsetHeight);
const positions = [heroH + 0, heroH + 800, heroH + 1600, heroH + 2400, heroH + 3200, heroH + 4000];
for (let i = 0; i < positions.length; i++) {
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), positions[i]);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `docs/design-references/qa/manifesto-${i}.png` });
}
await b.close();
console.log('done');
