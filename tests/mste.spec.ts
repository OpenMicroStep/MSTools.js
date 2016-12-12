import {expect} from 'chai';
import {MSTE, MSBuffer, MSNaturalArray, MSDate, MSColor, MSCouple} from '../';

const data_graph = [{
    name: "Durand ¥-$-€",
    firstName: "Yves",
    birthday: new Date(1966,3,13,12,25,33)
}, {
    name: "Durand",
    firstName: "Claire",
    birthday: new MSDate(1952,6,18,6,22,0)
}, {
    name: "Durand",
    firstName: "Lou",
    birthday: new Date(1980,10,11,9,8,7)
}];
data_graph[0]["maried_to"] = data_graph[1];
data_graph[1]["maried_to"] = data_graph[0];

data_graph[2]["father"] = data_graph[0];
data_graph[2]["mother"] = data_graph[1];

class LocalPerson {
    constructor(public name?: string, public firstName?: string, public birthday?: Date) {}
    encodeToMSTE(encoder) { encoder.encodeDictionary(this, "person"); }
}

const data_graph2 = [
    new LocalPerson("Durand ¥-$-€", "Yves", new Date()),
    new LocalPerson("Durand", "Claire", new Date()),
    new LocalPerson("Durand", "Lou", new Date())
] ;
data_graph2[0]["maried_to"] = data_graph2[1];
data_graph2[1]["maried_to"] = data_graph2[0];
data_graph2[2]["father"] = data_graph2[0];
data_graph2[2]["mother"] = data_graph2[1];

const data_array = [
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

const oldMSTEString = '["MSTE0101",3710,"CRC0638641A",1,"XVar",137,"PACT","VARS","_default_","planningSwitch","flags","value","options","objectKey","globals","disabledObjects","index","switch","planningForm","startingHourField","configurationsList","forceDontChoice","statutsList","endingDateField","target","startingDateField","visuPop","intervallePopUp","daysSwitches","selecteds","FORCE_RELOAD_ORIGIN","stepValue","visuIndexRadio","RSRC","path","modificationDate","isFolder","basePath","CARD","ACTIONS","revalidatePreResaINet","gapToNextWeek","duplicateResaWithContract","invalidateGapWithRefund","duplicateResa","revalidateReservation","gotoContract","rejectPreResa","invalidateReservation","newSimpleResaFromResource","gotoResource","editResa","gotoSession","addSimple","gotoActivityFromItem","gotoResourceFromItem","moveGap","deleteResaKeepSubscription","gotoContractor","gotoPlaceFromItem","gapToPreviousDay","invalidateGap","gapToPreviousWeek","acceptPreResa","gotoPlace","addComplex","gapToNextDay","refresh","home","deleteResaWithRefund","revalidateGapKeepSubscription","next","gotoActivity","gotoPeopleFromItem","editResaReadOnly","gotoRegisteredUser","progPrint","print","deleteResaKeepFile","invalidateGapKeepSubscription","editRegistereds","newResaFromResource","gotoPlaceClosures","revalidateGapKeepFile","add","deleteResa","invalidateGapKeepFile","revalidateGap","previous","MID","STAT","CARDTITLE","OPTS","LOCCTRL","CTXCLASS","FRAME_NAME","LOCCTRLPARAM","noEmptyPeriods","outlineStyle","selectedDays","interval","drawsLabels","interfaceName","endingDate","startingDate","objectName","planningColors","gapsBackgroundColor","rulerMinutesFontColor","planningStyles","tcol","bcol","firstHashAngle","firstHashInterspace","hcol","hasFirstHash","firstHashWidth","col","grad","gcol","width","rulerHoursColor","backgroundColor","rulerMinutesColor","rulerHoursFontColor","gradientStyle","hoursSeparationLineColor","outlinesColor","gapsHeaderBackgroundColor","periodBackgroundColor","conflictsColor","periodTitlesColor","titlesColor","borderStyle","heightStyle","origin","planningData","formName","showsDaysOnly","backgroundCalendars","expandsOnRefresh","showsEmptyItems","INAM",8,10,0,5,"switch",1,8,2,2,8,2,3,50,6,4,3,17672,5,3,1,6,22,0,0,7,3,-1,8,8,1,9,21,1,3,10,9,8,11,50,6,4,3,17416,5,9,6,6,22,0,0,7,9,8,8,9,9,10,9,8,12,8,11,13,50,5,4,3,2056,5,3,8,6,22,3,0,3,22,7,9,8,10,9,8,14,50,6,4,3,16704,5,5,"test",6,22,20,1,9,23,23,"",7,9,8,8,8,1,15,5,"YES",10,9,19,16,50,6,4,9,22,5,5,"Tous les cr\\u00E9neaux",6,22,20,6,9,30,5,"R\\u00E9servations exceptionnelles",5,"Pr\\u00E9-r\\u00E9servations standards",5,"R\\u00E9servations confirm\\u00E9es",5,"Cr\\u00E9neaux invalid\\u00E9s",5,"Pr\\u00E9-r\\u00E9servations I-Net",9,26,7,9,8,8,8,0,10,9,19,17,50,6,4,3,520,5,6,1351641600,6,22,0,0,7,9,8,8,8,1,18,5,"refresh",10,9,8,19,50,5,4,9,40,5,6,1351123200,6,9,42,7,9,8,10,9,8,20,50,5,4,9,12,5,9,19,6,22,0,0,7,9,8,10,9,8,21,50,5,4,9,5,5,3,60,6,9,42,7,9,8,10,9,8,22,50,6,4,3,19720,5,3,7,6,22,0,0,7,9,8,8,8,1,23,21,7,0,1,2,3,4,5,6,10,9,8,24,50,5,4,3,2568,5,9,19,6,22,0,0,7,9,8,10,9,8,25,50,5,4,9,5,5,9,6,6,22,0,0,7,9,8,10,9,8,26,50,6,4,9,22,5,5,"Ressources avec les activit\\u00E9s",6,22,20,4,9,63,5,"Ressources sans les activit\\u00E9s",5,"Usagers",5,"Activit\\u00E9s",9,26,7,9,8,8,9,38,10,9,19,27,20,1,8,4,28,5,"Z:\\\\PlanitecMS\\\\Library\\\\XNet\\\\PlanitecServer.xna\\\\Resources\\\\Microstep\\\\MASH\\\\interfaces\\\\planning@planningBox.json",29,6,1350376108,30,9,19,31,5,"_main_/interfaces/planning@planningBox",32,5,"planningBox",33,8,55,34,9,19,35,9,19,36,9,19,14,9,19,37,9,19,38,9,19,39,9,19,40,9,19,41,9,19,42,9,19,43,9,19,44,9,19,45,9,19,46,9,19,47,9,19,48,9,19,49,9,19,50,9,19,51,9,19,52,9,19,53,9,19,54,9,19,55,9,19,56,9,19,57,9,19,58,9,19,59,9,19,60,9,19,61,9,19,62,9,53,63,9,19,20,9,19,64,9,19,65,9,19,66,9,19,67,9,19,68,9,19,69,9,19,70,9,19,71,9,19,72,9,19,26,9,19,73,9,19,74,9,19,75,9,19,76,9,19,11,9,19,77,9,19,22,9,19,78,9,19,79,9,19,80,9,19,16,9,19,81,9,19,82,9,19,83,3,6,84,3,2,85,5,"/Planning/Visualisation",86,8,4,87,5,"PlanningControler",88,5,"PPlanningVisualizationContext",89,5,"Plan",90,8,18,91,9,19,92,9,19,93,21,7,0,1,2,3,4,5,6,94,9,50,95,9,6,96,5,"planning",97,6,1351641600,98,6,1351123200,99,5,"planningView",100,8,16,101,7,14474460,102,7,0,103,20,27,8,2,104,7,16777215,105,7,255,8,7,106,9,50,105,9,95,107,4,5.000000,108,9,94,109,9,6,110,9,6,104,9,94,8,9,106,9,50,111,7,7743014,104,7,4527638,105,7,16733522,107,4,10.000000,108,7,16750474,109,9,6,112,9,97,110,4,3.000000,8,9,106,9,50,111,7,2520614,104,7,1459478,105,7,5635922,107,9,102,108,7,9961354,109,9,6,112,9,97,110,9,104,8,9,106,9,50,111,7,7879680,104,7,7864320,105,7,16752660,107,9,102,108,7,16769674,109,9,6,112,9,97,110,9,104,9,98,9,93,9,93,8,6,104,7,4737096,113,7,3487029,105,7,11250603,112,9,19,114,9,8,111,9,118,8,1,105,7,16776960,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16776960,108,7,0,8,1,105,7,16726259,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16726259,108,7,0,8,1,105,7,16741194,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16741194,108,7,0,8,1,105,7,16730346,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16730346,108,7,0,8,1,105,7,5368063,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,5368063,108,7,0,8,1,105,7,2219263,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,2219263,108,7,0,8,1,105,7,16728766,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,16728766,108,7,0,8,1,105,7,7150591,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,7150591,108,7,0,8,1,105,7,3014425,8,6,107,9,97,109,9,6,106,9,50,110,9,6,105,7,3014425,108,9,133,115,7,16776960,116,7,13421772,117,7,8355711,118,9,91,119,9,19,120,9,165,121,9,91,122,9,94,123,7,13421772,124,7,16711680,125,9,91,126,9,95,127,9,19,128,9,19,129,9,17,130,20,3,20,7,3,16780549,5,"CENTRE",0,20,2,20,7,3,16780549,5,"salle Joliot-Curie",20,7,20,11,6,1351411200,6,1351468200,5,"salle ferm\\u00E9e",3,9,3,106911,3,16001,3,1246208,9,19,0,0,3,26431,20,11,6,1351497600,6,1351554600,9,180,9,181,3,106988,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351238400,6,1351295400,9,180,9,181,3,107082,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351152000,6,1351209000,9,180,9,181,3,107115,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351670400,6,1351727400,9,180,9,181,3,107199,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351584000,6,1351641000,9,180,9,181,3,107458,9,183,3,1246208,9,19,0,0,9,185,20,11,6,1351324800,6,1351381800,9,180,9,181,3,107548,9,183,3,1246208,9,19,0,0,9,185,20,1,20,7,3,50332682,5,"VIE ASSOCIATIVE",9,176,20,1,20,7,3,100664320,5,"FERMETURE DE SALLE",9,176,0,3,46,0,0,3,584,0,0,3,5,0,0,20,7,3,16780549,5,"X_salle des f\\u00EAtes",20,1,20,10,6,1339545600,6,1402444800,5,"SALLE FERMEE",3,5,3,111586,0,3,2490368,9,19,0,0,0,3,1,0,0,3,55,0,0,20,7,3,16780549,5,"CHEMIN DE L\'ILE",0,20,1,20,7,3,16780549,5,"X_petite salle Voltaire",20,1,20,10,6,1339545600,6,1402444800,9,234,9,235,3,111587,0,3,2490368,9,19,0,0,0,3,13,0,0,3,51,0,0,20,7,3,16780549,5,"UNIVERSITE",0,20,3,20,7,9,170,5,"BERTHELOT",0,20,8,20,7,3,16780549,5,"salle d\'Arts Plastiques - 1er \\u00E9tage",20,3,20,11,6,1351614600,6,1351629000,5,"c\\u00E9ramique",3,17,3,112813,3,16367,3,1245184,9,19,0,0,3,27164,20,11,6,1351182600,6,1351198800,9,269,3,17,3,112895,3,16369,3,1246208,9,19,0,0,3,27211,20,11,6,1351333800,6,1351364400,9,269,3,17,3,112930,3,16370,3,1246208,9,19,0,0,3,27253,20,1,20,7,3,50332681,5,"AGORA IDF92",9,265,20,1,20,7,9,222,5,"Activit\\u00E9s culturelles",9,265,0,3,13,0,0,3,295,0,0,3,38,0,0,20,7,3,16780549,5,"salle de Cours - 2\\u00E8me \\u00E9tage",20,6,20,11,6,1351339200,6,1351364400,5,"cours",3,9,3,112233,3,16354,3,1246208,9,19,0,0,3,26874,20,11,6,1351414800,6,1351432800,9,308,3,9,3,112261,3,16355,3,1245184,9,19,0,0,3,26905,20,11,6,1351269000,6,1351283400,5,"aide \\u00E0 la scolarit\\u00E9",3,19,3,113054,3,16373,3,1246208,9,19,0,0,3,27322,20,11,6,1351528200,6,1351542600,9,325,9,326,3,113076,9,328,3,1246208,9,19,0,0,9,330,20,11,6,1351614600,6,1351629000,9,325,9,326,3,113097,9,328,3,1246208,9,19,0,0,9,330,20,11,6,1351182600,6,1351197000,9,325,9,326,3,113148,9,328,3,1246208,9,19,0,0,9,330,20,2,20,7,3,50332681,5,"FRANCO TAMOULS",20,2,9,305,9,314,20,1,20,7,9,222,9,297,9,350,0,3,13,0,0,3,399,0,0,20,7,3,50332681,5,"LA BOUSSOLE",20,4,9,322,9,331,9,336,9,341,20,1,20,7,9,222,5,"Accompagnement \\u00E0 la scolarit\\u00E9",9,358,0,3,16,0,0,3,407,0,0,3,40,0,0,20,7,3,16780549,5,"salle de danse - 2\\u00E8me \\u00E9tage",20,9,20,11,6,1351188000,6,1351198800,5,"DANSE",3,15,3,111894,3,16346,9,340,9,19,0,0,3,26698,20,11,6,1351276200,6,1351292400,5,"FLECH\'CAN",3,15,3,111927,3,16347,3,1246208,9,19,0,0,3,26713,20,11,6,1351353600,6,1351366200,9,308,3,9,3,112166,3,16352,3,1245184,9,19,0,0,3,26836,20,11,6,1351414800,6,1351429200,9,308,3,9,3,112170,3,16353,3,1245184,9,19,0,0,3,26844,20,11,6,1351614600,6,1351629000,5,"danse",3,17,3,112644,3,16364,3,1246208,9,19,0,0,3,27105,20,11,6,1351697400,6,1351710000,9,405,3,17,3,112722,3,16365,3,1246208,9,19,0,0,3,27121,20,11,6,1351333800,6,1351351800,9,405,3,17,3,112747,3,16366,3,1246208,9,19,0,0,3,27161,20,11,6,1351629000,6,1351635300,9,405,3,25,3,114018,3,16384,3,1246208,9,19,0,0,3,27544,20,11,6,1351589400,6,1351596600,5,"expression corporelle",3,9,3,114065,3,16385,3,1246208,9,19,0,0,3,27566,20,5,20,7,3,50332681,9,380,20,2,9,369,9,377,20,1,20,7,9,222,5,"Danse",9,447,0,3,3,0,0,3,457,0,0,20,7,3,50332681,9,349,20,2,9,386,9,394,20,1,20,7,9,222,9,297,9,455,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,294,20,3,9,402,9,411,9,419,20,1,20,7,9,222,9,450,9,462,0,3,3,0,0,3,295,0,0,20,7,3,50332681,5,"ABERPA",20,1,9,427,20,1,20,7,9,222,9,450,9,470,0,3,3,0,0,3,174,0,0,20,7,3,50332682,5,"IME",20,1,9,435,20,1,20,7,9,222,9,297,9,478,0,3,13,0,0,3,582,0,0,3,39,0,0,20,7,3,16780549,5,"salle de quartier - Rdc",20,3,20,11,6,1351339200,6,1351368000,5,"activit\\u00E9s culturelles",3,9,3,112396,3,16358,3,1246208,9,19,0,0,3,26955,20,11,6,1351414800,6,1351440000,9,491,3,9,3,112455,3,16359,3,1246208,9,19,0,0,3,26986,20,11,6,1351156500,6,1351164600,9,297,3,23,3,113613,3,16379,3,1246208,9,19,0,0,3,27449,20,2,20,7,3,50332681,9,349,20,2,9,488,9,497,20,1,20,7,9,222,9,297,9,516,0,3,13,0,0,3,399,0,0,20,7,3,50332681,5,"CENTRE SOCIAL ET CULTUREL LA TRAVERSES - UNIS VERS CITES",20,1,9,505,20,1,20,7,9,222,9,297,9,524,0,9,458,0,0,3,355,0,0,3,19,0,0,20,7,3,16780549,5,"salle de r\\u00E9unions - 1er \\u00E9tage",20,12,20,11,6,1351339200,6,1351364400,9,491,3,9,3,112316,3,16356,3,1246208,9,19,0,0,3,26931,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112354,3,16357,3,1246208,9,19,0,0,3,26941,9,322,9,331,9,336,9,341,20,11,6,1351501200,6,1351509300,5,"ateliers socio linguistique",3,23,3,113746,3,16381,3,1246208,9,19,0,0,3,27492,20,11,6,1351587600,6,1351595700,9,552,9,553,3,113776,9,555,3,1246208,9,19,0,0,9,557,20,11,6,1351155600,6,1351163700,9,552,9,553,3,113830,9,555,3,1246208,9,19,0,0,9,557,20,11,6,1351173600,6,1351180800,9,552,3,23,3,113901,3,16382,3,1246208,9,19,0,0,3,27508,20,11,6,1351605600,6,1351612800,9,552,9,571,3,113922,9,573,3,1246208,9,19,0,0,9,575,20,11,6,1351519200,6,1351526400,9,552,9,571,3,113964,9,573,9,312,9,19,0,0,9,575,20,3,20,7,3,50332681,9,349,20,2,9,533,9,541,20,1,20,7,9,222,9,297,9,588,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,357,9,358,20,1,20,7,9,222,9,361,9,358,0,3,16,0,0,3,407,0,0,20,7,3,50332681,9,523,20,6,9,549,9,558,9,563,9,568,9,576,9,581,20,1,20,7,9,222,9,297,9,601,0,3,13,0,0,3,355,0,0,3,37,0,0,20,7,3,16780549,5,"salle de vie cuisine - 1er \\u00E9tage",20,9,20,11,6,1351692000,6,1351702800,5,"Atelier cuisine",3,15,3,111975,3,16348,3,1246208,9,19,0,0,3,26744,20,11,6,1351339200,6,1351360800,9,491,9,181,3,112524,3,16361,9,312,9,19,0,0,3,27027,20,11,6,1351278000,6,1351285200,9,491,3,9,3,112585,3,16362,3,1245184,9,19,0,0,3,27053,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112618,3,16363,3,1245184,9,19,0,0,3,27075,20,11,6,1351614600,6,1351629000,5,"ateliers",3,19,3,113216,3,16374,3,1246208,9,19,0,0,3,27344,20,11,6,1351528200,6,1351542600,9,645,9,646,3,113221,9,648,3,1246208,9,19,0,0,9,650,20,11,6,1351172700,6,1351180800,5,"atelier cuisine",9,553,3,113495,3,16378,9,442,9,19,0,0,3,27437,20,11,6,1351259100,6,1351267200,9,659,9,553,3,113537,9,661,3,1246208,9,19,0,0,9,662,20,11,6,1351604700,6,1351612800,9,659,9,553,3,113597,9,661,3,1246208,9,19,0,0,9,662,20,4,20,7,3,50332681,9,380,20,1,9,611,20,1,20,7,9,222,5,"Cuisine",9,676,0,3,9,0,0,3,457,0,0,20,7,3,50332681,9,349,20,3,9,620,9,626,9,634,20,1,20,7,9,222,9,297,9,684,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,357,20,2,9,642,9,651,20,1,20,7,9,222,9,679,9,691,0,3,9,0,0,3,407,0,0,20,7,3,50332681,9,523,20,3,9,656,9,663,9,668,20,1,20,7,9,222,9,679,9,698,0,3,9,0,0,3,355,0,0,3,36,0,0,20,7,3,16780549,5,"salle des petits - 2\\u00E8me \\u00E9tage",20,5,20,11,6,1351339200,6,1351360800,9,308,3,9,3,112042,3,16350,3,1246208,9,19,0,0,3,26776,20,11,6,1351414800,6,1351425600,9,308,3,9,3,112085,3,16351,3,1246208,9,19,0,0,3,26808,20,11,6,1351699200,6,1351708200,5,"gym douce",3,17,3,112998,3,16372,3,1246208,9,19,0,0,3,27279,20,11,6,1351269000,6,1351283400,5,"aide \\u00E0 la parentalit\\u00E9",3,19,3,113343,3,16375,3,1246208,9,19,0,0,3,27346,20,11,6,1351182600,6,1351197000,9,736,9,737,3,113378,9,739,9,195,9,19,0,0,9,741,20,3,20,7,3,50332681,9,349,20,2,9,708,9,716,20,1,20,7,9,222,9,297,9,749,0,3,13,0,0,3,399,0,0,20,7,3,50332681,9,294,20,1,9,724,20,1,20,7,9,222,9,297,9,756,0,3,13,0,0,3,295,0,0,20,7,3,50332681,9,357,20,2,9,733,9,742,20,1,20,7,9,222,5,"Parentalit\\u00E9",9,763,0,3,20,0,0,3,407,0,0,3,41,0,0,20,7,3,16780549,5,"salle des s\\u00E9niors - Rdc",20,11,20,11,6,1351269000,6,1351288800,5,"rencontre conviviale",3,11,3,107885,3,16258,3,1246208,9,19,0,0,3,26480,20,11,6,1351528200,6,1351548000,9,777,9,778,3,108024,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351614600,6,1351634400,9,777,9,778,3,108076,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351182600,6,1351202400,9,777,9,778,3,108081,9,780,3,1246208,9,19,0,0,9,782,20,11,6,1351350000,6,1351375200,5,"LES DOMINOS",3,11,3,108176,3,16259,3,1245184,9,19,0,0,3,26492,20,11,6,1351436400,6,1351461600,9,801,9,802,3,108194,9,804,3,1245184,9,19,0,0,9,806,20,11,6,1351414800,6,1351436400,9,491,3,9,3,112506,3,16360,9,200,9,19,0,0,3,27007,20,11,6,1351344600,6,1351350000,5,"cours Italien",9,422,3,112966,3,16371,9,195,9,19,0,0,3,27261,20,11,6,1351692000,6,1351699200,5,"atelier mosa\\u00EFque romaine",3,21,3,113443,3,16377,3,1246208,9,19,0,0,3,27409,20,11,6,1351242900,6,1351251000,5,"atelier lecture",3,23,3,113654,3,16380,3,1246208,9,19,0,0,3,27471,20,11,6,1351156500,6,1351164600,9,838,9,839,3,113686,9,841,3,1246208,9,19,0,0,9,843,20,5,20,7,3,50332681,9,801,20,6,9,774,9,783,9,788,9,793,9,798,9,807,20,1,20,7,9,222,9,297,9,852,0,3,13,0,0,3,916,0,0,20,7,3,50332681,9,349,20,1,9,812,20,1,20,7,9,222,9,297,9,859,0,3,13,0,0,3,399,0,0,20,7,9,697,9,294,20,1,9,819,20,1,20,7,9,222,5,"Divers",9,865,0,3,12,0,0,3,295,0,0,20,7,3,50332681,5,"CLUB AMITIE ET LOISIRS DES SENIORS DE NANTERRE",20,1,9,826,20,1,20,7,9,222,9,297,9,874,0,3,13,0,0,3,319,0,0,20,7,3,50332681,9,523,20,2,9,835,9,844,20,1,20,7,9,222,9,297,9,881,0,3,13,0,0,3,355,0,0,3,20,0,0,3,34,0,0,20,7,9,174,5,"PROVINCES FRANCAISES",20,1,20,10,6,1341187200,6,1404086400,9,234,9,235,3,111588,0,3,2490368,9,19,0,0,0,3,59,0,0,20,7,9,366,5,"salle Soufflot",20,2,20,11,6,1351330200,6,1351346400,5,"cours et jeux d\'\\u00E9chec",3,13,3,111767,3,16314,3,1246208,9,19,0,0,3,26601,20,11,6,1351623600,6,1351634400,5,"COURS DE DANSE",3,15,3,112035,3,16349,3,1245184,9,19,0,0,3,26758,20,2,20,7,3,50332681,5,"ESN ECHEC",20,1,9,900,20,1,20,7,9,222,9,297,9,922,0,3,13,0,0,3,1130,0,0,20,7,3,50332681,9,380,20,1,9,909,20,1,20,7,9,222,9,450,9,929,0,3,3,0,0,3,457,0,0,3,31,0,0,3,52,0,0,131,5,"planningForm",132,9,19,133,20,0,134,9,19,135,9,19,136,9,85]' ;
const JMChain = '["MSTE0102",60,"CRC5ED113C0",2,"Person","Person2",4,"firstName","maried-to","name","birthday",31,8,50,4,0,21,"Yves",1,50,4,0,21,"Claire",1,9,1,2,21,"Durand",3,22,-207360000,2,21,"Durand \\u00A5-$-\\u20AC",3,22,-243820800,9,3,51,3,2,9,5,0,21,"Lou",3,22,552096000,4,25,"Rjd5NA==",9,1,9,12,4]';
const encodedArray = ["MSTE0102",772,"CRC00000000",0,37,"ACT","OPTS","VARS","search","code","options","index","objectKey","flags","name","city","activityType","globals","strings","nameRestriction","value","searchMode","type","activity","tutor","proprio","parent","configsForm","defaultSwitch","configurationsList","forceDontChoice","found","mapSwitch","selectTable","columns","cityColumn","nameColumn","parentIndexSelector","comparisonSelector","target","MID","TIME",30,5,0,21,"find",1,30,0,2,30,3,3,30,11,4,30,4,5,32,0,0,6,20,-1,7,20,-1,8,20,264,9,30,4,5,32,0,20,100,6,20,-1,7,20,-1,8,20,264,10,30,4,5,32,0,0,6,20,-1,7,20,-1,8,20,264,11,30,5,12,30,1,13,31,86,21,"ARTS MARTIAUX",21,"ATHLETISME",21,"AVIRON",21,"BADMINTON",21,"BADMINTON-Scolaire",21,"BASKET-BALL",21,"BOOMERANG",21,"BOULE DE FORT",21,"BOULE LYONNAISE",21,"BOXE",21,"BOXE AMERICAINE",21,"BOXE ANGLAISE",21,"BOXE FRANCAISE",21,"BOXE THAILANDAISE",21,"CANNE ET BATON",21,"CANOE KAYAK",21,"CAPOEIRA",21,"CATCH",21,"CONCERTS",21,"COURS EPS",21,"CYCLISME",21,"CYCLOTOURISME",21,"DANSE",21,"DANSE SUR GLACE",21,"DIVERS",21,"ESCALADE",21,"ESCRIME",21,"FLECHETTE",21,"FOOT EN SALLE",21,"FOOTBALL",21,"FOOTBALL AMERICAIN",21,"FORMATIONS",21,"GOLF",21,"GRIMPER A LA CORDE",21,"GYMNASTIQUE",21,"GYMNASTIQUE ENTRETIEN",21,"HALTEROPHILIE",21,"HANDBALL",21,"HOCKEY SUR GAZON",21,"HOCKEY SUR GLACE",21,"INTERVIEW/ RADIO/TELE",21,"JU JITSU",21,"JUDO",21,"KARATE",21,"KENDO",21,"KIN-BALL",21,"LUTTE",21,"MOTOCYCLISME",21,"MULTISPORTS",21,"MUSCULATION",21,"NETTOYAGE",21,"PARACHUTISME",21,"PATINAGE SUR GLACE",21,"PETANQUE",21,"PLANCHE A VOILE",21,"PLONGEE SOUS MARINE",21,"PREPA.MANIF.",21,"RECEPTIONS/FESTIVITES",21,"REUNIONS",21,"RINGUETTE",21,"ROLLER HOCKEY",21,"ROLLER SKATING",21,"RUGBY",21,"SAUNA",21,"SPELEOLOGIE",21,"SPORTS DE GLACE",21,"SPORTS SCOLAIRES",21,"TAEKWONDO",21,"TAI DOH",21,"TAI JITSU",21,"TENNIS",21,"TENNIS DE TABLE",21,"TIR A L'ARC",21,"TIR A LA CIBLE",21,"TONFA",21,"TONFA",21,"TRAMPOLINE",21,"TRAVAUX",21,"TRIATHLON",21,"TWIRLING",21,"TX PAR ENTREPRISE",21,"ULTIMATE",21,"VETERANS",21,"VIET VO DAO",21,"VOILE",21,"VOLLEY BALL",5,32,0,0,6,20,-1,7,20,-1,8,20,18952,14,30,5,8,20,2824,15,3,5,32,0,0,6,20,-1,7,20,-1,16,30,5,8,20,17672,15,20,4,5,32,0,0,6,20,-1,7,20,-1,17,30,5,12,30,1,13,31,24,21,"Aire de sports de Glace",21,"Court de Tennis Couvert",21,"Court de Tennis Plein-Air",21,"Divers",21,"Equipement d'athletisme",21,"HALLES",21,"J.d'arc C.",21,"J.d'arc P.A.",21,"PARKINGS",21,"Pas de tir",21,"Plaine de Golf",21,"Plateau EPS",21,"Salle de Reception",21,"Salle Omnisports",21,"Salle Polyvalente",21,"Salle Specialisee",21,"SALLES",21,"Skate par et Velo freestyle",21,"Terrain d'Honneur",21,"Terrain en herbe",21,"Terrain exterieur",21,"Terrain stabilise",21,"Terrain synthetique",21,"Velodrome",5,32,0,0,6,20,-1,7,20,-1,8,20,18952,18,30,5,12,30,1,13,31,89,21,"ARTS MARTIAUX \u00e9\u00e0",21,"ATHLETISME",21,"AVIRON",21,"BADMINTON",21,"BADMINTON-Scolaire",21,"BASKET-BALL",21,"BOOMERANG",21,"BOULE DE FORT",21,"BOULE LYONNAISE",21,"BOXE",21,"BOXE AMERICAINE",21,"BOXE ANGLAISE",21,"BOXE FRANCAISE",21,"BOXE THAILANDAISE",21,"CANNE ET BATON",21,"CANOE KAYAK",21,"CAPOEIRA",21,"CATCH",21,"CONCERTS",21,"COURS EPS",21,"CYCLISME",21,"CYCLOTOURISME",21,"DANSE",21,"DANSE SUR GLACE",21,"DIVERS",21,"ESCALADE",21,"ESCRIME",21,"FLECHETTE",21,"FOOT EN SALLE",21,"FOOTBALL",21,"FOOTBALL AMERICAIN",21,"FORMATIONS",21,"GOLF",21,"GRIMPER A LA CORDE",21,"GYMNASTIQUE",21,"GYMNASTIQUE ENTRETIEN",21,"HALTEROPHILIE",21,"HANDBALL",21,"HOCKEY SUR GAZON",21,"HOCKEY SUR GLACE",21,"INTERVIEW/ RADIO/TELE",21,"JU JITSU",21,"JUDO",21,"KARATE",21,"KENDO",21,"KIN-BALL",21,"LUTTE",21,"MOTOCYCLISME",21,"MULTISPORTS",21,"MUSCULATION",21,"NATATION",21,"NETTOYAGE",21,"PARACHUTISME",21,"PATINAGE SUR GLACE",21,"PETANQUE",21,"PLANCHE A VOILE",21,"PLONGEE SOUS MARINE",21,"PREPA.MANIF.",21,"RECEPTIONS/FESTIVITES",21,"REUNIONS",21,"RINGUETTE",21,"ROLLER HOCKEY",21,"ROLLER SKATING",21,"RUGBY",21,"SAUNA",21,"SPELEOLOGIE",21,"SPORTS DE GLACE",21,"SPORTS SCOLAIRES",21,"SUBAQUATIQUE",21,"TAEKWONDO",21,"TAI DOH",21,"TAI JITSU",21,"TENNIS",21,"TENNIS DE TABLE",21,"TIR A L'ARC",21,"TIR A LA CIBLE",21,"TONFA",21,"TONFA",21,"TRAMPOLINE",21,"TRAVAUX",21,"TRIATHLON",21,"TWIRLING",21,"TX PAR ENTREPRISE",21,"ULTIMATE",21,"VETERANS",21,"VIET VO DAO",21,"VOILE",21,"VOLLEY BALL",21,"WATER-POLO",5,32,0,0,6,20,-1,7,20,-1,8,20,18952,19,30,4,5,32,0,0,6,20,-1,7,20,-1,8,20,264,20,30,4,5,32,0,0,6,20,-1,7,20,-1,8,20,264,21,30,4,5,32,0,0,6,20,-1,7,20,-1,8,20,264,22,30,2,23,30,5,8,20,17672,15,20,0,5,32,0,0,6,20,-1,7,20,-1,24,30,5,12,30,1,25,21,"YES",5,32,0,25,"",6,20,-1,7,20,-1,8,20,16704,26,30,2,27,30,5,8,20,17800,15,20,0,5,32,0,0,6,20,-1,7,20,-1,28,30,6,12,30,4,29,30,2,30,32,21,"city",0,31,32,21,"name",0,32,21,"parentIndex",33,21,"name",34,21,"select",5,32,0,25,"",6,20,-1,7,20,-1,8,20,18112,15,20,-1,35,20,4,36,20,426763823.875];
const objectToEncode = {"ACT":"select","OPTS":{},"VARS":{"search":{"code":{"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":264},"activity":{"globals":{"strings":["ARTS MARTIAUX éà","ATHLETISME","AVIRON","BADMINTON","BADMINTON-Scolaire","BASKET-BALL","BOOMERANG","BOULE DE FORT","BOULE LYONNAISE","BOXE","BOXE AMERICAINE","BOXE ANGLAISE","BOXE FRANCAISE","BOXE THAILANDAISE","CANNE ET BATON","CANOE KAYAK","CAPOEIRA","CATCH","CONCERTS","COURS EPS","CYCLISME","CYCLOTOURISME","DANSE","DANSE SUR GLACE","DIVERS","ESCALADE","ESCRIME","FLECHETTE","FOOT EN SALLE","FOOTBALL","FOOTBALL AMERICAIN","FORMATIONS","GOLF","GRIMPER A LA CORDE","GYMNASTIQUE","GYMNASTIQUE ENTRETIEN","HALTEROPHILIE","HANDBALL","HOCKEY SUR GAZON","HOCKEY SUR GLACE","INTERVIEW/ RADIO/TELE","JU JITSU","JUDO","KARATE","KENDO","KIN-BALL","LUTTE","MOTOCYCLISME","MULTISPORTS","MUSCULATION","NATATION","NETTOYAGE","PARACHUTISME","PATINAGE SUR GLACE","PETANQUE","PLANCHE A VOILE","PLONGEE SOUS MARINE","PREPA.MANIF.","RECEPTIONS/FESTIVITES","REUNIONS","RINGUETTE","ROLLER HOCKEY","ROLLER SKATING","RUGBY","SAUNA","SPELEOLOGIE","SPORTS DE GLACE","SPORTS SCOLAIRES","SUBAQUATIQUE","TAEKWONDO","TAI DOH","TAI JITSU","TENNIS","TENNIS DE TABLE","TIR A L'ARC","TIR A LA CIBLE","TONFA","TONFA","TRAMPOLINE","TRAVAUX","TRIATHLON","TWIRLING","TX PAR ENTREPRISE","ULTIMATE","VETERANS","VIET VO DAO","VOILE","VOLLEY BALL","WATER-POLO"]},"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":18952},"city":{"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":264},"activityType":{"globals":{"strings":["ARTS MARTIAUX","ATHLETISME","AVIRON","BADMINTON","BADMINTON-Scolaire","BASKET-BALL","BOOMERANG","BOULE DE FORT","BOULE LYONNAISE","BOXE","BOXE AMERICAINE","BOXE ANGLAISE","BOXE FRANCAISE","BOXE THAILANDAISE","CANNE ET BATON","CANOE KAYAK","CAPOEIRA","CATCH","CONCERTS","COURS EPS","CYCLISME","CYCLOTOURISME","DANSE","DANSE SUR GLACE","DIVERS","ESCALADE","ESCRIME","FLECHETTE","FOOT EN SALLE","FOOTBALL","FOOTBALL AMERICAIN","FORMATIONS","GOLF","GRIMPER A LA CORDE","GYMNASTIQUE","GYMNASTIQUE ENTRETIEN","HALTEROPHILIE","HANDBALL","HOCKEY SUR GAZON","HOCKEY SUR GLACE","INTERVIEW/ RADIO/TELE","JU JITSU","JUDO","KARATE","KENDO","KIN-BALL","LUTTE","MOTOCYCLISME","MULTISPORTS","MUSCULATION","NETTOYAGE","PARACHUTISME","PATINAGE SUR GLACE","PETANQUE","PLANCHE A VOILE","PLONGEE SOUS MARINE","PREPA.MANIF.","RECEPTIONS/FESTIVITES","REUNIONS","RINGUETTE","ROLLER HOCKEY","ROLLER SKATING","RUGBY","SAUNA","SPELEOLOGIE","SPORTS DE GLACE","SPORTS SCOLAIRES","TAEKWONDO","TAI DOH","TAI JITSU","TENNIS","TENNIS DE TABLE","TIR A L'ARC","TIR A LA CIBLE","TONFA","TONFA","TRAMPOLINE","TRAVAUX","TRIATHLON","TWIRLING","TX PAR ENTREPRISE","ULTIMATE","VETERANS","VIET VO DAO","VOILE","VOLLEY BALL"]},"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":18952},"type":{"globals":{"strings":["Aire de sports de Glace","Court de Tennis Couvert","Court de Tennis Plein-Air","Divers","Equipement d'athletisme","HALLES","J.d'arc C.","J.d'arc P.A.","PARKINGS","Pas de tir","Plaine de Golf","Plateau EPS","Salle de Reception","Salle Omnisports","Salle Polyvalente","Salle Specialisee","SALLES","Skate par et Velo freestyle","Terrain d'Honneur","Terrain en herbe","Terrain exterieur","Terrain stabilise","Terrain synthetique","Velodrome"]},"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":18952},"searchMode":{"flags":17672,"value":3,"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1},"nameRestriction":{"flags":2824,"value":"","options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1},"name":{"flags":264,"value":"AIRES","options":{"firstMember":null,"secondMember":100},"index":-1,"objectKey":-1},"tutor":{"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":264},"proprio":{"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":264},"parent":{"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1,"flags":264}},"#default#":{"searchTitleMessage":{"flags":392,"value":"Choisissez un nouveau Lieu à éditer ou créez-en un","options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1},"searchSwitch":{"flags":17672,"value":0,"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1},"switch":{"globals":{"enabledObjects":[0,1,2]},"flags":17416,"value":0,"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1}},"configsForm":{"defaultSwitch":{"flags":17672,"value":2,"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1},"configurationsList":{"globals":{"forceDontChoice":"YES"},"flags":16704,"value":"AIRES","options":{"firstMember":null,"secondMember":[]},"index":0,"objectKey":-1}},"found":{"mapSwitch":{"flags":17800,"value":0,"options":{"firstMember":null,"secondMember":null},"index":-1,"objectKey":-1},"selectTable":{"globals":{"columns":{"cityColumn":{"firstMember":"city","secondMember":null},"nameColumn":{"firstMember":"name","secondMember":null}},"parentIndexSelector":"parentIndex","comparisonSelector":"name","target":"select"},"options":{"firstMember":null,"secondMember":[]},"index":-1,"objectKey":-1,"flags":17984,"value":-1}}},"MID":4,"TIME":426700506.435};
const XVarArray = ["MSTE0102",974,"CRC8A517221",1,"XVar",63,"STAT","RSRC","path","basePath","modificationDate","isFolder","CARD","PACT","OPTS","CTXCLASS","HELPERS","cityName","targets","selection","index","name","FIRST_FIELD","INAM","ACTIONS","progPrint","home","add","addConfig","find","configurationsList","switch","makesDefault","CARDTITLE","MID","VARS","search","code","options","objectKey","flags","city","activityType","globals","strings","nameRestriction","value","searchMode","type","activity","tutor","proprio","parent","#default#","searchTitleMessage","searchSwitch","enabledObjects","configsForm","defaultSwitch","forceDontChoice","found","mapSwitch","selectTable","columns","cityColumn","nameColumn","parentIndexSelector","comparisonSelector","target",30,10,0,20,2,1,31,1,30,4,2,21,"W:\\PlanitecMs\\Library\\XNet\\PlanitecServer.xna\\Resources\\Microstep\\MASH\\interfaces\\fr\\placeSearch@placeSearch.json",3,21,"_main_\/interfaces\/fr\/placeSearch@placeSearch",4,23,1404138188.000000000000000,5,20,0,6,21,"placeSearch",7,21,"newContext",8,30,3,9,21,"PPlaceSelectionContext",10,30,1,11,32,30,4,2,21,"W:\\PlanitecMs\\Library\\XNet\\SharedResources\\misc\\zipCodes.csv",3,21,"_main_\/misc\/zipCodes",4,23,1404138188.000000000000000,5,20,0,30,4,12,31,1,21,"cityName",13,21,"indexName",14,9,22,15,21,"zipCodes",16,32,21,"name",21,"search",17,9,8,18,30,8,19,20,0,20,20,7,21,20,0,22,20,0,23,20,0,24,20,0,25,20,0,26,20,0,27,21,"\/Gestion des lieux\/S\u00E9lection",28,20,2,29,30,4,30,30,11,31,50,4,32,32,0,0,14,12,-1,33,12,-1,34,13,264,15,50,4,32,32,0,20,100,14,12,-1,33,12,-1,34,13,264,35,50,4,32,32,0,0,14,12,-1,33,12,-1,34,13,264,36,50,5,37,30,1,38,31,86,21,"ARTS MARTIAUX",21,"ATHLETISME",21,"AVIRON",21,"BADMINTON",21,"BADMINTON-Scolaire",21,"BASKET-BALL",21,"BOOMERANG",21,"BOULE DE FORT",21,"BOULE LYONNAISE",21,"BOXE",21,"BOXE AMERICAINE",21,"BOXE ANGLAISE",21,"BOXE FRANCAISE",21,"BOXE THAILANDAISE",21,"CANNE ET BATON",21,"CANOE KAYAK",21,"CAPOEIRA",21,"CATCH",21,"CONCERTS",21,"COURS EPS",21,"CYCLISME",21,"CYCLOTOURISME",21,"DANSE",21,"DANSE SUR GLACE",21,"DIVERS",21,"ESCALADE",21,"ESCRIME",21,"FLECHETTE",21,"FOOT EN SALLE",21,"FOOTBALL",21,"FOOTBALL AMERICAIN",21,"FORMATIONS",21,"GOLF",21,"GRIMPER A LA CORDE",21,"GYMNASTIQUE",21,"GYMNASTIQUE ENTRETIEN",21,"HALTEROPHILIE",21,"HANDBALL",21,"HOCKEY SUR GAZON",21,"HOCKEY SUR GLACE",21,"INTERVIEW\/ RADIO\/TELE",21,"JU JITSU",21,"JUDO",21,"KARATE",21,"KENDO",21,"KIN-BALL",21,"LUTTE",21,"MOTOCYCLISME",21,"MULTISPORTS",21,"MUSCULATION",21,"NETTOYAGE",21,"PARACHUTISME",21,"PATINAGE SUR GLACE",21,"PETANQUE",21,"PLANCHE A VOILE",21,"PLONGEE SOUS MARINE",21,"PREPA.MANIF.",21,"RECEPTIONS\/FESTIVITES",21,"REUNIONS",21,"RINGUETTE",21,"ROLLER HOCKEY",21,"ROLLER SKATING",21,"RUGBY",21,"SAUNA",21,"SPELEOLOGIE",21,"SPORTS DE GLACE",21,"SPORTS SCOLAIRES",21,"TAEKWONDO",21,"TAI DOH",21,"TAI JITSU",21,"TENNIS",21,"TENNIS DE TABLE",21,"TIR A L'ARC",21,"TIR A LA CIBLE",21,"TONFA",21,"TONFA",21,"TRAMPOLINE",21,"TRAVAUX",21,"TRIATHLON",21,"TWIRLING",21,"TX PAR ENTREPRISE",21,"ULTIMATE",21,"VETERANS",21,"VIET VO DAO",21,"VOILE",21,"VOLLEY BALL",32,32,0,0,14,12,-1,33,12,-1,34,13,18952,39,50,5,34,13,2824,40,3,32,32,0,0,14,12,-1,33,12,-1,41,50,5,34,13,17672,40,20,4,32,32,0,0,14,12,-1,33,12,-1,42,50,5,37,30,1,38,31,24,21,"Aire de sports de Glace",21,"Court de Tennis Couvert",21,"Court de Tennis Plein-Air",21,"Divers",21,"Equipement d'athletisme",21,"HALLES",21,"J.d'arc C.",21,"J.d'arc P.A.",21,"PARKINGS",21,"Pas de tir",21,"Plaine de Golf",21,"Plateau EPS",21,"Salle de Reception",21,"Salle Omnisports",21,"Salle Polyvalente",21,"Salle Specialisee",21,"SALLES",21,"Skate par et Velo freestyle",21,"Terrain d'Honneur",21,"Terrain en herbe",21,"Terrain exterieur",21,"Terrain stabilise",21,"Terrain synthetique",21,"Velodrome",32,32,0,0,14,12,-1,33,12,-1,34,13,18952,43,50,5,37,30,1,38,31,89,21,"ARTS MARTIAUX \u00E9\u00E0",21,"ATHLETISME",21,"AVIRON",21,"BADMINTON",21,"BADMINTON-Scolaire",21,"BASKET-BALL",21,"BOOMERANG",21,"BOULE DE FORT",21,"BOULE LYONNAISE",21,"BOXE",21,"BOXE AMERICAINE",21,"BOXE ANGLAISE",21,"BOXE FRANCAISE",21,"BOXE THAILANDAISE",21,"CANNE ET BATON",21,"CANOE KAYAK",21,"CAPOEIRA",21,"CATCH",21,"CONCERTS",21,"COURS EPS",21,"CYCLISME",21,"CYCLOTOURISME",21,"DANSE",21,"DANSE SUR GLACE",21,"DIVERS",21,"ESCALADE",21,"ESCRIME",21,"FLECHETTE",21,"FOOT EN SALLE",21,"FOOTBALL",21,"FOOTBALL AMERICAIN",21,"FORMATIONS",21,"GOLF",21,"GRIMPER A LA CORDE",21,"GYMNASTIQUE",21,"GYMNASTIQUE ENTRETIEN",21,"HALTEROPHILIE",21,"HANDBALL",21,"HOCKEY SUR GAZON",21,"HOCKEY SUR GLACE",21,"INTERVIEW\/ RADIO\/TELE",21,"JU JITSU",21,"JUDO",21,"KARATE",21,"KENDO",21,"KIN-BALL",21,"LUTTE",21,"MOTOCYCLISME",21,"MULTISPORTS",21,"MUSCULATION",21,"NATATION",21,"NETTOYAGE",21,"PARACHUTISME",21,"PATINAGE SUR GLACE",21,"PETANQUE",21,"PLANCHE A VOILE",21,"PLONGEE SOUS MARINE",21,"PREPA.MANIF.",21,"RECEPTIONS\/FESTIVITES",21,"REUNIONS",21,"RINGUETTE",21,"ROLLER HOCKEY",21,"ROLLER SKATING",21,"RUGBY",21,"SAUNA",21,"SPELEOLOGIE",21,"SPORTS DE GLACE",21,"SPORTS SCOLAIRES",21,"SUBAQUATIQUE",21,"TAEKWONDO",21,"TAI DOH",21,"TAI JITSU",21,"TENNIS",21,"TENNIS DE TABLE",21,"TIR A L'ARC",21,"TIR A LA CIBLE",21,"TONFA",21,"TONFA",21,"TRAMPOLINE",21,"TRAVAUX",21,"TRIATHLON",21,"TWIRLING",21,"TX PAR ENTREPRISE",21,"ULTIMATE",21,"VETERANS",21,"VIET VO DAO",21,"VOILE",21,"VOLLEY BALL",21,"WATER-POLO",32,32,0,0,14,12,-1,33,12,-1,34,13,18952,44,50,4,32,32,0,0,14,12,-1,33,12,-1,34,13,264,45,50,4,32,32,0,0,14,12,-1,33,12,-1,34,13,264,46,50,4,32,32,0,0,14,12,-1,33,12,-1,34,13,264,47,30,3,48,50,5,34,13,392,40,21,"Choisissez un nouveau Lieu \u00E0 \u00E9diter ou cr\u00E9ez-en un",32,32,0,0,14,12,-1,33,12,-1,49,50,5,34,13,17672,40,20,0,32,32,0,0,14,12,-1,33,12,-1,25,50,6,37,30,1,50,26,3,0,1,2,34,13,17416,40,20,0,32,32,0,0,14,12,-1,33,12,-1,51,30,2,52,50,5,34,13,17672,40,20,0,32,32,0,0,14,12,-1,33,12,-1,24,50,5,37,30,1,53,21,"YES",32,32,31,5,21,"AIRES",21,"AIRES 2",21,"Tennis couverts",21,"ddd",21,"sss",25,"",14,12,-1,33,12,-1,34,13,16704,54,30,2,55,50,5,34,13,17800,40,20,0,32,32,0,0,14,12,-1,33,12,-1,56,50,5,37,30,4,57,30,2,58,32,21,"city",0,59,32,9,25,0,60,21,"parentIndex",61,9,25,62,21,"select",32,32,31,0,25,"",14,12,-1,33,12,-1,34,13,18112];


function test_mste(mste, value) {
  var decoded, encoded, redecoded;
  expect(function() { decoded= MSTE.parse(mste); }).not.throw();
  expect(decoded).to.deep.equal(value, JSON.stringify({ mste: mste, value: value, decoded: decoded}));
  expect(function() { encoded = MSTE.stringify(value); }).not.throw();
  expect(function() { redecoded = MSTE.parse(encoded); }).not.throw();
  expect(redecoded).to.deep.equal(value, JSON.stringify({ mste: mste, value: value, encoded: encoded, redecoded: redecoded}));
}

describe("MSTE", function() {
  describe('0102', function() {
    it('nil',          function() { test_mste("[\"MSTE0102\",6,\"CRC82413E70\",0,0,0]", null); });
    it('true',         function() { test_mste("[\"MSTE0102\",6,\"CRC9B5A0F31\",0,0,1]", true); });
    it('false',        function() { test_mste("[\"MSTE0102\",6,\"CRCB0775CF2\",0,0,2]", false); });
    it('empty string', function() { test_mste("[\"MSTE0102\",6,\"CRCA96C6DB3\",0,0,3]", ""); });
    it('empty data',   function() { test_mste("[\"MSTE0102\",6,\"CRCE62DFB74\",0,0,4]", new MSBuffer()); });
    it('number',       function() { test_mste("[\"MSTE0102\",7,\"CRCBF421375\",0,0,20,12.34]", 12.34); });
    it('string 1',     function() { test_mste("[\"MSTE0102\",7,\"CRC09065CB6\",0,0,21,\"My beautiful string \\u00E9\\u00E8\"]", "My beautiful string éè"); });
    it('string 2',     function() { test_mste("[\"MSTE0102\",7,\"CRC4A08AB7A\",0,0,21,\"Json \\\\a\\/b\\\"c\\u00C6\"]", "Json \\a/b\"cÆ"); });
    it('local date',   function() { test_mste("[\"MSTE0102\",7,\"CRC093D5173\",0,0,22,978307200]",  new MSDate(2001,1,1,0,0,0)); });
    it('gmt date',     function() { test_mste("[\"MSTE0102\",7,\"CRCFDED185D\",0,0,23,978307200.000000000000000]", new Date(978307200 * 1000)); });
    it('color',        function() { test_mste("[\"MSTE0102\",7,\"CRCAB284946\",0,0,24,4034942921]", new MSColor(128, 87, 201,15)); });
    it('data',         function() { test_mste("[\"MSTE0102\",7,\"CRC4964EA3B\",0,0,25,\"YTF6MmUzcjR0NA==\"]", new MSBuffer("a1z2e3r4t4")); });
    it('naturals',     function() { test_mste("[\"MSTE0102\",8,\"CRCD6330919\",0,0,26,1,256]", new MSNaturalArray([256])); });
    it('dictionary',   function() { test_mste("[\"MSTE0102\",15,\"CRC891261B3\",0,2,\"key1\",\"key2\",30,2,0,21,\"First object\",1,21,\"Second object\"]", {'key1':'First object', 'key2': 'Second object'}); });
    it('array',        function() { test_mste("[\"MSTE0102\",11,\"CRC1258D06E\",0,0,31,2,21,\"First object\",21,\"Second object\"]", ["First object", "Second object"]); });
    it('couple',       function() { test_mste("[\"MSTE0102\",10,\"CRCF8392337\",0,0,32,21,\"First member\",21,\"Second member\"]", new MSCouple("First member", "Second member")); });
    it('repo',         function() { test_mste("[\"MSTE0102\",21,\"CRCD959E1CB\",0,3,\"20061\",\"entity\",\"0\",30,2,0,30,1,1,31,1,21,\"R_Right\",2,30,0]", { '20061' : { 'entity' : ['R_Right'] }, '0': {}}); });

    it("encoding/decoding", function() {
          var mste = MSTE.stringify(data_array, { version: 0x102 });
          var r= MSTE.parse(mste);
      expect(r).to.deep.equal(data_array) ;
    }) ;

    it("decodes OBJC demo mste chain", function () {
      var r= MSTE.parse(JMChain);
      expect(r[0].firstName).to.eq("Yves") ;
      expect(r[0]["maried-to"].firstName).to.eq("Claire") ;   // Yves's wife is Claire, this reference is correct
      expect(r[1]).to.eq(r[0]["maried-to"]) ;
      expect(r[2].firstName).to.eq("Lou") ;
      expect(r[3]).to.deep.equal(new MSBuffer()) ;
      expect(r[4].toBase64String()).to.eq("Rjd5NA==") ;
      expect(r[5]).to.eq(r[0]) ;
      expect(r[6]).to.eq(r[4]) ;
      expect(r[7]).to.deep.equal(new MSBuffer()) ;
    });

    it("decodes OBJC demo mste chain with local classes", function () {
      class Person1 implements MSTE.Decodable { initWithMSTEDictionary(d) { Object.assign(this, d); } }
      class Person2 { }
      var r = MSTE.parse(JMChain, {
        classes:{
          'Person':Person1,
          'Person2':Person2
        }
      }) ;

      expect(r[0]).to.be.instanceof(Person1) ;
      expect(r[1]).to.be.instanceof(Person1) ;
      expect(r[2]).to.be.instanceof(Person2) ;
      expect(r[0].firstName).to.eq("Yves") ;
      expect(r[0]["maried-to"].firstName).to.eq("Claire") ;   // Yves's wife is Claire, this reference is correct
      expect(r[1]).to.eq(r[0]["maried-to"]) ;
      expect(r[2].firstName).to.eq("Lou") ;
      expect(r[3]).to.deep.equal(new MSBuffer()) ;
      expect(r[4].toBase64String()).to.eq("Rjd5NA==") ;
      expect(r[5]).to.eq(r[0]) ;
      expect(r[6]).to.eq(r[4]) ;
      expect(r[7]).to.deep.equal(new MSBuffer()) ;
    });

    it("decodes a natural array", function () {
      var r = MSTE.parse("[\"MSTE0102\",8,\"CRCD6330919\",0,0,26,1,256]") ;
      expect(r).to.be.instanceof(MSNaturalArray) ;
      expect(r[0]).to.eq(256) ;
    });

    it("bug on code 6", function () {
      var mste = MSTE.stringify(objectToEncode) ;
      var r = MSTE.parse(mste);
    });

    it("Bug on Xvar class not re-encoded properly", function () {
      class XVar {
        encodeToMSTE(encoder) { encoder.encodeDictionary(this, "XVar"); }
      }

      var r = MSTE.parse(XVarArray, { classes: { "XVar": XVar } });
      var e = MSTE.stringify(r) ;
      var r2 =  MSTE.parse(XVarArray, { classes: { "XVar": XVar } });
    });

    it("encodes simple references (same ref is used multiple times: a person is father to one and married to another)", function () {
        var m = MSTE.stringify(data_graph) ;
        var r = MSTE.parse(m) ;
        expect(data_graph).to.deep.equal(r);
    });
    it("encodes simple references with a true class", function () {
      var m = MSTE.stringify(data_graph2) ;
      var r = MSTE.parse(m, {
        classes:{
          "person": LocalPerson
        }
      }) ;
      expect(data_graph2).to.deep.equal(r);
      expect(r[0]).to.be.instanceof(LocalPerson) ;
      expect(r[1]).to.be.instanceof(LocalPerson) ;
      expect(r[2]).to.be.instanceof(LocalPerson) ;
      expect(data_graph2).to.deep.equal(r);
    });
    it("bug: encode bug empty buffer", function() {
      var data = new MSBuffer();
      var mste = MSTE.stringify(data);
      var data0 = MSTE.parse(mste) ;
      expect(data.isEqualTo(data0)).to.eq(true);
    });
  });

  describe('0101', function() {
    it("decoding complex", function() {
      var r= MSTE.parse(oldMSTEString);
      expect(r.PACT).to.eq('switch') ;
      expect(r.VARS.planningForm.startingHourField.options.secondMember).to.eq(22) ;
      expect(r.VARS.planningForm.visuPop.flags).to.eq(17416) ;
      expect(r.VARS.planningForm.visuIndexRadio.options.firstMember[0]).to.eq(r.VARS.planningForm.visuIndexRadio.value) ;
      expect(r.RSRC[0].basePath).to.eq('_main_/interfaces/planning@planningBox') ;
      expect(r.CARD).to.eq('planningBox') ;
      expect(r.INAM).to.eq('planning') ;
    }) ;
    it("encoding/decoding", function() {
      var mste = MSTE.stringify(data_array, { version: 0x101 });
      var r= MSTE.parse(mste);
      expect(r).to.deep.equal(data_array) ;
    });
    it("encodes simple references (same ref is used multiple times: a person is father to one and married to another)", function () {
      var m = MSTE.stringify(data_graph, { version: 0x101 }) ;
      var r = MSTE.parse(m) ;
      // beware : encoding in precedent version will gives you standard dates with no milliseconds ...
      expect(r[1].birthday).to.be.instanceof(Date);
      r[1].birthday = new MSDate(r[1].birthday) ;
      expect(data_graph).to.deep.equal(r);
    });
    it("encodes simple references with a true class", function () {
      var m = MSTE.stringify(data_graph2, { version: 0x101 }) ;
      var r = MSTE.parse(m, {
      classes:{
        "person": LocalPerson
      }
    }) ;
    expect(data_graph2).to.deep.equal(r);
    expect(r[0]).to.be.instanceof(LocalPerson) ;
    expect(r[1]).to.be.instanceof(LocalPerson) ;
    expect(r[2]).to.be.instanceof(LocalPerson) ;
    expect(data_graph2).to.deep.equal(r);
    });
  });
}) ;