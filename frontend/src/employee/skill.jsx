import React from 'react';

import { Just, Nothing, Maybe,
	 Err, Ok, doEither, maybeNull,
	 Bool, 
	 dispatchTypeclass,
	 id, const_ }
from '../types.js';

import { constructRecord
       , toString
       , fromDb
       , toTableHeaderSingle
       , toTableElementSingle }
from './common.js';


const skillIdField = {
    name: "Skill ID",
    
    project: r => r.skill_id,
    update: (r, v) => ({...r, skill_id: v}),

    fromDb: String

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
};


const skillNameField = {
    name: "Skill Name",
    
    project: r => r.skill_name,
    update: (r, v) => ({...r, skill_name: v}),

    fromDb: String

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
};


const skillDescriptionField = {
    name: "Skill Description",
    
    project: r => r.skill_description,
    update: (r, v) => ({...r, skill_description: v}),

    fromDb: maybeNull(String)

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
};


const skillTableFields = [ skillIdField
			 , skillNameField
			 , skillDescriptionField ];

const skillsToDict = skills => skills
    .reduce((acc, skill) => {
	acc[skill.skill_id] = skill;
	return acc;
    }, {});

export { skillFromDb
       , skillIdField
       , skillNameField
       , skillDescriptionField
       , skillsToString
       , skillsToDict };
