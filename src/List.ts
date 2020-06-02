import { DecodeResult, Decoder } from "./Decoder";
import { default as decodeCompact } from "./Compact";

export type ListDecoder<T> = (scale: Buffer, decoder: Decoder<T>) => DecodeResult<T>;

// https://www.substrate.io/kb/advanced/codec#vectors-lists-series-sets
export default function <T>(scale: Buffer, decoder: Decoder<T>): DecodeResult<Array<T>> {
  if (scale.length === 0) {
    throw new Error("SCALE cannot decode empty bit arrays.");
  }

  const { offset: lenOffset, value: rawLen } = decodeCompact(scale);
  const numElems = rawLen.toNumber();
  const minLen = numElems + lenOffset;
  if (scale.length < minLen) {
    throw new Error(`${numElems}-length SCALE lists must have at least ${minLen} bytes (has: ${scale.length}).`);
  }

  let bufIdx = lenOffset;
  const value: Array<T> = [];
  for (let valIdx: number = 0; valIdx < numElems; ++valIdx) {
    const { offset: valOffset, value: val } = decoder(scale.slice(bufIdx));
    bufIdx += valOffset;
    value.push(val);
  }

  return { offset: bufIdx, value };
}
