import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm } from 'redux-form';
import { Form as SemanticForm, Message, Header } from 'semantic-ui-react'
import FormComponentAbstract from './form-component-abstract';
import fieldData from '../modules/field-data';

/*
	props
	table: name of table we are searching
	onSubmit: function to call on submit. values as argument.
*/

class SortForm extends FormComponentAbstract {
	
	constructor( props ) {
		super( props );
		this.orderByOptions = [];
		_.each( fieldData, ( fieldMetaData, field ) => {
			if ( this.props.table in fieldMetaData.tables ) {
				this.orderByOptions.push( { text: fieldMetaData.name, value: field } );
			}
		} );
		this.sortDirectionOptions = [
			{ text: 'Ascending', value: 'ASC' },
			{ text: 'Descending', value: 'DESC' }
		];
		this.state = {
			selectedSortByField: this.props.initialValues.orderBy
		};
		this.handleSortByChange = this.handleSortByChange.bind( this );
	}
	
	handleSortByChange( value ) {
		this.setState( {
			selectedSortByField: value
		} );
	}
	
	render() {
		return (
			<SemanticForm as={ Form } onSubmit={ this.props.handleSubmit( this.props.onSubmit ) }>
				<Header><Header.Subheader>The selected Sort By field will be displayed in the results list.</Header.Subheader></Header>
				<SemanticForm.Group widths='equal'>
					<Field name='orderBy' component={ this.renderSelect } label='Sort By' options={ this.orderByOptions } required onChangeCallback={ this.handleSortByChange } />
					<Field name='orderDirection' component={ this.renderSelect } label='Sort Direction' options={ this.sortDirectionOptions } required />
				</SemanticForm.Group>
				<Message header={ fieldData[this.state.selectedSortByField].name } content={ fieldData[this.state.selectedSortByField].description } />
			</SemanticForm>
		);
	}
}

function validate( values ) {
	const errors = {};
	// leaving this here just in case
	
	return errors;
}

function mapStateToProps( state, ownProps ) {
	const stateProperty = `${ ownProps.table }Search`;
	return {
		initialValues: {
			orderBy: state[stateProperty].orderBy,
			orderDirection: state[stateProperty].orderDirection
		}
	}
}

SortForm = reduxForm( {
	form: 'sortForm', // form name
	validate // wires up validation
} )( SortForm );

export default connect( mapStateToProps, null )( SortForm )