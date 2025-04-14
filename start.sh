#!/bin/bash

# ChromeがなければDL
if [ ! -f /tmp/chrome ]; then
  echo "Chrome not found. Downloading..."
  curl -fsSL https://storage.googleapis.com/chrome-for-testing-public/134.0.6998.165/linux64/chrome-linux64.zip -o /tmp/chrome.zip
  unzip -q /tmp/chrome.zip -d /tmp/
  mv /tmp/chrome-linux64/chrome /tmp/chrome
  chmod +x /tmp/chrome
fi

# Chromedriverも必要なら同様に入れる
if [ ! -f /tmp/chromedriver ]; then
  echo "Chromedriver not found. Downloading..."
  curl -fsSL https://storage.googleapis.com/chrome-for-testing-public/134.0.6998.165/linux64/chromedriver-linux64.zip -o /tmp/driver.zip
  unzip -q /tmp/driver.zip -d /tmp/
  mv /tmp/chromedriver-linux64/chromedriver /tmp/chromedriver
  chmod +x /tmp/chromedriver
fi

# Puppeteerアプリ起動
node app.js
