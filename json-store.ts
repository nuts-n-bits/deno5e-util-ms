
import * as fs from "fs"

export class Json_store {

    constructor (private readonly save_directory : string) {

    }

    json_path_by_name (name : string) : string {

        if(/^[0-9a-z\-]+$/.test(name)) return `${this.save_directory}/${name}`
        else throw new Error("JSON file name only permits lowercase alphanumeric and dash.")
    }

    exists_json(name : string) : boolean {

        return fs.existsSync(this.json_path_by_name(name))
    }

    get_json(name : string) : any {

        return JSON.parse(fs.readFileSync(this.json_path_by_name(name)).toString("utf-8"))
    }

    set_json(name : string, json : any) : void {

        fs.writeFileSync(this.json_path_by_name(name), Buffer.from(JSON.stringify(json), "utf-8"), {flag: "w"})
    }

    set_json_async(name : string, json : any) : Promise<void> {
    
        return new Promise<void>((res, rej) => {
            fs.writeFile(this.json_path_by_name(name), Buffer.from(JSON.stringify(json), "utf-8"), {flag: "w"}, error => {
                if (error) { rej() }
                else { res() }
            })
        })
    }

    delete_json(name : string) : void {
    
        fs.unlinkSync(this.json_path_by_name(name))
    }
}