// links database table field names to each field's meta data

/*
name: display name
tables: array of tables this field can be found in
type: 'number', 'string', 'time'
description: display description
openList: object representing list to display when value is clicked in RecordShow component
	{
		table,
		columnSet [
			name,
			field,
			type,
			ifEmpty (optional)
		],
		orderField
	}
*/

export default {
	id: {
		name: 'ID',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'string',
		description: 'The Facebook ID of the record.'
	},
	name: {
		name: 'Name',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'string',
		description: 'The name of the record.'
	},
	affiliation: {
		name: 'Political Leaning',
		tables: {
			pages: true,
			users: true
		},
		type: 'number',
		description: 'A value bewteen 0 and 1, with 0 being Left Wing, and 1 being Right Wing.',
		icon: 'resize horizontal'
	},
	fan_count: {
		name: 'Fan Count',
		tables: {
			pages: true
		},
		type: 'number',
		description: 'The number of Facebook Fans.',
		icon: 'users'
	},
	total_posts: {
		name: 'Total Posts',
		tables: {
			pages: true
		},
		type: 'number',
		description: 'The total number posts made during the time period scraped.',
		icon: 'newspaper',
		openList: {
			table: 'posts',
			columnSet: [
				{ name: 'Post', field: 'message', type: 'string' },
				{ name: 'Link', field: 'permalink_url', type: 'string' },
				{ name: 'Total Likes', field: 'total_like_reactions', type: 'number' }
			],
			orderField: 'total_like_reactions'
		}
	},
	total_comments: {
		name: 'Total Comments',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number comments made during the time period scraped.',
		icon: 'comments outline',
		openList: {
			table: 'comments',
			columnSet: [
				{ name: 'Comment', field: 'message', type: 'string', ifEmpty: 'N/A (Image only comment)' },
				{ name: 'Link', field: 'permalink_url', type: 'string' },
				{ name: 'Total Likes', field: 'like_count', type: 'number' }
			],
			orderField: 'like_count'
		}
	},
	total_reactions: {
		name: 'Total Reactions',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number reactions made at time of scrape.',
		icon: 'thumbs outline up'
	},
	highest_reaction_type: {
		name: 'Most Common Reaction',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'string',
		description: 'The most common reaction (excluding LIKEs).',
		icon: 'thumbs outline up'
	},
	total_comment_likes: {
		name: 'Total Comment Likes',
		tables: {
			users: true
		},
		type: 'number',
		description: 'The total number of LIKEs on this user\'s comments.',
		icon: 'thumbs outline up'
	},
	total_love_reactions: {
		name: 'Total LOVE Reactions',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number of LOVE reactions.',
		icon: 'empty heart'
	},
	total_wow_reactions: {
		name: 'Total WOW Reactions',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number of WOW reactions.',
		icon: 'empty star'
	},
	total_haha_reactions: {
		name: 'Total HAHA Reactions',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number of HAHA reactions.',
		icon: 'smile'
	},
	total_sad_reactions: {
		name: 'Total SAD Reactions',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number of SAD reactions.',
		icon: 'meh'
	},
	total_angry_reactions: {
		name: 'Total ANGRY Reactions',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number of ANGRY reactions.',
		icon: 'frown'
	},
	total_like_reactions: {
		name: 'Total LIKE Reactions',
		tables: {
			pages: true,
			posts: true,
			users: true
		},
		type: 'number',
		description: 'The total number of LIKE reactions.',
		icon: 'thumbs outline up'
	},
	total_comments_zero_likes: {
		name: 'Total 0 LIKE Comments',
		tables: {
			users: true
		},
		type: 'number',
		description: 'The total number of comments made that have 0 LIKE reactions.',
		icon: 'thumbs outline down'
	},
	controversiality_score: {
		name: 'Controversiality Score',
		tables: {
			pages: true,
			posts: true
		},
		type: 'number',
		description: 'A number from 0 to 1. The closer the total number of positive and negative reactions, the higher the controversiality score.',
		icon: 'fire extinguisher'
	},
	average_hours_to_comment: {
		name: 'Average Hours To Comment',
		tables: {
			users: true
		},
		type: 'number',
		description: 'The average number of hours after the time a post is published, before this user makes a comment on the post.',
		icon: 'time'
	},
	total_pages_interacted_with: {
		name: 'Total Pages Interacted With',
		tables: {
			users: true
		},
		type: 'number',
		description: 'The number of pages this user commented on.',
		icon: 'rss'
	},
	total_posts_interacted_with: {
		name: 'Total Posts Interacted With',
		tables: {
			users: true
		},
		type: 'number',
		description: 'The number of posts this user commented on.',
		icon: 'newspaper'
	},
	duplicate_comment_count: {
		name: 'Total Duplicate Comments',
		tables: {
			users: true
		},
		type: 'number',
		description: 'The number of duplicate comments this user left, excluding image comments.',
		icon: 'comments outline'
	},
	image_comment_count: {
		name: 'Total Image Comments',
		tables: {
			users: true
		},
		type: 'number',
		description: 'The number of image comments this user left.',
		icon: 'picture'
	},
	shares: {
		name: 'Total Shares',
		tables: {
			posts: true
		},
		type: 'number',
		description: 'The total number of times this post was shared.',
		icon: 'share'
	},
	page_id: {
		name: 'Page ID',
		tables: {
			posts: true
		},
		type: 'string',
		description: 'ID of the page this post was posted by.',
		icon: 'hashtag'
	}
}