// ================ MSTE Singleton ====================
/* global MSData, MSColor, MSNaturalArray, MSCouple, MSDate */

MSTools.MSTE = {
    isa:'MSTE',
    toMSTE:function(encoder) { encoder.encodeException(this) ; },
    CONSTANTS:[null, true, false, String.EMPTY_STRING, Date.DISTANT_PAST, Date.DISTANT_FUTURE, MSData.EMPTY_DATA],
    ENGINES:[
        {
            states:[
                0,        1,        2,        106,    106,
                106,    108,    109,    100,    9,
                110,    110,    110,    110,    110,
                110,    110,    110,    110,    110,
                102,    103,    105,    107,    4,
                5,        3,        9
            ],
            codeNames:[
                'null', 'true', 'false', 'I-DECIMAL', 'F-DECIMAL',
                'STRING', 'DATE', 'COLOR', 'DICT', '#REF',
                'CHAR', 'UCHAR', 'SHORT', 'USHORT', 'INT32',
                'UINT32', 'INT64', 'UINT64', 'FLOAT', 'DOUBLE',
                'ARRAY', 'NATURALS', 'COUPLE', 'DATA', 'DISTANT_PAST',
                'DISTANT_FUTURE', 'EMPTY_STRING', '#WEAK_REF'
            ],
            classCode:50,
            getClassIndex:function(code) { return $div(code - 50,2) ;},
            validCode:function(code) { return (code > 27 && code < 50) || code < 0 ? false : true ; },
            version:0x0101
        },
        {
            states:[
                0,        1,      2,      3,      6,
                -100,  -100,   -100,   -100,      9,
                110,    110,    110,    110,    110,
                110,    110,    110,    110,    110,
                106,    106,    108,    111,    109,
                107,    103,   -100,   -100,   -100,
                100,    102,    105
            ],
            codeNames:[
                'null', 'true', 'false', 'EMPTY_STRING', 'EMPTY_DATA',
                '** CODE5 **', '** CODE6 **', '** CODE7 **','** CODE8 **', '#REF',
                'CHAR', 'UCHAR', 'SHORT', 'USHORT', 'INT32',
                'UINT32', 'INT64', 'UINT64', 'FLOAT', 'DOUBLE',
                'DECIMAL', 'STRING', 'DATE', 'TIMESTAMP', 'COLOR',
                'DATA', 'NATURALS', '** CODE27 **', '** CODE28 **', '** CODE29 **',
                'DICT', 'ARRAY', 'COUPLE'
            ],
            classCode:50,
            getClassIndex:function(code) { return code - 50 ;},
            validCode:function(code) { return code < 0 || (code > 4 && code < 9) || (code > 26 && code < 30) || (code > 32 && code < 50) ? false : true ; },
            version:0x0102
        }
    ]
} ;

// ================ decoder class interface ====================
MSTools.MSTE.Decoder = function(options) {
    this.isa = 'MSTEDecoder' ;
    this.keys = [] ;
    this.tokens = [] ;
    this.classes = [] ;
    this.objects = [] ;
    this.index = 0 ;
    this.correspondances = null ;
    this.supportedVersions = [] ;
    this.root = null ;

    for (var i = 0 ; i < MSTools.MSTE.ENGINES.length ; i++) {
        this.supportedVersions.push(MSTools.MSTE.ENGINES[i].version) ;
    }
    if ($ok(options)) {
        this.correspondances = options.classes ;
    }
} ;

// ================  decoder instance methods =============
MSTools.defineInstanceMethods(MSTools.MSTE.Decoder, {
    parse:function(source) {
        var v, n, i, cn, kn, a ;

        this.tokens = [] ;
        this.keys = [] ;
        this.classes = [] ;
        this.objects = [] ;
        this.index = 0 ;

        if (typeof source === "string") {
            a = JSON.parse(source) ;
        } else {
            a = source;
        }


        n = $length(a) ;
        if (n < 4) { throw "Unable to decode MSTE Source : two few tokens" ; }

        this.count = a[1].toUInt() ;
        if (this.count !== n ) { throw "Unable to decode MSTE Source : bad control count" ;}

        v = a[0] ;
        if (!v.hasPrefix('MSTE') || (v = this.supportedVersions.indexOf(parseInt(v.slice(4),16))) === -1) {
            throw "Unable to decode MSTE Source : bad version "+this.tokens[0] ;
        }

        this.engine = MSTools.MSTE.ENGINES[v] ;

        //console.log('version = MSTE'+this.engine.version.toHexa(4)) ;

        this.crc = a[2] ;

        cn = a[3].toUInt() ;
        if (5 + cn > n) { throw "Unable to decode MSTE Source : not enough tokens to store classes and a stream" ;}
        for (i = 0 ; i < cn ; i++) { this.classes[i] = a[4+i] ; }

        kn = a[4+cn].toUInt() ;
        if (6 + cn + kn > n) { throw "Unable to decode MSTE Source : not enough tokens to store a stream" ;}

        for (i = 0 ; i < kn ; i++) { this.keys[i] = a[5+cn+i] ; }

        this.tokens = a ;
        this.index = 5+cn+kn ;

        this.decodeStream() ;

        return this.root ;
    },
/*

        This is a brand new version of MSTE Reading.
        It is multi-version compatible and don't use recursive functions
        (we want to preserve the javascript stack)

        states        description
        -2              code reading after a dictionary key was read
        -1            code reading

        0..4        Constants

        9            reference of an object

        100            dictionary reading initialization
        101            read dictionary key of key-value couple
        102            array reading initialization
        103            MSNaturalArray reading initialization
        104            MSNaturalArray naturals reading
        105            Couple reading initialization
        106            String or Decimal number reading
        107            Base 64 data reading
        108            Date reading
        109            Color reading
        110            Simple (non referenced) numbers
        111            Time stamp reading

        c             descriptions
*/
    decodeStream:function() {
        var a = this.tokens, i = this.index, n = this.count, count, index ;
        var code, state = -1, futureClass = null, FutureConstructor = null ;
        var k, constants = MSTools.MSTE.CONSTANTS, clen = constants.length ;
        var stack = [], value, currentState = this, futureState = null, hasValue = false ;
        var engine =  this.engine ;

        currentState = {s:0, i:0, n:1, k:'root', o:this} ;
        stack.push(currentState) ;

        function dst(v) { return $ok(v) ? ($length(v.isa) ? v.isa : typeof v) : (typeof v === 'undefined' ? 'undefined' : 'NULL') ; }

        while (i < n) {
            futureState = null ;
            hasValue = false ;
            //console.log('---- MSTE automat state : '+state+' stack depth : '+stack.length+'--------------------------') ;
            //console.log('     index = '+i+', token ['+a[i]+']') ;
            switch(state) {
                case -2: // token code reading after a dictionary key was read
                case -1: // token code reading
                    if ($ok(currentState.nextState)) {
                        //console.log('changing state from -1 to '+currentState.nextState) ;
                        state = currentState.nextState ;
                        currentState.nextState = null ;
                        continue ;
                    }
                    futureClass = null ;
                    code = a[i++] ;
                    if (!engine.validCode(code)) {
                        throw "Unable to decode MSTE token with code "+code ;
                    }
                    else if (code >= engine.classCode) {
                        futureClass = this.classes[engine.getClassIndex(code)] ;
                        FutureConstructor = null ;
                        if (futureClass) {
                            if (this.correspondances) { FutureConstructor = this.correspondances[futureClass] ; }
                        }
                        //console.log('Found a class named <'+futureClass+'>') ;
                        state = 100 ;
                        // TODO using future constructor and future class
                        // with this linearized version it's highly complicated to change already referenced objects...
                    }
                    else {
                        //console.log('     did read code '+code+' ('+engine.codeNames[code]+')') ;
                        state = engine.states[code] ;
                        if (state >= 0 && state < clen) {
                            value = constants[state] ;
                            //console.log("constant["+state+"]=<"+value+">") ;
                            hasValue = true ;
                            state = -1 ;
                        }
                    }
                    break ;

                case 9: // obsolete : compatibility state. weak reference to an object
                    value = this.objects[a[i++]] ;
                    hasValue =  true ;
                    state = -1 ;
                    break ;

                case 100: // dictionary reading initialization
                    count = a[i++] ;
                    if (typeof FutureConstructor === 'function') {
                        value = new FutureConstructor() ;
                        //console.log("did define a new object of class "+ value.isa) ;
                    }
                    else {
                        //console.log("Registering new dictionary as "+this.objects.length+"nth object") ;
                        value = {} ;
                    }
                    hasValue = true ;
                    index = this.objects.length ;
                    this.objects.push(value) ;
                    if (count > 0) {
                        futureState = {s:0, i:0, n:count, o:value, index:index} ;
                        state = 101 ;
                    }
                    else { state = -1 ; }
                    break ;

                case 101: // read dictionary key
                    currentState.k = this.keys[a[i++]] ; // the key is a string
                    //console.log('     did read key \"'+currentState.k+'\"') ;
                    state = -2 ;
                    break ;

                case 102: // array reading initialization
                    count = a[i++] ;
                    value = [] ;
                    //console.log("Registering new Array as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    hasValue = true ;
                    if (count > 0) { futureState = {s:1, i:0, n:count, o:value} ; }
                    state = -1 ;
                    break ;

                case 103: // naturals array reading initialization
                    count = a[i++] ;
                    value = new MSNaturalArray() ;
                    //console.log("Registering new Natural Array as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    hasValue = true ;
                    if (count > 0) {
                        futureState = {s:-1, i:0, n:count, o:value} ;
                        state = 104 ;
                    }
                    else { state = -1 ; }
                    break ;

                case 104: // contents of natural array reading
                    currentState.o.push(a[i++]) ;
                    currentState.i++ ;
                    if (currentState.i === currentState.n) {
                        stack.pop() ;
                        //console.log('      <<<< did pop stack 104') ;
                        currentState = stack.length ? stack[stack.length - 1] : null ;
                        state = -1 ;
                    }
                    break ;

                case 105: // couple reading initialization
                    value = new MSCouple() ;
                    //console.log("Registering new Couple as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    hasValue = true ;
                    futureState = {s:2, i:0, n:2, o:value} ;
                    state = -1 ;
                    break ;

                case 106: // simple string or decimal reading
                    value = a[i++] ;
                    hasValue = true ;
                    //console.log("Registering new object '"+value+"' as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    state = -1 ;
                    break ;

                case 107: // data reading
                    value = MSData.initWithBase64String(a[i++]) ;
                    hasValue = true ;
                    //console.log("Registering new data '"+value+"' as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    state = -1 ;
                    break ;

                case 108: // true date reading
                    value = new MSDate(a[i++] - MSDate.SecsFrom19700101To20010101) ; // conversion from EPOCH to 01012001 reference point
                    hasValue = true ;
                    //console.log("Registering new date '"+value+"' as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    state = -1 ;
                    break ;

                case 109: // color reading
                    value = new MSColor(a[i++]) ;
                    hasValue = true ;
                    // console.log("Registering new coloe '"+value+"' as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    state = -1 ;
                    break ;

                case 110: // simple numbers (they are not referenced in objects)
                    value = a[i++] ;
                    hasValue = true ;
                    state = -1 ;
                    break ;

                case 111: // TIMESTAMP READING
                    value = 1000 * a[i++] ; // the initial value can be a double

                    if (value >= Date.DISTANT_FUTURE_TS) { value = Date.DISTANT_FUTURE_TS ; }
                    else if ( value <= Date.DISTANT_PAST_TS) { value = Date.DISTANT_PAST_TS ; }

                    value = Date.initWithUTCTime(value) ;
                    //console.log("Registering new timestamp '"+value+"' as "+this.objects.length+"nth object") ;
                    this.objects.push(value) ;
                    hasValue = true ;
                    state = -1 ;
                    break ;

                default:
                    //console.log("Bad state encoutered during parsing") ;
                    throw 'Bad state encoutered during parsing' ;
            }
            if (hasValue) {

                switch(currentState.s) {
                    case 0:
                        ////console.log('     dict[\''+currentState.k+'\'] = '+MSTools.stringify(value)) ;
                        //console.log('     dict[\''+currentState.k+'\'] = ' + dst(value));
                        currentState.o[currentState.k] = value ;
                        currentState.nextState = 101 ;
                        break ;
                    case 1:
                        ////console.log('     array['+currentState.i+'] = '+MSTools.stringify(value)) ;
                        //console.log('     array['+currentState.i+'] = ' + dst(value)) ;
                        currentState.o[currentState.i] = value ;
                        break ;
                    case 2:
                        ////console.log('     couple.firstMember = '+MSTools.stringify(value)) ;
                        //console.log('     couple.firstMember = ' + dst(value)) ;
                        currentState.o.firstMember = value ;
                        currentState.s = 3 ;
                        break ;
                    case 3:
                        ////console.log('     couple.secondMember = '+MSTools.stringify(value)) ;
                        //console.log('     couple.secondMember = ' + dst(value)) ;
                        currentState.o.secondMember = value ;
                        break ;
                    default:
                        throw "Bad currentState : "+currentState.s ;
                }
                currentState.i++ ;
                if (currentState.i === currentState.n) {
                    stack.pop() ;
                    currentState = stack.length ? stack[stack.length - 1] : null ;
                    /*console.log('      <<<< did pop stack EOL') ;
                    if (currentState) {
                        console.log('      new current state.s = '+currentState.s+', i = '+currentState.i+', n = '+currentState.n+', => '+currentState.nextState) ;
                    }
                    else {
                        console.log('      : stack is empty') ;
                    }*/
                }
            }
            if (futureState) {
                stack.push(futureState) ;
                //console.log('      >>>> did push stack') ;
                currentState = futureState ;
                //console.log('      new current state.s = '+currentState.s+', i = '+currentState.i+', n = '+currentState.n+', => '+currentState.nextState) ;
            }
        }
        //console.log('---- MSTE automat final state : '+state+' stack depth : '+stack.length+'--------------------------') ;
        if (state !== -1)    { throw "Bad final state "+state ; }
        if (stack.length > 0) { throw "Bad final stack with current stack state "+stack.lastObject().s ; }
    }
}, true) ;

// ================ coder class interface ====================
MSTools.MSTE.Encoder = function() {
    this.referenceKey = MSTools.localUniqueID() ;
    this.tokens = ["MSTE0102", 0, "CRC00000000"] ;
    this.stream = [] ;
    this.encodedObjects = [] ;
    this.keyNames = [] ;
    this.keysIndexes = {} ;
    this.classesNames = [] ;
    this.classesIndexes = {} ;
    this.isa = 'MSTECoder' ;
} ;

// ================  coder instance methods =============
MSTools.defineInstanceMethods(MSTools.MSTE.Encoder,
{
    shouldPushObject:function(o) {
        var identifier = o[this.referenceKey] ;

        if ($ok(identifier)) { this.stream.push(9) ; this.stream.push(identifier) ; return false ;}

        identifier = this.encodedObjects.length ;

        Object.defineProperty(o, this.referenceKey, {
            enumerable:false,
            configurable:true, // so it could be later deleted
            writable:false,
            value:identifier
        }) ;
        this.encodedObjects[identifier] = o ;

        return true ;
    },
    push:function(anItem) { this.stream.push(anItem) ; },
    pushKey:function(aKey) {
        var index = this.keysIndexes[aKey] ;
        if (!$ok(index)) {
            index = this.keyNames.length ;
            this.keyNames[index] = aKey ;
            this.keysIndexes[aKey] = index ;
        }
        this.stream.push(index) ;
    },
    pushClass:function(aClass) {
        var index = this.classesIndexes[aClass] ;
        if (!$ok(index)) {
            index = this.classesNames.length ;
            this.classesNames[index] = aClass ;
            this.classesIndexes[aClass] = index ;
        }
        this.stream.push(50 + index) ;
    },
    encodeObject:function(o) {
        if ($ok(o)) {
            if (typeof o.toMSTE === 'function') {
                // //console.log('will encode object of class '+o.isa+' with its internal function') ;
                o.toMSTE(this) ;
            }
            else if (this.shouldPushObject(o)) {
                var i, count, keys = null, idx, k, v, t, total = 0, customClass = null ;

                if (typeof o.toMSTEClass === 'function') {
                    customClass = o.toMSTEClass() ;
                    if (typeof customClass === "string" && customClass.length) {
                        this.pushClass(customClass) ;
                    }
                    else { customClass = null ; }
                }
                else { this.stream.push(30) ; } // a standard dictionary

                if ((typeof o.msteKeys) === 'function') {
                    keys = o.msteKeys() ;
                }

                idx = this.stream.length ;
                this.stream[idx] = 0 ;

                if ((count = $length(keys)) !== 0) {
                    // specific mste loop
                    for (i = 0 ; i < count ; i++) {
                        k = keys[i] ; v = o[k] ; t = typeof v ;
                        if (v !== null && t !== 'function' && t !== 'undefined') {
                            total ++ ;
                            this.pushKey(k) ;
                            this.encodeObject(v) ;
                        }
                    }
                }
                else {
                    // object standard loop
                    // //console.log('will encode object '+MSTools.stringify(o)) ;
                    for (k in o) {
                        if (k.length && k.charAt(0) >= 'A') {
                            v = o[k] ; t = typeof v ;
                            if (v !== null && t !== 'function' && t !== 'undefined') {
                                total ++ ;
                                this.pushKey(k) ;
                                this.encodeObject(v) ;
                            }
                        }
                    }
                }
                this.stream[idx] = total ;
            }
        }
        else { this.stream.push(0) ; }
    },
    finalizeTokens:function() {
        var i, ret = this.tokens, a = this.classesNames, count = a.length ;

        ret.push(count) ;
        for (i = 0 ; i < count ; i++)  { ret.push(a[i]) ; }

        a = this.keyNames ; count = a.length ;
        ret.push(count) ;
        for (i = 0 ; i < count ; i++)  { ret.push(a[i]) ; }

        a = this.stream ; count = a.length ;
        for (i = 0 ; i < count ; i++)  { ret.push(a[i]) ; }

        this.deleteTemporaryIdentifiers() ;
        ret[1] = ret.length ;

        return ret ;
    },
    deleteTemporaryIdentifiers:function() {
        var i, a = this.encodedObjects, count = a.length, elem, k = this.referenceKey ;
        for (i = 0 ; i < count ; i++) { elem = a[i] ; delete elem[k] ; }
    },
    encodeException:function(o) { throw "Impossible to encode object of class "+this.className() ; },
    toMSTE:function(encoder) { encoder.encodeException(this) ; }
}, true) ;


// ================  MSTE methods =============
MSTools.MSTE.parse = function(source, options) {
    var r = null ;
    if ($length(source)) {
        var decoder = new MSTools.MSTE.Decoder(options) ;
        try {
            r = decoder.parse(source) ;
        }
        catch (e) {
        //console.log("error "+e+" during MSTE parsing") ; r = null ;
        }
    }
    return r ;
} ;

MSTools.MSTE.tokenize = function(rootObject) {
    var encoder = new MSTools.MSTE.Encoder(), r = null ;
    try {
        encoder.encodeObject(rootObject) ;
        r = encoder.finalizeTokens() ;
    }
    catch (e) {
        encoder.deleteTemporaryIdentifiers() ;
        //console.log("error \""+e+"\" encountered during MSTE tokenizing") ;
        r = null ;
    }

    return r ;
} ;

MSTools.MSTE.stringify = function(rootObject) {
    var r = this.tokenize(rootObject) ;
    if (r) {
        try {
            r = MSTools.stringify(r) ; // a lightly modified version of crockford stringify implementation
            // TODO: calculate the CRC after the stringify has been done
        }
        catch (e) {
            //console.log("error "+e+" during MSTE stringify") ;
            r = null ;
        }
    }
    return r ;
} ;