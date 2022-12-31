import { Just
       , Nothing
       , Maybe
       , Err
       , Ok
       , doEither
       , maybeNull
       , Bool
       , dispatchTypeclass
       , id
       , const_ } from '../types.js';

import React from 'react';

const dictFmap = (f, r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, f(v)]));

const toString = x => dispatchTypeclass(dataTypeToStringDispatchMap, x);

const boolToString = b => b ? "Yes" : "No";

const dataTypeToStringDispatchMap =
    { "_JUST": val => toString(val._VALUE),
      "_NOTHING": _ => "EMPTY",
      "Dict": r => dictFmap(toString, r),
      "null": _ => "EMPTY",
      "string": id,
      "number": x => x.toString(),
      "boolean": boolToString
    };

const toDb = x => dispatchTypeclass(toDbDispatchMap, x);

const toDbDispatchMap = {
    "_JUST": val => toDb(val._VALUE),
    "_NOTHING": _ => null,
    "null": _ => null,
    "Dict": r => dictFmap(toDb, r),
    "string": id,
    "number": id,
    "boolean": id
};

const toInput = x => dispatchTypeclass(toInputDispatchMap, x);

const toInputDispatchMap = {
    "_JUST": val => toInput(val._VALUE),
    "_NOTHING": _ => "",
    "Dict": r => dictFmap(toInput, r),
    "string": id,
    "number": id,
    "boolean": id
};

const constructRecord = fields => f => fields
    .reduce((acc, field) => field.update(acc, f(field)), {});

// fields require fromDb, and project
const fromDb = fields => rawInput => {
    return (constructRecord(fields)(
	field => field.fromDb(field.project(rawInput))));
};

const defaultValues = fields => {
    return constructRecord(fields)(field => field.inputDefault);
};

const toTableHeaderSingle = name => {
    return (<th className="columnHead">{ name }</th>);
};

const toTableElementSingle = ( value ) => {
    const renderedValue = toString(value);
    return (<td> { renderedValue } </td>)
};

// String -> Either String (Maybe String)
const emptyFieldParser = s => {
    return Ok(Maybe(String))(s == "" ? Nothing : Just(String)(s))
};

const inputField = (name, inputType) => (value, setValue) => (
    <li>
	<p> { name } :</p>
	<input type ={ inputType }
	       value = { value }
	       onChange = { e => setValue(const_(e.target.value)) } >
	</input>
    </li>
);

const mkField = (lens, fromDb, tableConfig, inputConfig) => {
    const totalConfig = {
	...tableConfig,
	...inputConfig,
	...lens,
	fromDb: fromDb
    };
    return totalConfig;
};

const tableConfigSingleColumn = name => {
    const tableConfig = { toTableHeader: toTableHeaderSingle(name)
			, toTableElement: toTableElementSingle };
    return tableConfig 
};

// use one list of employee fields for one thing
// and the another list of employee fields for another
// 1. recieve and use from db on all employee fields
// 2. use sin id for employee table and input form
// 3. and keep the id in the closure/state


const maybeBoolParser_ = maybeBool => {
    if (maybeBool == "true" || maybeBool == true) {
	return (Just(Bool)(true));
    } else if (maybeBool == "false" || maybeBool == false) {
	return (Just(Bool)(false));
    } else {
	return Nothing;
    }
};

const maybeBoolParser = maybeBool => {
    return Ok(Maybe(Bool))(maybeBoolParser_(maybeBool))
};

const inputTypeToInputConfig = (name, inputType, inputParse) => {
    switch (inputType) {
	case "text": return (
	    { toInputElement: inputField(name, inputType)
	    , inputDefault: ""
	    , inputParse: inputParse });
	    
	case "date": return (
	    { toInputElement: inputField(name, inputType)
	    , inputDefault: ""
	    , inputParse: inputParse });
	    
	case "email": return (
	    { toInputElement: inputField(name, inputType)
	    , inputDefault: ""
	    , inputParse: inputParse });
	default:
	    throw new Error('No such input type config : ' + inputType);
    };
};

const mkFieldTypeA = (name, lens, fromDb, inputType, inputParse) => {
    const tableConfig = tableConfigSingleColumn(name);
    const inputConfig = inputTypeToInputConfig(name, inputType, inputParse);
    const totalConfig = {
	...tableConfig,
	...inputConfig,
	...lens,
	fromDb: fromDb
    };
    return totalConfig;
};

const mkFieldTypeB = (name, lens, fromDb) => {
    const tableConfig = tableConfigSingleColumn(name);
    const totalConfig = {
	...tableConfig,
	...lens,
	fromDb: fromDb
    };
    return totalConfig;
};

const prepend_new = r => {
    const newEntries = (Object.entries(r).map(([k, v]) => ["new_" + k, v]));
    return Object.fromEntries(newEntries);
};

const prepend_up = r => {
    const newEntries = (Object.entries(r).map(([k, v]) => ["up_" + k, v]));
    return Object.fromEntries(newEntries);
};

export { constructRecord
       , toString
       , toDb
       , toInput
       , prepend_new
       , prepend_up
       , toTableHeaderSingle
       , toTableElementSingle
       , fromDb
       , defaultValues
       , emptyFieldParser
       , mkFieldTypeA
       , mkFieldTypeB
       , mkField
       , tableConfigSingleColumn
       , maybeBoolParser};
