import { Quick_queue } from "./data-structure/quick-queue"

function standard_interval(jobs_enqueued : bigint) : number {  // a map from # of jobs enqueued to interval milliseconds
    const linear = Number(1000n-20n*jobs_enqueued)  // Near idle = interval 1s. 50 jobs = best effort. Linear in between.
    if(linear <= 0) return 0
    else return linear
}

export class Deferred_job_queue<F extends Function> {

    private core_queue = new Quick_queue<F>()
    private keep_running = true
    private job_pending = false
    public job_interval_calc : (number_of_jobs_enqueued : bigint) => number = standard_interval

    private async lunch() : Promise<void> {
        if(this.core_queue.size() > 0 && this.keep_running) {
            this.job_pending = true
            const first_job = this.core_queue.shift()
            first_job()
            const next_interval = this.job_interval_calc(this.core_queue.size())
            if(next_interval === 0) setImmediate(this.lunch.bind(this))
            else setTimeout(this.lunch.bind(this), next_interval)
        }
        else {
            this.job_pending = false
        }
    }

    push_job(job : F) : this {
        
        this.core_queue.push(job)
        if(!this.job_pending && this.keep_running) {
            this.lunch()
        }
        return this        
    }

    pause() : this {
        this.keep_running = false
        return this
    }

    resume() : this {
        if(!this.keep_running) {
            this.keep_running = true
            if(!this.job_pending && this.core_queue.size() > 0n) {
                this.lunch()
            }
        }
        return this
    }

    size() : bigint {
        return this.core_queue.size()
    }

}