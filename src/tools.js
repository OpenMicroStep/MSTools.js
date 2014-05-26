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

MSTools.isa = 'MSTools' ;
MSTools.toMSTE = function(encoder) { encoder.encodeException(this) ; } ;

// do we define Object.prototype.isa as 'Object' ?

MSTools.valueForPath = __recursiveValueForPath ;

MSTools.sliceInto = function(r, start, end) {
    if (!$ok(start)) { start = 0 ; }
    if (!$ok(end)) { end = this.length ; }
    if (start < 0) { start = this.length + start ; }
    if (end < 0) { end = this.length + start ; }
    if (start < 0) { start = 0 ;}
    if (end > this.length) { end = this.length ; }

    for (;start < end;start++) { r.push(this[start]) ; }
} ;

MSTools.concatInto = function(r, args) {
    var i, count = args.length ;
    function _addData(d, s) {
        var i, count = s.length ;
        for (i = 0 ; i < count ; i++) { d.push(s[i]) ; }
    }
    for (i = 0 ; i < count ; i++) { _addData(r, args[i]) ; }
} ;

