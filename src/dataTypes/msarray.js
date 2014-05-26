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

