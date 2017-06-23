Personal project analyzing facebook political post data. Data is scraped and processed server side using node.js and facebook graph API, then processed and saved into a homemade PHP database API I created on another server each night. The result is displayed in a single page React, Redux, Semantic UI App.

I used to use a Firebase database for this app, but I hit my free download limit trying to do some of the more advance analytical processing after the scrape. This is why I created a PHP REST API on another server to take it's place. You can find this app as well in another repo.