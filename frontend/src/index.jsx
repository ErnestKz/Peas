import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import { constructRecord,
	 inputTypeToInitialValue,
	 parseNewEmployeeInput} from './employee/employee.js';

import { getEmployees, newEmployee, getEmployeesRequestW } from './effects.js';

import { DataTableNewRowForm
       , DataTableNewRowFormValidation } from './views/NewRowForm.js'

import { DataTable } from './views/DataTable.js'


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

const effectStackLens =
    { project: s => s.effectStack
    , update: (s, n) => ({ ...s, effectStack: n })};

const initialAppState = {
    employees: [],
    newEmployeeInput: constructRecord(field => (
	inputTypeToInitialValue(field.inputType))),
    effectStack: {}
};

const appConfig = { };
/*
   app config could contian:
   - what effect command to use
   -- and so the various effect functions will be generated accordingly
   - perhaps config can contain arbitrary initial app states
   -- and then from there can run tests with the mocked effect functions

 */


/*
   perhaps input setters to the components are passed explicitly
   but the components receive them as a single variable that
   represents the dictionary of effects
   
 */

/*
   monad computation where the result is Monoid a => Either Err a
   where the monoid is a nested call stack

   once an error hits, it uses the previous resulting a and the
   error to create the message/stack trac

   show the call stack in real time

   messages can pattern match on the call stack to determine the
   specific instance of what went wrong

   then theres also the aspect of triggering/waiting and then resolving
   the action can set a piece of state that represents that the
   command has been triggered, and then pair the continuation value
   with something that resolves the pending state
*/

const App = ( ) => {
    const [ appState, setAppState ] = useState(initialAppState);
    const setNewEmployeeInput = mkSetSubState(setAppState, newEmployeeLens);
    const setEmployees = mkSetSubState(setAppState, employeesLens)
    const setEffectStack = mkSetSubState(setAppState, effectStackLens);

    const newEmployeeValidation = parseNewEmployeeInput(appState.newEmployeeInput);




    
    return (
	<div className="App">
	    <button onClick = { () => getEmployeesEffect( setEffectStack, setEmployees ) } >
		Click
	    </button>
	    
	    <DataTable
		employees= { appState.employees } />
	    <DataTableNewRowForm
		newEmployeeInput= { appState.newEmployeeInput }
		setNewEmployeeInput = { setNewEmployeeInput }/>
	    <DataTableNewRowFormValidation
		newEmployee={ newEmployeeEffect }
		newEmployeeValidation = { newEmployeeValidation }/>
	</div>)
};




// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<React.StrictMode> <App/> </React.StrictMode>);


console.log("Testing Promises.")

const id = a => a;

const pure = val => (new Promise(ok => ok(val))).then(id)

// the call stack sort of reflects the promisechaine

// probably something that wraps it up?


/* const wrapPromise = (p, s, faOk, faErr) => (new Promise((ok, err) => {
 *     const endWrapOk = fa => a => { fa(a); return a};
 *     const endWrapErr = fa => a => { fa(a); return Promise.reject(a)};
 *     
 *     s();
 *     return p(endWrapOk(faOk), endWrapErr(faErr))
 * 	.then(ok, err);
 * })); */


// original one sort of starts a new stack

// its like its sending messages
// addToStack

// or perhaps it can take in the current state and return the resulting state
// so each time it initiates it, it starts a request

// so the commandHistory will be a list
// and each element of the list is the context for each unique chain of commands

// perhaps also a variation where the state only has access to its own context

// though for now can just append to list, and then interpret the list


// so it seems like could have functions to project and set into lists
// and this would be connected to the root state

// addToStack :: (a -> (a -> a))

// 1. dynamic creation of setSubState that project into array indices
// 2. making the general pattern a bit more higher order so that it is reusable
// 3. write the usage instances for it

const a = ((setState) => {
    const start = Date.now()

    setState(state => state + ["Start"])
    
    const stopTimerOk = (res) => {
	const end = Date.now()
	console.log("Req Succ: ", end - start)
	setState(state => state + ["End Success"])
	return res
    }
    
    const stopTimerErr = (err) => {
	const end = Date.now()
	console.log("Req Err: ", end - start)
	setState(state => state + ["End Fail"])
	return Promise.reject(err);
    }
    
    return getEmployeesRequestW()
	.then(stopTimerOk, stopTimerErr)
	.then(console.log)
	.catch(e => console.log("Err: ", e));
});

a();

/* Promise.prototype.thenWrap = function(s, faOk, faErr) {
 *     const endWrapOk = fa => a => { fa(a); return a };
 *     const endWrapErr = fa => a => { fa(a); return Promise.reject(a)} ;
 *     s();
 *     return this.then(endWrapOk(faOk), endWrapErr(faErr));
 * };
 * 
 * const endReq = (p => a => console.log("EndReq ", p, a)); */

/* getEmployeesRequestW().catch(console.log) */
/* 
 * getEmployeesRequestW()
 *     .then(a => {console.log("got it"); return a}
 * 	, a => {console.log("got it"); return a})
 *     .thenWrap(() => console.log("hi"), console.log, console.log) */

/*
   some form of passing a variable along with the results

 */

/* probably best */


/* const getEmpSupa = () => wrapPromise(getEmployeesRequestW,
 * 				     () => console.log("StartRequest"),
 * 				     endReq("ok"),
 * 				     endReq("err"));
 * 
 * getEmpSupa()
 *     .then(r => console.log("got it ", r))
 *     .catch(er => console.log("err happened ", err))
 *  */

/* console.log(a); */



/* const p1 = new Promise((ok, err) => err("Start p1"));
 * const p11 = p1.then(a => a + " 1st success.", a => a + " 1st fail.") 
 * 	      .then(a => a + " 2nd success.", a => a + " 2nd fail.")
 * 	      .then(console.log, console.log)
 * 
 * const p2 = new Promise((ok, err) => err("Start p2"));
 * const p22 = p2.then(a => a + " 1st success.", a => Promise.reject(a + " 1st fail.")) 
 * 	      .then(a => a + " 2nd success.", a => Promise.reject(a + " 2nd fail."))
 * 	      .then(console.log, console.log)
 * 
 * const p3 = new Promise((ok, err) => ok("Start p3"));
 * const p33 = p3.then(a => a + " 1st success.")
 * 	      .then(a => a + " 2nd success.")
 * 	      .then(a => Promise.reject(a + " 3rd success"))
 * 	      .then(a => a + " 3rd success.")
 * 	      .catch(a => console.log(a, "caught failure.")) // then this continues as success
 * 	      .catch(a => console.log("hi"))
 * 	      .then(a => console.log("yo"))
 *  */



// its almost like there is an implicit pure in the callbacks
// cause in reality it is just creating another promise?

/* console.log("p1", p1);
 * console.log("p11", p11);
 * console.log("p2", p2);
 * console.log("p22", p22);
 *  */
console.log("End of Promise Test Code.")

