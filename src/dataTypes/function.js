// ================ constants ====================
MSTools.defineHiddenConstant(Function.prototype, 'isa', 'Function', true) ;

// ================= class methods ===============

// ================  instance methods =============
MSTools.defineInstanceMethods(Function, {
    toMSTE: function(encoder) { encoder.encodeException(this) ; },
    toNumber:function() { return NaN ; },
    toInt:function() { return NaN ; },
    toUInt:function(base) { return NaN ; }
}, true) ;

if (MSTools.degradedMode) {
    MSTools.defineInstanceMethods(String, {
        isEqualTo: function(other, options) { return this === other ? true : false ; },
        toArray: function() { return [this] ; }
    }) ;
}
