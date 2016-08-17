import {isInteger, div, ok} from '../core';

const DaysFrom00000229To20010101= 730792;
const DaysFrom00010101To20010101= 730485;
const SecsFrom00010101To20010101= 63113904000;
const SecsFrom19700101To20010101= 978307200;
const DaysInMonth= [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DaysInPreviousMonth= [0, 0, 0, 0, 31, 61, 92, 122, 153, 184, 214, 245, 275, 306, 337];
function fastPad2(v: number) { return v > 10 ? (''+v) : ('0' + v); }

export class MSDate {
    static readonly DaysFrom00000229To20010101= DaysFrom00000229To20010101;
    static readonly DaysFrom00010101To20010101= DaysFrom00010101To20010101;
    static readonly SecsFrom00010101To20010101= SecsFrom00010101To20010101;
    static readonly SecsFrom19700101To20010101= SecsFrom19700101To20010101;

    interval: number;

    constructor(year: number, month: number, day: number);
    constructor(year: number, month: number, day: number, hours: number, minutes: number, seconds: number);
    constructor(interval: number);
    constructor(date: Date);
    constructor(date: MSDate);
    constructor();
    constructor() {
        let n = arguments.length;
        if (n >= 3) {
            if (!MSDate.validDate(arguments[0], arguments[1], arguments[2])) { throw "Bad MSDate() day arguments" ; }
            if (n !== 3 && n !== 6 ) { throw "Impossible to initialize a new MSDate() with "+n+" arguments" ; }
            if (n === 6) {
                if (!MSDate.validTime(arguments[3], arguments[4], arguments[5])) { throw "Bad MSDate() time arguments" ; }
                this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]) ;
            }
            else {
                this.interval = MSDate.intervalFrom(arguments[0], arguments[1], arguments[2], 0, 0, 0) ;
            }
        }
        else if (n === 2) { throw "Impossible to initialize a new MSDate() with 2 arguments" ; }
        else { // n === 1 || n === 0
            let t = arguments[0] ; // undefined if n === 0
            if (typeof t === 'number')
                this.interval = t;
            else if (t instanceof MSDate)
                this.interval = t.interval;
            else {
                let tmp = t instanceof Date ? t : new Date();
                this.interval = MSDate.intervalFrom(tmp.getFullYear(), tmp.getMonth()+1, tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds()) ;
            }
        }
    }

    static isLeapYear(y: number) { return (y % 4 ? false : ( y % 100 ? (y > 7 ? true : false) : (y % 400 || y < 1600 ? false : true))) ; }
    static validDate(year: number, month: number, day: number) {
        if (!isInteger(day) || !isInteger(month) || !isInteger(year) || day < 1 || month < 1 || month > 12) { return false ; }
        if (day > DaysInMonth[month]) { return (month === 2 && day === 29 && MSDate.isLeapYear(year)) ? true : false ; }
        return true ;
    }
    static validTime(hour: number, minute: number, second: number) {
        return (isInteger(hour) && isInteger(minute) && !isNaN(second) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60);
    }
    static intervalFromYMD(year: number, month: number, day: number) {
        var leaps ;
        month = 0 | month ;
        if (month < 3) { month += 12; year--; }

        leaps = Math.floor(year/4) - Math.floor(year/100) + Math.floor(year/400);

        return Math.floor((day + DaysInPreviousMonth[month] + 365 * year + leaps - DaysFrom00000229To20010101) * 86400) ;
    }
    static intervalFrom(year: number, month: number, day: number, hours: number, minutes: number, seconds: number) {
        return MSDate.intervalFromYMD(year, month, day) + hours * 3600 + minutes * 60 + seconds ;
    }
    static timeFromInterval(t: number) { return ((t+SecsFrom00010101To20010101) % 86400) ; }
    static dayFromInterval(t: number) { return Math.floor((t - MSDate.timeFromInterval(t))/86400) ; }
    static secondsFromInterval(t: number) { return ((t+SecsFrom00010101To20010101) % 60) ; }
    static minutesFromInterval(t: number) { return div(Math.floor((t+SecsFrom00010101To20010101) %  3600),  60) ; }
    static hoursFromInterval(t: number) { return div(Math.floor((t+SecsFrom00010101To20010101) %  86400),  3600) ; }
    static dayOfWeekFromInterval(t: number, offset: number) {
        offset = offset || 0 ;
        return (MSDate.dayFromInterval(t)+DaysFrom00010101To20010101 + 7 - (offset % 7)) % 7;
    }
    static componentsWithInterval(interval: number) {
        let Z =                  MSDate.dayFromInterval(interval) + DaysFrom00000229To20010101 ;
        let gg =                 Z - 0.25 ;
        let CENTURY =            Math.floor(gg/36524.25) ;
        let CENTURY_MQUART =     CENTURY - Math.floor(CENTURY/4) ;
        let ALLDAYS =            gg + CENTURY_MQUART ;
        let Y =                  Math.floor(ALLDAYS / 365.25) ;
        let Y365 =               Math.floor(Y * 365.25) ;
        let DAYS_IN_Y =          CENTURY_MQUART + Z - Y365 ;
        let MONTH_IN_Y =         Math.floor((5 * DAYS_IN_Y + 456)/153) ;

        return {
            day:Math.floor(DAYS_IN_Y - Math.floor((153*MONTH_IN_Y - 457) / 5)),
            hour:MSDate.hoursFromInterval(interval),
            minute:MSDate.minutesFromInterval(interval),
            seconds:MSDate.secondsFromInterval(interval),
            dayOfWeek:((Z + 2) % 7),
            month: MONTH_IN_Y > 12 ? MONTH_IN_Y - 12 : MONTH_IN_Y,
            year: MONTH_IN_Y > 12 ? Y + 1 : Y
        } ;
    }
    static _lastDayOfMonth(year,month) { return (month === 2 && MSDate.isLeapYear(year)) ? 29 : DaysInMonth[month]; } // not protected. use carrefully
    static _yearRef(y, offset) {
        var firstDayOfYear = MSDate.intervalFromYMD(y, 1, 1),
            d = MSDate.dayOfWeekFromInterval(firstDayOfYear, offset) ;

        d = (d <= 3 ? -d : 7-d ); // Day of the first week
        return firstDayOfYear + d * 86400 ;
    }

    components() { return MSDate.componentsWithInterval(this.interval) ; }
    isEqualTo(other) {
        return other instanceof MSDate && other.interval === this.interval;
    }
    isLeap() { return MSDate.isLeapYear(this.components().year); }
    yearOfCommonEra() { return this.components().year; }
    monthOfYear() { return this.components().month; }
    weekOfYear(offset = 0) {
        // In order to follow ISO 8601 week begins on monday and must have at
        // least 4 days (i.e. it must includes thursday)
        let w: number;
        let c = this.components();
        offset %= 7;

        let reference = MSDate._yearRef(c.year, offset) ;
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
    }
    dayOfYear() {
        return Math.floor((this.interval - MSDate.intervalFromYMD(this.components().year, 1, 1))/86400)+1 ;
    }

    dayOfMonth() { return this.components().day; }
    lastDayOfMonth() { let c = this.components() ; return MSDate._lastDayOfMonth(c.year, c.month); }
    dayOfWeek(offset) { return MSDate.dayOfWeekFromInterval(this.interval, offset) ; }
    hourOfDay() { return MSDate.hoursFromInterval(this.interval) ; }
    secondOfDay() { return MSDate.timeFromInterval(this.interval) ; }
    minuteOfHour() { return MSDate.minutesFromInterval(this.interval) ; }
    secondOfMinute() { return MSDate.secondsFromInterval(this.interval) ; }
    dateWithoutTime() { return new MSDate(this.interval - MSDate.timeFromInterval(this.interval)) ; }
    dateOfFirstDayOfYear()  { let c = this.components() ; return new MSDate(c.year,1, 1); }
    dateOfLastDayOfYear()   { let c = this.components() ; return new MSDate(c.year,12, 31); }
    dateOfFirstDayOfMonth() { let c = this.components() ; return new MSDate(c.year, c.month, 1); }
    dateOfLastDayOfMonth()  { let c = this.components() ; return new MSDate(c.year, c.month, MSDate._lastDayOfMonth(c.year, c.month)); }
    secondsSinceLocal1970() { return this.interval + SecsFrom19700101To20010101; }
    secondsSinceLocal2001() { return this.interval; }

    toDate() {
        let c = this.components() ;
        return new Date(c.year, c.month - 1, c.day, c.hour, c.minute, c.seconds, 0);
    }
    // returns the ISO 8601 representation without any timezone
    toISOString() {
        let c = this.components() ;
        return  c.year               + '-' +
                fastPad2(c.month)    + '-' +
                fastPad2(c.day)      + 'T' +
                fastPad2(c.hour)     + ':' +
                fastPad2(c.minute)   + ':' +
                fastPad2(c.seconds);
    }
    toString() {
        return this.toISOString();
    }
    toJSON() {
        return this.toISOString();
    }

}