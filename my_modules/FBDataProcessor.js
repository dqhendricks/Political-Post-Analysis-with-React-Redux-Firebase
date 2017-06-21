const fs = require( 'fs' );
const _ = require( 'lodash' );
const firebaseDataStore = require( './FirebaseDataStore' );

class FBDataProcessor {
	
	constructor() {
		this.metaDataTemplateCreator = require( './MetaDataTemplateCreator' );
	}
	
	resetData( earliestPostDate, latestPostDate ) {
		this.data = {
			earliestPostDate,
			latestPostDate,
			pages: {},
			posts: {},
			users: {},
			comments: {},
			post_reactions: {}
		};
	}
	
	addPage( page ) {
		this.data.pages[page.id] = this.metaDataTemplateCreator.pages();
		this.data.pages[page.id].affiliation_score = page.affiliation_score;
	}
	
	addPost( post ) {
		this.data.posts[post.id] = this.metaDataTemplateCreator.posts();
		this.data.posts[post.id].last_allowed_comment_time = this.getPostLastAllowedCommentTime( post );
		this.data.posts[post.id].created_time = post.created_time;
		this.data.posts[post.id].page_id = post.from.id;
		this.data.pages[post.from.id].total_posts++;
		this.data.pages[post.from.id].hourly_posts[this.getPostHour( post )]++;
	}
	
	getPostHour( post ) {
		var date = new Date( post.created_time.replace( /\..+/, '.000Z' ) );
		return date.getUTCHours();
	}
	
	getPostLastAllowedCommentTime( post ) {
		var date = new Date( post.created_time.replace( /\..+/, '.000Z' ) );
		date.setTime( date.getTime() + ( 1 * 24 * 60 * 60 * 1000 ) ); // add 24 hours to creation time
		return date.toISOString().replace( /\..+/, '.0000' );
	}
	
	validCommentCreationTime( comment, postID ) {
		return ( this.data.posts[postID].last_allowed_comment_time >= comment.created_time );
	}
	
	getPosts() {
		return this.data.posts;
	}
	
	addUser( userID ) {
		if ( !( userID in this.data.users ) ) this.data.users[userID] = this.metaDataTemplateCreator.users();
	}
	
	addReaction( reaction, reactionID, postID, pageID ) {
		// post
		this.data.posts[postID].total_reactions++;
		switch( reaction.type ) {
			case 'LIKE':
				this.data.posts[postID].total_likes++;
				break;
			case 'LOVE':
				this.data.posts[postID].total_love++;
				break;
			case 'WOW':
				this.data.posts[postID].total_wow++;
				break;
			case 'HAHA':
				this.data.posts[postID].total_funny++;
				break;
			case 'SAD':
				this.data.posts[postID].total_sad++;
				break;
			case 'ANGRY':
				this.data.posts[postID].total_angry++;
				break;
		}
		// user
		this.data.users[reaction.id].total_reactions++;
		if ( reaction.type == 'LIKE' ) {
			if ( this.data.pages[pageID].affiliation_score == 1 ) {
				this.data.users[reaction.id].total_conservative_likes++;
			} else {
				this.data.users[reaction.id].total_liberal_likes++;
			}
		}
		this.data.users[reaction.id].pages_interacted_with[pageID] = true;
		// reactions
		this.data.post_reactions[reactionID] = true;
	}
	
	addComment( comment, postID, pageID ) {
		const commentHour = this.getCommentHour( comment, postID );
		// page
		this.data.pages[pageID].total_comments_24++;
		this.data.pages[pageID].hourly_total_comments_24[commentHour]++;
		// post
		this.data.posts[postID].total_comments_24++;
		this.data.posts[postID].hourly_total_comments[commentHour]++;
		if ( comment.like_count == 0 ) this.data.posts[postID].zero_like_comments++;
		this.data.posts[postID].users_commenting[comment.from.id] = true;
		// user
		this.data.users[comment.from.id].pages_interacted_with[pageID] = true;
		this.data.users[comment.from.id].total_comments++;
		var commentStart = comment.message.substr( 0, 20 );
		if ( commentStart in this.data.users[comment.from.id].comment_starts ) {
			this.data.users[comment.from.id].comment_starts[commentStart]++;
		} else {
			this.data.users[comment.from.id].comment_starts[commentStart] = 1;
		}
		if ( comment.like_count < 5 ) this.data.users[comment.from.id].total_comments_under_5_likes++;
		this.data.users[comment.from.id].total_comment_likes += comment.like_count;
		if ( commentHour == 0 ) this.data.users[comment.from.id].total_comments_within_first_hour++;
		// comments
		this.data.comments[comment.id] = true;
	}
	
	getCommentHour( comment, postID ) {
		var postCreationTime = new Date( this.data.posts[postID].created_time.replace( /\..+/, '.000Z' ) ).getTime();
		var commentCreationTime = new Date( comment.created_time.replace( /\..+/, '.000Z' ) ).getTime();
		return Math.floor( ( commentCreationTime - postCreationTime ) / ( 1000 * 60 * 60 ) );
	}
	
	afterScrapeProcessing() {
		console.log( 'begin after scrape processing' );
		// users
		console.log( 'users' );
		_.forIn( this.data.users, ( user, id ) => {
			if ( user.total_comment_likes != 0 ) this.data.users[id].average_likes_per_comment = user.total_comments / user.total_comment_likes;
			_.forIn( user.comment_starts, ( commentDuplicates, id ) {
				if ( commentDuplicates > 1 ) this.data.users[id].duplicate_comments += commentDuplicates;
			} );
			delete this.data.users[id].comment_starts;
			const affiliation_interactions = { left: false, right: false };
			_.forIn( user.pages_interacted_with, ( value, pageID ) {
				this.data.users[id].total_pages_interacted_with++;
				if ( this.data.pages[pageID].affiliation_score == 1 ) {
					affiliation_interactions.right = true;
				} else {
					affiliation_interactions.left = true;
				}
			}
			if ( affiliation_interactions.left && affiliation_interactions.right ) this.data.users[id].both_liberal_and_conservative_interaction = true;
			const total_affiliation_likes = user.total_conservative_likes + user.total_liberal_likes;
			if ( total_affiliation_likes > 0 ) this.data.users[id].affiliation_score = user.total_conservative_likes / total_affiliation_likes;
		} );
		// posts
		console.log( 'posts' );
		_.forIn( this.data.posts, ( post, id ) => {
			this.data.posts[id].total_users_commenting = _.size( post.users_commenting );
			delete this.data.posts[id].users_commenting;
			this.data.pages[post.from.id].total_users_commenting_24 += this.data.posts[id].total_users_commenting;
			if ( post.total_likes = 0 ) this.data.pages[post.from.id].total_zero_like_comments_24++;
			if ( post.total_reactions > 0 ) {
				this.data.posts[id].love_percent = post.total_love / post.total_reactions;
				this.data.posts[id].funny_percent = post.total_funny / post.total_reactions;
				this.data.posts[id].wow_percent = post.total_wow / post.total_reactions;
				this.data.posts[id].sad_percent = post.total_sad / post.total_reactions;
				this.data.posts[id].angry_percent = post.total_angry / post.total_reactions;
				var highestType = { type: 'n/a', count: 0 };
				if ( post.total_love > highestType.count ) highestType = { type: 'LOVE', count: post.total_love };
				if ( post.total_funny > highestType.count ) highestType = { type: 'WOW', count: post.total_funny };
				if ( post.total_wow > highestType.count ) highestType = { type: 'HAHA', count: post.total_wow };
				if ( post.total_sad > highestType.count ) highestType = { type: 'SAD', count: post.total_sad };
				if ( post.total_angry > highestType.count ) highestType = { type: 'ANGRY', count: post.total_angry };
				this.data.posts[id].post_type = highestType.type;
				switch( this.data.posts[id].post_type ) {
					case 'LOVE':
						this.data.pages[post.page_id].total_love_posts++;
						break;
					case 'WOW':
						this.data.pages[post.page_id].total_funny_posts++;
						break;
					case 'HAHA':
						this.data.pages[post.page_id].total_wow_posts++;
						break;
					case 'SAD':
						this.data.pages[post.page_id].total_sad_posts++;
						break;
					case 'ANGRY':
						this.data.pages[post.page_id].total_angry_posts++;
						break;
				}
			}
		} );
		// pages
		console.log( 'pages' );
		_.forIn( this.data.pages, ( page, id ) => {
			if ( page.total_posts != 0 ) this.data.pages[id].average_comments_24 = page.total_comments_24 / page.total_posts;
			if ( page.total_posts != 0 ) this.data.pages[id].average_users_commenting_24 = page.total_users_commenting_24 / page.total_posts;
			if ( page.total_posts != 0 ) this.data.pages[id].average_zero_like_comments_24 = page.total_zero_like_comments_24 / page.total_posts;
			var highestType = { type: 'n/a', count: 0 };
			if ( page.total_love_posts > highestType.count ) highestType = { type: 'LOVE', count: page.total_love_posts };
			if ( page.total_funny_posts > highestType.count ) highestType = { type: 'WOW', count: page.total_funny_posts };
			if ( page.total_wow_posts > highestType.count ) highestType = { type: 'HAHA', count: page.total_wow_posts };
			if ( page.total_sad_posts > highestType.count ) highestType = { type: 'SAD', count: page.total_sad_posts };
			if ( page.total_angry_posts > highestType.count ) highestType = { type: 'ANGRY', count: page.total_angry_posts };
			this.data.pages[id].mostly_posts_type = highestType.type;
			_.forIn( page.hourly_total_comments_24, ( commentTotal, id ) => {
				if ( page.total_posts != 0 ) this.data.pages[id].hourly_average_comments_24[id] = commentTotal / page.total_posts;
			} );
		} );
		// totals
		console.log( 'toals' );
		this.data.totals.pages = _.size( this.data.pages );
		console.log( `pages total: ${ this.data.totals.pages }` );
		this.data.totals.posts = _.size( this.data.posts );
		console.log( `posts total: ${ this.data.totals.posts }` );
		this.data.totals.users = _.size( this.data.users );
		console.log( `users total: ${ this.data.totals.users }` );
		this.data.totals.post_reactions = _.size( this.data.post_reactions );
		console.log( `post_reactions total: ${ this.data.totals.post_reactions }` );
		this.data.totals.comments = _.size( this.data.comments );
		console.log( `comments total: ${ this.data.totals.comments }` );
		
		const oldFileName = './yesterdays_data.json';
		const newFileName = './todays_data.json';
		// save meta data to file
		console.log( 'save meta data to file' );
		fs.writeFileSync( newFileName, JSON.stringify( this.data, null, 2 ) , 'utf-8' );
		delete this.data.post_reactions;
		delete this.data.comments;
		
		// save meta data to database
		console.log( 'save meta data to database' );
		const updateData = {};
		this.convertCollectionToFirebaseUpdates( this.data, updateObject );
		firebaseDataStore.update( updateData );
		delete this.data.totals;
		delete this.data.pages;
		delete this.data.posts;
		updateData = {};
		
		// load last update's meta data
		console.log( 'load last update\'s meta data' );
		this.oldData = null;
		if ( fs.existsSync( oldFileName ) ) {
			this.oldData = require( oldFileName );
		}
		
		// compare users and find orphaned users for deletion
		console.log( 'compare users and find orphaned users for deletion' );
		if ( this.oldData ) {
			_.forIn( this.data.users, ( user, id ) => {
				delete this.oldData.users[id];
			} );
		}
		delete this.data;
		
		// delete old data
		console.log( 'delete old data' );
		if ( this.oldData ) {
			updateData = {};
			convertCollectionToFirebaseDeletions( this.oldData.pages, updateObject, 'pages' );
			convertCollectionToFirebaseDeletions( this.oldData.posts, updateObject, 'posts' );
			convertCollectionToFirebaseDeletions( this.oldData.users, updateObject, 'users' );
			convertCollectionToFirebaseDeletions( this.oldData.post_reactions, updateObject, 'post_reactions' );
			convertCollectionToFirebaseDeletions( this.oldData.comments, updateObject, 'comments' );
			firebaseDataStore.update( updateData );
		}
		
		// delete old data file and rename new data file
		console.log( 'delete old data file and rename new data file' );
		if ( this.oldData ) {
			fs.unlinkSync( oldFileName );
			fs.renameSync( newFileName, oldFileName );
		}
		delete this.oldData;
		
		console.log( 'cycle finished' );
	}
	
	convertCollectionToFirebaseUpdates( collection, updateObject, startPath = '' ) {
		_.forIn( collection, ( collectionItem, key ) => {
			if ( this.isObject( collectionItem ) ) {
				this.convertCollectionToFirebaseUpdates( collectionItem, updateObject, `${ startPath }/${ key }` );
			} else {
				updateObject[`${ startPath }/${ key }`] = collectionItem;
			}
		} );
	}
	
	isObject( reference ) {
		return ( reference !== null && typeof reference === 'object' );
	}
	
	convertCollectionToFirebaseDeletions( collection, updateObject, startPath = '' ) {
		_.forIn( collection, ( collectionItem, key ) => {
			updateObject[`${ startPath }/${ key }`] = {};
		} );
	}
}

module.exports = new FBDataProcessor();