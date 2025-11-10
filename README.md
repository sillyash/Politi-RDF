# Politi RDF

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

### Modifications effectuées

Sur le [dataset de correspondance entre les communes et les circonscriptions législatives](data/dept_communes_circo.csv),
nous avons ajouté une colonne `cleaned_dep` qui correspond à la colonne `DEP`, avec des minuscules au lieu de majuscules
sur les codes départementaux (ex: "2A" devient "2a" pour la Corse).

> Ceci afin de faciliter le mapping avec les données des députés.

## Outils

- OntoRefine (Mappings & conversion RDF)
- GraphDB (Repository)
- [Schema.org](https://schema.org/) (Vocabulaire principal)
- [OpenRefine GREL Functions](https://openrefine.org/docs/manual/grelfunctions) (Utilisation dans OntoRefine)

## Requêtes

### Nombre de députés par groupe parlementaire

> Utilisé à des fins de vérification après conversion des données.

```sparql
PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX politi: <http://politiRDF.com/>

SELECT ?groupAbbrev ?groupLabel ?color (COUNT(?depu) AS ?nbDeputes)
WHERE {
    ?group rdfs:label ?groupLabel ;
    	schema:alternateName ?groupAbbrev ;
    	schema:color ?color .

    ?depu schema:memberOf ?group .
} 
GROUP BY ?groupAbbrev ?groupLabel ?color
ORDER BY DESC(?nbDeputes)
```
