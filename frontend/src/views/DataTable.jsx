import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { employeeTableFields, employeeToString } from '../employee/employee.js';

const DataTable = ( { employees, tableConfig } ) => {
    return (
	<table className="dbTable">
	    <thead><DataHeaders tableConfig={tableConfig} /></thead>
	    <tbody><DataRows employees={ employees } tableConfig={tableConfig}/></tbody>
	</table>)
};

const DataHeaders = ( { tableConfig } ) => {
    const columnHeaders = tableConfig
	.map( field => field.toTableHeader(field) )
    return <tr> { columnHeaders.flat() } </tr>
};


/* skills_dict[skill_id] 
field.project will have to:
   project into the id, wi

   will have to pass in a skill field into employees which
   projects into the dictionaory 

   
*/

const DataRows = ( { employees, tableConfig } ) => {
    return employees.map(employee => {
	const trData = tableConfig
	    .map( field => field.toTableElement(field.project(employee), field))
	return (<tr>{ trData.flat() }</tr>)
    });
}


export { DataTable }
