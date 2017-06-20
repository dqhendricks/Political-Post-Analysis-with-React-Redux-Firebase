const _ = require( 'lodash' );
const facebookAPI = require( './FacebookAPI' );
const firebaseDataStore = require( './FirebaseDataStore' );

class FBScraper {
	
	constructor() {
		this.addedUsers = {};
		this.addedPosts = {};
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
		startTime.setHours( 3 ); // 5 = 10pm
		startTime.setMinutes( 0 );
		startTime.setSeconds( 0 );
		startTime.setMilliseconds( 0 );
		return ( startTime.getTime() - new Date().getTime() );
	}
	
	iteration() {
		this.updatePostDateRange();
		firebaseDataStore.fetchPages( ( pages ) => {
			facebookAPI.getToken( this.cyclePages.bind( this ) );
		} );
	}
	
	updatePostDateRange() {
		var date = new Date();
		date.setDate( date.getDate() - 2 );
		this.earliestPostDate = date.toISOString().replace( /\..+/, '+0000' );
		date = new Date();
		date.setDate( date.getDate() - 1 );
		this.latestPostDate = date.toISOString().replace( /\..+/, '+0000' );
	}
	
	cyclePages() {
		_.forIn( firebaseDataStore.getPages(), ( value, key, object ) => {
			this.updatePageData( key );
			this.addNewPosts( key );
		} );
		facebookAPI.callOnEmptyQueue( () => {
			this.updateRecentPosts();
		} );
	}
	
	updatePageData( key ) {
		const fields = [ 'about', 'category', 'fan_count', 'id', 'link', 'name', 'picture', 'website' ];
		facebookAPI.request( `/${ key }`, ( page ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in page ) updateData[`pages/${ response.id }/${ field }`] = page[field];
			} );
			firebaseDataStore.update( updateData );
		}, fields );
	}
	
	addNewPosts( key ) {
		const fields = [ 'created_time', 'from', 'id', 'link', 'message', 'message_tags', 'name', 'picture', 'permalink_url', 'shares' ];
		const parameters = { limit: 100 };
		var earliestPostReached = false;
		facebookAPI.request( `${ key }/posts`, ( response ) => {
			response.data.forEach( ( post ) => {
				if ( post.created_time >= this.earliestPostDate && post.created_time <= this.latestPostDate ) {
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( field in post ) updateData[`posts/${ post.id }/${ field }`] = post[field];
					} );
					if ( from in post ) updateData[`posts/${ post.id }/page_id`] = post.from.id;
					this.addedPosts[post.id] = post;
					firebaseDataStore.update( updateData );
				}
			} );
		}, fields, parameters );
	}
	
	updateRecentPosts() {
		_.forIn( this.addedPosts, ( value, key, object ) => {
			this.updateReactions( key );
			this.updatePostComments( key );
		} );
		facebookAPI.callOnEmptyQueue( () => {
			this.postScrapeProcessing();
		} );
	}
	
	updateReactions( key, after = null ) {
		const reactionFields = [ 'id', 'link', 'name', 'picture', 'type' ];
		const userFields = [ 'id', 'link', 'name', 'picture' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		facebookAPI.request( `${ key }/reactions`, ( response ) => {
			response.data.forEach( ( reaction ) => {
				
				// save/update reaction
				const reactionKey = `${ key }_${ reaction.id }`;
				const updateReactionData = {};
				reactionFields.forEach( ( field ) => {
					if ( field in reaction ) updateReactionData[`post_reactions/${ reactionKey }/${ field }`] = reaction[field];
				} );
				if ( id in reaction ) updateReactionData[`post_reactions/${ reactionKey }/user_id`] = reaction.id;
				updateReactionData[`post_reactions/${ reactionKey }/post_id`] = key;
				updateReactionData[`post_reactions/${ reactionKey }/page_id`] = key.substr( 0, key.indexOf( '_' ) );
				
				firebaseDataStore.update( updateReactionData );
				
				// save/update user
				const updateUserData = {};
				userFields.forEach( ( field ) => {
					if ( field in reaction ) updateUserData[`users/${ reaction.id }/${ field }`] = reaction[field];
				} );
				
				this.addedUsers[reaction.id] = true;
				firebaseDataStore.update( updateUserData );
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updateReactions( key, response.paging.cursors.after );
		}, reactionFields, parameters );
	}
	
	updatePostComments( key, after = null ) {
		const fields = [ 'comment_count', 'created_time', 'from', 'id', 'message', 'parent', 'permalink_url', 'like_count' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		facebookAPI.request( `${ key }/comments`, ( response ) => {
			response.data.forEach( ( comment ) => {
				
				// save/update comment
				const updateData = {};
				fields.forEach( ( field ) => {
					if ( field in comment ) updateData[`comments/${ comment.id }/${ field }`] = comment[field];
				} );
				if ( from in comment ) updateData[`comments/${ comment.id }/user_id`] = comment.from.id;
				updateData[`comments/${ comment.id }/post_id`] = key;
				updateData[`comments/${ comment.id }/page_id`] = key.substr( 0, key.indexOf( '_' ) );
				
				firebaseDataStore.update( updateData );
				
				// save/update comment comments
				if ( comment.comment_count > 0 ) this.updatePostComments( comment.id );
				
				// save/update user
				if ( !( comment.from.id in this.addedUsers ) ) {
					this.addedUsers[comment.from.id] = true;
					this.updateUser( comment.from.id );
				}
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updatePostComments( key, response.paging.cursors.after );
		}, fields, parameters );
	}
	
	updateUser( key ) {
		const fields = [ 'id', 'link', 'name', 'picture' ];
		facebookAPI.request( `${ key }`, ( user ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in user ) updateData[`users/${ user.id }/${ field }`] = user[field];
			} );
			firebaseDataStore.update( updateData );
		}, fields );
	}
	
	postScrapeProcessing() {
		this.addedUsers = {};
		this.addedPosts = {};
		console.log( 'post scrape processing begin' );
	}
}

module.exports = new FBScraper();