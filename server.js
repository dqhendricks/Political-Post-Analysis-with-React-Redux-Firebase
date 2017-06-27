// server
const express = require( 'express' );
const path = require( 'path' );
const port = process.env.PORT || 8080;
const app = express();

app.use( express.static( path.join( __dirname, 'public' ) ) );
app.get( '*', ( req, res ) => {
	res.sendFile( path.resolve( path.join( __dirname, 'public' ), 'index.html' ) );
} );
app.listen( port );

// worker
const facebookScraper = require( './my_modules/FacebookScraper' );
// process runs every 24 hours, scraping FB and updating the database
facebookScraper.start();