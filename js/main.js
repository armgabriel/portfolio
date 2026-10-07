/* =====================================================================
   SCRIPT DU PORTFOLIO
   Construit la page à partir de l'objet PORTFOLIO (js/donnees.js) et
   gère les animations. Vous n'avez normalement rien à modifier ici :
   tout le contenu se change dans donnees.js.
   ===================================================================== */

(function () {
  "use strict";

  const D = PORTFOLIO;                       // raccourci vers les données
  const id = D.identite;
  const nomComplet = (id.prenom + " " + id.nom).trim();
  const initiales = (id.prenom.charAt(0) + id.nom.charAt(0)).toUpperCase();
  // Vrai si l'utilisateur a demandé moins d'animations dans son système
  const moinsAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Petit outil pour créer des éléments HTML ----------
     el("a", { href: "#", class: "lien" }, ["texte", autreElement])
     Le texte est inséré tel quel (jamais interprété comme du HTML). */
  function el(balise, attributs, enfants) {
    const noeud = document.createElement(balise);
    for (const cle in attributs || {}) {
      const valeur = attributs[cle];
      if (valeur === false || valeur === null || valeur === undefined) continue;
      if (cle === "texte") noeud.textContent = valeur;
      else if (cle.startsWith("on")) noeud.addEventListener(cle.slice(2), valeur);
      else noeud.setAttribute(cle, valeur === true ? "" : valeur);
    }
    [].concat(enfants || []).forEach(function (enfant) {
      if (enfant === null || enfant === undefined || enfant === "") return;
      noeud.append(enfant instanceof Node ? enfant : document.createTextNode(enfant));
    });
    return noeud;
  }
  const $ = (selecteur) => document.querySelector(selecteur);

  // Transforme "2026-10" en "10/2026"
  function formaterDate(date) {
    const morceaux = String(date || "").split("-");
    return morceaux.length >= 2 ? morceaux[1] + "/" + morceaux[0] : String(date || "");
  }

  /* ---------- Textes simples (titre, nom, accroche...) ---------- */
  function remplirTextes() {
    document.title = document.body.dataset.titrePage
      ? document.body.dataset.titrePage + " · " + nomComplet
      : nomComplet + " · Portfolio";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", id.accroche);
    if (id.couleur) document.documentElement.style.setProperty("--accent", id.couleur);

    const valeurs = {
      nomComplet: nomComplet,
      initiales: initiales,
      accroche: id.accroche,
      messageContact: D.contact.message,
      email: D.contact.email
    };
    document.querySelectorAll("[data-remplir]").forEach(function (noeud) {
      const valeur = valeurs[noeud.dataset.remplir];
      if (valeur !== undefined) noeud.textContent = valeur;
    });
    const annee = $("#annee");
    if (annee) annee.textContent = new Date().getFullYear();

    const boutonCv = $("#bouton-cv");
    if (boutonCv && id.cv) { boutonCv.href = id.cv; boutonCv.hidden = false; }
  }

  /* ---------- Effet « machine à écrire » sous le nom ---------- */
  function machineAEcrire() {
    const cible = $("#texte-tape");
    const phrases = id.titres || [];
    if (!cible || !phrases.length) return;
    if (moinsAnimations) { cible.textContent = phrases[0]; return; }

    let phrase = 0, lettre = 0, efface = false;
    function etape() {
      const texte = phrases[phrase];
      lettre += efface ? -1 : 1;
      cible.textContent = texte.slice(0, lettre);
      let delai = efface ? 35 : 75;
      if (!efface && lettre === texte.length) { efface = true; delai = 1800; }   // pause en fin de phrase
      else if (efface && lettre === 0) { efface = false; phrase = (phrase + 1) % phrases.length; delai = 400; }
      setTimeout(etape, delai);
    }
    etape();
  }

  /* ---------- À propos : photo, paragraphes et chiffres ---------- */
  function construireAPropos() {
    const avatar = $("#avatar");
    if (!avatar) return;
    if (id.photo) avatar.append(el("img", { src: id.photo, alt: "Photo de " + nomComplet }));
    else avatar.textContent = initiales;

    const texte = $("#apropos-texte");
    D.aPropos.paragraphes.forEach((p) => texte.append(el("p", { texte: p })));
    if (id.localisation) texte.append(el("p", { class: "projet-meta", texte: "📍 " + id.localisation }));

    const chiffres = $("#chiffres");
    D.aPropos.chiffres.forEach(function (c, i) {
      chiffres.append(el("div", { class: "chiffre revele", style: "transition-delay:" + i * 0.1 + "s" }, [
        el("strong", { "data-compteur": c.valeur, texte: "0" }),
        el("span", { texte: c.libelle })
      ]));
    });
  }

  /* ---------- Compétences : cartes avec jauges ---------- */
  function construireCompetences() {
    const liste = $("#liste-competences");
    if (!liste) return;
    D.competences.forEach(function (groupe, i) {
      const carte = el("article", { class: "carte-competence revele", style: "transition-delay:" + i * 0.1 + "s" }, [
        el("h3", { texte: groupe.categorie })
      ]);
      groupe.elements.forEach(function (c) {
        const niveau = Math.max(0, Math.min(100, Number(c.niveau) || 0));
        carte.append(el("div", { class: "jauge" }, [
          el("div", { class: "jauge-entete" }, [el("span", { texte: c.nom }), el("span", { texte: niveau + " %" })]),
          el("div", {
            class: "jauge-barre", role: "progressbar", "aria-label": c.nom,
            "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": niveau
          }, [el("span", { "data-niveau": niveau })])
        ]));
      });
      liste.append(carte);
    });
  }

  /* ---------- Projets : filtres, cartes et fenêtre de détail ---------- */
  // Projets triés du plus récent au plus ancien
  const projets = D.projets.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function construireProjets() {
    const liste = $("#liste-projets");
    if (!liste) return;

    // Un bouton par catégorie, plus « Tous »
    const categories = ["Tous"].concat([...new Set(projets.map((p) => p.categorie).filter(Boolean))]);
    const filtres = $("#filtres");
    categories.forEach(function (cat, i) {
      filtres.append(el("button", {
        class: "filtre", type: "button", "aria-pressed": i === 0 ? "true" : "false", texte: cat,
        onclick: function () { filtrer(cat); }
      }));
    });
    if (categories.length <= 2) filtres.hidden = true;   // inutile s'il n'y a qu'une catégorie

    projets.forEach(function (p, i) {
      const visuel = el("div", { class: "projet-image" },
        p.image ? el("img", { src: p.image, alt: "", loading: "lazy" }) : p.titre.charAt(0));

      const actions = el("div", { class: "projet-actions" }, [
        p.sections && p.sections.length
          ? el("button", { class: "lien-detail", type: "button", texte: "Voir le détail →", onclick: () => ouvrirProjet(p, i) })
          : null,
        p.lien ? el("a", { href: p.lien, target: "_blank", rel: "noopener", texte: "Site ↗" }) : null,
        p.code ? el("a", { href: p.code, target: "_blank", rel: "noopener", texte: "Code ↗" }) : null
      ]);

      const carte = el("article", {
        class: "projet revele", id: "projet-" + (i + 1), "data-categorie": p.categorie || "",
        style: "transition-delay:" + (i % 3) * 0.1 + "s"
      }, [
        visuel,
        el("div", { class: "projet-corps" }, [
          el("p", { class: "projet-meta", texte: "P" + (projets.length - i) + " · " + formaterDate(p.date) + (p.cadre ? " · " + p.cadre : "") }),
          el("h3", { texte: p.titre }),
          el("p", { texte: p.resume }),
          el("ul", { class: "etiquettes", "aria-label": "Technologies" }, (p.technologies || []).map((t) => el("li", { texte: t }))),
          actions
        ])
      ]);
      inclinaison3D(carte);
      liste.append(carte);
    });
  }

  // Affiche uniquement les projets de la catégorie choisie
  function filtrer(categorie) {
    document.querySelectorAll(".filtre").forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === categorie)));
    document.querySelectorAll(".projet").forEach(function (carte) {
      const garder = categorie === "Tous" || carte.dataset.categorie === categorie;
      carte.classList.toggle("cache", !garder);
    });
  }

  // Légère inclinaison de la carte qui suit la souris
  function inclinaison3D(carte) {
    if (moinsAnimations || !window.matchMedia("(hover: hover)").matches) return;
    carte.addEventListener("mousemove", function (e) {
      const r = carte.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      carte.style.transform = "perspective(800px) rotateY(" + x * 8 + "deg) rotateX(" + -y * 8 + "deg) translateY(-6px)";
    });
    carte.addEventListener("mouseleave", () => { carte.style.transform = ""; });
  }

  // Remplit et ouvre la fenêtre de détail d'un projet
  function ouvrirProjet(p, index) {
    const fenetre = $("#fenetre-projet");
    const contenu = $("#fenetre-contenu");
    contenu.replaceChildren();
    contenu.append(
      el("p", { class: "projet-meta", texte: formaterDate(p.date) + (p.cadre ? " · " + p.cadre : "") }),
      el("h2", { id: "fenetre-titre", texte: p.titre })
    );
    // Compétences BTS couvertes par ce projet
    const blocs = (p.blocs || []).map((code) => D.blocs.find((b) => b.code === code)).filter(Boolean);
    if (blocs.length) contenu.append(el("ul", { class: "etiquettes", style: "margin-top:1rem", "aria-label": "Compétences BTS" }, blocs.map((b) => el("li", { texte: b.libelle }))));
    if (p.image) contenu.append(el("img", { src: p.image, alt: "Capture du projet " + p.titre }));
    (p.sections || []).forEach(function (s) {
      contenu.append(el("h3", { texte: s.titre }));
      if (Array.isArray(s.contenu)) contenu.append(el("ol", null, s.contenu.map((ligne) => el("li", { texte: ligne }))));
      else contenu.append(el("p", { texte: s.contenu }));
    });
    const liens = el("div", { class: "projet-actions", style: "margin-top:1.5rem" }, [
      p.lien ? el("a", { class: "bouton bouton-plein", href: p.lien, target: "_blank", rel: "noopener", texte: "Voir le site" }) : null,
      p.code ? el("a", { class: "bouton bouton-contour", href: p.code, target: "_blank", rel: "noopener", texte: "Voir le code" }) : null
    ]);
    if (liens.children.length) contenu.append(liens);

    fenetre.showModal();
    fenetre.scrollTop = 0;
    history.replaceState(null, "", "#projet-" + (index + 1));
  }

  function preparerFenetre() {
    const fenetre = $("#fenetre-projet");
    if (!fenetre) return;
    fenetre.querySelector(".fenetre-fermer").addEventListener("click", () => fenetre.close());
    // Un clic en dehors de la fenêtre la ferme aussi
    fenetre.addEventListener("click", (e) => { if (e.target === fenetre) fenetre.close(); });
    fenetre.addEventListener("close", () => history.replaceState(null, "", "#projets"));
  }

  /* ---------- Tableau des compétences BTS ---------- */
  function construireTableauBts() {
    const table = $("#tableau-bts");
    if (!table) return;
    const entete = el("tr", null, [el("th", { scope: "col", texte: "Compétence" })]);
    projets.forEach(function (p, i) {
      entete.append(el("th", { scope: "col" }, el("button", {
        class: "lien-detail", type: "button", title: p.titre, texte: "P" + (projets.length - i),
        onclick: () => ouvrirProjet(p, i)
      })));
    });
    const corps = el("tbody");
    D.blocs.forEach(function (b) {
      const ligne = el("tr", null, [el("th", { scope: "row", texte: b.libelle })]);
      projets.forEach(function (p, i) {
        const prouve = (p.blocs || []).includes(b.code);
        ligne.append(el("td", null, prouve
          ? el("a", { class: "coche", href: "#projet-" + (i + 1), "aria-label": b.libelle + " : " + p.titre, texte: "✓",
              onclick: function (e) { e.preventDefault(); ouvrirProjet(p, i); } })
          : null));
      });
      corps.append(ligne);
    });
    table.append(el("thead", null, entete), corps);
  }

  /* ---------- Parcours ---------- */
  function construireParcours() {
    const frise = $("#frise");
    if (!frise) return;
    D.parcours.forEach(function (e) {
      frise.append(el("li", { class: "etape revele" }, [
        el("span", { class: "etape-periode", texte: e.periode }),
        el("h3", { texte: e.titre }),
        e.lieu ? el("p", { class: "etape-lieu", texte: e.lieu }) : null,
        e.description ? el("p", { texte: e.description }) : null
      ]));
    });
  }

  /* ---------- Contact ---------- */
  function construireContact() {
    const zone = $("#liens-contact");
    if (!zone) return;
    const c = D.contact;
    const liens = [
      c.email && { texte: "✉ " + c.email, href: "mailto:" + c.email, plein: true },
      c.github && { texte: "GitHub", href: c.github },
      c.linkedin && { texte: "LinkedIn", href: c.linkedin },
      c.autre && c.autre.url && { texte: c.autre.libelle || c.autre.url, href: c.autre.url }
    ].filter(Boolean);
    liens.forEach(function (l) {
      zone.append(el("a", {
        class: "bouton " + (l.plein ? "bouton-plein" : "bouton-contour"), href: l.href, texte: l.texte,
        target: l.plein ? null : "_blank", rel: l.plein ? null : "noopener"
      }));
    });
  }

  /* ---------- Thème clair / sombre ---------- */
  function preparerTheme() {
    const bouton = $("#bouton-theme");
    if (!bouton) return;
    bouton.addEventListener("click", function () {
      const actuel = document.documentElement.getAttribute("data-theme")
        || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const nouveau = actuel === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nouveau);
      try { localStorage.setItem("theme", nouveau); } catch (e) { /* stockage indisponible */ }
    });
  }

  /* ---------- Menu mobile ---------- */
  function preparerMenu() {
    const bouton = $("#bouton-menu");
    const menu = $("#menu");
    if (!bouton || !menu) return;
    function basculer(ouvrir) {
      menu.classList.toggle("ouvert", ouvrir);
      bouton.setAttribute("aria-expanded", String(ouvrir));
      bouton.setAttribute("aria-label", ouvrir ? "Fermer le menu" : "Ouvrir le menu");
    }
    bouton.addEventListener("click", () => basculer(!menu.classList.contains("ouvert")));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => basculer(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") basculer(false); });
  }

  /* ---------- Animations au défilement ---------- */
  function animerAuDefilement() {
    // 1. Apparition des éléments .revele, jauges et compteurs
    const observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        const cible = entree.target;
        cible.classList.add("visible");
        cible.querySelectorAll("[data-niveau]").forEach((b) => { b.style.width = b.dataset.niveau + "%"; });
        cible.querySelectorAll("[data-compteur]").forEach(compter);
        observateur.unobserve(cible);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".revele").forEach((n) => observateur.observe(n));

    // 2. Lien du menu correspondant à la section visible
    const liensMenu = document.querySelectorAll(".menu a");
    const espion = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        liensMenu.forEach((a) => a.classList.toggle("actif", a.getAttribute("href") === "#" + entree.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => espion.observe(s));

    // 3. En-tête, barre de progression et bouton « haut »
    const entete = $(".entete"), progression = $(".progression"), haut = $(".haut");
    function surDefilement() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (entete) entete.classList.toggle("defilee", y > 20 || entete.hasAttribute("data-fixe"));
      if (progression) progression.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      if (haut) haut.classList.toggle("visible", y > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", surDefilement, { passive: true });
    surDefilement();
  }

  // Fait monter un nombre de 0 jusqu'à sa valeur finale
  function compter(noeud) {
    const fin = Number(noeud.dataset.compteur) || 0;
    if (moinsAnimations) { noeud.textContent = fin; return; }
    const duree = 1500, debut = performance.now();
    (function image(t) {
      const avance = Math.min(1, (t - debut) / duree);
      noeud.textContent = Math.round(fin * (1 - Math.pow(1 - avance, 3)));
      if (avance < 1) requestAnimationFrame(image);
    })(debut);
  }

  /* ---------- Fond animé de l'accueil : particules reliées ---------- */
  function particules() {
    const canvas = $("#particules");
    if (!canvas || moinsAnimations) return;
    const ctx = canvas.getContext("2d");
    let points = [], largeur = 0, hauteur = 0, souris = { x: -999, y: -999 };

    function dimensionner() {
      const ratio = window.devicePixelRatio || 1;
      largeur = canvas.offsetWidth; hauteur = canvas.offsetHeight;
      canvas.width = largeur * ratio; canvas.height = hauteur * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Nombre de points proportionnel à la surface de l'écran
      const nombre = Math.min(90, Math.floor((largeur * hauteur) / 14000));
      points = Array.from({ length: nombre }, () => ({
        x: Math.random() * largeur, y: Math.random() * hauteur,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
      }));
    }

    function dessiner() {
      const couleur = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7c5cff";
      ctx.clearRect(0, 0, largeur, hauteur);
      ctx.fillStyle = couleur; ctx.strokeStyle = couleur;
      points.forEach(function (p, i) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > largeur) p.vx *= -1;
        if (p.y < 0 || p.y > hauteur) p.vy *= -1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        // Trait entre deux points proches (et vers la souris)
        for (let j = i + 1; j < points.length; j++) relier(p, points[j], 120);
        relier(p, souris, 160);
      });
      requestAnimationFrame(dessiner);
    }

    function relier(a, b, distanceMax) {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > distanceMax) return;
      ctx.globalAlpha = (1 - d / distanceMax) * 0.35;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    canvas.parentElement.addEventListener("mousemove", function (e) {
      const r = canvas.getBoundingClientRect();
      souris = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    canvas.parentElement.addEventListener("mouseleave", () => { souris = { x: -999, y: -999 }; });
    window.addEventListener("resize", dimensionner);
    dimensionner();
    dessiner();
  }

  /* ---------- Démarrage ---------- */
  remplirTextes();
  construireAPropos();
  construireCompetences();
  construireProjets();
  construireTableauBts();
  construireParcours();
  construireContact();
  preparerFenetre();
  preparerTheme();
  preparerMenu();
  animerAuDefilement();
  machineAEcrire();
  particules();

  // Ouvre directement un projet si l'adresse se termine par #projet-2, par exemple
  const lien = location.hash.match(/^#projet-(\d+)$/);
  if (lien && $("#fenetre-projet") && projets[lien[1] - 1]) ouvrirProjet(projets[lien[1] - 1], lien[1] - 1);
})();
