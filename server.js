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
const fbScraper = require( './my_modules/FBScraper' );
// process runs every 24 hours, scraping FB and updating the database
fbScraper.start();