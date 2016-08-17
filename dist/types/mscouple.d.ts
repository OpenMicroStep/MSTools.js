export declare class MSCouple<T1, T2> {
    firstMember: T1 | null;
    secondMember: T2 | null;
    constructor(first?: T1 | null, second?: T2 | null);
    toArray(): (T1 | T2 | null)[];
    isEqualTo(other: any): boolean;
    isEqualToCouple(other: MSCouple<T1, T2>): boolean;
}
