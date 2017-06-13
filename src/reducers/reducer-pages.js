import { FETCH_PAGES } from '../actions';

export default function( state = {}, action ) {
	switch( action.type ) {
		case FETCH_PAGES:
			console.log( action.payload );
			return action.payload;
		default:
			return state;
	}
}