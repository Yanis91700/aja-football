/* ============================================================
   AJA FOOTBALL — Affichage du contenu
   Lit assets/contenu.js et remplit les listes des pages.
   Ce fichier n'a pas à être modifié : tout se règle depuis admin.html.
   ============================================================ */

(function () {
  const C = window.CONTENU;
  if (!C) return;

  /* Empêche qu'un texte saisi dans l'admin casse la page ou injecte du code */
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const cible = (nom) => document.querySelector(`[data-render="${nom}"]`);

  const remplir = (nom, html) => {
    const el = cible(nom);
    if (el) el.innerHTML = html;
  };

  /* ---------- Chiffres clés (accueil) ------------------------------- */
  remplir(
    "chiffres",
    (C.chiffres || [])
      .map(
        (s) => `
      <div class="text-center">
        <p class="font-headline-lg text-headline-lg text-primary-container">${esc(s.valeur)}</p>
        <p class="text-label-sm text-surface-variant mt-xs">${esc(s.label)}</p>
      </div>`
      )
      .join("")
  );

  /* ---------- Cartes « prochains matchs » (accueil) ------------------ */
  const carteMatch = (m) => {
    const dom = m.lieu === "Domicile";
    const badge = dom
      ? "bg-primary-container text-on-primary-container"
      : "bg-surface-container-highest text-on-surface-variant";
    return `
      <article class="reveal bg-surface-container-lowest border border-outline-variant rounded-2xl p-md hover:shadow-lg transition-shadow duration-300">
        <div class="flex items-center justify-between mb-md">
          <span class="font-label-bold text-label-sm bg-surface-container-high text-on-surface-variant px-sm py-xs rounded-full">${esc(m.categorie)}</span>
          <span class="font-label-bold text-label-sm ${badge} px-sm py-xs rounded-full">${esc(m.lieu)}</span>
        </div>
        <p class="font-label-bold text-label-bold text-on-surface mb-xs">${esc(m.domicile)}</p>
        <p class="text-label-sm text-secondary mb-xs">contre</p>
        <p class="font-label-bold text-label-bold text-on-surface mb-md">${esc(m.exterieur)}</p>
        <div class="flex items-center gap-xs text-secondary text-label-sm border-t border-outline-variant pt-sm">
          <span class="material-symbols-outlined text-base">event</span>${esc(m.date)} · ${esc(m.heure)}
        </div>
      </article>`;
  };
  remplir("matchs-accueil", (C.matchs || []).slice(0, 3).map(carteMatch).join(""));

  /* ---------- Cartes actualités -------------------------------------- */
  const carteActu = (a, avecLien) => `
      <article class="reveal group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col" data-category="${esc(a.categorie)}">
        <div class="h-48 overflow-hidden">
          <img alt="${esc(a.titre)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${esc(a.image)}" loading="lazy"/>
        </div>
        <div class="p-md flex flex-col flex-1">
          <div class="flex items-center gap-sm mb-sm">
            <span class="font-label-bold text-label-sm text-primary">${esc(a.categorieLabel)}</span>
            <span class="text-label-sm text-secondary">· ${esc(a.date)}</span>
          </div>
          <h3 class="font-headline-md text-headline-md text-on-surface mb-sm leading-tight">${esc(a.titre)}</h3>
          <p class="text-secondary text-label-sm flex-1">${esc(a.extrait)}</p>
          ${
            avecLien
              ? `<a class="mt-md font-label-bold text-label-bold text-primary inline-flex items-center gap-xs hover:gap-sm transition-all" href="actualites.html">
            Lire la suite <span class="material-symbols-outlined text-base">arrow_forward</span>
          </a>`
              : ""
          }
        </div>
      </article>`;

  remplir("actus-accueil", (C.actualites || []).slice(0, 3).map((a) => carteActu(a, true)).join(""));
  remplir("actus", (C.actualites || []).map((a) => carteActu(a, false)).join(""));

  /* ---------- Tableau des entraînements (planning) -------------------- */
  remplir(
    "entrainements",
    (C.entrainements || [])
      .map(
        (e) => `
        <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
          <td class="py-sm px-md font-label-bold text-label-bold text-primary whitespace-nowrap">${esc(e.categorie)}</td>
          <td class="py-sm px-md text-on-surface">${esc(e.jour)}</td>
          <td class="py-sm px-md text-on-surface whitespace-nowrap">${esc(e.horaire)}</td>
          <td class="py-sm px-md text-secondary text-label-sm">${esc(e.terrain)}</td>
          <td class="py-sm px-md text-secondary text-label-sm">${esc(e.educateur)}</td>
        </tr>`
      )
      .join("")
  );

  /* ---------- Tableau du calendrier (planning) ------------------------ */
  remplir(
    "calendrier",
    (C.matchs || [])
      .map((m) => {
        const badge =
          m.lieu === "Domicile"
            ? "bg-primary-container text-on-primary-container"
            : "bg-surface-container-highest text-on-surface-variant";
        return `
        <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
          <td class="py-sm px-md text-on-surface whitespace-nowrap">${esc(m.date)}</td>
          <td class="py-sm px-md text-on-surface whitespace-nowrap">${esc(m.heure)}</td>
          <td class="py-sm px-md font-label-bold text-label-bold text-primary whitespace-nowrap">${esc(m.categorie)}</td>
          <td class="py-sm px-md text-on-surface">${esc(m.domicile)} <span class="text-secondary">—</span> ${esc(m.exterieur)}</td>
          <td class="py-sm px-md"><span class="font-label-bold text-label-sm ${badge} px-sm py-xs rounded-full whitespace-nowrap">${esc(m.lieu)}</span></td>
        </tr>`;
      })
      .join("")
  );

  /* ---------- Cartes des équipes -------------------------------------- */
  remplir(
    "equipes",
    (C.equipes || [])
      .map(
        (e) => `
      <article class="reveal group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col" data-category="${esc(e.groupe)}">
        <div class="h-44 overflow-hidden relative">
          <img alt="Catégorie ${esc(e.nom)} de l'AJA Football" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${esc(e.image)}" loading="lazy"/>
          <span class="absolute top-sm left-sm bg-primary-container text-on-primary-container font-label-bold text-label-bold px-sm py-xs rounded-full">${esc(e.nom)}</span>
        </div>
        <div class="p-md flex flex-col flex-1">
          <p class="text-label-sm text-secondary mb-sm">Nés en ${esc(e.annees)} · ${esc(e.effectif)} licenciés</p>
          <p class="text-secondary text-label-sm flex-1 mb-md">${esc(e.texte)}</p>
          <dl class="space-y-xs border-t border-outline-variant pt-sm text-label-sm">
            <div class="flex items-center gap-xs">
              <dt class="sr-only">Éducateur</dt>
              <span class="material-symbols-outlined text-base text-primary">person</span>
              <dd class="text-on-surface">${esc(e.coach)}</dd>
            </div>
            <div class="flex items-center gap-xs">
              <dt class="sr-only">Créneau</dt>
              <span class="material-symbols-outlined text-base text-primary">schedule</span>
              <dd class="text-on-surface">${esc(e.creneau)}</dd>
            </div>
          </dl>
        </div>
      </article>`
      )
      .join("")
  );

  /* ---------- Boutons de filtre --------------------------------------- */
  const chips = (liste) =>
    (liste || [])
      .map(
        (f, i) =>
          `<button class="chip border border-outline-variant px-md py-sm rounded-full font-label-bold text-label-sm transition-colors hover:bg-surface-container-high${
            i === 0 ? " active" : ""
          }" data-filter="${esc(f.valeur)}" aria-pressed="${i === 0}" type="button">${esc(f.label)}</button>`
      )
      .join("\n");

  remplir("filtres-actus", chips(C.categoriesActus));
  remplir("filtres-equipes", chips(C.groupesEquipes));
})();
