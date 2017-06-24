// server
const express = require( 'express' );
const path = require( 'path' );
const port = process.env.PORT || 8080;
const app = express();

app.use( express.static( __dirname ) );
app.get( '*', ( req, res ) => {
	res.sendFile( path.resolve( __dirname, 'index.html' ) );
} );
app.listen( port );

// worker
const facebookScraper = require( './my_modules/FacebookScraper' );
// process runs every 24 hours, scraping FB and updating the database
facebookScraper.start();