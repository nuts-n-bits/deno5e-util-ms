const tested_equal = function(str_or_regex : string|RegExp, candidate : string) {
    if(typeof str_or_regex === "string")
        return str_or_regex === candidate;
    else if(str_or_regex instanceof RegExp)
        return str_or_regex.test(candidate);
    else
        return false;
};

export default class Identify {

    private message  : string              = "";
    private memory   : Map<string, string> = new Map();
    private left     : string
    private right    : string
    private assigner : string

    constructor(left = "(", assigner = ":", right = ")") {  // todo: support regexp in the future

        this.left = left
        this.right = right
        this.assigner = assigner
    }

    set (string : string) : Identify {

        this.message = string
        this.memory = new Map()
        return this
    }

    all (key : string) : string[] {  // todo: support regexp here

        let array = this.message.split(this.left || this.right);
        let found = false;
        let content : Array<string> = [];

        for(let i=0; i<array.length; i++)
        {
            let chamber = array[i].split(this.right || this.left)[0];
            let index = chamber.indexOf(this.assigner);
            if(index === -1)
                continue;
            let candidate_key = chamber.substr(0, index);
            if(!tested_equal(key, candidate_key))
                continue;
            content.push(chamber.substr(index + this.assigner.length));
            found = true;
        }

        return found ? content : [];
    }

    first (key : string) : string|null {
        let content = this.all(key);
        if(content.length > 0)
            return content[0];
        else
            return null;
    }

    last (key : string) : string|null {
        let content = this.all(key);
        if(content.length > 0)
            return content[content.length - 1];
        else
            return null
    }

}