/* ============================================================
   AJA FOOTBALL — Scripts du site
   Menu mobile · ombre du header · lightbox · filtres ·
   formulaire de contact · images de secours · animations
   ============================================================ */

/* ---- FORMULAIRE DE CONTACT : rien à configurer -------------------------
   Le formulaire fonctionne tel quel. Quand un visiteur clique sur
   « Envoyer », son logiciel de messagerie s'ouvre avec un message déjà
   rédigé et adressé au club. Aucun compte, aucune clé, aucun réglage.

   AMÉLIORATION FACULTATIVE (plus tard, si tu veux) :
   pour que les messages arrivent directement dans ta boîte sans que le
   visiteur ait à valider l'envoi, récupère une clé gratuite sur
   https://web3forms.com et colle-la ci-dessous entre les guillemets.
   Le site basculera automatiquement sur ce mode.
   --------------------------------------------------------------------- */
const WEB3FORMS_ACCESS_KEY = "";
const CLUB_EMAIL = "yanislamrabette@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initImageFallback();
  initReveal();
  initFilters();
  initLightbox();
  initContactForm();
  initYear();
});

/* ---------- Header : ombre au scroll ---------------------------------- */
function initHeader() {
  const header = document.querySelector("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("shadow-md", window.scrollY > 50);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Menu mobile (hamburger) ----------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  const icon = btn.querySelector(".material-symbols-outlined");

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    if (icon) icon.textContent = open ? "close" : "menu";
  };

  btn.addEventListener("click", () => setOpen(!menu.classList.contains("open")));

  // Fermeture au clic sur un lien, à l'Échap, ou en repassant en desktop
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setOpen(false);
      btn.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && menu.classList.contains("open")) setOpen(false);
  });
}

/* ---------- Images : remplacement propre si l'URL ne répond plus -------
   Les photos exportées depuis Stitch sont hébergées sur des liens Google
   temporaires. Quand l'un d'eux expire, on affiche un bloc aux couleurs
   du club plutôt qu'une icône d'image cassée.
   --------------------------------------------------------------------- */
function initImageFallback() {
  document.querySelectorAll("img").forEach((img) => {
    const replace = () => {
      if (img.dataset.fallbackDone) return;
      img.dataset.fallbackDone = "1";
      const ph = document.createElement("div");
      ph.className = "img-fallback " + (img.className || "");
      ph.textContent = img.getAttribute("alt") || "Photo AJA";
      img.replaceWith(ph);
    };
    img.addEventListener("error", replace);
    if (img.complete && img.naturalWidth === 0) replace();
  });
}

/* ---------- Apparition progressive au scroll --------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((i) => obs.observe(i));
}

/* ---------- Filtres par catégorie (actualités, galerie, équipes) -------
   Utilisation : des boutons .chip[data-filter="valeur"] et des éléments
   [data-category="valeur"]. data-filter="all" affiche tout.
   --------------------------------------------------------------------- */
function initFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSel = group.dataset.filterTarget;
    const chips = group.querySelectorAll(".chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => {
          c.classList.remove("active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");

        const want = chip.dataset.filter;
        document.querySelectorAll(targetSel).forEach((el) => {
          const show = want === "all" || el.dataset.category === want;
          el.style.display = show ? "" : "none";
        });
      });
    });
  });
}

/* ---------- Lightbox de la galerie ------------------------------------- */
function initLightbox() {
  const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (!triggers.length) return;

  const box = document.getElementById("lightbox");
  const imgEl = document.getElementById("lb-image");
  const capEl = document.getElementById("lb-caption");
  if (!box || !imgEl) return;

  let index = 0;
  const visible = () => triggers.filter((t) => t.offsetParent !== null);

  const show = (i) => {
    const list = visible();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    const el = list[index];
    const src = el.dataset.lightbox || el.querySelector("img")?.src;
    imgEl.src = src;
    imgEl.alt = el.dataset.caption || "Photo du club AJA Football";
    if (capEl) capEl.textContent = el.dataset.caption || "";
    box.classList.add("open");
    document.body.classList.add("menu-open");
  };

  const close = () => {
    box.classList.remove("open");
    document.body.classList.remove("menu-open");
    imgEl.src = "";
  };

  triggers.forEach((t, i) => {
    t.style.cursor = "zoom-in";
    t.setAttribute("tabindex", "0");
    t.setAttribute("role", "button");
    t.addEventListener("click", () => show(visible().indexOf(t)));
    t.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show(visible().indexOf(t));
      }
    });
  });

  document.getElementById("lb-close")?.addEventListener("click", close);
  document.getElementById("lb-prev")?.addEventListener("click", () => show(index - 1));
  document.getElementById("lb-next")?.addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
}

/* ---------- Formulaire de contact (Web3Forms) --------------------------- */
function initContactForm() {
  document.querySelectorAll("form[data-contact-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');
    const say = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.className =
        "text-label-bold mt-base px-md py-sm rounded-lg " +
        (kind === "ok"
          ? "bg-primary-container text-on-primary-container"
          : kind === "warn"
          ? "bg-error-container text-on-error-container"
          : "bg-surface-container text-on-surface-variant");
      status.hidden = false;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Champs obligatoires : on vérifie avant toute chose
      const manquants = Array.from(form.querySelectorAll("[required]")).filter((f) => !f.value.trim());
      if (manquants.length) {
        manquants[0].focus();
        say("Merci de remplir tous les champs marqués d'un astérisque.", "warn");
        return;
      }

      // --- Mode par défaut : ouverture du logiciel de messagerie ---------
      if (!WEB3FORMS_ACCESS_KEY) {
        const v = (n) => (form.querySelector(`[name="${n}"]`)?.value || "").trim();
        const sujets = {
          inscription: "Inscription / séance d'essai",
          categorie: "Question sur une catégorie",
          photos: "Partage de photos",
          benevolat: "Bénévolat",
          partenariat: "Partenariat",
          autre: "Message depuis le site",
        };
        const objet = `[Site AJA] ${sujets[v("sujet")] || "Message"} — ${v("prenom")} ${v("nom")}`;
        const corps = [
          `Nom : ${v("nom")}`,
          `Prénom : ${v("prenom")}`,
          `Email : ${v("email")}`,
          `Téléphone : ${v("telephone") || "non renseigné"}`,
          `Demande : ${sujets[v("sujet")] || v("sujet")}`,
          "",
          v("message"),
        ].join("\n");

        window.location.href =
          `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corps)}`;

        say(
          "Votre logiciel de messagerie s'ouvre avec le message prêt à partir — il ne reste qu'à cliquer sur « Envoyer ». " +
            `Si rien ne s'ouvre, écrivez-nous directement à ${CLUB_EMAIL}.`,
          "ok"
        );
        return;
      }

      // --- Mode Web3Forms (si une clé a été renseignée) ------------------
      const data = new FormData(form);
      data.append("access_key", WEB3FORMS_ACCESS_KEY);
      data.append("subject", "Nouveau message depuis le site AJA Football");
      data.append("from_name", "Site AJA Football");

      if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = "Envoi en cours…"; }
      say("Envoi en cours…", "info");

      try {
        const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
        const json = await res.json();
        if (json.success) {
          form.reset();
          say("Message envoyé, merci ! Nous revenons vers vous sous 48 h.", "ok");
        } else {
          say("L'envoi a échoué. Réessaie ou écris à yanislamrabette@gmail.com.", "warn");
        }
      } catch (err) {
        say("Pas de connexion au serveur. Réessaie ou écris à yanislamrabette@gmail.com.", "warn");
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || "Envoyer le message"; }
      }
    });
  });
}

/* ---------- Année automatique dans le footer ---------------------------- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
