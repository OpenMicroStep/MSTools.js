describe("==========Tests of basic tools========", function() {
	it("Testing if String class has pure keys", function() {
		var s = "abcdefg", a = [] ;
		for (var key in s) {
			a.push(key) ;
		}
		expect(MSTools.stringify(a)).toBe(MSTools.stringify(['0', '1', '2', '3', '4', '5', '6'])) ;
	}) ;
	
}) ;
