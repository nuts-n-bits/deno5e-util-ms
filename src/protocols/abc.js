export class Abc {
    constructor(v) {
        this.v = v;
    }
}
export class Wxyz {
    constructor(discriminator, v) {
        this.discriminator = discriminator;
        this.v = v;
    }
}
// When a function has multiple distinct return types and they're difficult to differentiate with 
// just regular old object literal types. 
// Furthermore, Typescript treat single object literal types differently from unioned object types, causing problems:
//   function id_or_name(input: {id:number, name:null}|{name:string})
//   id_or_name({id:3, name:"alex"}) is a valid call, this does not conform to everyone's intuition. 
//CRAZY
// function id_or_name(input: {id:number; name:"joe"}|{name:string}|{irrelevant: Date}): void {return}
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
export class A extends Abc {
}
export class B extends Abc {
}
export class C extends Abc {
}
export class D extends Abc {
}
export class E extends Abc {
}
export class F extends Abc {
}
export class G extends Abc {
}
export class H extends Abc {
}
export class I extends Abc {
}
export class J extends Abc {
}
export class K extends Abc {
}
export class L extends Abc {
}
export class M extends Abc {
}
export class N extends Abc {
}
export class O extends Abc {
}
export class P extends Abc {
}
export class Q extends Abc {
}
export class R extends Abc {
}
export class S extends Abc {
}
export class T extends Abc {
}
export class U extends Abc {
}
export class V extends Abc {
}
export class W extends Wxyz {
}
export class X extends Wxyz {
}
export class Y extends Wxyz {
}
export class Z extends Wxyz {
}
export class A0 extends Abc {
}
export class A1 extends Abc {
}
export class A2 extends Abc {
}
export class A3 extends Abc {
}
export class A4 extends Abc {
}
export class A5 extends Abc {
}
export class A6 extends Abc {
}
export class A7 extends Abc {
}
export class A8 extends Abc {
}
export class A9 extends Abc {
}
export class B0 extends Abc {
}
export class B1 extends Abc {
}
export class B2 extends Abc {
}
export class B3 extends Abc {
}
export class B4 extends Abc {
}
export class B5 extends Abc {
}
export class B6 extends Abc {
}
export class B7 extends Abc {
}
export class B8 extends Abc {
}
export class B9 extends Abc {
}
export class C0 extends Abc {
}
export class C1 extends Abc {
}
export class C2 extends Abc {
}
export class C3 extends Abc {
}
export class C4 extends Abc {
}
export class C5 extends Abc {
}
export class C6 extends Abc {
}
export class C7 extends Abc {
}
export class C8 extends Abc {
}
export class C9 extends Abc {
}
export class D0 extends Abc {
}
export class D1 extends Abc {
}
export class D2 extends Abc {
}
export class D3 extends Abc {
}
export class D4 extends Abc {
}
export class D5 extends Abc {
}
export class D6 extends Abc {
}
export class D7 extends Abc {
}
export class D8 extends Abc {
}
export class D9 extends Abc {
}
export class E0 extends Abc {
}
export class E1 extends Abc {
}
export class E2 extends Abc {
}
export class E3 extends Abc {
}
export class E4 extends Abc {
}
export class E5 extends Abc {
}
export class E6 extends Abc {
}
export class E7 extends Abc {
}
export class E8 extends Abc {
}
export class E9 extends Abc {
}
export class F0 extends Abc {
}
export class F1 extends Abc {
}
export class F2 extends Abc {
}
export class F3 extends Abc {
}
export class F4 extends Abc {
}
export class F5 extends Abc {
}
export class F6 extends Abc {
}
export class F7 extends Abc {
}
export class F8 extends Abc {
}
export class F9 extends Abc {
}
export class G0 extends Abc {
}
export class G1 extends Abc {
}
export class G2 extends Abc {
}
export class G3 extends Abc {
}
export class G4 extends Abc {
}
export class G5 extends Abc {
}
export class G6 extends Abc {
}
export class G7 extends Abc {
}
export class G8 extends Abc {
}
export class G9 extends Abc {
}
export class H0 extends Abc {
}
export class H1 extends Abc {
}
export class H2 extends Abc {
}
export class H3 extends Abc {
}
export class H4 extends Abc {
}
export class H5 extends Abc {
}
export class H6 extends Abc {
}
export class H7 extends Abc {
}
export class H8 extends Abc {
}
export class H9 extends Abc {
}
export class I0 extends Abc {
}
export class I1 extends Abc {
}
export class I2 extends Abc {
}
export class I3 extends Abc {
}
export class I4 extends Abc {
}
export class I5 extends Abc {
}
export class I6 extends Abc {
}
export class I7 extends Abc {
}
export class I8 extends Abc {
}
export class I9 extends Abc {
}
export class J0 extends Abc {
}
export class J1 extends Abc {
}
export class J2 extends Abc {
}
export class J3 extends Abc {
}
export class J4 extends Abc {
}
export class J5 extends Abc {
}
export class J6 extends Abc {
}
export class J7 extends Abc {
}
export class J8 extends Abc {
}
export class J9 extends Abc {
}
export class K0 extends Abc {
}
export class K1 extends Abc {
}
export class K2 extends Abc {
}
export class K3 extends Abc {
}
export class K4 extends Abc {
}
export class K5 extends Abc {
}
export class K6 extends Abc {
}
export class K7 extends Abc {
}
export class K8 extends Abc {
}
export class K9 extends Abc {
}
export class L0 extends Abc {
}
export class L1 extends Abc {
}
export class L2 extends Abc {
}
export class L3 extends Abc {
}
export class L4 extends Abc {
}
export class L5 extends Abc {
}
export class L6 extends Abc {
}
export class L7 extends Abc {
}
export class L8 extends Abc {
}
export class L9 extends Abc {
}
export class M0 extends Abc {
}
export class M1 extends Abc {
}
export class M2 extends Abc {
}
export class M3 extends Abc {
}
export class M4 extends Abc {
}
export class M5 extends Abc {
}
export class M6 extends Abc {
}
export class M7 extends Abc {
}
export class M8 extends Abc {
}
export class M9 extends Abc {
}
export class N0 extends Abc {
}
export class N1 extends Abc {
}
export class N2 extends Abc {
}
export class N3 extends Abc {
}
export class N4 extends Abc {
}
export class N5 extends Abc {
}
export class N6 extends Abc {
}
export class N7 extends Abc {
}
export class N8 extends Abc {
}
export class N9 extends Abc {
}
export class O0 extends Abc {
}
export class O1 extends Abc {
}
export class O2 extends Abc {
}
export class O3 extends Abc {
}
export class O4 extends Abc {
}
export class O5 extends Abc {
}
export class O6 extends Abc {
}
export class O7 extends Abc {
}
export class O8 extends Abc {
}
export class O9 extends Abc {
}
export class P0 extends Abc {
}
export class P1 extends Abc {
}
export class P2 extends Abc {
}
export class P3 extends Abc {
}
export class P4 extends Abc {
}
export class P5 extends Abc {
}
export class P6 extends Abc {
}
export class P7 extends Abc {
}
export class P8 extends Abc {
}
export class P9 extends Abc {
}
export class Q0 extends Abc {
}
export class Q1 extends Abc {
}
export class Q2 extends Abc {
}
export class Q3 extends Abc {
}
export class Q4 extends Abc {
}
export class Q5 extends Abc {
}
export class Q6 extends Abc {
}
export class Q7 extends Abc {
}
export class Q8 extends Abc {
}
export class Q9 extends Abc {
}
export class R0 extends Abc {
}
export class R1 extends Abc {
}
export class R2 extends Abc {
}
export class R3 extends Abc {
}
export class R4 extends Abc {
}
export class R5 extends Abc {
}
export class R6 extends Abc {
}
export class R7 extends Abc {
}
export class R8 extends Abc {
}
export class R9 extends Abc {
}
export class S0 extends Abc {
}
export class S1 extends Abc {
}
export class S2 extends Abc {
}
export class S3 extends Abc {
}
export class S4 extends Abc {
}
export class S5 extends Abc {
}
export class S6 extends Abc {
}
export class S7 extends Abc {
}
export class S8 extends Abc {
}
export class S9 extends Abc {
}
export class T0 extends Abc {
}
export class T1 extends Abc {
}
export class T2 extends Abc {
}
export class T3 extends Abc {
}
export class T4 extends Abc {
}
export class T5 extends Abc {
}
export class T6 extends Abc {
}
export class T7 extends Abc {
}
export class T8 extends Abc {
}
export class T9 extends Abc {
}
export class U0 extends Abc {
}
export class U1 extends Abc {
}
export class U2 extends Abc {
}
export class U3 extends Abc {
}
export class U4 extends Abc {
}
export class U5 extends Abc {
}
export class U6 extends Abc {
}
export class U7 extends Abc {
}
export class U8 extends Abc {
}
export class U9 extends Abc {
}
export class V0 extends Abc {
}
export class V1 extends Abc {
}
export class V2 extends Abc {
}
export class V3 extends Abc {
}
export class V4 extends Abc {
}
export class V5 extends Abc {
}
export class V6 extends Abc {
}
export class V7 extends Abc {
}
export class V8 extends Abc {
}
export class V9 extends Abc {
}
export class W0 extends Wxyz {
}
export class W1 extends Wxyz {
}
export class W2 extends Wxyz {
}
export class W3 extends Wxyz {
}
export class W4 extends Wxyz {
}
export class W5 extends Wxyz {
}
export class W6 extends Wxyz {
}
export class W7 extends Wxyz {
}
export class W8 extends Wxyz {
}
export class W9 extends Wxyz {
}
export class X0 extends Wxyz {
}
export class X1 extends Wxyz {
}
export class X2 extends Wxyz {
}
export class X3 extends Wxyz {
}
export class X4 extends Wxyz {
}
export class X5 extends Wxyz {
}
export class X6 extends Wxyz {
}
export class X7 extends Wxyz {
}
export class X8 extends Wxyz {
}
export class X9 extends Wxyz {
}
export class Y0 extends Wxyz {
}
export class Y1 extends Wxyz {
}
export class Y2 extends Wxyz {
}
export class Y3 extends Wxyz {
}
export class Y4 extends Wxyz {
}
export class Y5 extends Wxyz {
}
export class Y6 extends Wxyz {
}
export class Y7 extends Wxyz {
}
export class Y8 extends Wxyz {
}
export class Y9 extends Wxyz {
}
export class Z0 extends Wxyz {
}
export class Z1 extends Wxyz {
}
export class Z2 extends Wxyz {
}
export class Z3 extends Wxyz {
}
export class Z4 extends Wxyz {
}
export class Z5 extends Wxyz {
}
export class Z6 extends Wxyz {
}
export class Z7 extends Wxyz {
}
export class Z8 extends Wxyz {
}
export class Z9 extends Wxyz {
}
//# sourceMappingURL=abc.js.map