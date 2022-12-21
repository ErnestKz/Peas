import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import * from './types.jsx';
import * from './employee/employee.jsx';

const DataTable = ( { employees } ) => {
    return (
	<table className="dbTable">
	    <thead><DataHeaders /></thead>
	    <tbody><DataRows employees={ employees } /></tbody>
	</table>)
};

const DataHeaders = () => {
    const columnHeaders = employeeTableFields
	.map( field => <th className="columnHead">{ field.name }</th>)
    return <tr> { columnHeaders } </tr>
};

const DataRows = ( { employees } ) => {
    return employees.map(employee => (
	<tr>{
	    employeeTableFields.map( field => {
		const renderedValue = employeeToString(field.project(employee))
		return (<td> { renderedValue } </td>)
	    })
	}</tr>
    ));
};
