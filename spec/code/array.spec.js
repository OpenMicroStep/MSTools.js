if (typeof module !== 'undefined' && module.exports) {  // On Node.js
    require("../../tmp/MSTools");
}

describe("==========Tests du package array========", function() {
	beforeEach(function() {
	    jasmine.addCustomEqualityTester($equals);
	}) ;

	it("Testing Array indexOf", function() {
    // La methode sur la classe Array de base est appellee
    // car l'option 'force' n'est pas utilisee dans dataTypes/array.js
    // lors de l'instantiation de la classe.
    var obj = {"key":"value"} ;
		var a1 = new Array("test", 5, obj, "test", 23, "bonjour") ;
		expect(a1.indexOf(5)).toEqual(1) ;
		expect(a1.indexOf("5")).toEqual(-1) ;
		expect(a1.indexOf(77)).toEqual(-1) ;
		expect(a1.indexOf("test")).toEqual(0) ;
		expect(a1.indexOf({"key":"value"})).toEqual(-1) ;
		expect(a1.indexOf(obj)).toEqual(2) ;
		expect([,].indexOf(undefined)).toEqual(-1) ;
    // avec fromIndex
		expect(a1.indexOf("test", 1)).toEqual(3) ;
		expect(a1.indexOf(77, 1)).toEqual(-1) ;
		expect(a1.indexOf(23, -10)).toEqual(4) ;
		expect(a1.indexOf(23, 58)).toEqual(-1) ;
		expect(a1.indexOf(23, "test")).toEqual(4) ;
		expect(a1.indexOf(23, 1.2)).toEqual(4) ;
		expect(a1.indexOf({"key":"value"}, 2)).toEqual(-1) ;
		expect(a1.indexOf(obj, 2)).toEqual(2) ;
		expect([,].indexOf(undefined, 1)).toEqual(-1) ;
	}) ;
	it("Testing Array lastIndexOf", function() {
    // Idem que precedemment
    var obj = {"key":"value"} ;
		var a1 = new Array("test", 5, obj, "test", 23, "bonjour") ;
		expect(a1.lastIndexOf("test")).toEqual(3) ;
		expect(a1.lastIndexOf(77)).toEqual(-1) ;
		expect(a1.lastIndexOf(5)).toEqual(1) ;
		expect(a1.lastIndexOf("5")).toEqual(-1) ;
		expect(a1.lastIndexOf(obj)).toEqual(2) ;
		expect(a1.lastIndexOf({'key':'value'})).toEqual(-1) ;
    // avec fromIndex
		expect(a1.lastIndexOf("test", 4)).toEqual(3) ;
		expect(a1.lastIndexOf(77, 1)).toEqual(-1) ;
		expect(a1.lastIndexOf(23, -10)).toEqual(-1) ;
		expect(a1.lastIndexOf(23, 58)).toEqual(4) ;
		expect(a1.lastIndexOf(23, "test")).toEqual(-1) ;
		expect(a1.lastIndexOf(23, 5.2)).toEqual(4) ;
		expect(a1.lastIndexOf({"key":"value"}, 2)).toEqual(-1) ;
		expect(a1.lastIndexOf(obj, 2)).toEqual(2) ;
	}) ;
	it("Testing Array indexOfIdentical", function() {
    // Reagit de facon identique a la fonction indexOf de base
    var obj = {"key":"value"} ;
		var a1 = new Array("test", 5, obj, "test", 23, "bonjour") ;
		expect(a1.indexOfIdentical(5)).toEqual(1) ;
		expect(a1.indexOfIdentical("5")).toEqual(-1) ;
		expect(a1.indexOfIdentical(77)).toEqual(-1) ;
		expect(a1.indexOfIdentical("test")).toEqual(0) ;
		expect(a1.indexOfIdentical({"key":"value"})).toEqual(-1) ;
		expect(a1.indexOfIdentical(obj)).toEqual(2) ;
    // avec fromIndex
		expect(a1.indexOfIdentical("test", 1)).toEqual(3) ;
		expect(a1.indexOfIdentical(77, 1)).toEqual(-1) ;
		expect(a1.indexOfIdentical(23, -10)).toEqual(4) ;
		expect(a1.indexOfIdentical(23, 58)).toEqual(-1) ;
		expect(a1.indexOfIdentical(23, "test")).toEqual(4) ;
		expect(a1.indexOfIdentical(23, 1.2)).toEqual(4) ;
		expect(a1.indexOfIdentical({"key":"value"}, 2)).toEqual(-1) ;
		expect(a1.indexOfIdentical(obj, 2)).toEqual(2) ;
	}) ;
	it("Testing Array lastIndexOfIdentical", function() {
    // Idem que precedemment
    var obj = {"key":"value"} ;
		var a1 = new Array("test", 5, obj, "test", 23, "bonjour") ;
		expect(a1.lastIndexOfIdentical("test")).toEqual(3) ;
		expect(a1.lastIndexOfIdentical(77)).toEqual(-1) ;
		expect(a1.lastIndexOfIdentical(5)).toEqual(1) ;
		expect(a1.lastIndexOfIdentical("5")).toEqual(-1) ;
		expect(a1.lastIndexOfIdentical(obj)).toEqual(2) ;
		expect(a1.lastIndexOfIdentical({'key':'value'})).toEqual(-1) ;
    // avec fromIndex
		expect(a1.lastIndexOfIdentical("test", 4)).toEqual(3) ;
		expect(a1.lastIndexOfIdentical(77, 1)).toEqual(-1) ;
		expect(a1.lastIndexOfIdentical(23, -10)).toEqual(-1) ;
		expect(a1.lastIndexOfIdentical(23, 58)).toEqual(4) ;
		expect(a1.lastIndexOfIdentical(23, "test")).toEqual(-1) ;
		expect(a1.lastIndexOfIdentical(23, 5.2)).toEqual(4) ;
		expect(a1.lastIndexOfIdentical({"key":"value"}, 2)).toEqual(-1) ;
		expect(a1.lastIndexOfIdentical(obj, 2)).toEqual(2) ;
	}) ;
	it("Testing Array contains", function() {
    var obj = {"key":"value"} ;
		var a1 = new Array("test", 5, obj, "test", 23, "bonjour") ;
		expect(a1.contains("test")).toEqual(true) ;
		expect(a1.contains(77)).toEqual(false) ;
		expect(a1.contains(5)).toEqual(true) ;
		expect(a1.contains("5")).toEqual(false) ;
		expect(a1.contains(obj)).toEqual(true) ;
		expect(a1.contains({'key':'value'})).toEqual(false) ;
	}) ;
	it("Testing Array containsIdentical", function() {
    var obj = {"key":"value"} ;
		var a1 = new Array("test", 5, obj, "test", 23, "bonjour") ;
		expect(a1.containsIdentical("test")).toEqual(true) ;
		expect(a1.containsIdentical(77)).toEqual(false) ;
		expect(a1.containsIdentical(5)).toEqual(true) ;
		expect(a1.containsIdentical("5")).toEqual(false) ;
		expect(a1.containsIdentical(obj)).toEqual(true) ;
		expect(a1.containsIdentical({'key':'value'})).toEqual(false) ;
	}) ;
	it("Testing Array isEqualTo", function() {
    var obj = {"key":"value"} ;
		var a1 = new Array("test", 5, "test", 23, "bonjour") ;
		expect([].isEqualTo([])).toEqual(true) ;
		expect(["test", true, false, 4].isEqualTo(["test", true, false, 4])).toEqual(true) ;
		expect(["test", true, false, 4].isEqualTo(["test", true, false, "4"])).toEqual(false) ;
		expect([].isEqualTo(false)).toEqual(false) ;
		expect([obj].isEqualTo([obj])).toEqual(true) ;
		expect([obj].isEqualTo([{"key":"value"}])).toEqual(false) ;
		expect([1,2].isEqualTo([2,1])).toEqual(false) ;
		expect(a1.isEqualTo("test", 5, "test", 23, "bonjour")).toEqual(false) ;
	}) ;
	it("Testing Array sortedIndexOf", function() {
		expect([1,1.5,2,3].sortedIndexOf(2)).toEqual(2) ;
		expect(["bonjour","hello","salut"].sortedIndexOf("hello")).toEqual(1) ;
	}) ;
	it("Testing Array addSorted", function() {
    var a1 = new Array();
		expect(a1.addSorted(2)).toEqual(0) ;
		expect(a1.addSorted(5)).toEqual(1) ;
		expect(a1.addSorted(3)).toEqual(1) ;
		expect(a1.addSorted("bonjour")).toEqual(-1) ;
	}) ;
	it("Testing Array minimum", function() {
    var a1 = new Array(-0.5, -0, 0, 0.0000001);
		expect(a1.minimum()).toEqual(-0.5) ;
		expect([].minimum()).toEqual(null) ;
		expect([null].minimum()).toEqual(null) ;
		expect([null, 5].minimum()).toEqual(null) ;
		expect([,].minimum()).toEqual(undefined) ;
		expect(["hello", "bonjour"].minimum()).toEqual("bonjour") ;
		expect([true, false].minimum()).toEqual(false) ;
	}) ;
	it("Testing Array maximum", function() {
    var a1 = new Array(-0.5, -0, 0, 0.0000001);
		expect(a1.maximum()).toEqual(0.0000001) ;
		expect([].maximum()).toEqual(null) ;
		expect([null].maximum()).toEqual(null) ;
		expect([null, 5].maximum()).toEqual(5) ;
		expect([,].maximum()).toEqual(undefined) ;
		expect(["hello", "bonjour"].maximum()).toEqual("hello") ;
		expect([true, false].maximum()).toEqual(true) ;
	}) ;
	it("Testing Array firstObject", function() {
    var a1 = new Array(-0.5, -0, 0, 0.0000001);
		expect(a1.firstObject()).toEqual(-0.5) ;
		expect([].firstObject()).toEqual(null) ;
		expect([[]].firstObject()).toEqual([]) ;
		expect([,].firstObject()).toEqual(undefined) ;
		expect(["hello", 14, "bonjour"].firstObject()).toEqual("hello") ;
	}) ;
	it("Testing Array lastObject", function() {
    var a1 = new Array(-0.5, -0, 0, 0.0000001);
		expect(a1.lastObject()).toEqual(0.0000001) ;
		expect([].lastObject()).toEqual(null) ;
		expect([[]].lastObject()).toEqual([]) ;
		expect([,].lastObject()).toEqual(undefined) ;
		expect(["hello", 14, "bonjour"].lastObject()).toEqual("bonjour") ;
	}) ;
	it("Testing Array objectAtIndex", function() {
    var a1 = new Array(-0.5, -0, 0, 0.0000001);
		expect(a1.objectAtIndex(1)).toEqual(0) ;
		expect(a1.objectAtIndex(-1)).toEqual(undefined) ;
		expect(a1.objectAtIndex(1251)).toEqual(undefined) ;
		expect(a1.objectAtIndex(1.5)).toEqual(undefined) ;
		expect(a1.objectAtIndex("bonjour")).toEqual(undefined) ;
		expect([[]].objectAtIndex(0)).toEqual([]) ;
		expect([true].objectAtIndex(0)).toEqual(true) ;
		expect([false].objectAtIndex(0)).toEqual(false) ;
	}) ;
}) ;
