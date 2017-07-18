import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react'

/*
	Enhanced modal fixes the multiple modal scrolling issue inherent in sematic ui modals
*/

class EnhancedModal extends Component {
	
	onOpen() {
		this.previousBodyClass = this.props.mountNode.className;
	}
	
	onUnmount() {
		this.props.mountNode.className = this.previousBodyClass;
	}
	
	render() {
		const { onOpen, onUnmount, ...other } = this.props;
		
		return (
			<Modal
				{ ...other }
				onOpen={ () => {
					if ( onOpen ) onOpen();
					this.onOpen();
				} }
				onUnmount={ () => {
					if ( onUnmount ) onUnmount();
					this.onUnmount();
				} }
			/>
		);
	}
}

EnhancedModal.defaultProps = {
	mountNode: document.body,
	onOpen: null,
	onUnmount: null
}

export default EnhancedModal;