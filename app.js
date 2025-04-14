const express = require('express');
const puppeteer = require('puppeteer-core');  // puppeteer-coreを使用

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const searchQuery = req.query.query || "ジョイパレット(JOYPALETTE) アンパンマン キラ★ピカ★いっしょにステージ ミュージックショー";  // クエリパラメータを使用

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/tmp/chrome-linux64/chrome',  // /tmpディレクトリ内のChromeを使用
    args: ['--no-sandbox', '--disable-dev-shm-usage']  // 必要な引数
  });

  const page = await browser.newPage();
  await page.goto('https://jp.mercari.com/');

  // 検索ボックスが表示されるまで待機
  await page.waitForSelector('.sc-55dc813e-2', {timeout: 10000});  // 検索ボックスのクラス名で待機

  // 検索ワードを入力
  await page.type('.sc-55dc813e-2', searchQuery);  // 検索ボックスに入力
  await page.keyboard.press('Enter');  // Enterキーを押す

  // 検索結果が表示されるまで待機
  await page.waitForSelector('.items-box', {timeout: 10000});  // 検索結果の要素が表示されるまで待機

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

  res.json(result);  // JSON形式で結果を返す

  await browser.close();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
