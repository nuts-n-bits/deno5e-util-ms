"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.const_time_eq = void 0;
function const_time_eq(str1, str2) {
    if (str1.length !== str2.length)
        return false;
    var arr1 = Array.from(str1).map(function (x) { return x.charCodeAt(0); });
    var arr2 = Array.from(str2).map(function (x) { return x.charCodeAt(0); });
    var arr3 = [];
    for (var i = 0; i < arr1.length && i < arr2.length; i++) {
        arr3[i] = arr1[i] ^ arr2[i];
    }
    var sum = arr3.reduce(function (a, b) { return a + b; }, 0);
    return sum === 0;
}
exports.const_time_eq = const_time_eq;
//# sourceMappingURL=const-time-eq.js.map