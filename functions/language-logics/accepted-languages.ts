
class UnintendedExecutionPeculiarity extends Error { public severeness = 10 }

export function pick_best_fit_from_chamber(chamber : {[index:string]:string}, lang_code : string) : string {
    const best_fit_lang_code = accepted_languages(lang_code, Object.keys(chamber))
    return chamber[best_fit_lang_code]
}

const region_name_by_code : any = {
    "ar": {
        "de_de": "Argentinien",
        "en_uk": "Argentina",
        "en_us": "Argentina",
        "es_es": "Argentina",
        "fr_fr": "Argentine",
        "ja_jp": "アルゼンチン",
        "ko_kr": "아르헨티나",
        "sv_se": "Argentina",
        "ru_ru": "Аргентина",
        "zh_cn": "阿根廷",
        "zh_hk": "阿根廷",
        "zh_tw": "阿根廷",
    },
    "arg": "ar",
    "at": {
        "de_de": "Österreich",
        "en_uk": "Austria",
        "en_us": "Austria",
        "es_es": "Austria",
        "fr_fr": "Autriche",
        "ja_jp": "オーストリア",
        "ko_kr": "오스트리아",
        "sv_se": "Österrike",
        "zh_cn": "奧地利",
        "zh_hk": "奧地利",
        "zh_tw": "奧地利",
    },
    "aut": "at",
    "au": {
        "de_de": "Australien",
        "en_uk": "Australia",
        "en_us": "Australia",
        "es_es": "Australia",
        "fr_fr": "Australie",
        "ja_jp": "オーストラリア",
        "ko_kr": "오스트레일리아",
        "sv_se": "Australien",
        "zh_cn": "澳大利亚",
        "zh_hk": "澳洲",
        "zh_tw": "澳洲",
    },
    "aus": "au",
    "be": {
        "de_de": "Belgien",
        "en_uk": "Belgium",
        "en_us": "Belgium",
        "es_es": "Bélgica",
        "fr_fr": "Belgique",
        "ja_jp": "ベルギー",
        "ko_kr": "벨기에",
        "sv_se": "Belgien",
        "zh_cn": "比利时",
        "zh_hk": "比利時",
        "zh_tw": "比利時",
    },
    "bel": "be",
    "br": {
        "de_de": "Brasilien",
        "en_uk": "Brazil",
        "en_us": "Brazil",
        "es_es": "Brasil",
        "fr_fr": "Brésil",
        "ja_jp": "ブラジル",
        "ko_kr": "브라질",
        "sv_se": "Brasilien",
        "ru_ru": "Бразилия",
        "zh_cn": "巴西",
        "zh_hk": "巴西",
        "zh_tw": "巴西",
    },
    "bra": "br",
    "ca": {
        "de_de": "Kanada",
        "en_uk": "Canada",
        "en_us": "Canada",
        "es_es": "Canadá",
        "fr_fr": "Canada",
        "ja_jp": "カナダ",
        "ko_kr": "캐나다",
        "sv_se": "Kanada",
        "zh_cn": "加拿大",
        "zh_hk": "加拿大",
        "zh_tw": "加拿大",
    },
    "can": "ca",
    "ch": {
        "de_de": "Schweiz",
        "en_uk": "Switzerland",
        "en_us": "Switzerland",
        "es_es": "Suiza",
        "fr_fr": "Suisse",
        "ja_jp": "スイス",
        "ko_kr": "스위스",
        "sv_se": "Schweiz",
        "zh_cn": "瑞士",
        "zh_hk": "瑞士",
        "zh_tw": "瑞士",
    },
    "che": "ch",
    "cl": {
        "de_de": "Chile",
        "en_uk": "Chile",
        "en_us": "Chile",
        "es_es": "Chile",
        "fr_fr": "Chili",
        "ja_jp": "チリ",
        "ko_kr": "칠레",
        "sv_se": "Chile",
        "zh_cn": "智利",
        "zh_hk": "智利",
        "zh_tw": "智利",
    },
    "chl": "cl",
    "cn": {
        "de_de": "Volksrepublik China",
        "en_uk": "China",
        "en_us": "China",
        "es_es": "China",
        "fr_fr": "Chine",
        "ja_jp": "中国",
        "ko_kr": "중국",
        "sv_se": "Kina",
        "zh_cn": "中国",
        "zh_hk": "中國",
        "zh_tw": "中國",
    },
    "chn": "cn",
    "cz": {
        "de_de": "Tschechien",
        "en_uk": "Czech Republic",
        "en_us": "Czech Republic",
        "es_es": "República Checa",
        "fr_fr": "République tchèque",
        "ja_jp": "チェコ",
        "ko_kr": "체코",
        "sv_se": "Tjeckien",
        "zh_cn": "捷克",
        "zh_hk": "捷克",
        "zh_tw": "捷克",
    },
    "cze": "cz",
    "de": {
        "de_de": "Deutschland",
        "en_uk": "Germany",
        "en_us": "Germany",
        "es_es": "Alemania",
        "fr_fr": "Allemagne",
        "ja_jp": "ドイツ",
        "ko_kr": "독일",
        "sv_se": "Tyskland",
        "zh_cn": "德国",
        "zh_hk": "德國",
        "zh_tw": "德國",
    },
    "deu": "de",
    "dk": {
        "de_de": "Dänemark",
        "en_uk": "Denmark",
        "en_us": "Denmark",
        "es_es": "Dinamarca",
        "fr_fr": "Danemark",
        "ja_jp": "デンマーク",
        "ko_kr": "덴마크",
        "sv_se": "Danmark",
        "zh_cn": "丹麦",
        "zh_hk": "丹麥",
        "zh_tw": "丹麥",
    },
    "dnk": "dk",
    "eg": {
        "ar_eg": "مصر",
        "de_de": "Ägypten",
        "en_us": "Egypt",
        "es_es": "Egipto",
        "fr_fr": "Égypte",
        "ja_jp": "エジプト",
        "ko_kr": "이집트",
        "sv_se": "Egypten",
        "ru_ru": "Египет",
        "zh_cn": "埃及",
        "zh_hk": "埃及",
    },
    "egy": "eg",
    "es": {
        "de_de": "Spanien",
        "en_us": "Spain",
        "es_es": "España",
        "fr_fr": "Espagne",
        "ja_jp": "スペイン",
        "ko_kr": "스페인",
        "sv_se": "Spanien",
        "ru_ru": "Испания",
        "zh_ch": "西班牙",
        "zh_hk": "西班牙",
    },
    "esp": "es",
    "fi": {
        "de_de": "Finnland",
        "en_uk": "Finland",
        "en_us": "Finland",
        "es_es": "Finlandia",
        "fi_fi": "Suomi",
        "fr_fr": "Finlande",
        "ja_jp": "フィンランド",
        "ko_kr": "핀란드",
        "sv_se": "Finland",
        "zh_cn": "芬兰",
        "zh_hk": "芬蘭",
        "zh_tw": "芬蘭",
    },
    "fin": "fi",
    "fr": {
        "de_de": "Frankreich",
        "en_uk": "France",
        "en_us": "France",
        "es_es": "Francia",
        "fr_fr": "France",
        "ja_jp": "フランス",
        "ko_kr": "프랑스",
        "sv_se": "Frankrike",
        "zh_cn": "法国",
        "zh_hk": "法國",
        "zh_tw": "法國",
    },
    "fra": "fr",
    "gb": {
        "de_de": "Vereinigtes Königreich",
        "en_uk": "United Kingdom",
        "en_us": "United Kingdom",
        "es_es": "Reino Unido",
        "fr_fr": "Royaume-Uni",
        "ja_jp": "イギリス",
        "ko_kr": "영국",
        "sv_se": "Storbritannien",
        "zh_cn": "英国",
        "zh_hk": "英國",
        "zh_tw": "英國",
    },
    "gbr": "gb",
    "gr": {
        "de_de": "Griechenland",
        "en_uk": "Greece",
        "en_us": "Greece",
        "es_es": "Grecia",
        "fr_fr": "Grèce",
        "ja_jp": "ギリシャ",
        "ko_kr": "그리스",
        "sv_se": "Grekland",
        "zh_cn": "希腊",
        "zh_hk": "希臘",
        "zh_tw": "希臘",
    },
    "grc": "gr",
    "hk": {
        "de_de": "Hongkong",
        "en_uk": "Hong Kong",
        "en_us": "Hong Kong",
        "es_es": "Hong Kong",
        "fr_fr": "Hong Kong",
        "ja_jp": "香港",
        "ko_kr": "홍콩",
        "sv_se": "Hongkong",
        "zh_cn": "香港",
        "zh_hk": "香港",
        "zh_tw": "香港",
    },
    "hkg": "hk",
    "ie": {
        "en_us": "Ireland",
        "zh_cn": "爱尔兰",
    },
    "irl": "ie",
    "in": {
        "de_de": "Indien",
        "en_uk": "India",
        "en_us": "India",
        "es_es": "India",
        "fr_fr": "Inde",
        "ja_jp": "インド",
        "ko_kr": "인도",
        "sv_se": "Indien",
        "zh_cn": "印度",
        "zh_hk": "印度",
        "zh_tw": "印度",
    },
    "ind": "in",
    "is": {
        "de_de": "Island",
        "en_uk": "Iceland",
        "en_us": "Iceland",
        "es_es": "Islandia",
        "fr_fr": "Islande",
        "ja_jp": "アイスランド",
        "ko_kr": "아이슬란드",
        "sv_se": "Island",
        "zh_cn": "冰岛",
        "zh_hk": "冰島",
        "zh_tw": "冰島",
    },
    "isl": "is",
    "it": {
        "de_de": "Italien",
        "en_uk": "Italy",
        "en_us": "Italy",
        "es_es": "Italia",
        "fr_fr": "Italie",
        "ja_jp": "イタリア",
        "ko_kr": "이탈리아",
        "sv_se": "Italien",
        "zh_cn": "意大利",
        "zh_hk": "義大利",
        "zh_tw": "義大利",
    },
    "ita": "it",
    "jp": {
        "de_de": "Japan",
        "en_uk": "Japan",
        "en_us": "Japan",
        "es_es": "Japón",
        "fr_fr": "Japon",
        "ja_jp": "日本",
        "ko_kr": "일본",
        "sv_se": "Japan",
        "zh_cn": "日本",
        "zh_hk": "日本",
        "zh_tw": "日本",
    },
    "jpn": "jp",
    "kr": {
        "en_us": "South Korea",
        "ja_jp": "韓国",
        "ko_kr": "대한민국",
        "zh_cn": "韩国",
        "zh_hk": "韓国",
        "zh_tw": "韓国",
    },
    "kor": "kr",
    "mo": {
        "en_us": "Macau",
        "zh_cn": "澳门",
        "zh_mo": "澳門",
    },
    "mac": "mo",
    "nl": {
        "en_us": "Netherlands",
        "nl_nl": "Nederland",
    },
    "nld": "nl",
    "no": {
        "en_us": "Norway",
        "no_no": "Norge",
    },
    "nor": "no",
    "ph": {
        "en_us": "Philippines",
    },
    "phl": "ph",
    "pl": {
        "en_us": "Poland",
        "pl_pl": "Polska",
    },
    "pol": "pl",
    "pt": {
        "de_de": "Portugal",
        "en_uk": "Portugal",
        "en_us": "Portugal",
        "es_es": "Portugal",
        "fr_fr": "Portugal",
        "ja_jp": "ポルトガル",
        "ko_kr": "포르투갈",
        "sv_se": "Portugal",
        "zh_cn": "葡萄牙",
        "zh_hk": "葡萄牙",
        "zh_tw": "葡萄牙",
    },
    "prt": "pt",
    "ru": {
        "de_de": "Russland",
        "en_uk": "Russia",
        "en_us": "Russia",
        "es_es": "Rusia",
        "fr_fr": "Russie",
        "ja_jp": "ロシア",
        "ko_kr": "러시아",
        "ru_ru": "Россия",
        "sv_se": "Ryssland",
        "zh_cn": "俄罗斯",
        "zh_hk": "俄羅斯",
        "zh_tw": "俄羅斯",
    },
    "rus": "ru",
    "sa": {
        "ar_sa": "السعودية",
        "de_de": "Saudi-Arabien",
        "en_uk": "Saudi Arabia",
        "en_us": "Saudi Arabia",
        "es_es": "Arabia Saudita",
        "fr_fr": "Arabie saoudite",
        "ja_jp": "サウジアラビア",
        "ko_kr": "사우디아라비아",
        "sv_se": "Saudiarabien",
        "zh_cn": "沙特阿拉伯",
        "zh_hk": "沙特阿拉伯",
        "zh_tw": "沙烏地阿拉伯",
    },
    "sau": "sa",
    "se": {
        "en_us": "Sweden",
        "sv_se": "Sverige",
        "zh_cn": "瑞典"
    },
    "swe": "se",
    "tr": {
        "en_us": "Turkey",
    },
    "tur": "tr",
    "tw": {
        "en_us": "Taiwan",
        "zh_tw": "台灣",
    },
    "twn": "tw",
    "ua": {
        "de_de": "Ukraine",
        "en_uk": "Ukraine",
        "en_us": "Ukraine",
        "es_es": "Ucrania",
        "fr_fr": "Ukraine",
        "ja_jp": "ウクライナ",
        "ko_kr": "우크라이나",
        "sv_se": "Ukraina",
        "zh_cn": "乌克兰",
        "zh_hk": "烏克蘭",
        "zh_tw": "烏克蘭",
    },
    "ukr": "ua",
    "us": {
        "de_de": "Vereinigte Staaten",
        "en_uk": "United States",
        "en_us": "United States",
        "es_es": "Estados Unidos",
        "fr_fr": "États-Unis",
        "ja_jp": "アメリカ",
        "ko_kr": "미국",
        "sv_se": "USA",
        "zh_cn": "美国",
        "zh_hk": "美國",
        "zh_tw": "美國",
    },
    "usa": "us",
}

function get_region_name_by_code(region_code : string, lang_code : string) {

    if(region_code in region_name_by_code) {

        if(typeof region_name_by_code[region_code] === "string")
            region_code = region_name_by_code[region_code]

        if(region_code in region_name_by_code && typeof region_name_by_code[region_code] === "object")
            return pick_best_fit_from_chamber(region_name_by_code[region_code], lang_code)
    }

    return null
}


const currency_name_by_code = {
    "aud": {
        "en_us": "Australian Dollar",
        "zh_cn": "澳洲元"
    },
    "cad": {
        "en_us": "Canadian Dollar",
        "ja_jp": "カナダドル",
        "zh_cn": "加拿大元"
    },
    "chf": {
        "en_us": "Swiss Franc",
        "zh_cn": "瑞士法郎"
    },
    "clp": {
        "en_us": "Chilean Peso",
        "zh_cn": "智利皮索"
    },
    "cny": {
        "en_us": "Chinese Yuan",
        "ja_jp": "中国円",
        "zh_cn": "人民币"
    },
    "egp": {
        "en_us": "Egyptian Pound",
        "zh_cn": "埃及磅"
    },
    "eur": {
        "en_us": "Euro",
        "zh_cn": "欧元"
    },
    "gbp": {
        "en_us": "Pound Sterling",
        "zh_cn": "英镑"
    },
    "hkd": {
        "en_us": "Hong Kong Dollar",
        "zh_cn": "港元"
    },
    "inr": {
        "en_us": "Indian Rupee",
        "zh_cn": "印度卢比"
    },
    "isk": {
        "en_us": "Iceland Krona",
        "zh_cn": "冰岛克朗"
    },
    "jpy": {
        "en_us": "Japanese Yen",
        "ja_jp": "円",
        "zh_cn": "日元"
    },
    "krw": {
        "en_us": "Korean Won",
        "ja_jp": "韓国円",
        "zh_cn": "韩元"
    },
    "mxn": {
        "en_us": "Mexican Peso",
        "zh_cn": "墨西哥皮索"
    },
    "nok": {
        "en_us": "Norwegian Krone",
        "zh_cn": "挪威克朗"
    },
    "npr": {
        "en_us": "Nepalese Rupee",
        "zh_cn": "尼泊尔卢比"
    },
    "nzd": {
        "en_us": "New Zealand Dollar",
        "zh_cn": "新西兰元"
    },
    "rub": {
        "en_us": "Russian Ruble",
        "zh_cn": "俄罗斯卢布"
    },
    "sek": {
        "en_us": "Swedish Krona",
        "zh_cn": "瑞典克朗"
    },
    "twd": {
        "en_us": "New Taiwan Dollar",
        "zh_cn": "新台币"
    },
    "usd": {
        "en_us": "United States Dollar",
        "ja_jp": "米ドル",
        "zh_cn": "美元"
    },
}


const timezone_name_by_code = {

}


const measure_name_by_code = {
    "metric": {
        "de_de": "Metrisches Einheitensystem",
        "en_uk": "Metric system",
        "en_us": "Metric system",
        "es_es": "Sistema Métrico Decimal",
        "fr_fr": "Système métrique",
        "ja_jp": "メートル法",
        "ko_kr": "미터법",
        "sv_se": "Metersystemet",
        "zh_cn": "公制单位",
        "zh_hk": "公制單位",
        "zh_tw": "公制單位",
    },
    "us": {
        "de_de": "Vereinigte Staaten übliche Einheiten",
        "en_uk": "United States customary units",
        "en_us": "United States customary units",
        "es_es": "Unidades tradicionales de Estados Unidos",
        "fr_fr": "Unités de mesure américaines",
        "ja_jp": "米国慣用単位",
        "ko_kr": "미국 단위계",
        "sv_se": "Traditionella amerikanska mått",
        "zh_cn": "美制单位",
        "zh_hk": "美制單位",
        "zh_tw": "美制單位",
    },

}


const language_name_in_own_language = {
    "de_de": "Deutsch",
    "en_us": "English",
    "en_uk": "English",
    "es_es": "Español",
    "fr_fr": "Français",
    "ja_jp": "日本語",
    "ko_kr": "한국어",
    "sv_se": "Svenska",
    "zh_cn": "中文",
    "zh_hk": "中文",
    "zh_tw": "中文",
}


const language_name_with_variant_in_own_language = {
    "de_de": "Deutsch",
    "en_us": "United States English",
    "en_uk": "United Kingdom English",
    "es_es": "Español",
    "fr_fr": "Français",
    "ja_jp": "日本語",
    "ko_kr": "한국어",
    "sv_se": "Svenska",
    "zh_cn": "简体中文",
    "zh_hk": "繁體中文",
    "zh_tw": "正體中文",
}


const language_preferred_parentheses_front_split = {
    "de_de": " (${1})",
    "en_uk": " (${1})",
    "en_us": " (${1})",
    "es_es": " (${1})",
    "fr_fr": " (${1})",
    "ja_jp": " （${1}）",
    "ko_kr": " (${1})",
    "sv_se": " (${1})",
    "zh_cn": " （${1}）",
    "zh_hk": " （${1}）",
    "zh_tw": " （${1}）",
}


const accepted_languages = (function(){

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

export default accepted_languages