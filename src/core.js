// we only add some functions into the main scope

function $ok(self) { return ((self === null || (typeof self) === 'undefined') ? false : true) ; }
function $length(self) { return ((self === null || (typeof self) === 'undefined' || (typeof self.length) === 'undefined') ? 0 : self.length) ; }
function $type(self) { var t ; return ((self === null || (t = (typeof self)) === 'undefined') ? null : (self.isa ? self.isa : t)) ; }

function $div(a, b) { return (a/b /* / keep that commentary here please */) | 0 ; }
function $equals(a, b, opts) { return $ok(a) ? ($ok(b) ? a.isEqualTo(b, opts) : false) : ($ok(b) ? false : a === b) ; }

var MSTools = (function(global) {
    "use strict";

    // Define and export the Marionette namespace
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

    // @include ./json.js
    // @include ./fusion.js


    // @ifdef DEBUG
    console.log("DEBUG MODE ON");
    // @endif

    // TODO: export for node.js module and on-browser amd-style require()

    return MSTools;
})(this);

// ========= new classes ==========
// @include ./dataTypes/msdate.js
// @include ./dataTypes/msarray.js
// @include ./dataTypes/naturals.js
// @include ./dataTypes/data.js
// @include ./dataTypes/color.js
// @include ./dataTypes/couple.js
// @include ./mste.js

if (typeof module !== 'undefined' && module.exports) {  // On Node.js
    GLOBAL.MSTools = MSTools;
    GLOBAL.$ok = $ok;
    GLOBAL.$length = $length;
    GLOBAL.$div = $div;
    GLOBAL.$equals = $equals;
    GLOBAL.MSColor = MSColor;
    GLOBAL.MSDate = MSDate;
    GLOBAL.MSArray = MSArray;
    GLOBAL.MSData = MSData;
    GLOBAL.MSNaturalArray = MSNaturalArray;
    GLOBAL.MSCouple = MSCouple;
}