# Politi RDF

<!-- TOC -->

- [Politi RDF](#politi-rdf)
  - [Structure](#structure)
  - [Datasets](#datasets)
    - [Modifications effectuées](#modifications-effectuées)
  - [Outils](#outils)
  - [Installation](#installation)
    - [Prérequis](#prérequis)
    - [Cloner le dépôt](#cloner-le-dépôt)
    - [Créer le repository dans GraphDB](#créer-le-repository-dans-graphdb)
    - [Importer les données RDF](#importer-les-données-rdf)

<!-- /TOC -->

## Structure

```text
.
├───data/           # Données brutes (CSV)
└───turtle/         # Fichiers RDF (Turtle)
    └───mappings/   # Mappings OntoText Refine (JSON)
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
- [Contours géographiques des circonscriptions législatives](https://www.data.gouv.fr/datasets/contours-geographiques-des-circonscriptions-legislatives/)

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

Sur le dataset des [contours géographiques des circonscriptions législatives](data/contours-circo-legislatives-2022.geojson),
nous avons converti le fichier GeoJSON en CSV avec [Aspose GIS Converter](https://products.aspose.app/gis/conversion/geojson-to-csv),
afin de pouvoir l'importer dans OntoRefine, car le JSON ne fonctonnait pas.

> Ceci car Wikidata ne possède pas les circonscriptions législatives françaises en tant qu'entités géographiques,
> et nous voulions inclure les données géographiques dans le RDF.

Nous avons ensuite créé une colonne `code_circo_clean` car les codes de circonscriptions étaient erronés.
Il a fallu une formule Excel puis des ajustements à la main.

> Ceci afin de faciliter le mapping avec les données des circonscriptions.

## Outils

- OntoRefine (Mappings & conversion RDF)
- GraphDB (Repository)
- [Schema.org](https://schema.org/) (Vocabulaire principal)
- [OpenRefine GREL Functions](https://openrefine.org/docs/manual/grelfunctions) (Utilisation dans OntoRefine)
- [Aspose GIS Converter](https://products.aspose.app/gis/conversion/geojson-to-csv) (Conversion GeoJSON vers CSV)

## Installation

### Prérequis

- Git
- Git LFS
- GraphDB

### Cloner le dépôt

```bash
git clone https://github.com/sillyash/Politi-RDF.git
```

### Créer le repository dans GraphDB

- Ouvrir GraphDB dans le navigateur
- Aller dans 'Repositories' > 'Create new repository'
- Type: GraphDB repository
- Ruleset: RDFS Plus (Défaut)
- Cocher: 'Disable owl:sameAs' (Défaut)

### Importer les données RDF

- Aller dans 'Import' > 'Files'
- Sélectionner tous les fichiers `.ttl` présents dans le dossier [`turtle/`](turtle/)
- Cliquer sur 'Import'

Les requêtes SPARQL sont dans [`requests.rq`](requests.rq).
