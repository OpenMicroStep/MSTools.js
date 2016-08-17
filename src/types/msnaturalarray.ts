import {push, unshift} from './msbuffer';

function safeNaturalValue(value: number) {
    return value | 0;
}

export class MSNaturalArray extends Array<number> {
    constructor(...values: (number | number[])[]);
    constructor() {
        super();
        push(this, 0, arguments, true, safeNaturalValue);
    }

    unshift(...items: number[]): number;
    unshift(): number {
        unshift(this, 0, arguments, false, safeNaturalValue);
        return this.length;
    }

    push(...values: number[]): number;
    push(): number {
        push(this, 0, arguments, false, safeNaturalValue);
        return this.length;
    }

    concat(...items: (number | number[])[]): MSNaturalArray;
    concat(): MSNaturalArray {
        var ret = new MSNaturalArray();
        Array.prototype.push.apply(ret, this);
        push(ret, 0, arguments, true, safeNaturalValue);
        return ret;
    }
    slice(start?: number, end?: number): MSNaturalArray {
        return new MSNaturalArray(Array.prototype.slice.apply(this, arguments));
    }
    splice(start: number): MSNaturalArray;
    splice(start: number, deleteCount: number, ...items: number[]): MSNaturalArray;
    splice(start: number, deleteCount?: number, ...items: number[]): MSNaturalArray {
        return new MSNaturalArray(Array.prototype.splice.apply(this, arguments));
    }
    toJSON() {
        return Array.from(this);
    }

    isEqualTo(other: any) {
        return other instanceof MSNaturalArray && this.isEqualToArray(other);
    }
    isEqualToArray(other: MSNaturalArray) {
        if (this === other)
            return true;
        if (!other || other.length !== this.length)
            return false;

        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] !== other[i])
                return false;
        }
        return true;
    }
}
