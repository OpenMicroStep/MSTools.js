export declare function unshift(arr: Array<number>, offset: number, args: ArrayLike<number>, allowArray: boolean, map: (value: number) => number): void;
export declare function push(arr: Array<number>, offset: number, args: ArrayLike<number | number[]>, allowArray: boolean, map: (value: number) => number): void;
export declare class MSBuffer extends Array<number> {
    constructor(data: string);
    constructor(...bytes: (number | number)[]);
    static bufferFromString(s: string, encoding?: string): MSBuffer;
    static bufferWithBase64String(s: string, index?: number[], paddingChar?: string): MSBuffer;
    unshift(...items: number[]): number;
    push(...values: number[]): number;
    concat(...items: (number | number[])[]): MSBuffer;
    slice(start?: number, end?: number): MSBuffer;
    splice(start: number): MSBuffer;
    splice(start: number, deleteCount: number, ...items: number[]): MSBuffer;
    toJSON(): number[];
    isEqualTo(other: any): boolean;
    isEqualToBuffer(other: MSBuffer): boolean;
    toString(): string;
    toBase64String(tokens?: string, paddingChar?: string): string;
    static encodeToBase64(bytes: ArrayLike<number>, tokens?: string, paddingChar?: string): string;
}
