describe("==========Tests de l'objet MSColor ========", function() {
	
	it("Test du constructeur", function() {
		expect((new MSColor(255)).toString()).toBe('#0000ff') ;
		expect((new MSColor(0xa0a1a2)).toString()).toBe('#a0a1a2') ;
		expect((new MSColor(0xbba0a1a2)).toNumber().toHexa(8)).toBe(0xbba0a1a2.toHexa(8)) ;
		expect((new MSColor(0x0fa0a1a2)).toRGBA().toHexa(8)).toBe(0xa0a1a2f0.toHexa(8)) ;
		expect((new MSColor('ivory')).toNumber().toHexa(8)).toBe(0xfffff0.toHexa(8)) ;
		expect(MSColor.YELLOW.toNumber().toHexa(8)).toBe(0xffff00.toHexa(8)) ;
	}) ;
}) ;
