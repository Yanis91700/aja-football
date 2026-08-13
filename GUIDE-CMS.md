# Mettre en place l'espace admin en ligne

Objectif : que toi et les membres du bureau puissiez modifier le site depuis
n'importe quel navigateur, avec un identifiant personnel, et que les
changements apparaissent en ligne tout seuls — sans fichier, sans zip.

Le site est déjà prêt techniquement. Ce qui reste, ce sont trois inscriptions.
Compte 30 à 45 minutes la première fois. Tu ne le feras qu'une seule fois.

Vas-y étape par étape et dis-moi où tu en es : je peux regarder ton écran et
te dire exactement où cliquer.

---

## Étape 1 — Un compte GitHub

GitHub est l'endroit où le site va vivre. C'est lui qui garde l'historique de
toutes les modifications : si quelqu'un se trompe, on revient en arrière en un
clic. Tes collègues du bureau n'auront **pas** besoin de compte GitHub — toi
seul.

1. Va sur **github.com/signup**
2. Entre ton email, choisis un mot de passe et un nom d'utilisateur
3. Valide le code reçu par mail

Note bien ton nom d'utilisateur, on va s'en servir.

---

## Étape 2 — Déposer le site sur GitHub

1. Une fois connecté, clique sur le **+** en haut à droite → **New repository**
2. Repository name : `aja-football`
3. Laisse **Public** coché (le contenu d'un site web est public de toute façon)
4. Ne coche rien d'autre, clique **Create repository**
5. Sur la page qui s'affiche, clique sur le lien **uploading an existing file**
6. Ouvre le dossier `aja-football` sur ton Mac, sélectionne **tout son contenu**
   (Cmd+A), et fais-le glisser dans la zone du navigateur
7. En bas, clique sur **Commit changes**

⚠️ Glisse le *contenu* du dossier, pas le dossier lui-même. Tu dois voir
apparaître `index.html`, `admin`, `content`, `assets`… à la racine.

---

## Étape 3 — Relier Netlify à GitHub

Aujourd'hui tu déposes une archive à la main. À partir de maintenant, Netlify
ira chercher le site directement sur GitHub et le reconstruira tout seul.

1. Va sur **app.netlify.com/projects/aja-football**
2. **Site configuration** → **Build & deploy** → **Continuous deployment**
3. Clique sur **Link repository** (ou *Manage repository*)
4. Choisis **GitHub**, autorise Netlify, puis sélectionne `aja-football`
5. Vérifie les réglages proposés :
   - Build command : `node build.mjs`
   - Publish directory : `.` (un simple point)
6. Clique sur **Deploy**

Une minute plus tard, le site en ligne est à jour — avec le nouveau design, la
photo du club et toutes les pages. Plus jamais de zip.

---

## Étape 4 — Une clé d'accès pour le CMS

C'est ce qui autorise l'espace admin à enregistrer les modifications.

1. Va sur **github.com/settings/personal-access-tokens**
2. **Generate new token** → *Fine-grained token*
3. Nom : `aja-football-cms`, expiration : la plus longue proposée
4. Repository access : **Only select repositories** → coche `aja-football`
5. Permissions → **Repository permissions** → **Contents** → passe sur
   **Read and write**
6. **Generate token**, puis copie la clé affichée

⚠️ Cette clé ne s'affiche qu'une fois, et elle donne accès à ton dépôt. Garde-la
pour l'étape suivante, ne la mets nulle part ailleurs, et ne me l'envoie pas :
je n'ai pas besoin de la voir et je ne manipule pas ce genre de secret.

---

## Étape 5 — DecapBridge (la connexion des utilisateurs)

C'est le service qui permet à tes collègues de se connecter avec Google ou un
mot de passe, sans compte GitHub. Gratuit.

1. Va sur **decapbridge.com/auth/signup** et crée un compte
2. Clique sur **Add a site** et remplis :
   - Git provider : **GitHub**
   - Git repository : `ton-nom-utilisateur/aja-football`
   - Git access token : la clé de l'étape 4
   - Decap CMS login URL : `https://aja-football.netlify.app/admin/index.html`
   - Auth type : **PKCE** (c'est ce qui active « Se connecter avec Google »)
3. Clique sur **Create site**

DecapBridge affiche alors un bloc de configuration. **Copie-le.**

---

## Étape 6 — Coller la configuration

Le fichier à modifier est déjà en place, il n'y a qu'un bloc à remplacer.

1. Sur GitHub, ouvre `admin/config.yml` dans ton dépôt
2. Clique sur l'icône crayon (**Edit this file**)
3. Tout en haut, remplace le bloc encadré par les commentaires
   « À REMPLACER PAR LE BLOC FOURNI PAR DECAPBRIDGE » par ce que tu as copié
4. **Ne touche à rien d'autre** : tout ce qui suit (`collections:` et la suite)
   décrit tes rubriques, c'est déjà réglé
5. Clique sur **Commit changes**

Netlify reconstruit le site automatiquement. Attends une minute.

---

## Étape 7 — Essayer

Va sur **aja-football.netlify.app/admin/**

Tu devrais voir une page de connexion. Connecte-toi, et tu retrouveras tes cinq
rubriques : Actualités, Matchs, Entraînements, Équipes, Chiffres clés.

Modifie quelque chose, clique sur **Publish**. Une minute plus tard, le site
public est à jour. C'est tout.

---

## Étape 8 — Inviter le bureau

Sur decapbridge.com, page de ton site, onglet **Manage collaborators** : tu
entres une adresse email, la personne reçoit une invitation et choisit son mode
de connexion (Google, Microsoft ou mot de passe).

Ils arrivent en tant que **collaborateurs** : ils peuvent modifier le contenu,
mais pas gérer les autres utilisateurs ni les réglages du site. C'est
exactement ce que tu veux pour des éducateurs.

---

## Comment ça marche, une fois en place

```
   Un membre du bureau modifie une actualité dans /admin
                        ↓
   La modification est enregistrée sur GitHub (historique conservé)
                        ↓
   Netlify le détecte et relance build.mjs
                        ↓
   Le contenu du site est régénéré, les pages sont republiées
                        ↓
   Une minute plus tard : le site public est à jour
```

Tu n'as plus rien à faire manuellement, et moi non plus.

---

## En cas de problème

| Symptôme | Cause probable |
|---|---|
| La page /admin reste blanche | `config.yml` mal collé — vérifie l'indentation du bloc backend |
| « Failed to load config.yml » | Le fichier n'est pas dans le dossier `admin/` |
| Connexion refusée | La clé GitHub de l'étape 4 n'a pas la permission *Contents: Read and write* |
| Le site ne se met pas à jour | Onglet *Deploys* sur Netlify : le build a peut-être échoué, le journal dit pourquoi |

Dans tous les cas, décris-moi ce que tu vois et je te débloque.
