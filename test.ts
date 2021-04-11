const { serializable_member, serialize_one_frame, PbI32 } = await import("./typescript/functions/data-structure/unstable-binary-serialize.ts")


serialize_one_frame(serializable_member(1n, new PbI32(150)))






class Shape {
    string_1GB: string = ""
}