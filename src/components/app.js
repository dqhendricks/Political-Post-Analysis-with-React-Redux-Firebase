import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Segment, Item, Table, Image, Icon } from 'semantic-ui-react';

class App extends Component {
	
	render() {
		return (
			<div className="spacingDiv">
				<Container text>
					<Header as='h1'>
						<Icon name='facebook' size='massive' />
						<Header.Content>
							Facebook Data Scrape and Analysis
							<Header.Subheader>This app collects data about Facebook posts made by the pages for Breitbart, CNN, Fox News, and The New York Times, then attempts to derive conclusions from the data.</Header.Subheader>
						</Header.Content>
					</Header>
				</Container>
				<Segment.Group raised>
					<Segment>
						<Header as='h3'>
							<Icon name='idea' size='huge' />
							<Header.Content>
								Overall Conclusions
								<Header.Subheader>Test</Header.Subheader>
							</Header.Content>
						</Header>
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Header as='h4' block>
								<Icon name='feed' size='big' />
								<Header.Content>Pages</Header.Content>
							</Header>
							<div className="scrollingDiv">
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
							</div>
						</Segment>
						<Segment>
							<Header as='h4' block>
								<Icon name='newspaper' size='big' />
								<Header.Content>Posts</Header.Content>
							</Header>
							<div className="scrollingDiv">
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
							</div>
						</Segment>
						<Segment>
							<Header as='h4' block>
								<Icon name='users' size='big' />
								<Header.Content>Users</Header.Content>
							</Header>
							<div className="scrollingDiv">
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
							</div>
						</Segment>
					</Segment.Group>
				</Segment.Group>
				<Segment.Group raised>
					<Segment>
						<Header as='h3'>
							<Icon name='lab' size='huge' />
							<Header.Content>
								Custom Research
								<Header.Subheader>Test</Header.Subheader>
							</Header.Content>
						</Header>
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Header as='h4' block>
								<Icon name='feed' size='big' />
								<Header.Content>Pages</Header.Content>
							</Header>
							<div className="scrollingDiv">
								<Table celled>
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
													<Header.Content>
														Page Name
														<Header.Subheader>Page Summary Info</Header.Subheader>
													</Header.Content>
												</Header>
											</Table.Cell>
											<Table.Cell>43</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table>
							</div>
						</Segment>
						<Segment>
							<Header as='h4' block>
								<Icon name='newspaper' size='big' />
								<Header.Content>Posts</Header.Content>
							</Header>
							<div className="scrollingDiv">
								<Table celled>
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
													<Header.Content>
														Post Name
														<Header.Subheader>Post Summary Info</Header.Subheader>
													</Header.Content>
												</Header>
											</Table.Cell>
											<Table.Cell>43</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table>
							</div>
						</Segment>
						<Segment>
							<Header as='h4' block>
								<Icon name='users' size='big' />
								<Header.Content>Users</Header.Content>
							</Header>
							<div className="scrollingDiv">
								<Table celled>
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
													<Header.Content>
														User Name
													</Header.Content>
												</Header>
											</Table.Cell>
											<Table.Cell>43</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table>
							</div>
						</Segment>
					</Segment.Group>
				</Segment.Group>
			</div>
		);
	}
}

export default App;