import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Header, Segment, Item, Icon, Dimmer, Loader } from 'semantic-ui-react';

import AlertModal from './alert-modal';
import RecordShow from './record-show';

/*
	props
	metaType: meta data type (correlates with table names)
	header: header name
	headerIcon: header icon
*/

class MetaDataList extends Component {
	
	render() {
		return (
			<div>
				<Segment secondary attached="top">
					<Header as='h4'>
						<Icon name={ this.props.headerIcon } color='grey' />
						<Header.Content>{ this.props.header }</Header.Content>
					</Header>
				</Segment>
				<Segment basic attached="bottom" className="scrollingDiv">
					{ this.renderRecordsContainer() }
				</Segment>
			</div>
		);
	}
	
	renderRecordsContainer() {
		if ( !this.props.metaData ) return (
			<Dimmer active inverted>
				<Loader inverted>Loading</Loader>
			</Dimmer>
		);
		return (
			<Item.Group divided link>
				{ this.renderRecords() }
			</Item.Group>
		);
	}
	
	renderRecords() {
		return (
			_.map( this.props.metaData, record => {
				const pictureUrl = ( typeof record.value.picture == 'string' ) ? record.value.picture : record.value.picture.data.url;
				
				return (
					<AlertModal
						header={ this.props.header }
						headerIcon={ this.props.headerIcon }
						content={ <RecordShow table={ this.props.metaType } recordID={ record.value.id } /> }
						key={ record.key }
					>
						<Item title={ record.value.name }>
							<Item.Image size='mini' src={ pictureUrl } className='leftImage' />
							<Item.Content>
								<Item.Header className='singleLineHidden'>{ ( record.value.name == '' ) ? 'N/A' : record.value.name }</Item.Header>
								<Item.Meta>{ record.name }</Item.Meta>
								<Item.Description>{ record.description }</Item.Description>
							</Item.Content>
						</Item>
					</AlertModal>
				);
			} )
		);
	}
}

function mapStateToProps( state, ownProps ) {
	return {
		metaData: ( ownProps.metaType in state.metaData ) ? state.metaData[ownProps.metaType] : null
	};
}

export default connect( mapStateToProps, null )( MetaDataList );