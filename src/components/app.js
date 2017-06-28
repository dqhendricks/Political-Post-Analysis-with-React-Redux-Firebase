import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Segment, Item, Table, Image, Icon, Menu, Button, Grid } from 'semantic-ui-react';

class App extends Component {
	
	render() {
		return (
			<div className="spacingDiv">
				<Container text>
					<Header as='h2' textAlign='center'>
						Facebook Data Analysis
						<Header.Subheader>This app collects data about Facebook posts made by the pages for Breitbart, CNN, Fox News, and The New York Times, then attempts to derive conclusions from that data.</Header.Subheader>
					</Header>
				</Container>
				<Segment raised>
					<Header as='h3'>
						<Icon name='idea' color='grey' />
						<Header.Content>
							Conclusions
							<Header.Subheader>Conclusions made based on data collected from posts published between 2017-06-21 and 2017-06-28.</Header.Subheader>
						</Header.Content>
					</Header>
					<Grid>
						<Grid.Row columns={3}>
							<Grid.Column>
								<Segment secondary attached="top">
									<Header as='h4'>
										<Icon name='feed' color='grey' />
										<Header.Content>Pages</Header.Content>
									</Header>
								</Segment>
								<Segment basic attached="bottom" className="scrollingDiv">
									<Item.Group divided>
										<Item>
											<Item.Image size='tiny' src='/assets/images/wireframe/image.png' />
											<Item.Content>
												<Item.Header>Name + Link</Item.Header>
												<Item.Meta>Award Name</Item.Meta>
												<Item.Description>Award Description</Item.Description>
											</Item.Content>
										</Item>
									</Item.Group>
								</Segment>
							</Grid.Column>
							<Grid.Column>
								<Segment secondary attached="top">
									<Header as='h4'>
										<Icon name='newspaper' color='grey' />
										<Header.Content>Posts</Header.Content>
									</Header>
								</Segment>
								<Segment basic attached="bottom" className="scrollingDiv">
									<Item.Group divided>
										<Item>
											<Item.Image size='tiny' src='/assets/images/wireframe/image.png' />
											<Item.Content>
												<Item.Header>Name + Link</Item.Header>
												<Item.Meta>Award Name</Item.Meta>
												<Item.Description>Award Description</Item.Description>
											</Item.Content>
										</Item>
									</Item.Group>
								</Segment>
							</Grid.Column>
							<Grid.Column>
								<Segment secondary attached="top">
									<Header as='h4'>
										<Icon name='users' color='grey' />
										<Header.Content>Users</Header.Content>
									</Header>
								</Segment>
								<Segment basic attached="bottom" className="scrollingDiv">
									<Item.Group divided>
										<Item>
											<Item.Image size='tiny' src='/assets/images/wireframe/image.png' />
											<Item.Content>
												<Item.Header>Name + Link</Item.Header>
												<Item.Meta>Award Name</Item.Meta>
												<Item.Description>Award Description</Item.Description>
											</Item.Content>
										</Item>
									</Item.Group>
								</Segment>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
				<Segment raised>
					<Header as='h3'>
						<Icon name='lab' color='grey' />
						<Header.Content>
							Custom Research
							<Header.Subheader>Perform custom searches and sorting on data collected from posts published between 2017-06-21 and 2017-06-28.</Header.Subheader>
						</Header.Content>
					</Header>
					<Grid>
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
								<Table celled striped attached="bottom">
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>Name</Table.HeaderCell>
											<Table.HeaderCell>Total Posts</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body className="scrollingDiv">
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
								<Table celled striped attached="bottom">
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
								<Table celled striped attached="bottom">
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
						</Grid.Row>
					</Grid>
				</Segment>
			</div>
		);
	}
}

export default App;