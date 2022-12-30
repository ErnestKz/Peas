import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { parseNewEmployeeInput
       , employeeTableFieldsDynamic } from './fields/employee.js';

import { toDb, prepend_new, defaultValues } from './fields/common.js';

import { getSkillsCommandIO
       , getEmployeesCommandIO
       , newEmployeeCommandIO } from './effects.js';

import { createNewEffectStack, mkAddNewEffectStack } from './effects/common.js'

import { DataTableNewRowForm
       , DataTableNewRowFormValidation } from './views/NewRowForm.js'
import { DataTable } from './views/DataTable.js'
import { RootEffectStacks } from './views/EffectStack.js'
import { DropDownMenu } from './ui/DropDownMenu.js'
import { const_, id } from './types.js'
import { mkSetSubState, composeLens } from './lens.js'


const newEmployeeLens =
    { project: s => s.newEmployeeInput
    , update: (s, n) => ({ ...s, newEmployeeInput: n })};

const employeesLens =
    { project: s => s.employees
    , update: (s, n) => ({ ...s, employees: n })};

const effectStackHistoryLens =
    { project: s => s.effectStackHistory
    , update: (s, n) => ({ ...s, effectStackHistory: n })};

const tableConfigLens =
    { project: s => s.tableConfig
    , update: (s, n) => ({ ...s, tableConfig: n })};

const editRowLens =
    { project: s => s.editRow
    , update: (s, n) => ({ ...s, editRow: n })};

const selectedEmployeeLens = composeLens(editRowLens, (
    { project: s => s.selectedEmployee
    , update: (s, n) => ({ ...s, selectedEmployee: n }) }));

const editEmployeeInputLens = composeLens(editRowLens, (
    { project: s => s.editEmployeeInput
    , update: (s, n) => ({ ...s, editEmployeeInput: n }) }));

const initialAppState = {
    employees: [],
    skills: [],
    newEmployeeInput: null,
    effectStackHistory: [],
    tableConfig: null,
    editRow: { selectedEmployee: null
	     , editEmployeeInput: null }
};

const App = ( ) => {
    const [ appState, setAppState ] = useState(initialAppState);
    
    const setNewEmployeeInput = mkSetSubState(setAppState, newEmployeeLens);
    const setEmployees = mkSetSubState(setAppState, employeesLens)
    const setEffectStackHistory = mkSetSubState(setAppState, effectStackHistoryLens);
    const setTableConfig = mkSetSubState(setAppState, tableConfigLens);

    const setSelectedEmployee = mkSetSubState(setAppState, selectedEmployeeLens);
    const setEditEmployeeInput = mkSetSubState(setAppState, editEmployeeInputLens);
    
    const addNewEffectStack = mkAddNewEffectStack(setEffectStackHistory)

    const startNewEmployeeCommandIO = ( newEmployee ) => {
	const setStack = addNewEffectStack();
	const forDb = prepend_new(toDb(newEmployee));
	newEmployeeCommandIO(setStack, "Submit - New Employee")(forDb)
	    .then(_ => getEmployeesCommandIO(setStack, "Post Submit - Get Employees")(null))
	    .then(employees => setEmployees(const_(employees)));
    };

    const initData = () => {
	const setStack = addNewEffectStack();
	getSkillsCommandIO(setStack, "Init - Getting Skills")(null)
	    .then(skills => {
		console.log("hello there", skills)
		const tableConfig = employeeTableFieldsDynamic(skills);
		console.log("hello there")
		setTableConfig(const_(tableConfig));
		setNewEmployeeInput(const_(defaultValues(tableConfig)));
	    });
	
	const setStack2 = addNewEffectStack();
	getEmployeesCommandIO(setStack2, "Init - Get Employees")(
	    null).then(employees => setEmployees(const_(employees)));
    };

    useEffect(() => {
	initData();
    }, []);

    
    const dataTable = ((appState.tableConfig == null) ? [] : (
	<DataTable employees = { appState.employees }
		   tableConfig = { appState.tableConfig }
	setEditEmployeeInput = { setEditEmployeeInput }
		   setSelectedEmployee = { setSelectedEmployee } />
    ));

    const newRowForm = ((appState.tableConfig == null) ? [] : (
	<DataTableNewRowForm
	    tableConfig ={ appState.tableConfig }
	newEmployeeInput= { appState.newEmployeeInput }
	setNewEmployeeInput = { setNewEmployeeInput } />
    ));

    const formValidation = ((appState.tableConfig == null) ? [] : (() => {
	const parsed = parseNewEmployeeInput(appState.tableConfig, appState.newEmployeeInput )
	return (<DataTableNewRowFormValidation
		    newEmployee={ startNewEmployeeCommandIO }
		    newEmployeeValidation = { parsed }/>)
    })());

    const selectedEmployee = selectedEmployeeLens.project(appState);
    
    const editEmployees = () => {
	if (selectedEmployee == null ){
	    return [];
	} else {
	    
	    const deleteButton = (<button onClick= {_} >Delete Employee</button>) // TODO Delete IO
	    
	    const input = (<button onClick= {_} >Submit Edits</button>) // TODO Update IO
	    
	    // TODO: reuse new rowm from and form validation components
	    // TODO: put in a div with heading edit employee employeeNUm and add a border around the div

	}
    }();
    
    return (
	<div className="App">
	    { dataTable }
	    { newRowForm }
	    { formValidation }
	    
	    <RootEffectStacks
		effectStackHistory = { appState.effectStackHistory } />
	</div>);
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode> <App/> </React.StrictMode>);
/* root.render(<App/>); */
