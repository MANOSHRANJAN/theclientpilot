import { chromium } from 'playwright';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import https from 'https';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

const TARGET = 'https://copula.agency/';
const PUBLIC = 'public';
const REF = 'docs/design-references';
const OUT = 'docs/research';

await mkdir(`${PUBLIC}/images`, { recursive: true });
await mkdir(`${PUBLIC}/videos`, { recursive: true });
await mkdir(`${PUBLIC}/seo`, { recursive: true });
await mkdir(`${PUBLIC}/fonts`, { recursive: true });

function fetchToFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchToFile(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const cdnHits = new Set();
const videoHits = new Set();

page.on('response', async (resp) => {
  const u = resp.url();
  const ct = resp.headers()['content-type'] || '';
  if (u.includes('digitaloceanspaces') && (ct.startsWith('image/') || /\.(webp|png|jpg|jpeg|svg)/i.test(u))) {
    cdnHits.add(u);
  }
  if (ct.startsWith('video/') || /\.(mp4|webm|mov)/i.test(u)) {
    videoHits.add(u);
  }
  if (u.includes('.woff2')) {
    cdnHits.add(u);
  }
});

await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);

// Slow scroll all the way down to trigger lazy loaders
const totalH = await page.evaluate(() => document.body.scrollHeight);
for (let p = 0; p < totalH + 1500; p += 400) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p);
  await page.waitForTimeout(350);
}
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(1500);

// Extract all <img> src + <source> src from <picture>/<video>
const allMedia = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(img => {
    const url = img.src || img.currentSrc;
    return url;
  });
  const sources = [...document.querySelectorAll('source')].map(s => s.src || s.getAttribute('srcset'));
  const videos = [...document.querySelectorAll('video')].map(v => v.src || v.querySelector('source')?.src);
  const posters = [...document.querySelectorAll('video[poster]')].map(v => v.poster);
  return { imgs, sources, videos, posters };
});

// Trigger an "interaction sweep" — capture video URLs that load only when in viewport
await page.waitForTimeout(2000);

// Extract underlying CDN paths for images served via _next/image
function extractRealUrl(u) {
  try {
    const parsed = new URL(u);
    if (parsed.pathname.startsWith('/_next/image')) {
      const inner = parsed.searchParams.get('url');
      if (inner) return decodeURIComponent(inner);
    }
    return u;
  } catch { return u; }
}

const allUrls = new Set();
for (const arr of [allMedia.imgs, allMedia.sources, allMedia.videos, allMedia.posters, [...cdnHits], [...videoHits]]) {
  for (const u of arr) {
    if (!u) continue;
    const real = extractRealUrl(u);
    if (real.startsWith('http')) allUrls.add(real);
  }
}

// Fonts as well
const fonts = await page.evaluate(() => [...document.querySelectorAll('link[as="font"], link[href*=".woff"]')].map(l => l.href));
for (const f of fonts) allUrls.add(f);

// Manually request Bebas Neue & Mulish from Google to get proper font files (Next.js may have hashed them)
// Actually Next /fonts/Mulish & Bebas Neue served from /_next/static/media. Capture those.
// Try fetching the actual woff2 files we saw
const nextFontUrls = [
  'https://copula.agency/_next/static/media/3be83a346553616c-s.p.woff2',
  'https://copula.agency/_next/static/media/6c25f6e897d845a3-s.p.woff2',
];
for (const f of nextFontUrls) allUrls.add(f);

console.log('Discovered URLs:', allUrls.size);

const downloads = [];
const mapping = {}; // remote -> local

for (const u of allUrls) {
  try {
    const parsed = new URL(u);
    let localDir = `${PUBLIC}/images`;
    let ext = path.extname(parsed.pathname).toLowerCase();
    let basename = decodeURIComponent(path.basename(parsed.pathname));
    if (!ext || ext === '.') {
      // probably _next/image — derive ext from inner
      ext = '.webp';
      basename += ext;
    }
    if (/\.woff2$/i.test(parsed.pathname)) {
      localDir = `${PUBLIC}/fonts`;
    } else if (/\.(mp4|webm|mov)$/i.test(parsed.pathname)) {
      localDir = `${PUBLIC}/videos`;
    } else if (/\.ico$/i.test(parsed.pathname)) {
      localDir = `${PUBLIC}/seo`;
    }
    // Sanitize basename
    basename = basename.replace(/[^\w.\- ]/g, '_').replace(/\s+/g, '-');
    const dest = path.join(localDir, basename);
    if (existsSync(dest)) { mapping[u] = dest.replace(`${PUBLIC}/`, '/'); continue; }
    downloads.push((async () => {
      try {
        await fetchToFile(u, dest);
        mapping[u] = dest.replace(`${PUBLIC}/`, '/');
      } catch (e) {
        console.warn('FAIL', u, e.message);
      }
    })());
  } catch (e) {
    console.warn('skip', u, e.message);
  }
}

await Promise.all(downloads);
await writeFile(`${OUT}/asset-mapping.json`, JSON.stringify(mapping, null, 2));

// Also download icon.ico
try {
  await fetchToFile('https://copula.agency/icon.ico', `${PUBLIC}/seo/favicon.ico`);
} catch {}

await browser.close();
console.log('Downloads complete:', Object.keys(mapping).length);
