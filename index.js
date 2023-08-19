const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

let clubNews = [];
const pages = [
  {
    name: "bbc",
    address: "https://www.bbc.com/sport/football/premier-league",
  },
  {
    name: "skysports",
    address: "https://www.skysports.com/premier-league-news",
  },
  {
    name: "dailymail",
    address: "https://www.dailymail.co.uk/sport/premierleague/index.html",
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/football/premierleague",
  },
  {
    name: "espn",
    address: "https://www.espn.com/soccer/league/_/name/eng.1",
  },
];

app.get("/", (req, res) => {
  res.json("Welcome to my Premier League News API");
});

app.get("/:clubId", (req, res) => {
  const clubId = req.params.clubId;

  const formattedClubId = clubId
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  pages.forEach((page) => {
    axios
      .get(page.address)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        const clubQuery = `a:contains(${formattedClubId})`;

        $(clubQuery, html).each(function () {
          const title = $(this)
            .text()
            .replace(/[\r\n]+/gm, "") // remove line breaks
            .trim()
            .split(" ")
            .map((word) => word.trim())
            .join(" ");
          const url = $(this).attr("href");

          if (title === formattedClubId) return; // return when te link direct to general club info

          clubNews.push({
            title,
            url,
            source: page.name,
          });
        });
      })
      .catch((err) => console.log(err));
  });
  res.json(clubNews);
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
