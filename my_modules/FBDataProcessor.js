const _ = require( 'lodash' );
const firebaseDataStore = require( './FirebaseDataStore' );

class FBDataProcessor {
	
	constructor() {
		this.numberOfUpdateDays = 3;
	}
	
	start() {
		// delete old data
		this.updateLatestPostDate();
		firebaseDataStore.fetchEarliestPosts( this.latestPostDate, () => {
			this.removeOldPostsAndRelatedData();
		} );
	}
	
	updateLatestPostDate() {
		const date = new Date();
		date.setDate( date.getDate() - this.numberOfUpdateDays );
		this.latestPostDate = date.toISOString().replace( /\..+/, '+0000' );
	}
	
	removeOldPostsAndRelatedData() {
		const updateData = {};
		const possiblyOrphanedUsers = {};
		_.forIn( firebaseDataStore.getPosts(), ( post, postKey ) => {
			updateData[`posts/${ postKey }`] = {};
			firebaseDataStore.fetchOnce( `post_reactions`, ( postReactions ) => {
				if ( postReactions ) {
					_.forIn( postReactions, ( reaction, reactionKey ) => {
						updateData[`post_reactions/${ reactionKey }`] = {};
						possiblyOrphanedUsers[reaction.user_id] = true;
					} );
				}
			}, 'post_id', postKey );
			firebaseDataStore.fetchOnce( `comments`, ( comments ) => {
				if ( comments ) {
					_.forIn( comments, ( comment, commentKey ) => {
						updateData[`comments/${ commentKey }`] = {};
						possiblyOrphanedUsers[comment.user_id] = true;
					} );
				}
			}, 'post_id', postKey );
		} );
		firebaseDataStore.callOnNotBusy( () => {
			console.log( updateData );
			console.log( possiblyOrphanedUsers );
		} );
	}
}

module.exports = new FBDataProcessor();