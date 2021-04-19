// It's a skimmed version of protobuf that supports bigint and doesn't need schema files
// It handles bigint and negative intergers differently! So it's not compatible with protobuf.
// To avoid confusion, the wiretype numbers have been shuffled so a protobuf message is unlikely
//   to be accepted by this parser, and vice versa. 
/* 
    SPEC
    Message = Frame | Frame | ... | Frame
    Frame = FrameKey | TypedPayload
    FrameKey = Varint(FrameID<<3|WireType)  // WireType is Integer[0,7] thus 3 bits.
    TypedPayload
        = Bytes<length=4>               if WireType = fix32    (=== 5 === 101) payload = Bytes<length=4> 
        = Bytes<length=8>               if WireType = fix64    (=== 1 === 001) payload = Bytes<length=8>
        = VarInt                        if WireType = var      (=== 0 === 000) payload = VarInt          // Differs from Google: bigint > 64 bit can be represented
        = VarInt                        if WireType = negvar   (=== 6 === 110) payload = VarInt * (-1)   // Differs from Google: negative varint has own wire type
        = VarInt(x) | Bytes<length=x>   if WireType = lendelim (=== 2 === 010) payload = Bytes<length=x>
    
*/
function check_never(n: never): never { return n }

namespace Ui8aUtil {

    export function concat(ui8aa: readonly Uint8Array[], length?: number) {
        const total_length = length ?? total_len(ui8aa)
        const result = new Uint8Array(total_length)
        let bytes_written = 0
        ui8aa.forEach(ui8a => {
            result.set(ui8a, bytes_written)
            bytes_written += ui8a.length
        })
        return result
    }
    
    export function collect(ui8ai: Iterable<Uint8Array>): Uint8Array[] {
        const collected_chunks: Uint8Array[] = []
        for (const chunk of ui8ai) { collected_chunks.push(chunk) }
        return collected_chunks
    }
    
    export function total_len(ui8aa: readonly Uint8Array[]) {
        return ui8aa.reduce((a,b)=>a+b.length, 0)
    }
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
        while(true) {
            const lsb7 = Number(bigint & 0b0111_1111n)
            bigint = bigint >> 7n
            const msb1 = (bigint === 0n ? 0 : 1) << 7
            array.push(msb1|lsb7)
            if (bigint === 0n) { break }
        }
        return new Uint8Array(array)
    }

    export function jsfloat64_to_ui8a(number: number) {
        return new Uint8Array(new Float64Array([number]).buffer,0,8)
    }
}

export namespace FrameCodec {

    const wire_type = {
        lendelim: 0b000n,
        var: 0b001n,
        negvar: 0b010n,
        fix64: 0b011n,
    }

    export class Fixed64 {
        value: Uint8Array
        constructor(val: Uint8Array) { this.value = new Uint8Array([val[0], val[1], val[2], val[3], val[4], val[5], val[6], val[7]]) }
    }

    export type TSerializerWillAccept =  Fixed64 | Uint8Array | bigint | Frame[]

    export class Frame {

        /**
         * @param field_number if bigint => will serialize with frame key. if null => will serialize without frame key.
         */
        constructor(public field_number: bigint, public item: TSerializerWillAccept) {} 
        
        private get_frame_key_if_not_headless(wire_type: bigint): Uint8Array|null {
            if(this.field_number !== null) {
                const frame_key = NumberCodec.positive_bigint_to_varint(this.field_number << 3n | wire_type)
                return frame_key
            }
            return null
        }


        public* to_chunks(): Generator<Uint8Array, void, undefined> {
            if(this.item instanceof Uint8Array) {
                const payload = this.item
                const payload_length_specifier = NumberCodec.positive_bigint_to_varint(BigInt(payload.length))
                const frame_key = this.get_frame_key_if_not_headless(wire_type.lendelim)
                if (frame_key !== null) { yield frame_key }
                yield payload_length_specifier
                yield payload
            }
            else if (typeof this.item === "bigint") {
                const int_value = this.item
                if(int_value < 0n) {
                    const payload = NumberCodec.positive_bigint_to_varint(-1n*int_value)
                    const frame_key = this.get_frame_key_if_not_headless(wire_type.negvar)
                    if (frame_key !== null) { yield frame_key }
                    yield payload
                }
                else {
                    const payload = NumberCodec.positive_bigint_to_varint(int_value)
                    const frame_key = this.get_frame_key_if_not_headless(wire_type.var)
                    if (frame_key !== null) { yield frame_key }
                    yield payload
                }
            }
            else if (this.item instanceof Fixed64) {
                const payload = this.item.value
                const frame_key = this.get_frame_key_if_not_headless(wire_type.fix64)
                if (frame_key !== null) { yield frame_key }
                yield payload
            }
            else if (this.item instanceof Array) {
                const frame_key = this.get_frame_key_if_not_headless(wire_type.fix64)
                if (frame_key === null) {  // headless => can emit chunks of children frames directly
                    for (const frame of this.item) {
                        for (const chunk of frame.to_chunks()) {
                            yield chunk
                        }
                    }
                }
                else {  // not headless => must buffer all the chunks, get total length, then emit the whole thing (chunk by chunk to avoid copying)
                    const chunks = []
                    for (const frame of this.item) {
                        for (const chunk of frame.to_chunks()) {
                            chunks.push(chunk)
                        }
                    }
                    const payload_length_specifier = NumberCodec.positive_bigint_to_varint(BigInt(Ui8aUtil.total_len(chunks)))
                    yield frame_key
                    yield payload_length_specifier
                    for (const chunk of chunks) {
                        yield chunk
                    }
                }
            }
            else {
                check_never(this.item)
            }
        }
    }

    type FrameKeyParsed = { field_id: bigint, wire_type: bigint }
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
     * @returns Returns after one frame finishes serializing. Will return the one frame.
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
                frame_key = { field_id: parser_outcome.value >> 3n, wire_type: parser_outcome.value & 0b111n }
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

        // 2/4 payload is negative varint
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

        // 3/4 - payload is length-delimited byte array
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

        // 4/4 - payload is an 8-byte segment
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

export namespace FrameUtil {

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

    export function* deserialize_from_ui8a(buffer: Uint8Array): Generator<FrameCodec.Frame, "Well-packed"|"Incomplete", void> {
        let current_position = 0
        const parser = deserialize_multi_frame()
        let interim_result = parser.next()
        while (true) {
            // console.log(interim_result)
            const requested_bytes_length = interim_result.value.request_next_chunk_length
            if (current_position + requested_bytes_length > buffer.length) {  // multi-frame deserializer is requesting bytes beyond the buffer
                // if this happens because it's expeting a new frame, that means everything is okay, the ui8a packs an integer amount of frames
                if (interim_result.value.nth_iteration === 0) { return "Well-packed" }
                // otherwise it signifies that the last frame in the ui8a is either incomplete or malformed, and is directing deserializer to access bytes beyond the buffer.
                return "Incomplete" 
            }
            const conforming_input = new Uint8Array(requested_bytes_length)
            for(let i=0; i<requested_bytes_length; i++) { conforming_input[i] = buffer[current_position+i] }
            current_position += requested_bytes_length
            const result = parser.next(conforming_input)
            if(result.value.one_frame_just_finished) { 
                yield (result.value.one_frame_just_finished) 
            }
            interim_result = result
        }
    } 
}



export namespace Interface {

    export type TInterfaceWillAccept = bigint | boolean | number | string | Uint8Array | FrameCodec.Fixed64
    export type TIWATypeSpecifier = "str" | "num" | "big" | "boo" | "u8a" | "f64"

    const default_bigint = 0n
    const default_boolean = false
    const default_number = 0
    const default_string = ""
    const default_ui8a = new Uint8Array(0)
    const default_fixed64 = new FrameCodec.Fixed64(new Uint8Array([0,0,0,0,0,0,0,0]))

    function* any_to_frames(any: any, should_throw?: boolean): Generator<FrameCodec.Frame, void, void> {
        if(any instanceof Field) { 
            const frame = any.to_frame() 
            if(frame !== "OMIT") { yield frame }
            return
        }
        if(any instanceof SubMessage) {
            for (const frame of any.to_frames()) { yield frame }
            return
        }
        if(any instanceof RepeatFields) {
            for (const frame of any.to_frames()) { yield frame }
            return
        }
        if(any instanceof RepeatSubMessages) {
            for (const frame of any.to_frames()) { yield frame }
            return
        }
        if (should_throw) { throw new Error("Data object contains unserializable fields") }
    }

    class SubMessage<T> { 
        constructor(public readonly field_number: bigint, public readonly object: T) {} 
        public* to_frames(): Generator<FrameCodec.Frame, void, void> {
            for(const [_k, v] of Object.entries(this.object)) {
                for(const frame of any_to_frames(v, true)) { yield frame }
            }
        }
    }

    class RepeatFields<T extends TInterfaceWillAccept> {
        constructor(public readonly field_number: bigint, public readonly fields: T[]) {}
        public* to_frames(): Generator<FrameCodec.Frame, void, void> {
            for (const entry of this.fields) {
                const field = new Field(this.field_number, entry)
                const frame = field.to_frame()
                if (frame !== "OMIT") { yield frame }
            }
        }
    }

    class RepeatSubMessages<T> {
        constructor(public readonly field_number: bigint, public readonly object: T[]) {}
        public* to_frames(): Generator<FrameCodec.Frame, void, void> {

        }
    }

    /**
     * Field<T extends TSerializerWillAccept>
     * T = what it should be interpreted as
     */
    class Field<T extends TInterfaceWillAccept> { 
        constructor(public readonly field_number: bigint, public item: T) {}
        public to_frame(): FrameCodec.Frame|"OMIT" {
            const item = this.item as TInterfaceWillAccept
            if (typeof item === "string"  ) { if(item === default_string)  { return "OMIT" } return new FrameCodec.Frame(this.field_number, new TextEncoder().encode(item)) }
            if (typeof item === "number"  ) { if(item === default_number)  { return "OMIT" } return new FrameCodec.Frame(this.field_number, new FrameCodec.Fixed64(NumberCodec.jsfloat64_to_ui8a(item))) }
            if (typeof item === "bigint"  ) { if(item === default_bigint)  { return "OMIT" } return new FrameCodec.Frame(this.field_number, item) }
            if (typeof item === "boolean" ) { if(item === default_boolean) { return "OMIT" } return new FrameCodec.Frame(this.field_number, item?1n:0n) }
            if (item instanceof Uint8Array) { return new FrameCodec.Frame(this.field_number, item) }
            if (item instanceof FrameCodec.Fixed64) { return new FrameCodec.Frame(this.field_number, item) }
            check_never(item)
        }
        public set(new_item: T) {
            this.item = new_item
        }
    }

    export class WireTypeInterfaceTypeMismatchError extends Error {}

    export function wire_frame_to_interface_value(wf: FrameCodec.Frame|null, type: TIWATypeSpecifier): TInterfaceWillAccept {
        if(wf === null) {  // when a fram is omitted, use the default value for that type.
                 if (type === "str")  { return default_string  }  
            else if (type === "num")  { return default_fixed64 } 
            else if (type === "big")  { return default_bigint  }                            
            else if (type === "boo")  { return default_boolean }                     
            else if (type === "u8a")  { return default_ui8a    }                            
            else if (type === "f64")  { return default_fixed64 }
            check_never(type)
        }
        else {
                 if (type === "str") { if(wf.item instanceof Uint8Array) { return new TextDecoder().decode(wf.item) }  else { throw new WireTypeInterfaceTypeMismatchError() } }
            else if (type === "num") { if(wf.item instanceof Fixed64)    { return new Float64Array(wf.item.value)[0] } else { throw new WireTypeInterfaceTypeMismatchError() } }
            else if (type === "big") { if(typeof wf.item === "bigint")   { return wf.item }                            else { throw new WireTypeInterfaceTypeMismatchError() } }
            else if (type === "boo") { if(typeof wf.item === "bigint")   { return wf.item !== 0n }                     else { throw new WireTypeInterfaceTypeMismatchError() } }
            else if (type === "u8a") { if(wf.item instanceof Uint8Array) { return wf.item }                            else { throw new WireTypeInterfaceTypeMismatchError() } }
            else if (type === "f64") { if(wf.item instanceof Fixed64)    { return wf.item }                            else { throw new WireTypeInterfaceTypeMismatchError() } }
            check_never(type)
        }

    }

    export function* serialize_object(obj: any): Generator<Uint8Array, void, void> {
        for (const [_k, v] of Object.entries(obj)) {
            for (const frame of any_to_frames(v, true)) {
                for (const chunk of frame.to_chunks()) {
                    yield chunk
                }
            }
        }
    }

    export function serialize_to_ui8a(obj: any): Uint8Array {
        return Ui8aUtil.concat(Ui8aUtil.collect(serialize_object(obj)))
    }

    type GetTheField<T> = 
        T extends Field<infer X> ? X :
        T extends SubMessage<infer Y> ? GetTheRecords<Y> : 
        T extends RepeatFields<infer Z> ? Z[] : 
        T extends RepeatSubMessages<infer W> ? GetTheRecords<W>[] : never 

    type GetTheRecords<T> = { 
        [K in keyof T]: GetTheField<T[K]>
    }

    namespace Prototyping {
        class Def {
            field = field(1n, "bigint")
            empty_submsg = submessage(2n, {})
            repeat_f = repeat_fields(3n, "string")
            repeat_s = repeat_submessage(4n, {
                subf = field(1n, "number")
            }))
            rep_s_rep_f = repeated(submessage(5n, {
                field: repeat_fields(1n, "boolean")
            }))
        }

        declare const x : GetTheRecords<Def>
    }

    type Report = { extra_frames: FrameCodec.Frame[], omitted_frames: Field<TInterfaceWillAccept>[] }
    /**
     * For a bunch of frames form wire, take an example object, match the frames to each field in the object,
     * Populating each field in a new object according to the frames.
     * Reports unrecognized frames, as well as missing frames. 
     */
    export function repackage<T>(wireframes: FrameCodec.Frame[], example: T): { result: GetTheRecords<T>, report: Report } {
        const frames = new Map<bigint, FrameCodec.Frame>(wireframes.map(frame => [frame.field_number, frame]))
        const product = {}
        const report: Report = { extra_frames: [], omitted_frames: [] }
        for(const [field_name, field] of Object.entries(example)) {
            if(field instanceof Field) {
                const wire_value = frames.get(field.field_number)
                if(wire_value) {
                    frames.delete(field.field_number)
                    Object.assign(product, {[field_name]: wire_frame_to_interface_value(wire_value, field.type())})
                }
                else { 
                    report.omitted_frames.push(field)
                    Object.assign(product, {[field_name]: wire_frame_to_interface_value(null, field.type())})
                }
            }
            else if(field instanceof SubMessage) {
                const wire_value = frames.get(field.field_number)
                if (wire_value) {
                    frames.delete(field.field_number)
                    if(wire_value.item instanceof Uint8Array) {
                        Object.assign(product, repackage(FrameUtil.deserialize_from_ui8a(wire_value.item), field.fields))
                    }
                    else { throw new WireTypeInterfaceTypeMismatchError() }
                }
                else {
                    Object.assign(product, {[field_name]: null})
                }
            }
            else if(field instanceof Repeated) {
                throw new ??????????NOTIMPLEMENTED??????????
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
    export function field(field_number: bigint, type: "fixed64"): Field<FrameCodec.Fixed64> 
    export function field(field_number: bigint, type: "bigint"|"boolean"|"number"|"string"|"ui8a"|"fixed64"): Field<TInterfaceWillAccept> {
        if(type === "bigint")       { return new Field(field_number, default_bigint) }
        else if(type === "boolean") { return new Field(field_number, default_boolean)}
        else if(type === "number")  { return new Field(field_number, default_number) }
        else if(type === "string")  { return new Field(field_number, default_string) }
        else if(type === "ui8a")    { return new Field(field_number, default_ui8a)   }
        else if(type === "fixed64") { return new Field(field_number, default_fixed64)}
        check_never(type)
    }

    export function repeat_fields(field_number: bigint, type: "bigint"):  RepeatFields<bigint>     
    export function repeat_fields(field_number: bigint, type: "boolean"): RepeatFields<boolean>    
    export function repeat_fields(field_number: bigint, type: "number"):  RepeatFields<number>     
    export function repeat_fields(field_number: bigint, type: "string"):  RepeatFields<string>     
    export function repeat_fields(field_number: bigint, type: "ui8a"):    RepeatFields<Uint8Array> 
    export function repeat_fields(field_number: bigint, type: "fixed64"): RepeatFields<FrameCodec.Fixed64> 
    export function repeat_fields(field_number: bigint, type: "bigint"|"boolean"|"number"|"string"|"ui8a"|"fixed64"): RepeatFields<TInterfaceWillAccept> {
        return new RepeatFields(field_number, [])
    }

    export function repeat_submessages<T>(field_number: bigint, _example: T) { return new RepeatSubMessages<T>(field_number, []) }
    export function submessage<T>(field_number: bigint, example: T) { return new SubMessage(field_number, example) }
}

export const serialize_object = Interface.serialize_object
export const serialize_to_ui8a = Interface.serialize_to_ui8a
export const deserialize_one_frame = FrameCodec.deserialize_one_frame
export const deserialize_multi_frame = FrameUtil.deserialize_multi_frame
export const deserialize_from_ui8a = FrameUtil.deserialize_from_ui8a
export const Fixed64 = FrameCodec.Fixed64
export type  Fixed64 = FrameCodec.Fixed64
export type  TSerializerWillAccept = FrameCodec.TSerializerWillAccept
export type  TInterfaceWillAccept = Interface.TInterfaceWillAccept
export const field = Interface.field 
export const submessage = Interface.submessage 


// namespace Prototyping {

//     class Base {
//         to_buffer() {
//             return serialize_to_ui8a(this)
//         }
//         from_buffer(buf: Uint8Array) {
//             //return Util.repackage(deserialize_from_ui8a(buf), this).result
//         }
//     }
//     class PbCreds extends Base {
//         sid     = field(1n, "string")
//         ssec    = field(2n, "bigint")
//         expiry  = field(3n, "number")
//     }

//     class PbRequestPage extends Base {
//         apparent_name = field(1n, "ui8a")
//         creds         = repeated(submessage(2n, new PbCreds()))
//     }

//     const obj = new PbCreds()
//     obj.sid.set("535")

//     // declare function serialize_data<T>(data: T): Uint8Array
//     type GetTheRecords<T> = { [K in keyof T]: T[K] extends FrameCodec.Field<infer X> ? X : T[K] extends FrameCodec.SubMessage<infer Y> ? GetTheRecords<Y> : never }
//     declare function deserialize_data<T>(data: Uint8Array, model: T): GetTheRecords<T>

//     const deserd = deserialize_data(new Uint8Array(10), new PbRequestPage())
//     const deserd = new PbRequestPage().from_buffer(new Uint8Array(10))
//     deserd.apparent_name
//     deserd.creds.expiry
//     deserd.creds.sid
//     deserd.creds.ssec
// }



// class DefinitionClass {

//     field1 = field(1n, "string")
// }

// const data_obj = new DefinitionClass()
