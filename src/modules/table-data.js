// links database table field names to each field's meta data

/*
name: display name
icon: semantic ui icon that represents this table
overTimeField: field with data to use for over time graph on RecordShow component
overTimeLabel: label to use for over time graph on RecordShow component
urlField: which field to use as Facebook URL on RecordShow component
searchByField: foreign key field used for searching other tables for related records
columnSet: array of column meta data to use for ListShow { name, field, type }
orderField: which field to sort by for ListShow
*/

export default {
	pages: {
		name: 'Pages',
		icon: 'feed',
		overTimeField: 'posts_over_time',
		overTimeLabel: 'Posts',
		searchByField: 'page_id',
		urlField: 'link'
	},
	posts: {
		name: 'Posts',
		icon: 'newspaper',
		columnSet: [
			{ name: 'Post', field: 'message', type: 'string' },
			{ name: 'Link', field: 'permalink_url', type: 'string' },
			{ name: 'Total Likes', field: 'total_like_reactions', type: 'number' }
		],
		orderField: 'total_like_reactions',
		overTimeField: 'comments_over_time',
		overTimeLabel: 'Comments',
		searchByField: 'post_id',
		urlField: 'permalink_url'
	},
	users: {
		name: 'Users',
		icon: 'users',
		overTimeField: 'comments_over_time',
		overTimeLabel: 'Comments',
		searchByField: 'user_id',
		urlField: 'link'
	},
	comments: {
		name: 'Comments',
		icon: 'comments outline',
		columnSet: [
			{ name: 'Comment', field: 'message', type: 'string', ifEmpty: 'N/A (Image only comment)' },
			{ name: 'Link', field: 'permalink_url', type: 'string' },
			{ name: 'Total Likes', field: 'like_count', type: 'number' }
		],
		orderField: 'like_count'
	}
}