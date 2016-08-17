const base64Tokens= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64Index= [
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -1, -2, -2,
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
    -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, 62, -2, -2, -2, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -2, -2, -2, -2, -2, -2,
    -2,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -2, -2, -2, -2, -2,
    -2, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -2, -2, -2, -2, -2
];
const base64URLTokens= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const base64URLIndex= [
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -1, -2, -2,
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
    -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, 62, -2, -2,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -2, -2, -2, -2, -2, -2,
    -2,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -2, -2, -2, -2, 63,
    -2, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -2, -2, -2, -2, -2
];
const base64PaddingChar= '=';
const base64DecodeFn= [
    function(result, array, dc) { array[0] = (dc << 2) & 0xff ; },
    function(result, array, dc) { array[0] |= dc >> 4 ; array[1] = ((dc & 0x0f) << 4) & 0xff ; },
    function(result, array, dc) { array[1] |= dc >> 2 ; array[2] = ((dc & 0x03) << 6) & 0xff ; },
    function(result, array, dc) {
        array[2] |= dc ;
        result.push(array[0], array[1], array[2]) ;
        array[0] = array[1] = array[2] = 0 ;
    }
]

function isArrayLike(arr: any): arr is ArrayLike<number[]> {
    return arr && typeof arr.length === "number";
}

export function unshift(arr: Array<number>, offset:number, args: ArrayLike<number>, allowArray: boolean, map: (value: number) => number)
{
    var values = [];
    push(values, offset, args, allowArray, map);
    Array.prototype.unshift.apply(arr, values);
}

export function push(arr: Array<number>, offset:number, args: ArrayLike<number | number[]>, allowArray: boolean, map: (value: number) => number)
{
    var i = offset, count = args.length;
    for (; i < count ; i++) {
        var a = args[i] ;
        if (allowArray && isArrayLike(a)) {
            push(arr, 0, a, false, map);
        }
        else {
            var idx = arr.length;
            arr.length++;
            arr[idx] = map(<number>a);
        }
    }
}

function safeBufferValue(value: number) {
    return Math.max(0, value | 0) & 0xff;
}

export class MSBuffer extends Array<number>
{
    constructor(data: string);
    constructor(...bytes: (number | number)[]);
    constructor() {
        super();
        var count = arguments.length ;

        if (count === 1 && typeof arguments[0] === 'string') {
            var str: string = arguments[0];
            for (var i = 0, len = str.length; i < len; i++)
                this.push(str.charCodeAt(i) & 0xff) ;
        }
        else {
            push(this, 0, arguments, true, safeBufferValue);
        }
    }

    static bufferFromString(s: string, encoding = 'utf8') {
        var result = new MSBuffer();
        var i: number, len = s.length;
        for (i = 0; i< len; i++) {
            var c = s.charCodeAt(i) ;
            if (c < 128) {
                result.push(c) ;
            }
            else if (c < 2048) {
                result.push((c >> 6) | 192) ;
                result.push((c & 63) | 128) ;
            }
            else {
                result.push((c >> 12) | 224) ;
                result.push(((c >> 6) & 63) | 128) ;
                result.push((c & 63) | 128) ;
            }
        }
        return result;
    }

    static bufferWithBase64String(s: string, index?: number[], paddingChar?: string) {
        var len = s.length ;
        var result = new MSBuffer() ;
        if (len > 0) {
            var j, i = 0, c, dc, array = <number[]>[] ;

            array[0] = array[1] = array[2] = 0 ;

            index = index || base64Index ;
            var paddingCharCode = (paddingChar || base64PaddingChar).charCodeAt(0) ;

            for (j = 0 ; j < len ; j++) {
                c = s.charCodeAt(j) ;
                if (c === paddingCharCode) { break; }
                else if (c > 127) { throw new Error("bad character"); ; } // bad character

                dc = index[c] ;
                if (dc === -1) { continue ; } // we skip spaces and separators
                else if (dc === -2) { throw new Error("bad character"); ; } // bad character

                base64DecodeFn[i % 4](result, array, dc) ;
                i++ ;
            }
            if (c === paddingCharCode) {
                i = i % 4;
                if (i === 1) { throw new Error("bad character"); ; }
                i-- ;
                for (j = 0 ; j < i ; j++) { result.push(array[j]) ; }
            }
        }
        return result;
    }

    unshift(...items: number[]): number;
    unshift(): number {
        unshift(this, 0, arguments, false, safeBufferValue);
        return this.length;
    }

    push(...values: number[]): number;
    push(): number {
        push(this, 0, arguments, false, safeBufferValue);
        return this.length;
    }

    concat(...items: (number | number[])[]): MSBuffer;
    concat(): MSBuffer {
        var ret = new MSBuffer();
        Array.prototype.push.apply(ret, this);
        push(ret, 0, arguments, true, safeBufferValue);
        return ret;
    }
    slice(start?: number, end?: number): MSBuffer {
        return new MSBuffer(Array.prototype.slice.apply(this, arguments));
    }
    splice(start: number): MSBuffer;
    splice(start: number, deleteCount: number, ...items: number[]): MSBuffer;
    splice(start: number, deleteCount?: number, ...items: number[]): MSBuffer {
        return new MSBuffer(Array.prototype.splice.apply(this, arguments));
    }
    toJSON() {
        return Array.from(this);
    }
    isEqualTo(other: any) {
        return other instanceof MSBuffer && this.isEqualToBuffer(other);
    }
    isEqualToBuffer(other: MSBuffer) {
        if (this === other)
            return true;
        if (!other || other.length !== this.length)
            return false;

        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] !== other[i])
                return false;
        }
        return true;
    }

    toString() {
        var i, count = this.length ;
        if (count) {
            var array = <string[]>[] ;
            // console.log("count = "+count) ;
            for (i = 0 ; i < count ; i++) {
                array.push(String.fromCharCode(this[i])) ;
            }
            return array.join('') ;
        }
        return "";
    }

    toBase64String(tokens?: string, paddingChar?: string) {
        return MSBuffer.encodeToBase64(this, tokens, paddingChar);
    }
    static encodeToBase64(bytes: ArrayLike<number>, tokens?: string, paddingChar?: string) {
        var i: number, end: number, ret= "", token: number;

        tokens = tokens || base64Tokens ;
        paddingChar = paddingChar || base64PaddingChar ;

        if (bytes.length === 0) { return '' ; }

        end = bytes.length - bytes.length % 3 ;

        for (i = 0 ; i < end ; i += 3) {

            token = (bytes[i] << 16) | (bytes[i+1] << 8) | bytes[i+2] ;

            ret += tokens.charAt(token >> 18);
            ret += tokens.charAt((token >> 12) & 0x3F);
            ret += tokens.charAt((token >> 6) & 0x3f);
            ret += tokens.charAt(token & 0x3f);
        }

        switch (bytes.length - end) {
            case 1:
                token = bytes[i] << 16 ;
                ret += tokens.charAt(token >> 18) + tokens.charAt((token >> 12) & 0x3F) + paddingChar + paddingChar;
                break;
            case 2:
                token = (bytes[i] << 16) | (bytes[i+1] << 8) ;
                ret += tokens.charAt(token >> 18) + tokens.charAt((token >> 12) & 0x3F) + tokens.charAt((token >> 6) & 0x3F) + paddingChar;
                break ;
        }
        return ret;
    }
}
