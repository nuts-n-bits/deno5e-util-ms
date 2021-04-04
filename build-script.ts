class UnexpectedConditionError extends Error {}
export interface TransformCoreIf {
    transform_file: (file: Uint8Array, path: string) => Promise<Uint8Array>
}

block_scope: {

    await main()

    interface Passdown {
        trans_core: TransformCoreIf,
        target_path: string
    }

    async function recursive_load(pathsegs: string[], passdown: Passdown, touched_files_inode=new Map<number, true>()) {

        const path = pathsegs.join("/")
        try {
            const file = Deno.readDir(path)
            for await (const {name, isFile, isDirectory, isSymlink} of file) {
                if(isDirectory) { await recursive_load([...pathsegs, name], passdown, touched_files_inode) }
                else if(isFile) { await handle_file([...pathsegs, name], touched_files_inode, passdown) }
                else if(isSymlink) { console.warn("[WARN] Not implemented to follow symlink yet. Skipping:", path) }
                else { throw new UnexpectedConditionError("Enexpected Condition") }
            }
        }
        catch(e) {
            console.log("swallowed error", e)
        }
    }

    async function handle_file(pathsegs: string[], touched_files_inode:Map<number,true>, passdown: Passdown) {
        const path = pathsegs.join("/")
        try {
            const infile = await Deno.readFile(path)
            const instat = await Deno.stat(path)
            if (instat.ino) { touched_files_inode.set(instat.ino, true) }
            let outfile
            try {
                outfile = await passdown.trans_core.transform_file(infile, path)
            }
            catch (e) {
                console.log("Custom script error", e)
            }
            if(!(outfile instanceof Uint8Array)) { return console.log("Custom transformer bad!") }
            const newpathsegs = [...pathsegs]
            console.log("from", pathsegs)
            newpathsegs[0] = passdown.target_path 
            console.log("to  ", newpathsegs)
            const _res = await best_effort_write_file(newpathsegs.slice(0, -1), newpathsegs[newpathsegs.length-1], outfile, touched_files_inode)
        }
        catch(e) {
            console.log("IO Error at", pathsegs)
        }

    }

    // so far so good
    async function best_effort_write_file(dir_hierachy: string[], filename: string, content: Uint8Array, touched_files_inod:Map<number,true>) {
        let complete_path = ""
        for (const dir of dir_hierachy) {
            complete_path += dir + "/"
            try { await Deno.mkdir(complete_path) }
            catch(e) { "lol ok already exists" }
        }
        complete_path += filename
        try {
            try { 
                const stat = await Deno.stat(complete_path)
                if (stat.ino && touched_files_inod.has(stat.ino)) { return console.log(500, "Violated rule: Cannot overwrite input file!") }
            }
            catch(e) {
                `lol ok path dne`
            }
            await Deno.writeFile(complete_path, content)
        }
        catch(e) {
            throw e
        }
    }

    async function main() {
        try {
            const import_path = Deno.args[0]
            const source_path = Deno.args[1]
            const target_path = Deno.args[2]
    
            if(import_path && source_path && target_path && import_path[0] !== "-") {
                console.log("import file:", import_path)
                console.log("source directory:", source_path)
                console.log("target directory:", target_path)
                if (source_path === target_path) { console.log("Because the source and target is the same, it would overwrite! Abort."); Deno.exit() }
                const trans_core = (await import(import_path)).default() as TransformCoreIf
                if (typeof trans_core.transform_file !== "function") { return console.log("The supplied script does not seem to conform to the interface") }
                await recursive_load([source_path], {trans_core, target_path})
            }
            else {
                const flag = source_path
                if (flag === "-v" || flag === "--version") {
                    console.log("0.1.0") 
                }
                else {
                    console.log("What this does is that, you use it like this: deno run -A build-script.ts <YOUR-SUPPLIED.TS> <FROM> <TO>")
                    console.log("This will process everything in the <FROM> folder and write them to the <TO> folder, overwriting existing files.")
                    console.log("The transformation applied to those files are defined by YOU, dear user, in the <YOUR-SUPPLIED.TS>")
                    console.log("To write <YOUR-SUPPLIED.TS>, create a ts file, import interface [TransformCoreIf], write a function that returns an object")
                    console.log("conforming to the interface, then DEFAULT EXPORT the function. The interface will ask you to write a function that accepts")
                    console.log("a bin and returns a Promise<bin>, that function will be called every file with file contents as input. Do the work there.")
                    console.log("This script doesn't follow symlink ...as of yet!")
                }
            }
        }
        catch(e) {
            console.log("Top level error:", e)
        }
        finally {
            Deno.exit()
        }
    }
}