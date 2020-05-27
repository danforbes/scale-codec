import BN from "bn.js";
import decode from "./Compact";

describe("Compact", (): void => {
  it("decodes 0 [single-byte mode]", (): void => {
    expect(decode(Buffer.from([0x00]))).toStrictEqual({ offset: 1, value: new BN(0) });
  });

  it("decodes 42 [single-byte mode]", (): void => {
    expect(decode(Buffer.from([0xa8]))).toStrictEqual({ offset: 1, value: new BN(42) });
  });

  it("decodes 511 [two-byte mode]", (): void => {
    expect(decode(Buffer.from([0xfd, 0x07]))).toStrictEqual({ offset: 2, value: new BN(511) });
  });

  it("decodes 65535 [four-byte mode]", (): void => {
    expect(decode(Buffer.from([0xfe, 0xff, 0x03, 0x00]))).toStrictEqual({
      offset: 4,
      value: new BN(65535),
    });
  });

  it("decodes 100000000000000 [big integer mode]", (): void => {
    expect(decode(Buffer.from([0x0b, 0x00, 0x40, 0x7a, 0x10, 0xf3, 0x5a]))).toStrictEqual({
      offset: 7,
      value: new BN(100000000000000),
    });
  });

  it("cannot decode empty arrays", (): void => {
    expect(() => {
      decode(Buffer.from([]));
    }).toThrow("SCALE cannot decode empty bit arrays.");
  });

  it("cannot decode two-byte values with less than two bytes", (): void => {
    expect(() => {
      decode(Buffer.from([0x01]));
    }).toThrow("2-byte SCALE compacts must have at least 2 bytes (has: 1).");
  });

  it("cannot decode two-byte values less than 64", (): void => {
    expect(() => {
      decode(Buffer.from([0b00000001, 0b00000000]));
    }).toThrow("2-byte SCALE compacts must be between 64 and 16383 (got: 0).");
  });

  it("cannot decode four-byte values with less than four bytes", (): void => {
    expect(() => {
      decode(Buffer.from([0x02, 0xff]));
    }).toThrow("4-byte SCALE compacts must have at least 4 bytes (has: 2).");
  });

  it("cannot decode four-byte values less than 2**14-1", (): void => {
    expect(() => {
      decode(Buffer.from([0b00000110, 0b00000000, 0b00000000, 0b00000000]));
    }).toThrow("4-byte SCALE compacts must be between 16383 and 1073741823 (got: 1).");
  });

  it("cannot decode big integer values without enough bytes", (): void => {
    expect(() => {
      decode(Buffer.from([0x03, 0xff, 0xf]));
    }).toThrow("Big integer [4] SCALE compacts must have at least 5 bytes (has: 3).");
  });

  it("cannot decode big integer values less than 2**30-1", (): void => {
    expect(() => {
      decode(Buffer.from([0b00000011, 0b00000010, 0b00000000, 0b00000000, 0b00000000]));
    }).toThrow("Big integer SCALE compacts must be between 1073741823 and 2**536-1 (got: 2).");
  });
});
