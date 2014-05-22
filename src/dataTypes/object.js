// ================ constants ====================
// should we define object isa ?

// ================= class methods ===============


// ================  instance methods =============
MSTools.defineInstanceMethods(Object, {
    isEqualTo: function(other, options) { return this === other ? true : false ; }
}) ;

MSTools.defineInstanceMethods(Object, {
    className:function() { return $length(this.isa) ? this.isa : (typeof this) ; },
    valueForPath:function(path) { return MSTools.valueForPath(this, path) ; },
    toInt:function() { return this.toNumber().toInt() ; },
    toUInt:function(base) { return this.toInt().toUInt() ; }
}, true) ;
