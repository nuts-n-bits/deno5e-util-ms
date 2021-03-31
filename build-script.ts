const real_deno = Deno
function log(x: string) { console.log(x) }
block_scope: {

    // let Deno = {
    //     args: real_deno.args,
    //     readDir: (x: string) => { log("[RDDIR] " + x); return real_deno.readDir(x) },
    //     stat: async (x: string) => { log("[STAT] " + x); return real_deno.stat(x) },
    //     readFile: async (x: string) => { log("[RDFILE] " + x); return real_deno.readFile(x) },
    //     mkdir: async (x: string) => { log("[MKDIR] " + x); return real_deno.mkdir(x) },
    //     writeFile: async (x: string, data: Uint8Array) => { log("[WRFILE] " + x); return 0; real_deno.writeFile(x, data) },
    //     exit: (code=0) => real_deno.exit(code)
    // }

    class UnexpectedConditionError extends Error {}
    const command = Deno.args[0]
    const start_target = Deno.args[1]
    const dest_target = Deno.args[2]

    if(command === "trans" && start_target && dest_target) {
        console.log("command", command)
        console.log("start target", start_target)
        console.log("dest target", dest_target)
        recursive_load([start_target])
    }
    else {
        console.log("What this does is that, you use it like this: deno run -A build-script.ts trans FROM TO")
        console.log("This will process everything in the FROM folder and write them to the TO folder, overwriting existing files.")
        console.log("The transformation applied to those files are defined by YOU, my dear user, please edit this file's")
        console.log("transform_core_def function to do whatevs you want!")
        console.log("Doesn't follow symlink ...as of yet!")
        Deno.exit()
    }

    function transform_core_def(file: Uint8Array, file_path: string, ): Uint8Array {
        const ridiculous = "$$$@@!!$~"
        const text = new TextDecoder().decode(file)
        const new_text = text.split("\n").map(line => {
            if(line.includes(` from "`) && (line+ridiculous).includes(`.ts"`+ridiculous)) 
                { return (line+ridiculous).replace(`.ts"`+ridiculous, `"`) }
            return line
        }).join("\n")
        return new TextEncoder().encode(new_text)
    }


    async function recursive_load(pathsegs: string[], touched_files_inode=new Map<number, true>()) {

        const path = pathsegs.join("/")
        try {
            const file = Deno.readDir(path)
            for await (const {name, isFile, isDirectory, isSymlink} of file) {
                if(isDirectory) { await recursive_load([...pathsegs, name], touched_files_inode) }
                else if(isFile) { await handle_file([...pathsegs, name], touched_files_inode) }
                else if(isSymlink) { console.warn("[WARN] Not implemented to follow symlink yet. Skipping:", path) }
                else { throw new UnexpectedConditionError("Enexpected Condition") }
            }
        }
        catch(e) {
            console.log("swallowed error", e)
        }

    }

    async function handle_file(pathsegs: string[], touched_files_inode:Map<number,true>) {
        const path = pathsegs.join("/")
        try {
            const infile = await Deno.readFile(path)
            const instat = await Deno.stat(path)
            if (instat.ino) { touched_files_inode.set(instat.ino, true) }
            const outfile = transform_core_def(infile, path)
            const newpathsegs = [...pathsegs]
            console.log("from", pathsegs)
            newpathsegs[0] = dest_target 
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
}