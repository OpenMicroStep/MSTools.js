describe("==========Tests of natural arrays ========", function() {

	beforeEach(function() {
	    jasmine.addCustomEqualityTester($equals);
	}) ;
	
	it("Testing Array subclass behavior slice, concat and splice", function() {
		var n = new MSNaturalArray(1, 2, 3) ;
		var n2 = new MSNaturalArray([2, 7, 8]) ;
		var n3 ;
		expect(n.length).toBe(3) ;
		expect(n[1]).toBe(2) ;
		n.push(4) ;
		expect(n.length).toBe(4) ;
		n.length = 2 ;
		expect(n.length).toBe(2) ;
		n[10] = 10 ;
		expect(n.length).toBe(11) ;
		n.length = 2 ;
		n.push(7) ;
		n.push(8) ;
		expect(n.isArray).toBe(true) ;
		expect(n instanceof Array).toBe(true) ;
		n3 = n.slice(1,4) ;
		expect(n3).toEqual(n2) ;
		n3 = (new MSNaturalArray(1,2,3,4,5,6)).concat(n3) ;
		expect(n3).toEqual(new MSNaturalArray(1,2,3,4,5,6,2,7,8)) ;
		n3.splice(6, 1) ;
		expect(n3).toEqual(new MSNaturalArray(1,2,3,4,5,6,7,8)) ;
		n3.unshift(101, '0', undefined, null) ;
		expect(n3).toEqual(new MSNaturalArray(101,0,0,0,1,2,3,4,5,6,7,8)) ;
		
		n3.splice(0,4) ;
		n3.splice(8,0,9) ;
		expect(n3).toEqual(new MSNaturalArray(1,2,3,4,5,6,7,8,9)) ;
		n3.splice(5,2,66,77,771,772,773,774,775) ;
		expect(n3).toEqual(new MSNaturalArray(1,2,3,4,5,66,77,771,772,773,774,775,8,9)) ;
	    expect(n3.isa).toBe('Naturals') ;
		expect(n3 instanceof Array).toBe(true) ;
		expect(n3 instanceof MSNaturalArray).toBe(true) ;
		expect(Array.isArray(n3)).toBe(true) ;
	}) ;

	/*
	
	var r = new MSNaturalArray() ;
    MSTools.sliceInto(r, start, end) ;
    return r ;
    
	*/
	it("Testing constructor", function() {
				
		var n = new MSNaturalArray() ;
        expect(n.length).toBe(0);

		n = new MSNaturalArray(4799) ;
        expect(n.length).toBe(1);
        expect(MSTools.stringify(n)).toBe("[4799]");

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