import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Header, Segment, Item, Icon, Dimmer, Loader } from 'semantic-ui-react';

import AlertModal from './alert-modal';
import RecordShow from './record-show';
import tableMetaData from '../modules/table-data';

/*
	props
	table: table (correlates with meta data types)
*/

class MetaDataList extends Component {
	
	render() {
		return (
			<div>
				<Segment secondary attached="top">
					<Header as='h4'>
						<Icon name={ tableMetaData[this.props.table].icon } color='grey' />
						<Header.Content>{ tableMetaData[this.props.table].name }</Header.Content>
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
				
				return (
					<AlertModal
						header={ tableMetaData[this.props.table].name }
						headerIcon={ tableMetaData[this.props.table].icon }
						content={ <RecordShow table={ this.props.table } recordID={ record.value.id } /> }
						key={ record.key }
					>
						<Item title={ record.value.name }>
							<Item.Image size='mini' src={ record.value.picture } className='leftImage' />
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
		metaData: ( ownProps.table in state.metaData ) ? state.metaData[ownProps.table] : null
	};
}

export default connect( mapStateToProps, null )( MetaDataList );