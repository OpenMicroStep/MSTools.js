// ================ constants ====================
MSTools.defineHiddenConstants(Array.prototype, {
    isa:'Array',
    isArray:true
}, true) ;

// ================= class methods ===============

// ================  private function in MSTools scope =============
function _sortedIndexOf(self, item, n0, nb) {
    var min = n0, mid, max = nb - 1 ;
    while (min < max) {
        mid = $div(min + max, 2) ;
        if (item <= self[mid]) { max = mid ; }
        else { min = mid + 1; }
    }
    return min ;
}

// ================  instance methods =============
MSTools.defineInstanceMethods(Array, {
    indexOf:function(item, fromIndex) {
        var l = this.length ;
        if (!$ok(fromIndex) || (fromIndex | 0) < 0) { fromIndex = 0 ; }
        /* jshint eqeqeq:false */
        for (var i = fromIndex | 0 ; i < l ; i++) { if (this[i] == item) { return i ; }}
        /* jshint eqeqeq:true */
        return -1;
    },
    lastIndexOf:function(item, fromIndex) {
        var i = this.length ;
        if ($ok(fromIndex) && (fromIndex | 0) < i) { i = 1 + (fromIndex | 0) ; }
        /* jshint eqeqeq:false */
        while (i-- > 0 ) { if (this[i] == item) { return i ; }}
        /* jshint eqeqeq:true */
        return -1;
    },
    indexOfIdentical:function(item, fromIndex) {
        var l = this.length ;
        if (!$ok(fromIndex) || (fromIndex | 0) < 0) { fromIndex = 0 ; }
        for (var i = fromIndex | 0; i < l; i++) { if (this[i] === item) { return i ; }}
        return -1 ;
    },
    lastIndexOfIdentical:function(item, fromIndex) {
        var i = this.length ;
        if ($ok(fromIndex) && (fromIndex | 0) < i) { i = 1 + (fromIndex | 0) ; }
        while (i-- > 0 ) { if (this[i] === item) { return i ; }}
        return -1;
    },
    contains:function(item) { return this.indexOf(item) !== -1 ; },
    containsIdentical:function(item) { return this.indexOfIdentical(item) !== -1 ; },
    isEqualTo: function(other, options) {
        var i, count ;
        if (this === other) { return true ; }
        if (!$ok(other) || this.isa !== other.isa || (count = this.length) !== other.length) { return false ; }
        for (i = 0 ; i < count ; i++) { if (!$equals(this[i], other[i], options)) { return false ; } }
        return true ;
    },
    sortedIndexOf:function(item) {
        // this works only if your array is sorted
        if (this.length === 0) { return 0 ; }
        return _sortedIndexOf(this, item, 0, this.length) ;
    },
    addSorted:function(item) {
        // this works only if your array is already sorted
        var i = this.length ;
        if (i === 0 || item > this[i - 1]) {
            this.push(item) ;
            return i ;
        }
        i = _sortedIndexOf(this, item, 0, i) ;
        if (item < this[i]) { this.splice(i,0, item) ; return i ; }
        return -1 ;
    },
    minimum:function() {
        var r, i, l = this.length ;
        if (l > 0) {
            r = this[0] ;
            for (i = 1 ; i < l ; i++) { if (this[i] < r) { r = this[i] ;}}
            return r ;
        }
        return null ;
    },
    maximum:function() {
        var r, i, l = this.length ;
        if (l > 0) {
            r = this[0] ;
            for (i = 1 ; i < l ; i++) { if (this[i] > r) { r = this[i] ;}}
            return r ;
        }
        return null ;
    },
    firstObject:function() { return this.length ? this[0] : null ; },
    lastObject:function() { return this.length ? this[this.length - 1] : null ;},
    objectAtIndex:function(i) { return this[i] ; }
    // TODO : a reduce function for old browsers ?
}) ;

MSTools.defineInstanceMethods(Array, {
    toArray: function() { return Array.prototype.slice.call(this,0) ; },
    toMSTE: function(encoder) {
        if (encoder.shouldPushObject(this)) {
            var i, count = this.length ;
            encoder.push(encoder.version > 0x0101 ? 31 : 20) ;
            encoder.push(count) ;
            for (i = 0 ; i < count ; i++) { encoder.encodeObject(this.objectAtIndex(i)) ; }
        }
    },
    toInt:function() { return NaN ; },
    toUInt:function(base) { return NaN ; }
}, true) ;

if (MSTools.degradedMode) {
    MSTools.defineInstanceMethods(Array, {
        toNumber:function() { return NaN ; }
    }) ;
}
