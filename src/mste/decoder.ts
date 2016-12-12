import {Engine, ENGINES, crc32inMSTEformat} from './engines';
declare var console;
export type DecoderOptions = {
    classes?: { [s:string]: { new (): any; } } | null,
    crc?: boolean
}

export interface MSTEDecodable extends Object {
    initWithMSTEDictionary(dictionary: { [s: string]: any }): void;
}

export class Decoder {
    checkCRC: boolean ;
    keys: string[];
    tokens: (number | string)[];
    classes: string[];
    objects: any[];
    refs: any[];
    index: number;
    correspondances: { [s:string]: { new (): any; } };
    engine: Engine;

    constructor({ classes = null, crc = true }: DecoderOptions = {}) {
        this.correspondances = classes || {};
        this.checkCRC = !!crc;
    }

    parse(parse_src: string | (string | number)[]) {
        this.keys = [] ;
        this.classes = [] ;
        this.objects = [] ;
        this.refs = [] ;
        this.index = 0 ;

        const source = <(number|string)[]>(typeof parse_src === 'string' ? JSON.parse(parse_src) : parse_src);
        if (!source || typeof source.length !== "number" || source.length < 4)
            throw new Error("two few tokens") ;
        this.tokens = source;
        const n = source.length;
        const version = this.nextToken();
        if (typeof version !== 'string' || !/^MSTE[0-9]{4}$/.test(version))
            throw new Error("the first token must be the version string") ;
        let engine = ENGINES.find((e) => e.version === version);
        if (!engine)
            throw new Error("no valid engine for version: " + version) ;
        this.engine = engine;

        const count = this.nextToken();
        if (typeof count !== 'number')
            throw new Error("the second token must be the number of token") ;
        if (count !== n)
            throw new Error("bad control count") ;

        const crc = this.nextToken();
        if (typeof crc !== 'string' || !/^CRC[0-9A-F]{8}$/.test(crc))
            throw new Error("the third token must be the crc string") ;
        if (this.checkCRC && typeof parse_src === "string" && crc !== 'CRC00000000') {
            if (crc32inMSTEformat(parse_src.replace(crc, 'CRC00000000')) !== crc)
              throw new Error("crc verification failed") ;
        }

        let classCount = <number>this.nextToken();
        if (typeof classCount !== 'number')
            throw new Error("the 4th token must be the number of classes") ;
        classCount += this.index;
        if (1 + classCount > n)
            throw new Error("not enough tokens to store classes and the root object") ;
        while (this.index < classCount) {
            let className = this.nextToken();
            if (typeof className !== 'string')
                throw new Error(`class name must be a string`) ;
            this.classes.push(className);
        }

        let keyCount = <number>this.nextToken()!;
        if (typeof keyCount !== 'number')
            throw new Error("the key count token must be a number") ;
        keyCount += this.index;
        if (1 + keyCount > n)
            throw new Error("not enough tokens to store keys and the root object") ;
        while (this.index < keyCount) {
            let keyName = this.nextToken();
            if (typeof keyName !== 'string')
                throw new Error(`key name must be a string`) ;
            this.keys.push(keyName);
        }

        return this.parseItem();
    }

    nextToken() {
        if (this.index < this.tokens.length)
            return this.tokens[this.index++];
        throw new Error("not enough tokens");
    }

    pushRef<T>(v: T) : T {
        this.refs.push(v);
        return v;
    }

    parseItem() {
        let token= this.nextToken();
        if (typeof token !== 'number')
            throw new Error(`code token must be a number`);

        //echo "parseItem " . $token . "(" . $this->engine->typeForToken($token) .")" .PHP_EOL;
        if (token >= 50) {
            let clsidx = this.engine.classIndex(token);
            if (clsidx >= this.classes.length)
                throw new Error("");
            let clsname = this.classes[clsidx];
            let cls = this.correspondances[clsname];
            let obj = this.pushRef(cls ? new cls() : {});
            if (typeof obj["initWithMSTEDictionary"] === "function") {
                let d = {};
                this.engine.parse_dictionary_into(this, d);
                (<MSTEDecodable>obj).initWithMSTEDictionary(d);
            }
            else {
                this.engine.parse_dictionary_into(this, obj);
            }
            return obj;
        }
        let parser = this.engine.parsers[token];
        if (!parser) {
            throw new Error(`unknown code token '${token}'`);
        }
        return parser(this);
    }
}

export function parse(source: string | (string | number)[], options?: DecoderOptions)
{
  let decoder = new Decoder(options);
  try {
    return decoder.parse(source);
  } catch(err) {
    var msg = err.message;
    err.message = 'unable to parse MSTE';
    if (decoder.index > 0) {
        err.message += ', at token ' + (decoder.index - 1) + ': ' + msg;
        err.message += "\n" + JSON.stringify(decoder.tokens.slice(Math.max(0, decoder.index - 5), Math.min(decoder.tokens.length, decoder.index + 5)))
    }
    throw err;
  }
}
