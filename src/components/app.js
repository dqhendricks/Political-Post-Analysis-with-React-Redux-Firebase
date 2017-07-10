import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Segment, Icon, Grid } from 'semantic-ui-react';

import { fetchMetaData } from '../actions';
import MetaDataList from './meta-data-list';
import SearchableDataList from './searchable-data-list';

const dataLists = [
	{ table: 'pages', name: 'Pages', icon: 'feed' },
	{ table: 'posts', name: 'Posts', icon: 'newspaper' },
	{ table: 'users', name: 'Users', icon: 'users' }
];

class App extends Component {
	
	componentDidMount() {
		this.props.fetchMetaData();
	}
	
	extractDateFromTime( time ) {
		return time.substr( 0, 10 );
	}
	
	render() {
		const earliestPostDate = this.extractDateFromTime( this.props.earliestPostTime );
		const latestPostDate = this.extractDateFromTime( this.props.latestPostTime );
		return (
			<div className="spacingDiv">
				<Container text>
					<Header as='h2' textAlign='center'>
						Facebook Data Analysis
						<Header.Subheader>Data collected from the public pages of Breitbart, CNN, Fox News, and The New York Times.</Header.Subheader>
					</Header>
				</Container>
				<Segment raised>
					<Header as='h3'>
						<Icon name='idea' color='grey' />
						<Header.Content>
							Conclusions
							<Header.Subheader>Conclusions made based on data collected from posts published between { earliestPostDate } and { latestPostDate }.</Header.Subheader>
						</Header.Content>
					</Header>
					<Grid stackable>
						<Grid.Row columns={3}>
							{ this.renderMetaDataLists() }
						</Grid.Row>
					</Grid>
				</Segment>
				<Segment raised>
					<Header as='h3'>
						<Icon name='lab' color='grey' />
						<Header.Content>
							Custom Research
							<Header.Subheader>Perform custom searches and sorting on data collected from posts published between { earliestPostDate } and { latestPostDate }.</Header.Subheader>
						</Header.Content>
					</Header>
					<Grid stackable>
						<Grid.Row columns={3}>
							{ this.renderSearchableDataLists() }
						</Grid.Row>
					</Grid>
				</Segment>
				<Container text textAlign='center'>
					Created by <a href='https://github.com/dqhendricks' target='_blank'>Dustin Hendricks</a>
				</Container>
			</div>
		);
	}
	
	renderMetaDataLists() {
		return dataLists.map( list => {
			return (
				<Grid.Column key={ list.table }>
					<MetaDataList
						metaType={ list.table }
						header={ list.name }
						headerIcon={ list.icon }
					/>
				</Grid.Column>
			);
		} );
	}
	
	renderSearchableDataLists() {
		return dataLists.map( list => {
			return (
				<Grid.Column key={ list.table }>
					<SearchableDataList
						table={ list.table }
						header={ list.name }
						headerIcon={ list.icon }
					/>
				</Grid.Column>
			);
		} );
	}
}

function mapStateToProps( state ) {
	return {
		earliestPostTime: ( 'system' in state.metaData ) ? state.metaData['system']['earliestPostTime'].value : 'n/a',
		latestPostTime: ( 'system' in state.metaData ) ? state.metaData['system']['latestPostTime'].value : 'n/a'
	};
}

export default connect( mapStateToProps, { fetchMetaData } )( App );