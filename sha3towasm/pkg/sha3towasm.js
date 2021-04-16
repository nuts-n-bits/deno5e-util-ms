let imports = {};
let wasm;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
const sha3_256 = function(input) {
    var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.sha3_256(8, ptr0, len0);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
};
export { sha3_256 };

/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
const sha3_512 = function(input) {
    var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.sha3_512(8, ptr0, len0);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
};
export { sha3_512 };

/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
const sha2_256 = function(input) {
    var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.sha2_256(8, ptr0, len0);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
};
export { sha2_256 };

/**
* @param {Uint8Array} input
* @returns {Uint8Array}
*/
const sha1_160 = function(input) {
    var ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.sha1_160(8, ptr0, len0);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
};
export { sha1_160 };

import WASI from 'https://deno.land/std/wasi/snapshot_preview1.ts';
const wasi = new WASI({
    args: Deno.args,
    env: Deno.env.toObject(),
});
imports = { wasi_snapshot_preview1: wasi.exports };

import { wasmprogram } from "./wasm.js"
const wasmModule = new WebAssembly.Module(new Uint8Array(wasmprogram));
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;

wasi.memory = wasmInstance.exports.memory;

