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
		getToken( test );
	}
	
	test( err, httpResponse, body ) {
		
	}
	
	facebookRequest( path, callback, method = 'GET' ) {
		const options = {
			url: `graph.facebook.com/${ path }` + ( ( this.facebookToken ) ? `?access_token=${ this.facebookToken }` : '' ),
			method: method,
			json: true
		};
		this.request( options, callback );
	}
	
	getToken( callback ) {
		facebookRequest( `/oauth/access_token?client_id=${ process.env.FACEBOOK_APP_ID }&client_secret=${ process.env.FACEBOOK_APP_SECRET }&grant_type=client_credentials`, ( response ) => {
			debug.log( response );
			this.facebookToken = response;
			callback();
		} );
	}
}

module.exports = new FBScraper();