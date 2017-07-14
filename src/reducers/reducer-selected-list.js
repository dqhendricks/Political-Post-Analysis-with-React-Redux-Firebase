import _ from 'lodash';

import { FETCH_LIST, CLEAR_LIST } from '../actions';

export default function( state = null, action ) {
	switch( action.type ) {
		case FETCH_LIST:
			return action.payload.data;
		case CLEAR_LIST:
			return null;
		default:
			return state;
	}
}