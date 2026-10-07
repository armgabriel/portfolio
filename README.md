# Portfolio en HTML, CSS et JavaScript

Site personnel statique, animé et adapté aux téléphones, publié gratuitement par GitHub Pages. Aucun outil à installer : tout se modifie depuis le navigateur, sur GitHub.

## Personnaliser le contenu

**Tout le contenu se trouve dans un seul fichier : [`js/donnees.js`](js/donnees.js).** Ouvrez-le sur GitHub, cliquez sur le crayon (« Edit this file »), remplacez les valeurs d'exemple, puis « Commit changes ». Le site se met à jour en une minute environ.

| Partie du fichier | Ce qu'elle contrôle |
| --- | --- |
| `identite` | Nom, phrases animées sous le nom, accroche, photo, CV, couleur du site |
| `aPropos` | Paragraphes de présentation et chiffres clés animés |
| `competences` | Cartes de compétences avec jauges (niveau de 0 à 100) |
| `blocs` | Compétences du bloc 1 du BTS SIO (tableau de synthèse) |
| `projets` | Cartes de projets, filtres et fenêtre de détail |
| `parcours` | Frise chronologique (formation, expériences) |
| `contact` | E-mail, GitHub, LinkedIn et autre lien |

Quelques règles : le texte se met entre guillemets `"..."`, les éléments d'une liste sont séparés par des virgules, et une valeur vide `""` masque le lien ou le bouton correspondant.

### Ajouter un projet

1. Dans `js/donnees.js`, copiez un bloc `{ titre: ..., sections: [...] }` entier de la liste `projets`.
2. Collez-le après le dernier, avec une virgule entre les deux, puis remplissez-le.
3. Déposez la capture dans le dossier `images` (« Add file », « Upload files ») et indiquez son chemin dans `image`, par exemple `"images/ma-capture.png"`.
4. Citez les compétences du BTS prouvées par ce projet dans `blocs`, par exemple `["c2", "c5"]` : le tableau se remplit tout seul.

### Ajouter une photo ou un CV

Déposez le fichier dans `images`, puis indiquez son chemin dans `identite.photo` (par exemple `"images/moi.jpg"`) ou `identite.cv` (par exemple `"images/cv.pdf"`). Sans photo, le site affiche vos initiales.

### Changer les couleurs

La couleur principale se règle dans `identite.couleur`. Les autres couleurs (fond, texte, seconde couleur des dégradés) sont en haut de `css/style.css`, pour le thème clair et pour le thème sombre.

## Publier sur GitHub Pages

Settings, Pages, Source « Deploy from a branch », branche `main`, dossier `/ (root)`, Save. L'adresse du site s'affiche ensuite en haut de cette page de réglages.

## Voir le site sur son ordinateur

Téléchargez le dépôt (bouton vert « Code », « Download ZIP ») et ouvrez `index.html` dans le navigateur : aucun serveur n'est nécessaire.

## Organisation des fichiers

```
index.html            page principale (structure des sections)
mentions-legales.html page des mentions légales
js/donnees.js         VOS INFORMATIONS : le seul fichier à modifier
js/main.js            construit la page et gère les animations
css/style.css         mise en forme, thèmes clair et sombre, animations
images/               photos, captures et CV
.nojekyll             indique à GitHub Pages de publier les fichiers tels quels
```

## Fonctionnalités

- Fond animé de particules qui réagit à la souris, nom en dégradé animé, effet « machine à écrire ».
- Apparition des sections au défilement, jauges et compteurs animés.
- Projets filtrables par catégorie, avec fenêtre de détail et inclinaison 3D au survol.
- Tableau des compétences du BTS SIO rempli automatiquement.
- Thème clair ou sombre (mémorisé), menu adapté aux téléphones, barre de progression de lecture.
- Respect du réglage « réduire les animations » du système et navigation au clavier.

Code sous licence MIT, contenu sous licence CC BY 4.0.
