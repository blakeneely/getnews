// Set up dependencies for scraping
const cheerio = require("cheerio");
const axios = require("axios");

const scrape = function(callback){
    // Make Axios get request to Engadget for scraping
    axios.get("https://www.cnet.com/news/").then(function(response){
        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        const $ = cheerio.load(response.data);
      
        // Instantiate empty array to push results into
        const articles = [];
      
        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $(".riverPost").each(function(i, element) {
            let title = $(element).children(".assetText").children("h3").children("a").text().trim();
            let link = $(element).children(".assetText").children("h3").children("a").attr("href");
            let summary = $(element).children(".assetText").children("p").text().trim();

            // Check if there is a title, link, and summary
            if(title && link && summary) {
                let articleObject = {
                    headline: title,
                    link: link,
                    summary: summary
                };
                // Push object to articles array
                articles.push(articleObject);
            }
        });
        callback(articles);
        console.log(articles);
        });
      };

module.exports = scrape;
