import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { doEither } from '../types.js';

import { mkSetSubState } from '../lens.js';

const DataTableNewRowForm = (
    { tableConfig, newEmployeeInput, setNewEmployeeInput } ) => {
	
	const inputs = tableConfig.map( field => {
	    const setValue = mkSetSubState(setNewEmployeeInput, field);
	    const value = field.project(newEmployeeInput);
	    return field.toInputElement(value, setValue);
	});
	
	return (<ul> { inputs } </ul>)
    };

const DataTableNewRowFormValidation = ( { newEmployeeValidation,
					  newEmployee } ) => {
    return doEither(
	newEmployeeValidation
	, okEmp => (
	    <button onClick={() => newEmployee(okEmp) }>
		Submit
	    </button>)
	, errEmp => (
	    <ul>
		{ errEmp.map(e => (<li>{e}</li>)) }
	    </ul>));
};

export { DataTableNewRowForm, DataTableNewRowFormValidation }
