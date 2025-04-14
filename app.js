const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const searchQuery = req.query.query || "ジョイパレット(JOYPALETTE) アンパンマン キラ★ピカ★いっしょにステージ ミュージックショー";

  const browser = await puppeteer.launch({
    headless: true,  // ヘッドレスモードで動作
    executablePath: '/tmp/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });


  const page = await browser.newPage();
  
  // 画面サイズをデスクトップ向けに設定
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // ページの読み込みを待機、タイムアウト時間を60秒に設定
    await page.goto('https://jp.mercari.com/', { timeout: 60000 });

    // 検索ボックスが表示されるまで待機
    await page.waitForSelector('.sc-666d09b4-2', { timeout: 60000 });

    // 検索ボックスが表示されたらスクロールして表示
    await page.evaluate(() => {
      const element = document.querySelector('.sc-666d09b4-2');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // 検索ワードを入力
    await page.type('.sc-666d09b4-2', searchQuery);
    await page.keyboard.press('Enter');
    
    // 検索結果が表示されるまで待機
    await page.waitForSelector('.items-box', { timeout: 60000 });

    // 最初の商品情報を取得
    const result = await page.evaluate(() => {
      const items = document.querySelectorAll('.items-box');
      
      if (items.length > 0) {
        const firstItem = items[0];
        const itemName = firstItem.querySelector('.items-box-name') ? firstItem.querySelector('.items-box-name').innerText : "取得できませんでした。";
        const itemPrice = firstItem.querySelector('.items-box-price') ? firstItem.querySelector('.items-box-price').innerText : "取得できませんでした。";
        const itemUrl = firstItem.querySelector('a') ? firstItem.querySelector('a').href : "取得できませんでした。";
        
        return {
          name: itemName,
          price: itemPrice,
          url: itemUrl
        };
      } else {
        return {
          name: "取得できませんでした。",
          price: "取得できませんでした。",
          url: "取得できませんでした。"
        };
      }
    });

    res.json(result);
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
