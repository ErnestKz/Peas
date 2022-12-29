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
       , toTableElementSingle

       , mkFieldTypeA
       , mkField
       , emptyFieldParser }
from './common.js';

import { skillTableFields
       , skillIdField
       , skillNameField
       , skillDescriptionField
       , skillsToDict } from './skill.js';

const firstnameField = mkFieldTypeA(
    "First Name"
    , ({ project: r => r.firstname
       , update: (r, v) => ({...r, firstname: v})})
    , maybeNull(String)
    , "text"
    , emptyFieldParser
);

const lastnameField = mkFieldTypeA(
    "Last Name"
    , ({ project: r => r.lastname
       , update: (r, v) => ({...r, lastname: v})})
    , maybeNull(String)
    , "text"
    , emptyFieldParser
);

const dobField = mkFieldTypeA(
    "Date of Birth"
    , ({ project: r => r.dob
       , update: (r, v) => ({...r, dob: v})})
    , maybeNull(String)
    , "date"
    , id
);

const emailField = mkFieldTypeA(
    "Email"
    , ({ project: r => r.email
       , update: (r, v) => ({...r, email: v})})
    , maybeNull(String)
    , "email"
    , emptyFieldParser
);


const activeDropDownInputConfig = (
    { toInputElement: ((value, setValue) => (
	<li> Active: { value } </li>
    ))
    , inputParse: id });

const activeField = mkField(
    ({ project: r => r.active
       , update: (r, v) => ({...r, active: v})})
    , maybeNull(Bool)
    , tableConfigSingleColumn("Active")
    , activeDropDownInputConfig );




/*
const skillViewColumns = [ skillNameField, skillDescriptionField ];

const toTableHeaderMultiSkill = _ => skillViewColumns
    .map( field => field.toTableHeader(field) )

const toTableElementMultiSkill = (val, _) => {
    return skillViewColumns.map(field => {
	return field.toTableElement(val, field)
    });
};

 */

const skillDropDownInputConfig = skillsDict => {
    const inputElement = (skill, setSkill) => (
	<li><DropDownMenu
	    onChange = { e => setSkill(const_(e.target.value)) }
	    activeOption = { skill }
	    possibleOptions = { Object.keys(skillsDict) }
	    renderOptionFn = { x => skillsDict[x].skill_name }
	    />
	</li>);
    return ({ toInputElement: inputElement
	    , inputParse: id })
};

const skillFieldDynamic = skills => {
    const skillsDict = skillsToDict(skills);
    return mkField(
	({ project: r => r.skill
	   , update: (r, v) => ({...r, skill: v})})
	, String
	, tableConfigSingleColumn("Skill")
	, skillDropDownInputConfig(skillsDict) );
}


const employeeTableFieldsDynamic = skills => (
    [ firstnameField
    , lastnameField
    , dobField
    , emailField
    , skillFieldDynamic(skills)
    , activeField
]);



// need TODO this
// Either [String] Employee
const parseNewEmployeeInput = (tableConfig, newEmployeeInput) => {
    
    const parsedValues =
	constructRecord(tableConfig,
			field => field.inputParse(
			    field.project(newEmployeeInput)));
    
    console.log("Parsed values: ", parsedValues)
    return tableConfig.reduce((soFar, field) => {
	const parsedValue = field.project(parsedValues);
	return doEither(
	    parsedValue
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


export { employeeTableFieldsDynamic,
	 parseNewEmployeeInput }
