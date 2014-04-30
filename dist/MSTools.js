/*! MSTools - v0.0.1 - 2014-04-30 */

var MSTools = (function(global){
    "use strict";

    // Define and export the Marionette namespace
    var MSTools = {};


    String.prototype.test = function () {
        return this + "test";
    };
    MSTools.parse = function () {
        return "test";
    };


    // TODO: export for node.js module and on-browser amd-style require()

    return MSTools;
})(this);