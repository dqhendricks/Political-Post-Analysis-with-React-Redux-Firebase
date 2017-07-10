import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Field, FieldArray, reduxForm } from 'redux-form';
import { Form as SemanticForm, Message, Button, Header, Divider } from 'semantic-ui-react'
import FormComponentAbstract from './form-component-abstract';
import fieldData from '../modules/field-data';

/*
	props
	table: name of table we are searching
	onSubmit: function to call on submit. values as argument.
*/

class SearchForm extends FormComponentAbstract {
	
	constructor( props ) {
		super( props );
		this.whereFieldOptions = [ { text: '', value: '' } ];
		_.each( fieldData, ( fieldMetaData, field ) => {
			if ( this.props.table in fieldMetaData.tables ) {
				this.whereFieldOptions.push( { text: fieldMetaData.name, value: field } );
			}
		} );
		this.whereOperatorOptions = [
			{ text: '=', value: 'e' },
			{ text: '>', value: 'gt' },
			{ text: '>=', value: 'gte' },
			{ text: '<', value: 'lt' },
			{ text: '<=', value: 'lte' },
			{ text: 'Contains', value: 'match' }
		];
		this.state = {
			lastSelectedWhereField: null
		};
		this.handleWhereFieldChange = this.handleWhereFieldChange.bind( this );
		this.renderTerms = this.renderTerms.bind( this );
	}
	
	handleWhereFieldChange( value ) {
		this.setState( {
			lastSelectedWhereField: value
		} );
	}
	
	render() {
		return (
			<SemanticForm as={ Form } onSubmit={ this.props.handleSubmit( this.props.onSubmit ) }>
				<Header><Header.Subheader>You can add multiple search criteria for complex searches.</Header.Subheader></Header>
				<FieldArray name='terms' component={ this.renderTerms }/>
				{ this.state.lastSelectedWhereField &&
					<Message header={ fieldData[this.state.lastSelectedWhereField].name } content={ fieldData[this.state.lastSelectedWhereField].description } />
				}
			</SemanticForm>
		);
	}
	
	renderTerms( { fields } ) {
		return (
			<div>
				{ fields.map( ( term, index ) =>
					<div key={ index }>
						{ index > 0 && <Divider className='mobile-show' /> }
						<SemanticForm.Field style={ { float: 'right' } }>
							<label>&nbsp;</label>
							<Button type='button' icon='remove' content='Remove' onClick={ () => fields.remove( index ) } />
						</SemanticForm.Field>
						<SemanticForm.Group widths='equal'>
							<Field name={ `${ term }.whereField` } component={ this.renderSelect } label='Field' options={ this.whereFieldOptions } onChangeCallback={ this.handleWhereFieldChange } />
							<Field name={ `${ term }.whereOperator` } component={ this.renderSelect } label='Operator' options={ this.whereOperatorOptions } />
							<Field name={ `${ term }.whereValue` } component={ this.renderInput } label='Value' />
						</SemanticForm.Group>
					</div>
				) }
				<Button type='button' icon='add' content='Add Additional Criteria' onClick={ () => fields.push( {} ) } />
			</div>
		);
	}
}

function validate( values ) {
	const errors = {};
	const termsErrorArray = [];
	values.terms.forEach( ( term, index ) => {
		const termError = {};
		if ( !term.whereField && ( term.whereValue || values.terms.length > 1 || index > 0 ) ) termError.whereField = 'You must first select a field.';
		if ( !term.whereValue && ( values.terms.length > 1 || index > 0 ) ) termError.whereValue = 'You must first enter a value.';
		if ( _.size( termError ) ) termsErrorArray[index] = termError;
	} );
	if ( termsErrorArray.length ) errors.terms = termsErrorArray;
	return errors;
}

function mapStateToProps( state, ownProps ) {
	const stateProperty = `${ ownProps.table }Search`;
	return {
		initialValues: {
			terms: state[stateProperty].terms
		}
	}
	return {};
}

SearchForm = reduxForm( {
	form: 'searchForm', // form name
	validate // wires up validation
} )( SearchForm );

export default connect( mapStateToProps, null )( SearchForm )