import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

await mkdir('docs/design-references', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:3033/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);
const totalH = await page.evaluate(() => document.body.scrollHeight);
for (let p = 0; p < totalH + 800; p += 400) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p);
  await page.waitForTimeout(300);
}
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(1500);
await page.screenshot({ path: 'docs/design-references/clone-full.png', fullPage: true });

// Section snapshots
const positions = [0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200, 8100, 9000, 9900, 10800, 11700, 12600, 13500];
for (let i = 0; i < positions.length; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), positions[i]);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `docs/design-references/clone-${String(i).padStart(2,'0')}.png` });
}

await browser.close();
console.log('Clone screenshots done');
