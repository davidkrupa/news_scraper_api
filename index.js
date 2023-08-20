const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const pages = [
  {
    name: "bbc",
    address: "https://www.bbc.com/sport/football/premier-league",
    baseUrl: "https://www.bbc.com",
  },
  {
    name: "skysports",
    address: "https://www.skysports.com/premier-league-news",
    baseUrl: "",
  },
  {
    name: "dailymail",
    address: "https://www.dailymail.co.uk/sport/premierleague/index.html",
    baseUrl: "https://www.dailymail.co.uk",
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/football/premierleague",
    baseUrl: "",
  },
  {
    name: "espn",
    address: "https://www.espn.com/soccer/league/_/name/eng.1",
    baseUrl: "https://www.espn.com",
  },
];

app.get("/", (req, res) => {
  res.json("Welcome to my Premier League News API - endpoints: /clubName");
});

app.get("/:clubId", async (req, res) => {
  const clubId = req.params.clubId;

  const formattedClubId = clubId
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  let promises = [];

  pages.forEach((page) => {
    const promise = axios
      .get(page.address)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        const clubQuery = `a:contains(${formattedClubId})`;

        const clubNewsForPage = [];

        $(clubQuery, html).each(function () {
          const title = $(this)
            .text()
            .replace(/[\r\n]+/gm, "") // remove line breaks
            .trim();
          const url = $(this).attr("href");

          if (title === formattedClubId) return; // return when te link direct to general club info

          const updatedUrl = url.includes("https") ? url : page.baseUrl + url;

          clubNewsForPage.push({
            title,
            url: updatedUrl,
            source: page.name,
          });
        });

        return clubNewsForPage; // Return the array for this page
      })
      .catch((err) => {
        console.log(err);
        return []; // Return an empty array if there's an error
      });
    promises.push(promise); // Add the promise to the array
  });

  try {
    const results = await Promise.all(promises);
    const clubNews = results.flat(); // flatten array of arrays
    res.json(clubNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
