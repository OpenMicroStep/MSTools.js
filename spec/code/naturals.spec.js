describe("==========Tests of natural arrays ========", function() {
	
	it("Testing constructor", function() {
				
		var n = new MSNaturalArray() ;
        expect(n.length).toBe(0);

		/* n = new MSNaturalArray(4799) ;
        expect(n.length).toBe(0); this test SHOULD BE WRONG */

		n = new MSNaturalArray(1, 8, 3, 7) ;
        expect(n.length).toBe(4);
        expect(MSTools.stringify(n)).toBe("[1,8,3,7]");
    });				


	it("Testing pushing transformable values", function() {
		var n = new MSNaturalArray() ;
		n.push('12') ;
		n.push(1236.5665) ;
		n.push(-1) ;
		n.push('-36.55') ;
		n.push('a') ;
        expect(MSTools.stringify(n)).toBe("[12,1236,4294967295,4294967260,0]");
    });				

	it("Testing constructors with several values", function() {
		var n = new MSNaturalArray(21, 356, 17, 65.5) ;
        expect(MSTools.stringify(n)).toBe("[21,356,17,65]");
		n.unshift(45, 13) ;
        //expect(MSTools.stringify(n)).toBe("[45,13,21,356,17,65]");
	}) ;

}) ;