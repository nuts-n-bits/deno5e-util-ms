// bk for big K
const bk = function(index) {

    if(index >= 0 && index <= 19)
        return 0x5a827999;
    else if(index >= 20 && index <= 39)
        return 0x6ed9eba1;
    else if(index >= 40 && index <= 59)
        return 0x8f1bbcdc;
    else if(index >= 60 && index <= 79)
        return 0xca62c1d6;
    else throw new Error()

};

// st for state
const st = [0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0];

const pp = function(msg) {        // pre pad

    // pad
    let l = msg.length*8;
    let m = msg.concat(128);
    while((m.length+8)%64!==0)
    {
        m.push(0);
    }
    m.push(0, 0, 0, 0);
    m.push(((l>>24)>>>0)&255, ((l>>16)>>>0)&255, ((l>>8)>>>0)&255, ((l>>0)>>>0)&255);

    // divide by 512 bits or 64 bytes
    let n : number[][] = [];
    for(let i=0;i<m.length/64;i++)
    {
        n[i] = [];
        for(let j=0;j<64;j++)
        {
            n[i][j]=m[64*i+j];
        }
    }

    // divide 1 block into 16 * 32 bits of messages
    let p : number[][] = [];
    for(let i=0;i<n.length;i++)
    {
        p[i]=[];
        for(let j=0;j<n[i].length/4;j++)
        {
            p[i][j]=((n[i][4*j]<<24)|(n[i][4*j+1]<<16)|(n[i][4*j+2]<<8)|(n[i][4*j+3]));
        }
    }
    return p;
};

const ms = function(b) {          // message schedule for one message block

    let w : number[] = [];
    for(let i=0;i<16;i++)
    {
        w[i] = b[i];
    }
    for(let i=16;i<80;i++)
    {
        w[i] = lt(w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);
    }
    return w;
};

const cp = function(s,w) {        // compress

    let a=s[0], b=s[1], c=s[2], d=s[3], e=s[4];
    for(let t, i=0;i<80;i++)
    {
        t = pl(lt(a, 5), ft(b, c, d, i), e, bk(i), w[i]);
        e = d;
        d = c;
        c = lt(b, 30);
        b = a;
        a = t;
    }
    return [pl(a,s[0]),pl(b,s[1]),pl(c,s[2]),pl(d,s[3]),pl(e,s[4])];
};

const ft = function (x, y, z, t) {

    if(t >= 0 && t <= 19)
        return ch(x, y, z);
    else if(t >= 20 && t <= 39)
        return pr(x, y, z);
    else if(t >= 40 && t <= 59)
        return mj(x, y, z);
    else if(t >= 60 && t <= 79)
        return pr(x, y, z);
    else
        throw new Error()
};

const ml = function(msg, st) {    // main loop

    let m = pp(msg);
    let s = st;
    for(let i=0;i<m.length;i++)
    {
        s = cp(s,ms(m[i]));
    }
    return s;
};

const pl = function(a,b?,c?,d?,e?) {  // safe addition

    if(!c)
    {
        c=0;
    }
    if(!d)
    {
        d=0;
    }
    if(!e)
    {
        e=0;
    }
    return (((((((a+b)%4294967296)+c)%4294967296)+d)%4294967296)+e)%4294967296;
};

const lt = function(a,b) {        // left rotate

    return ((a<<b)|(a>>>(32-b)))>>>0;
};

const ch = function(x,y,z) {      // choice

    return ((x&y)^((~x)&z))>>>0;
};

const mj = function(x,y,z) {      // majority

    return ((x&y)^(x&z)^(y&z))>>>0;
};

const pr = function(x,y,z) {      // parity

    return x^y^z;
};

const rg = function(a) {          // c08 from c32

    let b : number[] = [];
    for(let i=0;i<5;i++)
    {
        b = b.concat(((a[i]>>24)>>>0)&255,((a[i]>>16)>>>0)&255,((a[i]>>8)>>>0)&255,((a[i]>>0)>>>0)&255);
    }
    return b;
};

// msg be a array of byte-sized numbers.
export default function sha1 (msg)
{
    return rg(ml(msg, st));
};

sha1["__block_size__"] = 64;
sha1["__output_size__"] = 20;