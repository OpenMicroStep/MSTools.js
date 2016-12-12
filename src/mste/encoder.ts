import {Engine, ENGINES, crc32inMSTEformat} from './engines';
import {isInteger, stringify as safeStringify, padStart, crc32} from '../core';
import {MSColor} from '../types/mscolor';
import {MSBuffer} from '../types/msbuffer';
import {MSCouple} from '../types/mscouple';
import {MSDate} from '../types/msdate';
import {MSNaturalArray} from '../types/msnaturalarray';

declare global {
    interface Object {
        encodeToMSTE(encoder: Encoder);
        toMSTE(options?: EncoderOptions): string;
    }
}

export type EncoderOptions = {
    version?: number,
    crc?: boolean
}
export type Buffer = MSBuffer | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array;

function extendNativeObject(object: any, name: string, value: any) {
    Object.defineProperty(object, name, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: value
    });
}

extendNativeObject(Object.prototype, 'toMSTE', function toMSTE(this: Object, options?: EncoderOptions) {
  return stringify(this, options);
});
extendNativeObject(Object.prototype, "encodeToMSTE", function encodeObjectToMSTE(this: Object, encoder: Encoder) {
  encoder.encodeDictionary(this);
});
extendNativeObject(Map.prototype, "encodeToMSTE", function encodeObjectToMSTE<K, T>(this: Map<K, T>, encoder: Encoder) {
  var d = {};
  this.forEach((v, k) => {
    if (typeof k === "string")
      d[<string>k] = v;
    else
      encoder.diagnostic({ type: "map_non_string_key", msg: "cannot encode a non string Map key" });
  });
  encoder.encodeDictionary(d);
});
extendNativeObject(Set.prototype, "encodeToMSTE", function encodeObjectToMSTE<T>(this: Set<T>, encoder: Encoder) {
  encoder.encodeArray(Array.from(this));
});
extendNativeObject(Array.prototype, "encodeToMSTE", function encodeArrayToMSTE<T>(this: Array<T>, encoder: Encoder) {
  encoder.encodeArray(this);
});
extendNativeObject(Date.prototype, "encodeToMSTE", function encodeGMTDateToMSTE(this: Date, encoder: Encoder) {
  encoder.encodeGMTDate(this);
});
extendNativeObject(MSDate.prototype, "encodeToMSTE", function encodeLocalDateToMSTE(this: MSDate, encoder: Encoder) {
  encoder.encodeLocalDate(this);
});
extendNativeObject(MSBuffer.prototype, "encodeToMSTE", function encodeBufferToMSTE(this: MSBuffer, encoder: Encoder) {
  encoder.encodeBuffer(this);
});
extendNativeObject(MSColor.prototype, "encodeToMSTE", function encodeColorToMSTE(this: MSColor, encoder: Encoder) {
  encoder.encodeColor(this);
});
extendNativeObject(MSNaturalArray.prototype, "encodeToMSTE", function encodeNaturalsToMSTE(this: MSNaturalArray, encoder: Encoder) {
  encoder.encodeNaturals(this);
});
extendNativeObject(MSCouple.prototype, "encodeToMSTE", function encodeCoupleToMSTE(this: MSCouple<any, any>, encoder: Encoder) {
  encoder.encodeCouple(this);
});

function encodeTypedArrayToMSTE(this: any, encoder: Encoder) {
    encoder.encodeBuffer(this);
}
[Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array].map((typedarray) => {
    extendNativeObject(typedarray.prototype, "encodeToMSTE", encodeTypedArrayToMSTE);
});

export interface EngineEncoder {
    encodeObject(object: any) : string;
}
export interface EngineEncoderConstructor {
    new (options?: EncoderOptions): EngineEncoder;
}

export interface Encoder {
    diagnostic(diag: { type: string, msg: string })
    diagnostics: { type: string, msg: string }[]
    encodeNil()
    encodeBoolean(value: boolean)
    encodeInteger(value: number)
    encodeReal(value: number)
    encodeString(value: string)
    encodeArray(value: ArrayLike<any>)
    encodeNaturals(value: ArrayLike<number>)
    encodeDictionary(value: {[s: string]: any}, cls?: string)
    encodeColor(value: MSColor)
    encodeBuffer(value: Buffer)
    encodeGMTDate(value: Date)
    encodeLocalDate(value: MSDate);
    encodeCouple<T1, T2>(value: MSCouple<T1, T2>)
}

export function tokenize(root, options?: EncoderOptions) {
    let version = options && options.version || 0x0102;
    let engine = ENGINES.find(e => e.versionCode === version);
    if (!engine)
        throw new Error("no valid engine with version: " + version) ;
    return engine.tokenize(root, options);
}
export function stringify(root, options?: EncoderOptions) {
    let tokens = tokenize(root, options);
    tokens[2] = crc32inMSTEformat(safeStringify(tokens));
    return safeStringify(tokens);
}
