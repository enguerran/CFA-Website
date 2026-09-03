# Spécification — Eleventy + JSON Migration

**Status:** MVP réalisé. Architecture des événements mise à jour depuis — voir `docs/adr/0001-events-as-markdown-files.md` et `CONTEXT.md` pour l'état actuel (événements en fichiers Markdown, partenaires seuls encore en JSON). Ce document garde son intérêt historique pour le reste de la migration (Eleventy, Nunjucks, Vercel, CSS/JS inchangés).  
**Target:** Transformer le site HTML statique en SSG Eleventy avec données structurées

---

## Problem Statement

Le site du Comité des Fêtes d'Auzielle est actuellement un ensemble de fichiers HTML statiques codés en dur. Chaque mise à jour de contenu (nouvel événement, modifications de texte, images) requiert de dupliquer du HTML et de modifier manuellement les fichiers. Cela est répétitif, source d'erreurs, et peu maintenable.

**Besoin :** Séparer les données (texte, images, titres) du balisage HTML, pour permettre une édition simple du contenu sans toucher au code. Le workflow doit rester ultra-simple (édition de fichiers JSON, build automatique, déploiement sur Vercel).

---

## Solution

Migrer le site vers **Eleventy (11ty)** avec données structurées en **JSON** :

1. **Données centralisées** : événements en Markdown (`src/events/*.md`), partenaires en JSON (`src/_data/partners.json`)
2. **Templates dynamiques** : `src/pages/index.njk` itère sur les données ; `src/_includes/event.njk` sert de layout à chaque fichier `src/events/*.md`
3. **Génération statique** : `npm run build` génère les pages HTML dans `_site/`
4. **Design inchangé** : CSS/JS réutilisés tels quels, zéro changement visuel
5. **Auto-deploy Vercel** : `git push` → Vercel rebuild → live

**Architecture :**
```
Source de données (JSON) 
    ↓
Eleventy (templating Nunjucks)
    ↓
Pages HTML statiques (dist)
    ↓
Vercel (auto-deploy)
```

---

## User Stories

1. **En tant qu'éditeur**, je veux modifier le titre d'un événement dans son fichier `src/events/<slug>.md`, afin que le changement soit reflété sur le site après `npm run build`.

2. **En tant qu'éditeur**, je veux ajouter un nouvel événement en créant `src/events/<slug>.md` et une image dans `images/`, afin que la nouvelle page soit générée automatiquement (ex. `/new-event/`).

3. **En tant qu'éditeur**, je veux modifier la description d'un événement sur plusieurs lignes en JSON, afin que le formatage soit préservé en HTML.

4. **En tant qu'éditeur**, je veux que chaque événement ait une image associée, un titre, une description principale, une tagline et un lien HelloAsso, afin que les informations s'affichent correctement sur la page de l'événement et dans la grille d'accueil.

5. **En tant qu'éditeur**, je veux que la Saint-Jean affiche du contenu supplémentaire (intro, texte historique, image externe), afin que certains événements puissent avoir plus de détails que d'autres.

6. **En tant qu'éditeur**, je veux modifier les partenaires (nom, description, image, URL) dans `src/_data/partners.json`, afin que les changements apparaissent sur la page d'accueil.

7. **En tant qu'éditeur**, je veux que la page d'accueil soit générée automatiquement à partir des données JSON, afin qu'elle affiche toujours les 3 événements et 6 partenaires sans duplication de code.

8. **En tant que développeur**, je veux configurer Eleventy une fois avec `.eleventy.js`, afin que le build soit reproducible et maintenable.

9. **En tant que développeur**, je veux que `npm run dev` lance un serveur local en mode watch, afin que je puisse tester les changements instantanément.

10. **En tant que développeur**, je veux que `npm run build` génère un répertoire `_site/` complet et prêt à être déployé sur Vercel.

11. **En tant que déploiement**, je veux que Vercel détecte automatiquement Eleventy et lance `npm run build`, afin qu'aucune configuration de déploiement ne soit nécessaire.

12. **En tant qu'éditeur**, je veux que chaque événement ait une URL slug unique (ex. `/carnaval/`, `/fete-saint-jean/`), afin que les pages soient accessibles directement et partageables.

13. **En tant qu'éditeur**, je veux que les sous-pages d'événements réutilisent le même layout que la page d'accueil (header, nav, footer), afin qu'il n'y ait pas de duplication.

14. **En tant qu'éditeur**, je veux que la section "Qui sommes-nous" et "Nous contacter" (formulaire, carte) restent inchangées sur la page d'accueil, afin que le contenu statique soit préservé.

15. **En tant que système**, je veux que les images résident dans `src/assets/images/` et soient copiées automatiquement vers le build, afin que les références JSON pointent vers des chemins simples (ex. `carnaval.jpg`).

16. **En tant qu'éditeur**, je veux que les fichiers JSON soient versionned dans Git, afin que l'historique des changements soit traçable.

17. **En tant que système**, je veux que les fichiers CSS, JS et polices existants soient copiés dans le build sans modification, afin que le design reste 100% identique.

18. **En tant qu'éditeur**, je veux que les liens HelloAsso pointent vers l'URL correcte depuis la donnée JSON, afin qu'une modification unique dans le JSON mette à jour tous les liens.

19. **En tant qu'éditeur**, je veux éditer les données directement en Git (pas de CMS cloud), afin que la solution soit 100% autonome et sans dépendance externe.

20. **En tant qu'éditeur**, je veux une structure claire des JSON (schéma évident, clés prévisibles), afin que je puisse ajouter de nouveaux événements sans relire la doc.

---

## Implementation Decisions

### 1. **Eleventy comme SSG**
- **Décision :** Utiliser Eleventy v3.x au lieu d'Astro, Gatsby, ou script Node custom.
- **Raison :** Eleventy est très léger (une seule dépendance, pas de JavaScript frontend obligatoire), courbe d'apprentissage très plate, parfait pour un site statique simple. Zéro complexité ajoutée (pas de TypeScript obligatoire, pas de configuration réseau, pas de CMS cloud).
- **Alternative écartée :** Astro (trop lourd pour ce cas), Pages CMS (dépendance externe).

### 2. **Markdown pour les événements, JSON pour le reste**
- **Décision (mise à jour, voir ADR-0001) :** Un fichier Markdown par événement dans `src/events/`, plutôt qu'un tableau JSON unique. Partenaires et config site restent en JSON.
- **Raison :** La description d'un événement est de la prose éditable ; Markdown s'y prête mieux qu'une chaîne JSON avec `\n` échappés. Un fichier par événement colle aussi au modèle "1 fichier = 1 page" d'Eleventy.
- **Structure :**
  - `src/events/<slug>.md` : un événement par fichier — frontmatter (`title`, `image`, `tagline`, `helloasso`, `order`, `extra_*` optionnels) + corps Markdown pour la description.
  - `src/events/events.json` : données de répertoire partagées (`tags`, `layout`, `permalink`).
  - `src/_data/partners.json` : tableau de partenaires, chaque partenaire a `id`, `name`, `image`, `description`, `url`.
  - `src/_data/site.json` : config globale (`name`, `url`, `email`, réseaux sociaux, etc.).

### 3. **Layout d'événement + collection Eleventy**
- **Décision :** Créer `src/pages/index.njk` (page d'accueil) et `src/_includes/event.njk` (layout des pages événement, appliqué à chaque fichier `src/events/*.md`).
- **Raison :** La page d'accueil affiche tous les événements et partenaires ; le layout événement affiche les détails d'un événement. Chaque fichier Markdown déclare `layout: event.njk` (via les données de répertoire) et Eleventy applique ce layout au rendu du fichier.
- **Eleventy config :** `eleventyConfig.addCollection("events", ...)` construit `collections.events` à partir du tag `events`, trié sur le champ `order` de chaque fichier. L'URL de chaque page vient de `permalink: "/{{ page.fileSlug }}/index.html"` (slug dérivé du nom de fichier) — `index.njk` lit `eventPage.url` directement, aucune duplication du schéma d'URL.

### 4. **Layout principal unique**
- **Décision :** Un seul `src/_includes/layout.njk` pour toutes les pages (header, nav, footer, scripts).
- **Raison :** Éviter la duplication, centraliser les changements de header/footer, maintenir la cohérence.
- **Structure :** Layout définit `<head>`, `<body>`, inclut les scripts globaux (`index.js`, `contact.js`, `announcement.js`), et expose `{{ content | safe }}` pour le contenu spécifique (convention Eleventy layout, pas de `{% block %}`).

### 5. **CSS/JS inchangés**
- **Décision :** Copier `style.css`, `index.js`, `contact.js`, `announcement.js` tels quels dans `src/assets/` → `_site/`.
- **Raison :** Zéro changement visuel, design préservé 100%, aucune refonte.
- **Implementation :** Eleventy copy files passthrough (`.eleventy.js` configure le copy).

### 6. **Images locales**
- **Décision :** Images résident dans `src/assets/images/`, copiées dans le build.
- **Raison :** Assets statiques gérées en local, versionned en Git, références simples en JSON (`carnaval.jpg`).

### 7. **Vercel auto-deploy**
- **Décision :** `package.json` inclut script `build`, Vercel le détecte et recrée automatiquement.
- **Raison :** Zéro configuration, Vercel détecte `npm run build` automatiquement. Push → Vercel rebuild → live.
- **Alternative écartée :** Vercel Env Secrets, branches protégées, etc. (pas nécessaire pour ce besoin).

### 8. **Nunjucks comme moteur de templating**
- **Décision :** Utiliser Nunjucks (moteur par défaut d'Eleventy) plutôt que Liquid, EJS, ou Handlebars.
- **Raison :** Nunjucks est puissant, syntaxe claire, loops et conditions simples, idéal pour itérer sur les données JSON.
- **Syntaxe :**
  ```nunjucks
  {% for event in events %}
    <div>{{ event.title }}</div>
  {% endfor %}
  ```

### 9. **URLs des événements**
- **Décision :** Utiliser le slug de l'événement pour générer l'URL (ex. `id: carnaval` → `/carnaval/`).
- **Raison :** URLs propres et mémorisables, basées sur les données.
- **Implémentation :** `event.njk` avec `permalink: "/{{ event.id }}/index.html"` dans le frontmatter, résolu par pagination Eleventy.

### 10. **Pas de CMS cloud**
- **Décision :** Éditeurs modifient les fichiers JSON directement en Git (ou via un éditeur local).
- **Raison :** Zéro dépendance externe, autonomie complète, historique en Git.
- **Alternative écartée :** Pages CMS, Decap CMS, ou autre service cloud (dépendances externes).

### 11. **Élément optionnel pour la Saint-Jean**
- **Décision :** Ajouter champs optionnels `extra_intro`, `extra_text`, `extra_image_url`, `extra_image_alt` pour que certains événements puissent avoir du contenu supplémentaire.
- **Raison :** La Saint-Jean a du texte historique et une image Wikimedia que les autres événements n'ont pas ; les champs optionnels permettent cette flexibilité sans surcharger les événements simples.
- **Implémentation :** Template Nunjucks : `{% if event.extra_intro %} ... {% endif %}`.

### 12. **Répertoire de build `_site/`**
- **Décision :** Eleventy génère le build dans `_site/`, standard Eleventy.
- **Raison :** Convention Eleventy, `_site/` est ignoré par `.gitignore`, pas d'artefacts en Git.
- **Vercel :** Vercel sert depuis `_site/` automatiquement si un `.eleventy.js` est détecté.

---

## Testing Decisions

### **What makes a good test**
- Tester le comportement externe (pages générées, structure HTML) plutôt que les détails d'implémentation (variables Eleventy).
- Valider que les pages générées contiennent le bon contenu depuis les données JSON.
- Vérifier que les URLs sont correctes et accessibles.

### **Modules à tester**
1. **Configuration Eleventy (`.eleventy.js`)** : Vérifier que le build génère `_site/` avec la structure correcte.
2. **Templates (`index.njk`, `event.njk`)** : Vérifier que les données JSON sont interpolées correctement en HTML.
3. **Données globales** : Vérifier que les fichiers JSON de `src/_data/` sont lus et disponibles dans les templates.
4. **Assets (CSS, JS, images)** : Vérifier que les fichiers statiques sont copiés dans `_site/`.

### **Prior art / Inspiration**
- Tests Eleventy standard : vérifier le contenu des fichiers générés dans `_site/` après `npm run build`.
- Snapshot testing : Comparer la sortie HTML générée contre un snapshot de référence (optionnel, Phase 2).
- E2E (Puppeteer, Playwright) : Lancer le navigateur sur `_site/` servi localement, vérifier les pages (optionnel, Phase 2).

### **Phase 1 (MVP — aujourd'hui)**
- ✅ Build Eleventy sans erreurs
- ✅ Vérifier que `_site/index.html` existe et contient les 3 événements
- ✅ Vérifier que `_site/carnaval/index.html`, `_site/fete-saint-jean/index.html`, `_site/fete-village/index.html` existent
- ✅ Vérifier que les images sont dans `_site/images/`
- ✅ Vérifier que le CSS et JS sont dans `_site/`
- ✅ Test manuel : `npm run dev` → navigateur → vérifier visuellement que le site est identique à l'ancien

### **Phase 2 (Futur — optionnel)**
- Snapshot tests : comparer `_site/index.html` contre snapshot de référence
- E2E : vérifier que les formulaires, animations, etc. fonctionnent

---

## Out of Scope

- **Refonte de design** : Le CSS, layout, et JS restent 100% inchangés. Pas de modernisation visuelle.
- **Intégration iframe HelloAsso** : Phase 2 seulement. Phase 1 = lien simple vers HelloAsso.
- **Authentification / CMS user-friendly** : Non-techniciens n'éditent pas directement ; l'éditeur (vous) modifie le JSON en Git.
- **Multilinguisme** : Site reste en français, pas de système de traduction.
- **Performance tuning** : Pas d'optimisation d'images, compressage, CDN, etc. (Vercel gère déjà).
- **Tests automatisés complètes** : Phase 1 = tests manuels. Snapshot tests en Phase 2 si pertinent.
- **Système de commentaires / modération** : Hors scope.
- **SEO avancée** : Métadonnées basiques suffisent (déjà en place).

---

## Further Notes

### **Schéma des événements — Structure exacte (voir ADR-0001)**

Un fichier Markdown par événement dans `src/events/`, nommé `<slug>.md` (le slug devient l'URL, ex. `carnaval.md` → `/carnaval/`). Frontmatter pour les champs structurés, corps Markdown pour la description.

#### `src/events/carnaval.md`
```markdown
---
title: Le Carnaval
image: carnaval.jpg
tagline: Petits et grands, venez déguisés et rejoignez la parade !
helloasso: https://www.helloasso.com/associations/comite-des-fetes-d-auzielle
order: 1
---

Chaque année, le Comité des Fêtes organise le carnaval du village. Au programme : un grand défilé costumé au départ du Cinéma Studio 7, suivi d'animations au Pigeonnier — spectacles, piñata pour les enfants et goûter convivial.
```

#### `src/events/fete-saint-jean.md`
```markdown
---
title: Fête de la Saint-Jean
image: stjean.jpg
tagline: Animation musicale par la Banda Les AOC's.
helloasso: https://www.helloasso.com/associations/comite-des-fetes-d-auzielle
extra_intro: Le comité des fêtes d'Auzielle accueille convives et habitants pour célébrer le solstice d'été.
extra_text: >-
  Le solstice d'été est fêté depuis longtemps, originellement en lien avec le
  culte du soleil. Les feux de solstices ou feux solsticiaux païens étaient
  au Moyen Âge allumés aux points de croisement des chemins, dans les champs,
  pour empêcher que les sorcières et magiciennes n'y passent pendant cette
  nuit ; on y brûlait parfois les herbes cueillies le jour de la Saint-Jean,
  contre la foudre, le tonnerre, les orages et l'on pensait écarter par ces
  fumigations les démons et les tempêtes.
extra_image_url: https://upload.wikimedia.org/wikipedia/commons/9/91/The_Feast_of_Saint_John.jpg
extra_image_alt: Personnes fêtant la Saint-Jean autour d'un feu
order: 2
---

Le Comité des Fêtes d'Auzielle célèbre chaque année le solstice d'été au Parc du Pigeonnier. Au programme : apéritif, repas de village, défilé aux lampions, feu de la Saint-Jean et grand bal en plein air.
```

#### `src/events/fete-village.md`
```markdown
---
title: La Fête du Village
image: fete_vilage.jpg
tagline: Un rendez-vous incontournable pour tous les Auziellois !
helloasso: https://www.helloasso.com/associations/comite-des-fetes-d-auzielle
order: 3
---

Chaque année en septembre, Auzielle est en fête pendant tout un week-end. Au programme : tournois, animations pour les enfants, concours de pétanque, matinale des associations, apéritifs, repas de village et bal.
```

#### `src/events/events.json` (données partagées du répertoire)
```json
{
  "tags": "events",
  "layout": "event.njk",
  "permalink": "/{{ page.fileSlug }}/index.html"
}
```

#### `src/_data/partners.json`
```json
[
  {
    "id": "mairie",
    "name": "La Mairie d'Auzielle",
    "image": "mairie.webp",
    "description": "Auzielle offre un large éventail d'activités culturelles et sportives...",
    "url": "https://www.auzielle.fr"
  },
  {
    "id": "sicoval",
    "name": "Sicoval",
    "image": "sicoval.webp",
    "description": "Le Sicoval est un territoire attractif pour les porteurs de projets...",
    "url": "https://www.sicoval.fr"
  }
]
```
*(4 autres partenaires suivent le même schéma : `mjc`, `vival`, `lisa`, `aoc`)*

#### `src/_data/site.json`
```json
{
  "name": "Comité des Fêtes d'Auzielle",
  "url": "https://www.comitedesfetesdauzielle.fr",
  "email": "comitedesfetesdauzielle@gmail.com",
  "facebook": "https://www.facebook.com/CFA31650?locale=fr_FR",
  "instagram": "https://www.instagram.com/comitedauzielle/",
  "tiktok": "https://www.tiktok.com/@comitedauzielle",
  "helloasso": "https://www.helloasso.com/associations/comite-des-fetes-d-auzielle"
}
```

### **Seams de test**

Le plus haut niveau de test (et le plus utile) est de vérifier que le **build Eleventy génère les fichiers HTML corrects** avec le contenu issu des données JSON.

**Seam principal :**
1. `npm run build`
2. Vérifier que `_site/index.html` contient `<h2>Le Carnaval</h2>`, `<h2>Fête de la Saint-Jean</h2>`, etc.
3. Vérifier que `_site/carnaval/index.html` affiche la description du carnaval.
4. Vérifier que `_site/fete-saint-jean/index.html` affiche le texte historique (contenu extra).

Ce seam valide :
- La lecture correcte des données JSON
- L'interpolation des données dans les templates
- La génération correcte des URLs
- La structure HTML

### **Workflow d'implémentation**

1. **Init Eleventy** : `npm init -y`, `npm install @11ty/eleventy`, configurer `.eleventy.js`
2. **Créer structure** : Répertoires `src/pages/`, `src/_includes/`, `src/_data/`, `src/assets/`
3. **Extraire données** : Transformer le contenu HTML existant en Markdown (`src/events/*.md`) et JSON (`src/_data/partners.json`)
4. **Créer templates** : `layout.njk`, `index.njk`, `event.njk`
5. **Configurer assets** : Copy CSS, JS, images via `.eleventy.js`
6. **Tester localement** : `npm run dev`, vérifier visuellement
7. **Valider build** : `npm run build`, vérifier `_site/`
8. **Commit & Push** : Git commit de la structure Eleventy
9. **Vérifier Vercel** : Vercel détecte et deploie automatiquement

---

## Checklist de validation MVP

- [x] `npm run build` génère sans erreurs
- [x] `_site/index.html` contient tous les événements et partenaires
- [x] `_site/carnaval/`, `_site/fete-saint-jean/`, `_site/fete-village/` existent
- [x] Les images s'affichent (CSS et images copiés correctement)
- [x] `npm run dev` fonctionne et live-reload marche
- [x] Vercel rebuilde automatiquement après `git push`
- [ ] Site en production est visuellement identique à l'ancien
- [x] Éditer un fichier `src/events/<slug>.md` et relancer le build change le site
