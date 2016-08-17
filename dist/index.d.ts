export { MSColor } from './types/mscolor';
export { MSBuffer } from './types/msbuffer';
export { MSDate } from './types/msdate';
export { MSNaturalArray } from './types/msnaturalarray';
export { MSCouple } from './types/mscouple';
export { crc32, div, isInteger, ok, type, padStart, padEnd, stringify } from './core';
export declare const MSTE: {
    parse: (source: string | (string | number)[], options?: {
        classes?: {
            [s: string]: new () => any;
        } | null | undefined;
        crc?: boolean | undefined;
    } | undefined) => any;
    stringify: (root: any, options?: {
        version?: number | undefined;
        crc?: boolean | undefined;
    } | undefined) => string;
};
