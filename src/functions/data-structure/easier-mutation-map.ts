export class Easier_mutation_map <K, V> extends Map <K, V> {

    change(key: K, func: (original: V|undefined) => V|undefined) {

        const original_value = this.get(key)
        const calculated_value = func(original_value)
        if (calculated_value === undefined) {
            this.delete(key)
        }
        else {
            this.set(key, calculated_value)
        }
    }
}