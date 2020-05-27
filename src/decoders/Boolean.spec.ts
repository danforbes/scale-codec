import decode from "./Boolean";

describe("Boolean", (): void => {
  it("decodes true", (): void => {
    expect(decode(Buffer.from([0x01]))).toStrictEqual({ offset: 1, value: true });
  });

  it("decodes false", (): void => {
    expect(decode(Buffer.from([0x00]))).toStrictEqual({ offset: 1, value: false });
  });

  it("cannot decode empty arrays", (): void => {
    expect(() => {
      decode(Buffer.from([]));
    }).toThrow("SCALE cannot decode empty bit arrays.");
  });

  it("cannot decode values larger than 0b01", (): void => {
    expect(() => {
      decode(Buffer.from([0x02]));
    }).toThrow("SCALE booleans may not be greater than a single bit.");
  });
});
