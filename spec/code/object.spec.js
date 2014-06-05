if (typeof module !== 'undefined' && module.exports) {  // On Node.js
    require("../../tmp/MSTools");
}

describe("==========Tests object add-ons========", function() {	
	it ("Testing valueForPath method", function() {
		var a = {one:'one', two:{three:3, four:4}, five:['13/04/1966', 'six']} ;
		expect(a.valueForPath('one')).toBe('one') ;
		expect(a.valueForPath('two.three')).toBe(3) ;
		expect(a.valueForPath('two.four.toString')).toBe('4') ;
		expect(a.valueForPath('five.firstObject.parseDate.toInt')).toBe(19660413) ;
		expect(MSTools.valueForPath(a, 'five.lastObject.length')).toBe(3) ;
	}) ;

	it ("Testing $equals()", function() {
		var a,b, c = null, d = null, e = {}, f = {} ;
		var dt = new Date(2012,10,21), dt2 = Date.initWithInt(20121121) ;
		var s = "MyGoodness", s2 = "My"+"Good"+"ness" ;
		var data = "F7y4".toUTF8Data() ;
		var data2 = new MSData("F7y4") ;
		var data3 = MSData.initWithBase64String("Rjd5NA==") ;
		var o = {}, o2 = o ;
		var c1 = new MSColor("fuchsia"), c2 = new MSColor("magenta"), c3 = new MSColor( "#ff00ff"), c4 = new MSColor(0xff,0,0xff) ;
		expect($equals(false, false)).toBe(true) ;
		expect($equals(false, true)).toBe(false) ;
		expect($equals(true, false)).toBe(false) ;
		expect($equals(true, true)).toBe(true) ;
		expect($equals(a,b)).toBe(true) ;
		expect($equals(a,c)).toBe(false) ;
		expect($equals(d,b)).toBe(false) ;
		expect($equals(c,d)).toBe(true) ;
		expect($equals(e,e)).toBe(true) ;
		expect($equals(e,f)).toBe(false) ;
		expect($equals(o,o2)).toBe(true) ;
		expect($equals("",''+'')).toBe(true) ;
		expect($equals(1,1.0)).toBe(true) ;
		expect($equals(dt,dt2)).toBe(true) ;
		expect(s.isEqualTo(s2)).toBe(true) ;
		expect($equals([],[])).toBe(true) ;
		expect(data.isEqualTo(data2)).toBe(true) ;
		expect(data.isEqualTo(data3)).toBe(true) ;
		expect(c1.isEqualTo(c2)).toBe(true) ;
		expect(c2.isEqualTo(c3)).toBe(true) ;
		expect(c4.isEqualTo(c3)).toBe(true) ;
		
		expect([s, dt, c, data2, c1, c4].isEqualTo([s2, dt2, d, data3, c3, c2])).toBe(true) ;
	}) ;
}) ;
