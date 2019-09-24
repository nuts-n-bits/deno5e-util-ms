
// bk for big K
const bk = [1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];

// st for state
const st = [1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];

const pp = function(msg)        // pre pad
{
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
    let p :number[][] = [];
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

const ms = function(b)          // message schedule for one message block
{
    let w : number[] = [];
    for(let i=0;i<16;i++)
    {
        w[i] = b[i];
    }
    for(let i=16;i<64;i++)
    {
        w[i] = pl(s1(w[i-2]),w[i-7],s0(w[i-15]),w[i-16]);
    }
    return w;
};

const cp = function(s,w)        // compress
{
    let a=s[0], b=s[1], c=s[2], d=s[3], e=s[4], f=s[5], g=s[6], h=s[7];
    for(let x, y, i=0;i<64;i++)
    {
        x = pl(h,S1(e),ch(e,f,g),bk[i],w[i]);
        y = pl(S0(a),mj(a,b,c));
        h = g;
        g = f;
        f = e;
        e = pl(d,x);
        d = c;
        c = b;
        b = a;
        a = pl(x,y);
    }
    return [pl(a,s[0]),pl(b,s[1]),pl(c,s[2]),pl(d,s[3]),pl(e,s[4]),pl(f,s[5]),pl(g,s[6]),pl(h,s[7])];
};

const ml = function(msg, st)    // main loop
{
    let m = pp(msg);
    let s = st;
    for(let i=0;i<m.length;i++)
    {
        s = cp(s,ms(m[i]));
    }
    return s;
};

const pl = function(a,b?,c?,d?,e?)  // safe addition
{
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

const rt = function(a,b)        // right rotate
{
    return ((a>>>b)|(a<<(32-b)))>>>0;
};

const ch = function(x,y,z)      // choice
{
    return ((x&y)^((~x)&z))>>>0;
};

const mj = function(x,y,z)      // majority
{
    return ((x&y)^(x&z)^(y&z))>>>0;
};

/**
 * @return {number}
 */
const S0 = function(x)          // Sigma 0
{
    return (rt(x,2)^rt(x,13)^rt(x,22))>>>0;
};

/**
 * @return {number}
 */
const S1 = function(x)          // Sigma 1
{
    return (rt(x,6)^rt(x,11)^rt(x,25))>>>0;
};

const s0 = function(x)          // sigma 0
{
    return (rt(x,7)^rt(x,18)^(x>>>3))>>>0;
};

const s1 = function(x)          // sigma 1
{
    return (rt(x,17)^rt(x,19)^(x>>>10))>>>0;
};

const rg = function(a)          // c08 from c32
{
    let b : number[] = [];
    for(let i=0;i<8;i++)
    {
        b = b.concat(((a[i]>>24)>>>0)&255,((a[i]>>16)>>>0)&255,((a[i]>>8)>>>0)&255,((a[i]>>0)>>>0)&255);
    }
    return b;
};

interface Custom_hash_function {
    (): (j:number[]) => number[];
    __block_size__ :number;
    __output_size__ :number;
}

// msg be a array of byte-sized numbers.
export default function sha256(msg : number[]) : number[] {

    return rg(ml(msg, st));
}

sha256["__block_size__"] = 64;
sha256["__output_size__"] = 32;

// sha  secret sharing - key