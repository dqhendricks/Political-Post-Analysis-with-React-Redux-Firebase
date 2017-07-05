import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Header, Segment, Item, Icon, Dimmer, Loader } from 'semantic-ui-react';

class MetaDataList extends Component {
	
	renderRecords() {
		if ( !this.props.metaData ) return (
			<Dimmer active inverted>
				<Loader inverted>Loading</Loader>
			</Dimmer>
		);
		return (
			<Item.Group divided link>
				{
					_.map( this.props.metaData, record => {
						const pictureUrl = ( typeof record.value.picture == 'string' ) ? record.value.picture : record.value.picture.data.url;
						return (
							<Item key={ record.key }>
								<Item.Image size='mini' src={ pictureUrl } />
								<Item.Content>
									<Item.Header>{ record.value.name }</Item.Header>
									<Item.Meta>{ record.name }</Item.Meta>
									<Item.Description>{ record.description }</Item.Description>
								</Item.Content>
							</Item>
						);
					} )
				}
			</Item.Group>
		);
	}
	
	render() {
		return (
			<div>
				<Segment secondary attached="top">
					<Header as='h4'>
						<Icon name={ this.props.dataIcon } color='grey' />
						<Header.Content>{ this.props.dataName }</Header.Content>
					</Header>
				</Segment>
				<Segment basic attached="bottom" className="scrollingDiv">
					{ this.renderRecords() }
				</Segment>
			</div>
		);
	}
}

function mapStateToProps( state, ownProps ) {
	return {
		metaData: ( ownProps.dataRecordType in state.metaData ) ? state.metaData[ownProps.dataRecordType] : null
	};
}

export default connect( mapStateToProps, null )( MetaDataList );