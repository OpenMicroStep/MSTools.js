MSTools.fusion = function(template, object, sepa) {
    var l ;
    function _fswt(str, object) {
        var regex = /\{\{([a-zA-Z0-9.]+)\}\}/gi, result, lastPos = 0, s = "" ;
        while ((result = regex.exec(str)) ) {
            var pos = result.index, len = result[0].length, path = str.slice(pos+2, pos+len-2), v ;
            if (pos > 0) { s += str.slice(lastPos, pos) ; }
            v = MSTools.valueForPath(object, path) ;
            if ($ok(v)) { s += v ; }
            lastPos = pos+len ;
        }
        s += str.slice(lastPos) ;
        return s ;
    }

    if ((l = $length(template)) > 0) {
        if (template.isa === 'String') { return _fswt(template, object) ; }
        else if (template.isa === 'Array') {
            var i, array = [] ;
            sepa = sepa || '\n' ;
            for (i = 0 ; i < l ;i++) { array.push(_fswt(template[i], object)) ; }
            return array.join(sepa) ;
        }
    }
    return '' ;
} ;

