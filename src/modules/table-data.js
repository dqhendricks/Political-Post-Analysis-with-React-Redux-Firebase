// links database table field names to each field's meta data

/*
name: display name
icon: semantic ui icon that represents this table
overTimeField: field with data to use for over time graph on RecordShow component
overTimeLabel: label to use for over time graph on RecordShow component
urlField: which field to use as Facebook URL on RecordShow component
searchByField: foreign key field used for searching other tables for related records
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
		icon: 'comments outline'
	}
}