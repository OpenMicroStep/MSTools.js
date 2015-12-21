/* global MSDate */

// ================ constants ====================
MSTools.defineHiddenConstant(Date.prototype,'isa', 'Date', true) ;
MSTools.defineHiddenConstants(Date,{
    DISTANT_PAST_TS:-8640000000000000,
    DISTANT_FUTURE_TS:8640000000000000
}, true) ;
MSTools.defineConstants(Date,{
    DISTANT_PAST:new Date(-8640000000000000),
    DISTANT_FUTURE:new Date(8640000000000000)
}, true) ;

// ================= class methods ===============
MSTools.defineMethods(Date, {
    currentMonth:function() { return new Date().getMonth() ; },
    currentYear:function() { return new Date().getFullYear() ; },
    dateWithUTCTime:function(utc) {
        return new Date(utc) ;
    },
    dateWithUTCSeconds:function(utc) { return this.dateWithUTCTime(1000*utc) ; },
    dateWithInt:function(decimalDate) {
        if ($ok(decimalDate)) {
            decimalDate = decimalDate.toInt() ;
            var day = decimalDate % 100 ;
            var month = $div((decimalDate % 10000),100) ;
            var year = $div(decimalDate, 10000) ;
            if (MSDate.validDate(year, month, day)) { return new Date(year, month - 1, day) ; }
        }
        return null ;
    }
}) ;

// ================ instance methods =============


MSTools.defineInstanceMethods(Date, {
    getUTCFullSeconds: function() { return $div(this.getTime(), 1000) ; },
    getUTCFullTime: function() { return this.getTime(); },
    dateWithoutTime: function() { var utc = this.getUTCFullTime() ; return Date.dateWithUTCTime(utc - (utc % 86400000)) ; },
    isLeap: function() { return MSDate.isLeapYear(this.getFullYear()) ; },
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
    toInt: function() {
        var year = this.getFullYear(), month = this.getMonth()+1, day = this.getDate() ;
        return (year < 0 ? -1 : 1) * (year < 0 ? -year : year) * 10000 + month * 100 + day ;
    },
    toUInt: function() {
        var year = this.getFullYear(), month = this.getMonth()+1, day = this.getDate() ;
        return year < 0 ? 0 : year * 10000 + month * 100 + day ;
    },
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
        //console.log("UTC milliseconds of date "+this+" is "+t) ;
        var identifier = this[encoder.referenceKey] ;
        if ($ok(identifier)) { encoder.push(9) ; encoder.push(identifier) ; }
        else {
            var t = this.getUTCFullTime() ;
            identifier = encoder.encodedObjects.length ;
            Object.defineProperty(this, encoder.referenceKey, {
                enumerable:false,
                configurable:true, // so it could be later deleted
                writable:false,
                value:identifier
            }) ;
            encoder.encodedObjects[identifier] = this ;
            encoder.push(23) ;
            encoder.push(t/1000) ; // can be a double
            //console.log('Date '+this+" will encode as "+(t/1000));
        }
    }
}, true) ;

if (MSTools.degradedMode) {
    MSTools.defineInstanceMethods(Date, {
        toArray: function() { return [this] ; }
    }) ;
}
