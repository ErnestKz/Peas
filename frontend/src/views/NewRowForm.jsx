import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { doEither } from '../types.js';
import { employeeTableFields, employeeToString } from '../employee/employee.js';

const DataTableNewRowForm = ( { newEmployeeInput, setNewEmployeeInput } ) => {
    const renderFormField = field => {
	const updateFieldHandler = e => (
	    setNewEmployeeInput(s => field.update(s, e.target.value)));
	return (
	    <li> <p> { field.name }:</p>
		<input
		    type = { field.inputType }
		    value = { field.project(newEmployeeInput) }
		    onChange = { updateFieldHandler } >
		</input>
	    </li>)
    };
    return (<ul> { employeeTableFields.map(renderFormField) } </ul>)
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
