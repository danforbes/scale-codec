import decode from "./List";
import decodeBoolean from "./Boolean";
import decodeString from "./String";

describe("Option", (): void => {
  it("decodes a list of three identical strings", (): void => {
    expect(
      decode(
        Buffer.from([
          0x0c,
          0b00010000,
          0x6d,
          0x65,
          0x74,
          0x61,
          0b00010000,
          0x6d,
          0x65,
          0x74,
          0x61,
          0b00010000,
          0x6d,
          0x65,
          0x74,
          0x61,
        ]),
        decodeString
      )
    ).toStrictEqual({ offset: 16, value: ["meta", "meta", "meta"] });
  });

  it("decodes a list of three booleans", (): void => {
    expect(decode(Buffer.from([0x0c, 0x0, 0x1, 0x0]), decodeBoolean)).toStrictEqual({
      offset: 4,
      value: [false, true, false],
    });
  });

  it("cannot decode empty arrays", (): void => {
    expect(() => {
      decode(Buffer.from([]), decodeBoolean);
    }).toThrow("SCALE cannot decode empty bit arrays.");
  });

  it("cannot decode lists without enough elements", (): void => {
    expect(() => {
      decode(Buffer.from([0x0c, 0x0, 0x1]), decodeBoolean);
    }).toThrow("3-length SCALE lists must have at least 4 bytes (has: 3).");
  });
});
