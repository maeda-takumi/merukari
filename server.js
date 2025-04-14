// server.js
const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();

app.get('/scrape', async (req, res) => {
  const query = req.query.q || 'Google';

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/tmp/chrome-linux64/chrome',
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    const title = await page.title();

    await browser.close();

    res.json({ title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'スクレイピングに失敗しました' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
