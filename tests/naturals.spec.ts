import {expect} from 'chai';
import {MSNaturalArray} from '../';

describe("MSNaturalArray", function() {

	it("Testing Array subclass behavior slice, concat and splice", function() {
		var n = new MSNaturalArray(1, 2, 3) ;
		var n2 = new MSNaturalArray([2, 7, 8]) ;
		var n3: MSNaturalArray ;
		expect(n.length).to.eq(3) ;
		expect(n[1]).to.eq(2) ;
		n.push(4) ;
		expect(n.length).to.eq(4) ;
		n.length = 2 ;
		expect(n.length).to.eq(2) ;
		n.push(7) ;
		n.push(8) ;
		expect(n instanceof Array).to.eq(true) ;
		n3 = n.slice(1,4) ;
        expect(n3 instanceof MSNaturalArray).to.eq(true) ;
		expect(n3).to.deep.equal(n2) ;
		n3 = (new MSNaturalArray(1,2,3,4,5,6)).concat(n3) ;
		expect(n3).to.deep.equal(new MSNaturalArray(1,2,3,4,5,6,2,7,8)) ;
		n3.splice(6, 1) ;
		expect(n3).to.deep.equal(new MSNaturalArray(1,2,3,4,5,6,7,8)) ;
		n3.unshift(101, 0, 0, 0) ;
		expect(n3).to.deep.equal(new MSNaturalArray(101,0,0,0,1,2,3,4,5,6,7,8)) ;

		n3.splice(0,4) ;
		n3.splice(8,0,9) ;
		expect(n3).to.deep.equal(new MSNaturalArray(1,2,3,4,5,6,7,8,9)) ;
		n3.splice(5,2,66,77,771,772,773,774,775) ;
		expect(n3).to.deep.equal(new MSNaturalArray(1,2,3,4,5,66,77,771,772,773,774,775,8,9)) ;
		expect(n3 instanceof Array).to.eq(true) ;
		expect(n3 instanceof MSNaturalArray).to.eq(true) ;
		//expect(Array.isArray(n3)).to.eq(true) ;
	}) ;

	it("Testing constructor", function() {

		var n = new MSNaturalArray() ;
        expect(n.length).to.eq(0);

		n = new MSNaturalArray(4799) ;
        expect(n.length).to.eq(1);
        expect(JSON.stringify(n)).to.eq("[4799]");

		n = new MSNaturalArray(1, 8, 3, 7) ;
        expect(n.length).to.eq(4);
        expect(JSON.stringify(n)).to.eq("[1,8,3,7]");
    });

	it("Testing constructors with several values", function() {
		var n = new MSNaturalArray(21, 356, 17, 65.5) ;
        expect(JSON.stringify(n)).to.eq("[21,356,17,65]");
		n.unshift(45, 13) ;
        //expect(MSTools.stringify(n)).to.eq("[45,13,21,356,17,65]");
	}) ;

}) ;