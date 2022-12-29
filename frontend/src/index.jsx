import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { constructRecord,
	 inputTypeToInitialValue,
	 parseNewEmployeeInput, employeeToDb
       , employeeTableFieldsDynamic } from './employee/employee.js';

import { getSkillsCommandIO
       , getEmployeesCommandIO
       , newEmployeeCommandIO } from './effects.js';

import { DataTableNewRowForm
       , DataTableNewRowFormValidation } from './views/NewRowForm.js'

import { DataTable } from './views/DataTable.js'

import { RootEffectStacks } from './views/EffectStack.js'

import { DropDownMenu } from './ui/DropDownMenu.js'

import { const_, id } from './types.js'

import { mkSetSubState } from './lens.js'


const newEmployeeLens =
    { project: s => s.newEmployeeInput
    , update: (s, n) => ({ ...s, newEmployeeInput: n })};

const employeesLens =
    { project: s => s.employees
    , update: (s, n) => ({ ...s, employees: n })};

const skillsLens =
    { project: s => s.skills
    , update: (s, n) => ({ ...s, skills: n })};

const effectStackHistoryLens =
    { project: s => s.effectStackHistory
    , update: (s, n) => ({ ...s, effectStackHistory: n })};

const initialAppState = {
    employees: [],
    skills: [],
    newEmployeeInput: constructRecord(field => (
	inputTypeToInitialValue(field.inputType))),
    effectStackHistory: []
};

const createNewEffectStack = effectStackHistory => {
    const newEffectStackHistory = [...effectStackHistory, []];
    const index = newEffectStackHistory.length - 1;
    const newEffectStackSubLens =
	{ project: effStackHistory => effStackHistory[index]
	, update: (effStackHistory, effStackUpdatedValue) => {
	    return effStackHistory.map((a, idx) => idx == index ? effStackUpdatedValue : a);
	}
	}
    return [newEffectStackHistory, newEffectStackSubLens];
};

const mkAddNewEffectStack = setEffectStackHistory => () => {
    const res = [null]
    // Assuming that the set functions are asynchronous, and block until it has set.
    setEffectStackHistory( effectStackHistory => {
	const [newEffectStackHistory, newEffectStackSubLens] = createNewEffectStack(effectStackHistory);
	res[0] = newEffectStackSubLens;
	return newEffectStackHistory;
    });
    
    const setNewEffectStack = updateEffectStackValue => setEffectStackHistory(effectStackHistory => {
	const newEffectStackSubLens = res[0];
	const oldEffectStackValue = newEffectStackSubLens.project(effectStackHistory);
	const newEffectStackValue = updateEffectStackValue(oldEffectStackValue);
	return newEffectStackSubLens.update(effectStackHistory, newEffectStackValue);
    });
    return setNewEffectStack;
};

const App = ( ) => {
    const [ appState, setAppState ] = useState(initialAppState);
    const setNewEmployeeInput = mkSetSubState(setAppState, newEmployeeLens);
    const setEmployees = mkSetSubState(setAppState, employeesLens)
    const setSkills = mkSetSubState(setAppState, skillsLens)
    const setEffectStackHistory = mkSetSubState(setAppState, effectStackHistoryLens);
    const addNewEffectStack = mkAddNewEffectStack(setEffectStackHistory)

    const startGetEmployeesCommandIO = () => {
	const setStack = addNewEffectStack();
	getEmployeesCommandIO(setStack, "Button - Get Employees")(
	    null).then(employees => setEmployees(const_(employees)));
    };

    const startNewEmployeeCommandIO = ( newEmployee ) => {
	const setStack = addNewEffectStack();
	newEmployeeCommandIO(setStack, "Submit - New Employee")(employeeToDb( newEmployee ))
	    .then(_ => getEmployeesCommandIO(setStack, "Post Submit - Get Employees")(null))
	    .then(employees => setEmployees(const_(employees)));
    };

    const startGetSkillsCommandIO = () => {
	const setStack = addNewEffectStack();
	getSkillsCommandIO(setStack, "Init - Getting Skills")(null)
	    .then(skills => setSkills(const_(skills)));
    };
    
    /* useEffect(() => {
       startGetSkillsCommandIO();
     * });
     */
    
    const tableConfig = employeeTableFieldsDynamic( appState.skills );

    const newEmployeeValidation = parseNewEmployeeInput(tableConfig,
							appState.newEmployeeInput);
    return (
	<div className="App">
	    
	    <button onClick = { startGetEmployeesCommandIO } >
		Click
	    </button>
	    <button onClick = { startGetSkillsCommandIO } >
		Skills
	    </button>
	    <DataTable employees = { appState.employees }
		       tableConfig ={ tableConfig }/>
	    <RootEffectStacks effectStackHistory = { appState.effectStackHistory } />
	    
	    {/* <DataTableNewRowForm
		newEmployeeInput= { appState.newEmployeeInput }
		setNewEmployeeInput = { setNewEmployeeInput }/>
		
		<DataTableNewRowFormValidation
		newEmployee={ startNewEmployeeCommandIO }
		newEmployeeValidation = { newEmployeeValidation }/> */}
	</div>);
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode> <App/> </React.StrictMode>);


// 1. dynamic creation of setSubState that project into array indices
// 2. making the general pattern a bit more higher order so that it is reusable
// 3. write the usage instances for it
