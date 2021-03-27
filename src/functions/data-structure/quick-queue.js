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
exports.QuickQueue = exports.QuickQueueOutOfBoundsError = void 0;
var QuickQueueOutOfBoundsError = (function (_super) {
    __extends(QuickQueueOutOfBoundsError, _super);
    function QuickQueueOutOfBoundsError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuickQueueOutOfBoundsError;
}(Error));
exports.QuickQueueOutOfBoundsError = QuickQueueOutOfBoundsError;
var QuickQueue = (function () {
    function QuickQueue() {
        this.core_data = new Map();
        this.left_bound = 0n;
        this.right_bound = 0n;
    }
    QuickQueue.prototype.size = function () {
        return this.right_bound - this.left_bound;
    };
    QuickQueue.prototype.push = function (item) {
        this.core_data.set(this.right_bound, item);
        this.right_bound++;
    };
    QuickQueue.prototype.unshift = function (item) {
        this.left_bound--;
        this.core_data.set(this.left_bound, item);
    };
    QuickQueue.prototype.pop_peek = function () {
        if (this.size() <= 0)
            throw new QuickQueueOutOfBoundsError();
        return this.core_data.get(this.right_bound - 1n);
    };
    QuickQueue.prototype.shift_peek = function () {
        if (this.size() <= 0)
            throw new QuickQueueOutOfBoundsError();
        return this.core_data.get(this.left_bound);
    };
    QuickQueue.prototype.pop = function () {
        if (this.size() <= 0)
            throw new QuickQueueOutOfBoundsError();
        this.right_bound -= 1n;
        var got = this.core_data.get(this.right_bound);
        this.core_data.delete(this.right_bound);
        return got;
    };
    QuickQueue.prototype.shift = function () {
        if (this.size() <= 0)
            throw new QuickQueueOutOfBoundsError();
        var got = this.core_data.get(this.left_bound);
        this.core_data.delete(this.left_bound);
        this.left_bound += 1n;
        return got;
    };
    QuickQueue.prototype.peek = function (index) {
        if (index >= this.size() || index < 0)
            throw new QuickQueueOutOfBoundsError();
        return this.core_data.get(this.left_bound + index);
    };
    QuickQueue.prototype.change = function (index, item) {
        if (index >= this.size() || index < 0)
            throw new QuickQueueOutOfBoundsError();
        this.core_data.set(this.left_bound + index, item);
    };
    QuickQueue.prototype.forEach = function (f) {
        this.core_data.forEach(f);
    };
    QuickQueue.prototype.toString = function () {
        var arr = [];
        for (var i = 0n; i < this.size(); i++) {
            arr.push(String(this.peek(i)));
        }
        return "[" + arr.join(", ") + "]";
    };
    QuickQueue.prototype.entries = function () {
        return this.core_data.entries();
    };
    return QuickQueue;
}());
exports.QuickQueue = QuickQueue;
//# sourceMappingURL=quick-queue.js.map