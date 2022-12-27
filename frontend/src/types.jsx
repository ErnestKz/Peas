const id = e => e;
const const_ = (a => (_ => a))

const Just = e => ["_JUST", e];
const Nothing = ["_NOTHING"];
const Maybe = e => (e == null ? Nothing : Just(e));

const Err = e => ["_ERR", e];
const Ok = e =>  ["_OK", e];

/* const Just => a => e => ["_JUST", a(e)];
 * const Maybe = a => (e => (e == null ? Nothing : Just(a)(e)));
 * const Err = a => e => ["_ERR", a(e)];
 * const Ok = a => e =>  ["_OK", a(e)];
 *  */
const doEither = (either, okFn, errFn) => {
    if (either[0] == "_ERR"){
	return errFn(either[1]);
    } else {
	return okFn(either[1]);
    }
};

function dispatchTypeclass ( dispatchMap, value ) {
    console.log(typeof value)
    
    if (Array.isArray(value)) {
	const constructor = value[0];
	if (constructor in dispatchMap) {
	    console.log("Constructor dispatch")
	    return dispatchMap[constructor](value)
	} else {
	    // TODO
	    // how do we know if it is not some other constructor?
	    // represent the type in a different way
	    console.log("Array dispatch")
	    return dispatchMap["Array"](value)
	} 
    } else {
	const valuetype = typeof value;
	if (valuetype in dispatchMap) {
	    console.log("Valuetype dispatch")
	    return dispatchMap[valuetype](value);
	} else {
	    throw new Error(
		'Typeclass instance for ' +
		constructor +
		' not found in the dispatchMap.');
	}
    }
};


export { id, const_,
	 Just, Nothing, Maybe,
	 Err, Ok, doEither,
	 dispatchTypeclass }
