import { DecodeResult } from "./Decoder";

// https://www.substrate.io/kb/advanced/codec#boolean
export default function (scale: Buffer): DecodeResult<boolean> {
  if (scale.length === 0) {
    throw new Error("SCALE cannot decode empty bit arrays.");
  }

  if (scale[0] > 0b01) {
    throw new Error("SCALE booleans may not be greater than a single bit.");
  }

  return { offset: 1, value: scale[0] == 0b01 };
}
