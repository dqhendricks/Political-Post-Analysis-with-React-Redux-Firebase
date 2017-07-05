import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Segment, Item, Table, Image, Icon, Menu, Button, Grid } from 'semantic-ui-react';

import { fetchMetaData } from '../actions';
import MetaDataList from './meta-data-list';

class App extends Component {
	componentDidMount() {
		this.props.fetchMetaData();
	}
	
	extractDateFromTime( time ) {
		return time.substr( 0, 10 );
	}
	
	renderMetaDataLists() {
		const metaDataLists = [
			{ recordType: 'page', name: 'Pages', icon: 'feed' },
			{ recordType: 'post', name: 'Posts', icon: 'newspaper' },
			{ recordType: 'user', name: 'Users', icon: 'users' }
		];
		return metaDataLists.map( list => {
			return (
				<Grid.Column>
					<MetaDataList
						dataRecordType={ list.recordType }
						dataName={ list.name }
						dataIcon={ list.feed }
					/>
				</Grid.Column>
			);
		} );
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
							<Grid.Column>
								<Segment attached="top" secondary clearing>
									<Header as='h4' floated='left'>
										<Icon name='feed' color='grey' size='big' />
										<Header.Content>Pages</Header.Content>
									</Header>
									<Button icon floated='right' size="mini">
										<Icon name='sort' />
									</Button>
									<Button icon floated='right' size="mini">
										<Icon name='search' />
									</Button>
								</Segment>
								<Table celled selectable unstackable attached="bottom">
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>Name</Table.HeaderCell>
											<Table.HeaderCell>Total Posts</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										<Table.Row>
											<Table.Cell>
												<Header as='h5' image>
													<Image src='/assets/images/avatar/small/lena.png' shape='rounded' size='mini' />
													<Header.Content>Page Name</Header.Content>
												</Header>
											</Table.Cell>
											<Table.Cell>43</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>
												<Header as='h5' image>
													<Image src='/assets/images/avatar/small/lena.png' shape='rounded' size='mini' />
													<Header.Content>Page Name</Header.Content>
												</Header>
											</Table.Cell>
											<Table.Cell>43</Table.Cell>
										</Table.Row>
									</Table.Body>
									<Table.Footer>
										<Table.Row>
											<Table.HeaderCell colSpan='2'>
												<Menu floated='right' pagination>
													<Menu.Item as='a' icon>
														<Icon name='left chevron' />
													</Menu.Item>
													<Menu.Item as='a' active={true}>1</Menu.Item>
													<Menu.Item as='a' icon>
														<Icon name='right chevron' />
													</Menu.Item>
												</Menu>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Footer>
								</Table>
							</Grid.Column>
							<Grid.Column>
								<Segment attached="top" secondary clearing>
									<Header as='h4' floated='left'>
										<Icon name='newspaper' color='grey' size='big' />
										<Header.Content>Posts</Header.Content>
									</Header>
									<Button icon floated='right' size="mini">
										<Icon name='sort' />
									</Button>
									<Button icon floated='right' size="mini">
										<Icon name='search' />
									</Button>
								</Segment>
								<Table celled selectable unstackable attached="bottom">
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>Name</Table.HeaderCell>
											<Table.HeaderCell>Total Comments</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										<Table.Row>
											<Table.Cell>
												<Header as='h5' image>
													<Image src='/assets/images/avatar/small/lena.png' shape='rounded' size='mini' />
													<Header.Content>Post Name</Header.Content>
												</Header>
											</Table.Cell>
											<Table.Cell>43</Table.Cell>
										</Table.Row>
									</Table.Body>
									<Table.Footer>
										<Table.Row>
											<Table.HeaderCell colSpan='2'>
												<Menu floated='right' pagination>
													<Menu.Item as='a' icon>
														<Icon name='left chevron' />
													</Menu.Item>
													<Menu.Item as='a' active={true}>1</Menu.Item>
													<Menu.Item as='a' icon>
														<Icon name='right chevron' />
													</Menu.Item>
												</Menu>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Footer>
								</Table>
							</Grid.Column>
							<Grid.Column>
								<Segment attached="top" secondary clearing>
									<Header as='h4' floated='left'>
										<Icon name='users' color='grey' size='big' />
										<Header.Content>Users</Header.Content>
									</Header>
									<Button icon floated='right' size="mini">
										<Icon name='sort' />
									</Button>
									<Button icon floated='right' size="mini">
										<Icon name='search' />
									</Button>
								</Segment>
								<Table celled selectable unstackable attached="bottom">
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>Name</Table.HeaderCell>
											<Table.HeaderCell>Total Comments</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										<Table.Row>
											<Table.Cell>
												<Header as='h5' image>
													<Image src='/assets/images/avatar/small/lena.png' shape='rounded' size='mini' />
													<Header.Content>User Name</Header.Content>
												</Header>
											</Table.Cell>
											<Table.Cell>43</Table.Cell>
										</Table.Row>
									</Table.Body>
									<Table.Footer>
										<Table.Row>
											<Table.HeaderCell colSpan='2'>
												<Menu floated='right' pagination>
													<Menu.Item as='a' icon secondary>
														<Icon name='left chevron' />
													</Menu.Item>
													<Menu.Item as='a' active={true}>1</Menu.Item>
													<Menu.Item as='a' icon>
														<Icon name='right chevron' />
													</Menu.Item>
												</Menu>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Footer>
								</Table>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
				<Container text textAlign='center'>
					Created by Dustin Hendricks
				</Container>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		earliestPostTime: ( 'system' in state.metaData ) ? state.metaData['system']['earliestPostTime'].value : 'n/a',
		latestPostTime: ( 'system' in state.metaData ) ? state.metaData['system']['latestPostTime'].value : 'n/a'
	};
}

export default connect( mapStateToProps, { fetchMetaData } )( App );