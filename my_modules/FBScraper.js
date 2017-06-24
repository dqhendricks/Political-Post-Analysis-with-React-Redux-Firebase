const _ = require( 'lodash' );
const facebookAPI = require( './FacebookAPI' );
const databaseAPI = require( './DatabaseAPI' );

class FBScraper {
	
	constructor() {
		this.daysToScrape = 1;
		this.daysOfRecordsToPreserve = 7;
	}
	
	start() {
		// do first iteration at midnight UTC, then every 24 hours after that
		this.iteration();
		/*
		setTimeout( () => {
			this.iteration();
			setInterval( () => {
				this.iteration();
			}, 1000 * 60 * 60 * 24 );
		}, this.millisecondsTillStartTime() );
		*/
	}
	
	millisecondsTillStartTime() {
		var startTime = new Date();
		startTime.setTime( Date.parse( startTime.toISOString().replace( /T.+/, 'T00:00:00.000Z' ) ) ); // get current day, midnight UTC
		startTime.setTime( startTime.getTime() + ( 1 * 24 * 60 * 60 * 1000 ) ); // get tonight's, midnight UTC
		startTime = startTime.getTime() - new Date().getTime()
		console.log( startTime / ( 1000 * 60 * 60 ) );
		return startTime;
	}
	
	iteration() {
		this.posts = {};
		this.scrapeCount = 0;
		this.updatePostDateRanges();
		databaseAPI.request( 'pages', ( pages ) => {
			facebookAPI.getToken( () => {
				this.cyclePages( pages );
			} );
		} );
	}
	
	updatePostDateRanges() {
		// examine posts posted between 1 and 2 days ago, starting at UTC midnight
		var date = new Date();
		date.setTime( Date.parse( date.toISOString().replace( /T.+/, 'T00:00:00.000Z' ) ) ); // get current day, midnight UTC
		date.setTime( date.getTime() - ( 1 * 24 * 60 * 60 * 1000 ) ); // get yesterday, midnight UTC
		this.latestPostDate = date.toISOString().replace( /\..+/, '.0000' );
		date.setTime( date.getTime() - ( this.daysToScrape * 24 * 60 * 60 * 1000 ) ); // get earliest scrape date, midnight UTC
		this.earliestPostDate = date.toISOString().replace( /\..+/, '.0000' );
		date.setTime( date.getTime() - ( ( this.daysOfRecordsToPreserve - this.daysToScrape ) * 24 * 60 * 60 * 1000 ) ); // get post cull date, midnight UTC
		this.earliestPostCullDate = date.toISOString().replace( /\..+/, '.0000' );
	}
	
	cyclePages( pages ) {
		// going through database pages to update page data and add latest posts
		_.forIn( pages, ( page, id ) => {
			this.updatePageData( id );
			this.addNewPosts( id );
		} );
		// once finished updating page data, cycle through newly added posts to update data in those
		this.callOnScrapeFinished( () => {
			this.updateAddedPosts();
		} );
	}
	
	updatePageData( id ) {
		this.scrapeCount++;
		const fields = [ 'about', 'category', 'fan_count', 'id', 'link', 'name', 'picture', 'website' ];
		facebookAPI.request( `/${ id }`, ( page ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in page ) updateData[field] = page[field];
			} );
			
			databaseAPI.requestPost( `pages/${ id }`, updateData );
			this.scrapeCount--;
		}, fields );
	}
	
	addNewPosts( pageID, after = null ) {
		this.scrapeCount++;
		const fields = [ 'created_time', 'from', 'id', 'link', 'message', 'name', 'picture', 'permalink_url', 'shares' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		var earliestPostReached = false;
		facebookAPI.request( `${ pageID }/posts`, ( response ) => {
			response.data.forEach( ( post ) => {
				post.last_allowed_comment_time = this.getPostLastAllowedCommentTime( post );
				this.posts[post.id] = post;
				
				if ( post.created_time >= this.earliestPostDate && post.created_time <= this.latestPostDate ) {
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( field in post ) updateData[field] = post[field];
					} );
					if ( 'from' in post ) updateData['page_id'] = post.from.id;
					if ( 'shares' in post ) updateData['shares'] = post.shares.count;

					databaseAPI.requestPost( `posts/${ post.id }`, updateData );
				} else if ( post.created_time < this.earliestPostDate ) {
					earliestPostReached = true;
				}
			} );
			if ( !earliestPostReached && ( 'paging' in response ) && ( 'next' in response.paging ) ) this.addNewPosts( pageID, response.paging.cursors.after );
			this.scrapeCount--;
		}, fields, parameters );
	}
	
	getPostLastAllowedCommentTime( post ) {
		var date = new Date( post.created_time.replace( /\..+/, '.000Z' ) );
		date.setTime( date.getTime() + ( 1 * 24 * 60 * 60 * 1000 ) ); // add 24 hours to creation time
		return date.toISOString().replace( /\..+/, '.0000' );
	}
	
	validCommentCreationTime( comment, postID ) {
		return ( this.posts[postID].last_allowed_comment_time >= comment.created_time );
	}
	
	updateAddedPosts() {
		// cycle through newly added posts to update reactions and comments in those
		_.forIn( this.posts, ( post, id ) => {
			this.updateReactions( id );
		} );
		// separated into two cycles because reactions can populate user records without second api call
		_.forIn( this.posts, ( post, id ) => {
			this.updatePostComments( id, id );
		} );
		// once finished updating post data, start doing any after scrape processing of the data
		this.callOnScrapeFinished( () => {
			delete this.posts;
			const parameters = {
				earliestPostCullDate: this.earliestPostCullDate,
				latestPostDate: this.latestPostCullDate
			}
			databaseAPI.request( 'process', null, null, parameters, 'POST' ); 
			console.log( 'scrape finished' );
		} );
	}
	
	callOnScrapeFinished( callback ) {
		var timer = setInterval( () => {
			if ( this.isScrapeFinished() && !databaseAPI.isBusy() ) {
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
				
				// save/update user
				const updateUserData = {};
				userFields.forEach( ( field ) => {
					if ( field in reaction ) updateUserData[field] = reaction[field];
				} );
				
				databaseAPI.requestPut( 'users', updateUserData );
				
				// save/update reaction
				const updateReactionData = {};
				reactionFields.forEach( ( field ) => {
					if ( field in reaction ) updateReactionData[field] = reaction[field];
				} );
				if ( 'id' in reaction ) updateReactionData['user_id'] = reaction.id;
				updateReactionData['post_id'] = key;
				updateReactionData['page_id'] = pageID;
				
				databaseAPI.requestPut( 'post_reactions', updateReactionData );
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
				if ( this.validCommentCreationTime( comment, postID ) ) {
					
					// save/update comment
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( field in comment ) updateData[field] = comment[field];
					} );
					if ( 'from' in comment ) updateData['user_id'] = comment.from.id;
					updateData['post_id'] = postID;
					updateData['page_id'] = pageID;
					
					databaseAPI.requestPut( 'comments', updateData );
					
					// save/update comment comments
					if ( comment.comment_count > 0 ) this.updatePostComments( comment.id, postID );
					
					// save/update user
					this.updateUser( comment.from.id );
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
				if ( field in user ) updateData[field] = user[field];
			} );
			databaseAPI.requestPut( 'users', updateData );
			this.scrapeCount--;
		}, fields );
	}
}

module.exports = new FBScraper();