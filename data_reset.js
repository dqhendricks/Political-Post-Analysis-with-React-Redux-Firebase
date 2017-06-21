const firebaseAdmin = require( 'firebase-admin' );
const firebaseServiceAccount = require( './my_modules/political-post-analysis-firebase-adminsdk-rdi0e-6781839410.json' );

firebaseAdmin.initializeApp( {
	credential: firebaseAdmin.credential.cert( firebaseServiceAccount ),
	databaseURL: 'https://political-post-analysis.firebaseio.com'
} );

const firebaseDatabase = firebaseAdmin.database();
const databaseRef = firebaseDatabase.ref();

databaseRef.set( {
	pages: {
		"5550296508": {
			id: "5550296508",
			name: "CNN"
		},
		"15704546335": {
			id: "15704546335",
			name: "Fox News"
		},
		"95475020353": {
			id: "95475020353",
			name: "Breitbart"
		},
		"5281959998": {
			id: "5281959998",
			name: "The New York Times"
		}
	}
}, () => {
	console.log( 'data has now been reset' );
	process.exit();
} );
