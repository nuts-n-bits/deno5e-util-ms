"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Easier_mutation_map = void 0;
var Easier_mutation_map = (function (_super) {
    __extends(Easier_mutation_map, _super);
    function Easier_mutation_map() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Easier_mutation_map.prototype.change = function (key, func) {
        var original_value = this.get(key);
        var calculated_value = func(original_value);
        if (calculated_value === undefined) {
            this.delete(key);
        }
        else {
            this.set(key, calculated_value);
        }
    };
    return Easier_mutation_map;
}(Map));
exports.Easier_mutation_map = Easier_mutation_map;
//# sourceMappingURL=easier-mutation-map.js.map