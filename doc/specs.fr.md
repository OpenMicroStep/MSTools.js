# MSTE

Objectifs:

 - facilité de transport:
   - chaine de caractères avec possibilité d'escaper tout caractère Unicode tout en permettant l’utilisation native de l’UTF8 ;
   - sous-ensemble de la norme JSON: tableau de valeurs (chaines et nombres)
 - support des classes personalisés
 - support des cycles
 - support des propriétés non récursive nécéssaire à l'initialisation des classes personalisées (depuis la v2)
 - streamable à l'encodage et au décodage (depuis la v2)

## Version 2.0.0

Les objectifs de la version 2 sont:

 - streamable à l'encodage et au décodage
 - support des propriétés non récursive nécéssaire à l'initialisation des classes personalisées
 - traitement des données pendant le décodage possible (capsule)

A la différence des versions 1.*, la version 2 n'encode pas de CRC, ni le nombre de token attendu, la vérification de l'intégrité de la chaine étant à la charge de la couche transport.

On appelle __Mot__ le nom d'une clé ou d'une classe. Ces mots sont désormais encodés au premier usage et non une fois toute la chaîne codé.
Chaque Mot crée un nouveau code (64 + index dans la liste des mots) sans suite attendue qui correspond au mot.

Afin de permettre le traitement des données dans des espaces mémoire confiné, la notion de __Capsule__ a été ajoutée.
Une Capsule est un contexte de décodage portant sur un objet racine de la Capsule tel que les contraintes sur les références faites au sein de la capsule n'empêche pas le __traitement__ de la Capsule dès la fin de son décodage (avant d'avoir décoder toute la chaîne). Ses contraintes sont: pas de référence vers une capsule de profondeur égale ou supérieur. Lors du décodage, un traitement est effectué pour chaque capsule, il prend en paramètre l'objet racine de la capsule est doit renvoyé un objet ou rien. Le traintement par défaut étant de renvoyer l'objet racine tel que. Cette approche permet de décoder de grosse chaîne MSTE tout en limitant l'espace mémoire nécéssaire en traitant les capsules dès qu'elles sont décodés.

La chaîne MSTE à la forme suivante:

    +------------+--------------+
    | "MSTE0200" | Objet racine |
    +------------+--------------+

### Tokens


| Type                 |  Code   | Suite attendue | Ref |
| -------------------- | ------: | -------------- | :-: |
| Objet null           |       0 | Aucune         | Non |
| Valeur "vraie"       |       1 | Aucune         | Non |
| Valeur "fausse"      |       2 | Aucune         | Non |
| Chaîne vide          |       3 | Aucune         | Non |
| Data vide            |       4 | Aucune         | Non |
| _inutilisées_        |   5 - 7 |                |     |
| Capsule              |       8 | un objet dont les références ne peuvent porter que sur les objets de la capsule et les objets parents de la capsule. Pas de référence entre capsule de profondeur égale ou supérieur. | Non |
| Référence            |       9 | 1 token contenant l'index dans le tableau des objets déjà décodés de l'objet à utiliser comme référence.  | Non |
| int8                 |      10 | un nombre compris entre -128 et +127                 | Non |
| uint8                |      11 | un nombre compris entre 0 et 255                     | Non |
| int16                |      12 | un nombre compris entre -32768 et +32767             | Non |
| uint16               |      13 | un nombre compris entre 0 et 65535                   | Non |
| int32                |      14 | un nombre compris entre -(2^31) et (2^31)-1          | Non |
| uint32               |      15 | un nombre compris entre 0 et (2^32)-1                | Non |
| int64                |      16 | un nombre compris entre -(2^63) et (2^63)-1          | Non |
| uint64               |      17 | un nombre compris entre 0 et (2^64)-1                | Non |
| float                |      18 | un nombre flottant interprétable en simple précision | Non |
| double               |      19 | un nombre flottant interprétable en double précision | Non |
| décimal              |      20 | un nombre décimal sans limite de stockage            | Non |
| Chaîne de caractères |      21 | la chaîne de caractère | Non |
| Date (locale)        |      22 | un nombre entier (positif ou négatif) de secondes écoulées ou à venir depuis ou vers le **01/01/1970** qui est la référence ( **Unix Epoch** ). Cette date ne porte pas d'information de timezone (même pas l'UTC). Elle correspond donc à un temps local. | Non |
| Time stamp           |      23 | un nombre entier (positif ou négatif) de secondes écoulées ou à venir depuis ou vers le **01/01/1970** qui est la référence ( **Unix Epoch** ). Contrairement au code 22, ce time stamp est exprimé en UTC. | Non |
| Couleur              |      24 | un nombre entier positif contenant la représentation en 24 ou 32 bits de la couleur. 24 bits = RRGGBB. 32 bits = TTRRGGBB ou TT est la transparence (0x00 = opaque, 0xFF = totalement transparent) | Non |
| Data                 |      25 | un nombre entier positif correspondant à la longueur originale en octets de la donnée transmise, suivi d'une chaîne de caractères contenant les données encodées en Base64. | Non |
| Natural array        |      26 | un nombre entier positif N correspondant au nombre d'entiers naturels positif contenus dans le tableau suivi de N entiers naturels | Non |
| _inutilisées_        | 27 - 29 |                |     |
| Dictionnaire         |      30 | un nombre entier positif N correspondant au nombre de couples clé-valeur du dictionnaire. Suivent ensuite N séquences clé-valeurs du dictionnaire. | Oui |
| Array                |      31 | un nombre entier positif N correspondant au nombre d'éléments du tableau. Suivent ensuite N séquences correspondants aux éléments du tableau. | Oui |
| Couple               |      32 | 2 séquences de tokens correspondant au premier et au second membre du couple d'objets. | Oui |
| Set                  |      33 | un nombre entier positif N correspondant au nombre d'éléments de l'ensemble. Suivent ensuite N séquences correspondants aux éléments de l'ensemble. | Oui |
| _inutilisées_        | 34 - 63 |                |     |
| Type personalisé     |     Mot | contenu du dictionaire (nombre + clé-valeurs sans cycles) utilisé pour instancier l'objet, suivi du contenu du dictionaire (nombre + clé-valeurs avec cycles possible) utilisé pour définir les cycles. | Oui |

## Version 1.*

Les versions 1.0.* ont pour différences avec la version 2:

 - non streamable à l'encodage, il est nécéssaire d'avoir toute la chaîne pour finir l'encodage (CRC, classes et clés)
 - utilisation d'un CRC (qui dans la pratique est bien souvent ignoré)
 - encodage des références uniquements

La version 1.0.2 réorganise les codes des tokens et simplifie les références.

Format de la chaîne MSTE:

    +--------------+------------------+-----+---------+------+--------------+
    | Version MSTE | Nombre de tokens | CRC | Classes | Clés | Objet racine |
    +--------------+------------------+-----+---------+------+--------------+

 - Version MSTE: MSTE0101 / MSTE0102
 - Nombre de tokens: le nombre de tokens total (cela comprends Version MSTE et Nombre de tokens)
 - CRC: Le CRC de la chaîne final calculé en définissant le token CRC à CRC00000000
 - Classes: le nombre de classes suivi des classes
 - Clés: le nombre clés suivi des clés

### Tokens MSTE0102

| Type                 |  Code   | Suite attendue | Ref |
| -------------------- | ------: | -------------- | :-: |
| Objet null           |       0 | Aucune         | Non |
| Valeur "vraie"       |       1 | Aucune         | Non |
| Valeur "fausse"      |       2 | Aucune         | Non |
| Chaîne vide          |       3 | Aucune         | Non |
| Data vide            |       4 | Aucune         | Non |
| _inutilisées_        |   5 - 8 |                |     |
| Référence            |       9 | 1 token contenant l'index dans le tableau des objets déjà décodés de l'objet à utiliser comme référence.  | Non |
| int8                 |      10 | un nombre compris entre -128 et +127                 | Non |
| uint8                |      11 | un nombre compris entre 0 et 255                     | Non |
| int16                |      12 | un nombre compris entre -32768 et +32767             | Non |
| uint16               |      13 | un nombre compris entre 0 et 65535                   | Non |
| int32                |      14 | un nombre compris entre -(2^31) et (2^31)-1          | Non |
| uint32               |      15 | un nombre compris entre 0 et (2^32)-1                | Non |
| int64                |      16 | un nombre compris entre -(2^63) et (2^63)-1          | Non |
| uint64               |      17 | un nombre compris entre 0 et (2^64)-1                | Non |
| float                |      18 | un nombre flottant interprétable en simple précision | Non |
| double               |      19 | un nombre flottant interprétable en double précision | Non |
| décimal              |      20 | un nombre décimal sans limite de stockage            | Oui |
| Chaîne de caractères |      21 | la chaîne de caractères                              | Oui |
| Date (locale)        |      22 | un nombre entier (positif ou négatif) de secondes écoulées ou à venir depuis ou vers le **01/01/1970** qui est la référence ( **Unix Epoch** ). Cette date ne porte pas d'information de timezone (même pas l'UTC). Elle correspond donc à un temps local. | Oui |
| Time stamp           |      23 | un nombre entier (positif ou négatif) de secondes écoulées ou à venir depuis ou vers le **01/01/1970** qui est la référence ( **Unix Epoch** ). Contrairement au code 22, ce time stamp est exprimé en UTC. | Oui |
| Couleur              |      24 | un nombre entier positif contenant la représentation en 24 ou 32 bits de la couleur. 24 bits = RRGGBB. 32 bits = TTRRGGBB ou TT est la transparence (0x00 = opaque, 0xFF = totalement transparent) | Oui |
| Data                 |      25 | un nombre entier positif correspondant à la longueur originale en octets de la donnée transmise, suivi d'une chaîne de caractères contenant les données encodées en Base64. | Oui |
| Natural array        |     *26 | un nombre entier positif N correspondant au nombre d'entiers naturels positif contenus dans le tableau suivi de N entiers naturels (uniquement en version 1.2.1) | Oui |
| _inutilisées_        | 27 - 29 |                |     |
| Dictionnaire         |      30 | un nombre entier positif N correspondant au nombre de couples clé-valeur du dictionnaire. Suivent ensuite N séquences clé-valeurs du dictionnaire. | Oui |
| Array                |      31 | un nombre entier positif N correspondant au nombre d'éléments du tableau. Suivent ensuite N séquences correspondants aux éléments du tableau. | Oui |
| Couple               |      32 | 2 séquences de tokens correspondant au premier et au second membre du couple d'objets. | Oui |
| _inutilisées_        | 33 - 49 |                |     |
| Type personalisé     |      50 | l'objet contenant le nom du type personalisé suivi d'un nombre entier positif N correspondant au nombre de couples clé-valeur du dictionnaire. Suivent ensuite N séquences clé-valeurs du dictionnaire. | Oui |

### Tokens MSTE0101

| Type                 |  Code   | Suite attendue | Ref |
| -------------------- | ------: | -------------- | :-: |
| Objet null           |       0 | Aucune         | Non |
| Valeur "vraie"       |       1 | Aucune         | Non |
| Valeur "fausse"      |       2 | Aucune         | Non |
| Entier               |       3 | un nombre entier sans limite de stockage          | Oui |
| Décimal              |       4 | un nombre décimal sans limite de stockage         | Oui |
| Chaîne de caractères |       5 | la chaîne de caractères                           | Oui |
| Time stamp           |       6 | un nombre entier (positif ou négatif) de secondes écoulées ou à venir depuis ou vers le **01/01/1970** qui est la référence ( **Unix Epoch** ). | Oui |
| Couleur              |       7 | un nombre entier positif contenant la représentation en 24 ou 32 bits de la couleur. 24 bits = RRGGBB. 32 bits = TTRRGGBB ou TT est la transparence (0x00 = opaque, 0xFF = totalement transparent) | Oui |
| Dictionnaire         |       8 | un nombre entier positif N correspondant au nombre de couples clé-valeur du dictionnaire. Suivent ensuite N séquences clé-valeurs du dictionnaire. | Oui |
| Référence            |       9 | 1 token contenant l'index dans le tableau des objets déjà décodés de l'objet à utiliser comme référence __FORTE__.  | Non |
| int8                 |      10 | un nombre compris entre -128 et +127                 | Non |
| uint8                |      11 | un nombre compris entre 0 et 255                     | Non |
| int16                |      12 | un nombre compris entre -32768 et +32767             | Non |
| uint16               |      13 | un nombre compris entre 0 et 65535                   | Non |
| int32                |      14 | un nombre compris entre -(2^31) et (2^31)-1          | Non |
| uint32               |      15 | un nombre compris entre 0 et (2^32)-1                | Non |
| int64                |      16 | un nombre compris entre -(2^63) et (2^63)-1          | Non |
| uint64               |      17 | un nombre compris entre 0 et (2^64)-1                | Non |
| float                |      18 | un nombre flottant interprétable en simple précision | Non |
| double               |      19 | un nombre flottant interprétable en double précision | Non |
| Array                |      20 | un nombre entier positif N correspondant au nombre d'éléments du tableau. Suivent ensuite N séquences correspondants aux éléments du tableau. | Oui |
| Natural array        |      21 | un nombre entier positif N correspondant au nombre d'entiers naturels positif contenus dans le tableau suivi de N entiers naturels | Oui |
| Couple               |      22 | 2 séquences de tokens correspondant au premier et au second membre du couple d'objets. | Oui |
| Data                 |      23 | un nombre entier positif correspondant à la longueur originale en octets de la donnée transmise, suivi d'une chaîne de caractères contenant les données encodées en Base64. | Oui |
| Date passé           |      24 | Date infinie dans le passé. | Oui |
| Date future          |      25 | Date infinie dans le futur. | Oui |
| Chaîne vide          |      26 | Aucune         | Non |
| Référence            |      27 | 1 token contenant l'index dans le tableau des objets déjà décodés de l'objet à utiliser comme référence __FAIBLE__.  | Non |
| Type personalisé     |      50 | l'objet contenant le nom du type personalisé suivi d'un nombre entier positif N correspondant au nombre de couples clé-valeur du dictionnaire. Suivent ensuite N séquences clé-valeurs du dictionnaire. | Oui |
| Type personalisé     |      51 | l'objet contenant le nom du type personalisé suivi d'un nombre entier positif N correspondant au nombre de couples clé-valeur du dictionnaire. Suivent ensuite N séquences clé-valeurs du dictionnaire. | Oui |


### Exemples

#### Une chaîne de caractères

```json
"toto" // json
["MSTE0200",21,"toto"]
["MSTE0102",7,"CRCD45ACB10",0,0,21,"toto"]
["MSTE0101",7,"CRC2B8F345A",0,0,5,"toto"]
```

#### Un tableau

```js
["toto"] // json
["MSTE0200",21,1,"toto"]
["MSTE0102",9,"CRCD4E14B75",0,0,31,1,21,"toto"]
["MSTE0101",9,"CRC43E85E76",0,0,20,1,5,"toto"]
```

```js
["toto", "tata", "toto"] // js
["MSTE0200",31,3,21,"toto",21,"tata",21,"toto"]
["MSTE0102",13,"CRC7311752F",0,0,31,3,21,"toto",21,"tata",9,1]
["MSTE0101",13,"CRC0F51FFA9",0,0,20,3,5,"toto",5,"tata",9,1]
```

#### Un dictionnaire

```js
{"mykey":"toto"} // js
["MSTE0200",30,1,"mykey",21,"toto"]
["MSTE0102",11,"CRC1C9E9FE1",0,1,"mykey",30,1,0,21,"toto"]
["MSTE0101",11,"CRC7356C782",0,1,"mykey",8,1,0,5,"toto"]
```

```js
[{"mykey":"toto"}, {"mykey":"toto"}] // js
["MSTE0200",31,2,30,1,"mykey",21,"toto",30,1,64,21,"toto"]
["MSTE0102",18,"CRCDF6E36C0",0,1,"mykey",31,2,30,1,0,21,"toto",30,1,0,9,2]
["MSTE0101",18,"CRCCA3A73E2",0,1,"mykey",20,2,8,1,0,5,"toto",8,1,0,9,2]
```
```js
t = {"mykey":"toto"}, [t, t] // js
["MSTE0200",31,2,30,1,"mykey",21,"toto",9,1]
["MSTE0102",15,"CRCFFC790D3",0,1,"mykey",31,2,30,1,0,21,"toto",9,1]
["MSTE0101",15,"CRCB3BA14EE",0,1,"mykey",20,2,8,1,0,5,"toto",9,1]
```

#### Un type personalisé

```ts
class Person {
    firstName: string;
    lastName: string;
    mother?: Person;
    father?: Person;
    childrens: Person[];

    constructor(initValues: { firstName: string, lastName: string }) { ... }
    setMSTEValues(values: { mother?: Person, father?: Person, childrens: Person[] }) { ... }
}
let son = new Person({ firstName:"Mickey", lastName: "Mouse" });
let mother = new Person({ firstName:"Mother", lastName: "Mouse" });
let father = new Person({ firstName:"Father", lastName: "Mouse" });
son.mother = mother; mother.childrens.push(son);
son.father = father; father.childrens.push(son);
son;

["MSTE0200",30,5,0,31,0,"firstName",21,"Mickey","lastName",21,"Mouse","mother",30,3,"childrens",31,1,9,0,64,21,"Mother",65,21,"Mouse","father",30,3,67,31,1,9,0,64,21,"Father",65,21,"Mouse"]
["MSTE0102",49,"CRCAF1171C0",0,5,"childrens","firstName","lastName","mother","father",30,5,0,31,0,1,21,"Mickey",2,21,"Mouse",3,30,3,0,31,1,9,0,1,21,"Mother",2,9,3,4,30,3,0,31,1,9,0,1,21,"Father",2,9,3]
```
