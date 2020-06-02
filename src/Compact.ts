import BN from "bn.js";
import { DecodeResult } from "./Decoder";

// 2**536-1
const MAX =
  "1000000C42498CA7FA67401A7BF13DD1835A022CAC595050C68D56DBE8163FECB2920FE5761C2224CDF4C9777CFE0D66800000000000000000000000000000000000000";

// https://www.substrate.io/kb/advanced/codec#compactgeneral-integers
export default function (scale: Buffer): DecodeResult<BN> {
  if (scale.length === 0) {
    throw new Error("SCALE cannot decode empty bit arrays.");
  }

  const raw = scale.readUInt8(0);
  const flag = raw & 0b11;
  if (!flag) {
    // single-byte mode
    return { offset: 1, value: new BN(raw >> 2) };
  } else if (flag === 0b01) {
    // two-byte mode
    const len = 2;
    checkBufferLen(scale.length, len);

    const value: number = scale.readUInt16LE(0) >> 2;
    const { min, max } = { min: 64, max: 2 ** 14 - 1 };
    checkValueBounds(len, value, min, max);

    return { offset: len, value: new BN(value) };
  } else if (flag === 0b10) {
    // four-byte mode
    const len = 4;
    checkBufferLen(scale.length, len);

    const value: number = scale.readUInt32LE(0) >> 2;
    const { min, max } = { min: 2 ** 14 - 1, max: 2 ** 30 - 1 };
    checkValueBounds(len, value, min, max);

    return { offset: len, value: new BN(value) };
  }

  // big integer mode
  const len = (raw >> 2) + 4;
  if (scale.length < len + 1) {
    throw new Error(`Big integer [${len}] SCALE compacts must have at least ${len + 1} bytes (has: ${scale.length}).`);
  }

  const value = new BN(scale.slice(1, len + 1).reverse());
  const { min, max } = { min: new BN(2 ** 30 - 1), max: new BN(MAX, "hex") };
  if (value.lt(min) || value.gt(max)) {
    throw new Error(`Big integer SCALE compacts must be between ${min} and 2**536-1 (got: ${value}).`);
  }

  return { offset: len + 1, value };
}

function checkBufferLen(actual: number, min: number) {
  if (actual < min) {
    throw new Error(`${min}-byte SCALE compacts must have at least ${min} bytes (has: ${actual}).`);
  }
}

function checkValueBounds(len: number, actual: number, min: number, max: number) {
  if (actual < min || actual > max) {
    throw new Error(`${len}-byte SCALE compacts must be between ${min} and ${max} (got: ${actual}).`);
  }
}
