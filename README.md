# Politi RDF

<!-- TOC -->

- [Politi RDF](#politi-rdf)
    - [Structure](#structure)
    - [Datasets](#datasets)
    - [Question posée](#question-pos%C3%A9e)
        - [Modifications effectuées](#modifications-effectu%C3%A9es)
    - [Outils](#outils)
    - [Installation](#installation)
        - [Prérequis](#pr%C3%A9requis)
        - [Cloner le dépôt](#cloner-le-d%C3%A9p%C3%B4t)
        - [Faire touner le proxy](#faire-touner-le-proxy)
        - [Créer le repository dans GraphDB](#cr%C3%A9er-le-repository-dans-graphdb)
        - [Importer les données RDF](#importer-les-donn%C3%A9es-rdf)
        - [Faire tourner l'appli web](#faire-tourner-lappli-web)
    - [Reproduction de l'enrichissement avec Wikidata](#reproduction-de-lenrichissement-avec-wikidata)

<!-- /TOC -->

## Structure

```text
.
├───data/           # Données brutes (CSV)
├───proxy/          # Proxy pour l'appli web (Python)
├───turtle/         # Fichiers RDF (Turtle)
│   └───mappings/   # Mappings OntoText Refine (JSON)
└───web             # Appli web (VueJS)
    ├───public
    └───src
        ├───assets
        ├───components  # VueJS code
        └───plugins     # GraphDB middleware
```

- Les données brutes sont dans le dossier [data](data/).
- Les mappings OntoText Refine sont dans le dossier [turtle/mappings](turtle/mappings/).
- Les triplets RDF sont dans le dossier [turtle](turtle/)

## Datasets

- [Datan - Députés](https://www.data.gouv.fr/datasets/deputes-actifs-de-lassemblee-nationale-informations-et-statistiques/)
    - [Liste des députés actuels de l'Assemblée nationale](data/deputes-active.csv)
- [Datan - Groupes](https://www.data.gouv.fr/datasets/groupes-politiques-actifs-de-lassemblee-nationale-informations-et-statistiques/)
    - [Liste des groupes parlementaires actuels de l'Assemblée nationale](data/groupes-active.csv)
- [Indicateurs socio-économiques par circonscription](https://www.data.gouv.fr/datasets/portraits-des-circonscriptions-legislatives-indicateurs-economiques-et-socio-demographiques/)
    - [Correspondance entre les communes et les circonscriptions législatives](data/dept_communes_circo.csv)
    - [Indicateurs socio-économiques par circonscription législative](data/stat-circo-2022.csv)
    - [Description des indicateurs socio-économiques](data/stat-circo-info-variables.csv)
- [Contours géographiques des circonscriptions législatives](https://www.insee.fr/fr/statistiques/6441661?sommaire=6436478)

## Question posée

**Est-ce que les condition socio-économiques des circonscriptions (et non des électeurs) déterminent des tendances électorales ?**

Nous connaissons les chiffres qui passent souvent à la télévision: les condtions socio-économiques des électeurs peuvent souvent influer sur
leurs votes aux élections.

Mais, puisqu'il y a beaucoup d'abstention aux élections législatives, peut-être pouvons nous voir le problème d'une autre manière:
si on pouvait connaître les chiffres sur des territoires, peut-être pouvons nous voir des dynamiques de vote, sans passer par le votant !

Peut-être y a-t-il une différence entre les conditions des votants et ceux des territoires rattachés aux élus ?

### Modifications effectuées

Sur le dataset des [députés actifs de l'Assemblée nationale](data/deputes-active.csv),
nous avons ajouté une colonne `circo_clean` qui correspond à la colonne `circo`, avec
un identifiant absolu pour les circonscriptions législatives (ex: "1" devient "1001").

> Ceci afin de faciliter le mapping avec les données des circonscriptions législatives.

Formule Excel utilisée:

```excel
=IF(LEN(L2)<3, CONCAT(UPPER(L2),TEXT(M2, "000")), CONCAT(UPPER(L2),TEXT(M2, "00")))
```

*Fait sans ChatGPT mais à la sueur de mon front.*

Sur le [dataset de correspondance entre les communes et les circonscriptions législatives](data/dept_communes_circo.csv),
nous avons ajouté une colonne `cleaned_dep` qui correspond à la colonne `DEP`, avec des minuscules au lieu de majuscules
sur les codes départementaux (ex: "2A" devient "2a" pour la Corse).

> Ceci afin de faciliter le mapping avec les données des députés.

Formule Excel utilisée:

```excel
=LOWER(B2)
```

Sur le [dataset des indicateurs socio-économiques par circonscription législative](data/stat-circo-2022.csv),
nous avons remplacé les 'nd' quand la valeur est 'non disponible' par des valeurs vides.

Également, nous avons remplacé les nombres décimaux à virgule `,` par des points `.`: e.g. `34,21` → `34.21`.

> Ceci afin de rendre les décimaux corrects pour *xsd* et les valeurs nulles détectables par OntoText Refine.

Sur le dataset des [descriptifs des indicateurs socio-économiques](data/stat-circo-info-variables.csv),
nous avons ajouté la première ligne avec les noms de colonnes, et retiré deux lignes inutiles (description du nom de circonscription et du numéro de circonscription).

Nous avons également renommé toutes les variables (colonne 'Stat') pour enlever les `_` et accents.

> Ceci afin de faciliter le mapping avec les données des statistiques par circonscription.

Sur le dataset des [contours géographiques des circonscriptions législatives](data/circonscriptions-legislatives-p20.csv),
nous avons converti le fichier Shapefile en CSV avec [QGIS](https://qgis.org/),
afin de pouvoir l'importer dans OntoRefine, car le JSON ne fonctonnait pas.

> Ceci car Wikidata ne possède pas les circonscriptions législatives françaises en tant qu'entités géographiques,
> et nous voulions inclure les données géographiques dans le RDF.

Nous avons ensuite créé une colonne `code_circo_clean` car les codes de circonscriptions étaient erronés.
Il a fallu une formule Excel puis des ajustements à la main.

> Ceci afin de faciliter le mapping avec les données des circonscriptions.

> [!warning]
>
> Cependant, GraphDB semble avoir des problèmes dans la version Free pour
> indexer les données WKT GeoSparql, donc les mappings et les fichiers
> Turtle existent, mais nous n'avons pas pu les utiliser.

## Outils

- OntoRefine (Mappings & conversion RDF)
- GraphDB (Repository)
- [Schema.org](https://schema.org/) (Vocabulaire principal)
- [OpenRefine GREL Functions](https://openrefine.org/docs/manual/grelfunctions) (Utilisation dans OntoRefine)
- [QGIS](https://qgis.org/) (Conversion Shapefile vers CSV)

## Installation

### Prérequis

- Git
- Git LFS
- GraphDB >= 11.0
- Python >= 3.8
- NodeJS & npm

### Cloner le dépôt

```bash
git clone https://github.com/sillyash/Politi-RDF.git
```

### Faire touner le proxy

Installer les dépendances Python:

```bash
cd proxy
./setup.sh
```

Faire tourner le proxy:

```bash
python main.py
```

### Créer le repository dans GraphDB

Lancez GraphDB.

- Ouvrir GraphDB dans le navigateur
- Aller dans 'Repositories' > 'Create new repository' > 'GraphDB repository'
- Nom du dépôt: **PolitiRDF** (nécessaire pour le fontionnement de l'appli web)
- Ruleset: `OWL-Horst (Optimized)`
- Bien vérifier que 'Disable `owl:sameAs`' n'est pas coché
- Cliquer sur 'Create'
- Se connecter au repository créé

### Importer les données RDF

- Aller dans 'Import' > 'Files'
- Sélectionner le fichier `full.ttl` dans le dossier [`turtle/`](turtle/)
- Target graphs: 'From data'
- Cliquer sur 'Import'

### Faire tourner l'appli web

Installer les dépendances NodeJS:

```bash
cd web
npm install
```

Faire tourner le serveur local:

```bash
npm run dev
```

http://localhost:5173

## Reproduction de l'enrichissement avec Wikidata

Les fichier Turtle avant modifications sont dans le dossier [`turtle/`](turtle/).

Les fichiers CSV et mappings sont aussi disponibles si nécessaire pour Ontotext Refine.

Seul le fichier `full.ttl` contient le dépôt en entier, après liaison avec Wikidata

Les requêtes SPARQL (dont les requêtes CREATE et INSERT) sont dans [`requests.rq`](requests.rq).

Il faut aussi effectuer la requête d'insertion manuelle des noms de partis, dans le fichier [`add_parti_labels.rq`](add_parti_labels.rq)

Cette requête à été faite car GraphDB plantait avec la requête (problème de décryptage de la donnée Wikidata),
donc nous avons exporté toutes les IRI de partis dans notre dépôt, puis effectué cette requête sur le Wikidata Query Service:

```sparql
SELECT ?item ?itemLabelFr WHERE {
  VALUES ?item {
    wd:Q170972
    wd:Q173152
    wd:Q686372
    wd:Q827415
    wd:Q20012759
    wd:Q2300622
    wd:Q64503948
    wd:Q743390
    wd:Q1052584
    wd:Q587370
    wd:Q870654
    wd:Q127038760
    wd:Q82892
    wd:Q192821
    wd:Q43807777
    wd:Q922707
    wd:Q15985232
    wd:Q27978402
    wd:Q127413320
    wd:Q613786
    wd:Q23731823
    wd:Q1230566
    wd:Q1054196
    wd:Q427965
    wd:Q853418
    wd:Q3550126
    wd:Q23808504
    wd:Q205150
    wd:Q762083
    wd:Q104212739
    wd:Q112672999
    wd:Q3419877
    wd:Q108846587
    wd:Q2054444
    wd:Q30741057
    wd:Q23691290
    wd:Q862627
    wd:Q1321802
    wd:Q3272709
    wd:Q3326813
    wd:Q327591
    wd:Q3240530
    wd:Q62079328
    wd:Q3326782
    wd:Q1045425
    wd:Q31400965
    wd:Q107877569
    wd:Q12962
    wd:Q2934607
    wd:Q80196524
    wd:Q29348702
    wd:Q1230558
    wd:Q87070507
    wd:Q545900
    wd:Q1469596
    wd:Q12968
    wd:Q3366608
    wd:Q51844819
    wd:Q58366009
    wd:Q1542710
    wd:Q45149423
    wd:Q668248
    wd:Q109932430
    wd:Q130517388
    wd:Q58329311
  }

  ?item rdfs:label ?itemLabelFr .
  FILTER (lang(?itemLabelFr) = "fr")
}
```
