import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Header, Icon, Dimmer, Loader, Grid, Image, Message } from 'semantic-ui-react';

import { fetchRecord, clearRecord } from '../actions';
import fieldMetaData from '../modules/field-data';
import tableMetaData from '../modules/table-data';
import ReactionsPieChart from './reactions-pie-chart';
import OverTimeSparkline from './over-time-sparkline';
import ListShow from './list-show';
import AlertModal from './alert-modal';

/*
	props
	table: record's table name
	recordID: record's ID
*/

class RecordShow extends Component {
	
	componentDidMount() {
		this.props.fetchRecord( this.props.table, this.props.recordID );
	}
	
	componentWillUnmount() {
		this.props.clearRecord();
	}
	
	formatData() {
		const totalColumns = 3;
		var columnIndex = 0;
		var bodyData = [];
		var rowData;
		
		_.each( _.omit( fieldMetaData, [ 'id', 'name', 'link', 'picture' ] ), ( fieldData, field ) => {
			if ( this.props.table in fieldData.tables ) {
				if ( columnIndex == 0 ) rowData = [];
				rowData.push( { field, value: this.props.record[field] } );
				columnIndex++;
				if ( columnIndex == totalColumns ) {
					columnIndex = 0;
					bodyData.push( rowData );
				}
			}
		} );
		if ( columnIndex ) {
			for ( var i = columnIndex; i < totalColumns; i++ ) {
				rowData.push( null );
			}
			bodyData.push( rowData );
		}
		return bodyData;
	}
	
	render() {
		const { record } = this.props;
		
		if ( !record ) {
			return (
				<Dimmer active inverted>
					<Loader inverted>Loading Record</Loader>
				</Dimmer>
			);
		}
		
		const bodyData = this.formatData();
		
		return (
			<Grid columns='equal' divided>
				<Grid.Row>
					<Grid.Column className='singleLineHidden'>
						<Header image title={ record.name } className='singleLineHidden'>
							<Image src={ record.picture } shape='rounded' size='mini' />
							<Header.Content>{ record.name }</Header.Content>
						</Header>
						<Header sub>
							<Icon name='hashtag' color='grey' />
							<Header.Content>Facebook ID</Header.Content>
						</Header>
						{ this.props.record.id }
						<Header sub>
							<Icon name='facebook f' color='grey' />
							<Header.Content>Facebook Link</Header.Content>
						</Header>
						<a href={ record[tableMetaData[this.props.table].urlField] } target='_blank'>{ record[tableMetaData[this.props.table].urlField] }</a>
					</Grid.Column>
					<Grid.Column title={ 'Pink: LOVE\nBlue: WOW\nGreen: HAHA\nYellow: SAD\nOrange: ANGRY' }>
						<Header sub>Reaction Distribution</Header>
						<ReactionsPieChart record={ record } />
					</Grid.Column>
					<Grid.Column title={ `Number of ${ tableMetaData[this.props.table].overTimeLabel } made each hour between 00 and 23 universal time.` }>
						<Header sub>{ `${ tableMetaData[this.props.table].overTimeLabel } Over Time` }</Header>
						<OverTimeSparkline data={ record[tableMetaData[this.props.table].overTimeField] } />
					</Grid.Column>
				</Grid.Row>
				{ this.renderBodyRows( bodyData ) }
				<Grid.Row>
					<Grid.Column columns={ 1 }>
						<Message>Mouse over each field for more information.</Message>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
	
	renderBodyRows( bodyData ) {
		return (
			bodyData.map( ( rowData, index ) => {
				return <Grid.Row key={ index }>{ this.renderColumns( rowData ) }</Grid.Row>
			} )
		);
	}
	
	renderColumns( rowData ) {
		const numberFormat = new Intl.NumberFormat();
		
		return (
			rowData.map( ( columnData, index ) => {
				// for empty column padding
				if ( !columnData ) return <Grid.Column key={ index }></Grid.Column>
				
				const fieldData = fieldMetaData[columnData.field];
				
				var fieldValue = ( fieldData.type == 'number' ) ? numberFormat.format( columnData.value ) : columnData.value;
				fieldValue = ( fieldValue ) ? fieldValue : 'N/A';
				fieldValue = this.addListModals( columnData.field, fieldValue );
				
				return(
					<Grid.Column title={ fieldData.description } key={ index }>
						<Header sub>
							<Icon name={ fieldData.icon } color='grey' />
							<Header.Content>{ fieldData.name }</Header.Content>
						</Header>
						{ fieldValue }
					</Grid.Column>
				);
			} )
		);
	}
	
	addListModals( field, fieldValue ) {
		if ( 'openList' in fieldMetaData[field] ) {
			const { openList } = fieldMetaData[field];
			
			return (
				<AlertModal
					header={ tableMetaData[openList].name }
					headerIcon={ tableMetaData[openList].icon }
					content={ <ListShow table={ openList } searchField={ tableMetaData[this.props.table].searchByField } searchValue={ this.props.recordID } /> }
				>
					<a style={ { cursor: 'pointer' } }>
						{ fieldValue }
					</a>	
				</AlertModal>
			);
		} else {
			return fieldValue;
		}
	}
}

function mapStateToProps( state ) {
	return {
		record: state.selectedRecord,
	};
}

export default connect( mapStateToProps, { fetchRecord, clearRecord } )( RecordShow );