
// ================ class interface ====================
function MSNaturalArray() {
    var a, ret = [], i, count = arguments.length ;
    var localConstructor = this.constructor ;

    //console.log("MSNaturalArray array push (2) = "+localConstructor.prototype.push) ;
    Object.setPrototypeOf(ret, localConstructor.prototype) ;

    //console.log('wanted to create a new MSNaturalArray with arguments :') ;
    for (i = 0 ; i < count ; i++) {
        a = arguments[i] ;
        //console.log('arguments['+i+']=<'+a+'> ('+(typeof a)+')') ;
        if ($ok(a) && a.isArray) { localConstructor.prototype.push.apply(ret, a) ; }
        else { ret.push(a) ; }
    }
    return ret ;
}

MSNaturalArray.prototype = Object.create(Array.prototype, { constructor: {value: MSNaturalArray} });

// ================ constants ====================
MSTools.defineHiddenConstant(MSNaturalArray.prototype,'isa', 'Naturals', true) ;

// ================= class methods ===============

// ================  instance methods =============
MSTools.defineInstanceMethods(MSNaturalArray, {
    objectAtIndex: function(i) {
        var v = this[i] ;
        return $ok(v) ? v.toUInt() : 0 ;
    },
    push: function() {
        var o, i, count = arguments.length ;
        //console.log('MSNaturalArray push with '+arguments.length+' args.') ;
        for (i = 0 ; i < count ; i++) {
            o = arguments[i] ;
            o = $ok(o) ? o.toUInt() : 0 ;
            if ($ok(o)) { Array.prototype.push.call(this, o) ; }
        }
    },
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
    toMSTE: function(encoder) {
        if (encoder.shouldPushObject(this)) {
            var v, i, count = this.length ;
            encoder.push(25) ;
            encoder.push(count) ;
            for (i = 0 ; i < count ; i++) {
                encoder.encodeObject(this.objectAtIndex(i)) ; // we want to be sure we encode the right objects
            }
        }
    }
}, true) ;



