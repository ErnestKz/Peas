const id = e => e;
const const_ = (a => (_ => a))

const maybeNull = a => (e => {
    if (e == null) {
	return Nothing;
    } else {
	return Just(a)(e);
    }
});

const Maybe = a => v => {
    const c = v._CONS;
    switch(c){
	case '_JUST':
	    return ({...v ,_VALUE: a(v._VALUE)});
	case '_NOTHING':
	    return v;
	default:
	    throw new Error('Maybe type verifcation failed for value: ' + v);
    }
};

const String = e => {
    const t = (typeof e);
    if (t == "string"){
	return e;
    } else {
	throw new Error('String type verifcation failed for value: ' + e)
    }
};

const Bool = e => {
    const t = (typeof e);
    if (t == "boolean"){
	return e;
    } else {
	throw new Error('Bool type verifcation failed for value: ' + e)
    }
};

/* const Num => e => e; */

const Just = a => e => (
    { _CONS: "_JUST"
    , _VALUE: a(e)  });

const Nothing = ({ _CONS: "_NOTHING" });

const Err = a => e => ({ _CONS: "_ERR"
		       , _VALUE: a(e)});


const Ok = a => e => ({ _CONS: "_OK"
		      , _VALUE: a(e)});

const doEither = (either, okFn, errFn) => {
    if (either._CONS == "_ERR"){
	return errFn(either._VALUE);
    } else {
	return okFn(either._VALUE);
    }
};


// todo can use a more abstract dispatcher function so that it checks
// if the key exists in the dictionary
function dispatchTypeclass ( dispatchMap, value ) {
    
    if (value == null) {
	return dispatchMap["null"](value)
    }
    
    const constructor = value._CONS;
    if (constructor in dispatchMap) {
	/* console.log("Constructor dispatch") */
	return dispatchMap[constructor](value)
    } else if (constructor == undefined) {
	// Check if dictionary
	if (value.constructor == Object) {
	    /* console.log("Dictioinary dispatch") */
	    return dispatchMap["Dict"](value)
	}
	if (Array.isArray(value)) {
	    /* console.log("Array dispatch") */
	    return dispatchMap["Array"](value)
	}
	const valuetype = (typeof value);
	if (valuetype in dispatchMap) {
	    /* console.log("Valuetype dispatch") */
	    return dispatchMap[valuetype](value);
	}
    } else {
	throw new Error('Typeclass instance for ' +
	    valuetype + "/" + constructor + ' not found in the dispatchMap.');
    }
};


export { id
       , const_
    
       , Just
       , Nothing
       , Maybe
       , maybeNull

       , Bool
       , String
    
       , Err
       , Ok
       , doEither
    
       , dispatchTypeclass };
