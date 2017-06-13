import { combineReducers } from 'redux';
import PagesReducer from './reducer-pages';

const rootReducer = combineReducers( {
	pages: PagesReducer
} );

export default rootReducer;
