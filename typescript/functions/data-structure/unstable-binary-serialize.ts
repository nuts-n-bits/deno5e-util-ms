// import { uint8a_to_bigint, bigint_to_uint8a } from "../encoding/bigint-uint8a.ts"

// const PAYLOAD_TYPE_SPECIFIERS = {
//     string: bint_to_frame_length_specifier(16n),
// }
// type TSerializerWillAccept = string
// class SerializableMember<T extends TSerializerWillAccept> { constructor(public index: bigint, public value: T) {} }
// function serializable_member<T extends TSerializerWillAccept>(index: bigint, item: T): SerializableMember<T> { return new SerializableMember(index, item) }
// function* serialize_one(member: SerializableMember<TSerializerWillAccept>): Generator<Uint8Array, void, undefined> {
//     if(typeof member === "string") {
//         const payload = new TextEncoder().encode(member)
//         const pts = PAYLOAD_TYPE_SPECIFIERS.string
//         const frame_length = BigInt(payload.length + pts.length)
//         const fls = bint_to_frame_length_specifier(frame_length)
//         yield fls
//         yield pts
//         yield payload
//     }
// }

// console.log("lets test")
// console.log("input: string, \"01234567890123456\"")
// for(const buf of serialize_one(serializable_member()))

// class BaseSerializer {

//     serialize() {
//         for(const entry of Object.entries(this)) {

//         }
//     }
// }

// class DefinitionClass extends BaseSerializer {

//     member = serializable_member(3n, "default_value")
// }

// class EndOfUniverseError extends Error {}
// function bint_to_frame_length_specifier(bint: bigint): Uint8Array {
//     if(bint <= 0x7F) { return new Uint8Array([0x7F]) }
//     const multi_byte_bint = bigint_to_uint8a(bint)
//     if(multi_byte_bint.length > 0x7F) { throw new EndOfUniverseError() }
//     return new Uint8Array([multi_byte_bint.length + 0x7F, ...multi_byte_bint])
// }



