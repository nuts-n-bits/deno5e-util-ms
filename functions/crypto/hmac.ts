
export function hmac(hash_function : (x:Uint8Array)=>Uint8Array, key : Uint8Array, text : Uint8Array, hash_function_block_size : number) {

    if(key.length > hash_function_block_size)
        key = hash_function(key)

    let kip = new Uint8Array(hash_function_block_size).fill(0x36)
    let kop = new Uint8Array(hash_function_block_size).fill(0x5c)

    for(let i=0; i<key.length; i++) {
        kip[i] ^= key[i]
        kop[i] ^= key[i]
    }

    return hash_function(u8([...kop, ...hash_function(u8([...kip, ...text]))]))
}

function u8 (array : Iterable<number>) : Uint8Array {
    return new Uint8Array(array)
}