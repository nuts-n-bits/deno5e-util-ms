"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tape = void 0;
var overhead_constant = 20n;
var placeholder = null;
var placeholder_overhead_constant = 10n;
var Tape = (function () {
    function Tape(length) {
        this.length = length;
        this.version = Tape.version;
        this.core_data_holder = new Map();
        this.k_queue = [];
        this.l_queue = [];
        this.count = 0n;
        this.available = length;
    }
    Tape.prototype.drop_excessive = function () {
        while (this.available < 0 && this.k_queue.length > 0) {
            var drop_k = this.k_queue.pop();
            var drop_l = this.l_queue.pop();
            if (drop_k !== undefined && drop_k !== null && drop_l !== undefined && drop_l !== null) {
                this.core_data_holder.delete(drop_k);
                this.available += drop_l;
                this.count -= 1n;
            }
        }
    };
    Tape.prototype.estimate_item_size = function (k, v) {
        return BigInt(k.length) * 4n + BigInt(v.length) * 2n + overhead_constant;
    };
    Tape.prototype.resize = function (new_length) {
        var original_length = this.length;
        var diff = new_length - original_length;
        this.length = new_length;
        this.available += diff;
        this.drop_excessive();
    };
    Tape.prototype.record = function (k, v) {
        var est_length = this.estimate_item_size(k, v);
        if (est_length > this.length) {
            return;
        }
        if (this.core_data_holder.has(k)) {
            var pos = this.k_queue.indexOf(k);
            var original_length = this.l_queue[pos];
            var diff = est_length - original_length;
            this.l_queue[pos] = est_length;
            this.available -= diff;
            this.core_data_holder.set(k, v);
            this.read(k);
        }
        else {
            this.available -= est_length;
            this.count += 1n;
            this.k_queue.unshift(k);
            this.l_queue.unshift(est_length);
            this.core_data_holder.set(k, v);
        }
        this.drop_excessive();
    };
    Tape.prototype.read = function (key) {
        var try_get = this.core_data_holder.get(key);
        if (!try_get) {
            return null;
        }
        var pos = this.k_queue.indexOf(key);
        if (pos !== 0) {
            var k = this.k_queue[pos];
            var l = this.l_queue[pos];
            this.k_queue[pos] = placeholder;
            this.l_queue[pos] = placeholder_overhead_constant;
            this.k_queue.unshift(k);
            this.l_queue.unshift(l);
            this.available -= placeholder_overhead_constant;
        }
        return try_get;
    };
    Tape.prototype.exist = function (key) {
        return this.core_data_holder.has(key);
    };
    Tape.prototype.delete = function (key) {
        if (this.core_data_holder.has(key)) {
            var pos = this.k_queue.indexOf(key);
            var k = this.k_queue[pos];
            var l = this.l_queue[pos];
            this.k_queue[pos] = placeholder;
            this.l_queue[pos] = placeholder_overhead_constant;
            this.core_data_holder.delete(key);
            this.available += l - placeholder_overhead_constant;
            return true;
        }
        else {
            return false;
        }
    };
    Tape.prototype.estimated_remaining_length = function () {
        return this.length - this.available;
    };
    Tape.version = "2019.9.1";
    return Tape;
}());
exports.Tape = Tape;
//# sourceMappingURL=tape.js.map