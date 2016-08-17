export declare class MSNaturalArray extends Array<number> {
    constructor(...values: (number | number[])[]);
    unshift(...items: number[]): number;
    push(...values: number[]): number;
    concat(...items: (number | number[])[]): MSNaturalArray;
    slice(start?: number, end?: number): MSNaturalArray;
    splice(start: number): MSNaturalArray;
    splice(start: number, deleteCount: number, ...items: number[]): MSNaturalArray;
    toJSON(): number[];
    isEqualTo(other: any): boolean;
    isEqualToArray(other: MSNaturalArray): boolean;
}
