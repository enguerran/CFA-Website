# Comité des Fêtes d'Auzielle — Contexte de conception

**Objectif :** Transformer le site HTML statique en contenu structuré (Markdown pour les événements, JSON pour les partenaires) + build automatisé, pour simplifier la mise à jour du contenu (photo, texte, titre, lien, HelloAsso).

**Décision architecturale :** Eleventy (11ty) + Markdown/JSON + Vercel auto-deploy.

---

## 🎯 Besoins métier

- **Éditeur** : Enguerran (développeur), quelques fois par an
- **Contenu** : 3 événements (Carnaval, Fête Saint-Jean, Fête Village) + 6 partenaires + config site
- **Champs par événement** : titre, description, image, tagline, lien HelloAsso, texte supplémentaire (optionnel)
- **Contrainte** : Zéro dépendance externe (pas de service cloud)

---

## 🛠️ Stack technique

| Aspect | Choix | Raison |
|--------|-------|--------|
| **SSG** | Eleventy 3.x | Léger, courbe plate, pas de TypeScript obligatoire |
| **Source de données — événements** | Un fichier Markdown par événement (`src/events/*.md`), frontmatter + prose | Édition de la description en Markdown plutôt qu'en chaîne JSON (voir ADR-0001) |
| **Source de données — partenaires** | JSON (`src/_data/partners.json`) | Champs courts, pas de prose longue, un seul fichier suffit |
| **Design/CSS** | Inchangé (réutilisé du vanilla HTML/CSS) | Garder la continuité visuelle |
| **Build** | `npm run dev` (watch) + `npm run build` (prod) | Standard Eleventy |
| **Hosting** | Vercel (auto-deploy sur push) | Zéro config, détecte Eleventy automatiquement |
| **HelloAsso** | Lien direct (Phase 1), iframe optionnel (Phase 2) | Simplifier d'abord, étendre plus tard |

---

## 📋 Terminologie

- **Event** : Événement (carnaval, saint-jean, village), un fichier `src/events/<slug>.md`. Le slug (= URL) vient automatiquement du nom de fichier.
- **Partner** : Partenaire (mairie, sicoval, mjc, etc.), une entrée dans `src/_data/partners.json`.
- **Data file** : JSON dans `src/_data/` qui décrit les partenaires et la config du site.
- **Eleventy global data** : Convention Eleventy qui charge automatiquement les fichiers `src/_data/*.json` et les rend disponibles aux templates (nom de fichier = nom de variable globale).
- **Collection** : Ensemble de pages Eleventy regroupées par tag (ex. `collections.events`, généré depuis les fichiers `src/events/*.md` tagués `events`).
- **Template** : Fichier `.njk` (Nunjucks) qui génère les pages HTML à partir des données.

---

## ✅ Décisions confirmées

1. ❌ ~~Un fichier `src/_data/events.json` pour tous les événements~~ — remplacé par un fichier Markdown par événement, voir ADR-0001
2. ✅ **Un fichier `src/_data/partners.json`** pour tous les partenaires
3. ✅ **Auto-deploy Vercel** : `git push main` → Vercel détecte changement → rebuild auto
4. ✅ **Nunjucks pour les templates** (moteur par défaut Eleventy, facile)
5. ✅ **Garder le CSS/JS actuels** (uniquement refactoriser le HTML)
6. ✅ **Passthrough copy explicite dans `.eleventy.js`, pas de convention `templateFormats`** : les templates référencent des chemins racine (`/style.css`, `/index.js`, `/images/...`) alors que les sources vivent dans `src/assets/`. Ajouter des extensions à `templateFormats` ne fait que copier en préservant l'arborescence d'entrée, ça ne peut pas aplatir `src/assets/style.css` vers `/style.css`. Le passthrough explicite reste donc nécessaire pour ce remapping.
7. ❌ ~~Migrer vers `pnpm`~~ — une seule dépendance réelle (`@11ty/eleventy`), aucun bénéfice de dédoublonnage à cette échelle ; migrer ajouterait de la friction (pnpm à installer, champ `packageManager`/corepack pour Vercel) sans gain mesurable. Décision réversible si le projet grossit significativement.
8. ✅ **`npm ci` comme Install Command Vercel** (réglage dashboard, hors dépôt) : garantit un install reproductible depuis `package-lock.json` versionné plutôt qu'une résolution de plage à chaque build. `pnpm` n'aurait rien changé à ce risque (même registre, mêmes paquets) ; Dependabot est actif sur le dépôt avec 0 alerte ouverte.

---

## 🚀 Phases

### Phase 1 (MVP)
- Eleventy + JSON pour événements et partenaires
- Génération auto des pages (index + sous-pages)
- CSS/JS inchangés
- Vercel auto-deploy

### Phase 2 (Optionnel, futur)
- Intégration iframe HelloAsso (plutôt que lien)
- Refonte design si besoin

---

## 📁 Structure cible

```
/
├── .eleventy.js              # Config Eleventy (collection "events" triée par order)
├── .eleventyignore           # Exclut src/assets/ du traitement de template
├── package.json              # npm (@11ty/eleventy, dépendances)
├── docs/adr/                 # Décisions d'architecture (ADR)
├── src/
│   ├── _data/
│   │   ├── partners.json     # Données partenaires
│   │   └── site.json         # Config globale (nom, url, email, réseaux)
│   ├── events/
│   │   ├── events.json       # Données partagées (tags, layout, permalink)
│   │   ├── carnaval.md       # Un événement = un fichier (frontmatter + Markdown)
│   │   ├── fete-saint-jean.md
│   │   └── fete-village.md
│   ├── _includes/
│   │   ├── layout.njk        # Layout principal
│   │   ├── event.njk         # Layout des pages événement
│   │   └── about-content.md  # Fragment Markdown "À propos"
│   ├── pages/
│   │   └── index.njk         # Page d'accueil
│   └── assets/
│       ├── style.css         # CSS actuel (inchangé)
│       ├── index.js          # JS actuel (inchangé)
│       ├── contact.js        # Handler du formulaire de contact
│       ├── announcement.js   # Bandeau HelloAsso
│       └── images/           # Toutes les images
├── _site/                    # Build output (généré, .gitignore)
└── .gitignore               # Ignorer node_modules/, _site/, .env
```

---

## 🔄 Workflow d'édition

1. Éditer un fichier `src/events/<slug>.md` (un événement) ou `src/_data/partners.json` (partenaires)
2. `npm run build` génère les pages HTML dans `_site/`
3. `git commit` + `git push`
4. Vercel détecte le push, rebuild automatique, déploie

Pour ajouter un nouvel événement : créer `src/events/<slug>.md` avec le frontmatter attendu (`title`, `image`, `tagline`, `helloasso`, `order`) — le slug de l'URL et la page se génèrent automatiquement depuis le nom de fichier.

Ou en local dev :
1. `npm run dev` (mode watch)
2. Éditer les fichiers
3. Actualisateur automatique du navigateur

---

## ⚠️ Non-décisions (gardées pour Phase 2)

- Pas de refonte de design (réutiliser le CSS/JS existant)
- Pas d'intégration iframe HelloAsso (lien direct pour commencer)
- Pas de système d'authentification pour Pages CMS (vous editez le JSON directement)

---

## 📝 Notes importantes

- **Eleventy est très léger** : `npm install @11ty/eleventy` est la seule dépendance réelle.
- **Les JSON sont simples** : pas de complexité TypeScript, juste des clés/valeurs, supportés nativement par Eleventy sans dépendance supplémentaire.
- **Vercel détecte Eleventy** : aucune config nécessaire (il voit `package.json` avec script `build`).
- **Git trace tout** : commit history des changements JSON = audit trail gratuit.
