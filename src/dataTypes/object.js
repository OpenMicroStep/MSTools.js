// ================ constants ====================
// should we define object isa ?

// ================= class methods ===============
MSTools.defineMethods(Object,{
    /* jshint proto:true */
    setPrototypeOf: function(obj, proto) { obj.__proto__ = proto ; },
    getPrototypeOf: function(obj) { return obj.__proto__ ; }
    /* jshint proto:false */
}) ;

// ================  instance methods =============

if (!Ext) {	
	// if you want use valueForPath() on objects with Ext.js, try MStools.valueForPath() function
	MSTools.defineInstanceMethods(Object, {
	    isEqualTo: function(other, options) { return this === other ? true : false ; }
	}) ;
	MSTools.defineInstanceMethods(Object, {
	    valueForPath:function(path) { return MSTools.valueForPath(this, path) ; },
	    toInt:function() { return this.toNumber().toInt() ; },
	    toArray: function() { return [this] ; },
	    toUInt:function(base) { return this.toInt().toUInt() ; }
	}, true) ;
}
