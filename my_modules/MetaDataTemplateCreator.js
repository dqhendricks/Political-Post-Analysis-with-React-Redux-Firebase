
class MetaDataTemplateCreator {
	pages () { 
		return {
			total_posts: 0,
			total_love_posts: 0,
			total_funny_posts: 0,
			total_wow_posts: 0,
			total_sad_posts: 0,
			total_angry_posts: 0,
			hourly_posts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0 },
			average_comments_24: 0,
			hourly_average_comments: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0 },
			average_users_commenting_24: 0,
			average_zero_like_comments: 0,
		};
	}
	
	posts () { 
		return {
			total_reactions: 0,
			total_likes: 0,
			total_love: 0,
			love_percent: 0,
			total_funny: 0,
			funny_percent: 0,
			total_wow: 0,
			wow_percent: 0,
			total_sad: 0,
			sad_percent: 0,
			total_angry: 0,
			angry_percent: 0,
			highest_percent: '',
			total_comments_24: 0,
			hourly_total_comments: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0 },
			total_users_commenting: 0,
			users_commenting: {}
			zero_like_comments: 0,
			last_allowed_comment_time: '',
			page_id: '',
			created_time: ''
		};
	}
	
	users () { 
		return {
			total_reactions: 0,
			total_conservative_likes: 0,
			total_liberal_likes: 0,
			affiliation_score: 0.5,
			total_pages_interacted_with: 0,
			pages_interacted_with: {},
			both_liberal_and_conservative_interaction: false,
			total_comments: 0,
			total_comments_within_first_hour: 0
			duplicate_comments: 0,
			comment_starts: {},
			total_comments_under_5_likes: 0,
			total_comment_likes: 0,
			average_likes_per_comment: 0
		};
	}
}

module.exports = new MetaDataTemplateCreator();