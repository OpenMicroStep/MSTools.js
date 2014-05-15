describe("==========Tests of data  ========", function() {
	it("Testing constructor", function() {
				
		var n = new MSData() ;
        expect(n.length).toBe(0);

		/* n = new MSData(4799) ;
        expect(n.length).toBe(0); THIS TEST SHOULD BE WRONG */

		n = new MSData(1, 8, 3, 7) ;
        expect(n.length).toBe(4);
        expect(MSTools.stringify(n)).toBe("[1,8,3,7]");

		n = new MSData('AM NBCP') ;
        expect(n.length).toBe(7);
		expect(MSTools.stringify(n)).toBe("[65,77,32,78,66,67,80]");
        
    });

	it("Testing base64 encoding", function() {
		var d =  new MSData("Client browser handles the data from the source form as a string data encoded by document charset (iso-8859-1 in the case of this document) and sends the data as a binary http stream to a web server. You can choose another character set for the conversion of the source text data (the textarea). This script does Base64 conversion with the converted binary data") ;
		var s = d.toBase64String() ;
		expect(s).toBe("Q2xpZW50IGJyb3dzZXIgaGFuZGxlcyB0aGUgZGF0YSBmcm9tIHRoZSBzb3VyY2UgZm9ybSBhcyBhIHN0cmluZyBkYXRhIGVuY29kZWQgYnkgZG9jdW1lbnQgY2hhcnNldCAoaXNvLTg4NTktMSBpbiB0aGUgY2FzZSBvZiB0aGlzIGRvY3VtZW50KSBhbmQgc2VuZHMgdGhlIGRhdGEgYXMgYSBiaW5hcnkgaHR0cCBzdHJlYW0gdG8gYSB3ZWIgc2VydmVyLiBZb3UgY2FuIGNob29zZSBhbm90aGVyIGNoYXJhY3RlciBzZXQgZm9yIHRoZSBjb252ZXJzaW9uIG9mIHRoZSBzb3VyY2UgdGV4dCBkYXRhICh0aGUgdGV4dGFyZWEpLiBUaGlzIHNjcmlwdCBkb2VzIEJhc2U2NCBjb252ZXJzaW9uIHdpdGggdGhlIGNvbnZlcnRlZCBiaW5hcnkgZGF0YQ==") ;
	}) ;

	it("Testing base64 decoding (1)", function() {
		var s = "VGhlIEJ5dGVBcnJheSBjbGFzcyB3YXMgcHJpbWFyaWx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBBU1AgYW5kIFZCU2NyaXB0LCBidXQgeW91IGNhbiB1c2UgaXQgd2l0aCBhbnkgb3RoZXIgbGFuZ3VhZ2Ugd29ya2luZyB3aXRoIENPTSAoQWN0aXZlWCwgT0xFKSBvYmplY3RzLCBzdWNoIGlzIFZCQSAoVkJBNSwgVkJBNiwgV29yZCwgRXhjZWwsIE1TIEFjY2VzcyksIFZCU2NyaXB0IGFuZCBKU2NyaXB0IGluIHdpbmRvd3Mgc2NyaXB0aW5nIGhvc3QgKC53c2gsIC5jaG0gb3IgLmh0YSBhcHBsaWNhdGlvbnMsIE91dGxvb2sgb3IgZWNoYW5nZSBzZXJ2ZXItc2lkZSBzY3JpcHRzKSwgVkIuTmV0LCBDIyBvciBqIyBpbiBBU1AuTmV0IGFuZCBvdGhlcnMu" ;
		
		var d = MSData.initWithBase64String(s) ;
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
		
		var d = MSData.initWithBase64String(s) ;
		var r = "The ByteArray class was primarily designed to work with ASP and VBScript, but you can use it with any other language working with COM (ActiveX, OLE) objects, such is VBA (VBA5, VBA6, Word, Excel, MS Access), VBScript and JScript in windows scripting host (.wsh, .chm or .hta applications, Outlook or echange server-side scripts), VB.Net, C# or j# in ASP.Net and others." ;

		expect(d.toString()).toBe(r) ;

	}) ;

}) ;