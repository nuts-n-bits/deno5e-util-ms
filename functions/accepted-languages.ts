class UnintendedExecutionPeculiarity extends Error { public severeness = 10 }

const best_fit_language_code = (function(){

    const PREVENT_INFINITE_LOOP = 1000;

    class Language_proximity_group {

        parent:     Language_proximity_group|null
        desc:       string
        sub_groups: Array<Language_proximity_group>
        languages:  Array<string>

        constructor(desc : string) {

            this.parent = null
            this.desc = desc
            this.sub_groups = []
            this.languages = []
        }

        all() : Array<string> {

            let all_codes = [...this.languages]

            for(let i=0; i<this.sub_groups.length; i++)
                all_codes.push(...this.sub_groups[i].all())

            return all_codes
        }

        all_and_desc() : Array<string> {

            let all_codes = [this.desc, ...this.languages]

            for(let i=0; i<this.sub_groups.length; i++)
                all_codes.push(...this.sub_groups[i].all_and_desc())

            return all_codes
        }

        has(lang_code : string) : boolean {

            return this.all().indexOf(lang_code) !== -1
        }

        add_one(item : string|Language_proximity_group) : Language_proximity_group {

            if(typeof item === "string" && this.languages.indexOf(item) === -1)
                this.languages.push(item)
            else if(typeof item === "object" /* && item !== null (ensured by type system) */ && item.constructor === Language_proximity_group && this.sub_groups.indexOf(item) === -1)
                item.parent = this, this.sub_groups.push(item)
            else
                throw new TypeError("cannot add this item " + typeof item + ". add only language code and proximity groups.")
            return this
        }

        add(...args : Array<string|Language_proximity_group>) : Language_proximity_group {

            for(let i=0; i<args.length; i++) {

                this.add_one(args[i])
            }
            return this
        }

        // return the group in which the language code resides.
        group_of(code : string) :Language_proximity_group|null {

            if(this.languages.indexOf(code) !== -1) {

                // desired language is in this group
                return this
            }
            else if(this.desc === code) {

                // this is the desired group
                return this
            }
            else if(this.all_and_desc().indexOf(code) !== -1) {

                // desired language is not in this group, but in a sub group of this group
                for(let i=0; i<this.sub_groups.length; i++) {

                    let search_result = this.sub_groups[i].group_of(code)
                    if(search_result !== null)
                        return search_result
                }
                // search has finished but all subgroups returned null, which should not happen since the desired language is alleged to be in one of these sub groups, as per the opening condition of this if-else ladder.
                new UnintendedExecutionPeculiarity("Lang code alleged to be in one subgroup but never found.")
                return null
            }
            else {

                // desired language is not in this group
                return null
            }
        }
    }

    // define friends

    const group_north_am_eng =     new Language_proximity_group("en_n_a"   ).add("en_us", "en_ca")
    const group_aus_nz_eng =       new Language_proximity_group("en_au_nz" ).add("en_au", "en_nz")
    const group_dominant_english = new Language_proximity_group("en_native").add(group_north_am_eng, "en_uk", group_aus_nz_eng)
    const group_english =          new Language_proximity_group("en"       ).add(group_dominant_english, "en_sg", "en_hk")
    const group_french =           new Language_proximity_group("fr"       ).add("fr_fr", "fr_ch")
    const group_german =           new Language_proximity_group("de"       ).add("de_de", "de_at", "de_ch", "de_li")
    const group_spanish =          new Language_proximity_group("es"       ).add("es_es", "es_mx", "es_pr", "es_cl")
    const group_portuguese =       new Language_proximity_group("pt"       ).add("pt_pt", "pt_br")
    const group_dutch =            new Language_proximity_group("nl"       ).add("nl_nl")
    const group_polish =           new Language_proximity_group("pl"       ).add("pl_pl")
    const group_swedish =          new Language_proximity_group("sv"       ).add("sv_se", "sv_fi")
    const group_finnish =          new Language_proximity_group("fi"       ).add("fi_fi")
    const group_norwegian =        new Language_proximity_group("no"       ).add("no_no")
    const group_nordic =           new Language_proximity_group("nordic"   ).add(group_swedish, group_finnish, group_norwegian)
    const group_european =         new Language_proximity_group("european" ).add(group_english, group_french, group_german, group_spanish, group_nordic, group_portuguese, group_dutch, group_polish)

    const group_zh_hans =          new Language_proximity_group("zh_hans"  ).add("zh_cn", "zh_sg")
    const group_zh_hant =          new Language_proximity_group("zh_hant"  ).add("zh_hk", "zh_tw", "zh_mo")
    const group_zh =               new Language_proximity_group("zh"       ).add(group_zh_hans, group_zh_hant)
    const group_japanese =         new Language_proximity_group("ja"       ).add("ja_jp")
    const group_korean =           new Language_proximity_group("ko"       ).add("ko_kr")
    const group_cjk =              new Language_proximity_group("asian_cjk").add(group_zh, group_japanese, group_korean)
    const group_arabic =           new Language_proximity_group("ar"       ).add("ar_sa", "ar_eg")
    const group_asian =            new Language_proximity_group("asian"    ).add(group_cjk, group_arabic)

    const group_world =            new Language_proximity_group("world"    ).add(group_asian, group_european)

    const country_code_dict : any = {
        "au" : "en_au",  // english    of commonwealth of australia
        "at" : "de_at",  // deutsch    of austria
        "ca" : "en_ca",  // english    of canada
        "ch" : "de_ch",  // deutsch    of swiss confederation
        "cl" : "es_cl",  // espanol    of chile
        "cn" : "zh_cn",  // zhongwen   of people's republic of china
        "de" : "de_de",  // deutsch    of fed republic of germany
        "es" : "es_es",  // espanol    of spain
        "fi" : "fi_fi",  // finnish    of finland
        "fr" : "fr_fr",  // francais   of french republic
        "hk" : "zh_hk",  // zhongwen   of hong kong s.a.r.
        "jp" : "ja_jp",  // nihongo    of japan
        "kr" : "ko_kr",  // korean     of republic of korea (south korea)
        "li" : "de_li",  // deutsch    of principality of liechtenstein
        "mx" : "es_mx",  // espanol    of mexico
        "no" : "no_no",  // norwegien  of norway
        "nz" : "en_us",  // english    of new-zealand
        "pr" : "es_pr",  // espanol    of puerto rico
        "pt" : "pt_pt",  // portuguese of portugal
        "tw" : "zh_tw",  // zhongwen   of taiwan, republic of china
        "sg" : "zh_cn",  // zhongwen   of singapore
        "se" : "sv_se",  // svenska    of sweden
        "uk" : "en_uk",  // english    of the united kingdom of g.b. and n.i.
        "us" : "en_us",  // english    of the u.s. of a.
    }

    const customary_code_dict : any = {
        "zh_hans": "zh_cn",
        "zh_hant": "zh_hk",
        "zh_classic": "zh_classic",
        "xxx": "xxx",
    }

    // how to use: call this function with raw language code to get the language code that has locale in it. like this: accepted_languages("jp") > "ja_jp" accepted_languages("ch") > "de_ch"
    // ... this function returns the precise locale related to your input, and returns null if your input is not recognizable.
    // ... but sometimes you don't really have the exact locale interface. e.g. you have de_de but not de_ch nor de_li. then you can apply restraints by setting the second parameter.
    // ... i.e. if you set your restraints, this function will always return one of your "accepted languages", while trying its best deviating from the input language as little as possible.
    // ... examples.
    // ... accepted_languages("ca") > "en_ca". (because ca is canada and canada is dominantly english)
    // ... accepted_languages("ca", ["unrecognized", "en_ca", "en_us", "en_uk", "en_au", "fr_fr", "ja_jp"]) > "en_ca" (because the result should be canada and it's accepted)
    // ... accepted_languages("ca", ["unrecognized", "en_us", "en_uk", "en_au", "fr_fr", "ja_jp"])          > "en_us" (because they're both north american, so when en_ca is not accepted, en_us is the next best thing)
    // ... accepted_languages("ca", ["unrecognized", "en_uk", "en_au", "fr_fr", "ja_jp"])                   > "en_uk" (because they're both from dominantly native english nations)
    // ... accepted_languages("ca", ["unrecognized", "en_au", "fr_fr", "ja_jp"])                            > "en_au" (ditto)
    // ... accepted_languages("ca", ["unrecognized", "fr_fr", "ja_jp"])                                     > "fr_fr" (because they're both european languages.)

    function accepted_languages(raw_lang_code : string, all_acceptable_codes : Array<string>|null = null) {

        const processed_lang_code = raw_lang_code.toLowerCase().replace(/[^a-z]/g, "_")
        const processed_lang_code_short = processed_lang_code.slice(0,2)
        const processed_lang_code_group = group_world.group_of(processed_lang_code)
        const processed_lang_code_short_group = group_world.group_of(processed_lang_code_short)
        let best_match

        // try language code from group
        if(processed_lang_code_group && processed_lang_code_group.has(processed_lang_code))
            best_match =  processed_lang_code
        else if(processed_lang_code_group && processed_lang_code_group.all()[0])
            best_match = processed_lang_code_group.all()[0]
        else if(processed_lang_code_short_group && processed_lang_code_short_group.has(processed_lang_code_short))
            best_match = processed_lang_code_short

        // try customary language code
        else if(processed_lang_code in customary_code_dict)
            best_match = customary_code_dict[processed_lang_code]

        // try with country code
        else if(processed_lang_code in country_code_dict)
            best_match = country_code_dict[processed_lang_code]
        else if(processed_lang_code_short in country_code_dict)
            best_match = country_code_dict[processed_lang_code_short]
        else
            best_match = null;

        if(all_acceptable_codes === null || all_acceptable_codes.length === 0 || all_acceptable_codes.indexOf(best_match) !== -1)
            return best_match;
        else { // assert all_acceptable_codes instanceof Array, assert all_acceptable_codes does not contain best match, assert all_acceptable_codes has at least 1 entry

            let current_group = group_world.group_of(best_match)
            if(current_group === null) { // best match is null or best match language not in group world.

                return all_acceptable_codes[0]
            }
            else {
                // this was originally a while(true) loop, but I changed it into a for loop that will force quit if it runs more than a specified length,
                // just as a fail safe in case the current_group.parent somehow referred to itself.
                for(let i=0; i<PREVENT_INFINITE_LOOP; i++) {
                    let close_match_group = current_group.all()
                    for(let i=0; i<close_match_group.length; i++) {
                        if (all_acceptable_codes.indexOf(close_match_group[i]) !== -1)
                            return close_match_group[i]

                    }
                    current_group = current_group.parent
                    if(current_group === null)
                        return all_acceptable_codes[0]
                    else
                        // noinspection UnnecessaryContinueJS
                        continue

                }
                // Control flow is NOT supposed to reach here because the way Language_proximity_group is set up.
                new UnintendedExecutionPeculiarity("Forced unintended jump out of a 1k loop. This indicates that a faulty language proximity group has one/multiple parent pointer(s) that formed a circle.")
                return all_acceptable_codes[0]
            }
        }
    }

    return accepted_languages
})()

export { best_fit_language_code }

export function mlc(chamber : {[index:string]:string}, lang_code : string) : string {
    const best_fit_lang_code = best_fit_language_code(lang_code, Object.keys(chamber))
    return chamber[best_fit_lang_code]
}