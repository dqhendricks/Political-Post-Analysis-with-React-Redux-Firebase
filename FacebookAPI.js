const _ = require( 'lodash' );
request = require( 'request' );

class FacebookAPI {
	
	constructor() {
		this.token = null;
		this.requestQueue = [];
		this.activeRequestCount = 0;
		setInterval( () => {
			this._requestQueueProcess();
		}, 100 );
	}
	
	getToken( callback = null ) {
		const url = `oauth/access_token`;
		const parameters = {
			client_id: process.env.FACEBOOK_APP_ID,
			client_secret: process.env.FACEBOOK_APP_SECRET,
			grant_type: 'client_credentials'
		};
		
		this.request( url, ( response ) => {
			console.log( 'start' );
			this.token = response.access_token;
			if ( callback ) callback();
		}, null, parameters );
	}
	
	request( path, callback, fields = null, parameters = {}, method = 'GET' ) {
		if ( this.token ) parameters.access_token = this.token;
		if ( fields ) parameters.fields = fields.join();
		parameters = _.values( _.map( parameters, ( value, key ) => {
			return `${ key }=${ value}`;
		} ) ).join( '&' );
		if ( parameters.length > 0 ) parameters = `?${ parameters }`;
		const url = `https://graph.facebook.com/${ path }${ parameters }`;
		const options = {
			url: url,
			method: method,
			json: true,
		};
		this.requestQueue.push( { options, callback } );
	}
	
	isQueueFinished() {
		return ( this.activeRequestCount == 0 && this.requestQueue.length == 0 );
	}
	
	_requestQueueProcess() {
		if ( this.requestQueue.length > 0 ) {
			if ( this.activeRequestCount <= 0 ) {
				const currentRequest = this.requestQueue.shift();
				console.log( currentRequest.options.url );
				this.activeRequestCount++;
				request( currentRequest.options, ( err, httpResponse, body ) => {
					this.activeRequestCount--;
					if ( this.isQueueFinished() ) {
						console.log( 'end facebook request queue' );
					}
					if ( err ) {
						console.log( `Request error: ${ err }` );
					} else if ( httpResponse.statusCode != '200' ) {
						console.log( `HTTP error: ${ httpResponse.statusCode }` );
					} else if ( 'error' in body ) {
						console.log( `Facebook error: ${ body.error }` );
					} else {
						currentRequest.callback( body );
					}
				} );
			}
		}
	}
}

module.exports = new FacebookAPI();