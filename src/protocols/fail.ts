export class Fail<T> {

    constructor(public readonly value: T) {}
    
    static new<U>(val: U): Fail<U> { return new Fail(val) }
    static void(): Fail<void> { return new Fail(undefined) }
}


