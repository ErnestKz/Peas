import { Just, Nothing, Maybe,
	 Err, Ok, doEither, maybeNull,
	 Bool, 
	 dispatchTypeclass,
	 id, const_ }
from '../types.js';

import { DropDownMenu } from '../ui/DropDownMenu.js'

import { skillTableFields
       , skillIdField
       , skillNameField
       , skillDescriptionField
       , skillsToDict } from './skill.js';

import React from 'react';

const constructRecord = f => employeeTableFields
    .reduce((acc, field) => field.update(acc, f(field)), {});

const employeeFromDb = dbEmployee => (
    constructRecord(field => field.fromDb(field.project(dbEmployee))));

// TODO: rename this to employeeFieldToString
const employeeToString = x => dispatchTypeclass(employeeToStringDispatchMap, x);

const employeeToStringDispatchMap =
    { "_JUST": val => employeeToString(val._VALUE),
      "_NOTHING": _ => "EMPTY",
      "string": id,
      "number": x => x.toString(),
      "bool": b => b.toString()
    };


const employeeFieldToDb = x => dispatchTypeclass(employeeToDbDispatchMap, x);

const employeeToDb = employee => {
    const f = field => employeeFieldToDb(field.project(employee));
    return constructRecord(f);
};

const employeeToDbDispatchMap =
    { "_JUST": val => employeeToString(val._VALUE),
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
	    throw new Error('Initial value for ' + inputType + ' not provided');
    }
};

// String -> Either String (Maybe String)
const emptyFieldParser = s => {
    return Ok(Maybe(String))(s == "" ? Nothing : Just(String)(s))
};

const toTableHeaderSingle = field => {
    return (<th className="columnHead">{ field.name }</th>)
};

const toTableElementSingle = (val, field) => {
    const renderedValue = employeeToString(val)
    return (<td> { renderedValue } </td>)
};


const skillViewColumns = [ skillNameField, skillDescriptionField ];

const toTableHeaderMultiSkill = _ => skillViewColumns
    .map( field =>  field.toTableHeader(field) )

const toTableElementMultiSkill = (val, _) => {
    return skillViewColumns.map(field => {
	return field.toTableElement(val, field)
    });
};



const firstnameField = {
    name: "Firstname",
    project: r => r.firstname,
    update: (r, v) => ({...r, firstname: v}),

    toInputElement: skillFieldDropdown(skillsDict),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    fromString: emptyFieldParser,
    
    fromDb: maybeNull(String)
};

const lastnameField = {
    name: "Lastname",
    project: r => r.lastname,
    update: (r, v) => ({...r, lastname: v}),

    
    toInputElement: skillFieldDropdown(skillsDict),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    fromString: emptyFieldParser,
    fromDb: maybeNull(String)
};

const dobField = {
    name: "Date of Birth",
    project: r => r.dob,
    update: (r, v) => ({...r, dob: v}),
    
    toInputElement: skillFieldDropdown(skillsDict),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    fromString: emptyFieldParser,
    fromDb: maybeNull(String)
};

const emailField = {
    name: "Email",
    project: r => r.email,
    update: (r, v) => ({...r, email: v}),
    
    toInputElement: skillFieldDropdown(skillsDict),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    fromString: emptyFieldParser,
    fromDb: maybeNull(String)
};

const skillField = {
    name: "Skill",
    project: r => r.skill,
    update: (r, v) => ({...r, skill: v}),

    toTableHeader: toTableHeaderMultiSkill,
    toTableElement: toTableElementMultiSkill,
    
    fromString: id,
    fromDb: String
};

const skillFieldDropdown = skillsDict => (newEmployeeInput, setNewEmployeeInput) => {
    return (<DropDownMenu
	onChange= { e => setNewEmployeeInput(oe => (
	    { ...oe, skill: e.target.value})) }
	
	possibleOptions={ Object.keys(skillsDict) }
	
	activeOption= { newEmployeeInput.skill }
	renderOptionFn= { x => skillsDict[x].skill_name }
	/>);
};

const skillFieldDynamic = skills => {
    const skillsDict = skillsToDict(skills);
    
    return ({
	name: "Skill",
	project: r => skillsDict[r.skill],
	update: (r, v) => ({...r, skill: v}),
	
	toTableHeader: toTableHeaderMultiSkill,
	toTableElement: toTableElementMultiSkill,

	toInputElement: skillFieldDropdown(skillsDict),
	
	fromString: id,
	fromDb: String
    });
}

const skillFieldDropdown = (newEmployeeInput, setNewEmployeeInput) => {
    return null;
};

const activeField = {
    name: "Active",
    project: r => r.active,
    update: (r, v) => ({...r, active: v}),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,

    toInputElement: 
    
    fromString: emptyFieldParser,
    fromDb: maybeNull(Bool)
};

const employeeTableFieldsDynamic = skills =>(
    [ firstnameField
    , lastnameField
    , dobField
    , emailField
    , skillFieldDynamic(skills)
	/* , activeField */
]);

const employeeTableFields =
    [ firstnameField
    , lastnameField
    , dobField
    , emailField
    , skillField
	/* , activeField */
    ];

// Either [String] Employee
const parseNewEmployeeInput = newEmployeeInput => {
    const parsedValues =
	constructRecord(field => field.fromString(
	    field.project(newEmployeeInput)));
    console.log(parsedValues)
    return employeeTableFields.reduce((soFar, field) => {
	const parsedValue = field.project(parsedValues);
	console.log(parsedValue)
	return doEither(parsedValue
		      , valueOk => doEither(
			  soFar
			  , soFarOk => Ok(id)(field.update(soFarOk, valueOk))
			  , soFarErr => soFar)
		      , valueErr => doEither(
			  soFar
			  , soFarOk => Err(id)([valueErr])
			  , soFarErr => Err(id)([...soFarErr, valueErr])));
    }, Just(id)(parsedValues));
};


export { employeeTableFields,
	 employeeTableFieldsDynamic,
	 constructRecord,
	 employeeFromDb, employeeToString, employeeToDb, 
	 inputTypeToInitialValue,
	 parseNewEmployeeInput }
