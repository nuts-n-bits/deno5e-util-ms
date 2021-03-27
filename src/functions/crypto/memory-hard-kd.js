"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memory_hard_key_derivation = void 0;
var misc_1 = require("../misc");
function memory_hard_key_derivation(preimage, hash_function, memory_factor, rest_factor) {
    return __awaiter(this, void 0, void 0, function () {
        var memory_hard_image_pool, phase_2_latest_image, i, i, number_derived, hash_choice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memory_hard_image_pool = [hash_function(preimage)];
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!(i < memory_factor)) return [3, 4];
                    memory_hard_image_pool[i] = hash_function(memory_hard_image_pool[i - 1]);
                    if (!(i % rest_factor === 0)) return [3, 3];
                    return [4, misc_1.async_sleep(0)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3, 1];
                case 4:
                    phase_2_latest_image = memory_hard_image_pool[memory_factor - 1];
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < memory_factor)) return [3, 8];
                    number_derived = (phase_2_latest_image[0] << 24 | phase_2_latest_image[1] << 16 | phase_2_latest_image[2] << 8 | phase_2_latest_image[3] << 0) >>> 0;
                    hash_choice = memory_hard_image_pool[number_derived % memory_hard_image_pool.length];
                    phase_2_latest_image = hash_function(ab_concat(hash_choice, phase_2_latest_image));
                    if (!(i % rest_factor === 0)) return [3, 7];
                    return [4, misc_1.async_sleep(0)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i++;
                    return [3, 5];
                case 8: return [2, memory_hard_image_pool[memory_hard_image_pool.length - 1]];
            }
        });
    });
}
exports.memory_hard_key_derivation = memory_hard_key_derivation;
function ab_concat(ab1, ab2) {
    var concat = new Uint8Array(ab1.length + ab2.length);
    concat.set(ab1, 0);
    concat.set(ab2, ab1.length);
    return concat;
}
//# sourceMappingURL=memory-hard-kd.js.map