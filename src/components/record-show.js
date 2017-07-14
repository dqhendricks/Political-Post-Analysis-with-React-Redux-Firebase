import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Header, Icon, Dimmer, Loader, Grid, Image, Message } from 'semantic-ui-react';

import { fetchRecord, clearRecord } from '../actions';
import fieldData from '../modules/field-data';
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
		switch ( this.props.table ) {
			case 'pages':
				this.overTimeField = 'posts_over_time';
				this.overTimeLabel = 'Posts';
				this.searchByField = 'page_id';
				break;
			case 'posts':
				this.overTimeField = 'comments_over_time';
				this.overTimeLabel = 'Comments';
				this.searchByField = 'post_id';
				break;
			case 'users':
				this.overTimeField = 'comments_over_time';
				this.overTimeLabel = 'Comments';
				this.searchByField = 'user_id';
				break;
		}
		this.fieldModalMetaData = {
			'Total Posts': 'posts',
			'Total Comments': 'comments'
		}
	}
	
	componentWillUnmount() {
		this.props.clearRecord();
	}
	
	formatData() {
		const totalColumns = 3;
		var columnIndex = 0;
		var bodyData = [];
		var rowData;
		
		_.each( _.omit( fieldData, [ 'id', 'name', 'link', 'picture' ] ), ( fieldMetaData, field ) => {
			if ( this.props.table in fieldMetaData.tables ) {
				if ( columnIndex == 0 ) rowData = [];
				rowData.push( Object.assign( fieldMetaData, { value: this.props.record[field] } ) );
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
		const pictureUrl = ( typeof record.picture == 'string' ) ? record.picture : record.picture.data.url;
		
		return (
			<Grid columns='equal' divided>
				<Grid.Row>
					<Grid.Column className='singleLineHidden'>
						<Header image title={ record.name } className='singleLineHidden'>
							<Image src={ pictureUrl } shape='rounded' size='mini' />
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
						<a href={ record.link } target='_blank'>{ record.link }</a>
					</Grid.Column>
					<Grid.Column title={ 'Pink: LOVE\nBlue: WOW\nGreen: HAHA\nYellow: SAD\nOrange: ANGRY' }>
						<Header sub>Reaction Distribution</Header>
						<ReactionsPieChart record={ record } />
					</Grid.Column>
					<Grid.Column title={ `Number of ${ this.overTimeLabel } made each hour between 00 and 23 universal time.` }>
						<Header sub>{ `${ this.overTimeLabel } Over Time` }</Header>
						<OverTimeSparkline data={ record[this.overTimeField] } />
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
				if ( !columnData ) return <Grid.Column key={ index }></Grid.Column>
				
				var fieldValue = ( columnData.type == 'number' ) ? numberFormat.format( columnData.value ) : columnData.value;
				fieldValue = ( fieldValue ) ? fieldValue : 'N/A';
				fieldValue = this.addModals( columnData.name, fieldValue );
				
				return(
					<Grid.Column title={ columnData.description } key={ index }>
						<Header sub>
							<Icon name={ columnData.icon } color='grey' />
							<Header.Content>{ columnData.name }</Header.Content>
						</Header>
						{ fieldValue }
					</Grid.Column>
				);
			} )
		);
	}
	
	addModals( columnName, fieldValue ) {
		if ( columnName in this.fieldModalMetaData ) {
			return (
				<AlertModal
					header='List'
					headerIcon='browser'
					content={ <ListShow table={ this.fieldModalMetaData[columnName] } searchField={ this.searchByField } searchValue={ this.props.recordID } /> }
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