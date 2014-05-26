
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




