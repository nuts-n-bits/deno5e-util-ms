
import accepted_languages from "./accepted-languages"

export default function languages_compete (raw_header_lang : string|null, raw_cookie_lang : string|null, raw_query_lang : string|null)
{
    let compete_lang_header = raw_header_lang ? accepted_languages(raw_header_lang) : null;
    let compete_lang_cookie = raw_cookie_lang ? accepted_languages(raw_cookie_lang) : null;
    let compete_lang_query  = raw_query_lang  ? accepted_languages(raw_query_lang)  : null;

    let winner = "en_us";

    winner = compete_lang_header || winner;
    winner = compete_lang_cookie || winner;
    winner = compete_lang_query  || winner;

    return {
        winner: winner,
        lang_header: compete_lang_header,
        lang_cookie: compete_lang_cookie,
        lang_query: compete_lang_query
    };

};
