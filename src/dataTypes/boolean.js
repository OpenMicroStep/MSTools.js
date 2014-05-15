// ================ constants ====================
MSTools.defineHiddenConstant(Boolean.prototype,'isa', 'Boolean', true) ;

// ================= class methods ===============


// ================  instance methods =============
MSTools.defineInstanceMethods(Boolean, {
    toInt: function() { return this ? 1 : 0 ; },
    toUInt: function() { return this ? 1 : 0 ; },
    toJSON: function(key) { return this.valueOf(); }
}) ;

MSTools.defineInstanceMethods(Boolean, {
    toMSTE: function(encoder) { encoder.push(this ? 1 : 2 ) ; }
}, true) ;
