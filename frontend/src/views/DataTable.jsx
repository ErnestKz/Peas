import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { employeeTableFields, employeeToString } from '../employee/employee.js';

const DataTable = ( { employees } ) => {
    return (
	<table className="dbTable">
	    <thead><DataHeaders /></thead>
	    <tbody><DataRows employees={ employees } /></tbody>
	</table>)
};

const DataHeaders = () => {
    const columnHeaders = employeeTableFields
	.map( field => field.toTableHeader(field) )
    return <tr> { columnHeaders } </tr>
};

const DataRows = ( { employees } ) => {
    return employees.map(employee => {
	const trData = employeeTableFields
	    .map( field => field.toTableElement(field.project(employee), field))
	return (<tr>{ trData.flat() }</tr>)
    });
}


export { DataTable }
