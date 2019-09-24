export function uri_correctness_check(uri : string) : boolean {

    try{
        decodeURI(uri || "")
    }
    catch(e) {
        return false
    }

    return true
}