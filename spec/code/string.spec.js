describe("==========Tests du package string========", function() {
	it("Test de la suppression des signes diacritiques", function() {
        expect("àçèñÿüïô".removeDiacritics()).toBe("acenyuio");
    });
    
}) ;
