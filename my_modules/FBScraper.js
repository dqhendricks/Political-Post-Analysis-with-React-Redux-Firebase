const _ = require( 'lodash' );
const facebookAPI = require( './FacebookAPI' );
const firebaseDataStore = require( './FirebaseDataStore' );
const facebookDataProcessor = require( './FBDataProcessor' );

class FBScraper {
	
	constructor() {
		
	}
	
	start() {
		
		// do first iteration at set time, then every 24 hours after that
		setTimeout( () => {
			this.iteration();
			setInterval( () => {
				this.iteration();
			}, 1000 * 60 * 60 * 24 );
		}, this.millisecondsTillStartTime() );
	}
	
	millisecondsTillStartTime() {
		const startTime = new Date();
		startTime.setHours( 4 ); // 5 = 10pm
		startTime.setMinutes( 0 );
		startTime.setSeconds( 0 );
		startTime.setMilliseconds( 0 );
		return ( startTime.getTime() - new Date().getTime() );
	}
	
	iteration() {
		// this.data is used to tally meta data, as well as a deletion list for next update so we don't have to download the whole database each time
		this.scrapeCount = 0;
		this.updatePostDateRange();
		facebookDataProcessor.resetData( this.earliestPostDate, this.latestPostDate );
		firebaseDataStore.fetchOnce( 'pages', ( pages ) => {
			facebookAPI.getToken( () => {
				this.cyclePages( pages );
			} );
		} );
	}
	
	updatePostDateRange() {
		// examine posts posted between 1 and 2 days ago, starting at UTC midnight
		var date = new Date();
		date.setTime( Date.parse( date.toISOString().replace( /T.+/, 'T00:00:00.000Z' ) ) ); // get current day, midnight UTC
		date.setTime( date.getTime() - ( 1 * 24 * 60 * 60 * 1000 ) ); // get yesterday, midnight UTC
		this.latestPostDate = date.toISOString().replace( /\..+/, '.0000' );
		date.setTime( date.getTime() - ( 1 * 24 * 60 * 60 * 1000 ) ); // get two days ago, midnight UTC
		this.earliestPostDate = date.toISOString().replace( /\..+/, '.0000' );
	}
	
	cyclePages( pages ) {
		// going through database pages to update page data and add latest posts
		_.forIn( pages, ( page, id ) => {
			facebookDataProcessor.addPage( page );
			
			this.updatePageData( id );
			this.addNewPosts( id );
		} );
		// once finished updating page data, cycle through newly added posts to update data in those
		facebookAPI.callOnEmptyQueue( () => {
			this.updateAddedPosts();
		} );
	}
	
	updatePageData( id ) {
		this.scrapeCount++;
		const fields = [ 'about', 'category', 'fan_count', 'id', 'link', 'name', 'picture', 'website' ];
		facebookAPI.request( `/${ id }`, ( page ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in page ) updateData[`pages/${ page.id }/${ field }`] = page[field];
			} );
			
			firebaseDataStore.update( updateData );
			this.scrapeCount--;
		}, fields );
	}
	
	addNewPosts( pageID, after = null ) {
		this.scrapeCount++;
		const fields = [ 'created_time', 'from', 'id', 'link', 'message', 'message_tags', 'name', 'picture', 'permalink_url', 'shares' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		var earliestPostReached = false;
		facebookAPI.request( `${ pageID }/posts`, ( response ) => {
			response.data.forEach( ( post ) => {
				facebookDataProcessor.addPost( post );
				
				if ( post.created_time >= this.earliestPostDate && post.created_time <= this.latestPostDate ) {
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( field in post ) updateData[`posts/${ post.id }/${ field }`] = post[field];
					} );
					if ( 'from' in post ) updateData[`posts/${ post.id }/page_id`] = post.from.id;

					firebaseDataStore.update( updateData );
				} else if ( post.created_time < this.earliestPostDate ) {
					earliestPostReached = true;
				}
			} );
			if ( !earliestPostReached && ( 'paging' in response ) && ( 'next' in response.paging ) ) this.addNewPosts( pageID, response.paging.cursors.after );
			this.scrapeCount--;
		}, fields, parameters );
	}
	
	updateAddedPosts() {
		// cycle through newly added posts to update reactions and comments in those
		_.forIn( facebookDataProcessor.getPosts(), ( post, id ) => {
			this.updateReactions( id );
		} );
		// separated into two cycles because reactions can populate user records without second api call
		_.forIn( facebookDataProcessor.getPosts(), ( post, id ) => {
			this.updatePostComments( id, id );
		} );
		// once finished updating post data, start doing any after scrape processing of the data
		callOnScrapeFinished( () => {
			facebookDataProcessor.afterScrapeProcessing();
		} );
	}
	
	callOnScrapeFinished( callback ) {
		var timer = setInterval( () => {
			if ( this.isScrapeFinished() ) {
				clearInterval( timer );
				callback();
			}
		}, 1000 );
	}
	
	isScrapeFinished() {
		return ( this.scrapeCount == 0 );
	}
	
	updateReactions( key, after = null ) {
		this.scrapeCount++;
		const reactionFields = [ 'id', 'link', 'name', 'picture', 'type' ];
		const userFields = [ 'id', 'link', 'name', 'picture' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		facebookAPI.request( `${ key }/reactions`, ( response ) => {
			const pageID = key.substr( 0, key.indexOf( '_' ) );
			response.data.forEach( ( reaction ) => {
				const reactionID = `${ key }_${ reaction.id }`;
				facebookDataProcessor.addUser( reaction.id );
				facebookDataProcessor.addReaction( reaction, reactionID, key, pageID );
				
				// save/update user
				const updateUserData = {};
				userFields.forEach( ( field ) => {
					if ( field in reaction ) updateUserData[`users/${ reaction.id }/${ field }`] = reaction[field];
				} );
				
				firebaseDataStore.update( updateUserData );
				
				// save/update reaction
				const updateReactionData = {};
				reactionFields.forEach( ( field ) => {
					if ( field in reaction ) updateReactionData[`post_reactions/${ reactionID }/${ field }`] = reaction[field];
				} );
				if ( 'id' in reaction ) updateReactionData[`post_reactions/${ reactionID }/user_id`] = reaction.id;
				updateReactionData[`post_reactions/${ reactionID }/post_id`] = key;
				updateReactionData[`post_reactions/${ reactionID }/page_id`] = pageID;
				
				firebaseDataStore.update( updateReactionData );
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updateReactions( key, response.paging.cursors.after );
			this.scrapeCount--;
		}, reactionFields, parameters );
	}
	
	updatePostComments( key, postID, after = null ) {
		this.scrapeCount++;
		const fields = [ 'comment_count', 'created_time', 'from', 'id', 'message', 'parent', 'permalink_url', 'like_count' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		facebookAPI.request( `${ key }/comments`, ( response ) => {
			const pageID = postID.substr( 0, postID.indexOf( '_' ) );
			response.data.forEach( ( comment ) => {
				if ( facebookDataProcessor.validCommentCreationTime( comment, postID ) ) {
					facebookDataProcessor.addUser( comment.from.id );
					facebookDataProcessor.addComment( comment, postID, pageID );
					
					// save/update comment
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( field in comment ) updateData[`comments/${ comment.id }/${ field }`] = comment[field];
					} );
					if ( 'from' in comment ) updateData[`comments/${ comment.id }/user_id`] = comment.from.id;
					updateData[`comments/${ comment.id }/post_id`] = postID;
					updateData[`comments/${ comment.id }/page_id`] = pageID;
					
					firebaseDataStore.update( updateData );
					
					// save/update comment comments
					if ( comment.comment_count > 0 ) this.updatePostComments( comment.id, postID );
					
					// save/update user
					if ( !( comment.from.id in this.addedUsers ) ) {
						this.addedUsers[comment.from.id] = true;
						this.updateUser( comment.from.id );
					}
				}
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updatePostComments( key, postID, response.paging.cursors.after );
			this.scrapeCount--;
		}, fields, parameters );
	}
	
	updateUser( key ) {
		this.scrapeCount++;
		const fields = [ 'id', 'link', 'name', 'picture' ];
		facebookAPI.request( `${ key }`, ( user ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in user ) updateData[`users/${ user.id }/${ field }`] = user[field];
			} );
			firebaseDataStore.update( updateData );
			this.scrapeCount--;
		}, fields );
	}
}

module.exports = new FBScraper();