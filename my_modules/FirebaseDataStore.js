const _ = require( 'lodash' );
firebaseAdmin = require( 'firebase-admin' );

class FirebaseDataStore {
	
	constructor() {
		this.pages = null;
		this.posts = null;
		
		this.currentTransactionCount = 0;

		this.firebaseServiceAccount = require( './political-post-analysis-firebase-adminsdk-rdi0e-6781839410.json' );
		
		firebaseAdmin.initializeApp( {
			credential: firebaseAdmin.credential.cert( this.firebaseServiceAccount ),
			databaseURL: 'https://political-post-analysis.firebaseio.com'
		} );
		
		this.firebaseDatabase = firebaseAdmin.database();
		this.firebaseDatabaseRef = this.firebaseDatabase.ref();
	}
	
	update( data, callback ) {
		this.currentTransactionCount++;
		this.firebaseDatabaseRef.update( data, () => {
			this.currentTransactionCount--;
			if ( callback ) callback();
		} );
	}
	
	isBusy() {
		return ( this.currentTransactionCount != 0 );
	}
	
	callOnNotBusy( callback ) {
		var timer = setInterval( () => {
			if ( !this.isBusy() ) {
				clearInterval( timer );
				callback();
			}
		}, 1000 );
	}
	
	fetchOnce( path, callback, orderField = null, equalTo = null ) {
		this.currentTransactionCount++;
		var dbRef = this.firebaseDatabase.ref( path );
		if ( orderField ) {
			dbRef = dbRef.orderByChild( orderField );
		} else {
			dbRef = dbRef.orderByKey();
		}
		if ( equalTo ) dbRef = dbRef.equalTo( equalTo );
		dbRef.once( 'value', ( snapshot ) => {
			this.currentTransactionCount--;
			callback( snapshot.val(), snapshot.numChildren() );
		} );
	}
	
	valueExists( path, field, equalTo, callback ) {
		this.firebaseDatabase.ref( path ).orderByChild( field ).equalTo( equalTo ).limitToFirst( 1 ).once( 'value', ( snapshot ) => {
			callback( snapshot.val() != null );
		} );
	}
	
	fetchChunk( path, callback, startIndex = 0, numberOfRecords = 250, orderBy = null ) {
		var dbRef = this.firebaseDatabase.ref( path );
		if ( !orderBy ) {
			dbRef = dbRef.orderByKey();
		} else {
			dbRef = dbRef.orderByChild( orderBy );
		}
		this.currentTransactionCount++;
		dbRef.limitToFirst( startIndex + numberOfRecords ).limitToLast( numberOfRecords ).once( 'value', ( snapshot ) => {
			this.currentTransactionCount--;
			callback( snapshot.val(), snapshot.numChildren() );
		} );
	}
}

module.exports = new FirebaseDataStore();