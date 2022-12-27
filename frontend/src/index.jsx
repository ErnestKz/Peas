import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { constructRecord,
	 inputTypeToInitialValue,
	 parseNewEmployeeInput, employeeToDb } from './employee/employee.js';

import { getEmployeesCommandIO, newEmployeeCommandIO } from './effects.js';

import { DataTableNewRowForm
       , DataTableNewRowFormValidation } from './views/NewRowForm.js'

import { DataTable } from './views/DataTable.js'

import { RootEffectStacks } from './views/EffectStack.js'

import { const_ } from './types.js'


const mkSetSubState = (setState, lens) => {
    const setSubState = ( subStateUpdateFn ) => {
	return setState( oldState => {
	    const newSubState = subStateUpdateFn(lens.project(oldState))
	    return lens.update(oldState, newSubState)
	});
    }
    return setSubState;
};

const newEmployeeLens =
    { project: s => s.newEmployeeInput
    , update: (s, n) => ({ ...s, newEmployeeInput: n })};

const employeesLens =
    { project: s => s.employees
    , update: (s, n) => ({ ...s, employees: n })};


const effectStackHistoryLens =
    { project: s => s.effectStackHistory
    , update: (s, n) => ({ ...s, effectStackHistory: n })};

const initialAppState = {
    employees: [],
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

    const newEmployeeValidation = parseNewEmployeeInput(appState.newEmployeeInput);
    return (
	<div className="App">
	    <button onClick = { startGetEmployeesCommandIO } >
		Click
	    </button>
	    <DataTable employees = { appState.employees } />
	    <RootEffectStacks effectStackHistory = { appState.effectStackHistory } />
	    
	    <DataTableNewRowForm
		newEmployeeInput= { appState.newEmployeeInput }
		setNewEmployeeInput = { setNewEmployeeInput }/>
	    
	    <DataTableNewRowFormValidation
		newEmployee={ startNewEmployeeCommandIO }
		newEmployeeValidation = { newEmployeeValidation }/>
	</div>);
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode> <App/> </React.StrictMode>);


// 1. dynamic creation of setSubState that project into array indices
// 2. making the general pattern a bit more higher order so that it is reusable
// 3. write the usage instances for it
