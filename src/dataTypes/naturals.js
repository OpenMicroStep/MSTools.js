// ================ class interface ====================
/* jshint latedef:false */

MSTools.subclass(MSNaturalArray, Array, 'NaturalArray') ;

function MSNaturalArray()
{
    var i, count = arguments.length ;

    if (count === 0) { Array.call(this) ; }
    else if (count === 1) {
        var a = arguments[0], v, l ;
        switch(a.isa) {
            case 'Number':
                Array.call(this, a) ;
                break ;

            case 'String':
                if ((count = a.length) === 0) { Array.call(this) ; break ; }
                Array.call(this, count) ;
                for (i = 0 ; i < count ; i++) { this.push(a.charCodeAt(i)) ; }
                break ;

            default:
                if (a.isArray) {
                    if ((count = a.length) === 0) { Array.call(this) ; break ; }
                    Array.call(this, count) ;
                    for (i = 0 ; i < count ; i++) {
                        Array.prototype.push.call(this, a[i].toUInt()) ;
                    }
                    break ;
                }
                throw "Impossible to create a natural array with argument "+a ;
        }
    }
    else {
        Array.call(this, count) ;
        for (i = 0 ; i < count ; i++) { this.push(arguments[i]) ; }
    }
}


/* jshint latedef:true */

// ================ constants ====================

// ================= class methods ===============

// ================  instance methods =============
MSTools.defineInstanceMethods(MSNaturalArray, {
    push: function() {
        var o, i, count = arguments.length ;
        //console.log('push arguments ='+arguments.length) ;
        for (i = 0 ; i < count ; i++) {
            o = arguments[i] ;
            o = $ok(o) ? o.toUInt() : 0 ;
            if ($ok(o)) { Array.prototype.push.call(this, o) ; }
        }
    },
    unshift: function() {
        var count = arguments.length ;
        if (count) {
            var i, a = new Array(count) ;
            for (i = 0 ; i < count ; i++) { a[i] = arguments[i].toUInt() ; }
            Array.prototype.unshift.apply(this, a) ; // unshift
        }
        return this.length ;
    },
    // TODO: concat
    // TODO: slice
    // TODO: splice
    toMSTE: function(encoder) {
        if (encoder.shouldPushObject(this)) {
            var v, i, count = this.length ;
            encoder.push(25) ;
            encoder.push(count) ;
            for (i = 0 ; i < count ; i++) {
                v = this[i].toUInt() ;
                encoder.encodeObject(this[i].toUInt()) ; // we want to be sure we encode unsigneds
            }
        }
    }
}, true) ;