
import { ubr } from "./universal-bit-regrouping.js"

export function hex_to_uint8array (hex: string): Uint8Array {

    return new Uint8Array(ubr(4, 8, hex.split("").map(x => parseInt(x, 16))))
}

export function uint8array_to_hex (u8: Uint8Array): string {
    
    let hex = ""
    ubr(8, 4, u8).forEach((number: number) => { hex += number.toString(16) })
    return hex
}