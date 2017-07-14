import _ from 'lodash';

import { FETCH_LIST, LOADING_LIST, CLEAR_LIST } from '../actions';

export default function( state = null, action ) {
	switch( action.type ) {
		case FETCH_LIST:
			return {
				data: action.payload.data,
				loading: false
			};
		case LOADING_LIST:
			return { ...state, loading: true };
		case CLEAR_LIST:
			return null;
		default:
			return state;
	}
}