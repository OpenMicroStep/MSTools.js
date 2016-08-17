import { MSColor } from '../types/mscolor';
import { MSBuffer } from '../types/msbuffer';
import { MSCouple } from '../types/mscouple';
import { MSDate } from '../types/msdate';
declare global  {
    interface Object {
        encodeToMSTE(encoder: Encoder): any;
        toMSTE(options?: EncoderOptions): string;
    }
}
export declare type EncoderOptions = {
    version?: number;
    crc?: boolean;
};
export declare type Buffer = MSBuffer | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array;
export interface EngineEncoder {
    encodeObject(object: any): string;
}
export interface EngineEncoderConstructor {
    new (options?: EncoderOptions): EngineEncoder;
}
export interface Encoder {
    encodeNil(): any;
    encodeBoolean(value: boolean): any;
    encodeInteger(value: number): any;
    encodeReal(value: number): any;
    encodeString(value: string): any;
    encodeArray(value: ArrayLike<any>): any;
    encodeNaturals(value: ArrayLike<number>): any;
    encodeDictionary(value: {
        [s: string]: any;
    }, cls?: string): any;
    encodeColor(value: MSColor): any;
    encodeBuffer(value: Buffer): any;
    encodeGMTDate(value: Date): any;
    encodeLocalDate(value: MSDate): any;
    encodeCouple<T1, T2>(value: MSCouple<T1, T2>): any;
}
export declare function tokenize(root: any, options?: EncoderOptions): (string | number)[];
export declare function stringify(root: any, options?: EncoderOptions): string;
