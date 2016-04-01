// MSArray is a generic array subclass designed to be subclassed
// MSNaturalArray and MSData are both subclasses of MSArray

// ================ class interface ====================

// with this constructor a new MSArray(10) creates a data with number 10 at position 0
// any array passed as an argument will be concatenated


function MSArray() {
    var a, i, count = arguments.length ;
    for (i = 0 ; i < count ; i++) {
        a = arguments[i] ;
        if ($ok(a) && a.isArray) { Array.prototype.push.apply(this, a) ; }
        else { this.push(a) ; }
    }
}

MSArray.prototype = Object.create(Array.prototype, { constructor: {value: MSArray} });

// ================ constants ====================

// ================= class methods ===============

// ================  instance methods =============

MSTools.defineInstanceMethods(MSArray, {
    unshift: function() {
        var count = arguments.length ;
        if (count) {
            var tmp = new this.constructor();
            tmp.push.apply(tmp, arguments);
            return Array.prototype.unshift.apply(this, tmp);
        }
        return this.length ;
    },
    concat: function() {
        var ret = new this.constructor();
        var a, i, count = arguments.length ;
        ret.push.apply(ret, this) ;
        for (i = 0 ; i < count ; i++) {
            a = arguments[i] ;
            if ($ok(a) && a.isArray) { ret.push.apply(ret, a) ; }
            else { ret.push(a) ; }
        }
        return ret ;
    },
    slice: function(start, end) {
        var ret = new this.constructor();
        var count = this.length;
        if (start === void 0) { start = 0; }
        else if (start < 0) { start = count - start; }
        if (end === void 0) { end = count; }
        else if (end < 0) { end = count - end; }
        while (start < end) {
            ret.push(this[start++]);
        }
        return ret ;
    },
    splice: function(start, deleteCount) {
        var ret = new this.constructor();
        var args = [start, deleteCount];
        var count = arguments.length;
        if (count > 2) {
            var tmp = new this.constructor();
            for (var i = 2; i < count; i++) {
                tmp.push(arguments[i]);
                args.push(tmp[i - 2]);
            }
        }
        ret.push.apply(ret, Array.prototype.splice.apply(this, args));
        return ret ;
    },
    filter: function() {
        var ret = new this.constructor();
        ret.push.apply(ret, Array.prototype.filter.call(this, arguments));
        return ret ;
    }
}, true) ;

