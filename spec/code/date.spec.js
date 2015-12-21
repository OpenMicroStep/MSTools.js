if (typeof module !== 'undefined' && module.exports) {  // On Node.js
    require("../../tmp/MSTools");
}

describe("==========Tests du package date========", function() {
	beforeEach(function() {
	    jasmine.addCustomEqualityTester($equals);
	}) ;

	it("Testing Date interval on 01/01/1970", function() {
		var d = new MSDate(1970,1,1) ;
		expect(d.interval).toEqual(-MSDate.SecsFrom19700101To20010101) ;
		//expect(d.yearOfCommonEra()).toEqual(1970) ;
		//expect(d.monthOfYear()).toEqual(1) ;
		expect(d.dayOfMonth()).toEqual(1) ;
	}) ;
	it("Testing Date interval on 01/01/2001", function() {
		var d = new MSDate(2001,1,1) ;
		expect(d.interval).toEqual(0) ;
		//expect(d.yearOfCommonEra()).toEqual(2001) ;
		//expect(d.monthOfYear()).toEqual(1) ;
		expect(d.dayOfMonth()).toEqual(1) ;
	}) ;
	it("Testing Date interval on 03/01/2001", function() {
		var d = new MSDate(2001,1,3) ;
		expect(d.interval).toEqual(86400*2) ;
		//expect(d.yearOfCommonEra()).toEqual(2001) ;
		//expect(d.monthOfYear()).toEqual(1) ;
		expect(d.dayOfMonth()).toEqual(3) ;
	}) ;
	it("Testing Date interval on 01/01/1601", function() {
		var d = new MSDate(1601,1,1) ;
		expect(d.interval).toEqual(-12622780800) ;
		//expect(d.yearOfCommonEra()).toEqual(1601) ;
		//expect(d.monthOfYear()).toEqual(1) ;
		expect(d.dayOfMonth()).toEqual(1) ;
	}) ;
	it("Testing Date interval on 17/04/2017", function() {
		var d = new MSDate(2017,4,17) ;
		expect(d.interval).toEqual(514080000) ;
		//expect(d.yearOfCommonEra()).toEqual(2017) ;
		//expect(d.monthOfYear()).toEqual(4) ;
		expect(d.dayOfMonth()).toEqual(17) ;
	}) ;
	it("Testing Date interval on 12/05/2122 @ 12h00", function() {
		var d = new MSDate(2122,05,12,12,0,0) ;
		expect(d.interval).toEqual(3829723200) ;
		//expect(d.yearOfCommonEra()).toEqual(2122) ;
		//expect(d.monthOfYear()).toEqual(5) ;
		expect(d.dayOfMonth()).toEqual(12) ;
		expect(d.hourOfDay()).toEqual(12) ;
		expect(d.minuteOfHour()).toEqual(0) ;
		expect(d.secondOfMinute()).toEqual(0) ;
	}) ;

	it("Testing valid date on 29/02/0", function() {
        expect(MSDate.validDate(0,2,29)).toBe(false);
    });
	it("Testing valid date on 29/02/04", function() {
        expect(MSDate.validDate(4,2,29)).toBe(false);
    });
	it("Testing valid date on 29/02/8", function() {
        expect(MSDate.validDate(8,2,29)).toBe(true);
    });
	it("Testing valid date on 29/02/1200", function() {
        expect(MSDate.validDate(1200,2,29)).toBe(false);
    });
	it("Testing valid date on 29/02/1600", function() {
        expect(MSDate.validDate(1600,2,29)).toBe(true);
    });
	it("Testing valid date on 29/02/1900", function() {
        expect(MSDate.validDate(1900,2,29)).toBe(false);
    });
	it("Testing valid date on 29/02/2000", function() {
        expect(MSDate.validDate(2000,2,29)).toBe(true);
    });
	it("Testing valid date on 29/02/2012", function() {
        expect(MSDate.validDate(2012,2,29)).toBe(true);
    });
	it("Testing valid date on 29/02/2013", function() {
        expect(MSDate.validDate(2013,2,29)).toBe(false);
    });
	it("Testing valid date on 29/02/2014", function() {
        expect(MSDate.validDate(2014,2,29)).toBe(false);
    });
	it("Testing valid date on 31/04/2014", function() {
        expect(MSDate.validDate(2014,04,31)).toBe(false);
    });

	it("Testing decimal Date value", function() {
		expect(new Date(1966,3,13).toUInt()).toBe(19660413) ;
		expect(new Date(1970,0,1).toUInt()).toBe(19700101) ;
		expect(Date.dateWithUTCTime(0).toUInt()).toBe(19700101) ;
		expect(new Date(2002,6,6).toUInt()).toBe(20020706) ;
	}) ;
	it("Testing decimal MDDate value", function() {
		expect(new MSDate(1966,4,13).toUInt()).toBe(19660413) ;
		expect(new MSDate(1970,1,1).toUInt()).toBe(19700101) ;
		expect(new MSDate(0).toUInt()).toBe(20010101) ;
		expect(new MSDate(2002,07,06).toUInt()).toBe(20020706) ;
	}) ;

    it("Testing MSDate creation from Date", function() {
        var ms = new MSDate(new Date(2015,9,14));
        expect(ms.dayOfMonth()).toBe(14);
        expect(ms.monthOfYear()).toBe(10);
        expect(ms.yearOfCommonEra()).toBe(2015);
    });
}) ;