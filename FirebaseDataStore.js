const _ = require( 'lodash' );

class FirebaseDataStore {
	
	constructor() {
		this.numberOfUpdateDays = 2;
		this.firebaseAdmin = require( 'firebase-admin' );
		this.firebaseServiceAccount = require( './political-post-analysis-firebase-adminsdk-rdi0e-6781839410.json' );
		
		this.firebaseAdmin.initializeApp( {
			credential: this.firebaseAdmin.credential.cert( this.firebaseServiceAccount ),
			databaseURL: 'https://political-post-analysis.firebaseio.com'
		} );
		
		this.firebaseDatabase = this.firebaseAdmin.database();
		this.firebaseDatabaseRef = this.firebaseDatabase.ref();
		
		const pagesRef = this.firebaseDatabase.ref( 'pages' );
		pagesRef.on ( 'value', ( snapshot ) => {
			this.pages = snapshot.val();
		} );
	}
	
	update( data ) {
		this.firebaseDatabaseRef.update( data );
	}
	
	updateEarliestPostDate() {
		const date = new Date();
		date.setDate( date.getDate() - this.numberOfUpdateDays ); // update last X days of posts only
		this.earliestPostDate = date.toISOString().replace( /\..+/, '+0000' );
	}
	
	getPosts() {
		this.posts = null;
		this.firebaseDatabase.ref( 'posts' ).orderByChild( 'created_time' ).startAt( this.earliestPostDate ).once( 'value', ( snapshot ) => {
			this.posts = snapshot.val();
			if ( !this.posts ) this.posts = {};
		} );
	}
}

module.exports = new FirebaseDataStore();