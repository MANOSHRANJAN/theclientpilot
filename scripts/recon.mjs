import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';

const URL = 'https://copula.agency/';
const OUT = 'docs/research';
const REF = 'docs/design-references';

await mkdir(OUT, { recursive: true });
await mkdir(REF, { recursive: true });
await mkdir(`${OUT}/components`, { recursive: true });

const browser = await chromium.launch();

// Desktop pass
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await desktop.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

// Full-page desktop screenshot
await page.screenshot({ path: `${REF}/desktop-full.png`, fullPage: true });

// Capture page HTML and head
const html = await page.content();
await writeFile(`${OUT}/page.html`, html);

// Extract assets, fonts, color usage, computed styles
const inventory = await page.evaluate(() => {
  const styles = new Map();
  const colors = new Map();
  const allEls = [...document.querySelectorAll('*')];

  function bump(map, key) { map.set(key, (map.get(key) || 0) + 1); }

  for (const el of allEls.slice(0, 5000)) {
    const cs = getComputedStyle(el);
    bump(colors, cs.color);
    bump(colors, cs.backgroundColor);
    bump(styles, `${cs.fontFamily}|${cs.fontSize}|${cs.fontWeight}`);
  }

  const images = [...document.querySelectorAll('img')].map(img => ({
    src: img.src || img.currentSrc,
    srcset: img.srcset,
    alt: img.alt,
    w: img.naturalWidth,
    h: img.naturalHeight,
    cls: img.className?.toString()?.slice(0, 80),
  }));

  const videos = [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src,
    poster: v.poster,
    autoplay: v.autoplay,
    loop: v.loop,
    muted: v.muted,
  }));

  const bgImages = [...document.querySelectorAll('*')]
    .map(el => ({ el: el.tagName + '.' + (el.className?.toString()?.split(' ')[0] || ''), bg: getComputedStyle(el).backgroundImage }))
    .filter(x => x.bg && x.bg !== 'none');

  const fonts = [...document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"]')]
    .filter(l => l.href.includes('font') || l.as === 'font')
    .map(l => l.href);

  const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src);

  const favicons = [...document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')]
    .map(l => ({ rel: l.rel, href: l.href, sizes: l.sizes?.toString() }));

  const meta = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    og: [...document.querySelectorAll('meta[property^="og:"]')].map(m => ({ p: m.getAttribute('property'), c: m.content })),
  };

  // Top-level body children — page topology
  const topology = [...document.body.children].map(child => ({
    tag: child.tagName,
    id: child.id,
    cls: child.className?.toString()?.slice(0, 200),
    text: child.textContent?.slice(0, 200),
    rect: child.getBoundingClientRect ? (() => { const r = child.getBoundingClientRect(); return { w: r.width, h: r.height, t: r.top }; })() : null,
  }));

  // Sections inside the page
  const sectionEls = [...document.querySelectorAll('section, header, footer, main, nav, [data-section]')];
  const sections = sectionEls.map(s => {
    const r = s.getBoundingClientRect();
    return {
      tag: s.tagName,
      id: s.id,
      cls: s.className?.toString()?.slice(0, 200),
      top: r.top + window.scrollY,
      h: r.height,
      text: s.textContent?.trim()?.slice(0, 300),
    };
  });

  return {
    meta,
    favicons,
    fontsFromLinks: fonts,
    fontStylesUsed: [...styles.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40),
    colorsUsed: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40),
    images,
    videos,
    bgImages: bgImages.slice(0, 80),
    scripts: scripts.slice(0, 40),
    topology,
    sections,
    bodyClass: document.body.className,
    htmlClass: document.documentElement.className,
    rootStyles: (() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        color: cs.color,
        background: cs.background,
      };
    })(),
    bodyStyles: (() => {
      const cs = getComputedStyle(document.body);
      return {
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        background: cs.background,
      };
    })(),
  };
});

await writeFile(`${OUT}/inventory.json`, JSON.stringify(inventory, null, 2));

// Mobile pass
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const mp = await mobile.newPage();
await mp.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await mp.waitForTimeout(2000);
await mp.screenshot({ path: `${REF}/mobile-full.png`, fullPage: true });

await browser.close();
console.log('Recon complete:', JSON.stringify({
  imagesCount: inventory.images.length,
  videosCount: inventory.videos.length,
  sectionsCount: inventory.sections.length,
  topologyCount: inventory.topology.length,
}));
