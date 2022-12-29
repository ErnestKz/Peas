import { Just, Nothing, Maybe,
	 Err, Ok, doEither, maybeNull,
	 Bool, 
	 dispatchTypeclass,
	 id, const_ }
from '../types.js';

import React from 'react';

const dictFmap = (f, r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, f(v)]));

const toString = x => dispatchTypeclass(dataTypeToStringDispatchMap, x);

const dataTypeToStringDispatchMap =
    { "_JUST": val => toString(val._VALUE),
      "_NOTHING": _ => "EMPTY",
      "Dict": r => dictFmap(toString, r),
      "string": id,
      "number": x => x.toString(),
      "bool": b => b.toString()
    };

const toDb = x => dispatchTypeclass(toDbDispatchMap, x);

const toDbDispatchMap = {
    "_JUST": val => toDb(val._VALUE),
    "_NOTHING": _ => null,
    "Dict": r => dictFmap(toDb, r),
    "string": id,
    "number": id,
    "bool": id
};

const constructRecord = fields => f => fields
    .reduce((acc, field) => field.update(acc, f(field)), {});

const fromDb = fields => rawInput => {
    return (constructRecord(fields)(
	field => field.fromDb(field.project(rawInput))));
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
    const tableConfig = {
	, toTableHeader: toTableHeaderSingle(name)
	, toTableElement: toTableElementSingle
    };
    return tableConfig 
};

const inputTypeToInputConfig = (name, inputType, inputParse) => {
    switch (inputType) {
	case "text": return (
	    { toInputElement: inputField(name, inputType),
	    , inputParse: inputParse });
	    
	case "date": return (
	    { toInputElement: inputField(name, inputType),
	    , inputParse: inputParse });
	    
	case "email": return (
	    { toInputElement: inputField(name, inputType),
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

export { constructRecord
       , toString
       , toDb
       , toTableHeaderSingle
       , toTableElementSingle
       , fromDb
       , emptyFieldParser
       , mkFieldTypeA
       , mkFieldTypeB
       , mkField
       , tableConfigSingleColumn };
