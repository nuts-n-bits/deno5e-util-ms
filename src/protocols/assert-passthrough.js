export class AssertionTypeOfError extends Error {
}
export class AssertionSameConstructorError extends Error {
}
export class AssertionTruthyError extends Error {
}
export class AssertionFalsyError extends Error {
}
export class AssertionStrictEqualityError extends Error {
}
export class AssertionNotNullError extends Error {
}
export class AssertionNotNullOrUndefinedError extends Error {
}
export class AssertionNeverError extends Error {
}
export function type_check(...args) {
    if (args.length === 1) {
        return args[0];
    }
    else {
        return args;
    }
}
export function type_check_never(_value) { return; }
export function assert_typeof(value, type, comment) {
    if (typeof value === type) {
        return value;
    }
    else
        throw new AssertionTypeOfError(comment);
}
export function assert_constructor(item, constructor, comment) {
    if (item instanceof constructor) {
        return item;
    }
    else
        throw new AssertionSameConstructorError(comment);
}
export function assert_truthy(value, comment) {
    if (value) {
        return value;
    }
    else
        throw new AssertionTruthyError(comment);
}
export function assert_falsy(value, comment) {
    if (!value) {
        return value;
    }
    else
        throw new AssertionFalsyError(comment);
}
export function assert_strict_equality(lhs, rhs, comment) {
    if (lhs === rhs) {
        return lhs;
    }
    else
        throw new AssertionStrictEqualityError(comment);
}
export function assert_not_null(value, comment) {
    if (value === null)
        throw new AssertionNotNullError(comment);
    else {
        return value;
    }
}
export function assert_not_undefined(value, comment) {
    if (value === undefined)
        throw new AssertionNotNullOrUndefinedError(comment);
    else {
        return value;
    }
}
export function assert_not_null_or_undefined(value, comment) {
    if (value === null || value === undefined) {
        throw new AssertionNotNullOrUndefinedError(comment);
    }
    else {
        return value;
    }
}
export function assert_never(_value, comment) {
    throw new AssertionNeverError(comment);
}
//# sourceMappingURL=assert-passthrough.js.map