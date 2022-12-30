const mkSetSubState = (setState, lens) => {
    const setSubState = ( subStateUpdateFn ) => {
	return setState( oldState => {
	    const newSubState = subStateUpdateFn(lens.project(oldState))
	    return lens.update(oldState, newSubState)
	});
    }
    return setSubState;
};

const composeLens = (lensAB, lensBC) => {
    const lensAC = { project: s => lensBC.project(lensAB.project(s))
		   , update: (oldA, newC) => {
		       const oldB = lensAB.project(oldA);
		       const newB = lensBC.update(oldB, newC);
		       const newA = lensAB.update(oldA, newB);
		       return newA;
		   } };
    return lensAC;
};

export { mkSetSubState, composeLens };
