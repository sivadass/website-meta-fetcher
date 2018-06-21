const puppeteer = require("puppeteer");
const express = require("express");
const asyncMiddleware = require("./utils/async-middleware");
const port = process.env.PORT || 3000;

const app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) =>
  //res.send("Welcome to Website Meta Fetcher powered by Google's Puppeteer")
  res.render("index", { title: "Hey", message: "Hello there!" })
);

app.get(
  "/api/fetch/",
  asyncMiddleware(async (req, res, next) => {
    /* 
    if there is an error thrown in getUserFromDb, asyncMiddleware
    will pass it to next() and express will handle the error;
  */
    const url = req.query.url;
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto(url);
    //let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    let favicon = await page.evaluate(
      () => document.querySelector('link[rel="shortcut icon"]').href
    );
    let metaDescription = await page.evaluate(
      () => document.querySelector('meta[name="description"]').content
    );
    const pageTitle = await page.title();
    let result = {
      title: pageTitle,
      metaDescription: metaDescription,
      favicon: favicon
    };
    await browser.close();
    res.json(result);
  })
);

app.listen(port, () => console.log("Example app listening on port " + port));
