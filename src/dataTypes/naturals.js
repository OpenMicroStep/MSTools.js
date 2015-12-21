
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



