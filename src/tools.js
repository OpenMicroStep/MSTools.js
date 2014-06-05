var __localUniqueID = 0 ;
MSTools.localUniqueID = function() { return '$mst'+ (++__localUniqueID) ; } ;

function __recursiveValueForPath(object, path) {
    if ($ok(object) && $ok(path)) {
        var p = path.toString() ;
        if ($length(p)) {
            var res ;
            var pos = p.indexOf('.') ;
            if (pos === -1) {
                res = object[p] ;
                if (res && (typeof res) === 'function') { res = res.call(object) ; }
                return res ;
            }
            else if (pos > 1 && pos + 1 < p.length) {
                res = object[p.slice(0, pos)] ;
                if (res) {
                    if (typeof res === 'function') { res = res.call(object) ; }
                    res =  __recursiveValueForPath(res, p.slice(pos+1)) ;
                }
            }
            if ((typeof res) === 'undefined') { return null ; }
            return res ;
        }
    }
    return null ;
}

function __prepareCRCTable() {
    var c, n, k, ret = [];
    for(n = 0 ; n < 256 ; n++) {
        c = n;
        for (k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)) ;
        }
        ret[n] = c;
    }
    return ret ;

}

MSTools.isa = 'MSTools' ;
MSTools.toMSTE = function(encoder) { encoder.encodeException(this) ; } ;

// do we define Object.prototype.isa as 'Object' ?

MSTools.valueForPath = __recursiveValueForPath ;


MSTools.__CRCTable = __prepareCRCTable() ;

MSTools.crc32 = function(self, byteAtIndexFn) {
    var crc = 0 ^ -1;
    if ($ok(self)) {
        if (typeof byteAtIndexFn !== 'function') {
            byteAtIndexFn = self.constructor.prototype.byteAtIndex ;
        }
        if (typeof byteAtIndexFn === 'function') {
            var i, length = self.length, crcTable = MSTools.__CRCTable ;
            for (i = 0; i < length; i++ ) {
                crc = (crc >>> 8) ^ crcTable[(crc ^ byteAtIndexFn.call(self, i)) & 0xff];
            }
        }
    }
    return (crc ^ -1) >>> 0 ;
} ;

