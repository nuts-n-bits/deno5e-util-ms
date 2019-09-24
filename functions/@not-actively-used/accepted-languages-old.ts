"use strict";

const PREVENT_INFINITE_LOOP = 1000;

const accepted_languages_dict = {

    // lang_code
    "de" : "de_de", "dech" : "de_ch", "dede" : "de_de", "deli" : "de_li",
    "en" : "en_us", "enau" : "en_au", "enca" : "en_ca", "enhk" : "en_hk", "ennz" : "en_nz", "enuk" : "en_uk", "enus" : "en_us",
    "es" : "es_es",
    "fi" : "fi_fi",
    "fr" : "fr_fr", "frch" : "fr_ch", "frfr" : "fr_fr",
    "ja" : "ja_jp", "jajp" : "ja_jp",
    "ko" : "ko_kr",
    "sv" : "sv_se", "svse" : "sv_se", "svfi" : "sv_fi",
    "zh" : "zh_cn", "zhcn" : "zh_cn", "zhhk" : "zh_hk", "zhtw" : "zh_tw", "zhsg" : "zh_cn",

    // country code
    "au" : "en_au",  // english  of commonwealth of australia
    "ca" : "en_ca",  // english  of canada
    "ch" : "de_ch",  // deutsch  of swiss confederation
    "cn" : "zh_cn",  // zhongwen of people's republic of china
    /**
     "de" : "de_de",  // deutsch  of fed republic of germany
     "fi" : "fi_fi",  // finnish  of finland
     "fr" : "fr_fr",  // francais of french republic
     **/
    "hk" : "zh_hk",  // zhongwen of hong kong s.a.r.
    "jp" : "ja_jp",  // nihongo  of japan
    "li" : "de_li",  // deutsch  of principality of liechtenstein
    "nz" : "en_us",  // english  of new-zealand
    "tw" : "zh_tw",  // zhongwen of taiwan, republic of china
    "sg" : "zh_cn",  // zhongwen of singapore
    "se" : "sv_se",  // svenska  of sweden
    "uk" : "en_uk",  // english  of the united kingdom of g.b. and n.i.
    "us" : "en_us",  // english  of the u.s. of a.

    // non-standard raw lang code
    "zh-hans": "zh_cn",
    "zh-hant": "zh_hk",
};

class Language_proximity_group {

    parent     : Language_proximity_group|null
    desc       : string
    sub_groups : Language_proximity_group[]
    languages  : string[]

    constructor(desc) {

        this.parent = null;
        this.desc = desc;
        this.sub_groups = [];
        this.languages = [];
    }

    all() {

        let all_codes : Array<string> = [];
        for(let i=0; i<this.languages.length; i++)
            all_codes = all_codes.concat(this.languages[i]);
        for(let i=0; i<this.sub_groups.length; i++)
            all_codes = all_codes.concat(this.sub_groups[i].all())
        return all_codes;
    }

    add_one(item) {

        if(typeof item === "string" && this.languages.indexOf(item) === -1)
            this.languages.push(item);
        else if(typeof item === "object" && item !== null && item.constructor === Language_proximity_group && this.sub_groups.indexOf(item) === -1)
            item.parent = this, this.sub_groups.push(item);
        else
            throw new TypeError("cannot add this item " + typeof item + ". add only language code and proximity groups.");
        return this;
    }

    add(...args) {

        for(let i=0; i<args.length; i++) {

            this.add_one(args[i]);
        }
        return this;
    }

    // return the group in which the language code resides.
    group_of(code_or_desc) {

        if(this.languages.indexOf(code_or_desc) !== -1) {

            // desired language is in this group
            return this;
        }
        else if(this.all().indexOf(code_or_desc) !== -1) {

            // desired language is not in this group, but in a sub group of this group
            for(let i=0; i<this.sub_groups.length; i++) {

                let search_result = this.sub_groups[i].group_of(code_or_desc);
                if(search_result !== null)
                    return search_result;
            }
            // search has finished but all subgroups returned null, which should not happen since the desired language is alleged to be in one of these sub groups, as per the opening condition of this if-else ladder.
            console.log("reporting a [peculiarity], see line 90 of dependencies/accepted_languages.js. this line is never intended to be executed.");
            return null;
        }
        else if(this.desc === code_or_desc) {

            // this is the desired group
            return this;
        }
        else {

            // desired language is not in this group
            return null
        }
    }
}

// define friends

const group_north_am_eng = new Language_proximity_group("en_north_american").add("en_us", "en_ca");
const group_australian_eng = new Language_proximity_group("en_au_nz").add("en_nz", "en_au");
const group_dominant_english = new Language_proximity_group("en_native").add("en_uk", group_north_am_eng, group_australian_eng);
const group_english = new Language_proximity_group("en").add(group_dominant_english, "en_sg", "en_hk");
const group_french = new Language_proximity_group("fr").add("fr_fr", "fr_ch");
const group_german = new Language_proximity_group("de").add("de_de", "de_ch", "de_li");
const group_spanish = new Language_proximity_group("es").add("es_es");
const group_swedish = new Language_proximity_group("sv").add("sv_se", "sv_fi");
const group_finnish = new Language_proximity_group("fi").add("fi_fi");
const group_north_eu = new Language_proximity_group("european_northern").add(group_swedish, group_finnish);
const group_european = new Language_proximity_group("european").add(group_english, group_french, group_german, group_north_eu, group_spanish);

const group_zh_hans = new Language_proximity_group("zh_hans").add("zh_cn", "zh_sg", "zh_mo");
const group_zh_hant = new Language_proximity_group("zh_hant").add("zh_hk", "zh_tw");
const group_zh = new Language_proximity_group("zh").add(group_zh_hans, group_zh_hant);
const group_japanese = new Language_proximity_group("ja").add("ja_jp");
const group_korean = new Language_proximity_group("ko").add("ko_kr");
const group_asian = new Language_proximity_group("asian").add(group_zh, group_japanese, group_korean);

const group_world = new Language_proximity_group("world").add(group_asian, group_european);

// how to use: call this function with raw language code to get the language code that has locale in it. like this: accepted_languages("jp") > "ja_jp" accepted_languages("ch") > "de_ch"
// ... this function returns the precise locale related to your input, and returns null if your input is not recognizable.
// ... but sometimes you don't really have the exact locale interface. e.g. you have de_de but not de_ch nor de_li. then you can apply restraints by setting the second parameter.
// ... i.e. if you set your restraints, this function will always return one of your "accepted languages", while trying its best deviating from the input language as little as possible.
// ... examples.
// ... accepted_languages("ca") > "en_ca". (because ca is canada and canada is dominantly english)
// ... accepted_languages("ca", ["ar_ar", "en_ca", "en_us", "en_uk", "en_au", "fr_fr", "ja_jp"]) > "en_ca" (because the result should be canada and it's accepted)
// ... accepted_languages("ca", ["ar_ar", "en_us", "en_uk", "en_au", "fr_fr", "ja_jp"])          > "en_us" (because they're both north american, so when en_ca is not accepted, en_us is the next best thing)
// ... accepted_languages("ca", ["ar_ar", "en_uk", "en_au", "fr_fr", "ja_jp"])                   > "en_uk" (because they're both from dominantly native english nations)
// ... accepted_languages("ca", ["ar_ar", "en_au", "fr_fr", "ja_jp"])                            > "en_au" (ditto)
// ... accepted_languages("ca", ["ar_ar", "fr_fr", "ja_jp"])                                     > "fr_fr" (because they're both european languages.)

const accepted_languages = function(raw_lang_code, all_acceptable_codes : Array<string> = [])
{
    const processed_lang_code = String(raw_lang_code).toLowerCase().replace(/[^a-z]/g, "").slice(0,4);
    const processed_lang_code_short = processed_lang_code.slice(0,2);
    let best_match;

    if(raw_lang_code in accepted_languages_dict)
        best_match = accepted_languages_dict[raw_lang_code];
    else if(processed_lang_code in accepted_languages_dict)
        best_match = accepted_languages_dict[processed_lang_code];
    else if(processed_lang_code_short in accepted_languages_dict)
        best_match = accepted_languages_dict[processed_lang_code_short];
    else
        best_match = null;

    if (all_acceptable_codes.length === 0 || all_acceptable_codes.indexOf(best_match) >= 0)
        return best_match

    else { // assert all_acceptable_codes does not contain best match, assert all_acceptable_codes has at least 1 entry

        let current_group = group_world.group_of(best_match);
        if(current_group === null)
            return all_acceptable_codes[0];

        // this was originally a while(true) loop, but i changed it into a for loop that will force quit if it runs more than a specified length,
        // just as a fail safe in case the current_group.parent somehow referred to itself.
        for(let i=0; i<PREVENT_INFINITE_LOOP; i++)
        {
            let close_match_group = current_group.all();
            for(let i=0; i<close_match_group.length; i++)
            {
                if (all_acceptable_codes.indexOf(close_match_group[i]) !== -1)
                    return close_match_group[i];

            }
            if(current_group.parent)
                current_group = current_group.parent;
            else
                return all_acceptable_codes[0];
        }
        console.log('[warning][peculiarity] produced at accepted_languages.js:175, forced jump out of a suspected 1k loop that should not happen. This indicates that a faulty language proximity group has one/multiple parent pointer(s) that formed a circle.');
        return all_acceptable_codes[0];
    }

};

export default accepted_languages;