import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

import { fetchList, loadingList, clearList } from '../actions';
import TablePaginatedSimple from './table-paginated-simple';

/*
	props
	table: record's table name
	columnSet: [
		name,
		field,
		type,
		ifEmpty (optional)
	]
	orderField: field to order by
	searchField: field to search by
	searchValue: only results where search field equals
*/

class ListShow extends Component {
	
	constructor( props ) {
		super( props );
		
		this.page = 0;
		
		this.pageBackward = this.pageBackward.bind( this );
		this.pageForward = this.pageForward.bind( this );
	}
	
	componentDidMount() {
		this.fetchData();
	}
	
	componentWillUnmount() {
		this.props.clearList();
	}
	
	pageBackward() {
		this.page--;
		this.fetchData();
	}
	
	pageForward() {
		this.page++;
		this.fetchData();
	}
	
	fetchData() {
		this.props.loadingList();
		this.props.fetchList( this.props.table, this.props.orderField, this.props.searchField, this.props.searchValue, this.page );
	}
	
	render() {
		const { list } = this.props;
		
		if ( !list ) {
			return (
				<Dimmer active inverted>
					<Loader inverted>Loading List</Loader>
				</Dimmer>
			);
		}

		return (
			<TablePaginatedSimple
				columns={ this.props.columnSet }
				rows={ list.data }
				page={ this.page + 1 }
				pageBackwardCallback={ this.pageBackward }
				pageForwardCallback={ this.pageForward }
				loading={ list.loading }
			/>
		);
	}
}

function mapStateToProps( state ) {
	return {
		list: state.selectedList,
	};
}

export default connect( mapStateToProps, { fetchList, loadingList, clearList } )( ListShow );