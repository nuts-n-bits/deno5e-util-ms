
import { set_json } from "../json-store"

export type Severeness = 1|10|100|1000

export class MyError extends Error {

    constructor(public severeness : Severeness, message? : string) {
        super(message)
    }
}

export class CatastrophicError extends MyError {

    constructor(message? : string) {
        super(1000, message)
    }

    hard_report() : this {
        const date_now = Date.now()
        set_json(`catastrophic-error-${this.constructor.name.toLowerCase()}-${date_now}`, this.stack)
        console.error(this.stack)
        return this
    }

    process_exit() : this {
        this.hard_report()
        process.exit()
        return this
    }
}

export class CatastrophicRuntimeResourceDepletionError extends CatastrophicError {}
export class CatastrophicThousandForLoopRanToCompletionError extends CatastrophicError {}

export class ProductionSafeguardError extends MyError {}
export class NotImplementedError extends MyError {}
export class NotFinishedImplementingError extends MyError {}


// above errors are intended to stay even no one actively uses them.