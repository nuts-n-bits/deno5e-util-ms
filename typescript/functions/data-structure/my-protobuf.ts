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
function check_never(n: never) { return }

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
            const lsb7 = Number(bigint & 0b0111_1111n)
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

export namespace FrameCodec {

    const wire_type = {
        var: 0n,
        fix64: 1n,
        lendelim: 2n,
        fix32: 5n,
    }

    export class Fixed32 {
        value: Uint8Array
        constructor(val: Uint8Array) { this.value = new Uint8Array([val[0], val[1], val[2], val[3]]) }
    }

    export class Fixed64 {
        value: Uint8Array
        constructor(val: Uint8Array) { this.value = new Uint8Array([val[0], val[1], val[2], val[3], val[4], val[5], val[6], val[7]]) }
    }

    export type TSerializerWillAccept = string | Fixed64 | Fixed32 | Uint8Array | bigint | Fields<any>

    export class Field<T extends TSerializerWillAccept> { constructor(public field_number: bigint, public item: T) {} }
    export function field(field_number: bigint, item: string): Field<string>
    export function field(field_number: bigint, item: Fixed64): Field<Fixed64>
    export function field(field_number: bigint, item: Fixed32): Field<Fixed32>
    export function field(field_number: bigint, item: Uint8Array): Field<Uint8Array>
    export function field(field_number: bigint, item: bigint): Field<bigint>
    export function field(field_number: bigint, item: any) { return new Field(field_number, item) }

    export class Fields<T> { constructor(public readonly field_number: bigint, public readonly fields: T) {} }
    export function fields<T> (field_number: bigint, fields: T) { return new Fields(field_number, fields) }
    
    export function* serialize_one_frame(member: Field<TSerializerWillAccept>): Generator<Uint8Array, void, undefined> {
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
        else if (member.item instanceof Fixed32) {
            const payload = member.item.value
            const frame_key = NumberCodec.positive_bigint_to_varint(member.field_number << 3n | wire_type.fix32)
            yield frame_key
            yield payload
        }
        else if (member.item instanceof Fixed64) {
            const payload = member.item.value
            const frame_key = NumberCodec.positive_bigint_to_varint(member.field_number << 3n | wire_type.fix64)
            yield frame_key
            yield payload
        }
        // else if (member.item instanceof SerializableFrame) {
        //     const serializer = serialize_one_frame(member.item)
        //     let emitted_payload_length = 0
        //     const chunks: Uint8Array[] = []
        //     for(const chunk of serializer) {
        //         emitted_payload_length += chunk.length
        //         chunks.push(chunk)
        //     }
        //     const payload_length = NumberCodec.positive_bigint_to_varint(BigInt(emitted_payload_length))
        //     const frame_key = NumberCodec.positive_bigint_to_varint(member.field_number << 3n | wire_type.var)
        //     yield frame_key
        //     yield payload_length
        //     for(const chunk of chunks) {
        //         yield chunk
        //     }
        // }
        else {
            //check_never(member.item)
        }
    }

    type FrameKeyParsed = {raw: bigint, field_id: bigint, wire_type: bigint }
    type ExpectNextChunkType 
        = "framekey vint next byte" 
        | "payload vint next byte" 
        | "payload length vint next byte"
        | "length delimited payload entire"
        | "fix32 payload entire"
        | "fix64 payload entire"

    export interface DeserializerInterimResult {
        request_next_chunk_length: number,
        frame_key_has_done_parsing: null | FrameKeyParsed,
        expecting_next_chunk_type: ExpectNextChunkType,
        nth_iteration: number,
    }

    function build_interim_result(
        request_next_chunk_length: number, 
        frame_key_has_done_parsing: null | FrameKeyParsed, 
        expecting_next_chunk_type: ExpectNextChunkType,
        nth_iteration: number,
    ): DeserializerInterimResult {
        return {
            request_next_chunk_length,
            frame_key_has_done_parsing,
            expecting_next_chunk_type,
            nth_iteration,
        }
    }

    /**
     * @yields The size (in bytes) of the next chunk of memory it needs to keep deserializing. If not enough bytes exist, then message error.
     * @returns After one frame finishes serializing
     * when iterating the iterator, be sure to pass in the exact amount of bytes requested by the previous yield. it will check
     */
    export function* deserialize_one_frame(): Generator<DeserializerInterimResult, Field<TSerializerWillAccept>, Uint8Array> {

        let nth_iteration = 0
        const varint_parser = NumberCodec.get_varint_parser()
        let frame_key: FrameKeyParsed

        while(true) {
            // frame key is not determined, consume byte-by-byte to decode frame key.
            const incoming_data = yield build_interim_result(1, null, "framekey vint next byte", nth_iteration++)
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
                const incoming_data = yield build_interim_result(1, frame_key, "payload vint next byte", nth_iteration++)
                if(incoming_data.length !== 1) { throw new Error("Deserializer request length must be respected") }
                const parser_outcome = payload_varint_parser.next(incoming_data[0])
                if(parser_outcome.done) {
                    return field(frame_key.field_id, parser_outcome.value)
                }
            }
        }

        // 2/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.lendelim) {
            const payload_length_specifier_parser = NumberCodec.get_varint_parser()
            let payload_length: number
            while(true) {
                const incoming_data = yield build_interim_result(1, frame_key, "payload length vint next byte", nth_iteration++)
                if(incoming_data.length !== 1) { throw new Error("Deserializer request length must be respected") }
                const parser_outcome = payload_length_specifier_parser.next(incoming_data[0])
                if (parser_outcome.done) {
                    payload_length = Number(parser_outcome.value)
                    break
                }
            }
            const payload = yield build_interim_result(payload_length, frame_key, "length delimited payload entire", nth_iteration++)
            if(payload.length !== payload_length) { throw new Error("Deserializer request length must be respected") }
            return field(frame_key.field_id, payload)
        }

        // 3/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.fix32) {
            const payload = yield build_interim_result(4, frame_key, "fix32 payload entire", nth_iteration++)
            if(payload.length !== 4) { throw new Error("Deserializer request length must be respected") }
            return field(frame_key.field_id, new Fixed32(payload))
        }

        // 4/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.fix64) {
            const payload = yield build_interim_result(8, frame_key, "fix64 payload entire", nth_iteration++)
            if(payload.length !== 8) { throw new Error("Deserializer request length must be respected") }
            return field(frame_key.field_id, new Fixed64(payload))
        }

        else {
            throw new Error("Corrput frame: wire type not supported")
        }
    }
}

namespace Util {

    export function ui8a_concat(ui8as: readonly Uint8Array[], length?: number) {
        const total_length = length ?? ui8as.map(ui8a=>ui8a.length).reduce((a,b)=>a+b, 0)
        const result = new Uint8Array(total_length)
        let bytes_written = 0
        ui8as.forEach(ui8a => {
            result.set(ui8a, bytes_written)
            bytes_written += ui8a.length
        })
        return result
    }    

    interface MultiFrameDeserializerInterimResultExtension extends FrameCodec.DeserializerInterimResult {
        one_frame_just_finished: Field<TSerializerWillAccept> | null
    }

    export function* deserialize_multi_frame(): Generator<MultiFrameDeserializerInterimResultExtension, never, Uint8Array> {
        let finished_frame: Field<TSerializerWillAccept> | null = null
        while(true) {
            const parser = deserialize_one_frame()
            let iter_result = parser.next()
            if(iter_result.done) { throw new Error("Parser iterator is not supposed to finish at first iteration.") }
            while(true) {
                const requested_bytes_length = iter_result.value.request_next_chunk_length
                const incoming_bytes = yield { ...iter_result.value, one_frame_just_finished: finished_frame }
                finished_frame = null
                if (requested_bytes_length !== incoming_bytes.length) { throw new Error("Deserializer request length must be respected") }
                const result = parser.next(incoming_bytes)
                if(result.done) { 
                    finished_frame = result.value
                    break
                }
                iter_result = result
            }
        }
    }

    export function deserialize_from_buffer(buffer: Uint8Array): FrameCodec.Field<FrameCodec.TSerializerWillAccept>[] {
        let current_position = 0
        const processed_frames: FrameCodec.Field<FrameCodec.TSerializerWillAccept>[] = []
        const parser = deserialize_multi_frame()
        let interim_result = parser.next()
        while (true) {
            // console.log(interim_result)
            const requested_bytes_length = interim_result.value.request_next_chunk_length
            if (current_position + requested_bytes_length > buffer.length) { 
                break 
            }
            const conforming_input = new Uint8Array(requested_bytes_length)
            for(let i=0; i<requested_bytes_length; i++) { conforming_input[i] = buffer[current_position+i] }
            current_position += requested_bytes_length
            const result = parser.next(conforming_input)
            if(result.value.one_frame_just_finished) { 
                processed_frames.push(result.value.one_frame_just_finished) 
            }
            interim_result = result
        }
        return processed_frames
    } 
}

export const serialize_one_frame = FrameCodec.serialize_one_frame
export const deserialize_one_frame = FrameCodec.deserialize_one_frame
export const deserialize_multi_frame = Util.deserialize_multi_frame
export const deserialize_from_buffer = Util.deserialize_from_buffer
export const Fixed32 = FrameCodec.Fixed32
export const Fixed64 = FrameCodec.Fixed64
export type  TSerializerWillAccept = FrameCodec.TSerializerWillAccept
export const Field = FrameCodec.Field
export type  Field<T extends TSerializerWillAccept> = FrameCodec.Field<T>
export const field = FrameCodec.field 
export const fields = FrameCodec.fields 


namespace Prototyping {

    const serialize_one_frame = FrameCodec.serialize_one_frame
    const deserialize_one_frame = FrameCodec.deserialize_one_frame
    const Fixed32 = FrameCodec.Fixed32
    const Fixed64 = FrameCodec.Fixed64
    type  TSerializerWillAccept = FrameCodec.TSerializerWillAccept
    const Field = FrameCodec.Field
    type  Field<T extends TSerializerWillAccept> = FrameCodec.Field<T>
    const Fields = FrameCodec.Fields
    type  Fields<T> = FrameCodec.Fields<T>
    const field = FrameCodec.field 
    const fields = FrameCodec.fields 

    const sid = "536236" + ""
    const ssec = "67938352659028930622789662493856892529064" + ""

    const data = {
        field: field(1n, sid),
        another: field(2n, ssec),
        submsg: fields(3n, {
            submsg1: field(1n, sid),
            submsg2: field(2n, ssec),
            submsg3: field(3n, new Uint8Array(3))
        })
    }

    // declare function serialize_data<T>(data: T): Uint8Array
    // type GetTheRecords<T> = { [K in keyof T]: T[K] extends Field<infer X> ? X : T[K] extends Fields<infer Y> ? GetTheRecords<Y> : never }
    // declare function deserialize_data<T>(data: Uint8Array, model: T): GetTheRecords<T>

    // const deserd = deserialize_data(new Uint8Array(10), data)

    // deserd.field
    // deserd.another
    // deserd.submsg.submsg1
    // deserd.submsg.submsg2
    // deserd.submsg.submsg3
}
