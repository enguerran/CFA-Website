# Comité des Fêtes d'Auzielle — Contexte de conception

**Objectif :** Transformer le site HTML statique en source de données JSON + build automatisé, pour simplifier la mise à jour du contenu (photo, texte, titre, lien, HelloAsso).

**Décision architecturale :** Eleventy (11ty) + JSON + Vercel auto-deploy.

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
| **Source de données** | JSON (`src/_data/events.json`, `src/_data/partners.json`) | Simple, versionnée en Git, facile à éditer, supportée nativement par Eleventy |
| **Design/CSS** | Inchangé (réutilisé du vanilla HTML/CSS) | Garder la continuité visuelle |
| **Build** | `npm run dev` (watch) + `npm run build` (prod) | Standard Eleventy |
| **Hosting** | Vercel (auto-deploy sur push) | Zéro config, détecte Eleventy automatiquement |
| **HelloAsso** | Lien direct (Phase 1), iframe optionnel (Phase 2) | Simplifier d'abord, étendre plus tard |

---

## 📋 Terminologie

- **Event** : Événement (carnaval, saint-jean, village). ID = slug URL.
- **Partner** : Partenaire (mairie, sicoval, mjc, etc.).
- **Data file** : JSON dans `src/_data/` qui décrit les événements/partenaires.
- **Eleventy global data** : Convention Eleventy qui charge automatiquement les fichiers `src/_data/*.json` et les rend disponibles aux templates (nom de fichier = nom de variable globale).
- **Template** : Fichier `.njk` (Nunjucks) qui génère les pages HTML à partir des données.

---

## ✅ Décisions confirmées

1. ✅ **Un fichier `src/_data/events.json`** pour tous les événements (plus simple qu'un fichier par événement)
2. ✅ **Un fichier `src/_data/partners.json`** pour tous les partenaires
3. ✅ **Auto-deploy Vercel** : `git push main` → Vercel détecte changement → rebuild auto
4. ✅ **Nunjucks pour les templates** (moteur par défaut Eleventy, facile)
5. ✅ **Garder le CSS/JS actuels** (uniquement refactoriser le HTML)

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
├── .eleventy.js              # Config Eleventy
├── package.json              # npm (@11ty/eleventy, dépendances)
├── src/
│   ├── _data/
│   │   ├── events.json       # Données événements
│   │   ├── partners.json     # Données partenaires
│   │   └── site.json         # Config globale (nom, url, email, réseaux)
│   ├── _includes/
│   │   └── layout.njk        # Layout principal
│   ├── pages/
│   │   ├── index.njk         # Page d'accueil
│   │   ├── event.njk         # Template dynamique pour chaque événement
│   │   └── event.11tydata.js # Titre/description calculés (eleventyComputed)
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

1. Éditer `src/_data/events.json` ou `src/_data/partners.json`
2. `npm run build` génère les pages HTML dans `_site/`
3. `git commit` + `git push`
4. Vercel détecte le push, rebuild automatique, déploie

Ou en local dev :
1. `npm run dev` (mode watch)
2. Éditer les JSON
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
