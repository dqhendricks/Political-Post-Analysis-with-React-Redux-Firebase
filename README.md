Description:

Personal project analyzing facebook political post data created in 2017. Data is scraped and processed server side using node.js and facebook graph API, then processed and saved each night into a PHP database API I created on another server. The result is displayed in a single page React, Redux, Semantic UI App served using node.js and express.

This is really just a project I thought up to expand my React/Redux skills.

Notes:

I used to use a Firebase database for this app, but I hit my free download limit trying to do some of the more advance analytical processing after the scrape. This is why I created a PHP REST API on another server to take it's place. You can find this app as well in another repo.

I have stopped nightly scraping since facebook apps are limited to a certain amount of scraping per active user. This scraping could go on indefinitely with enough users. The data collected for just these four pages for a single day can reach millions of records, so your datastore would need some horsepower to complete the final analysis without erroring out as well. I had to make several changes to the analysis code that make the queries use less memory, just to process a single day's worth of data on a shared PHP server without erroring.

How it works:

The node.js server code, which serves the React/Redux project that displays the final output on heroku, starts off a timer in a separate Facebook scraping node module. This timer runs once a day at 00 hour universal time, and begins to scrape a day's worth of posts, post reactions, and post comments, associated with the 4 Facebook pages it finds in the database. The database used was originally a firebase database, but I ran out of free storage. Instead I created a REST API on a separate server that runs on Apache, PHP, and MySQL. The node.js scraper scrapes the data, and uses the REST API on a separate server to save the data. Once the scrape is finished and all data is saved, a new timerange record is also saved into the database. If the new time range is different than the old one, a cron job that runs every 5 minutes on the PHP server will see this, and begin a post processing routine on the newly collected data. This post processing will add up various sums and cache them within each database record. These are queries that would take too long to fetch them each time the React/Redux app that displays the data is opened. Once this post processing is finished, it updates the currently displayed time range to the new time range in the database, which causes the React/Redux app to include the new records in what it displays.

Find the React/Redux app here:

http://political-post-analysis.herokuapp.com/
