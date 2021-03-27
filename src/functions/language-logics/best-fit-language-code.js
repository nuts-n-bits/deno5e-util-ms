"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.complete_chamber = exports.language_list_from_header = exports.mlc = exports.best_fit_chamber_content = exports.concrete_check_string_is_language_code = void 0;
var language_code_definition = {
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
};
function concrete_check_string_is_language_code(string) {
    if (string === null || string === undefined) {
        return null;
    }
    else if (language_code_definition[string]) {
        return string;
    }
    else {
        return null;
    }
}
exports.concrete_check_string_is_language_code = concrete_check_string_is_language_code;
function best_fit_chamber_content(requested_codes, chamber) {
    for (var _i = 0, requested_codes_1 = requested_codes; _i < requested_codes_1.length; _i++) {
        var code = requested_codes_1[_i];
        var try_1 = chamber.get(code);
        if (try_1 !== undefined) {
            return try_1;
        }
        var short_code = concrete_check_string_is_language_code(code.split("-")[0]);
        if (short_code === null) {
            return null;
        }
        var try_2 = chamber.get(short_code);
        if (try_2 !== undefined) {
            return try_2;
        }
    }
    return null;
}
exports.best_fit_chamber_content = best_fit_chamber_content;
function mlc(requested_codes, chamber) {
    var filtered_codes = requested_codes.filter(function (candidate) { return concrete_check_string_is_language_code(candidate) !== null; });
    var try_1 = best_fit_chamber_content(filtered_codes, chamber);
    if (try_1 !== null) {
        return try_1;
    }
    else {
        var try_2 = chamber.get("en-us");
        if (try_2 !== undefined) {
            return try_2;
        }
        var try_3 = chamber.get("en");
        if (try_3 !== undefined) {
            return try_3;
        }
        else {
            var try_4 = __spreadArray([], chamber.entries())[0];
            if (try_4 !== undefined) {
                return try_4[1];
            }
            else {
                return "--";
            }
        }
    }
}
exports.mlc = mlc;
function language_list_from_header(accept_language_header) {
    var list = accept_language_header.toLowerCase().split(",").map(function (x) { return x.split(";")[0].trim(); });
    return list;
}
exports.language_list_from_header = language_list_from_header;
function complete_chamber(original_chamber) {
    var cc = new Map();
    for (var _i = 0, original_chamber_1 = original_chamber; _i < original_chamber_1.length; _i++) {
        var _a = original_chamber_1[_i], k = _a[0], v = _a[1];
        var partial = concrete_check_string_is_language_code(k.split("-")[0]);
        if (partial !== null && cc.get(partial) === undefined) {
            cc.set(partial, v);
        }
        cc.set(k, v);
    }
    return cc;
}
exports.complete_chamber = complete_chamber;
//# sourceMappingURL=best-fit-language-code.js.map