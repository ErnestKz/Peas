import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import * from './types.jsx';
import * from './employee/employee.jsx';
import * from './effects.jsx';


const mkSetSubState = (setState, lens) => {
    const setSubState = ( subStateUpdateFn ) => {
	return setState( oldState => {
	    const newSubState = subStateUpdateFn(lens.project(oldState))
	    return lens.update(oldState, newSubState)
	});
    }
    return setSubState;
};

const initialNewEmployeeInput = constructRecord(field => {
    return inputTypeToInitialValue(field.inputType)
});

const initialAppState = {
    employees: [],
    newEmployeeInput: initialNewEmployeeInput,
    effectCallStack: []
};

const newEmployeeLens =
    { project: s => s.newEmployeeInput
    , update: (s, n) => ({ ...s, newEmployeeInput: n })}

const mkSetNewEmployeeInput = setAppState => {
    return mkSetSubState(setAppState
		       , newEmployeeLens.project
		       , newEmployeeLens.update);
};

const App = () => {
    const [appState, setAppState] = useState(initialAppState);
    const setNewEmployeeInput = mkSetNewEmployeeInput(setAppState);
    const newEmployeeValidation = parseNewEmployeeInput(appState.newEmployeeInput);
    
    return (
	<div className="App">
	    <button onClick = { () => getEmployees(setAppState) } >
		Click Here
	    </button>
	    <DataTable
		employees= { appState.employees } />
	    <DataTableNewRowForm
		newEmployeeInput= { appState.newEmployeeInput }
		setNewEmployeeInput= { setNewEmployeeInput }/>
	    <DataTableNewRowFormValidation
		newEmployeeValidation = { newEmployeeValidation }/>
	</div>)
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode> <App/> </React.StrictMode>);


