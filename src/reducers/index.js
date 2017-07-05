import { combineReducers } from 'redux';
import MetaDataReducer from './reducer-meta-data';
import PageSearchReducer from './reducer-page_search';

const rootReducer = combineReducers( {
	metaData: MetaDataReducer,
	pageSearch: PageSearchReducer
} );

export default rootReducer;
