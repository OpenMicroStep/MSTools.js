if (typeof module !== 'undefined' && module.exports) {  // On Node.js
    require("../../tmp/MSTools");
}

describe("==========Tests MSTE protocol ========", function() {
	
	it("Test decoding of version MSTE0101", function() {
		var oldMSTEString = '["MSTE0101",3710,"CRC0638641A",1,"XVar",137,"PACT","VARS","_default_","planningSwitch","flags","value","options","objectKey","globals","disabledObjects","index","switch","planningForm","startingHourField","configurationsList","forceDontChoice","statutsList","endingDateField","target","startingDateField","visuPop","intervallePopUp","daysSwitches","selecteds","FORCE_RELOAD_ORIGIN","stepValue","visuIndexRadio","RSRC","path","modificationDate","isFolder","basePath","CARD","ACTIONS","revalidatePreResaINet","gapToNextWeek","duplicateResaWithContract","invalidateGapWithRefund","duplicateResa","revalidateReservation","gotoContract","rejectPreResa","invalidateReservation","newSimpleResaFromResource","gotoResource","editResa","gotoSession","addSimple","gotoActivityFromItem","gotoResourceFromItem","moveGap","deleteResaKeepSubscription","gotoContractor","gotoPlaceFromItem","gapToPreviousDay","invalidateGap","gapToPreviousWeek","acceptPreResa","gotoPlace","addComplex","gapToNextDay","refresh","home","deleteResaWithRefund","revalidateGapKeepSubscription","next","gotoActivity","gotoPeopleFromItem","editResaReadOnly","gotoRegisteredUser","progPrint","print","deleteResaKeepFile","invalidateGapKeepSubscription","editRegistereds","newResaFromResource","gotoPlaceClosures","revalidateGapKeepFile","add","deleteResa","invalidateGapKeepFile","revalidateGap","previous","MID","STAT","CARDTITLE","OPTS","LOCCTRL","CTXCLASS","FRAME_NAME","LOCCTRLPARAM","noEmptyPeriods","outlineStyle","selectedDays","interval","drawsLabels","interfaceName","endingDate","startingDate","objectName","planningColors","gapsBackgroundColor","rulerMinutesFontColor","planningStyles","tcol","bcol","firstHashAngle","firstHashInterspace","hcol","hasFirstHash","firstHashWidth","col","grad","gcol","width","rulerHoursColor","backgroundColor","rulerMinutesColor","rulerHoursFontColor","gradientStyle","hoursSeparationLineColor","outlinesColor","gapsHeaderBackgroundColor","periodBackgroundColor","conflictsColor","periodTitlesColor","titlesColor","borderStyle","heightStyle","origin","planningData","formName","showsDaysOnly","backgroundCalendars","expandsOnRefresh","showsEmptyItems","INAM",8,10,0,5,"switch",1,8,2,2,8,2,3,50,6,4,3,17672,5,3,1,6,22,0,0,7,3,-1,8,8,1,9,21,1,3,10,9,8,11,50,6,4,3,17416,5,9,6,6,22,0,0,7,9,8,8,9,9,10,9,8,12,8,11,13,50,5,4,3,2056,5,3,8,6,22,3,0,3,22,7,9,8,10,9,8,14,50,6,4,3,16704,5,5,"test",6,22,20,1,9,23,23,"",7,9,8,8,8,1,15,5,"YES",10,9,19,16,50,6,4,9,22,5,5,"Tous les cr\\u00E9neaux",6,22,20,6,9,30,5,"R\\u00E9servations exceptionnelles",5,"Pr\\u00E9-r\\u00E9servations standards",5,"R\\u00E9servations confirm\\u00E9es",5,"Cr\\u00E9neaux invalid\\u00E9s",5,"Pr\\u00E9-r\\u00E9servations I-Net",9,26,7,9,8,8,8,0,10,9,19,17,50,6,4,3,520,5,6,1351641600,6,22,0,0,7,9,8,8,8,1,18,5,"refresh",10,9,8,19,50,5,4,9,40,5,6,1351123200,6,9,42,7,9,8,10,9,8,20,50,5,4,9,12,5,9,19,6,22,0,0,7,9,8,10,9,8,21,50,5,4,9,5,5,3,60,6,9,42,7,9,8,10,9,8,22,50,6,4,3,19720,5,3,7,6,22,0,0,7,9,8,8,8,1,23,21,7,0,1,2,3,4,5,6,10,9,8,24,50,5,4,3,2568,5,9,19,6,22,0,0,7,9,8,10,9,8,25,50,5,4,9,5,5,9,6,6,22,0,0,7,9,8,10,9,8,26,50,6,4,9,22,5,5,"Ressources avec les activit\\u00E9s",6,22,20,4,9,63,5,"Ressources sans les activit\\u00E9s",5,"Usagers",5,"Activit\\u00E9s",9,26,7,9,8,8,9,38,10,9,19,27,20,1,8,4,28,5,"Z:\\\\PlanitecMS\\\\Library\\\\XNet\\\\PlanitecServer.xna\\\\Resources\\\\Microstep\\\\MASH\\\\interfaces\\\\planning@planningBox.json",29,6,1350376108,30,9,19,31,5,"_main_/interfaces/planning@planningBox",32,5,"planningBox",33,8,55,34,9,19,35,9,19,36,9,19,14,9,19,37,9,19,38,9,19,39,9,19,40,9,19,41,9,19,42,9,19,43,9,19,44,9,19,45,9,19,46,9,19,47,9,19,48,9,19,49,9,19,50,9,19,51,9,19,52,9,19,53,9,19,54,9,19,55,9,19,56,9,19,57,9,19,58,9,19,59,9,19,60,9,19,61,9,19,62,9,53,63,9,19,20,9,19,64,9,19,65,9,19,66,9,19,67,9,19,68,9,19,69,9,19,70,9,19,71,9,19,72,9,19,26,9,19,73,9,19,74,9,19,75,9,19,76,9,19,11,9,19,77,9,19,22,9,19,78,9,19,79,9,19,80,9,19,16,9,19,81,9,19,82,9,19,83,3,6,84,3,2,85,5,"/Planning/Visualisation",86,8,4,87,5,"PlanningControler",88,5,"PPlanningVisualizationContext",89,5,"Plan",90,8,18,91,9,19,92,9,19,93,21,7,0,1,2,3,4,5,6,94,9,50,95,9,6,96,5,"planning",97,6,1351641600,98,6,1351123200,99,5,"planningView",100,8,16,101,7,14474460,102,7,0,103,20,27,8,2,104,7,16777215,105,7,255,8,7,106,9,50,105,9,95,107,4,5.000000,108,9,94,109,9,6,110,9,6,104,9,94,8,9,106,9,50,111,7,7743014,104,7,4527638,105,7,16733522,107,4,10.000000,108,7,16750474,109,9,6,112,9,97,110,4,3.000000,8,9,106,9,50,111,7,2520614,104,7,1459478,105,7,5635922,107,9,102,108,7,9961354,109,9,6,112,9,97,110,9,104,8,9,106,9,50,111,7,7879680,104,7,7864320,105,7,16752660,107,9,102,108,7,16769674,109,9,6,112,9,97,110,9,104,9,98,9,93,9,93,8,6,104,7,4737096,113,7,3487029,105,7,11250603,112,9,19,114,9,8,111,9,118,8,1,105,7,16776960,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16776960,108,7,0,8,1,105,7,16726259,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16726259,108,7,0,8,1,105,7,16741194,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16741194,108,7,0,8,1,105,7,16730346,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16730346,108,7,0,8,1,105,7,5368063,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,5368063,108,7,0,8,1,105,7,2219263,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,2219263,108,7,0,8,1,105,7,16728766,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16728766,108,7,0,8,1,105,7,7150591,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,7150591,108,7,0,8,1,105,7,3014425,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,3014425,108,9,133,115,7,16776960,116,7,13421772,117,7,8355711,118,9,91,119,9,19,120,9,165,121,9,91,122,9,94,123,7,13421772,124,7,16711680,125,9,91,126,9,95,127,9,19,128,9,19,129,9,17,130,20,3,20,7,3,16780549,5,"CENTRE",0,20,2,20,7,3,16780549,5,"salle Joliot-Curie",20,7,20,11,6,1351411200,6,1351468200,5,"salle ferm\\u00E9e",3,9,3,106911,3,16001,3,1246208,9,19,0,0,3,26431,20,11,6,1351497600,6,1351554600,9,180,9,181,3,106988,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351238400,6,1351295400,9,180,9,181,3,107082,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351152000,6,1351209000,9,180,9,181,3,107115,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351670400,6,1351727400,9,180,9,181,3,107199,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351584000,6,1351641000,9,180,9,181,3,107458,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351324800,6,1351381800,9,180,9,181,3,107548,9,183,3,1246208,9,19,0,0,9,185,20,1,20,7,3,50332682,5,"VIE ASSOCIATIVE",9,176,20,1,20,7,3,100664320,5,"FERMETURE DE SALLE",9,176,0,3,46,0,0,3,584,0,0,3,5,0,0,20,7,3,16780549,5,"X_salle des f\\u00EAtes",20,1,20,10,6,1339545600,6,1402444800,5,"SALLE FERMEE",3,5,3,111586,0,3,2490368,9,19,0,0,0,3,1,0,0,3,55,0,0,20,7,3,16780549,5,"CHEMIN DE L\'ILE",0,20,1,20,7,3,16780549,5,"X_petite salle Voltaire",20,1,20,10,6,1339545600,6,1402444800,9,234,9,235,3,111587,0,3,2490368,9,19,0,0,0,3,13,0,0,3,51,0,0,20,7,3,16780549,5,"UNIVERSITE",0,20,3,20,7,9,170,5,"BERTHELOT",0,20,8,20,7,3,16780549,5,"salle d\'Arts Plastiques - 1er \\u00E9tage",20,3,20,11,6,1351614600,6,1351629000,5,"c\\u00E9ramique",3,17,3,112813,3,16367,3,1245184,9,19,0,0,3,27164,20,11,6,1351182600,6,1351198800,9,269,3,17,3,112895,3,16369,3,1246208,9,19,0,0,3,27211,20,11,6,1351333800,6,1351364400,9,269,3,17,3,112930,3,16370,3,1246208,9,19,0,0,3,27253,20,1,20,7,3,50332681,5,"AGORA IDF92",9,265,20,1,20,7,9,222,5,"Activit\\u00E9s culturelles",9,265,0,3,13,0,0,3,295,0,0,3,38,0,0,20,7,3,16780549,5,"salle de Cours - 2\\u00E8me \\u00E9tage",20,6,20,11,6,1351339200,6,1351364400,5,"cours",3,9,3,112233,3,16354,3,1246208,9,19,0,0,3,26874,20,11,6,1351414800,6,1351432800,9,308,3,9,3,112261,3,16355,3,1245184,9,19,0,0,3,26905,20,11,6,1351269000,6,1351283400,5,"aide \\u00E0 la scolarit\\u00E9",3,19,3,113054,3,16373,3,1246208,9,19,0,0,3,27322,20,11,6,1351528200,6,1351542600,9,325,9,326,3,113076,9,328,3,1246208,9,19,0,0,9,330,20,11,6,1351614600,6,1351629000,9,325,9,326,3,113097,9,328,3,1246208,9,19,0,0,9,330,20,11,6,1351182600,6,1351197000,9,325,9,326,3,113148,9,328,3,1246208,9,19,0,0,9,330,20,2,20,7,3,50332681,5,"FRANCO TAMOULS",20,2,9,305,9,314,20,1,20,7,9,222,9,297,9,350,0,3,13,0,0,3,399,0,0,20,7,3,50332681,5,"LA BOUSSOLE",20,4,9,322,9,331,9,336,9,341,20,1,20,7,9,222,5,"Accompagnement \\u00E0 la scolarit\\u00E9",9,358,0,3,16,0,0,3,407,0,0,3,40,0,0,20,7,3,16780549,5,"salle de danse - 2\\u00E8me \\u00E9tage",20,9,20,11,6,1351188000,6,1351198800,5,"DANSE",3,15,3,111894,3,16346,9,340,9,19,0,0,3,26698,20,11,6,1351276200,6,1351292400,5,"FLECH\'CAN",3,15,3,111927,3,16347,3,1246208,9,19,0,0,3,26713,20,11,6,1351353600,6,1351366200,9,308,3,9,3,112166,3,16352,3,1245184,9,19,0,0,3,26836,20,11,6,1351414800,6,1351429200,9,308,3,9,3,112170,3,16353,3,1245184,9,19,0,0,3,26844,20,11,6,1351614600,6,1351629000,5,"danse",3,17,3,112644,3,16364,3,1246208,9,19,0,0,3,27105,20,11,6,1351697400,6,1351710000,9,405,3,17,3,112722,3,16365,3,1246208,9,19,0,0,3,27121,20,11,6,1351333800,6,1351351800,9,405,3,17,3,112747,3,16366,3,1246208,9,19,0,0,3,27161,20,11,6,1351629000,6,1351635300,9,405,3,25,3,114018,3,16384,3,1246208,9,19,0,0,3,27544,20,11,6,1351589400,6,1351596600,5,"expression corporelle",3,9,3,114065,3,16385,3,1246208,9,19,0,0,3,27566,20,5,20,7,3,50332681,9,380,20,2,9,369,9,377,20,1,20,7,9,222,5,"Danse",9,447,0,3,3,0,0,3,457,0,0,20,7,3,50332681,9,349,20,2,9,386,9,394,20,1,20,7,9,222,9,297,9,455,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,294,20,3,9,402,9,411,9,419,20,1,20,7,9,222,9,450,9,462,0,3,3,0,0,3,295,0,0,20,7,3,50332681,5,"ABERPA",20,1,9,427,20,1,20,7,9,222,9,450,9,470,0,3,3,0,0,3,174,0,0,20,7,3,50332682,5,"IME",20,1,9,435,20,1,20,7,9,222,9,297,9,478,0,3,13,0,0,3,582,0,0,3,39,0,0,20,7,3,16780549,5,"salle de quartier - Rdc",20,3,20,11,6,1351339200,6,1351368000,5,"activit\\u00E9s culturelles",3,9,3,112396,3,16358,3,1246208,9,19,0,0,3,26955,20,11,6,1351414800,6,1351440000,9,491,3,9,3,112455,3,16359,3,1246208,9,19,0,0,3,26986,20,11,6,1351156500,6,1351164600,9,297,3,23,3,113613,3,16379,3,1246208,9,19,0,0,3,27449,20,2,20,7,3,50332681,9,349,20,2,9,488,9,497,20,1,20,7,9,222,9,297,9,516,0,3,13,0,0,3,399,0,0,20,7,3,50332681,5,"CENTRE SOCIAL ET CULTUREL LA TRAVERSES - UNIS VERS CITES",20,1,9,505,20,1,20,7,9,222,9,297,9,524,0,9,458,0,0,3,355,0,0,3,19,0,0,20,7,3,16780549,5,"salle de r\\u00E9unions - 1er \\u00E9tage",20,12,20,11,6,1351339200,6,1351364400,9,491,3,9,3,112316,3,16356,3,1246208,9,19,0,0,3,26931,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112354,3,16357,3,1246208,9,19,0,0,3,26941,9,322,9,331,9,336,9,341,20,11,6,1351501200,6,1351509300,5,"ateliers socio linguistique",3,23,3,113746,3,16381,3,1246208,9,19,0,0,3,27492,20,11,6,1351587600,6,1351595700,9,552,9,553,3,113776,9,555,3,1246208,9,19,0,0,9,557,20,11,6,1351155600,6,1351163700,9,552,9,553,3,113830,9,555,3,1246208,9,19,0,0,9,557,20,11,6,1351173600,6,1351180800,9,552,3,23,3,113901,3,16382,3,1246208,9,19,0,0,3,27508,20,11,6,1351605600,6,1351612800,9,552,9,571,3,113922,9,573,3,1246208,9,19,0,0,9,575,20,11,6,1351519200,6,1351526400,9,552,9,571,3,113964,9,573,9,312,9,19,0,0,9,575,20,3,20,7,3,50332681,9,349,20,2,9,533,9,541,20,1,20,7,9,222,9,297,9,588,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,357,9,358,20,1,20,7,9,222,9,361,9,358,0,3,16,0,0,3,407,0,0,20,7,3,50332681,9,523,20,6,9,549,9,558,9,563,9,568,9,576,9,581,20,1,20,7,9,222,9,297,9,601,0,3,13,0,0,3,355,0,0,3,37,0,0,20,7,3,16780549,5,"salle de vie cuisine - 1er \\u00E9tage",20,9,20,11,6,1351692000,6,1351702800,5,"Atelier cuisine",3,15,3,111975,3,16348,3,1246208,9,19,0,0,3,26744,20,11,6,1351339200,6,1351360800,9,491,9,181,3,112524,3,16361,9,312,9,19,0,0,3,27027,20,11,6,1351278000,6,1351285200,9,491,3,9,3,112585,3,16362,3,1245184,9,19,0,0,3,27053,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112618,3,16363,3,1245184,9,19,0,0,3,27075,20,11,6,1351614600,6,1351629000,5,"ateliers",3,19,3,113216,3,16374,3,1246208,9,19,0,0,3,27344,20,11,6,1351528200,6,1351542600,9,645,9,646,3,113221,9,648,3,1246208,9,19,0,0,9,650,20,11,6,1351172700,6,1351180800,5,"atelier cuisine",9,553,3,113495,3,16378,9,442,9,19,0,0,3,27437,20,11,6,1351259100,6,1351267200,9,659,9,553,3,113537,9,661,3,1246208,9,19,0,0,9,662,20,11,6,1351604700,6,1351612800,9,659,9,553,3,113597,9,661,3,1246208,9,19,0,0,9,662,20,4,20,7,3,50332681,9,380,20,1,9,611,20,1,20,7,9,222,5,"Cuisine",9,676,0,3,9,0,0,3,457,0,0,20,7,3,50332681,9,349,20,3,9,620,9,626,9,634,20,1,20,7,9,222,9,297,9,684,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,357,20,2,9,642,9,651,20,1,20,7,9,222,9,679,9,691,0,3,9,0,0,3,407,0,0,20,7,3,50332681,9,523,20,3,9,656,9,663,9,668,20,1,20,7,9,222,9,679,9,698,0,3,9,0,0,3,355,0,0,3,36,0,0,20,7,3,16780549,5,"salle des petits - 2\\u00E8me \\u00E9tage",20,5,20,11,6,1351339200,6,1351360800,9,308,3,9,3,112042,3,16350,3,1246208,9,19,0,0,3,26776,20,11,6,1351414800,6,1351425600,9,308,3,9,3,112085,3,16351,3,1246208,9,19,0,0,3,26808,20,11,6,1351699200,6,1351708200,5,"gym douce",3,17,3,112998,3,16372,3,1246208,9,19,0,0,3,27279,20,11,6,1351269000,6,1351283400,5,"aide \\u00E0 la parentalit\\u00E9",3,19,3,113343,3,16375,3,1246208,9,19,0,0,3,27346,20,11,6,1351182600,6,1351197000,9,736,9,737,3,113378,9,739,9,195,9,19,0,0,9,741,20,3,20,7,3,50332681,9,349,20,2,9,708,9,716,20,1,20,7,9,222,9,297,9,749,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,294,20,1,9,724,20,1,20,7,9,222,9,297,9,756,0,3,13,0,0,3,295,0,0,20,7,3,50332681,9,357,20,2,9,733,9,742,20,1,20,7,9,222,5,"Parentalit\\u00E9",9,763,0,3,20,0,0,3,407,0,0,3,41,0,0,20,7,3,16780549,5,"salle des s\\u00E9niors - Rdc",20,11,20,11,6,1351269000,6,1351288800,5,"rencontre conviviale",3,11,3,107885,3,16258,3,1246208,9,19,0,0,3,26480,20,11,6,1351528200,6,1351548000,9,777,9,778,3,108024,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351614600,6,1351634400,9,777,9,778,3,108076,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351182600,6,1351202400,9,777,9,778,3,108081,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351350000,6,1351375200,5,"LES DOMINOS",3,11,3,108176,3,16259,3,1245184,9,19,0,0,3,26492,20,11,6,1351436400,6,1351461600,9,801,9,802,3,108194,9,804,3,1245184,9,19,0,0,9,806,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112506,3,16360,9,200,9,19,0,0,3,27007,20,11,6,1351344600,6,1351350000,5,"cours Italien",9,422,3,112966,3,16371,9,195,9,19,0,0,3,27261,20,11,6,1351692000,6,1351699200,5,"atelier mosa\\u00EFque romaine",3,21,3,113443,3,16377,3,1246208,9,19,0,0,3,27409,20,11,6,1351242900,6,1351251000,5,"atelier lecture",3,23,3,113654,3,16380,3,1246208,9,19,0,0,3,27471,20,11,6,1351156500,6,1351164600,9,838,9,839,3,113686,9,841,3,1246208,9,19,0,0,9,843,20,5,20,7,3,50332681,9,801,20,6,9,774,9,783,9,788,9,793,9,798,9,807,20,1,20,7,9,222,9,297,9,852,0,3,13,0,0,3,916,0,0,20,7,3,50332681,9,349,20,1,9,812,20,1,20,7,9,222,9,297,9,859,0,3,13,0,0,3,399,0,0,20,7,9,697,9,294,20,1,9,819,20,1,20,7,9,222,5,"Divers",9,865,0,3,12,0,0,3,295,0,0,20,7,3,50332681,5,"CLUB AMITIE ET LOISIRS DES SENIORS DE NANTERRE",20,1,9,826,20,1,20,7,9,222,9,297,9,874,0,3,13,0,0,3,319,0,0,20,7,3,50332681,9,523,20,2,9,835,9,844,20,1,20,7,9,222,9,297,9,881,0,3,13,0,0,3,355,0,0,3,20,0,0,3,34,0,0,20,7,9,174,5,"PROVINCES FRANCAISES",20,1,20,10,6,1341187200,6,1404086400,9,234,9,235,3,111588,0,3,2490368,9,19,0,0,0,3,59,0,0,20,7,9,366,5,"salle Soufflot",20,2,20,11,6,1351330200,6,1351346400,5,"cours et jeux d\'\\u00E9chec",3,13,3,111767,3,16314,3,1246208,9,19,0,0,3,26601,20,11,6,1351623600,6,1351634400,5,"COURS DE DANSE",3,15,3,112035,3,16349,3,1245184,9,19,0,0,3,26758,20,2,20,7,3,50332681,5,"ESN ECHEC",20,1,9,900,20,1,20,7,9,222,9,297,9,922,0,3,13,0,0,3,1130,0,0,20,7,3,50332681,9,380,20,1,9,909,20,1,20,7,9,222,9,450,9,929,0,3,3,0,0,3,457,0,0,3,31,0,0,3,52,0,0,131,5,"planningForm",132,9,19,133,20,0,134,9,19,135,9,19,136,9,85]' ;
        var decoder = new MSTools.MSTE.Decoder() ;

        var r;
        try {
            r = decoder.parse(oldMSTEString) ;
        } catch (e) {
            console.log(e);
            expect(true).toBe(false) ;
            return;
        }

        //console.log(MSTools.stringify(r)) ;
		expect(r.PACT).toBe('switch') ;
		expect(r.VARS.planningForm.startingHourField.options.secondMember).toBe(22) ;
		expect(r.VARS.planningForm.visuPop.flags).toBe(17416) ;
		expect(r.VARS.planningForm.visuIndexRadio.options.firstMember[0]).toBe(r.VARS.planningForm.visuIndexRadio.value) ;
		expect(r.RSRC[0].basePath).toBe('_main_/interfaces/planning@planningBox') ;
		expect(r.CARD).toBe('planningBox') ;
		expect(r.INAM).toBe('planning') ;

	}) ;
	
	it("Test encoding/decoding of version MSTE0102", function() {
		var array = [
			{
				id: "0001",
				type: "donut",
				name: "Cake",
				ppu: 0.55,
				batters:
					{
						batter:
							[
								{ id: "1001", type: "Regular" },
								{ id: "1002", type: "Chocolate" },
								{ id: "1003", type: "Blueberry" },
								{ id: "1004", type: "Devil's Food" }
							]
					},
				topping:
					[
						{ id: "5001", type: "None" },
						{ id: "5002", type: "Glazed" },
						{ id: "5005", type: "Sugar" },
						{ id: "5007", type: "Powdered Sugar" },
						{ id: "5006", type: "Chocolate with Sprinkles" },
						{ id: "5003", type: "Chocolate" },
						{ id: "5004", type: "Maple" }
					]
			},
			{
				id: "0002",
				type: "donut",
				name: "Raised",
				ppu: 0.55,
				batters:
					{
						"batter":
							[
								{ id: "1001", type: "Regular" }
							]
					},
				topping:
					[
						{ id: "5001", type: "None" },
						{ id: "5002", type: "Glazed" },
						{ id: "5005", type: "Sugar" },
						{ id: "5003", type: "Chocolate" },
						{ id: "5004", type: "Maple" }
					]
			},
			{
				id: "0003",
				type: "donut",
				name: "Old Fashioned",
				ppu: 0.55,
				batters:
					{
						"batter":
							[
								{ id: "1001", type: "Regular" },
								{ id: "1002", type: "Chocolate" }
							]
					},
				topping:
					[
						{ id: "5001", type: "None" },
						{ id: "5002", type: "Glazed" },
						{ id: "5003", type: "Chocolate" },
						{ id: "5004", type: "Maple" }
					]
			}
		] ;
	
		var encoder = new MSTools.MSTE.Encoder() ;

		encoder.encodeObject(array) ;

        var tokens = encoder.finalizeTokens() ;

		var m = MSTools.stringify(tokens) ;
			
		var r = MSTools.MSTE.parse(m) ;
	
		expect(MSTools.stringify(r)).toBe(MSTools.stringify(array)) ;
	}) ;
	
	it("decodes OBJC demo mste chain", function () {
        var JMChain = '["MSTE0102",60,"CRC30DA22E7",2,"Person","Person2",4,"firstName","maried-to","name","birthday",31,8,50,4,0,21,"Yves",1,50,4,0,21,"Claire",1,9,1,2,21,"Durand",3,22,-207360000,2,21,"Durand \u00A5-$-\u20AC",3,22,-243820800,9,3,51,3,2,9,5,0,21,"Lou",3,22,552096000,4,25,"Rjd5NA==",9,1,9,12,4]';

        var r = MSTools.MSTE.parse(JMChain) ;

        //console.log(jasmine.pp(r));
		/*
			Hand decoded MSTE 
			
			[
				"MSTE0102",
				60,
				"CRC30DA22E7",
				2,"Person","Person2",
				4,"firstName","maried-to","name","birthday",
				[ // 31, 8 --- Object 0
					{ // 50 e.g. "Person",4, --- Object 1
						/0/firstName:"Yves", // 21,"Yves", --- Object 2
						/1/maried-to:{ // 50 e.g. "Person",4 --- Object 3
							/0/firstName:"Claire", // 21,"Claire" --- Object 4
							/1/maried-to:<ref to Yves>, // 1,9,1, ==> ref to object 1
							/2/name:"Durand", // 21,"Durand" --- Object 5
							/3/birthday:<date>, // 22, date represented by -207360000 --- Object 6
						}
						/2/name:"Durand ¥-$-€", // 2,21,"Durand \u00A5-$-\u20AC", --- Object 7
						/3/birthday:<date>, // 22, date represented by -243820800 --- Object 8
					},
					<ref to Claire>,
					{ // 51 e.g. "Person2",3, --- Object 9 
						/2/name:"Durand", // 9, 5 ===> ref to object 5
						/0/firstName:"Lou", // 21,"Lou" --- Object 10
						/3/birthday:<date>, // 22, date represented by 552096000 --- Object 11
					},
					<empty data>, // 4, 
					<data>, // 25,"Rjd5NA==" --- Object 12
					<ref to Yves>, // 9,1
					<ref to the last data object>, // 9,12,
					<empty data> //4
				]
			]
		*/

        expect(r[0].firstName).toBe("Yves") ;
        expect(r[0]["maried-to"].firstName).toBe("Claire") ;   // Yves's wife is Claire, this reference is correct
		expect(r[1]).toBe(r[0]["maried-to"]) ;
        expect(r[2].firstName).toBe("Lou") ;
		expect(r[3]).toBe(MSData.EMPTY_DATA) ;
		expect(r[4].toBase64String()).toBe("Rjd5NA==") ;
		expect(r[5]).toBe(r[0]) ;
		expect(r[6]).toBe(r[4]) ;
		expect(r[7]).toBe(MSData.EMPTY_DATA) ;

    });

	it("decodes OBJC demo mste chain with local classes", function () {
        var JMChain = '["MSTE0102",60,"CRC30DA22E7",2,"Person","Person2",4,"firstName","maried-to","name","birthday",31,8,50,4,0,21,"Yves",1,50,4,0,21,"Claire",1,9,1,2,21,"Durand",3,22,-207360000,2,21,"Durand \u00A5-$-\u20AC",3,22,-243820800,9,3,51,3,2,9,5,0,21,"Lou",3,22,552096000,4,25,"Rjd5NA==",9,1,9,12,4]';

		function Person1() { } 
		function Person2() { } 
		
		MSTools.defineHiddenConstant(Person1.prototype, 'isa', 'Person', true) ;
		MSTools.defineHiddenConstant(Person2.prototype, 'isa', 'Person2', true) ;


        var r = MSTools.MSTE.parse(JMChain, {
			classes:{
				'Person':Person1,
				'Person2':Person2
			}
		}) ;

		expect(r[0].isa).toBe('Person') ;
		expect(r[1].isa).toBe('Person') ;
		expect(r[2].isa).toBe('Person2') ;

        expect(r[0].firstName).toBe("Yves") ;
        expect(r[0]["maried-to"].firstName).toBe("Claire") ;   // Yves's wife is Claire, this reference is correct
		expect(r[1]).toBe(r[0]["maried-to"]) ;
        expect(r[2].firstName).toBe("Lou") ;
		expect(r[3]).toBe(MSData.EMPTY_DATA) ;
		expect(r[4].toBase64String()).toBe("Rjd5NA==") ;
		expect(r[5]).toBe(r[0]) ;
		expect(r[6]).toBe(r[4]) ;
		expect(r[7]).toBe(MSData.EMPTY_DATA) ;

    });
    
	
	it("encodes simple references (same ref is used multiple times: a person is father to one and married to another)", function () {
        var data = [{
            name: "Durand ¥-$-€",
            firstName: "Yves",
            birthday: new Date()
        }, {
            name: "Durand",
            firstName: "Claire",
            birthday: new Date()
        }, {
            name: "Durand",
            firstName: "Lou",
            birthday: new Date()
        }];

        data[0]["maried_to"] = data[1];
        data[1]["maried_to"] = data[0];

        data[2]["father"] = data[0];
        data[2]["mother"] = data[1];


        var encoder = new MSTools.MSTE.Encoder() ;
        encoder.encodeObject(data) ;
        var tokens = encoder.finalizeTokens() ;
        var m = MSTools.stringify(tokens) ;
        var r = MSTools.MSTE.parse(m) ;

        //console.log(jasmine.pp(data));
        //console.log(jasmine.pp(r));           // ! jasmine.pp => a stringify that doesn't stop when encountering circular refs

		expect(r[0].name).toBe("Durand ¥-$-€") ;
		expect(r[1].name).toBe("Durand") ;
		expect(r[2].name).toBe("Durand") ;
		expect(r[0].firstName).toBe("Yves") ;
		expect(r[1].firstName).toBe("Claire") ;
		expect(r[2].firstName).toBe("Lou") ;
		expect(r[0].birthday.getUTCFullSeconds()).toBe(data[0].birthday.getUTCFullSeconds()) ; // dates are not strictly equals.
		expect(r[1].birthday.getUTCFullSeconds()).toBe(data[1].birthday.getUTCFullSeconds()) ; // reference time is truncated to the
		expect(r[2].birthday.getUTCFullSeconds()).toBe(data[2].birthday.getUTCFullSeconds()) ; // nearest second
		expect(r[0]["maried_to"]).toBe(r[1]) ;
		expect(r[1]["maried_to"]).toBe(r[0]) ;
		expect(r[2].father).toBe(r[0]) ;
		expect(r[2].mother).toBe(r[1]) ;
		
        expect($equals(data, r)).toBe(false);

    });
    
	it("encodes simple references with a true class", function () {
		
		function LocalPerson(n, f, d) {
			this.name = n ;
			this.firstName = f ;
			this.birthday = d ;
		} 
		MSTools.defineInstanceMethods(LocalPerson, {
			isEqualTo:function(other, options) {
				if (this === other) { return true ; }
		        return $ok(other) && this.name === other.name && this.firstName === other.firstName && $equals(this.birthday, other.birthday, options) ? true : false ;
		        
			},
			toMSTEClass:function() { return "person" ; }
		}, true) ;
		MSTools.defineHiddenConstant(LocalPerson.prototype,'isa', 'Person', true) ;
		
		var data = [
			new LocalPerson("Durand ¥-$-€", "Yves", new Date()),
			new LocalPerson("Durand", "Claire", new Date()),
			new LocalPerson("Durand", "Lou", new Date())
		] ;
        data[0]["maried_to"] = data[1];
        data[1]["maried_to"] = data[0];
        data[2]["father"] = data[0];
        data[2]["mother"] = data[1];


        var encoder = new MSTools.MSTE.Encoder() ;
        encoder.encodeObject(data) ;
        var tokens = encoder.finalizeTokens() ;
        var m = MSTools.stringify(tokens) ;
        var r = MSTools.MSTE.parse(m, {
			classes:{
				person:LocalPerson
			}
		}) ;

		expect(r[0].isa).toBe('Person') ;
		expect(r[1].isa).toBe('Person') ;
		expect(r[2].isa).toBe('Person') ;
		
        expect($equals(data, r)).toBe(true);

    });

}) ;