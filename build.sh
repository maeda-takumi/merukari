#!/bin/bash
npm install

# /tmpディレクトリにChromeとChromedriverをダウンロード
mkdir -p /tmp

# 新しいChromeのインストール
curl -fsSL https://storage.googleapis.com/chrome-for-testing-public/134.0.6998.165/linux64/chrome-linux64.zip -o /tmp/chrome.zip
unzip /tmp/chrome.zip -d /tmp/
mv /tmp/chrome-linux64/chrome /tmp/chrome
ls -l /tmp/chrome  # Chromeが正しくインストールされたか確認

# 新しいChromedriverのインストール
curl -fsSL https://storage.googleapis.com/chrome-for-testing-public/134.0.6998.165/linux64/chromedriver-linux64.zip -o /tmp/driver.zip
unzip /tmp/driver.zip -d /tmp/
mv /tmp/chromedriver-linux64/chromedriver /tmp/chromedriver
chmod +x /tmp/chromedriver
chmod +x /tmp/chrome
ls -l /tmp/chromedriver  # Chromedriverが正しくインストールされたか確認
