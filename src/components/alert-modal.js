import React, { Component } from 'react';
import { Header, Icon, Modal } from 'semantic-ui-react'

import EnhancedModal from './enhanced-modal';

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
			<EnhancedModal
				trigger={ this.trigger }
				size={ this.props.size }
				closeIcon='close'
				header={
					<Header>
						<Icon name={ this.props.headerIcon }  color='grey' />
						<Header.Content>{ this.props.header }</Header.Content>
					</Header>
				}
				content={ <div className='content'>{ this.props.content }</div> }
				actions={ [
					{
						key: 'okay',
						content: <span><Icon name='checkmark' color='green' /> Okay</span>,
						triggerClose: true
					},
				] }
			/>
		);
	}
}

AlertModal.defaultProps = {
	headerIcon: 'exclamation circle',
	size: 'large'
}

export default AlertModal;