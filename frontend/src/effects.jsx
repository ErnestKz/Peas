import { const_ } from './types.js';
import { employeeFromDb } from './employee/employee.js';
import { skillFromDb } from './employee/skill.js';

const fetchResponseError = (url, req) => {
    const okFn = r => r.ok ? r.json() : Promise.reject(r);
    const errFn = Promise.reject;
    return fetch(url, req).then(okFn, errFn);
};

const endWrapOk = fa => a => { fa(a); return a};
const endWrapErr = fa => a => { fa(a); return Promise.reject(a)}

const mkAddStackMessage = (setStack => (msg => {
    const appendToStack = stack => ([...stack, msg])
    setStack(appendToStack)
}));

const mkCommandWithEff = (initMsg, okMsg, failMsg) => asyncEffect => (setStack, initMsgValue) => effectInput => {
    const addStackMessage = mkAddStackMessage(setStack);
    /* here the bug */
    const okPassthrough = endWrapOk(a => {
	addStackMessage(okMsg(a))
    });
    const errPassthrough = endWrapErr(a => {
	addStackMessage(failMsg(a))
    });
    
    addStackMessage(initMsg(initMsgValue));
    return asyncEffect(effectInput).then(okPassthrough, errPassthrough)
};


const baseUrl = "http://localhost:8081/";
const employeeRoute = baseUrl + "employee";



const getEmployeesReq = {
    method: "GET" 
};

const getEmployeesIORequest = (_) => {
    return fetchResponseError(employeeRoute, getEmployeesReq).then(e => e.map(employeeFromDb))
};



const skillsRoute = baseUrl + "skills";

const getSkillsReq = {
    method: "GET" 
};

const getSkillsIORequest = (_) => {
    return fetchResponseError(skillsRoute, getSkillsReq)
	.then(e => e.map(skillFromDb))
};



const newEmployeeReq = data => ({
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});

const newEmployeeIORequest = employeeDbObject => {
    return fetchResponseError(employeeRoute, newEmployeeReq(employeeDbObject))
	.then(e => e.map(employeeFromDb))
};

const mkGetEmployeesSendMessage = a => {
    const message = { eventType: "GetEmployeesSend",
		      info: a };
    return message;
};

const mkGetEmployeesReceiveOkMessage = a => {
    const message = { eventType: "GetEmployeesReceiveOk",
		      info: a };
    return message;
};

const mkGetEmployeesReceiveErrMessage = a => {
    const message = { eventType: "GetEmployeesReceiveErr",
		      info: a };
    return message;
};

const mkGetEmployeesWithEffect = mkCommandWithEff(
    mkGetEmployeesSendMessage,
    mkGetEmployeesReceiveOkMessage,
    mkGetEmployeesReceiveErrMessage);

const getEmployeesCommandIO = mkGetEmployeesWithEffect(getEmployeesIORequest);



const mkNewEmployeeSendMessage = a => {
    const message = { eventType: "NewEmployeeSend",
		      info: a };
    return message;
};

const mkNewEmployeeReceiveOkMessage = a => {
    const message = { eventType: "NewEmployeeReceiveOk",
		      info: a };
    return message;
};

const mkNewEmployeeReceiveErrMessage = a => {
    const message = { eventType: "NewEmployeeReceiveErr",
		      info: a };
    return message;
};

const mkNewEmployeeeWithEffect = mkCommandWithEff(
    mkNewEmployeeSendMessage,
    mkNewEmployeeReceiveOkMessage,
    mkNewEmployeeReceiveErrMessage);

const newEmployeeCommandIO = mkNewEmployeeeWithEffect(newEmployeeIORequest);




const mkGetSkillsSendMessage = a => {
    const message = { eventType: "GetSkillsSend",
		      info: a };
    return message;
};

const mkGetSkillsReceiveOkMessage = a => {
    const message = { eventType: "GetSkillsReceiveOk",
		      info: a };
    return message;
};

const mkGetSkillsReceiveErrMessage = a => {
    const message = { eventType: "GetSkillsReceiveErr",
		      info: a };
    return message;
};

const mkGetSkillseWithEffect = mkCommandWithEff(
    mkGetSkillsSendMessage,
    mkGetSkillsReceiveOkMessage,
    mkGetSkillsReceiveErrMessage);

const getSkillsCommandIO = mkGetSkillseWithEffect(getSkillsIORequest);

export { getEmployeesCommandIO, newEmployeeCommandIO, getSkillsCommandIO }
