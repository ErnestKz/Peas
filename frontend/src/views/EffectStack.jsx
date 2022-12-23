import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const RootEffectStacks = ({ effectStackHistory }) => {
    
    const effectStacks = effectStackHistory
	.map(effectStack => (<EffectStackDetails effectStack={effectStack} />))
    
    return (<ul> {effectStacks} </ul>);
};

const EffectStackDetails = ( { effectStack } ) => {
    return ([(<li> { effectStack[0].info } </li>),
	     (<li> <ul>{ effectStack.map(e => (<li>{e.eventType}</li>)) }</ul> </li>)]);
};

export { RootEffectStacks }
