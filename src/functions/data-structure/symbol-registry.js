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
exports.SymbolRegistry = exports.SymbolRegistryDoubleNsNameRegistrationError = exports.SymbolRegistryDoubleIdRegistrationError = void 0;
var SymbolRegistryDoubleIdRegistrationError = (function (_super) {
    __extends(SymbolRegistryDoubleIdRegistrationError, _super);
    function SymbolRegistryDoubleIdRegistrationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SymbolRegistryDoubleIdRegistrationError;
}(Error));
exports.SymbolRegistryDoubleIdRegistrationError = SymbolRegistryDoubleIdRegistrationError;
var SymbolRegistryDoubleNsNameRegistrationError = (function (_super) {
    __extends(SymbolRegistryDoubleNsNameRegistrationError, _super);
    function SymbolRegistryDoubleNsNameRegistrationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SymbolRegistryDoubleNsNameRegistrationError;
}(Error));
exports.SymbolRegistryDoubleNsNameRegistrationError = SymbolRegistryDoubleNsNameRegistrationError;
var SymbolRegistry = (function () {
    function SymbolRegistry() {
        this._name_namespace_by_id = new Map();
        this._id_by_name_namespace = new Map();
    }
    SymbolRegistry.prototype.register = function (id, namespace, name) {
        if (this._name_namespace_by_id.has(id))
            throw new SymbolRegistryDoubleIdRegistrationError();
        if (this._id_by_name_namespace.has(namespace) && this._id_by_name_namespace.get(namespace).has(name))
            throw new SymbolRegistryDoubleNsNameRegistrationError();
        this._name_namespace_by_id.set(id, [namespace, name]);
        var namespaced_map = this._id_by_name_namespace.get(namespace) || new Map();
        namespaced_map.set(name, id);
        this._id_by_name_namespace.set(namespace, namespaced_map);
        return this;
    };
    SymbolRegistry.prototype.look_up = function (arg1, arg2) {
        if (typeof arg1 === "bigint")
            return this.look_up_1(arg1);
        else
            return this.look_up_2(arg1, arg2);
    };
    SymbolRegistry.prototype.look_up_1 = function (id) {
        return this._name_namespace_by_id.get(id) || null;
    };
    SymbolRegistry.prototype.look_up_2 = function (namespace, name) {
        var namespace_map = this._id_by_name_namespace.get(namespace);
        if (namespace_map === undefined)
            return null;
        var id = namespace_map.get(name);
        if (id === undefined)
            return null;
        else
            return id;
    };
    return SymbolRegistry;
}());
exports.SymbolRegistry = SymbolRegistry;
//# sourceMappingURL=symbol-registry.js.map