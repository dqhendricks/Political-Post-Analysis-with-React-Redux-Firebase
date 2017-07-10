import { combineReducers } from 'redux';
import { reducer as reducerForm } from 'redux-form';
import MetaDataReducer from './reducer-meta-data';
import PagesSearchReducer from './reducer-pages-search';
import PostsSearchReducer from './reducer-posts-search';
import UsersSearchReducer from './reducer-users-search';
import SelectedRecordReducer from './reducer-selected-record';

// search reducers must follow the naming convention `${ tableName }Search` to work with SearchableDataList component

const rootReducer = combineReducers( {
	form: reducerForm, // required wiring for redux-form
	metaData: MetaDataReducer,
	pagesSearch: PagesSearchReducer,
	postsSearch: PostsSearchReducer,
	usersSearch: UsersSearchReducer,
	selectedRecord: SelectedRecordReducer
} );

export default rootReducer;
