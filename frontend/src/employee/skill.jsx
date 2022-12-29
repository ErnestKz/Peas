import React from 'react';

import { Just, Nothing, Maybe,
	 Err, Ok, doEither, maybeNull,
	 Bool, String,
	 dispatchTypeclass,
	 id, const_ }
from '../types.js';

import { mkFieldTypeB }
from './common.js';

const skillIdField = mkFieldTypeB(
    "Skill ID"
    , ({project: r => r.skill_id
      , update: (r, v) => ({...r, skill_id: v})})
    , String );

const skillNameField = mkFieldTypeB(
    "Skill Name"
    , ({project: r => r.skill_name
      , update: (r, v) => ({...r, skill_name: v})})
    , String );


const skillDescriptionField = mkFieldTypeB(
    "Skill Description"
    , ({project: r => r.skill_description
      , update: (r, v) => ({...r, skill_description: v})})
    , maybeNull(String) );

const skillsToDict = skills => skills
    .reduce((acc, skill) => {
	acc[skill.skill_id] = skill;
	return acc;
    }, {});

export { skillIdField
       , skillNameField
       , skillDescriptionField
       , skillsToDict };
