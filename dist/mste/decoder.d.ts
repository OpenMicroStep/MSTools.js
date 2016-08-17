import { Engine } from './engines';
export declare type DecoderOptions = {
    classes?: {
        [s: string]: {
            new (): any;
        };
    } | null;
    crc?: boolean;
};
export declare class Decoder {
    checkCRC: boolean;
    keys: string[];
    tokens: (number | string)[];
    classes: string[];
    objects: any[];
    refs: any[];
    index: number;
    correspondances: {
        [s: string]: {
            new (): any;
        };
    };
    engine: Engine;
    constructor({classes, crc}?: DecoderOptions);
    parse(parse_src: string | (string | number)[]): any;
    nextToken(): number | string;
    pushRef<T>(v: T): T;
    parseItem(): any;
}
export declare function parse(source: string | (string | number)[], options?: DecoderOptions): any;
