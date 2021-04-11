// Protobuf message parser by me
/* 
    SPEC
    Message = Frame | Frame | ... | Frame
    Frame = FrameKey | TypedPayload
    FrameKey = Varint(FrameID<<3|WireType)  // WireType is Integer[0,7] thus 3 bits.
    TypedPayload
        = Bytes<length=4>               if WireType = fix32    (=== 5 === 101) payload = Bytes<length=4> 
        = Bytes<length=8>               if WireType = fix64    (=== 1 === 001) payload = Bytes<length=8>
        = VarInt                        if WireType = var      (=== 0 === 000) payload = VarInt
        = VarInt(x) | Bytes<length=x>   if WireType = lendelim (=== 2 === 010) payload = Bytes<length=x>
    
*/
import { uint8a_to_bigint, bigint_to_uint8a } from "../encoding/bigint-uint8a.ts"

const wire_type = {
    var: 0n,
    fix64: 1n,
    lendelim: 2n,
    fix32: 5n,
}
namespace NumberCodec {
    function* varint_parser_generator_core(): Generator<void, bigint, number> {
        let bigint = 0n
        let runs = 0n
        while(true) {
            const incoming_number = yield
            const lsb7 = incoming_number & 0b0111_1111
            const msb1 = incoming_number & 0b1000_0000
            bigint = bigint | (BigInt(lsb7) << (7n * runs++))
            if (!msb1) { return bigint }
        }
    }

    /**
     * Use: const parser = get_varint_parser()
     * parser.next(0b1010_1100)  // done: false
     * parser.next(0b0000_0010)  // done: true, value: 300n
     */
    export function get_varint_parser() {
        const parser = varint_parser_generator_core()
        parser.next()
        return parser
    }

    export function positive_bigint_to_varint(bigint: bigint): Uint8Array {
        if (bigint < 0n) { throw new Error("Unexpected negative bigint") } 
        const array: number[] = []
        while(bigint !== 0n) {
            const lsb7 = Number(bigint) & 0b0111_1111
            bigint = bigint >> 7n
            const msb1 = (bigint === 0n ? 0 : 1) << 7
            array.push(msb1|lsb7)
        }
        return new Uint8Array(array)
    }

    export function jsfloat64_to_ui8a(...number: number[]) {
        return new Uint8Array(new Float64Array([...number]).buffer,0,8)
    }



}

export class Fixed32 {
    value: Uint8Array
    constructor(val: Uint8Array) { this.value = new Uint8Array([val[0], val[1], val[2], val[3]]) }
}
export class Fixed64 {
    value: Uint8Array
    constructor(val: Uint8Array) { this.value = new Uint8Array([val[0], val[1], val[2], val[3], val[4], val[5], val[6], val[7]]) }
}
type TSerializerWillAccept = string | Fixed64 | Fixed32 | Uint8Array | bigint
class SerializableFrame<T = TSerializerWillAccept> { constructor(public field_number: bigint, public item: T) {} }
export function serializable_member(field_number: bigint, item: TSerializerWillAccept): SerializableFrame<TSerializerWillAccept> { return new SerializableFrame(field_number, item) }

export function* serialize_one_frame(member: SerializableFrame<TSerializerWillAccept>): Generator<Uint8Array, void, undefined> {
    if(typeof member.item === "string" || member.item instanceof Uint8Array) {
        const payload = member.item instanceof Uint8Array ? (((member.item))) : (new TextEncoder().encode(member.item))
        const payload_length = NumberCodec.positive_bigint_to_varint(BigInt(payload.length))
        const frame_key = NumberCodec.positive_bigint_to_varint(member.field_number << 3n | wire_type.lendelim)
        yield frame_key
        yield payload_length
        yield payload
    }
    else if (typeof member.item === "bigint") {
        const int_value = member.item
        if(int_value < 0) {
            throw new Error("Not Implemented")
        }
        else {
            const payload = NumberCodec.positive_bigint_to_varint(int_value)
            const frame_key = NumberCodec.positive_bigint_to_varint(member.field_number << 3n | wire_type.var)
            yield frame_key
            yield payload
        }
    }
}

namespace Deserializer {
    /**
     * @yields The size (in bytes) of the next chunk of memory it needs to keep deserializing. If not enough bytes exist, then message error.
     * @returns After one frame finishes serializing
     * when iterating the iterator, be sure to pass in the exact amount of bytes requested by the previous yield. it will check
     */
    function* deserilaze_one_frame(): Generator<number, SerializableFrame<TSerializerWillAccept>, Uint8Array> {
        const varint_parser = NumberCodec.get_varint_parser()
        let frame_key: {raw: bigint, field_id: bigint, wire_type: bigint }
        while(true) {
            // frame key is not determined, consume byte-by-byte to decode frame key.
            const incoming_data = yield 1
            if(incoming_data.length !== 1) { throw new Error("Deserializer request length must be respected") }
            const parser_outcome = varint_parser.next(incoming_data[0])
            if (parser_outcome.done) {
                frame_key = { raw: parser_outcome.value, field_id: parser_outcome.value >> 3n, wire_type: parser_outcome.value & 0b111n }
                break
            }
        }

        // frame key has been established, diverge into 4 independent parsing paths
        // 1/4 - payload is varint
        if (frame_key.wire_type === wire_type.var) {
            const payload_varint_parser = NumberCodec.get_varint_parser()
            while(true) {
                const incoming_data = yield 1
                if(incoming_data.length !== 1) { throw new Error("Deserializer request length must be respected") }
                const parser_outcome = payload_varint_parser.next(incoming_data[0])
                if(parser_outcome.done) {
                    return serializable_member(frame_key.field_id, parser_outcome.value)
                }
            }
        }

        // 2/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.lendelim) {
            const payload_length_specifier_parser = NumberCodec.get_varint_parser()
            let payload_length: number
            while(true) {
                const incoming_data = yield 1
                if(incoming_data.length !== 1) { throw new Error("Deserializer request length must be respected") }
                const parser_outcome = payload_length_specifier_parser.next(incoming_data[0])
                if (parser_outcome.done) {
                    payload_length = Number(parser_outcome.value)
                    break
                }
            }
            const payload = yield payload_length
            if(payload.length !== payload_length) { throw new Error("Deserializer request length must be respected") }
            return serializable_member(frame_key.field_id, payload)
        }

        // 3/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.fix32) {
            const payload = yield 4
            if(payload.length !== 4) { throw new Error("Deserializer request length must be respected") }
            return serializable_member(frame_key.field_id, new Fixed32(payload))
        }

        // 4/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.fix64) {
            const payload = yield 8
            if(payload.length !== 8) { throw new Error("Deserializer request length must be respected") }
            return serializable_member(frame_key.field_id, new Fixed64(payload))
        }

        else {
            throw new Error("Corrput frame: wire type not supported")
        }
    }
}

export function* deserialzie_from_chunks_gen_core(): Generator<"continue"|SerializableFrame<TSerializerWillAccept>, SerializableFrame<TSerializerWillAccept>, Uint8Array> {
    let remainder_buf: Uint8Array
    while(true) {
        const incoming_buf = yield "continue"

    }

}