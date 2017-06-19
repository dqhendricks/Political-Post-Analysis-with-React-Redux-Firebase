const firebaseAdmin = require( 'firebase-admin' );
const firebaseServiceAccount = require( './political-post-analysis-firebase-adminsdk-rdi0e-6781839410.json' );

firebaseAdmin.initializeApp( {
	credential: firebaseAdmin.credential.cert( firebaseServiceAccount ),
	databaseURL: 'https://political-post-analysis.firebaseio.com'
} );

const firebaseDatabase = firebaseAdmin.database();
const databaseRef = firebaseDatabase.ref();

var date = new Date();
date.setDate( date.getDate() ); // update last X days of posts only
date = date.toISOString().replace( /\..+/, '+0000' );

databaseRef.set( {
	pages: {
		"62317591679": {
			id: "62317591679"
		},
		"219367258105115": {
			id: "219367258105115"
		},
		"144868455552699": {
			id: "144868455552699"
		},
		"95475020353": {
			id: "95475020353"
		},
		"1604383669807606": {
			id: "1604383669807606"
		}
	}
} );
