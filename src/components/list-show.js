import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

import { fetchList, clearList } from '../actions';
import fieldData from '../modules/field-data';
import TablePaginatedSimple from './table-paginated-simple';

/*
	props
	table: record's table name
	searchField: field to search by
	searchValue: only results where search field equals
*/

class ListShow extends Component {
	
	constructor( props ) {
		super( props );
		
		this.page = 0;
		this.tableMetaData = {
			posts: {
				columnSet: [
					{ name: 'Post', field: 'message', type: 'string' },
					{ name: 'Link', field: 'permalink_url', type: 'string' },
					{ name: 'Total Likes', field: 'total_like_reactions', type: 'number' }
				],
				orderField: 'total_like_reactions'
			},
			comments: {
				columnSet: [
					{ name: 'Comment', field: 'message', type: 'string' },
					{ name: 'Link', field: 'permalink_url', type: 'string' },
					{ name: 'Total Likes', field: 'like_count', type: 'number' }
				],
				orderField: 'like_count'
			}
		};
		
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
		this.props.fetchList( this.props.table, this.tableMetaData[this.props.table].orderField, this.props.searchField, this.props.searchValue, this.page );
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
				columns={ this.tableMetaData[this.props.table].columnSet }
				rows={ list }
				page={ this.page + 1 }
				pageBackwardCallback={ this.pageBackward }
				pageForwardCallback={ this.pageForward }
			/>
		);
	}
}

function mapStateToProps( state ) {
	return {
		list: state.selectedList,
	};
}

export default connect( mapStateToProps, { fetchList, clearList } )( ListShow );