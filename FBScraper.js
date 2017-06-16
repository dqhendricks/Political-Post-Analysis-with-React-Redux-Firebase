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
		// facebook
		this.request = require( 'request' );
		this.facebookToken = null;
	}
	
	start() {
		this.getToken( this.test );
	}
	
	test( err, httpResponse, body ) {
		
	}
	
	facebookRequest( path, callback, method = 'GET' ) {
		const options = {
			url: `https://graph.facebook.com/${ path }` + ( ( this.facebookToken ) ? `?access_token=${ this.facebookToken }` : '' ),
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
	
	getToken( callback ) {
		this.facebookRequest( `oauth/access_token?client_id=${ process.env.FACEBOOK_APP_ID }&client_secret=${ process.env.FACEBOOK_APP_SECRET }&grant_type=client_credentials`, ( body ) => {
			console.log( body );
			console.log( body.accessToken );
			this.facebookToken = body.accessToken;
			callback();
		} );
	}
}

module.exports = new FBScraper();