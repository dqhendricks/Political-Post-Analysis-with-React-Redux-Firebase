class FBScraper {
	constructor() {
		this.firebaseAdmin = require( 'firebase-admin' );
		this.firebaseServiceAccount = require( './src/political-post-analysis-firebase-adminsdk-rdi0e-6781839410.js' );
		
		this.firebaseAdmin.initializeApp( {
			credential: this.firebaseAdmin.credential.cert( this.firebaseServiceAccount ),
			databaseURL: 'https://political-post-analysis.firebaseio.com'
		} );
	}
	
	start() {
		console.log( this.firebaseAdmin );
	}
}

module.exports = new FBScraper();