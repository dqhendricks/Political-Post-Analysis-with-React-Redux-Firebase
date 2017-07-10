import axios from 'axios';

export const FETCH_META_DATA = 'fetch_meta_data';
export const PAGES_SEARCH_CHANGE = 'page_search_change';
export const POSTS_SEARCH_CHANGE = 'post_search_change';
export const USERS_SEARCH_CHANGE = 'user_search_change';
export const FETCH_RECORD = 'fetch_record';
export const CLEAR_RECORD = 'clear_record';

const ROOT_URL = 'http://postanalysisapi.dustinhendricks.com/';

const tableToActionList = {
	pages: PAGES_SEARCH_CHANGE,
	posts: POSTS_SEARCH_CHANGE,
	users: USERS_SEARCH_CHANGE
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
		type: tableToActionList[table],
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