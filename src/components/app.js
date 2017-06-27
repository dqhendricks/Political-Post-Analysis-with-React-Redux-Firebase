import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Segment, Item, Table, Image } from 'semantic-ui-react';

class App extends Component {
	
	render() {
		return (
			<div className="spacingDiv">
				<Container text>
					<Header as='h1'>Facebook Data Scrape and Analysis</Header>
					<p>This app collects data about Facebook posts made by the pages for Breitbart, CNN, Fox News, and The New York Times, then attempts to derive conclusions from the data.</p>
				</Container>
				<Segment.Group raised>
					<Segment>
						<Header as='h3'>Overall Conclusions</Header>
						<p>Test</p>
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Header as='h4'>Pages</Header>
							<div className="scrollingDiv">
								<Item.Group>
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
						<Segment>Middle</Segment>
						<Segment>Bottom</Segment>
					</Segment.Group>
				</Segment.Group>
				<Segment.Group raised>
					<Segment>
						<Header as='h3'>Custom Research</Header>
						<p>Test</p>
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Header as='h4'>Pages</Header>
							<div className="scrollingDiv">
								<Table basic='very' celled>
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
						<Segment>Middle</Segment>
						<Segment>Bottom</Segment>
					</Segment.Group>
				</Segment.Group>
			</div>
		);
	}
}

export default App;