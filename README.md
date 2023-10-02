# Premier League News API

This Node.js application serves as a simple API for fetching Premier League football news for various clubs from popular websites.

## Features

- Fetches news articles for different Premier League clubs from multiple sources.
- Provides a RESTful API to retrieve news articles based on club names.
- Handles errors gracefully and returns empty arrays in case of issues with web scraping or data retrieval.

## Setup

To run this project locally, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/davidkrupa/premier-league-news-api.git
   ```
   ```bash
   cd premier-league-news-api
   ```

2. Install dependencies:
   
   ```bash
   npm install
   ```

3. Start the server:
   
   ```bash
   npm start
   ```
   
## Usage

1. Fetch News by Club Name: <br />
Access the club-specific news by providing the club name as a parameter (e.g., "liverpool"):

   ```bash
   http://localhost:8000/manchester%20united
   ```

2. Response Format: <br />
The API responds with a JSON array containing news articles for the specified club. Each article includes the following information:

- title: The title of the news article.
- url: The URL to the full article.
- source: The source of the news article.

## Disclaimer
This project is for educational and non-commercial purposes only. It scrapes content from external websites, so use it responsibly and be aware of the terms and conditions of those websites.
