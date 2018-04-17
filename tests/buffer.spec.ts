import {expect} from 'chai';
import {MSBuffer} from '../src/index';

describe("MSBuffer", function() {
	it("constructor, concat, slice, splice", function() {
		let n = new MSBuffer();
    expect(n.length).to.eq(0);

		n = new MSBuffer(100, 80, 30, 77) ;
    expect(n.length).to.eq(4);
    expect(Array.from(n)).to.deep.equal([100,80,30,77]);
		expect(n[2]).to.eq(30) ;

		let n1 = new MSBuffer('AM NBCP') ;
    expect(n1.length).to.eq(7);
		expect(Array.from(n1)).to.deep.equal([65,77,32,78,66,67,80]);
		expect(n1[5]).to.eq(67) ;

		let n2 = new MSBuffer(80,90,100,110,112,113,114,115) ;

		let r = n1.concat(n, n2) ;
		expect(r).to.be.instanceof(MSBuffer);
		expect(Array.from(r)).to.deep.equal([65,77,32,78,66,67,80,100,80,30,77,80,90,100,110,112,113,114,115]);

		expect(r.slice()).to.be.instanceof(MSBuffer);
		expect(r.slice().isEqualTo(r)).to.eq(true) ;
		expect(r.slice(void 0,7).isEqualTo(n1)).to.eq(true) ;
		expect(r.slice(7,11).isEqualTo(n)).to.eq(true) ;
		expect(r.slice(11).isEqualTo(n2)).to.eq(true) ;

		let n3 = r.splice(7,4, 91, 92, 93, 94, 95, 96, 97, 98) ;
		expect(n3).to.be.instanceof(MSBuffer);
		expect(n3.isEqualTo(n)).to.eq(true) ;
		expect(Array.from(r)).to.deep.equal([65,77,32,78,66,67,80,91,92,93,94,95,96,97,98,80,90,100,110,112,113,114,115]);
		let n4 = r.splice(0,11) ;
		expect(n4).to.be.instanceof(MSBuffer);
		expect(Array.from(r)).to.deep.equal([95,96,97,98,80,90,100,110,112,113,114,115]) ;
		expect(Array.from(n4)).to.deep.equal([65,77,32,78,66,67,80,91,92,93,94]) ;

		n4.pop() ;
		n4.pop() ;
		n4.pop() ;
		expect(Array.from(n4)).to.deep.equal([65,77,32,78,66,67,80,91]) ;
		n4.reverse() ;
		expect(Array.from(n4)).to.deep.equal([91,80,67,66,78,32,77,65]) ;
  });

	it('JSON.stringify', function() {
    expect(JSON.stringify(new MSBuffer(100, 80, 30, 77))).to.deep.equal("[100,80,30,77]");
	})

	/*it("Testing splice", function() {
	}) ;*/

	it("base64 decode/encode on short string", function() {
		var s = "Rjd5NA==" ;
		var d = MSBuffer.bufferWithBase64String(s) ;

		expect(d.toString()).to.eq("F7y4") ;
		expect(d.toBase64String()).to.eq(s) ;
	}) ;

	it("base64 encoding", function() {
		var d =  new MSBuffer("Client browser handles the data from the source form as a string data encoded by document charset (iso-8859-1 in the case of this document) and sends the data as a binary http stream to a web server. You can choose another character set for the conversion of the source text data (the textarea). This script does Base64 conversion with the converted binary data") ;
		var s = d.toBase64String() ;
		expect(d.toBase64String()).to.eq("Q2xpZW50IGJyb3dzZXIgaGFuZGxlcyB0aGUgZGF0YSBmcm9tIHRoZSBzb3VyY2UgZm9ybSBhcyBhIHN0cmluZyBkYXRhIGVuY29kZWQgYnkgZG9jdW1lbnQgY2hhcnNldCAoaXNvLTg4NTktMSBpbiB0aGUgY2FzZSBvZiB0aGlzIGRvY3VtZW50KSBhbmQgc2VuZHMgdGhlIGRhdGEgYXMgYSBiaW5hcnkgaHR0cCBzdHJlYW0gdG8gYSB3ZWIgc2VydmVyLiBZb3UgY2FuIGNob29zZSBhbm90aGVyIGNoYXJhY3RlciBzZXQgZm9yIHRoZSBjb252ZXJzaW9uIG9mIHRoZSBzb3VyY2UgdGV4dCBkYXRhICh0aGUgdGV4dGFyZWEpLiBUaGlzIHNjcmlwdCBkb2VzIEJhc2U2NCBjb252ZXJzaW9uIHdpdGggdGhlIGNvbnZlcnRlZCBiaW5hcnkgZGF0YQ==") ;
	}) ;

	it("base64 decoding (1)", function() {
		var s = "VGhlIEJ5dGVBcnJheSBjbGFzcyB3YXMgcHJpbWFyaWx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBBU1AgYW5kIFZCU2NyaXB0LCBidXQgeW91IGNhbiB1c2UgaXQgd2l0aCBhbnkgb3RoZXIgbGFuZ3VhZ2Ugd29ya2luZyB3aXRoIENPTSAoQWN0aXZlWCwgT0xFKSBvYmplY3RzLCBzdWNoIGlzIFZCQSAoVkJBNSwgVkJBNiwgV29yZCwgRXhjZWwsIE1TIEFjY2VzcyksIFZCU2NyaXB0IGFuZCBKU2NyaXB0IGluIHdpbmRvd3Mgc2NyaXB0aW5nIGhvc3QgKC53c2gsIC5jaG0gb3IgLmh0YSBhcHBsaWNhdGlvbnMsIE91dGxvb2sgb3IgZWNoYW5nZSBzZXJ2ZXItc2lkZSBzY3JpcHRzKSwgVkIuTmV0LCBDIyBvciBqIyBpbiBBU1AuTmV0IGFuZCBvdGhlcnMu" ;

		var d = MSBuffer.bufferWithBase64String(s) ;
		var r = "The ByteArray class was primarily designed to work with ASP and VBScript, but you can use it with any other language working with COM (ActiveX, OLE) objects, such is VBA (VBA5, VBA6, Word, Excel, MS Access), VBScript and JScript in windows scripting host (.wsh, .chm or .hta applications, Outlook or echange server-side scripts), VB.Net, C# or j# in ASP.Net and others." ;
		expect(d.toString()).to.eq(r) ;
	}) ;

	it("base64 decoding (2)", function() {
		var s = "VGhlIEJ5dGVBcnJheSBjbGFzcyB3YXMgcHJpbWFyaWx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aCBB\n"+
		"U1AgYW5kIFZCU2NyaXB0LCBidXQgeW91IGNhbiB1c2UgaXQgd2l0aCBhbnkgb3RoZXIgbGFuZ3Vh\n"+
		"Z2Ugd29ya2luZyB3aXRoIENPTSAoQWN0aXZlWCwgT0xFKSBvYmplY3RzLCBzdWNoIGlzIFZCQSAo\n"+
		"VkJBNSwgVkJBNiwgV29yZCwgRXhjZWwsIE1TIEFjY2VzcyksIFZCU2NyaXB0IGFuZCBKU2NyaXB0\n"+
		"IGluIHdpbmRvd3Mgc2NyaXB0aW5nIGhvc3QgKC53c2gsIC5jaG0gb3IgLmh0YSBhcHBsaWNhdGlv\n"+
		"bnMsIE91dGxvb2sgb3IgZWNoYW5nZSBzZXJ2ZXItc2lkZSBzY3JpcHRzKSwgVkIuTmV0LCBDIyBv\n"+
		"ciBqIyBpbiBBU1AuTmV0IGFuZCBvdGhlcnMu" ;

		var d = MSBuffer.bufferWithBase64String(s) ;
		var r = "The ByteArray class was primarily designed to work with ASP and VBScript, but you can use it with any other language working with COM (ActiveX, OLE) objects, such is VBA (VBA5, VBA6, Word, Excel, MS Access), VBScript and JScript in windows scripting host (.wsh, .chm or .hta applications, Outlook or echange server-side scripts), VB.Net, C# or j# in ASP.Net and others." ;

		expect(d.toString()).to.eq(r) ;

	}) ;

}) ;