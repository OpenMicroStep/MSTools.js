export class MSCouple<T1, T2>
{
    firstMember: T1 | null;
    secondMember: T2 | null;
    constructor(first: T1 | null = null, second: T2 | null = null)
    {
        this.firstMember = first ;
        this.secondMember = second ;
    }
    toArray() { return [this.firstMember, this.secondMember] ; }
    isEqualTo(other: any) {
        return other instanceof MSCouple && this.isEqualToCouple(other);
    }
    isEqualToCouple(other: MSCouple<T1, T2>) {
        return other.firstMember === this.firstMember && other.secondMember === this.secondMember;
    }
}
