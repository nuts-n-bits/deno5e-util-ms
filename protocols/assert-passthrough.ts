import { MyError } from "./error-warning-info"

export class AssertionTypeOfError extends MyError {}
export class AssertionSameConstructorError extends MyError {}
export class AssertionTruthyError extends MyError {}
export class AssertionFalsyError extends MyError {}
export class AssertionStrictEqualityError extends MyError {}
export class AssertionNotNullError extends MyError {}
export class AssertionNotNullOrUndefinedError extends MyError {}
export class AssertionNeverError extends MyError {}

export function assert_typeof(value : string, type : "string", comment? : string) : string
export function assert_typeof(value : number, type : "number", comment? : string) : number
export function assert_typeof(value : bigint, type : "bigint", comment? : string) : bigint
export function assert_typeof(value : bigint, type : "symbol", comment? : string) : bigint
export function assert_typeof(value : undefined, type : "undefined", comment? : string) : undefined
export function assert_typeof(value : Function, type : "function", comment? : string) : Function
export function assert_typeof(value : boolean, type : "boolean", comment? : string) : boolean
export function assert_typeof(value : any, type : any, comment? : string) {
    if(typeof value === type) return value
    else throw new AssertionTypeOfError(100, comment)
}

export function assert_constructor<T extends new (...args:any[]) => any>(item : any, constructor : T, comment? : string) : InstanceType<T> {
    if(item instanceof constructor) return item
    else throw new AssertionSameConstructorError(100, comment)
}

export function assert_truthy<T>(value : T, comment? : string) : T {
    if(value) return value
    else throw new AssertionTruthyError(100, comment)
}

export function assert_falsy<T>(value : T, comment? : string) : T {
    if(!value) return value
    else throw new AssertionFalsyError(100, comment)
}

export function assert_strict_equality<T>(lhs : T, rhs : T, comment? : string) : T {
    if(lhs === rhs) return lhs
    else throw new AssertionStrictEqualityError(100, comment)
}

export function assert_not_null<T>(value : T|null, comment? : string) : (T extends null ? never : T)
export function assert_not_null<T>(value : T|null|undefined, comment? : string) : (T extends null ? never : T)|undefined
export function assert_not_null(value : any, comment? : any) {
    if(value === null) throw new AssertionNotNullError(100, comment)
    else { return value }
}

export function assert_not_undefined<T>(value : T|undefined, comment? : string) : (T extends undefined ? never : T)
export function assert_not_undefined<T>(value : T|null|undefined, comment? : string) : (T extends undefined ? never : T)|null
export function assert_not_undefined(value : any, comment? : string) {
    if(value === undefined) throw new AssertionNotNullOrUndefinedError(100, comment)
    else { return value }
}

export function assert_not_null_or_undefined<T>(value : T, comment? : string) : NonNullable<T> {
    if(value === null || value === undefined) { throw new AssertionNotNullOrUndefinedError(100, comment) }
    else { return value! }
}

export function assert_never(value : never, comment? : string) : never {
    throw new AssertionNeverError(100, comment)
}

