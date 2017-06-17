const _ = require( 'lodash' );

class FBScraper {
	
	constructor() {
		this.numberOfUpdateDays = 7;
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
		this.usersRef = this.firebaseDatabase.ref( 'users' );
		this.postReactionsRef = this.firebaseDatabase.ref( 'post_reactions' );
		this.commentsRef = this.firebaseDatabase.ref( 'comments' );
		this.commentReactionsRef = this.firebaseDatabase.ref( 'comment_reactions' );
		// facebook
		this.request = require( 'request' );
		this.facebookToken = null;
	}
	
	start() {
		// timer that waits for this.pages to populate before starting
		this.listenToFirebasePosts();
		const timer = setInterval( () => {
			if ( this.pages && this.posts ) {
				this.getToken();
				clearInterval( timer );
			}
		}, 100 );
	}
	
	listenToFirebasePosts() {
		this.postsRef.off();
		this.posts = null;
		var date = new Date();
		date.setDate( date.getDate() - this.numberOfUpdateDays ); // update last 7 days of posts only
		date = date.toISOString().replace( /\..+/, '+0000' );
		this.postsRef.orderByChild( 'created_time' ).startAt( date ).on( 'value', ( snapshot ) => {
			this.posts = snapshot.val();
		} );
	}
	
	getToken() {
		const url = `oauth/access_token`;
		const parameters = {
			client_id: process.env.FACEBOOK_APP_ID,
			client_secret: process.env.FACEBOOK_APP_SECRET,
			grant_type: 'client_credentials'
		};
		
		this.facebookRequest( url, ( response ) => {
			this.facebookToken = response.access_token;
			this.cyclePages();
		}, null, parameters );
	}
	
	cyclePages() {
		_.forIn( this.pages, ( value, key, object ) => {
			this.updatePageData( key );
			this.addNewPosts( key );
		} );
		setTimeout( this.updateRecentPosts, 1000 * 5 );
	}
	
	updatePageData( key ) {
		const fields = [ 'about', 'category', 'fan_count', 'id', 'link', 'name', 'picture', 'website' ];
		this.facebookRequest( `/${ key }`, ( response ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( this.propertyNeedsUpdate( this.pages, key, response, field ) ) updateData[`${ response.id }/${ field }`] = response[field];
			} );
			if ( _.size( updateData ) > 0 ) this.pagesRef.update( updateData );
		}, fields );
	}
	
	addNewPosts( key ) {
		var date = new Date();
		date.setDate( date.getDate() - this.numberOfUpdateDays ); // update last 7 days of posts only
		date = date.toISOString().replace( /\..+/, '+0000' );
		const fields = [ 'created_time', 'from', 'id', 'link', 'message', 'message_tags', 'name', 'picture', 'permalink_url' ];
		this.facebookRequest( `/${ key }/posts`, ( response ) => {
			response.data.forEach( ( post ) => {
				if ( post.created_time >= date ) {
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( this.propertyNeedsUpdate( this.posts, post.id, post, field ) ) updateData[`${ post.id }/${ field }`] = post[field];
					} );
					if ( !( post.id in this.posts ) || this.posts[post.id].from_id != post.from.id ) updateData[`${ post.id }/from_id`] = post.from.id;
					if ( _.size( updateData ) > 0 ) this.postsRef.update( updateData );
				}
			} );
		}, fields, { limit: 100 } );
	}
	
	updateRecentPosts() {
		_.forIn( this.posts, ( value, key, object ) => {
			this.updateReactions( this.postReactionsRef, key );
			this.updatePostComments( key );
		} );
	}
	
	updateReactions( databaseReference, key, after = null ) {
		const reactionFields = [ 'id', 'link', 'name', 'picture', 'type' ];
		const userFields = [ 'id', 'link', 'name', 'picture' ];
		const parameters = {
			limit: 100
		};
		if ( after ) parameters.after = after;
		this.facebookRequest( `/${ key }/reactions`, ( response ) => {
			response.data.forEach( ( reaction ) => {
				
				// save/update reaction
				const reactionKey = `${ key }_${ reaction.id }`;
				const updateReactionData = {};
				reactionFields.forEach( ( field ) => {
					if ( field in reaction ) updateReactionData[`${ reactionKey }/${ field }`] = reaction[field];
				} );
				updateReactionData[`${ reactionKey }/user_id`] = reaction.id;
				updateReactionData[`${ reactionKey }/post_id`] = key;
				updateReactionData[`${ reactionKey }/page_id`] = this.posts[key].from.id;
				
				databaseReference.update( updateReactionData );
				
				// save/update user
				const updateUserData = {};
				userFields.forEach( ( field ) => {
					if ( field in reaction ) updateUserData[`${ reaction.id }/${ field }`] = reaction[field];
				} );
				
				this.usersRef.update( updateUserData );
			} );
			if ( 'next' in response.paging ) this.updatePostReactions( key, response.paging.cursors.after );
		}, fields, parameters );
	}
	
	updatePostComments( key, after = null ) {
		const fields = [ 'comment_count', 'created_time', 'from', 'id', 'message', 'parent', 'permalink_url', 'like_count' ];
		const parameters = {
			limit: 100
		};
		if ( after ) parameters.after = after;
		this.facebookRequest( `/${ key }/comments`, ( response ) => {
			response.data.forEach( ( comment ) => {
				
				// save/update comment
				const updateData = {};
				fields.forEach( ( field ) => {
					if ( field in comment ) updateData[`${ comment.id }/${ field }`] = comment[field];
				} );
				updateData[`${ comment.id }/user_id`] = comment.from.id;
				updateData[`${ comment.id }/post_id`] = key;
				updateData[`${ comment.id }/page_id`] = this.posts[key].from.id;
				
				this.postCommentsRef.update( updateData );
				
				// save/update comment comments
				if ( comment.comment_count > 0 ) this.updatePostComments( comment.id );
				
				// save/update comment reactions
				this.updateReactions( this.commentReactionsRef, key );
				
				// save/update user
				this.updateUser( comment.from.id );
			} );
			if ( 'next' in response.paging ) this.updatePostReactions( key, response.paging.cursors.after );
		}, fields, parameters );
	}
	
	updateUser( key ) {
		const fields = [ 'id', 'link', 'name', 'picture' ];
		this.facebookRequest( `/${ key }`, ( response ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in response ) updateData[`${ response.id }/${ field }`] = response[field];
			} );
			this.usersRef.update( updateData );
		}, fields );
	}
	
	propertyNeedsUpdate( object, key, response, property ) {
		return ( ( property in response ) && ( !( key in object ) || object[key][property] != response[property] ) );
	}
	
	facebookRequest( path, callback, fields = null, parameters = {}, method = 'GET' ) {
		if ( this.facebookToken ) parameters.access_token = this.facebookToken;
		if ( fields ) parameters.fields = fields.join();
		parameters = _.values( _.map( parameters, ( value, key ) => {
			return `${ key }=${ value}`;
		} ) ).join( '&' );
		if ( parameters.length > 0 ) parameters = `?${ parameters }`;
		const url = `https://graph.facebook.com/${ path }${ parameters }`;
		const options = {
			url: url,
			method: method,
			json: true,
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