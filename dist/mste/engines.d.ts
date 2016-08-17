import { Decoder } from './decoder';
import { EncoderOptions } from './encoder';
export declare type Engine = {
    parsers: {
        [t: number]: (decoder: Decoder) => any;
    };
    parse_dictionary_into: (decoder: Decoder, into: any) => void;
    tokenize: (object: any, options?: EncoderOptions) => (string | number)[];
    classIndex: (code) => number;
    version: string;
    versionCode: number;
};
export declare const ENGINES: Engine[];
export declare function crc32inMSTEformat(mstestring: string): string;
