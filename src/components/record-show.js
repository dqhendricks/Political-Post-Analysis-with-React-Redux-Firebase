import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Header, Icon, Dimmer, Loader, Grid, Image, Message } from 'semantic-ui-react';
import PieChart from 'react-svg-piechart';
import { Sparklines, SparklinesLine } from 'react-sparklines';

import { fetchRecord, clearRecord } from '../actions';
import fieldData from '../modules/field-data';

/*
	props
	table: record's table names
	recordID: record's ID
*/

class RecordShow extends Component {
	
	componentDidMount() {
		this.props.fetchRecord( this.props.table, this.props.recordID );
		this.overTimeField = ( this.props.table == 'pages' ) ? 'posts_over_time' : 'comments_over_time';
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
	
	formatPieChartData( record ) {
		var pieChartData = [];
		if ( record.total_love_reactions != '0' ) pieChartData.push( { label: 'LOVE', value: parseInt( record.total_love_reactions ), color: '#f49ac1' } );
		if ( record.total_wow_reactions != '0' ) pieChartData.push( { label: 'WOW', value: parseInt( record.total_wow_reactions ), color: '#7da7d9' } );
		if ( record.total_haha_reactions != '0' ) pieChartData.push( { label: 'HAHA', value: parseInt( record.total_haha_reactions ), color: '#82ca9c' } );
		if ( record.total_sad_reactions != '0' ) pieChartData.push( { label: 'SAD', value: parseInt( record.total_sad_reactions ), color: '#fff799' } );
		if ( record.total_angry_reactions != '0' ) pieChartData.push( { label: 'ANGRY', value: parseInt( record.total_angry_reactions ), color: '#f68e56' } );
		return pieChartData;
	}
	
	formatOverTimeData( record ) {
		const overTimeKeys = Object.keys( record[this.overTimeField] ).sort();
		var overTimeValues = []; 
		overTimeKeys.forEach( ( key ) => {
			overTimeValues.push( record[this.overTimeField][key] );
		} );
		return overTimeValues;
	}
	
	render() {
		const { record } = this.props;
		
		if ( !record ) {
			return (
				<Dimmer active inverted>
					<Loader inverted>Loading Page</Loader>
				</Dimmer>
			);
		}
		
		const bodyData = this.formatData();
		const pictureUrl = ( typeof record.picture == 'string' ) ? record.picture : record.picture.data.url;
		const pieChartData = this.formatPieChartData( record );
		const overTimeValues = this.formatOverTimeData( record );
		
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
							<Header.Content>Facebook Page</Header.Content>
						</Header>
						<a href={ record.link } target='_blank'>{ record.link }</a>
					</Grid.Column>
					<Grid.Column title={ 'Pink: LOVE\nBlue: WOW\nGreen: HAHA\nYellow: SAD\nOrange: ANGRY' }>
						<Header sub>Reaction Distribution</Header>
						<div style={ { maxWidth: '160px', margin: '0 auto' } }>
							<PieChart data={ pieChartData } />
						</div>
					</Grid.Column>
					<Grid.Column title='Number of posts made each hour between 00 and 23 universal time.'>
						<Header sub>Posts Over Time</Header>
						<Sparklines data={ overTimeValues } color='blue'>
							<SparklinesLine color="blue" />
						</Sparklines>
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
				
				const fieldValue = ( columnData.type == 'number' ) ? numberFormat.format( columnData.value ) : columnData.value;
				
				return(
					<Grid.Column title={ columnData.description } key={ index }>
						<Header sub>
							<Icon name={ columnData.icon } color='grey' />
							<Header.Content>{ columnData.name }</Header.Content>
						</Header>
						{ ( fieldValue ) ? fieldValue : 'N/A' }
					</Grid.Column>
				);
			} )
		);
	}
}

function mapStateToProps( state ) {
	return {
		record: state.selectedRecord,
	};
}

export default connect( mapStateToProps, { fetchRecord, clearRecord } )( RecordShow );