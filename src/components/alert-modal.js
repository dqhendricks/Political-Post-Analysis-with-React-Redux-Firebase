import React, { Component } from 'react';
import { Header, Icon, Modal } from 'semantic-ui-react'

/*
	props
	header: header text for dialog
	headerIcon: icon name for dialog header (optional)
	content: modal content
	size: modal size (optional)
	trigger/children: element that should be clicked to open the modal
*/

class AlertModal extends Component {
	
	constructor( props ) {
		super( props );
		this.trigger = ( ( 'trigger' in this.props ) ? this.props.trigger : this.props.children );
	}
	
	render() {
		return (
			<Modal
				trigger={ this.trigger }
				size={ ( 'size' in this.props ) ? this.props.size : 'large' }
				closeIcon='close'
				header={ <Header icon={ this.props.headerIcon } content={ this.props.header } /> }
				content={ <div className='content'>{ this.props.content }</div> }
				actions={ [
					{
						key: 'okay',
						content: 'Okay',
						triggerClose: true
					},
				] }
			/>
		);
	}
}

AlertModal.defaultProps = {
	headerIcon: 'exclamation circle'
}

export default AlertModal;