// ================ class interface ====================
function MSColor(r,g,b,a)
{
    if (typeof r === 'string') {
        var s, bits, ok = true ;
        r = r.replace(/ /g,'') ;
        if (!$length(r)) { ok = false ; }
        if (ok && r.charAt(0) === '#') { r = r.substr(1); }
        if (ok && $length(r) < 3) { ok = false ; }
        if (ok) {
            r = r.toLowerCase();
            s = MSColor.namedColors[r] ;

            bits = MSColor.colorStringRegex.exec(s?s:r);
            if ($length(bits) !== 4) {
                bits = MSColor.shortColorStringRegex.exec(s?s:r);
                if ($length(bits) !== 4) { ok = false ; }
            }
            if (ok) {
                this.red = parseInt(bits[1], 16) & 255 ;
                this.green =  parseInt(bits[2], 16) & 255 ;
                this.blue =  parseInt(bits[3], 16) & 255 ;
            }
        }
        if (!ok) {
            this.red = this.green = this.blue = 0 ;
        }
        this.alpha = 255 ;
    }
    else {
        r = r.toUInt() ;
        if ($ok(g) && $ok(b)) {
            this.red = r & 255 ;
            this.green = g.toUInt() & 255 ;
            this.blue = b.toUInt() & 255 ;
            this.alpha = $ok(a) ? a.toUInt() & 255 : 255 ;
        }
        // should we throw if we only have two args ?
        else {
            // the 4 bytes contains the RTGB value TTRRGGBB where TT is the transparency (0 means opaque)
            this.alpha = 0xff - ((r >> 24) & 0xff) ;
            this.red = (r >> 16) & 0xff ;
            this.green = (r >> 8) & 0xff ;
            this.blue = r & 0xff ;
        }
    }
}

// ================ constants ====================
MSTools.defineConstants(MSColor,{
    RED:new MSColor(0xff,0,0),
    GREEN:new MSColor(0,0xff,0),
    YELLOW:new MSColor(0xff,0xff,0),
    BLUE:new MSColor(0,0,0xff),
    CYAN:new MSColor(0,0xff,0xff),
    MAGENTA:new MSColor(0xff,0,0xff),
    WHITE:new MSColor(0xff, 0xff, 0xff),
    BLACK:new MSColor(0,0,0)
}, true) ;

MSTools.defineHiddenConstants(MSColor, {
    colorStringRegex:/^(\w{2})(\w{2})(\w{2})$/,
    shortColorStringRegex:/^(\w{1})(\w{1})(\w{1})$/,
    namedColors:{
        beige: 'f5f5dc',
        black: '000000',
        blue: '0000ff',
        brown: 'a52a2a',
        cyan: '00ffff',
        fuchsia: 'ff00ff',
        gold: 'ffd700',
        gray: '808080',
        green: '008000',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        magenta: 'ff00ff',
        maroon: '800000',
        olive: '808000',
        orange: 'ffa500',
        pink: 'ffc0cb',
        purple: '800080',
        red: 'ff0000',
        salmon: 'fa8072',
        silver: 'c0c0c0',
        snow: 'fffafa',
        teal: '008080',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        wheat: 'f5deb3',
        white: 'ffffff',
        yellow: 'ffff00'
    },
    HSBToRGB:[
        function (brightness, p, q, t) { return new MSColor(brightness, t, p) ; },
        function (brightness, p, q, t) { return new MSColor(q, brightness, p) ; },
        function (brightness, p, q, t) { return new MSColor(p, brightness, t) ; },
        function (brightness, p, q, t) { return new MSColor(p, q, brightness) ; },
        function (brightness, p, q, t) { return new MSColor(t, p, brightness) ; },
        function (brightness, p, q, t) { return new MSColor(brightness, p, q) ; },
        function (brightness, p, q, t) { return new MSColor(brightness, t, p) ; }
    ]

}, true) ;

MSTools.defineHiddenConstant(MSColor.prototype,'isa', 'Color', true) ;

// ================= class methods ===============
MSTools.defineMethods(MSColor, {
    lighter: function(X) { X /= 255.0 ; return Math.round((2.0*(X)*(X)/3.0+(X)/2.0+0.25)*255) ; },
    darker: function(X) { X /= 255.0 ; return Math.round((-(X)*(X)/3+5.0*(X)/6.0)*255) ; },
    initWithHSB: function(hue, saturation, brightness) {
        if (typeof hue === "object" && "h" in hue && "s" in hue && "b" in hue) {
            brightness = hue.b;
            saturation = hue.s;
            hue = hue.h;
        }
        if (brightness !== 0) {
            var i = (Math.max(0, Math.floor(hue * 6))) % 7,
                f = (hue * 6) - i,
                p = brightness * (1 - saturation),
                q = brightness * (1 - (saturation * f)),
                t = brightness * (1 - (saturation * (1 - f))) ;
            return MSColor.HSBToRGB[i](brightness, p, q, t) ;
        }
        return MSColor.BLACK ;
    }
}, true) ;

// ================  instance methods =============
MSTools.defineInstanceMethods(MSColor, {
    luminance:function () { return (0.3*this.red + 0.59*this.green +0.11*this.blue)/255.0 ; },
    isPale:function() { return this.luminance() > 0.6 ? true : false ; },

    lighterColor: function() { return new MSColor(MSColor.lighter(this.red), MSColor.lighter(this.green), MSColor.lighter(this.blue), this.alpha) ; },
    darkerColor: function() { return new MSColor(MSColor.darker(this.red), MSColor.darker(this.green), MSColor.darker(this.blue), this.alpha) ; },
    lightest: function() {
        return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha) ;
    },
    darkest: function() {
        return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha) ;
    },
    matchingColor:function() { return this.isPale() ? this.darkestColor() : MSColor.whiteColor ; },
    toString:function() {
        return this.alpha === 255 ? '#'+this.red.toHexa(2)+this.green.toHexa(2)+this.blue.toHexa(2) : "rgba("+this.red+","+this.green+","+this.blue+","+(this.alpha/255.0)+")" ;
    },
    toNumber:function() { return ((0xff - this.alpha) * 16777216) + (this.red * 65536) + (this.green * 256) + this.blue ;},
    toInt:function() { return (this.red * 65536) + (this.green * 256) + this.blue ; }, // the toInt function does not use the transparency because it should overflow the signed 32 bits
    toRGBA:function() { return (this.red * 16777216) + (this.green*65536) + (this.blue * 256) + this.alpha ;},
    toHSB:function() {
        var red = this.red / 255, green = this.green / 255, blue = this.blue / 255 ;
        var max = Math.max(red, green, blue), min = Math.min(red, green, blue) ;
        var hue = 0, saturation = 0, brightness = max ;
        if (min < max) {
            var delta = (max - min);
            saturation = delta / max;
            if (red === max) { hue = (green - blue) / delta ; }
            else if (green === max) { hue = 2 + ((blue - red) / delta) ; }
            else { hue = 4 + ((red - green) / delta); }
            hue /= 6;
            if (hue < 0) { hue += 1 ; }
            if (hue > 1) { hue -= 1 ; }
        }
        return {h: hue, s: saturation, b: brightness} ;
    },
    isEqualTo: function(other, options) {
        if (this === other) { return true ; }
        return $ok(other) && this.isa === other.isa && this.toRGBA() === other.toRGBA() ? true : false ;
    },
    toArray: function() { return [this.red, this.green, this.blue, this.alpha] ; },
    toMSTE: function(encoder) {
        if (encoder.shouldPushObject(this)) {
            var v, i, count = this.length ;
            encoder.push(23) ;
            encoder.push(this.toNumber()) ;
        }
    }
}, true) ;

MSTools.defineInstanceMethods(MSColor,{
    toUInt:MSColor.prototype.toNumber,
    valueOf:MSColor.prototype.toNumber
}, true) ;

