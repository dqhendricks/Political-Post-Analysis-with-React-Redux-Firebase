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
		parameters.data = JSON.stringify( data );
		this.request( path, callback, null, parameters, 'POST' )
	}
	
	requestPut( path, data, callback = null, parameters = {} ) {
		parameters.data = JSON.stringify( data );
		this.request( path, callback, null, parameters, 'PUT' )
	}
	
	requestDelete( path, callback = null, parameters = {} ) {
		this.request( path, callback, null, parameters, 'DELETE' )
	}
	
	request( path, callback, fields = null, parameters = {}, method = 'GET' ) {
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
		};
		this.requestQueue.push( { options, callback } );
	}
	
	isBusy() {
		return ( this.requestQueue.length == 0 && this.activeRequestCount == 0 );
	}
	
	_requestQueueProcess() {
		if ( this.requestQueue.length > 0 ) {
			if ( this.activeRequestCount <= 1 ) {
				const currentRequest = this.requestQueue.shift();
				console.log( currentRequest.options.url );
				this.activeRequestCount++;
				var callAnswered = false;
				request( currentRequest.options, ( err, httpResponse, body ) => {
					if ( !callAnswered ) {
						this.activeRequestCount--;
						callAnswered = true;
						if ( err ) {
							console.log( `Request error: ${ err }` );
						} else if ( httpResponse.statusCode != '200' ) {
							console.log( `HTTP error: ${ httpResponse.statusCode }` );
						} else if ( 'error' in body ) {
							console.log( `Database error: ${ body.error }` );
						} else {
							currentRequest.callback( body );
						}
					}
				} );
				setTimeout( () => {
					if ( !callAnswered ) {
						this.activeRequestCount--;
						callAnswered = true;
						console.log( `Retrying call: ${ currentRequest.options.url }` );
						this.requestQueue.unshift( currentRequest );
					}
				}, 30 * 1000 );
			}
		}
	}
}

module.exports = new DatabaseAPI();