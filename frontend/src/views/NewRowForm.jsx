import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { doEither } from '../types.js';
import { employeeTableFields, employeeToString } from '../employee/employee.js';

import { mkSetSubState } from '../lens.js';

const DataTableNewRowForm = (
    { employeeTableFields, newEmployeeInput, setNewEmployeeInput } ) => {
	
	const inputs = employeeTableFields.map( field => {
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
