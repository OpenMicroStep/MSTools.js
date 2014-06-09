if (typeof module !== 'undefined' && module.exports) {  // On Node.js
    require("../../tmp/MSTools");
}

describe("==========Tests of data  ========", function() {
	beforeEach(function() {
	    jasmine.addCustomEqualityTester($equals);
	}) ;

	it("Testing constructor, concat, slice, splice", function() {
				
		var n = new MSData(), n1, n2, n3, n4 ;
        expect(n.length).toBe(0);

		n = new MSData(100, 80, 30, 77) ;
        expect(n.length).toBe(4);
        expect(n.toArray()).toEqual([100,80,30,77]);
		expect(n.objectAtIndex(2)).toEqual(30) ;

		n1 = new MSData('AM NBCP') ;
        expect(n1.length).toBe(7);
		expect(n1.toArray()).toEqual([65,77,32,78,66,67,80]);
		expect(n1.byteAtIndex(5)).toEqual(67) ;
		
		n2 = new MSData(80,90,100,110,112,113,114,115) ;
		
		var r = n1.concat(n, n2) ;
        
		expect(r.toArray()).toEqual([65,77,32,78,66,67,80,100,80,30,77,80,90,100,110,112,113,114,115]);
		
		expect(r.slice()).toEqual(r) ;
		expect(r.slice(null,7)).toEqual(n1) ;
		expect(r.slice(7,11)).toEqual(n) ;
		expect(r.slice(11)).toEqual(n2) ;
		
		
		
		n3 = r.splice(7,4, 91, 92, 93, 94, 95, '96', '97 ', 98) ;
		expect(n3).toEqual(n) ;
		expect(r.toArray()).toEqual(
				[65,77,32,78,66,67,80,91,92,93,94,95,96,97,98,80,90,100,110,112,113,114,115]
			) ;
		n4 = r.splice(0,11) ;
		expect(r.toArray()).toEqual([95,96,97,98,80,90,100,110,112,113,114,115]) ;
		expect(n4.toArray()).toEqual([65,77,32,78,66,67,80,91,92,93,94]) ;

		expect(Array.isArray(n4)).toBe(true) ;
		n4.pop() ;
		n4.pop() ;
		n4.pop() ;
		expect(n4.toArray()).toEqual([65,77,32,78,66,67,80,91]) ;
		n4.reverse() ;
		expect(n4.toArray()).toEqual([91,80,67,66,78,32,77,65]) ;		
    });

	/*it("Testing splice", function() {
	}) ;*/

	it("Testing base64 decode/encode on short string", function() {
		var s = "Rjd5NA==" ;
		var d = MSData.dataWithBase64String(s) ;

		expect(d.toString()).toBe("F7y4") ;

		var r = d.toBase64String() ;
		expect(r).toBe(s) ;
	}) ;
	
	it("Testing base64 encoding", function() {
		var d =  new MSData("Client browser handles the data from the source form as a string data encoded by document charset (iso-8859-1 in the case of this document) and sends the data as a binary http stream to a web server. You can choose another character set for the conversion of the source text data (the textarea). This script does Base64 conversion with the converted binary data") ;
		var s = d.toBase64String() ;
		expect(s).toBe("Q2xpZW50IGJyb3dzZXIgaGFuZGxlcyB0aGUgZGF0YSBmcm9tIHRoZSBzb3VyY2UgZm9ybSBhcyBhIHN0cmluZyBkYXRhIGVuY29kZWQgYnkgZG9jdW1lbnQgY2hhcnNldCAoaXNvLTg4NTktMSBpbiB0aGUgY2FzZSBvZiB0aGlzIGRvY3VtZW50KSBhbmQgc2VuZHMgdGhlIGRhdGEgYXMgYSBiaW5hcnkgaHR0cCBzdHJlYW0gdG8gYSB3ZWIgc2VydmVyLiBZb3UgY2FuIGNob29zZSBhbm90aGVyIGNoYXJhY3RlciBzZXQgZm9yIHRoZSBjb252ZXJzaW9uIG9mIHRoZSBzb3VyY2UgdGV4dCBkYXRhICh0aGUgdGV4dGFyZWEpLiBUaGlzIHNjcmlwdCBkb2VzIEJhc2U2NCBjb252ZXJzaW9uIHdpdGggdGhlIGNvbnZlcnRlZCBiaW5hcnkgZGF0YQ==") ;
	}) ;

	it("Testing base64 decoding (1)", function() {
		var s = "VGhlIEJ5dGVBcnJheSBjbGFzcyB3YXMgcHJpbWFyaWx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBBU1AgYW5kIFZCU2NyaXB0LCBidXQgeW91IGNhbiB1c2UgaXQgd2l0aCBhbnkgb3RoZXIgbGFuZ3VhZ2Ugd29ya2luZyB3aXRoIENPTSAoQWN0aXZlWCwgT0xFKSBvYmplY3RzLCBzdWNoIGlzIFZCQSAoVkJBNSwgVkJBNiwgV29yZCwgRXhjZWwsIE1TIEFjY2VzcyksIFZCU2NyaXB0IGFuZCBKU2NyaXB0IGluIHdpbmRvd3Mgc2NyaXB0aW5nIGhvc3QgKC53c2gsIC5jaG0gb3IgLmh0YSBhcHBsaWNhdGlvbnMsIE91dGxvb2sgb3IgZWNoYW5nZSBzZXJ2ZXItc2lkZSBzY3JpcHRzKSwgVkIuTmV0LCBDIyBvciBqIyBpbiBBU1AuTmV0IGFuZCBvdGhlcnMu" ;
		
		var d = MSData.dataWithBase64String(s) ;
		var r = "The ByteArray class was primarily designed to work with ASP and VBScript, but you can use it with any other language working with COM (ActiveX, OLE) objects, such is VBA (VBA5, VBA6, Word, Excel, MS Access), VBScript and JScript in windows scripting host (.wsh, .chm or .hta applications, Outlook or echange server-side scripts), VB.Net, C# or j# in ASP.Net and others." ;

		
		expect(d.toString()).toBe(r) ;
	}) ;

	it("Testing base64 decoding (2)", function() {
		var s = "VGhlIEJ5dGVBcnJheSBjbGFzcyB3YXMgcHJpbWFyaWx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBB\n"+
		"U1AgYW5kIFZCU2NyaXB0LCBidXQgeW91IGNhbiB1c2UgaXQgd2l0aCBhbnkgb3RoZXIgbGFuZ3Vh\n"+
		"Z2Ugd29ya2luZyB3aXRoIENPTSAoQWN0aXZlWCwgT0xFKSBvYmplY3RzLCBzdWNoIGlzIFZCQSAo\n"+
		"VkJBNSwgVkJBNiwgV29yZCwgRXhjZWwsIE1TIEFjY2VzcyksIFZCU2NyaXB0IGFuZCBKU2NyaXB0\n"+
		"IGluIHdpbmRvd3Mgc2NyaXB0aW5nIGhvc3QgKC53c2gsIC5jaG0gb3IgLmh0YSBhcHBsaWNhdGlv\n"+
		"bnMsIE91dGxvb2sgb3IgZWNoYW5nZSBzZXJ2ZXItc2lkZSBzY3JpcHRzKSwgVkIuTmV0LCBDIyBv\n"+
		"ciBqIyBpbiBBU1AuTmV0IGFuZCBvdGhlcnMu" ;
		
		var d = MSData.dataWithBase64String(s) ;
		var r = "The ByteArray class was primarily designed to work with ASP and VBScript, but you can use it with any other language working with COM (ActiveX, OLE) objects, such is VBA (VBA5, VBA6, Word, Excel, MS Access), VBScript and JScript in windows scripting host (.wsh, .chm or .hta applications, Outlook or echange server-side scripts), VB.Net, C# or j# in ASP.Net and others." ;

		expect(d.toString()).toBe(r) ;

	}) ;

}) ;