const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const searchQuery = req.query.query || "ジョイパレット(JOYPALETTE) アンパンマン キラ★ピカ★いっしょにステージ ミュージックショー";

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/tmp/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  // ネットワークリソースの最適化（画像、CSS、フォント、メディアのみブロック）
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto('https://jp.mercari.com/', { timeout: 60000 });

    await page.waitForSelector('.sc-666d09b4-2', { timeout: 60000 });

    await page.evaluate(() => {
      const element = document.querySelector('.sc-666d09b4-2');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    await page.type('.sc-666d09b4-2', searchQuery);
    await page.keyboard.press('Enter');

    // ページ遷移を待機
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });

    const currentUrl = page.url();

    // item-grid が表示されるまで待機
    await page.waitForSelector('#item-grid ul', { timeout: 90000 });

    // チェックボックスが読み込まれるまで待機
    await page.waitForSelector('[data-testid="on-sale-condition-checkbox"]', { timeout: 30000 });
    await page.evaluate(() => {
      const checkbox = document.querySelector('[data-testid="on-sale-condition-checkbox"]');
      if (checkbox && checkbox.type === 'checkbox' && !checkbox.checked) {
        checkbox.click();
      }
    });

    // ul の HTML を取得
    const ulHtml = await page.evaluate(() => {
      const itemGrid = document.querySelector('#item-grid');
      if (itemGrid) {
        const ul = itemGrid.querySelector('ul');
        return ul ? ul.outerHTML : 'ul not found';
      }
      return 'item-grid not found';
    });

    res.json({
      message: '検索結果',
      currentUrl,
      ulHtml
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ページの読み込みに失敗しました。' });
  } finally {
    await browser.close();
  }

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
