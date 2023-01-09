import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const RootEffectStacks = ({ effectStackHistory }) => {
    
    const effectStacks = effectStackHistory
	.map((effectStack, idx) => (
	    [ (<li key={idx+"root"}> { effectStack[0].info } </li>)
	    , (<li key={idx+"sub"}>
		<ul>
		    { effectStack.map((e, idx2) => (
			<li key={idx2}>
			    {e.eventType}
			</li>))
		    }
		</ul>
	    </li>)
	]));
    
    return (<ul> { effectStacks.flat() } </ul>);
};

export { RootEffectStacks }
