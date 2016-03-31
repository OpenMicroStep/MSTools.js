/*! MSTools - v0.0.4 - 2016-03-31 */

// we only add some functions into the main scope

(function() {
    "use strict";

    function $ok(self) { return ((self === null || (typeof self) === 'undefined') ? false : true) ; }
    function $length(self) { return ((self === null || (typeof self) === 'undefined' || (typeof self.length) === 'undefined') ? 0 : self.length) ; }
    function $type(self) { var t ; return ((self === null || (t = (typeof self)) === 'undefined') ? null : (self.isa ? self.isa : t)) ; }

    function $div(a, b) { return (a/b /* / keep that commentary here please */) | 0 ; }
    function $equals(a, b, opts) { return $ok(a) ? ($ok(b) ? a.isEqualTo(b, opts) : false) : ($ok(b) ? false : a === b) ; }

    var MSTools = {};

    var __localUniqueID = 0 ;
    MSTools.localUniqueID = function() { return '$mst'+ (++__localUniqueID) ; } ;
    
    function __recursiveValueForPath(object, path) {
        if ($ok(object) && $ok(path)) {
            var p = path.toString() ;
            if ($length(p)) {
                var res ;
                var pos = p.indexOf('.') ;
                if (pos === -1) {
                    res = object[p] ;
                    if (res && (typeof res) === 'function') { res = res.call(object) ; }
                    return res ;
                }
                else if (pos > 1 && pos + 1 < p.length) {
                    res = object[p.slice(0, pos)] ;
                    if (res) {
                        if (typeof res === 'function') { res = res.call(object) ; }
                        res =  __recursiveValueForPath(res, p.slice(pos+1)) ;
                    }
                }
                if ((typeof res) === 'undefined') { return null ; }
                return res ;
            }
        }
        return null ;
    }
    
    function __prepareCRCTable() {
        var c, n, k, ret = [];
        for(n = 0 ; n < 256 ; n++) {
            c = n;
            for (k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)) ;
            }
            ret[n] = c;
        }
        return ret ;
    
    }
    
    MSTools.isa = 'MSTools' ;
    MSTools.toMSTE = function(encoder) { encoder.encodeException(this) ; } ;
    
    // do we define Object.prototype.isa as 'Object' ?
    
    MSTools.valueForPath = __recursiveValueForPath ;
    
    
    MSTools.__CRCTable = __prepareCRCTable() ;
    
    MSTools.crc32 = function(self, byteAtIndexFn) {
        var crc = 0 ^ -1;
        if ($ok(self)) {
            if (typeof byteAtIndexFn !== 'function') {
                byteAtIndexFn = self.constructor.prototype.byteAtIndex ;
            }
            if (typeof byteAtIndexFn === 'function') {
                var i, length = self.length, crcTable = MSTools.__CRCTable ;
                for (i = 0; i < length; i++ ) {
                    crc = (crc >>> 8) ^ crcTable[(crc ^ byteAtIndexFn.call(self, i)) & 0xff];
                }
            }
        }
        return (crc ^ -1) >>> 0 ;
    } ;
    
    MSTools.degradedMode = (typeof Ext !== "undefined");
    
    
    
    // ================ adding members to class and objects ====================
    function _defineConstant(target, constant, visible, value, force) {
        if ($ok(target) && (force || !target.hasOwnProperty(constant))) {
            Object.defineProperty(target, constant, { enumerable:visible, configurable:false, writable:false, value:value}) ;
        }
    }
    
    MSTools.defineConstant = function(target, constant, value, force) { _defineConstant(target, constant, true, value, force) ; } ;
    MSTools.defineConstants = function(target, constants, force) { for (var key in constants) { _defineConstant(target, key, true, constants[key], force) ; }} ;
    
    MSTools.defineHiddenConstant = function(target, constant, value, force) { _defineConstant(target, constant, false, value, force) ; } ;
    MSTools.defineHiddenConstants = function(target, constants, force) { for (var key in constants) { _defineConstant(target, key, false, constants[key], force) ; }} ;
    
    MSTools.defineMethod = function(target, method, fn, force) {
        _defineConstant(target, method, false, fn, force);
    } ;
    
    MSTools.defineMethods = function(target, methods, force) { for (var key in methods) { MSTools.defineMethod(target, key, methods[key], force) ; }} ;
    MSTools.defineInstanceMethod = function(target, method, fn, force) { MSTools.defineMethod(target.prototype, method, fn, force) ; } ;
    MSTools.defineInstanceMethods = function(target, methods, force) { for (var key in methods) { MSTools.defineInstanceMethod(target, key, methods[key], force) ; }} ;
    
    // ================ subclassing ====================
    MSTools.subclass = function(theNewClass, theSuperClass, newIsa) {
        var prototypeObject ;
    
        function Surrogate() { }
        Surrogate.prototype = theSuperClass.prototype;
    
        prototypeObject = new Surrogate() ;
        prototypeObject.constructor = theNewClass;
    
        theNewClass.prototype = prototypeObject ;
    
        if ($ok(newIsa) && (typeof newIsa === 'string')) {
            MSTools.defineHiddenConstant(theNewClass.prototype, 'isa', newIsa, true) ;
        }
    } ;
    
    
    
    
    

    // ========= add things in known classes ==========
    // ================ constants ====================
    // should we define object isa ?
    
    // ================= class methods ===============
    MSTools.defineMethods(Object,{
        /* jshint proto:true */
        setPrototypeOf: function(obj, proto) { obj.__proto__ = proto ; },
        getPrototypeOf: function(obj) { return obj.__proto__ ; }
        /* jshint proto:false */
    }) ;
    
    // ================  instance methods =============
    
    if (!MSTools.degradedMode) {
        // if you want use valueForPath() on objects with Ext.js, try MStools.valueForPath() function
        MSTools.defineInstanceMethods(Object, {
            isEqualTo: function(other, options) { return this === other ? true : false ; }
        }) ;
        MSTools.defineInstanceMethods(Object, {
            valueForPath:function(path) { return MSTools.valueForPath(this, path) ; },
            toInt:function() { return this.toNumber().toInt() ; },
            toArray: function() { return [this] ; },
            toUInt:function(base) { return this.toInt().toUInt() ; }
        }, true) ;
    }
    
    // ================ constants ====================
    MSTools.defineHiddenConstant(Number.prototype, 'isa', 'Number', true) ;
    MSTools.defineHiddenConstant(Number, '__toHexaString', '0000000000000000', true) ;
    // ================= class methods ===============
    MSTools.defineMethods(Number, {
        isInteger:function(v) {
            return typeof v === "number" && isFinite(v) && v > -9007199254740992 && v < 9007199254740992 && Math.floor(v) === v;
        }
    }) ;
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(Number, {
        toHexa: function(l) {
            var s = this.toString(16) ;
            if (l > 16) { l = 16 ; }
            if (this < 0) { s = s.slice(1) ; }
            if (s.length < l) {
                s = Number.__toHexaString.slice(0, l - s.length) + s ;
            }
            return s ;
        },
        toInt:function() {
            if (isFinite(this) && !isNaN(this)) {
                if ((this >= -2147483648) && (this <= 2147483647)) { return this | 0 ; }
                else {
                    throw "integer conversion impossible (our number is not in a 32 bits range)" ;
                }
            }
            else {
                throw "integer conversion impossible (not a number or number infinite)" ;
            }
        },
        toUInt:function() {
            // console.log('toUInt('+this+')') ;
            if (isFinite(this) && !isNaN(this)) {
                if ((this >= -2147483648) && (this < 0)) { return this >>> 0 ; }
                else if ((this >= 0) && (this <= 4294967295)) { return this | 0 ; }
                else {
                    throw "unsigned integer conversion impossible (our number is not in a 32 bits range)" ;
                }
            }
            else {
                throw "unsigned integer conversion impossible (not a number or number infinite)" ;
            }
        },
        toJSON: function (key) { return this.valueOf() ; }
    }) ;
    
    MSTools.defineInstanceMethods(Number, {
        // encoding numbers with adding properties is not longer possible
        // because adding properties to numbers is forbidden on some browsers
        toMSTE: function(encoder) {
            if (isFinite(this) && !isNaN(this)) {
                encoder.pushNumber(this) ;
            }
            else {
                throw "Impossible to MSTE encode an infinite number" ;
            }
        }
    }, true) ;
    
    if (MSTools.degradedMode) {
        MSTools.defineInstanceMethods(Number, {
            isEqualTo: function(other, options) { return this === other ? true : false ; },
            toArray: function() { return [this] ; }
        }) ;
    }
    
    // ================ constants ====================
    MSTools.defineHiddenConstant(Boolean.prototype,'isa', 'Boolean', true) ;
    
    // ================= class methods ===============
    
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(Boolean, {
        toInt: function() { return this ? 1 : 0 ; },
        toUInt: function() { return this ? 1 : 0 ; },
        isEqualTo: function(other, options) {
            if (this === other) { return true ; }
            return $ok(other) && this.isa === other.isa && ((other && this) || (!(other) && !(this))) ? true : false ;
        },
        toJSON: function(key) { return this.valueOf(); }
    }) ;
    
    MSTools.defineInstanceMethods(Boolean, {
        toMSTE: function(encoder) { encoder.push(this ? 1 : 2 ) ; }
    }, true) ;
    
    if (MSTools.degradedMode) {
        MSTools.defineInstanceMethods(String, {
            toArray: function() { return [this] ; }
        }) ;
    }
    
    /* global MSDate */
    
    // ================ constants ====================
    MSTools.defineHiddenConstant(String.prototype, 'isa', 'String', true) ;
    MSTools.defineConstant(String, 'EMPTY_STRING', '') ;
    
    MSTools.defineHiddenConstants(String, {
        __parseDatePatterns:[
            {
                // dd/mm/yyyy (European style)
                regex: /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/,
                maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt(), a[3].toInt()) ; }
            },
            {
                // dd/mm/yy (short European style)
                regex: /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})$/,
                maker: function(a,cfn) { var y = a[3].toInt() + 2000 ; if (y > Date.currentYear()) { y -= 100 ; } return cfn(a[1].toInt(), a[2].toInt(), y) ; }
            },
            {
                // dd/mm (very short European style)
                regex: /^(\d{1,2})\s*\/\s*(\d{1,2})\s*(\/)?$/,
                maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt(), Date.currentYear()) ;}
            },
            {
                // yyyy/mm/dd (ISO or UK style)
                regex: /^(\d{4})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})$/,
                maker: function(a,cfn) { return cfn(a[3].toInt(), a[2].toInt(), a[1].toInt()) ; }
            },
            {
                // ddmmyyyy (Condensed European style)
                regex: /^(\d{2})(\d{2})(\d{4})$/,
                stringlen:8,
                maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt(), a[3].toInt()) ; }
            },
            {
                // ddmmyy (Very condensed European style)
                regex: /^(\d{2})(\d{2})(\d{2})$/,
                stringlen:6,
                maker: function(a,cfn) { var y = a[3].toInt() + 2000 ; if (y > Date.currentYear()) { y -= 100 ; } return cfn(a[1].toInt(), a[2].toInt(), y) ;}
            },
            {
                // ddmm (Very Very condensed European style)
                regex: /^(\d\d)(\d\d)$/,
                stringlen:4,
                maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt(), Date.currentYear()) ; }
            },
            {
                // dd (Very Very Very condensed European style)
                regex: /^(\d{1,2})\s*(\/)?$/,
                maker: function(a,cfn) { return cfn(a[1].toInt(), Date.currentMonth() + 1, Date.currentYear()) ; }
            }
        ],
        __parseTimePatterns:[
            {
                //11:22 ou 11-22 ou 11h22 ou 11H22 + m or mn after
                regex: /^(\d{1,2})\s*(?:\-|\:|h|H)\s*(\d{1,2})\s*(mn|m|MN|M)?$/,
                maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt()) ; }
            },
            {
                // [hh mm] ou [h mm] pu [hh m]
                regex: /^(\d{1,2})\s+(\d{1,2})$/,
                maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt()) ; }
            },
            {
                // [hh mm] or [hhmm] (Very Very military style)
                regex: /^(\d\d)(\d\d)$/,
                stringlen:4,
                maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt()) ; }
            },
            {
                // hh (des heures) + (h)
                regex: /^(\d{1,2})\s*(h|H)?$/,
                maker: function(a,cfn) { return cfn(a[1].toInt(), 0) ;}
            }
        ],
        __wordSeparatorRegex:/[\s!\"#%&\'()*+,-.\/:;<=>?@\[\\\]_`{|}¡¦§\u00AB\u00AD´¶·\u00BB¿×÷ʹʺʻʼʽˈˌːˑ˸;·՚՛՜՝՞՟։׀׃׆׳״\u2000-\u206F]+/
    }, true) ;
    
    // ================= class methods ===============
    MSTools.defineMethods(String, {
        // you can init a string with an ISOLatin1 data with stringWithWINLatin1Data since
        // character range 0x80 -- 0x9F is not used by ISO Latin 1 and the other characters
        // are identical
        stringWithWinLatin1Data: function(data) {
            if ($ok(data) && data.isa === 'Data') {
                var i, count = data.length, array = [], map = MSData.__winLatin1ToUnicode ;
                for (i = 0 ; i < count ; i++) { array[i] = map[data.byteAtIndex(i)] ; }
                return array.join('') ;
            }
            return null ;
        },
        stringWithUTF8Data: function(data) {
            if ($ok(data) && data.isa === 'Data') {
                var c = 0, c2 = 0, c3 = 0, i = 0, count = data.length, array = [] ;
    
                while (i < count) {
                    c = data.byteAtIndex(i++) ;
                    if (c < 128) { array.push(String.fromCharCode(c)) ; }
                    else if ((c > 191) && (c < 224)) {
                        if (i === count) { return null ; } // malformed UTF8 string
                        c2 = data.byteAtIndex(i++) ;
                        array.push(String.fromCharCode(((c & 31) << 6) | (c2 & 63))) ;
                    }
                    else {
                        if ((i + 1) >= count) { return null ; } // malformed UTF8 string
                        c2 = data.byteAtIndex(i++) ;
                        c3 = data.byteAtIndex(i++) ;
                        array.push(String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))) ;
                    }
                }
                return array.join('') ;
            }
            return null ;
        }
    }, true) ;
    // ================  instance methods =============
    /* global MSData, MSColor */
    MSTools.defineInstanceMethods(String, {
        hasSuffix: function(str) { var r = new RegExp(str+"$") ; return (this.match(r) != null) ; },
        hasPrefix: function(str) { var r = new RegExp("^"+str) ; return (this.match(r) != null) ; },
        toInt: function(base) { base = base || 10 ; var v = parseInt(this, base) ; return (isNaN(v) ? 0 : v) ;},
        toJSON: function (key) { return this.valueOf(); },
        toColor: function() { return new MSColor(this) ; },
        toData: function() { return new MSData(this) ; },
        toASCII: function(replacementChar) {
            var map = String.__toASCIIMap, c = ($ok(replacementChar) ? ''+replacementChar : '') ;
            return this.replace(/[^\u0000-\u007F]/g, function(x) { return map[x] || c ;}) ;
        },
        trim: function() { return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"); },
        wordsArray: function(regex) {
            var a = this.trim().split(regex || String.__wordSeparatorRegex), i = a.length ;
            while (i-- > 0) { if (a[i].length === 0) { a.splice(i,1) ; }}
            return a ;
        },
        contains: function(searchedString, fromIndex) { return this.indexOf(searchedString, fromIndex) === -1 ? false : true ; }
    }) ;
    
    if (MSTools.degradedMode) {
        MSTools.defineInstanceMethods(String, {
            isEqualTo: function(other, options) { return this === other ? true : false ; },
            toArray: function() { return [this] ; },
            toUInt:function(base) { return this.toInt().toUInt() ; }
        }) ;
    }
    
    MSTools.defineInstanceMethods(String, {
        parseWithPatterns: function(patterns, returnFn) {
            var i, pattern, res, aString = this.trim(), len = aString.length, count ;
    
            if (len === 0 || !patterns || (count = patterns.length) === 0) { return null ; }
            returnFn = returnFn || function() { var i, r = [] ; for (i = 1; i < arguments.length; i++) { r.push(arguments[i]) ; } return r ; } ;
    
            for (i = 0 ; i < count ; i++) {
                pattern = patterns[i] ;
                if ($ok(pattern.stringlen) && len !== pattern.stringlen) { continue ; }
                res = pattern.regex.exec(aString) ;
                if (res) {
                    //console.log("Regex["+i+"] did appy...") ;
                    return pattern.maker(res, returnFn) ;
                }
            }
            return null ;
        },
        parseDate:function(fn) {
            return this.parseWithPatterns(String.__parseDatePatterns, fn || (function(d,m,y) { return MSDate.validDate(y,m,d) ? new MSDate(y, m, d) : null ; })) ;
        },
        parseTime:function(fn) {
            return this.parseWithPatterns(String.__parseTimePatterns, fn || (function(h,m) { return m >= 0 && m < 60 && h >= 0 && (h < 24 || (h === 24 && m === 0)) ? h*100+m : null ; })) ;
        },
        // the toArray() method is inherited from Object. That means "aString" is transformed to ["aString"]. Should'nt we do something else ?
        byteAtIndex: function(i) { return this.charCodeAt(i) & 0xff; },
        toWinLatin1Data: function(replacementChar) {
            var map1 = String.__toWinLatin1Map,
                map2 = String.__toASCIIMap,
                c = ($ok(replacementChar) ? ''+replacementChar : '') ;
            var tmp =  this.replace(/[^\u0000-\u00FF]/g, function(x) { return map1[x] || map2[x] || c ;}) ;
    
            return new MSData(tmp) ;
        },
        toISOLatin1Data: function(replacementChar) {
            var map = String.__toASCIIMap, c = ($ok(replacementChar) ? ''+replacementChar : '') ;
            var tmp =  this.replace(/[^\u0000-\u00FF]/g, function(x) { return map[x] || c ;}) ;
            return new MSData(tmp) ;
        },
        toUTF8Data: function() {
            var len = this.length  ;
            if (len) {
                var i, c, array = new MSData() ;
                for (i = 0 ; i < len ; i++) {
                    c = this.charCodeAt(i) ;
                    if (c < 128) {
                        array.push(c) ;
                    }
                    else if (c < 2048) {
                        array.push((c >> 6) | 192) ;
                        array.push((c & 63) | 128) ;
                    }
                    else {
                        array.push((c >> 12) | 224) ;
                        array.push(((c >> 6) & 63) | 128) ;
                        array.push((c & 63) | 128) ;
                    }
                }
                return array ;
            }
            return MSData.EMPTY_DATA ;
        },
        // encoding numbers with adding properties is not longer possible
        // because adding properties to numbers is forbidden on some browsers
        toMSTE:function(encoder) {
            if (this.length === 0) { encoder.push(3) ; }
            else { encoder.pushString(this) ; } // only push non empty strings on encoders...
        },
        hashCode:function() { return this.split("").reduce(function(a,b) { a = ((a<<5)-a)+b.charCodeAt(0); return a&a ; }, 0); }
    }, true) ;
    
    MSTools.defineHiddenConstants(String, {
        __toASCIIMap:{
    
            // Iso Latin 1
            "\u00A0":" ",
            "\u00A1":"!",
            "\u00A2":"c",
            "\u00A3":"GBP",
            "\u00A5":"Y",
            "\u00A6":"|",
            "\u00A9":"(c)",
            "\u00AA":"a",
            "\u00AB":"\"",
            "\u00AD":"-",
            "\u00AE":"(r)",
            "\u00B2":"2",
            "\u00B3":"3",
            "\u00B4":"'",
            "\u00B7":".",
            "\u00B9":"1",
            "\u00BA":"o",
            "\u00BB":"\"",
            "\u00BC":"1/4",
            "\u00BD":"1/2",
            "\u00BE":"3/4",
            "\u00BF":"?",
            "\u00C0":"A",
            "\u00C1":"A",
            "\u00C2":"A",
            "\u00C3":"A",
            "\u00C4":"A",
            "\u00C5":"A",
            "\u00C6":"AE",
            "\u00C7":"C",
            "\u00C8":"E",
            "\u00C9":"E",
            "\u00CA":"E",
            "\u00CB":"E",
            "\u00CC":"I",
            "\u00CD":"I",
            "\u00CE":"I",
            "\u00CF":"I",
            "\u00D1":"N",
            "\u00D2":"O",
            "\u00D3":"O",
            "\u00D4":"O",
            "\u00D5":"O",
            "\u00D6":"O",
            "\u00D7":"*",
            "\u00D8":"O",
            "\u00D9":"U",
            "\u00DA":"U",
            "\u00DB":"U",
            "\u00DC":"U",
            "\u00DD":"Y",
            "\u00DF":"ss",
            "\u00E0":"a",
            "\u00E1":"a",
            "\u00E2":"a",
            "\u00E3":"a",
            "\u00E4":"a",
            "\u00E5":"a",
            "\u00E6":"ae",
            "\u00E7":"c",
            "\u00E8":"e",
            "\u00E9":"e",
            "\u00EA":"e",
            "\u00EB":"e",
            "\u00EC":"i",
            "\u00ED":"i",
            "\u00EE":"i",
            "\u00EF":"i",
            "\u00F1":"n",
            "\u00F2":"o",
            "\u00F3":"o",
            "\u00F4":"o",
            "\u00F5":"o",
            "\u00F6":"o",
            "\u00F7":"/",
            "\u00F8":"o",
            "\u00F9":"u",
            "\u00FA":"u",
            "\u00FB":"u",
            "\u00FC":"u",
            "\u00FD":"y",
            "\u00FF":"y",
    
            // Latin extended A
            "\u0100":"A",
            "\u0101":"a",
            "\u0102":"A",
            "\u0103":"a",
            "\u0104":"A",
            "\u0105":"a",
            "\u0106":"C",
            "\u0107":"c",
            "\u0108":"C",
            "\u0109":"c",
            "\u010A":"C",
            "\u010B":"c",
            "\u010C":"C",
            "\u010D":"c",
            "\u010E":"D",
            "\u010F":"d",
            "\u0110":"D",
            "\u0111":"d",
            "\u0112":"E",
            "\u0113":"e",
            "\u0114":"E",
            "\u0115":"e",
            "\u0116":"E",
            "\u0117":"e",
            "\u0118":"E",
            "\u0119":"e",
            "\u011A":"E",
            "\u011B":"e",
            "\u011C":"G",
            "\u011D":"g",
            "\u011E":"G",
            "\u011F":"g",
            "\u0120":"G",
            "\u0121":"g",
            "\u0122":"G",
            "\u0123":"g",
            "\u0124":"H",
            "\u0125":"h",
            "\u0126":"H",
            "\u0127":"h",
            "\u0128":"I",
            "\u0129":"i",
            "\u012A":"I",
            "\u012B":"i",
            "\u012C":"I",
            "\u012D":"i",
            "\u012E":"I",
            "\u012F":"i",
            "\u0130":"I",
            "\u0131":"i",
            "\u0132":"IJ",
            "\u0133":"ij",
            "\u0134":"J",
            "\u0135":"j",
            "\u0136":"K",
            "\u0137":"k",
            "\u0139":"L",
            "\u013A":"l",
            "\u013B":"L",
            "\u013C":"l",
            "\u013D":"L",
            "\u013E":"l",
            "\u013F":"L",
            "\u0140":"l",
            "\u0141":"L",
            "\u0142":"l",
            "\u0143":"N",
            "\u0144":"n",
            "\u0145":"N",
            "\u0146":"n",
            "\u0147":"N",
            "\u0148":"n",
            "\u0149":"'n",
            "\u014C":"O",
            "\u014D":"o",
            "\u014E":"O",
            "\u014F":"o",
            "\u0150":"O",
            "\u0151":"o",
            "\u0152":"OE",
            "\u0153":"oe",
            "\u0154":"R",
            "\u0155":"r",
            "\u0156":"R",
            "\u0157":"r",
            "\u0158":"R",
            "\u0159":"r",
            "\u015A":"S",
            "\u015B":"s",
            "\u015C":"S",
            "\u015D":"s",
            "\u015E":"S",
            "\u015F":"s",
            "\u0160":"S",
            "\u0161":"s",
            "\u0162":"T",
            "\u0163":"t",
            "\u0164":"T",
            "\u0165":"t",
            "\u0166":"T",
            "\u0167":"t",
            "\u0168":"U",
            "\u0169":"u",
            "\u016A":"U",
            "\u016B":"u",
            "\u016C":"U",
            "\u016D":"u",
            "\u016E":"U",
            "\u016F":"u",
            "\u0170":"U",
            "\u0171":"u",
            "\u0172":"U",
            "\u0173":"u",
            "\u0174":"W",
            "\u0175":"w",
            "\u0176":"Y",
            "\u0177":"y",
            "\u0178":"Y",
            "\u0179":"Z",
            "\u017A":"z",
            "\u017B":"Z",
            "\u017C":"z",
            "\u017D":"Z",
            "\u017E":"z",
            "\u017F":"s",
    
            // Latin extended B
            "\u0180":"b",
            "\u0181":"B",
            "\u0182":"B",
            "\u0183":"b",
            "\u0184":"B",
            "\u0185":"b",
            "\u0186":"O",
            "\u0187":"C",
            "\u0188":"c",
            "\u0189":"D",
            "\u018A":"D",
            "\u018B":"D",
            "\u018C":"d",
            "\u018E":"E",
            "\u0190":"E",
            "\u0191":"F",
            "\u0192":"f",
            "\u0193":"G",
            "\u0195":"hv",
            "\u0197":"I",
            "\u0198":"K",
            "\u0199":"k",
            "\u019A":"l",
            "\u019C":"M",
            "\u019D":"N",
            "\u019E":"n",
            "\u019F":"O",
            "\u01A0":"O",
            "\u01A1":"o",
            "\u01A2":"OI",
            "\u01A3":"oi",
            "\u01A4":"P",
            "\u01A5":"p",
            "\u01A6":"YR",
            "\u01A7":"S",
            "\u01A8":"s",
            "\u01AB":"t",
            "\u01AC":"T",
            "\u01AD":"t",
            "\u01AE":"T",
            "\u01AF":"U",
            "\u01B0":"u",
            "\u01B2":"V",
            "\u01B3":"Y",
            "\u01B4":"y",
            "\u01B5":"Z",
            "\u01B6":"z",
            "\u01BB":"2",
            "\u01BC":"5",
            "\u01BD":"5",
            "\u01C4":"DZ",
            "\u01C5":"Dz",
            "\u01C6":"dz",
            "\u01C7":"LJ",
            "\u01C8":"Lj",
            "\u01C9":"lj",
            "\u01CA":"NJ",
            "\u01CB":"Nj",
            "\u01CC":"nj",
            "\u01CD":"A",
            "\u01CE":"a",
            "\u01CF":"I",
            "\u01D0":"i",
            "\u01D1":"O",
            "\u01D2":"o",
            "\u01D3":"U",
            "\u01D4":"u",
            "\u01D5":"U",
            "\u01D6":"u",
            "\u01D7":"U",
            "\u01D8":"u",
            "\u01D9":"U",
            "\u01DA":"u",
            "\u01DB":"U",
            "\u01DC":"u",
            "\u01DD":"e",
            "\u01DE":"A",
            "\u01DF":"a",
            "\u01E0":"A",
            "\u01E1":"a",
            "\u01E2":"AE",
            "\u01E3":"ae",
            "\u01E4":"G",
            "\u01E5":"g",
            "\u01E6":"G",
            "\u01E7":"g",
            "\u01E8":"K",
            "\u01E9":"k",
            "\u01EA":"O",
            "\u01EB":"o",
            "\u01EC":"O",
            "\u01ED":"o",
            "\u01F0":"j",
            "\u01F1":"DZ",
            "\u01F2":"Dz",
            "\u01F3":"dz",
            "\u01F4":"G",
            "\u01F5":"g",
            "\u01F8":"N",
            "\u01F9":"n",
            "\u01FA":"A",
            "\u01FB":"a",
            "\u01FC":"AE",
            "\u01FD":"ae",
            "\u01FE":"O",
            "\u01FF":"o",
            "\u0200":"A",
            "\u0201":"a",
            "\u0202":"A",
            "\u0203":"a",
            "\u0204":"E",
            "\u0205":"e",
            "\u0206":"E",
            "\u0207":"e",
            "\u0208":"I",
            "\u0209":"i",
            "\u020A":"I",
            "\u020B":"i",
            "\u020C":"O",
            "\u020D":"o",
            "\u020E":"O",
            "\u020F":"o",
            "\u0210":"R",
            "\u0211":"r",
            "\u0212":"R",
            "\u0213":"r",
            "\u0214":"U",
            "\u0215":"u",
            "\u0216":"U",
            "\u0217":"u",
            "\u0218":"S",
            "\u0219":"s",
            "\u021A":"T",
            "\u021B":"t",
            "\u021E":"H",
            "\u021F":"h",
            "\u0220":"N",
            "\u0221":"d",
            "\u0222":"OU",
            "\u0223":"ou",
            "\u0224":"Z",
            "\u0225":"z",
            "\u0226":"A",
            "\u0227":"a",
            "\u0228":"E",
            "\u0229":"e",
            "\u022A":"O",
            "\u022B":"o",
            "\u022C":"O",
            "\u022D":"o",
            "\u022E":"O",
            "\u022F":"o",
            "\u0230":"O",
            "\u0231":"o",
            "\u0232":"Y",
            "\u0233":"y",
            "\u0234":"l",
            "\u0235":"n",
            "\u0236":"t",
            "\u0237":"j",
            "\u023A":"A",
            "\u023B":"C",
            "\u023C":"c",
            "\u023D":"L",
            "\u023E":"T",
            "\u023F":"s",
            "\u0240":"z",
            "\u0243":"B",
            "\u0244":"U",
            "\u0245":"V",
            "\u0246":"E",
            "\u0247":"e",
            "\u0248":"J",
            "\u0249":"j",
            "\u024A":"Q",
            "\u024B":"q",
            "\u024C":"R",
            "\u024D":"r",
            "\u024E":"Y",
            "\u024F":"y",
    
            // IPA extensions
            "\u0250":"a",
            "\u0253":"b",
            "\u0254":"o",
            "\u0255":"c",
            "\u0256":"d",
            "\u0257":"d",
            "\u0258":"e",
            "\u025B":"e",
            "\u025C":"e",
            "\u025D":"e",
            "\u025E":"e",
            "\u025F":"j",
            "\u0260":"g",
            "\u0261":"g",
            "\u0262":"G",
            "\u0265":"h",
            "\u0266":"h",
            "\u0268":"i",
            "\u026A":"I",
            "\u026B":"l",
            "\u026C":"l",
            "\u026D":"l",
            "\u026F":"m",
            "\u0270":"m",
            "\u0271":"m",
            "\u0272":"n",
            "\u0273":"n",
            "\u0274":"N",
            "\u0275":"o",
            "\u0276":"OE",
            "\u0279":"r",
            "\u027A":"r",
            "\u027B":"r",
            "\u027C":"r",
            "\u027D":"r",
            "\u027E":"r",
            "\u027F":"r",
            "\u0280":"R",
            "\u0281":"R",
            "\u0282":"s",
            "\u0284":"j",
            "\u0287":"t",
            "\u0288":"t",
            "\u0289":"u",
            "\u028B":"v",
            "\u028C":"v",
            "\u028D":"w",
            "\u028E":"y",
            "\u028F":"Y",
            "\u0290":"z",
            "\u0291":"z",
            "\u0297":"C",
            "\u0299":"B",
            "\u029A":"e",
            "\u029B":"G",
            "\u029C":"H",
            "\u029D":"j",
            "\u029E":"k",
            "\u029F":"L",
            "\u02A0":"q",
            "\u02A3":"dz",
            "\u02A4":"dz",
            "\u02A5":"dz",
            "\u02A6":"ts",
            "\u02A7":"tf",
            "\u02A8":"tc",
            "\u02AA":"ls",
            "\u02AB":"lz",
            "\u02AC":"ww",
            "\u02AE":"h",
            "\u02AF":"h",
    
            // Space modifier letters
            "\u02B0":"h",
            "\u02B1":"h",
            "\u02B2":"j",
            "\u02B3":"r",
            "\u02B4":"r",
            "\u02B5":"r",
            "\u02B6":"R",
            "\u02B7":"w",
            "\u02B8":"y",
            "\u02B9":"\'",
            "\u02BA":"\"",
            "\u02BB":"\'",
            "\u02BC":"\'",
            "\u02BD":"\'",
            "\u02CA":"\'",
            "\u02CB":"\'",
            "\u02CD":"_",
            "\u02DC":"~",
            "\u02DD":"\"",
            "\u02E1":"l",
            "\u02E2":"s",
            "\u02E3":"x",
            "\u02EE":"\"",
            "\u02F4":"\'",
            "\u02F5":"\"",
            "\u02F6":"\"",
            "\u02F7":"~",
            "\u02F8":":",
    
            // Arabic
            "\u060C":",",
            "\u060D":"/",
            "\u061B":";",
            "\u0660":"0",
            "\u0661":"1",
            "\u0662":"2",
            "\u0663":"3",
            "\u0664":"4",
            "\u0665":"5",
            "\u0666":"6",
            "\u0667":"7",
            "\u0668":"8",
            "\u0669":"9",
            "\u066A":"%",
            "\u066B":",",
            "\u066C":",",
            "\u06D4":".",
            "\u06F0":"0",
            "\u06F1":"1",
            "\u06F2":"2",
            "\u06F3":"3",
            "\u06F4":"4",
            "\u06F5":"5",
            "\u06F6":"6",
            "\u06F7":"7",
            "\u06F8":"8",
            "\u06F9":"9",
    
            // Devanagari
            "\u0966":"0",
            "\u0967":"1",
            "\u0968":"2",
            "\u0969":"3",
            "\u096A":"4",
            "\u096B":"5",
            "\u096C":"6",
            "\u096D":"7",
            "\u096E":"8",
            "\u096F":"9",
    
            // Bengali
            "\u09E6":"0",
            "\u09E7":"1",
            "\u09E8":"2",
            "\u09E9":"3",
            "\u09EA":"4",
            "\u09EB":"5",
            "\u09EC":"6",
            "\u09ED":"7",
            "\u09EE":"8",
            "\u09EF":"9",
    
            // Gurmukhi
            "\u0A66":"0",
            "\u0A67":"1",
            "\u0A68":"2",
            "\u0A69":"3",
            "\u0A6A":"4",
            "\u0A6B":"5",
            "\u0A6C":"6",
            "\u0A6D":"7",
            "\u0A6E":"8",
            "\u0A6F":"9",
    
            // Gujarato
            "\u0AE6":"0",
            "\u0AE7":"1",
            "\u0AE8":"2",
            "\u0AE9":"3",
            "\u0AEA":"4",
            "\u0AEB":"5",
            "\u0AEC":"6",
            "\u0AED":"7",
            "\u0AEE":"8",
            "\u0AEF":"9",
    
            // Oriya
            "\u0B66":"0",
            "\u0B67":"1",
            "\u0B68":"2",
            "\u0B69":"3",
            "\u0B6A":"4",
            "\u0B6B":"5",
            "\u0B6C":"6",
            "\u0B6D":"7",
            "\u0B6E":"8",
            "\u0B6F":"9",
    
            // Tamil
            "\u0BE6":"0",
            "\u0BE7":"1",
            "\u0BE8":"2",
            "\u0BE9":"3",
            "\u0BEA":"4",
            "\u0BEB":"5",
            "\u0BEC":"6",
            "\u0BED":"7",
            "\u0BEE":"8",
            "\u0BEF":"9",
            "\u0BF0":"10",
            "\u0BF1":"100",
            "\u0BF2":"1000",
    
            // Telugu
            "\u0C66":"0",
            "\u0C67":"1",
            "\u0C68":"2",
            "\u0C69":"3",
            "\u0C6A":"4",
            "\u0C6B":"5",
            "\u0C6C":"6",
            "\u0C6D":"7",
            "\u0C6E":"8",
            "\u0C6F":"9",
    
            // Kannada
            "\u0CE6":"0",
            "\u0CE7":"1",
            "\u0CE8":"2",
            "\u0CE9":"3",
            "\u0CEA":"4",
            "\u0CEB":"5",
            "\u0CEC":"6",
            "\u0CED":"7",
            "\u0CEE":"8",
            "\u0CEF":"9",
    
            // Malayalam
            "\u0D66":"0",
            "\u0D67":"1",
            "\u0D68":"2",
            "\u0D69":"3",
            "\u0D6A":"4",
            "\u0D6B":"5",
            "\u0D6C":"6",
            "\u0D6D":"7",
            "\u0D6E":"8",
            "\u0D6F":"9",
            "\u0D70":"10",
            "\u0D71":"100",
            "\u0D72":"1000",
            "\u0D73":"1/4",
            "\u0D74":"1/2",
            "\u0D75":"3/4",
    
            // Thai
            "\u0E3F":"B",
            "\u0E50":"0",
            "\u0E51":"1",
            "\u0E52":"2",
            "\u0E53":"3",
            "\u0E54":"4",
            "\u0E55":"5",
            "\u0E56":"6",
            "\u0E57":"7",
            "\u0E58":"8",
            "\u0E59":"9",
    
            // Laos
            "\u0ED0":"0",
            "\u0ED1":"1",
            "\u0ED2":"2",
            "\u0ED3":"3",
            "\u0ED4":"4",
            "\u0ED5":"5",
            "\u0ED6":"6",
            "\u0ED7":"7",
            "\u0ED8":"8",
            "\u0ED9":"9",
    
            // Tibet
            "\u0F20":"0",
            "\u0F21":"1",
            "\u0F22":"2",
            "\u0F23":"3",
            "\u0F24":"4",
            "\u0F25":"5",
            "\u0F26":"6",
            "\u0F27":"7",
            "\u0F28":"8",
            "\u0F29":"9",
            "\u0F2A":"1/2",
            "\u0F2B":"3/2",
            "\u0F2C":"5/2",
            "\u0F2D":"7/2",
            "\u0F2E":"9/2",
            "\u0F2F":"11/2",
            "\u0F30":"13/2",
            "\u0F31":"15/2",
            "\u0F32":"17/2",
            "\u0F33":"-1/2",
    
            // Myanmar
            "\u1040":"0",
            "\u1041":"1",
            "\u1042":"2",
            "\u1043":"3",
            "\u1044":"4",
            "\u1045":"5",
            "\u1046":"6",
            "\u1047":"7",
            "\u1048":"8",
            "\u1049":"9",
    
            // Ogham
            "\u1680":" ",
    
            // Khmer
            "\u17E0":"0",
            "\u17E1":"1",
            "\u17E2":"2",
            "\u17E3":"3",
            "\u17E4":"4",
            "\u17E5":"5",
            "\u17E6":"6",
            "\u17E7":"7",
            "\u17E8":"8",
            "\u17E9":"9",
    
            // Mongol
            "\u1801":"...",
            "\u180E":" ",
            "\u1810":"0",
            "\u1811":"1",
            "\u1812":"2",
            "\u1813":"3",
            "\u1814":"4",
            "\u1815":"5",
            "\u1816":"6",
            "\u1817":"7",
            "\u1818":"8",
            "\u1819":"9",
    
            // phonetic extensions
    
            "\u1D00":"A",
            "\u1D01":"AE",
            "\u1D02":"ae",
            "\u1D03":"B",
            "\u1D04":"C",
            "\u1D05":"D",
            "\u1D06":"D",
            "\u1D07":"E",
            "\u1D08":"e",
            "\u1D09":"i",
            "\u1D0A":"J",
            "\u1D0B":"K",
            "\u1D0C":"L",
            "\u1D0D":"M",
            "\u1D0E":"N",
            "\u1D0F":"O",
            "\u1D10":"O",
            "\u1D11":"o",
            "\u1D12":"o",
            "\u1D13":"o",
            "\u1D14":"oe",
            "\u1D15":"OU",
            "\u1D16":"o",
            "\u1D17":"o",
            "\u1D18":"P",
            "\u1D19":"R",
            "\u1D1A":"R",
            "\u1D1B":"T",
            "\u1D1C":"U",
            "\u1D1D":"u",
            "\u1D1E":"u",
            "\u1D1F":"m",
            "\u1D20":"V",
            "\u1D21":"W",
            "\u1D22":"Z",
            "\u1D2C":"A",
            "\u1D2D":"AE",
            "\u1D2E":"B",
            "\u1D2F":"B",
            "\u1D30":"D",
            "\u1D31":"E",
            "\u1D32":"E",
            "\u1D33":"G",
            "\u1D34":"H",
            "\u1D35":"I",
            "\u1D36":"J",
            "\u1D37":"K",
            "\u1D38":"L",
            "\u1D39":"M",
            "\u1D3A":"N",
            "\u1D3B":"N",
            "\u1D3C":"O",
            "\u1D3D":"OU",
            "\u1D3E":"P",
            "\u1D3F":"R",
            "\u1D40":"T",
            "\u1D41":"U",
            "\u1D42":"W",
            "\u1D43":"a",
            "\u1D44":"a",
            "\u1D46":"ae",
            "\u1D47":"b",
            "\u1D48":"d",
            "\u1D49":"e",
            "\u1D4B":"e",
            "\u1D4C":"e",
            "\u1D4D":"g",
            "\u1D4E":"i",
            "\u1D4F":"k",
            "\u1D50":"m",
            "\u1D51":"h",
            "\u1D52":"o",
            "\u1D53":"o",
            "\u1D54":"o",
            "\u1D55":"o",
            "\u1D56":"p",
            "\u1D57":"t",
            "\u1D58":"u",
            "\u1D59":"u",
            "\u1D5A":"m",
            "\u1D5B":"v",
            "\u1D62":"i",
            "\u1D63":"r",
            "\u1D64":"u",
            "\u1D65":"v",
            "\u1D6B":"ue",
            "\u1D6C":"b",
            "\u1D6D":"d",
            "\u1D6E":"f",
            "\u1D6F":"m",
            "\u1D70":"n",
            "\u1D71":"p",
            "\u1D72":"r",
            "\u1D73":"r",
            "\u1D74":"s",
            "\u1D75":"t",
            "\u1D76":"z",
            "\u1D77":"g",
            "\u1D79":"g",
            "\u1D7A":"th",
            "\u1D7B":"I",
            "\u1D7D":"p",
            "\u1D7E":"U",
    
            // supplements of phonetic extensions
            "\u1D80":"b",
            "\u1D81":"d",
            "\u1D82":"f",
            "\u1D83":"g",
            "\u1D84":"k",
            "\u1D85":"l",
            "\u1D86":"m",
            "\u1D87":"n",
            "\u1D88":"p",
            "\u1D89":"r",
            "\u1D8A":"s",
            "\u1D8C":"v",
            "\u1D8D":"x",
            "\u1D8E":"z",
            "\u1D8F":"a",
            "\u1D91":"d",
            "\u1D92":"e",
            "\u1D93":"e",
            "\u1D94":"e",
            "\u1D96":"i",
            "\u1D97":"o",
            "\u1D99":"u",
            "\u1D9C":"c",
            "\u1D9D":"c",
            "\u1D9F":"e",
            "\u1DA0":"f",
            "\u1DA1":"j",
            "\u1DA2":"g",
            "\u1DA3":"h",
            "\u1DA4":"i",
            "\u1DA6":"I",
            "\u1DA7":"I",
            "\u1DA8":"j",
            "\u1DA9":"l",
            "\u1DAA":"l",
            "\u1DAB":"L",
            "\u1DAC":"m",
            "\u1DAD":"m",
            "\u1DAE":"n",
            "\u1DAF":"n",
            "\u1DB0":"N",
            "\u1DB1":"o",
            "\u1DB3":"s",
            "\u1DB5":"t",
            "\u1DB6":"u",
            "\u1DB8":"U",
            "\u1DB9":"v",
            "\u1DBA":"v",
            "\u1DBB":"z",
            "\u1DBC":"z",
            "\u1DBD":"z",
    
            // Extended supplementary Latin
            "\u1E00":"A",
            "\u1E01":"a",
            "\u1E02":"B",
            "\u1E03":"b",
            "\u1E04":"B",
            "\u1E05":"b",
            "\u1E06":"B",
            "\u1E07":"b",
            "\u1E08":"C",
            "\u1E09":"c",
            "\u1E0A":"D",
            "\u1E0B":"d",
            "\u1E0C":"D",
            "\u1E0D":"d",
            "\u1E0E":"D",
            "\u1E0F":"d",
            "\u1E10":"D",
            "\u1E11":"d",
            "\u1E12":"D",
            "\u1E13":"d",
            "\u1E14":"E",
            "\u1E15":"e",
            "\u1E16":"E",
            "\u1E17":"e",
            "\u1E18":"E",
            "\u1E19":"e",
            "\u1E1A":"E",
            "\u1E1B":"e",
            "\u1E1C":"E",
            "\u1E1D":"e",
            "\u1E1E":"F",
            "\u1E1F":"f",
            "\u1E20":"G",
            "\u1E21":"g",
            "\u1E22":"H",
            "\u1E23":"h",
            "\u1E24":"H",
            "\u1E25":"h",
            "\u1E26":"H",
            "\u1E27":"h",
            "\u1E28":"H",
            "\u1E29":"h",
            "\u1E2A":"H",
            "\u1E2B":"h",
            "\u1E2C":"I",
            "\u1E2D":"i",
            "\u1E2E":"I",
            "\u1E2F":"i",
            "\u1E30":"K",
            "\u1E31":"k",
            "\u1E32":"K",
            "\u1E33":"k",
            "\u1E34":"K",
            "\u1E35":"k",
            "\u1E36":"L",
            "\u1E37":"l",
            "\u1E38":"L",
            "\u1E39":"l",
            "\u1E3A":"L",
            "\u1E3B":"l",
            "\u1E3C":"L",
            "\u1E3D":"l",
            "\u1E3E":"M",
            "\u1E3F":"m",
            "\u1E40":"M",
            "\u1E41":"m",
            "\u1E42":"M",
            "\u1E43":"m",
            "\u1E44":"N",
            "\u1E45":"n",
            "\u1E46":"N",
            "\u1E47":"n",
            "\u1E48":"N",
            "\u1E49":"n",
            "\u1E4A":"N",
            "\u1E4B":"n",
            "\u1E4C":"O",
            "\u1E4D":"o",
            "\u1E4E":"O",
            "\u1E4F":"o",
            "\u1E50":"O",
            "\u1E51":"o",
            "\u1E52":"O",
            "\u1E53":"o",
            "\u1E54":"P",
            "\u1E55":"p",
            "\u1E56":"P",
            "\u1E57":"p",
            "\u1E58":"R",
            "\u1E59":"r",
            "\u1E5A":"R",
            "\u1E5B":"r",
            "\u1E5C":"R",
            "\u1E5D":"r",
            "\u1E5E":"R",
            "\u1E5F":"r",
            "\u1E60":"S",
            "\u1E61":"s",
            "\u1E62":"S",
            "\u1E63":"s",
            "\u1E64":"S",
            "\u1E65":"s",
            "\u1E66":"S",
            "\u1E67":"s",
            "\u1E68":"S",
            "\u1E69":"s",
            "\u1E6A":"T",
            "\u1E6B":"t",
            "\u1E6C":"T",
            "\u1E6D":"t",
            "\u1E6E":"T",
            "\u1E6F":"t",
            "\u1E70":"T",
            "\u1E71":"t",
            "\u1E72":"U",
            "\u1E73":"u",
            "\u1E74":"U",
            "\u1E75":"u",
            "\u1E76":"U",
            "\u1E77":"u",
            "\u1E78":"U",
            "\u1E79":"u",
            "\u1E7A":"U",
            "\u1E7B":"u",
            "\u1E7C":"V",
            "\u1E7D":"v",
            "\u1E7E":"V",
            "\u1E7F":"v",
            "\u1E80":"W",
            "\u1E81":"w",
            "\u1E82":"W",
            "\u1E83":"w",
            "\u1E84":"W",
            "\u1E85":"w",
            "\u1E86":"W",
            "\u1E87":"w",
            "\u1E88":"W",
            "\u1E89":"w",
            "\u1E8A":"X",
            "\u1E8B":"x",
            "\u1E8C":"X",
            "\u1E8D":"x",
            "\u1E8E":"Y",
            "\u1E8F":"y",
            "\u1E90":"Z",
            "\u1E91":"z",
            "\u1E92":"Z",
            "\u1E93":"z",
            "\u1E94":"Z",
            "\u1E95":"z",
            "\u1E96":"h",
            "\u1E97":"t",
            "\u1E98":"w",
            "\u1E99":"y",
            "\u1E9A":"a",
            "\u1E9B":"s",
            "\u1E9C":"s",
            "\u1E9D":"s",
            "\u1E9E":"SS",
            "\u1EA0":"A",
            "\u1EA1":"a",
            "\u1EA2":"A",
            "\u1EA3":"a",
            "\u1EA4":"A",
            "\u1EA5":"a",
            "\u1EA6":"A",
            "\u1EA7":"a",
            "\u1EA8":"A",
            "\u1EA9":"a",
            "\u1EAA":"A",
            "\u1EAB":"a",
            "\u1EAC":"A",
            "\u1EAD":"a",
            "\u1EAE":"A",
            "\u1EAF":"a",
            "\u1EB0":"A",
            "\u1EB1":"a",
            "\u1EB2":"A",
            "\u1EB3":"a",
            "\u1EB4":"A",
            "\u1EB5":"a",
            "\u1EB6":"A",
            "\u1EB7":"a",
            "\u1EB8":"E",
            "\u1EB9":"e",
            "\u1EBA":"E",
            "\u1EBB":"e",
            "\u1EBC":"E",
            "\u1EBD":"e",
            "\u1EBE":"E",
            "\u1EBF":"e",
            "\u1EC0":"E",
            "\u1EC1":"e",
            "\u1EC2":"E",
            "\u1EC3":"e",
            "\u1EC4":"E",
            "\u1EC5":"e",
            "\u1EC6":"E",
            "\u1EC7":"e",
            "\u1EC8":"I",
            "\u1EC9":"i",
            "\u1ECA":"I",
            "\u1ECB":"i",
            "\u1ECC":"O",
            "\u1ECD":"o",
            "\u1ECE":"O",
            "\u1ECF":"o",
            "\u1ED0":"O",
            "\u1ED1":"o",
            "\u1ED2":"O",
            "\u1ED3":"o",
            "\u1ED4":"O",
            "\u1ED5":"o",
            "\u1ED6":"O",
            "\u1ED7":"o",
            "\u1ED8":"O",
            "\u1ED9":"o",
            "\u1EDA":"O",
            "\u1EDB":"o",
            "\u1EDC":"O",
            "\u1EDD":"o",
            "\u1EDE":"O",
            "\u1EDF":"o",
            "\u1EE0":"O",
            "\u1EE1":"o",
            "\u1EE2":"O",
            "\u1EE3":"o",
            "\u1EE4":"U",
            "\u1EE5":"u",
            "\u1EE6":"U",
            "\u1EE7":"u",
            "\u1EE8":"U",
            "\u1EE9":"u",
            "\u1EEA":"U",
            "\u1EEB":"u",
            "\u1EEC":"U",
            "\u1EED":"u",
            "\u1EEE":"U",
            "\u1EEF":"u",
            "\u1EF0":"U",
            "\u1EF1":"u",
            "\u1EF2":"Y",
            "\u1EF3":"y",
            "\u1EF4":"Y",
            "\u1EF5":"y",
            "\u1EF6":"Y",
            "\u1EF7":"y",
            "\u1EF8":"Y",
            "\u1EF9":"y",
            "\u1EFA":"LL",
            "\u1EFB":"ll",
            "\u1EFE":"Y",
            "\u1EFF":"y",
    
            // ponctuations
            "\u2000":" ",
            "\u2001":" ",
            "\u2002":" ",
            "\u2003":" ",
            "\u2004":" ",
            "\u2005":" ",
            "\u2006":" ",
            "\u2007":" ",
            "\u2008":" ",
            "\u2009":" ",
            "\u200A":" ",
            // not marked as space in unicode "\u200B":" ",
            "\u2010":"-",
            "\u2011":"-",
            "\u2012":"-",
            "\u2013":"-",
            "\u2014":"-",
            "\u2015":"-",
            "\u2016":"||",
            "\u2018":"\'",
            "\u2019":"\'",
            "\u201A":"\'",
            "\u201B":"\'",
            "\u201C":"\"",
            "\u201D":"\"",
            "\u201E":"\"",
            "\u201F":"\"",
            "\u2022":".",
            "\u2024":".",
            "\u2025":"..",
            "\u2026":"...",
            "\u2027":".",
            "\u2029":" ",
            "\u202F":" ",
            "\u2032":"\'",
            "\u2033":"\"",
            "\u2034":"\'\'\'",
            "\u2035":"\'",
            "\u2036":"\"",
            "\u2037":"\'\'\'",
            "\u2038":"^",
            "\u2039":"\'",
            "\u203A":"\'",
            "\u203C":"!!",
            "\u203D":"?!",
            "\u2042":"***",
            "\u2043":"-",
            "\u2044":"/",
            "\u2045":"[",
            "\u2046":"]",
            "\u2047":"??",
            "\u2048":"?!",
            "\u2049":"!?",
            "\u204D":"*",
            "\u204F":";",
            "\u2051":"**",
            "\u2053":"~",
            "\u2057":"\'\'\'\'",
            "\u205A":":",
            "\u205F":" ",
    
            // exponents and indices
            "\u2070":"0",
            "\u2071":"i",
            "\u2074":"4",
            "\u2075":"5",
            "\u2076":"6",
            "\u2077":"7",
            "\u2078":"8",
            "\u2079":"9",
            "\u207A":"+",
            "\u207B":"-",
            "\u207C":"=",
            "\u207D":"(",
            "\u207E":")",
            "\u207F":"n",
            "\u2080":"0",
            "\u2081":"1",
            "\u2082":"2",
            "\u2083":"3",
            "\u2084":"4",
            "\u2085":"5",
            "\u2086":"6",
            "\u2087":"7",
            "\u2088":"8",
            "\u2089":"9",
            "\u208A":"+",
            "\u208B":"-",
            "\u208C":"=",
            "\u208D":"(",
            "\u208E":")",
            "\u2090":"a",
            "\u2091":"e",
            "\u2092":"o",
            "\u2093":"x",
    
            // Currency symbols
            "\u20A0":"CE",
            "\u20A1":"C",
            "\u20A2":"Cr",
            "\u20A3":"Fr",
            "\u20A4":"GBP",
            "\u20A5":"m",
            "\u20A6":"N",
            "\u20A7":"Pts",
            "\u20A8":"Rs",
            "\u20A9":"W",
            "\u20AB":"d",
            "\u20AC":"EUR",
            "\u20AD":"K",
            "\u20AE":"T",
            "\u20AF":"Dr",
            "\u20B0":"Pf",
            "\u20B1":"P",
            "\u20B2":"G",
            "\u20B3":"A",
            "\u20B4":"S",
            "\u20B5":"C",
    
            // symbols with letters
            "\u2100":"a/c",
            "\u2101":"a/s",
            "\u2102":"C",
            "\u2104":"CL",
            "\u2105":"c/o",
            "\u2106":"c/u",
            "\u210A":"g",
            "\u210B":"H",
            "\u210C":"H",
            "\u210D":"H",
            "\u210E":"h",
            "\u210F":"h",
            "\u2110":"I",
            "\u2111":"I",
            "\u2112":"L",
            "\u2113":"l",
            "\u2114":"lb",
            "\u2115":"N",
            "\u2116":"No",
            "\u2117":"P",
            "\u2118":"P",
            "\u2119":"P",
            "\u211A":"Q",
            "\u211B":"R",
            "\u211C":"R",
            "\u211D":"R",
            "\u211E":"R",
            "\u211F":"R",
            "\u2120":"SM",
            "\u2121":"TEL",
            "\u2122":"TM",
            "\u2123":"V",
            "\u2124":"Z",
            "\u2128":"Z",
            "\u212A":"K",
            "\u212B":"A",
            "\u212C":"B",
            "\u212D":"C",
            "\u212E":"e",
            "\u212F":"e",
            "\u2130":"E",
            "\u2131":"F",
            "\u2132":"F",
            "\u2133":"M",
            "\u2134":"o",
            "\u2139":"i",
            "\u213A":"Q",
            "\u213B":"FAX",
            "\u2141":"G",
            "\u2142":"L",
            "\u2143":"L",
            "\u2144":"Y",
            "\u2145":"D",
            "\u2146":"d",
            "\u2147":"e",
            "\u2148":"i",
            "\u2149":"j",
            "\u214B":"&",
            "\u214D":"A/S",
            "\u214E":"F",
    
            // numeric forms
            "\u2150":"1/7",
            "\u2151":"1/9",
            "\u2152":"1/10",
            "\u2153":"1/3",
            "\u2154":"2/3",
            "\u2155":"1/5",
            "\u2156":"2/5",
            "\u2157":"3/5",
            "\u2158":"4/5",
            "\u2159":"1/6",
            "\u215A":"5/6",
            "\u215B":"1/8",
            "\u215C":"3/8",
            "\u215D":"5/8",
            "\u215E":"7/8",
            "\u215F":"1/",
            "\u2160":"I",
            "\u2161":"II",
            "\u2162":"III",
            "\u2163":"IV",
            "\u2164":"V",
            "\u2165":"VI",
            "\u2166":"VII",
            "\u2167":"VIII",
            "\u2168":"IX",
            "\u2169":"X",
            "\u216A":"XI",
            "\u216B":"XII",
            "\u216C":"L",
            "\u216D":"C",
            "\u216E":"D",
            "\u216F":"M",
            "\u2170":"i",
            "\u2171":"ii",
            "\u2172":"iii",
            "\u2173":"iv",
            "\u2174":"v",
            "\u2175":"vi",
            "\u2176":"vii",
            "\u2177":"viii",
            "\u2178":"ix",
            "\u2179":"x",
            "\u217A":"xi",
            "\u217B":"xii",
            "\u217C":"l",
            "\u217D":"c",
            "\u217E":"d",
            "\u217F":"m",
            "\u2180":"CD",
            "\u2183":"C",
            "\u2184":"c",
            "\u2189":"0/3",
    
    
            // maths operators
            "\u2212":"-",
            "\u2214":"+",
            "\u2215":"/",
            "\u2216":"\\",
            "\u2217":"*",
            "\u2219":".",
            "\u223C":"~",
            "\u223F":"~",
            "\u2254":":=",
            "\u2255":"=:",
            "\u2264":"<=",
            "\u2265":">=",
            "\u2266":"<=",
            "\u2267":">=",
            "\u226A":"<<",
            "\u226B":">>",
            "\u2268":"<",
            "\u2269":">",
            "\u227A":"<",
            "\u227B":">",
            "\u2295":"+",
            "\u2296":"-",
            "\u2298":"/",
            "\u2299":".",
            "\u229B":"*",
            "\u229C":"=",
            "\u229D":"-",
            "\u229E":"+",
            "\u229F":"-",
    
    
            // technical signs
            "\u2338":"=",
            "\u2339":"/",
            "\u2343":"<",
            "\u2344":">",
            "\u2360":":",
            "\u2370":"?",
            "\u239B":"(",
            "\u239C":"(",
            "\u239D":"(",
            "\u239E":")",
            "\u239F":")",
            "\u23A0":")",
            "\u23A1":"[",
            "\u23A2":"[",
            "\u23A3":"[",
            "\u23A4":"]",
            "\u23A5":"]",
            "\u23A6":"]",
            "\u23A7":"{",
            "\u23A8":"{",
            "\u23A9":"{",
            "\u23AB":"}",
            "\u23AC":"}",
            "\u23AD":"}",
            "\u23B0":"{",
            "\u23B1":"{",
    
            // controls characters representations
            "\u2400":"NUL",
            "\u2401":"SOH",
            "\u2402":"STX",
            "\u2403":"ETX",
            "\u2404":"EOT",
            "\u2405":"ENQ",
            "\u2406":"ACK",
            "\u2407":"BEL",
            "\u2408":"BS",
            "\u2409":"HT",
            "\u240A":"LF",
            "\u240B":"VT",
            "\u240C":"FF",
            "\u240D":"CR",
            "\u240E":"SO",
            "\u240F":"SI",
            "\u2410":"DLE",
            "\u2411":"DC1",
            "\u2412":"DC2",
            "\u2413":"DC3",
            "\u2414":"DC4",
            "\u2415":"HAK",
            "\u2416":"SYN",
            "\u2417":"ETB",
            "\u2418":"CAN",
            "\u2419":"EM",
            "\u241A":"SUB",
            "\u241B":"ESC",
            "\u241C":"FS",
            "\u241D":"GS",
            "\u241E":"RS",
            "\u241F":"US",
            "\u2420":"SP",
            "\u2421":"DEL",
            "\u2424":"NL",
    
            // circled alphanumerics
            "\u2460":"1",
            "\u2461":"2",
            "\u2462":"3",
            "\u2463":"4",
            "\u2464":"5",
            "\u2465":"6",
            "\u2466":"7",
            "\u2467":"8",
            "\u2468":"9",
            "\u2469":"10",
            "\u246A":"11",
            "\u246B":"12",
            "\u246C":"13",
            "\u246D":"14",
            "\u246E":"15",
            "\u246F":"16",
            "\u2470":"17",
            "\u2471":"18",
            "\u2472":"19",
            "\u2473":"20",
            "\u2474":"1",
            "\u2475":"2",
            "\u2476":"3",
            "\u2477":"4",
            "\u2478":"5",
            "\u2479":"6",
            "\u247A":"7",
            "\u247B":"8",
            "\u247C":"9",
            "\u247D":"10",
            "\u247E":"11",
            "\u247F":"12",
            "\u2480":"13",
            "\u2481":"14",
            "\u2482":"15",
            "\u2483":"16",
            "\u2484":"17",
            "\u2485":"18",
            "\u2486":"19",
            "\u2487":"20",
            "\u2488":"1",
            "\u2489":"2",
            "\u248A":"3",
            "\u248B":"4",
            "\u248C":"5",
            "\u248D":"6",
            "\u248E":"7",
            "\u248F":"8",
            "\u2490":"9",
            "\u2491":"10",
            "\u2492":"11",
            "\u2493":"12",
            "\u2494":"13",
            "\u2495":"14",
            "\u2496":"15",
            "\u2497":"16",
            "\u2498":"17",
            "\u2499":"18",
            "\u249A":"19",
            "\u249B":"20",
            "\u249C":"a",
            "\u249D":"b",
            "\u249E":"c",
            "\u249F":"d",
            "\u24A0":"e",
            "\u24A1":"f",
            "\u24A2":"g",
            "\u24A3":"h",
            "\u24A4":"i",
            "\u24A5":"j",
            "\u24A6":"k",
            "\u24A7":"l",
            "\u24A8":"m",
            "\u24A9":"n",
            "\u24AA":"o",
            "\u24AB":"p",
            "\u24AC":"q",
            "\u24AD":"r",
            "\u24AE":"s",
            "\u24AF":"t",
            "\u24B0":"u",
            "\u24B1":"v",
            "\u24B2":"w",
            "\u24B3":"x",
            "\u24B4":"y",
            "\u24B5":"z",
            "\u24B6":"A",
            "\u24B7":"B",
            "\u24B8":"C",
            "\u24B9":"D",
            "\u24BA":"E",
            "\u24BB":"F",
            "\u24BC":"G",
            "\u24BD":"H",
            "\u24BE":"I",
            "\u24BF":"J",
            "\u24C0":"K",
            "\u24C1":"L",
            "\u24C2":"M",
            "\u24C3":"N",
            "\u24C4":"O",
            "\u24C5":"P",
            "\u24C6":"Q",
            "\u24C7":"R",
            "\u24C8":"S",
            "\u24C9":"T",
            "\u24CA":"U",
            "\u24CB":"V",
            "\u24CC":"W",
            "\u24CD":"X",
            "\u24CE":"Y",
            "\u24CF":"Z",
            "\u24D0":"a",
            "\u24D1":"b",
            "\u24D2":"c",
            "\u24D3":"d",
            "\u24D4":"e",
            "\u24D5":"f",
            "\u24D6":"g",
            "\u24D7":"h",
            "\u24D8":"i",
            "\u24D9":"j",
            "\u24DA":"k",
            "\u24DB":"l",
            "\u24DC":"m",
            "\u24DD":"n",
            "\u24DE":"o",
            "\u24DF":"p",
            "\u24E0":"q",
            "\u24E1":"r",
            "\u24E2":"s",
            "\u24E3":"t",
            "\u24E4":"u",
            "\u24E5":"v",
            "\u24E6":"w",
            "\u24E7":"x",
            "\u24E8":"y",
            "\u24E9":"z",
            "\u24EA":"0",
            "\u24EB":"11",
            "\u24EC":"12",
            "\u24ED":"13",
            "\u24EE":"14",
            "\u24EF":"15",
            "\u24F0":"16",
            "\u24F1":"17",
            "\u24F2":"18",
            "\u24F3":"19",
            "\u24F4":"20",
            "\u24F5":"1",
            "\u24F6":"2",
            "\u24F7":"3",
            "\u24F8":"4",
            "\u24F9":"5",
            "\u24FA":"6",
            "\u24FB":"7",
            "\u24FC":"8",
            "\u24FD":"9",
            "\u24FE":"10",
            "\u24FF":"0",
    
            // lines drawing
    
            "\u2502":"|",
            "\u2503":"|",
            "\u2506":"|",
            "\u2507":"|",
            "\u250A":"|",
            "\u250B":"|",
            "\u254E":"|",
            "\u254F":"|",
            "\u2571":"/",
            "\u2572":"\\",
            "\u257D":"|",
            "\u257F":"|",
    
    
            // Dingbats
    
            "\u271A":"+",
            "\u2753":"?",
            "\u2754":"?",
            "\u2755":"!",
            "\u2757":"!",
            "\u2758":"|",
            "\u2759":"|",
            "\u275A":"|",
            "\u275B":"\'",
            "\u275C":"\'",
            "\u275D":"\"",
            "\u275E":"\"",
            "\u275F":"\'",
            "\u2760":"\"",
            "\u2968":"(",
            "\u2969":")",
            "\u296A":"(",
            "\u296B":")",
            "\u2972":"[",
            "\u2973":"]",
            "\u2974":"{",
            "\u2975":"}",
            "\u2776":"1",
            "\u2777":"2",
            "\u2778":"3",
            "\u2779":"4",
            "\u277A":"5",
            "\u277B":"6",
            "\u277C":"7",
            "\u277D":"8",
            "\u277E":"9",
            "\u277F":"10",
            "\u2780":"1",
            "\u2781":"2",
            "\u2782":"3",
            "\u2783":"4",
            "\u2784":"5",
            "\u2785":"6",
            "\u2786":"7",
            "\u2787":"8",
            "\u2788":"9",
            "\u2789":"10",
            "\u278A":"1",
            "\u278B":"2",
            "\u278C":"3",
            "\u278D":"4",
            "\u278E":"5",
            "\u278F":"6",
            "\u2790":"7",
            "\u2791":"8",
            "\u2792":"9",
            "\u2793":"10",
            "\u2795":"+",
            "\u2796":"-",
            "\u2797":"/",
    
    
            // Maths symbols Misc B
    
            "\u2980":"|||",
            "\u2983":"{",
            "\u2984":"}",
            "\u2985":"(",
            "\u2986":")",
            "\u298B":"[",
            "\u298C":"]",
            "\u298D":"[",
            "\u298E":"]",
            "\u298F":"[",
            "\u2990":"]",
            "\u2997":"[",
            "\u2998":"]",
            "\u29F8":"/",
            "\u29F9":"\\",
            "\u29FA":"++",
            "\u29FB":"+++",
    
            // Extended-Maths operators
            "\u2A01":"+",
            "\u2A2D":"+",
            "\u2A2E":"+",
            "\u2A74":"::=",
            "\u2A75":"==",
            "\u2A76":"===",
            "\u2A79":"<",
            "\u2A7A":">",
            "\u2A7D":"<=",
            "\u2A7E":">=",
            "\u2A81":"<=",
            "\u2A82":">=",
            "\u2A83":"<=",
            "\u2A84":">=",
            "\u2A95":"=<",
            "\u2A96":"=>",
            "\u2A99":"=<",
            "\u2A9A":"=>",
            "\u2A9B":"=<",
            "\u2A9C":"=>",
            "\u2AAF":"<=",
            "\u2AB0":">=",
            "\u2ABB":"<<",
            "\u2ABC":">>",
    
            // Extended-Latin C
    
            "\u2C60":"L",
            "\u2C61":"l",
            "\u2C62":"L",
            "\u2C63":"P",
            "\u2C64":"R",
            "\u2C65":"a",
            "\u2C66":"t",
            "\u2C67":"H",
            "\u2C68":"h",
            "\u2C69":"K",
            "\u2C6A":"k",
            "\u2C6B":"Z",
            "\u2C6C":"z",
            "\u2C6E":"M",
            "\u2C6F":"A",
            "\u2C71":"v",
            "\u2C72":"W",
            "\u2C73":"w",
            "\u2C74":"v",
            "\u2C75":"H",
            "\u2C76":"h",
            "\u2C78":"e",
            "\u2C79":"r",
            "\u2C7A":"o",
            "\u2C7B":"E",
            "\u2C7C":"j",
            "\u2C7D":"V",
            "\u2C7E":"S",
            "\u2C7F":"s",
    
            // Supplement of punctuation
            "\u2E17":"=",
            "\u2E18":"?!",
            "\u2E1B":"~",
            "\u2E1E":"~",
            "\u2E1F":"~",
            "\u2E22":"[",
            "\u2E23":"]",
            "\u2E24":"[",
            "\u2E25":"]",
            "\u2E28":"((",
            "\u2E29":"))",
            "\u2E2E":"?",
            "\u2E2F":"~",
    
            // Kangxi
            "\u2F00":"1",
            "\u2F06":"2",
            "\u2F0B":"8",
            "\u2F17":"10",
    
            // CJK punctuations & symbols
            "\u3000":" ",
            "\u3001":",",
            "\u3002":".",
            "\u3007":"0",
            "\u3008":"\'",
            "\u3009":"\'",
            "\u300A":"\"",
            "\u300B":"\"",
            "\u300C":"[",
            "\u300D":"]",
            "\u300E":"[",
            "\u300F":"]",
            "\u3010":"[",
            "\u3011":"]",
            "\u3014":"[",
            "\u3015":"]",
            "\u3016":"[",
            "\u3017":"]",
            "\u3018":"[",
            "\u3019":"]",
            "\u301A":"[",
            "\u301B":"]",
            "\u301C":"~",
            "\u301D":"\"",
            "\u301E":"\"",
            "\u301F":"\"",
            "\u3021":"1",
            "\u3022":"2",
            "\u3023":"3",
            "\u3024":"4",
            "\u3025":"5",
            "\u3026":"6",
            "\u3027":"7",
            "\u3028":"8",
            "\u3029":"9",
            "\u3038":"10",
            "\u3039":"20",
            "\u303A":"30",
    
            // Katakana
            "\u30FB":".",
    
            // Kanbun
            "\u3192":"1",
            "\u3193":"2",
            "\u3194":"3",
            "\u3195":"4",
    
            // circled CJK
            "\u3220":"1",
            "\u3221":"2",
            "\u3222":"3",
            "\u3223":"4",
            "\u3224":"5",
            "\u3225":"6",
            "\u3226":"7",
            "\u3227":"8",
            "\u3228":"9",
            "\u3229":"10",
            "\u3251":"21",
            "\u3252":"22",
            "\u3253":"23",
            "\u3254":"24",
            "\u3255":"25",
            "\u3256":"26",
            "\u3257":"27",
            "\u3258":"28",
            "\u3259":"29",
            "\u325A":"30",
            "\u325B":"31",
            "\u325C":"32",
            "\u325D":"33",
            "\u325E":"34",
            "\u325F":"35",
            "\u3280":"1",
            "\u3281":"2",
            "\u3282":"3",
            "\u3283":"4",
            "\u3284":"5",
            "\u3285":"6",
            "\u3286":"7",
            "\u3287":"8",
            "\u3288":"9",
            "\u3289":"10",
            "\u32B1":"36",
            "\u32B2":"37",
            "\u32B3":"38",
            "\u32B4":"39",
            "\u32B5":"40",
            "\u32B6":"41",
            "\u32B7":"42",
            "\u32B8":"43",
            "\u32B9":"44",
            "\u32BA":"45",
            "\u32BB":"46",
            "\u32BC":"47",
            "\u32BD":"48",
            "\u32BE":"49",
            "\u32BF":"50",
    
            // CJK compatibility
            "\u3372":"da",
            "\u3374":"bar",
            "\u3375":"oV",
            "\u3376":"pc",
            "\u3380":"pA",
            "\u3381":"nA",
            "\u3383":"mA",
            "\u3384":"kA",
            "\u3385":"KB",
            "\u3386":"MB",
            "\u3387":"GB",
            "\u3388":"cal",
            "\u3389":"kcal",
            "\u338A":"pF",
            "\u338B":"nF",
            "\u338E":"mg",
            "\u338F":"kg",
            "\u3390":"Hz",
            "\u3391":"kHz",
            "\u3392":"MHz",
            "\u3393":"GHz",
            "\u3394":"THz",
            "\u3396":"ml",
            "\u3397":"dl",
            "\u3398":"kl",
            "\u3399":"fm",
            "\u339A":"nm",
            "\u339C":"mm",
            "\u339D":"cm",
            "\u339E":"km",
            "\u339F":"mm2",
            "\u33A0":"cm2",
            "\u33A1":"m2",
            "\u33A2":"km2",
            "\u33A3":"mm3",
            "\u33A4":"cm3",
            "\u33A5":"m3",
            "\u33A6":"km3",
            "\u33A7":"m/s",
            "\u33A9":"Pa",
            "\u33AA":"kPa",
            "\u33AB":"MPa",
            "\u33AC":"GPa",
            "\u33AD":"rad",
            "\u33AE":"rad/s",
            "\u33B0":"ps",
            "\u33B1":"ns",
            "\u33B3":"ms",
            "\u33B4":"pV",
            "\u33B5":"nV",
            "\u33B7":"mV",
            "\u33B8":"kV",
            "\u33B9":"MV",
            "\u33BA":"pW",
            "\u33BB":"nW",
            "\u33BD":"mW",
            "\u33BE":"kW",
            "\u33BF":"MW",
            "\u33C2":"a.m.",
            "\u33C3":"Bq",
            "\u33C4":"CC",
            "\u33C5":"cd",
            "\u33C6":"C/kg",
            "\u33C7":"Co.",
            "\u33C8":"dB",
            "\u33C9":"Gy",
            "\u33CA":"ha",
            "\u33CB":"HP",
            "\u33CC":"in",
            "\u33CD":"K.K.",
            "\u33CE":"KM",
            "\u33CF":"kt",
            "\u33D0":"lm",
            "\u33D1":"ln",
            "\u33D2":"log",
            "\u33D3":"lx",
            "\u33D4":"mb",
            "\u33D5":"mil",
            "\u33D6":"mol",
            "\u33D7":"pH",
            "\u33D8":"p.m.",
            "\u33D9":"PPM",
            "\u33DA":"PR",
            "\u33DB":"sr",
            "\u33DC":"Sv",
            "\u33DD":"Wb",
    
            // CJK ideograms
            "\u3405":"5",
            "\u4E00":"1",
            "\u4E03":"7",
            "\u4E09":"3",
            "\u4E37":"8",
            "\u4E5D":"9",
            "\u4E8C":"2",
            "\u4E94":"5",
            "\u4E96":"4",
            "\u4F0D":"5",
            "\u516B":"8",
            "\u516D":"6",
            "\u5341":"10",
            "\u5344":"20",
            "\u534A":"1/2",
            "\u53C1":"3",
            "\u53C2":"3",
            "\u53C3":"3",
            "\u53C4":"3",
            "\u53C5":"3",
            "\u56DB":"4",
            "\u58F1":"1",
            "\u58F9":"1",
            "\u5DEE":"-",
            "\u5EFE":"20",
            "\u5EFF":"20",
            "\u5F0C":"1",
            "\u5F0D":"2",
            "\u5F0E":"3",
            "\u5F10":"2",
            "\u5F15":"-",
            "\u5F17":"$",
            "\u6260":"1",
            "\u62FE":"10",
            "\u634C":"8",
            "\u640B":"1",
            "\u7396":"9",
            "\u78C5":"GBP",
            "\u8086":"4",
            "\u84E1":"3",
            "\u8CAE":"2",
            "\u8CB3":"2",
            "\u8D30":"2",
            "\u96F6":"0",
    
            // Extended-Latin D
            "\uA728":"TZ",
            "\uA729":"tz",
            "\uA730":"F",
            "\uA731":"S",
            "\uA732":"AA",
            "\uA733":"aa",
            "\uA734":"AO",
            "\uA735":"ao",
            "\uA736":"AU",
            "\uA737":"au",
            "\uA738":"AV",
            "\uA739":"av",
            "\uA73A":"AV",
            "\uA73B":"av",
            "\uA73C":"AY",
            "\uA73D":"ay",
            "\uA73E":"C",
            "\uA73F":"c",
            "\uA740":"K",
            "\uA741":"k",
            "\uA742":"K",
            "\uA743":"k",
            "\uA744":"K",
            "\uA745":"k",
            "\uA746":"L",
            "\uA747":"l",
            "\uA748":"L",
            "\uA749":"l",
            "\uA74A":"O",
            "\uA74B":"o",
            "\uA74C":"O",
            "\uA74D":"o",
            "\uA74E":"OO",
            "\uA74F":"oo",
            "\uA750":"P",
            "\uA751":"p",
            "\uA752":"P",
            "\uA753":"p",
            "\uA754":"P",
            "\uA755":"p",
            "\uA756":"Q",
            "\uA757":"q",
            "\uA758":"Q",
            "\uA759":"q",
            "\uA75A":"R",
            "\uA75B":"r",
            "\uA75E":"V",
            "\uA75F":"v",
            "\uA760":"VY",
            "\uA761":"vy",
            "\uA762":"Z",
            "\uA763":"z",
            "\uA76A":"ET",
            "\uA76B":"et",
            "\uA76C":"IS",
            "\uA76D":"is",
            "\uA771":"d",
            "\uA772":"l",
            "\uA773":"m",
            "\uA774":"n",
            "\uA775":"r",
            "\uA776":"R",
            "\uA777":"t",
            "\uA778":"um",
            "\uA779":"D",
            "\uA77A":"d",
            "\uA77B":"F",
            "\uA77C":"f",
            "\uA77D":"G",
            "\uA77E":"G",
            "\uA77F":"g",
            "\uA780":"L",
            "\uA781":"l",
            "\uA782":"R",
            "\uA783":"r",
            "\uA784":"S",
            "\uA785":"s",
            "\uA786":"T",
            "\uA787":"t",
            "\uA788":"^",
            "\uA789":":",
            "\uA78A":"=",
            "\uA78D":"H",
            "\uA78E":"l",
            "\uA790":"N",
            "\uA791":"n",
            "\uA792":"C",
            "\uA793":"c",
            "\uA7A0":"G",
            "\uA7A1":"g",
            "\uA7A2":"K",
            "\uA7A3":"k",
            "\uA7A4":"N",
            "\uA7A5":"n",
            "\uA7A6":"R",
            "\uA7A7":"r",
            "\uA7A8":"S",
            "\uA7A9":"s",
            "\uA7AA":"H",
            "\uA7F8":"H",
            "\uA7F9":"oe",
            "\uA7FA":"M",
            "\uA7FB":"F",
            "\uA7FC":"P",
            "\uA7FD":"M",
            "\uA7FE":"l",
            "\uA7FF":"M",
    
            // ligatures
            "\uFB00":"ff",
            "\uFB01":"fi",
            "\uFB02":"fl",
            "\uFB03":"ffi",
            "\uFB04":"ffl",
            "\uFB05":"st",
            "\uFB06":"st",
            "\uFB29":"+",
    
            // Vertical forms
            "\uFE10":",",
            "\uFE11":",",
            "\uFE12":".",
            "\uFE13":":",
            "\uFE14":";",
            "\uFE15":"!",
            "\uFE16":"?",
            "\uFE19":"...",
    
            // Compatibility CJK forms
            "\uFE30":"..",
            "\uFE31":"|",
            "\uFE32":"|",
            "\uFE33":"|",
            "\uFE35":"(",
            "\uFE36":")",
            "\uFE37":"{",
            "\uFE38":"}",
            "\uFE39":"[",
            "\uFE3A":"]",
            "\uFE3D":"\"",
            "\uFE3E":"\"",
            "\uFE3F":"\'",
            "\uFE40":"\'",
            "\uFE47":"[",
            "\uFE48":"]",
    
            // Small forms (variants)
            "\uFE50":",",
            "\uFE51":",",
            "\uFE52":".",
            "\uFE54":";",
            "\uFE55":":",
            "\uFE56":"?",
            "\uFE57":"!",
            "\uFE58":"-",
            "\uFE59":"(",
            "\uFE5A":")",
            "\uFE5B":"{",
            "\uFE5C":"}",
            "\uFE5D":"[",
            "\uFE5E":"]",
            "\uFE5F":"#",
            "\uFE60":"&",
            "\uFE61":"*",
            "\uFE62":"+",
            "\uFE63":"-",
            "\uFE64":"<",
            "\uFE65":">",
            "\uFE66":"=",
            "\uFE68":"\\",
            "\uFE69":"$",
            "\uFE6A":"%",
            "\uFE6B":"@",
    
            // Half-large and Large forms
            "\uFF01":"!",
            "\uFF02":"\"",
            "\uFF03":"#",
            "\uFF04":"$",
            "\uFF05":"%",
            "\uFF06":"&",
            "\uFF08":"(",
            "\uFF09":")",
            "\uFF0A":"*",
            "\uFF0B":"+",
            "\uFF0C":",",
            "\uFF0D":"-",
            "\uFF0E":".",
            "\uFF0F":"/",
            "\uFF10":"0",
            "\uFF11":"1",
            "\uFF12":"2",
            "\uFF13":"3",
            "\uFF14":"4",
            "\uFF15":"5",
            "\uFF16":"6",
            "\uFF17":"7",
            "\uFF18":"8",
            "\uFF19":"9",
            "\uFF1A":":",
            "\uFF1B":";",
            "\uFF1C":"<",
            "\uFF1D":"=",
            "\uFF1E":">",
            "\uFF1F":"?",
            "\uFF20":"@",
            "\uFF21":"A",
            "\uFF22":"B",
            "\uFF23":"C",
            "\uFF24":"D",
            "\uFF25":"E",
            "\uFF26":"F",
            "\uFF27":"G",
            "\uFF28":"H",
            "\uFF29":"I",
            "\uFF2A":"J",
            "\uFF2B":"K",
            "\uFF2C":"L",
            "\uFF2D":"M",
            "\uFF2E":"N",
            "\uFF2F":"O",
            "\uFF30":"P",
            "\uFF31":"Q",
            "\uFF32":"R",
            "\uFF33":"S",
            "\uFF34":"T",
            "\uFF35":"U",
            "\uFF36":"V",
            "\uFF37":"W",
            "\uFF38":"X",
            "\uFF39":"Y",
            "\uFF3A":"Z",
            "\uFF3B":"[",
            "\uFF3C":"\"",
            "\uFF3D":"]",
            "\uFF3E":"^",
            "\uFF3F":"_",
            "\uFF40":"\'",
            "\uFF41":"a",
            "\uFF42":"b",
            "\uFF43":"c",
            "\uFF44":"d",
            "\uFF45":"e",
            "\uFF46":"f",
            "\uFF47":"g",
            "\uFF48":"h",
            "\uFF49":"i",
            "\uFF4A":"j",
            "\uFF4B":"k",
            "\uFF4C":"l",
            "\uFF4D":"m",
            "\uFF4E":"n",
            "\uFF4F":"o",
            "\uFF50":"p",
            "\uFF51":"q",
            "\uFF52":"r",
            "\uFF53":"s",
            "\uFF54":"t",
            "\uFF55":"u",
            "\uFF56":"v",
            "\uFF57":"w",
            "\uFF58":"x",
            "\uFF59":"y",
            "\uFF5A":"z",
            "\uFF5B":"{",
            "\uFF5C":"|",
            "\uFF5D":"}",
            "\uFF5E":"~",
            "\uFF5F":"(",
            "\uFF60":")",
            "\uFF61":".",
            "\uFF62":"[",
            "\uFF63":"]",
            "\uFF64":",",
            "\uFF65":".",
            "\uFFE1":"GBP",
            "\uFFE5":"Y",
            "\uFFE6":"W",
            "\uFFE8":"|"
        },
        __toWinLatin1Map:{
            "\u20AC":"\u0080",
            "\u201A":"\u0082" ,
            "\u0192":"\u0083",
            "\u201E":"\u0084",
            "\u2026":"\u0085",
            "\u2020":"\u0086",
            "\u2021":"\u0087",
            "\u02C6":"\u0088",
            "\u2030":"\u0089",
            "\u0160":"\u008A",
            "\u2039":"\u008B",
            "\u0152":"\u008C",
            "\u017D":"\u008E",
            "\u2018":"\u0091",
            "\u2019":"\u0092" ,
            "\u201C":"\u0093",
            "\u201D":"\u0094",
            "\u2022":"\u0095",
            "\u2013":"\u0096",
            "\u2014":"\u0097",
            "\u02DC":"\u0098",
            "\u2122":"\u0099",
            "\u0161":"\u009A",
            "\u203A":"\u009B",
            "\u0153":"\u009C",
            "\u017E":"\u009E",
            "\u0178":"\u009F"
        },
        __winLatin1ToUnicode:[
            "\u0000", "\u0001", "\u0002", "\u0003", "\u0004", "\u0005", "\u0006", "\u0007",
            "\u0008", "\u0009", "\u000a", "\u000b", "\u000c", "\u000d", "\u000e", "\u000f",
            "\u0010", "\u0011", "\u0012", "\u0013", "\u0014", "\u0015", "\u0016", "\u0017",
            "\u0018", "\u0019", "\u001a", "\u001b", "\u001c", "\u001d", "\u001e", "\u001f",
            "\u0020", "\u0021", "\u0022", "\u0023", "\u0024", "\u0025", "\u0026", "\u0027",
            "\u0028", "\u0029", "\u002a", "\u002b", "\u002c", "\u002d", "\u002e", "\u002f",
            "\u0030", "\u0031", "\u0032", "\u0033", "\u0034", "\u0035", "\u0036", "\u0037",
            "\u0038", "\u0039", "\u003a", "\u003b", "\u003c", "\u003d", "\u003e", "\u003f",
            "\u0040", "\u0041", "\u0042", "\u0043", "\u0044", "\u0045", "\u0046", "\u0047",
            "\u0048", "\u0049", "\u004a", "\u004b", "\u004c", "\u004d", "\u004e", "\u004f",
            "\u0050", "\u0051", "\u0052", "\u0053", "\u0054", "\u0055", "\u0056", "\u0057",
            "\u0058", "\u0059", "\u005a", "\u005b", "\u005c", "\u005d", "\u005e", "\u005f",
            "\u0060", "\u0061", "\u0062", "\u0063", "\u0064", "\u0065", "\u0066", "\u0067",
            "\u0068", "\u0069", "\u006a", "\u006b", "\u006c", "\u006d", "\u006e", "\u006f",
            "\u0070", "\u0071", "\u0072", "\u0073", "\u0074", "\u0075", "\u0076", "\u0077",
            "\u0078", "\u0079", "\u007a", "\u007b", "\u007c", "\u007d", "\u007e", "\u007f",
            "\u20ac", "\u0081", "\u201a", "\u0192", "\u201e", "\u2026", "\u2020", "\u2021",
            "\u02c6", "\u2030", "\u0160", "\u2039", "\u0152", "\u008d", "\u017d", "\u008f",
            "\u0090", "\u2018", "\u2019", "\u201c", "\u201d", "\u2022", "\u2013", "\u2014",
            "\u02dc", "\u2122", "\u0161", "\u203a", "\u0153", "\u009d", "\u017e", "\u0178",
            "\u00a0", "\u00a1", "\u00a2", "\u00a3", "\u00a4", "\u00a5", "\u00a6", "\u00a7",
            "\u00a8", "\u00a9", "\u00aa", "\u00ab", "\u00ac", "\u00ad", "\u00ae", "\u00af",
            "\u00b0", "\u00b1", "\u00b2", "\u00b3", "\u00b4", "\u00b5", "\u00b6", "\u00b7",
            "\u00b8", "\u00b9", "\u00ba", "\u00bb", "\u00bc", "\u00bd", "\u00be", "\u00bf",
            "\u00c0", "\u00c1", "\u00c2", "\u00c3", "\u00c4", "\u00c5", "\u00c6", "\u00c7",
            "\u00c8", "\u00c9", "\u00ca", "\u00cb", "\u00cc", "\u00cd", "\u00ce", "\u00cf",
            "\u00d0", "\u00d1", "\u00d2", "\u00d3", "\u00d4", "\u00d5", "\u00d6", "\u00d7",
            "\u00d8", "\u00d9", "\u00da", "\u00db", "\u00dc", "\u00dd", "\u00de", "\u00df",
            "\u00e0", "\u00e1", "\u00e2", "\u00e3", "\u00e4", "\u00e5", "\u00e6", "\u00e7",
            "\u00e8", "\u00e9", "\u00ea", "\u00eb", "\u00ec", "\u00ed", "\u00ee", "\u00ef",
            "\u00f0", "\u00f1", "\u00f2", "\u00f3", "\u00f4", "\u00f5", "\u00f6", "\u00f7",
            "\u00f8", "\u00f9", "\u00fa", "\u00fb", "\u00fc", "\u00fd", "\u00fe", "\u00ff"
        ]
    }, true) ;
    
    
    // ================ constants ====================
    MSTools.defineHiddenConstants(Array.prototype, {
        isa:'Array',
        isArray:true,
        MSTECode:31
    }, true) ;
    
    // ================= class methods ===============
    
    // ================  private function in MSTools scope =============
    function _sortedIndexOf(self, item, n0, nb) {
        var min = n0, mid, max = nb - 1 ;
        while (min < max) {
            mid = $div(min + max, 2) ;
            if (item <= self[mid]) { max = mid ; }
            else { min = mid + 1; }
        }
        return min ;
    }
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(Array, {
        indexOf:function(item, fromIndex) {
            var l = this.length ;
            if (!$ok(fromIndex) || (fromIndex | 0) < 0) { fromIndex = 0 ; }
            /* jshint eqeqeq:false */
            for (var i = fromIndex | 0 ; i < l ; i++) { if (this[i] == item) { return i ; }}
            /* jshint eqeqeq:true */
            return -1;
        },
        lastIndexOf:function(item, fromIndex) {
            var i = this.length ;
            if ($ok(fromIndex) && (fromIndex | 0) < i) { i = 1 + (fromIndex | 0) ; }
            /* jshint eqeqeq:false */
            while (i-- > 0 ) { if (this[i] == item) { return i ; }}
            /* jshint eqeqeq:true */
            return -1;
        },
        indexOfIdentical:function(item, fromIndex) {
            var l = this.length ;
            if (!$ok(fromIndex) || (fromIndex | 0) < 0) { fromIndex = 0 ; }
            for (var i = fromIndex | 0; i < l; i++) { if (this[i] === item) { return i ; }}
            return -1 ;
        },
        lastIndexOfIdentical:function(item, fromIndex) {
            var i = this.length ;
            if ($ok(fromIndex) && (fromIndex | 0) < i) { i = 1 + (fromIndex | 0) ; }
            while (i-- > 0 ) { if (this[i] === item) { return i ; }}
            return -1;
        },
        contains:function(item) { return this.indexOf(item) === -1 ? false : true ; },
        containsIdentical:function(item) { return this.indexOfIdentical(item) === -1 ? false : true ; },
        isEqualTo: function(other, options) {
            var i, count ;
            if (this === other) { return true ; }
            if (!$ok(other) || this.isa !== other.isa || (count = this.length) !== other.length) { return false ; }
            for (i = 0 ; i < count ; i++) { if (!$equals(this[i], other[i], options)) { return false ; } }
            return true ;
        },
        sortedIndexOf:function(item) {
            // this works only if your array is sorted
            if (this.length === 0) { return 0 ; }
            return _sortedIndexOf(this, item, 0, this.length) ;
        },
        addSorted:function(item) {
            // this works only if your array is already sorted
            var i = this.length ;
            if (i === 0 || item > this[i - 1]) {
                this.push(item) ;
                return i ;
            }
            i = _sortedIndexOf(this, item, 0, i) ;
            if (item < this[i]) { this.splice(i,0, item) ; return i ; }
            return -1 ;
        },
        minimum:function() {
            var r, i, l = this.length ;
            if (l > 0) {
                r = this[0] ;
                for (i = 1 ; i < l ; i++) { if (this[i] < r) { r = this[i] ;}}
                return r ;
            }
            return null ;
        },
        maximum:function() {
            var r, i, l = this.length ;
            if (l > 0) {
                r = this[0] ;
                for (i = 1 ; i < l ; i++) { if (this[i] > r) { r = this[i] ;}}
                return r ;
            }
            return null ;
        },
        firstObject:function() { return this.length ? this[0] : null ; },
        lastObject:function() { return this.length ? this[this.length - 1] : null ;},
        objectAtIndex:function(i) { return this[i] ; }
        // TODO : a reduce function for old browsers ?
    }) ;
    
    MSTools.defineInstanceMethods(Array, {
        toArray: function() { return Array.prototype.slice.call(this,0) ; },
        toMSTE: function(encoder) {
            if (encoder.shouldPushObject(this)) {
                var i, count = this.length ;
                encoder.push(this.MSTECode) ;
                encoder.push(count) ;
                for (i = 0 ; i < count ; i++) { encoder.encodeObject(this.objectAtIndex(i)) ; }
            }
        }
    }, true) ;
    
    if (MSTools.degradedMode) {
        MSTools.defineInstanceMethods(Array, {
            toInt:function() { return this.toNumber().toInt() ; },
            toUInt:function(base) { return this.toInt().toUInt() ; }
        }) ;
    }
    
    // ================ constants ====================
    MSTools.defineHiddenConstant(Function.prototype, 'isa', 'Function', true) ;
    
    // ================= class methods ===============
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(Function, {
        toMSTE: function(encoder) { encoder.encodeException(this) ; }
    }, true) ;
    
    if (MSTools.degradedMode) {
        MSTools.defineInstanceMethods(String, {
            isEqualTo: function(other, options) { return this === other ? true : false ; },
            toArray: function() { return [this] ; },
            toInt:function() { return this.toNumber().toInt() ; },
            toUInt:function(base) { return this.toInt().toUInt() ; }
        }) ;
    }
    
    /* global MSDate */
    
    // ================ constants ====================
    MSTools.defineHiddenConstant(Date.prototype,'isa', 'Date', true) ;
    MSTools.defineHiddenConstants(Date,{
        DISTANT_PAST_TS:-8640000000000000,
        DISTANT_FUTURE_TS:8640000000000000
    }, true) ;
    MSTools.defineConstants(Date,{
        DISTANT_PAST:new Date(-8640000000000000),
        DISTANT_FUTURE:new Date(8640000000000000)
    }, true) ;
    
    // ================= class methods ===============
    MSTools.defineMethods(Date, {
        currentMonth:function() { return new Date().getMonth() ; },
        currentYear:function() { return new Date().getFullYear() ; },
        dateWithUTCTime:function(utc) {
            return new Date(utc) ;
        },
        dateWithUTCSeconds:function(utc) { return this.dateWithUTCTime(1000*utc) ; },
        dateWithInt:function(decimalDate) {
            if ($ok(decimalDate)) {
                decimalDate = decimalDate.toInt() ;
                var day = decimalDate % 100 ;
                var month = $div((decimalDate % 10000),100) ;
                var year = $div(decimalDate, 10000) ;
                if (MSDate.validDate(year, month, day)) { return new Date(year, month - 1, day) ; }
            }
            return null ;
        }
    }) ;
    
    // ================ instance methods =============
    
    
    MSTools.defineInstanceMethods(Date, {
        getUTCFullSeconds: function() { return $div(this.getTime(), 1000) ; },
        getUTCFullTime: function() { return this.getTime(); },
        dateWithoutTime: function() { var utc = this.getUTCFullTime() ; return Date.dateWithUTCTime(utc - (utc % 86400000)) ; },
        isLeap: function() { return MSDate.isLeapYear(this.getFullYear()) ; },
        shiftSeconds: function(s) { this.setTime(this.getTime()+s*1000) ; },
        weekOfYear: function(offset) {
            var firstDayOfYear, firstDayOfWeek, reference, week, utc ;
    
            offset = $ok(offset) && !isNaN(offset) ? offset % 7 : 0 ;
    
            firstDayOfYear = new Date(this.getFullYear(),0,1) ;
            firstDayOfWeek = firstDayOfYear.getDay() ;
    
            reference = firstDayOfYear.getTime() - ((firstDayOfWeek + 7 - offset) % 7) * 86400000 ;
            utc = this.getTime() ;
            utc = utc - (utc % 86400000) ;
    
            week = $div((utc - reference), 604800000) ;
            if (firstDayOfWeek === 0 || firstDayOfWeek > 4) {
                if (week === 0) {
                    // we take the last week of the preceding year
                    reference = new Date(utc - 86400000) ;
                    return reference.weekOfYear(offset) ;
                }
            }
            else { week++ ; }
            return week ;
        },
        isEqualTo: function(other, options) {
    
            if (this === other) { return true ; }
            if (options && options.secondPrecision) {
                return $ok(other) && this.isa === other.isa && this.getUTCFullSeconds() === other.getUTCFullSeconds() ? true : false ;
            }
            return $ok(other) && this.isa === other.isa && this.getUTCFullTime() === other.getUTCFullTime() ? true : false ;
        },
        toInt: function() {
            var year = this.getFullYear(), month = this.getMonth()+1, day = this.getDate() ;
            return (year < 0 ? -1 : 1) * (year < 0 ? -year : year) * 10000 + month * 100 + day ;
        },
        toUInt: function() {
            var year = this.getFullYear(), month = this.getMonth()+1, day = this.getDate() ;
            return year < 0 ? 0 : year * 10000 + month * 100 + day ;
        },
        toJSON: function (key) {
            function f(n) { return n < 10 ? '0' + n : n; } // Format integers to have at least two digits.
            return (isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null);
        }
    }) ;
    
    MSTools.defineInstanceMethods(Date, {
        toMSTE: function(encoder) {
            //console.log("UTC milliseconds of date "+this+" is "+t) ;
            var identifier = this[encoder.referenceKey] ;
            if ($ok(identifier)) { encoder.push(9) ; encoder.push(identifier) ; }
            else {
                var t = this.getUTCFullTime() ;
                identifier = encoder.encodedObjects.length ;
                Object.defineProperty(this, encoder.referenceKey, {
                    enumerable:false,
                    configurable:true, // so it could be later deleted
                    writable:false,
                    value:identifier
                }) ;
                encoder.encodedObjects[identifier] = this ;
                encoder.push(23) ;
                encoder.push(t/1000) ; // can be a double
                //console.log('Date '+this+" will encode as "+(t/1000));
            }
        }
    }, true) ;
    
    if (MSTools.degradedMode) {
        MSTools.defineInstanceMethods(Date, {
            toArray: function() { return [this] ; }
        }) ;
    }
    
    // ================ class interface ====================
    function MSDate()
    {
        var n = arguments.length, tmp ;
        if (n >= 3) {
            var i ;
            if (!MSDate.validDate(arguments[0], arguments[1], arguments[2])) { throw "Bad MSDate() day arguments" ; }
            if (n !== 3 && n !== 6 ) { throw "Impossible to initialize a new MSDate() with "+n+" arguments" ; }
            if (n === 6) {
                if (!MSDate.validTime(arguments[3], arguments[4], arguments[5])) { throw "Bad MSDate() time arguments" ; }
                this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5] | 0) ;
            }
            else {
                this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], 0, 0, 0) ;
            }
            return ;
        }
        else if (n === 2) { throw "Impossible to initialize a new MSDate() with 2 arguments" ; }
        else if (n === 1) {
            var t = arguments[0] ;
            if ($ok(t)) {
                switch (t.isa) {
                    case 'Date': tmp = t ; break ;
                    case 'MSDate': this.interval = t.interval ; return ;
                    case 'Number':
                        if (!Number.isInteger(t)) { throw "Impossible to initialize a new MSDate() with a non integer number" ; }
                        this.interval = t ;
                        return ;
                    default:
                        t = Number(t) ;
                        if (!Number.isInteger(t)) { throw "Impossible to initialize a new MSDate() with a non integer number representation" ; }
                        this.interval = t ;
                        return ;
                }
            }
            else { tmp = new Date() ; }
        }
        else { tmp = new Date() ; }
    
        this.interval = MSDate.intervalFrom(tmp.getFullYear(), tmp.getMonth()+1, tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds()) ;
    }
    
    // ================ constants ====================
    MSTools.defineHiddenConstants(MSDate,{
        DaysFrom00000229To20010101:730792,
        DaysFrom00010101To20010101:730485,
        SecsFrom00010101To20010101:63113904000,
        SecsFrom19700101To20010101:978307200,
        DaysInMonth:[0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        DaysInPreviousMonth:[0, 0, 0, 0, 31, 61, 92, 122, 153, 184, 214, 245, 275, 306, 337]
    }, true) ;
    MSTools.defineHiddenConstant(MSDate.prototype,'isa', 'MSDate', true) ;
    
    // ================= class methods ===============
    MSTools.defineMethods(MSDate, {
        isLeapYear:function(y) { return (y % 4 ? false : ( y % 100 ? (y > 7 ? true : false) : (y % 400 || y < 1600 ? false : true))) ; },
        validDate:function(year, month, day) {
            if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year) || day < 1 || month < 1 || month > 12) { return false ; }
            if (day > MSDate.DaysInMonth[month]) { return (month === 2 && day === 29 && MSDate.isLeapYear(year)) ? true : false ; }
            return true ;
        },
        validTime:function(hour, minute, second) {
            return (Number.isInteger(hour) && Number.isInteger(minute) && !isNaN(second) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) ? true : false ;
        },
        intervalFromYMD:function(year, month, day) {
            var leaps ;
            month = 0 | month ;
            if (month < 3) { month += 12; year--; }
    
            leaps = Math.floor(year/4) - Math.floor(year/100) + Math.floor(year/400);
    
            return Math.floor((day + MSDate.DaysInPreviousMonth[month] + 365 * year + leaps - MSDate.DaysFrom00000229To20010101) * 86400) ;
        },
        intervalFrom:function(year, month, day, hours, minutes, seconds) {
            return MSDate.intervalFromYMD(year, month, day) + hours * 3600 + minutes * 60 + seconds ;
        },
        timeFromInterval:function(t) { return ((t+MSDate.SecsFrom00010101To20010101) % 86400) ; },
        dayFromInterval:function(t) { return Math.floor((t - MSDate.timeFromInterval(t))/86400) ; },
        secondsFromInterval:function(t) { return ((t+MSDate.SecsFrom00010101To20010101) % 60) ; },
        minutesFromInterval:function(t) { return $div(Math.floor((t+MSDate.SecsFrom00010101To20010101) %  3600),  60) ; },
        hoursFromInterval:function(t) { return $div(Math.floor((t+MSDate.SecsFrom00010101To20010101) %  86400),  3600) ; },
        dayOfWeekFromInterval:function(t, offset) {
            offset = offset || 0 ;
            return (MSDate.dayFromInterval(t)+MSDate.DaysFrom00010101To20010101 + 7 - (offset % 7)) % 7;
        },
        componentsWithInterval:function(interval) {
            var ret, Z, gg, CENTURY, CENTURY_MQUART, ALLDAYS, Y, Y365, DAYS_IN_Y, MONTH_IN_Y ;
    
            Z =                  MSDate.dayFromInterval(interval) + MSDate.DaysFrom00000229To20010101 ;
            gg =                 Z - 0.25 ;
            CENTURY =            Math.floor(gg/36524.25) ;
            CENTURY_MQUART =     CENTURY - Math.floor(CENTURY/4) ;
            ALLDAYS =            gg + CENTURY_MQUART ;
            Y =                  Math.floor(ALLDAYS / 365.25) ;
            Y365 =               Math.floor(Y * 365.25) ;
            DAYS_IN_Y =          CENTURY_MQUART + Z - Y365 ;
            MONTH_IN_Y =         Math.floor((5 * DAYS_IN_Y + 456)/153) ;
    
            ret = {
                day:Math.floor(DAYS_IN_Y - Math.floor((153*MONTH_IN_Y - 457) / 5)),
                hour:MSDate.hoursFromInterval(interval),
                minute:MSDate.minutesFromInterval(interval),
                seconds:MSDate.secondsFromInterval(interval),
                dayOfWeek:((Z + 2) % 7)
            } ;
    
            if (MONTH_IN_Y > 12) {
                ret.month = MONTH_IN_Y - 12 ;
                ret.year = Y + 1 ;
            }
            else {
                ret.month = MONTH_IN_Y ;
                ret.year = Y ;
            }
            return ret ;
        },
        dateWithInt:function(decimalDate) {
            if ($ok(decimalDate)) {
                decimalDate = decimalDate.toInt() ;
                var day = decimalDate % 100 ;
                var month = $div((decimalDate % 10000),100) ;
                var year = $div(decimalDate, 10000) ;
                if (MSDate.validDate(year, month, day)) { return new MSDate(year, month, day) ; }
            }
            return null ;
        },
        _lastDayOfMonth:function(year,month) { return (month === 2 && MSDate.isLeapYear(year)) ? 29 : MSDate.DaysInMonth[month]; }, // not protected. use carrefully
        _yearRef:function(y, offset) {
            var firstDayOfYear = MSDate.intervalFromYMD(y, 1, 1),
                d = MSDate.dayOfWeekFromInterval(firstDayOfYear, offset) ;
    
            d = (d <= 3 ? -d : 7-d ); // Day of the first week
            return firstDayOfYear + d * 86400 ;
        }
    }, true) ;
    // ================  instance methods =============
    MSTools.defineInstanceMethods(MSDate, {
        components: function() { return MSDate.componentsWithInterval(this.interval) ; },
        valueOf: function() { return this.interval ; },
        toNumber: function() { return this.interval ; },
        toString: function() { // returns the ISO 8601 representation without any timezone
            function f(n) { return n < 10 ? '0' + n : n; } // Format integers to have at least two digits.
    
            var c = this.components() ;
            return ($ok(c) ?
                    c.year + '-' +
                    f(c.month) + '-' +
                    f(c.day) + 'T' +
                    f(c.hour)     + ':' +
                    f(c.minute)   + ':' +
                    f(c.seconds)
                : null);
        },
        isEqualTo: function(other, options) {
            if (this === other) { return true ; }
            if ($ok(other)) {
                if (this.isa === other.isa && this.interval === other.interval) { return true ; }
                // should we equals to normal javascript dates ?
            }
            return false ;
        },
        isLeap: function() { var c = this.components() ; return c !== null ? MSDate.isLeapYear(c.year) : false ; },
    
        yearOfCommonEra:function() { var c = this.components() ; return c !== null ? c.year : NaN ; },
    
        monthOfYear:function() { var c = this.components() ; return c !== null ? c.month : NaN ; },
        weekOfYear:function(offset) {
            // In order to follow ISO 8601 week begins on monday and must have at
            // least 4 days (i.e. it must includes thursday)
            var reference, w, c = this.components() ; if (c === null) { return NaN ; }
            offset = offset || 0 ;
            offset %= 7;
    
            reference = MSDate._yearRef(c.year, offset) ;
            if (this.interval < reference) { // De l'année d'avant
                reference = MSDate._yearRef(c.year - 1, offset);
                w = Math.floor((this.interval - reference) / (86400*7)) + 1 ;
            }
            else {
                w = Math.floor((this.interval - reference) / (86400*7)) + 1 ;
                if (w === 53) {
                    reference += 52 * 7 * 86400 ;
                    c = MSDate.componentsWithInterval(reference) ;
                    if (c.day >= 29) { w = 1 ; }
                }
            }
            return w ;
        },
        dayOfYear:function() {
            var c = this.components() ; if (c === null) { return NaN ; }
            return Math.floor((this.interval - MSDate.intervalFromYMD(c.year, 1, 1))/86400)+1 ;
        },
    
        dayOfMonth:function() { var c = this.components() ; return c !== null ? c.day : NaN ; },
        lastDayOfMonth:function() { var c = this.components() ; return c !== null ? MSDate._lastDayOfMonth(c.year, c.month) : NaN ; },
    
        dayOfWeek:function(offset) { return MSDate.dayOfWeekFromInterval(this.interval, offset) ; },
    
        hourOfDay:function() { return MSDate.hoursFromInterval(this.interval) ; },
        secondOfDay:function() { return MSDate.timeFromInterval(this.interval) ; },
    
        minuteOfHour:function() { return MSDate.minutesFromInterval(this.interval) ; },
    
        secondOfMinute:function() { return MSDate.secondsFromInterval(this.interval) ; },
    
        dateWithoutTime: function() { return new MSDate(this.interval - MSDate.timeFromInterval(this.interval)) ; },
        dateOfFirstDayOfYear: function() { var c = this.components() ; return c !== null ? new MSDate(c.year,1, 1) : null ; },
        dateOfLastDayOfYear: function() { var c = this.components() ; return c !== null ? new MSDate(c.year,12, 31) : null ; },
        dateOfFirstDayOfMonth: function() { var c = this.components() ; return c !== null ? new MSDate(c.year, c.month, 1) : null ; },
        dateOfLastDayOfMonth: function() { var c = this.components() ; return c !== null ? new MSDate(c.year, c.month, MSDate._lastDayOfMonth(c.year, c.month)) : null ; },
    
        toInt: function() {
            var c = this.components() ;
            return c === null ? 0 : (c.year < 0 ? -1 : 1) * (c.year < 0 ? -c.year : c.year) * 10000 + c.month * 100 + c.day ;
        },
        toUInt: function() {
            var c = this.components() ;
            return c === null || c.year < 0 ? 0 : c.year * 10000 + c.month * 100 + c.day ;
        },
        toDate: function() {
            var c = this.components() ;
            return c !== null ? new Date(c.year, c.month - 1, c.day, c.hour, c.minute, c.second, 0) : null ;
        },
        toJSON: function (key) {
            var d = this.toDate() ;
            return d !== null ? d.toJSON(key) : null ;
        },
        toArray: function() {
            var c = this.components() ;
            return c != null ? [c.year, c.month, c.day, c.hour, c.minute, c.seconds, c.dayOfWeek] : null ;
        },
        toMSTE: function(encoder) {
            if (encoder.shouldPushObject(this)) {
                encoder.push(22) ;
                encoder.push(this.interval + MSDate.SecsFrom19700101To20010101) ;
            }
        }
    
    }, true) ;
    // MSArray is a generic array subclass designed to be subclassed
    // MSNaturalArray and MSData are both subclasses of MSArray
    
    // ================ class interface ====================
    
    // with this constructor a new MSArray(10) creates a data with number 10 at position 0
    // any array passed as an argument will be concatenated
    
    
    function MSArray() {
        var a, ret = [], i, count = arguments.length ;
        var localConstructor = this.constructor ;
    
        Object.setPrototypeOf(ret, localConstructor.prototype) ;
    
        for (i = 0 ; i < count ; i++) {
            a = arguments[i] ;
            if ($ok(a) && a.isArray) { localConstructor.prototype.push.apply(ret, a) ; }
            else { ret.push(a) ; }
        }
        return ret ;
    }
    
    MSArray.prototype = Object.create(Array.prototype, { constructor: {value: MSArray} });
    
    // ================ constants ====================
    
    // ================= class methods ===============
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(MSArray, {
        unshift: function() {
            var count = arguments.length ;
            if (count) {
                var F = this.constructor, i, n = new F() ;
                for (i = 0 ; i < count ; i++) { n.push(arguments[i]) ; }
                return Array.prototype.unshift.apply(this, n) ; // unshift
            }
            return this.length ;
        },
        concat: function() {
            var F = this.constructor ;
            var ret = new F(this), i, count = arguments.length, p = F.prototype.push ;
            for (i = 0 ; i < count ; i++) { p.apply(ret, arguments[i]) ; }
            return ret ;
        },
        slice: function(start,end) {
            // console.log("want to slice "+MSTools.stringify(this)+" from "+start+" to "+end) ;
            var ret = Array.prototype.slice.call(this, start, end) ;
            Object.setPrototypeOf(ret, Object.getPrototypeOf(this)) ;
            return ret ;
        },
        splice: function(index, n) {
            var a = [index, n], o, i, count = arguments.length, ret, p = this.constructor.prototype.push ;
            if (count > 2) {
                for (i = 2 ; i < count ; i++) { p.call(a, arguments[i]) ; }
            }
            ret =  Array.prototype.splice.apply(this, a) ;
            Object.setPrototypeOf(ret, Object.getPrototypeOf(this)) ;
            return ret ;
        },
        filter: function() {
            var ret =  Array.prototype.filter.apply(this, arguments) ;
            Object.setPrototypeOf(ret, Object.getPrototypeOf(this)) ;
            return ret ;
        }
    }, true) ;
    
    
    
    // ================ class interface ====================
    /* global MSArray */
    function MSNaturalArray() { return MSArray.apply(this, arguments); }
    
    MSNaturalArray.prototype = Object.create(MSArray.prototype, { constructor: {value: MSNaturalArray} });
    
    // ================ constants ====================
    MSTools.defineHiddenConstants(MSNaturalArray.prototype, {
        isa:'Naturals',
        MSTECode:26
    }, true) ;
    
    // ================= class methods ===============
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(MSNaturalArray, {
        objectAtIndex: function(i) {
            var v = this[i] ;
            return $ok(v) ? v.toUInt() : 0 ;
        },
        toMSTE: function(encoder) {
            if (encoder.shouldPushObject(this)) {
                var i, count = this.length ;
                encoder.push(this.MSTECode) ;
                encoder.push(count) ;
                for (i = 0 ; i < count ; i++) { encoder.push(this.objectAtIndex(i)) ; }
            }
        },
        push: function() {
            var o, i, count = arguments.length ;
            //console.log('MSNaturalArray push with '+arguments.length+' args.') ;
            for (i = 0 ; i < count ; i++) {
                o = arguments[i] ;
                o = $ok(o) ? o.toUInt() : 0 ;
                if ($ok(o)) { Array.prototype.push.call(this, o) ; }
            }
        }
        // unshift(), concat(), slice(), filter(), splice() and toMSTE() are inherited from MSArray
    }, true) ;
    
    
    
    
    // ================ class interface ====================
    /* global MSArray */
    
    // with this constructor a new MSData(10) creates a data with the byte '10' at first position
    // any array passed as an argument will be concatenated
    function MSData() {
        var a, ret = new MSArray(), i, count = arguments.length ;
        var localConstructor = this.constructor ;
    
        Object.setPrototypeOf(ret, localConstructor.prototype) ;
    
        // console.log('wanted to create a data new with '+count+' arguments :') ;
        if (count === 1 && (typeof (a = arguments[0])) === 'string') {
            count = a.length ;
            for (i = 0 ; i < count ; i++) { ret.push(a.charCodeAt(i) & 0xff) ; }
        }
        else {
            for (i = 0 ; i < count ; i++) {
                a = arguments[i] ;
                //console.log('arguments['+i+']=<'+a+'> ('+(typeof a)+')') ;
                if ($ok(a) && a.isArray) { localConstructor.prototype.push.apply(ret, a) ; }
                else { ret.push(a) ; }
            }
        }
        return ret ;
    }
    
    MSData.prototype = Object.create(MSArray.prototype, { constructor: {value: MSData} });
    
    // ================ constants ====================
    MSTools.defineHiddenConstant(MSData.prototype,'isa', 'Data', true) ;
    MSTools.defineConstants(MSData, {
        EMPTY_DATA:new MSData()
    }, true) ;
    
    MSTools.defineHiddenConstants(MSData, {
        __base64Tokens:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        __base64Index:[
        -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -1, -2, -2,
        -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
        -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, 62, -2, -2, -2, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -2, -2, -2, -2, -2, -2,
        -2,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -2, -2, -2, -2, -2,
        -2, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -2, -2, -2, -2, -2
        ],
        __base64URLTokens:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        __base64URLIndex:[
        -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -1, -2, -2,
        -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
        -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, 62, -2, -2,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -2, -2, -2, -2, -2, -2,
        -2,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -2, -2, -2, -2, 63,
        -2, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -2, -2, -2, -2, -2
        ],
        __base64PaddingChar:'=',
        __base64DecodeFn:[
        function(result, array, dc) { array[0] = (dc << 2) & 0xff ; },
        function(result, array, dc) { array[0] |= dc >> 4 ; array[1] = ((dc & 0x0f) << 4) & 0xff ; },
        function(result, array, dc) { array[1] |= dc >> 2 ; array[2] = ((dc & 0x03) << 6) & 0xff ; },
        function(result, array, dc) {
            array[2] |= dc ;
            result.push(array[0], array[1], array[2]) ;
            array[0] = array[1] = array[2] = 0 ;
        },
        ]
        }, true) ;
    
    // ================= class methods ===============
    MSTools.defineMethods(MSData, {
        dataWithBase64String: function(s, index, paddingChar) {
            var result = null ;
            if ((typeof s) === 'string') {
                var len = s.length ;
                result = new MSData() ;
                if (len > 0) {
                    var j, i = 0, c, dc, array = [] ;
    
                    array[0] = array[1] = array[2] = 0 ;
    
                    index = index || MSData.__base64Index ;
                    paddingChar = paddingChar || MSData.__base64PaddingChar ;
                    paddingChar = paddingChar.charCodeAt(0) ;
    
                    for (j = 0 ; j < len ; j++) {
                        c = s.charCodeAt(j) ;
                        if (c === paddingChar) { break; }
                        else if (c > 127) { return null ; } // bad character
    
                        dc = index[c] ;
                        if (dc === -1) { continue ; } // we skip spaces and separators
                        else if (dc === -2) { return null ; } // bad character
    
                        MSData.__base64DecodeFn[i % 4](result, array, dc) ;
                        i++ ;
                    }
                    if (c === paddingChar) {
                        i = i % 4;
                        if (i === 1) { return null ; }
                        i-- ;
                        for (j = 0 ; j < i ; j++) { result.push(array[j]) ; }
                    }
                }
            }
            return result ;
        }
    }, true) ;
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(MSData, {
        // to spead data implementation we did rewrite the byteAtIndex and the objectAtIndex method
        byteAtIndex: function(i) { var v = Number(this[i]) ; return v > 0 ? v & 0xff : 0 ; }, // works because NaN > 0 is false
        objectAtIndex: function(i) { var v = Number(this[i]) ; return v > 0 ? v & 0xff : 0 ; },
        push: function() {
            var o, i, count = arguments.length ;
            for (i = 0 ; i < count ; i++) {
                // console.log('push('+arguments[i]+') '+(typeof arguments[i])) ;
                o = Number(arguments[i]) ; if (o < 0) { o = 0 ;}
                Array.prototype.push.call(this, o & 0xff) ;
            }
        },
        // unshift, concat, slice, filter and splice are inherited from MSArray
        toString: function() {
            var i, count = this.length ;
            if (count) {
                var array = [] ;
                // console.log("count = "+count) ;
                for (i = 0 ; i < count ; i++) {
                    array.push(String.fromCharCode(this.byteAtIndex(i))) ;
                }
                return array.join('') ;
            }
            return String.EMPTY_STRING ;
        },
        toBase64String: function(tokens, paddingChar) {
            var i, end, array, token ;
    
            tokens = tokens || MSData.__base64Tokens ;
            paddingChar = paddingChar || MSData.__base64PaddingChar ;
    
            if (this.length === 0) { return '' ; }
    
            end = this.length - this.length % 3 ;
            array = [] ;
    
            for (i = 0 ; i < end ; i += 3) {
    
                token = (this.byteAtIndex(i) << 16) | (this.byteAtIndex(i+1) << 8) | this.byteAtIndex(i+2) ;
    
                array.push(tokens.charAt(token >> 18)) ;
                array.push(tokens.charAt((token >> 12) & 0x3F)) ;
                array.push(tokens.charAt((token >> 6) & 0x3f)) ;
                array.push(tokens.charAt(token & 0x3f)) ;
            }
    
            switch (this.length - end) {
                case 1:
                    token = this.byteAtIndex(i) << 16 ;
                    array.push(tokens.charAt(token >> 18) + tokens.charAt((token >> 12) & 0x3F) + paddingChar + paddingChar );
                    break;
                case 2:
                    token = (this.byteAtIndex(i) << 16) | (this.byteAtIndex(i+1) << 8) ;
                    array.push(tokens.charAt(token >> 18) + tokens.charAt((token >> 12) & 0x3F) + tokens.charAt((token >> 6) & 0x3F) + paddingChar);
                    break ;
            }
            return array.join("") ;
        },
        toMSTE: function(encoder) {
            if (this.length === 0) { encoder.push(4) ; }
            else if (encoder.shouldPushObject(this)) {
                encoder.push(25) ;
                encoder.push(this.toBase64String()) ;
            }
        },
        hashCode: function() {
            // we use the same hash than strings
            var i, hash = 0, count = this.length ;
            for (i = 0; i < count; i++) {
                hash  = ((hash << 5) - hash) + this.byteAtIndex(i) ;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }
    }, true) ;
    
    // ================ class interface ====================
    function MSColor(r,g,b,a)
    {
        if (typeof r === 'string') {
            var s, bits, ok = true ;
            r = r.replace(/ /g,'') ;
            if (!$length(r)) { ok = false ; }
            if (ok && r.charAt(0) === '#') { r = r.substr(1); }
            if (ok && $length(r) < 3) { ok = false ; }
            if (ok) {
                r = r.toLowerCase();
                s = MSColor.namedColors[r] ;
    
                bits = MSColor.colorStringRegex.exec(s?s:r);
                if ($length(bits) !== 4) {
                    bits = MSColor.shortColorStringRegex.exec(s?s:r);
                    if ($length(bits) !== 4) { ok = false ; }
                }
                if (ok) {
                    this.red = parseInt(bits[1], 16) & 255 ;
                    this.green =  parseInt(bits[2], 16) & 255 ;
                    this.blue =  parseInt(bits[3], 16) & 255 ;
                }
            }
            if (!ok) {
                this.red = this.green = this.blue = 0 ;
            }
            this.alpha = 255 ;
        }
        else {
            r = r.toUInt() ;
            if ($ok(g) && $ok(b)) {
                this.red = r & 255 ;
                this.green = g.toUInt() & 255 ;
                this.blue = b.toUInt() & 255 ;
                this.alpha = $ok(a) ? a.toUInt() & 255 : 255 ;
            }
            // should we throw if we only have two args ?
            else {
                // the 4 bytes contains the RTGB value TTRRGGBB where TT is the transparency (0 means opaque)
                this.alpha = 0xff - ((r >> 24) & 0xff) ;
                this.red = (r >> 16) & 0xff ;
                this.green = (r >> 8) & 0xff ;
                this.blue = r & 0xff ;
            }
        }
    }
    
    // ================ constants ====================
    MSTools.defineConstants(MSColor,{
        RED:new MSColor(0xff,0,0),
        GREEN:new MSColor(0,0xff,0),
        YELLOW:new MSColor(0xff,0xff,0),
        BLUE:new MSColor(0,0,0xff),
        CYAN:new MSColor(0,0xff,0xff),
        MAGENTA:new MSColor(0xff,0,0xff),
        WHITE:new MSColor(0xff, 0xff, 0xff),
        BLACK:new MSColor(0,0,0)
    }, true) ;
    
    MSTools.defineHiddenConstants(MSColor, {
        colorStringRegex:/^(\w{2})(\w{2})(\w{2})$/,
        shortColorStringRegex:/^(\w{1})(\w{1})(\w{1})$/,
        namedColors:{
            beige: 'f5f5dc',
            black: '000000',
            blue: '0000ff',
            brown: 'a52a2a',
            cyan: '00ffff',
            fuchsia: 'ff00ff',
            gold: 'ffd700',
            gray: '808080',
            green: '008000',
            indigo : '4b0082',
            ivory: 'fffff0',
            khaki: 'f0e68c',
            lavender: 'e6e6fa',
            magenta: 'ff00ff',
            maroon: '800000',
            olive: '808000',
            orange: 'ffa500',
            pink: 'ffc0cb',
            purple: '800080',
            red: 'ff0000',
            salmon: 'fa8072',
            silver: 'c0c0c0',
            snow: 'fffafa',
            teal: '008080',
            tomato: 'ff6347',
            turquoise: '40e0d0',
            violet: 'ee82ee',
            wheat: 'f5deb3',
            white: 'ffffff',
            yellow: 'ffff00'
        },
        HSBToRGB:[
            function (brightness, p, q, t) { return new MSColor(brightness, t, p) ; },
            function (brightness, p, q, t) { return new MSColor(q, brightness, p) ; },
            function (brightness, p, q, t) { return new MSColor(p, brightness, t) ; },
            function (brightness, p, q, t) { return new MSColor(p, q, brightness) ; },
            function (brightness, p, q, t) { return new MSColor(t, p, brightness) ; },
            function (brightness, p, q, t) { return new MSColor(brightness, p, q) ; },
            function (brightness, p, q, t) { return new MSColor(brightness, t, p) ; }
        ]
    
    }, true) ;
    
    MSTools.defineHiddenConstant(MSColor.prototype,'isa', 'Color', true) ;
    
    // ================= class methods ===============
    MSTools.defineMethods(MSColor, {
        lighter: function(X) { X /= 255.0 ; return Math.round((2.0*(X)*(X)/3.0+(X)/2.0+0.25)*255) ; },
        darker: function(X) { X /= 255.0 ; return Math.round((-(X)*(X)/3+5.0*(X)/6.0)*255) ; },
        colorWithHSB: function(hue, saturation, brightness) {
            if (typeof hue === "object" && "h" in hue && "s" in hue && "b" in hue) {
                brightness = hue.b;
                saturation = hue.s;
                hue = hue.h;
            }
            if (brightness !== 0) {
                var i = (Math.max(0, Math.floor(hue * 6))) % 7,
                    f = (hue * 6) - i,
                    p = brightness * (1 - saturation),
                    q = brightness * (1 - (saturation * f)),
                    t = brightness * (1 - (saturation * (1 - f))) ;
                return MSColor.HSBToRGB[i](brightness, p, q, t) ;
            }
            return MSColor.BLACK ;
        }
    }, true) ;
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(MSColor, {
        luminance:function () { return (0.3*this.red + 0.59*this.green +0.11*this.blue)/255.0 ; },
        isPale:function() { return this.luminance() > 0.6 ? true : false ; },
    
        lighterColor: function() { return new MSColor(MSColor.lighter(this.red), MSColor.lighter(this.green), MSColor.lighter(this.blue), this.alpha) ; },
        darkerColor: function() { return new MSColor(MSColor.darker(this.red), MSColor.darker(this.green), MSColor.darker(this.blue), this.alpha) ; },
        lightest: function() {
            return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha) ;
        },
        darkest: function() {
            return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha) ;
        },
        matchingColor:function() { return this.isPale() ? this.darkestColor() : MSColor.whiteColor ; },
        toString:function() {
            return this.alpha === 255 ? '#'+this.red.toHexa(2)+this.green.toHexa(2)+this.blue.toHexa(2) : "rgba("+this.red+","+this.green+","+this.blue+","+(this.alpha/255.0)+")" ;
        },
        toNumber:function() { return ((0xff - this.alpha) * 16777216) + (this.red * 65536) + (this.green * 256) + this.blue ;},
        toInt:function() { return (this.red * 65536) + (this.green * 256) + this.blue ; }, // the toInt function does not use the transparency because it should overflow the signed 32 bits
        toRGBA:function() { return (this.red * 16777216) + (this.green*65536) + (this.blue * 256) + this.alpha ;},
        toHSB:function() {
            var red = this.red / 255, green = this.green / 255, blue = this.blue / 255 ;
            var max = Math.max(red, green, blue), min = Math.min(red, green, blue) ;
            var hue = 0, saturation = 0, brightness = max ;
            if (min < max) {
                var delta = (max - min);
                saturation = delta / max;
                if (red === max) { hue = (green - blue) / delta ; }
                else if (green === max) { hue = 2 + ((blue - red) / delta) ; }
                else { hue = 4 + ((red - green) / delta); }
                hue /= 6;
                if (hue < 0) { hue += 1 ; }
                if (hue > 1) { hue -= 1 ; }
            }
            return {h: hue, s: saturation, b: brightness} ;
        },
        isEqualTo: function(other, options) {
            if (this === other) { return true ; }
            return $ok(other) && this.isa === other.isa && this.toRGBA() === other.toRGBA() ? true : false ;
        },
        toArray: function() { return [this.red, this.green, this.blue, this.alpha] ; },
        toMSTE: function(encoder) {
            if (encoder.shouldPushObject(this)) {
                encoder.push(24) ;
                encoder.push(this.toNumber()) ;
            }
        }
    }, true) ;
    
    MSTools.defineInstanceMethods(MSColor,{
        toUInt: MSColor.prototype.toNumber,
        valueOf: MSColor.prototype.toNumber
    }, true) ;
    
    
    // ================ class interface ====================
    function MSCouple(first, second)
    {
        this.firstMember = $ok(first) ? first : null ;
        this.secondMember = $ok(second) ? second : null ;
    }
    
    // ================ constants ====================
    MSTools.defineHiddenConstants(MSCouple.prototype, {
        isa:'Couple',
        length:2 // there is always 2 slots even if one of them or both are null (SHOULD WE KEEP THAT ?)
    }, true) ;
    
    // ================= class methods ===============
    
    // ================  instance methods =============
    MSTools.defineInstanceMethods(MSCouple, {
        toString: function() { return [this.firstMember, this.secondMember].toString() ; },  // the same to string as an array
        isEqualTo: function(other, options) {
            if (this === other) { return true ; }
            return $ok(other) && this.isa === other.isa && $equals(this.firstMember, other.firstMember, options) && $equals(this.secondMember, other.secondMember, options)? true : false ;
        },
        toArray: function() { return [this.firstMember, this.secondMember] ; },
        toMSTE: function(encoder) {
            if (encoder.shouldPushObject(this)) {
                var v, i, count = this.length ;
                encoder.push(32) ;
                encoder.encodeObject(this.firstMember) ;
                encoder.encodeObject(this.secondMember) ;
            }
        }
    }, true) ;
    
    if (MSTools.degradedMode) {
        MSTools.defineInstanceMethods(Array, {
            toInt:function() { return this.toNumber().toInt() ; },
            toUInt:function(base) { return this.toInt().toUInt() ; }
        }) ;
    }
    
    // ================ MSTE Singleton ====================
    /* global MSData, MSColor, MSNaturalArray, MSCouple, MSDate */
    
    MSTools.MSTE = {
        isa:'MSTE',
        toMSTE:function(encoder) { encoder.encodeException(this) ; },
        CONSTANTS:[null, true, false, String.EMPTY_STRING, Date.DISTANT_PAST, Date.DISTANT_FUTURE, MSData.EMPTY_DATA],
        ENGINES:[
            {
                states:[
                    0,        1,        2,        106,    106,
                    106,    108,    109,    100,    9,
                    110,    110,    110,    110,    110,
                    110,    110,    110,    110,    110,
                    102,    103,    105,    107,    4,
                    5,        3,        9
                ],
                codeNames:[
                    'null', 'true', 'false', 'I-DECIMAL', 'F-DECIMAL',
                    'STRING', 'DATE', 'COLOR', 'DICT', '#REF',
                    'CHAR', 'UCHAR', 'SHORT', 'USHORT', 'INT32',
                    'UINT32', 'INT64', 'UINT64', 'FLOAT', 'DOUBLE',
                    'ARRAY', 'NATURALS', 'COUPLE', 'DATA', 'DISTANT_PAST',
                    'DISTANT_FUTURE', 'EMPTY_STRING', '#WEAK_REF'
                ],
                classCode:50,
                getClassIndex:function(code) { return $div(code - 50,2) ;},
                validCode:function(code) { return (code > 27 && code < 50) || code < 0 ? false : true ; },
                version:0x0101
            },
            {
                states:[
                    0,        1,      2,      3,      6,
                    -100,  -100,   -100,   -100,      9,
                    110,    110,    110,    110,    110,
                    110,    110,    110,    110,    110,
                    106,    106,    108,    111,    109,
                    107,    103,   -100,   -100,   -100,
                    100,    102,    105
                ],
                codeNames:[
                    'null', 'true', 'false', 'EMPTY_STRING', 'EMPTY_DATA',
                    '** CODE5 **', '** CODE6 **', '** CODE7 **','** CODE8 **', '#REF',
                    'CHAR', 'UCHAR', 'SHORT', 'USHORT', 'INT32',
                    'UINT32', 'INT64', 'UINT64', 'FLOAT', 'DOUBLE',
                    'DECIMAL', 'STRING', 'DATE', 'TIMESTAMP', 'COLOR',
                    'DATA', 'NATURALS', '** CODE27 **', '** CODE28 **', '** CODE29 **',
                    'DICT', 'ARRAY', 'COUPLE'
                ],
                classCode:50,
                getClassIndex:function(code) { return code - 50 ;},
                validCode:function(code) { return code < 0 || (code > 4 && code < 9) || (code > 26 && code < 30) || (code > 32 && code < 50) ? false : true ; },
                version:0x0102
            }
        ]
    } ;
    
    // ================ decoder class interface ====================
    MSTools.MSTE.Decoder = function(options) {
        this.isa = 'MSTEDecoder' ;
        this.keys = [] ;
        this.tokens = [] ;
        this.classes = [] ;
        this.objects = [] ;
        this.index = 0 ;
        this.correspondances = null ;
        this.supportedVersions = [] ;
        this.root = null ;
    
        for (var i = 0 ; i < MSTools.MSTE.ENGINES.length ; i++) {
            this.supportedVersions.push(MSTools.MSTE.ENGINES[i].version) ;
        }
        if ($ok(options)) {
            this.correspondances = options.classes ;
            this.checkCRC = !!options.crc;
        }
    } ;
    
    // ================  decoder instance methods =============
    MSTools.defineInstanceMethods(MSTools.MSTE.Decoder, {
        parse:function(source) {
            var v, n, i, cn, kn, a ;
    
            this.tokens = [] ;
            this.keys = [] ;
            this.classes = [] ;
            this.objects = [] ;
            this.index = 0 ;
    
            if (typeof source === "string") {
                a = JSON.parse(source) ;
            } else {
                a = source;
            }
    
    
            n = $length(a) ;
            if (n < 4) { throw new Error("Unable to decode MSTE Source : two few tokens") ; }
    
            this.count = a[1].toUInt() ;
            if (this.count !== n ) { throw new Error("Unable to decode MSTE Source : bad control count") ;}
    
            v = a[0] ;
            if (!v.hasPrefix('MSTE') || (v = this.supportedVersions.indexOf(parseInt(v.slice(4),16))) === -1) {
                throw new Error("Unable to decode MSTE Source : bad version "+this.tokens[0]) ;
            }
    
            this.engine = MSTools.MSTE.ENGINES[v] ;
    
            //console.log('version = MSTE'+this.engine.version.toHexa(4)) ;
    
            this.crc = a[2] ;
            if (this.checkCRC) {
                var crc = "CRC" + MSTools.crc32(source.replace(this.crc, "CRC00000000")).toHexa(8).toUpperCase();
                if (crc !== this.crc) {
                    throw new Error("Unable to decode MSTE source: crc doesn't match " + crc + " != " + this.crc);
                }
            }
    
            cn = a[3].toUInt() ;
            if (5 + cn > n) { throw new Error("Unable to decode MSTE Source : not enough tokens to store classes and a stream") ;}
            for (i = 0 ; i < cn ; i++) { this.classes[i] = a[4+i] ; }
    
            kn = a[4+cn].toUInt() ;
            if (6 + cn + kn > n) { throw new Error("Unable to decode MSTE Source : not enough tokens to store a stream") ;}
    
            for (i = 0 ; i < kn ; i++) { this.keys[i] = a[5+cn+i] ; }
    
            this.tokens = a ;
            this.index = 5+cn+kn ;
    
            this.decodeStream() ;
    
            return this.root ;
        },
    /*
    
            This is a brand new version of MSTE Reading.
            It is multi-version compatible and don't use recursive functions
            (we want to preserve the javascript stack)
    
            states        description
            -2              code reading after a dictionary key was read
            -1            code reading
    
            0..4        Constants
    
            9            reference of an object
    
            100            dictionary reading initialization
            101            read dictionary key of key-value couple
            102            array reading initialization
            103            MSNaturalArray reading initialization
            104            MSNaturalArray naturals reading
            105            Couple reading initialization
            106            String or Decimal number reading
            107            Base 64 data reading
            108            Date reading
            109            Color reading
            110            Simple (non referenced) numbers
            111            Time stamp reading
    
            c             descriptions
    */
        decodeStream:function() {
            var a = this.tokens, i = this.index, n = this.count, count, index ;
            var code, state = -1, futureClass = null, FutureConstructor = null ;
            var k, constants = MSTools.MSTE.CONSTANTS, clen = constants.length ;
            var stack = [], value, currentState = this, futureState = null, hasValue = false ;
            var engine =  this.engine ;
    
            currentState = {s:0, i:0, n:1, k:'root', o:this} ;
            stack.push(currentState) ;
    
            function dst(v) { return $ok(v) ? ($length(v.isa) ? v.isa : typeof v) : (typeof v === 'undefined' ? 'undefined' : 'NULL') ; }
    
            while (i < n) {
                futureState = null ;
                hasValue = false ;
                //console.log('---- MSTE automat state : '+state+' stack depth : '+stack.length+'--------------------------') ;
                //console.log('     index = '+i+', token ['+a[i]+']') ;
                switch(state) {
                    case -2: // token code reading after a dictionary key was read
                    case -1: // token code reading
                        if ($ok(currentState.nextState)) {
                            //console.log('changing state from -1 to '+currentState.nextState) ;
                            state = currentState.nextState ;
                            currentState.nextState = null ;
                            continue ;
                        }
                        futureClass = null ;
                        code = a[i++] ;
                        if (!engine.validCode(code)) {
                            throw new Error("Unable to decode MSTE token with code "+code);
                        }
                        else if (code >= engine.classCode) {
                            futureClass = this.classes[engine.getClassIndex(code)] ;
                            FutureConstructor = null ;
                            if (futureClass) {
                                if (this.correspondances) { FutureConstructor = this.correspondances[futureClass] ; }
                            }
                            //console.log('Found a class named <'+futureClass+'>') ;
                            state = 100 ;
                            // TODO using future constructor and future class
                            // with this linearized version it's highly complicated to change already referenced objects...
                        }
                        else {
                            //console.log('     did read code '+code+' ('+engine.codeNames[code]+')') ;
                            state = engine.states[code] ;
                            if (state >= 0 && state < clen) {
                                value = constants[state] ;
                                //console.log("constant["+state+"]=<"+value+">") ;
                                hasValue = true ;
                                state = -1 ;
                            }
    
                            // Should fix bug where regular Dictionaries were treated as Custom Vars
                            FutureConstructor = null ;
    
                        }
                        break ;
    
                    case 9: // obsolete : compatibility state. weak reference to an object
                        if (a[i] >= this.objects.length) {
                            throw new Error("Referenced object " + a[i] + " is out of bounds [0, " + this.objects.length + "[");
                        }
                        value = this.objects[a[i++]] ;
                        hasValue =  true ;
                        state = -1 ;
                        break ;
    
                    case 100: // dictionary reading initialization
                        count = a[i++] ;
                        if (typeof FutureConstructor === 'function') {
                            value = new FutureConstructor() ;
                            //console.log("did define a new object of class "+ value.isa) ;
                        }
                        else {
                            //console.log("Registering new dictionary as "+this.objects.length+"nth object") ;
                            value = {} ;
                        }
                        hasValue = true ;
                        index = this.objects.length ;
                        this.objects.push(value) ;
                        if (count > 0) {
                            futureState = {s:0, i:0, n:count, o:value, index:index} ;
                            state = 101 ;
                        }
                        else { state = -1 ; }
                        break ;
    
                    case 101: // read dictionary key
                        currentState.k = this.keys[a[i++]] ; // the key is a string
                        //console.log('     did read key \"'+currentState.k+'\"') ;
                        state = -2 ;
                        break ;
    
                    case 102: // array reading initialization
                        count = a[i++] ;
                        value = [] ;
                        //console.log("Registering new Array as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        hasValue = true ;
                        if (count > 0) { futureState = {s:1, i:0, n:count, o:value} ; }
                        state = -1 ;
                        break ;
    
                    case 103: // naturals array reading initialization
                        count = a[i++] ;
                        value = new MSNaturalArray() ;
                        //console.log("Registering new Natural Array as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        hasValue = true ;
                        if (count > 0) {
                            futureState = {s:-1, i:0, n:count, o:value} ;
                            state = 104 ;
                        }
                        else { state = -1 ; }
                        break ;
    
                    case 104: // contents of natural array reading
                        currentState.o.push(a[i++]) ;
                        currentState.i++ ;
                        if (currentState.i === currentState.n) {
                            stack.pop() ;
                            //console.log('      <<<< did pop stack 104') ;
                            currentState = stack.length ? stack[stack.length - 1] : null ;
                            state = -1 ;
                        }
                        break ;
    
                    case 105: // couple reading initialization
                        value = new MSCouple() ;
                        //console.log("Registering new Couple as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        hasValue = true ;
                        futureState = {s:2, i:0, n:2, o:value} ;
                        state = -1 ;
                        break ;
    
                    case 106: // simple string or decimal reading
                        value = a[i++] ;
                        hasValue = true ;
                        //console.log("Registering new object '"+value+"' as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        state = -1 ;
                        break ;
    
                    case 107: // data reading
                        value = MSData.dataWithBase64String(a[i++]) ;
                        hasValue = true ;
                        //console.log("Registering new data '"+value+"' as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        state = -1 ;
                        break ;
    
                    case 108: // true date reading
                        value = new MSDate(a[i++] - MSDate.SecsFrom19700101To20010101) ; // conversion from EPOCH to 01012001 reference point
                        hasValue = true ;
                        //console.log("Registering new date '"+value+"' as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        state = -1 ;
                        break ;
    
                    case 109: // color reading
                        value = new MSColor(a[i++]) ;
                        hasValue = true ;
                        // console.log("Registering new coloe '"+value+"' as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        state = -1 ;
                        break ;
    
                    case 110: // simple numbers (they are not referenced in objects)
                        value = a[i++] ;
                        hasValue = true ;
                        state = -1 ;
                        break ;
    
                    case 111: // TIMESTAMP READING
                        value = 1000 * a[i++] ; // the initial value can be a double
    
                        if (value >= Date.DISTANT_FUTURE_TS) { value = Date.DISTANT_FUTURE_TS ; }
                        else if ( value <= Date.DISTANT_PAST_TS) { value = Date.DISTANT_PAST_TS ; }
    
                        value = Date.dateWithUTCTime(value) ;
                        //console.log("Registering new timestamp '"+value+"' as "+this.objects.length+"nth object") ;
                        this.objects.push(value) ;
                        hasValue = true ;
                        state = -1 ;
                        break ;
    
                    default:
                        //console.log("Bad state encoutered during parsing") ;
                        throw new Error('Bad state encoutered during parsing');
                }
                if (hasValue) {
    
                    switch(currentState.s) {
                        case 0:
                            ////console.log('     dict[\''+currentState.k+'\'] = '+MSTools.stringify(value)) ;
                            //console.log('     dict[\''+currentState.k+'\'] = ' + dst(value));
                            currentState.o[currentState.k] = value ;
                            currentState.nextState = 101 ;
                            break ;
                        case 1:
                            ////console.log('     array['+currentState.i+'] = '+MSTools.stringify(value)) ;
                            //console.log('     array['+currentState.i+'] = ' + dst(value)) ;
                            currentState.o[currentState.i] = value ;
                            break ;
                        case 2:
                            ////console.log('     couple.firstMember = '+MSTools.stringify(value)) ;
                            //console.log('     couple.firstMember = ' + dst(value)) ;
                            currentState.o.firstMember = value ;
                            currentState.s = 3 ;
                            break ;
                        case 3:
                            ////console.log('     couple.secondMember = '+MSTools.stringify(value)) ;
                            //console.log('     couple.secondMember = ' + dst(value)) ;
                            currentState.o.secondMember = value ;
                            break ;
                        default:
                            throw new Error("Bad currentState : "+currentState.s);
                    }
                    currentState.i++ ;
                    if (currentState.i === currentState.n) {
                        stack.pop() ;
                        currentState = stack.length ? stack[stack.length - 1] : null ;
                        /*console.log('      <<<< did pop stack EOL') ;
                        if (currentState) {
                            console.log('      new current state.s = '+currentState.s+', i = '+currentState.i+', n = '+currentState.n+', => '+currentState.nextState) ;
                        }
                        else {
                            console.log('      : stack is empty') ;
                        }*/
                    }
                }
                if (futureState) {
                    stack.push(futureState) ;
                    //console.log('      >>>> did push stack') ;
                    currentState = futureState ;
                    //console.log('      new current state.s = '+currentState.s+', i = '+currentState.i+', n = '+currentState.n+', => '+currentState.nextState) ;
                }
            }
            //console.log('---- MSTE automat final state : '+state+' stack depth : '+stack.length+'--------------------------') ;
            if (state !== -1)    { throw new Error("Bad final state "+state) ; }
            if (stack.length > 0) { throw new Error("Bad final stack with current stack state "+stack.lastObject().s) ; }
        }
    }, true) ;
    
    // ================ coder class interface ====================
    MSTools.MSTE.Encoder = function() {
        this.referenceKey = MSTools.localUniqueID() ;
        this.tokens = ["MSTE0102", 0, "CRC00000000"] ;
        this.stream = [] ;
        this.encodedObjects = [] ;
        this.keyNames = [] ;
        this.keysIndexes = {} ;
        this.classesNames = [] ;
        this.classesIndexes = {} ;
        this.stringsIndexes = {} ;
        this.numbersIndexes = {} ;
        this.isa = 'MSTECoder' ;
    } ;
    
    // ================  coder instance methods =============
    MSTools.defineInstanceMethods(MSTools.MSTE.Encoder,
    {
        shouldPushObject:function(o) {
            var identifier = o[this.referenceKey] ;
    
            if ($ok(identifier)) { this.stream.push(9) ; this.stream.push(identifier) ; return false ;}
    
            identifier = this.encodedObjects.length ;
    
            Object.defineProperty(o, this.referenceKey, {
                enumerable:false,
                configurable:true, // so it could be later deleted
                writable:false,
                value:identifier
            }) ;
            this.encodedObjects[identifier] = o ;
    
            return true ;
        },
        push:function(anItem) { this.stream.push(anItem) ; },
        pushKey:function(aKey) {
            var index = this.keysIndexes[aKey] ;
            if (!$ok(index)) {
                index = this.keyNames.length ;
                this.keyNames[index] = aKey ;
                this.keysIndexes[aKey] = index ;
            }
            this.stream.push(index) ;
        },
        pushClass:function(aClass) {
            var index = this.classesIndexes[aClass] ;
            if (!$ok(index)) {
                index = this.classesNames.length ;
                this.classesNames[index] = aClass ;
                this.classesIndexes[aClass] = index ;
            }
            this.stream.push(50 + index) ;
        },
        pushNumber: function(aNumber) {
            var key = aNumber.toString(32) ; // yeah, less chars with 32 digits
            var index = this.numbersIndexes[key] ;
            if ($ok(index)) {
                this.stream.push(9) ;
                this.stream.push(index) ;
            }
            else {
                index = this.encodedObjects.length ;
                this.numbersIndexes[key] = index ;
                this.encodedObjects[index] = null ; // we don't want to remove a non existant property at the end
                this.stream.push(20) ;
                this.stream.push(aNumber) ;
            }
        },
        pushString: function(aString) {
            var key = aString.length < 64 ? aString : ("0000000" + (aString.hashCode() >>> 0).toString(16)).substr(-8) ;
            var index, array = this.stringsIndexes[key] ;
            if ($ok(array)) {
                var count = array.length, i ;
                for (i = 0 ; i < count ; i++) {
                    if (aString === array[i].string) { break ; }
                }
                if (i < count) {
                    this.stream.push(9) ;
                    this.stream.push(array[i].index) ;
                }
                else {
                    index = this.encodedObjects.length ;
                    array.push({string:aString, index:index}) ;
                    this.encodedObjects[index] = null ; // we don't want to remove a non existant property at the end
                    this.stream.push(21) ;
                    this.stream.push(aString) ;
                }
            }
            else {
                index = this.encodedObjects.length ;
                this.stringsIndexes[key] = [{string:aString, index:index}] ;
                this.encodedObjects[index] = null ; // we don't want to remove a non existant property at the end
                this.stream.push(21) ;
                this.stream.push(aString) ;
            }
        },
        encodeObject:function(o) {
            if ($ok(o)) {
                if (typeof o.toMSTE === 'function') {
                    //console.log('encodeObject:'+o.isa) ;
                    //console.log('--> has MSTE function') ;
                    o.toMSTE(this) ;
                }
                else if (this.shouldPushObject(o)) {
                    var i, count, keys = null, idx, k, v, t, total = 0, customClass = null ;
    
                    //console.log('--> pushed on stack') ;
                    if (typeof o.toMSTEClass === 'function') {
                        customClass = o.toMSTEClass() ;
                        if (typeof customClass === "string" && customClass.length) {
                            this.pushClass(customClass) ;
                        }
                        else { customClass = null ; }
                    }
                    else { this.stream.push(30) ; } // a standard dictionary
    
                    if ((typeof o.msteKeys) === 'function') {
                        keys = o.msteKeys() ;
                    }
    
                    idx = this.stream.length ;
                    this.stream[idx] = 0 ;
    
                    if ((count = $length(keys)) !== 0) {
                        // specific mste loop
                        for (i = 0 ; i < count ; i++) {
                            k = keys[i] ; v = o[k] ; t = typeof v ;
                            if (v === null) {
                                total ++ ;
                                this.pushKey(k) ;
                                this.stream.push(0) ;
                            }
                            else if (t !== 'function' && t !== 'undefined') {
                                total ++ ;
                                this.pushKey(k) ;
                                this.encodeObject(v) ;
                            }
                        }
                    }
                    else {
                        // object standard loop
                        // //console.log('will encode object '+MSTools.stringify(o)) ;
                        for (k in o) {
                            if (o.hasOwnProperty(k)) {
                                v = o[k] ; t = typeof v ;
                                if (v === null) {
                                    total ++ ;
                                    this.pushKey(k) ;
                                    this.stream.push(0) ;
                                }
                                else if (t !== 'function' && t !== 'undefined') {
                                    total ++ ;
                                    this.pushKey(k) ;
                                    this.encodeObject(v) ;
                                }
                            }
                        }
                    }
                    this.stream[idx] = total ;
                }
            }
            else { this.stream.push(0) ; }
        },
        finalizeTokens:function() {
            var i, ret = this.tokens, a = this.classesNames, count = a.length ;
    
            ret.push(count) ;
            for (i = 0 ; i < count ; i++)  { ret.push(a[i]) ; }
    
            a = this.keyNames ; count = a.length ;
            ret.push(count) ;
            for (i = 0 ; i < count ; i++)  { ret.push(a[i]) ; }
    
            a = this.stream ; count = a.length ;
            for (i = 0 ; i < count ; i++)  { ret.push(a[i]) ; }
    
            this.deleteTemporaryIdentifiers() ;
            ret[1] = ret.length ;
    
            return ret ;
        },
        deleteTemporaryIdentifiers:function() {
            var i, a = this.encodedObjects, count = a.length, elem, k = this.referenceKey ;
            for (i = 0 ; i < count ; i++) {
                elem = a[i] ;
                if (elem !== null) { delete elem[k] ; }
            }
            this.stringsIndexes = {} ;
            this.numbersIndexes = {} ;
        },
        encodeException:function(o) { throw new Error("Impossible to encode object of class "+this.className()) ; },
        toMSTE:function(encoder) { encoder.encodeException(this) ; }
    }, true) ;
    
    
    // ================  MSTE methods =============
    MSTools.MSTE.parse = function(source, options) {
        var r = null ;
        if (!$length(source)) {
            throw new Error("MSTE source string is empty");
        }
        var decoder = new MSTools.MSTE.Decoder(options) ;
        return decoder.parse(source) ;
    } ;
    
    MSTools.MSTE.tokenize = function(rootObject) {
        var encoder = new MSTools.MSTE.Encoder(), r = null ;
        try {
            encoder.encodeObject(rootObject) ;
            r = encoder.finalizeTokens() ;
        }
        finally {
            encoder.deleteTemporaryIdentifiers() ;
        }
        return r ;
    } ;
    
    MSTools.MSTE.stringify = function(rootObject) {
        var s = MSTools.stringify(this.tokenize(rootObject));
        var crc = MSTools.crc32(s).toHexa(8).toUpperCase();
        return s.replace("CRC00000000", "CRC" + crc);
    } ;

    /*
        This file is a direct copy with some modifications of a part of the file    json2.js form M. Crockford. Thanks to him to release that as public domain.
        Obviously we keep it public domain here
    */
    
    (function () {
    
        // escapable was modified from initial json2.js in order to escape all control characters and all characters with diacritics signs
        var escapable = /[\\\"\x00-\x1f\u007f-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b' : '\\b',
                '\t' : '\\t',
                '\n' : '\\n',
                '\f' : '\\f',
                '\r' : '\\r',
                '\"' : '\\"',
                '\/' : '\\/',
                '\\' : '\\\\'
            },
            rep;
    
        function quote(str) {
    
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
            escapable.lastIndex = 0;
            return escapable.test(str) ? '"' + str.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + str + '"';
        }
    
    
        function str(key, holder) {
    
    // Produce a string from holder[key].
    
            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    
            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
    
    // What happens next depends on the value's type.
    
            switch (typeof value) {
            case 'string':
                return quote(value);
    
            case 'number':
    
    // JSON numbers must be finite. Encode non-finite numbers as null.
    
                return isFinite(value) ? String(value) : 'null';
    
            case 'boolean':
            case 'null':
    
    // If the value is a boolean or null, convert it to a string. Note:
    // typeof null does not produce 'null'. The case is included here in
    // the remote chance that this gets fixed someday.
    
                return String(value);
    
    // If the type is 'object', we might be dealing with an object or an array or
    // null.
    
            case 'object':
    
    // Due to a specification blunder in ECMAScript, typeof null is 'object',
    // so watch out for that case.
    
                if (!value) {
                    return 'null';
                }
    
    // Make an array to hold the partial results of stringifying this object value.
    
                gap += indent;
                partial = [];
    
    // Is the value an array?
    
                if (value.isArray || Object.prototype.toString.apply(value) === '[object Array]') {
    
    // The value is an array. Stringify every element. Use null as a placeholder
    // for non-JSON values.
    
                    length = value.length;
    //console.log("THE RECURSIVE FUNCTION str KEEPS CALLING ITSELF HERE");
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
    
    // Join all of the elements together, separated with commas, and wrap them in
    // brackets.
    
                    v = partial.length === 0 ? '[]'
                        : (gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']');
                    gap = mind;
                    return v;
                }
    
    // If the replacer is an array, use it to select the members to be stringified.
    
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
    
    // Otherwise, iterate through all of the keys in the object.
    
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
    
    // Join all of the member texts together, separated with commas,
    // and wrap them in braces.
    
                v = partial.length === 0 ? '{}'
                    : (gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}') ;
                gap = mind;
                return v;
            }
        }
    
    // If the JSON object does not yet have a stringify method, give it one.
    
        if (typeof MSTools.stringify !== 'function') {
            MSTools.stringify = function (value, replacer, space) {
    
    // The stringify method takes a value and an optional replacer, and an optional
    // space parameter, and returns a JSON text. The replacer can be a function
    // that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided. Use of the space parameter can
    // produce text that is more easily readable.
    
                var i;
                gap = '';
                indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
    
    // If the space parameter is a string, it will be used as the indent string.
    
                } else if (typeof space === 'string') {
                    indent = space;
                }
    
    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    
                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                        typeof replacer.length !== 'number')) {
                    throw new Error('MSTools.stringify');
                }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    
                return str('', {'': value});
            };
        }
    
    }());
    
    
    MSTools.fusion = function(template, object, sepa) {
        var l ;
        function _fswt(str, object) {
            var regex = /\{\{([a-zA-Z0-9.]+)\}\}/gi, result, lastPos = 0, s = "" ;
            while ((result = regex.exec(str)) ) {
                var pos = result.index, len = result[0].length, path = str.slice(pos+2, pos+len-2), v ;
                if (pos > 0) { s += str.slice(lastPos, pos) ; }
                v = MSTools.valueForPath(object, path) ;
                if ($ok(v)) { s += v ; }
                lastPos = pos+len ;
            }
            s += str.slice(lastPos) ;
            return s ;
        }
    
        if ((l = $length(template)) > 0) {
            if (template.isa === 'String') { return _fswt(template, object) ; }
            else if (template.isa === 'Array') {
                var i, array = [] ;
                sepa = sepa || '\n' ;
                for (i = 0 ; i < l ;i++) { array.push(_fswt(template[i], object)) ; }
                return array.join(sepa) ;
            }
        }
        return '' ;
    } ;
    
    


    MSTools.makeGlobal = function(g) {
        if (!g && typeof window === "object") { g= window; }
        if (!g && typeof global === "object") { g= global; }
        g.MSTools = MSTools;
        g.$ok = $ok;
        g.$length = $length;
        g.$div = $div;
        g.$equals = $equals;
        g.$type = $type;
        g.MSColor = MSColor;
        g.MSDate = MSDate;
        g.MSArray = MSArray;
        g.MSData = MSData;
        g.MSNaturalArray = MSNaturalArray;
        g.MSCouple = MSCouple;
    };
    MSTools.makeGlobal(MSTools);

    if ( typeof define === "function" && define.amd ) { // with AMD module
        define( "MSTools", [], function() {
            return MSTools;
        });
    }
    else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = MSTools;
    }
    else {  // if no AMD module
        MSTools.makeGlobal(window);
    }
})();
