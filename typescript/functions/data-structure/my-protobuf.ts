// Protobuf message parser by me
/* 
    SPEC
    Message = Frame | Frame | ... | Frame
    Frame = FrameKey | TypedPayload
    FrameKey = Varint(FrameID<<3|WireType)  // WireType is Integer[0,7] thus 3 bits.
    TypedPayload
        = Bytes<length=4>               if WireType = fix32    (=== 5 === 101) payload = Bytes<length=4> 
        = Bytes<length=8>               if WireType = fix64    (=== 1 === 001) payload = Bytes<length=8>
        = VarInt                        if WireType = var      (=== 0 === 000) payload = VarInt         // Differs from Google: bigint > 64 bit can be represented
        = VarInt                        if WireType = negvar   (=== 6 === 110) payload = VarInt * (-1)  // Differs from Google: negative varint has own wire type
        = VarInt(x) | Bytes<length=x>   if WireType = lendelim (=== 2 === 010) payload = Bytes<length=x>
    
*/
function check_never(n: never): never { return undefined as never }

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

    export function jsfloat64_to_ui8a(number: number) {
        return new Uint8Array(new Float64Array([number]).buffer,0,8)
    }
}

export namespace FrameCodec {

    const wire_type = {
        var: 0n,
        fix64: 1n,
        lendelim: 2n,
        fix32: 5n,
        negvar: 6n,
    }

    export class Fixed32 {
        value: Uint8Array
        constructor(val: Uint8Array) { this.value = new Uint8Array([val[0], val[1], val[2], val[3]]) }
    }

    export class Fixed64 {
        value: Uint8Array
        constructor(val: Uint8Array) { this.value = new Uint8Array([val[0], val[1], val[2], val[3], val[4], val[5], val[6], val[7]]) }
    }

    export type TSerializerWillAccept =  Fixed64 | Fixed32 | Uint8Array | bigint 

    export class Frame { 

        constructor(public field_number: bigint, public item: TSerializerWillAccept) {} 
        
        public* serialize_one_frame(): Generator<Uint8Array, void, undefined> {
            const member = this
            if(member.item instanceof Uint8Array) {
                const payload = member.item
                const payload_length = NumberCodec.positive_bigint_to_varint(BigInt(payload.length))
                const frame_key = NumberCodec.positive_bigint_to_varint(member.field_number << 3n | wire_type.lendelim)
                yield frame_key
                yield payload_length
                yield payload
            }
            else if (typeof member.item === "bigint") {
                const int_value = member.item
                if(int_value < 0n) {
                    const payload = NumberCodec.positive_bigint_to_varint(-1n*int_value)
                    const frame_key = NumberCodec.positive_bigint_to_varint(member.field_number << 3n | wire_type.negvar)
                    yield frame_key
                    yield payload
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
            else {
                check_never(member.item)
            }
        }
    }



    type FrameKeyParsed = {raw: bigint, field_id: bigint, wire_type: bigint }
    type ExpectNextChunkType 
        = "framekey vint next byte" 
        | "payload vint next byte" 
        | "payload length vint next byte"
        | "payload neg vint next byte"
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
    export function* deserialize_one_frame(): Generator<DeserializerInterimResult, Frame, Uint8Array> {

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
                    return new Frame(frame_key.field_id, parser_outcome.value)
                }
            }
        }
        else if (frame_key.wire_type === wire_type.negvar) {
            const payload_varint_parser = NumberCodec.get_varint_parser()
            while(true) {
                const incoming_data = yield build_interim_result(1, frame_key, "payload neg vint next byte", nth_iteration++)
                if(incoming_data.length !== 1) { throw new Error("Deserializer request length must be respected") }
                const parser_outcome = payload_varint_parser.next(incoming_data[0])
                if(parser_outcome.done) {
                    return new Frame(frame_key.field_id, -1n*(parser_outcome.value))
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
            return new Frame(frame_key.field_id, payload)
        }

        // 3/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.fix32) {
            const payload = yield build_interim_result(4, frame_key, "fix32 payload entire", nth_iteration++)
            if(payload.length !== 4) { throw new Error("Deserializer request length must be respected") }
            return new Frame(frame_key.field_id, new Fixed32(payload))
        }

        // 4/4 - payload is length-delimited byte array
        else if (frame_key.wire_type === wire_type.fix64) {
            const payload = yield build_interim_result(8, frame_key, "fix64 payload entire", nth_iteration++)
            if(payload.length !== 8) { throw new Error("Deserializer request length must be respected") }
            return new Frame(frame_key.field_id, new Fixed64(payload))
        }

        else {
            throw new Error("Corrput frame: wire type not supported")
        }
    }
}




export namespace Util {

    class SubMessage<T> { constructor(public readonly field_number: bigint, public readonly fields: T) {} }
    export function submessage<T> (field_number: bigint, fields: T) { return new SubMessage(field_number, fields) }
    class Repeated<T> { constructor(public readonly repeated_field: T[]) {} }
    export function repeated<T extends Field<TInterfaceWillAccept> | SubMessage<unknown>>(repeated_field: T): Repeated<T> {
        if(repeated_field instanceof SubMessage) { return new Repeated([repeated_field]) }
        else { return new Repeated([repeated_field]) }
    }

    export type TInterfaceWillAccept = bigint | boolean | number | string | Uint8Array | FrameCodec.Fixed64 | FrameCodec.Fixed32

    const default_bigint = 0n
    const default_boolean = false
    const default_number = 0
    const default_string = ""
    const default_ui8a = new Uint8Array(0)
    const default_fixed32 = new FrameCodec.Fixed32(new Uint8Array([0,0,0,0]))
    const default_fixed64 = new FrameCodec.Fixed64(new Uint8Array([0,0,0,0,0,0,0,0]))

    /**
     * Field<T extends TSerializerWillAccept>
     * T = what it should be interpreted as
     */
    class Field<T extends TInterfaceWillAccept> { 
        constructor(public readonly field_number: bigint, private item: T) {} 
        public to_frame(): FrameCodec.Frame|"OMIT" {
            const item = this.item as TInterfaceWillAccept
            if(typeof item === "string"  ) { if(item === default_string)  { return "OMIT" } return new FrameCodec.Frame(this.field_number, new TextEncoder().encode(item)) }
            if(typeof item === "number"  ) { if(item === default_number)  { return "OMIT" } return new FrameCodec.Frame(this.field_number, new FrameCodec.Fixed64(NumberCodec.jsfloat64_to_ui8a(item))) }
            if(typeof item === "bigint"  ) { if(item === default_bigint)  { return "OMIT" } return new FrameCodec.Frame(this.field_number, item) }
            if(typeof item === "boolean" ) { if(item === default_boolean) { return "OMIT" } return new FrameCodec.Frame(this.field_number, item?1n:0n) }
            if(item instanceof Uint8Array) { return new FrameCodec.Frame(this.field_number, item) }
            if(item instanceof FrameCodec.Fixed32) { return new FrameCodec.Frame(this.field_number, item) }
            if(item instanceof FrameCodec.Fixed64) { return new FrameCodec.Frame(this.field_number, item) }
            check_never(item)
        }
        public set(new_item: T) {
            this.item = new_item
        }
        public type(): "str" | "num" | "big" | "boo" | "u8a" | "f32" | "f64" {
            const item = this.item as TInterfaceWillAccept
            if(typeof item === "string"  )         { return "str" }
            if(typeof item === "number"  )         { return "num" }
            if(typeof item === "bigint"  )         { return "big" }
            if(typeof item === "boolean" )         { return "boo" }
            if(item instanceof Uint8Array)         { return "u8a" }
            if(item instanceof FrameCodec.Fixed32) { return "f32" } 
            if(item instanceof FrameCodec.Fixed64) { return "f64" } 
            check_never(item)
        }
    }

    export class WireTypeInterfaceTypeMismatchError extends Error {}

    export function wire_frame_to_string(wf: FrameCodec.Frame): string|WireTypeInterfaceTypeMismatchError { 
        if(wf.item instanceof Uint8Array) { return new TextDecoder().decode(wf.item) } else { return new WireTypeInterfaceTypeMismatchError() } 
    }
    export function wire_frame_to_number(wf: FrameCodec.Frame): number|WireTypeInterfaceTypeMismatchError {
        if(wf.item instanceof Fixed64) { return new Float64Array(wf.item.value)[0] } else { return new WireTypeInterfaceTypeMismatchError() }
    }
    export function wire_frame_to_bigint(wf: FrameCodec.Frame): bigint|WireTypeInterfaceTypeMismatchError {
        if(typeof wf.item === "bigint") { return wf.item } else { return new WireTypeInterfaceTypeMismatchError() }
    }
    export function wire_frame_to_boolean(wf: FrameCodec.Frame): boolean|WireTypeInterfaceTypeMismatchError {
        if(typeof wf.item === "bigint") { return wf.item !== 0n } else { return new WireTypeInterfaceTypeMismatchError() }
    }
    export function wire_frame_to_ui8a(wf: FrameCodec.Frame): Uint8Array|WireTypeInterfaceTypeMismatchError {
        if(wf.item instanceof Uint8Array) { return wf.item } else { return new WireTypeInterfaceTypeMismatchError() }
    }
    export function wire_frame_to_fixed64(wf: FrameCodec.Frame): Fixed64|WireTypeInterfaceTypeMismatchError {
        if(wf.item instanceof Fixed64) { return wf.item } else { return new WireTypeInterfaceTypeMismatchError() }
    }
    export function wire_frame_to_fixed32(wf: FrameCodec.Frame): Fixed32|WireTypeInterfaceTypeMismatchError {
        if(wf.item instanceof Fixed32) { return wf.item } else { return new WireTypeInterfaceTypeMismatchError }
    }

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
        one_frame_just_finished: FrameCodec.Frame | null
    }

    export function* deserialize_multi_frame(): Generator<MultiFrameDeserializerInterimResultExtension, never, Uint8Array> {
        let finished_frame: FrameCodec.Frame | null = null
        while(true) {
            const parser = FrameCodec.deserialize_one_frame()
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

    export function deserialize_from_ui8a(buffer: Uint8Array): FrameCodec.Frame[] {
        let current_position = 0
        const processed_frames: FrameCodec.Frame[] = []
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

    export function* serialize_object(obj: any): Generator<Uint8Array, void, void> {
        for (const [_k, v] of Object.entries(obj)) {
            if (v instanceof Field) {
                const wire_frame = v.to_frame()
                if (wire_frame === "OMIT") { continue }
                const serializer = wire_frame.serialize_one_frame()
                for (const chunk of serializer) {
                    yield chunk
                }
            }
            else if (v instanceof SubMessage) { 
                const inner_serializer = serialize_object(v.fields)
                const inner_chunks: Uint8Array[] = []
                for (const chunk of inner_serializer) {
                    inner_chunks.push(chunk)
                }
                const wire_frame = new Field(v.field_number, ui8a_concat(inner_chunks)).to_frame()
                if (wire_frame === "OMIT") { continue }
                const serializer = wire_frame.serialize_one_frame()
                for (const chunk of serializer) {
                    yield chunk
                }
            }
            else if(v instanceof Repeated) {
                const wire_frame = 
            }
        }
    }

    export function serialize_to_ui8a(obj: any): Uint8Array {
        const serializer = serialize_object(obj)
        const chunks: Uint8Array[] = []
        for(const chunk of serializer) {
            chunks.push(chunk)
        }
        return ui8a_concat(chunks)
    }

    type GetTheField<T> = 
        T extends Field<infer X> ? X :
        T extends SubMessage<infer Y> ? GetTheRecords<Y> : 
        T extends Repeated<infer Z> ? GetTheField<Z>[] : never 

    type GetTheRecords<T> = { 
        [K in keyof T]: GetTheField<T[K]>
    }

    type Report = { extra_frames: FrameCodec.Frame[], omitted_frames: Field<TInterfaceWillAccept>[] }
    function assert_not_corrupt<T>(candidate: T|Error): T { if (candidate instanceof Error) { throw candidate } else { return candidate } }
    /**
     * For a bunch of frames form wire, take an example object, match the frames to each field in the object,
     * Populating each field in a new object according to the frames.
     * Reports unrecognized frames, as well as missing frames. 
     */
    export function repackage<T>(buf: Uint8Array, example: T): { result: GetTheRecords<T>, report: Report } {
        const wireframes = deserialize_from_ui8a(buf)
        const frames = new Map<bigint, FrameCodec.Frame>(wireframes.map(frame => [frame.field_number, frame]))
        const product = {}
        const report: Report = { extra_frames: [], omitted_frames: [] }
        for(const [field_name, field] of Object.entries(example)) {
            if(field instanceof Field) {
                const wire_value = frames.get(field.field_number)
                const interface_field_type = field.type()
                if(wire_value) {
                    frames.delete(field.field_number)
                         if(interface_field_type === "num") { Object.assign(product, {field_name: assert_not_corrupt(wire_frame_to_number (wire_value))}) }  
                    else if(interface_field_type === "str") { Object.assign(product, {field_name: assert_not_corrupt(wire_frame_to_string (wire_value))}) }
                    else if(interface_field_type === "big") { Object.assign(product, {field_name: assert_not_corrupt(wire_frame_to_bigint (wire_value))}) }
                    else if(interface_field_type === "boo") { Object.assign(product, {field_name: assert_not_corrupt(wire_frame_to_boolean(wire_value))}) }
                    else if(interface_field_type === "u8a") { Object.assign(product, {field_name: assert_not_corrupt(wire_frame_to_ui8a   (wire_value))}) }
                    else if(interface_field_type === "f32") { Object.assign(product, {field_name: assert_not_corrupt(wire_frame_to_fixed32(wire_value))}) }
                    else if(interface_field_type === "f64") { Object.assign(product, {field_name: assert_not_corrupt(wire_frame_to_fixed64(wire_value))}) }
                    else { check_never(interface_field_type) }
                }
                else { 
                    report.omitted_frames.push(field)
                         if(interface_field_type === "num") { Object.assign(product, {field_name: default_number}) }
                    else if(interface_field_type === "str") { Object.assign(product, {field_name: default_string}) }
                    else if(interface_field_type === "big") { Object.assign(product, {field_name: default_bigint}) }
                    else if(interface_field_type === "boo") { Object.assign(product, {field_name: default_boolean}) }
                    else if(interface_field_type === "u8a") { Object.assign(product, {field_name: null}) }
                    else if(interface_field_type === "f32") { Object.assign(product, {field_name: null}) }
                    else if(interface_field_type === "f64") { Object.assign(product, {field_name: null}) }
                    else { check_never(interface_field_type) }
                }
            }
            else if(field instanceof SubMessage) {
                const wire_value = frames.get(field.field_number)
                if (wire_value) {
                    frames.delete(field.field_number)
                    if(wire_value.item instanceof Uint8Array) {
                        Object.assign(product, repackage(wire_value.item, field.fields))
                    }
                    else { throw new WireTypeInterfaceTypeMismatchError() }
                }
                else {
                    Object.assign(product, {field_name: null})
                }
            }
            else if(field instanceof Repeated) {

            }
            else {
                continue  // explicitly ignore any object fields that are not of types Field, SubMessage or Repeated. Those are just object fields they don't matter.
            }
        }
    }

    export function field(field_number: bigint, type: "bigint"):  Field<bigint>     
    export function field(field_number: bigint, type: "boolean"): Field<boolean>    
    export function field(field_number: bigint, type: "number"):  Field<number>     
    export function field(field_number: bigint, type: "string"):  Field<string>     
    export function field(field_number: bigint, type: "ui8a"):    Field<Uint8Array> 
    export function field(field_number: bigint, type: "fixed32"): Field<FrameCodec.Fixed32> 
    export function field(field_number: bigint, type: "fixed64"): Field<FrameCodec.Fixed64> 
    export function field(field_number: bigint, type: "bigint"|"boolean"|"number"|"string"|"ui8a"|"fixed32"|"fixed64"): Field<TInterfaceWillAccept> {
        if(type === "bigint")       { return new Field(field_number, default_bigint) }
        else if(type === "boolean") { return new Field(field_number, default_boolean)}
        else if(type === "number")  { return new Field(field_number, default_number) }
        else if(type === "string")  { return new Field(field_number, default_string) }
        else if(type === "ui8a")    { return new Field(field_number, default_ui8a)   }
        else if(type === "fixed32") { return new Field(field_number, default_fixed32)}
        else if(type === "fixed64") { return new Field(field_number, default_fixed64)}
        check_never(type)
    }
}













export const ui8a_concat = Util.ui8a_concat
export const serialize_one_frame = FrameCodec.serialize_one_frame
export const serialize_object = Util.serialize_object
export const serialize_to_ui8a = Util.serialize_to_ui8a
export const deserialize_one_frame = FrameCodec.deserialize_one_frame
export const deserialize_multi_frame = Util.deserialize_multi_frame
export const deserialize_from_ui8a = Util.deserialize_from_ui8a
export const Fixed32 = FrameCodec.Fixed32
export type  Fixed32 = FrameCodec.Fixed32
export const Fixed64 = FrameCodec.Fixed64
export type  Fixed64 = FrameCodec.Fixed64
export type  TSerializerWillAccept = FrameCodec.TSerializerWillAccept
export type  TInterfaceWillAccept = Util.TInterfaceWillAccept
export const field = Util.field 
export const submessage = Util.submessage 

const f = field(4n, "string")

namespace Prototyping {

    class Base {
        to_buffer() {
            return serialize_to_ui8a(this)
        }
        from_buffer(buf: Uint8Array) {
            //return Util.repackage(deserialize_from_ui8a(buf), this).result
        }
    }
    class PbCreds extends Base {
        sid     = field(1n, "string")
        ssec    = field(2n, "bigint")
        expiry  = field(3n, "number")
    }

    class PbRequestPage extends Base {
        apparent_name = field(1n, "ui8a")
        creds         = submessage(2n, new PbCreds())
    }

    const obj = new PbCreds()
    obj.sid.set("535")

    // // declare function serialize_data<T>(data: T): Uint8Array
    // type GetTheRecords<T> = { [K in keyof T]: T[K] extends FrameCodec.Field<infer X> ? X : T[K] extends FrameCodec.SubMessage<infer Y> ? GetTheRecords<Y> : never }
    // declare function deserialize_data<T>(data: Uint8Array, model: T): GetTheRecords<T>

    // const deserd = deserialize_data(new Uint8Array(10), new PbRequestPage())
    // const deserd = new PbRequestPage().from_buffer(new Uint8Array(10))
    // deserd.apparent_name
    // deserd.creds.expiry
    // deserd.creds.sid
    // deserd.creds.ssec
}



class DefinitionClass {

    field1 = field(1n, "string")
}

const data_obj = new DefinitionClass()
