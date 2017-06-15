import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'; // allows links that don't reload page
import _ from 'lodash';
import { fetchPages } from '../actions';

class PageIndex extends Component {
	componentDidMount() {
		this.props.fetchPages();
	}
	
	renderPages() {
		// lodash map() will take associative object, apply function, return array for jsx
		return _.map( this.props.pages, page => {
			return (
				<li key={ page.id }>
					<Link to={ `/pages/${ page.id }` }>{ page.title }</Link>
				</li>
			);
		} );
	}
	
	render() {
		return (
			<div>
				Test
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return { pages: state.pages };
}

export default connect( mapStateToProps, { fetchPages } )( PageIndex );