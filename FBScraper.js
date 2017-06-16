const _ = require( 'lodash' );

class FBScraper {
	
	constructor() {
		// firebase
		this.firebaseAdmin = require( 'firebase-admin' );
		this.firebaseServiceAccount = require( './political-post-analysis-firebase-adminsdk-rdi0e-6781839410.json' );
		
		this.firebaseAdmin.initializeApp( {
			credential: this.firebaseAdmin.credential.cert( this.firebaseServiceAccount ),
			databaseURL: 'https://political-post-analysis.firebaseio.com'
		} );
		
		this.firebaseDatabase = this.firebaseAdmin.database();
		
		const pagesRef = this.firebaseDatabase.ref( 'pages' );
		pagesRef.on ( 'value', ( snapshot ) => {
			this.pages = snapshot.val();
		} );
		// facebook
		this.request = require( 'request' );
		this.facebookToken = null;
	}
	
	start() {
		// timer that waits for this.pages to populate before starting
		const timer = setInterval( () => {
			if ( this.pages ) {
				this.getToken();
				clearInterval( timer );
			}
		}, 100 );
	}
	
	getToken() {
		const url = `oauth/access_token?client_id=${ process.env.FACEBOOK_APP_ID }&client_secret=${ process.env.FACEBOOK_APP_SECRET }&grant_type=client_credentials`;
		
		this.facebookRequest( url, ( body ) => {
			this.facebookToken = body.access_token;
			this.cyclePages();
		} );
	}
	
	cyclePages() {
		_.forIn( this.pages, ( value, key, object ) => {
			facebookRequest( `/${ key }`, ( body ) => {
				console.log( body );
			}
		} );
	}
	
	facebookRequest( path, callback, method = 'GET' ) {
		const url = `https://graph.facebook.com/${ path }` + ( ( this.facebookToken ) ? `?access_token=${ this.facebookToken }` : '' );
		const options = {
			url: url,
			method: method,
			json: true
		};
		
		this.request( options, ( err, httpResponse, body ) => {
			if ( err ) {
				console.log( `Request error: ${ err }` );
			} else if ( httpResponse.statusCode != '200' ) {
				console.log( `HTTP error: ${ httpResponse.statusCode }` );
			} else {
				callback( body );
			}
		} );
	}
}

module.exports = new FBScraper();