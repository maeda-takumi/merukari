const puppeteer = require('puppeteer-core');  // puppeteer-coreを使用

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/tmp/chrome-linux64/chrome',  // /tmpディレクトリ内のChromeを使用
    args: ['--no-sandbox', '--disable-dev-shm-usage']  // 必要な引数
  });

  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  console.log(await page.title());  // Googleのタイトルを出力
  await browser.close();
})();
