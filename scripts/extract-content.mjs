import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';

await mkdir('docs/research', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Capture network responses for video files
const videoUrls = new Set();
page.on('response', (resp) => {
  const u = resp.url();
  const ct = resp.headers()['content-type'] || '';
  if (ct.startsWith('video/') || /\.(mp4|webm|m3u8|mpd)/i.test(u)) videoUrls.add(u);
});

await page.goto('https://copula.agency/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);

// Slow scroll
const totalH = await page.evaluate(() => document.body.scrollHeight);
for (let p = 0; p < totalH + 1500; p += 350) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p);
  await page.waitForTimeout(450);
}
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(1500);

// Pull all the verbatim text content per section
const text = await page.evaluate(() => {
  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim(); }
  const main = document.querySelector('main');
  const out = {};

  // Header nav links
  const navLinks = [...document.querySelectorAll('header nav a, header nav button')]
    .map(a => ({ text: clean(a.textContent), href: a.getAttribute('href') }))
    .filter(x => x.text);
  out.nav = navLinks;
  out.headerBadgeText = clean(document.querySelector('header .hide-on-slide-in p')?.textContent);

  // Sections
  out.sections = [...main.children].map((s, idx) => {
    const ms = {};
    ms.idx = idx;
    ms.cls = (s.className || '').toString();
    // Hero
    if (idx === 0) {
      ms.headline_top = clean(s.querySelector('h1')?.textContent);
      ms.headline_bottom = clean(s.querySelectorAll('h1')[1]?.textContent);
      const cta = s.querySelector('a');
      ms.cta = { text: clean(cta?.textContent), href: cta?.getAttribute('href') };
    }
    // Services / Manifesto / etc — capture all text nodes
    ms.allText = clean(s.textContent);

    // For services-like blocks (accordion-y) find category labels & items
    const accordionTitles = [...s.querySelectorAll('[data-state]')].map(el => clean(el.textContent)).filter(Boolean);
    ms.accordionTitles = accordionTitles.slice(0, 30);

    // Images in section
    ms.images = [...s.querySelectorAll('img')].map(i => ({
      src: i.src, alt: i.alt
    }));

    // Videos in section
    ms.videos = [...s.querySelectorAll('video')].map(v => ({
      src: v.src || v.querySelector('source')?.src,
      poster: v.poster
    }));

    // Anchors in section
    ms.anchors = [...s.querySelectorAll('a')].map(a => ({
      text: clean(a.textContent), href: a.getAttribute('href')
    })).filter(a => a.text || a.href);

    // Headings
    ms.headings = [...s.querySelectorAll('h1,h2,h3,h4,h5,h6,p.h1,p.h2,p.h3,p.h4,[class*="display"]')]
      .map(h => ({ tag: h.tagName.toLowerCase(), text: clean(h.textContent), cls: (h.className||'').toString().slice(0,80) }))
      .filter(h => h.text)
      .slice(0, 25);
    return ms;
  });

  // Footer text
  const footer = document.querySelector('footer');
  out.footer = footer ? {
    text: clean(footer.textContent),
    anchors: [...footer.querySelectorAll('a')].map(a => ({
      text: clean(a.textContent), href: a.getAttribute('href')
    })).filter(a => a.text || a.href),
    socialBlock: clean(footer.querySelector('.contents.justify-between')?.textContent),
  } : null;

  // Cookie consent
  const cc = document.querySelector('#cookie-consent');
  out.cookie = cc ? { text: clean(cc.textContent), buttons: [...cc.querySelectorAll('button')].map(b => clean(b.textContent)) } : null;

  return out;
});

// Try clicking around to collect featured-work titles/cards
// Featured work seems to have multiple "rows"
const fw = await page.evaluate(() => {
  const main = document.querySelector('main');
  const sec = main.children[4]; // featured work
  // Find each work row — they alternate between collapsed/expanded
  const rows = [...sec.querySelectorAll('[data-state]')].map(el => ({
    state: el.getAttribute('data-state'),
    text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 400),
    images: [...el.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt })),
    videos: [...el.querySelectorAll('video')].map(v => ({ src: v.src || v.querySelector('source')?.src, poster: v.poster })),
  }));
  // Click each "trigger" to see content
  return { rows };
});

// Try to expand all feature work rows
try {
  const triggers = await page.$$('main > section:nth-child(5) [data-state]');
  for (const t of triggers) {
    try { await t.click({ timeout: 1500 }); } catch {}
    await page.waitForTimeout(700);
  }
} catch {}

await page.waitForTimeout(2000);
const fwExpanded = await page.evaluate(() => {
  const main = document.querySelector('main');
  const sec = main.children[4];
  if (!sec) return null;
  return {
    text: sec.textContent.replace(/\s+/g, ' ').trim(),
    rows: [...sec.querySelectorAll('[data-state]')].map(el => ({
      state: el.getAttribute('data-state'),
      text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 600),
      images: [...el.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt })),
      videos: [...el.querySelectorAll('video')].map(v => ({ src: v.src || v.querySelector('source')?.src, poster: v.poster })),
    })),
    images: [...sec.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt })),
    videos: [...sec.querySelectorAll('video')].map(v => ({ src: v.src || v.querySelector('source')?.src, poster: v.poster })),
  };
});

// Also expand services accordion
try {
  const triggers = await page.$$('main > section:nth-child(3) [data-state]');
  for (const t of triggers) {
    try { await t.click({ timeout: 1500 }); } catch {}
    await page.waitForTimeout(500);
  }
} catch {}
await page.waitForTimeout(1000);
const servicesExpanded = await page.evaluate(() => {
  const main = document.querySelector('main');
  const sec = main.children[2];
  if (!sec) return null;
  return { text: sec.textContent.replace(/\s+/g, ' ').trim() };
});

text.featuredWorkExpanded = fwExpanded;
text.servicesExpanded = servicesExpanded;
text.videosFromNetwork = [...videoUrls];

await writeFile('docs/research/content.json', JSON.stringify(text, null, 2));

await browser.close();
console.log('Content extracted');
console.log('Videos found:', videoUrls.size);
