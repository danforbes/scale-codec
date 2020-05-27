import { DecodeResult, Decoder } from "./Decoder";

export type OptionDecoder<T> = (scale: Buffer, decoder: Decoder<T>) => DecodeResult<T>;

// https://www.substrate.io/kb/advanced/codec#options
export default function <T>(scale: Buffer, decoder: Decoder<T>): DecodeResult<T | null> {
  if (scale.length === 0) {
    throw new Error("SCALE cannot decode empty bit arrays.");
  }

  if (!scale[0]) {
    return { offset: 1, value: null };
  }

  if (scale.length < 2) {
    throw new Error("Non-null SCALE options must specify more than 1 byte.");
  }

  const inner = decoder(scale.slice(1));
  return { offset: inner.offset + 1, value: inner.value };
}

export function booleanOption(scale: Buffer): DecodeResult<boolean | null> {
  if (scale.length === 0) {
    throw new Error("SCALE cannot decode empty bit arrays.");
  }

  if (!scale[0]) {
    return { offset: 1, value: null };
  }

  return { offset: 1, value: scale[0] === 0x02 };
}
