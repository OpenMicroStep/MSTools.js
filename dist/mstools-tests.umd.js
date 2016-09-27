(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */

function exclude () {
  var excludes = [].slice.call(arguments);

  function excludeProps (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
};

/*!
 * Primary Exports
 */

module.exports = AssertionError;

/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param {String} message
 * @param {Object} properties to include (optional)
 * @param {callee} start stack function (optional)
 */

function AssertionError (message, _props, ssf) {
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
    , props = extend(_props || {});

  // default values
  this.message = message || 'Unspecified AssertionError';
  this.showDiff = false;

  // copy from properties
  for (var key in props) {
    this[key] = props[key];
  }

  // capture stack trace
  ssf = ssf || arguments.callee;
  if (ssf && Error.captureStackTrace) {
    Error.captureStackTrace(this, ssf);
  } else {
    try {
      throw new Error();
    } catch(e) {
      this.stack = e.stack;
    }
  }
}

/*!
 * Inherit from Error.prototype
 */

AssertionError.prototype = Object.create(Error.prototype);

/*!
 * Statically set name
 */

AssertionError.prototype.name = 'AssertionError';

/*!
 * Ensure correct constructor
 */

AssertionError.prototype.constructor = AssertionError;

/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param {Boolean} include stack (default: `true`)
 * @return {Object} object that can be `JSON.stringify`
 */

AssertionError.prototype.toJSON = function (stack) {
  var extend = exclude('constructor', 'toJSON', 'stack')
    , props = extend({ name: this.name }, this);

  // include stack if exists and not turned off
  if (false !== stack && this.stack) {
    props.stack = this.stack;
  }

  return props;
};

},{}],2:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":2,"ieee754":37,"isarray":38}],4:[function(require,module,exports){
module.exports = require('./lib/chai');

},{"./lib/chai":5}],5:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var used = []
  , exports = module.exports = {};

/*!
 * Chai version
 */

exports.version = '3.5.0';

/*!
 * Assertion Error
 */

exports.AssertionError = require('assertion-error');

/*!
 * Utils for plugins (not exported)
 */

var util = require('./chai/utils');

/**
 * # .use(function)
 *
 * Provides a way to extend the internals of Chai
 *
 * @param {Function}
 * @returns {this} for chaining
 * @api public
 */

exports.use = function (fn) {
  if (!~used.indexOf(fn)) {
    fn(this, util);
    used.push(fn);
  }

  return this;
};

/*!
 * Utility Functions
 */

exports.util = util;

/*!
 * Configuration
 */

var config = require('./chai/config');
exports.config = config;

/*!
 * Primary `Assertion` prototype
 */

var assertion = require('./chai/assertion');
exports.use(assertion);

/*!
 * Core Assertions
 */

var core = require('./chai/core/assertions');
exports.use(core);

/*!
 * Expect interface
 */

var expect = require('./chai/interface/expect');
exports.use(expect);

/*!
 * Should interface
 */

var should = require('./chai/interface/should');
exports.use(should);

/*!
 * Assert interface
 */

var assert = require('./chai/interface/assert');
exports.use(assert);

},{"./chai/assertion":6,"./chai/config":7,"./chai/core/assertions":8,"./chai/interface/assert":9,"./chai/interface/expect":10,"./chai/interface/should":11,"./chai/utils":25,"assertion-error":1}],6:[function(require,module,exports){
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = require('./config');

module.exports = function (_chai, util) {
  /*!
   * Module dependencies.
   */

  var AssertionError = _chai.AssertionError
    , flag = util.flag;

  /*!
   * Module export.
   */

  _chai.Assertion = Assertion;

  /*!
   * Assertion Constructor
   *
   * Creates object for chaining.
   *
   * @api private
   */

  function Assertion (obj, msg, stack) {
    flag(this, 'ssfi', stack || arguments.callee);
    flag(this, 'object', obj);
    flag(this, 'message', msg);
  }

  Object.defineProperty(Assertion, 'includeStack', {
    get: function() {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      return config.includeStack;
    },
    set: function(value) {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      config.includeStack = value;
    }
  });

  Object.defineProperty(Assertion, 'showDiff', {
    get: function() {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      return config.showDiff;
    },
    set: function(value) {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      config.showDiff = value;
    }
  });

  Assertion.addProperty = function (name, fn) {
    util.addProperty(this.prototype, name, fn);
  };

  Assertion.addMethod = function (name, fn) {
    util.addMethod(this.prototype, name, fn);
  };

  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  Assertion.overwriteProperty = function (name, fn) {
    util.overwriteProperty(this.prototype, name, fn);
  };

  Assertion.overwriteMethod = function (name, fn) {
    util.overwriteMethod(this.prototype, name, fn);
  };

  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  /**
   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
   *
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
   *
   * @name assert
   * @param {Philosophical} expression to be tested
   * @param {String|Function} message or function that returns message to display if expression fails
   * @param {String|Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
   * @param {Mixed} expected value (remember to check for negation)
   * @param {Mixed} actual (optional) will default to `this.obj`
   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
   * @api private
   */

  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
    var ok = util.test(this, arguments);
    if (true !== showDiff) showDiff = false;
    if (true !== config.showDiff) showDiff = false;

    if (!ok) {
      var msg = util.getMessage(this, arguments)
        , actual = util.getActual(this, arguments);
      throw new AssertionError(msg, {
          actual: actual
        , expected: expected
        , showDiff: showDiff
      }, (config.includeStack) ? this.assert : flag(this, 'ssfi'));
    }
  };

  /*!
   * ### ._obj
   *
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @api private
   */

  Object.defineProperty(Assertion.prototype, '_obj',
    { get: function () {
        return flag(this, 'object');
      }
    , set: function (val) {
        flag(this, 'object', val);
      }
  });
};

},{"./config":7}],7:[function(require,module,exports){
module.exports = {

  /**
   * ### config.includeStack
   *
   * User configurable property, influences whether stack trace
   * is included in Assertion error message. Default of false
   * suppresses stack trace in the error message.
   *
   *     chai.config.includeStack = true;  // enable stack on error
   *
   * @param {Boolean}
   * @api public
   */

   includeStack: false,

  /**
   * ### config.showDiff
   *
   * User configurable property, influences whether or not
   * the `showDiff` flag should be included in the thrown
   * AssertionErrors. `false` will always be `false`; `true`
   * will be true when the assertion has requested a diff
   * be shown.
   *
   * @param {Boolean}
   * @api public
   */

  showDiff: true,

  /**
   * ### config.truncateThreshold
   *
   * User configurable property, sets length threshold for actual and
   * expected values in assertion errors. If this threshold is exceeded, for
   * example for large data structures, the value is replaced with something
   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
   *
   * Set it to zero if you want to disable truncating altogether.
   *
   * This is especially userful when doing assertions on arrays: having this
   * set to a reasonable large value makes the failure messages readily
   * inspectable.
   *
   *     chai.config.truncateThreshold = 0;  // disable truncating
   *
   * @param {Number}
   * @api public
   */

  truncateThreshold: 40

};

},{}],8:[function(require,module,exports){
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, _) {
  var Assertion = chai.Assertion
    , toString = Object.prototype.toString
    , flag = _.flag;

  /**
   * ### Language Chains
   *
   * The following are provided as chainable getters to
   * improve the readability of your assertions. They
   * do not provide testing capabilities unless they
   * have been overwritten by a plugin.
   *
   * **Chains**
   *
   * - to
   * - be
   * - been
   * - is
   * - that
   * - which
   * - and
   * - has
   * - have
   * - with
   * - at
   * - of
   * - same
   *
   * @name language chains
   * @namespace BDD
   * @api public
   */

  [ 'to', 'be', 'been'
  , 'is', 'and', 'has', 'have'
  , 'with', 'that', 'which', 'at'
  , 'of', 'same' ].forEach(function (chain) {
    Assertion.addProperty(chain, function () {
      return this;
    });
  });

  /**
   * ### .not
   *
   * Negates any of assertions following in the chain.
   *
   *     expect(foo).to.not.equal('bar');
   *     expect(goodFn).to.not.throw(Error);
   *     expect({ foo: 'baz' }).to.have.property('foo')
   *       .and.not.equal('bar');
   *
   * @name not
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('not', function () {
    flag(this, 'negate', true);
  });

  /**
   * ### .deep
   *
   * Sets the `deep` flag, later used by the `equal` and
   * `property` assertions.
   *
   *     expect(foo).to.deep.equal({ bar: 'baz' });
   *     expect({ foo: { bar: { baz: 'quux' } } })
   *       .to.have.deep.property('foo.bar.baz', 'quux');
   *
   * `.deep.property` special characters can be escaped
   * by adding two slashes before the `.` or `[]`.
   *
   *     var deepCss = { '.link': { '[target]': 42 }};
   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
   *
   * @name deep
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('deep', function () {
    flag(this, 'deep', true);
  });

  /**
   * ### .any
   *
   * Sets the `any` flag, (opposite of the `all` flag)
   * later used in the `keys` assertion.
   *
   *     expect(foo).to.have.any.keys('bar', 'baz');
   *
   * @name any
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('any', function () {
    flag(this, 'any', true);
    flag(this, 'all', false)
  });


  /**
   * ### .all
   *
   * Sets the `all` flag (opposite of the `any` flag)
   * later used by the `keys` assertion.
   *
   *     expect(foo).to.have.all.keys('bar', 'baz');
   *
   * @name all
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('all', function () {
    flag(this, 'all', true);
    flag(this, 'any', false);
  });

  /**
   * ### .a(type)
   *
   * The `a` and `an` assertions are aliases that can be
   * used either as language chains or to assert a value's
   * type.
   *
   *     // typeof
   *     expect('test').to.be.a('string');
   *     expect({ foo: 'bar' }).to.be.an('object');
   *     expect(null).to.be.a('null');
   *     expect(undefined).to.be.an('undefined');
   *     expect(new Error).to.be.an('error');
   *     expect(new Promise).to.be.a('promise');
   *     expect(new Float32Array()).to.be.a('float32array');
   *     expect(Symbol()).to.be.a('symbol');
   *
   *     // es6 overrides
   *     expect({[Symbol.toStringTag]:()=>'foo'}).to.be.a('foo');
   *
   *     // language chain
   *     expect(foo).to.be.an.instanceof(Foo);
   *
   * @name a
   * @alias an
   * @param {String} type
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function an (type, msg) {
    if (msg) flag(this, 'message', msg);
    type = type.toLowerCase();
    var obj = flag(this, 'object')
      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

    this.assert(
        type === _.type(obj)
      , 'expected #{this} to be ' + article + type
      , 'expected #{this} not to be ' + article + type
    );
  }

  Assertion.addChainableMethod('an', an);
  Assertion.addChainableMethod('a', an);

  /**
   * ### .include(value)
   *
   * The `include` and `contain` assertions can be used as either property
   * based language chains or as methods to assert the inclusion of an object
   * in an array or a substring in a string. When used as language chains,
   * they toggle the `contains` flag for the `keys` assertion.
   *
   *     expect([1,2,3]).to.include(2);
   *     expect('foobar').to.contain('foo');
   *     expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');
   *
   * @name include
   * @alias contain
   * @alias includes
   * @alias contains
   * @param {Object|String|Number} obj
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function includeChainingBehavior () {
    flag(this, 'contains', true);
  }

  function include (val, msg) {
    _.expectTypes(this, ['array', 'object', 'string']);

    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var expected = false;

    if (_.type(obj) === 'array' && _.type(val) === 'object') {
      for (var i in obj) {
        if (_.eql(obj[i], val)) {
          expected = true;
          break;
        }
      }
    } else if (_.type(val) === 'object') {
      if (!flag(this, 'negate')) {
        for (var k in val) new Assertion(obj).property(k, val[k]);
        return;
      }
      var subset = {};
      for (var k in val) subset[k] = obj[k];
      expected = _.eql(subset, val);
    } else {
      expected = (obj != undefined) && ~obj.indexOf(val);
    }
    this.assert(
        expected
      , 'expected #{this} to include ' + _.inspect(val)
      , 'expected #{this} to not include ' + _.inspect(val));
  }

  Assertion.addChainableMethod('include', include, includeChainingBehavior);
  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

  /**
   * ### .ok
   *
   * Asserts that the target is truthy.
   *
   *     expect('everything').to.be.ok;
   *     expect(1).to.be.ok;
   *     expect(false).to.not.be.ok;
   *     expect(undefined).to.not.be.ok;
   *     expect(null).to.not.be.ok;
   *
   * @name ok
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('ok', function () {
    this.assert(
        flag(this, 'object')
      , 'expected #{this} to be truthy'
      , 'expected #{this} to be falsy');
  });

  /**
   * ### .true
   *
   * Asserts that the target is `true`.
   *
   *     expect(true).to.be.true;
   *     expect(1).to.not.be.true;
   *
   * @name true
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('true', function () {
    this.assert(
        true === flag(this, 'object')
      , 'expected #{this} to be true'
      , 'expected #{this} to be false'
      , this.negate ? false : true
    );
  });

  /**
   * ### .false
   *
   * Asserts that the target is `false`.
   *
   *     expect(false).to.be.false;
   *     expect(0).to.not.be.false;
   *
   * @name false
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('false', function () {
    this.assert(
        false === flag(this, 'object')
      , 'expected #{this} to be false'
      , 'expected #{this} to be true'
      , this.negate ? true : false
    );
  });

  /**
   * ### .null
   *
   * Asserts that the target is `null`.
   *
   *     expect(null).to.be.null;
   *     expect(undefined).to.not.be.null;
   *
   * @name null
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('null', function () {
    this.assert(
        null === flag(this, 'object')
      , 'expected #{this} to be null'
      , 'expected #{this} not to be null'
    );
  });

  /**
   * ### .undefined
   *
   * Asserts that the target is `undefined`.
   *
   *     expect(undefined).to.be.undefined;
   *     expect(null).to.not.be.undefined;
   *
   * @name undefined
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('undefined', function () {
    this.assert(
        undefined === flag(this, 'object')
      , 'expected #{this} to be undefined'
      , 'expected #{this} not to be undefined'
    );
  });

  /**
   * ### .NaN
   * Asserts that the target is `NaN`.
   *
   *     expect('foo').to.be.NaN;
   *     expect(4).not.to.be.NaN;
   *
   * @name NaN
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('NaN', function () {
    this.assert(
        isNaN(flag(this, 'object'))
        , 'expected #{this} to be NaN'
        , 'expected #{this} not to be NaN'
    );
  });

  /**
   * ### .exist
   *
   * Asserts that the target is neither `null` nor `undefined`.
   *
   *     var foo = 'hi'
   *       , bar = null
   *       , baz;
   *
   *     expect(foo).to.exist;
   *     expect(bar).to.not.exist;
   *     expect(baz).to.not.exist;
   *
   * @name exist
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('exist', function () {
    this.assert(
        null != flag(this, 'object')
      , 'expected #{this} to exist'
      , 'expected #{this} to not exist'
    );
  });


  /**
   * ### .empty
   *
   * Asserts that the target's length is `0`. For arrays and strings, it checks
   * the `length` property. For objects, it gets the count of
   * enumerable keys.
   *
   *     expect([]).to.be.empty;
   *     expect('').to.be.empty;
   *     expect({}).to.be.empty;
   *
   * @name empty
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('empty', function () {
    var obj = flag(this, 'object')
      , expected = obj;

    if (Array.isArray(obj) || 'string' === typeof object) {
      expected = obj.length;
    } else if (typeof obj === 'object') {
      expected = Object.keys(obj).length;
    }

    this.assert(
        !expected
      , 'expected #{this} to be empty'
      , 'expected #{this} not to be empty'
    );
  });

  /**
   * ### .arguments
   *
   * Asserts that the target is an arguments object.
   *
   *     function test () {
   *       expect(arguments).to.be.arguments;
   *     }
   *
   * @name arguments
   * @alias Arguments
   * @namespace BDD
   * @api public
   */

  function checkArguments () {
    var obj = flag(this, 'object')
      , type = Object.prototype.toString.call(obj);
    this.assert(
        '[object Arguments]' === type
      , 'expected #{this} to be arguments but got ' + type
      , 'expected #{this} to not be arguments'
    );
  }

  Assertion.addProperty('arguments', checkArguments);
  Assertion.addProperty('Arguments', checkArguments);

  /**
   * ### .equal(value)
   *
   * Asserts that the target is strictly equal (`===`) to `value`.
   * Alternately, if the `deep` flag is set, asserts that
   * the target is deeply equal to `value`.
   *
   *     expect('hello').to.equal('hello');
   *     expect(42).to.equal(42);
   *     expect(1).to.not.equal(true);
   *     expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
   *     expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
   *
   * @name equal
   * @alias equals
   * @alias eq
   * @alias deep.equal
   * @param {Mixed} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertEqual (val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'deep')) {
      return this.eql(val);
    } else {
      this.assert(
          val === obj
        , 'expected #{this} to equal #{exp}'
        , 'expected #{this} to not equal #{exp}'
        , val
        , this._obj
        , true
      );
    }
  }

  Assertion.addMethod('equal', assertEqual);
  Assertion.addMethod('equals', assertEqual);
  Assertion.addMethod('eq', assertEqual);

  /**
   * ### .eql(value)
   *
   * Asserts that the target is deeply equal to `value`.
   *
   *     expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
   *     expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);
   *
   * @name eql
   * @alias eqls
   * @param {Mixed} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertEql(obj, msg) {
    if (msg) flag(this, 'message', msg);
    this.assert(
        _.eql(obj, flag(this, 'object'))
      , 'expected #{this} to deeply equal #{exp}'
      , 'expected #{this} to not deeply equal #{exp}'
      , obj
      , this._obj
      , true
    );
  }

  Assertion.addMethod('eql', assertEql);
  Assertion.addMethod('eqls', assertEql);

  /**
   * ### .above(value)
   *
   * Asserts that the target is greater than `value`.
   *
   *     expect(10).to.be.above(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *
   * @name above
   * @alias gt
   * @alias greaterThan
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertAbove (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len > n
        , 'expected #{this} to have a length above #{exp} but got #{act}'
        , 'expected #{this} to not have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj > n
        , 'expected #{this} to be above ' + n
        , 'expected #{this} to be at most ' + n
      );
    }
  }

  Assertion.addMethod('above', assertAbove);
  Assertion.addMethod('gt', assertAbove);
  Assertion.addMethod('greaterThan', assertAbove);

  /**
   * ### .least(value)
   *
   * Asserts that the target is greater than or equal to `value`.
   *
   *     expect(10).to.be.at.least(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.least(2);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);
   *
   * @name least
   * @alias gte
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertLeast (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= n
        , 'expected #{this} to have a length at least #{exp} but got #{act}'
        , 'expected #{this} to have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj >= n
        , 'expected #{this} to be at least ' + n
        , 'expected #{this} to be below ' + n
      );
    }
  }

  Assertion.addMethod('least', assertLeast);
  Assertion.addMethod('gte', assertLeast);

  /**
   * ### .below(value)
   *
   * Asserts that the target is less than `value`.
   *
   *     expect(5).to.be.below(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *
   * @name below
   * @alias lt
   * @alias lessThan
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertBelow (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len < n
        , 'expected #{this} to have a length below #{exp} but got #{act}'
        , 'expected #{this} to not have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj < n
        , 'expected #{this} to be below ' + n
        , 'expected #{this} to be at least ' + n
      );
    }
  }

  Assertion.addMethod('below', assertBelow);
  Assertion.addMethod('lt', assertBelow);
  Assertion.addMethod('lessThan', assertBelow);

  /**
   * ### .most(value)
   *
   * Asserts that the target is less than or equal to `value`.
   *
   *     expect(5).to.be.at.most(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.most(4);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);
   *
   * @name most
   * @alias lte
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertMost (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len <= n
        , 'expected #{this} to have a length at most #{exp} but got #{act}'
        , 'expected #{this} to have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj <= n
        , 'expected #{this} to be at most ' + n
        , 'expected #{this} to be above ' + n
      );
    }
  }

  Assertion.addMethod('most', assertMost);
  Assertion.addMethod('lte', assertMost);

  /**
   * ### .within(start, finish)
   *
   * Asserts that the target is within a range.
   *
   *     expect(7).to.be.within(5,10);
   *
   * Can also be used in conjunction with `length` to
   * assert a length range. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * @name within
   * @param {Number} start lowerbound inclusive
   * @param {Number} finish upperbound inclusive
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('within', function (start, finish, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , range = start + '..' + finish;
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= start && len <= finish
        , 'expected #{this} to have a length within ' + range
        , 'expected #{this} to not have a length within ' + range
      );
    } else {
      this.assert(
          obj >= start && obj <= finish
        , 'expected #{this} to be within ' + range
        , 'expected #{this} to not be within ' + range
      );
    }
  });

  /**
   * ### .instanceof(constructor)
   *
   * Asserts that the target is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , Chai = new Tea('chai');
   *
   *     expect(Chai).to.be.an.instanceof(Tea);
   *     expect([ 1, 2, 3 ]).to.be.instanceof(Array);
   *
   * @name instanceof
   * @param {Constructor} constructor
   * @param {String} message _optional_
   * @alias instanceOf
   * @namespace BDD
   * @api public
   */

  function assertInstanceOf (constructor, msg) {
    if (msg) flag(this, 'message', msg);
    var name = _.getName(constructor);
    this.assert(
        flag(this, 'object') instanceof constructor
      , 'expected #{this} to be an instance of ' + name
      , 'expected #{this} to not be an instance of ' + name
    );
  };

  Assertion.addMethod('instanceof', assertInstanceOf);
  Assertion.addMethod('instanceOf', assertInstanceOf);

  /**
   * ### .property(name, [value])
   *
   * Asserts that the target has a property `name`, optionally asserting that
   * the value of that property is strictly equal to  `value`.
   * If the `deep` flag is set, you can use dot- and bracket-notation for deep
   * references into objects and arrays.
   *
   *     // simple referencing
   *     var obj = { foo: 'bar' };
   *     expect(obj).to.have.property('foo');
   *     expect(obj).to.have.property('foo', 'bar');
   *
   *     // deep referencing
   *     var deepObj = {
   *         green: { tea: 'matcha' }
   *       , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
   *     };
   *
   *     expect(deepObj).to.have.deep.property('green.tea', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[1]', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');
   *
   * You can also use an array as the starting point of a `deep.property`
   * assertion, or traverse nested arrays.
   *
   *     var arr = [
   *         [ 'chai', 'matcha', 'konacha' ]
   *       , [ { tea: 'chai' }
   *         , { tea: 'matcha' }
   *         , { tea: 'konacha' } ]
   *     ];
   *
   *     expect(arr).to.have.deep.property('[0][1]', 'matcha');
   *     expect(arr).to.have.deep.property('[1][2].tea', 'konacha');
   *
   * Furthermore, `property` changes the subject of the assertion
   * to be the value of that property from the original object. This
   * permits for further chainable assertions on that property.
   *
   *     expect(obj).to.have.property('foo')
   *       .that.is.a('string');
   *     expect(deepObj).to.have.property('green')
   *       .that.is.an('object')
   *       .that.deep.equals({ tea: 'matcha' });
   *     expect(deepObj).to.have.property('teas')
   *       .that.is.an('array')
   *       .with.deep.property('[2]')
   *         .that.deep.equals({ tea: 'konacha' });
   *
   * Note that dots and bracket in `name` must be backslash-escaped when
   * the `deep` flag is set, while they must NOT be escaped when the `deep`
   * flag is not set.
   *
   *     // simple referencing
   *     var css = { '.link[target]': 42 };
   *     expect(css).to.have.property('.link[target]', 42);
   *
   *     // deep referencing
   *     var deepCss = { '.link': { '[target]': 42 }};
   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
   *
   * @name property
   * @alias deep.property
   * @param {String} name
   * @param {Mixed} value (optional)
   * @param {String} message _optional_
   * @returns value of property for chaining
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('property', function (name, val, msg) {
    if (msg) flag(this, 'message', msg);

    var isDeep = !!flag(this, 'deep')
      , descriptor = isDeep ? 'deep property ' : 'property '
      , negate = flag(this, 'negate')
      , obj = flag(this, 'object')
      , pathInfo = isDeep ? _.getPathInfo(name, obj) : null
      , hasProperty = isDeep
        ? pathInfo.exists
        : _.hasProperty(name, obj)
      , value = isDeep
        ? pathInfo.value
        : obj[name];

    if (negate && arguments.length > 1) {
      if (undefined === value) {
        msg = (msg != null) ? msg + ': ' : '';
        throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));
      }
    } else {
      this.assert(
          hasProperty
        , 'expected #{this} to have a ' + descriptor + _.inspect(name)
        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
    }

    if (arguments.length > 1) {
      this.assert(
          val === value
        , 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
        , 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}'
        , val
        , value
      );
    }

    flag(this, 'object', value);
  });


  /**
   * ### .ownProperty(name)
   *
   * Asserts that the target has an own property `name`.
   *
   *     expect('test').to.have.ownProperty('length');
   *
   * @name ownProperty
   * @alias haveOwnProperty
   * @param {String} name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertOwnProperty (name, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        obj.hasOwnProperty(name)
      , 'expected #{this} to have own property ' + _.inspect(name)
      , 'expected #{this} to not have own property ' + _.inspect(name)
    );
  }

  Assertion.addMethod('ownProperty', assertOwnProperty);
  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

  /**
   * ### .ownPropertyDescriptor(name[, descriptor[, message]])
   *
   * Asserts that the target has an own property descriptor `name`, that optionally matches `descriptor`.
   *
   *     expect('test').to.have.ownPropertyDescriptor('length');
   *     expect('test').to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 4 });
   *     expect('test').not.to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 3 });
   *     expect('test').ownPropertyDescriptor('length').to.have.property('enumerable', false);
   *     expect('test').ownPropertyDescriptor('length').to.have.keys('value');
   *
   * @name ownPropertyDescriptor
   * @alias haveOwnPropertyDescriptor
   * @param {String} name
   * @param {Object} descriptor _optional_
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertOwnPropertyDescriptor (name, descriptor, msg) {
    if (typeof descriptor === 'string') {
      msg = descriptor;
      descriptor = null;
    }
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
    if (actualDescriptor && descriptor) {
      this.assert(
          _.eql(descriptor, actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
        , descriptor
        , actualDescriptor
        , true
      );
    } else {
      this.assert(
          actualDescriptor
        , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
        , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
      );
    }
    flag(this, 'object', actualDescriptor);
  }

  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

  /**
   * ### .length
   *
   * Sets the `doLength` flag later used as a chain precursor to a value
   * comparison for the `length` property.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * *Deprecation notice:* Using `length` as an assertion will be deprecated
   * in version 2.4.0 and removed in 3.0.0. Code using the old style of
   * asserting for `length` property value using `length(value)` should be
   * switched to use `lengthOf(value)` instead.
   *
   * @name length
   * @namespace BDD
   * @api public
   */

  /**
   * ### .lengthOf(value[, message])
   *
   * Asserts that the target's `length` property has
   * the expected value.
   *
   *     expect([ 1, 2, 3]).to.have.lengthOf(3);
   *     expect('foobar').to.have.lengthOf(6);
   *
   * @name lengthOf
   * @param {Number} length
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertLengthChain () {
    flag(this, 'doLength', true);
  }

  function assertLength (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).to.have.property('length');
    var len = obj.length;

    this.assert(
        len == n
      , 'expected #{this} to have a length of #{exp} but got #{act}'
      , 'expected #{this} to not have a length of #{act}'
      , n
      , len
    );
  }

  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
  Assertion.addMethod('lengthOf', assertLength);

  /**
   * ### .match(regexp)
   *
   * Asserts that the target matches a regular expression.
   *
   *     expect('foobar').to.match(/^foo/);
   *
   * @name match
   * @alias matches
   * @param {RegExp} RegularExpression
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */
  function assertMatch(re, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        re.exec(obj)
      , 'expected #{this} to match ' + re
      , 'expected #{this} not to match ' + re
    );
  }

  Assertion.addMethod('match', assertMatch);
  Assertion.addMethod('matches', assertMatch);

  /**
   * ### .string(string)
   *
   * Asserts that the string target contains another string.
   *
   *     expect('foobar').to.have.string('bar');
   *
   * @name string
   * @param {String} string
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('string', function (str, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('string');

    this.assert(
        ~obj.indexOf(str)
      , 'expected #{this} to contain ' + _.inspect(str)
      , 'expected #{this} to not contain ' + _.inspect(str)
    );
  });


  /**
   * ### .keys(key1, [key2], [...])
   *
   * Asserts that the target contains any or all of the passed-in keys.
   * Use in combination with `any`, `all`, `contains`, or `have` will affect
   * what will pass.
   *
   * When used in conjunction with `any`, at least one key that is passed
   * in must exist in the target object. This is regardless whether or not
   * the `have` or `contain` qualifiers are used. Note, either `any` or `all`
   * should be used in the assertion. If neither are used, the assertion is
   * defaulted to `all`.
   *
   * When both `all` and `contain` are used, the target object must have at
   * least all of the passed-in keys but may have more keys not listed.
   *
   * When both `all` and `have` are used, the target object must both contain
   * all of the passed-in keys AND the number of keys in the target object must
   * match the number of keys passed in (in other words, a target object must
   * have all and only all of the passed-in keys).
   *
   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');
   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys({'foo': 6});
   *     expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);
   *     expect({ foo: 1, bar: 2 }).to.have.all.keys({'bar': 6, 'foo': 7});
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys({'bar': 6});
   *
   *
   * @name keys
   * @alias key
   * @param {...String|Array|Object} keys
   * @namespace BDD
   * @api public
   */

  function assertKeys (keys) {
    var obj = flag(this, 'object')
      , str
      , ok = true
      , mixedArgsMsg = 'keys must be given single argument of Array|Object|String, or multiple String arguments';

    switch (_.type(keys)) {
      case "array":
        if (arguments.length > 1) throw (new Error(mixedArgsMsg));
        break;
      case "object":
        if (arguments.length > 1) throw (new Error(mixedArgsMsg));
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }

    if (!keys.length) throw new Error('keys required');

    var actual = Object.keys(obj)
      , expected = keys
      , len = keys.length
      , any = flag(this, 'any')
      , all = flag(this, 'all');

    if (!any && !all) {
      all = true;
    }

    // Has any
    if (any) {
      var intersection = expected.filter(function(key) {
        return ~actual.indexOf(key);
      });
      ok = intersection.length > 0;
    }

    // Has all
    if (all) {
      ok = keys.every(function(key){
        return ~actual.indexOf(key);
      });
      if (!flag(this, 'negate') && !flag(this, 'contains')) {
        ok = ok && keys.length == actual.length;
      }
    }

    // Key string
    if (len > 1) {
      keys = keys.map(function(key){
        return _.inspect(key);
      });
      var last = keys.pop();
      if (all) {
        str = keys.join(', ') + ', and ' + last;
      }
      if (any) {
        str = keys.join(', ') + ', or ' + last;
      }
    } else {
      str = _.inspect(keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

    // Assertion
    this.assert(
        ok
      , 'expected #{this} to ' + str
      , 'expected #{this} to not ' + str
      , expected.slice(0).sort()
      , actual.sort()
      , true
    );
  }

  Assertion.addMethod('keys', assertKeys);
  Assertion.addMethod('key', assertKeys);

  /**
   * ### .throw(constructor)
   *
   * Asserts that the function target will throw a specific error, or specific type of error
   * (as determined using `instanceof`), optionally with a RegExp or string inclusion test
   * for the error's message.
   *
   *     var err = new ReferenceError('This is a bad function.');
   *     var fn = function () { throw err; }
   *     expect(fn).to.throw(ReferenceError);
   *     expect(fn).to.throw(Error);
   *     expect(fn).to.throw(/bad function/);
   *     expect(fn).to.not.throw('good function');
   *     expect(fn).to.throw(ReferenceError, /bad function/);
   *     expect(fn).to.throw(err);
   *
   * Please note that when a throw expectation is negated, it will check each
   * parameter independently, starting with error constructor type. The appropriate way
   * to check for the existence of a type of error but for a message that does not match
   * is to use `and`.
   *
   *     expect(fn).to.throw(ReferenceError)
   *        .and.not.throw(/good function/);
   *
   * @name throw
   * @alias throws
   * @alias Throw
   * @param {ErrorConstructor} constructor
   * @param {String|RegExp} expected error message
   * @param {String} message _optional_
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @returns error for chaining (null if no error)
   * @namespace BDD
   * @api public
   */

  function assertThrows (constructor, errMsg, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('function');

    var thrown = false
      , desiredError = null
      , name = null
      , thrownError = null;

    if (arguments.length === 0) {
      errMsg = null;
      constructor = null;
    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
      errMsg = constructor;
      constructor = null;
    } else if (constructor && constructor instanceof Error) {
      desiredError = constructor;
      constructor = null;
      errMsg = null;
    } else if (typeof constructor === 'function') {
      name = constructor.prototype.name;
      if (!name || (name === 'Error' && constructor !== Error)) {
        name = constructor.name || (new constructor()).name;
      }
    } else {
      constructor = null;
    }

    try {
      obj();
    } catch (err) {
      // first, check desired error
      if (desiredError) {
        this.assert(
            err === desiredError
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp}'
          , (desiredError instanceof Error ? desiredError.toString() : desiredError)
          , (err instanceof Error ? err.toString() : err)
        );

        flag(this, 'object', err);
        return this;
      }

      // next, check constructor
      if (constructor) {
        this.assert(
            err instanceof constructor
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp} but #{act} was thrown'
          , name
          , (err instanceof Error ? err.toString() : err)
        );

        if (!errMsg) {
          flag(this, 'object', err);
          return this;
        }
      }

      // next, check message
      var message = 'error' === _.type(err) && "message" in err
        ? err.message
        : '' + err;

      if ((message != null) && errMsg && errMsg instanceof RegExp) {
        this.assert(
            errMsg.exec(message)
          , 'expected #{this} to throw error matching #{exp} but got #{act}'
          , 'expected #{this} to throw error not matching #{exp}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else if ((message != null) && errMsg && 'string' === typeof errMsg) {
        this.assert(
            ~message.indexOf(errMsg)
          , 'expected #{this} to throw error including #{exp} but got #{act}'
          , 'expected #{this} to throw error not including #{act}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else {
        thrown = true;
        thrownError = err;
      }
    }

    var actuallyGot = ''
      , expectedThrown = name !== null
        ? name
        : desiredError
          ? '#{exp}' //_.inspect(desiredError)
          : 'an error';

    if (thrown) {
      actuallyGot = ' but #{act} was thrown'
    }

    this.assert(
        thrown === true
      , 'expected #{this} to throw ' + expectedThrown + actuallyGot
      , 'expected #{this} to not throw ' + expectedThrown + actuallyGot
      , (desiredError instanceof Error ? desiredError.toString() : desiredError)
      , (thrownError instanceof Error ? thrownError.toString() : thrownError)
    );

    flag(this, 'object', thrownError);
  };

  Assertion.addMethod('throw', assertThrows);
  Assertion.addMethod('throws', assertThrows);
  Assertion.addMethod('Throw', assertThrows);

  /**
   * ### .respondTo(method)
   *
   * Asserts that the object or class target will respond to a method.
   *
   *     Klass.prototype.bar = function(){};
   *     expect(Klass).to.respondTo('bar');
   *     expect(obj).to.respondTo('bar');
   *
   * To check if a constructor will respond to a static function,
   * set the `itself` flag.
   *
   *     Klass.baz = function(){};
   *     expect(Klass).itself.to.respondTo('baz');
   *
   * @name respondTo
   * @alias respondsTo
   * @param {String} method
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function respondTo (method, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , itself = flag(this, 'itself')
      , context = ('function' === _.type(obj) && !itself)
        ? obj.prototype[method]
        : obj[method];

    this.assert(
        'function' === typeof context
      , 'expected #{this} to respond to ' + _.inspect(method)
      , 'expected #{this} to not respond to ' + _.inspect(method)
    );
  }

  Assertion.addMethod('respondTo', respondTo);
  Assertion.addMethod('respondsTo', respondTo);

  /**
   * ### .itself
   *
   * Sets the `itself` flag, later used by the `respondTo` assertion.
   *
   *     function Foo() {}
   *     Foo.bar = function() {}
   *     Foo.prototype.baz = function() {}
   *
   *     expect(Foo).itself.to.respondTo('bar');
   *     expect(Foo).itself.not.to.respondTo('baz');
   *
   * @name itself
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('itself', function () {
    flag(this, 'itself', true);
  });

  /**
   * ### .satisfy(method)
   *
   * Asserts that the target passes a given truth test.
   *
   *     expect(1).to.satisfy(function(num) { return num > 0; });
   *
   * @name satisfy
   * @alias satisfies
   * @param {Function} matcher
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function satisfy (matcher, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var result = matcher(obj);
    this.assert(
        result
      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
      , this.negate ? false : true
      , result
    );
  }

  Assertion.addMethod('satisfy', satisfy);
  Assertion.addMethod('satisfies', satisfy);

  /**
   * ### .closeTo(expected, delta)
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     expect(1.5).to.be.closeTo(1, 0.5);
   *
   * @name closeTo
   * @alias approximately
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function closeTo(expected, delta, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj, msg).is.a('number');
    if (_.type(expected) !== 'number' || _.type(delta) !== 'number') {
      throw new Error('the arguments to closeTo or approximately must be numbers');
    }

    this.assert(
        Math.abs(obj - expected) <= delta
      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
    );
  }

  Assertion.addMethod('closeTo', closeTo);
  Assertion.addMethod('approximately', closeTo);

  function isSubsetOf(subset, superset, cmp) {
    return subset.every(function(elem) {
      if (!cmp) return superset.indexOf(elem) !== -1;

      return superset.some(function(elem2) {
        return cmp(elem, elem2);
      });
    })
  }

  /**
   * ### .members(set)
   *
   * Asserts that the target is a superset of `set`,
   * or that the target and `set` have the same strictly-equal (===) members.
   * Alternately, if the `deep` flag is set, set members are compared for deep
   * equality.
   *
   *     expect([1, 2, 3]).to.include.members([3, 2]);
   *     expect([1, 2, 3]).to.not.include.members([3, 2, 8]);
   *
   *     expect([4, 2]).to.have.members([2, 4]);
   *     expect([5, 2]).to.not.have.members([5, 2, 1]);
   *
   *     expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);
   *
   * @name members
   * @param {Array} set
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('members', function (subset, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj).to.be.an('array');
    new Assertion(subset).to.be.an('array');

    var cmp = flag(this, 'deep') ? _.eql : undefined;

    if (flag(this, 'contains')) {
      return this.assert(
          isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to be a superset of #{act}'
        , 'expected #{this} to not be a superset of #{act}'
        , obj
        , subset
      );
    }

    this.assert(
        isSubsetOf(obj, subset, cmp) && isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to have the same members as #{act}'
        , 'expected #{this} to not have the same members as #{act}'
        , obj
        , subset
    );
  });

  /**
   * ### .oneOf(list)
   *
   * Assert that a value appears somewhere in the top level of array `list`.
   *
   *     expect('a').to.be.oneOf(['a', 'b', 'c']);
   *     expect(9).to.not.be.oneOf(['z']);
   *     expect([3]).to.not.be.oneOf([1, 2, [3]]);
   *
   *     var three = [3];
   *     // for object-types, contents are not compared
   *     expect(three).to.not.be.oneOf([1, 2, [3]]);
   *     // comparing references works
   *     expect(three).to.be.oneOf([1, 2, three]);
   *
   * @name oneOf
   * @param {Array<*>} list
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function oneOf (list, msg) {
    if (msg) flag(this, 'message', msg);
    var expected = flag(this, 'object');
    new Assertion(list).to.be.an('array');

    this.assert(
        list.indexOf(expected) > -1
      , 'expected #{this} to be one of #{exp}'
      , 'expected #{this} to not be one of #{exp}'
      , list
      , expected
    );
  }

  Assertion.addMethod('oneOf', oneOf);


  /**
   * ### .change(function)
   *
   * Asserts that a function changes an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val += 3 };
   *     var noChangeFn = function() { return 'foo' + 'bar'; }
   *     expect(fn).to.change(obj, 'val');
   *     expect(noChangeFn).to.not.change(obj, 'val')
   *
   * @name change
   * @alias changes
   * @alias Change
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertChanges (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      initial !== object[prop]
      , 'expected .' + prop + ' to change'
      , 'expected .' + prop + ' to not change'
    );
  }

  Assertion.addChainableMethod('change', assertChanges);
  Assertion.addChainableMethod('changes', assertChanges);

  /**
   * ### .increase(function)
   *
   * Asserts that a function increases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     expect(fn).to.increase(obj, 'val');
   *
   * @name increase
   * @alias increases
   * @alias Increase
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertIncreases (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      object[prop] - initial > 0
      , 'expected .' + prop + ' to increase'
      , 'expected .' + prop + ' to not increase'
    );
  }

  Assertion.addChainableMethod('increase', assertIncreases);
  Assertion.addChainableMethod('increases', assertIncreases);

  /**
   * ### .decrease(function)
   *
   * Asserts that a function decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     expect(fn).to.decrease(obj, 'val');
   *
   * @name decrease
   * @alias decreases
   * @alias Decrease
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertDecreases (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      object[prop] - initial < 0
      , 'expected .' + prop + ' to decrease'
      , 'expected .' + prop + ' to not decrease'
    );
  }

  Assertion.addChainableMethod('decrease', assertDecreases);
  Assertion.addChainableMethod('decreases', assertDecreases);

  /**
   * ### .extensible
   *
   * Asserts that the target is extensible (can have new properties added to
   * it).
   *
   *     var nonExtensibleObject = Object.preventExtensions({});
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     expect({}).to.be.extensible;
   *     expect(nonExtensibleObject).to.not.be.extensible;
   *     expect(sealedObject).to.not.be.extensible;
   *     expect(frozenObject).to.not.be.extensible;
   *
   * @name extensible
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('extensible', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isExtensible;

    try {
      isExtensible = Object.isExtensible(obj);
    } catch (err) {
      if (err instanceof TypeError) isExtensible = false;
      else throw err;
    }

    this.assert(
      isExtensible
      , 'expected #{this} to be extensible'
      , 'expected #{this} to not be extensible'
    );
  });

  /**
   * ### .sealed
   *
   * Asserts that the target is sealed (cannot have new properties added to it
   * and its existing properties cannot be removed).
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     expect(sealedObject).to.be.sealed;
   *     expect(frozenObject).to.be.sealed;
   *     expect({}).to.not.be.sealed;
   *
   * @name sealed
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('sealed', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isSealed;

    try {
      isSealed = Object.isSealed(obj);
    } catch (err) {
      if (err instanceof TypeError) isSealed = true;
      else throw err;
    }

    this.assert(
      isSealed
      , 'expected #{this} to be sealed'
      , 'expected #{this} to not be sealed'
    );
  });

  /**
   * ### .frozen
   *
   * Asserts that the target is frozen (cannot have new properties added to it
   * and its existing properties cannot be modified).
   *
   *     var frozenObject = Object.freeze({});
   *
   *     expect(frozenObject).to.be.frozen;
   *     expect({}).to.not.be.frozen;
   *
   * @name frozen
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('frozen', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isFrozen;

    try {
      isFrozen = Object.isFrozen(obj);
    } catch (err) {
      if (err instanceof TypeError) isFrozen = true;
      else throw err;
    }

    this.assert(
      isFrozen
      , 'expected #{this} to be frozen'
      , 'expected #{this} to not be frozen'
    );
  });
};

},{}],9:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


module.exports = function (chai, util) {

  /*!
   * Chai dependencies.
   */

  var Assertion = chai.Assertion
    , flag = util.flag;

  /*!
   * Module export.
   */

  /**
   * ### assert(expression, message)
   *
   * Write your own test expressions.
   *
   *     assert('foo' !== 'bar', 'foo is not bar');
   *     assert(Array.isArray([]), 'empty arrays are arrays');
   *
   * @param {Mixed} expression to test for truthiness
   * @param {String} message to display on error
   * @name assert
   * @namespace Assert
   * @api public
   */

  var assert = chai.assert = function (express, errmsg) {
    var test = new Assertion(null, null, chai.assert);
    test.assert(
        express
      , errmsg
      , '[ negation message unavailable ]'
    );
  };

  /**
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure. Node.js `assert` module-compatible.
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace Assert
   * @api public
   */

  assert.fail = function (actual, expected, message, operator) {
    message = message || 'assert.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, assert.fail);
  };

  /**
   * ### .isOk(object, [message])
   *
   * Asserts that `object` is truthy.
   *
   *     assert.isOk('everything', 'everything is ok');
   *     assert.isOk(false, 'this will fail');
   *
   * @name isOk
   * @alias ok
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isOk = function (val, msg) {
    new Assertion(val, msg).is.ok;
  };

  /**
   * ### .isNotOk(object, [message])
   *
   * Asserts that `object` is falsy.
   *
   *     assert.isNotOk('everything', 'this will fail');
   *     assert.isNotOk(false, 'this will pass');
   *
   * @name isNotOk
   * @alias notOk
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotOk = function (val, msg) {
    new Assertion(val, msg).is.not.ok;
  };

  /**
   * ### .equal(actual, expected, [message])
   *
   * Asserts non-strict equality (`==`) of `actual` and `expected`.
   *
   *     assert.equal(3, '3', '== coerces values to strings');
   *
   * @name equal
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.equal = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.equal);

    test.assert(
        exp == flag(test, 'object')
      , 'expected #{this} to equal #{exp}'
      , 'expected #{this} to not equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .notEqual(actual, expected, [message])
   *
   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
   *
   *     assert.notEqual(3, 4, 'these numbers are not equal');
   *
   * @name notEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notEqual = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.notEqual);

    test.assert(
        exp != flag(test, 'object')
      , 'expected #{this} to not equal #{exp}'
      , 'expected #{this} to equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .strictEqual(actual, expected, [message])
   *
   * Asserts strict equality (`===`) of `actual` and `expected`.
   *
   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
   *
   * @name strictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.strictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.equal(exp);
  };

  /**
   * ### .notStrictEqual(actual, expected, [message])
   *
   * Asserts strict inequality (`!==`) of `actual` and `expected`.
   *
   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
   *
   * @name notStrictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.equal(exp);
  };

  /**
   * ### .deepEqual(actual, expected, [message])
   *
   * Asserts that `actual` is deeply equal to `expected`.
   *
   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
   *
   * @name deepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.eql(exp);
  };

  /**
   * ### .notDeepEqual(actual, expected, [message])
   *
   * Assert that `actual` is not deeply equal to `expected`.
   *
   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
   *
   * @name notDeepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.eql(exp);
  };

   /**
   * ### .isAbove(valueToCheck, valueToBeAbove, [message])
   *
   * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`
   *
   *     assert.isAbove(5, 2, '5 is strictly greater than 2');
   *
   * @name isAbove
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAbove
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAbove = function (val, abv, msg) {
    new Assertion(val, msg).to.be.above(abv);
  };

   /**
   * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
   *
   * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`
   *
   *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
   *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
   *
   * @name isAtLeast
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtLeast
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtLeast = function (val, atlst, msg) {
    new Assertion(val, msg).to.be.least(atlst);
  };

   /**
   * ### .isBelow(valueToCheck, valueToBeBelow, [message])
   *
   * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`
   *
   *     assert.isBelow(3, 6, '3 is strictly less than 6');
   *
   * @name isBelow
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeBelow
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBelow = function (val, blw, msg) {
    new Assertion(val, msg).to.be.below(blw);
  };

   /**
   * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
   *
   * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`
   *
   *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
   *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
   *
   * @name isAtMost
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtMost
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtMost = function (val, atmst, msg) {
    new Assertion(val, msg).to.be.most(atmst);
  };

  /**
   * ### .isTrue(value, [message])
   *
   * Asserts that `value` is true.
   *
   *     var teaServed = true;
   *     assert.isTrue(teaServed, 'the tea has been served');
   *
   * @name isTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isTrue = function (val, msg) {
    new Assertion(val, msg).is['true'];
  };

  /**
   * ### .isNotTrue(value, [message])
   *
   * Asserts that `value` is not true.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotTrue(tea, 'great, time for tea!');
   *
   * @name isNotTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotTrue = function (val, msg) {
    new Assertion(val, msg).to.not.equal(true);
  };

  /**
   * ### .isFalse(value, [message])
   *
   * Asserts that `value` is false.
   *
   *     var teaServed = false;
   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
   *
   * @name isFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFalse = function (val, msg) {
    new Assertion(val, msg).is['false'];
  };

  /**
   * ### .isNotFalse(value, [message])
   *
   * Asserts that `value` is not false.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotFalse(tea, 'great, time for tea!');
   *
   * @name isNotFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFalse = function (val, msg) {
    new Assertion(val, msg).to.not.equal(false);
  };

  /**
   * ### .isNull(value, [message])
   *
   * Asserts that `value` is null.
   *
   *     assert.isNull(err, 'there was no error');
   *
   * @name isNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNull = function (val, msg) {
    new Assertion(val, msg).to.equal(null);
  };

  /**
   * ### .isNotNull(value, [message])
   *
   * Asserts that `value` is not null.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotNull(tea, 'great, time for tea!');
   *
   * @name isNotNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNull = function (val, msg) {
    new Assertion(val, msg).to.not.equal(null);
  };

  /**
   * ### .isNaN
   * Asserts that value is NaN
   *
   *    assert.isNaN('foo', 'foo is NaN');
   *
   * @name isNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNaN = function (val, msg) {
    new Assertion(val, msg).to.be.NaN;
  };

  /**
   * ### .isNotNaN
   * Asserts that value is not NaN
   *
   *    assert.isNotNaN(4, '4 is not NaN');
   *
   * @name isNotNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */
  assert.isNotNaN = function (val, msg) {
    new Assertion(val, msg).not.to.be.NaN;
  };

  /**
   * ### .isUndefined(value, [message])
   *
   * Asserts that `value` is `undefined`.
   *
   *     var tea;
   *     assert.isUndefined(tea, 'no tea defined');
   *
   * @name isUndefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isUndefined = function (val, msg) {
    new Assertion(val, msg).to.equal(undefined);
  };

  /**
   * ### .isDefined(value, [message])
   *
   * Asserts that `value` is not `undefined`.
   *
   *     var tea = 'cup of chai';
   *     assert.isDefined(tea, 'tea has been defined');
   *
   * @name isDefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isDefined = function (val, msg) {
    new Assertion(val, msg).to.not.equal(undefined);
  };

  /**
   * ### .isFunction(value, [message])
   *
   * Asserts that `value` is a function.
   *
   *     function serveTea() { return 'cup of tea'; };
   *     assert.isFunction(serveTea, 'great, we can have tea now');
   *
   * @name isFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFunction = function (val, msg) {
    new Assertion(val, msg).to.be.a('function');
  };

  /**
   * ### .isNotFunction(value, [message])
   *
   * Asserts that `value` is _not_ a function.
   *
   *     var serveTea = [ 'heat', 'pour', 'sip' ];
   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
   *
   * @name isNotFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFunction = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('function');
  };

  /**
   * ### .isObject(value, [message])
   *
   * Asserts that `value` is an object of type 'Object' (as revealed by `Object.prototype.toString`).
   * _The assertion does not match subclassed objects._
   *
   *     var selection = { name: 'Chai', serve: 'with spices' };
   *     assert.isObject(selection, 'tea selection is an object');
   *
   * @name isObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isObject = function (val, msg) {
    new Assertion(val, msg).to.be.a('object');
  };

  /**
   * ### .isNotObject(value, [message])
   *
   * Asserts that `value` is _not_ an object of type 'Object' (as revealed by `Object.prototype.toString`).
   *
   *     var selection = 'chai'
   *     assert.isNotObject(selection, 'tea selection is not an object');
   *     assert.isNotObject(null, 'null is not an object');
   *
   * @name isNotObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotObject = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('object');
  };

  /**
   * ### .isArray(value, [message])
   *
   * Asserts that `value` is an array.
   *
   *     var menu = [ 'green', 'chai', 'oolong' ];
   *     assert.isArray(menu, 'what kind of tea do we want?');
   *
   * @name isArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isArray = function (val, msg) {
    new Assertion(val, msg).to.be.an('array');
  };

  /**
   * ### .isNotArray(value, [message])
   *
   * Asserts that `value` is _not_ an array.
   *
   *     var menu = 'green|chai|oolong';
   *     assert.isNotArray(menu, 'what kind of tea do we want?');
   *
   * @name isNotArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotArray = function (val, msg) {
    new Assertion(val, msg).to.not.be.an('array');
  };

  /**
   * ### .isString(value, [message])
   *
   * Asserts that `value` is a string.
   *
   *     var teaOrder = 'chai';
   *     assert.isString(teaOrder, 'order placed');
   *
   * @name isString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isString = function (val, msg) {
    new Assertion(val, msg).to.be.a('string');
  };

  /**
   * ### .isNotString(value, [message])
   *
   * Asserts that `value` is _not_ a string.
   *
   *     var teaOrder = 4;
   *     assert.isNotString(teaOrder, 'order placed');
   *
   * @name isNotString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotString = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('string');
  };

  /**
   * ### .isNumber(value, [message])
   *
   * Asserts that `value` is a number.
   *
   *     var cups = 2;
   *     assert.isNumber(cups, 'how many cups');
   *
   * @name isNumber
   * @param {Number} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNumber = function (val, msg) {
    new Assertion(val, msg).to.be.a('number');
  };

  /**
   * ### .isNotNumber(value, [message])
   *
   * Asserts that `value` is _not_ a number.
   *
   *     var cups = '2 cups please';
   *     assert.isNotNumber(cups, 'how many cups');
   *
   * @name isNotNumber
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNumber = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('number');
  };

  /**
   * ### .isBoolean(value, [message])
   *
   * Asserts that `value` is a boolean.
   *
   *     var teaReady = true
   *       , teaServed = false;
   *
   *     assert.isBoolean(teaReady, 'is the tea ready');
   *     assert.isBoolean(teaServed, 'has tea been served');
   *
   * @name isBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBoolean = function (val, msg) {
    new Assertion(val, msg).to.be.a('boolean');
  };

  /**
   * ### .isNotBoolean(value, [message])
   *
   * Asserts that `value` is _not_ a boolean.
   *
   *     var teaReady = 'yep'
   *       , teaServed = 'nope';
   *
   *     assert.isNotBoolean(teaReady, 'is the tea ready');
   *     assert.isNotBoolean(teaServed, 'has tea been served');
   *
   * @name isNotBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotBoolean = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('boolean');
  };

  /**
   * ### .typeOf(value, name, [message])
   *
   * Asserts that `value`'s type is `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
   *     assert.typeOf('tea', 'string', 'we have a string');
   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
   *     assert.typeOf(null, 'null', 'we have a null');
   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
   *
   * @name typeOf
   * @param {Mixed} value
   * @param {String} name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.typeOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.a(type);
  };

  /**
   * ### .notTypeOf(value, name, [message])
   *
   * Asserts that `value`'s type is _not_ `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
   *
   * @name notTypeOf
   * @param {Mixed} value
   * @param {String} typeof name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notTypeOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.a(type);
  };

  /**
   * ### .instanceOf(object, constructor, [message])
   *
   * Asserts that `value` is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new Tea('chai');
   *
   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
   *
   * @name instanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.instanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.instanceOf(type);
  };

  /**
   * ### .notInstanceOf(object, constructor, [message])
   *
   * Asserts `value` is not an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new String('chai');
   *
   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
   *
   * @name notInstanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInstanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.instanceOf(type);
  };

  /**
   * ### .include(haystack, needle, [message])
   *
   * Asserts that `haystack` includes `needle`. Works
   * for strings and arrays.
   *
   *     assert.include('foobar', 'bar', 'foobar contains string "bar"');
   *     assert.include([ 1, 2, 3 ], 3, 'array contains value');
   *
   * @name include
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.include = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.include).include(inc);
  };

  /**
   * ### .notInclude(haystack, needle, [message])
   *
   * Asserts that `haystack` does not include `needle`. Works
   * for strings and arrays.
   *
   *     assert.notInclude('foobar', 'baz', 'string not include substring');
   *     assert.notInclude([ 1, 2, 3 ], 4, 'array not include contain value');
   *
   * @name notInclude
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notInclude).not.include(inc);
  };

  /**
   * ### .match(value, regexp, [message])
   *
   * Asserts that `value` matches the regular expression `regexp`.
   *
   *     assert.match('foobar', /^foo/, 'regexp matches');
   *
   * @name match
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.match = function (exp, re, msg) {
    new Assertion(exp, msg).to.match(re);
  };

  /**
   * ### .notMatch(value, regexp, [message])
   *
   * Asserts that `value` does not match the regular expression `regexp`.
   *
   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
   *
   * @name notMatch
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notMatch = function (exp, re, msg) {
    new Assertion(exp, msg).to.not.match(re);
  };

  /**
   * ### .property(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`.
   *
   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
   *
   * @name property
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.property = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.property(prop);
  };

  /**
   * ### .notProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`.
   *
   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
   *
   * @name notProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.property(prop);
  };

  /**
   * ### .deepProperty(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`, which can be a
   * string using dot- and bracket-notation for deep reference.
   *
   *     assert.deepProperty({ tea: { green: 'matcha' }}, 'tea.green');
   *
   * @name deepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop);
  };

  /**
   * ### .notDeepProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`, which
   * can be a string using dot- and bracket-notation for deep reference.
   *
   *     assert.notDeepProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
   *
   * @name notDeepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop);
  };

  /**
   * ### .propertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`.
   *
   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
   *
   * @name propertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.propertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.property(prop, val);
  };

  /**
   * ### .propertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`.
   *
   *     assert.propertyNotVal({ tea: 'is good' }, 'tea', 'is bad');
   *
   * @name propertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.propertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.property(prop, val);
  };

  /**
   * ### .deepPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`. `property` can use dot- and bracket-notation for deep
   * reference.
   *
   *     assert.deepPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
   *
   * @name deepPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop, val);
  };

  /**
   * ### .deepPropertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`. `property` can use dot- and
   * bracket-notation for deep reference.
   *
   *     assert.deepPropertyNotVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
   *
   * @name deepPropertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepPropertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop, val);
  };

  /**
   * ### .lengthOf(object, length, [message])
   *
   * Asserts that `object` has a `length` property with the expected value.
   *
   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
   *     assert.lengthOf('foobar', 6, 'string has length of 6');
   *
   * @name lengthOf
   * @param {Mixed} object
   * @param {Number} length
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.lengthOf = function (exp, len, msg) {
    new Assertion(exp, msg).to.have.length(len);
  };

  /**
   * ### .throws(function, [constructor/string/regexp], [string/regexp], [message])
   *
   * Asserts that `function` will throw an error that is an instance of
   * `constructor`, or alternately that it will throw an error with message
   * matching `regexp`.
   *
   *     assert.throws(fn, 'function throws a reference error');
   *     assert.throws(fn, /function throws a reference error/);
   *     assert.throws(fn, ReferenceError);
   *     assert.throws(fn, ReferenceError, 'function throws a reference error');
   *     assert.throws(fn, ReferenceError, /function throws a reference error/);
   *
   * @name throws
   * @alias throw
   * @alias Throw
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.throws = function (fn, errt, errs, msg) {
    if ('string' === typeof errt || errt instanceof RegExp) {
      errs = errt;
      errt = null;
    }

    var assertErr = new Assertion(fn, msg).to.throw(errt, errs);
    return flag(assertErr, 'object');
  };

  /**
   * ### .doesNotThrow(function, [constructor/regexp], [message])
   *
   * Asserts that `function` will _not_ throw an error that is an instance of
   * `constructor`, or alternately that it will not throw an error with message
   * matching `regexp`.
   *
   *     assert.doesNotThrow(fn, Error, 'function does not throw');
   *
   * @name doesNotThrow
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.doesNotThrow = function (fn, type, msg) {
    if ('string' === typeof type) {
      msg = type;
      type = null;
    }

    new Assertion(fn, msg).to.not.Throw(type);
  };

  /**
   * ### .operator(val1, operator, val2, [message])
   *
   * Compares two values using `operator`.
   *
   *     assert.operator(1, '<', 2, 'everything is ok');
   *     assert.operator(1, '>', 2, 'this will fail');
   *
   * @name operator
   * @param {Mixed} val1
   * @param {String} operator
   * @param {Mixed} val2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.operator = function (val, operator, val2, msg) {
    var ok;
    switch(operator) {
      case '==':
        ok = val == val2;
        break;
      case '===':
        ok = val === val2;
        break;
      case '>':
        ok = val > val2;
        break;
      case '>=':
        ok = val >= val2;
        break;
      case '<':
        ok = val < val2;
        break;
      case '<=':
        ok = val <= val2;
        break;
      case '!=':
        ok = val != val2;
        break;
      case '!==':
        ok = val !== val2;
        break;
      default:
        throw new Error('Invalid operator "' + operator + '"');
    }
    var test = new Assertion(ok, msg);
    test.assert(
        true === flag(test, 'object')
      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
  };

  /**
   * ### .closeTo(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
   *
   * @name closeTo
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.closeTo = function (act, exp, delta, msg) {
    new Assertion(act, msg).to.be.closeTo(exp, delta);
  };

  /**
   * ### .approximately(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.approximately(1.5, 1, 0.5, 'numbers are close');
   *
   * @name approximately
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.approximately = function (act, exp, delta, msg) {
    new Assertion(act, msg).to.be.approximately(exp, delta);
  };

  /**
   * ### .sameMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members.
   * Order is not taken into account.
   *
   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
   *
   * @name sameMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg).to.have.same.members(set2);
  }

  /**
   * ### .sameDeepMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members - using a deep equality checking.
   * Order is not taken into account.
   *
   *     assert.sameDeepMembers([ {b: 3}, {a: 2}, {c: 5} ], [ {c: 5}, {b: 3}, {a: 2} ], 'same deep members');
   *
   * @name sameDeepMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameDeepMembers = function (set1, set2, msg) {
    new Assertion(set1, msg).to.have.same.deep.members(set2);
  }

  /**
   * ### .includeMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset`.
   * Order is not taken into account.
   *
   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1 ], 'include members');
   *
   * @name includeMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg).to.include.members(subset);
  }

  /**
   * ### .includeDeepMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset` - using deep equality checking.
   * Order is not taken into account.
   * Duplicates are ignored.
   *
   *     assert.includeDeepMembers([ {a: 1}, {b: 2}, {c: 3} ], [ {b: 2}, {a: 1}, {b: 2} ], 'include deep members');
   *
   * @name includeDeepMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeDeepMembers = function (superset, subset, msg) {
    new Assertion(superset, msg).to.include.deep.members(subset);
  }

  /**
   * ### .oneOf(inList, list, [message])
   *
   * Asserts that non-object, non-array value `inList` appears in the flat array `list`.
   *
   *     assert.oneOf(1, [ 2, 1 ], 'Not found in list');
   *
   * @name oneOf
   * @param {*} inList
   * @param {Array<*>} list
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.oneOf = function (inList, list, msg) {
    new Assertion(inList, msg).to.be.oneOf(list);
  }

   /**
   * ### .changes(function, object, property)
   *
   * Asserts that a function changes the value of a property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 22 };
   *     assert.changes(fn, obj, 'val');
   *
   * @name changes
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.changes = function (fn, obj, prop) {
    new Assertion(fn).to.change(obj, prop);
  }

   /**
   * ### .doesNotChange(function, object, property)
   *
   * Asserts that a function does not changes the value of a property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { console.log('foo'); };
   *     assert.doesNotChange(fn, obj, 'val');
   *
   * @name doesNotChange
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotChange = function (fn, obj, prop) {
    new Assertion(fn).to.not.change(obj, prop);
  }

   /**
   * ### .increases(function, object, property)
   *
   * Asserts that a function increases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 13 };
   *     assert.increases(fn, obj, 'val');
   *
   * @name increases
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.increases = function (fn, obj, prop) {
    new Assertion(fn).to.increase(obj, prop);
  }

   /**
   * ### .doesNotIncrease(function, object, property)
   *
   * Asserts that a function does not increase object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 8 };
   *     assert.doesNotIncrease(fn, obj, 'val');
   *
   * @name doesNotIncrease
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotIncrease = function (fn, obj, prop) {
    new Assertion(fn).to.not.increase(obj, prop);
  }

   /**
   * ### .decreases(function, object, property)
   *
   * Asserts that a function decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     assert.decreases(fn, obj, 'val');
   *
   * @name decreases
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.decreases = function (fn, obj, prop) {
    new Assertion(fn).to.decrease(obj, prop);
  }

   /**
   * ### .doesNotDecrease(function, object, property)
   *
   * Asserts that a function does not decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     assert.doesNotDecrease(fn, obj, 'val');
   *
   * @name doesNotDecrease
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotDecrease = function (fn, obj, prop) {
    new Assertion(fn).to.not.decrease(obj, prop);
  }

  /*!
   * ### .ifError(object)
   *
   * Asserts if value is not a false value, and throws if it is a true value.
   * This is added to allow for chai to be a drop-in replacement for Node's
   * assert class.
   *
   *     var err = new Error('I am a custom error');
   *     assert.ifError(err); // Rethrows err!
   *
   * @name ifError
   * @param {Object} object
   * @namespace Assert
   * @api public
   */

  assert.ifError = function (val) {
    if (val) {
      throw(val);
    }
  };

  /**
   * ### .isExtensible(object)
   *
   * Asserts that `object` is extensible (can have new properties added to it).
   *
   *     assert.isExtensible({});
   *
   * @name isExtensible
   * @alias extensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isExtensible = function (obj, msg) {
    new Assertion(obj, msg).to.be.extensible;
  };

  /**
   * ### .isNotExtensible(object)
   *
   * Asserts that `object` is _not_ extensible.
   *
   *     var nonExtensibleObject = Object.preventExtensions({});
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freese({});
   *
   *     assert.isNotExtensible(nonExtensibleObject);
   *     assert.isNotExtensible(sealedObject);
   *     assert.isNotExtensible(frozenObject);
   *
   * @name isNotExtensible
   * @alias notExtensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotExtensible = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.extensible;
  };

  /**
   * ### .isSealed(object)
   *
   * Asserts that `object` is sealed (cannot have new properties added to it
   * and its existing properties cannot be removed).
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.seal({});
   *
   *     assert.isSealed(sealedObject);
   *     assert.isSealed(frozenObject);
   *
   * @name isSealed
   * @alias sealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isSealed = function (obj, msg) {
    new Assertion(obj, msg).to.be.sealed;
  };

  /**
   * ### .isNotSealed(object)
   *
   * Asserts that `object` is _not_ sealed.
   *
   *     assert.isNotSealed({});
   *
   * @name isNotSealed
   * @alias notSealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotSealed = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.sealed;
  };

  /**
   * ### .isFrozen(object)
   *
   * Asserts that `object` is frozen (cannot have new properties added to it
   * and its existing properties cannot be modified).
   *
   *     var frozenObject = Object.freeze({});
   *     assert.frozen(frozenObject);
   *
   * @name isFrozen
   * @alias frozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isFrozen = function (obj, msg) {
    new Assertion(obj, msg).to.be.frozen;
  };

  /**
   * ### .isNotFrozen(object)
   *
   * Asserts that `object` is _not_ frozen.
   *
   *     assert.isNotFrozen({});
   *
   * @name isNotFrozen
   * @alias notFrozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotFrozen = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.frozen;
  };

  /*!
   * Aliases.
   */

  (function alias(name, as){
    assert[as] = assert[name];
    return alias;
  })
  ('isOk', 'ok')
  ('isNotOk', 'notOk')
  ('throws', 'throw')
  ('throws', 'Throw')
  ('isExtensible', 'extensible')
  ('isNotExtensible', 'notExtensible')
  ('isSealed', 'sealed')
  ('isNotSealed', 'notSealed')
  ('isFrozen', 'frozen')
  ('isNotFrozen', 'notFrozen');
};

},{}],10:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  chai.expect = function (val, message) {
    return new chai.Assertion(val, message);
  };

  /**
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure.
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace Expect
   * @api public
   */

  chai.expect.fail = function (actual, expected, message, operator) {
    message = message || 'expect.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, chai.expect.fail);
  };
};

},{}],11:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  var Assertion = chai.Assertion;

  function loadShould () {
    // explicitly define this method as function as to have it's name to include as `ssfi`
    function shouldGetter() {
      if (this instanceof String || this instanceof Number || this instanceof Boolean ) {
        return new Assertion(this.valueOf(), null, shouldGetter);
      }
      return new Assertion(this, null, shouldGetter);
    }
    function shouldSetter(value) {
      // See https://github.com/chaijs/chai/issues/86: this makes
      // `whatever.should = someValue` actually set `someValue`, which is
      // especially useful for `global.should = require('chai').should()`.
      //
      // Note that we have to use [[DefineProperty]] instead of [[Put]]
      // since otherwise we would trigger this very setter!
      Object.defineProperty(this, 'should', {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    // modify Object.prototype to have `should`
    Object.defineProperty(Object.prototype, 'should', {
      set: shouldSetter
      , get: shouldGetter
      , configurable: true
    });

    var should = {};

    /**
     * ### .fail(actual, expected, [message], [operator])
     *
     * Throw a failure.
     *
     * @name fail
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @param {String} operator
     * @namespace Should
     * @api public
     */

    should.fail = function (actual, expected, message, operator) {
      message = message || 'should.fail()';
      throw new chai.AssertionError(message, {
          actual: actual
        , expected: expected
        , operator: operator
      }, should.fail);
    };

    /**
     * ### .equal(actual, expected, [message])
     *
     * Asserts non-strict equality (`==`) of `actual` and `expected`.
     *
     *     should.equal(3, '3', '== coerces values to strings');
     *
     * @name equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/string/regexp], [string/regexp], [message])
     *
     * Asserts that `function` will throw an error that is an instance of
     * `constructor`, or alternately that it will throw an error with message
     * matching `regexp`.
     *
     *     should.throw(fn, 'function throws a reference error');
     *     should.throw(fn, /function throws a reference error/);
     *     should.throw(fn, ReferenceError);
     *     should.throw(fn, ReferenceError, 'function throws a reference error');
     *     should.throw(fn, ReferenceError, /function throws a reference error/);
     *
     * @name throw
     * @alias Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.Throw(errt, errs);
    };

    /**
     * ### .exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var foo = 'hi';
     *
     *     should.exist(foo, 'foo exists');
     *
     * @name exist
     * @namespace Should
     * @api public
     */

    should.exist = function (val, msg) {
      new Assertion(val, msg).to.exist;
    }

    // negation
    should.not = {}

    /**
     * ### .not.equal(actual, expected, [message])
     *
     * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
     *
     *     should.not.equal(3, 4, 'these numbers are not equal');
     *
     * @name not.equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.not.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.not.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/regexp], [message])
     *
     * Asserts that `function` will _not_ throw an error that is an instance of
     * `constructor`, or alternately that it will not throw an error with message
     * matching `regexp`.
     *
     *     should.not.throw(fn, Error, 'function does not throw');
     *
     * @name not.throw
     * @alias not.Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.not.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.not.Throw(errt, errs);
    };

    /**
     * ### .not.exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var bar = null;
     *
     *     should.not.exist(bar, 'bar does not exist');
     *
     * @name not.exist
     * @namespace Should
     * @api public
     */

    should.not.exist = function (val, msg) {
      new Assertion(val, msg).to.not.exist;
    }

    should['throw'] = should['Throw'];
    should.not['throw'] = should.not['Throw'];

    return should;
  };

  chai.should = loadShould;
  chai.Should = loadShould;
};

},{}],12:[function(require,module,exports){
/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var transferFlags = require('./transferFlags');
var flag = require('./flag');
var config = require('../config');

/*!
 * Module variables
 */

// Check whether `__proto__` is supported
var hasProtoSupport = '__proto__' in Object;

// Without `__proto__` support, this module will need to add properties to a function.
// However, some Function.prototype methods cannot be overwritten,
// and there seems no easy cross-platform way to detect them (@see chaijs/chai/issues/69).
var excludeNames = /^(?:length|name|arguments|caller)$/;

// Cache `Function` properties
var call  = Function.prototype.call,
    apply = Function.prototype.apply;

/**
 * ### addChainableMethod (ctx, name, method, chainingBehavior)
 *
 * Adds a method to an object, such that the method can also be chained.
 *
 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
 *
 * The result can then be used as both a method assertion, executing both `method` and
 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
 *
 *     expect(fooStr).to.be.foo('bar');
 *     expect(fooStr).to.be.foo.equal('foo');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for `name`, when called
 * @param {Function} chainingBehavior function to be called every time the property is accessed
 * @namespace Utils
 * @name addChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== 'function') {
    chainingBehavior = function () { };
  }

  var chainableBehavior = {
      method: method
    , chainingBehavior: chainingBehavior
  };

  // save the methods so we can overwrite them later, if we need to.
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;

  Object.defineProperty(ctx, name,
    { get: function () {
        chainableBehavior.chainingBehavior.call(this);

        var assert = function assert() {
          var old_ssfi = flag(this, 'ssfi');
          if (old_ssfi && config.includeStack === false)
            flag(this, 'ssfi', assert);
          var result = chainableBehavior.method.apply(this, arguments);
          return result === undefined ? this : result;
        };

        // Use `__proto__` if available
        if (hasProtoSupport) {
          // Inherit all properties from the object by replacing the `Function` prototype
          var prototype = assert.__proto__ = Object.create(this);
          // Restore the `call` and `apply` methods from `Function`
          prototype.call = call;
          prototype.apply = apply;
        }
        // Otherwise, redefine all properties (slow!)
        else {
          var asserterNames = Object.getOwnPropertyNames(ctx);
          asserterNames.forEach(function (asserterName) {
            if (!excludeNames.test(asserterName)) {
              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
              Object.defineProperty(assert, asserterName, pd);
            }
          });
        }

        transferFlags(this, assert);
        return assert;
      }
    , configurable: true
  });
};

},{"../config":7,"./flag":16,"./transferFlags":32}],13:[function(require,module,exports){
/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = require('../config');

/**
 * ### .addMethod (ctx, name, method)
 *
 * Adds a method to the prototype of an object.
 *
 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(fooStr).to.be.foo('bar');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for name
 * @namespace Utils
 * @name addMethod
 * @api public
 */
var flag = require('./flag');

module.exports = function (ctx, name, method) {
  ctx[name] = function () {
    var old_ssfi = flag(this, 'ssfi');
    if (old_ssfi && config.includeStack === false)
      flag(this, 'ssfi', ctx[name]);
    var result = method.apply(this, arguments);
    return result === undefined ? this : result;
  };
};

},{"../config":7,"./flag":16}],14:[function(require,module,exports){
/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = require('../config');
var flag = require('./flag');

/**
 * ### addProperty (ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @namespace Utils
 * @name addProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  Object.defineProperty(ctx, name,
    { get: function addProperty() {
        var old_ssfi = flag(this, 'ssfi');
        if (old_ssfi && config.includeStack === false)
          flag(this, 'ssfi', addProperty);

        var result = getter.call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};

},{"../config":7,"./flag":16}],15:[function(require,module,exports){
/*!
 * Chai - expectTypes utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### expectTypes(obj, types)
 *
 * Ensures that the object being tested against is of a valid type.
 *
 *     utils.expectTypes(this, ['array', 'object', 'string']);
 *
 * @param {Mixed} obj constructed Assertion
 * @param {Array} type A list of allowed types for this assertion
 * @namespace Utils
 * @name expectTypes
 * @api public
 */

var AssertionError = require('assertion-error');
var flag = require('./flag');
var type = require('type-detect');

module.exports = function (obj, types) {
  var obj = flag(obj, 'object');
  types = types.map(function (t) { return t.toLowerCase(); });
  types.sort();

  // Transforms ['lorem', 'ipsum'] into 'a lirum, or an ipsum'
  var str = types.map(function (t, index) {
    var art = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(t.charAt(0)) ? 'an' : 'a';
    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
    return or + art + ' ' + t;
  }).join(', ');

  if (!types.some(function (expected) { return type(obj) === expected; })) {
    throw new AssertionError(
      'object tested must be ' + str + ', but ' + type(obj) + ' given'
    );
  }
};

},{"./flag":16,"assertion-error":1,"type-detect":39}],16:[function(require,module,exports){
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### flag(object, key, [value])
 *
 * Get or set a flag value on an object. If a
 * value is provided it will be set, else it will
 * return the currently set value or `undefined` if
 * the value is not set.
 *
 *     utils.flag(this, 'foo', 'bar'); // setter
 *     utils.flag(this, 'foo'); // getter, returns `bar`
 *
 * @param {Object} object constructed Assertion
 * @param {String} key
 * @param {Mixed} value (optional)
 * @namespace Utils
 * @name flag
 * @api private
 */

module.exports = function (obj, key, value) {
  var flags = obj.__flags || (obj.__flags = Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
};

},{}],17:[function(require,module,exports){
/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getActual(object, [actual])
 *
 * Returns the `actual` value for an Assertion
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getActual
 */

module.exports = function (obj, args) {
  return args.length > 4 ? args[4] : obj._obj;
};

},{}],18:[function(require,module,exports){
/*!
 * Chai - getEnumerableProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getEnumerableProperties(object)
 *
 * This allows the retrieval of enumerable property names of an object,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getEnumerableProperties
 * @api public
 */

module.exports = function getEnumerableProperties(object) {
  var result = [];
  for (var name in object) {
    result.push(name);
  }
  return result;
};

},{}],19:[function(require,module,exports){
/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = require('./flag')
  , getActual = require('./getActual')
  , inspect = require('./inspect')
  , objDisplay = require('./objDisplay');

/**
 * ### .getMessage(object, message, negateMessage)
 *
 * Construct the error message based on flags
 * and template tags. Template tags will return
 * a stringified inspection of the object referenced.
 *
 * Message template tags:
 * - `#{this}` current asserted object
 * - `#{act}` actual value
 * - `#{exp}` expected value
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getMessage
 * @api public
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , val = flag(obj, 'object')
    , expected = args[3]
    , actual = getActual(obj, args)
    , msg = negate ? args[2] : args[1]
    , flagMsg = flag(obj, 'message');

  if(typeof msg === "function") msg = msg();
  msg = msg || '';
  msg = msg
    .replace(/#\{this\}/g, function () { return objDisplay(val); })
    .replace(/#\{act\}/g, function () { return objDisplay(actual); })
    .replace(/#\{exp\}/g, function () { return objDisplay(expected); });

  return flagMsg ? flagMsg + ': ' + msg : msg;
};

},{"./flag":16,"./getActual":17,"./inspect":26,"./objDisplay":27}],20:[function(require,module,exports){
/*!
 * Chai - getName utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getName(func)
 *
 * Gets the name of a function, in a cross-browser way.
 *
 * @param {Function} a function (usually a constructor)
 * @namespace Utils
 * @name getName
 */

module.exports = function (func) {
  if (func.name) return func.name;

  var match = /^\s?function ([^(]*)\(/.exec(func);
  return match && match[1] ? match[1] : "";
};

},{}],21:[function(require,module,exports){
/*!
 * Chai - getPathInfo utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var hasProperty = require('./hasProperty');

/**
 * ### .getPathInfo(path, object)
 *
 * This allows the retrieval of property info in an
 * object given a string path.
 *
 * The path info consists of an object with the
 * following properties:
 *
 * * parent - The parent object of the property referenced by `path`
 * * name - The name of the final property, a number if it was an array indexer
 * * value - The value of the property, if it exists, otherwise `undefined`
 * * exists - Whether the property exists or not
 *
 * @param {String} path
 * @param {Object} object
 * @returns {Object} info
 * @namespace Utils
 * @name getPathInfo
 * @api public
 */

module.exports = function getPathInfo(path, obj) {
  var parsed = parsePath(path),
      last = parsed[parsed.length - 1];

  var info = {
    parent: parsed.length > 1 ? _getPathValue(parsed, obj, parsed.length - 1) : obj,
    name: last.p || last.i,
    value: _getPathValue(parsed, obj)
  };
  info.exists = hasProperty(info.name, info.parent);

  return info;
};


/*!
 * ## parsePath(path)
 *
 * Helper function used to parse string object
 * paths. Use in conjunction with `_getPathValue`.
 *
 *      var parsed = parsePath('myobject.property.subprop');
 *
 * ### Paths:
 *
 * * Can be as near infinitely deep and nested
 * * Arrays are also valid using the formal `myobject.document[3].property`.
 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
 *
 * @param {String} path
 * @returns {Object} parsed
 * @api private
 */

function parsePath (path) {
  var str = path.replace(/([^\\])\[/g, '$1.[')
    , parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function (value) {
    var re = /^\[(\d+)\]$/
      , mArr = re.exec(value);
    if (mArr) return { i: parseFloat(mArr[1]) };
    else return { p: value.replace(/\\([.\[\]])/g, '$1') };
  });
}


/*!
 * ## _getPathValue(parsed, obj)
 *
 * Helper companion function for `.parsePath` that returns
 * the value located at the parsed address.
 *
 *      var value = getPathValue(parsed, obj);
 *
 * @param {Object} parsed definition from `parsePath`.
 * @param {Object} object to search against
 * @param {Number} object to search against
 * @returns {Object|Undefined} value
 * @api private
 */

function _getPathValue (parsed, obj, index) {
  var tmp = obj
    , res;

  index = (index === undefined ? parsed.length : index);

  for (var i = 0, l = index; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('undefined' !== typeof part.p)
        tmp = tmp[part.p];
      else if ('undefined' !== typeof part.i)
        tmp = tmp[part.i];
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
}

},{"./hasProperty":24}],22:[function(require,module,exports){
/*!
 * Chai - getPathValue utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * @see https://github.com/logicalparadox/filtr
 * MIT Licensed
 */

var getPathInfo = require('./getPathInfo');

/**
 * ### .getPathValue(path, object)
 *
 * This allows the retrieval of values in an
 * object given a string path.
 *
 *     var obj = {
 *         prop1: {
 *             arr: ['a', 'b', 'c']
 *           , str: 'Hello'
 *         }
 *       , prop2: {
 *             arr: [ { nested: 'Universe' } ]
 *           , str: 'Hello again!'
 *         }
 *     }
 *
 * The following would be the results.
 *
 *     getPathValue('prop1.str', obj); // Hello
 *     getPathValue('prop1.att[2]', obj); // b
 *     getPathValue('prop2.arr[0].nested', obj); // Universe
 *
 * @param {String} path
 * @param {Object} object
 * @returns {Object} value or `undefined`
 * @namespace Utils
 * @name getPathValue
 * @api public
 */
module.exports = function(path, obj) {
  var info = getPathInfo(path, obj);
  return info.value;
};

},{"./getPathInfo":21}],23:[function(require,module,exports){
/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getProperties(object)
 *
 * This allows the retrieval of property names of an object, enumerable or not,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getProperties
 * @api public
 */

module.exports = function getProperties(object) {
  var result = Object.getOwnPropertyNames(object);

  function addProperty(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }

  var proto = Object.getPrototypeOf(object);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty);
    proto = Object.getPrototypeOf(proto);
  }

  return result;
};

},{}],24:[function(require,module,exports){
/*!
 * Chai - hasProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var type = require('type-detect');

/**
 * ### .hasProperty(object, name)
 *
 * This allows checking whether an object has
 * named property or numeric array index.
 *
 * Basically does the same thing as the `in`
 * operator but works properly with natives
 * and null/undefined values.
 *
 *     var obj = {
 *         arr: ['a', 'b', 'c']
 *       , str: 'Hello'
 *     }
 *
 * The following would be the results.
 *
 *     hasProperty('str', obj);  // true
 *     hasProperty('constructor', obj);  // true
 *     hasProperty('bar', obj);  // false
 *
 *     hasProperty('length', obj.str); // true
 *     hasProperty(1, obj.str);  // true
 *     hasProperty(5, obj.str);  // false
 *
 *     hasProperty('length', obj.arr);  // true
 *     hasProperty(2, obj.arr);  // true
 *     hasProperty(3, obj.arr);  // false
 *
 * @param {Objuect} object
 * @param {String|Number} name
 * @returns {Boolean} whether it exists
 * @namespace Utils
 * @name getPathInfo
 * @api public
 */

var literals = {
    'number': Number
  , 'string': String
};

module.exports = function hasProperty(name, obj) {
  var ot = type(obj);

  // Bad Object, obviously no props at all
  if(ot === 'null' || ot === 'undefined')
    return false;

  // The `in` operator does not work with certain literals
  // box these before the check
  if(literals[ot] && typeof obj !== 'object')
    obj = new literals[ot](obj);

  return name in obj;
};

},{"type-detect":39}],25:[function(require,module,exports){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Main exports
 */

var exports = module.exports = {};

/*!
 * test utility
 */

exports.test = require('./test');

/*!
 * type utility
 */

exports.type = require('type-detect');

/*!
 * expectTypes utility
 */
exports.expectTypes = require('./expectTypes');

/*!
 * message utility
 */

exports.getMessage = require('./getMessage');

/*!
 * actual utility
 */

exports.getActual = require('./getActual');

/*!
 * Inspect util
 */

exports.inspect = require('./inspect');

/*!
 * Object Display util
 */

exports.objDisplay = require('./objDisplay');

/*!
 * Flag utility
 */

exports.flag = require('./flag');

/*!
 * Flag transferring utility
 */

exports.transferFlags = require('./transferFlags');

/*!
 * Deep equal utility
 */

exports.eql = require('deep-eql');

/*!
 * Deep path value
 */

exports.getPathValue = require('./getPathValue');

/*!
 * Deep path info
 */

exports.getPathInfo = require('./getPathInfo');

/*!
 * Check if a property exists
 */

exports.hasProperty = require('./hasProperty');

/*!
 * Function name
 */

exports.getName = require('./getName');

/*!
 * add Property
 */

exports.addProperty = require('./addProperty');

/*!
 * add Method
 */

exports.addMethod = require('./addMethod');

/*!
 * overwrite Property
 */

exports.overwriteProperty = require('./overwriteProperty');

/*!
 * overwrite Method
 */

exports.overwriteMethod = require('./overwriteMethod');

/*!
 * Add a chainable method
 */

exports.addChainableMethod = require('./addChainableMethod');

/*!
 * Overwrite chainable method
 */

exports.overwriteChainableMethod = require('./overwriteChainableMethod');

},{"./addChainableMethod":12,"./addMethod":13,"./addProperty":14,"./expectTypes":15,"./flag":16,"./getActual":17,"./getMessage":19,"./getName":20,"./getPathInfo":21,"./getPathValue":22,"./hasProperty":24,"./inspect":26,"./objDisplay":27,"./overwriteChainableMethod":28,"./overwriteMethod":29,"./overwriteProperty":30,"./test":31,"./transferFlags":32,"deep-eql":33,"type-detect":39}],26:[function(require,module,exports){
// This is (almost) directly from Node.js utils
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

var getName = require('./getName');
var getProperties = require('./getProperties');
var getEnumerableProperties = require('./getEnumerableProperties');

module.exports = inspect;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 * @namespace Utils
 * @name inspect
 */
function inspect(obj, showHidden, depth, colors) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: function (str) { return str; }
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}

// Returns true if object is a DOM element.
var isDOMElement = function (object) {
  if (typeof HTMLElement === 'object') {
    return object instanceof HTMLElement;
  } else {
    return object &&
      typeof object === 'object' &&
      object.nodeType === 1 &&
      typeof object.nodeName === 'string';
  }
};

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (typeof ret !== 'string') {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // If this is a DOM element, try to get the outer HTML.
  if (isDOMElement(value)) {
    if ('outerHTML' in value) {
      return value.outerHTML;
      // This value does not have an outerHTML attribute,
      //   it could still be an XML element
    } else {
      // Attempt to serialize it
      try {
        if (document.xmlVersion) {
          var xmlSerializer = new XMLSerializer();
          return xmlSerializer.serializeToString(value);
        } else {
          // Firefox 11- do not support outerHTML
          //   It does, however, support innerHTML
          //   Use the following to render the element
          var ns = "http://www.w3.org/1999/xhtml";
          var container = document.createElementNS(ns, '_');

          container.appendChild(value.cloneNode(false));
          html = container.innerHTML
            .replace('><', '>' + value.innerHTML + '<');
          container.innerHTML = '';
          return html;
        }
      } catch (err) {
        // This could be a non-native DOM implementation,
        //   continue with the normal flow:
        //   printing the element as if it is an object.
      }
    }
  }

  // Look up the keys of the object.
  var visibleKeys = getEnumerableProperties(value);
  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;

  // Some type of object without properties can be shortcutted.
  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,
  // a `stack` plus `description` property; ignore those for consistency.
  if (keys.length === 0 || (isError(value) && (
      (keys.length === 1 && keys[0] === 'stack') ||
      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')
     ))) {
    if (typeof value === 'function') {
      var name = getName(value);
      var nameSuffix = name ? ': ' + name : '';
      return ctx.stylize('[Function' + nameSuffix + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (typeof value === 'function') {
    var name = getName(value);
    var nameSuffix = name ? ': ' + name : '';
    base = ' [Function' + nameSuffix + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    return formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      if (value === 0 && (1/value) === -Infinity) {
        return ctx.stylize('-0', 'number');
      }
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str;
  if (value.__lookupGetter__) {
    if (value.__lookupGetter__(key)) {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
  }
  if (visibleKeys.indexOf(key) < 0) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(value[key]) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, value[key], null);
      } else {
        str = formatValue(ctx, value[key], recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}

function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}

function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

},{"./getEnumerableProperties":18,"./getName":20,"./getProperties":23}],27:[function(require,module,exports){
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var inspect = require('./inspect');
var config = require('../config');

/**
 * ### .objDisplay (object)
 *
 * Determines if an object or an array matches
 * criteria to be inspected in-line for error
 * messages or should be truncated.
 *
 * @param {Mixed} javascript object to inspect
 * @name objDisplay
 * @namespace Utils
 * @api public
 */

module.exports = function (obj) {
  var str = inspect(obj)
    , type = Object.prototype.toString.call(obj);

  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type === '[object Function]') {
      return !obj.name || obj.name === ''
        ? '[Function]'
        : '[Function: ' + obj.name + ']';
    } else if (type === '[object Array]') {
      return '[ Array(' + obj.length + ') ]';
    } else if (type === '[object Object]') {
      var keys = Object.keys(obj)
        , kstr = keys.length > 2
          ? keys.splice(0, 2).join(', ') + ', ...'
          : keys.join(', ');
      return '{ Object (' + kstr + ') }';
    } else {
      return str;
    }
  } else {
    return str;
  }
};

},{"../config":7,"./inspect":26}],28:[function(require,module,exports){
/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteChainableMethod (ctx, name, method, chainingBehavior)
 *
 * Overwites an already existing chainable method
 * and provides access to the previous function or
 * property.  Must return functions to be used for
 * name.
 *
 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'length',
 *       function (_super) {
 *       }
 *     , function (_super) {
 *       }
 *     );
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.have.length(3);
 *     expect(myFoo).to.have.length.above(3);
 *
 * @param {Object} ctx object whose method / property is to be overwritten
 * @param {String} name of method / property to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @param {Function} chainingBehavior function that returns a function to be used for property
 * @namespace Utils
 * @name overwriteChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  var chainableBehavior = ctx.__methods[name];

  var _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = function () {
    var result = chainingBehavior(_chainingBehavior).call(this);
    return result === undefined ? this : result;
  };

  var _method = chainableBehavior.method;
  chainableBehavior.method = function () {
    var result = method(_method).apply(this, arguments);
    return result === undefined ? this : result;
  };
};

},{}],29:[function(require,module,exports){
/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteMethod (ctx, name, fn)
 *
 * Overwites an already existing method and provides
 * access to previous function. Must return function
 * to be used for name.
 *
 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
 *       return function (str) {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.value).to.equal(str);
 *         } else {
 *           _super.apply(this, arguments);
 *         }
 *       }
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.equal('bar');
 *
 * @param {Object} ctx object whose method is to be overwritten
 * @param {String} name of method to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @namespace Utils
 * @name overwriteMethod
 * @api public
 */

module.exports = function (ctx, name, method) {
  var _method = ctx[name]
    , _super = function () { return this; };

  if (_method && 'function' === typeof _method)
    _super = _method;

  ctx[name] = function () {
    var result = method(_super).apply(this, arguments);
    return result === undefined ? this : result;
  }
};

},{}],30:[function(require,module,exports){
/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteProperty (ctx, name, fn)
 *
 * Overwites an already existing property getter and provides
 * access to previous value. Must return function to use as getter.
 *
 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
 *       return function () {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.name).to.equal('bar');
 *         } else {
 *           _super.call(this);
 *         }
 *       }
 *     });
 *
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.ok;
 *
 * @param {Object} ctx object whose property is to be overwritten
 * @param {String} name of property to overwrite
 * @param {Function} getter function that returns a getter function to be used for name
 * @namespace Utils
 * @name overwriteProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  var _get = Object.getOwnPropertyDescriptor(ctx, name)
    , _super = function () {};

  if (_get && 'function' === typeof _get.get)
    _super = _get.get

  Object.defineProperty(ctx, name,
    { get: function () {
        var result = getter(_super).call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};

},{}],31:[function(require,module,exports){
/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = require('./flag');

/**
 * # test(object, expression)
 *
 * Test and object for expression.
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name test
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , expr = args[0];
  return negate ? !expr : expr;
};

},{"./flag":16}],32:[function(require,module,exports){
/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### transferFlags(assertion, object, includeAll = true)
 *
 * Transfer all the flags for `assertion` to `object`. If
 * `includeAll` is set to `false`, then the base Chai
 * assertion flags (namely `object`, `ssfi`, and `message`)
 * will not be transferred.
 *
 *
 *     var newAssertion = new Assertion();
 *     utils.transferFlags(assertion, newAssertion);
 *
 *     var anotherAsseriton = new Assertion(myObj);
 *     utils.transferFlags(assertion, anotherAssertion, false);
 *
 * @param {Assertion} assertion the assertion to transfer the flags from
 * @param {Object} object the object to transfer the flags to; usually a new assertion
 * @param {Boolean} includeAll
 * @namespace Utils
 * @name transferFlags
 * @api private
 */

module.exports = function (assertion, object, includeAll) {
  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

  if (!object.__flags) {
    object.__flags = Object.create(null);
  }

  includeAll = arguments.length === 3 ? includeAll : true;

  for (var flag in flags) {
    if (includeAll ||
        (flag !== 'object' && flag !== 'ssfi' && flag != 'message')) {
      object.__flags[flag] = flags[flag];
    }
  }
};

},{}],33:[function(require,module,exports){
module.exports = require('./lib/eql');

},{"./lib/eql":34}],34:[function(require,module,exports){
/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var type = require('type-detect');

/*!
 * Buffer.isBuffer browser shim
 */

var Buffer;
try { Buffer = require('buffer').Buffer; }
catch(ex) {
  Buffer = {};
  Buffer.isBuffer = function() { return false; }
}

/*!
 * Primary Export
 */

module.exports = deepEqual;

/**
 * Assert super-strict (egal) equality between
 * two objects of any type.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @param {Array} memoised (optional)
 * @return {Boolean} equal match
 */

function deepEqual(a, b, m) {
  if (sameValue(a, b)) {
    return true;
  } else if ('date' === type(a)) {
    return dateEqual(a, b);
  } else if ('regexp' === type(a)) {
    return regexpEqual(a, b);
  } else if (Buffer.isBuffer(a)) {
    return bufferEqual(a, b);
  } else if ('arguments' === type(a)) {
    return argumentsEqual(a, b, m);
  } else if (!typeEqual(a, b)) {
    return false;
  } else if (('object' !== type(a) && 'object' !== type(b))
  && ('array' !== type(a) && 'array' !== type(b))) {
    return sameValue(a, b);
  } else {
    return objectEqual(a, b, m);
  }
}

/*!
 * Strict (egal) equality test. Ensures that NaN always
 * equals NaN and `-0` does not equal `+0`.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} equal match
 */

function sameValue(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  return a !== a && b !== b;
}

/*!
 * Compare the types of two given objects and
 * return if they are equal. Note that an Array
 * has a type of `array` (not `object`) and arguments
 * have a type of `arguments` (not `array`/`object`).
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function typeEqual(a, b) {
  return type(a) === type(b);
}

/*!
 * Compare two Date objects by asserting that
 * the time values are equal using `saveValue`.
 *
 * @param {Date} a
 * @param {Date} b
 * @return {Boolean} result
 */

function dateEqual(a, b) {
  if ('date' !== type(b)) return false;
  return sameValue(a.getTime(), b.getTime());
}

/*!
 * Compare two regular expressions by converting them
 * to string and checking for `sameValue`.
 *
 * @param {RegExp} a
 * @param {RegExp} b
 * @return {Boolean} result
 */

function regexpEqual(a, b) {
  if ('regexp' !== type(b)) return false;
  return sameValue(a.toString(), b.toString());
}

/*!
 * Assert deep equality of two `arguments` objects.
 * Unfortunately, these must be sliced to arrays
 * prior to test to ensure no bad behavior.
 *
 * @param {Arguments} a
 * @param {Arguments} b
 * @param {Array} memoize (optional)
 * @return {Boolean} result
 */

function argumentsEqual(a, b, m) {
  if ('arguments' !== type(b)) return false;
  a = [].slice.call(a);
  b = [].slice.call(b);
  return deepEqual(a, b, m);
}

/*!
 * Get enumerable properties of a given object.
 *
 * @param {Object} a
 * @return {Array} property names
 */

function enumerable(a) {
  var res = [];
  for (var key in a) res.push(key);
  return res;
}

/*!
 * Simple equality for flat iterable objects
 * such as Arrays or Node.js buffers.
 *
 * @param {Iterable} a
 * @param {Iterable} b
 * @return {Boolean} result
 */

function iterableEqual(a, b) {
  if (a.length !==  b.length) return false;

  var i = 0;
  var match = true;

  for (; i < a.length; i++) {
    if (a[i] !== b[i]) {
      match = false;
      break;
    }
  }

  return match;
}

/*!
 * Extension to `iterableEqual` specifically
 * for Node.js Buffers.
 *
 * @param {Buffer} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function bufferEqual(a, b) {
  if (!Buffer.isBuffer(b)) return false;
  return iterableEqual(a, b);
}

/*!
 * Block for `objectEqual` ensuring non-existing
 * values don't get in.
 *
 * @param {Mixed} object
 * @return {Boolean} result
 */

function isValue(a) {
  return a !== null && a !== undefined;
}

/*!
 * Recursively check the equality of two objects.
 * Once basic sameness has been established it will
 * defer to `deepEqual` for each enumerable key
 * in the object.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function objectEqual(a, b, m) {
  if (!isValue(a) || !isValue(b)) {
    return false;
  }

  if (a.prototype !== b.prototype) {
    return false;
  }

  var i;
  if (m) {
    for (i = 0; i < m.length; i++) {
      if ((m[i][0] === a && m[i][1] === b)
      ||  (m[i][0] === b && m[i][1] === a)) {
        return true;
      }
    }
  } else {
    m = [];
  }

  try {
    var ka = enumerable(a);
    var kb = enumerable(b);
  } catch (ex) {
    return false;
  }

  ka.sort();
  kb.sort();

  if (!iterableEqual(ka, kb)) {
    return false;
  }

  m.push([ a, b ]);

  var key;
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], m)) {
      return false;
    }
  }

  return true;
}

},{"buffer":3,"type-detect":35}],35:[function(require,module,exports){
module.exports = require('./lib/type');

},{"./lib/type":36}],36:[function(require,module,exports){
/*!
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Exports
 */

var exports = module.exports = getType;

/*!
 * Detectable javascript natives
 */

var natives = {
    '[object Array]': 'array'
  , '[object RegExp]': 'regexp'
  , '[object Function]': 'function'
  , '[object Arguments]': 'arguments'
  , '[object Date]': 'date'
};

/**
 * ### typeOf (obj)
 *
 * Use several different techniques to determine
 * the type of object being tested.
 *
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */

function getType (obj) {
  var str = Object.prototype.toString.call(obj);
  if (natives[str]) return natives[str];
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (obj === Object(obj)) return 'object';
  return typeof obj;
}

exports.Library = Library;

/**
 * ### Library
 *
 * Create a repository for custom type detection.
 *
 * ```js
 * var lib = new type.Library;
 * ```
 *
 */

function Library () {
  this.tests = {};
}

/**
 * #### .of (obj)
 *
 * Expose replacement `typeof` detection to the library.
 *
 * ```js
 * if ('string' === lib.of('hello world')) {
 *   // ...
 * }
 * ```
 *
 * @param {Mixed} object to test
 * @return {String} type
 */

Library.prototype.of = getType;

/**
 * #### .define (type, test)
 *
 * Add a test to for the `.test()` assertion.
 *
 * Can be defined as a regular expression:
 *
 * ```js
 * lib.define('int', /^[0-9]+$/);
 * ```
 *
 * ... or as a function:
 *
 * ```js
 * lib.define('bln', function (obj) {
 *   if ('boolean' === lib.of(obj)) return true;
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
 *   return !! ~blns.indexOf(obj);
 * });
 * ```
 *
 * @param {String} type
 * @param {RegExp|Function} test
 * @api public
 */

Library.prototype.define = function (type, test) {
  if (arguments.length === 1) return this.tests[type];
  this.tests[type] = test;
  return this;
};

/**
 * #### .test (obj, test)
 *
 * Assert that an object is of type. Will first
 * check natives, and if that does not pass it will
 * use the user defined custom tests.
 *
 * ```js
 * assert(lib.test('1', 'int'));
 * assert(lib.test('yes', 'bln'));
 * ```
 *
 * @param {Mixed} object
 * @param {String} type
 * @return {Boolean} result
 * @api public
 */

Library.prototype.test = function (obj, type) {
  if (type === getType(obj)) return true;
  var test = this.tests[type];

  if (test && 'regexp' === getType(test)) {
    return test.test(obj);
  } else if (test && 'function' === getType(test)) {
    return test(obj);
  } else {
    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
  }
};

},{}],37:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],38:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],39:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./lib/type":40,"dup":35}],40:[function(require,module,exports){
/*!
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Exports
 */

var exports = module.exports = getType;

/**
 * ### typeOf (obj)
 *
 * Use several different techniques to determine
 * the type of object being tested.
 *
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */
var objectTypeRegexp = /^\[object (.*)\]$/;

function getType(obj) {
  var type = Object.prototype.toString.call(obj).match(objectTypeRegexp)[1].toLowerCase();
  // Let "new String('')" return 'object'
  if (typeof Promise === 'function' && obj instanceof Promise) return 'promise';
  // PhantomJS has type "DOMWindow" for null
  if (obj === null) return 'null';
  // PhantomJS has type "DOMWindow" for undefined
  if (obj === undefined) return 'undefined';
  return type;
}

exports.Library = Library;

/**
 * ### Library
 *
 * Create a repository for custom type detection.
 *
 * ```js
 * var lib = new type.Library;
 * ```
 *
 */

function Library() {
  if (!(this instanceof Library)) return new Library();
  this.tests = {};
}

/**
 * #### .of (obj)
 *
 * Expose replacement `typeof` detection to the library.
 *
 * ```js
 * if ('string' === lib.of('hello world')) {
 *   // ...
 * }
 * ```
 *
 * @param {Mixed} object to test
 * @return {String} type
 */

Library.prototype.of = getType;

/**
 * #### .define (type, test)
 *
 * Add a test to for the `.test()` assertion.
 *
 * Can be defined as a regular expression:
 *
 * ```js
 * lib.define('int', /^[0-9]+$/);
 * ```
 *
 * ... or as a function:
 *
 * ```js
 * lib.define('bln', function (obj) {
 *   if ('boolean' === lib.of(obj)) return true;
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
 *   return !! ~blns.indexOf(obj);
 * });
 * ```
 *
 * @param {String} type
 * @param {RegExp|Function} test
 * @api public
 */

Library.prototype.define = function(type, test) {
  if (arguments.length === 1) return this.tests[type];
  this.tests[type] = test;
  return this;
};

/**
 * #### .test (obj, test)
 *
 * Assert that an object is of type. Will first
 * check natives, and if that does not pass it will
 * use the user defined custom tests.
 *
 * ```js
 * assert(lib.test('1', 'int'));
 * assert(lib.test('yes', 'bln'));
 * ```
 *
 * @param {Mixed} object
 * @param {String} type
 * @return {Boolean} result
 * @api public
 */

Library.prototype.test = function(obj, type) {
  if (type === getType(obj)) return true;
  var test = this.tests[type];

  if (test && 'regexp' === getType(test)) {
    return test.test(obj);
  } else if (test && 'function' === getType(test)) {
    return test(obj);
  } else {
    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
  }
};

},{}],41:[function(require,module,exports){
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
    '\/': '\/'
};
function stringify(value) {
    return JSON.stringify(value).replace(escapable, function toUTF8(s) {
        return meta[s] || "\\u" + padStart(s.charCodeAt(0).toString(16).toUpperCase(), 4, "0000");
    });
}
exports.stringify = stringify;

},{"./types/msbuffer":53}],42:[function(require,module,exports){
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

},{"./core":41,"./mste/decoder":43,"./mste/encoder":44,"./types/msbuffer":53,"./types/mscolor":54,"./types/mscouple":55,"./types/msdate":56,"./types/msnaturalarray":57}],43:[function(require,module,exports){
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

},{"./engines":45}],44:[function(require,module,exports){
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

},{"../core":41,"../types/msbuffer":53,"../types/mscolor":54,"../types/mscouple":55,"../types/msdate":56,"../types/msnaturalarray":57,"./engines":45}],45:[function(require,module,exports){
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

},{"../core":41,"../types/msbuffer":53,"../types/mscolor":54,"../types/mscouple":55,"../types/msdate":56,"../types/msnaturalarray":57}],46:[function(require,module,exports){
"use strict";
var chai_1 = require('chai');
var _1 = require('../');
describe("MSBuffer", function () {
    it("constructor, concat, slice, splice", function () {
        var n = new _1.MSBuffer();
        chai_1.expect(n.length).to.eq(0);
        n = new _1.MSBuffer(100, 80, 30, 77);
        chai_1.expect(n.length).to.eq(4);
        chai_1.expect(Array.from(n)).to.deep.equal([100, 80, 30, 77]);
        chai_1.expect(n[2]).to.eq(30);
        var n1 = new _1.MSBuffer('AM NBCP');
        chai_1.expect(n1.length).to.eq(7);
        chai_1.expect(Array.from(n1)).to.deep.equal([65, 77, 32, 78, 66, 67, 80]);
        chai_1.expect(n1[5]).to.eq(67);
        var n2 = new _1.MSBuffer(80, 90, 100, 110, 112, 113, 114, 115);
        var r = n1.concat(n, n2);
        chai_1.expect(r).to.be.instanceof(_1.MSBuffer);
        chai_1.expect(Array.from(r)).to.deep.equal([65, 77, 32, 78, 66, 67, 80, 100, 80, 30, 77, 80, 90, 100, 110, 112, 113, 114, 115]);
        chai_1.expect(r.slice()).to.be.instanceof(_1.MSBuffer);
        chai_1.expect(r.slice().isEqualTo(r)).to.eq(true);
        chai_1.expect(r.slice(void 0, 7).isEqualTo(n1)).to.eq(true);
        chai_1.expect(r.slice(7, 11).isEqualTo(n)).to.eq(true);
        chai_1.expect(r.slice(11).isEqualTo(n2)).to.eq(true);
        var n3 = r.splice(7, 4, 91, 92, 93, 94, 95, 96, 97, 98);
        chai_1.expect(n3).to.be.instanceof(_1.MSBuffer);
        chai_1.expect(n3.isEqualTo(n)).to.eq(true);
        chai_1.expect(Array.from(r)).to.deep.equal([65, 77, 32, 78, 66, 67, 80, 91, 92, 93, 94, 95, 96, 97, 98, 80, 90, 100, 110, 112, 113, 114, 115]);
        var n4 = r.splice(0, 11);
        chai_1.expect(n4).to.be.instanceof(_1.MSBuffer);
        chai_1.expect(Array.from(r)).to.deep.equal([95, 96, 97, 98, 80, 90, 100, 110, 112, 113, 114, 115]);
        chai_1.expect(Array.from(n4)).to.deep.equal([65, 77, 32, 78, 66, 67, 80, 91, 92, 93, 94]);
        n4.pop();
        n4.pop();
        n4.pop();
        chai_1.expect(Array.from(n4)).to.deep.equal([65, 77, 32, 78, 66, 67, 80, 91]);
        n4.reverse();
        chai_1.expect(Array.from(n4)).to.deep.equal([91, 80, 67, 66, 78, 32, 77, 65]);
    });
    it('JSON.stringify', function () {
        chai_1.expect(JSON.stringify(new _1.MSBuffer(100, 80, 30, 77))).to.deep.equal("[100,80,30,77]");
    });
    /*it("Testing splice", function() {
    }) ;*/
    it("base64 decode/encode on short string", function () {
        var s = "Rjd5NA==";
        var d = _1.MSBuffer.bufferWithBase64String(s);
        chai_1.expect(d.toString()).to.eq("F7y4");
        chai_1.expect(d.toBase64String()).to.eq(s);
    });
    it("base64 encoding", function () {
        var d = new _1.MSBuffer("Client browser handles the data from the source form as a string data encoded by document charset (iso-8859-1 in the case of this document) and sends the data as a binary http stream to a web server. You can choose another character set for the conversion of the source text data (the textarea). This script does Base64 conversion with the converted binary data");
        var s = d.toBase64String();
        chai_1.expect(d.toBase64String()).to.eq("Q2xpZW50IGJyb3dzZXIgaGFuZGxlcyB0aGUgZGF0YSBmcm9tIHRoZSBzb3VyY2UgZm9ybSBhcyBhIHN0cmluZyBkYXRhIGVuY29kZWQgYnkgZG9jdW1lbnQgY2hhcnNldCAoaXNvLTg4NTktMSBpbiB0aGUgY2FzZSBvZiB0aGlzIGRvY3VtZW50KSBhbmQgc2VuZHMgdGhlIGRhdGEgYXMgYSBiaW5hcnkgaHR0cCBzdHJlYW0gdG8gYSB3ZWIgc2VydmVyLiBZb3UgY2FuIGNob29zZSBhbm90aGVyIGNoYXJhY3RlciBzZXQgZm9yIHRoZSBjb252ZXJzaW9uIG9mIHRoZSBzb3VyY2UgdGV4dCBkYXRhICh0aGUgdGV4dGFyZWEpLiBUaGlzIHNjcmlwdCBkb2VzIEJhc2U2NCBjb252ZXJzaW9uIHdpdGggdGhlIGNvbnZlcnRlZCBiaW5hcnkgZGF0YQ==");
    });
    it("base64 decoding (1)", function () {
        var s = "VGhlIEJ5dGVBcnJheSBjbGFzcyB3YXMgcHJpbWFyaWx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBBU1AgYW5kIFZCU2NyaXB0LCBidXQgeW91IGNhbiB1c2UgaXQgd2l0aCBhbnkgb3RoZXIgbGFuZ3VhZ2Ugd29ya2luZyB3aXRoIENPTSAoQWN0aXZlWCwgT0xFKSBvYmplY3RzLCBzdWNoIGlzIFZCQSAoVkJBNSwgVkJBNiwgV29yZCwgRXhjZWwsIE1TIEFjY2VzcyksIFZCU2NyaXB0IGFuZCBKU2NyaXB0IGluIHdpbmRvd3Mgc2NyaXB0aW5nIGhvc3QgKC53c2gsIC5jaG0gb3IgLmh0YSBhcHBsaWNhdGlvbnMsIE91dGxvb2sgb3IgZWNoYW5nZSBzZXJ2ZXItc2lkZSBzY3JpcHRzKSwgVkIuTmV0LCBDIyBvciBqIyBpbiBBU1AuTmV0IGFuZCBvdGhlcnMu";
        var d = _1.MSBuffer.bufferWithBase64String(s);
        var r = "The ByteArray class was primarily designed to work with ASP and VBScript, but you can use it with any other language working with COM (ActiveX, OLE) objects, such is VBA (VBA5, VBA6, Word, Excel, MS Access), VBScript and JScript in windows scripting host (.wsh, .chm or .hta applications, Outlook or echange server-side scripts), VB.Net, C# or j# in ASP.Net and others.";
        chai_1.expect(d.toString()).to.eq(r);
    });
    it("base64 decoding (2)", function () {
        var s = "VGhlIEJ5dGVBcnJheSBjbGFzcyB3YXMgcHJpbWFyaWx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBB\n" +
            "U1AgYW5kIFZCU2NyaXB0LCBidXQgeW91IGNhbiB1c2UgaXQgd2l0aCBhbnkgb3RoZXIgbGFuZ3Vh\n" +
            "Z2Ugd29ya2luZyB3aXRoIENPTSAoQWN0aXZlWCwgT0xFKSBvYmplY3RzLCBzdWNoIGlzIFZCQSAo\n" +
            "VkJBNSwgVkJBNiwgV29yZCwgRXhjZWwsIE1TIEFjY2VzcyksIFZCU2NyaXB0IGFuZCBKU2NyaXB0\n" +
            "IGluIHdpbmRvd3Mgc2NyaXB0aW5nIGhvc3QgKC53c2gsIC5jaG0gb3IgLmh0YSBhcHBsaWNhdGlv\n" +
            "bnMsIE91dGxvb2sgb3IgZWNoYW5nZSBzZXJ2ZXItc2lkZSBzY3JpcHRzKSwgVkIuTmV0LCBDIyBv\n" +
            "ciBqIyBpbiBBU1AuTmV0IGFuZCBvdGhlcnMu";
        var d = _1.MSBuffer.bufferWithBase64String(s);
        var r = "The ByteArray class was primarily designed to work with ASP and VBScript, but you can use it with any other language working with COM (ActiveX, OLE) objects, such is VBA (VBA5, VBA6, Word, Excel, MS Access), VBScript and JScript in windows scripting host (.wsh, .chm or .hta applications, Outlook or echange server-side scripts), VB.Net, C# or j# in ASP.Net and others.";
        chai_1.expect(d.toString()).to.eq(r);
    });
});

},{"../":42,"chai":4}],47:[function(require,module,exports){
"use strict";
var chai_1 = require('chai');
var _1 = require('../');
describe("MSColor", function () {
    it("constructor", function () {
        chai_1.expect((new _1.MSColor(255)).toString()).to.eq('#0000ff');
        chai_1.expect((new _1.MSColor(0xa0a1a2)).toString()).to.eq('#a0a1a2');
        chai_1.expect((new _1.MSColor(0xbba0a1a2)).toNumber()).to.eq(0xbba0a1a2);
        chai_1.expect((new _1.MSColor(0xa0, 0xa1, 0xa2, 0xff - 0xbb)).toNumber().toString(16)).to.eq(0xbba0a1a2 .toString(16));
        chai_1.expect((new _1.MSColor('ivory')).toString()).to.eq('#fffff0');
        chai_1.expect(_1.MSColor.YELLOW.toString()).to.eq('#ffff00');
    });
    it("equality", function () {
        chai_1.expect(new _1.MSColor('ivory').isEqualTo(new _1.MSColor('#fffff0'))).to.eq(true);
        chai_1.expect(new _1.MSColor('ivory').isEqualTo(new _1.MSColor('#fffff1'))).to.eq(false);
    });
});

},{"../":42,"chai":4}],48:[function(require,module,exports){
"use strict";
var chai_1 = require('chai');
var MSTools = require('../');
describe("Core", function () {
    it("crc32", function () {
        var i, s = 'MSTE0101",3710,"CRC0638641A",1,"XVar",137,"PACT","VARS","_default_","planningSwitch","flags","value","options","objectKey","globals","disabledObjects","index","switch","planningForm","startingHourField","configurationsList","forceDontChoice","statutsList","endingDateField","target","startingDateField","visuPop","intervallePopUp","daysSwitches","selecteds","FORCE_RELOAD_ORIGIN","stepValue","visuIndexRadio","RSRC","path","modificationDate","isFolder","basePath","CARD","ACTIONS","revalidatePreResaINet","gapToNextWeek","duplicateResaWithContract","invalidateGapWithRefund","duplicateResa","revalidateReservation","gotoContract","rejectPreResa","invalidateReservation","newSimpleResaFromResource","gotoResource","editResa","gotoSession","addSimple","gotoActivityFromItem","gotoResourceFromItem","moveGap","deleteResaKeepSubscription","gotoContractor","gotoPlaceFromItem","gapToPreviousDay","invalidateGap","gapToPreviousWeek","acceptPreResa","gotoPlace","addComplex","gapToNextDay","refresh","home","deleteResaWithRefund","revalidateGapKeepSubscription","next","gotoActivity","gotoPeopleFromItem","editResaReadOnly","gotoRegisteredUser","progPrint","print","deleteResaKeepFile","invalidateGapKeepSubscription","editRegistereds","newResaFromResource","gotoPlaceClosures","revalidateGapKeepFile","add","deleteResa","invalidateGapKeepFile","revalidateGap","previous","MID","STAT","CARDTITLE","OPTS","LOCCTRL","CTXCLASS","FRAME_NAME","LOCCTRLPARAM","noEmptyPeriods","outlineStyle","selectedDays","interval","drawsLabels","interfaceName","endingDate","startingDate","objectName","planningColors","gapsBackgroundColor","rulerMinutesFontColor","planningStyles","tcol","bcol","firstHashAngle","firstHashInterspace","hcol","hasFirstHash","firstHashWidth","col","grad","gcol","width","rulerHoursColor","backgroundColor","rulerMinutesColor","rulerHoursFontColor","gradientStyle","hoursSeparationLineColor","outlinesColor","gapsHeaderBackgroundColor","periodBackgroundColor","conflictsColor","periodTitlesColor","titlesColor","borderStyle"';
        chai_1.expect(MSTools.crc32(s).toString(16)).to.eq('ac85eb70');
        chai_1.expect(MSTools.crc32("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,;:=$()[]{}/\\|@&-_\"\'%?.+!").toString(16)).to.eq('24137450');
        chai_1.expect(MSTools.crc32("àçùéè").toString(16)).to.eq('e2a37c23');
    });
    it("ok", function () {
        chai_1.expect(MSTools.ok(true)).to.eq(true);
        chai_1.expect(MSTools.ok(false)).to.eq(true);
        chai_1.expect(MSTools.ok(null)).to.eq(false);
        chai_1.expect(MSTools.ok(undefined)).to.eq(false);
        chai_1.expect(MSTools.ok({})).to.eq(true);
        chai_1.expect(MSTools.ok([])).to.eq(true);
    });
    it("div", function () {
        chai_1.expect(MSTools.div(1, 2)).to.eq(0);
        chai_1.expect(MSTools.div(4, 2)).to.eq(2);
        chai_1.expect(MSTools.div(4.1, 2)).to.eq(2);
        chai_1.expect(MSTools.div(3.9999, 2)).to.eq(1);
        chai_1.expect(MSTools.div(-3.9999, 2)).to.eq(-1);
        chai_1.expect(MSTools.div(-4, 2)).to.eq(-2);
        chai_1.expect(MSTools.div(-4.1, 2)).to.eq(-2);
    });
    it("isInteger", function () {
        chai_1.expect(MSTools.isInteger(0)).to.eq(true);
        chai_1.expect(MSTools.isInteger(+1)).to.eq(true);
        chai_1.expect(MSTools.isInteger(-1)).to.eq(true);
        chai_1.expect(MSTools.isInteger(+1.00001)).to.eq(false);
        chai_1.expect(MSTools.isInteger(-1.00001)).to.eq(false);
        chai_1.expect(MSTools.isInteger(Number.MAX_SAFE_INTEGER)).to.eq(true);
        chai_1.expect(MSTools.isInteger(Number.MIN_SAFE_INTEGER)).to.eq(true);
        chai_1.expect(MSTools.isInteger(Number.MAX_VALUE)).to.eq(false);
        chai_1.expect(MSTools.isInteger(Number.MIN_VALUE)).to.eq(false);
        chai_1.expect(MSTools.isInteger(Number.EPSILON)).to.eq(false);
    });
    it("padStart", function () {
        chai_1.expect(MSTools.padStart("test", 5)).to.eq(" test");
        chai_1.expect(MSTools.padStart("test", 4)).to.eq("test");
        chai_1.expect(MSTools.padStart("test", 1)).to.eq("test");
        chai_1.expect(MSTools.padStart("test", 6)).to.eq("  test");
        chai_1.expect(MSTools.padStart("tet", 6, "0")).to.eq("000tet");
        chai_1.expect(MSTools.padStart("test", 7, "01")).to.eq("010test");
        chai_1.expect(MSTools.padStart("test", 7, "01234")).to.eq("012test");
    });
    it("padEnd", function () {
        chai_1.expect(MSTools.padEnd("test", 5)).to.eq("test ");
        chai_1.expect(MSTools.padEnd("test", 4)).to.eq("test");
        chai_1.expect(MSTools.padEnd("test", 1)).to.eq("test");
        chai_1.expect(MSTools.padEnd("test", 6)).to.eq("test  ");
        chai_1.expect(MSTools.padEnd("tet", 6, "0")).to.eq("tet000");
        chai_1.expect(MSTools.padEnd("test", 7, "01")).to.eq("test010");
        chai_1.expect(MSTools.padEnd("test", 7, "01234")).to.eq("test012");
    });
    it("type", function () {
        function myFunction() { }
        chai_1.expect(MSTools.type("test")).to.eq("string");
        chai_1.expect(MSTools.type(null)).to.eq("object");
        chai_1.expect(MSTools.type(undefined)).to.eq("undefined");
        chai_1.expect(MSTools.type(0)).to.eq("number");
        chai_1.expect(MSTools.type(true)).to.eq("boolean");
        chai_1.expect(MSTools.type(false)).to.eq("boolean");
        chai_1.expect(MSTools.type(myFunction)).to.eq("function");
        chai_1.expect(MSTools.type(new myFunction())).to.eq("myFunction");
        chai_1.expect(MSTools.type([])).to.eq("Array");
        chai_1.expect(MSTools.type({})).to.eq("object");
    });
});

},{"../":42,"chai":4}],49:[function(require,module,exports){
"use strict";
var chai_1 = require('chai');
var _1 = require('../');
describe("MSDate", function () {
    it("interval on 01/01/1970", function () {
        var d = new _1.MSDate(1970, 1, 1);
        chai_1.expect(d.interval).to.eq(-_1.MSDate.SecsFrom19700101To20010101);
        //expect(d.yearOfCommonEra()).to.eq(1970) ;
        //expect(d.monthOfYear()).to.eq(1) ;
        chai_1.expect(d.dayOfMonth()).to.eq(1);
    });
    it("interval on 01/01/2001", function () {
        var d = new _1.MSDate(2001, 1, 1);
        chai_1.expect(d.interval).to.eq(0);
        //expect(d.yearOfCommonEra()).to.eq(2001) ;
        //expect(d.monthOfYear()).to.eq(1) ;
        chai_1.expect(d.dayOfMonth()).to.eq(1);
    });
    it("interval on 03/01/2001", function () {
        var d = new _1.MSDate(2001, 1, 3);
        chai_1.expect(d.interval).to.eq(86400 * 2);
        //expect(d.yearOfCommonEra()).to.eq(2001) ;
        //expect(d.monthOfYear()).to.eq(1) ;
        chai_1.expect(d.dayOfMonth()).to.eq(3);
    });
    it("interval on 01/01/1601", function () {
        var d = new _1.MSDate(1601, 1, 1);
        chai_1.expect(d.interval).to.eq(-12622780800);
        //expect(d.yearOfCommonEra()).to.eq(1601) ;
        //expect(d.monthOfYear()).to.eq(1) ;
        chai_1.expect(d.dayOfMonth()).to.eq(1);
    });
    it("interval on 17/04/2017", function () {
        var d = new _1.MSDate(2017, 4, 17);
        chai_1.expect(d.interval).to.eq(514080000);
        //expect(d.yearOfCommonEra()).to.eq(2017) ;
        //expect(d.monthOfYear()).to.eq(4) ;
        chai_1.expect(d.dayOfMonth()).to.eq(17);
    });
    it("interval on 12/05/2122 @ 12h00", function () {
        var d = new _1.MSDate(2122, 5, 12, 12, 0, 0);
        chai_1.expect(d.interval).to.eq(3829723200);
        //expect(d.yearOfCommonEra()).to.eq(2122) ;
        //expect(d.monthOfYear()).to.eq(5) ;
        chai_1.expect(d.dayOfMonth()).to.eq(12);
        chai_1.expect(d.hourOfDay()).to.eq(12);
        chai_1.expect(d.minuteOfHour()).to.eq(0);
        chai_1.expect(d.secondOfMinute()).to.eq(0);
    });
    it("valid date on 29/02/0", function () {
        chai_1.expect(_1.MSDate.validDate(0, 2, 29)).to.eq(false);
    });
    it("valid date on 29/02/04", function () {
        chai_1.expect(_1.MSDate.validDate(4, 2, 29)).to.eq(false);
    });
    it("valid date on 29/02/8", function () {
        chai_1.expect(_1.MSDate.validDate(8, 2, 29)).to.eq(true);
    });
    it("valid date on 29/02/1200", function () {
        chai_1.expect(_1.MSDate.validDate(1200, 2, 29)).to.eq(false);
    });
    it("valid date on 29/02/1600", function () {
        chai_1.expect(_1.MSDate.validDate(1600, 2, 29)).to.eq(true);
    });
    it("valid date on 29/02/1900", function () {
        chai_1.expect(_1.MSDate.validDate(1900, 2, 29)).to.eq(false);
    });
    it("valid date on 29/02/2000", function () {
        chai_1.expect(_1.MSDate.validDate(2000, 2, 29)).to.eq(true);
    });
    it("valid date on 29/02/2012", function () {
        chai_1.expect(_1.MSDate.validDate(2012, 2, 29)).to.eq(true);
    });
    it("valid date on 29/02/2013", function () {
        chai_1.expect(_1.MSDate.validDate(2013, 2, 29)).to.eq(false);
    });
    it("valid date on 29/02/2014", function () {
        chai_1.expect(_1.MSDate.validDate(2014, 2, 29)).to.eq(false);
    });
    it("valid date on 31/04/2014", function () {
        chai_1.expect(_1.MSDate.validDate(2014, 0, 31)).to.eq(false);
    });
    it("dates conversion", function () {
        var d0 = new Date(1966, 3, 13, 12, 59, 1);
        var d = new _1.MSDate(1966, 4, 13, 12, 59, 1);
        var d1 = d.toDate();
        chai_1.expect(d1).to.deep.equal(d0);
        var d2 = new _1.MSDate(d1);
        chai_1.expect(d.isEqualTo(d2)).to.eq(true);
        var d3 = d2.toDate();
        chai_1.expect(d3).to.deep.equal(d0);
    });
    it("MSDate creation from Date", function () {
        var ms = new _1.MSDate(new Date(2015, 9, 14));
        chai_1.expect(ms.dayOfMonth()).to.eq(14);
        chai_1.expect(ms.monthOfYear()).to.eq(10);
        chai_1.expect(ms.yearOfCommonEra()).to.eq(2015);
    });
});

},{"../":42,"chai":4}],50:[function(require,module,exports){
"use strict";
var core = require('./core.spec');
core;
var color = require('./color.spec');
color;
var buffer = require('./buffer.spec');
buffer;
var date = require('./date.spec');
date;
var naturals = require('./naturals.spec');
naturals;
var mste = require('./mste.spec');
mste;

},{"./buffer.spec":46,"./color.spec":47,"./core.spec":48,"./date.spec":49,"./mste.spec":51,"./naturals.spec":52}],51:[function(require,module,exports){
"use strict";
var chai_1 = require('chai');
var _1 = require('../');
var data_graph = [{
        name: "Durand ¥-$-€",
        firstName: "Yves",
        birthday: new Date(1966, 3, 13, 12, 25, 33)
    }, {
        name: "Durand",
        firstName: "Claire",
        birthday: new _1.MSDate(1952, 6, 18, 6, 22, 0)
    }, {
        name: "Durand",
        firstName: "Lou",
        birthday: new Date(1980, 10, 11, 9, 8, 7)
    }];
data_graph[0]["maried_to"] = data_graph[1];
data_graph[1]["maried_to"] = data_graph[0];
data_graph[2]["father"] = data_graph[0];
data_graph[2]["mother"] = data_graph[1];
var LocalPerson = (function () {
    function LocalPerson(name, firstName, birthday) {
        this.name = name;
        this.firstName = firstName;
        this.birthday = birthday;
    }
    LocalPerson.prototype.encodeToMSTE = function (encoder) { encoder.encodeDictionary(this, "person"); };
    return LocalPerson;
}());
var data_graph2 = [
    new LocalPerson("Durand ¥-$-€", "Yves", new Date()),
    new LocalPerson("Durand", "Claire", new Date()),
    new LocalPerson("Durand", "Lou", new Date())
];
data_graph2[0]["maried_to"] = data_graph2[1];
data_graph2[1]["maried_to"] = data_graph2[0];
data_graph2[2]["father"] = data_graph2[0];
data_graph2[2]["mother"] = data_graph2[1];
var data_array = [
    {
        id: "0001",
        type: "donut",
        name: "Cake",
        ppu: 0.55,
        batters: {
            batter: [
                { id: "1001", type: "Regular" },
                { id: "1002", type: "Chocolate" },
                { id: "1003", type: "Blueberry" },
                { id: "1004", type: "Devil's Food" }
            ]
        },
        topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5005", type: "Sugar" },
            { id: "5007", type: "Powdered Sugar" },
            { id: "5006", type: "Chocolate with Sprinkles" },
            { id: "5003", type: "Chocolate" },
            { id: "5004", type: "Maple" }
        ]
    },
    {
        id: "0002",
        type: "donut",
        name: "Raised",
        ppu: 0.55,
        batters: {
            "batter": [
                { id: "1001", type: "Regular" }
            ]
        },
        topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5005", type: "Sugar" },
            { id: "5003", type: "Chocolate" },
            { id: "5004", type: "Maple" }
        ]
    },
    {
        id: "0003",
        type: "donut",
        name: "Old Fashioned",
        ppu: 0.55,
        batters: {
            "batter": [
                { id: "1001", type: "Regular" },
                { id: "1002", type: "Chocolate" }
            ]
        },
        topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5003", type: "Chocolate" },
            { id: "5004", type: "Maple" }
        ]
    }
];
var oldMSTEString = '["MSTE0101",3710,"CRC0638641A",1,"XVar",137,"PACT","VARS","_default_","planningSwitch","flags","value","options","objectKey","globals","disabledObjects","index","switch","planningForm","startingHourField","configurationsList","forceDontChoice","statutsList","endingDateField","target","startingDateField","visuPop","intervallePopUp","daysSwitches","selecteds","FORCE_RELOAD_ORIGIN","stepValue","visuIndexRadio","RSRC","path","modificationDate","isFolder","basePath","CARD","ACTIONS","revalidatePreResaINet","gapToNextWeek","duplicateResaWithContract","invalidateGapWithRefund","duplicateResa","revalidateReservation","gotoContract","rejectPreResa","invalidateReservation","newSimpleResaFromResource","gotoResource","editResa","gotoSession","addSimple","gotoActivityFromItem","gotoResourceFromItem","moveGap","deleteResaKeepSubscription","gotoContractor","gotoPlaceFromItem","gapToPreviousDay","invalidateGap","gapToPreviousWeek","acceptPreResa","gotoPlace","addComplex","gapToNextDay","refresh","home","deleteResaWithRefund","revalidateGapKeepSubscription","next","gotoActivity","gotoPeopleFromItem","editResaReadOnly","gotoRegisteredUser","progPrint","print","deleteResaKeepFile","invalidateGapKeepSubscription","editRegistereds","newResaFromResource","gotoPlaceClosures","revalidateGapKeepFile","add","deleteResa","invalidateGapKeepFile","revalidateGap","previous","MID","STAT","CARDTITLE","OPTS","LOCCTRL","CTXCLASS","FRAME_NAME","LOCCTRLPARAM","noEmptyPeriods","outlineStyle","selectedDays","interval","drawsLabels","interfaceName","endingDate","startingDate","objectName","planningColors","gapsBackgroundColor","rulerMinutesFontColor","planningStyles","tcol","bcol","firstHashAngle","firstHashInterspace","hcol","hasFirstHash","firstHashWidth","col","grad","gcol","width","rulerHoursColor","backgroundColor","rulerMinutesColor","rulerHoursFontColor","gradientStyle","hoursSeparationLineColor","outlinesColor","gapsHeaderBackgroundColor","periodBackgroundColor","conflictsColor","periodTitlesColor","titlesColor","borderStyle","heightStyle","origin","planningData","formName","showsDaysOnly","backgroundCalendars","expandsOnRefresh","showsEmptyItems","INAM",8,10,0,5,"switch",1,8,2,2,8,2,3,50,6,4,3,17672,5,3,1,6,22,0,0,7,3,-1,8,8,1,9,21,1,3,10,9,8,11,50,6,4,3,17416,5,9,6,6,22,0,0,7,9,8,8,9,9,10,9,8,12,8,11,13,50,5,4,3,2056,5,3,8,6,22,3,0,3,22,7,9,8,10,9,8,14,50,6,4,3,16704,5,5,"test",6,22,20,1,9,23,23,"",7,9,8,8,8,1,15,5,"YES",10,9,19,16,50,6,4,9,22,5,5,"Tous les cr\\u00E9neaux",6,22,20,6,9,30,5,"R\\u00E9servations exceptionnelles",5,"Pr\\u00E9-r\\u00E9servations standards",5,"R\\u00E9servations confirm\\u00E9es",5,"Cr\\u00E9neaux invalid\\u00E9s",5,"Pr\\u00E9-r\\u00E9servations I-Net",9,26,7,9,8,8,8,0,10,9,19,17,50,6,4,3,520,5,6,1351641600,6,22,0,0,7,9,8,8,8,1,18,5,"refresh",10,9,8,19,50,5,4,9,40,5,6,1351123200,6,9,42,7,9,8,10,9,8,20,50,5,4,9,12,5,9,19,6,22,0,0,7,9,8,10,9,8,21,50,5,4,9,5,5,3,60,6,9,42,7,9,8,10,9,8,22,50,6,4,3,19720,5,3,7,6,22,0,0,7,9,8,8,8,1,23,21,7,0,1,2,3,4,5,6,10,9,8,24,50,5,4,3,2568,5,9,19,6,22,0,0,7,9,8,10,9,8,25,50,5,4,9,5,5,9,6,6,22,0,0,7,9,8,10,9,8,26,50,6,4,9,22,5,5,"Ressources avec les activit\\u00E9s",6,22,20,4,9,63,5,"Ressources sans les activit\\u00E9s",5,"Usagers",5,"Activit\\u00E9s",9,26,7,9,8,8,9,38,10,9,19,27,20,1,8,4,28,5,"Z:\\\\PlanitecMS\\\\Library\\\\XNet\\\\PlanitecServer.xna\\\\Resources\\\\Microstep\\\\MASH\\\\interfaces\\\\planning@planningBox.json",29,6,1350376108,30,9,19,31,5,"_main_/interfaces/planning@planningBox",32,5,"planningBox",33,8,55,34,9,19,35,9,19,36,9,19,14,9,19,37,9,19,38,9,19,39,9,19,40,9,19,41,9,19,42,9,19,43,9,19,44,9,19,45,9,19,46,9,19,47,9,19,48,9,19,49,9,19,50,9,19,51,9,19,52,9,19,53,9,19,54,9,19,55,9,19,56,9,19,57,9,19,58,9,19,59,9,19,60,9,19,61,9,19,62,9,53,63,9,19,20,9,19,64,9,19,65,9,19,66,9,19,67,9,19,68,9,19,69,9,19,70,9,19,71,9,19,72,9,19,26,9,19,73,9,19,74,9,19,75,9,19,76,9,19,11,9,19,77,9,19,22,9,19,78,9,19,79,9,19,80,9,19,16,9,19,81,9,19,82,9,19,83,3,6,84,3,2,85,5,"/Planning/Visualisation",86,8,4,87,5,"PlanningControler",88,5,"PPlanningVisualizationContext",89,5,"Plan",90,8,18,91,9,19,92,9,19,93,21,7,0,1,2,3,4,5,6,94,9,50,95,9,6,96,5,"planning",97,6,1351641600,98,6,1351123200,99,5,"planningView",100,8,16,101,7,14474460,102,7,0,103,20,27,8,2,104,7,16777215,105,7,255,8,7,106,9,50,105,9,95,107,4,5.000000,108,9,94,109,9,6,110,9,6,104,9,94,8,9,106,9,50,111,7,7743014,104,7,4527638,105,7,16733522,107,4,10.000000,108,7,16750474,109,9,6,112,9,97,110,4,3.000000,8,9,106,9,50,111,7,2520614,104,7,1459478,105,7,5635922,107,9,102,108,7,9961354,109,9,6,112,9,97,110,9,104,8,9,106,9,50,111,7,7879680,104,7,7864320,105,7,16752660,107,9,102,108,7,16769674,109,9,6,112,9,97,110,9,104,9,98,9,93,9,93,8,6,104,7,4737096,113,7,3487029,105,7,11250603,112,9,19,114,9,8,111,9,118,8,1,105,7,16776960,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16776960,108,7,0,8,1,105,7,16726259,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16726259,108,7,0,8,1,105,7,16741194,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16741194,108,7,0,8,1,105,7,16730346,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16730346,108,7,0,8,1,105,7,5368063,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,5368063,108,7,0,8,1,105,7,2219263,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,2219263,108,7,0,8,1,105,7,16728766,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16728766,108,7,0,8,1,105,7,7150591,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,7150591,108,7,0,8,1,105,7,3014425,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,3014425,108,9,133,115,7,16776960,116,7,13421772,117,7,8355711,118,9,91,119,9,19,120,9,165,121,9,91,122,9,94,123,7,13421772,124,7,16711680,125,9,91,126,9,95,127,9,19,128,9,19,129,9,17,130,20,3,20,7,3,16780549,5,"CENTRE",0,20,2,20,7,3,16780549,5,"salle Joliot-Curie",20,7,20,11,6,1351411200,6,1351468200,5,"salle ferm\\u00E9e",3,9,3,106911,3,16001,3,1246208,9,19,0,0,3,26431,20,11,6,1351497600,6,1351554600,9,180,9,181,3,106988,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351238400,6,1351295400,9,180,9,181,3,107082,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351152000,6,1351209000,9,180,9,181,3,107115,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351670400,6,1351727400,9,180,9,181,3,107199,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351584000,6,1351641000,9,180,9,181,3,107458,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351324800,6,1351381800,9,180,9,181,3,107548,9,183,3,1246208,9,19,0,0,9,185,20,1,20,7,3,50332682,5,"VIE ASSOCIATIVE",9,176,20,1,20,7,3,100664320,5,"FERMETURE DE SALLE",9,176,0,3,46,0,0,3,584,0,0,3,5,0,0,20,7,3,16780549,5,"X_salle des f\\u00EAtes",20,1,20,10,6,1339545600,6,1402444800,5,"SALLE FERMEE",3,5,3,111586,0,3,2490368,9,19,0,0,0,3,1,0,0,3,55,0,0,20,7,3,16780549,5,"CHEMIN DE L\'ILE",0,20,1,20,7,3,16780549,5,"X_petite salle Voltaire",20,1,20,10,6,1339545600,6,1402444800,9,234,9,235,3,111587,0,3,2490368,9,19,0,0,0,3,13,0,0,3,51,0,0,20,7,3,16780549,5,"UNIVERSITE",0,20,3,20,7,9,170,5,"BERTHELOT",0,20,8,20,7,3,16780549,5,"salle d\'Arts Plastiques - 1er \\u00E9tage",20,3,20,11,6,1351614600,6,1351629000,5,"c\\u00E9ramique",3,17,3,112813,3,16367,3,1245184,9,19,0,0,3,27164,20,11,6,1351182600,6,1351198800,9,269,3,17,3,112895,3,16369,3,1246208,9,19,0,0,3,27211,20,11,6,1351333800,6,1351364400,9,269,3,17,3,112930,3,16370,3,1246208,9,19,0,0,3,27253,20,1,20,7,3,50332681,5,"AGORA IDF92",9,265,20,1,20,7,9,222,5,"Activit\\u00E9s culturelles",9,265,0,3,13,0,0,3,295,0,0,3,38,0,0,20,7,3,16780549,5,"salle de Cours - 2\\u00E8me \\u00E9tage",20,6,20,11,6,1351339200,6,1351364400,5,"cours",3,9,3,112233,3,16354,3,1246208,9,19,0,0,3,26874,20,11,6,1351414800,6,1351432800,9,308,3,9,3,112261,3,16355,3,1245184,9,19,0,0,3,26905,20,11,6,1351269000,6,1351283400,5,"aide \\u00E0 la scolarit\\u00E9",3,19,3,113054,3,16373,3,1246208,9,19,0,0,3,27322,20,11,6,1351528200,6,1351542600,9,325,9,326,3,113076,9,328,3,1246208,9,19,0,0,9,330,20,11,6,1351614600,6,1351629000,9,325,9,326,3,113097,9,328,3,1246208,9,19,0,0,9,330,20,11,6,1351182600,6,1351197000,9,325,9,326,3,113148,9,328,3,1246208,9,19,0,0,9,330,20,2,20,7,3,50332681,5,"FRANCO TAMOULS",20,2,9,305,9,314,20,1,20,7,9,222,9,297,9,350,0,3,13,0,0,3,399,0,0,20,7,3,50332681,5,"LA BOUSSOLE",20,4,9,322,9,331,9,336,9,341,20,1,20,7,9,222,5,"Accompagnement \\u00E0 la scolarit\\u00E9",9,358,0,3,16,0,0,3,407,0,0,3,40,0,0,20,7,3,16780549,5,"salle de danse - 2\\u00E8me \\u00E9tage",20,9,20,11,6,1351188000,6,1351198800,5,"DANSE",3,15,3,111894,3,16346,9,340,9,19,0,0,3,26698,20,11,6,1351276200,6,1351292400,5,"FLECH\'CAN",3,15,3,111927,3,16347,3,1246208,9,19,0,0,3,26713,20,11,6,1351353600,6,1351366200,9,308,3,9,3,112166,3,16352,3,1245184,9,19,0,0,3,26836,20,11,6,1351414800,6,1351429200,9,308,3,9,3,112170,3,16353,3,1245184,9,19,0,0,3,26844,20,11,6,1351614600,6,1351629000,5,"danse",3,17,3,112644,3,16364,3,1246208,9,19,0,0,3,27105,20,11,6,1351697400,6,1351710000,9,405,3,17,3,112722,3,16365,3,1246208,9,19,0,0,3,27121,20,11,6,1351333800,6,1351351800,9,405,3,17,3,112747,3,16366,3,1246208,9,19,0,0,3,27161,20,11,6,1351629000,6,1351635300,9,405,3,25,3,114018,3,16384,3,1246208,9,19,0,0,3,27544,20,11,6,1351589400,6,1351596600,5,"expression corporelle",3,9,3,114065,3,16385,3,1246208,9,19,0,0,3,27566,20,5,20,7,3,50332681,9,380,20,2,9,369,9,377,20,1,20,7,9,222,5,"Danse",9,447,0,3,3,0,0,3,457,0,0,20,7,3,50332681,9,349,20,2,9,386,9,394,20,1,20,7,9,222,9,297,9,455,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,294,20,3,9,402,9,411,9,419,20,1,20,7,9,222,9,450,9,462,0,3,3,0,0,3,295,0,0,20,7,3,50332681,5,"ABERPA",20,1,9,427,20,1,20,7,9,222,9,450,9,470,0,3,3,0,0,3,174,0,0,20,7,3,50332682,5,"IME",20,1,9,435,20,1,20,7,9,222,9,297,9,478,0,3,13,0,0,3,582,0,0,3,39,0,0,20,7,3,16780549,5,"salle de quartier - Rdc",20,3,20,11,6,1351339200,6,1351368000,5,"activit\\u00E9s culturelles",3,9,3,112396,3,16358,3,1246208,9,19,0,0,3,26955,20,11,6,1351414800,6,1351440000,9,491,3,9,3,112455,3,16359,3,1246208,9,19,0,0,3,26986,20,11,6,1351156500,6,1351164600,9,297,3,23,3,113613,3,16379,3,1246208,9,19,0,0,3,27449,20,2,20,7,3,50332681,9,349,20,2,9,488,9,497,20,1,20,7,9,222,9,297,9,516,0,3,13,0,0,3,399,0,0,20,7,3,50332681,5,"CENTRE SOCIAL ET CULTUREL LA TRAVERSES - UNIS VERS CITES",20,1,9,505,20,1,20,7,9,222,9,297,9,524,0,9,458,0,0,3,355,0,0,3,19,0,0,20,7,3,16780549,5,"salle de r\\u00E9unions - 1er \\u00E9tage",20,12,20,11,6,1351339200,6,1351364400,9,491,3,9,3,112316,3,16356,3,1246208,9,19,0,0,3,26931,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112354,3,16357,3,1246208,9,19,0,0,3,26941,9,322,9,331,9,336,9,341,20,11,6,1351501200,6,1351509300,5,"ateliers socio linguistique",3,23,3,113746,3,16381,3,1246208,9,19,0,0,3,27492,20,11,6,1351587600,6,1351595700,9,552,9,553,3,113776,9,555,3,1246208,9,19,0,0,9,557,20,11,6,1351155600,6,1351163700,9,552,9,553,3,113830,9,555,3,1246208,9,19,0,0,9,557,20,11,6,1351173600,6,1351180800,9,552,3,23,3,113901,3,16382,3,1246208,9,19,0,0,3,27508,20,11,6,1351605600,6,1351612800,9,552,9,571,3,113922,9,573,3,1246208,9,19,0,0,9,575,20,11,6,1351519200,6,1351526400,9,552,9,571,3,113964,9,573,9,312,9,19,0,0,9,575,20,3,20,7,3,50332681,9,349,20,2,9,533,9,541,20,1,20,7,9,222,9,297,9,588,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,357,9,358,20,1,20,7,9,222,9,361,9,358,0,3,16,0,0,3,407,0,0,20,7,3,50332681,9,523,20,6,9,549,9,558,9,563,9,568,9,576,9,581,20,1,20,7,9,222,9,297,9,601,0,3,13,0,0,3,355,0,0,3,37,0,0,20,7,3,16780549,5,"salle de vie cuisine - 1er \\u00E9tage",20,9,20,11,6,1351692000,6,1351702800,5,"Atelier cuisine",3,15,3,111975,3,16348,3,1246208,9,19,0,0,3,26744,20,11,6,1351339200,6,1351360800,9,491,9,181,3,112524,3,16361,9,312,9,19,0,0,3,27027,20,11,6,1351278000,6,1351285200,9,491,3,9,3,112585,3,16362,3,1245184,9,19,0,0,3,27053,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112618,3,16363,3,1245184,9,19,0,0,3,27075,20,11,6,1351614600,6,1351629000,5,"ateliers",3,19,3,113216,3,16374,3,1246208,9,19,0,0,3,27344,20,11,6,1351528200,6,1351542600,9,645,9,646,3,113221,9,648,3,1246208,9,19,0,0,9,650,20,11,6,1351172700,6,1351180800,5,"atelier cuisine",9,553,3,113495,3,16378,9,442,9,19,0,0,3,27437,20,11,6,1351259100,6,1351267200,9,659,9,553,3,113537,9,661,3,1246208,9,19,0,0,9,662,20,11,6,1351604700,6,1351612800,9,659,9,553,3,113597,9,661,3,1246208,9,19,0,0,9,662,20,4,20,7,3,50332681,9,380,20,1,9,611,20,1,20,7,9,222,5,"Cuisine",9,676,0,3,9,0,0,3,457,0,0,20,7,3,50332681,9,349,20,3,9,620,9,626,9,634,20,1,20,7,9,222,9,297,9,684,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,357,20,2,9,642,9,651,20,1,20,7,9,222,9,679,9,691,0,3,9,0,0,3,407,0,0,20,7,3,50332681,9,523,20,3,9,656,9,663,9,668,20,1,20,7,9,222,9,679,9,698,0,3,9,0,0,3,355,0,0,3,36,0,0,20,7,3,16780549,5,"salle des petits - 2\\u00E8me \\u00E9tage",20,5,20,11,6,1351339200,6,1351360800,9,308,3,9,3,112042,3,16350,3,1246208,9,19,0,0,3,26776,20,11,6,1351414800,6,1351425600,9,308,3,9,3,112085,3,16351,3,1246208,9,19,0,0,3,26808,20,11,6,1351699200,6,1351708200,5,"gym douce",3,17,3,112998,3,16372,3,1246208,9,19,0,0,3,27279,20,11,6,1351269000,6,1351283400,5,"aide \\u00E0 la parentalit\\u00E9",3,19,3,113343,3,16375,3,1246208,9,19,0,0,3,27346,20,11,6,1351182600,6,1351197000,9,736,9,737,3,113378,9,739,9,195,9,19,0,0,9,741,20,3,20,7,3,50332681,9,349,20,2,9,708,9,716,20,1,20,7,9,222,9,297,9,749,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,294,20,1,9,724,20,1,20,7,9,222,9,297,9,756,0,3,13,0,0,3,295,0,0,20,7,3,50332681,9,357,20,2,9,733,9,742,20,1,20,7,9,222,5,"Parentalit\\u00E9",9,763,0,3,20,0,0,3,407,0,0,3,41,0,0,20,7,3,16780549,5,"salle des s\\u00E9niors - Rdc",20,11,20,11,6,1351269000,6,1351288800,5,"rencontre conviviale",3,11,3,107885,3,16258,3,1246208,9,19,0,0,3,26480,20,11,6,1351528200,6,1351548000,9,777,9,778,3,108024,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351614600,6,1351634400,9,777,9,778,3,108076,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351182600,6,1351202400,9,777,9,778,3,108081,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351350000,6,1351375200,5,"LES DOMINOS",3,11,3,108176,3,16259,3,1245184,9,19,0,0,3,26492,20,11,6,1351436400,6,1351461600,9,801,9,802,3,108194,9,804,3,1245184,9,19,0,0,9,806,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112506,3,16360,9,200,9,19,0,0,3,27007,20,11,6,1351344600,6,1351350000,5,"cours Italien",9,422,3,112966,3,16371,9,195,9,19,0,0,3,27261,20,11,6,1351692000,6,1351699200,5,"atelier mosa\\u00EFque romaine",3,21,3,113443,3,16377,3,1246208,9,19,0,0,3,27409,20,11,6,1351242900,6,1351251000,5,"atelier lecture",3,23,3,113654,3,16380,3,1246208,9,19,0,0,3,27471,20,11,6,1351156500,6,1351164600,9,838,9,839,3,113686,9,841,3,1246208,9,19,0,0,9,843,20,5,20,7,3,50332681,9,801,20,6,9,774,9,783,9,788,9,793,9,798,9,807,20,1,20,7,9,222,9,297,9,852,0,3,13,0,0,3,916,0,0,20,7,3,50332681,9,349,20,1,9,812,20,1,20,7,9,222,9,297,9,859,0,3,13,0,0,3,399,0,0,20,7,9,697,9,294,20,1,9,819,20,1,20,7,9,222,5,"Divers",9,865,0,3,12,0,0,3,295,0,0,20,7,3,50332681,5,"CLUB AMITIE ET LOISIRS DES SENIORS DE NANTERRE",20,1,9,826,20,1,20,7,9,222,9,297,9,874,0,3,13,0,0,3,319,0,0,20,7,3,50332681,9,523,20,2,9,835,9,844,20,1,20,7,9,222,9,297,9,881,0,3,13,0,0,3,355,0,0,3,20,0,0,3,34,0,0,20,7,9,174,5,"PROVINCES FRANCAISES",20,1,20,10,6,1341187200,6,1404086400,9,234,9,235,3,111588,0,3,2490368,9,19,0,0,0,3,59,0,0,20,7,9,366,5,"salle Soufflot",20,2,20,11,6,1351330200,6,1351346400,5,"cours et jeux d\'\\u00E9chec",3,13,3,111767,3,16314,3,1246208,9,19,0,0,3,26601,20,11,6,1351623600,6,1351634400,5,"COURS DE DANSE",3,15,3,112035,3,16349,3,1245184,9,19,0,0,3,26758,20,2,20,7,3,50332681,5,"ESN ECHEC",20,1,9,900,20,1,20,7,9,222,9,297,9,922,0,3,13,0,0,3,1130,0,0,20,7,3,50332681,9,380,20,1,9,909,20,1,20,7,9,222,9,450,9,929,0,3,3,0,0,3,457,0,0,3,31,0,0,3,52,0,0,131,5,"planningForm",132,9,19,133,20,0,134,9,19,135,9,19,136,9,85]';
var JMChain = '["MSTE0102",60,"CRC5ED113C0",2,"Person","Person2",4,"firstName","maried-to","name","birthday",31,8,50,4,0,21,"Yves",1,50,4,0,21,"Claire",1,9,1,2,21,"Durand",3,22,-207360000,2,21,"Durand \\u00A5-$-\\u20AC",3,22,-243820800,9,3,51,3,2,9,5,0,21,"Lou",3,22,552096000,4,25,"Rjd5NA==",9,1,9,12,4]';
var encodedArray = ["MSTE0102", 772, "CRC00000000", 0, 37, "ACT", "OPTS", "VARS", "search", "code", "options", "index", "objectKey", "flags", "name", "city", "activityType", "globals", "strings", "nameRestriction", "value", "searchMode", "type", "activity", "tutor", "proprio", "parent", "configsForm", "defaultSwitch", "configurationsList", "forceDontChoice", "found", "mapSwitch", "selectTable", "columns", "cityColumn", "nameColumn", "parentIndexSelector", "comparisonSelector", "target", "MID", "TIME", 30, 5, 0, 21, "find", 1, 30, 0, 2, 30, 3, 3, 30, 11, 4, 30, 4, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 264, 9, 30, 4, 5, 32, 0, 20, 100, 6, 20, -1, 7, 20, -1, 8, 20, 264, 10, 30, 4, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 264, 11, 30, 5, 12, 30, 1, 13, 31, 86, 21, "ARTS MARTIAUX", 21, "ATHLETISME", 21, "AVIRON", 21, "BADMINTON", 21, "BADMINTON-Scolaire", 21, "BASKET-BALL", 21, "BOOMERANG", 21, "BOULE DE FORT", 21, "BOULE LYONNAISE", 21, "BOXE", 21, "BOXE AMERICAINE", 21, "BOXE ANGLAISE", 21, "BOXE FRANCAISE", 21, "BOXE THAILANDAISE", 21, "CANNE ET BATON", 21, "CANOE KAYAK", 21, "CAPOEIRA", 21, "CATCH", 21, "CONCERTS", 21, "COURS EPS", 21, "CYCLISME", 21, "CYCLOTOURISME", 21, "DANSE", 21, "DANSE SUR GLACE", 21, "DIVERS", 21, "ESCALADE", 21, "ESCRIME", 21, "FLECHETTE", 21, "FOOT EN SALLE", 21, "FOOTBALL", 21, "FOOTBALL AMERICAIN", 21, "FORMATIONS", 21, "GOLF", 21, "GRIMPER A LA CORDE", 21, "GYMNASTIQUE", 21, "GYMNASTIQUE ENTRETIEN", 21, "HALTEROPHILIE", 21, "HANDBALL", 21, "HOCKEY SUR GAZON", 21, "HOCKEY SUR GLACE", 21, "INTERVIEW/ RADIO/TELE", 21, "JU JITSU", 21, "JUDO", 21, "KARATE", 21, "KENDO", 21, "KIN-BALL", 21, "LUTTE", 21, "MOTOCYCLISME", 21, "MULTISPORTS", 21, "MUSCULATION", 21, "NETTOYAGE", 21, "PARACHUTISME", 21, "PATINAGE SUR GLACE", 21, "PETANQUE", 21, "PLANCHE A VOILE", 21, "PLONGEE SOUS MARINE", 21, "PREPA.MANIF.", 21, "RECEPTIONS/FESTIVITES", 21, "REUNIONS", 21, "RINGUETTE", 21, "ROLLER HOCKEY", 21, "ROLLER SKATING", 21, "RUGBY", 21, "SAUNA", 21, "SPELEOLOGIE", 21, "SPORTS DE GLACE", 21, "SPORTS SCOLAIRES", 21, "TAEKWONDO", 21, "TAI DOH", 21, "TAI JITSU", 21, "TENNIS", 21, "TENNIS DE TABLE", 21, "TIR A L'ARC", 21, "TIR A LA CIBLE", 21, "TONFA", 21, "TONFA", 21, "TRAMPOLINE", 21, "TRAVAUX", 21, "TRIATHLON", 21, "TWIRLING", 21, "TX PAR ENTREPRISE", 21, "ULTIMATE", 21, "VETERANS", 21, "VIET VO DAO", 21, "VOILE", 21, "VOLLEY BALL", 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 18952, 14, 30, 5, 8, 20, 2824, 15, 3, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 16, 30, 5, 8, 20, 17672, 15, 20, 4, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 17, 30, 5, 12, 30, 1, 13, 31, 24, 21, "Aire de sports de Glace", 21, "Court de Tennis Couvert", 21, "Court de Tennis Plein-Air", 21, "Divers", 21, "Equipement d'athletisme", 21, "HALLES", 21, "J.d'arc C.", 21, "J.d'arc P.A.", 21, "PARKINGS", 21, "Pas de tir", 21, "Plaine de Golf", 21, "Plateau EPS", 21, "Salle de Reception", 21, "Salle Omnisports", 21, "Salle Polyvalente", 21, "Salle Specialisee", 21, "SALLES", 21, "Skate par et Velo freestyle", 21, "Terrain d'Honneur", 21, "Terrain en herbe", 21, "Terrain exterieur", 21, "Terrain stabilise", 21, "Terrain synthetique", 21, "Velodrome", 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 18952, 18, 30, 5, 12, 30, 1, 13, 31, 89, 21, "ARTS MARTIAUX \u00e9\u00e0", 21, "ATHLETISME", 21, "AVIRON", 21, "BADMINTON", 21, "BADMINTON-Scolaire", 21, "BASKET-BALL", 21, "BOOMERANG", 21, "BOULE DE FORT", 21, "BOULE LYONNAISE", 21, "BOXE", 21, "BOXE AMERICAINE", 21, "BOXE ANGLAISE", 21, "BOXE FRANCAISE", 21, "BOXE THAILANDAISE", 21, "CANNE ET BATON", 21, "CANOE KAYAK", 21, "CAPOEIRA", 21, "CATCH", 21, "CONCERTS", 21, "COURS EPS", 21, "CYCLISME", 21, "CYCLOTOURISME", 21, "DANSE", 21, "DANSE SUR GLACE", 21, "DIVERS", 21, "ESCALADE", 21, "ESCRIME", 21, "FLECHETTE", 21, "FOOT EN SALLE", 21, "FOOTBALL", 21, "FOOTBALL AMERICAIN", 21, "FORMATIONS", 21, "GOLF", 21, "GRIMPER A LA CORDE", 21, "GYMNASTIQUE", 21, "GYMNASTIQUE ENTRETIEN", 21, "HALTEROPHILIE", 21, "HANDBALL", 21, "HOCKEY SUR GAZON", 21, "HOCKEY SUR GLACE", 21, "INTERVIEW/ RADIO/TELE", 21, "JU JITSU", 21, "JUDO", 21, "KARATE", 21, "KENDO", 21, "KIN-BALL", 21, "LUTTE", 21, "MOTOCYCLISME", 21, "MULTISPORTS", 21, "MUSCULATION", 21, "NATATION", 21, "NETTOYAGE", 21, "PARACHUTISME", 21, "PATINAGE SUR GLACE", 21, "PETANQUE", 21, "PLANCHE A VOILE", 21, "PLONGEE SOUS MARINE", 21, "PREPA.MANIF.", 21, "RECEPTIONS/FESTIVITES", 21, "REUNIONS", 21, "RINGUETTE", 21, "ROLLER HOCKEY", 21, "ROLLER SKATING", 21, "RUGBY", 21, "SAUNA", 21, "SPELEOLOGIE", 21, "SPORTS DE GLACE", 21, "SPORTS SCOLAIRES", 21, "SUBAQUATIQUE", 21, "TAEKWONDO", 21, "TAI DOH", 21, "TAI JITSU", 21, "TENNIS", 21, "TENNIS DE TABLE", 21, "TIR A L'ARC", 21, "TIR A LA CIBLE", 21, "TONFA", 21, "TONFA", 21, "TRAMPOLINE", 21, "TRAVAUX", 21, "TRIATHLON", 21, "TWIRLING", 21, "TX PAR ENTREPRISE", 21, "ULTIMATE", 21, "VETERANS", 21, "VIET VO DAO", 21, "VOILE", 21, "VOLLEY BALL", 21, "WATER-POLO", 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 18952, 19, 30, 4, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 264, 20, 30, 4, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 264, 21, 30, 4, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 8, 20, 264, 22, 30, 2, 23, 30, 5, 8, 20, 17672, 15, 20, 0, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 24, 30, 5, 12, 30, 1, 25, 21, "YES", 5, 32, 0, 25, "", 6, 20, -1, 7, 20, -1, 8, 20, 16704, 26, 30, 2, 27, 30, 5, 8, 20, 17800, 15, 20, 0, 5, 32, 0, 0, 6, 20, -1, 7, 20, -1, 28, 30, 6, 12, 30, 4, 29, 30, 2, 30, 32, 21, "city", 0, 31, 32, 21, "name", 0, 32, 21, "parentIndex", 33, 21, "name", 34, 21, "select", 5, 32, 0, 25, "", 6, 20, -1, 7, 20, -1, 8, 20, 18112, 15, 20, -1, 35, 20, 4, 36, 20, 426763823.875];
var objectToEncode = { "ACT": "select", "OPTS": {}, "VARS": { "search": { "code": { "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 264 }, "activity": { "globals": { "strings": ["ARTS MARTIAUX éà", "ATHLETISME", "AVIRON", "BADMINTON", "BADMINTON-Scolaire", "BASKET-BALL", "BOOMERANG", "BOULE DE FORT", "BOULE LYONNAISE", "BOXE", "BOXE AMERICAINE", "BOXE ANGLAISE", "BOXE FRANCAISE", "BOXE THAILANDAISE", "CANNE ET BATON", "CANOE KAYAK", "CAPOEIRA", "CATCH", "CONCERTS", "COURS EPS", "CYCLISME", "CYCLOTOURISME", "DANSE", "DANSE SUR GLACE", "DIVERS", "ESCALADE", "ESCRIME", "FLECHETTE", "FOOT EN SALLE", "FOOTBALL", "FOOTBALL AMERICAIN", "FORMATIONS", "GOLF", "GRIMPER A LA CORDE", "GYMNASTIQUE", "GYMNASTIQUE ENTRETIEN", "HALTEROPHILIE", "HANDBALL", "HOCKEY SUR GAZON", "HOCKEY SUR GLACE", "INTERVIEW/ RADIO/TELE", "JU JITSU", "JUDO", "KARATE", "KENDO", "KIN-BALL", "LUTTE", "MOTOCYCLISME", "MULTISPORTS", "MUSCULATION", "NATATION", "NETTOYAGE", "PARACHUTISME", "PATINAGE SUR GLACE", "PETANQUE", "PLANCHE A VOILE", "PLONGEE SOUS MARINE", "PREPA.MANIF.", "RECEPTIONS/FESTIVITES", "REUNIONS", "RINGUETTE", "ROLLER HOCKEY", "ROLLER SKATING", "RUGBY", "SAUNA", "SPELEOLOGIE", "SPORTS DE GLACE", "SPORTS SCOLAIRES", "SUBAQUATIQUE", "TAEKWONDO", "TAI DOH", "TAI JITSU", "TENNIS", "TENNIS DE TABLE", "TIR A L'ARC", "TIR A LA CIBLE", "TONFA", "TONFA", "TRAMPOLINE", "TRAVAUX", "TRIATHLON", "TWIRLING", "TX PAR ENTREPRISE", "ULTIMATE", "VETERANS", "VIET VO DAO", "VOILE", "VOLLEY BALL", "WATER-POLO"] }, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 18952 }, "city": { "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 264 }, "activityType": { "globals": { "strings": ["ARTS MARTIAUX", "ATHLETISME", "AVIRON", "BADMINTON", "BADMINTON-Scolaire", "BASKET-BALL", "BOOMERANG", "BOULE DE FORT", "BOULE LYONNAISE", "BOXE", "BOXE AMERICAINE", "BOXE ANGLAISE", "BOXE FRANCAISE", "BOXE THAILANDAISE", "CANNE ET BATON", "CANOE KAYAK", "CAPOEIRA", "CATCH", "CONCERTS", "COURS EPS", "CYCLISME", "CYCLOTOURISME", "DANSE", "DANSE SUR GLACE", "DIVERS", "ESCALADE", "ESCRIME", "FLECHETTE", "FOOT EN SALLE", "FOOTBALL", "FOOTBALL AMERICAIN", "FORMATIONS", "GOLF", "GRIMPER A LA CORDE", "GYMNASTIQUE", "GYMNASTIQUE ENTRETIEN", "HALTEROPHILIE", "HANDBALL", "HOCKEY SUR GAZON", "HOCKEY SUR GLACE", "INTERVIEW/ RADIO/TELE", "JU JITSU", "JUDO", "KARATE", "KENDO", "KIN-BALL", "LUTTE", "MOTOCYCLISME", "MULTISPORTS", "MUSCULATION", "NETTOYAGE", "PARACHUTISME", "PATINAGE SUR GLACE", "PETANQUE", "PLANCHE A VOILE", "PLONGEE SOUS MARINE", "PREPA.MANIF.", "RECEPTIONS/FESTIVITES", "REUNIONS", "RINGUETTE", "ROLLER HOCKEY", "ROLLER SKATING", "RUGBY", "SAUNA", "SPELEOLOGIE", "SPORTS DE GLACE", "SPORTS SCOLAIRES", "TAEKWONDO", "TAI DOH", "TAI JITSU", "TENNIS", "TENNIS DE TABLE", "TIR A L'ARC", "TIR A LA CIBLE", "TONFA", "TONFA", "TRAMPOLINE", "TRAVAUX", "TRIATHLON", "TWIRLING", "TX PAR ENTREPRISE", "ULTIMATE", "VETERANS", "VIET VO DAO", "VOILE", "VOLLEY BALL"] }, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 18952 }, "type": { "globals": { "strings": ["Aire de sports de Glace", "Court de Tennis Couvert", "Court de Tennis Plein-Air", "Divers", "Equipement d'athletisme", "HALLES", "J.d'arc C.", "J.d'arc P.A.", "PARKINGS", "Pas de tir", "Plaine de Golf", "Plateau EPS", "Salle de Reception", "Salle Omnisports", "Salle Polyvalente", "Salle Specialisee", "SALLES", "Skate par et Velo freestyle", "Terrain d'Honneur", "Terrain en herbe", "Terrain exterieur", "Terrain stabilise", "Terrain synthetique", "Velodrome"] }, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 18952 }, "searchMode": { "flags": 17672, "value": 3, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1 }, "nameRestriction": { "flags": 2824, "value": "", "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1 }, "name": { "flags": 264, "value": "AIRES", "options": { "firstMember": null, "secondMember": 100 }, "index": -1, "objectKey": -1 }, "tutor": { "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 264 }, "proprio": { "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 264 }, "parent": { "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1, "flags": 264 } }, "#default#": { "searchTitleMessage": { "flags": 392, "value": "Choisissez un nouveau Lieu à éditer ou créez-en un", "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1 }, "searchSwitch": { "flags": 17672, "value": 0, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1 }, "switch": { "globals": { "enabledObjects": [0, 1, 2] }, "flags": 17416, "value": 0, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1 } }, "configsForm": { "defaultSwitch": { "flags": 17672, "value": 2, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1 }, "configurationsList": { "globals": { "forceDontChoice": "YES" }, "flags": 16704, "value": "AIRES", "options": { "firstMember": null, "secondMember": [] }, "index": 0, "objectKey": -1 } }, "found": { "mapSwitch": { "flags": 17800, "value": 0, "options": { "firstMember": null, "secondMember": null }, "index": -1, "objectKey": -1 }, "selectTable": { "globals": { "columns": { "cityColumn": { "firstMember": "city", "secondMember": null }, "nameColumn": { "firstMember": "name", "secondMember": null } }, "parentIndexSelector": "parentIndex", "comparisonSelector": "name", "target": "select" }, "options": { "firstMember": null, "secondMember": [] }, "index": -1, "objectKey": -1, "flags": 17984, "value": -1 } } }, "MID": 4, "TIME": 426700506.435 };
var XVarArray = ["MSTE0102", 974, "CRC8A517221", 1, "XVar", 63, "STAT", "RSRC", "path", "basePath", "modificationDate", "isFolder", "CARD", "PACT", "OPTS", "CTXCLASS", "HELPERS", "cityName", "targets", "selection", "index", "name", "FIRST_FIELD", "INAM", "ACTIONS", "progPrint", "home", "add", "addConfig", "find", "configurationsList", "switch", "makesDefault", "CARDTITLE", "MID", "VARS", "search", "code", "options", "objectKey", "flags", "city", "activityType", "globals", "strings", "nameRestriction", "value", "searchMode", "type", "activity", "tutor", "proprio", "parent", "#default#", "searchTitleMessage", "searchSwitch", "enabledObjects", "configsForm", "defaultSwitch", "forceDontChoice", "found", "mapSwitch", "selectTable", "columns", "cityColumn", "nameColumn", "parentIndexSelector", "comparisonSelector", "target", 30, 10, 0, 20, 2, 1, 31, 1, 30, 4, 2, 21, "W:\\PlanitecMs\\Library\\XNet\\PlanitecServer.xna\\Resources\\Microstep\\MASH\\interfaces\\fr\\placeSearch@placeSearch.json", 3, 21, "_main_\/interfaces\/fr\/placeSearch@placeSearch", 4, 23, 1404138188.000000000000000, 5, 20, 0, 6, 21, "placeSearch", 7, 21, "newContext", 8, 30, 3, 9, 21, "PPlaceSelectionContext", 10, 30, 1, 11, 32, 30, 4, 2, 21, "W:\\PlanitecMs\\Library\\XNet\\SharedResources\\misc\\zipCodes.csv", 3, 21, "_main_\/misc\/zipCodes", 4, 23, 1404138188.000000000000000, 5, 20, 0, 30, 4, 12, 31, 1, 21, "cityName", 13, 21, "indexName", 14, 9, 22, 15, 21, "zipCodes", 16, 32, 21, "name", 21, "search", 17, 9, 8, 18, 30, 8, 19, 20, 0, 20, 20, 7, 21, 20, 0, 22, 20, 0, 23, 20, 0, 24, 20, 0, 25, 20, 0, 26, 20, 0, 27, 21, "\/Gestion des lieux\/S\u00E9lection", 28, 20, 2, 29, 30, 4, 30, 30, 11, 31, 50, 4, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 264, 15, 50, 4, 32, 32, 0, 20, 100, 14, 12, -1, 33, 12, -1, 34, 13, 264, 35, 50, 4, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 264, 36, 50, 5, 37, 30, 1, 38, 31, 86, 21, "ARTS MARTIAUX", 21, "ATHLETISME", 21, "AVIRON", 21, "BADMINTON", 21, "BADMINTON-Scolaire", 21, "BASKET-BALL", 21, "BOOMERANG", 21, "BOULE DE FORT", 21, "BOULE LYONNAISE", 21, "BOXE", 21, "BOXE AMERICAINE", 21, "BOXE ANGLAISE", 21, "BOXE FRANCAISE", 21, "BOXE THAILANDAISE", 21, "CANNE ET BATON", 21, "CANOE KAYAK", 21, "CAPOEIRA", 21, "CATCH", 21, "CONCERTS", 21, "COURS EPS", 21, "CYCLISME", 21, "CYCLOTOURISME", 21, "DANSE", 21, "DANSE SUR GLACE", 21, "DIVERS", 21, "ESCALADE", 21, "ESCRIME", 21, "FLECHETTE", 21, "FOOT EN SALLE", 21, "FOOTBALL", 21, "FOOTBALL AMERICAIN", 21, "FORMATIONS", 21, "GOLF", 21, "GRIMPER A LA CORDE", 21, "GYMNASTIQUE", 21, "GYMNASTIQUE ENTRETIEN", 21, "HALTEROPHILIE", 21, "HANDBALL", 21, "HOCKEY SUR GAZON", 21, "HOCKEY SUR GLACE", 21, "INTERVIEW\/ RADIO\/TELE", 21, "JU JITSU", 21, "JUDO", 21, "KARATE", 21, "KENDO", 21, "KIN-BALL", 21, "LUTTE", 21, "MOTOCYCLISME", 21, "MULTISPORTS", 21, "MUSCULATION", 21, "NETTOYAGE", 21, "PARACHUTISME", 21, "PATINAGE SUR GLACE", 21, "PETANQUE", 21, "PLANCHE A VOILE", 21, "PLONGEE SOUS MARINE", 21, "PREPA.MANIF.", 21, "RECEPTIONS\/FESTIVITES", 21, "REUNIONS", 21, "RINGUETTE", 21, "ROLLER HOCKEY", 21, "ROLLER SKATING", 21, "RUGBY", 21, "SAUNA", 21, "SPELEOLOGIE", 21, "SPORTS DE GLACE", 21, "SPORTS SCOLAIRES", 21, "TAEKWONDO", 21, "TAI DOH", 21, "TAI JITSU", 21, "TENNIS", 21, "TENNIS DE TABLE", 21, "TIR A L'ARC", 21, "TIR A LA CIBLE", 21, "TONFA", 21, "TONFA", 21, "TRAMPOLINE", 21, "TRAVAUX", 21, "TRIATHLON", 21, "TWIRLING", 21, "TX PAR ENTREPRISE", 21, "ULTIMATE", 21, "VETERANS", 21, "VIET VO DAO", 21, "VOILE", 21, "VOLLEY BALL", 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 18952, 39, 50, 5, 34, 13, 2824, 40, 3, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 41, 50, 5, 34, 13, 17672, 40, 20, 4, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 42, 50, 5, 37, 30, 1, 38, 31, 24, 21, "Aire de sports de Glace", 21, "Court de Tennis Couvert", 21, "Court de Tennis Plein-Air", 21, "Divers", 21, "Equipement d'athletisme", 21, "HALLES", 21, "J.d'arc C.", 21, "J.d'arc P.A.", 21, "PARKINGS", 21, "Pas de tir", 21, "Plaine de Golf", 21, "Plateau EPS", 21, "Salle de Reception", 21, "Salle Omnisports", 21, "Salle Polyvalente", 21, "Salle Specialisee", 21, "SALLES", 21, "Skate par et Velo freestyle", 21, "Terrain d'Honneur", 21, "Terrain en herbe", 21, "Terrain exterieur", 21, "Terrain stabilise", 21, "Terrain synthetique", 21, "Velodrome", 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 18952, 43, 50, 5, 37, 30, 1, 38, 31, 89, 21, "ARTS MARTIAUX \u00E9\u00E0", 21, "ATHLETISME", 21, "AVIRON", 21, "BADMINTON", 21, "BADMINTON-Scolaire", 21, "BASKET-BALL", 21, "BOOMERANG", 21, "BOULE DE FORT", 21, "BOULE LYONNAISE", 21, "BOXE", 21, "BOXE AMERICAINE", 21, "BOXE ANGLAISE", 21, "BOXE FRANCAISE", 21, "BOXE THAILANDAISE", 21, "CANNE ET BATON", 21, "CANOE KAYAK", 21, "CAPOEIRA", 21, "CATCH", 21, "CONCERTS", 21, "COURS EPS", 21, "CYCLISME", 21, "CYCLOTOURISME", 21, "DANSE", 21, "DANSE SUR GLACE", 21, "DIVERS", 21, "ESCALADE", 21, "ESCRIME", 21, "FLECHETTE", 21, "FOOT EN SALLE", 21, "FOOTBALL", 21, "FOOTBALL AMERICAIN", 21, "FORMATIONS", 21, "GOLF", 21, "GRIMPER A LA CORDE", 21, "GYMNASTIQUE", 21, "GYMNASTIQUE ENTRETIEN", 21, "HALTEROPHILIE", 21, "HANDBALL", 21, "HOCKEY SUR GAZON", 21, "HOCKEY SUR GLACE", 21, "INTERVIEW\/ RADIO\/TELE", 21, "JU JITSU", 21, "JUDO", 21, "KARATE", 21, "KENDO", 21, "KIN-BALL", 21, "LUTTE", 21, "MOTOCYCLISME", 21, "MULTISPORTS", 21, "MUSCULATION", 21, "NATATION", 21, "NETTOYAGE", 21, "PARACHUTISME", 21, "PATINAGE SUR GLACE", 21, "PETANQUE", 21, "PLANCHE A VOILE", 21, "PLONGEE SOUS MARINE", 21, "PREPA.MANIF.", 21, "RECEPTIONS\/FESTIVITES", 21, "REUNIONS", 21, "RINGUETTE", 21, "ROLLER HOCKEY", 21, "ROLLER SKATING", 21, "RUGBY", 21, "SAUNA", 21, "SPELEOLOGIE", 21, "SPORTS DE GLACE", 21, "SPORTS SCOLAIRES", 21, "SUBAQUATIQUE", 21, "TAEKWONDO", 21, "TAI DOH", 21, "TAI JITSU", 21, "TENNIS", 21, "TENNIS DE TABLE", 21, "TIR A L'ARC", 21, "TIR A LA CIBLE", 21, "TONFA", 21, "TONFA", 21, "TRAMPOLINE", 21, "TRAVAUX", 21, "TRIATHLON", 21, "TWIRLING", 21, "TX PAR ENTREPRISE", 21, "ULTIMATE", 21, "VETERANS", 21, "VIET VO DAO", 21, "VOILE", 21, "VOLLEY BALL", 21, "WATER-POLO", 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 18952, 44, 50, 4, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 264, 45, 50, 4, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 264, 46, 50, 4, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 34, 13, 264, 47, 30, 3, 48, 50, 5, 34, 13, 392, 40, 21, "Choisissez un nouveau Lieu \u00E0 \u00E9diter ou cr\u00E9ez-en un", 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 49, 50, 5, 34, 13, 17672, 40, 20, 0, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 25, 50, 6, 37, 30, 1, 50, 26, 3, 0, 1, 2, 34, 13, 17416, 40, 20, 0, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 51, 30, 2, 52, 50, 5, 34, 13, 17672, 40, 20, 0, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 24, 50, 5, 37, 30, 1, 53, 21, "YES", 32, 32, 31, 5, 21, "AIRES", 21, "AIRES 2", 21, "Tennis couverts", 21, "ddd", 21, "sss", 25, "", 14, 12, -1, 33, 12, -1, 34, 13, 16704, 54, 30, 2, 55, 50, 5, 34, 13, 17800, 40, 20, 0, 32, 32, 0, 0, 14, 12, -1, 33, 12, -1, 56, 50, 5, 37, 30, 4, 57, 30, 2, 58, 32, 21, "city", 0, 59, 32, 9, 25, 0, 60, 21, "parentIndex", 61, 9, 25, 62, 21, "select", 32, 32, 31, 0, 25, "", 14, 12, -1, 33, 12, -1, 34, 13, 18112];
function test_mste(mste, value) {
    var decoded, encoded, redecoded;
    chai_1.expect(function () { decoded = _1.MSTE.parse(mste); }).not.throw();
    chai_1.expect(decoded).to.deep.equal(value, JSON.stringify({ mste: mste, value: value, decoded: decoded }));
    chai_1.expect(function () { encoded = _1.MSTE.stringify(value); }).not.throw();
    chai_1.expect(function () { redecoded = _1.MSTE.parse(encoded); }).not.throw();
    chai_1.expect(redecoded).to.deep.equal(value, JSON.stringify({ mste: mste, value: value, encoded: encoded, redecoded: redecoded }));
}
describe("MSTE", function () {
    describe('0102', function () {
        it('nil', function () { test_mste("[\"MSTE0102\",6,\"CRC82413E70\",0,0,0]", null); });
        it('true', function () { test_mste("[\"MSTE0102\",6,\"CRC9B5A0F31\",0,0,1]", true); });
        it('false', function () { test_mste("[\"MSTE0102\",6,\"CRCB0775CF2\",0,0,2]", false); });
        it('empty string', function () { test_mste("[\"MSTE0102\",6,\"CRCA96C6DB3\",0,0,3]", ""); });
        it('empty data', function () { test_mste("[\"MSTE0102\",6,\"CRCE62DFB74\",0,0,4]", new _1.MSBuffer()); });
        it('number', function () { test_mste("[\"MSTE0102\",7,\"CRCBF421375\",0,0,20,12.34]", 12.34); });
        it('string 1', function () { test_mste("[\"MSTE0102\",7,\"CRC09065CB6\",0,0,21,\"My beautiful string \\u00E9\\u00E8\"]", "My beautiful string éè"); });
        it('string 2', function () { test_mste("[\"MSTE0102\",7,\"CRC4A08AB7A\",0,0,21,\"Json \\\\a\\/b\\\"c\\u00C6\"]", "Json \\a/b\"cÆ"); });
        it('local date', function () { test_mste("[\"MSTE0102\",7,\"CRC093D5173\",0,0,22,978307200]", new _1.MSDate(2001, 1, 1, 0, 0, 0)); });
        it('gmt date', function () { test_mste("[\"MSTE0102\",7,\"CRCFDED185D\",0,0,23,978307200.000000000000000]", new Date(978307200 * 1000)); });
        it('color', function () { test_mste("[\"MSTE0102\",7,\"CRCAB284946\",0,0,24,4034942921]", new _1.MSColor(128, 87, 201, 15)); });
        it('data', function () { test_mste("[\"MSTE0102\",7,\"CRC4964EA3B\",0,0,25,\"YTF6MmUzcjR0NA==\"]", new _1.MSBuffer("a1z2e3r4t4")); });
        it('naturals', function () { test_mste("[\"MSTE0102\",8,\"CRCD6330919\",0,0,26,1,256]", new _1.MSNaturalArray([256])); });
        it('dictionary', function () { test_mste("[\"MSTE0102\",15,\"CRC891261B3\",0,2,\"key1\",\"key2\",30,2,0,21,\"First object\",1,21,\"Second object\"]", { 'key1': 'First object', 'key2': 'Second object' }); });
        it('array', function () { test_mste("[\"MSTE0102\",11,\"CRC1258D06E\",0,0,31,2,21,\"First object\",21,\"Second object\"]", ["First object", "Second object"]); });
        it('couple', function () { test_mste("[\"MSTE0102\",10,\"CRCF8392337\",0,0,32,21,\"First member\",21,\"Second member\"]", new _1.MSCouple("First member", "Second member")); });
        it('repo', function () { test_mste("[\"MSTE0102\",21,\"CRCD959E1CB\",0,3,\"20061\",\"entity\",\"0\",30,2,0,30,1,1,31,1,21,\"R_Right\",2,30,0]", { '20061': { 'entity': ['R_Right'] }, '0': {} }); });
        it("encoding/decoding", function () {
            var mste = _1.MSTE.stringify(data_array, { version: 0x102 });
            var r = _1.MSTE.parse(mste);
            chai_1.expect(r).to.deep.equal(data_array);
        });
        it("decodes OBJC demo mste chain", function () {
            var r = _1.MSTE.parse(JMChain);
            chai_1.expect(r[0].firstName).to.eq("Yves");
            chai_1.expect(r[0]["maried-to"].firstName).to.eq("Claire"); // Yves's wife is Claire, this reference is correct
            chai_1.expect(r[1]).to.eq(r[0]["maried-to"]);
            chai_1.expect(r[2].firstName).to.eq("Lou");
            chai_1.expect(r[3]).to.deep.equal(new _1.MSBuffer());
            chai_1.expect(r[4].toBase64String()).to.eq("Rjd5NA==");
            chai_1.expect(r[5]).to.eq(r[0]);
            chai_1.expect(r[6]).to.eq(r[4]);
            chai_1.expect(r[7]).to.deep.equal(new _1.MSBuffer());
        });
        it("decodes OBJC demo mste chain with local classes", function () {
            var Person1 = (function () {
                function Person1() {
                }
                return Person1;
            }());
            var Person2 = (function () {
                function Person2() {
                }
                return Person2;
            }());
            var r = _1.MSTE.parse(JMChain, {
                classes: {
                    'Person': Person1,
                    'Person2': Person2
                }
            });
            chai_1.expect(r[0]).to.be.instanceof(Person1);
            chai_1.expect(r[1]).to.be.instanceof(Person1);
            chai_1.expect(r[2]).to.be.instanceof(Person2);
            chai_1.expect(r[0].firstName).to.eq("Yves");
            chai_1.expect(r[0]["maried-to"].firstName).to.eq("Claire"); // Yves's wife is Claire, this reference is correct
            chai_1.expect(r[1]).to.eq(r[0]["maried-to"]);
            chai_1.expect(r[2].firstName).to.eq("Lou");
            chai_1.expect(r[3]).to.deep.equal(new _1.MSBuffer());
            chai_1.expect(r[4].toBase64String()).to.eq("Rjd5NA==");
            chai_1.expect(r[5]).to.eq(r[0]);
            chai_1.expect(r[6]).to.eq(r[4]);
            chai_1.expect(r[7]).to.deep.equal(new _1.MSBuffer());
        });
        it("decodes a natural array", function () {
            var r = _1.MSTE.parse("[\"MSTE0102\",8,\"CRCD6330919\",0,0,26,1,256]");
            chai_1.expect(r).to.be.instanceof(_1.MSNaturalArray);
            chai_1.expect(r[0]).to.eq(256);
        });
        it("bug on code 6", function () {
            var mste = _1.MSTE.stringify(objectToEncode);
            var r = _1.MSTE.parse(mste);
        });
        it("Bug on Xvar class not re-encoded properly", function () {
            var XVar = (function () {
                function XVar() {
                }
                XVar.prototype.encodeToMSTE = function (encoder) { encoder.encodeDictionary(this, "XVar"); };
                return XVar;
            }());
            var r = _1.MSTE.parse(XVarArray, { classes: { "XVar": XVar } });
            var e = _1.MSTE.stringify(r);
            var r2 = _1.MSTE.parse(XVarArray, { classes: { "XVar": XVar } });
        });
        it("encodes simple references (same ref is used multiple times: a person is father to one and married to another)", function () {
            var m = _1.MSTE.stringify(data_graph);
            var r = _1.MSTE.parse(m);
            chai_1.expect(data_graph).to.deep.equal(r);
        });
        it("encodes simple references with a true class", function () {
            var m = _1.MSTE.stringify(data_graph2);
            var r = _1.MSTE.parse(m, {
                classes: {
                    "person": LocalPerson
                }
            });
            chai_1.expect(data_graph2).to.deep.equal(r);
            chai_1.expect(r[0]).to.be.instanceof(LocalPerson);
            chai_1.expect(r[1]).to.be.instanceof(LocalPerson);
            chai_1.expect(r[2]).to.be.instanceof(LocalPerson);
            chai_1.expect(data_graph2).to.deep.equal(r);
        });
        it("bug: encode bug empty buffer", function () {
            var data = new _1.MSBuffer();
            var mste = _1.MSTE.stringify(data);
            var data0 = _1.MSTE.parse(mste);
            chai_1.expect(data.isEqualTo(data0)).to.eq(true);
        });
    });
    describe('0101', function () {
        it("decoding complex", function () {
            var r = _1.MSTE.parse(oldMSTEString);
            chai_1.expect(r.PACT).to.eq('switch');
            chai_1.expect(r.VARS.planningForm.startingHourField.options.secondMember).to.eq(22);
            chai_1.expect(r.VARS.planningForm.visuPop.flags).to.eq(17416);
            chai_1.expect(r.VARS.planningForm.visuIndexRadio.options.firstMember[0]).to.eq(r.VARS.planningForm.visuIndexRadio.value);
            chai_1.expect(r.RSRC[0].basePath).to.eq('_main_/interfaces/planning@planningBox');
            chai_1.expect(r.CARD).to.eq('planningBox');
            chai_1.expect(r.INAM).to.eq('planning');
        });
        it("encoding/decoding", function () {
            var mste = _1.MSTE.stringify(data_array, { version: 0x101 });
            var r = _1.MSTE.parse(mste);
            chai_1.expect(r).to.deep.equal(data_array);
        });
        it("encodes simple references (same ref is used multiple times: a person is father to one and married to another)", function () {
            var m = _1.MSTE.stringify(data_graph, { version: 0x101 });
            var r = _1.MSTE.parse(m);
            // beware : encoding in precedent version will gives you standard dates with no milliseconds ...
            chai_1.expect(r[1].birthday).to.be.instanceof(Date);
            r[1].birthday = new _1.MSDate(r[1].birthday);
            chai_1.expect(data_graph).to.deep.equal(r);
        });
        it("encodes simple references with a true class", function () {
            var m = _1.MSTE.stringify(data_graph2, { version: 0x101 });
            var r = _1.MSTE.parse(m, {
                classes: {
                    "person": LocalPerson
                }
            });
            chai_1.expect(data_graph2).to.deep.equal(r);
            chai_1.expect(r[0]).to.be.instanceof(LocalPerson);
            chai_1.expect(r[1]).to.be.instanceof(LocalPerson);
            chai_1.expect(r[2]).to.be.instanceof(LocalPerson);
            chai_1.expect(data_graph2).to.deep.equal(r);
        });
    });
});

},{"../":42,"chai":4}],52:[function(require,module,exports){
"use strict";
var chai_1 = require('chai');
var _1 = require('../');
describe("MSNaturalArray", function () {
    it("Testing Array subclass behavior slice, concat and splice", function () {
        var n = new _1.MSNaturalArray(1, 2, 3);
        var n2 = new _1.MSNaturalArray([2, 7, 8]);
        var n3;
        chai_1.expect(n.length).to.eq(3);
        chai_1.expect(n[1]).to.eq(2);
        n.push(4);
        chai_1.expect(n.length).to.eq(4);
        n.length = 2;
        chai_1.expect(n.length).to.eq(2);
        n.push(7);
        n.push(8);
        chai_1.expect(n instanceof Array).to.eq(true);
        n3 = n.slice(1, 4);
        chai_1.expect(n3 instanceof _1.MSNaturalArray).to.eq(true);
        chai_1.expect(n3).to.deep.equal(n2);
        n3 = (new _1.MSNaturalArray(1, 2, 3, 4, 5, 6)).concat(n3);
        chai_1.expect(n3).to.deep.equal(new _1.MSNaturalArray(1, 2, 3, 4, 5, 6, 2, 7, 8));
        n3.splice(6, 1);
        chai_1.expect(n3).to.deep.equal(new _1.MSNaturalArray(1, 2, 3, 4, 5, 6, 7, 8));
        n3.unshift(101, 0, 0, 0);
        chai_1.expect(n3).to.deep.equal(new _1.MSNaturalArray(101, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8));
        n3.splice(0, 4);
        n3.splice(8, 0, 9);
        chai_1.expect(n3).to.deep.equal(new _1.MSNaturalArray(1, 2, 3, 4, 5, 6, 7, 8, 9));
        n3.splice(5, 2, 66, 77, 771, 772, 773, 774, 775);
        chai_1.expect(n3).to.deep.equal(new _1.MSNaturalArray(1, 2, 3, 4, 5, 66, 77, 771, 772, 773, 774, 775, 8, 9));
        chai_1.expect(n3 instanceof Array).to.eq(true);
        chai_1.expect(n3 instanceof _1.MSNaturalArray).to.eq(true);
        //expect(Array.isArray(n3)).to.eq(true) ;
    });
    it("Testing constructor", function () {
        var n = new _1.MSNaturalArray();
        chai_1.expect(n.length).to.eq(0);
        n = new _1.MSNaturalArray(4799);
        chai_1.expect(n.length).to.eq(1);
        chai_1.expect(JSON.stringify(n)).to.eq("[4799]");
        n = new _1.MSNaturalArray(1, 8, 3, 7);
        chai_1.expect(n.length).to.eq(4);
        chai_1.expect(JSON.stringify(n)).to.eq("[1,8,3,7]");
    });
    it("Testing constructors with several values", function () {
        var n = new _1.MSNaturalArray(21, 356, 17, 65.5);
        chai_1.expect(JSON.stringify(n)).to.eq("[21,356,17,65]");
        n.unshift(45, 13);
        //expect(MSTools.stringify(n)).to.eq("[45,13,21,356,17,65]");
    });
});

},{"../":42,"chai":4}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{"../core":41}],57:[function(require,module,exports){
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

},{"./msbuffer":53}]},{},[50]);
