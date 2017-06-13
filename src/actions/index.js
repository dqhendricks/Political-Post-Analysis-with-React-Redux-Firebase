import firebase from 'firebase';
import axios from 'axios';

export const FETCH_PAGES = 'fetch_pages';

const firebaseConfig = {
	apiKey: '',
	authDomain: 'political-post-analysis.firebaseio.com',
	databaseURL: 'https://political-post-analysis.firebaseio.com/'
};
firebase.initializeApp( firebaseConfig );
const database = firebase.database();

export function fetchPages() {
	return dispatch => {
		database.ref( 'pages' ).on( 'value', snapshot => {
			dispatch( {
				type: FETCH_PAGES,
				payload: snapshot.val()
			} );
		} );
	}
}