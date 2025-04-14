const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/tmp/chrome-linux64/chrome',  // フルパスで指定
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  console.log(await page.title());

  await browser.close();
})();
