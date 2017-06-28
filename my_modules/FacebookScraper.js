const _ = require( 'lodash' );
const facebookAPI = require( './FacebookAPI' );
const databaseAPI = require( './DatabaseAPI' );

class FacebookScraper {
	
	constructor() {
		this.daysToScrape = 1;
		this.daysOfRecordsToPreserve = 7;
	}
	
	start() {
		// do first iteration at midnight UTC, then every 24 hours after that
		this.iteration();
		setTimeout( () => {
			this.iteration();
			setInterval( () => {
				this.iteration();
			}, 1000 * 60 * 60 * 24 );
		}, this.millisecondsTillStartTime() );
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
		this.timedObjectIterators = 0;
		this.posts = {};
		this.updatePostDateRanges();
		databaseAPI.request( 'pages', ( pages ) => {
			facebookAPI.getToken( () => {
				this.cyclePages( pages.data );
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
	
	convertFacebookTimeToDatabaseTime( time ) {
		return time.replace( /T/, ' ' ).replace( /\..+/, '' );
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
		const fields = [ 'about', 'category', 'fan_count', 'id', 'link', 'name', 'picture', 'website' ];
		facebookAPI.request( `/${ id }`, ( page ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in page ) updateData[field] = page[field];
			} );
			
			databaseAPI.requestPost( `pages/${ id }`, updateData );
		}, fields );
	}
	
	addNewPosts( pageID, after = null ) {
		const fields = [ 'created_time', 'from', 'id', 'link', 'message', 'name', 'picture', 'permalink_url', 'shares' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		var earliestPostReached = false;
		facebookAPI.request( `${ pageID }/posts`, ( response ) => {
			response.data.forEach( ( post ) => {
				if ( post.created_time >= this.earliestPostDate && post.created_time <= this.latestPostDate ) {
					post.last_allowed_comment_time = this.getPostLastAllowedCommentTime( post );
					this.posts[post.id] = post;
					
					const updateData = {};
					fields.forEach( ( field ) => {
						if ( field in post ) updateData[field] = post[field];
					} );
					if ( 'from' in post ) updateData['page_id'] = post.from.id;
					if ( 'shares' in post ) updateData['shares'] = post.shares.count;
					updateData['created_time_mysql'] = this.convertFacebookTimeToDatabaseTime( post.created_time );

					databaseAPI.requestPost( `posts/${ post.id }`, updateData );
				} else if ( post.created_time < this.earliestPostDate ) {
					earliestPostReached = true;
				}
			} );
			if ( !earliestPostReached && ( 'paging' in response ) && ( 'next' in response.paging ) ) this.addNewPosts( pageID, response.paging.cursors.after );
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
		/*
		this.iterateObjectOnEmptyQueue( this.posts, ( post, id ) => {
			this.updatePostComments( id, id );
		} );
		*/
		this.callOnScrapeFinished( () => {
			this.iterateObjectOnEmptyQueue( this.posts, ( post, id ) => {
				this.updatePostReactions( id );
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
		} );
	}
	
	iterateObjectOnEmptyQueue( object, callback ) {
		// wait for all queues to be empty before next iteration, to help solve memory issues
		this.timedObjectIterators++;
		var i = 0;
		const keys = Object.keys( object );
		var timer = setInterval( () => {
			if ( !facebookAPI.isBusy() && !databaseAPI.isBusy() ) { // are queues empty?
				if ( i < keys.length ) {
					callback( object[keys[i]], keys[i] );
					i++;
				} else {
					clearInterval( timer );
					this.timedObjectIterators--;
				}
			}
		}, 100 );
	}
	
	callOnScrapeFinished( callback ) {
		// wait for all scrapes to finish before continuing, to help solve memory issues
		var timer = setInterval( () => {
			if ( !facebookAPI.isBusy() && !databaseAPI.isBusy() && this.timedObjectIterators == 0 ) {
				clearInterval( timer );
				callback();
			}
		}, 1000 );
	}
	
	updatePostReactions( key, after = null ) {
		const reactionFields = [ 'id', 'link', 'name', 'picture', 'type' ];
		const parameters = { limit: 100 };
		if ( after ) parameters.after = after;
		facebookAPI.request( `${ key }/reactions`, ( response ) => {
			const pageID = key.substr( 0, key.indexOf( '_' ) );
			response.data.forEach( ( reaction ) => {
				const reactionID = `${ key }_${ reaction.id }`;
				
				// save/update reaction
				const updateData = {};
				reactionFields.forEach( ( field ) => {
					if ( field in reaction ) updateData[field] = reaction[field];
				} );
				updateData['id'] = reactionID;
				if ( 'id' in reaction ) updateData['user_id'] = reaction.id;
				updateData['post_id'] = key;
				updateData['page_id'] = pageID;
				
				databaseAPI.requestPost( `post_reactions/${ reactionID }`, updateData );
				
				// user data for these is saved in post processing
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updatePostReactions( key, response.paging.cursors.after );
		}, reactionFields, parameters );
	}
	
	updatePostComments( key, postID, after = null ) {
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
					updateData['created_time_mysql'] = this.convertFacebookTimeToDatabaseTime( comment.created_time );
					
					databaseAPI.requestPost( `comments/${ comment.id }`, updateData );
					
					// save/update comment comments
					if ( comment.comment_count > 0 ) this.updatePostComments( comment.id, postID );
					
					// save/update user
					this.updateUser( comment.from.id );
				}
			} );
			if ( ( 'paging' in response ) && ( 'next' in response.paging ) ) this.updatePostComments( key, postID, response.paging.cursors.after );
		}, fields, parameters );
	}
	
	updateUser( key ) {
		const fields = [ 'id', 'link', 'name', 'picture' ];
		facebookAPI.request( `${ key }`, ( user ) => {
			const updateData = {};
			fields.forEach( ( field ) => {
				if ( field in user ) updateData[field] = user[field];
			} );
			databaseAPI.requestPost( `users/${ user.id }`, updateData );
		}, fields );
	}
}

module.exports = new FacebookScraper();