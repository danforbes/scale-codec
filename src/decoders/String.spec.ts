import decode from "./String";

describe("String", (): void => {
  it("decodes meta", (): void => {
    expect(decode(Buffer.from([0b00010000, 0x6d, 0x65, 0x74, 0x61]))).toStrictEqual({ offset: 5, value: "meta" });
  });

  it("cannot decode empty arrays", (): void => {
    expect(() => {
      decode(Buffer.from([]));
    }).toThrow("SCALE cannot decode empty bit arrays.");
  });

  it("cannot decode values that don't have enough bytes", (): void => {
    expect(() => {
      decode(Buffer.from([0b00010000, 0x6d, 0x65, 0x74]));
    }).toThrow("4-byte SCALE strings must have at least 5 bytes (has: 4).");
  });
});
