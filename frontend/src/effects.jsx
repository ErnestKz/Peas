const baseUrl = "http://localhost:8081/";
const employeeRoute = baseUrl + "employee";

function newEmployee(employee){
    console.log(employee);
}

const getEmployeesReq = {
    method: "GET" 
};

function getEmployees(setAppState){
    fetch(employeeRoute, getEmployeesReq)
	.then( r => r.json() )
	.then( e => e.map(employeeFromDb) )
	.then( employees => setAppState(oldAppState => ({
	    ...oldAppState,
	    employees: employees })));
}
