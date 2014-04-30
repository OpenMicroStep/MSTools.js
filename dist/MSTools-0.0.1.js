/*! MSTools - v0.0.1 - 2014-04-30 */

// we only add two functions in general scope
function $ok(self) { return ((self === null || (typeof self) === 'undefined') ? false : true) ; }
function $length(self) { return ((self === null || (typeof self) === 'undefined' || (typeof self.length) === 'undefined') ? 0 : self.length) ; }

var MSTools = (function(global){
    "use strict";

    // Define and export the Marionette namespace
    var MSTools = {};

    
    // ================ constants ====================
    if (!String.prototype.isa) { String.prototype.isa = 'String' ; }
    
    // ================= class methods ===============
    
    
    // ================  instance methods =============
    if (!String.prototype.trim) {
    	String.prototype.trim = function() { return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"); } ;
    }
    
    if (!String.prototype.hasSuffix) {
    	String.prototype.hasSuffix = function(str) { var r = new RegExp("^"+str) ; return (this.match(r) != null) ; } ;	
    }
    
    if (!String.prototype.hasPrefix) {
    	String.prototype.hasPrefix = function() { return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"); } ;
    }
    if (!String.prototype.trim) {
    	String.prototype.trim = function() { return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"); } ;
    }
    
    if (!String.prototype.toInt) {
    	String.prototype.toInt = function(base) { base = base || 10 ; var v = parseInt(this, base) ; return (isNaN(v) ? 0 : v) ; } ;
    }
    
    String.prototype.parseWithPatterns = function(patterns, returnFn) {
    	var i, pattern, res, aString = this.trim(), len = aString.length, count ;
    
    	if (len === 0 || !patterns || (count = patterns.length) == 0) { return null ; }
    	
    	returnFn = returnFn || function() { var i, r = [] ; for (i = 1; i < arguments.length; i++) { r.push(arguments[i]) ; } ; return r ; } ;
    
    	for (i = 0 ; i < count ; i++) {
    		pattern = patterns[i] ;
    		if ($ok(pattern.stringlen) && len != pattern.stringlen) { continue ; }
    		res = pattern.regex.exec(aString) ;
    		if (res) { console.log("Regex["+i+"] did appy...") ; return pattern.maker(res, returnFn) ; }
    	}
    
    	return null ;
    } ;
    
    String.__parseDatePatterns = [
    	// dd/mm/yyyy (European style)
    	{ regex: /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/, maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt(), a[3].toInt()) ; }},
    	// dd/mm/yy (short European style)
    	{ regex: /^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})$/, maker: function(a,cfn) { var d = new Date(), y = a[3].toInt() + 2000 ; if (y > d.getFullYear()) { y -= 100 ; } return cfn(a[1].toInt(), a[2].toInt(), y) ; }},
    	// dd/mm/yy (very short European style)
    	{ regex: /^(\d{1,2})\s*\/\s*(\d{1,2})\s*(\/)?$/, maker: function(a,cfn) { var d = new Date() ; return cfn(a[1].toInt(), a[2].toInt(), d.getFullYear()) ;}},
    	// yyyy/mm/dd (ISO style)
    	{ regex: /^(\d{4})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})$/, maker: function(a,cfn) { return cfn(a[3].toInt(), a[2].toInt(), a[1].toInt()) ; }},
    	// ddmmyyyy (Condensed European style)
    	{ regex: /^(\d{2})(\d{2})(\d{4})$/, stringlen:8, maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt(), a[3].toInt()) ; }},
    	// ddmmyy (Very condensed European style)
    	{ regex: /^(\d{2})(\d{2})(\d{2})$/, stringlen:6, maker: function(a,cfn) { var d = new Date() ; var y = a[3].toInt() + 2000 ; if (y > d.getFullYear()) { y -= 100 ; } return cfn(a[1].toInt(), a[2].toInt(), y) ;}},
    	// ddmm (Very Very condensed European style)
    	{ regex: /^(\d\d)(\d\d)$/, stringlen:4, maker: function(a,cfn) { var d = new Date() ; return cfn(a[1].toInt(), a[2].toInt(), d.getFullYear()) ; }},
    	// dd (Very Very Very condensed European style)
    	{ regex: /^(\d*)(\/)?$/, maker: function(a,cfn) { if (a[1].length > 2) { return null ; } var d = new Date() ; return cfn(a[1].toInt(), d.getMonth() + 1, d.getFullYear()) ;}}
    ] ;
    String.prototype.parseDate = function(fn) { return this.parseWithPatterns(String.__parseDatePatterns, fn || (function(d,m,y) { return Date.validDate(d,m,y) ? new Date(y, m-1, d) : null ; })) ; } ;
    
    String.__parseTimePatterns = [
    	//11:22 ou 11-22 ou 11h22 ou 11H22 + m or mn after
    	{ regex: /^(\d{1,2})\s*(?:\-|\:|h|H)\s*(\d{1,2})\s*(mn|m|MN|M)?$/, maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt()) ; }},
    	// hh mm
    	{ regex: /^(\d\d)\s+(\d\d)$/, maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt()) ; }},
    	// hhmm (Very Very military style)
    	{ regex: /^(\d\d)(\d\d)$/, stringlen:4, maker: function(a,cfn) { return cfn(a[1].toInt(), a[2].toInt()) ; }},
    	// hh (des heures) + (h)
    	{ regex: /^(\d*)\s*(h|H)?$/, maker: function(a,cfn) { if (a[1].length > 2) { return null ; } return cfn(a[1].toInt(), 0) ;}}
    ] ;
    String.prototype.parseTime = function(fn) { return this.parseWithPatterns(String.__parseTimePatterns, fn || (function(h,m) { return m >= 0 && m < 60 && h >= 0 && (h < 24 || (h == 24 && m == 0)) ? h*100+m : null ; })) ; } ;
    
    if (!String.prototype.removeDiacritics) {
    	String.prototype.removeDiacritics = function() {
    		var map = String.removeDiacriticsMap ;
    		return this.replace(/[^A-Za-z0-9]/g, function(x) { return map[x] || x; }) ;
    	};
    	String.removeDiacriticsMap = {
    	'Á': 'A',
    	'Ă': 'A',
    	'Ắ': 'A',
    	'Ặ': 'A',
    	'Ằ': 'A',
    	'Ẳ': 'A',
    	'Ẵ': 'A',
    	'Ǎ': 'A',
    	'Â': 'A',
    	'Ấ': 'A',
    	'Ậ': 'A',
    	'Ầ': 'A',
    	'Ẩ': 'A',
    	'Ẫ': 'A',
    	'Ä': 'A',
    	'Ǟ': 'A',
    	'Ȧ': 'A',
    	'Ǡ': 'A',
    	'Ạ': 'A',
    	'Ȁ': 'A',
    	'À': 'A',
    	'Ả': 'A',
    	'Ȃ': 'A',
    	'Ā': 'A',
    	'Ą': 'A',
    	'Å': 'A',
    	'Ǻ': 'A',
    	'Ḁ': 'A',
    	'Ⱥ': 'A',
    	'Ã': 'A',
    	'Ꜳ': 'AA',
    	'Æ': 'AE',
    	'Ǽ': 'AE',
    	'Ǣ': 'AE',
    	'Ꜵ': 'AO',
    	'Ꜷ': 'AU',
    	'Ꜹ': 'AV',
    	'Ꜻ': 'AV',
    	'Ꜽ': 'AY',
    	'Ḃ': 'B',
    	'Ḅ': 'B',
    	'Ɓ': 'B',
    	'Ḇ': 'B',
    	'Ƀ': 'B',
    	'Ƃ': 'B',
    	'Ć': 'C',
    	'Č': 'C',
    	'Ç': 'C',
    	'Ḉ': 'C',
    	'Ĉ': 'C',
    	'Ċ': 'C',
    	'Ƈ': 'C',
    	'Ȼ': 'C',
    	'Ď': 'D',
    	'Ḑ': 'D',
    	'Ḓ': 'D',
    	'Ḋ': 'D',
    	'Ḍ': 'D',
    	'Ɗ': 'D',
    	'Ḏ': 'D',
    	'ǲ': 'D',
    	'ǅ': 'D',
    	'Đ': 'D',
    	'Ƌ': 'D',
    	'Ǳ': 'DZ',
    	'Ǆ': 'DZ',
    	'É': 'E',
    	'Ĕ': 'E',
    	'Ě': 'E',
    	'Ȩ': 'E',
    	'Ḝ': 'E',
    	'Ê': 'E',
    	'Ế': 'E',
    	'Ệ': 'E',
    	'Ề': 'E',
    	'Ể': 'E',
    	'Ễ': 'E',
    	'Ḙ': 'E',
    	'Ë': 'E',
    	'Ė': 'E',
    	'Ẹ': 'E',
    	'Ȅ': 'E',
    	'È': 'E',
    	'Ẻ': 'E',
    	'Ȇ': 'E',
    	'Ē': 'E',
    	'Ḗ': 'E',
    	'Ḕ': 'E',
    	'Ę': 'E',
    	'Ɇ': 'E',
    	'Ẽ': 'E',
    	'Ḛ': 'E',
    	'Ꝫ': 'ET',
    	'Ḟ': 'F',
    	'Ƒ': 'F',
    	'Ǵ': 'G',
    	'Ğ': 'G',
    	'Ǧ': 'G',
    	'Ģ': 'G',
    	'Ĝ': 'G',
    	'Ġ': 'G',
    	'Ɠ': 'G',
    	'Ḡ': 'G',
    	'Ǥ': 'G',
    	'Ḫ': 'H',
    	'Ȟ': 'H',
    	'Ḩ': 'H',
    	'Ĥ': 'H',
    	'Ⱨ': 'H',
    	'Ḧ': 'H',
    	'Ḣ': 'H',
    	'Ḥ': 'H',
    	'Ħ': 'H',
    	'Í': 'I',
    	'Ĭ': 'I',
    	'Ǐ': 'I',
    	'Î': 'I',
    	'Ï': 'I',
    	'Ḯ': 'I',
    	'İ': 'I',
    	'Ị': 'I',
    	'Ȉ': 'I',
    	'Ì': 'I',
    	'Ỉ': 'I',
    	'Ȋ': 'I',
    	'Ī': 'I',
    	'Į': 'I',
    	'Ɨ': 'I',
    	'Ĩ': 'I',
    	'Ḭ': 'I',
    	'Ꝺ': 'D',
    	'Ꝼ': 'F',
    	'Ᵹ': 'G',
    	'Ꞃ': 'R',
    	'Ꞅ': 'S',
    	'Ꞇ': 'T',
    	'Ꝭ': 'IS',
    	'Ĵ': 'J',
    	'Ɉ': 'J',
    	'Ḱ': 'K',
    	'Ǩ': 'K',
    	'Ķ': 'K',
    	'Ⱪ': 'K',
    	'Ꝃ': 'K',
    	'Ḳ': 'K',
    	'Ƙ': 'K',
    	'Ḵ': 'K',
    	'Ꝁ': 'K',
    	'Ꝅ': 'K',
    	'Ĺ': 'L',
    	'Ƚ': 'L',
    	'Ľ': 'L',
    	'Ļ': 'L',
    	'Ḽ': 'L',
    	'Ḷ': 'L',
    	'Ḹ': 'L',
    	'Ⱡ': 'L',
    	'Ꝉ': 'L',
    	'Ḻ': 'L',
    	'Ŀ': 'L',
    	'Ɫ': 'L',
    	'ǈ': 'L',
    	'Ł': 'L',
    	'Ǉ': 'LJ',
    	'Ḿ': 'M',
    	'Ṁ': 'M',
    	'Ṃ': 'M',
    	'Ɱ': 'M',
    	'Ń': 'N',
    	'Ň': 'N',
    	'Ņ': 'N',
    	'Ṋ': 'N',
    	'Ṅ': 'N',
    	'Ṇ': 'N',
    	'Ǹ': 'N',
    	'Ɲ': 'N',
    	'Ṉ': 'N',
    	'Ƞ': 'N',
    	'ǋ': 'N',
    	'Ñ': 'N',
    	'Ǌ': 'NJ',
    	'Ó': 'O',
    	'Ŏ': 'O',
    	'Ǒ': 'O',
    	'Ô': 'O',
    	'Ố': 'O',
    	'Ộ': 'O',
    	'Ồ': 'O',
    	'Ổ': 'O',
    	'Ỗ': 'O',
    	'Ö': 'O',
    	'Ȫ': 'O',
    	'Ȯ': 'O',
    	'Ȱ': 'O',
    	'Ọ': 'O',
    	'Ő': 'O',
    	'Ȍ': 'O',
    	'Ò': 'O',
    	'Ỏ': 'O',
    	'Ơ': 'O',
    	'Ớ': 'O',
    	'Ợ': 'O',
    	'Ờ': 'O',
    	'Ở': 'O',
    	'Ỡ': 'O',
    	'Ȏ': 'O',
    	'Ꝋ': 'O',
    	'Ꝍ': 'O',
    	'Ō': 'O',
    	'Ṓ': 'O',
    	'Ṑ': 'O',
    	'Ɵ': 'O',
    	'Ǫ': 'O',
    	'Ǭ': 'O',
    	'Ø': 'O',
    	'Ǿ': 'O',
    	'Õ': 'O',
    	'Ṍ': 'O',
    	'Ṏ': 'O',
    	'Ȭ': 'O',
    	'Ƣ': 'OI',
    	'Ꝏ': 'OO',
    	'Ɛ': 'E',
    	'Ɔ': 'O',
    	'Ȣ': 'OU',
    	'Ṕ': 'P',
    	'Ṗ': 'P',
    	'Ꝓ': 'P',
    	'Ƥ': 'P',
    	'Ꝕ': 'P',
    	'Ᵽ': 'P',
    	'Ꝑ': 'P',
    	'Ꝙ': 'Q',
    	'Ꝗ': 'Q',
    	'Ŕ': 'R',
    	'Ř': 'R',
    	'Ŗ': 'R',
    	'Ṙ': 'R',
    	'Ṛ': 'R',
    	'Ṝ': 'R',
    	'Ȑ': 'R',
    	'Ȓ': 'R',
    	'Ṟ': 'R',
    	'Ɍ': 'R',
    	'Ɽ': 'R',
    	'Ꜿ': 'C',
    	'Ǝ': 'E',
    	'Ś': 'S',
    	'Ṥ': 'S',
    	'Š': 'S',
    	'Ṧ': 'S',
    	'Ş': 'S',
    	'Ŝ': 'S',
    	'Ș': 'S',
    	'Ṡ': 'S',
    	'Ṣ': 'S',
    	'Ṩ': 'S',
    	'ẞ': 'SS',
    	'Ť': 'T',
    	'Ţ': 'T',
    	'Ṱ': 'T',
    	'Ț': 'T',
    	'Ⱦ': 'T',
    	'Ṫ': 'T',
    	'Ṭ': 'T',
    	'Ƭ': 'T',
    	'Ṯ': 'T',
    	'Ʈ': 'T',
    	'Ŧ': 'T',
    	'Ɐ': 'A',
    	'Ꞁ': 'L',
    	'Ɯ': 'M',
    	'Ʌ': 'V',
    	'Ꜩ': 'TZ',
    	'Ú': 'U',
    	'Ŭ': 'U',
    	'Ǔ': 'U',
    	'Û': 'U',
    	'Ṷ': 'U',
    	'Ü': 'U',
    	'Ǘ': 'U',
    	'Ǚ': 'U',
    	'Ǜ': 'U',
    	'Ǖ': 'U',
    	'Ṳ': 'U',
    	'Ụ': 'U',
    	'Ű': 'U',
    	'Ȕ': 'U',
    	'Ù': 'U',
    	'Ủ': 'U',
    	'Ư': 'U',
    	'Ứ': 'U',
    	'Ự': 'U',
    	'Ừ': 'U',
    	'Ử': 'U',
    	'Ữ': 'U',
    	'Ȗ': 'U',
    	'Ū': 'U',
    	'Ṻ': 'U',
    	'Ų': 'U',
    	'Ů': 'U',
    	'Ũ': 'U',
    	'Ṹ': 'U',
    	'Ṵ': 'U',
    	'Ꝟ': 'V',
    	'Ṿ': 'V',
    	'Ʋ': 'V',
    	'Ṽ': 'V',
    	'Ꝡ': 'VY',
    	'Ẃ': 'W',
    	'Ŵ': 'W',
    	'Ẅ': 'W',
    	'Ẇ': 'W',
    	'Ẉ': 'W',
    	'Ẁ': 'W',
    	'Ⱳ': 'W',
    	'Ẍ': 'X',
    	'Ẋ': 'X',
    	'Ý': 'Y',
    	'Ŷ': 'Y',
    	'Ÿ': 'Y',
    	'Ẏ': 'Y',
    	'Ỵ': 'Y',
    	'Ỳ': 'Y',
    	'Ƴ': 'Y',
    	'Ỷ': 'Y',
    	'Ỿ': 'Y',
    	'Ȳ': 'Y',
    	'Ɏ': 'Y',
    	'Ỹ': 'Y',
    	'Ź': 'Z',
    	'Ž': 'Z',
    	'Ẑ': 'Z',
    	'Ⱬ': 'Z',
    	'Ż': 'Z',
    	'Ẓ': 'Z',
    	'Ȥ': 'Z',
    	'Ẕ': 'Z',
    	'Ƶ': 'Z',
    	'Ĳ': 'IJ',
    	'Œ': 'OE',
    	'ᴀ': 'A',
    	'ᴁ': 'AE',
    	'ʙ': 'B',
    	'ᴃ': 'B',
    	'ᴄ': 'C',
    	'ᴅ': 'D',
    	'ᴇ': 'E',
    	'ꜰ': 'F',
    	'ɢ': 'G',
    	'ʛ': 'G',
    	'ʜ': 'H',
    	'ɪ': 'I',
    	'ʁ': 'R',
    	'ᴊ': 'J',
    	'ᴋ': 'K',
    	'ʟ': 'L',
    	'ᴌ': 'L',
    	'ᴍ': 'M',
    	'ɴ': 'N',
    	'ᴏ': 'O',
    	'ɶ': 'OE',
    	'ᴐ': 'O',
    	'ᴕ': 'OU',
    	'ᴘ': 'P',
    	'ʀ': 'R',
    	'ᴎ': 'N',
    	'ᴙ': 'R',
    	'ꜱ': 'S',
    	'ᴛ': 'T',
    	'ⱻ': 'E',
    	'ᴚ': 'R',
    	'ᴜ': 'U',
    	'ᴠ': 'V',
    	'ᴡ': 'W',
    	'ʏ': 'Y',
    	'ᴢ': 'Z',
    	'á': 'a',
    	'ă': 'a',
    	'ắ': 'a',
    	'ặ': 'a',
    	'ằ': 'a',
    	'ẳ': 'a',
    	'ẵ': 'a',
    	'ǎ': 'a',
    	'â': 'a',
    	'ấ': 'a',
    	'ậ': 'a',
    	'ầ': 'a',
    	'ẩ': 'a',
    	'ẫ': 'a',
    	'ä': 'a',
    	'ǟ': 'a',
    	'ȧ': 'a',
    	'ǡ': 'a',
    	'ạ': 'a',
    	'ȁ': 'a',
    	'à': 'a',
    	'ả': 'a',
    	'ȃ': 'a',
    	'ā': 'a',
    	'ą': 'a',
    	'ᶏ': 'a',
    	'ẚ': 'a',
    	'å': 'a',
    	'ǻ': 'a',
    	'ḁ': 'a',
    	'ⱥ': 'a',
    	'ã': 'a',
    	'ꜳ': 'aa',
    	'æ': 'ae',
    	'ǽ': 'ae',
    	'ǣ': 'ae',
    	'ꜵ': 'ao',
    	'ꜷ': 'au',
    	'ꜹ': 'av',
    	'ꜻ': 'av',
    	'ꜽ': 'ay',
    	'ḃ': 'b',
    	'ḅ': 'b',
    	'ɓ': 'b',
    	'ḇ': 'b',
    	'ᵬ': 'b',
    	'ᶀ': 'b',
    	'ƀ': 'b',
    	'ƃ': 'b',
    	'ɵ': 'o',
    	'ć': 'c',
    	'č': 'c',
    	'ç': 'c',
    	'ḉ': 'c',
    	'ĉ': 'c',
    	'ɕ': 'c',
    	'ċ': 'c',
    	'ƈ': 'c',
    	'ȼ': 'c',
    	'ď': 'd',
    	'ḑ': 'd',
    	'ḓ': 'd',
    	'ȡ': 'd',
    	'ḋ': 'd',
    	'ḍ': 'd',
    	'ɗ': 'd',
    	'ᶑ': 'd',
    	'ḏ': 'd',
    	'ᵭ': 'd',
    	'ᶁ': 'd',
    	'đ': 'd',
    	'ɖ': 'd',
    	'ƌ': 'd',
    	'ı': 'i',
    	'ȷ': 'j',
    	'ɟ': 'j',
    	'ʄ': 'j',
    	'ǳ': 'dz',
    	'ǆ': 'dz',
    	'é': 'e',
    	'ĕ': 'e',
    	'ě': 'e',
    	'ȩ': 'e',
    	'ḝ': 'e',
    	'ê': 'e',
    	'ế': 'e',
    	'ệ': 'e',
    	'ề': 'e',
    	'ể': 'e',
    	'ễ': 'e',
    	'ḙ': 'e',
    	'ë': 'e',
    	'ė': 'e',
    	'ẹ': 'e',
    	'ȅ': 'e',
    	'è': 'e',
    	'ẻ': 'e',
    	'ȇ': 'e',
    	'ē': 'e',
    	'ḗ': 'e',
    	'ḕ': 'e',
    	'ⱸ': 'e',
    	'ę': 'e',
    	'ᶒ': 'e',
    	'ɇ': 'e',
    	'ẽ': 'e',
    	'ḛ': 'e',
    	'ꝫ': 'et',
    	'ḟ': 'f',
    	'ƒ': 'f',
    	'ᵮ': 'f',
    	'ᶂ': 'f',
    	'ǵ': 'g',
    	'ğ': 'g',
    	'ǧ': 'g',
    	'ģ': 'g',
    	'ĝ': 'g',
    	'ġ': 'g',
    	'ɠ': 'g',
    	'ḡ': 'g',
    	'ᶃ': 'g',
    	'ǥ': 'g',
    	'ḫ': 'h',
    	'ȟ': 'h',
    	'ḩ': 'h',
    	'ĥ': 'h',
    	'ⱨ': 'h',
    	'ḧ': 'h',
    	'ḣ': 'h',
    	'ḥ': 'h',
    	'ɦ': 'h',
    	'ẖ': 'h',
    	'ħ': 'h',
    	'ƕ': 'hv',
    	'í': 'i',
    	'ĭ': 'i',
    	'ǐ': 'i',
    	'î': 'i',
    	'ï': 'i',
    	'ḯ': 'i',
    	'ị': 'i',
    	'ȉ': 'i',
    	'ì': 'i',
    	'ỉ': 'i',
    	'ȋ': 'i',
    	'ī': 'i',
    	'į': 'i',
    	'ᶖ': 'i',
    	'ɨ': 'i',
    	'ĩ': 'i',
    	'ḭ': 'i',
    	'ꝺ': 'd',
    	'ꝼ': 'f',
    	'ᵹ': 'g',
    	'ꞃ': 'r',
    	'ꞅ': 's',
    	'ꞇ': 't',
    	'ꝭ': 'is',
    	'ǰ': 'j',
    	'ĵ': 'j',
    	'ʝ': 'j',
    	'ɉ': 'j',
    	'ḱ': 'k',
    	'ǩ': 'k',
    	'ķ': 'k',
    	'ⱪ': 'k',
    	'ꝃ': 'k',
    	'ḳ': 'k',
    	'ƙ': 'k',
    	'ḵ': 'k',
    	'ᶄ': 'k',
    	'ꝁ': 'k',
    	'ꝅ': 'k',
    	'ĺ': 'l',
    	'ƚ': 'l',
    	'ɬ': 'l',
    	'ľ': 'l',
    	'ļ': 'l',
    	'ḽ': 'l',
    	'ȴ': 'l',
    	'ḷ': 'l',
    	'ḹ': 'l',
    	'ⱡ': 'l',
    	'ꝉ': 'l',
    	'ḻ': 'l',
    	'ŀ': 'l',
    	'ɫ': 'l',
    	'ᶅ': 'l',
    	'ɭ': 'l',
    	'ł': 'l',
    	'ǉ': 'lj',
    	'ſ': 's',
    	'ẜ': 's',
    	'ẛ': 's',
    	'ẝ': 's',
    	'ḿ': 'm',
    	'ṁ': 'm',
    	'ṃ': 'm',
    	'ɱ': 'm',
    	'ᵯ': 'm',
    	'ᶆ': 'm',
    	'ń': 'n',
    	'ň': 'n',
    	'ņ': 'n',
    	'ṋ': 'n',
    	'ȵ': 'n',
    	'ṅ': 'n',
    	'ṇ': 'n',
    	'ǹ': 'n',
    	'ɲ': 'n',
    	'ṉ': 'n',
    	'ƞ': 'n',
    	'ᵰ': 'n',
    	'ᶇ': 'n',
    	'ɳ': 'n',
    	'ñ': 'n',
    	'ǌ': 'nj',
    	'ó': 'o',
    	'ŏ': 'o',
    	'ǒ': 'o',
    	'ô': 'o',
    	'ố': 'o',
    	'ộ': 'o',
    	'ồ': 'o',
    	'ổ': 'o',
    	'ỗ': 'o',
    	'ö': 'o',
    	'ȫ': 'o',
    	'ȯ': 'o',
    	'ȱ': 'o',
    	'ọ': 'o',
    	'ő': 'o',
    	'ȍ': 'o',
    	'ò': 'o',
    	'ỏ': 'o',
    	'ơ': 'o',
    	'ớ': 'o',
    	'ợ': 'o',
    	'ờ': 'o',
    	'ở': 'o',
    	'ỡ': 'o',
    	'ȏ': 'o',
    	'ꝋ': 'o',
    	'ꝍ': 'o',
    	'ⱺ': 'o',
    	'ō': 'o',
    	'ṓ': 'o',
    	'ṑ': 'o',
    	'ǫ': 'o',
    	'ǭ': 'o',
    	'ø': 'o',
    	'ǿ': 'o',
    	'õ': 'o',
    	'ṍ': 'o',
    	'ṏ': 'o',
    	'ȭ': 'o',
    	'ƣ': 'oi',
    	'ꝏ': 'oo',
    	'ɛ': 'e',
    	'ᶓ': 'e',
    	'ɔ': 'o',
    	'ᶗ': 'o',
    	'ȣ': 'ou',
    	'ṕ': 'p',
    	'ṗ': 'p',
    	'ꝓ': 'p',
    	'ƥ': 'p',
    	'ᵱ': 'p',
    	'ᶈ': 'p',
    	'ꝕ': 'p',
    	'ᵽ': 'p',
    	'ꝑ': 'p',
    	'ꝙ': 'q',
    	'ʠ': 'q',
    	'ɋ': 'q',
    	'ꝗ': 'q',
    	'ŕ': 'r',
    	'ř': 'r',
    	'ŗ': 'r',
    	'ṙ': 'r',
    	'ṛ': 'r',
    	'ṝ': 'r',
    	'ȑ': 'r',
    	'ɾ': 'r',
    	'ᵳ': 'r',
    	'ȓ': 'r',
    	'ṟ': 'r',
    	'ɼ': 'r',
    	'ᵲ': 'r',
    	'ᶉ': 'r',
    	'ɍ': 'r',
    	'ɽ': 'r',
    	'ↄ': 'c',
    	'ꜿ': 'c',
    	'ɘ': 'e',
    	'ɿ': 'r',
    	'ś': 's',
    	'ṥ': 's',
    	'š': 's',
    	'ṧ': 's',
    	'ş': 's',
    	'ŝ': 's',
    	'ș': 's',
    	'ṡ': 's',
    	'ṣ': 's',
    	'ṩ': 's',
    	'ʂ': 's',
    	'ᵴ': 's',
    	'ᶊ': 's',
    	'ȿ': 's',
    	'ß': 'ss',
    	'ɡ': 'g',
    	'ᴑ': 'o',
    	'ᴓ': 'o',
    	'ᴝ': 'u',
    	'ť': 't',
    	'ţ': 't',
    	'ṱ': 't',
    	'ț': 't',
    	'ȶ': 't',
    	'ẗ': 't',
    	'ⱦ': 't',
    	'ṫ': 't',
    	'ṭ': 't',
    	'ƭ': 't',
    	'ṯ': 't',
    	'ᵵ': 't',
    	'ƫ': 't',
    	'ʈ': 't',
    	'ŧ': 't',
    	'ᵺ': 'th',
    	'ɐ': 'a',
    	'ᴂ': 'ae',
    	'ǝ': 'e',
    	'ᵷ': 'g',
    	'ɥ': 'h',
    	'ʮ': 'h',
    	'ʯ': 'h',
    	'ᴉ': 'i',
    	'ʞ': 'k',
    	'ꞁ': 'l',
    	'ɯ': 'm',
    	'ɰ': 'm',
    	'ᴔ': 'oe',
    	'ɹ': 'r',
    	'ɻ': 'r',
    	'ɺ': 'r',
    	'ⱹ': 'r',
    	'ʇ': 't',
    	'ʌ': 'v',
    	'ʍ': 'w',
    	'ʎ': 'y',
    	'ꜩ': 'tz',
    	'ú': 'u',
    	'ŭ': 'u',
    	'ǔ': 'u',
    	'û': 'u',
    	'ṷ': 'u',
    	'ü': 'u',
    	'ǘ': 'u',
    	'ǚ': 'u',
    	'ǜ': 'u',
    	'ǖ': 'u',
    	'ṳ': 'u',
    	'ụ': 'u',
    	'ű': 'u',
    	'ȕ': 'u',
    	'ù': 'u',
    	'ủ': 'u',
    	'ư': 'u',
    	'ứ': 'u',
    	'ự': 'u',
    	'ừ': 'u',
    	'ử': 'u',
    	'ữ': 'u',
    	'ȗ': 'u',
    	'ū': 'u',
    	'ṻ': 'u',
    	'ų': 'u',
    	'ᶙ': 'u',
    	'ů': 'u',
    	'ũ': 'u',
    	'ṹ': 'u',
    	'ṵ': 'u',
    	'ᵫ': 'ue',
    	'ꝸ': 'um',
    	'ⱴ': 'v',
    	'ꝟ': 'v',
    	'ṿ': 'v',
    	'ʋ': 'v',
    	'ᶌ': 'v',
    	'ⱱ': 'v',
    	'ṽ': 'v',
    	'ꝡ': 'vy',
    	'ẃ': 'w',
    	'ŵ': 'w',
    	'ẅ': 'w',
    	'ẇ': 'w',
    	'ẉ': 'w',
    	'ẁ': 'w',
    	'ⱳ': 'w',
    	'ẘ': 'w',
    	'ẍ': 'x',
    	'ẋ': 'x',
    	'ᶍ': 'x',
    	'ý': 'y',
    	'ŷ': 'y',
    	'ÿ': 'y',
    	'ẏ': 'y',
    	'ỵ': 'y',
    	'ỳ': 'y',
    	'ƴ': 'y',
    	'ỷ': 'y',
    	'ỿ': 'y',
    	'ȳ': 'y',
    	'ẙ': 'y',
    	'ɏ': 'y',
    	'ỹ': 'y',
    	'ź': 'z',
    	'ž': 'z',
    	'ẑ': 'z',
    	'ʑ': 'z',
    	'ⱬ': 'z',
    	'ż': 'z',
    	'ẓ': 'z',
    	'ȥ': 'z',
    	'ẕ': 'z',
    	'ᵶ': 'z',
    	'ᶎ': 'z',
    	'ʐ': 'z',
    	'ƶ': 'z',
    	'ɀ': 'z',
    	'ﬀ': 'ff',
    	'ﬃ': 'ffi',
    	'ﬄ': 'ffl',
    	'ﬁ': 'fi',
    	'ﬂ': 'fl',
    	'ĳ': 'ij',
    	'œ': 'oe',
    	'ﬆ': 'st',
    	'ₐ': 'a',
    	'ₑ': 'e',
    	'ᵢ': 'i',
    	'ⱼ': 'j',
    	'ₒ': 'o',
    	'ᵣ': 'r',
    	'ᵤ': 'u',
    	'ᵥ': 'v',
    	'ₓ': 'x'
    	};
    }
    
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
    
    MSTools.parse = function () {
        return "test";
    };
	/*
		This file is a direct copy with some modifications of a part of the file 
		json2.js form M. Crockford. Thanks to him to release that as public domain.
		
		Obviously we keep it public domain here
	*/
	
	(function () {
	    'use strict';
	
	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }
	
	    if (typeof Date.prototype.toJSON !== 'function') {
	
	        Date.prototype.toJSON = function (key) {
	
	            return (isFinite(this.valueOf()) ?
	                this.getUTCFullYear()     + '-' +
	                    f(this.getUTCMonth() + 1) + '-' +
	                    f(this.getUTCDate())      + 'T' +
	                    f(this.getUTCHours())     + ':' +
	                    f(this.getUTCMinutes())   + ':' +
	                    f(this.getUTCSeconds())   + 'Z'
	                : null);
	        };
	
	        String.prototype.toJSON      =
	            Number.prototype.toJSON  =
	            Boolean.prototype.toJSON = function (key) {
	                return this.valueOf();
	            };
	    }
	
		// escapable was modified from initial json2.js in order to escape all control characters and all characters with diacritics signs
	    var escapable = /[\\\"\x00-\x1f\u007f-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '\"' : '\\"',
	            '\/' : '\\/',
	            '\\': '\\\\'
	        },
	        rep;
	
	
	    function quote(str) {
	
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.
	
	        escapable.lastIndex = 0;
	        return escapable.test(str) ? '"' + str.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string'
	                ? c
	                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + str + '"';
	    }
	
	
	    function str(key, holder) {
	
	// Produce a string from holder[key].
	
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];
	
	// If the value has a toJSON method, call it to obtain a replacement value.
	
	        if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	            value = value.toJSON(key);
	        }
	
	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.
	
	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }
	
	// What happens next depends on the value's type.
	
	        switch (typeof value) {
	        case 'string':
	            return quote(value);
	
	        case 'number':
	
	// JSON numbers must be finite. Encode non-finite numbers as null.
	
	            return isFinite(value) ? String(value) : 'null';
	
	        case 'boolean':
	        case 'null':
	
	// If the value is a boolean or null, convert it to a string. Note:
	// typeof null does not produce 'null'. The case is included here in
	// the remote chance that this gets fixed someday.
	
	            return String(value);
	
	// If the type is 'object', we might be dealing with an object or an array or
	// null.
	
	        case 'object':
	
	// Due to a specification blunder in ECMAScript, typeof null is 'object',
	// so watch out for that case.
	
	            if (!value) {
	                return 'null';
	            }
	
	// Make an array to hold the partial results of stringifying this object value.
	
	            gap += indent;
	            partial = [];
	
	// Is the value an array?
	
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	
	// The value is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.
	
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	
	// Join all of the elements together, separated with commas, and wrap them in
	// brackets.
	
	                v = partial.length === 0
	                    ? '[]'
	                    : gap
	                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
	                    : '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	
	// If the replacer is an array, use it to select the members to be stringified.
	
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {
	
	// Otherwise, iterate through all of the keys in the object.
	
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	
	// Join all of the member texts together, separated with commas,
	// and wrap them in braces.
	
	            v = partial.length === 0
	                ? '{}'
	                : gap
	                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
	                : '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }
	
	// If the JSON object does not yet have a stringify method, give it one.
	
	    if (typeof MSTools.stringify !== 'function') {
	        MSTools.stringify = function (value, replacer, space) {
	
	// The stringify method takes a value and an optional replacer, and an optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.
	
	            var i;
	            gap = '';
	            indent = '';
	
	// If the space parameter is a number, make an indent string containing that
	// many spaces.
	
	            if (typeof space === 'number') {
	                for (i = 0; i < space; i += 1) {
	                    indent += ' ';
	                }
	
	// If the space parameter is a string, it will be used as the indent string.
	
	            } else if (typeof space === 'string') {
	                indent = space;
	            }
	
	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.
	
	            rep = replacer;
	            if (replacer && typeof replacer !== 'function' &&
	                    (typeof replacer !== 'object' ||
	                    typeof replacer.length !== 'number')) {
	                throw new Error('MSTools.stringify');
	            }
	
	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.
	
	            return str('', {'': value});
	        };
	    }
	
	}());
	
	


    // TODO: export for node.js module and on-browser amd-style require()

    return MSTools;
})(this);

