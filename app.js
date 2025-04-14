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
    
    // 画面遷移後のURLを取得
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });

    const currentUrl = page.url();  // 現在のURLを取得

    // 結果としてURLを返す
    res.json({
      message: '検索結果ページ',
      url: currentUrl
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
