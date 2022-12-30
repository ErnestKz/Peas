import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const DataTable = ( { employees, tableConfig, setEditEmployeeInput, setSelectedEmployee } ) => {
    return (
	<table className="dbTable">
	    <thead><DataHeaders tableConfig={ tableConfig } /></thead>
	    <tbody><DataRows employees={ employees }
			     tableConfig={tableConfig}
			     setEditEmployeeInput = { setEditEmployeeInput }
			     setSelectedEmployee = { setSelectedEmployee }/></tbody>
	</table>)
};

const DataHeaders = ( { tableConfig } ) => {
    const columnHeaders = tableConfig.map( field => field.toTableHeader )
    return <tr> { columnHeaders.flat() } </tr>
};

const DataRows = ( { employees, tableConfig, setEditEmployeeInput, setSelectedEmployee } ) => {
    return employees.map(employee => {
	const tableRowClickHandler = () => {
	    setSelectedEmployee(const_(_)) // TODO function for extracting the id of the field
	    setEditEmployeeInput(const_(_)) // TODO function for extracting input from existing elment
	};
	
	const trData = tableConfig
	    .map( field => field.toTableElement(field.project(employee)));
	return (<tr onClick={ tableRowClickHandler }> { trData.flat() }</tr>)
    });
}

export { DataTable }
