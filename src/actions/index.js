import axios from 'axios';

export const FETCH_META_DATA = 'fetch_meta_data';

const ROOT_URL = 'http://postanalysisapi.dustinhendricks.com/';

export function fetchMetaData() {
	const request = axios.get( `${ ROOT_URL }meta_data` );
	
	return {
		type: FETCH_META_DATA,
		payload: request
	}
}