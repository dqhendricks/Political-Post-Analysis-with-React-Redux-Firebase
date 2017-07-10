import { POSTS_SEARCH_CHANGE } from '../actions';

export default function( state = {
	data: null,
	terms: [ {
		whereField: '',
		whereOperator: 'e',
		whereValue: ''
	} ],
	orderBy: 'total_comments',
	orderDirection: 'DESC',
	page: 0
}, action ) {
	switch( action.type ) {
		case POSTS_SEARCH_CHANGE:
			return {
				data: action.payload.data,
				terms: action.meta.terms,
				orderBy: action.meta.orderBy,
				orderDirection: action.meta.orderDirection,
				page: action.meta.page
			};
		default:
			return state;
	}
}