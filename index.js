const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const pages = [
  {
    name: "bbc",
    address: "https://www.bbc.com/sport/football",
  },
];

const articles = [];

pages.forEach((page) => {
  axios.get(page.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("Arsenal")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url,
        source: page.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my Premier League News API");
});

app.get("/football", (req, res) => {
  res.json(articles);
});

app.get("/football/:clubId", async (req, res) => {
  const clubId = req.params.clubId;

  const formattedClubId = clubId
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  axios
    .get("https://www.bbc.com/sport/football")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const clubNews = [];

      const clubQuery = `a:contains(${formattedClubId})`;

      $(clubQuery, html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        clubNews.push({
          title,
          url,
          // source: clubId
        });
      });
      res.json(clubNews);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
