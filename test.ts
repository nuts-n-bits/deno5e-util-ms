import { 
    field, 
    submessage,
    serialize_one_frame, 
    deserialize_one_frame,
    Fixed32,
    Fixed64,
    deserialize_multi_frame,
    deserialize_from_ui8a,
    serialize_to_ui8a,
    Util,
} from "./typescript/functions/data-structure/my-protobuf.ts"




const message = [10,165,1,10,35,99,111,110,102,105,103,47,110,101,119,45,116,105,99,107,101,116,45,100,101,115,116,105,110,97,116,105,111,110,115,46,106,115,111,110,18,1,50,34,1,50,42,24,50,48,50,49,45,48,49,45,50,52,84,48,52,58,52,55,58,53,52,46,54,50,57,90,50,24,50,48,50,49,45,48,52,45,48,57,84,50,49,58,51,57,58,50,52,46,48,54,53,90,66,10,116,101,120,116,47,112,108,97,105,110,74,1,55,82,14,50,48,57,46,57,52,46,49,51,48,46,49,53,49,90,14,50,48,57,46,57,52,46,49,51,48,46,49,53,49,98,6,104,105,110,97,116,97,106,6,104,105,110,97,116,97,146,1,4,51,49,53,54,18,51,10,4,51,49,53,54,18,24,50,48,50,49,45,48,52,45,48,57,84,50,49,58,51,57,58,50,52,46,48,54,53,90,34,1,50,42,6,104,105,110,97,116,97,50,6,104,105,110,97,116,97,26,201,7,123,10,32,32,32,32,34,100,101,115,116,115,34,58,32,91,10,32,32,32,32,32,32,32,32,123,34,100,101,115,116,95,117,114,108,34,58,32,34,47,110,101,119,47,122,104,119,112,34,44,32,34,115,105,116,101,95,110,97,109,101,95,108,111,99,97,108,101,34,58,32,34,122,104,34,44,32,34,115,105,116,101,95,104,111,115,116,34,58,32,34,122,104,46,119,105,107,105,112,101,100,105,97,46,111,114,103,34,44,32,32,34,115,105,116,101,95,110,97,109,101,34,58,32,34,228,184,173,230,150,135,231,187,180,229,159,186,231,153,190,231,167,145,34,125,44,10,32,32,32,32,32,32,32,32,123,34,100,101,115,116,95,117,114,108,34,58,32,34,47,110,101,119,47,122,104,119,98,34,44,32,34,115,105,116,101,95,110,97,109,101,95,108,111,99,97,108,101,34,58,32,34,122,104,34,44,32,34,115,105,116,101,95,104,111,115,116,34,58,32,34,122,104,46,119,105,107,105,98,111,111,107,115,46,111,114,103,34,44,32,32,34,115,105,116,101,95,110,97,109,101,34,58,32,34,228,184,173,230,150,135,231,187,180,229,159,186,229,155,190,228,185,166,34,125,44,10,32,32,32,32,32,32,32,32,123,34,100,101,115,116,95,117,114,108,34,58,32,34,47,110,101,119,47,122,104,119,110,34,44,32,34,115,105,116,101,95,110,97,109,101,95,108,111,99,97,108,101,34,58,32,34,122,104,34,44,32,34,115,105,116,101,95,104,111,115,116,34,58,32,34,122,104,46,119,105,107,105,110,101,119,115,46,111,114,103,34,44,32,32,32,34,115,105,116,101,95,110,97,109,101,34,58,32,34,228,184,173,230,150,135,231,187,180,229,159,186,230,150,176,233,151,187,34,125,44,10,32,32,32,32,32,32,32,32,123,34,100,101,115,116,95,117,114,108,34,58,32,34,47,110,101,119,47,106,97,119,112,34,44,32,34,115,105,116,101,95,110,97,109,101,95,108,111,99,97,108,101,34,58,32,34,106,97,34,44,32,34,115,105,116,101,95,104,111,115,116,34,58,32,34,106,97,46,119,105,107,105,112,101,100,105,97,46,111,114,103,34,44,32,32,34,115,105,116,101,95,110,97,109,101,34,58,32,34,230,151,165,230,156,172,232,170,158,231,137,136,227,130,166,227,130,163,227,130,173,227,131,154,227,131,135,227,130,163,227,130,162,34,125,44,10,32,32,32,32,32,32,32,32,123,34,100,101,115,116,95,117,114,108,34,58,32,34,47,110,101,119,47,101,110,119,118,34,44,32,34,115,105,116,101,95,110,97,109,101,95,108,111,99,97,108,101,34,58,32,34,101,110,34,44,32,34,115,105,116,101,95,104,111,115,116,34,58,32,34,101,110,46,119,105,107,105,118,111,121,97,103,101,46,111,114,103,34,44,32,34,115,105,116,101,95,110,97,109,101,34,58,32,34,69,110,103,108,105,115,104,32,87,105,107,105,118,111,121,97,103,101,34,125,44,10,32,32,32,32,32,32,32,32,123,34,100,101,115,116,95,117,114,108,34,58,32,34,47,110,101,119,47,101,110,119,116,34,44,32,34,115,105,116,101,95,110,97,109,101,95,108,111,99,97,108,101,34,58,32,34,101,110,34,44,32,34,115,105,116,101,95,104,111,115,116,34,58,32,34,101,110,46,119,105,107,116,105,111,110,97,114,121,46,111,114,103,34,44,32,34,115,105,116,101,95,110,97,109,101,34,58,32,34,69,110,103,108,105,115,104,32,87,105,107,116,105,111,110,97,114,121,34,125,44,10,32,32,32,32,32,32,32,32,123,34,100,101,115,116,95,117,114,108,34,58,32,34,47,110,101,119,47,117,98,108,107,34,44,32,34,115,105,116,101,95,110,97,109,101,95,108,111,99,97,108,101,34,58,32,34,101,110,34,44,32,34,115,105,116,101,95,104,111,115,116,34,58,32,34,117,110,98,108,111,99,107,45,122,104,46,111,114,103,34,44,32,32,32,32,34,115,105,116,101,95,110,97,109,101,34,58,32,34,83,117,103,103,101,115,116,105,111,110,115,32,38,32,81,117,101,115,116,105,111,110,115,32,116,111,32,116,104,105,115,32,119,101,98,115,105,116,101,34,125,10,32,32,32,32,93,10,125]
const buf = new Uint8Array(message)
const frames = deserialize_from_ui8a(buf)

console.log(frames)
frame_0: {
    const parsed = Util.Prototyping.wire_frame_to_ui8a(frames[0])
    if(parsed instanceof Error) { throw console.log("frame 1 corrupt") }
    const submessage_frames = deserialize_from_ui8a(parsed)
    console.log(submessage_frames)
}
frame_1: {
    const parsed = Util.Prototyping.wire_frame_to_ui8a(frames[1])
    if(parsed instanceof Error) { throw console.log("frame 1 corrupt") }
    const submessage_frames = deserialize_from_ui8a(parsed)
    console.log(submessage_frames)
}
frame_2: {
    const parsed = Util.Prototyping.wire_frame_to_string(frames[2])
    if(parsed instanceof Error) { throw console.log("frame 2 corrupt") }
    console.log(parsed)
}

// let current_position = 0
// const processed_frames = []
// const parser = deserialize_multi_frame()
// let interim_result = parser.next()
// while (true) {
//     console.log(interim_result)
//     const requested_bytes_length = interim_result.value.request_next_chunk_length
//     if (current_position + requested_bytes_length > message.length) { console.log("Parsing ends:", current_position + requested_bytes_length, message.length); break }
//     const conforming_input = new Uint8Array(requested_bytes_length)
//     for(let i=0; i<requested_bytes_length; i++) { conforming_input[i] = message[current_position+i] }
//     current_position += requested_bytes_length
//     const result = parser.next(conforming_input)
//     if(result.value.one_frame_just_finished) { 
//         processed_frames.push(result.value.one_frame_just_finished) 
//     }
//     interim_result = result
// }


// while(0) {
//     if(current_position >= message.length) { console.log("Done"); break }
//     const parser = deserialize_one_frame()
//     let iter_result = parser.next()
//     console.log(iter_result)
//     if(iter_result.done) { throw new Error("Parser iterator is not supposed to finish at first iteration.") }
//     while(true) {
//         const requested_bytes_length = iter_result.value.request_next_chunk_length
//         if (requested_bytes_length > message.length - current_position) { throw new Error("Remaining length is less than requested, signifying malformed message.") }
//         const conforming_input = new Uint8Array(requested_bytes_length)
//         for(let i=0; i<requested_bytes_length; i++) { conforming_input[i] = message[current_position+i] }
//         current_position += requested_bytes_length
//         const result = parser.next(conforming_input)
//         console.log(result)
//         if(result.done) { 
//             processed_frames.push(result.value)
//             break
//         }
//         iter_result = result
//     }
// }