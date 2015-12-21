// we only add some functions into the main scope

(function() {
    "use strict";

    function $ok(self) { return ((self === null || (typeof self) === 'undefined') ? false : true) ; }
    function $length(self) { return ((self === null || (typeof self) === 'undefined' || (typeof self.length) === 'undefined') ? 0 : self.length) ; }
    function $type(self) { var t ; return ((self === null || (t = (typeof self)) === 'undefined') ? null : (self.isa ? self.isa : t)) ; }

    function $div(a, b) { return (a/b /* / keep that commentary here please */) | 0 ; }
    function $equals(a, b, opts) { return $ok(a) ? ($ok(b) ? a.isEqualTo(b, opts) : false) : ($ok(b) ? false : a === b) ; }

    var MSTools = {};

    // @include ./tools.js
    // @include ./introspection.js

    // ========= add things in known classes ==========
    // @include ./dataTypes/object.js
    // @include ./dataTypes/number.js
    // @include ./dataTypes/boolean.js
    // @include ./dataTypes/string.js
    // @include ./dataTypes/array.js
    // @include ./dataTypes/function.js
    // @include ./dataTypes/date.js
    // @include ./dataTypes/msdate.js
    // @include ./dataTypes/msarray.js
    // @include ./dataTypes/naturals.js
    // @include ./dataTypes/data.js
    // @include ./dataTypes/color.js
    // @include ./dataTypes/couple.js
    // @include ./mste.js

    // @include ./json.js
    // @include ./fusion.js

    // @ifdef DEBUG
    console.log("DEBUG MODE ON");
    // @endif

    MSTools.makeGlobal = function(g) {
        if (!g && typeof window === "object") { g= window; }
        if (!g && typeof global === "object") { g= global; }
        g.MSTools = MSTools;
        g.$ok = $ok;
        g.$length = $length;
        g.$div = $div;
        g.$equals = $equals;
        g.$type = $type;
        g.MSColor = MSColor;
        g.MSDate = MSDate;
        g.MSArray = MSArray;
        g.MSData = MSData;
        g.MSNaturalArray = MSNaturalArray;
        g.MSCouple = MSCouple;
    };
    MSTools.makeGlobal(MSTools);

    if ( typeof define === "function" && define.amd ) { // with AMD module
        define( "MSTools", [], function() {
            return MSTools;
        });
    }
    else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = MSTools;
    }
    else {  // if no AMD module
        MSTools.makeGlobal(window);
    }
})();
