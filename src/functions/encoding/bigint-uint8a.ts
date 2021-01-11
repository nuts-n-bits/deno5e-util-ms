export function bigint_to_uint8a(int: bigint): Uint8Array {

    const a: bigint[] = []
    while(int !== 0n) {
        a.unshift(int & 255n)
        int = int >> 8n
    }
    return new Uint8Array(a.map(big => Number(big)))
}

export function uint8a_to_bigint(arr: Uint8Array): bigint {
    let int = 0n
    let shift = (BigInt(arr.length) - 1n) * 8n
    arr.forEach((val, index) => {
        int |= BigInt(val) << shift
        shift -= 8n
    })
    return int
}