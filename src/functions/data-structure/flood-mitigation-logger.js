"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flood_mitigation_logger = void 0;
var Flood_mitigation_logger = (function () {
    function Flood_mitigation_logger(visit_limit, memory_length) {
        this.visit_limit = visit_limit;
        this.memory_length = memory_length;
        this.map = new Map();
    }
    Flood_mitigation_logger.prototype.log_visit = function (uid, amount) {
        var _this = this;
        if (amount === void 0) { amount = 1n; }
        var visit_count = this.map.get(uid) || 0n;
        if (visit_count >= this.visit_limit) {
            return false;
        }
        else {
            this.map.set(uid, visit_count + amount);
            setTimeout(function () {
                var visit_count = _this.map.get(uid) || 0n;
                if (visit_count <= 1n) {
                    _this.map.delete(uid);
                }
                else {
                    _this.map.set(uid, visit_count - amount);
                }
            }, this.memory_length);
            return true;
        }
    };
    return Flood_mitigation_logger;
}());
exports.Flood_mitigation_logger = Flood_mitigation_logger;
//# sourceMappingURL=flood-mitigation-logger.js.map