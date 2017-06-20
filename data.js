const _ = require( 'lodash' );

var date = new Date();
date.setTime( Date.parse( date.toISOString().replace( /T.+/, 'T00:00:00.000Z' ) ) ); // get current day, midnight UTC
date.setTime( date.getTime() - ( 1 * 24 * 60 * 60 * 1000 ) ); // get yesterday, midnight UTC
date.setTime( date.getTime() - ( 1 * 24 * 60 * 60 * 1000 ) ); // get two days ago, midnight UTC
console.log( date.toISOString() );

