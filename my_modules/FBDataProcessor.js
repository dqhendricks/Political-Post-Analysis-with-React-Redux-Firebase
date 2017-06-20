const _ = require( 'lodash' );

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
	}
}

module.exports = new FBDataProcessor();