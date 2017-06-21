const fbScraper = require( './my_modules/FBScraper' );

// process runs every 24 hours, scraping FB and updating the database
fbScraper.start();