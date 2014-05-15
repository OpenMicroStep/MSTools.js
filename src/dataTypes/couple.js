// ================ class interface ====================
function MSCouple(first, second)
{
    this.firstMember = $ok(first) ? first : null ;
    this.secondMember = $ok(second) ? second : null ;
}

// ================ constants ====================
MSTools.defineHiddenConstants(MSCouple.prototype, {
    isa:'Couple',
    length:2 // there is always 2 slots even if one of them or both are null (SHOULD WE KEEP THAT ?)
}, true) ;

// ================= class methods ===============

// ================  instance methods =============
MSTools.defineInstanceMethods(MSCouple, {
    toString: function() { return [this.firstMember, this.secondMember].toString() ; },  // the same to string as an array
    toMSTE: function(encoder) {
        if (encoder.shouldPushObject(this)) {
            var v, i, count = this.length ;
            encoder.push(32) ;
            encoder.encodeObject(this.firstMember) ;
            encoder.encodeObject(this.secondMember) ;
        }
    }
}, true) ;
