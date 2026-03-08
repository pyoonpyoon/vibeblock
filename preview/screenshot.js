import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import path from "path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:5177";
const OUT = path.resolve("public");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
await page.goto(BASE, { waitUntil: "networkidle2" });
await sleep(800);

// Enable light mode (app starts in dark — click to switch to light)
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find(b => b.title?.includes("light"));
  if (btn) btn.click();
});
await sleep(500);

// Click the marketplace demo card
await page.evaluate(() => {
  const cards = [...document.querySelectorAll("button")];
  const card = cards.find(b => b.innerText?.includes("Sneaker") || b.innerText?.includes("Marketplace") || b.innerText?.includes("P2P"));
  if (card) card.click();
});
// --- Screenshot 2: Generating screen (capture mid-build) ---
// Wait until "Building your product" appears
await page.waitForFunction(
  () => document.body.innerText.includes("Building your product"),
  { timeout: 10000 }
);
await sleep(1200); // let a couple steps complete so it looks mid-progress
const ss2 = await page.screenshot({ type: "png" });
writeFileSync(path.join(OUT, "ss-2-generating.png"), ss2);
console.log("✓ ss-2-generating.png");

// Wait until "PRODUCT READY" appears (up to 20s)
await page.waitForFunction(
  () => document.body.innerText.includes("PRODUCT READY"),
  { timeout: 20000 }
);
await sleep(600);

// --- Screenshot 1: Product Ready ---
const ss1 = await page.screenshot({ type: "png" });
writeFileSync(path.join(OUT, "ss-1-product-ready.png"), ss1);
console.log("✓ ss-1-product-ready.png");

// --- Screenshot 3: Launch tab ---
await page.evaluate(() => {
  const btns = [...document.querySelectorAll("button")];
  const btn = btns.find(b => b.innerText?.trim().includes("Launch"));
  if (btn) btn.click();
});
await sleep(500);
const ss3 = await page.screenshot({ type: "png" });
writeFileSync(path.join(OUT, "ss-3-launch.png"), ss3);
console.log("✓ ss-3-launch.png");

await browser.close();
console.log("Done — screenshots saved to preview/public/");
