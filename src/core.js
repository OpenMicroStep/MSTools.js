// we only add some functions into the main scope
function $ok(self) { return ((self === null || (typeof self) === 'undefined') ? false : true) ; }
function $length(self) { return ((self === null || (typeof self) === 'undefined' || (typeof self.length) === 'undefined') ? 0 : self.length) ; }
function $div(a, b) { return (a/b /* / keep that commentary here please */) | 0 ; }

var MSTools = (function(global) {
    "use strict";

    // Define and export the Marionette namespace
    var MSTools = {};

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
    // @include ./mste.js
    // @include ./fusion.js


    // @ifdef DEBUG
    console.log("DEBUG MODE ON");
    // @endif

    // TODO: export for node.js module and on-browser amd-style require()

    return MSTools;
})(this);

// ========= new classes ==========
// @include ./dataTypes/data.js
// @include ./dataTypes/color.js
// @include ./dataTypes/naturals.js
// @include ./dataTypes/couple.js
