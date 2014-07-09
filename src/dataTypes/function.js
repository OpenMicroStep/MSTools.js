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
