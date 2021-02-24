
export const any: any = Symbol()
/** In your example object, use or(t:T, u:U) to indicate that a field can be of either type T or U. 
 * Be conservative in using or() to build your example shape. Once used, make sure to eliminate access 
 * to the example shape directly, as the example shape is no longer type safe. or() will return an 
 * object that represents the input values, i.e. (or(t,u) instanceof Or) passes runtime, but Typescript 
 * will think (or(t,u): T|U) because this function reports the wrong return type to keep your shape 
 * object's inferred type clean */
export function or<T,U>(t:T,u:U): T|U
export function or<T,U,V>(t:T,u:U,v:V): T|U|V
export function or<T,U,V,W>(t:T,u:U,v:V,w:W): T|U|V|W
export function or<T,U,V,W,X>(t:T,u:U,v:V,w:W,x:X): T|U|V|W|X
export function or<T,U,V,W,X,Y>(t:T,u:U,v:V,w:W,x:X,y:Y): T|U|V|W|X|Y
export function or<T,U,V,W,X,Y,Z>(t:T,u:U,v:V,w:W,x:X,y:Y,z:Z): T|U|V|W|X|Y|Z
export function or<T,U,V,W,X,Y,Z,A>(t:T,u:U,v:V,w:W,x:X,y:Y,z:Z,a:A): T|U|V|W|X|Y|Z|A
export function or<T,U,V,W,X,Y,Z,A,B>(t:T,u:U,v:V,w:W,x:X,y:Y,z:Z,a:A,b:B): T|U|V|W|X|Y|Z|A|B
export function or<T,U,V,W,X,Y,Z,A,B,C>(t:T,u:U,v:V,w:W,x:X,y:Y,z:Z,a:A,b:B,c:C): T|U|V|W|X|Y|Z|A|B|C
export function or<T,U,V,W,X,Y,Z,A,B,C,D>(t:T,u:U,v:V,w:W,x:X,y:Y,z:Z,a:A,b:B,c:C,d:D): T|U|V|W|X|Y|Z|A|B|C|D
export function or(...candidates:any[]) { return new Or(candidates) }
export function maybe<T>(t: T) { return or(undefined, t) }

class Or {
    constructor(
        public candidates: any[]
    ) {}
}

export function json_shape_is<T>(
    parsed_json_object: any, 
    example_object: T, 
    allow_extra_fields: "in-test"|"in-example"|"in-neither"|"in-either" = "in-test"
): parsed_json_object is T {

    if (allow_extra_fields === "in-test") {
        return test_map_allow_extra_in_test[typeof example_object](parsed_json_object, example_object)
    }
    else if (allow_extra_fields === "in-example") {
        return test_map_allow_extra_in_example[typeof example_object](parsed_json_object, example_object)
    }
    else if (allow_extra_fields === "in-neither") {
        return test_map_allow_extra_in_test[typeof example_object](parsed_json_object, example_object) 
            && test_map_allow_extra_in_example[typeof example_object](parsed_json_object, example_object)
    }
    else if (allow_extra_fields === "in-either") {
        return test_map_allow_extra_in_test[typeof example_object](parsed_json_object, example_object) 
            || test_map_allow_extra_in_example[typeof example_object](parsed_json_object, example_object)
    }
    else {
        const _0: never = allow_extra_fields
        throw new Error("Parameter allow_extra_fields must be one of the following strings: 'in-test', 'in-example', 'in-neither' or 'in-either'.")
    }
}

const test_map_allow_extra_in_test = {
    "bigint": uh_oh,
    "string": c_string,
    "number": c_number,
    "boolean": c_boolean,
    "object": (test_subject: any, eg_type: any) => c_object(test_subject, eg_type, "in-test"),
    "function": uh_oh,
    "symbol": c_symbol,
    "undefined": c_undefined,
}

const test_map_allow_extra_in_example = {
    "bigint": uh_oh,
    "string": c_string,
    "number": c_number,
    "boolean": c_boolean,
    "object": (test_subject: any, eg_type: any) => c_object(test_subject, eg_type, "in-example"),
    "function": uh_oh,
    "symbol": c_symbol,
    "undefined": c_undefined,
}

function uh_oh(_test_subject: any, _eg_type: any): boolean {
    return false
}

function c_undefined(test_subject: any, _eg_type: any): boolean {
    return test_subject === undefined
}

function c_string(test_subject: any, _eg_type: string): boolean {
    return typeof test_subject === "string"
}

function c_number(test_subject: any, _eg_type: number): boolean {
    return typeof test_subject === "number"
}

function c_boolean(test_subject: any, _eg_type: boolean): boolean {
    return typeof test_subject === "boolean"
}

function c_symbol(test_subject: any, _eg_type: symbol): boolean {
    return test_subject === any
}

function c_object(test_subject: any, eg_type: any, allow_extra: "in-test"|"in-example"): boolean {
    if (eg_type instanceof Or) {
        for (const eg_element in eg_type.candidates) {
            if (json_shape_is(test_subject, eg_element)) { return true }
            else { continue }
        }
        return false
    }
    else if (eg_type === null) { return test_subject === null }
    else if (eg_type instanceof Array) {
        if(test_subject instanceof Array) {
            const test_fail_count = test_subject.map(test_element => {
                for (const eg_element of eg_type) {
                    if (json_shape_is(test_element, eg_element, allow_extra)) { return true }
                    else { continue }
                }
                return false
            }).filter(pass => pass !== true).length
            if (test_fail_count > 0) { return false }
            else { return true }
        }
        else { return false }
    }
    else {
        if(allow_extra === "in-test") {  // every field in example type must appear in test subject, but test obj can have unknown fields ("in-test")
            for(const [k, v] of Object.entries(eg_type)) {
                if (json_shape_is(test_subject[k], v, allow_extra)) { continue }
                else { return false }
            }
            return true
        }
        else {  // every field in test subject must appear in example obj, but example obj can have unknown fields ("in-example")
            for(const [k, v] of Object.entries(test_subject)) {
                if (json_shape_is(v, eg_type[k], allow_extra)) { continue }
                else { return false }
            }
            return true
        }
    }
}