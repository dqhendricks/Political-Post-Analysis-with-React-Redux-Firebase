import axios from 'axios';

export const FETCH_META_DATA = 'fetch_meta_data';
export const PAGES_SEARCH_CHANGE = 'page_search_change';
export const POSTS_SEARCH_CHANGE = 'post_search_change';
export const USERS_SEARCH_CHANGE = 'user_search_change';
export const PAGES_SEARCH_LOADING = 'page_search_loading';
export const POSTS_SEARCH_LOADING = 'post_search_loading';
export const USERS_SEARCH_LOADING = 'user_search_loading';
export const FETCH_RECORD = 'fetch_record';
export const CLEAR_RECORD = 'clear_record';
export const FETCH_LIST = 'fetch_list';
export const LOADING_LIST = 'loading_list';
export const CLEAR_LIST = 'clear_list';

const ROOT_URL = 'http://postanalysisapi.dustinhendricks.com/';

const tableToActionList = {
	pages: { change: PAGES_SEARCH_CHANGE, loading: PAGES_SEARCH_LOADING },
	posts: { change: POSTS_SEARCH_CHANGE, loading: POSTS_SEARCH_LOADING },
	users: { change: USERS_SEARCH_CHANGE, loading: USERS_SEARCH_LOADING }
}

export function fetchMetaData() {
	const request = axios.get( `${ ROOT_URL }meta_data` );
	
	return {
		type: FETCH_META_DATA,
		payload: request
	}
}

export function searchChange( table, terms, orderBy, orderDirection, page ) {
	const rowCount = 4; // rows per page
	const fields = `fields=id,name,picture,${ orderBy }`;
	const where = termsToWhere( terms );
	const order = `order_by=${ orderBy }&order_direction=${ orderDirection }`;
	const limit = `row_count=${ rowCount }&offset=${ page * rowCount }`;
	const request = axios.get( `${ ROOT_URL }${ table }?${ fields }&${ where }&${ order }&${ limit }` );
	
	return {
		type: tableToActionList[table].change,
		payload: request,
		meta: {
			terms,
			orderBy,
			orderDirection,
			page
		}
	}
}

function termsToWhere( terms ) {
	var whereFields = [];
	var whereOperators = [];
	var whereValues = [];
	terms.forEach( term => {
		if ( term.whereField ) {
			whereFields.push( term.whereField );
			whereOperators.push( term.whereOperator );
			whereValues.push( term.whereValue );
		}
	} );
	return `where_fields=${ whereFields.join() }&where_operators=${ whereOperators.join() }&where_values=${ whereValues.join() }`;
}

export function searchLoading( table ) {
	return {
		type: tableToActionList[table].loading,
		payload: null
	}
}

export function fetchRecord( table, recordID ) {
	const request = axios.get( `${ ROOT_URL }${ table }/${ recordID }` );
	
	return {
		type: FETCH_RECORD,
		payload: request
	}
}

export function clearRecord() {
	
	return {
		type: CLEAR_RECORD,
		payload: null
	}
}

export function fetchList( table, orderField, searchField, searchValue, page = 0 ) {
	const rowCount = 4; // rows per page
	const offset = page * rowCount;
	const request = axios.get( `${ ROOT_URL }${ table }?row_count=${ rowCount }&offset=${ offset }&order_by=${ orderField }&order_direction=DESC&where_fields=${ searchField }&where_operators=e&where_values=${ searchValue }` );
	
	return {
		type: FETCH_LIST,
		payload: request
	}
}

export function loadingList() {
	
	return {
		type: LOADING_LIST,
		payload: null
	}
}

export function clearList() {
	
	return {
		type: CLEAR_LIST,
		payload: null
	}
}