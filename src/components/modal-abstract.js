import React, { Component } from 'react';

/*
	Base class for semantic modals that fixes the multiple modal scrolling issue. Must add onOpen and onUnmount functions to semantic ui modal props (ie: onOpen={ this.onOpen } and onUnmount={ this.onUnmount } )
*/

class ModalAbstract extends Component {
	
	constructor( props ) {
		super( props );
		this.onOpen = this.onOpen.bind( this );
		this.onUnmount = this.onUnmount.bind( this );
	}
	
	onOpen() {
		this.previousBodyClass = document.body.className;
	}
	
	onUnmount() {
		document.body.className = this.previousBodyClass;
	}
}

export default ModalAbstract;