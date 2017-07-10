import React, { Component } from 'react';
import { Form, Label } from 'semantic-ui-react'
import _ from 'lodash';

/*
	Base class for redux-form + semantic-ui form forms. Handles component generation and error display only.
*/

class FormComponentAbstract extends Component {
	
	constructor( props ) {
		super( props );
		this.renderSelect = this.renderSelect.bind( this );
	}
	
	renderInput( field ) {
		const isError = ( field.meta.error && field.meta.touched );
		
		return(
			<Form.Field required={ field.required } error={ isError }>
				<label>{ field.label }</label>
				<input
					{ ..._.omit( field.input, [ 'onChange' ] ) }
					onChange={ ( event ) => {
						// overwriting allows us to pass a callback in props for onChange
						field.input.onChange( event );
						if ( 'onChangeCallback' in field ) field.onChangeCallback( event.target.value );
					} }
					placeholder={ `Enter ${ field.label }` }
				/>
				{ isError &&
					<Label pointing basic color='red'>{ field.meta.error }</Label>
				}
			</Form.Field>
		);
	}
	
	renderSelect( field ) {
		// order or expressions is important here. we do not want isError to contain a string.
		const isError = ( field.meta.error && field.meta.touched );
		
		return(
			<Form.Field required={ field.required } error={ isError }>
				<label>{ field.label }</label>
				<select
					{ ..._.omit( field.input, [ 'onChange' ] ) }
					onChange={ ( event ) => {
						// overwriting allows us to pass a callback in props for onChange
						field.input.onChange( event );
						if ( 'onChangeCallback' in field ) field.onChangeCallback( event.target.value );
					} }
				>
					{ this.renderOptions( ( 'options' in field ) ?  field.options : [] ) }
				</select>
				{ isError &&
					<Label pointing basic color='red'>{ field.meta.error }</Label>
				}
			</Form.Field>
		);
	}
	
	renderOptions( options ) {
		return(
			options.map( ( option, index ) => {
				return <option value={ option.value } key={ index }>{ option.text }</option>
			} )
		);
	}
}

export default FormComponentAbstract;