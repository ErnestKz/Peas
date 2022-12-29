import React from 'react';

import { Just, Nothing, Maybe,
	 Err, Ok, doEither, maybeNull,
	 Bool, 
	 dispatchTypeclass,
	 id, const_ }
from '../types.js';

import { DropDownMenu } from '../ui/DropDownMenu.js'

import { constructRecord
       , toString
       , fromDb
       , toTableHeaderSingle
       , toTableElementSingle }
from './common.js';

import { skillTableFields
       , skillIdField
       , skillNameField
       , skillDescriptionField
       , skillsToDict } from './skill.js';


// String -> Either String (Maybe String)
const emptyFieldParser = s => {
    return Ok(Maybe(String))(s == "" ? Nothing : Just(String)(s))
};


// - input element will just be a text box
//   - and what input parameters am i taking for the input?
//   - (newEmployeeInput, setNewEmployeeInput), probably can generate
//     the lenses for each field and hence the specialised lenses
// - fromString, should be parseInput
//    - parseInput can then verify if selection is part of enum

// the name field can be factored out into the respective column
// headers and input fields

// each field can be a function with options that determines how
// the field description should be constructed
//const mkField = (name, lens) => {
//};


const textInputField = name => (value, setValue)  => (
    <li>
	<p> { name } :</p>
	<input type ="text"
	       value = { value }
	       onChange = { e => setValue(const_(e.target.value)) } >
	</input>
    </li>
);

const firstnameField = {
    name: "Firstname",
    
    project: r => r.firstname,
    update: (r, v) => ({...r, firstname: v}),

    fromDb: maybeNull(String)

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    toInputElement: skillFieldDropdown(skillsDict),
    parseInput: emptyFieldParser,
};

const lastnameField = {
    name: "Lastname",
    
    project: r => r.lastname,
    update: (r, v) => ({...r, lastname: v}),

    fromDb: maybeNull(String)

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    toInputElement: skillFieldDropdown(skillsDict),
    parseInput: emptyFieldParser,


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


const skillViewColumns = [ skillNameField, skillDescriptionField ];

const toTableHeaderMultiSkill = _ => skillViewColumns
    .map( field => field.toTableHeader(field) )

const toTableElementMultiSkill = (val, _) => {
    return skillViewColumns.map(field => {
	return field.toTableElement(val, field)
    });
};

const skillFieldDropdownNew = skillsDict => (skill, setSkill) => (
    <li><DropDownMenu
	onChange = { e => setSkill(const_(e.target.value)) }
	activeOption = { skill }
	possibleOptions = { Object.keys(skillsDict) }
	renderOptionFn = { x => skillsDict[x].skill_name }
	/>
    </li>);

const skillFieldDynamic = skills => {
    const skillsDict = skillsToDict(skills);
    
    return ({
	name: "Skill",
	project: r => skillsDict[r.skill],
	update: (r, v) => ({...r, skill: v}),
	
	toTableHeader: toTableHeaderMultiSkill,
	toTableElement: toTableElementMultiSkill,

	toInputElement: skillFieldDropdown(skillsDict),
	
	validate: id,
	fromDb: String
    });
};

const activeField = {
    name: "Active",
    project: r => r.active,
    update: (r, v) => ({...r, active: v}),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,

    toInputElement: 
    
    // fromString: emptyFieldParser,
    fromDb: maybeNull(Bool)
};


const employeeTableFieldsDynamic = skills => (
    [ firstnameField
    , lastnameField
    , dobField
    , emailField
    , skillFieldDynamic(skills)
	/* , activeField */
]);


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
