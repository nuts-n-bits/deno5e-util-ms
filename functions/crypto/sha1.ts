// bk for big K
function bk (index : number) : number {

    if(index >= 0 && index <= 19)
        return 0x5a827999
    else if(index >= 20 && index <= 39)
        return 0x6ed9eba1
    else if(index >= 40 && index <= 59)
        return 0x8f1bbcdc
    else if(index >= 60 && index <= 79)
        return 0xca62c1d6
    else throw new Error()

}

// st for state
const st = new Uint32Array([0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0])

function pp (msg : Uint8Array) : Array<Uint32Array> {        // pre pad

    // pad
    const bit_l = msg.length*8
    const padded_byte_length = (msg.length+9)%64 === 0 ? msg.length+9 : (((msg.length+9)/64)>>>0)*64+64
    const m = new Uint8Array(padded_byte_length)

    m.set(msg, 0)
    m.set([128], msg.length)
    m.set([((bit_l>>24)>>>0)&255, ((bit_l>>16)>>>0)&255, ((bit_l>>8)>>>0)&255, ((bit_l>>0)>>>0)&255], padded_byte_length-4)

    // separate into 64-byte blocks (chunks)
    const n : Array<Uint8Array> = []
    for(let i=0;i<m.length/64;i++) {
        n[i] = new Uint8Array(64)
        for(let j=0;j<64;j++) {
            n[i][j]=m[64*i+j]
        }
    }

    // divide 1 block into 16 * 32 bits of messages
    let p : Array<Uint32Array> = []
    for(let i=0;i<n.length;i++) {
        p[i] = new Uint32Array(16)
        for(let j=0;j<n[i].length/4;j++) {
            p[i][j]=((n[i][4*j]<<24)|(n[i][4*j+1]<<16)|(n[i][4*j+2]<<8)|(n[i][4*j+3]))
        }
    }
    return p
}

function ms (b : Uint32Array) : Uint32Array {         // message schedule for one message block

    const w = new Uint32Array(80)
    for(let i=0; i<16; i++) {
        w[i] = b[i]
    }
    for(let i=16; i<80; i++) {
        w[i] = lt(w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1)
    }
    return w
}

function cp (s : Uint32Array, w : Uint32Array) : void {        // compress

    let a=s[0], b=s[1], c=s[2], d=s[3], e=s[4]
    for(let t : number, i=0;i<80;i++) {
        t = pl(lt(a, 5), ft(b, c, d, i), e, bk(i), w[i])
        e = d
        d = c
        c = lt(b, 30)
        b = a
        a = t
    }
    s.set([pl(a,s[0]),pl(b,s[1]),pl(c,s[2]),pl(d,s[3]),pl(e,s[4])])
}

function ft (x : number, y : number, z : number, t : number) : number {

    if(t >= 0 && t <= 19)
        return ch(x, y, z)
    else if(t >= 20 && t <= 39)
        return pr(x, y, z)
    else if(t >= 40 && t <= 59)
        return mj(x, y, z)
    else if(t >= 60 && t <= 79)
        return pr(x, y, z)
    else
        throw new Error()
}

function ml (msg : Uint8Array, st : Uint32Array) {    // main loop

    let m = pp(msg)
    for(let i=0;i<m.length;i++) { cp(st, ms(m[i])) }
    return st
}

function pl (a : number, b : number, c = 0, d = 0, e = 0) : number {  // safe addition

    return (((((((a+b)>>>0)+c)>>>0)+d)>>>0)+e)>>>0
}

function lt (a : number, b : number) : number {        // left rotate

    return ((a<<b)|(a>>>(32-b)))>>>0
}

function ch (x : number, y : number, z : number) : number {      // choice

    return ((x&y)^((~x)&z))>>>0
}

function mj (x : number, y : number, z : number) : number {      // majority

    return ((x&y)^(x&z)^(y&z))>>>0
}

function pr (x : number, y : number, z : number) : number {      // parity

    return x^y^z
}

function rg (a : Uint32Array) : Uint8Array {  // Uint32 to Uint8 

    let b = new Uint8Array(20)
    for(let i=0;i<5;i++) {
        b[i*4+0] = ((a[i]>>24)>>>0)&255
        b[i*4+1] = ((a[i]>>16)>>>0)&255
        b[i*4+2] = ((a[i]>>8)>>>0)&255
        b[i*4+3] = ((a[i]>>0)>>>0)&255
    }
    return b
}

// msg be a array of byte-sized numbers.
export function sha1 (msg : Uint8Array) : Uint8Array {

    return rg(ml(msg, st))
}

export const block_size_sha1 = 64
export const output_size_sha1 = 20
