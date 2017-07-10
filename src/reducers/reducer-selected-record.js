import _ from 'lodash';

import { FETCH_RECORD, CLEAR_RECORD } from '../actions';

export default function( state = null, action ) {
	switch( action.type ) {
		case FETCH_RECORD:
			return action.payload.data;
		case CLEAR_RECORD:
			return null;
		default:
			return state;
	}
}