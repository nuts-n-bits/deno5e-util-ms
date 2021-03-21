export class AssertionTypeOfError extends Error {}
export class AssertionSameConstructorError extends Error {}
export class AssertionTruthyError extends Error {}
export class AssertionFalsyError extends Error {}
export class AssertionStrictEqualityError extends Error {}
export class AssertionNotNullError extends Error {}
export class AssertionNotNullOrUndefinedError extends Error {}
export class AssertionNeverError extends Error {}

// Verify functions is for compile time type hinting. It's for TS to throw TS errors and will never throw a JS error
export function type_check<T>(v: T): T
export function type_check<T, U>(v1: T, v2: U): [T, U]
export function type_check<T, U, V>(v1: T, v2: U, v3: V): [T, U, V]
export function type_check<T, U, V, W>(v1: T, v2: U, v3: V, v4: W): [T, U, V, W]
export function type_check<T, U, V, W, X>(v1: T, v2: U, v3: V, v4: W, v5: X): [T, U, V, W, X]
export function type_check<T, U, V, W, X, Y>(v1: T, v2: U, v3: V, v4: W, v5: X, v6: Y): [T, U, V, W, X, Y]
export function type_check<T, U, V, W, X, Y, Z>(v1: T, v2: U, v3: V, v4: W, v5: X, v6: Y, v7: Z): [T, U, V, W, X, Y, Z]
export function type_check(...args: any[]): any {
    if(args.length === 1) { return args[0] }
    else { return args }
}

export function type_check_never(value: never): never
export function type_check_never(value: never): void { return }

// Assert functions care just as much about compile time type correctness, but it will also throw JS error should runtime type check fails.
export function assert_typeof(value: string, type: "string", comment?: string): string
export function assert_typeof(value: number, type: "number", comment?: string): number
export function assert_typeof(value: bigint, type: "bigint", comment?: string): bigint
export function assert_typeof(value: bigint, type: "symbol", comment?: string): bigint
export function assert_typeof(value: undefined, type: "undefined", comment?: string): undefined
export function assert_typeof(value: Function, type: "function", comment?: string): Function
export function assert_typeof(value: boolean, type: "boolean", comment?: string): boolean
export function assert_typeof(value: any, type: any, comment?: string) {
    if(typeof value === type) { return value }
    else throw new AssertionTypeOfError(comment)
}

export function assert_constructor<T extends new (...args:any[]) => any>(item: InstanceType<T>, constructor: T, comment?: string): InstanceType<T> {
    if(item as any instanceof constructor) { return item }
    else throw new AssertionSameConstructorError(comment)
}

export function assert_truthy<T>(value: T, comment?: string): T {
    if(value) { return value }
    else throw new AssertionTruthyError(comment)
}

export function assert_falsy<T>(value: T, comment?: string): T {
    if(!value) { return value }
    else throw new AssertionFalsyError(comment)
}

export function assert_strict_equality<T>(lhs: T, rhs: T, comment?: string): T {
    if(lhs === rhs) { return lhs }
    else throw new AssertionStrictEqualityError(comment)
}

export function assert_not_null<T>(value: T|null, comment?: string): (T extends null ? never : T)
export function assert_not_null<T>(value: T|null|undefined, comment?: string): (T extends null ? never : T)|undefined
export function assert_not_null(value: any, comment?: any) {
    if(value === null) throw new AssertionNotNullError(comment)
    else { return value }
}

export function assert_not_undefined<T>(value: T|undefined, comment?: string): (T extends undefined ? never: T)
export function assert_not_undefined<T>(value: T|null|undefined, comment?: string): (T extends undefined ? never: T)|null
export function assert_not_undefined(value: any, comment?: string) {
    if(value === undefined) throw new AssertionNotNullOrUndefinedError(comment)
    else { return value }
}

export function assert_not_null_or_undefined<T>(value: T, comment?: string): NonNullable<T> {
    if(value === null || value === undefined) { throw new AssertionNotNullOrUndefinedError(comment) }
    else { return value! }
}

export function assert_never(value: never, comment?: string): never {
    throw new AssertionNeverError(comment)
}

