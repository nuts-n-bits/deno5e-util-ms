const acceptable_type = function(variable) :boolean {
    const type = typeof variable;
    return (type === "string" || type === "symbol" || type === "number");
};

export default class Noty {

    private _note = {};

    note (name : string|symbol|number, content : any = true, ...more_contents) : Noty {

        if(more_contents.length !== 0) {
            content = [content, ...more_contents];
        }
        name in this._note ? this._note[name].push(content) : this._note[name] = [content];

        return this

    };

    // INDISTINGUISHABLE RETURN VALUE returns the thing being noted and take it off memory. if nothing noted, return null. cannot distinguish between a null note and not noted.
    noted (name : string|symbol|number) : any {

        if(name in this._note) {

            const content = this._note[name].pop();
            if(this._note[name].length === 0)
                delete this._note[name];
            return content;
        }
        else
            return null;
        // noted returns data or null, but data itself could be null, in which case,
        // noted cannot distinguish between whether something is not noted or something is noted as null.
        // to determine that, call 'noting'.
    };

    // always returns true or false indicating if the entry is being noted.
    noting (name : string|symbol|number) : boolean {

        return name in this._note;
    };

    // returns array if the dismissed note exists_json, otherwise returns []
    dismiss (name : string|symbol|number) : Array<any> {

        let note_array = name in this._note ? this._note[name] : [];
        delete this._note[name];
        return note_array;
    };

    // always returns array, even when nothing is noted, then it returns empty array.
    notes () : Array<string> {

        return Object.keys(this._note);
    };
}
