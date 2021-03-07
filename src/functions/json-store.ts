
import * as fs from "fs"

type Fs = {
    existsSync: (path: string) => boolean,
    readFileSync: (path: string) => Uint8Array,
    writeFileSync: (path: string, data: Uint8Array) => void,
    unlinkSync: (path: string) => void,
    exists: (path: string) => Promise<boolean>,
    readFile: (path: string) => Promise<Uint8Array>,
    writeFile: (path: string, data: Uint8Array) => Promise<void>,
    unlink: (path: string) => Promise<void>,
}

export class Json_store {

    constructor (private readonly save_directory: string, private readonly fs: Fs) {

    }

    /**
     * @param name name of the json file, must be [0-9a-z\-]+ (lowercase alphanumeric and dash)
     */
    json_path_by_name (name: string): string {

        if(/^[0-9a-z\-]+$/.test(name)) return `${this.save_directory}/${name}`
        else throw new Error("JSON file name only permits lowercase alphanumeric and dash.")
    }

    exists_sync (name: string): boolean {
        return this.fs.existsSync(this.json_path_by_name(name))
    }

    async exists (name: string): Promise<boolean> {
        return await this.fs.exists(this.json_path_by_name(name))
    }

    /**
     * @param name if json does not exist, throws error. check existance with json_exists first.
     */
    get_json_sync (name: string): any {
        return JSON.parse(fs.readFileSync(this.json_path_by_name(name)).toString("utf-8"))
    }

    async get_json (name: string): Promise<any> {
        const buffer = await this.fs.readFile(this.json_path_by_name(name))
        const string = new TextDecoder().decode(buffer)
        return JSON.parse(string)
    }

    set_json_sync (name: string, json: any): void {
        this.fs.writeFileSync(this.json_path_by_name(name), Buffer.from(JSON.stringify(json), "utf-8"))
    }

    async set_json (name: string, json: any): Promise<void> {
        return await this.fs.writeFile(this.json_path_by_name(name), Buffer.from(JSON.stringify(json), "utf-8"))
    }

    delete_json_sync (name: string): void {
        this.fs.unlinkSync(this.json_path_by_name(name))
    }

    async delete_json (name: string): Promise<void> {
        return await this.fs.unlink(this.json_path_by_name(name))
    }
}