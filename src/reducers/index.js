import { combineReducers } from 'redux';
import MetaDataReducer from './reducer-meta-data';

const rootReducer = combineReducers( {
	metaData: MetaDataReducer
} );

export default rootReducer;
