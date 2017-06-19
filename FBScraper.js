const _ = require( 'lodash' );
const facebookAPI = require( './FacebookAPI' );
const firebaseDataStore = require( './FirebaseDataStore' );

class FBScraper {
	
	constructor() {
		
	}
	
	start() {
		setTimeout( () => {
			this.iteration();
			setInterval( () => {
				this.iteration();
			}, 1000 * 60 * 60 * 24 );
		}, this.millisecondsTillStartTime() );
	}
	
	millisecondsTillStartTime() {
		const startTime = new Date();
		startTime.setHours( 22 ); // 10pm
		startTime.setMinutes( 0 );
		startTime.setSeconds( 0 );
		startTime.setMilliseconds( 0 );
		console.log( date.toISOString() );
		return ( startTime.getTime() - new Date().getTime() );
	}
	
	iteration() {
		firebaseDataStore.updateEarliestPostDate();
		firebaseDataStore.getPosts();
		const timer = setInterval( () => {
			if ( firebaseDataStore.pages && firebaseDataStore.posts ) {
				clearInterval( timer );
				facebookAPI.getToken( this.cyclePages.bind( this ) );
			}
		}, 100 );
	}
	
	cyclePages() {
		_.forIn( firebaseDataStore.pages, ( value, key, object ) => {
			this.updatePageData( key );
			this.addNewPosts( key );
		} );
		var timer = setInterval( () => {
			if ( facebookAPI.isQueueFinished() ) {
				clearInterval( timer );
				firebaseDataStore.getPosts();
				var timer = setInterval( () => {
					if ( firebaseDataStore.posts ) {
						clearInterval( timer );
						this.updateRecentPosts();
					}
				}, 100 );
			}
		}, 100 );
	}
	
	updatePageData( key ) {
		const fields = [ 'about', 'category', 'fan_count', 'id', 'link', 'name', 'picture', 'website' ];
		facebookAPI.request( `/${ key }`, ( response ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( this.propertyNeedsUpdate( firebaseDataStore.pages, response.id, response, field ) ) updateData[`pages/${ response.id }/${ field }`] = response[field];
			} );
			if ( _.size( updateData ) > 0 ) firebaseDataStore.update( updateData );
		}, fields );
	}
	
	addNewPosts( key ) {
		const fields = [ 'created_time', 'from', 'id', 'link', 'message', 'message_tags', 'name', 'picture', 'permalink_url', 'shares' ];
		facebookAPI.request( `${ key }/posts`, ( response ) => {
			response.data.forEach( ( post ) => {
				if ( post.created_time >= firebaseDataStore.earliestPostDate ) {
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( this.propertyNeedsUpdate( firebaseDataStore.posts, post.id, post, field ) ) updateData[`posts/${ post.id }/${ field }`] = post[field];
					} );
					if ( !( post.id in firebaseDataStore.posts ) || firebaseDataStore.posts[post.id].from_id != post.from.id ) updateData[`posts/${ post.id }/from_id`] = post.from.id;
					if ( _.size( updateData ) > 0 ) firebaseDataStore.update( updateData );
				}
			} );
		}, fields, { limit: 100 } );
	}
	
	updateRecentPosts() {
		_.forIn( firebaseDataStore.posts, ( value, key, object ) => {
			this.updateReactions( key );
			this.updatePostComments( key );
		} );
		var timer = setInterval( () => {
			if ( facebookAPI.isQueueFinished() ) {
				clearInterval( timer );
				this.postScrapeProcessing();
			}
		}, 100 );
	}
	
	updateReactions( key, after = null ) {
		const reactionFields = [ 'id', 'link', 'name', 'picture', 'type' ];
		const userFields = [ 'id', 'link', 'name', 'picture' ];
		const parameters = {
			limit: 100
		};
		if ( after ) parameters.after = after;
		facebookAPI.request( `${ key }/reactions`, ( response ) => {
			response.data.forEach( ( reaction ) => {
				
				// save/update reaction
				const reactionKey = `${ key }_${ reaction.id }`;
				const updateReactionData = {};
				reactionFields.forEach( ( field ) => {
					if ( field in reaction ) updateReactionData[`post_reactions/${ reactionKey }/${ field }`] = reaction[field];
				} );
				updateReactionData[`post_reactions/${ reactionKey }/user_id`] = reaction.id;
				updateReactionData[`post_reactions/${ reactionKey }/post_id`] = key;
				updateReactionData[`post_reactions/${ reactionKey }/page_id`] = key.substr( 0, key.indexOf( '_' ) );
				
				firebaseDataStore.update( updateReactionData );
				
				// save/update user
				const updateUserData = {};
				userFields.forEach( ( field ) => {
					if ( field in reaction ) updateUserData[`users/${ reaction.id }/${ field }`] = reaction[field];
				} );
				
				firebaseDataStore.update( updateUserData );
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updateReactions( key, response.paging.cursors.after );
		}, reactionFields, parameters );
	}
	
	updatePostComments( key, after = null ) {
		const fields = [ 'comment_count', 'created_time', 'from', 'id', 'message', 'parent', 'permalink_url', 'like_count' ];
		const parameters = {
			limit: 100
		};
		if ( after ) parameters.after = after;
		facebookAPI.request( `${ key }/comments`, ( response ) => {
			response.data.forEach( ( comment ) => {
				
				// save/update comment
				const updateData = {};
				fields.forEach( ( field ) => {
					if ( field in comment ) updateData[`comments/${ comment.id }/${ field }`] = comment[field];
				} );
				updateData[`comments/${ comment.id }/user_id`] = comment.from.id;
				updateData[`comments/${ comment.id }/post_id`] = key;
				updateData[`comments/${ comment.id }/page_id`] = key.substr( 0, key.indexOf( '_' ) );
				
				firebaseDataStore.update( updateData );
				
				// save/update comment comments
				if ( comment.comment_count > 0 ) this.updatePostComments( comment.id );
				
				// save/update user
				this.updateUser( comment.from.id );
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updatePostComments( key, response.paging.cursors.after );
		}, fields, parameters );
	}
	
	updateUser( key ) {
		const fields = [ 'id', 'link', 'name', 'picture' ];
		facebookAPI.request( `${ key }`, ( response ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in response ) updateData[`users/${ response.id }/${ field }`] = response[field];
			} );
			firebaseDataStore.update( updateData );
		}, fields );
	}
	
	propertyNeedsUpdate( object, key, response, property ) {
		return ( ( property in response ) && ( !( key in object ) || !( property in object[key] ) || object[key][property] != response[property] ) );
	}
	
	postScrapeProcessing() {
		console.log( 'post scrape processing begin' );
	}
}

module.exports = new FBScraper();