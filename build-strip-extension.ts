import  { TransformCoreIf } from "./build-script.ts"

class TransformCore implements TransformCoreIf {
    async transform_file (file: Uint8Array, path: string) {
        const ridiculous = "$$$@@!!$~"
        const text = new TextDecoder().decode(file)
        const new_text = text.split("\n").map(line => {
            if(line.includes(` from "`) && (line+ridiculous).includes(`.ts"`+ridiculous)) 
                { return (line+ridiculous).replace(`.ts"`+ridiculous, `"`) }
            return line
        }).join("\n")
        return new TextEncoder().encode(new_text)
    }
}

export default function (): TransformCoreIf {
    return new TransformCore()
}