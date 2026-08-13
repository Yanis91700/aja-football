# Site AJA Football

Site complet du club, construit à partir de ta maquette Stitch. Six pages,
même design system, aucun outil à installer : ce sont des fichiers HTML que
tu peux ouvrir en double-cliquant dessus.

---

## Ce qu'il y a dans le dossier

```
aja-football/
├── index.html         Accueil
├── actualites.html    Actualités (avec filtres par catégorie)
├── planning.html      Entraînements + calendrier des matchs
├── equipes.html       Les 8 catégories, U7 → Loisir
├── galerie.html       Ta page Stitch, avec lightbox et filtres
├── contact.html       Formulaire, carte, permanences
├── assets/
│   ├── tailwind.config.js   Couleurs, polices, espacements — le design system
│   ├── style.css            Styles maison (lightbox, menu mobile, grille galerie)
│   └── app.js               Scripts + la clé du formulaire à remplir
└── _build/            Générateur des pages (optionnel, voir plus bas)
```

---

## L'espace admin

Adresse : **aja-football.netlify.app/admin/**

Chaque membre du bureau a son propre accès (Google, Microsoft ou mot de passe).
On modifie, on clique sur *Publish*, et le site public est à jour une minute
plus tard. Aucun fichier à manipuler, aucune archive à déposer.

Cinq rubriques : **Actualités**, **Matchs**, **Entraînements**, **Équipes**,
**Chiffres clés**. Les photos s'envoient directement depuis l'admin.

⚠️ La mise en place demande trois inscriptions (GitHub, Netlify, DecapBridge),
à faire une seule fois. Tout est détaillé dans **GUIDE-CMS.md**.

### Comment le contenu circule

```
content/*.json   ← ce que le CMS modifie
      ↓ build.mjs (lancé par Netlify à chaque publication)
assets/contenu.js
      ↓ assets/render.js
les pages du site
```

Conséquence pratique : on ne modifie jamais `assets/contenu.js` à la main, il
est régénéré à chaque publication. Le contenu se modifie dans l'admin, ou à la
rigueur dans les fichiers de `content/`.

### Qui peut faire quoi

- **Collaborateur** (les éducateurs) : modifier et publier le contenu
- **Propriétaire** (toi) : en plus, inviter ou retirer des personnes
- **Compte Netlify** : réglages techniques, à garder pour toi

Chaque modification est enregistrée avec le nom de son auteur et la date. En
cas d'erreur, l'historique GitHub permet de revenir en arrière.

---

## Le formulaire de contact : rien à faire

Il fonctionne déjà. Quand un visiteur remplit le formulaire et clique sur
« Envoyer », son logiciel de messagerie s'ouvre avec un message complet,
déjà adressé à `yanislamrabette@gmail.com`. Il lui reste à cliquer sur
Envoyer. Aucun compte, aucune clé, aucun réglage.

**Amélioration facultative, pour plus tard.** Avec cette méthode, le
visiteur doit valider l'envoi depuis sa propre messagerie — quelques-uns
abandonnent à ce moment-là. Pour que les messages arrivent directement dans
ta boîte : récupère une clé gratuite sur **https://web3forms.com** (tu
entres ton email, tu reçois la clé par retour de mail) et colle-la dans
`assets/app.js` ligne 17, entre les guillemets de
`const WEB3FORMS_ACCESS_KEY = "";`. Le site bascule tout seul sur ce mode.

---

## Les 2 choses à faire quand tu auras le temps

### 1. Remplacer les photos

Les images actuelles viennent de l'export Stitch et sont hébergées sur des
liens Google **temporaires** : elles vont expirer. Le site ne cassera pas
(il affiche un bloc aux couleurs du club à la place), mais il faut les
remplacer par de vraies photos du club.

- Le dossier `assets/img/` existe déjà (il contient la photo du club)
- Mets-y tes photos (format `.jpg`, redimensionnées à ~1600 px de large max)
- Dans chaque fichier HTML, remplace les longues URL `https://lh3.googleusercontent.com/...`
  par `assets/img/ton-fichier.jpg`

> **Droit à l'image** : pour des photos de mineurs, il faut une autorisation
> écrite des parents. Le formulaire d'inscription du club est le bon endroit
> pour la recueillir.

### 2. Remplacer les contenus d'exemple

J'ai écrit des textes réalistes mais **inventés** pour que le site soit
présentable tout de suite. À corriger avec les vraies infos :

| Où | Quoi |
|---|---|
| Admin → Équipes | Noms des éducateurs, effectifs, années de naissance |
| Admin → Entraînements et Matchs | Créneaux et calendrier |
| Admin → Actualités | Les 6 articles |
| Admin → Chiffres clés | 1991 / 12 équipes / 280 licenciés / 25 éducateurs |
| Toutes | L'adresse exacte du stade si « rue Paul Bourget » est incomplète |

---

## Mise en ligne

Une fois le CMS en place (voir GUIDE-CMS.md), il n'y a plus rien à faire :
chaque publication depuis l'admin met le site à jour automatiquement.

### Nom de domaine personnalisé

Pour `ajafootball.fr` : achète le domaine (~12 €/an chez OVH, Gandi ou
Infomaniak), puis dans Netlify → *Domain settings* → *Add custom domain*.
Netlify t'indique les deux lignes à copier chez ton registrar. Le HTTPS est
automatique et gratuit.

---

## Modifier le site

**Le contenu** (actualités, matchs, horaires, équipes, chiffres) se modifie
dans l'admin en ligne. C'est le cas courant.

**Les textes fixes** (titres des pages, présentation du club, mentions du pied
de page) sont dans les fichiers `.html`. Le dossier `_build/` contient le
générateur : le menu et le pied de page y sont écrits une seule fois, puis
recopiés dans les 7 pages.

```bash
python3 _build/build.py
```

- `_build/shell.py` → menu, pied de page, coordonnées du club
- `_build/pages_a.py` → accueil, actualités, planning
- `_build/pages_b.py` → équipes, galerie, contact

**Les couleurs et polices** : `assets/tailwind.config.js`. Par exemple
`primary-container: "#ffd700"` est le jaune des boutons.

> ⚠️ Ne modifie jamais `assets/contenu.js` : il est régénéré à chaque
> publication et tes changements seraient écrasés.

---

## Ce qui a été corrigé par rapport à l'export Stitch

| Problème | Correction |
|---|---|
| Aucun menu sous 768 px — la navigation disparaissait | Menu hamburger, fermeture à l'Échap et au clic sur un lien |
| Photos non cliquables | Lightbox avec flèches, clavier et fermeture au clic extérieur |
| Formulaire décoratif | Envoi réel via Web3Forms, anti-spam, messages de succès/erreur |
| Champs de formulaire sans `<label>` | Labels visibles, `autocomplete`, lisible par lecteur d'écran |
| Marges fixes à 64 px sur mobile | Marges responsive (16 / 40 / 64 px) |
| Zone carte vide | Carte Google Maps intégrée, sans clé API |
| Design system dupliqué dans chaque page | Centralisé dans `assets/tailwind.config.js` |
| Aucune balise description / Open Graph | Titre + description uniques par page, partage social propre |
| Images cassées si une URL expire | Bloc de secours aux couleurs du club |
| Année « 2024 » figée dans le pied de page | Mise à jour automatique |

### Un point technique restant

Tailwind est chargé depuis un CDN (`cdn.tailwindcss.com`), comme dans
l'export Stitch. Ça fonctionne parfaitement, mais ça ajoute ~1 s au premier
chargement et affiche un avertissement dans la console des développeurs.
Pour un site de club, c'est un compromis tout à fait acceptable. Si le site
prend de l'ampleur, on pourra compiler un vrai fichier CSS (~10 Ko au lieu
de 400 Ko) — dis-le-moi le moment venu.

---

## Vérifications déjà passées

- Structure HTML valide, balises correctement fermées sur les 6 pages
- Un seul `<h1>` par page, hiérarchie de titres cohérente
- Toutes les images ont un texte alternatif
- Aucun lien interne cassé, tous les fichiers `assets/` référencés existent
- JavaScript et CSS sans erreur de syntaxe
