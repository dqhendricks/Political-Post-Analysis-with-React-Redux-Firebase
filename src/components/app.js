import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
	
	render() {
		return (
			<Container text>
				<Segment.Group>
					<Segment>
						<Header as='h1'>Facebook Data Scrape and Analysis</Header>
						<p>
							This app collects data about Facebook posts made by the pages for Breitbart, CNN, Fox News, and The New York Times, then attempts to derive conclusions from the data.
						</p>
					</Segment>
					<Segment>
						<Header as='h2'>Overall Conclusions</Header>
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							 <List>
								<List.Item>
								  <Image avatar src='/assets/images/avatar/small/rachel.png' />
								  <List.Content>
									<List.Header as='a'>Rachel</List.Header>
									<List.Description>Last seen watching <a><b>Arrested Development</b></a> just now.</List.Description>
								  </List.Content>
								</List.Item>
							</List>
						</Segment>
						<Segment>Middle</Segment>
						<Segment>Bottom</Segment>
					</Segment.Group>
					<Segment>
						<Header as='h2'>Custom Research</Header>
					</Segment>
					<Segment.Group horizontal>
						<Segment>Top</Segment>
						<Segment>Middle</Segment>
						<Segment>Bottom</Segment>
					</Segment.Group>
				</Segment.Group>
			</Container>
		);
	}
}

export default App;