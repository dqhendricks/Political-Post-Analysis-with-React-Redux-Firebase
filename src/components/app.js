import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
	
	render() {
		return (
			<Container text>
				<Header as='h1'>Facebook Data Scrape and Analysis</Header>
				<p>This app collects data about Facebook posts made by the pages for Breitbart, CNN, Fox News, and The New York Times, then attempts to derive conclusions from the data.</p>
				<Segment.Group>
					<Segment>
						<Header as='h2'>Overall Conclusions</Header>
						<p>Test</p>
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Header as='h3'>Pages</Header>
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
						</Segment>
						<Segment>Middle</Segment>
						<Segment>Bottom</Segment>
					</Segment.Group>
					<Segment>
						<Header as='h2'>Custom Research</Header>
						<p>Test</p>
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							<Header as='h3'>Pages</Header>
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
											<Header as='h4' image>
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
						</Segment>
						<Segment>Middle</Segment>
						<Segment>Bottom</Segment>
					</Segment.Group>
				</Segment.Group>
			</Container>
		);
	}
}

export default App;