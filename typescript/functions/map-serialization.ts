import { assert_never } from "../protocols/assert-passthrough.ts"

export function serialize(map: Map<string, string>): string {
    const jsonObj: {[i:string]:string} = {}
    map.forEach((v, k) => jsonObj[k] = v)
    return JSON.stringify(jsonObj)
}

export function deserialize(string: string, coercion=true): {reports: {parseError: null|Error, coercion: boolean, typeIsNotStringInstances: Array<[string, any]>}, map: Map<string, string>} {

    const map = new Map<string, string>()
    const reports = {
        parseError: null,
        coercion: coercion,
        typeIsNotStringInstances: [] as Array<[string, any]>
    }

    try{
        const jsonObj = JSON.parse(string)
        Object.entries(jsonObj).forEach(([k, v]) => {
            if(typeof v !== "string") {
                if(coercion) {
                    reports.typeIsNotStringInstances.push([k, v]) 
                    map.set(k, String(v))
                }
                else {
                    reports.typeIsNotStringInstances.push([k, v]) 
                }
            }
            else if(typeof v === "string") {
                map.set(k, v)
            }
            else {
                assert_never(v)
            }
        })
    } 
    catch(e) {
        reports.parseError = e
        return {reports, map}
    }
    return {reports, map}
}