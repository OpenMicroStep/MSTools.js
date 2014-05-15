// ================ constants ====================
MSTools.defineHiddenConstant(Function.prototype, 'isa', 'Function', true) ;

// ================= class methods ===============

// ================  instance methods =============
MSTools.defineInstanceMethods(Function, {
    toMSTE: function(encoder) { encoder.encodeException(this) ; }
}, true) ;
