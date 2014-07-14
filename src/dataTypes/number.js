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
    toJSON: function (key) { return this ; }
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
