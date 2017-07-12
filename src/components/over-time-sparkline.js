import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

/*
	props
	data: over time data
*/

class OverTimeSparkline extends Component {
	
	formatOverTimeData() {
		const { data } = this.props;
		const overTimeKeys = Object.keys( data ).sort();
		var overTimeValues = [];
		 
		overTimeKeys.forEach( ( key ) => {
			overTimeValues.push( data[key] );
		} );
		return overTimeValues;
	}
	
	render() {
		const overTimeValues = this.formatOverTimeData();
		
		return (
			<div style={ { maxWidth: '160px', margin: '0 auto' } }>
				<Sparklines data={ overTimeValues } color='blue' height={ 240 } width={ 240 }>
					<SparklinesLine color='#7da7d9' style={ { strokeWidth: 2 } } />
				</Sparklines>
			</div>
		);
	}
}

export default OverTimeSparkline;