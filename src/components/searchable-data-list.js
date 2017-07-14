import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Header, Segment, Table, Image, Icon, Button, Dimmer, Loader } from 'semantic-ui-react';

import { searchChange } from '../actions';
import fieldData from '../modules/field-data';
import FormModal from './form-modal';
import SearchForm from './search-form';
import SortForm from './sort-form';
import PageMenuSimple from './page-menu-simple';
import AlertModal from './alert-modal';
import RecordShow from './record-show';

/*
	props
	table: table to search
	header: header name
	headerIcon: header icon
*/

class SearchableDataList extends Component {
	
	constructor( props ) {
		super( props );
		this.pageBackward = this.pageBackward.bind( this );
		this.pageForward = this.pageForward.bind( this );
		this.searchSubmit = this.searchSubmit.bind( this );
		this.sortSubmit = this.sortSubmit.bind( this );
	}
	
	componentDidMount() {
		this.searchChange();
	}
	
	searchChange( changes = {} ) {
		// fields not included in the search changes object will default to their current state
		const parameters = Object.assign( {
			terms: this.props.search.terms,
			orderBy: this.props.search.orderBy,
			orderDirection: this.props.search.orderDirection,
			page: this.props.search.page
		}, changes );
		this.props.searchChange(
			this.props.table,
			parameters.terms,
			parameters.orderBy,
			parameters.orderDirection,
			parameters.page
		);
	}
	
	pageBackward() {
		this.searchChange( { page: this.props.search.page - 1 } );
	}
	
	pageForward() {
		this.searchChange( { page: this.props.search.page + 1 } );
	}
	
	searchSubmit( values ) {
		this.searchChange( values );
	}
	
	sortSubmit( values ) {
		this.searchChange( { orderBy: values.orderBy, orderDirection: values.orderDirection } );
	}
	
	render() {
		return (
			<div>
				<Segment attached="top" secondary clearing>
					<Header as='h4' floated='left'>
						<Icon name={ this.props.headerIcon } color='grey' size='big' />
						<Header.Content>{ this.props.header }</Header.Content>
					</Header>
					{ this.renderButtons() }
				</Segment>
				{ this.renderTable() }
			</div>
		);
	}
	
	renderButtons() {
		return (
			<div>
				<FormModal
					handleSubmit={ this.sortSubmit }
					size='small'
					formName='sortForm'
					header='Sort'
					headerIcon='sort'
					content={ <SortForm table={ this.props.table } /> }
					trigger={ <Button icon floated='right' size='mini' title='Sort and Display' ><Icon name='sort' /></Button> }
				/>
				<FormModal
					handleSubmit={ this.searchSubmit }
					formName='searchForm'
					header='Search'
					headerIcon='search'
					content={ <SearchForm table={ this.props.table } /> }
					trigger={ <Button icon floated='right' size='mini' title='Search'><Icon name='search' /></Button> }
				/>
			</div>
		);
	}
	
	renderTable() {
		if ( !this.props.search.data ) return (
			<Segment attached='bottom' className='loaderContainer'>
				<Dimmer active inverted>
					<Loader inverted>Loading</Loader>
				</Dimmer>
			</Segment>
		);
		return (
			<Table celled selectable unstackable attached='bottom' className='fixedTable'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell className='tableLeftCells' title='Name'>
							<div style={ { overflow: 'hidden' } }>Name</div>
						</Table.HeaderCell>
						<Table.HeaderCell title={ fieldData[this.props.search.orderBy].name }>
							<div style={ { overflow: 'hidden' } }>{ fieldData[this.props.search.orderBy].name }</div>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{ this.renderRecords() }
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.HeaderCell colSpan='2'>
							<PageMenuSimple
								page={ this.props.search.page + 1 }
								pageBackwardCallback={ this.pageBackward }
								pageForwardCallback={ this.pageForward }
							/>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
			</Table>
		);
	}
	
	renderRecords() {
		const numberFormat = new Intl.NumberFormat();
		const textAlign = ( fieldData[this.props.search.orderBy].type != 'string' ) ? 'right' : 'left';
		
		if ( _.size( this.props.search.data ) == 0 ) {
			const noResultsMessage = ( this.props.search.page == 0 ) ? 'No results found.' : 'No more results found.'
			return (
				<Table.Row>
					<Table.Cell colSpan='2'>
						{ noResultsMessage }
					</Table.Cell>
				</Table.Row>
			);
		}
		return (
			_.map( this.props.search.data, record => {
				const pictureUrl = ( typeof record.picture == 'string' ) ? record.picture : record.picture.data.url;
				const orderByFieldValue = ( fieldData[this.props.search.orderBy].type == 'number' ) ? numberFormat.format( record[this.props.search.orderBy] ) : record[this.props.search.orderBy];
				
				return (
					<AlertModal
						header={ this.props.header }
						headerIcon={ this.props.headerIcon }
						content={ <RecordShow table={ this.props.table } recordID={ record.id } /> }
						key={ record.id }
					>
						<Table.Row title={ record.name } style={ { cursor: 'pointer' } }>
							<Table.Cell className='tableLeftCells'>
								<div className='tableCellInnerContainer noWrap'>
									<Header as='h5' image>
										<Image src={ pictureUrl } shape='rounded' size='mini' />
										<Header.Content>{ ( record.name == '' ) ? 'N/A' : record.name }</Header.Content>
									</Header>
								</div>
							</Table.Cell>
							<Table.Cell textAlign={ textAlign }>
								<div className='tableCellInnerContainer noWrap'>
									{ orderByFieldValue }
								</div>
							</Table.Cell>
						</Table.Row>
					</AlertModal>
				);
			} )
		);
	}
}

function mapStateToProps( state, ownProps ) {
	// uses table name to fetch correct state property
	const stateProperty = `${ ownProps.table }Search`;
	return {
		search: state[stateProperty]
	};
}

export default connect( mapStateToProps, { searchChange } )( SearchableDataList );