// ================ constants ====================
MSTools.defineHiddenConstant(Math.prototype, 'isa', 'Math', true) ;
// ================= class methods ===============

// ================  instance methods =============
MSTools.defineInstanceMethods(Math, {
    toMSTE: function(encoder) { encoder.encodeException(this) ; }
}, true) ;
