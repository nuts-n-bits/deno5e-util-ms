import { best_fit_language_code } from "./best-fit-language-code"

export function mlc(lang_code : string, chamber : any) {

    // if we did find the chamber, and the lang code is clearly defined, then it ends here.
    if(typeof chamber[lang_code] === "string")
        return chamber[lang_code]

    // otherwise we will settle for the second best fit language, beginning by learning about what are the options.
    let accepted_codes = Object.keys(chamber)

    // if no options are offered our hands are tied.
    if(accepted_codes.length === 0)
        return ""

    // otherwise we will figure out a best fit.
    let best_fit_code = best_fit_language_code(lang_code, accepted_codes)

    // the best fit code in chamber is clearly defined, return that.
    if(typeof chamber[best_fit_code] === "string")
        return chamber[best_fit_code]

    // otherwise it's indicative of a corrupted dictionary, our hands are tied.
    return ""

}







