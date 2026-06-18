#!/bin/bash

set -euo pipefail

URL="${1:-}"

if [ -z "$URL" ]; then
  echo "Usage: ./pipeline.sh <url>" >&2
  exit 1
fi

OUTPUT="$(pwd)/page.html"
SCREENSHOT="$(pwd)/screenshot.png"

echo "Fetching via stealth Playwright..."

TARGET_URL="$URL" OUTPUT_PATH="$OUTPUT" SCREENSHOT_PATH="$SCREENSHOT" \
node - <<'EOF'
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-size=1440,900',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    geolocation: { latitude: 28.6139, longitude: 77.2090 },
    permissions: ['geolocation'],
    extraHTTPHeaders: {
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'sec-ch-ua': '"Chromium";v="123", "Not:A-Brand";v="8"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
    },
    storageState: undefined,
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-IN', 'en'] });
    window.chrome = { runtime: {} };
  });

  const page = await context.newPage();

  await page.mouse.move(300 + Math.random() * 200, 200 + Math.random() * 100);

  console.log('Navigating to', process.env.TARGET_URL);
  try {
    await page.goto(process.env.TARGET_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

    await Promise.race([
      page.waitForSelector('nav, header, [class*="navbar"], [class*="hero"]', { timeout: 15000 }),
      page.waitForTimeout(10000),
    ]);

    await page.waitForTimeout(4000);

    const title = await page.title();
    console.log('Page title:', title);
    await page.screenshot({ path: process.env.SCREENSHOT_PATH, fullPage: false });
    console.log('Screenshot saved');

    const html = await page.content();
    require('fs').writeFileSync(process.env.OUTPUT_PATH, html);
    console.log('Saved', html.length, 'bytes ->', process.env.OUTPUT_PATH);

  } catch (e) {
    console.error('Failed:', e.message);
    try {
      const html = await page.content();
      require('fs').writeFileSync(process.env.OUTPUT_PATH, html);
      await page.screenshot({ path: process.env.SCREENSHOT_PATH });
      console.error('Partial page saved for inspection.');
    } catch {}
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
EOF

BYTES=$(wc -c < "$OUTPUT")
TITLE=$(node -e "
  const fs = require('fs');
  const html = fs.readFileSync('$OUTPUT', 'utf8');
  const m = html.match(/<title>(.*?)<\\/title>/i);
  console.log(m ? m[1] : 'unknown');
" 2>/dev/null || echo "unknown")

echo "page.html: $BYTES bytes | title: $TITLE"
echo "screenshot: $SCREENSHOT"

if [ "$BYTES" -lt 50000 ]; then
  echo "Still too small ($BYTES bytes). Check screenshot.png to see what the browser got." >&2
  exit 1
fi

echo "Running Codex analysis..."
TARGET_URL="$URL" OUTPUT_PATH="$OUTPUT" SCREENSHOT_PATH="$SCREENSHOT" \
codex exec "Analyze page.html and generate a full faithful Next.js clone of the homepage using Tailwind and shadcn. Replace src/components/indigo-error-page.tsx and src/app/page.tsx."
