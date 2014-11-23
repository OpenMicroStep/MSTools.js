// ================ constants ====================
MSTools.defineHiddenConstant(Math.prototype, 'isa', 'Math', true) ;
// ================= class methods ===============

// ================  instance methods =============
MSTools.defineInstanceMethods(Math, {
    toNumber:function() { return NaN ; },
    toInt:function() { return NaN ; },
    toUInt:function(base) { return NaN ; },
    toMSTE: function(encoder) { encoder.encodeException(this) ; }
}, true) ;
