import React, { Component } from 'react';
import PieChart from 'react-svg-piechart';

/*
	props
	record: db record
*/

class ReactionsPieChart extends Component {
	
	formatPieChartData() {
		const { record } = this.props;
		var pieChartData = [];
		
		if ( record.total_love_reactions != '0' ) pieChartData.push( { label: 'LOVE', value: parseInt( record.total_love_reactions ), color: '#f49ac1' } );
		if ( record.total_wow_reactions != '0' ) pieChartData.push( { label: 'WOW', value: parseInt( record.total_wow_reactions ), color: '#7da7d9' } );
		if ( record.total_haha_reactions != '0' ) pieChartData.push( { label: 'HAHA', value: parseInt( record.total_haha_reactions ), color: '#82ca9c' } );
		if ( record.total_sad_reactions != '0' ) pieChartData.push( { label: 'SAD', value: parseInt( record.total_sad_reactions ), color: '#fff799' } );
		if ( record.total_angry_reactions != '0' ) pieChartData.push( { label: 'ANGRY', value: parseInt( record.total_angry_reactions ), color: '#f68e56' } );
		
		return pieChartData;
	}
	
	render() {
		const pieChartData = this.formatPieChartData();
		
		if ( !pieChartData.length ) return <div>No reactions available.</div>;
		return (
			<div style={ { maxWidth: '160px', margin: '0 auto' } }>
				<PieChart data={ pieChartData } />
			</div>
		);
	}
}

export default ReactionsPieChart;