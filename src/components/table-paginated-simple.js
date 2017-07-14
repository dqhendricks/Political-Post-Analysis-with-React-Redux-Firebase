import React, { Component } from 'react';
import _ from 'lodash';
import { Table, Dimmer, Loader } from 'semantic-ui-react';

import PageMenuSimple from './page-menu-simple';

/*
	props
	columns: [
		{ name, field, type( 'number', 'string', 'time' ) }
	]
	rows: records object
	page: int
	pageForwardCallback: callback
	pageBackwardCallback: callback
	loading: boolean for whether to show dimmer
*/

class TablePaginatedSimple extends Component {
	
	render() {
		return (
			<Dimmer.Dimmable dimmed={ this.props.loading }>
				<Dimmer active={ this.props.loading } inverted>
					<Loader inverted>Loading</Loader>
				</Dimmer>
				<Table celled unstackable className='fixedTable'>
					<Table.Header>
						<Table.Row>
							{ this.renderColumnHeaders() }
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{ this.renderRecords() }
					</Table.Body>
					<Table.Footer>
						<Table.Row>
							<Table.HeaderCell colSpan={ this.props.columns.length }>
								<PageMenuSimple
									page={ this.props.page }
									pageBackwardCallback={ this.props.pageBackwardCallback }
									pageForwardCallback={ this.props.pageForwardCallback }
								/>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
				</Table>
			</Dimmer.Dimmable>
		);
	}
	
	renderColumnHeaders() {
		return this.props.columns.map( column => {
			return (
				<Table.HeaderCell title={ column.name } key={ column.name }>
					<div style={ { overflow: 'hidden' } }>{ column.name }</div>
				</Table.HeaderCell>
			);
		} );
	}
	
	renderRecords() {
		
		if ( _.size( this.props.rows ) == 0 ) {
			const noResultsMessage = ( this.props.page == 0 ) ? 'No results found.' : 'No more results found.'
			return (
				<Table.Row>
					<Table.Cell colSpan='2'>
						{ noResultsMessage }
					</Table.Cell>
				</Table.Row>
			);
		}
		
		return (
			_.map( this.props.rows, record => {
				return (
					<Table.Row key={ record.id }>
						{ this.renderRowCells( record ) }
					</Table.Row>
				);
			} )
		);
	}
	
	renderRowCells( record ) {
		const numberFormat = new Intl.NumberFormat();
		
		return this.props.columns.map( column => {
			const textAlign = ( column.type != 'string' ) ? 'right' : 'left';
			const fieldValue = ( column.type == 'number' ) ? numberFormat.format( record[column.field] ) : record[column.field];
			
			return (
				<Table.Cell textAlign={ textAlign } key={ column.name } title={ fieldValue }>
					<div className='tableCellInnerContainer noWrap'>
						{ this.addLinks( fieldValue ) }
					</div>
				</Table.Cell>
			);
		} );
	}
	
	addLinks( value ) {
		if ( value.substr( 0, 4 ).toLowerCase() == 'http' ) {
			return <a href={ value } target='_blank'>{ value }</a>
		} else {
			return value;
		}
	}
}

export default TablePaginatedSimple;