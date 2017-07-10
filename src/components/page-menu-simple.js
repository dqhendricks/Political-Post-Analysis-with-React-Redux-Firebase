import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react'

/*
	props
	pageNumber: page number
	pageBackwardCallback: callback for going back one page
	pageForwardCallback: callback for going forward one page
*/

class PageMenuSimple extends Component {
	
	render() {
		return (
			<Menu floated='right' pagination title='Pages'>
				{ this.props.page > 1 &&
					<Menu.Item as='a' icon onClick={ this.props.pageBackwardCallback }>
						<Icon name='left chevron' />
					</Menu.Item>
				}
				<Menu.Item as='a' active={ true }>{ this.props.page }</Menu.Item>
				<Menu.Item as='a' icon onClick={ this.props.pageForwardCallback }>
					<Icon name='right chevron' />
				</Menu.Item>
			</Menu>
		);
	}
}

export default PageMenuSimple;