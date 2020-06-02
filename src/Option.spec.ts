import { default as decodeCompact } from "./Compact";
import decode, { booleanOption } from "./Option";
import BN from "bn.js";

describe("Option (Boolean)", (): void => {
  it("decodes true", (): void => {
    expect(booleanOption(Buffer.from([0x02]))).toStrictEqual({ offset: 1, value: true });
  });

  it("decodes false", (): void => {
    expect(booleanOption(Buffer.from([0x01]))).toStrictEqual({ offset: 1, value: false });
  });

  it("decodes null", (): void => {
    expect(booleanOption(Buffer.from([0x00]))).toStrictEqual({ offset: 1, value: null });
  });

  it("cannot decode empty arrays", (): void => {
    expect(() => {
      booleanOption(Buffer.from([]));
    }).toThrow("SCALE cannot decode empty bit arrays.");
  });
});

describe("Option", (): void => {
  it("decodes non-null Compacts", (): void => {
    expect(decode(Buffer.from([0x01, 0xa8]), decodeCompact)).toStrictEqual({ offset: 2, value: new BN(42) });
  });

  it("decodes null Compacts", (): void => {
    expect(decode(Buffer.from([0x00]), decodeCompact)).toStrictEqual({ offset: 1, value: null });
  });

  it("cannot decode empty arrays", (): void => {
    expect(() => {
      decode(Buffer.from([]), decodeCompact);
    }).toThrow("SCALE cannot decode empty bit arrays.");
  });

  it("cannot decode non-null Options with less than two bytes", (): void => {
    expect(() => {
      decode(Buffer.from([0x01]), decodeCompact);
    }).toThrow("Non-null SCALE options must specify more than 1 byte.");
  });
});
