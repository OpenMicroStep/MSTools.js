
// ================ constants ====================
if (!Date.prototype.isa) { Date.prototype.isa = 'Date' ; }
if (!Date.DISTANT_PAST) { Date.DISTANT_PAST = new Date(-8640000000000000) ; }
if (!Date.DISTANT_FUTURE) { Date.DISTANT_FUTURE = new Date(8640000000000000) ; }

// ================= class methods ===============
if (!Date.isLeapYear) {
	Date.isLeapYear = function(y) { return (y % 4 ? false : ( y % 100 ? (y > 7 ? true : false) : (y % 400 || y < 1600 ? false : true))) ; } ;
}
if (!Date.initWithUTCSeconds) {
	Date.initWithUTCSeconds = function(utc) {
		var d, t ;
		utc = 0+utc*1000 ;
		d = new Date(utc) ;
		t = d.getTimezoneOffset() ;
		if (t !== 0) { d.setTime(utc+t*60000) ; }
		return d ;
	} ;
}

if (!Date.validDate) {
	Date.daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] ;
	Date.validDate = function(day, month, year) { 
		if (day < 1 || month < 1 || month > 12) { return false ; }
	    if (day > Date.daysInMonth[month]) { return (month == 2 && day == 29 && Date.isLeapYear(year)) ? true : false ; }      
		return true ;
	} ;	
}

// ================ instance methods =============
if (!Date.prototype.getUTCSeconds) {
	Date.prototype.getUTCSeconds = function()
	{
		return this.getTime()/1000 - this.getTimezoneOffset()*60 ;
	} ;
}

if (!Date.prototype.isLeap) {
	Date.prototype.isLeap = function() { return Date.isLeapYear(this.getFullYear()) ; } ;	
}

if (!Date.prototype.weekOfYear) {
	Date.prototype.weekOfYear = function(offset) {
	    var firstDayOfYear, firstDayOfWeek, reference, week, utc ;

	    offset = $ok(offset) && !isNaN(offset) ? offset % 7 : 0 ;

	    firstDayOfYear = new Date(this.getFullYear(),0,1) ;
	    firstDayOfWeek = firstDayOfYear.getDay() ;

	    reference = firstDayOfYear.getTime() - ((firstDayOfWeek + 7 - offset) % 7) * 86400000 ;
	    utc = this.getTime() ;
	    utc = utc - (utc % 86400000) ;

	    week = Math.floor((utc - reference) / 604800000) ;
	    if (firstDayOfWeek == 0 || firstDayOfWeek > 4) {
	        if (week == 0) {
	            // we take the last week of the preceding year
	            reference = new Date(utc - 86400000) ;
	            return reference.weekOfYear(offset) ;
	        }
	    }
	    else { week++ ; }
	    return week ;
	} ;
}
