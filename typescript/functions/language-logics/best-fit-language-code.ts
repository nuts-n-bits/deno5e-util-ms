import { predicate_json_type_is } from "../json-shape-is.ts"

export type Chamber<T> = Map<LanguageCode, T>
export type LanguageCode = keyof typeof languageCodeDefinition

const languageCodeDefinition = {
    "ar": true, "ar-eg": true, "ar-sa": true,
    "de": true, "de-at": true, "de-ch": true, "de-de": true, "de-li": true,
    "en": true, "en-au": true, "en-ca": true, "en-hk": true, "en-nz": true, "en-sg": true, "en-us": true, "en-uk": true,
    "es": true, "es-cl": true, "es-es": true, "es-mx": true, "es-pr": true,
    "fi": true, "fi-fi": true, 
    "fr": true, "fr-fr": true, "fr-ch": true,
    "it": true, "it-it": true,
    "ja": true, "ja-jp": true, 
    "ko": true, "ko-kr": true, 
    "nl": true, "nl-nl": true, 
    "no": true, "no-no": true, 
    "pl": true, "pl-pl": true, 
    "pt": true, "pt-br": true, "pt-pt": true,
    "sv": true, "sv-se": true, "sv-fi": true,
    "zh": true, "zh-cn": true, "zh-hk": true, "zh-mo": true, "zh-sg": true, "zh-tw": true,
}

export function concrete_check_string_is_language_code(string: string|null|undefined): LanguageCode | null {
    if (string === null || string === undefined) { return null }
    else if (languageCodeDefinition[string as LanguageCode]) { return string as LanguageCode }
    else { return null }
}

/**
 * @returns will return an entry from chamber that is acceptable as indicated in requested_codes. 
 *      If nothing matches, will return null even if chamber is not empty.
 */
export function best_fit_chamber_content<T>(requested_codes: LanguageCode[], chamber: Chamber<T>): T | null {

    for (const code of requested_codes) {
        const try_1 = chamber.get(code)
        if (try_1 !== undefined) { return try_1 }
        const short_code = concrete_check_string_is_language_code(code.split("-")[0])
        if (short_code === null) { return null }
        const try_2 = chamber.get(short_code)
        if (try_2 !== undefined) { return try_2 }
    }

    return null
}

/**
 * A more lenient version of best_fit_chamber_content. Will return an acceptable chamber entry if possible. If not, will try
 *  1) chamber.get("en-us")
 *  2) chamber.get("en")
 * @param requested_codes LanguageCode[] that is acceptable
 * @param chamber is just a map of string, string. specifically, Map<LanguageCode, string>
 * @param fallback if the map is empty, what would be the fallback string to return
 * @returns 
 */
export function mlc<T>(requested_codes: string[], chamber: Chamber<T>, fallback: T): T {

    const filtered_codes = requested_codes.filter(candidate => concrete_check_string_is_language_code(candidate) !== null) as LanguageCode[]
    // if the chamber contains (one of) the language results in requested codes from accept-language header, return that result (preferred outcome)
    const try_1 = best_fit_chamber_content(filtered_codes, chamber)
    if (try_1 !== null) { return try_1 }
    else {
        // if the chamber has nothing acceptable by the client, return en-us, then en as default fallback
        const try_2 = chamber.get("en-us")
        if (try_2 !== undefined) { return try_2 }
        const try_3 = chamber.get("en")
        if (try_3 !== undefined) { return try_3 }
        else { 
            // if neither en nor en-us exist, use whatever code available in the chamber.
            const try_4 = chamber.entries().next()
            if(!try_4.done) {
                return try_4.value[1]
            }
            // if there is no code in that chamber (which would be pretty weird), return fallback string
            else { return fallback }
        }
    }
}

const accept_language_parse_result_predicate = predicate_json_type_is({lang_code: "must be string", q_value: 1})
/**
 * @param accept_language_header HTTP header "accept-language", e.g. "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5"
 * @returns e.g. [ 'fr-ch', 'fr', 'en', 'de', '*' ]
 */
export function language_list_from_header(accept_language_header: string) {
    // "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5"
    return accept_language_header.toLowerCase().split(",")
    // [fr-ch] [ fr;q=0.9] [ en;q=0.8] [ de;q=0.7] [ *;q=0.5]
        .map(x => x.trim())
    // [fr-ch] [fr;q=0.9] [en;q=0.8] [de;q=0.7] [*;q=0.5]
        .map(x => x.split(";").map(x => x.trim()))
    // [[fr-ch]] [[fr][q=0.9]] [[en][q=0.8]] [[de][q=0.7]] [[*][q=0.5]]
        .map(([lang_code, q_string]) => ({ lang_code: lang_code, q_value: parse_q_value(q_string) }))
    // [{lang_code: fr-ch, q_value: 1}] .... [{lang_code: *, q_value: 0.5}]
        .filter(accept_language_parse_result_predicate)
    // * eliminates pathological case where lang_code === undefined
}

/**
 * Garbage in, reasonable default out. Expects e.g. "q=0.4207", if found ill-defined, though, will return 1 (high prio accepted language)
 * @param q e.g. "q=0.4207"
 */
function parse_q_value(q: string|undefined): number {  
    if(q === undefined) { return 1 }
    // "q=0.4207"
    const [q_str_lit, q_float_string] = q.split("=")
    if (q_str_lit !== "q") { return 1 }  // ill-defined
    if (q_float_string === undefined) { return 1 }  // ill-defined
    const q_float_val = parseFloat(q_float_string)
    if (q_float_val > 1 || q_float_val < 0 || isNaN(q_float_val)) { return 1 }  // ill-valued (if out of bounds) or ill-defined (if NaN)
    return q_float_val
}

export function complete_chamber<T>(original_chamber: Array<[LanguageCode, T]>): Chamber<T> {

    const cc: Chamber<T> = new Map()

    for (const [k, v] of original_chamber) {
        const partial = concrete_check_string_is_language_code(k.split("-")[0])
        if (partial !== null && cc.get(partial) === undefined) { cc.set(partial, v) }
        cc.set(k, v)
    }
    return cc
}

export function complete_chamber_dyn(original_chamber: string[][]): Chamber<string> {

    const cc: Chamber<string> = new Map()

    for (const [prek, v] of original_chamber) {
        if(typeof v !== "string") { continue }
        const k = concrete_check_string_is_language_code(prek)
        if(k === null) { continue }
        const partial = concrete_check_string_is_language_code(k.split("-")[0])
        if (partial !== null && cc.get(partial) === undefined) { cc.set(partial, v) }
        cc.set(k, v)
    }
    return cc
}