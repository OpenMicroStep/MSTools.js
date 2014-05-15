describe("==========Tests du package date========", function() {
	it("Testing valid date on 29/02/0", function() {
        expect(Date.validDate(29,2,0)).toBe(false);
    });				
	it("Testing valid date on 29/02/04", function() {
        expect(Date.validDate(29,2,4)).toBe(false);
    });				
	it("Testing valid date on 29/02/0", function() {
        expect(Date.validDate(29,2,8)).toBe(true);
    });				
	it("Testing valid date on 29/02/1200", function() {
        expect(Date.validDate(29,2,1200)).toBe(false);
    });				
	it("Testing valid date on 29/02/1600", function() {
        expect(Date.validDate(29,2,1600)).toBe(true);
    });				
	it("Testing valid date on 29/02/1900", function() {
        expect(Date.validDate(29,2,1900)).toBe(false);
    });				
	it("Testing valid date on 29/02/2000", function() {
        expect(Date.validDate(29,2,2000)).toBe(true);
    });				
	it("Testing valid date on 29/02/2012", function() {
        expect(Date.validDate(29,2,2012)).toBe(true);
    });				
	it("Testing valid date on 29/02/2013", function() {
        expect(Date.validDate(29,2,2013)).toBe(false);
    });				
	it("Testing valid date on 29/02/2014", function() {
        expect(Date.validDate(29,2,2014)).toBe(false);
    });
	it("Testing valid date on 31/04/2014", function() {
        expect(Date.validDate(31,04,2014)).toBe(false);
    });
	it("Testing decimal date value", function() {
		expect(new Date(1966,03,13).toInt()).toBe(19660413) ;
	}) ;
}) ;