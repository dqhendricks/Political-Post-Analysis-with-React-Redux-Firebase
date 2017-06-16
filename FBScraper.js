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
		
		this.pagesRef = this.firebaseDatabase.ref( 'pages' );
		this.pagesRef.on ( 'value', ( snapshot ) => {
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
			this.facebookRequest( `/${ key }`, ( body ) => {
				console.log( body );
				
				const updateData = {};
				updateData[`${ body.id }/about`] = body.about;
				
				this.pagesRef.update( updateData );
				
				
			}, [ 'about', 'category', 'fan_count', 'link', 'name', 'picture', 'talking_about_count', 'website' ] );
		} );
	}
	
	facebookRequest( path, callback, fields = null, method = 'GET' ) {
		const url = `https://graph.facebook.com/${ path }` + ( ( this.facebookToken ) ? `?access_token=${ this.facebookToken }` : '' ) + ( ( fields ) ? `&fields=${ fields.join() }` : '' );
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