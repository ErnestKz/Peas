
const createNewEffectStack = effectStackHistory => {
    const newEffectStackHistory = [...effectStackHistory, []];
    const index = newEffectStackHistory.length - 1;
    const newEffectStackSubLens =
	{ project: effStackHistory => effStackHistory[index]
	, update: (effStackHistory, effStackUpdatedValue) => {
	    return effStackHistory.map((a, idx) => idx == index ? effStackUpdatedValue : a);
	}
	}
    return [newEffectStackHistory, newEffectStackSubLens];
};

const mkAddNewEffectStack = setEffectStackHistory => () => {
    const res = [null]
    // Assuming that the set functions are asynchronous, and block until it has set.
    setEffectStackHistory( effectStackHistory => {
	const [newEffectStackHistory, newEffectStackSubLens] = createNewEffectStack(effectStackHistory);
	res[0] = newEffectStackSubLens;
	return newEffectStackHistory;
    });
    
    const setNewEffectStack = updateEffectStackValue => setEffectStackHistory(effectStackHistory => {
	const newEffectStackSubLens = res[0];
	const oldEffectStackValue = newEffectStackSubLens.project(effectStackHistory);
	const newEffectStackValue = updateEffectStackValue(oldEffectStackValue);
	return newEffectStackSubLens.update(effectStackHistory, newEffectStackValue);
    });
    return setNewEffectStack;
};

export { createNewEffectStack, mkAddNewEffectStack };
