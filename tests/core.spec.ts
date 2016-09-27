import {expect} from 'chai';
import * as MSTools from '../';

describe("Core", function() {
	it("crc32", function() {
		var i, s = 'MSTE0101",3710,"CRC0638641A",1,"XVar",137,"PACT","VARS","_default_","planningSwitch","flags","value","options","objectKey","globals","disabledObjects","index","switch","planningForm","startingHourField","configurationsList","forceDontChoice","statutsList","endingDateField","target","startingDateField","visuPop","intervallePopUp","daysSwitches","selecteds","FORCE_RELOAD_ORIGIN","stepValue","visuIndexRadio","RSRC","path","modificationDate","isFolder","basePath","CARD","ACTIONS","revalidatePreResaINet","gapToNextWeek","duplicateResaWithContract","invalidateGapWithRefund","duplicateResa","revalidateReservation","gotoContract","rejectPreResa","invalidateReservation","newSimpleResaFromResource","gotoResource","editResa","gotoSession","addSimple","gotoActivityFromItem","gotoResourceFromItem","moveGap","deleteResaKeepSubscription","gotoContractor","gotoPlaceFromItem","gapToPreviousDay","invalidateGap","gapToPreviousWeek","acceptPreResa","gotoPlace","addComplex","gapToNextDay","refresh","home","deleteResaWithRefund","revalidateGapKeepSubscription","next","gotoActivity","gotoPeopleFromItem","editResaReadOnly","gotoRegisteredUser","progPrint","print","deleteResaKeepFile","invalidateGapKeepSubscription","editRegistereds","newResaFromResource","gotoPlaceClosures","revalidateGapKeepFile","add","deleteResa","invalidateGapKeepFile","revalidateGap","previous","MID","STAT","CARDTITLE","OPTS","LOCCTRL","CTXCLASS","FRAME_NAME","LOCCTRLPARAM","noEmptyPeriods","outlineStyle","selectedDays","interval","drawsLabels","interfaceName","endingDate","startingDate","objectName","planningColors","gapsBackgroundColor","rulerMinutesFontColor","planningStyles","tcol","bcol","firstHashAngle","firstHashInterspace","hcol","hasFirstHash","firstHashWidth","col","grad","gcol","width","rulerHoursColor","backgroundColor","rulerMinutesColor","rulerHoursFontColor","gradientStyle","hoursSeparationLineColor","outlinesColor","gapsHeaderBackgroundColor","periodBackgroundColor","conflictsColor","periodTitlesColor","titlesColor","borderStyle"' ;
		expect(MSTools.crc32(s).toString(16)).to.eq('ac85eb70') ;
		expect(MSTools.crc32("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,;:=$()[]{}/\\|@&-_\"\'%?.+!").toString(16)).to.eq('24137450') ;
		expect(MSTools.crc32("àçùéè").toString(16)).to.eq('e2a37c23') ;

	});

	it("ok", function() {
		expect(MSTools.ok(true)).to.eq(true);
		expect(MSTools.ok(false)).to.eq(true);
		expect(MSTools.ok(null)).to.eq(false);
		expect(MSTools.ok(undefined)).to.eq(false);
		expect(MSTools.ok({})).to.eq(true);
		expect(MSTools.ok([])).to.eq(true);
	});

	it("div", function() {
		expect(MSTools.div(1,2)).to.eq(0);
		expect(MSTools.div(4,2)).to.eq(2);
		expect(MSTools.div(4.1,2)).to.eq(2);
		expect(MSTools.div(3.9999,2)).to.eq(1);
		expect(MSTools.div(-3.9999,2)).to.eq(-1);
		expect(MSTools.div(-4,2)).to.eq(-2);
		expect(MSTools.div(-4.1,2)).to.eq(-2);
	});

	it("isInteger", function() {
		expect(MSTools.isInteger(0)).to.eq(true);
		expect(MSTools.isInteger(+1)).to.eq(true);
		expect(MSTools.isInteger(-1)).to.eq(true);
		expect(MSTools.isInteger(+1.00001)).to.eq(false);
		expect(MSTools.isInteger(-1.00001)).to.eq(false);
		expect(MSTools.isInteger(Number.MAX_SAFE_INTEGER)).to.eq(true);
		expect(MSTools.isInteger(Number.MIN_SAFE_INTEGER)).to.eq(true);
		expect(MSTools.isInteger(Number.MAX_VALUE)).to.eq(false);
		expect(MSTools.isInteger(Number.MIN_VALUE)).to.eq(false);
		expect(MSTools.isInteger(Number.EPSILON)).to.eq(false);
	});

	it("padStart", function() {
		expect(MSTools.padStart("test", 5)).to.eq(" test");
		expect(MSTools.padStart("test", 4)).to.eq("test");
		expect(MSTools.padStart("test", 1)).to.eq("test");
		expect(MSTools.padStart("test", 6)).to.eq("  test");
		expect(MSTools.padStart("tet", 6, "0")).to.eq("000tet");
		expect(MSTools.padStart("test", 7, "01")).to.eq("010test");
		expect(MSTools.padStart("test", 7, "01234")).to.eq("012test");
	});
	it("padEnd", function() {
		expect(MSTools.padEnd("test", 5)).to.eq("test ");
		expect(MSTools.padEnd("test", 4)).to.eq("test");
		expect(MSTools.padEnd("test", 1)).to.eq("test");
		expect(MSTools.padEnd("test", 6)).to.eq("test  ");
		expect(MSTools.padEnd("tet", 6, "0")).to.eq("tet000");
		expect(MSTools.padEnd("test", 7, "01")).to.eq("test010");
		expect(MSTools.padEnd("test", 7, "01234")).to.eq("test012");
	});

	it("type", function() {
		function myFunction() {}
		expect(MSTools.type("test")).to.eq("string");
		expect(MSTools.type(null)).to.eq("object");
		expect(MSTools.type(undefined)).to.eq("undefined");
		expect(MSTools.type(0)).to.eq("number");
		expect(MSTools.type(true)).to.eq("boolean");
		expect(MSTools.type(false)).to.eq("boolean");
		expect(MSTools.type(myFunction)).to.eq("function");
		expect(MSTools.type(new myFunction())).to.eq("myFunction");
		expect(MSTools.type([])).to.eq("Array");
		expect(MSTools.type({})).to.eq("object");
	});
}) ;
