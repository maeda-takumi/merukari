const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/tmp/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  console.log(await page.title());  // 出力: "Google"

  await browser.close();
})();
