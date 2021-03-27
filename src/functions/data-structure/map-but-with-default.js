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
exports.Map_but_with_default = void 0;
var Map_but_with_default = (function (_super) {
    __extends(Map_but_with_default, _super);
    function Map_but_with_default(default_value_factory, staring_data) {
        var _this = this;
        if (staring_data === null || staring_data === undefined) {
            _this = _super.call(this) || this;
        }
        else {
            _this = _super.call(this, staring_data) || this;
        }
        _this.default_value_factory = default_value_factory;
        return _this;
    }
    Map_but_with_default.prototype.get = function (key) {
        var try_get = _super.prototype.get.call(this, key);
        if (try_get) {
            return try_get;
        }
        else {
            _super.prototype.set.call(this, key, this.default_value_factory());
            return _super.prototype.get.call(this, key);
        }
    };
    return Map_but_with_default;
}(Map));
exports.Map_but_with_default = Map_but_with_default;
//# sourceMappingURL=map-but-with-default.js.map