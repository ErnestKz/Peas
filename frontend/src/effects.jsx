import { const_ } from './types.js';
import { employeeFromDb } from './employee/employee.js';

const baseUrl = "http://localhost:8081/";
const employeeRoute = baseUrl + "employee";


const getEmployeesReq = {
    method: "GE" 
};

const fetchResponseError = (url, req) => {
    const okFn = r => r.ok ? r.json() : Promise.reject(r);
    const errFn = Promise.reject;
    return fetch(url, req).then(okFn, errFn);
};


function getEmployeesRequest(){
    return fetch(employeeRoute, getEmployeesReq)
	.then(r => r.json())
	.then(e => e.map(employeeFromDb) );
}

function getEmployeesRequestW(ok, err){
    return fetchResponseError(employeeRoute, getEmployeesReq)
	.then(e => e.map(employeeFromDb))
	.then(ok)
	.catch(err);
}

function getEmployeesEffect(getEmployeesCmd, setEffectStack, setEmployees){
    getEmployeesCmd().then( employees => setEmployees(const_(employees)));
}

function getEmployees(setEffectStack, setEmployees) {
    getEmployeesEffect(getEmployeesRequest, setEffectStack, setEmployees);
}


function newEmployee(setEffectStack, setEmployees, newEmployee){
    console.log(newEmployee)
}


/*
   accept implementations of
   - the set state functions
   - the effect cmd function
   in the app, set the implementations for the functions
 */

/*
   have some sort of single function where can set the
   interpretation functions for the commands and the
   setters of the state

 */

/*
   sort of my own abstraction for the the .then syntax
   in order to add additional information
 */

/*
   perhaps ability to write what should happen and what
   error message it should have when it fails in a specific
   part of the command chain

 */

/*
   can pass down all the commands from the app root
   could also pass down an app config that stores
   the desired effect implementations
 */

/* export { newEmployeeEffect, getEmployeesEffect } */
export { getEmployees, newEmployee,
	 getEmployeesRequest, getEmployeesRequestW}
