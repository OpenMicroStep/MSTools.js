if (typeof module !== 'undefined' && module.exports) {  // On Node.js
    require("../../tmp/MSTools");
}

describe("==========Tests of basic tools========", function() {
	it("Testing if String class has pure keys", function() {
		var s = "abcdefg", a = [] ;
		var res = ['0', '1', '2', '3', '4', '5', '6'] ;
		
		for (var key in s) {
            if (s.hasOwnProperty(key)) {        // in case node.js environment adds to String
                a.push(key) ;
            }
		}

		expect(MSTools.stringify(a)).toBe(MSTools.stringify(res)) ;
	}) ;
	it("Testing CRC32", function() {
		var i, s = 'MSTE0101",3710,"CRC0638641A",1,"XVar",137,"PACT","VARS","_default_","planningSwitch","flags","value","options","objectKey","globals","disabledObjects","index","switch","planningForm","startingHourField","configurationsList","forceDontChoice","statutsList","endingDateField","target","startingDateField","visuPop","intervallePopUp","daysSwitches","selecteds","FORCE_RELOAD_ORIGIN","stepValue","visuIndexRadio","RSRC","path","modificationDate","isFolder","basePath","CARD","ACTIONS","revalidatePreResaINet","gapToNextWeek","duplicateResaWithContract","invalidateGapWithRefund","duplicateResa","revalidateReservation","gotoContract","rejectPreResa","invalidateReservation","newSimpleResaFromResource","gotoResource","editResa","gotoSession","addSimple","gotoActivityFromItem","gotoResourceFromItem","moveGap","deleteResaKeepSubscription","gotoContractor","gotoPlaceFromItem","gapToPreviousDay","invalidateGap","gapToPreviousWeek","acceptPreResa","gotoPlace","addComplex","gapToNextDay","refresh","home","deleteResaWithRefund","revalidateGapKeepSubscription","next","gotoActivity","gotoPeopleFromItem","editResaReadOnly","gotoRegisteredUser","progPrint","print","deleteResaKeepFile","invalidateGapKeepSubscription","editRegistereds","newResaFromResource","gotoPlaceClosures","revalidateGapKeepFile","add","deleteResa","invalidateGapKeepFile","revalidateGap","previous","MID","STAT","CARDTITLE","OPTS","LOCCTRL","CTXCLASS","FRAME_NAME","LOCCTRLPARAM","noEmptyPeriods","outlineStyle","selectedDays","interval","drawsLabels","interfaceName","endingDate","startingDate","objectName","planningColors","gapsBackgroundColor","rulerMinutesFontColor","planningStyles","tcol","bcol","firstHashAngle","firstHashInterspace","hcol","hasFirstHash","firstHashWidth","col","grad","gcol","width","rulerHoursColor","backgroundColor","rulerMinutesColor","rulerHoursFontColor","gradientStyle","hoursSeparationLineColor","outlinesColor","gapsHeaderBackgroundColor","periodBackgroundColor","conflictsColor","periodTitlesColor","titlesColor","borderStyle"' ;
		expect(MSTools.crc32(s).toHexa(8)).toBe('ac85eb70') ;
		
		expect(MSTools.crc32("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,;:=$()[]{}/\\|@&-_\"\'%?.+!").toHexa(8)).toBe('24137450') ;
		expect(MSTools.crc32("àçùéè".toUTF8Data()).toHexa(8)).toBe('e2a37c23') ;

	}) ;
	
}) ;
