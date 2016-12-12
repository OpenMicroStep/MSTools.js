import * as decoder from './mste/decoder'
import * as encoder from './mste/encoder'
export {MSColor} from './types/mscolor'
export {MSBuffer} from './types/msbuffer'
export {MSDate} from './types/msdate'
export {MSNaturalArray} from './types/msnaturalarray'
export {MSCouple} from './types/mscouple'
export {crc32, div, isInteger, ok, type, padStart, padEnd, stringify} from './core'
export namespace MSTE {
  export var parse = decoder.parse;
  export var stringify = encoder.stringify;
  export type Encoder = encoder.Encoder;
  export type Decodable = decoder.MSTEDecodable;
}