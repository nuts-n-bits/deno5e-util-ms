export function uri_correctness_check(uri) {
    try {
        decodeURI(uri);
    }
    catch (e) {
        return false;
    }
    return true;
}
//# sourceMappingURL=uri-correctness-check.js.map