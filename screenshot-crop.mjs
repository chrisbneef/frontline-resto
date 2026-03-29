import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'crop';
const cropHeight = parseInt(process.argv[4] || '200');

const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}-${label}.png`))) n++;
const outputPath = path.join(screenshotDir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 }); // high DPI
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({
  path: outputPath,
  clip: { x: 0, y: 0, width: 390, height: cropHeight }
});
await browser.close();
console.log(`Cropped screenshot saved: temporary screenshots/screenshot-${n}-${label}.png`);
