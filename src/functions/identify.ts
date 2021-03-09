export class Identify {

    private message: string = ""

    constructor(private left: string, private delim: string, private right: string) {

    }

    set (string: string): this {

        this.message = string
        return this
    }

    all (key: string): string[] {

        const array = this.message.split(this.left || this.right).map(fragment => {
            const chamber = fragment.split(this.right || this.left)[0]
            const index = chamber.indexOf(this.delim)
            const chamber_key = index === -1 ? chamber : chamber.substr(0, index)
            if(key !== chamber_key) { return null }
            else if (index === -1) { return "" }
            else { return chamber.substr(index + this.delim.length) }
        }).filter(result => result !== null)

        return array as string[]
    }

    first (key: string): string|null {
        let content = this.all(key)
        if(content.length > 0)
            return content[0]
        else
            return null
    }

    last (key: string): string|null {
        let content = this.all(key)
        if(content.length > 0)
            return content[content.length - 1]
        else
            return null
    }

}
