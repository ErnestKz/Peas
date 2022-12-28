import { Just, Nothing, Maybe,
	 Err, Ok, doEither, maybeNull,
	 Bool, 
	 dispatchTypeclass,
	 id, const_ }
from '../types.js';




const constructSkillRecord = f => skillTableFields
    .reduce((acc, field) => field.update(acc, f(field)), {});

const skillFromDb = skill => (
    constructSkillRecord(field => field.fromDb(field.project(skill))));



const skillsToString = x => dispatchTypeclass(skillsToStringDispatchMap, x);

const skillsToStringDispatchMap =
    { "_JUST": val => skillsToString(val._VALUE),
      "_NOTHING": _ => "EMPTY",
      "string": id,
      "number": x => x.toString(),
      "bool": b => b.toString()
    };




const toTableHeaderSingle = field => {
    return (<th className="columnHead">{ field.name }</th>)
};

const toTableElementSingle = (val, field) => {
    const renderedValue = skillsToString(val)
    return (<td> { renderedValue } </td>)
};



const skillIdField = {
    name: "Skill ID",
    project: r => r.skill_id,
    update: (r, v) => ({...r, skill_id: v}),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    fromDb: String
};


const skillNameField = {
    name: "Skill Name",
    project: r => r.skill_name,
    update: (r, v) => ({...r, skill_name: v}),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    fromDb: String
};


const skillDescriptionField = {
    name: "Skill Description",
    project: r => r.skill_description,
    update: (r, v) => ({...r, skill_description: v}),

    toTableHeader: toTableHeaderSingle,
    toTableElement: toTableElementSingle,
    
    fromDb: maybeNull(String)
};


const skillTableFields = [ skillIdField
			 , skillNameField
			 , skillDescriptionField ];

export { skillFromDb };
