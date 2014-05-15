
// ================ adding members to class and objects ====================
function _defineConstant(target, constant, visible, value, force) {
    if ($ok(target) && (force || !target.hasOwnProperty(constant))) {
        Object.defineProperty(target, constant, { enumerable:visible, configurable:false, writable:false, value:value}) ;
    }
}

MSTools.defineConstant = function(target, constant, value, force) { _defineConstant(target, constant, true, value, force) ; } ;
MSTools.defineConstants = function(target, constants, force) { for (var key in constants) { _defineConstant(target, key, true, constants[key], force) ; }} ;

MSTools.defineHiddenConstant = function(target, constant, value, force) { _defineConstant(target, constant, false, value, force) ; } ;
MSTools.defineHiddenConstants = function(target, constants, force) { for (var key in constants) { _defineConstant(target, key, false, constants[key], force) ; }} ;

MSTools.defineMethod = function(target, method, fn, force) {
    if ($ok(target) && (force || !target.hasOwnProperty(method) || (typeof target[method] !== 'function'))) {
        //console.log('will add method '+method+' to object class '+target.isa) ;
        Object.defineProperty(target, method, { enumerable:false, configurable:false, writable:false, value:fn}) ;
    }
} ;

MSTools.defineMethods = function(target, methods, force) { for (var key in methods) { MSTools.defineMethod(target, key, methods[key], force) ; }} ;
MSTools.defineInstanceMethod = function(target, method, fn, force) { MSTools.defineMethod(target.prototype, method, fn, force) ; } ;
MSTools.defineInstanceMethods = function(target, methods, force) { for (var key in methods) { MSTools.defineInstanceMethod(target, key, methods[key], force) ; }} ;

// ================ subclassing ====================
MSTools.subclass = function(theNewClass, theSuperClass, newIsa) {
    var prototypeObject ;

    function Surrogate() { }
    Surrogate.prototype = theSuperClass.prototype;

    prototypeObject = new Surrogate() ;
    prototypeObject.constructor = theNewClass;

    theNewClass.prototype = prototypeObject ;

    if ($ok(newIsa) && (typeof newIsa === 'string')) {
        MSTools.defineHiddenConstant(theNewClass.prototype, 'isa', newIsa, true) ;
    }
} ;

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



