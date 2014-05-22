
// ================ constants ====================
MSTools.defineHiddenConstant(Date.prototype,'isa', 'Date', true) ;
MSTools.defineHiddenConstants(Date,{
    DISTANT_PAST_TS:-8640000000000000,
    DISTANT_FUTURE_TS:8640000000000000
}, true) ;
MSTools.defineConstants(Date,{
    DISTANT_PAST:new Date(-8640000000000000),
    DISTANT_FUTURE:new Date(8640000000000000),
    DAYS_IN_MONTH:[0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}, true) ;

// ================= class methods ===============
MSTools.defineMethods(Date, {
    currentMonth:function() { return new Date().getMonth() ; },
    currentYear:function() { return new Date().getFullYear() ; },
    initWithUTCTime:function(utc) {
        var d, t ;
        utc = 0+utc ;
        d = new Date(utc) ;
        t = d.getTimezoneOffset() ;
        if (t !== 0) { d.setTime(utc+t*60000) ; }
        return d ;
    },
    initWithUTCSeconds:function(utc) { return this.initWithUTCTime(1000*utc) ; },
    initWithInt:function(decimalDate) {
        if ($ok(decimalDate)) {
            decimalDate = decimalDate.toInt() ;
            var day = decimalDate % 100 ;
            var month = $div((decimalDate % 10000),100) ;
            var year = $div(decimalDate, 10000) ;
            if (Date.validDate(day, month, year)) { return new Date(year, month - 1, day) ; }
        }
        return null ;
    },
    isLeapYear:function(y) { return (y % 4 ? false : ( y % 100 ? (y > 7 ? true : false) : (y % 400 || y < 1600 ? false : true))) ; },
    validDate:function(day, month, year) {
        if (day < 1 || month < 1 || month > 12) { return false ; }
        if (day > Date.DAYS_IN_MONTH[month]) { return (month === 2 && day === 29 && Date.isLeapYear(year)) ? true : false ; }
        return true ;
    }
}) ;

// ================ instance methods =============


MSTools.defineInstanceMethods(Date, {
    getUTCFullSeconds: function() { return $div(this.getTime(), 1000) - this.getTimezoneOffset()*60 ; },
    getUTCFullTime: function() { return this.getTime() - this.getTimezoneOffset()*60000 ; },
    dateWithoutTime: function() { var utc = this.getUTCFullTime() ; return Date.initWithUTCTime(utc - (utc % 86400000)) ; },
    isLeap: function() { return Date.isLeapYear(this.getFullYear()) ; },
    shiftSeconds: function(s) { this.setTime(this.getTime()+s*1000) ; },
    weekOfYear: function(offset) {
        var firstDayOfYear, firstDayOfWeek, reference, week, utc ;

        offset = $ok(offset) && !isNaN(offset) ? offset % 7 : 0 ;

        firstDayOfYear = new Date(this.getFullYear(),0,1) ;
        firstDayOfWeek = firstDayOfYear.getDay() ;

        reference = firstDayOfYear.getTime() - ((firstDayOfWeek + 7 - offset) % 7) * 86400000 ;
        utc = this.getTime() ;
        utc = utc - (utc % 86400000) ;

        week = $div((utc - reference), 604800000) ;
        if (firstDayOfWeek === 0 || firstDayOfWeek > 4) {
            if (week === 0) {
                // we take the last week of the preceding year
                reference = new Date(utc - 86400000) ;
                return reference.weekOfYear(offset) ;
            }
        }
        else { week++ ; }
        return week ;
    },
    isEqualTo: function(other, options) {

        if (this === other) { return true ; }
        if (options && options.secondPrecision) {
            return $ok(other) && this.isa === other.isa && this.getUTCFullSeconds() === other.getUTCFullSeconds() ? true : false ;
        }
        return $ok(other) && this.isa === other.isa && this.getUTCFullTime() === other.getUTCFullTime() ? true : false ;
    },
    toInt: function() { return this.getFullYear() * 10000 + (this.getMonth()+1) * 100 + this.getDate() ; },
    toUInt: function() { return this.getFullYear() * 10000 + (this.getMonth()+1) * 100 + this.getDate() ; },
    toJSON: function (key) {
        function f(n) { return n < 10 ? '0' + n : n; } // Format integers to have at least two digits.
        return (isFinite(this.valueOf()) ?
            this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
            : null);
    }
}) ;

MSTools.defineInstanceMethods(Date, {
    toMSTE: function(encoder) {
        var t = this.getUTCFullTime() ;
        //console.log("UTC milliseconds of date "+this+" is "+t) ;
        if (t >= Date.DISTANT_FUTURE_TS) { encoder.push(5) ; }
        else if ( t <= Date.DISTANT_PAST_TS) { encoder.push(4) ; }
        else {
            var identifier = this[encoder.referenceKey] ;
            if ($ok(identifier)) { encoder.push(9) ; encoder.push(identifier) ; }
            else {
                identifier = encoder.encodedObjects.length ;
                Object.defineProperty(this, encoder.referenceKey, {
                    enumerable:false,
                    configurable:true, // so it could be later deleted
                    writable:false,
                    value:identifier
                }) ;
                encoder.encodedObjects[identifier] = this ;
                encoder.push(22) ;
                encoder.push($div(t,1000)) ;
            }
        }
    }
}, true) ;
