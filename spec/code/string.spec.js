describe("==========Tests du package string========", function() {
	    var testDiacritics = [
	    'Á','A',
	    'Ă','A',
	    'Ắ','A',
	    'Ặ','A',
	    'Ằ','A',
	    'Ẳ','A',
	    'Ẵ','A',
	    'Ǎ','A',
	    'Â','A',
	    'Ấ','A',
	    'Ậ','A',
	    'Ầ','A',
	    'Ẩ','A',
	    'Ẫ','A',
	    'Ä','A',
	    'Ǟ','A',
	    'Ȧ','A',
	    'Ǡ','A',
	    'Ạ','A',
	    'Ȁ','A',
	    'À','A',
	    'Ả','A',
	    'Ȃ','A',
	    'Ā','A',
	    'Ą','A',
	    'Å','A',
	    'Ǻ','A',
	    'Ḁ','A',
	    'Ⱥ','A',
	    'Ã','A',
	    'Ꜳ','AA',
	    'Æ','AE',
	    'Ǽ','AE',
	    'Ǣ','AE',
	    'Ꜵ','AO',
	    'Ꜷ','AU',
	    'Ꜹ','AV',
	    'Ꜻ','AV',
	    'Ꜽ','AY',
	    'Ḃ','B',
	    'Ḅ','B',
	    'Ɓ','B',
	    'Ḇ','B',
	    'Ƀ','B',
	    'Ƃ','B',
	    'Ć','C',
	    'Č','C',
	    'Ç','C',
	    'Ḉ','C',
	    'Ĉ','C',
	    'Ċ','C',
	    'Ƈ','C',
	    'Ȼ','C',
	    'Ď','D',
	    'Ḑ','D',
	    'Ḓ','D',
	    'Ḋ','D',
	    'Ḍ','D',
	    'Ɗ','D',
	    'Ḏ','D',
	    'ǲ','Dz',
	    'ǅ','Dz',
	    'Đ','D',
	    'Ƌ','D',
	    'Ǳ','DZ',
	    'Ǆ','DZ',
	    'É','E',
	    'Ĕ','E',
	    'Ě','E',
	    'Ȩ','E',
	    'Ḝ','E',
	    'Ê','E',
	    'Ế','E',
	    'Ệ','E',
	    'Ề','E',
	    'Ể','E',
	    'Ễ','E',
	    'Ḙ','E',
	    'Ë','E',
	    'Ė','E',
	    'Ẹ','E',
	    'Ȅ','E',
	    'È','E',
	    'Ẻ','E',
	    'Ȇ','E',
	    'Ē','E',
	    'Ḗ','E',
	    'Ḕ','E',
	    'Ę','E',
	    'Ɇ','E',
	    'Ẽ','E',
	    'Ḛ','E',
	    'Ꝫ','ET',
	    'Ḟ','F',
	    'Ƒ','F',
	    'Ǵ','G',
	    'Ğ','G',
	    'Ǧ','G',
	    'Ģ','G',
	    'Ĝ','G',
	    'Ġ','G',
	    'Ɠ','G',
	    'Ḡ','G',
	    'Ǥ','G',
	    'Ḫ','H',
	    'Ȟ','H',
	    'Ḩ','H',
	    'Ĥ','H',
	    'Ⱨ','H',
	    'Ḧ','H',
	    'Ḣ','H',
	    'Ḥ','H',
	    'Ħ','H',
	    'Í','I',
	    'Ĭ','I',
	    'Ǐ','I',
	    'Î','I',
	    'Ï','I',
	    'Ḯ','I',
	    'İ','I',
	    'Ị','I',
	    'Ȉ','I',
	    'Ì','I',
	    'Ỉ','I',
	    'Ȋ','I',
	    'Ī','I',
	    'Į','I',
	    'Ɨ','I',
	    'Ĩ','I',
	    'Ḭ','I',
	    'Ꝺ','D',
	    'Ꝼ','F',
	    'Ᵹ','G',
	    'Ꞃ','R',
	    'Ꞅ','S',
	    'Ꞇ','T',
	    'Ꝭ','IS',
	    'Ĵ','J',
	    'Ɉ','J',
	    'Ḱ','K',
	    'Ǩ','K',
	    'Ķ','K',
	    'Ⱪ','K',
	    'Ꝃ','K',
	    'Ḳ','K',
	    'Ƙ','K',
	    'Ḵ','K',
	    'Ꝁ','K',
	    'Ꝅ','K',
	    'Ĺ','L',
	    'Ƚ','L',
	    'Ľ','L',
	    'Ļ','L',
	    'Ḽ','L',
	    'Ḷ','L',
	    'Ḹ','L',
	    'Ⱡ','L',
	    'Ꝉ','L',
	    'Ḻ','L',
	    'Ŀ','L',
	    'Ɫ','L',
	    'ǈ','Lj',
	    'Ł','L',
	    'Ǉ','LJ',
	    'Ḿ','M',
	    'Ṁ','M',
	    'Ṃ','M',
	    'Ɱ','M',
	    'Ń','N',
	    'Ň','N',
	    'Ņ','N',
	    'Ṋ','N',
	    'Ṅ','N',
	    'Ṇ','N',
	    'Ǹ','N',
	    'Ɲ','N',
	    'Ṉ','N',
	    'Ƞ','N',
	    'ǋ','Nj',
	    'Ñ','N',
	    'Ǌ','NJ',
	    'Ó','O',
	    'Ŏ','O',
	    'Ǒ','O',
	    'Ô','O',
	    'Ố','O',
	    'Ộ','O',
	    'Ồ','O',
	    'Ổ','O',
	    'Ỗ','O',
	    'Ö','O',
	    'Ȫ','O',
	    'Ȯ','O',
	    'Ȱ','O',
	    'Ọ','O',
	    'Ő','O',
	    'Ȍ','O',
	    'Ò','O',
	    'Ỏ','O',
	    'Ơ','O',
	    'Ớ','O',
	    'Ợ','O',
	    'Ờ','O',
	    'Ở','O',
	    'Ỡ','O',
	    'Ȏ','O',
	    'Ꝋ','O',
	    'Ꝍ','O',
	    'Ō','O',
	    'Ṓ','O',
	    'Ṑ','O',
	    'Ɵ','O',
	    'Ǫ','O',
	    'Ǭ','O',
	    'Ø','O',
	    'Ǿ','O',
	    'Õ','O',
	    'Ṍ','O',
	    'Ṏ','O',
	    'Ȭ','O',
	    'Ƣ','OI',
	    'Ꝏ','OO',
	    'Ɛ','E',
	    'Ɔ','O',
	    'Ȣ','OU',
	    'Ṕ','P',
	    'Ṗ','P',
	    'Ꝓ','P',
	    'Ƥ','P',
	    'Ꝕ','P',
	    'Ᵽ','P',
	    'Ꝑ','P',
	    'Ꝙ','Q',
	    'Ꝗ','Q',
	    'Ŕ','R',
	    'Ř','R',
	    'Ŗ','R',
	    'Ṙ','R',
	    'Ṛ','R',
	    'Ṝ','R',
	    'Ȑ','R',
	    'Ȓ','R',
	    'Ṟ','R',
	    'Ɍ','R',
	    'Ɽ','R',
	    'Ꜿ','C',
	    'Ǝ','E',
	    'Ś','S',
	    'Ṥ','S',
	    'Š','S',
	    'Ṧ','S',
	    'Ş','S',
	    'Ŝ','S',
	    'Ș','S',
	    'Ṡ','S',
	    'Ṣ','S',
	    'Ṩ','S',
	    'ẞ','SS',
	    'Ť','T',
	    'Ţ','T',
	    'Ṱ','T',
	    'Ț','T',
	    'Ⱦ','T',
	    'Ṫ','T',
	    'Ṭ','T',
	    'Ƭ','T',
	    'Ṯ','T',
	    'Ʈ','T',
	    'Ŧ','T',
	    'Ɐ','A',
	    'Ꞁ','L',
	    'Ɯ','M',
	    'Ʌ','V',
	    'Ꜩ','TZ',
	    'Ú','U',
	    'Ŭ','U',
	    'Ǔ','U',
	    'Û','U',
	    'Ṷ','U',
	    'Ü','U',
	    'Ǘ','U',
	    'Ǚ','U',
	    'Ǜ','U',
	    'Ǖ','U',
	    'Ṳ','U',
	    'Ụ','U',
	    'Ű','U',
	    'Ȕ','U',
	    'Ù','U',
	    'Ủ','U',
	    'Ư','U',
	    'Ứ','U',
	    'Ự','U',
	    'Ừ','U',
	    'Ử','U',
	    'Ữ','U',
	    'Ȗ','U',
	    'Ū','U',
	    'Ṻ','U',
	    'Ų','U',
	    'Ů','U',
	    'Ũ','U',
	    'Ṹ','U',
	    'Ṵ','U',
	    'Ꝟ','V',
	    'Ṿ','V',
	    'Ʋ','V',
	    'Ṽ','V',
	    'Ꝡ','VY',
	    'Ẃ','W',
	    'Ŵ','W',
	    'Ẅ','W',
	    'Ẇ','W',
	    'Ẉ','W',
	    'Ẁ','W',
	    'Ⱳ','W',
	    'Ẍ','X',
	    'Ẋ','X',
	    'Ý','Y',
	    'Ŷ','Y',
	    'Ÿ','Y',
	    'Ẏ','Y',
	    'Ỵ','Y',
	    'Ỳ','Y',
	    'Ƴ','Y',
	    'Ỷ','Y',
	    'Ỿ','Y',
	    'Ȳ','Y',
	    'Ɏ','Y',
	    'Ỹ','Y',
	    'Ź','Z',
	    'Ž','Z',
	    'Ẑ','Z',
	    'Ⱬ','Z',
	    'Ż','Z',
	    'Ẓ','Z',
	    'Ȥ','Z',
	    'Ẕ','Z',
	    'Ƶ','Z',
	    'Ĳ','IJ',
	    'Œ','OE',
	    'ᴀ','A',
	    'ᴁ','AE',
	    'ʙ','B',
	    'ᴃ','B',
	    'ᴄ','C',
	    'ᴅ','D',
	    'ᴇ','E',
	    'ꜰ','F',
	    'ɢ','G',
	    'ʛ','G',
	    'ʜ','H',
	    'ɪ','I',
	    'ʁ','R',
	    'ᴊ','J',
	    'ᴋ','K',
	    'ʟ','L',
	    'ᴌ','L',
	    'ᴍ','M',
	    'ɴ','N',
	    'ᴏ','O',
	    'ɶ','OE',
	    'ᴐ','O',
	    'ᴕ','OU',
	    'ᴘ','P',
	    'ʀ','R',
	    'ᴎ','N',
	    'ᴙ','R',
	    'ꜱ','S',
	    'ᴛ','T',
	    'ⱻ','E',
	    'ᴚ','R',
	    'ᴜ','U',
	    'ᴠ','V',
	    'ᴡ','W',
	    'ʏ','Y',
	    'ᴢ','Z',
	    'á','a',
	    'ă','a',
	    'ắ','a',
	    'ặ','a',
	    'ằ','a',
	    'ẳ','a',
	    'ẵ','a',
	    'ǎ','a',
	    'â','a',
	    'ấ','a',
	    'ậ','a',
	    'ầ','a',
	    'ẩ','a',
	    'ẫ','a',
	    'ä','a',
	    'ǟ','a',
	    'ȧ','a',
	    'ǡ','a',
	    'ạ','a',
	    'ȁ','a',
	    'à','a',
	    'ả','a',
	    'ȃ','a',
	    'ā','a',
	    'ą','a',
	    'ᶏ','a',
	    'ẚ','a',
	    'å','a',
	    'ǻ','a',
	    'ḁ','a',
	    'ⱥ','a',
	    'ã','a',
	    'ꜳ','aa',
	    'æ','ae',
	    'ǽ','ae',
	    'ǣ','ae',
	    'ꜵ','ao',
	    'ꜷ','au',
	    'ꜹ','av',
	    'ꜻ','av',
	    'ꜽ','ay',
	    'ḃ','b',
	    'ḅ','b',
	    'ɓ','b',
	    'ḇ','b',
	    'ᵬ','b',
	    'ᶀ','b',
	    'ƀ','b',
	    'ƃ','b',
	    'ɵ','o',
	    'ć','c',
	    'č','c',
	    'ç','c',
	    'ḉ','c',
	    'ĉ','c',
	    'ɕ','c',
	    'ċ','c',
	    'ƈ','c',
	    'ȼ','c',
	    'ď','d',
	    'ḑ','d',
	    'ḓ','d',
	    'ȡ','d',
	    'ḋ','d',
	    'ḍ','d',
	    'ɗ','d',
	    'ᶑ','d',
	    'ḏ','d',
	    'ᵭ','d',
	    'ᶁ','d',
	    'đ','d',
	    'ɖ','d',
	    'ƌ','d',
	    'ı','i',
	    'ȷ','j',
	    'ɟ','j',
	    'ʄ','j',
	    'ǳ','dz',
	    'ǆ','dz',
	    'é','e',
	    'ĕ','e',
	    'ě','e',
	    'ȩ','e',
	    'ḝ','e',
	    'ê','e',
	    'ế','e',
	    'ệ','e',
	    'ề','e',
	    'ể','e',
	    'ễ','e',
	    'ḙ','e',
	    'ë','e',
	    'ė','e',
	    'ẹ','e',
	    'ȅ','e',
	    'è','e',
	    'ẻ','e',
	    'ȇ','e',
	    'ē','e',
	    'ḗ','e',
	    'ḕ','e',
	    'ⱸ','e',
	    'ę','e',
	    'ᶒ','e',
	    'ɇ','e',
	    'ẽ','e',
	    'ḛ','e',
	    'ꝫ','et',
	    'ḟ','f',
	    'ƒ','f',
	    'ᵮ','f',
	    'ᶂ','f',
	    'ǵ','g',
	    'ğ','g',
	    'ǧ','g',
	    'ģ','g',
	    'ĝ','g',
	    'ġ','g',
	    'ɠ','g',
	    'ḡ','g',
	    'ᶃ','g',
	    'ǥ','g',
	    'ḫ','h',
	    'ȟ','h',
	    'ḩ','h',
	    'ĥ','h',
	    'ⱨ','h',
	    'ḧ','h',
	    'ḣ','h',
	    'ḥ','h',
	    'ɦ','h',
	    'ẖ','h',
	    'ħ','h',
	    'ƕ','hv',
	    'í','i',
	    'ĭ','i',
	    'ǐ','i',
	    'î','i',
	    'ï','i',
	    'ḯ','i',
	    'ị','i',
	    'ȉ','i',
	    'ì','i',
	    'ỉ','i',
	    'ȋ','i',
	    'ī','i',
	    'į','i',
	    'ᶖ','i',
	    'ɨ','i',
	    'ĩ','i',
	    'ḭ','i',
	    'ꝺ','d',
	    'ꝼ','f',
	    'ᵹ','g',
	    'ꞃ','r',
	    'ꞅ','s',
	    'ꞇ','t',
	    'ꝭ','is',
	    'ǰ','j',
	    'ĵ','j',
	    'ʝ','j',
	    'ɉ','j',
	    'ḱ','k',
	    'ǩ','k',
	    'ķ','k',
	    'ⱪ','k',
	    'ꝃ','k',
	    'ḳ','k',
	    'ƙ','k',
	    'ḵ','k',
	    'ᶄ','k',
	    'ꝁ','k',
	    'ꝅ','k',
	    'ĺ','l',
	    'ƚ','l',
	    'ɬ','l',
	    'ľ','l',
	    'ļ','l',
	    'ḽ','l',
	    'ȴ','l',
	    'ḷ','l',
	    'ḹ','l',
	    'ⱡ','l',
	    'ꝉ','l',
	    'ḻ','l',
	    'ŀ','l',
	    'ɫ','l',
	    'ᶅ','l',
	    'ɭ','l',
	    'ł','l',
	    'ǉ','lj',
	    'ſ','s',
	    'ẜ','s',
	    'ẛ','s',
	    'ẝ','s',
	    'ḿ','m',
	    'ṁ','m',
	    'ṃ','m',
	    'ɱ','m',
	    'ᵯ','m',
	    'ᶆ','m',
	    'ń','n',
	    'ň','n',
	    'ņ','n',
	    'ṋ','n',
	    'ȵ','n',
	    'ṅ','n',
	    'ṇ','n',
	    'ǹ','n',
	    'ɲ','n',
	    'ṉ','n',
	    'ƞ','n',
	    'ᵰ','n',
	    'ᶇ','n',
	    'ɳ','n',
	    'ñ','n',
	    'ǌ','nj',
	    'ó','o',
	    'ŏ','o',
	    'ǒ','o',
	    'ô','o',
	    'ố','o',
	    'ộ','o',
	    'ồ','o',
	    'ổ','o',
	    'ỗ','o',
	    'ö','o',
	    'ȫ','o',
	    'ȯ','o',
	    'ȱ','o',
	    'ọ','o',
	    'ő','o',
	    'ȍ','o',
	    'ò','o',
	    'ỏ','o',
	    'ơ','o',
	    'ớ','o',
	    'ợ','o',
	    'ờ','o',
	    'ở','o',
	    'ỡ','o',
	    'ȏ','o',
	    'ꝋ','o',
	    'ꝍ','o',
	    'ⱺ','o',
	    'ō','o',
	    'ṓ','o',
	    'ṑ','o',
	    'ǫ','o',
	    'ǭ','o',
	    'ø','o',
	    'ǿ','o',
	    'õ','o',
	    'ṍ','o',
	    'ṏ','o',
	    'ȭ','o',
	    'ƣ','oi',
	    'ꝏ','oo',
	    'ɛ','e',
	    'ᶓ','e',
	    'ɔ','o',
	    'ᶗ','o',
	    'ȣ','ou',
	    'ṕ','p',
	    'ṗ','p',
	    'ꝓ','p',
	    'ƥ','p',
	    'ᵱ','p',
	    'ᶈ','p',
	    'ꝕ','p',
	    'ᵽ','p',
	    'ꝑ','p',
	    'ꝙ','q',
	    'ʠ','q',
	    'ɋ','q',
	    'ꝗ','q',
	    'ŕ','r',
	    'ř','r',
	    'ŗ','r',
	    'ṙ','r',
	    'ṛ','r',
	    'ṝ','r',
	    'ȑ','r',
	    'ɾ','r',
	    'ᵳ','r',
	    'ȓ','r',
	    'ṟ','r',
	    'ɼ','r',
	    'ᵲ','r',
	    'ᶉ','r',
	    'ɍ','r',
	    'ɽ','r',
	    'ↄ','c',
	    'ꜿ','c',
	    'ɘ','e',
	    'ɿ','r',
	    'ś','s',
	    'ṥ','s',
	    'š','s',
	    'ṧ','s',
	    'ş','s',
	    'ŝ','s',
	    'ș','s',
	    'ṡ','s',
	    'ṣ','s',
	    'ṩ','s',
	    'ʂ','s',
	    'ᵴ','s',
	    'ᶊ','s',
	    'ȿ','s',
	    'ß','ss',
	    'ɡ','g',
	    'ᴑ','o',
	    'ᴓ','o',
	    'ᴝ','u',
	    'ť','t',
	    'ţ','t',
	    'ṱ','t',
	    'ț','t',
	    'ȶ','t',
	    'ẗ','t',
	    'ⱦ','t',
	    'ṫ','t',
	    'ṭ','t',
	    'ƭ','t',
	    'ṯ','t',
	    'ᵵ','t',
	    'ƫ','t',
	    'ʈ','t',
	    'ŧ','t',
	    'ᵺ','th',
	    'ɐ','a',
	    'ᴂ','ae',
	    'ǝ','e',
	    'ᵷ','g',
	    'ɥ','h',
	    'ʮ','h',
	    'ʯ','h',
	    'ᴉ','i',
	    'ʞ','k',
	    'ꞁ','l',
	    'ɯ','m',
	    'ɰ','m',
	    'ᴔ','oe',
	    'ɹ','r',
	    'ɻ','r',
	    'ɺ','r',
	    'ⱹ','r',
	    'ʇ','t',
	    'ʌ','v',
	    'ʍ','w',
	    'ʎ','y',
	    'ꜩ','tz',
	    'ú','u',
	    'ŭ','u',
	    'ǔ','u',
	    'û','u',
	    'ṷ','u',
	    'ü','u',
	    'ǘ','u',
	    'ǚ','u',
	    'ǜ','u',
	    'ǖ','u',
	    'ṳ','u',
	    'ụ','u',
	    'ű','u',
	    'ȕ','u',
	    'ù','u',
	    'ủ','u',
	    'ư','u',
	    'ứ','u',
	    'ự','u',
	    'ừ','u',
	    'ử','u',
	    'ữ','u',
	    'ȗ','u',
	    'ū','u',
	    'ṻ','u',
	    'ų','u',
	    'ᶙ','u',
	    'ů','u',
	    'ũ','u',
	    'ṹ','u',
	    'ṵ','u',
	    'ᵫ','ue',
	    'ꝸ','um',
	    'ⱴ','v',
	    'ꝟ','v',
	    'ṿ','v',
	    'ʋ','v',
	    'ᶌ','v',
	    'ⱱ','v',
	    'ṽ','v',
	    'ꝡ','vy',
	    'ẃ','w',
	    'ŵ','w',
	    'ẅ','w',
	    'ẇ','w',
	    'ẉ','w',
	    'ẁ','w',
	    'ⱳ','w',
	    'ẘ','w',
	    'ẍ','x',
	    'ẋ','x',
	    'ᶍ','x',
	    'ý','y',
	    'ŷ','y',
	    'ÿ','y',
	    'ẏ','y',
	    'ỵ','y',
	    'ỳ','y',
	    'ƴ','y',
	    'ỷ','y',
	    'ỿ','y',
	    'ȳ','y',
	    'ẙ','y',
	    'ɏ','y',
	    'ỹ','y',
	    'ź','z',
	    'ž','z',
	    'ẑ','z',
	    'ʑ','z',
	    'ⱬ','z',
	    'ż','z',
	    'ẓ','z',
	    'ȥ','z',
	    'ẕ','z',
	    'ᵶ','z',
	    'ᶎ','z',
	    'ʐ','z',
	    'ƶ','z',
	    'ɀ','z',
	    'ﬀ','ff',
	    'ﬃ','ffi',
	    'ﬄ','ffl',
	    'ﬁ','fi',
	    'ﬂ','fl',
	    'ĳ','ij',
	    'œ','oe',
	    'ﬆ','st',
	    'ₐ','a',
	    'ₑ','e',
	    'ᵢ','i',
	    'ⱼ','j',
	    'ₒ','o',
	    'ᵣ','r',
	    'ᵤ','u',
	    'ᵥ','v',
	    'ₓ','x'
];
	
	it("Testing toASCII() on first 65533 unicode characters", function() {
		var c, allchars = [], s,r ;
		
		function _isAscii(s) {
			var i, l = s.length, c, n = 0 ;
			for (i = 0 ; i < l ; i++) {
				c = s.charCodeAt(i) ; 
				if (c > 0x7f && c !== 0xfffd) {
					console.log('Character unicode "'+String.fromCharCode(c)+'" ('+c+') at position '+i) ;
					n++ ; 
				}
			}
			return n > 0 ? false : true ; 
		}
		
		for (c = 0 ; c < 65533 ; c ++) { allchars.push(String.fromCharCode(c)) ; }
		s = allchars.join('').toASCII("\ufffd") ;
		expect(_isAscii(s)).toBe(true);
	}) ;
	it("Testing toASCII() method with other conversion table", function() {
		var i, count = testDiacritics.length ;	
        expect(typeof String.prototype.toASCII).toBe("function");
		for (i = 0 ; i < count ; i += 2) {
			var rac = MSTools.stringify(testDiacritics[i]) ;
	        expect(rac+' '+testDiacritics[i].toASCII()).toBe(rac+' '+testDiacritics[i+1]);
		}
    });					

	it("Testing toASCII() method with a vietnamese text", function() {
		expect("Mọi người đều có quyền tự do ngôn luận và bầy tỏ quan điểm".toASCII()).toBe("Moi nguoi deu co quyen tu do ngon luan va bay to quan diem") ;
	});

	it("Testing toASCII() method with a hawaiian text", function() {
		expect("Ua noa i nā kānaka apau ke kūʻokoʻa o ka manaʻo a me ka hōʻike ʻana i ka manaʻo".toASCII()).toBe("Ua noa i na kanaka apau ke ku'oko'a o ka mana'o a me ka ho'ike 'ana i ka mana'o") ;
	});

	it("Testing toASCII() method with a ewe text", function() {
		expect("Amesiame kpɔ mɔ abu tame le eɖokui si eye wòaɖe eƒe susu agblɔ faa mɔxexe manɔmee".toASCII()).toBe("Amesiame kpo mo abu tame le edokui si eye woade efe susu agblo faa moxexe manomee") ;
	});

	it("Testing toASCII() method with a long polish text", function() {
		expect(
			"Marek jest w galerii sztuki. On stoi przy ścianie i patrzy na obraz. Marek patrzy na obraz od kilku minut. Obraz wisi na ścianie. Obok obrazu wiszą tabliczki z informacją. Jedna tabliczka jest po polsku a druga jest po angielsku. Ściana jest biała a obraz jest kolorowy. Na obrazie są: niebieskie niebo, szare chmury i zielona łąka pokryta kolorowymi plamami. Kolorowe plamy to kwiaty. Kwiaty są wszędzie i mają różne kolory: czerwony, żółty, pomarańczowy, fioletowy i różowy. Pośrodku łąki rośnie drzewo. Drzewo jest duże i stare. Pod drzewem stoją małe dzieci, dziewczynka i chłopiec. Dzieci patrzą na drzewo. Na drzewie siedzi kot. Kot patrzy na dzieci.".toASCII()).toBe(
			"Marek jest w galerii sztuki. On stoi przy scianie i patrzy na obraz. Marek patrzy na obraz od kilku minut. Obraz wisi na scianie. Obok obrazu wisza tabliczki z informacja. Jedna tabliczka jest po polsku a druga jest po angielsku. Sciana jest biala a obraz jest kolorowy. Na obrazie sa: niebieskie niebo, szare chmury i zielona laka pokryta kolorowymi plamami. Kolorowe plamy to kwiaty. Kwiaty sa wszedzie i maja rozne kolory: czerwony, zolty, pomaranczowy, fioletowy i rozowy. Posrodku laki rosnie drzewo. Drzewo jest duze i stare. Pod drzewem stoja male dzieci, dziewczynka i chlopiec. Dzieci patrza na drzewo. Na drzewie siedzi kot. Kot patrzy na dzieci.") ;
	});
			
	it("Testing toASCII() method with long danish lirics", function() {
		expect(
			"Der er et yndigt land, det står med brede bøge nær salten østerstrand :| Det bugter sig i bakke, dal, det hedder gamle Danmark og det er Frejas sal :| Der sad i fordums tid de harniskklædte kæmper, udhvilede fra strid :| Så drog de frem til fjenders mén, nu hvile deres bene bag højens bautasten :| Det land endnu er skønt, thi blå sig søen bælter, og løvet står så grønt :| Og ædle kvinder, skønne møer og mænd og raske svende bebo de danskes øer :| Hil drot og fædreland! Hil hver en danneborger, som virker, hvad han kan! :| Vort gamle Danmark skal bestå, så længe bøgen spejler sin top i bølgen blå :|".toASCII()).toBe(
			"Der er et yndigt land, det star med brede boge naer salten osterstrand :| Det bugter sig i bakke, dal, det hedder gamle Danmark og det er Frejas sal :| Der sad i fordums tid de harniskklaedte kaemper, udhvilede fra strid :| Sa drog de frem til fjenders men, nu hvile deres bene bag hojens bautasten :| Det land endnu er skont, thi bla sig soen baelter, og lovet star sa gront :| Og aedle kvinder, skonne moer og maend og raske svende bebo de danskes oer :| Hil drot og faedreland! Hil hver en danneborger, som virker, hvad han kan! :| Vort gamle Danmark skal besta, sa laenge bogen spejler sin top i bolgen bla :|") ;
	});
    
	// never '===' on date objects. it fails
	it("Testing parseDate() method", function() {
		expect("01/01/2001".parseDate().toInt()).toBe(20010101) ;
		expect(" 01 /  01   /   2001     ".parseDate().toInt()).toBe(20010101) ;
		expect("1/1/1".parseDate().toInt()).toBe(20010101) ;
		expect("21".parseDate().toInt()).toBe((new Date(Date.currentYear(), Date.currentMonth(), 21)).toInt()) ;
		expect("3012".parseDate().toInt()).toBe((new Date(Date.currentYear(), 11, 30)).toInt()) ;
		expect("170608".parseDate().toInt()).toBe(20080617) ;
		expect("30122013".parseDate().toInt()).toBe(20131230) ;
		expect(" 13 / 04".parseDate().toInt()).toBe((new Date(Date.currentYear(), 03, 13)).toInt()) ;
		expect(" 13 / 04 /".parseDate().toInt()).toBe((new Date(Date.currentYear(), 03, 13)).toInt()) ;
		expect("2002 / 07 / 06 ".parseDate().toInt()).toBe(20020706) ;
		expect("13:04".parseDate()).toBe(null) ;
	});

	it("Testing UTF8 conversion method", function() {
		var us = "0020   SPACE\n0021 ! EXCLAMATION MARK\n0022 \" QUOTATION MARK\n0023 # NUMBER SIGN\n0024 $ DOLLAR SIGN\n0025 % PERCENT SIGN\n0026 & AMPERSAND\n0027 ' APOSTROPHE\n0028 ( LEFT PARENTHESIS\n0029 ) RIGHT PARENTHESIS\n002A * ASTERISK\n002B + PLUS SIGN\n002C , COMMA\n002D - HYPHEN-MINUS\n002E . FULL STOP\n002F / SOLIDUS\n0030 0 DIGIT ZERO\n0031 1 DIGIT ONE\n0032 2 DIGIT TWO\n0033 3 DIGIT THREE\n0034 4 DIGIT FOUR\n0035 5 DIGIT FIVE\n0036 6 DIGIT SIX\n0037 7 DIGIT SEVEN\n0038 8 DIGIT EIGHT\n0039 9 DIGIT NINE\n003A : COLON\n003B ; SEMICOLON\n003C < LESS-THAN SIGN\n003D = EQUALS SIGN\n003E > GREATER-THAN SIGN\n003F ? QUESTION MARK\n0040 @ COMMERCIAL AT\n0041 A LATIN CAPITAL LETTER A\n0042 B LATIN CAPITAL LETTER B\n0043 C LATIN CAPITAL LETTER C\n0044 D LATIN CAPITAL LETTER D\n0045 E LATIN CAPITAL LETTER E\n0046 F LATIN CAPITAL LETTER F\n0047 G LATIN CAPITAL LETTER G\n0048 H LATIN CAPITAL LETTER H\n0049 I LATIN CAPITAL LETTER I\n004A J LATIN CAPITAL LETTER J\n004B K LATIN CAPITAL LETTER K\n004C L LATIN CAPITAL LETTER L\n004D M LATIN CAPITAL LETTER M\n004E N LATIN CAPITAL LETTER N\n004F O LATIN CAPITAL LETTER O\n0050 P LATIN CAPITAL LETTER P\n0051 Q LATIN CAPITAL LETTER Q\n0052 R LATIN CAPITAL LETTER R\n0053 S LATIN CAPITAL LETTER S\n0054 T LATIN CAPITAL LETTER T\n0055 U LATIN CAPITAL LETTER U\n0056 V LATIN CAPITAL LETTER V\n0057 W LATIN CAPITAL LETTER W\n0058 X LATIN CAPITAL LETTER X\n0059 Y LATIN CAPITAL LETTER Y\n005A Z LATIN CAPITAL LETTER Z\n005B [ LEFT SQUARE BRACKET\n005C \ REVERSE SOLIDUS\n005D ] RIGHT SQUARE BRACKET\n005E ^ CIRCUMFLEX ACCENT\n005F _ LOW LINE\n0060 ` GRAVE ACCENT\n0061 a LATIN SMALL LETTER A\n0062 b LATIN SMALL LETTER B\n0063 c LATIN SMALL LETTER C\n0064 d LATIN SMALL LETTER D\n0065 e LATIN SMALL LETTER E\n0066 f LATIN SMALL LETTER F\n0067 g LATIN SMALL LETTER G\n0068 h LATIN SMALL LETTER H\n0069 i LATIN SMALL LETTER I\n006A j LATIN SMALL LETTER J\n006B k LATIN SMALL LETTER K\n006C l LATIN SMALL LETTER L\n006D m LATIN SMALL LETTER M\n006E n LATIN SMALL LETTER N\n006F o LATIN SMALL LETTER O\n0070 p LATIN SMALL LETTER P\n0071 q LATIN SMALL LETTER Q\n0072 r LATIN SMALL LETTER R\n0073 s LATIN SMALL LETTER S\n0074 t LATIN SMALL LETTER T\n0075 u LATIN SMALL LETTER U\n0076 v LATIN SMALL LETTER V\n0077 w LATIN SMALL LETTER W\n0078 x LATIN SMALL LETTER X\n0079 y LATIN SMALL LETTER Y\n007A z LATIN SMALL LETTER Z\n007B { LEFT CURLY BRACKET\n007C | VERTICAL LINE\n007D } RIGHT CURLY BRACKET\n007E ~ TILDE\n00A0   NO-BREAK SPACE\n00A1 ¡ INVERTED EXCLAMATION MARK\n00A2 ¢ CENT SIGN\n00A3 £ POUND SIGN\n00A4 ¤ CURRENCY SIGN\n00A5 ¥ YEN SIGN\n00A6 ¦ BROKEN BAR\n00A7 § SECTION SIGN\n00A8 ¨ DIAERESIS\n00A9 © COPYRIGHT SIGN\n00AA ª FEMININE ORDINAL INDICATOR\n00AB « LEFT-POINTING DOUBLE ANGLE QUOTATION MARK\n00AC ¬ NOT SIGN\n00AD ­ SOFT HYPHEN\n00AE ® REGISTERED SIGN\n00AF ¯ MACRON\n00B0 ° DEGREE SIGN\n00B1 ± PLUS-MINUS SIGN\n00B2 ² SUPERSCRIPT TWO\n00B3 ³ SUPERSCRIPT THREE\n00B4 ´ ACUTE ACCENT\n00B5 µ MICRO SIGN\n00B6 ¶ PILCROW SIGN\n00B7 · MIDDLE DOT\n00B8 ¸ CEDILLA\n00B9 ¹ SUPERSCRIPT ONE\n00BA º MASCULINE ORDINAL INDICATOR\n00BB » RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK\n00BC ¼ VULGAR FRACTION ONE QUARTER\n00BD ½ VULGAR FRACTION ONE HALF\n00BE ¾ VULGAR FRACTION THREE QUARTERS\n00BF ¿ INVERTED QUESTION MARK\n00C0 À LATIN CAPITAL LETTER A WITH GRAVE\n00C1 Á LATIN CAPITAL LETTER A WITH ACUTE\n00C2 Â LATIN CAPITAL LETTER A WITH CIRCUMFLEX\n00C3 Ã LATIN CAPITAL LETTER A WITH TILDE\n00C4 Ä LATIN CAPITAL LETTER A WITH DIAERESIS\n00C5 Å LATIN CAPITAL LETTER A WITH RING ABOVE\n00C6 Æ LATIN CAPITAL LETTER AE\n00C7 Ç LATIN CAPITAL LETTER C WITH CEDILLA\n00C8 È LATIN CAPITAL LETTER E WITH GRAVE\n00C9 É LATIN CAPITAL LETTER E WITH ACUTE\n00CA Ê LATIN CAPITAL LETTER E WITH CIRCUMFLEX\n00CB Ë LATIN CAPITAL LETTER E WITH DIAERESIS\n00CC Ì LATIN CAPITAL LETTER I WITH GRAVE\n00CD Í LATIN CAPITAL LETTER I WITH ACUTE\n00CE Î LATIN CAPITAL LETTER I WITH CIRCUMFLEX\n00CF Ï LATIN CAPITAL LETTER I WITH DIAERESIS\n00D0 Ð LATIN CAPITAL LETTER ETH\n00D1 Ñ LATIN CAPITAL LETTER N WITH TILDE\n00D2 Ò LATIN CAPITAL LETTER O WITH GRAVE\n00D3 Ó LATIN CAPITAL LETTER O WITH ACUTE\n00D4 Ô LATIN CAPITAL LETTER O WITH CIRCUMFLEX\n00D5 Õ LATIN CAPITAL LETTER O WITH TILDE\n00D6 Ö LATIN CAPITAL LETTER O WITH DIAERESIS\n00D7 × MULTIPLICATION SIGN\n00D8 Ø LATIN CAPITAL LETTER O WITH STROKE\n00D9 Ù LATIN CAPITAL LETTER U WITH GRAVE\n00DA Ú LATIN CAPITAL LETTER U WITH ACUTE\n00DB Û LATIN CAPITAL LETTER U WITH CIRCUMFLEX\n00DC Ü LATIN CAPITAL LETTER U WITH DIAERESIS\n00DD Ý LATIN CAPITAL LETTER Y WITH ACUTE\n00DE Þ LATIN CAPITAL LETTER THORN\n00DF ß LATIN SMALL LETTER SHARP S\n00E0 à LATIN SMALL LETTER A WITH GRAVE\n00E1 á LATIN SMALL LETTER A WITH ACUTE\n00E2 â LATIN SMALL LETTER A WITH CIRCUMFLEX\n00E3 ã LATIN SMALL LETTER A WITH TILDE\n00E4 ä LATIN SMALL LETTER A WITH DIAERESIS\n00E5 å LATIN SMALL LETTER A WITH RING ABOVE\n00E6 æ LATIN SMALL LETTER AE\n00E7 ç LATIN SMALL LETTER C WITH CEDILLA\n00E8 è LATIN SMALL LETTER E WITH GRAVE\n00E9 é LATIN SMALL LETTER E WITH ACUTE\n00EA ê LATIN SMALL LETTER E WITH CIRCUMFLEX\n00EB ë LATIN SMALL LETTER E WITH DIAERESIS\n00EC ì LATIN SMALL LETTER I WITH GRAVE\n00ED í LATIN SMALL LETTER I WITH ACUTE\n00EE î LATIN SMALL LETTER I WITH CIRCUMFLEX\n00EF ï LATIN SMALL LETTER I WITH DIAERESIS\n00F0 ð LATIN SMALL LETTER ETH\n00F1 ñ LATIN SMALL LETTER N WITH TILDE\n00F2 ò LATIN SMALL LETTER O WITH GRAVE\n00F3 ó LATIN SMALL LETTER O WITH ACUTE\n00F4 ô LATIN SMALL LETTER O WITH CIRCUMFLEX\n00F5 õ LATIN SMALL LETTER O WITH TILDE\n00F6 ö LATIN SMALL LETTER O WITH DIAERESIS\n00F7 ÷ DIVISION SIGN\n00F8 ø LATIN SMALL LETTER O WITH STROKE\n00F9 ù LATIN SMALL LETTER U WITH GRAVE\n00FA ú LATIN SMALL LETTER U WITH ACUTE\n00FB û LATIN SMALL LETTER U WITH CIRCUMFLEX\n00FC ü LATIN SMALL LETTER U WITH DIAERESIS\n00FD ý LATIN SMALL LETTER Y WITH ACUTE\n00FE þ LATIN SMALL LETTER THORN\n00FF ÿ LATIN SMALL LETTER Y WITH DIAERESIS\n0102 Ă LATIN CAPITAL LETTER A WITH BREVE\n0103 ă LATIN SMALL LETTER A WITH BREVE\n0104 Ą LATIN CAPITAL LETTER A WITH OGONEK\n0105 ą LATIN SMALL LETTER A WITH OGONEK\n0106 Ć LATIN CAPITAL LETTER C WITH ACUTE\n0107 ć LATIN SMALL LETTER C WITH ACUTE\n010C Č LATIN CAPITAL LETTER C WITH CARON\n010D č LATIN SMALL LETTER C WITH CARON\n010E Ď LATIN CAPITAL LETTER D WITH CARON\n010F ď LATIN SMALL LETTER D WITH CARON\n0110 Đ LATIN CAPITAL LETTER D WITH STROKE\n0111 đ LATIN SMALL LETTER D WITH STROKE\n0118 Ę LATIN CAPITAL LETTER E WITH OGONEK\n0119 ę LATIN SMALL LETTER E WITH OGONEK\n011A Ě LATIN CAPITAL LETTER E WITH CARON\n011B ě LATIN SMALL LETTER E WITH CARON\n0139 Ĺ LATIN CAPITAL LETTER L WITH ACUTE\n013A ĺ LATIN SMALL LETTER L WITH ACUTE\n013D Ľ LATIN CAPITAL LETTER L WITH CARON\n013E ľ LATIN SMALL LETTER L WITH CARON\n0141 Ł LATIN CAPITAL LETTER L WITH STROKE\n0142 ł LATIN SMALL LETTER L WITH STROKE\n0143 Ń LATIN CAPITAL LETTER N WITH ACUTE\n0144 ń LATIN SMALL LETTER N WITH ACUTE\n0147 Ň LATIN CAPITAL LETTER N WITH CARON\n0148 ň LATIN SMALL LETTER N WITH CARON\n0150 Ő LATIN CAPITAL LETTER O WITH DOUBLE ACUTE\n0151 ő LATIN SMALL LETTER O WITH DOUBLE ACUTE\n0152 Œ LATIN CAPITAL LIGATURE OE\n0153 œ LATIN SMALL LIGATURE OE\n0154 Ŕ LATIN CAPITAL LETTER R WITH ACUTE\n0155 ŕ LATIN SMALL LETTER R WITH ACUTE\n0158 Ř LATIN CAPITAL LETTER R WITH CARON\n0159 ř LATIN SMALL LETTER R WITH CARON\n015A Ś LATIN CAPITAL LETTER S WITH ACUTE\n015B ś LATIN SMALL LETTER S WITH ACUTE\n015E Ş LATIN CAPITAL LETTER S WITH CEDILLA\n015F ş LATIN SMALL LETTER S WITH CEDILLA\n0160 Š LATIN CAPITAL LETTER S WITH CARON\n0161 š LATIN SMALL LETTER S WITH CARON\n0162 Ţ LATIN CAPITAL LETTER T WITH CEDILLA\n0163 ţ LATIN SMALL LETTER T WITH CEDILLA\n0164 Ť LATIN CAPITAL LETTER T WITH CARON\n0165 ť LATIN SMALL LETTER T WITH CARON\n016E Ů LATIN CAPITAL LETTER U WITH RING ABOVE\n016F ů LATIN SMALL LETTER U WITH RING ABOVE\n0170 Ű LATIN CAPITAL LETTER U WITH DOUBLE ACUTE\n0171 ű LATIN SMALL LETTER U WITH DOUBLE ACUTE\n0178 Ÿ LATIN CAPITAL LETTER Y WITH DIAERESIS\n0179 Ź LATIN CAPITAL LETTER Z WITH ACUTE\n017A ź LATIN SMALL LETTER Z WITH ACUTE\n017B Ż LATIN CAPITAL LETTER Z WITH DOT ABOVE\n017C ż LATIN SMALL LETTER Z WITH DOT ABOVE\n017D Ž LATIN CAPITAL LETTER Z WITH CARON\n017E ž LATIN SMALL LETTER Z WITH CARON\n0192 ƒ LATIN SMALL LETTER F WITH HOOK\n02C6 ˆ MODIFIER LETTER CIRCUMFLEX ACCENT\n02C7 ˇ CARON\n02D8 ˘ BREVE\n02D9 ˙ DOT ABOVE\n02DB ˛ OGONEK\n02DC ˜ SMALL TILDE\n02DD ˝ DOUBLE ACUTE ACCENT\n2013 – EN DASH\n2014 — EM DASH\n2018 ‘ LEFT SINGLE QUOTATION MARK\n2019 ’ RIGHT SINGLE QUOTATION MARK\n201A ‚ SINGLE LOW-9 QUOTATION MARK\n201C “ LEFT DOUBLE QUOTATION MARK\n201D ” RIGHT DOUBLE QUOTATION MARK\n201E „ DOUBLE LOW-9 QUOTATION MARK\n2020 † DAGGER\n2021 ‡ DOUBLE DAGGER\n2022 • BULLET\n2026 … HORIZONTAL ELLIPSIS\n2030 ‰ PER MILLE SIGN\n2039 ‹ SINGLE LEFT-POINTING ANGLE QUOTATION MARK\n203A › SINGLE RIGHT-POINTING ANGLE QUOTATION MARK\n20AC € EURO SIGN\n2122 ™ TRADE MARK SIGN" ;
		var s, d, i = us.indexOf("0160") ;
		expect(us.charAt(i+5)).toBe('\u0160') ; // testing the fact that source code is in UTF8
		d = us.toUTF8Data() ;
		s = String.initWithUTF8Data(d) ;
		expect(s).toBe(us) ; // testing encoding / decoding UTF8
	});
	
}) ;
