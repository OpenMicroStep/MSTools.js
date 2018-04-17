import {expect} from 'chai';
import {MSColor} from '../src/index';

describe("MSColor", function() {
	it("constructor", function() {
		expect((new MSColor(255)).toString()).to.eq('#0000ff') ;
		expect((new MSColor(0xa0a1a2)).toString()).to.eq('#a0a1a2') ;
		expect((new MSColor(0xbba0a1a2)).toNumber()).to.eq(0xbba0a1a2) ;
		expect((new MSColor(0xa0, 0xa1, 0xa2, 0xff - 0xbb)).toNumber().toString(16)).to.eq(0xbba0a1a2.toString(16)) ;
		expect((new MSColor('ivory')).toString()).to.eq('#fffff0') ;
		expect(MSColor.YELLOW.toString()).to.eq('#ffff00') ;
	}) ;

	it("equality", function() {
		expect(new MSColor('ivory').isEqualTo(new MSColor('#fffff0'))).to.eq(true) ;
		expect(new MSColor('ivory').isEqualTo(new MSColor('#fffff1'))).to.eq(false) ;
	}) ;
}) ;
