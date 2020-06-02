import BN from "bn.js";
import { DecodeResult } from "./Decoder";

export type FixedIntDecoder = (scale: Buffer, len: number, signed: boolean) => DecodeResult<BN>;

// https://www.substrate.io/kb/advanced/codec#fixed-width-integers
export default function (scale: Buffer, len: number, signed: boolean): DecodeResult<BN> {
  if (scale.length === 0) {
    throw new Error("SCALE cannot decode empty bit arrays.");
  }

  if (scale.length < len) {
    throw new Error(`${len}-byte SCALE fixed integers must have at least ${len} bytes (has: ${scale.length}).`);
  }

  const val = new BN(scale.slice(0, len).reverse());
  return { offset: len, value: signed ? val.fromTwos(len) : val };
}
