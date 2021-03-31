import { hmac } from "./hmac.ts"
import { sha1, block_size_sha1 } from "./sha1.ts"

// take current UNIX time, integer divide 30, treat it as infinite precision integer, convert to byte array, big-endian.
// array is 8 bytes long.

function padded_time_byte_array(jst: bigint): Uint8Array {

    const i = jst / 1000n / 30n
    const counter_array = new Uint8Array(8)
    counter_array.set(
        [
            Number((i&(0xFFn<<56n))>>56n),
            Number((i&(0xFFn<<48n))>>48n),
            Number((i&(0xFFn<<40n))>>40n),
            Number((i&(0xFFn<<32n))>>32n),
            Number((i&(0xFFn<<24n))>>24n),
            Number((i&(0xFFn<<16n))>>16n),
            Number((i&(0xFFn<< 8n))>> 8n),
            Number((i&(0xFFn<< 0n))>> 0n),
        ]
    )

    return new Uint8Array(counter_array)
}

// function padded_time_byte_array_legacy(jst: number): Array<number> {

//     let counter_text = Math.floor(jst / 1000 / 30).toString(16)
//     counter_text = counter_text.length % 2 === 0 ? "" : "0" + counter_text
//     let counter_array = group_string(counter_text, 2).map(x => parseInt(x, 16))

//     while(counter_array.length < 8)
//         counter_array = [0, ...counter_array]

//     return counter_array
// }

function group_string(str: string, num: number): Array<string> {

    const arr: string[] = []

    for(let i=0; i<str.length/num; i++) {

        arr[i] = str.substr(i*num, num)
    }

    return arr

}

function b32_to_c08(base32: string): Uint8Array {

    base32 = base32.toUpperCase()

    if(!/^[A-Z2-7]*$/.test(base32))
        throw new Error("illegal character in base32 string")

    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

    const pad = ["", "AAAAAAAA", "AAAAAA", "AAAAA", "AAAA", "AAA", "AA", "A"]

    base32 += pad[(base32.length % 8)]

    const grouped_string_array = group_string(base32, 8)
    const byte_array: number[] = []

    for(let i=0; i<grouped_string_array.length; i++) {

        const x = grouped_string_array[i]!
        const a = (charset.indexOf(x[0]!)<<3 | charset.indexOf(x[1]!)>>2) & 255
        const b = (charset.indexOf(x[1]!)<<6 | charset.indexOf(x[2]!)<<1 | charset.indexOf(x[3]!)>>4) & 255
        const c = (charset.indexOf(x[3]!)<<4 | charset.indexOf(x[4]!)>>1) & 255
        const d = (charset.indexOf(x[4]!)<<7 | charset.indexOf(x[5]!)<<2 | charset.indexOf(x[6]!)>>3) & 255
        const e = (charset.indexOf(x[6]!)<<5 | charset.indexOf(x[7]!)>>0) & 255

        byte_array.push(a,b,c,d,e)
    }

    return new Uint8Array(byte_array)
}

export function totp_hmac_sha1(base32: string, jst: bigint): number {

    const secret_byte_array = b32_to_c08(base32)
    const time_byte_array = padded_time_byte_array(jst)

    const otp = hmac(sha1, secret_byte_array, time_byte_array, block_size_sha1)

    // truncation to take a sha1 hash image and give a 6-digit integer
    // defined by RFC 4226
    const offset = otp[otp.length - 1]! & 15  // 4 lsb of last byte as 'offset'

    // extract bytes numbered from offset to offset+3
    const a = otp[offset]! & 127  // 0-mask msb (RFC 4226 comment: avoid confusion with signed int)
    const b = otp[offset+1]!
    const c = otp[offset+2]!
    const d = otp[offset+3]!

    // form a 32 bit unsigned integer w/ msb masked
    const result = a << 24 | b << 16 | c << 8 | d

    // mod 1e6
    return result % 1e6

}