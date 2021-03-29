export function is_not_null<T>(value_in_question: T|null): value_in_question is T {

    return value_in_question !== null
}

export function is_not_undefined<T>(value_in_question: T|undefined): value_in_question is T {

    return value_in_question !== undefined
}

export function is_not_null_or_undefined<T>(value_in_question: T|null|undefined): value_in_question is T {

    return value_in_question !== null && value_in_question !== undefined
}