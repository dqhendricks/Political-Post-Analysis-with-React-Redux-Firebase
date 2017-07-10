import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Modal } from 'semantic-ui-react'
import { submit } from 'redux-form';

/*
	This element can be reused to display any redux-form content in a modal. The element handles all opening and closing of the modal, and waits for successful submit (after client validation passes) before closing the modal. 

	props
	formName: name of form. used for remotely calling submit.
	header: header text for dialog
	headerIcon: icon name for dialog header (optional)
	content: redux-form element using formName
	size: modal size (optional)
	closeOnSubmit: automatically closes modal on submit (defaults to true). set to false to use callback in handleSubmit argument.
	handleSubmit: submit callback. values as first argument. callback to close modal as second argument.
	trigger/children: React element that should be clicked to open the modal
*/

class FormModal extends Component {
	
	constructor( props ) {
		super( props );
		this.handleOkay = this.handleOkay.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleOpen = this.handleOpen.bind( this );
		this.handleClose = this.handleClose.bind( this );
		this.modalOpen = false;
		this.content = React.cloneElement(
			this.props.content, 
			{ onSubmit: this.handleSubmit }
		);
		this.trigger = React.cloneElement(
			( ( 'trigger' in this.props ) ? this.props.trigger : this.props.children ), 
			{ onClick: this.handleOpen }
		);
		this.state = {
			modalOpen: false
		}
	}
	
	handleOpen() {
		this.setState( { modalOpen: true } );
	}
	
	handleClose() {
		this.setState( { modalOpen: false } );
	}
	
	handleOkay() {
		// remote form submittal via dispatching submit action
		this.props.dispatch( submit( this.props.formName ) );
	}
	
	handleSubmit( values ) {
		this.props.handleSubmit( values, this.handleClose );
		// auto close modal if closeOnSubmit not false
		if ( !( 'closeOnSubmit' in this.props ) || this.props.closeOnSubmit ) this.handleClose();
	}
	
	render() {
		return (
			<Modal
				open={ this.state.modalOpen }
				trigger={ this.trigger }
				onClose={ this.handleClose }
				size={ ( 'size' in this.props ) ? this.props.size : 'large' }
				closeIcon='close'
				header={ <Header icon={ this.props.headerIcon } content={ this.props.header } /> }
				content={ <div className='content'>{ this.content }</div> }
				actions={ [
					{
						key: 'cancel',
						content: <span><Icon name='remove' color='red' /> Cancel</span>,
						onClick: this.handleClose
					},
					{
						key: 'okay',
						content: <span><Icon name='checkmark' color='green' /> Okay</span>,
						onClick: this.handleOkay
					},
				] }
			/>
		);
	}
}

FormModal.defaultProps = {
	headerIcon: 'edit'
}

export default connect()( FormModal ); // connect needed to map dispatch() to props