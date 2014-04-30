// we only add two functions in general scope
function $ok(self) { return ((self === null || (typeof self) === 'undefined') ? false : true) ; }
function $length(self) { return ((self === null || (typeof self) === 'undefined' || (typeof self.length) === 'undefined') ? 0 : self.length) ; }

var MSTools = (function(global){
    "use strict";

    // Define and export the Marionette namespace
    var MSTools = {};

    // @include ./dataTypes/string.js
    // @include ./dataTypes/date.js
    // @include ./mste.js
	// @include ./json.js


    // @ifdef DEBUG
    console.log("DEBUG MODE ON");
    // @endif

    // TODO: export for node.js module and on-browser amd-style require()

    return MSTools;
})(this);

