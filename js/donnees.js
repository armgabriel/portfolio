/* =====================================================================
   DONNÉES DU PORTFOLIO : LE SEUL FICHIER À MODIFIER
   ---------------------------------------------------------------------
   Tout le contenu personnel du site se trouve ici : identité, textes,
   compétences, projets, parcours et liens. Remplacez les valeurs
   d'exemple par les vôtres, enregistrez, et rechargez la page.

   Règles simples à respecter :
   - le texte se met entre guillemets "..." ;
   - chaque élément d'une liste est séparé par une virgule ;
   - pour mettre un guillemet dans un texte, écrivez \" ;
   - laissez "" (vide) pour masquer un lien ou une information.
   ===================================================================== */

const PORTFOLIO = {

  /* ---------- Identité ---------- */
  identite: {
    prenom: "Gabriel",
    nom: "Armantier",
    // Les phrases qui défilent sous le nom, avec l'effet « machine à écrire »
    titres: [
      "Étudiant en BTS SIO SISR",
      "Futur administrateur systèmes et réseaux",
      "Passionné de cybersécurité"
    ],
    // Courte phrase d'accroche affichée en haut de page
    accroche: "Étudiant en BTS SIO, 1re année. Mes réalisations professionnelles, au fil de la formation.",
    // Photo de profil : chemin vers une image du dossier images (laisser "" pour afficher les initiales)
    photo: "",
    // Lien vers un CV en PDF déposé dans le dossier images (laisser "" pour masquer le bouton)
    cv: "",
    localisation: "France",
    // Couleur principale du site (code hexadécimal, ex. "#7c5cff", "#0a9396", "#e85d04")
    couleur: "#969696"
  },

  /* ---------- Section « À propos » ---------- */
  aPropos: {
    // Chaque texte de la liste devient un paragraphe
    paragraphes: [
      "Élève de première année en BTS SIO, option SISR (solutions d'infrastructure, systèmes et réseaux).",
      "J'aime comprendre comment les machines communiquent, monter des maquettes de réseau et automatiser les tâches répétitives. Je recherche un stage pour mettre ces compétences en pratique."
    ],
    // Chiffres clés animés (le compteur monte jusqu'à la valeur)
    chiffres: [
      { valeur: 2, libelle: "projets réalisés" },
      { valeur: 120, libelle: "heures de TP" },
      { valeur: 1, libelle: "stage visé" }
    ]
  },

  /* ---------- Compétences techniques ----------
     niveau : de 0 à 100, affiché sous forme de barre animée */
  competences: [
    {
      categorie: "Systèmes",
      elements: [
        { nom: "Windows Server", niveau: 60 },
        { nom: "Linux (Debian)", niveau: 55 },
        { nom: "Virtualisation", niveau: 50 }
      ]
    },
    {
      categorie: "Réseaux",
      elements: [
        { nom: "TCP/IP, VLAN", niveau: 60 },
        { nom: "Cisco Packet Tracer", niveau: 65 },
        { nom: "Wireshark", niveau: 45 }
      ]
    },
    {
      categorie: "Développement web",
      elements: [
        { nom: "HTML / CSS", niveau: 70 },
        { nom: "JavaScript", niveau: 40 },
        { nom: "Git / GitHub", niveau: 50 }
      ]
    }
  ],

  /* ---------- Compétences du bloc 1 (référentiel BTS SIO) ----------
     Dans un projet, on les cite par leur code : blocs: ["c2", "c5"].
     Le tableau de la section « Compétences BTS » se remplit tout seul. */
  blocs: [
    { code: "c1", libelle: "Gérer le patrimoine informatique" },
    { code: "c2", libelle: "Répondre aux incidents et aux demandes d'assistance et d'évolution" },
    { code: "c3", libelle: "Développer la présence en ligne de l'organisation" },
    { code: "c4", libelle: "Travailler en mode projet" },
    { code: "c5", libelle: "Mettre à disposition des utilisateurs un service informatique" },
    { code: "c6", libelle: "Organiser son développement professionnel" }
  ],

  /* ---------- Projets ----------
     Pour ajouter un projet : copiez un bloc { ... } entier, collez-le
     après le dernier (avec une virgule entre les deux) et modifiez-le.
     - date : au format "AAAA-MM" (sert au tri, le plus récent en premier)
     - categorie : sert aux boutons de filtre (ex. "Réseau", "Système", "Web")
     - image : chemin vers une capture du dossier images (ou "")
     - lien / code : adresse du site ou du dépôt (ou "")
     - sections : le détail affiché en cliquant sur la carte. Le contenu
       peut être un texte, ou une liste ["étape 1", "étape 2"]. */
  projets: [
    {
      titre: "Mise en ligne de mon portfolio professionnel",
      date: "2026-10",
      cadre: "Atelier de professionnalisation",
      categorie: "Web",
      resume: "Création et publication d'un site personnel gratuit, hébergé sur GitHub Pages, qui présente mes réalisations.",
      image: "images/exemple.png",
      technologies: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
      blocs: ["c3", "c6"],
      lien: "",
      code: "https://github.com/armgabriel/portfolio",
      sections: [
        { titre: "Contexte", contenu: "Pour l'épreuve E5 et pour ma recherche de stage, j'ai besoin d'une adresse unique qui présente mes réalisations et que je complète au fil de l'année." },
        { titre: "Conditions et moyens", contenu: "Seul, en salle de formation. Un compte GitHub gratuit et le navigateur. Aucun logiciel payant." },
        { titre: "Description de l'activité", contenu: [
          "Création du dépôt sur GitHub.",
          "Personnalisation du fichier js/donnees.js.",
          "Activation de GitHub Pages sur la branche main.",
          "Rédaction des mentions légales : éditeur, hébergeur, absence de collecte de données.",
          "Vérification sur ordinateur et sur téléphone, puis contrôle de l'accessibilité."
        ] },
        { titre: "Productions et preuves", contenu: ["L'adresse publique du site.", "Le dépôt et son historique des modifications.", "Le score d'accessibilité relevé."] },
        { titre: "Ce que j'en retiens", contenu: "Remplacez cette phrase par une difficulté rencontrée et la façon dont vous l'avez réglée." }
      ]
    },
    {
      titre: "Sauvegarde d'un portail",
      date: "2026-09",
      cadre: "Atelier de professionnalisation",
      categorie: "Système",
      resume: "Mise en place d'une sauvegarde automatique et vérification de la restauration.",
      image: "images/capybara.jpg",
      technologies: ["Linux", "rsync", "cron"],
      blocs: ["c2"],
      lien: "",
      code: "",
      sections: [
        { titre: "Contexte", contenu: "Qui a demandé quoi, dans quelle organisation, et pourquoi c'était nécessaire." },
        { titre: "Conditions et moyens", contenu: "Le matériel, les logiciels, seul ou en équipe." },
        { titre: "Description de l'activité", contenu: ["Première étape, avec la commande ou le réglage réellement employé.", "Deuxième étape."] },
        { titre: "Ce que j'en retiens", contenu: "Une difficulté rencontrée et la façon dont vous l'avez réglée." }
      ]
    },
    {
      titre: "Maquette réseau d'une PME",
      date: "2026-06",
      cadre: "Projet de classe",
      categorie: "Réseau",
      resume: "Conception d'un réseau segmenté en VLAN avec routage inter-VLAN et serveur DHCP.",
      image: "",
      technologies: ["Cisco Packet Tracer", "VLAN", "DHCP"],
      blocs: ["c1", "c4", "c5"],
      lien: "",
      code: "",
      sections: [
        { titre: "Contexte", contenu: "Exemple de projet : remplacez ou supprimez ce bloc." },
        { titre: "Description de l'activité", contenu: ["Plan d'adressage IP.", "Création des VLAN sur le commutateur.", "Configuration du routeur et du DHCP.", "Tests de connectivité."] }
      ]
    }
  ],

  /* ---------- Parcours (formation et expériences) ----------
     Du plus récent au plus ancien. */
  parcours: [
    { periode: "2026 - 2028", titre: "BTS SIO, option SISR", lieu: "Nom du lycée, Ville", description: "Administration des systèmes et des réseaux, cybersécurité, support utilisateur." },
    { periode: "Été 2026", titre: "Job d'été", lieu: "Entreprise, Ville", description: "Décrivez en une phrase ce que vous avez appris." },
    { periode: "2026", titre: "Baccalauréat", lieu: "Nom du lycée, Ville", description: "Spécialité, mention éventuelle." }
  ],

  /* ---------- Contact et réseaux ----------
     Laissez "" pour masquer un lien. */
  contact: {
    message: "Une proposition de stage, une question sur un projet ? Écrivez-moi, je réponds rapidement.",
    email: "prenom.nom@ecole.fr",
    github: "https://github.com/armgabriel",
    linkedin: "",
    autre: { libelle: "", url: "" }
  }
};
