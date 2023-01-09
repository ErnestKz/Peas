import React from 'react';

import { id
       , const_
    
       , Just
       , Nothing
       , Maybe
       , maybeNull

       , Bool
       , String
    
       , Err
       , Ok
       , doEither
    
       , dispatchTypeclass } from '../types.js';

import { DropDownMenu } from '../ui/DropDownMenu.js'

import { constructRecord
       , toString
       , fromDb
       , maybeBoolParser
       , toInput
       , defaultValues
       , toTableHeaderSingle
       , toTableElementSingle
       , tableConfigSingleColumn
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


const idField = mkField(
    ({ project: r => r.employee_id
       , update: (r, v) => ({...r, employee_id: v})})
    , String
    , {}
    , {}
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
    , emptyFieldParser
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
    { toInputElement: ((key, value, setValue) => (
	<li key={key} >
	    <DropDownMenu
		onChange = { e => setValue(const_(e.target.value)) }
		activeOption = { value }
		possibleOptions = { [true, false, null ] }
		renderOptionFn = { toString } />
	</li>
    ))
    , inputDefault: null
    , inputParse: maybeBoolParser });
// input parser for true false or null
/* String -> Either String (Maybe Boolean) */

const activeField = mkField(
    ({ project: r => r.active
     , update: (r, v) => ({...r, active: v})})
    , maybeNull(Bool)
    , tableConfigSingleColumn("Active")
    , activeDropDownInputConfig );


const skillViewColumns = [ skillNameField, skillDescriptionField ];

const toTableHeaderMultiSkill = skillViewColumns
    .map( field => field.toTableHeader )

const toTableElementMultiSkill = skillsDict => skill_id => {
    return skillViewColumns.map(field => {
	return field.toTableElement(field.project( skillsDict[skill_id] ));
    });
};

const skillDropDownInputConfig = skillsDict => {
    const inputElement = (key, skill, setSkill) => (
	<li key={key}>
	    <DropDownMenu
		onChange = { e => setSkill(const_(e.target.value)) }
		activeOption = { skill }
		possibleOptions = { Object.keys(skillsDict) }
		renderOptionFn = { x => skillsDict[x].skill_name }/>
	</li>);
    return ({ toInputElement: inputElement
	    , inputDefault: Object.keys(skillsDict)[0]
	    , inputParse: emptyFieldParser })
};

const skillFieldDynamic = skills => {
    const skillsDict = skillsToDict(skills);
    console.log("hi agian", skillsDict);
    return mkField(
	({ project: r => r.skill
	 , update: (r, v) => ({...r, skill: v})})
	, String
	, ({ toTableHeader: toTableHeaderMultiSkill
	   , toTableElement: toTableElementMultiSkill(skillsDict) })
	, skillDropDownInputConfig(skillsDict) );
};

const skillsField = (
    { project: (r => r.skill)
    , update: (r, v) => ({...r, skill: v})
    , inputDefault: "Please Select"
    , fromDb: String });

const employeeTableFieldsDynamic = skills => (
    [ firstnameField
    , lastnameField
    , dobField
    , emailField
    , skillFieldDynamic(skills)
    , activeField
]);

const employeeExtractValuesForInputFields = (
    [ firstnameField
    , lastnameField
    , dobField
    , emailField
    , skillsField
    , activeField ]);

const extractForInputFields = employee => {
    const employeeInputs = constructRecord(
	employeeExtractValuesForInputFields)(
	    field => toInput(field.project(employee)));
    return employeeInputs;
};


const employeeFromDbFields = (
    [ idField
    , firstnameField
    , lastnameField
    , dobField
    , emailField
    , skillsField
    , activeField ]);

// Either [String] Employee
const parseNewEmployeeInput = (tableConfig, newEmployeeInput) => {
    const parsedValues = constructRecord(tableConfig)(field => field.inputParse(field.project(newEmployeeInput)));
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

const employeeFromDb = fromDb(employeeFromDbFields);

export { employeeTableFieldsDynamic
       , parseNewEmployeeInput
    
       , employeeFromDb
       , extractForInputFields };
