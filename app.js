const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const searchQuery = req.query.query || "ジョイパレット アンパンマン ミュージックショー";

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/tmp/chrome-linux64/chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--no-zygote',
      '--single-process'
    ]
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto('https://jp.mercari.com/', {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('.sc-666d09b4-2', { timeout: 10000 });
    await page.type('.sc-666d09b4-2', searchQuery);
    await page.keyboard.press('Enter');

    // await page.waitForSelector('#item-grid ul', { timeout: 20000 });

    // const checkbox = await page.$('[data-testid="on-sale-condition-checkbox"]');
    // if (checkbox) await checkbox.click();

    // const ulHtml = await page.evaluate(() => {
    //   const ul = document.querySelector('#item-grid ul');
    //   return ul ? ul.outerHTML : 'ul not found';
    // });

    res.json({
      message: '検索結果',
      currentUrl: page.url(),
      ulHtml
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '処理失敗', detail: error.message });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
