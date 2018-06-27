const puppeteer = require("puppeteer");
const express = require("express");
const asyncMiddleware = require("./utils/async-middleware");
const port = process.env.PORT || 3000;
const request = require("request");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/static"));
app.use(cors());

app.get("/", (req, res) =>
  res.render("index", { title: "Hey", message: "Hello there!" })
);

app.get("/docs/", (req, res) =>
  res.render("docs", { title: "API Documentation", message: "Hello there!" })
);

app.get(
  "/api/fetch-as-bot/",
  asyncMiddleware(async (req, res, next) => {
    const url = req.query.url;
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto(url);
    let favicon = await page.evaluate(
      () => document.querySelector('link[rel="shortcut icon"]').href
    );
    let metaDescription = await page.evaluate(() => {
      let metaTag = document.querySelector('meta[name="description"]');
      if (metaTag) return metaTag.content;
      return metaTag;
    });
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

app.get("/api/fetch-as-ajax/", (req, res) => {
  const url = req.query.url;
  request(url, function(error, response, html) {
    if (!error) {
      let $ = cheerio.load(html);
      let title = $("title").text();
      let description = $('meta[name="description"]').attr("content");
      let favicon = $('link[rel="shortcut icon"]').attr("href");
      // check whether url is having protocol in front of it or not
      let protocol = "https://";
      if (favicon.substr(0, protocol.length) !== protocol) {
        favicon = protocol + favicon;
      }
      let result = {
        title: title,
        description: description,
        favicon: favicon
      };
      res.send(result);
    } else {
      res.send(
        "OOPS, there's some problem, please check the URL or try again!"
      );
    }
  });
});

app.listen(port, () => console.log("Example app listening on port " + port));
