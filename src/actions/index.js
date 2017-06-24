import axios from 'axios';

export const FETCH_PAGES = 'fetch_pages';

export function fetchPages() {
	return {
		type: FETCH_PAGES,
		payload: {}
	}
}