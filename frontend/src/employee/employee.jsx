import { Just, Nothing, Maybe,
	 Err, Ok, doEither,
	 dispatchTypeclass,
	 id, const_ }
from '../types.js';

const constructRecord = f => employeeTableFields
    .reduce((acc, field) => field.update(acc, f(field)), {});

const employeeFromDb = dbEmployee => (
    constructRecord(field => field.fromDb(field.project(dbEmployee))));

// TODO: rename this to employeeFieldToString
const employeeToString = x => dispatchTypeclass(
    employeeToStringDispatchMap, x);

const employeeToStringDispatchMap =
    { "_JUST": ([_, val]) => employeeToString(val),
      "_NOTHING": _ => "EMPTY",
      "string": id,
      "number": x => x.toString(),
      "bool": b => b.toString()
    };

/* const employeeToRender */

/*
   looks like ill need to support record types
 */

/* ["_SKILL" , val]
 * {
 *     skill_id : string,
 *     skill_name: string,
 *     skill_description: Maybe
 * } */

const employeeFieldToDb = x => dispatchTypeclass(employeeToDbDispatchMap, x);

const employeeToDb = employee => {
    const f = field => employeeFieldToDb(field.project(employee));
    return constructRecord(f);
};

const employeeToDbDispatchMap =
    { "_JUST": ([_, val]) => employeeToString(val),
      "_NOTHING": _ => null,
      "string": id,
      "number": id,
      "bool": id
    };

const inputTypeToInitialValue = (inputType) => {
    switch (inputType) {
	case "text":
	    return ""
	case "date":
	    return ""
	case "email":
	    return ""
	default:
	    throw new Error('Initial value for ' +
			    inputType + ' not provided');
    }
};

const emptyFieldParser = s => (s == "" ? Nothing : Just(s))

const firstnameField = {
    name: "Firstname",
    project: r => r.firstname,
    update: (r, v) => ({...r, firstname: v}),
    inputType: "text",
    fromString: c => Ok(emptyFieldParser(c)),
    fromDb: Maybe
};

const lastnameField = {
    name: "Lastname",
    project: r => r.lastname,
    update: (r, v) => ({...r, lastname: v}),
    inputType: "text",
    fromString: c => Ok(emptyFieldParser(c)),
    fromDb: Maybe
};

const dobField = {
    name: "Date of Birth",
    project: r => r.dob,
    update: (r, v) => ({...r, dob: v}),
    inputType: "date",
    fromString: c => Ok(emptyFieldParser(c)),
    fromDb: Maybe
};

const emailField = {
    name: "Email",
    project: r => r.email,
    update: (r, v) => ({...r, email: v}),
    inputType: "email",
    fromString: c => Ok(emptyFieldParser(c)),
    fromDb: Maybe
};

const activeField = {
    name: "Active",
    project: r => r.active,
    update: (r, v) => ({...r, active: v}),
    
    inputType: "radio",
    fromString: c => Ok(emptyFieldParser(c)),
    fromDb: Maybe
};



const employeeTableFields =
    [ firstnameField
    , lastnameField
    , dobField
    , emailField
    , activeField
    ];

// Either [String] Employee
const parseNewEmployeeInput = newEmployeeInput => {
    const parsedValues =
	constructRecord(field => field.fromString(
	    field.project(newEmployeeInput)));
    
    return employeeTableFields.reduce((soFar, field) => {
	const parsedValue = field.project(parsedValues);
	return doEither(parsedValue
		      , valueOk => doEither(
			  soFar
			  , soFarOk => Ok(field.update(soFarOk, valueOk))
			  , soFarErr => soFar)
		      , valueErr => doEither(
			  soFar
			  , soFarOk => Err([valueErr])
			  , soFarErr => Err([...soFarErr, valueErr])));
    }, Just(parsedValues));
};


export { employeeTableFields,
	 constructRecord,
	 employeeFromDb, employeeToString, employeeToDb, 
	 inputTypeToInitialValue,
	 parseNewEmployeeInput }
