// ================ class interface ====================
function MSDate()
{
    var n = arguments.length, tmp ;
    if (n >= 3) {
        var i ;
        if (!MSDate.validDate(arguments[0], arguments[1], arguments[2])) { throw "Bad MSDate() day arguments" ; }
        if (n !== 3 && n !== 6 ) { throw "Impossible to initialize a new MSDate() with "+n+" arguments" ; }
        if (n === 6) {
            if (!MSDate.validTime(arguments[3], arguments[4], arguments[5])) { throw "Bad MSDate() time arguments" ; }
            this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5] | 0) ;
        }
        else {
            this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], 0, 0, 0) ;
        }
        return ;
    }
    else if (n === 2) { throw "Impossible to initialize a new MSDate() with 2 arguments" ; }
    else if (n === 1) {
        var t = arguments[0] ;
        if ($ok(t)) {
            switch (t.isa) {
                case 'Date': tmp = t ; break ;
                case 'MSDate': this.interval = t.interval ; return ;
                case 'Number':
                    if (!Number.isInteger(t)) { throw "Impossible to initialize a new MSDate() with a non integer number" ; }
                    this.interval = t ;
                    return ;
                default:
                    t = Number(t) ;
                    if (!Number.isInteger(t)) { throw "Impossible to initialize a new MSDate() with a non integer number representation" ; }
                    this.interval = t ;
                    return ;
            }
        }
        else { tmp = new Date() ; }
    }
    else { tmp = new Date() ; }

    this.interval = MSDate.intervalFrom(tmp.getFullYear(), tmp.getMonth()+1, tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds()) ;
}

// ================ constants ====================
MSTools.defineHiddenConstants(MSDate,{
    DaysFrom00000229To20010101:730792,
    DaysFrom00010101To20010101:730485,
    SecsFrom00010101To20010101:63113904000,
    SecsFrom19700101To20010101:978307200,
    DaysInMonth:[0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    DaysInPreviousMonth:[0, 0, 0, 0, 31, 61, 92, 122, 153, 184, 214, 245, 275, 306, 337]
}, true) ;
MSTools.defineHiddenConstant(MSDate.prototype,'isa', 'MSDate', true) ;

// ================= class methods ===============
MSTools.defineMethods(MSDate, {
    isLeapYear:function(y) { return (y % 4 ? false : ( y % 100 ? (y > 7 ? true : false) : (y % 400 || y < 1600 ? false : true))) ; },
    validDate:function(year, month, day) {
        if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year) || day < 1 || month < 1 || month > 12) { return false ; }
        if (day > MSDate.DaysInMonth[month]) { return (month === 2 && day === 29 && MSDate.isLeapYear(year)) ? true : false ; }
        return true ;
    },
    validTime:function(hour, minute, second) {
        return (Number.isInteger(hour) && Number.isInteger(minute) && !isNaN(second) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) ? true : false ;
    },
    intervalFromYMD:function(year, month, day) {
        var leaps ;
        month = 0 | month ;
        if (month < 3) { month += 12; year--; }

        leaps = Math.floor(year/4) - Math.floor(year/100) + Math.floor(year/400);

        return Math.floor((day + MSDate.DaysInPreviousMonth[month] + 365 * year + leaps - MSDate.DaysFrom00000229To20010101) * 86400) ;
    },
    intervalFrom:function(year, month, day, hours, minutes, seconds) {
        return MSDate.intervalFromYMD(year, month, day) + hours * 3600 + minutes * 60 + seconds ;
    },
    timeFromInterval:function(t) { return ((t+MSDate.SecsFrom00010101To20010101) % 86400) ; },
    dayFromInterval:function(t) { return Math.floor((t - MSDate.timeFromInterval(t))/86400) ; },
    secondsFromInterval:function(t) { return ((t+MSDate.SecsFrom00010101To20010101) % 60) ; },
    minutesFromInterval:function(t) { return $div(Math.floor((t+MSDate.SecsFrom00010101To20010101) %  3600),  60) ; },
    hoursFromInterval:function(t) { return $div(Math.floor((t+MSDate.SecsFrom00010101To20010101) %  86400),  3600) ; },
    dayOfWeekFromInterval:function(t, offset) {
        offset = offset || 0 ;
        return (MSDate.dayFromInterval(t)+MSDate.DaysFrom00010101To20010101 + 7 - (offset % 7)) % 7;
    },
    componentsWithInterval:function(interval) {
        var ret, Z, gg, CENTURY, CENTURY_MQUART, ALLDAYS, Y, Y365, DAYS_IN_Y, MONTH_IN_Y ;

        Z =                  MSDate.dayFromInterval(interval) + MSDate.DaysFrom00000229To20010101 ;
        gg =                 Z - 0.25 ;
        CENTURY =            Math.floor(gg/36524.25) ;
        CENTURY_MQUART =     CENTURY - Math.floor(CENTURY/4) ;
        ALLDAYS =            gg + CENTURY_MQUART ;
        Y =                  Math.floor(ALLDAYS / 365.25) ;
        Y365 =               Math.floor(Y * 365.25) ;
        DAYS_IN_Y =          CENTURY_MQUART + Z - Y365 ;
        MONTH_IN_Y =         Math.floor((5 * DAYS_IN_Y + 456)/153) ;

        ret = {
            day:Math.floor(DAYS_IN_Y - Math.floor((153*MONTH_IN_Y - 457) / 5)),
            hour:MSDate.hoursFromInterval(interval),
            minute:MSDate.minutesFromInterval(interval),
            seconds:MSDate.secondsFromInterval(interval),
            dayOfWeek:((Z + 2) % 7)
        } ;

        if (MONTH_IN_Y > 12) {
            ret.month = MONTH_IN_Y - 12 ;
            ret.year = Y + 1 ;
        }
        else {
            ret.month = MONTH_IN_Y ;
            ret.year = Y ;
        }
        return ret ;
    },
    dateWithInt:function(decimalDate) {
        if ($ok(decimalDate)) {
            decimalDate = decimalDate.toInt() ;
            var day = decimalDate % 100 ;
            var month = $div((decimalDate % 10000),100) ;
            var year = $div(decimalDate, 10000) ;
            if (MSDate.validDate(year, month, day)) { return new MSDate(year, month, day) ; }
        }
        return null ;
    },
    _lastDayOfMonth:function(year,month) { return (month === 2 && MSDate.isLeapYear(year)) ? 29 : MSDate.DaysInMonth[month]; }, // not protected. use carrefully
    _yearRef:function(y, offset) {
        var firstDayOfYear = MSDate.intervalFromYMD(y, 1, 1),
            d = MSDate.dayOfWeekFromInterval(firstDayOfYear, offset) ;

        d = (d <= 3 ? -d : 7-d ); // Day of the first week
        return firstDayOfYear + d * 86400 ;
    }
}, true) ;
// ================  instance methods =============
MSTools.defineInstanceMethods(MSDate, {
    components: function() { return MSDate.componentsWithInterval(this.interval) ; },
    valueOf: function() { return this.interval ; },
    toNumber: function() { return this.interval ; },
    toString: function() { // returns the ISO 8601 representation without any timezone
        function f(n) { return n < 10 ? '0' + n : n; } // Format integers to have at least two digits.

        var c = this.components() ;
        return ($ok(c) ?
                c.year + '-' +
                f(c.month) + '-' +
                f(c.day) + 'T' +
                f(c.hour)     + ':' +
                f(c.minute)   + ':' +
                f(c.seconds)
            : null);
    },
    isEqualTo: function(other, options) {
        if (this === other) { return true ; }
        if ($ok(other)) {
            if (this.isa === other.isa && this.interval === other.interval) { return true ; }
            // should we equals to normal javascript dates ?
        }
        return false ;
    },
    isLeap: function() { var c = this.components() ; return c !== null ? MSDate.isLeapYear(c.year) : false ; },

    yearOfCommonEra:function() { var c = this.components() ; return c !== null ? c.year : NaN ; },

    monthOfYear:function() { var c = this.components() ; return c !== null ? c.month : NaN ; },
    weekOfYear:function(offset) {
        // In order to follow ISO 8601 week begins on monday and must have at
        // least 4 days (i.e. it must includes thursday)
        var reference, w, c = this.components() ; if (c === null) { return NaN ; }
        offset = offset || 0 ;
        offset %= 7;

        reference = MSDate._yearRef(c.year, offset) ;
        if (this.interval < reference) { // De l'année d'avant
            reference = MSDate._yearRef(c.year - 1, offset);
            w = Math.floor((this.interval - reference) / (86400*7)) + 1 ;
        }
        else {
            w = Math.floor((this.interval - reference) / (86400*7)) + 1 ;
            if (w === 53) {
                reference += 52 * 7 * 86400 ;
                c = MSDate.componentsWithInterval(reference) ;
                if (c.day >= 29) { w = 1 ; }
            }
        }
        return w ;
    },
    dayOfYear:function() {
        var c = this.components() ; if (c === null) { return NaN ; }
        return Math.floor((this.interval - MSDate.intervalFromYMD(c.year, 1, 1))/86400)+1 ;
    },

    dayOfMonth:function() { var c = this.components() ; return c !== null ? c.day : NaN ; },
    lastDayOfMonth:function() { var c = this.components() ; return c !== null ? MSDate._lastDayOfMonth(c.year, c.month) : NaN ; },

    dayOfWeek:function(offset) { return MSDate.dayOfWeekFromInterval(this.interval, offset) ; },

    hourOfDay:function() { return MSDate.hoursFromInterval(this.interval) ; },
    secondOfDay:function() { return MSDate.timeFromInterval(this.interval) ; },

    minuteOfHour:function() { return MSDate.minutesFromInterval(this.interval) ; },

    secondOfMinute:function() { return MSDate.secondsFromInterval(this.interval) ; },

    dateWithoutTime: function() { return new MSDate(this.interval - MSDate.timeFromInterval(this.interval)) ; },
    dateOfFirstDayOfYear: function() { var c = this.components() ; return c !== null ? new MSDate(c.year,1, 1) : null ; },
    dateOfLastDayOfYear: function() { var c = this.components() ; return c !== null ? new MSDate(c.year,12, 31) : null ; },
    dateOfFirstDayOfMonth: function() { var c = this.components() ; return c !== null ? new MSDate(c.year, c.month, 1) : null ; },
    dateOfLastDayOfMonth: function() { var c = this.components() ; return c !== null ? new MSDate(c.year, c.month, MSDate._lastDayOfMonth(c.year, c.month)) : null ; },

    toInt: function() {
        var c = this.components() ;
        return c === null ? 0 : (c.year < 0 ? -1 : 1) * (c.year < 0 ? -c.year : c.year) * 10000 + c.month * 100 + c.day ;
    },
    toUInt: function() {
        var c = this.components() ;
        return c === null || c.year < 0 ? 0 : c.year * 10000 + c.month * 100 + c.day ;
    },
    toDate: function() {
        var c = this.components() ;
        return $ok(c) ? new Date(c.year, c.month - 1, c.day, c.hour, c.minute, c.seconds, 0) : null ;
    },
    toJSON: function (key) {
        var d = this.toDate() ;
        return $ok(d) ? d.toJSON(key) : null ;
    },
    toArray: function() {
        var c = this.components() ;
        return $ok(c) ? [c.year, c.month, c.day, c.hour, c.minute, c.seconds, c.dayOfWeek] : null ;
    },
    toMSTE: function(encoder) {
        if (encoder.version === 0x0101) {
            // in 101 MSTE version, there is no MSDate so we convert to a Date() object before encoding
            var t = this.toDate().getUTCFullSeconds() ;
            if (t >= Date.DISTANT_FUTURE) { encoder.push(25) ; }
            else if (t <= Date.DISTANT_PAST_TS) { encoder.push(24) ; }
            else if (encoder.shouldPushObject(this)) {
                encoder.push(6) ;
                encoder.push(t) ;
            }
        }
        else if (encoder.shouldPushObject(this)) {
            encoder.push(22) ;
            encoder.push(this.interval + MSDate.SecsFrom19700101To20010101) ;
        }
    }

}, true) ;