class FBScraper {
	constructor() {
		this.admin = require( 'firebase-admin' );
		this.serviceAccount = require( './political-post-analysis-firebase-adminsdk-rdi0e-6781839410.json' );
		this.admin.initializeApp( {
			credential: admin.credential.cert( serviceAccount ),
			databaseURL: 'https://political-post-analysis.firebaseio.com'
		} );
	}
	
	start() {
		console.log( this.admin );
	}
}

module.exports = new FBScraper();