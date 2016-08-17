export declare class MSColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    /** create a new MSColor from either a name or the hex value (ex: blue, #AABBCC, #FFAABBCC) */
    constructor(color: string);
    constructor(msteencoded: number);
    constructor(r: number, g: number, b: number, a?: number);
    static lighter(X: number): number;
    static darker(X: any): number;
    static colorWithHSB(o: {
        h: number;
        s: number;
        b: number;
    }): any;
    static colorWithHSB(hue: number, saturation: number, brightness: number): any;
    static readonly RED: MSColor;
    static readonly GREEN: MSColor;
    static readonly YELLOW: MSColor;
    static readonly BLUE: MSColor;
    static readonly CYAN: MSColor;
    static readonly MAGENTA: MSColor;
    static readonly WHITE: MSColor;
    static readonly BLACK: MSColor;
    luminance(): number;
    isPale(): boolean;
    lighterColor(): MSColor;
    darkerColor(): MSColor;
    lightest(): MSColor;
    darkest(): MSColor;
    matchingColor(): MSColor;
    toString(): string;
    toNumber(): number;
    toHSB(): {
        h: number;
        s: number;
        b: number;
    };
    isEqualTo(other: any): boolean;
    isEqualToColor(other: MSColor): boolean;
    toJSON(): string;
}
