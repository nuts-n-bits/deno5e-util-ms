class Abc <T> {
    constructor(public readonly v : T) {}
}

class Wxyz <T, U> {
    constructor(public readonly discriminator: T, public readonly v : U) {}
}

// When a function has multiple distinct return types and they're difficult to differentiate with 
// just regular old object literal types. 

// Furthermore, Typescript treat single object literal types differently from unioned object types, causing problems:
//   function id_or_name(input: {id:number, name:null}|{name:string})
//   id_or_name({id:3, name:"alex"}) is a valid call, this does not conform to everyone's intuition. 



// CRAZY
// function id_or_name(input: {id:number; name:null}|{name:string}): void {return}
// id_or_name({id:3, name:"alex"})

// class Foo{ foo: "foo"="foo" } 
// class Bar{ bar: "bar"="bar" }
// declare function fn(baz: {foo: null, bar: string} | { foo: bigint}): void 

// fn({bar: "lol", foo: 3n})

// const x: {c: Bar} = {f: "", c: new Bar()}


// For example, a funciton may have the following return type: 
//   {status: 200, data: Uint8Array} | {status: 500} | {status: 302, headers: [string, string]}
// The user of such function will have difficulty selecting between these values succintly.
// If instead it returned:
//   A<{status: 200, data: Uint8Array}> | B<{status: 500}> | C<{status: 302, headers: [string, string]}>
// Then typescript instanceof operator will easily differentiate them.

export class A <T> extends Abc <T> {}
export class B <T> extends Abc <T> {}
export class C <T> extends Abc <T> {}
export class D <T> extends Abc <T> {}
export class E <T> extends Abc <T> {}
export class F <T> extends Abc <T> {}
export class G <T> extends Abc <T> {}
export class H <T> extends Abc <T> {}
export class I <T> extends Abc <T> {}
export class J <T> extends Abc <T> {}
export class K <T> extends Abc <T> {}
export class L <T> extends Abc <T> {}
export class M <T> extends Abc <T> {}
export class N <T> extends Abc <T> {}
export class O <T> extends Abc <T> {}
export class P <T> extends Abc <T> {}
export class Q <T> extends Abc <T> {}
export class R <T> extends Abc <T> {}
export class S <T> extends Abc <T> {}
export class T <T> extends Abc <T> {}
export class U <T> extends Abc <T> {}
export class V <T> extends Abc <T> {}
export class W <T, U> extends Wxyz <T, U> {}
export class X <T, U> extends Wxyz <T, U> {}
export class Y <T, U> extends Wxyz <T, U> {}
export class Z <T, U> extends Wxyz <T, U> {}

export class A0 <T> extends Abc <T> {}
export class A1 <T> extends Abc <T> {}
export class A2 <T> extends Abc <T> {}
export class A3 <T> extends Abc <T> {}
export class A4 <T> extends Abc <T> {}
export class A5 <T> extends Abc <T> {}
export class A6 <T> extends Abc <T> {}
export class A7 <T> extends Abc <T> {}
export class A8 <T> extends Abc <T> {}
export class A9 <T> extends Abc <T> {}

export class B0 <T> extends Abc <T> {}
export class B1 <T> extends Abc <T> {}
export class B2 <T> extends Abc <T> {}
export class B3 <T> extends Abc <T> {}
export class B4 <T> extends Abc <T> {}
export class B5 <T> extends Abc <T> {}
export class B6 <T> extends Abc <T> {}
export class B7 <T> extends Abc <T> {}
export class B8 <T> extends Abc <T> {}
export class B9 <T> extends Abc <T> {}

export class C0 <T> extends Abc <T> {}
export class C1 <T> extends Abc <T> {}
export class C2 <T> extends Abc <T> {}
export class C3 <T> extends Abc <T> {}
export class C4 <T> extends Abc <T> {}
export class C5 <T> extends Abc <T> {}
export class C6 <T> extends Abc <T> {}
export class C7 <T> extends Abc <T> {}
export class C8 <T> extends Abc <T> {}
export class C9 <T> extends Abc <T> {}

export class D0 <T> extends Abc <T> {}
export class D1 <T> extends Abc <T> {}
export class D2 <T> extends Abc <T> {}
export class D3 <T> extends Abc <T> {}
export class D4 <T> extends Abc <T> {}
export class D5 <T> extends Abc <T> {}
export class D6 <T> extends Abc <T> {}
export class D7 <T> extends Abc <T> {}
export class D8 <T> extends Abc <T> {}
export class D9 <T> extends Abc <T> {}

export class E0 <T> extends Abc <T> {}
export class E1 <T> extends Abc <T> {}
export class E2 <T> extends Abc <T> {}
export class E3 <T> extends Abc <T> {}
export class E4 <T> extends Abc <T> {}
export class E5 <T> extends Abc <T> {}
export class E6 <T> extends Abc <T> {}
export class E7 <T> extends Abc <T> {}
export class E8 <T> extends Abc <T> {}
export class E9 <T> extends Abc <T> {}

export class F0 <T> extends Abc <T> {}
export class F1 <T> extends Abc <T> {}
export class F2 <T> extends Abc <T> {}
export class F3 <T> extends Abc <T> {}
export class F4 <T> extends Abc <T> {}
export class F5 <T> extends Abc <T> {}
export class F6 <T> extends Abc <T> {}
export class F7 <T> extends Abc <T> {}
export class F8 <T> extends Abc <T> {}
export class F9 <T> extends Abc <T> {}

export class G0 <T> extends Abc <T> {}
export class G1 <T> extends Abc <T> {}
export class G2 <T> extends Abc <T> {}
export class G3 <T> extends Abc <T> {}
export class G4 <T> extends Abc <T> {}
export class G5 <T> extends Abc <T> {}
export class G6 <T> extends Abc <T> {}
export class G7 <T> extends Abc <T> {}
export class G8 <T> extends Abc <T> {}
export class G9 <T> extends Abc <T> {}

export class H0 <T> extends Abc <T> {}
export class H1 <T> extends Abc <T> {}
export class H2 <T> extends Abc <T> {}
export class H3 <T> extends Abc <T> {}
export class H4 <T> extends Abc <T> {}
export class H5 <T> extends Abc <T> {}
export class H6 <T> extends Abc <T> {}
export class H7 <T> extends Abc <T> {}
export class H8 <T> extends Abc <T> {}
export class H9 <T> extends Abc <T> {}

export class I0 <T> extends Abc <T> {}
export class I1 <T> extends Abc <T> {}
export class I2 <T> extends Abc <T> {}
export class I3 <T> extends Abc <T> {}
export class I4 <T> extends Abc <T> {}
export class I5 <T> extends Abc <T> {}
export class I6 <T> extends Abc <T> {}
export class I7 <T> extends Abc <T> {}
export class I8 <T> extends Abc <T> {}
export class I9 <T> extends Abc <T> {}

export class J0 <T> extends Abc <T> {}
export class J1 <T> extends Abc <T> {}
export class J2 <T> extends Abc <T> {}
export class J3 <T> extends Abc <T> {}
export class J4 <T> extends Abc <T> {}
export class J5 <T> extends Abc <T> {}
export class J6 <T> extends Abc <T> {}
export class J7 <T> extends Abc <T> {}
export class J8 <T> extends Abc <T> {}
export class J9 <T> extends Abc <T> {}

export class K0 <T> extends Abc <T> {}
export class K1 <T> extends Abc <T> {}
export class K2 <T> extends Abc <T> {}
export class K3 <T> extends Abc <T> {}
export class K4 <T> extends Abc <T> {}
export class K5 <T> extends Abc <T> {}
export class K6 <T> extends Abc <T> {}
export class K7 <T> extends Abc <T> {}
export class K8 <T> extends Abc <T> {}
export class K9 <T> extends Abc <T> {}

export class L0 <T> extends Abc <T> {}
export class L1 <T> extends Abc <T> {}
export class L2 <T> extends Abc <T> {}
export class L3 <T> extends Abc <T> {}
export class L4 <T> extends Abc <T> {}
export class L5 <T> extends Abc <T> {}
export class L6 <T> extends Abc <T> {}
export class L7 <T> extends Abc <T> {}
export class L8 <T> extends Abc <T> {}
export class L9 <T> extends Abc <T> {}

export class M0 <T> extends Abc <T> {}
export class M1 <T> extends Abc <T> {}
export class M2 <T> extends Abc <T> {}
export class M3 <T> extends Abc <T> {}
export class M4 <T> extends Abc <T> {}
export class M5 <T> extends Abc <T> {}
export class M6 <T> extends Abc <T> {}
export class M7 <T> extends Abc <T> {}
export class M8 <T> extends Abc <T> {}
export class M9 <T> extends Abc <T> {}

export class N0 <T> extends Abc <T> {}
export class N1 <T> extends Abc <T> {}
export class N2 <T> extends Abc <T> {}
export class N3 <T> extends Abc <T> {}
export class N4 <T> extends Abc <T> {}
export class N5 <T> extends Abc <T> {}
export class N6 <T> extends Abc <T> {}
export class N7 <T> extends Abc <T> {}
export class N8 <T> extends Abc <T> {}
export class N9 <T> extends Abc <T> {}

export class O0 <T> extends Abc <T> {}
export class O1 <T> extends Abc <T> {}
export class O2 <T> extends Abc <T> {}
export class O3 <T> extends Abc <T> {}
export class O4 <T> extends Abc <T> {}
export class O5 <T> extends Abc <T> {}
export class O6 <T> extends Abc <T> {}
export class O7 <T> extends Abc <T> {}
export class O8 <T> extends Abc <T> {}
export class O9 <T> extends Abc <T> {}

export class P0 <T> extends Abc <T> {}
export class P1 <T> extends Abc <T> {}
export class P2 <T> extends Abc <T> {}
export class P3 <T> extends Abc <T> {}
export class P4 <T> extends Abc <T> {}
export class P5 <T> extends Abc <T> {}
export class P6 <T> extends Abc <T> {}
export class P7 <T> extends Abc <T> {}
export class P8 <T> extends Abc <T> {}
export class P9 <T> extends Abc <T> {}

export class Q0 <T> extends Abc <T> {}
export class Q1 <T> extends Abc <T> {}
export class Q2 <T> extends Abc <T> {}
export class Q3 <T> extends Abc <T> {}
export class Q4 <T> extends Abc <T> {}
export class Q5 <T> extends Abc <T> {}
export class Q6 <T> extends Abc <T> {}
export class Q7 <T> extends Abc <T> {}
export class Q8 <T> extends Abc <T> {}
export class Q9 <T> extends Abc <T> {}

export class R0 <T> extends Abc <T> {}
export class R1 <T> extends Abc <T> {}
export class R2 <T> extends Abc <T> {}
export class R3 <T> extends Abc <T> {}
export class R4 <T> extends Abc <T> {}
export class R5 <T> extends Abc <T> {}
export class R6 <T> extends Abc <T> {}
export class R7 <T> extends Abc <T> {}
export class R8 <T> extends Abc <T> {}
export class R9 <T> extends Abc <T> {}

export class S0 <T> extends Abc <T> {}
export class S1 <T> extends Abc <T> {}
export class S2 <T> extends Abc <T> {}
export class S3 <T> extends Abc <T> {}
export class S4 <T> extends Abc <T> {}
export class S5 <T> extends Abc <T> {}
export class S6 <T> extends Abc <T> {}
export class S7 <T> extends Abc <T> {}
export class S8 <T> extends Abc <T> {}
export class S9 <T> extends Abc <T> {}

export class T0 <T> extends Abc <T> {}
export class T1 <T> extends Abc <T> {}
export class T2 <T> extends Abc <T> {}
export class T3 <T> extends Abc <T> {}
export class T4 <T> extends Abc <T> {}
export class T5 <T> extends Abc <T> {}
export class T6 <T> extends Abc <T> {}
export class T7 <T> extends Abc <T> {}
export class T8 <T> extends Abc <T> {}
export class T9 <T> extends Abc <T> {}

export class U0 <T> extends Abc <T> {}
export class U1 <T> extends Abc <T> {}
export class U2 <T> extends Abc <T> {}
export class U3 <T> extends Abc <T> {}
export class U4 <T> extends Abc <T> {}
export class U5 <T> extends Abc <T> {}
export class U6 <T> extends Abc <T> {}
export class U7 <T> extends Abc <T> {}
export class U8 <T> extends Abc <T> {}
export class U9 <T> extends Abc <T> {}

export class V0 <T> extends Abc <T> {}
export class V1 <T> extends Abc <T> {}
export class V2 <T> extends Abc <T> {}
export class V3 <T> extends Abc <T> {}
export class V4 <T> extends Abc <T> {}
export class V5 <T> extends Abc <T> {}
export class V6 <T> extends Abc <T> {}
export class V7 <T> extends Abc <T> {}
export class V8 <T> extends Abc <T> {}
export class V9 <T> extends Abc <T> {}

export class W0 <T, U> extends Wxyz <T, U> {}
export class W1 <T, U> extends Wxyz <T, U> {}
export class W2 <T, U> extends Wxyz <T, U> {}
export class W3 <T, U> extends Wxyz <T, U> {}
export class W4 <T, U> extends Wxyz <T, U> {}
export class W5 <T, U> extends Wxyz <T, U> {}
export class W6 <T, U> extends Wxyz <T, U> {}
export class W7 <T, U> extends Wxyz <T, U> {}
export class W8 <T, U> extends Wxyz <T, U> {}
export class W9 <T, U> extends Wxyz <T, U> {}

export class X0 <T, U> extends Wxyz <T, U> {}
export class X1 <T, U> extends Wxyz <T, U> {}
export class X2 <T, U> extends Wxyz <T, U> {}
export class X3 <T, U> extends Wxyz <T, U> {}
export class X4 <T, U> extends Wxyz <T, U> {}
export class X5 <T, U> extends Wxyz <T, U> {}
export class X6 <T, U> extends Wxyz <T, U> {}
export class X7 <T, U> extends Wxyz <T, U> {}
export class X8 <T, U> extends Wxyz <T, U> {}
export class X9 <T, U> extends Wxyz <T, U> {}

export class Y0 <T, U> extends Wxyz <T, U> {}
export class Y1 <T, U> extends Wxyz <T, U> {}
export class Y2 <T, U> extends Wxyz <T, U> {}
export class Y3 <T, U> extends Wxyz <T, U> {}
export class Y4 <T, U> extends Wxyz <T, U> {}
export class Y5 <T, U> extends Wxyz <T, U> {}
export class Y6 <T, U> extends Wxyz <T, U> {}
export class Y7 <T, U> extends Wxyz <T, U> {}
export class Y8 <T, U> extends Wxyz <T, U> {}
export class Y9 <T, U> extends Wxyz <T, U> {}

export class Z0 <T, U> extends Wxyz <T, U> {}
export class Z1 <T, U> extends Wxyz <T, U> {}
export class Z2 <T, U> extends Wxyz <T, U> {}
export class Z3 <T, U> extends Wxyz <T, U> {}
export class Z4 <T, U> extends Wxyz <T, U> {}
export class Z5 <T, U> extends Wxyz <T, U> {}
export class Z6 <T, U> extends Wxyz <T, U> {}
export class Z7 <T, U> extends Wxyz <T, U> {}
export class Z8 <T, U> extends Wxyz <T, U> {}
export class Z9 <T, U> extends Wxyz <T, U> {}