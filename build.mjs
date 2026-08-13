/* ============================================================
   AJA FOOTBALL — Reconstruction du contenu du site
   ------------------------------------------------------------
   Lit les fichiers du dossier content/ (ceux que le CMS modifie)
   et régénère assets/contenu.js, que les pages du site lisent.

   Netlify lance ce script tout seul à chaque publication.
   Aucune dépendance à installer : Node seul suffit.

   Pour le lancer à la main :  node build.mjs
   ============================================================ */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const RACINE = new URL(".", import.meta.url).pathname;
const CONTENU = join(RACINE, "content");

/* ---- Lecture tolérante : un fichier absent ne casse pas le build ---- */
async function lireJSON(chemin, defaut) {
  try {
    return JSON.parse(await readFile(chemin, "utf8"));
  } catch (e) {
    console.warn(`  ⚠ ${chemin} illisible (${e.code || e.message}) — valeur par défaut utilisée`);
    return defaut;
  }
}

/* ---- Dates : de 2026-03-12 vers « 12 mars 2026 » -------------------- */
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin",
              "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const JOURS = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const MOIS_COURT = ["janv.", "févr.", "mars", "avr.", "mai", "juin",
                    "juil.", "août", "sept.", "oct.", "nov.", "déc."];

const dateLongue = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const dateCourte = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${JOURS[d.getUTCDay()]} ${d.getUTCDate()} ${MOIS_COURT[d.getUTCMonth()]}`;
};

/* ---- Rubriques et groupes (doivent refléter admin/config.yml) -------- */
const CATEGORIES_ACTUS = [
  { valeur: "all", label: "Toutes" },
  { valeur: "resultats", label: "Résultats" },
  { valeur: "club", label: "Vie du club" },
  { valeur: "formation", label: "Formation" },
  { valeur: "inscriptions", label: "Inscriptions" },
];

const GROUPES_EQUIPES = [
  { valeur: "all", label: "Toutes" },
  { valeur: "ecole", label: "École de foot" },
  { valeur: "jeunes", label: "Jeunes" },
  { valeur: "adultes", label: "Adultes" },
];

const CATEGORIES_GALERIE = [
  { valeur: "all", label: "Toutes" },
  { valeur: "matchs", label: "Matchs" },
  { valeur: "entrainements", label: "Entraînements" },
  { valeur: "tournois", label: "Tournois" },
  { valeur: "vie-du-club", label: "Vie du club" },
];

// Taille de chaque photo dans la mosaïque de la galerie
const TAILLES_GALERIE = {
  grande: "md:col-span-4 md:row-span-4",
  large: "md:col-span-8 md:row-span-2",
  moyenne: "md:col-span-4 md:row-span-2",
};

const libelle = (liste, valeur) =>
  (liste.find((x) => x.valeur === valeur) || {}).label || valeur;

/* ---- Construction ---------------------------------------------------- */
console.log("Reconstruction du contenu du site…");

const [chiffres, matchs, entrainements, equipes, photos, galerie] = await Promise.all([
  lireJSON(join(CONTENU, "chiffres.json"), { items: [] }),
  lireJSON(join(CONTENU, "matchs.json"), { items: [] }),
  lireJSON(join(CONTENU, "entrainements.json"), { items: [] }),
  lireJSON(join(CONTENU, "equipes.json"), { items: [] }),
  lireJSON(join(CONTENU, "photos.json"), {}),
  lireJSON(join(CONTENU, "galerie.json"), { items: [] }),
]);

// Actualités : un fichier par article, les plus récentes en premier
let actualites = [];
try {
  const fichiers = (await readdir(join(CONTENU, "actualites"))).filter((f) => f.endsWith(".json"));
  const articles = await Promise.all(
    fichiers.map((f) => lireJSON(join(CONTENU, "actualites", f), null))
  );
  actualites = articles
    .filter(Boolean)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((a) => ({
      categorie: a.categorie || "club",
      categorieLabel: libelle(CATEGORIES_ACTUS, a.categorie),
      titre: a.titre || "",
      extrait: a.extrait || "",
      date: dateLongue(a.date),
      image: a.image || "",
    }));
} catch (e) {
  console.warn("  ⚠ dossier content/actualites introuvable");
}

// Matchs : triés par date, la plus proche en premier
const listeMatchs = (matchs.items || [])
  .slice()
  .sort((a, b) => String(a.date).localeCompare(String(b.date)))
  .map((m) => ({
    date: dateCourte(m.date),
    heure: m.heure || "",
    categorie: m.categorie || "",
    domicile: m.domicile || "",
    exterieur: m.exterieur || "",
    lieu: m.lieu || "Domicile",
  }));

// Galerie : on traduit la taille choisie dans l'admin en classes d'affichage
const listeGalerie = (galerie.items || []).map((p) => ({
  image: p.image || "",
  titre: p.titre || "",
  legende: p.legende || "",
  categorie: p.categorie || "vie-du-club",
  span: TAILLES_GALERIE[p.taille] || TAILLES_GALERIE.moyenne,
}));

const contenu = {
  chiffres: chiffres.items || [],
  matchs: listeMatchs,
  entrainements: entrainements.items || [],
  actualites,
  equipes: equipes.items || [],
  galerie: listeGalerie,
  categoriesActus: CATEGORIES_ACTUS,
  groupesEquipes: GROUPES_EQUIPES,
  categoriesGalerie: CATEGORIES_GALERIE,
  "photothèque": photos,
};

const entete = `/* ============================================================
   AJA FOOTBALL — CONTENU DU SITE
   Fichier généré automatiquement par build.mjs.
   Ne pas modifier à la main : les changements se font dans le CMS
   (adresse /admin) ou dans les fichiers du dossier content/.
   Généré le ${new Date().toISOString()}
   ============================================================ */
window.CONTENU = `;

await writeFile(
  join(RACINE, "assets", "contenu.js"),
  entete + JSON.stringify(contenu, null, 2) + ";\n",
  "utf8"
);

console.log("  chiffres      :", contenu.chiffres.length);
console.log("  matchs        :", contenu.matchs.length);
console.log("  entraînements :", contenu.entrainements.length);
console.log("  actualités    :", contenu.actualites.length);
console.log("  équipes       :", contenu.equipes.length);
console.log("  galerie       :", contenu.galerie.length);
console.log("assets/contenu.js régénéré.");
