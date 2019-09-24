
import { MyError, Severeness } from "./protocols/error-warning-info"
import { Quick_queue } from "./functions/data-structure/quick-queue"
import { Deferred_job_queue } from "./functions/deferred-job-queue"

export type Error_report = [Date, Error, bigint, Severeness]
export type Visit_record = {ra: string, url: string, ua: string, date: Date, id: bigint}

export class Global_dict {

    private err_id = 0n
    private visit_id = 0n

    public get cumulative_error_count() { return this.err_id }
    public get cumulative_visit_count() { return this.visit_id }

    public readonly deferred_job_queue = new Deferred_job_queue()

    public readonly error_collection : Map<string, Quick_queue<Error_report>> = new Map()
    // used to keep track of currently reported error, to de-duplicate error reporting
    public readonly current_error_pool : Map<Error, true> = new Map()
    public readonly error_report_sample : Error_report = [new Date(), new Error(), 0n, 10]

    // error report has ways to de-duplicate error reports.
    public error_report(error : Error, severeness? : Severeness, forced_type? : string) {

        if(!severeness) severeness = 1000
        if(error instanceof MyError) severeness = error.severeness

        const e_type = forced_type || error.constructor.name

        const array = this.error_collection.get(e_type) || new Quick_queue<Error_report>()

        if(array.size() >= 200) {
            const [_1, dropped_error, _2, _3] = array.shift()
            this.current_error_pool.delete(dropped_error)
        }
        if(!this.current_error_pool.has(error)) array.push([new Date(), error, this.err_id++, severeness])

        this.error_collection.set(e_type, array)
    }

    public readonly recent_visits : Quick_queue<Visit_record> = new Quick_queue()

    public log_visit(recent_visit_object : Visit_record) {

        recent_visit_object.id = this.visit_id++
        if(this.recent_visits.size() >= 1200) this.recent_visits.shift()
        this.recent_visits.push(recent_visit_object)
    }

    // public readonly db_query_watch : Quick_queue<string> = new Quick_queue()

    // public query_log(...queries : string[]) {

    //     if(this.db_query_watch.size() >= 100) this.db_query_watch.shift()
    //     queries.forEach(query => this.db_query_watch.push(query.substr(400)))
    //     queries.forEach(q => console.log(q))
    // }
}