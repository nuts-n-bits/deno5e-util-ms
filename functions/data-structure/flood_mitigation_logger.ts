
export class Flood_mitigation_logger<UIDType> {

    private map = new Map<UIDType, bigint>()

    /**
     * @param visit_limit Maximum visits for a time period before logger returns false.
     * @param memory_length Time period in ms.
     */
    constructor(private visit_limit : bigint, private memory_length : number) {}
    
    /**
     * @returns true if limit not reached. false if limit is reached. 
     */
    log_visit(uid : UIDType, amount : bigint = 1n) : boolean {
        const visit_count = this.map.get(uid) || 0n
        if (visit_count >= this.visit_limit) { 
            return false 
        }
        else { 
            this.map.set(uid, visit_count + amount)
            setTimeout(() => {
                const visit_count = this.map.get(uid) || 0n
                if (visit_count <= 1n) { this.map.delete(uid) }
                else { this.map.set(uid, visit_count - amount) }
            }, this.memory_length)
            return true
        }
    }
}