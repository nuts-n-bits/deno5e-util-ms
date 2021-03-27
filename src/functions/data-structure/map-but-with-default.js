export class Map_but_with_default extends Map {
    constructor(default_value_factory, staring_data) {
        if (staring_data === null || staring_data === undefined) {
            super();
        }
        else {
            super(staring_data);
        }
        this.default_value_factory = default_value_factory;
    }
    get(key) {
        const try_get = super.get(key);
        if (try_get) {
            return try_get;
        }
        else {
            super.set(key, this.default_value_factory());
            return super.get(key);
        }
    }
}
//# sourceMappingURL=map-but-with-default.js.map