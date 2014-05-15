describe("==========Tests of basic tools========", function() {
	it("Testing if String class has pure keys", function() {
		var s = "abcdefg", a = [] ;
		for (var key in s) {
			a.push(key) ;
		}
		expect(MSTools.stringify(a)).toBe(MSTools.stringify(['0', '1', '2', '3', '4', '5', '6'])) ;
	}) ;
	
	it ("Testing valueForPath method", function() {
		var a = {one:'one', two:{three:3, four:4}, five:['13/04/1966', 'six']} ;
		expect(a.valueForPath('one')).toBe('one') ;
		expect(a.valueForPath('two.three')).toBe(3) ;
		expect(a.valueForPath('two.four.toString')).toBe('4') ;
		expect(a.valueForPath('five.firstObject.parseDate.toInt')).toBe(19660413) ;
		expect(MSTools.valueForPath(a, 'five.lastObject.length')).toBe(3) ;
	}) ;
}) ;
