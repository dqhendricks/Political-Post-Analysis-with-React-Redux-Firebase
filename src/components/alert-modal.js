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
	
	render() {
		const trigger = ( 'trigger' in this.props ) ? this.props.trigger : this.props.children;
		
		return (
			<EnhancedModal
				trigger={ trigger }
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