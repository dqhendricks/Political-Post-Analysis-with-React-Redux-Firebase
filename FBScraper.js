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
		this.postsRef = this.firebaseDatabase.ref( 'posts' );
		this.postsRef.on ( 'value', ( snapshot ) => {
			this.posts = snapshot.val();
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
		
		this.facebookRequest( url, ( response ) => {
			this.facebookToken = response.access_token;
			this.cyclePages();
		} );
	}
	
	cyclePages() {
		_.forIn( this.pages, ( value, key, object ) => {
			this.updatePageData( key );
			this.cyclePosts( key );
		} );
	}
	
	cyclePosts( key ) {
		const fields = [ 'created_time', 'from', 'link', 'message', 'message_tags', 'name', 'picture', 'shares', 'permalink_url' ];
		this.facebookRequest( `/${ key }/posts`, ( response ) => {
			response.data.forEach( ( post ) => {
				const updateData = {};
				fields.forEach( ( field ) => {
					if ( this.propertyNeedsUpdate( this.posts, post.id, post, field ) ) updateData[`${ post.id }/${ field }`] = post[field];
				} );
				if ( !( post.id in this.posts ) || this.posts[post.id].from_id != post.from.id ) updateData[`${ post.id }/from_id`] = post.from.id;
				if ( _.size( updateData ) > 0 ) this.postsRef.update( updateData );
			}
		}, fields, { limit: 100 } );
	}
	
	updatePageData( key ) {
		const fields = [ 'about', 'category', 'fan_count', 'link', 'name', 'picture', 'talking_about_count', 'website' ];
		this.facebookRequest( `/${ key }`, ( response ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( this.propertyNeedsUpdate( this.pages, key, response, field ) ) updateData[`${ response.id }/${ field }`] = response[field];
			} );
			if ( _.size( updateData ) > 0 ) this.pagesRef.update( updateData );
		}, fields );
	}
	
	propertyNeedsUpdate( object, key, response, property ) {
		return ( !( key in object ) || object[key][property] != response[property] );
	}
	
	facebookRequest( path, callback, fields = null, options = null, method = 'GET' ) {
		const url = `https://graph.facebook.com/${ path }` + ( ( this.facebookToken ) ? `?access_token=${ this.facebookToken }` : '' ) + ( ( fields ) ? `&fields=${ fields.join() }` : '' );
		options = {
			url: url,
			method: method,
			json: true,
			...options
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