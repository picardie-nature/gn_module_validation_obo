# Validation OBO (OneByOne)
---
## En cours de développement
---
Module validation "une par une" et collegiale

Module de validation collégiale (2 validateurs doivent choisir le même statut) pour GéoNature.
Le validateurs choisi le taxon, en général une famille ou un ordre (paramétrable depuis une liste Taxhub).


![Screenshot](docs/images/screenshot.png)


## Fonctionnalitées
- Validation des données 1 par 1, les plus récentes en premiers
- Validation "collégiale" : 2 validateurs doivent sélectionner le même niveau pour que celui-ci soit appliqué
- Validation croisée : un validateur ne peut donner son avis sur une données dont il est auteur
- Sélection des données à valider depuis l'arbre taxonomique (liste personnalisable depuis Taxhub, par défaut classes, ordres et familles)
- Suivi de la progression globale de la validation + stats perso
- Aperçu rapide de principales caractéristiques de la donnée
- Possibilité pour l'administrateur de prioriser les données à valider (depuis la base, pas d'interface)
- Couplage au module _Validation automatique_ : affichage des résultats des tests de validations
- Echanges entre le validateur et l'observateurs (_voir comment ça peut s'interfacer avec un module Social_)
