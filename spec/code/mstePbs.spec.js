describe("=========== Some MSTE pbs to fix =============", function() {

    it("encodes simple references (same ref is used multiple times: a person is father to one and married to another)", function () {
        var data = [{
            name: "Durand ¥-$-€",
            firstName: "Yves",
            birthday: new Date(),
        }, {
            name: "Durand",
            firstName: "Claire",
            birthday: new Date(),
        }, {
            name: "Durand",
            firstName: "Lou",
            birthday: new Date(),
        }];

        data[0]["maried_to"] = data[1];
        data[1]["maried_to"] = data[0];

        data[2]["father"] = data[0];
        data[2]["mother"] = data[1];


        var encoder = new MSTools.MSTE.Encoder() ;
        encoder.encodeObject(data) ;
        var tokens = encoder.finalizeTokens() ;
        var m = MSTools.stringify(tokens) ;
        var recreatedObject = MSTools.MSTE.parse(m) ;

        console.log(jasmine.pp(data));
        console.log(jasmine.pp(recreatedObject));           // ! jasmine.pp => a stringify that doesn't stop when encountering circular refs


        expect(recreatedObject).toEqual(data);

        // ! Current Issue #1: Dates go crazy: Date(Mon May 19 2014 14:56:04 GMT+0200 (CEST)) -> Date(Tue Apr 20 -271821 02:00:00 GMT+0200 (CEST))
        // ! Current Issue #2: recreatedObject[2]'s mother is not an object but the string 'Durand', and father is not set
    });


    it("decodes JM's mste chain (from his MSTEDemo project)", function () {
        var JMChain = '["MSTE0102",60,"CRC30DA22E7",2,"Person","Person2",4,"firstName","maried-to","name","birthday",31,8,50,4,0,21,"Yves",1,50,4,0,21,"Claire",1,9,1,2,21,"Durand",3,22,-207360000,2,21,"Durand \u00A5-$-\u20AC",3,22,-243820800,9,3,51,3,2,9,5,0,21,"Lou",3,22,552096000,6,24,"Rjd5NA==",9,1,9,12,6]';

        var object = MSTools.MSTE.parse(JMChain) ;

        console.log(jasmine.pp(object[2]));

        expect(object[0].firstName).toBe("Yves") ;
        expect(object[0]["maried-to"].firstName).toBe("Claire") ;   // Yves's wife is Claire, this reference is correct
        expect(object[2]["mother"]).toBe(object[1]) ;               // Lou's mother should be Claire, but is undefined

        // ! Current Issue: object[2]'s mother and father are not found. JMChain should be correct; at least it can re-parses itself correctly in obj-c
    });

}) ;