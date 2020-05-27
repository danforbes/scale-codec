import { DecodeResult } from "./Decoder";
import { default as decodeCompact } from "./Compact";

export default function (scale: Buffer): DecodeResult<string> {
  if (scale.length === 0) {
    throw new Error("SCALE cannot decode empty bit arrays.");
  }

  const { offset: lenOffset, value: len } = decodeCompact(scale);
  const offset = len.addn(lenOffset).toNumber();
  if (scale.length < offset) {
    throw new Error(`${len}-byte SCALE strings must have at least ${offset} bytes (has: ${scale.length}).`);
  }

  return { offset, value: `${scale.slice(lenOffset, offset)}` };
}
