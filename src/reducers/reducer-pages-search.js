import { PAGES_SEARCH_CHANGE, PAGES_SEARCH_LOADING } from '../actions';

export default function( state = {
	data: null,
	terms: [ {
		whereField: '',
		whereOperator: 'e',
		whereValue: ''
	} ],
	orderBy: 'total_posts',
	orderDirection: 'DESC',
	page: 0,
	loading: true
}, action ) {
	switch( action.type ) {
		case PAGES_SEARCH_CHANGE:
			return {
				data: action.payload.data,
				terms: action.meta.terms,
				orderBy: action.meta.orderBy,
				orderDirection: action.meta.orderDirection,
				page: action.meta.page,
				loading: false
			};
		case PAGES_SEARCH_LOADING:
			return { ...state, loading: true };
		default:
			return state;
	}
}