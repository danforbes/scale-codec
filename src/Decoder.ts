export type Decoder<T> = (scale: Buffer) => DecodeResult<T>;
export type DecodeResult<T> = {
  offset: number;
  value: T;
};
