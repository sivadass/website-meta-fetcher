const puppeteer = require("puppeteer");
const express = require("express");

/* (async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://sivadass.in");
  let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  let favicon = await page.evaluate(
    () => document.querySelector('link[rel="shortcut icon"]').href
  );
  const pageTitle = await page.title();
  console.log(pageTitle);
  console.log(favicon);
  //await page.screenshot({ path: "example.png" });

  await browser.close();
})();
 */

const app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) =>
  //res.send("Welcome to Website Meta Fetcher powered by Google's Puppeteer")
  res.render("index", { title: "Hey", message: "Hello there!" })
);
app.get("/api/fetch/", (req, res) =>
  res.send("Fetch details about " + req.params.url)
);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
