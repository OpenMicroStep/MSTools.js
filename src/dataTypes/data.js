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
    initWithBase64String: function(s, index, paddingChar) {
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
        if (this.length === 0) { encoder.push(6) ; }
        else if (encoder.shouldPushObject(this)) {
            encoder.push(25) ;
            encoder.push(this.toBase64String()) ;
        }
    }
}, true) ;
