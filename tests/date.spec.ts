import {expect} from 'chai';
import {MSDate} from '../';

describe("MSDate", function() {

	it("interval on 01/01/1970", function() {
		var d = new MSDate(1970,1,1) ;
		expect(d.interval).to.eq(-MSDate.SecsFrom19700101To20010101) ;
		//expect(d.yearOfCommonEra()).to.eq(1970) ;
		//expect(d.monthOfYear()).to.eq(1) ;
		expect(d.dayOfMonth()).to.eq(1) ;
	}) ;
	it("interval on 01/01/2001", function() {
		var d = new MSDate(2001,1,1) ;
		expect(d.interval).to.eq(0) ;
		//expect(d.yearOfCommonEra()).to.eq(2001) ;
		//expect(d.monthOfYear()).to.eq(1) ;
		expect(d.dayOfMonth()).to.eq(1) ;
	}) ;
	it("interval on 03/01/2001", function() {
		var d = new MSDate(2001,1,3) ;
		expect(d.interval).to.eq(86400*2) ;
		//expect(d.yearOfCommonEra()).to.eq(2001) ;
		//expect(d.monthOfYear()).to.eq(1) ;
		expect(d.dayOfMonth()).to.eq(3) ;
	}) ;
	it("interval on 01/01/1601", function() {
		var d = new MSDate(1601,1,1) ;
		expect(d.interval).to.eq(-12622780800) ;
		//expect(d.yearOfCommonEra()).to.eq(1601) ;
		//expect(d.monthOfYear()).to.eq(1) ;
		expect(d.dayOfMonth()).to.eq(1) ;
	}) ;
	it("interval on 17/04/2017", function() {
		var d = new MSDate(2017,4,17) ;
		expect(d.interval).to.eq(514080000) ;
		//expect(d.yearOfCommonEra()).to.eq(2017) ;
		//expect(d.monthOfYear()).to.eq(4) ;
		expect(d.dayOfMonth()).to.eq(17) ;
	}) ;
	it("interval on 12/05/2122 @ 12h00", function() {
		var d = new MSDate(2122,5,12,12,0,0) ;
		expect(d.interval).to.eq(3829723200) ;
		//expect(d.yearOfCommonEra()).to.eq(2122) ;
		//expect(d.monthOfYear()).to.eq(5) ;
		expect(d.dayOfMonth()).to.eq(12) ;
		expect(d.hourOfDay()).to.eq(12) ;
		expect(d.minuteOfHour()).to.eq(0) ;
		expect(d.secondOfMinute()).to.eq(0) ;
	}) ;

	it("valid date on 29/02/0", function() {
        expect(MSDate.validDate(0,2,29)).to.eq(false);
    });
	it("valid date on 29/02/04", function() {
        expect(MSDate.validDate(4,2,29)).to.eq(false);
    });
	it("valid date on 29/02/8", function() {
        expect(MSDate.validDate(8,2,29)).to.eq(true);
    });
	it("valid date on 29/02/1200", function() {
        expect(MSDate.validDate(1200,2,29)).to.eq(false);
    });
	it("valid date on 29/02/1600", function() {
        expect(MSDate.validDate(1600,2,29)).to.eq(true);
    });
	it("valid date on 29/02/1900", function() {
        expect(MSDate.validDate(1900,2,29)).to.eq(false);
    });
	it("valid date on 29/02/2000", function() {
        expect(MSDate.validDate(2000,2,29)).to.eq(true);
    });
	it("valid date on 29/02/2012", function() {
        expect(MSDate.validDate(2012,2,29)).to.eq(true);
    });
	it("valid date on 29/02/2013", function() {
        expect(MSDate.validDate(2013,2,29)).to.eq(false);
    });
	it("valid date on 29/02/2014", function() {
        expect(MSDate.validDate(2014,2,29)).to.eq(false);
    });
	it("valid date on 31/04/2014", function() {
        expect(MSDate.validDate(2014,0,31)).to.eq(false);
    });

    it("dates conversion", function() {
        var d0 = new Date(1966,3,13, 12, 59, 1) ;
        var d = new MSDate(1966,4,13, 12, 59, 1) ;

        var d1 = d.toDate() ;
        expect(d1).to.deep.equal(d0) ;

        var d2 = new MSDate(d1) ;
        expect(d.isEqualTo(d2)).to.eq(true) ;

        var d3 = d2.toDate() ;
        expect(d3).to.deep.equal(d0) ;

    }) ;

    it("MSDate creation from Date", function() {
        var ms = new MSDate(new Date(2015,9,14));
        expect(ms.dayOfMonth()).to.eq(14);
        expect(ms.monthOfYear()).to.eq(10);
        expect(ms.yearOfCommonEra()).to.eq(2015);
    });
}) ;