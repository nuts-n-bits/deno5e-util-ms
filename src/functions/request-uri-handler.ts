// pure

const query_char = "?"
const query_char_length = query_char.length

import { Handled } from "../protocols/handled-uri"
import { Quick_queue } from "./data-structure/quick-queue"

export function request_uri_handler (uri_str: string): Handled {

    /*

    A walk-through:
    input: "/aaa/bbb/ccc//ddd/xxx:yyy/image.ext?query=value1&query2=value2"

    0. "/aaa/bbb/ccc//ddd/x:y_=$$yy/image.ext?query=value1&query2=value2"
    1. uri_str = "/aaa/bbb/ccc//ddd/x:y_=$$yy/image.ext", query = "query=value1&query2=value2" ...... separated by first question mark
    2. uri_str = "aaa/bbb/ccc//ddd/x:y_=$$yy/image.ext" ...... first character dropped
    3. ["aaa", "bbb", "ccc", "", "ddd", "x:y_=$$yy", "image.ext"] ...... split by "/"
    4. ["aaa", "bbb", "ccc", "ddd", "x:y_=$$yy", "image.ext"] ...... drop empty entries

    */

    const query_starting_pos = uri_str.indexOf(query_char)
    const query = query_starting_pos < 0 ? "" : uri_str.substr(query_starting_pos + query_char_length)
    const uri_sans_query = query_starting_pos < 0 ? uri_str : uri_str.substr(0, query_starting_pos)

    // split uri.
    const uri_split = uri_sans_query.substr(1).split("/").filter(fragment => fragment !== "")
    const get_ordered = new Quick_queue<string>()
    uri_split.forEach(uri_fragment => get_ordered.push(uri_fragment))

    // fill cheese with empty string if ordered entry has a length of 0.
    const app = uri_split.length > 0 ? uri_split[0] : ""

    return {
        app,
        get_ordered,
        query,
        uri_sans_query
    }
}




































/*

const fn = function(uri_str) {
    //
    //
    // I. walk-through of this uri-parsing function
    //
    // uri_str: "http[s?]://www.foo.com/intl/en-ca/aaa/bbb/ccc//ddd/xxx:yyy/image.ext"
    // this function expects to deal with this part of the uri: "/intl/en-ca/aaa/bbb/ccc//ddd/xxx:yyy/image.ext"
    //
    // rules:
    // 1. explode by delimiter "/"
    // 2. empty entries gets dropped (like between ccc and ddd)
    // 3. ["intl"] gets dropped out. anything following it (en-ca) gets parsed as intl code then dropped.
    // 4. ["xxx:yyy"] gets parsed. yyy gets parsed and is labeled "xxx". entry gets dropped.
    // 5. everything else gets parsed and labelled numerically
    // 6. parsed data No.0 gets re-labelled as cheese (not dropped)
    //
    // 0. "/intl/en-ca/aaa/bbb/ccc//ddd/xxx:yyy/image.ext"
    // 1. ["", "intl", "en-ca", "aaa", "bbb", "ccc", "", "ddd", "xxx:yyy", "image.ext"] ...... exploded
    // 2. ["intl", "en-ca", "aaa", "bbb", "ccc", "ddd", "xxx:yyy", "image.ext"] ...... empty entries dropped
    // 3. ["aaa", "bbb", "ccc", "ddd", "xxx:yyy", "image.ext"] (intl:en-ca) ...... intl taken care of
    // 4. ["aaa", "bbb", "ccc", "ddd", "image.ext"] (intl:en-ca, xxx:yyy) ...... k-v pairs registered
    // 5. (intl:en-ca, xxx:yyy, 0:aaa, 1:bbb, 2:ccc, 3:ddd, 4:image.ext) ...... everything else labelled orderly
    // 6. (intl:en-ca, xxx:yyy, 0:aaa, 1:bbb, 2:ccc, 3:ddd, 4:image.ext, cheese:aaa) ...... cheese picked, response_end
    //
    // notes:
    // i.    2, 3 and 4 happens concurrently within one for loop
    // ii.   intl and cheese can't be accessed by the get() function. they're reported by other means
    // iii.  when two keys collide (/xxx:123/xxx:yyy/), the first one gets overwritten.
    // iv.   bad intl code (/intl/gibberish/) gets ignored and dropped out
    // v.    accepted intl code is defined within accepted_languages.jsz
    // vi.   explicit numerical keys will be viewed as different keys.
    //       ...... (/cheese/aaa/1:bbb/) => (0:cheese, 1:aaa, "1":bbb) => get(1):aaa, get("1"):bbb
    //       ...... therefore, to avoid confusion, do not use them.
    // vii.  when the cheese you're communicating with gets complicated, go with k-v model. Maximizes clarity.
    // viii. the data that have a designated key is referred to as dictionary/unordered entry, whereas the data whose
    //       ...... key is given by the order is called depth entry, or ordered entry.
    //
    //
    // II. general advises towards a bulletproof uri
    //
    // 1. consult with your cheese as of which labeling method to use (numerical order or key-value order)
    // 2. do not include colons in data strings. they're parsed as k-v pairs.
    // 3. do not contain an "intl" data string. it is reserved for localization purposes. (however /intl:xxx/ is fine)
    // 4. do not use numbers as keys. they're processed separately and they increase complexity.
    // 5. lang_indicator (/intl/en-ca/) can be inserted anywhere replacing a slash.
    //    ...... however inserting it immediately after host name is best for clarity.
    // 6. k-v pairs (/xxx:yyy/) can be inserted anywhere replacing a slash.
    //    ...... however inserting them at the end of uri is best for clarity. helps counting the ordered entries.
    // 7. don't use /intl/ on its own. anything following it gets dropped whether or not it's a lang-code.
    // 8. watch out for entries that may be empty. if an ordered entry is empty, it gets dropped and everything behind it
    //    ...... gets shifted forward. use k-v for values that may be empty.

    // prerequisite variable declaration
    let cheese = null;
    let uri_ordered_parameters = [];  // 1, 2, 3 array
    let uri_unordered_parameters = {};  // dictionary-like associative array
    let raw_lang_code_compete_uri = null;
    let query_starting_pos = uri_str.indexOf(query_char);
    let query = query_starting_pos < 0 ? "" : uri_str.substr(query_starting_pos + query_char_length);
    uri_str = query_starting_pos < 0 ? uri_str : uri_str.substr(0, query_starting_pos);

    // pre-process uri.

    // explode uri.
    let uri_explode = uri_str.split("/");

    for(let i=0; i<uri_explode.length; i++)
    {
        const uri_entry = uri_explode[i];

        if(uri_entry === "")
        {
            // the particular entry gets dropped if it is empty.
            continue;
        }
        else if(uri_entry === "intl")
        {
            // this entry indicates intl, so this entry's next entry should be intl-code.
            // so, parse next entry for uri_intl_part, then drop both.
            // but first, is the next entry even defined?
            if(typeof uri_explode[i+1] !== "undefined")
            {
                // yes. report it AS-IS, then drop both. parsing of it shall be handled by languages_compete function.
                raw_lang_code_compete_uri = uri_explode[i+1];
                i++;
                continue;
            }
            else
            {
                // no. mal-formatted uri with last entry "intl" followed by nothing. so do nothing.
                continue;
            }

        }
        else if(uri_entry.indexOf(":") !== -1)
        {
            // found ":" in the entry. this entry is an unordered k-v entry. parse and drop.
            let pos = uri_entry.indexOf(":");
            let key = uri_entry.substr(0, pos);
            let val = uri_entry.substr(pos+1);

            uri_unordered_parameters[key] = val;
        }
        else
        {
            // not special cases. add to uri_explode for later ordered parameter parsing.
            uri_ordered_parameters.push(uri_entry);
        }
    }
    // ...... response_end by now: ordered and unordered uri entries, intl from uri.

    // fill cheese with empty string if ordered entry has a length of 0.
    if(uri_ordered_parameters.length === 0)
    {
        cheese = "";
    }
    else
    {
        cheese = uri_ordered_parameters[0];
    }

    return {
        // get results
        cheese: cheese,
        get_ordered: uri_ordered_parameters,
        get_unordered: uri_unordered_parameters,
        query: query,
        uri_sans_query: uri_str,

        // language code from uri
        raw_lang_uri: raw_lang_code_compete_uri,
    };
};

*/

// fn2 disregards intl (as does new context) in uri and does not drop k-v pairs after parsing them. new cheese use this version.
// if intl by uri is needed, context and language_compete still responds to query lang code. but not request_uri anymore.


const fn2 = function(uri_str :string){

    /*

    I. walk-through of this uri-parsing function

    uri_str: "http[s?]://www.foo.com/intl/en-ca/aaa/bbb/ccc//ddd/xxx:yyy/image.ext"
    this function expects to deal with this part of the uri: "/intl/en-ca/aaa/bbb/ccc//ddd/xxx:yyy/image.ext"

    rules:
    1. explode by delimiter "/"
    2. empty entries gets dropped (like between ccc and ddd)
    3. ["xxx:yyy"] gets parsed. yyy gets parsed and is labeled "xxx". entry will remain and labelled again numerically later.
    4. all entries gets parsed and labelled numerically
    5. parsed data No.0 gets re-labelled as cheese (not dropped)

    0. "/intl/en-ca/aaa/bbb/ccc//ddd/xxx:yyy/image.ext"
    1. ["", "intl", "en-ca", "aaa", "bbb", "ccc", "", "ddd", "xxx:yyy", "image.ext"] ...... exploded
    2. ["intl", "en-ca", "aaa", "bbb", "ccc", "ddd", "xxx:yyy", "image.ext"] ...... empty entries dropped
    3. ["intl", "en-ca", "aaa", "bbb", "ccc", "ddd", "xxx:yyy", "image.ext"] -> (xxx:yyy) ...... k-v pairs parsed
    4. (xxx:yyy, 0:intl, 1:en-ca, 2:aaa, 3:bbb, 4:ccc, 5:ddd, 6:xxx:yyy, 7:image.ext) ...... all gets a number
    5. (cheese:intl, xxx:yyy, 0:intl, 1:en-ca, 2:aaa, 3:bbb, 4:ccc, 5:ddd, 6:xxx:yyy, 7:image.ext) ...... cheese is added


    notes:
    a. 2 and 3 happens concurrently within one for loop
    b. when two keys collide (/xxx:123/xxx:yyy/), the first one gets overwritten.
    d. accepted intl code is defined within accepted_languages.js
    e. explicit numerical keys will be viewed as different keys.
       ...... (/cheese/aaa/1:bbb/) => (0:cheese, 1:aaa, "1":bbb) => get(1):aaa, get("1"):bbb, get(2):bbb
       ...... therefore, to avoid confusion, do not use them.
    f. when the cheese you're communicating with gets complicated, go with k-v model. this maximizes clarity. at cost of seo. or use query.
    g. the data that have a designated key is referred to as dictionary/unordered entry, whereas the data whose
       ...... key is given by the order is called depth entry, or ordered entry.


    II. general advises towards a bulletproof uri

    1. consult with your cheese as of which labeling method to use (numerical order or key-value order)
    2. do not use numbers as keys. they may cause confusion.
    3. watch out for entries that may be empty. if an ordered entry is empty, it gets dropped and everything behind it
       ...... gets shifted forward. use k-v for values that may be empty.

    */

    // prerequisite variable declaration
    let cheese = "";
    let uri_ordered_parameters : Array<string> = [];  // 1, 2, 3 array
    let uri_unordered_parameters : any = {};  // dictionary-like associative array
    let raw_lang_code_compete_uri = null;
    let query_starting_pos = uri_str.indexOf(query_char);
    let query = query_starting_pos < 0 ? "" : uri_str.substr(query_starting_pos + query_char_length).replace(/\+/g, " ");
    uri_str = query_starting_pos < 0 ? uri_str : uri_str.substr(0, query_starting_pos);

    // pre-process uri.

    // explode uri.
    let uri_explode = uri_str.split("/");

    for(let i=0; i<uri_explode.length; i++) {

        const uri_entry = uri_explode[i];

        if(uri_entry === "") {
            // the particular entry gets dropped if it is empty.
            continue;
        }

        if(uri_entry.indexOf(":") !== -1) {
            // found ":" in the entry. this entry is an unordered k-v entry. parse and proceed with ordered
            let pos = uri_entry.indexOf(":");
            let key = uri_entry.substr(0, pos);
            let val = uri_entry.substr(pos+1);
            uri_unordered_parameters[key] = val;
        }

        // add to uri_explode for later ordered parameter parsing.
        uri_ordered_parameters.push(uri_entry);

    }
    // ...... response_end by now: ordered and unordered uri entries

    // fill cheese with empty string if ordered entry has a length of 0.
    if(uri_ordered_parameters.length === 0)
    {
        cheese = "";
    }
    else
    {
        cheese = uri_ordered_parameters[0];
    }

    return {
        // get results
        cheese: cheese,
        get_ordered: uri_ordered_parameters,
        get_unordered: uri_unordered_parameters,
        query: query,
        uri_sans_query: uri_str,
    };
};
