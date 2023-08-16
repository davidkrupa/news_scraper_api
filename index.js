const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const articles = [];

app.get("/", (req, res) => {
  res.json("Welcome to my BBC News API");
});

app.get("/football", (req, res) => {
  axios
    .get("https://www.bbc.com/sport/football")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("Arsenal")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url,
        });
      });
      res.json(articles);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
