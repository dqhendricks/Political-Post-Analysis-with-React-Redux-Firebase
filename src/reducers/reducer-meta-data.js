import _ from 'lodash';

import { FETCH_META_DATA } from '../actions';

export default function( state = {}, action ) {
	switch( action.type ) {
		case FETCH_META_DATA:
			console.log( 'response received' );
			const metaData = {};
			_.each( action.payload.data, record => {
				if ( !( record.type in metaData ) ) metaData[record.type] = {};
				metaData[record.type][record.key] = record;
			} );
			console.log( metaData );
			return metaData;
		default:
			return state;
	}
}