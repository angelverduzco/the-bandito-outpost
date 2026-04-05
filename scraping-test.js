import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });

const page = await browser.newPage();

await page.goto("https://www.twentyonepilots.com/tour");

const dates = await page.$$eval(".bit-event", (results) =>
  results.map((el) => {
    const date = el.querySelector(".bit-mobile-date")?.innerText;

    const location = el.querySelector(".bit-location-under-desktop")?.innerText;

    const venue = el.querySelector(".bit-venue")?.innerText;

    const tickets = el.href;

    return { date, location, venue, tickets };
  }),
);

console.log(dates);
await browser.close();
