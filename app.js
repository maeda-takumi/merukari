const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    return res.status(400).send('Query parameter `q` is required');
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/tmp/chrome-linux64/chrome',
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${query}`);

    // Google検索結果のページタイトルを取得
    const title = await page.title();
    await browser.close();

    res.send({ title });  // タイトルをレスポンスとして返す
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to scrape the page');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
