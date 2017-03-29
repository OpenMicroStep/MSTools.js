const namedColors = {
    beige: '#f5f5dc',
    black: '#000000',
    blue: '#0000ff',
    brown: '#a52a2a',
    cyan: '#00ffff',
    fuchsia: '#ff00ff',
    gold: '#ffd700',
    gray: '#808080',
    green: '#008000',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    magenta: '#ff00ff',
    maroon: '#800000',
    olive: '#808000',
    orange: '#ffa500',
    pink: '#ffc0cb',
    purple: '#800080',
    red: '#ff0000',
    salmon: '#fa8072',
    silver: '#c0c0c0',
    snow: '#fffafa',
    teal: '#008080',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    yellow: '#ffff00'
};
function parse0to255(v: number) {
    if (v < 0 || v > 255 || Math.floor(v) !== v)
        throw new Error("invalid color value");
    return v;
}
function toHex(v: number) {
    let r= v.toString(16);
    return r.length < 2 ? "00".slice(0, 2 - r.length) + r : r;
}
const hexParsers = {
    4: {
        rx: /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
        mult: 16
    },
    7: {
        rx: /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        mult: 1
    },
    9: {
        rx: /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        mult: 1
    }
}
const HSBToRGB = [
    function (brightness, p, q, t) { return new MSColor(brightness, t, p) ; },
    function (brightness, p, q, t) { return new MSColor(q, brightness, p) ; },
    function (brightness, p, q, t) { return new MSColor(p, brightness, t) ; },
    function (brightness, p, q, t) { return new MSColor(p, q, brightness) ; },
    function (brightness, p, q, t) { return new MSColor(t, p, brightness) ; },
    function (brightness, p, q, t) { return new MSColor(brightness, p, q) ; },
    function (brightness, p, q, t) { return new MSColor(brightness, t, p) ; }
];

export class MSColor
{
    red: number;
    green: number;
    blue: number;
    alpha: number;

    /** create a new MSColor from either a name or the hex value (ex: blue, #AABBCC, #FFAABBCC) */
    constructor(color: string);
    constructor(msteencoded: number);
    constructor(r: number, g: number, b: number, a?: number);
    constructor(r,g?,b?,a?) {
        if (typeof r === 'string') {
            r = r.replace(/ /g,'') ;
            r = namedColors[r] || r;
            let parser = hexParsers[r.length];
            let m = parser && r.match(parser.rx);
            if (m) {
                this.red = parseInt(m[1], 16) * parser.mult;
                this.green = parseInt(m[2], 16) * parser.mult;
                this.blue = parseInt(m[3], 16) * parser.mult;
                this.alpha = m[4] ? parseInt(m[4], 16) * parser.mult : 255;
                return;
            }
            throw new Error("invalid color value");
        }
        else if (typeof r === 'number') {
            if (typeof g === 'number' && typeof b === 'number') {
                this.red = parse0to255(r);
                this.green = parse0to255(g);
                this.blue = parse0to255(b);
                this.alpha = typeof a === 'number' ? parse0to255(a) : 255;
                return;
            }
            else if (g === undefined) {
                // the 4 bytes contains the RTGB value TTRRGGBB where TT is the transparency (0 means opaque)
                this.alpha = 0xff - ((r >> 24) & 0xff) ;
                this.red = (r >> 16) & 0xff ;
                this.green = (r >> 8) & 0xff ;
                this.blue = r & 0xff ;
                return;
            }
        }
        throw new Error("invalid constructor parameters");
    }

    static lighter(X: number) { X /= 255.0 ; return Math.round((2.0*(X)*(X)/3.0+(X)/2.0+0.25)*255) ; }
    static darker(X) { X /= 255.0 ; return Math.round((-(X)*(X)/3+5.0*(X)/6.0)*255) ; }
    static colorWithHSB(o: {h: number, s: number, b: number});
    static colorWithHSB(hue: number, saturation: number, brightness: number);
    static colorWithHSB(hue: number | {h: number, s: number, b: number}, saturation?: number, brightness?: number) {
        if (typeof hue === "object" && "h" in hue && "s" in hue && "b" in hue) {
            brightness = hue.b;
            saturation = hue.s;
            hue = hue.h;
        }
        if (typeof brightness === "number" && typeof saturation === "number") {
            var i = (Math.max(0, Math.floor(<number>hue * 6))) % 7,
                f = (<number>hue * 6) - i,
                p = brightness * (1 - saturation),
                q = brightness * (1 - (saturation * f)),
                t = brightness * (1 - (saturation * (1 - f))) ;
            return HSBToRGB[i](brightness, p, q, t) ;
        }
        return MSColor.BLACK ;
    }

    static readonly RED = new MSColor(0xff,0,0);
    static readonly GREEN = new MSColor(0,0xff,0);
    static readonly YELLOW = new MSColor(0xff,0xff,0);
    static readonly BLUE = new MSColor(0,0,0xff);
    static readonly CYAN = new MSColor(0,0xff,0xff);
    static readonly MAGENTA = new MSColor(0xff,0,0xff);
    static readonly WHITE = new MSColor(0xff, 0xff, 0xff);
    static readonly BLACK = new MSColor(0,0,0);

    luminance () { return (0.3*this.red + 0.59*this.green +0.11*this.blue)/255.0 ; }
    isPale() { return this.luminance() > 0.6 ? true : false ; }

    lighterColor() { return new MSColor(MSColor.lighter(this.red), MSColor.lighter(this.green), MSColor.lighter(this.blue), this.alpha) ; }
    darkerColor() { return new MSColor(MSColor.darker(this.red), MSColor.darker(this.green), MSColor.darker(this.blue), this.alpha) ; }
    lightest() {
        return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha) ;
    }
    darkest() {
        return new MSColor(MSColor.darker(MSColor.darker(this.red)), MSColor.darker(MSColor.darker(this.green)), MSColor.darker(MSColor.darker(this.blue)), this.alpha) ;
    }
    matchingColor() { return this.isPale() ? this.darkest() : this.lightest() ; }
    toString() {
        return this.alpha === 255 ? '#'+toHex(this.red)+toHex(this.green)+toHex(this.blue) : "rgba("+this.red+","+this.green+","+this.blue+","+(this.alpha/255.0)+")" ;
    }
    toNumber() { return ((0xff - this.alpha) * 16777216) + (this.red * 65536) + (this.green * 256) + this.blue ;}
    toHSB() {
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
    }
    isEqualTo(other: any) {
        return other instanceof MSColor && this.isEqualToColor(other);
    }
    isEqualToColor(other: MSColor) {
        return this === other || (other && other.toNumber() === this.toNumber());
    }
    toJSON() { return this.toString(); }
}
