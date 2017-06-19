const _ = require( 'lodash' );
const firebaseAdmin = require( 'firebase-admin' );
const firebaseServiceAccount = require( './political-post-analysis-firebase-adminsdk-rdi0e-6781839410.json' );

firebaseAdmin.initializeApp( {
	credential: firebaseAdmin.credential.cert( firebaseServiceAccount ),
	databaseURL: 'https://political-post-analysis.firebaseio.com'
} );

const firebaseDatabase = firebaseAdmin.database();
const databaseRef = firebaseDatabase.ref();

var date = new Date();
date.setDate( date.getDate() - 2 ); // update last X days of posts only
date = date.toISOString().replace( /\..+/, '+0000' );

const postsRef = databaseRef.child( 'posts' ).orderByChild( 'created_time' ).startAt( date );

postsRef.limitToFirst( 1 ).once( 'value', ( data ) => {
	console.log( 'first' );
	console.log( data.val() );
} );

postsRef.limitToLast( 1 ).once( 'value', ( data ) => {
	console.log( 'last' );
	console.log( data.val() );
} );