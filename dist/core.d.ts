export declare function ok(value: any): boolean;
export declare function type(value: any): any;
export declare function isInteger(a: number): boolean;
export declare function div(a: number, b: number): number;
export declare function padStart(value: string, size: number, padder?: string): string;
export declare function padEnd(value: string, size: number, padder?: string): string;
export declare function crc32(value: string): number;
export declare function crc32(bytes: ArrayLike<number>): number;
export declare function crc32<T>(bytes: ArrayLike<T>, toByte: (value: T) => number): number;
export declare function stringify(value: any): string;
