// ================ constants ====================
// should we define object isa ?

// ================= class methods ===============
/* jshint proto:true */
if (!Object.setPrototypeOf) {
    if ("".__proto__) { // Not IE < 11
        MSTools.defineMethods(Object,{
            setPrototypeOf: function(obj, proto) { obj.__proto__ = proto ; },
        }) ;
    }
    else if (console.warn) {
        console.warn("No available polyfill for Object.getPrototypeOf (IE < 11 ?)");
    }
}
if (!Object.getPrototypeOf) {
    if ("".__proto__) { // Not IE < 11
        MSTools.defineMethods(Object,{
            getPrototypeOf: function(obj) { return obj.__proto__ ; }
        }) ;
    }
    else if (console.warn) {
        console.warn("No available polyfill for Object.getPrototypeOf (IE < 9 ?)");
    }
}
/* jshint proto:false */

// ================  instance methods =============

if (!MSTools.degradedMode) {
    // if you want use valueForPath() on objects with Ext.js, try MStools.valueForPath() function
    MSTools.defineInstanceMethods(Object, {
        isEqualTo: function(other, options) { return this === other ? true : false ; }
    }) ;
    MSTools.defineInstanceMethods(Object, {
        valueForPath:function(path) { return MSTools.valueForPath(this, path) ; },
        toNumber:function() { return NaN ; },
        toInt:function() { return this.toNumber().toInt() ; },
        toArray: function() { return [this] ; },
        toUInt:function(base) { return this.toInt().toUInt() ; }
    }, true) ;
}
