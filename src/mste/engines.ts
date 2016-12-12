import {Decoder} from './decoder';
import {Buffer, Encoder, EngineEncoderConstructor, EncoderOptions} from './encoder';
import {MSBuffer} from '../types/msbuffer';
import {MSColor} from '../types/mscolor';
import {MSNaturalArray} from '../types/msnaturalarray';
import {MSDate} from '../types/msdate';
import {MSCouple} from '../types/mscouple';
import {crc32, padStart, isInteger, stringify} from '../core';
declare var console;
const DISTANT_PAST = -8640000000000000;
const DISTANT_FUTURE = 8640000000000000;

export type Engine = {
    parsers: { [t: number]: (decoder: Decoder) => any },
    parse_dictionary_into: (decoder: Decoder, into: any) => void,
    tokenize: (object: any, options?: EncoderOptions) => (string | number)[];
    classIndex: (code) => number,
    version: string,
    versionCode: number
}

function parse_nil(decoder: Decoder) {
    return null;
}
function parse_true(decoder: Decoder) {
    return true;
}
function parse_false(decoder: Decoder) {
    return false;
}
function parse_emptyString(decoder: Decoder) {
    return '';
}
function parse_emptyData(decoder: Decoder) {
    return new MSBuffer();
}
function parse_distantPast() {
  return new Date(DISTANT_PAST);
}
function parse_distantFuture() {
  return new Date(DISTANT_FUTURE);
}
function parse_ref(decoder: Decoder) {
    let idx = decoder.nextToken();
    let count = decoder.refs.length;
    if (idx < count)
        return decoder.refs[idx];
    throw new Error(`referenced object index is too big (${idx} < ${count})`);
}
function parse_numeric(decoder: Decoder) {
    let ret= decoder.nextToken();
    if (typeof ret === 'number')
        return ret;
    throw new Error("a number was expected");
}
function parse_integer(decoder: Decoder) {
    let ret= parse_numeric(decoder);
    if (!isInteger(ret))
        throw new Error("an integer was expected");
    return ret;
}
function parse_numeric_ref(decoder: Decoder) {
    return decoder.pushRef(parse_numeric(decoder));
}
function parse_integer_ref(decoder: Decoder) {
    return decoder.pushRef(parse_integer(decoder));
}
function parse_integer_mkclamp(min: number, max: number) {
    return function parse_integer(decoder: Decoder) {
        return Math.max(min, Math.min(max, parse_numeric(decoder)));
    }
}
const parse_i1 = parse_integer_mkclamp(                -128,                  127);
const parse_u1 = parse_integer_mkclamp(                   0,                  255);
const parse_i2 = parse_integer_mkclamp(              -32768,                32767);
const parse_u2 = parse_integer_mkclamp(                   0,                65535);
const parse_i4 = parse_integer_mkclamp(         -2147483648,           2147483647);
const parse_u4 = parse_integer_mkclamp(                   0,           4294967295);
const parse_i8 = parse_integer_mkclamp(-9223372036854776000,  9223372036854776000);
const parse_u8 = parse_integer_mkclamp(                   0, 18446744073709552000);
function parse_decimal_ref(decoder: Decoder) {
    return decoder.pushRef(parse_numeric(decoder));
}
function parse_localDate_ref(decoder: Decoder) { return decoder.pushRef(new MSDate(parse_numeric(decoder) - MSDate.SecsFrom19700101To20010101)); }
function parse_gmtDate_ref(decoder: Decoder) { return decoder.pushRef(new Date(parse_numeric(decoder) * 1000)); }
function parse_color_ref(decoder: Decoder) { return decoder.pushRef(new MSColor(parse_numeric(decoder))); }
function parse_string(decoder: Decoder) {
    let ret= decoder.nextToken();
    if (typeof ret === "string")
        return ret;
    throw new Error("a string was expected");
}
function parse_string_ref(decoder: Decoder) {
    return decoder.pushRef(parse_string(decoder));
}
function parse_data_ref(decoder: Decoder) {
    return decoder.pushRef(MSBuffer.bufferWithBase64String(parse_string(decoder)));
}
function parse_naturals_ref(decoder: Decoder) {
    let count= parse_numeric(decoder);
    let ret= decoder.pushRef(new MSNaturalArray());
    while (count > 0) {
        ret.push(parse_numeric(decoder));
        count--;
    }
    return ret;
}

function parse_dictionary_into(decoder: Decoder, into) {
    let count= parse_numeric(decoder);
    while (count > 0) {
        let key= decoder.keys[parse_numeric(decoder)];
        let obj= decoder.parseItem();
        into[key]= obj;
        count--;
    }
}
function parse_dictionary_ref(decoder: Decoder) {
    let ret= decoder.pushRef({});
    parse_dictionary_into(decoder, ret);
    return ret;
}
function parse_array_ref(decoder: Decoder) {
    let count= parse_numeric(decoder);
    let ret= decoder.pushRef(<any[]>[]);
    while (count > 0) {
        ret.push(decoder.parseItem());
        count--;
    }
    return ret;
}
function parse_couple_ref(decoder: Decoder) {
    let ret = decoder.pushRef(new MSCouple());
    ret.firstMember = decoder.parseItem();
    ret.secondMember = decoder.parseItem();
    return ret;
}

function keyIndex(keys: Map<string, number>, key: string) {
    let ref = keys.get(key);
    if (ref === undefined)
        keys.set(key, ref = keys.size);
    return ref;
}

function keys(keys: Map<string, number>, arr: (string | number)[]) {
    var c = keys.size;
    arr.push(c);
    var offset = arr.length;
    arr.length += c;
    keys.forEach(function(value, index) {
        arr[offset + value] = index;
    });
}

abstract class EncoderV10X implements Encoder {
    tokens: (number | string)[];
    references: Map<any, number>;
    keys: Map<string, number>;
    classes: Map<string, number>;
    engine: Engine;
    diagnostics: { type: string, msg: string }[];

    constructor(options?: EncoderOptions) {
        this.tokens = [this.engine.version, 0, "CRC00000000", 0, 0];
        this.references = new Map();
        this.keys = new Map();
        this.classes = new Map();
        this.diagnostics = [];
    }

    diagnostic(diag: { type: string, msg: string }) {
        this.diagnostics.push(diag);
    }

    encodeRoot(object) {
        this.encodeObject(object);
        this.finalize();
    }

    finalize() {
        var classesAndKeys = <(number|string)[]>[];
        keys(this.classes, classesAndKeys);
        keys(this.keys, classesAndKeys);
        if (classesAndKeys.length > 2)
            this.tokens.splice(3,2, ...classesAndKeys);
        this.tokens[1] = this.tokens.length;
    }

    encodeObject(object) {
        switch(typeof object) {
            case 'object':
                if (object === null) this.encodeNil();
                else (<Object>object).encodeToMSTE(this);
            break;
            case 'number': isInteger(object) ? this.encodeInteger(object) : this.encodeReal(object); break;
            case 'string': this.encodeString(object); break;
            case 'boolean': this.encodeBoolean(object); break;
            case 'undefined': this.diagnostic({ type: "undefined", msg: "cannot encode undefined value" }); this.encodeNil(); break;
            default: throw new Error('unsupported typeof object');
        }
    }

    encodeNil() { this.pushToken(0); }
    encodeBoolean(value: boolean) { this.pushToken(value ? 1 : 2); }
    encodeRef(ref: number) {
        this.pushToken(9);
        this.pushToken(ref);
    }
    abstract encodeInteger(value: number);
    abstract encodeReal(value: number);
    abstract encodeString(value: string);
    abstract encodeArray(value: ArrayLike<any>);
    abstract encodeNaturals(value: ArrayLike<number>);
    abstract encodeDictionary(value: {[s: string]: any}, cls: string);
    abstract encodeColor(value: MSColor);
    abstract encodeBuffer(value: Buffer);
    abstract encodeGMTDate(value: Date);
    abstract encodeLocalDate(value: MSDate);
    abstract encodeCouple<T1, T2>(value: MSCouple<T1, T2>);

    encodeKey(key: string) {
        this.pushToken(this.keyIndex(key));
    }
    keyIndex(key: string) {
        return keyIndex(this.keys, key);
    }
    classIndex(className: string) {
        return keyIndex(this.classes, className);
    }

    encodeStringV10X(value: string, emptyToken: number, token: number) {
        if (!this.shouldPushObject(value)) return;
        if (value.length === 0)
            this.pushToken(emptyToken);
        else {
            this.pushToken(token);
            this.pushToken(value);
        }
    }
    encodeArrayV10X(value: ArrayLike<any>, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        let i, len = value.length;
        this.pushToken(len);
        for (i = 0; i < len; i++)
            this.encodeObject(value[i]);
    }
    encodeNaturalsV10X(value: ArrayLike<number>, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        let i, len = value.length;
        this.pushToken(len);
        for (i = 0; i < len; i++)
            this.pushToken(value[i]);
    }
    encodeDictionaryV10X(value: {[s: string]: any}, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        let keys = Object.keys(value);
        this.pushToken(keys.length);
        for (var k of keys) {
            this.encodeKey(k);
            this.encodeObject(value[k]);
        }
    }
    encodeColorV10X(value: MSColor, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        this.pushToken(value.toNumber());
    }
    encodeBufferV10X(value: Buffer, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        if (!(value instanceof MSBuffer))
            value = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        this.pushToken(MSBuffer.encodeToBase64(value));
    }
    encodeGMTDateV10X(value: Date, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        this.pushToken(value.getTime() / 1000);
    }
    encodeLocalDateV10X(value: MSDate, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        this.pushToken(value.secondsSinceLocal1970());
    }
    encodeCoupleV10X<T1, T2>(value: MSCouple<T1, T2>, token: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(token);
        this.encodeObject(value.firstMember);
        this.encodeObject(value.secondMember);
    }
    pushToken(token: number | string) {
        this.tokens.push(token);
    }

    shouldPushObject(object: any) : boolean {
        let ref = this.references.get(object);
        if (ref !== undefined) {
            this.encodeRef(ref);
            return false;
        }
        this.references.set(object, this.references.size);
        return true;
    }
}

class EncoderV0101 extends EncoderV10X {
    encodeInteger(value: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(3);
        this.pushToken(value);
    }
    encodeReal(value: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(4);
        this.pushToken(value);
    }
    encodeString(value: string) { this.encodeStringV10X(value, 26, 5); }
    encodeArray(value: ArrayLike<any>) { this.encodeArrayV10X(value, 20); }
    encodeNaturals(value: ArrayLike<number>) { this.encodeNaturalsV10X(value, 21); }
    encodeDictionary(value: {[s: string]: any}, cls?: string) {
        this.encodeDictionaryV10X(value, cls ? 50 + this.classIndex(cls) * 2 : 8);
    }
    encodeColor(value: MSColor) { this.encodeColorV10X(value, 7); }
    encodeBuffer(value: Buffer) { this.encodeBufferV10X(value, 23); }
    encodeGMTDate(value: Date) {
        let time = value.getTime();
        if (time <= DISTANT_PAST)
            this.pushToken(24);
        else if (time >= DISTANT_FUTURE)
            this.pushToken(25);
        else
            this.encodeGMTDateV10X(value, 6);
    }
    encodeLocalDate(value: MSDate) { this.encodeGMTDate(value.toDate()); }
    encodeCouple<T1, T2>(value: MSCouple<T1, T2>) { this.encodeCoupleV10X(value, 22); }
}

function createTokenizer(encoderClass: typeof EncoderV0101) {
    return function tokenize(object: any, options?: EncoderOptions) {
        let encoder = new encoderClass(options);
        encoder.encodeRoot(object);
        if (encoder.diagnostics.length)
            throw new Error(encoder.diagnostics.map(d => d.msg).join(', '));
        return encoder.tokens;
    }
}

EncoderV0101.prototype.engine = {
    version:"MSTE0101",
    versionCode: 0x0101,
    parse_dictionary_into: parse_dictionary_into,
    parsers: {
         0: parse_nil,
         1: parse_true,
         2: parse_false,
         3: parse_integer_ref,
         4: parse_numeric_ref,
         5: parse_string_ref,
         6: parse_gmtDate_ref,
         7: parse_color_ref,
         8: parse_dictionary_ref,
         9: parse_ref,
        10: parse_i1,
        11: parse_u1,
        12: parse_i2,
        13: parse_u2,
        14: parse_i4,
        15: parse_u4,
        16: parse_i8,
        17: parse_u8,
        18: parse_numeric,
        19: parse_numeric,
        20: parse_array_ref,
        21: parse_naturals_ref,
        22: parse_couple_ref,
        23: parse_data_ref,
        24: parse_distantPast,
        25: parse_distantFuture,
        26: parse_emptyString,
        27: parse_ref
    },
    tokenize: createTokenizer(EncoderV0101),
    classIndex:function(code) { return ((code % 2 === 0 ? code - 50 : code - 51) / 2) | 0; }
};

class EncoderV0102 extends EncoderV10X {
    encodeInteger(value: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(20);
        this.pushToken(value);
    }
    encodeReal(value: number) {
        if (!this.shouldPushObject(value)) return;
        this.pushToken(20);
        this.pushToken(value);
    }
    encodeString(value: string) { this.encodeStringV10X(value, 3, 21); }
    encodeArray(value: ArrayLike<any>) { this.encodeArrayV10X(value, 31); }
    encodeNaturals(value: ArrayLike<number>) { this.encodeNaturalsV10X(value, 26); }
    encodeDictionary(value: {[s: string]: any}, cls?: string) {
        this.encodeDictionaryV10X(value, cls ? 50 + this.classIndex(cls) : 30);
    }
    encodeColor(value: MSColor) { this.encodeColorV10X(value, 24); }
    encodeBuffer(value: Buffer) {
        value.length > 0 ? this.encodeBufferV10X(value, 25) : this.pushToken(4);
    }
    encodeGMTDate(value: Date) { this.encodeGMTDateV10X(value, 23); }
    encodeLocalDate(value: MSDate) { this.encodeLocalDateV10X(value, 22); }
    encodeCouple<T1, T2>(value: MSCouple<T1, T2>) { this.encodeCoupleV10X(value, 32); }
}
EncoderV0102.prototype.engine = {
    version:"MSTE0102",
    versionCode: 0x0102,
    parse_dictionary_into: parse_dictionary_into,
    parsers:{
         0: parse_nil,
         1: parse_true,
         2: parse_false,
         3: parse_emptyString,
         4: parse_emptyData,
         9: parse_ref,
        10: parse_i1,
        11: parse_u1,
        12: parse_i2,
        13: parse_u2,
        14: parse_i4,
        15: parse_u4,
        16: parse_i8,
        17: parse_u8,
        18: parse_numeric,
        19: parse_numeric,
        20: parse_decimal_ref,
        21: parse_string_ref,
        22: parse_localDate_ref,
        23: parse_gmtDate_ref,
        24: parse_color_ref,
        25: parse_data_ref,
        26: parse_naturals_ref,
        30: parse_dictionary_ref,
        31: parse_array_ref,
        32: parse_couple_ref
    },
    tokenize: createTokenizer(EncoderV0102),
    classIndex:function(code) { return code - 50; }
};

export const ENGINES: Engine[] = [EncoderV0102.prototype.engine, EncoderV0101.prototype.engine];

export function crc32inMSTEformat(mstestring: string) : string {
    return "CRC" + padStart(crc32(mstestring).toString(16), 8, '0').toUpperCase();
}
