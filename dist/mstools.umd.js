(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MSTools = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var msbuffer_1 = require('./types/msbuffer');
function ok(value) {
    return value !== null && value !== undefined;
}
exports.ok = ok;
function type(value) {
    var type = typeof value;
    return (type === 'object' && value && typeof value.constructor === 'function' && value.constructor != Object && value.constructor.name) || type;
}
exports.type = type;
function isInteger(a) { return a <= 9007199254740991 && a >= -9007199254740991 && Math.floor(a) === a; }
exports.isInteger = isInteger;
function div(a, b) { return a / b | 0; }
exports.div = div;
function pad(value, size, padder) {
    var diff = size - value.length;
    var p = "";
    while (diff > 0) {
        p += (diff > padder.length ? padder : padder.slice(0, diff));
        diff -= padder.length;
    }
    return p;
}
function padStart(value, size, padder) {
    if (padder === void 0) { padder = ' '; }
    return pad(value, size, padder) + value;
}
exports.padStart = padStart;
function padEnd(value, size, padder) {
    if (padder === void 0) { padder = ' '; }
    return value + pad(value, size, padder);
}
exports.padEnd = padEnd;
var crcTable = (function prepareCRCTable() {
    var c, n, k, ret = [];
    for (n = 0; n < 256; n++) {
        c = n;
        for (k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        ret[n] = c;
    }
    return ret;
})();
function crc32(bytes, toByte) {
    if (typeof bytes === 'string')
        bytes = msbuffer_1.MSBuffer.bufferFromString(bytes);
    toByte = toByte || function byteAtIndex(value) { return value; };
    var crc = 0 ^ -1;
    var i, length = bytes.length;
    for (i = 0; i < length; i++) {
        crc = ((crc >> 8) & 0x00ffffff) ^ crcTable[(crc ^ toByte(bytes[i])) & 0xff];
    }
    return (crc ^ -1) >>> 0;
    ;
}
exports.crc32 = crc32;
var escapable = /[/\x00-\x1f\u007f-\uffff]/g;
var meta = {
    // Handled by ECMA Spec
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\"': '\\"',
    '\\': '\\\\',
    //
    '\/': '\\/'
};
function stringify(value) {
    return JSON.stringify(value).replace(escapable, function toUTF8(s) {
        return meta[s] || "\\u" + padStart(s.charCodeAt(0).toString(16).toUpperCase(), 4, "0000");
    });
}
exports.stringify = stringify;

},{"./types/msbuffer":6}],2:[function(require,module,exports){
"use strict";
var decoder_1 = require('./mste/decoder');
var encoder_1 = require('./mste/encoder');
var mscolor_1 = require('./types/mscolor');
exports.MSColor = mscolor_1.MSColor;
var msbuffer_1 = require('./types/msbuffer');
exports.MSBuffer = msbuffer_1.MSBuffer;
var msdate_1 = require('./types/msdate');
exports.MSDate = msdate_1.MSDate;
var msnaturalarray_1 = require('./types/msnaturalarray');
exports.MSNaturalArray = msnaturalarray_1.MSNaturalArray;
var mscouple_1 = require('./types/mscouple');
exports.MSCouple = mscouple_1.MSCouple;
var core_1 = require('./core');
exports.crc32 = core_1.crc32;
exports.div = core_1.div;
exports.isInteger = core_1.isInteger;
exports.ok = core_1.ok;
exports.type = core_1.type;
exports.padStart = core_1.padStart;
exports.padEnd = core_1.padEnd;
exports.stringify = core_1.stringify;
exports.MSTE = {
    parse: decoder_1.parse,
    stringify: encoder_1.stringify
};

},{"./core":1,"./mste/decoder":3,"./mste/encoder":4,"./types/msbuffer":6,"./types/mscolor":7,"./types/mscouple":8,"./types/msdate":9,"./types/msnaturalarray":10}],3:[function(require,module,exports){
"use strict";
var engines_1 = require('./engines');
var Decoder = (function () {
    function Decoder(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.classes, classes = _c === void 0 ? null : _c, _d = _b.crc, crc = _d === void 0 ? true : _d;
        this.correspondances = classes || {};
        this.checkCRC = !!crc;
    }
    Decoder.prototype.parse = function (parse_src) {
        this.keys = [];
        this.classes = [];
        this.objects = [];
        this.refs = [];
        this.index = 0;
        var source = (typeof parse_src === 'string' ? JSON.parse(parse_src) : parse_src);
        if (!source || typeof source.length !== "number" || source.length < 4)
            throw new Error("two few tokens");
        this.tokens = source;
        var n = source.length;
        var version = this.nextToken();
        if (typeof version !== 'string' || !/^MSTE[0-9]{4}$/.test(version))
            throw new Error("the first token must be the version string");
        var engine = engines_1.ENGINES.find(function (e) { return e.version === version; });
        if (!engine)
            throw new Error("no valid engine for version: " + version);
        this.engine = engine;
        var count = this.nextToken();
        if (typeof count !== 'number')
            throw new Error("the second token must be the number of token");
        if (count !== n)
            throw new Error("bad control count");
        var crc = this.nextToken();
        if (typeof crc !== 'string' || !/^CRC[0-9A-F]{8}$/.test(crc))
            throw new Error("the third token must be the crc string");
        if (this.checkCRC && typeof parse_src === "string" && crc !== 'CRC00000000') {
            if (engines_1.crc32inMSTEformat(parse_src.replace(crc, 'CRC00000000')) !== crc)
                throw new Error("crc verification failed");
        }
        var classCount = this.nextToken();
        if (typeof classCount !== 'number')
            throw new Error("the 4th token must be the number of classes");
        classCount += this.index;
        if (1 + classCount > n)
            throw new Error("not enough tokens to store classes and the root object");
        while (this.index < classCount) {
            var className = this.nextToken();
            if (typeof className !== 'string')
                throw new Error("class name must be a string");
            this.classes.push(className);
        }
        var keyCount = this.nextToken();
        if (typeof keyCount !== 'number')
            throw new Error("the key count token must be a number");
        keyCount += this.index;
        if (1 + keyCount > n)
            throw new Error("not enough tokens to store keys and the root object");
        while (this.index < keyCount) {
            var keyName = this.nextToken();
            if (typeof keyName !== 'string')
                throw new Error("key name must be a string");
            this.keys.push(keyName);
        }
        return this.parseItem();
    };
    Decoder.prototype.nextToken = function () {
        if (this.index < this.tokens.length)
            return this.tokens[this.index++];
        throw new Error("not enough tokens");
    };
    Decoder.prototype.pushRef = function (v) {
        this.refs.push(v);
        return v;
    };
    Decoder.prototype.parseItem = function () {
        var token = this.nextToken();
        if (typeof token !== 'number')
            throw new Error("code token must be a number");
        //echo "parseItem " . $token . "(" . $this->engine->typeForToken($token) .")" .PHP_EOL;
        if (token >= 50) {
            var clsidx = this.engine.classIndex(token);
            if (clsidx >= this.classes.length)
                throw new Error("");
            var clsname = this.classes[clsidx];
            var cls = this.correspondances[clsname];
            var obj = this.pushRef(cls ? new cls() : {});
            this.engine.parse_dictionary_into(this, obj);
            return obj;
        }
        var parser = this.engine.parsers[token];
        if (!parser) {
            throw new Error("unknown code token '" + token + "'");
        }
        return parser(this);
    };
    return Decoder;
}());
exports.Decoder = Decoder;
function parse(source, options) {
    var decoder = new Decoder(options);
    try {
        return decoder.parse(source);
    }
    catch (err) {
        var msg = err.message;
        err.message = 'unable to parse MSTE';
        if (decoder.index > 0) {
            err.message += ', at token ' + (decoder.index - 1) + ': ' + msg;
            err.message += "\n" + JSON.stringify(decoder.tokens.slice(Math.max(0, decoder.index - 5), Math.min(decoder.tokens.length, decoder.index + 5)));
        }
        throw err;
    }
}
exports.parse = parse;

},{"./engines":5}],4:[function(require,module,exports){
"use strict";
var engines_1 = require('./engines');
var core_1 = require('../core');
var mscolor_1 = require('../types/mscolor');
var msbuffer_1 = require('../types/msbuffer');
var mscouple_1 = require('../types/mscouple');
var msdate_1 = require('../types/msdate');
var msnaturalarray_1 = require('../types/msnaturalarray');
function extendNativeObject(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: value
    });
}
extendNativeObject(Object.prototype, 'toMSTE', function toMSTE(options) {
    return stringify(this, options);
});
extendNativeObject(Object.prototype, "encodeToMSTE", function encodeObjectToMSTE(encoder) {
    encoder.encodeDictionary(this);
});
extendNativeObject(Array.prototype, "encodeToMSTE", function encodeArrayToMSTE(encoder) {
    encoder.encodeArray(this);
});
extendNativeObject(Date.prototype, "encodeToMSTE", function encodeGMTDateToMSTE(encoder) {
    encoder.encodeGMTDate(this);
});
extendNativeObject(msdate_1.MSDate.prototype, "encodeToMSTE", function encodeLocalDateToMSTE(encoder) {
    encoder.encodeLocalDate(this);
});
extendNativeObject(msbuffer_1.MSBuffer.prototype, "encodeToMSTE", function encodeBufferToMSTE(encoder) {
    encoder.encodeBuffer(this);
});
extendNativeObject(mscolor_1.MSColor.prototype, "encodeToMSTE", function encodeColorToMSTE(encoder) {
    encoder.encodeColor(this);
});
extendNativeObject(msnaturalarray_1.MSNaturalArray.prototype, "encodeToMSTE", function encodeNaturalsToMSTE(encoder) {
    encoder.encodeNaturals(this);
});
extendNativeObject(mscouple_1.MSCouple.prototype, "encodeToMSTE", function encodeCoupleToMSTE(encoder) {
    encoder.encodeCouple(this);
});
function encodeTypedArrayToMSTE(encoder) {
    encoder.encodeBuffer(this);
}
[Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array].map(function (typedarray) {
    extendNativeObject(typedarray.prototype, "encodeToMSTE", encodeTypedArrayToMSTE);
});
function tokenize(root, options) {
    var version = options && options.version || 0x0102;
    var engine = engines_1.ENGINES.find(function (e) { return e.versionCode === version; });
    if (!engine)
        throw new Error("no valid engine with version: " + version);
    return engine.tokenize(root, options);
}
exports.tokenize = tokenize;
function stringify(root, options) {
    var tokens = tokenize(root, options);
    tokens[2] = engines_1.crc32inMSTEformat(core_1.stringify(tokens));
    return core_1.stringify(tokens);
}
exports.stringify = stringify;

},{"../core":1,"../types/msbuffer":6,"../types/mscolor":7,"../types/mscouple":8,"../types/msdate":9,"../types/msnaturalarray":10,"./engines":5}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var msbuffer_1 = require('../types/msbuffer');
var mscolor_1 = require('../types/mscolor');
var msnaturalarray_1 = require('../types/msnaturalarray');
var msdate_1 = require('../types/msdate');
var mscouple_1 = require('../types/mscouple');
var core_1 = require('../core');
var DISTANT_PAST = -8640000000000000;
var DISTANT_FUTURE = 8640000000000000;
function parse_nil(decoder) {
    return null;
}
function parse_true(decoder) {
    return true;
}
function parse_false(decoder) {
    return false;
}
function parse_emptyString(decoder) {
    return '';
}
function parse_emptyData(decoder) {
    return new msbuffer_1.MSBuffer();
}
function parse_distantPast() {
    return new Date(DISTANT_PAST);
}
function parse_distantFuture() {
    return new Date(DISTANT_FUTURE);
}
function parse_ref(decoder) {
    var idx = decoder.nextToken();
    var count = decoder.refs.length;
    if (idx < count)
        return decoder.refs[idx];
    throw new Error("referenced object index is too big (" + idx + " < " + count + ")");
}
function parse_numeric(decoder) {
    var ret = decoder.nextToken();
    if (typeof ret === 'number')
        return ret;
    throw new Error("a number was expected");
}
function parse_integer(decoder) {
    var ret = parse_numeric(decoder);
    if (!core_1.isInteger(ret))
        throw new Error("an integer was expected");
    return ret;
}
function parse_numeric_ref(decoder) {
    return decoder.pushRef(parse_numeric(decoder));
}
function parse_integer_ref(decoder) {
    return decoder.pushRef(parse_integer(decoder));
}
function parse_integer_mkclamp(min, max) {
    return function parse_integer(decoder) {
        return Math.max(min, Math.min(max, parse_numeric(decoder)));
    };
}
var parse_i1 = parse_integer_mkclamp(-128, 127);
var parse_u1 = parse_integer_mkclamp(0, 255);
var parse_i2 = parse_integer_mkclamp(-32768, 32767);
var parse_u2 = parse_integer_mkclamp(0, 65535);
var parse_i4 = parse_integer_mkclamp(-2147483648, 2147483647);
var parse_u4 = parse_integer_mkclamp(0, 4294967295);
var parse_i8 = parse_integer_mkclamp(-9223372036854776000, 9223372036854776000);
var parse_u8 = parse_integer_mkclamp(0, 18446744073709552000);
function parse_decimal_ref(decoder) {
    return decoder.pushRef(parse_numeric(decoder));
}
function parse_localDate_ref(decoder) { return decoder.pushRef(new msdate_1.MSDate(parse_numeric(decoder) - msdate_1.MSDate.SecsFrom19700101To20010101)); }
function parse_gmtDate_ref(decoder) { return decoder.pushRef(new Date(parse_numeric(decoder) * 1000)); }
function parse_color_ref(decoder) { return decoder.pushRef(new mscolor_1.MSColor(parse_numeric(decoder))); }
function parse_string(decoder) {
    var ret = decoder.nextToken();
    if (typeof ret === "string")
        return ret;
    throw new Error("a string was expected");
}
function parse_string_ref(decoder) {
    return decoder.pushRef(parse_string(decoder));
}
function parse_data_ref(decoder) {
    return decoder.pushRef(msbuffer_1.MSBuffer.bufferWithBase64String(parse_string(decoder)));
}
function parse_naturals_ref(decoder) {
    var count = parse_numeric(decoder);
    var ret = decoder.pushRef(new msnaturalarray_1.MSNaturalArray());
    while (count > 0) {
        ret.push(parse_numeric(decoder));
        count--;
    }
    return ret;
}
function parse_dictionary_into(decoder, into) {
    var count = parse_numeric(decoder);
    while (count > 0) {
        var key = decoder.keys[parse_numeric(decoder)];
        var obj = decoder.parseItem();
        into[key] = obj;
        count--;
    }
}
function parse_dictionary_ref(decoder) {
    var ret = decoder.pushRef({});
    parse_dictionary_into(decoder, ret);
    return ret;
}
function parse_array_ref(decoder) {
    var count = parse_numeric(decoder);
    var ret = decoder.pushRef([]);
    while (count > 0) {
        ret.push(decoder.parseItem());
        count--;
    }
    return ret;
}
function parse_couple_ref(decoder) {
    var ret = decoder.pushRef(new mscouple_1.MSCouple());
    ret.firstMember = decoder.parseItem();
    ret.secondMember = decoder.parseItem();
    return ret;
}
function keyIndex(keys, key) {
    var ref = keys.get(key);
    if (ref === undefined)
        keys.set(key, ref = keys.size);
    return ref;
}
function keys(keys, arr) {
    var c = keys.size;
    arr.push(c);
    var offset = arr.length;
    arr.length += c;
    keys.forEach(function (value, index) {
        arr[offset + value] = index;
    });
}
var EncoderV10X = (function () {
    function EncoderV10X(options) {
        this.tokens = [this.engine.version, 0, "CRC00000000", 0, 0];
        this.references = new Map();
        this.keys = new Map();
        this.classes = new Map();
    }
    EncoderV10X.prototype.encodeRoot = function (object) {
        this.encodeObject(object);
        this.finalize();
    };
    EncoderV10X.prototype.finalize = function () {
        var classesAndKeys = [];
        keys(this.classes, classesAndKeys);
        keys(this.keys, classesAndKeys);
        if (classesAndKeys.length > 2)
            (_a = this.tokens).splice.apply(_a, [3, 2].concat(classesAndKeys));
        this.tokens[1] = this.tokens.length;
        var _a;
    };
    EncoderV10X.prototype.encodeObject = function (object) {
        switch (typeof object) {
            case 'object':
                if (object === null)
                    this.encodeNil();
                else
                    object.encodeToMSTE(this);
                break;
            case 'number':
                core_1.isInteger(object) ? this.encodeInteger(object) : this.encodeReal(object);
                break;
            case 'string':
                this.encodeString(object);
                break;
            case 'boolean':
                this.encodeBoolean(object);
                break;
            default: throw new Error('unsupported typeof object');
        }
    };
    EncoderV10X.prototype.encodeNil = function () { this.pushToken(0); };
    EncoderV10X.prototype.encodeBoolean = function (value) { this.pushToken(value ? 1 : 2); };
    EncoderV10X.prototype.encodeRef = function (ref) {
        this.pushToken(9);
        this.pushToken(ref);
    };
    EncoderV10X.prototype.encodeKey = function (key) {
        this.pushToken(this.keyIndex(key));
    };
    EncoderV10X.prototype.keyIndex = function (key) {
        return keyIndex(this.keys, key);
    };
    EncoderV10X.prototype.classIndex = function (className) {
        return keyIndex(this.classes, className);
    };
    EncoderV10X.prototype.encodeStringV10X = function (value, emptyToken, token) {
        if (!this.shouldPushObject(value))
            return;
        if (value.length === 0)
            this.pushToken(emptyToken);
        else {
            this.pushToken(token);
            this.pushToken(value);
        }
    };
    EncoderV10X.prototype.encodeArrayV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        var i, len = value.length;
        this.pushToken(len);
        for (i = 0; i < len; i++)
            this.encodeObject(value[i]);
    };
    EncoderV10X.prototype.encodeNaturalsV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        var i, len = value.length;
        this.pushToken(len);
        for (i = 0; i < len; i++)
            this.pushToken(value[i]);
    };
    EncoderV10X.prototype.encodeDictionaryV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        var keys = Object.keys(value);
        this.pushToken(keys.length);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var k = keys_1[_i];
            this.encodeKey(k);
            this.encodeObject(value[k]);
        }
    };
    EncoderV10X.prototype.encodeColorV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        this.pushToken(value.toNumber());
    };
    EncoderV10X.prototype.encodeBufferV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        if (!(value instanceof msbuffer_1.MSBuffer))
            value = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        this.pushToken(msbuffer_1.MSBuffer.encodeToBase64(value));
    };
    EncoderV10X.prototype.encodeGMTDateV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        this.pushToken(value.getTime() / 1000);
    };
    EncoderV10X.prototype.encodeLocalDateV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        this.pushToken(value.secondsSinceLocal1970());
    };
    EncoderV10X.prototype.encodeCoupleV10X = function (value, token) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(token);
        this.encodeObject(value.firstMember);
        this.encodeObject(value.secondMember);
    };
    EncoderV10X.prototype.pushToken = function (token) {
        this.tokens.push(token);
    };
    EncoderV10X.prototype.shouldPushObject = function (object) {
        var ref = this.references.get(object);
        if (ref !== undefined) {
            this.encodeRef(ref);
            return false;
        }
        this.references.set(object, this.references.size);
        return true;
    };
    return EncoderV10X;
}());
var EncoderV0101 = (function (_super) {
    __extends(EncoderV0101, _super);
    function EncoderV0101() {
        _super.apply(this, arguments);
    }
    EncoderV0101.prototype.encodeInteger = function (value) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(3);
        this.pushToken(value);
    };
    EncoderV0101.prototype.encodeReal = function (value) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(4);
        this.pushToken(value);
    };
    EncoderV0101.prototype.encodeString = function (value) { this.encodeStringV10X(value, 26, 5); };
    EncoderV0101.prototype.encodeArray = function (value) { this.encodeArrayV10X(value, 20); };
    EncoderV0101.prototype.encodeNaturals = function (value) { this.encodeNaturalsV10X(value, 21); };
    EncoderV0101.prototype.encodeDictionary = function (value, cls) {
        this.encodeDictionaryV10X(value, cls ? 50 + this.classIndex(cls) * 2 : 8);
    };
    EncoderV0101.prototype.encodeColor = function (value) { this.encodeColorV10X(value, 7); };
    EncoderV0101.prototype.encodeBuffer = function (value) { this.encodeBufferV10X(value, 23); };
    EncoderV0101.prototype.encodeGMTDate = function (value) {
        var time = value.getTime();
        if (time <= DISTANT_PAST)
            this.pushToken(24);
        else if (time >= DISTANT_FUTURE)
            this.pushToken(25);
        else
            this.encodeGMTDateV10X(value, 6);
    };
    EncoderV0101.prototype.encodeLocalDate = function (value) { this.encodeGMTDate(value.toDate()); };
    EncoderV0101.prototype.encodeCouple = function (value) { this.encodeCoupleV10X(value, 22); };
    return EncoderV0101;
}(EncoderV10X));
EncoderV0101.prototype.engine = {
    version: "MSTE0101",
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
    tokenize: function tokenizeV0101(object, options) {
        var encoder = new EncoderV0101(options);
        encoder.encodeRoot(object);
        return encoder.tokens;
    },
    classIndex: function (code) { return ((code % 2 === 0 ? code - 50 : code - 51) / 2) | 0; }
};
var EncoderV0102 = (function (_super) {
    __extends(EncoderV0102, _super);
    function EncoderV0102() {
        _super.apply(this, arguments);
    }
    EncoderV0102.prototype.encodeInteger = function (value) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(20);
        this.pushToken(value);
    };
    EncoderV0102.prototype.encodeReal = function (value) {
        if (!this.shouldPushObject(value))
            return;
        this.pushToken(20);
        this.pushToken(value);
    };
    EncoderV0102.prototype.encodeString = function (value) { this.encodeStringV10X(value, 3, 21); };
    EncoderV0102.prototype.encodeArray = function (value) { this.encodeArrayV10X(value, 31); };
    EncoderV0102.prototype.encodeNaturals = function (value) { this.encodeNaturalsV10X(value, 26); };
    EncoderV0102.prototype.encodeDictionary = function (value, cls) {
        this.encodeDictionaryV10X(value, cls ? 50 + this.classIndex(cls) : 30);
    };
    EncoderV0102.prototype.encodeColor = function (value) { this.encodeColorV10X(value, 24); };
    EncoderV0102.prototype.encodeBuffer = function (value) {
        value.length > 0 ? this.encodeBufferV10X(value, 25) : this.pushToken(4);
    };
    EncoderV0102.prototype.encodeGMTDate = function (value) { this.encodeGMTDateV10X(value, 23); };
    EncoderV0102.prototype.encodeLocalDate = function (value) { this.encodeLocalDateV10X(value, 22); };
    EncoderV0102.prototype.encodeCouple = function (value) { this.encodeCoupleV10X(value, 32); };
    return EncoderV0102;
}(EncoderV10X));
EncoderV0102.prototype.engine = {
    version: "MSTE0102",
    versionCode: 0x0102,
    parse_dictionary_into: parse_dictionary_into,
    parsers: {
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
    tokenize: function tokenizeV0102(object, options) {
        var encoder = new EncoderV0102(options);
        encoder.encodeRoot(object);
        return encoder.tokens;
    },
    classIndex: function (code) { return code - 50; }
};
exports.ENGINES = [EncoderV0102.prototype.engine, EncoderV0101.prototype.engine];
function crc32inMSTEformat(mstestring) {
    return "CRC" + core_1.padStart(core_1.crc32(mstestring).toString(16), 8, '0').toUpperCase();
}
exports.crc32inMSTEformat = crc32inMSTEformat;

},{"../core":1,"../types/msbuffer":6,"../types/mscolor":7,"../types/mscouple":8,"../types/msdate":9,"../types/msnaturalarray":10}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base64Tokens = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64Index = [
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -1, -2, -2,
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
    -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, 62, -2, -2, -2, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -2, -2, -2, -2, -2, -2,
    -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -2, -2, -2, -2, -2,
    -2, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -2, -2, -2, -2, -2
];
var base64URLTokens = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var base64URLIndex = [
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -1, -2, -2,
    -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
    -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, 62, -2, -2,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -2, -2, -2, -2, -2, -2,
    -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -2, -2, -2, -2, 63,
    -2, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -2, -2, -2, -2, -2
];
var base64PaddingChar = '=';
var base64DecodeFn = [
    function (result, array, dc) { array[0] = (dc << 2) & 0xff; },
    function (result, array, dc) { array[0] |= dc >> 4; array[1] = ((dc & 0x0f) << 4) & 0xff; },
    function (result, array, dc) { array[1] |= dc >> 2; array[2] = ((dc & 0x03) << 6) & 0xff; },
    function (result, array, dc) {
        array[2] |= dc;
        result.push(array[0], array[1], array[2]);
        array[0] = array[1] = array[2] = 0;
    }
];
function isArrayLike(arr) {
    return arr && typeof arr.length === "number";
}
function unshift(arr, offset, args, allowArray, map) {
    var values = [];
    push(values, offset, args, allowArray, map);
    Array.prototype.unshift.apply(arr, values);
}
exports.unshift = unshift;
function push(arr, offset, args, allowArray, map) {
    var i = offset, count = args.length;
    for (; i < count; i++) {
        var a = args[i];
        if (allowArray && isArrayLike(a)) {
            push(arr, 0, a, false, map);
        }
        else {
            var idx = arr.length;
            arr.length++;
            arr[idx] = map(a);
        }
    }
}
exports.push = push;
function safeBufferValue(value) {
    return Math.max(0, value | 0) & 0xff;
}
var MSBuffer = (function (_super) {
    __extends(MSBuffer, _super);
    function MSBuffer() {
        _super.call(this);
        var count = arguments.length;
        if (count === 1 && typeof arguments[0] === 'string') {
            var str = arguments[0];
            for (var i = 0, len = str.length; i < len; i++)
                this.push(str.charCodeAt(i) & 0xff);
        }
        else {
            push(this, 0, arguments, true, safeBufferValue);
        }
    }
    MSBuffer.bufferFromString = function (s, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var result = new MSBuffer();
        var i, len = s.length;
        for (i = 0; i < len; i++) {
            var c = s.charCodeAt(i);
            if (c < 128) {
                result.push(c);
            }
            else if (c < 2048) {
                result.push((c >> 6) | 192);
                result.push((c & 63) | 128);
            }
            else {
                result.push((c >> 12) | 224);
                result.push(((c >> 6) & 63) | 128);
                result.push((c & 63) | 128);
            }
        }
        return result;
    };
    MSBuffer.bufferWithBase64String = function (s, index, paddingChar) {
        var len = s.length;
        var result = new MSBuffer();
        if (len > 0) {
            var j, i = 0, c, dc, array = [];
            array[0] = array[1] = array[2] = 0;
            index = index || base64Index;
            var paddingCharCode = (paddingChar || base64PaddingChar).charCodeAt(0);
            for (j = 0; j < len; j++) {
                c = s.charCodeAt(j);
                if (c === paddingCharCode) {
                    break;
                }
                else if (c > 127) {
                    throw new Error("bad character");
                    ;
                } // bad character
                dc = index[c];
                if (dc === -1) {
                    continue;
                } // we skip spaces and separators
                else if (dc === -2) {
                    throw new Error("bad character");
                    ;
                } // bad character
                base64DecodeFn[i % 4](result, array, dc);
                i++;
            }
            if (c === paddingCharCode) {
                i = i % 4;
                if (i === 1) {
                    throw new Error("bad character");
                    ;
                }
                i--;
                for (j = 0; j < i; j++) {
                    result.push(array[j]);
                }
            }
        }
        return result;
    };
    MSBuffer.prototype.unshift = function () {
        unshift(this, 0, arguments, false, safeBufferValue);
        return this.length;
    };
    MSBuffer.prototype.push = function () {
        push(this, 0, arguments, false, safeBufferValue);
        return this.length;
    };
    MSBuffer.prototype.concat = function () {
        var ret = new MSBuffer();
        Array.prototype.push.apply(ret, this);
        push(ret, 0, arguments, true, safeBufferValue);
        return ret;
    };
    MSBuffer.prototype.slice = function (start, end) {
        return new MSBuffer(Array.prototype.slice.apply(this, arguments));
    };
    MSBuffer.prototype.splice = function (start, deleteCount) {
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        return new MSBuffer(Array.prototype.splice.apply(this, arguments));
    };
    MSBuffer.prototype.toJSON = function () {
        return Array.from(this);
    };
    MSBuffer.prototype.isEqualTo = function (other) {
        return other instanceof MSBuffer && this.isEqualToBuffer(other);
    };
    MSBuffer.prototype.isEqualToBuffer = function (other) {
        if (this === other)
            return true;
        if (!other || other.length !== this.length)
            return false;
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] !== other[i])
                return false;
        }
        return true;
    };
    MSBuffer.prototype.toString = function () {
        var i, count = this.length;
        if (count) {
            var array = [];
            // console.log("count = "+count) ;
            for (i = 0; i < count; i++) {
                array.push(String.fromCharCode(this[i]));
            }
            return array.join('');
        }
        return "";
    };
    MSBuffer.prototype.toBase64String = function (tokens, paddingChar) {
        return MSBuffer.encodeToBase64(this, tokens, paddingChar);
    };
    MSBuffer.encodeToBase64 = function (bytes, tokens, paddingChar) {
        var i, end, ret = "", token;
        tokens = tokens || base64Tokens;
        paddingChar = paddingChar || base64PaddingChar;
        if (bytes.length === 0) {
            return '';
        }
        end = bytes.length - bytes.length % 3;
        for (i = 0; i < end; i += 3) {
            token = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            ret += tokens.charAt(token >> 18);
            ret += tokens.charAt((token >> 12) & 0x3F);
            ret += tokens.charAt((token >> 6) & 0x3f);
            ret += tokens.charAt(token & 0x3f);
        }
        switch (bytes.length - end) {
            case 1:
                token = bytes[i] << 16;
                ret += tokens.charAt(token >> 18) + tokens.charAt((token >> 12) & 0x3F) + paddingChar + paddingChar;
                break;
            case 2:
                token = (bytes[i] << 16) | (bytes[i + 1] << 8);
                ret += tokens.charAt(token >> 18) + tokens.charAt((token >> 12) & 0x3F) + tokens.charAt((token >> 6) & 0x3F) + paddingChar;
                break;
        }
        return ret;
    };
    return MSBuffer;
}(Array));
exports.MSBuffer = MSBuffer;

},{}],7:[function(require,module,exports){
"use strict";
var namedColors = {
    beige: '#f5f5dc',
    black: '#000000',
    blue: '#0000ff',
    brown: '#a52a2a',
    cyan: '#00ffff',
    fuchsia: '#ff00ff',
    gold: '#ffd700',
    gray: '#808080',
    green: '#008000',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    magenta: '#ff00ff',
    maroon: '#800000',
    olive: '#808000',
    orange: '#ffa500',
    pink: '#ffc0cb',
    purple: '#800080',
    red: '#ff0000',
    salmon: '#fa8072',
    silver: '#c0c0c0',
    snow: '#fffafa',
    teal: '#008080',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    yellow: '#ffff00'
};
function parse0to255(v) {
    if (v < 0 || v > 255 || Math.floor(v) !== v)
        throw new Error("invalid color value");
    return v;
}
function toHex(v) {
    var r = v.toString(16);
    return r.length < 2 ? "00".slice(0, 2 - r.length) + r : r;
}
var hexParsers = {
    4: {
        rx: /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
        mult: 16
    },
    7: {
        rx: /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        mult: 1
    },
    9: {
        rx: /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        mult: 1
    }
};
var HSBToRGB = [
    function (brightness, p, q, t) { return new MSColor(brightness, t, p); },
    function (brightness, p, q, t) { return new MSColor(q, brightness, p); },
    function (brightness, p, q, t) { return new MSColor(p, brightness, t); },
    function (brightness, p, q, t) { return new MSColor(p, q, brightness); },
    function (brightness, p, q, t) { return new MSColor(t, p, brightness); },
    function (brightness, p, q, t) { return new MSColor(brightness, p, q); },
    function (brightness, p, q, t) { return new MSColor(brightness, t, p); }
];
var MSColor = (function () {
    function MSColor(r, g, b, a) {
        if (typeof r === 'string') {
            r = r.replace(/ /g, '');
            r = namedColors[r] || r;
            var parser = hexParsers[r.length];
            var m = parser && r.match(parser.rx);
            if (m) {
                this.red = parseInt(m[1], 16) * parser.mult;
                this.green = parseInt(m[2], 16) * parser.mult;
                this.blue = parseInt(m[3], 16) * parser.mult;
                this.alpha = m[4] ? parseInt(m[4], 16) * parser.mult : 255;
                return;
            }
            throw new Error("invalid color value");
        }
        else if (typeof r === 'number') {
            if (typeof g === 'number' && typeof b === 'number') {
                this.red = parse0to255(r);
                this.green = parse0to255(g);
                this.blue = parse0to255(b);
                this.alpha = typeof a === 'number' ? parse0to255(a) : 255;
                return;
            }
            else if (g === undefined) {
                // the 4 bytes contains the RTGB value TTRRGGBB where TT is the transparency (0 means opaque)
                this.alpha = 0xff - ((r >> 24) & 0xff);
                this.red = (r >> 16) & 0xff;
                this.green = (r >> 8) & 0xff;
                this.blue = r & 0xff;
                return;
            }
        }
        throw new Error("invalid constructor parameters");
    }
    MSColor.lighter = function (X) { X /= 255.0; return Math.round((2.0 * (X) * (X) / 3.0 + (X) / 2.0 + 0.25) * 255); };
    MSColor.darker = function (X) { X /= 255.0; return Math.round((-(X) * (X) / 3 + 5.0 * (X) / 6.0) * 255); };
    MSColor.colorWithHSB = function (hue, saturation, brightness) {
        if (typeof hue === "object" && "h" in hue && "s" in hue && "b" in hue) {
            brightness = hue.b;
            saturation = hue.s;
            hue = hue.h;
        }
        if (brightness !== 0) {
            var i = (Math.max(0, Math.floor(hue * 6))) % 7, f = (hue * 6) - i, p = brightness * (1 - saturation), q = brightness * (1 - (saturation * f)), t = brightness * (1 - (saturation * (1 - f)));
            return HSBToRGB[i](brightness, p, q, t);
        }
        return MSColor.BLACK;
    };
    MSColor.prototype.luminance = function () { return (0.3 * this.red + 0.59 * this.green + 0.11 * this.blue) / 255.0; };
    MSColor.prototype.isPale = function () { return this.luminance() > 0.6 ? true : false; };
    MSColor.prototype.lighterColor = function () { return new MSColor(MSColor.lighter(this.red), MSColor.lighter(this.green), MSColor.lighter(this.blue), this.alpha); };
    MSColor.prototype.darkerColor = function () { return new MSColor(MSColor.darker(this.red), MSColor.darker(this.green), MSColor.darker(this.blue), this.alpha); };
    MSColor.prototype.lightest = function () {
        return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha);
    };
    MSColor.prototype.darkest = function () {
        return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha);
    };
    MSColor.prototype.matchingColor = function () { return this.isPale() ? this.darkest() : this.lightest(); };
    MSColor.prototype.toString = function () {
        return this.alpha === 255 ? '#' + toHex(this.red) + toHex(this.green) + toHex(this.blue) : "rgba(" + this.red + "," + this.green + "," + this.blue + "," + (this.alpha / 255.0) + ")";
    };
    MSColor.prototype.toNumber = function () { return ((0xff - this.alpha) * 16777216) + (this.red * 65536) + (this.green * 256) + this.blue; };
    MSColor.prototype.toHSB = function () {
        var red = this.red / 255, green = this.green / 255, blue = this.blue / 255;
        var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
        var hue = 0, saturation = 0, brightness = max;
        if (min < max) {
            var delta = (max - min);
            saturation = delta / max;
            if (red === max) {
                hue = (green - blue) / delta;
            }
            else if (green === max) {
                hue = 2 + ((blue - red) / delta);
            }
            else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            if (hue < 0) {
                hue += 1;
            }
            if (hue > 1) {
                hue -= 1;
            }
        }
        return { h: hue, s: saturation, b: brightness };
    };
    MSColor.prototype.isEqualTo = function (other) {
        return other instanceof MSColor && this.isEqualToColor(other);
    };
    MSColor.prototype.isEqualToColor = function (other) {
        return this === other || (other && other.toNumber() === this.toNumber());
    };
    MSColor.prototype.toJSON = function () { return this.toString(); };
    MSColor.RED = new MSColor(0xff, 0, 0);
    MSColor.GREEN = new MSColor(0, 0xff, 0);
    MSColor.YELLOW = new MSColor(0xff, 0xff, 0);
    MSColor.BLUE = new MSColor(0, 0, 0xff);
    MSColor.CYAN = new MSColor(0, 0xff, 0xff);
    MSColor.MAGENTA = new MSColor(0xff, 0, 0xff);
    MSColor.WHITE = new MSColor(0xff, 0xff, 0xff);
    MSColor.BLACK = new MSColor(0, 0, 0);
    return MSColor;
}());
exports.MSColor = MSColor;

},{}],8:[function(require,module,exports){
"use strict";
var MSCouple = (function () {
    function MSCouple(first, second) {
        if (first === void 0) { first = null; }
        if (second === void 0) { second = null; }
        this.firstMember = first;
        this.secondMember = second;
    }
    MSCouple.prototype.toArray = function () { return [this.firstMember, this.secondMember]; };
    MSCouple.prototype.isEqualTo = function (other) {
        return other instanceof MSCouple && this.isEqualToCouple(other);
    };
    MSCouple.prototype.isEqualToCouple = function (other) {
        return other.firstMember === this.firstMember && other.secondMember === this.secondMember;
    };
    return MSCouple;
}());
exports.MSCouple = MSCouple;

},{}],9:[function(require,module,exports){
"use strict";
var core_1 = require('../core');
var DaysFrom00000229To20010101 = 730792;
var DaysFrom00010101To20010101 = 730485;
var SecsFrom00010101To20010101 = 63113904000;
var SecsFrom19700101To20010101 = 978307200;
var DaysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DaysInPreviousMonth = [0, 0, 0, 0, 31, 61, 92, 122, 153, 184, 214, 245, 275, 306, 337];
function fastPad2(v) { return v > 10 ? ('' + v) : ('0' + v); }
var MSDate = (function () {
    function MSDate() {
        var n = arguments.length;
        if (n >= 3) {
            if (!MSDate.validDate(arguments[0], arguments[1], arguments[2])) {
                throw "Bad MSDate() day arguments";
            }
            if (n !== 3 && n !== 6) {
                throw "Impossible to initialize a new MSDate() with " + n + " arguments";
            }
            if (n === 6) {
                if (!MSDate.validTime(arguments[3], arguments[4], arguments[5])) {
                    throw "Bad MSDate() time arguments";
                }
                this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
            else {
                this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], 0, 0, 0);
            }
        }
        else if (n === 2) {
            throw "Impossible to initialize a new MSDate() with 2 arguments";
        }
        else {
            var t = arguments[0]; // undefined if n === 0
            if (typeof t === 'number')
                this.interval = t;
            else if (t instanceof MSDate)
                this.interval = t.interval;
            else {
                var tmp = t instanceof Date ? t : new Date();
                this.interval = MSDate.intervalFrom(tmp.getFullYear(), tmp.getMonth() + 1, tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds());
            }
        }
    }
    MSDate.isLeapYear = function (y) { return (y % 4 ? false : (y % 100 ? (y > 7 ? true : false) : (y % 400 || y < 1600 ? false : true))); };
    MSDate.validDate = function (year, month, day) {
        if (!core_1.isInteger(day) || !core_1.isInteger(month) || !core_1.isInteger(year) || day < 1 || month < 1 || month > 12) {
            return false;
        }
        if (day > DaysInMonth[month]) {
            return (month === 2 && day === 29 && MSDate.isLeapYear(year)) ? true : false;
        }
        return true;
    };
    MSDate.validTime = function (hour, minute, second) {
        return (core_1.isInteger(hour) && core_1.isInteger(minute) && !isNaN(second) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60);
    };
    MSDate.intervalFromYMD = function (year, month, day) {
        var leaps;
        month = 0 | month;
        if (month < 3) {
            month += 12;
            year--;
        }
        leaps = Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
        return Math.floor((day + DaysInPreviousMonth[month] + 365 * year + leaps - DaysFrom00000229To20010101) * 86400);
    };
    MSDate.intervalFrom = function (year, month, day, hours, minutes, seconds) {
        return MSDate.intervalFromYMD(year, month, day) + hours * 3600 + minutes * 60 + seconds;
    };
    MSDate.timeFromInterval = function (t) { return ((t + SecsFrom00010101To20010101) % 86400); };
    MSDate.dayFromInterval = function (t) { return Math.floor((t - MSDate.timeFromInterval(t)) / 86400); };
    MSDate.secondsFromInterval = function (t) { return ((t + SecsFrom00010101To20010101) % 60); };
    MSDate.minutesFromInterval = function (t) { return core_1.div(Math.floor((t + SecsFrom00010101To20010101) % 3600), 60); };
    MSDate.hoursFromInterval = function (t) { return core_1.div(Math.floor((t + SecsFrom00010101To20010101) % 86400), 3600); };
    MSDate.dayOfWeekFromInterval = function (t, offset) {
        offset = offset || 0;
        return (MSDate.dayFromInterval(t) + DaysFrom00010101To20010101 + 7 - (offset % 7)) % 7;
    };
    MSDate.componentsWithInterval = function (interval) {
        var Z = MSDate.dayFromInterval(interval) + DaysFrom00000229To20010101;
        var gg = Z - 0.25;
        var CENTURY = Math.floor(gg / 36524.25);
        var CENTURY_MQUART = CENTURY - Math.floor(CENTURY / 4);
        var ALLDAYS = gg + CENTURY_MQUART;
        var Y = Math.floor(ALLDAYS / 365.25);
        var Y365 = Math.floor(Y * 365.25);
        var DAYS_IN_Y = CENTURY_MQUART + Z - Y365;
        var MONTH_IN_Y = Math.floor((5 * DAYS_IN_Y + 456) / 153);
        return {
            day: Math.floor(DAYS_IN_Y - Math.floor((153 * MONTH_IN_Y - 457) / 5)),
            hour: MSDate.hoursFromInterval(interval),
            minute: MSDate.minutesFromInterval(interval),
            seconds: MSDate.secondsFromInterval(interval),
            dayOfWeek: ((Z + 2) % 7),
            month: MONTH_IN_Y > 12 ? MONTH_IN_Y - 12 : MONTH_IN_Y,
            year: MONTH_IN_Y > 12 ? Y + 1 : Y
        };
    };
    MSDate._lastDayOfMonth = function (year, month) { return (month === 2 && MSDate.isLeapYear(year)) ? 29 : DaysInMonth[month]; }; // not protected. use carrefully
    MSDate._yearRef = function (y, offset) {
        var firstDayOfYear = MSDate.intervalFromYMD(y, 1, 1), d = MSDate.dayOfWeekFromInterval(firstDayOfYear, offset);
        d = (d <= 3 ? -d : 7 - d); // Day of the first week
        return firstDayOfYear + d * 86400;
    };
    MSDate.prototype.components = function () { return MSDate.componentsWithInterval(this.interval); };
    MSDate.prototype.isEqualTo = function (other) {
        return other instanceof MSDate && other.interval === this.interval;
    };
    MSDate.prototype.isLeap = function () { return MSDate.isLeapYear(this.components().year); };
    MSDate.prototype.yearOfCommonEra = function () { return this.components().year; };
    MSDate.prototype.monthOfYear = function () { return this.components().month; };
    MSDate.prototype.weekOfYear = function (offset) {
        if (offset === void 0) { offset = 0; }
        // In order to follow ISO 8601 week begins on monday and must have at
        // least 4 days (i.e. it must includes thursday)
        var w;
        var c = this.components();
        offset %= 7;
        var reference = MSDate._yearRef(c.year, offset);
        if (this.interval < reference) {
            reference = MSDate._yearRef(c.year - 1, offset);
            w = Math.floor((this.interval - reference) / (86400 * 7)) + 1;
        }
        else {
            w = Math.floor((this.interval - reference) / (86400 * 7)) + 1;
            if (w === 53) {
                reference += 52 * 7 * 86400;
                c = MSDate.componentsWithInterval(reference);
                if (c.day >= 29) {
                    w = 1;
                }
            }
        }
        return w;
    };
    MSDate.prototype.dayOfYear = function () {
        return Math.floor((this.interval - MSDate.intervalFromYMD(this.components().year, 1, 1)) / 86400) + 1;
    };
    MSDate.prototype.dayOfMonth = function () { return this.components().day; };
    MSDate.prototype.lastDayOfMonth = function () { var c = this.components(); return MSDate._lastDayOfMonth(c.year, c.month); };
    MSDate.prototype.dayOfWeek = function (offset) { return MSDate.dayOfWeekFromInterval(this.interval, offset); };
    MSDate.prototype.hourOfDay = function () { return MSDate.hoursFromInterval(this.interval); };
    MSDate.prototype.secondOfDay = function () { return MSDate.timeFromInterval(this.interval); };
    MSDate.prototype.minuteOfHour = function () { return MSDate.minutesFromInterval(this.interval); };
    MSDate.prototype.secondOfMinute = function () { return MSDate.secondsFromInterval(this.interval); };
    MSDate.prototype.dateWithoutTime = function () { return new MSDate(this.interval - MSDate.timeFromInterval(this.interval)); };
    MSDate.prototype.dateOfFirstDayOfYear = function () { var c = this.components(); return new MSDate(c.year, 1, 1); };
    MSDate.prototype.dateOfLastDayOfYear = function () { var c = this.components(); return new MSDate(c.year, 12, 31); };
    MSDate.prototype.dateOfFirstDayOfMonth = function () { var c = this.components(); return new MSDate(c.year, c.month, 1); };
    MSDate.prototype.dateOfLastDayOfMonth = function () { var c = this.components(); return new MSDate(c.year, c.month, MSDate._lastDayOfMonth(c.year, c.month)); };
    MSDate.prototype.secondsSinceLocal1970 = function () { return this.interval + SecsFrom19700101To20010101; };
    MSDate.prototype.secondsSinceLocal2001 = function () { return this.interval; };
    MSDate.prototype.toDate = function () {
        var c = this.components();
        return new Date(c.year, c.month - 1, c.day, c.hour, c.minute, c.seconds, 0);
    };
    // returns the ISO 8601 representation without any timezone
    MSDate.prototype.toISOString = function () {
        var c = this.components();
        return c.year + '-' +
            fastPad2(c.month) + '-' +
            fastPad2(c.day) + 'T' +
            fastPad2(c.hour) + ':' +
            fastPad2(c.minute) + ':' +
            fastPad2(c.seconds);
    };
    MSDate.prototype.toString = function () {
        return this.toISOString();
    };
    MSDate.prototype.toJSON = function () {
        return this.toISOString();
    };
    MSDate.DaysFrom00000229To20010101 = DaysFrom00000229To20010101;
    MSDate.DaysFrom00010101To20010101 = DaysFrom00010101To20010101;
    MSDate.SecsFrom00010101To20010101 = SecsFrom00010101To20010101;
    MSDate.SecsFrom19700101To20010101 = SecsFrom19700101To20010101;
    return MSDate;
}());
exports.MSDate = MSDate;

},{"../core":1}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var msbuffer_1 = require('./msbuffer');
function safeNaturalValue(value) {
    return value | 0;
}
var MSNaturalArray = (function (_super) {
    __extends(MSNaturalArray, _super);
    function MSNaturalArray() {
        _super.call(this);
        msbuffer_1.push(this, 0, arguments, true, safeNaturalValue);
    }
    MSNaturalArray.prototype.unshift = function () {
        msbuffer_1.unshift(this, 0, arguments, false, safeNaturalValue);
        return this.length;
    };
    MSNaturalArray.prototype.push = function () {
        msbuffer_1.push(this, 0, arguments, false, safeNaturalValue);
        return this.length;
    };
    MSNaturalArray.prototype.concat = function () {
        var ret = new MSNaturalArray();
        Array.prototype.push.apply(ret, this);
        msbuffer_1.push(ret, 0, arguments, true, safeNaturalValue);
        return ret;
    };
    MSNaturalArray.prototype.slice = function (start, end) {
        return new MSNaturalArray(Array.prototype.slice.apply(this, arguments));
    };
    MSNaturalArray.prototype.splice = function (start, deleteCount) {
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        return new MSNaturalArray(Array.prototype.splice.apply(this, arguments));
    };
    MSNaturalArray.prototype.toJSON = function () {
        return Array.from(this);
    };
    MSNaturalArray.prototype.isEqualTo = function (other) {
        return other instanceof MSNaturalArray && this.isEqualToArray(other);
    };
    MSNaturalArray.prototype.isEqualToArray = function (other) {
        if (this === other)
            return true;
        if (!other || other.length !== this.length)
            return false;
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] !== other[i])
                return false;
        }
        return true;
    };
    return MSNaturalArray;
}(Array));
exports.MSNaturalArray = MSNaturalArray;

},{"./msbuffer":6}]},{},[2])(2)
});