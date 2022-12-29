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

const toTableElementSingle = (val, field) => {
    const renderedValue = toString(field.project(val));
    return (<td> { renderedValue } </td>)
};

export { constructRecord
       , toString
       , toDb
       , toTableHeaderSingle
       , toTableElementSingle
       , fromDb };
