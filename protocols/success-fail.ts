export class Success<T> {
    
    constructor(public value? : T) {}
}

export class Fail<T> {

    constructor(public value? : T) {}
}