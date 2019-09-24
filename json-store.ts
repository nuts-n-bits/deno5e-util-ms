
import * as fs from "fs"
import * as os from "os"

const home_dir = os.homedir()

if (!fs.existsSync(`${home_dir}/.node5tse`)) fs.mkdirSync(`${home_dir}/.node5tse`)
if (!fs.existsSync(`${home_dir}/.node5tse/json_store`)) fs.mkdirSync(`${home_dir}/.node5tse/json_store`)

function json_path_by_name (name : string) : string {

    if(/^[0-9a-z\-]+$/.test(name)) return `${home_dir}/.node5tse/json_store/${name}`
    else throw new Error("JSON file name only allows lowercase alphanumeric and dash.")
}

export function exists_json(name : string) : boolean {

    return fs.existsSync(json_path_by_name(name))
}

export function get_json(name : string) : any {

    return JSON.parse(fs.readFileSync(json_path_by_name(name)).toString("utf-8"))
}

export function set_json(name : string, json : any) : void {

    fs.writeFileSync(json_path_by_name(name), Buffer.from(JSON.stringify(json), "utf-8"), {flag: "w"})
}

export function set_json_async(name : string, json : any) : Promise<void> {
    
    return new Promise<void>((res, rej) => {
        fs.writeFile(json_path_by_name(name), Buffer.from(JSON.stringify(json), "utf-8"), {flag: "w"}, error => {
            if (error) { rej() }
            else res()
        })
    })
}

export function delete_json(name : string) : void {
    
    fs.unlinkSync(json_path_by_name(name))
}
