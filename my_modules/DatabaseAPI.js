const _ = require( 'lodash' );
request = require( 'request' );

class DatabaseAPI {
	
	constructor() {
		this.token = process.env.DATABASE_API_TOKEN;
		this.requestQueue = [];
		this.activeRequestCount = 0;
		setInterval( () => {
			this._requestQueueProcess();
		}, 25 );
	}
	
	requestPost( path, data, callback = null, parameters = {} ) {
		this.request( path, callback, null, parameters, 'POST', { data: JSON.stringify( data ) } );
	}
	
	requestDelete( path, callback = null, parameters = {} ) {
		this.request( path, callback, null, parameters, 'DELETE' );
	}
	
	request( path, callback, fields = null, parameters = {}, method = 'GET', form = {} ) {
		if ( this.token ) parameters.token = this.token;
		if ( fields ) parameters.fields = fields.join();
		parameters = _.values( _.map( parameters, ( value, key ) => {
			return `${ key }=${ value}`;
		} ) ).join( '&' );
		if ( parameters.length > 0 ) parameters = `?${ parameters }`;
		const url = `http://postanalysisapi.dustinhendricks.com/${ path }${ parameters }`;
		const options = {
			url: url,
			method: method,
			json: true,
			form: form
		};
		this.requestQueue.push( { options, callback } );
	}
	
	isBusy() {
		return ( this.requestQueue.length == 0 && this.activeRequestCount == 0 );
	}
	
	_requestQueueProcess() {
		if ( this.requestQueue.length > 0 ) {
			if ( this.activeRequestCount <= 2 ) {
				this.activeRequestCount++;
				const currentRequest = this.requestQueue.shift();
				//console.log( currentRequest.options.url );
				var callAnswered = false;
				request( currentRequest.options, ( err, httpResponse, body ) => {
					if ( !callAnswered ) {
						callAnswered = true;
						if ( err ) {
							this.requestQueue.unshift( currentRequest );
							console.log( `Request error: ${ err }. Retrying call.` );
							console.log( currentRequest.options.url );
							console.log( body );
						} else if ( httpResponse.statusCode != '200' ) {
							this.requestQueue.unshift( currentRequest );
							console.log( `HTTP error: ${ httpResponse.statusCode }. Retrying call.` );
							console.log( currentRequest.options.url );
							console.log( body );
						} else if ( 'error' in body ) {
							console.log( `Database error: ${ body.error }` );
						} else {
							if ( currentRequest.callback ) currentRequest.callback( body );
						}
						this.activeRequestCount--;
					}
				} );
				setTimeout( () => {
					if ( !callAnswered ) {
						callAnswered = true;
						console.log( `Retrying call: ${ currentRequest.options.url }` );
						this.requestQueue.unshift( currentRequest );
						this.activeRequestCount--;
					}
				}, 30 * 1000 );
			}
		}
	}
}

module.exports = new DatabaseAPI();