// ================ constants ====================
MSTools.defineHiddenConstant(Boolean.prototype,'isa', 'Boolean', true) ;

// ================= class methods ===============


// ================  instance methods =============
MSTools.defineInstanceMethods(Boolean, {
    toInt: function() { return this ? 1 : 0 ; },
    toUInt: function() { return this ? 1 : 0 ; },
    isEqualTo: function(other, options) {
        if (this === other) { return true ; }
        return $ok(other) && this.isa === other.isa && ((other && this) || (!(other) && !(this))) ? true : false ;
    },
    toJSON: function(key) { return this.valueOf(); }
}) ;

MSTools.defineInstanceMethods(Boolean, {
    toMSTE: function(encoder) { encoder.push(this ? 1 : 2 ) ; }
}, true) ;

if (Ext) {	
	MSTools.defineInstanceMethods(String, {
	    toArray: function() { return [this] ; }
	}) ;
}
