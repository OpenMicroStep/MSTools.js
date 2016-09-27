import {MSBuffer} from './types/msbuffer';
export function ok(value: any) {
    return value !== null && value !== undefined;
}
export function type(value: any) {
    let type = typeof value;
    return (type === 'object' && value && typeof value.constructor === 'function' && value.constructor != Object && value.constructor.name) || type;
}
export function isInteger(a: number) { return a <= 9007199254740991 && a >= -9007199254740991 && Math.floor(a) === a; }
export function div(a: number, b: number) { return a/b | 0; }
function pad(value: string, size: number, padder: string) {
    let diff = size - value.length;
    let p = "";
    while (diff > 0) {
        p += (diff > padder.length ? padder : padder.slice(0, diff));
        diff -= padder.length;
    }
    return p;
}
export function padStart(value: string, size: number, padder: string = ' ') {
    return pad(value, size, padder) + value;
}
export function padEnd(value: string, size: number, padder: string = ' ') {
    return value + pad(value, size, padder);
}

const crcTable = (function prepareCRCTable() {
    var c, n, k, ret = <number[]>[];
    for(n = 0 ; n < 256 ; n++) {
        c = n;
        for (k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)) ;
        }
        ret[n] = c;
    }
    return ret ;
})();

export function crc32(value: string) : number;
export function crc32(bytes: ArrayLike<number>) : number;
export function crc32<T>(bytes: ArrayLike<T>, toByte: (value: T) => number) : number
export function crc32<T>(bytes: ArrayLike<T>, toByte?: (value: T) => number) {
    if (typeof bytes === 'string')
        bytes = <any>MSBuffer.bufferFromString(bytes);
    toByte = toByte || function byteAtIndex(value: T) { return <number><any>value; };
    let crc = 0 ^-1;
    let i, length = bytes.length ;
    for (i = 0; i < length; i++ ) {
        crc = ((crc >> 8) & 0x00ffffff) ^ crcTable[(crc ^ toByte(bytes[i])) & 0xff];
    }
    return (crc ^ -1) >>> 0 ;;
}

const escapable = /[/\x00-\x1f\u007f-\uffff]/g;
const meta = {
    // Handled by ECMA Spec
    '\b' : '\\b',
    '\t' : '\\t',
    '\n' : '\\n',
    '\f' : '\\f',
    '\r' : '\\r',
    '\"' : '\\"',
    '\\' : '\\\\',
    //
    '\/' : '\/'
};
export function stringify(value: any): string {
    return JSON.stringify(value).replace(escapable, function toUTF8(s) {
        return meta[s] || "\\u" + padStart(s.charCodeAt(0).toString(16).toUpperCase(), 4, "0000");
    });
}