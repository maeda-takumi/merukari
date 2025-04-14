#!/bin/bash

# ChromeがなければDL
if [ ! -f /tmp/chrome-linux64/chrome ]; then
  echo "Chrome not found. Downloading..."
  curl -fsSL https://storage.googleapis.com/chrome-for-testing-public/134.0.6998.165/linux64/chrome-linux64.zip -o /tmp/chrome.zip
  unzip -q /tmp/chrome.zip -d /tmp/
  chmod +x /tmp/chrome-linux64/chrome
fi

# Chromedriverも必要なら同様に入れる
if [ ! -f /tmp/chromedriver-linux64/chromedriver ]; then
  echo "Chromedriver not found. Downloading..."
  curl -fsSL https://storage.googleapis.com/chrome-for-testing-public/134.0.6998.165/linux64/chromedriver-linux64.zip -o /tmp/driver.zip
  unzip -q /tmp/driver.zip -d /tmp/
  chmod +x /tmp/chromedriver-linux64/chromedriver
fi

# Puppeteerアプリ起動
node app.js
