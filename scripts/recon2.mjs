import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';

const URL = 'https://copula.agency/';
const OUT = 'docs/research';
const REF = 'docs/design-references';

await mkdir(OUT, { recursive: true });
await mkdir(REF, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

// Scroll the entire page slowly to trigger lazy-loaded content & animations
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
let pos = 0;
const stepHeight = 600;
while (pos < totalHeight + 1000) {
  await page.evaluate((p) => window.scrollTo({ top: p, behavior: 'instant' }), pos);
  await page.waitForTimeout(450);
  pos += stepHeight;
}
// Scroll back to top
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(2500);

// Full-page screenshot now that content is loaded
await page.screenshot({ path: `${REF}/desktop-full.png`, fullPage: true });

// Capture the post-hydration HTML
const html = await page.content();
await writeFile(`${OUT}/page-rendered.html`, html);

// Get all images now that lazy-loaded ones are mounted
const inv = await page.evaluate(() => {
  const images = [...document.querySelectorAll('img')].map((img) => ({
    src: img.src || img.currentSrc,
    srcset: img.srcset?.slice(0, 2000),
    alt: img.alt,
    w: img.naturalWidth,
    h: img.naturalHeight,
    cls: (img.className?.toString() || '').slice(0, 200),
    parent: img.parentElement?.tagName + '.' + (img.parentElement?.className?.toString() || '').slice(0, 100),
  }));

  const videos = [...document.querySelectorAll('video')].map((v) => ({
    src: v.src || v.querySelector('source')?.src,
    poster: v.poster,
  }));

  const sections = [];
  const candidates = [...document.querySelectorAll('section, header, footer, main > div, main > section, [class*="section"]')];
  for (const s of candidates) {
    const r = s.getBoundingClientRect();
    if (r.height < 30) continue;
    sections.push({
      tag: s.tagName,
      cls: (s.className?.toString() || '').slice(0, 250),
      top: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      text: s.textContent?.replace(/\s+/g, ' ').trim()?.slice(0, 250),
      childCount: s.children.length,
    });
  }

  // SVG inventory
  const svgs = [...document.querySelectorAll('svg')].slice(0, 60).map((s, i) => ({
    i, vb: s.getAttribute('viewBox'),
    w: s.getAttribute('width'), h: s.getAttribute('height'),
    inner: s.outerHTML.slice(0, 1200),
    parent: s.parentElement?.tagName + '.' + (s.parentElement?.className?.toString() || '').slice(0, 80),
  }));

  return { images, videos, sections, svgs };
});

await writeFile(`${OUT}/inventory2.json`, JSON.stringify(inv, null, 2));

// Section screenshots: capture viewport snapshots at key scroll positions
const positions = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000, 8800, 9600, 10400, 11200, 12000, 12800, 13600, 14400];
let i = 0;
for (const p of positions) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${REF}/section-${String(i).padStart(2, '0')}.png` });
  i++;
}

// Mobile pass
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const mp = await mctx.newPage();
await mp.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
const mh = await mp.evaluate(() => document.body.scrollHeight);
let mpos = 0;
while (mpos < mh + 800) {
  await mp.evaluate((p) => window.scrollTo({ top: p, behavior: 'instant' }), mpos);
  await mp.waitForTimeout(350);
  mpos += 500;
}
await mp.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await mp.waitForTimeout(1500);
await mp.screenshot({ path: `${REF}/mobile-full.png`, fullPage: true });

await browser.close();
console.log('Recon v2 done', JSON.stringify({
  imgs: inv.images.length,
  videos: inv.videos.length,
  sections: inv.sections.length,
  svgs: inv.svgs.length,
}));
