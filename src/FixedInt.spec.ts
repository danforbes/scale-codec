import decode from "./FixedInt";

// TODO: why doesn't toStrictEqual work on these?
describe("FixedInt", (): void => {
  it("decodes 69 as a u8", (): void => {
    const result = decode(Buffer.from([0x45]), 1, false);
    expect(result.offset).toBe(1);
    expect(result.value.toNumber()).toBe(69);
  });

  it("decodes 42 as a u16", (): void => {
    const result = decode(Buffer.from([0x2a, 0x00]), 2, false);
    expect(result.offset).toBe(2);
    expect(result.value.toNumber()).toBe(42);
  });

  it("decodes 16777215 as a u32", (): void => {
    const result = decode(Buffer.from([0xff, 0xff, 0xff, 0x00]), 4, false);
    expect(result.offset).toBe(4);
    expect(result.value.toNumber()).toBe(16777215);
  });

  it("decodes -1 as a i32", (): void => {
    const result = decode(Buffer.from([0xff, 0xff, 0xff, 0x00]), 4, true);
    expect(result.offset).toBe(4);
    expect(result.value.toNumber()).toBe(-1);
  });

  it("cannot decode empty arrays", (): void => {
    expect(() => {
      decode(Buffer.from([]), 1, false);
    }).toThrow("SCALE cannot decode empty bit arrays.");
  });

  it("cannot decode values without enough bytes", (): void => {
    expect(() => {
      decode(Buffer.from([0x02]), 2, false);
    }).toThrow("2-byte SCALE fixed integers must have at least 2 bytes (has: 1).");
  });
});
