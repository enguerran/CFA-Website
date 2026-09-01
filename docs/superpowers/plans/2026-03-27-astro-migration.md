# Migration Astro + Pages CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le site vanilla HTML/CSS/JS du CFA vers Astro v5 avec Pages CMS pour permettre la mise à jour du contenu sans compétences techniques.

**Architecture:** Le site actuel (4 pages HTML statiques) devient un projet Astro v5 dont les données (événements, partenaires) sont stockées en JSON dans `src/data/`. Pages CMS édite ces fichiers JSON via l'interface GitHub, ce qui déclenche un rebuild automatique sur Vercel. Le CSS, JS et images existants sont conservés tels quels dans `public/`.

**Tech Stack:** Astro v5, TypeScript (minimal), Pages CMS, Vercel (static, sans adapter)

---

## Structure de fichiers cible

```
/
├── astro.config.mjs              # Config Astro (output: static)
├── package.json                  # Dépendances
├── tsconfig.json                 # Config TypeScript (extend astro/tsconfigs/base)
├── .pages.yml                    # Config Pages CMS
├── src/
│   ├── content.config.ts         # Définition des collections Astro
│   ├── data/
│   │   ├── events.json           # 3 événements (éditable via Pages CMS)
│   │   ├── partners.json         # 6 partenaires (éditable via Pages CMS)
│   │   └── site.json             # Config globale (email, réseaux)
│   ├── layouts/
│   │   └── BaseLayout.astro      # <head>, header, nav, scripts
│   └── pages/
│       ├── index.astro           # Page d'accueil (toutes les sections)
│       └── [slug].astro          # Pages dynamiques des événements
└── public/
    ├── style.css                 # CSS existant inchangé
    ├── index.js                  # JS existant inchangé
    ├── events.js                 # JS existant inchangé
    ├── images/                   # Toutes les images existantes
    └── fonts/                    # Polices Satoshi existantes
```

---

## Task 1 : Branche git + init npm

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`

- [ ] **Step 1 : Créer une branche de migration**

```bash
git checkout -b feat/astro-migration
```

- [ ] **Step 2 : Initialiser package.json**

```bash
npm init -y
npm install astro
```

- [ ] **Step 3 : Remplacer les scripts dans package.json**

Ouvrir `package.json` et remplacer la section `scripts` par :

```json
{
  "name": "cfa-website",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0"
  }
}
```

- [ ] **Step 4 : Créer tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/base"
}
```

- [ ] **Step 5 : Créer astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
});
```

> Note : pas d'adapter `@astrojs/vercel` pour du static pur — Vercel détecte Astro automatiquement via `package.json`.

- [ ] **Step 6 : Vérifier qu'Astro s'installe correctement**

```bash
npx astro --version
```

Expected output : `astro v5.x.x`

- [ ] **Step 7 : Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs
git commit -m "chore: init Astro v5 project"
```

---

## Task 2 : Déplacer les assets statiques vers public/

**Files:**
- Modify: structure de répertoires (déplacer, pas copier)

> Le répertoire `public/` d'Astro est servi tel quel, sans traitement. C'est là que vont le CSS, JS et images existants.

- [ ] **Step 1 : Créer la structure public/**

```bash
mkdir -p public/images public/fonts
```

- [ ] **Step 2 : Déplacer les assets**

```bash
cp style.css public/style.css
cp index.js public/index.js
cp events.js public/events.js
cp -r images/ public/images/
cp -r fonts/ public/fonts/
```

> Ne pas supprimer les originaux encore — ils seront retirés à la Task 9 une fois le build validé.

- [ ] **Step 3 : Vérifier les fichiers dans public/**

```bash
ls public/
ls public/images/
```

Expected : `style.css  index.js  events.js  images/  fonts/`
Les images doivent inclure : `carnaval.jpg`, `stjean.jpg`, `fete_vilage.jpg`, `mairie.webp`, `sicoval.webp`, `mjc.webp`, `vival.webp`, `lisa.webp`, `aoc.webp`, `cfa.jpg`, `icon.ico`

- [ ] **Step 4 : Commit**

```bash
git add public/
git commit -m "chore: move static assets to public/"
```

---

## Task 3 : Créer les fichiers de données JSON

**Files:**
- Create: `src/data/events.json`
- Create: `src/data/partners.json`
- Create: `src/data/site.json`

- [ ] **Step 1 : Créer le répertoire src/data/**

```bash
mkdir -p src/data
```

- [ ] **Step 2 : Créer src/data/events.json**

```json
[
  {
    "id": "carnaval",
    "title": "Le Carnaval",
    "image": "carnaval.jpg",
    "description": "Chaque année, le Comité des Fêtes organise le carnaval du village. Au programme : un grand défilé costumé au départ du Cinéma Studio 7, suivi d'animations au Pigeonnier — spectacles, piñata pour les enfants et goûter convivial.",
    "tagline": "Petits et grands, venez déguisés et rejoignez la parade !",
    "helloasso": "https://www.helloasso.com/associations/comite-des-fetes-d-auzielle"
  },
  {
    "id": "fete-saint-jean",
    "title": "Fête de la Saint-Jean",
    "image": "stjean.jpg",
    "description": "Le Comité des Fêtes d'Auzielle célèbre chaque année le solstice d'été au Parc du Pigeonnier. Au programme : apéritif, repas de village, défilé aux lampions, feu de la Saint-Jean et grand bal en plein air.",
    "tagline": "Animation musicale par la Banda Les AOC's.",
    "helloasso": "https://www.helloasso.com/associations/comite-des-fetes-d-auzielle",
    "extra_intro": "Le comité des fêtes d'Auzielle accueille convives et habitants pour célébrer le solstice d'été.",
    "extra_text": "Le solstice d'été est fêté depuis longtemps, originellement en lien avec le culte du soleil. Les feux de solstices ou feux solsticiaux païens étaient au Moyen Âge allumés aux points de croisement des chemins, dans les champs, pour empêcher que les sorcières et magiciennes n'y passent pendant cette nuit ; on y brûlait parfois les herbes cueillies le jour de la Saint-Jean, contre la foudre, le tonnerre, les orages et l'on pensait écarter par ces fumigations les démons et les tempêtes.",
    "extra_image_url": "https://upload.wikimedia.org/wikipedia/commons/9/91/The_Feast_of_Saint_John.jpg",
    "extra_image_alt": "Personnes fêtant la Saint-Jean autour d'un feu"
  },
  {
    "id": "fete-village",
    "title": "La Fête du Village",
    "image": "fete_vilage.jpg",
    "description": "Chaque année en septembre, Auzielle est en fête pendant tout un week-end. Au programme : tournois, animations pour les enfants, concours de pétanque, matinale des associations, apéritifs, repas de village et bal.",
    "tagline": "Un rendez-vous incontournable pour tous les Auziellois !",
    "helloasso": "https://www.helloasso.com/associations/comite-des-fetes-d-auzielle"
  }
]
```

- [ ] **Step 3 : Créer src/data/partners.json**

```json
[
  {
    "id": "mairie",
    "name": "La Mairie d'Auzielle",
    "image": "mairie.webp",
    "description": "Auzielle offre un large éventail d'activités culturelles et sportives. Bien que de taille relativement modeste, les nombreux clubs et associations contribuent au dynamisme de notre village et entretiennent le lien social entre ses habitants. L'encadrement y est assuré par des animateurs professionnels. Si vous souhaitez élargir l'éventail de ces activités, n'hésitez pas à contacter la mairie !",
    "url": "https://www.auzielle.fr"
  },
  {
    "id": "sicoval",
    "name": "Sicoval",
    "image": "sicoval.webp",
    "description": "Le Sicoval est un territoire attractif pour les porteurs de projets et les entreprises déjà implantées. Découvrez des séries de témoignages d'acteurs locaux, qui ont marqué l'actualité par leur savoir-faire et leurs projets de développement. Nous soutenons au quotidien ces pépites qui contribuent à l'essor économique de notre territoire. Aujourd'hui, ils vous partagent leur expérience !",
    "url": "https://www.sicoval.fr"
  },
  {
    "id": "mjc",
    "name": "MJC Auzielle",
    "image": "mjc.webp",
    "description": "Implantée au pôle culturel avec le cinéma Studio 7 et la bibliothèque, la MJC est une association culturelle qui organise des ateliers, animations et manifestations culturelles et ludiques pour tous publics.",
    "url": "https://mjcauzielle.fr"
  },
  {
    "id": "vival",
    "name": "Vival — Chez Niva",
    "image": "vival.webp",
    "description": "Épicerie et traiteur.",
    "url": "https://www.facebook.com/CHEZNIVA/about"
  },
  {
    "id": "lisa",
    "name": "Délices de Lisa",
    "image": "lisa.webp",
    "description": "La biscuiterie, entreprise familiale, installée depuis 2008, fabrique et commercialise une large et sympathique gamme.",
    "url": "https://www.delicesdelisa.fr"
  },
  {
    "id": "aoc",
    "name": "Banda Les AOC's",
    "image": "aoc.webp",
    "description": "« Animation d'Origine Contrôlée » ou AOC est un groupe de musique de rue d'une trentaine de musiciens se produisant dans tout le sud-ouest.",
    "url": "http://aocs.musique.free.fr"
  }
]
```

- [ ] **Step 4 : Créer src/data/site.json**

```json
{
  "name": "Comité des Fêtes d'Auzielle",
  "email": "comitedesfetesdauzielle@gmail.com",
  "facebook": "https://www.facebook.com/CFA31650?locale=fr_FR",
  "instagram": "https://www.instagram.com/comitedauzielle/",
  "tiktok": "https://www.tiktok.com/@comitedauzielle",
  "helloasso": "https://www.helloasso.com/associations/comite-des-fetes-d-auzielle"
}
```

- [ ] **Step 5 : Commit**

```bash
git add src/data/
git commit -m "feat: add JSON data files for events, partners and site config"
```

---

## Task 4 : Créer la content collection config

**Files:**
- Create: `src/content.config.ts`

> En Astro v5, le fichier de config des collections se trouve à `src/content.config.ts` (pas dans `src/content/`). Le loader `file()` lit un fichier JSON unique. Chaque entrée du tableau JSON doit avoir un champ `id`.

- [ ] **Step 1 : Créer src/content.config.ts**

```typescript
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const events = defineCollection({
  loader: file('src/data/events.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    image: z.string(),
    description: z.string(),
    tagline: z.string(),
    helloasso: z.string().url(),
    extra_intro: z.string().optional(),
    extra_text: z.string().optional(),
    extra_image_url: z.string().url().optional(),
    extra_image_alt: z.string().optional(),
  }),
});

const partners = defineCollection({
  loader: file('src/data/partners.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    description: z.string(),
    url: z.string().url(),
  }),
});

export const collections = { events, partners };
```

- [ ] **Step 2 : Vérifier que la config est valide**

```bash
npx astro check
```

Expected : aucune erreur TypeScript.

- [ ] **Step 3 : Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add Astro content collections config for events and partners"
```

---

## Task 5 : Créer BaseLayout.astro

**Files:**
- Create: `src/layouts/BaseLayout.astro`

> BaseLayout contient `<head>`, le header/nav et charge les scripts. Les scripts externes (FontAwesome, EmailJS, FileSaver, ics.js) et les fichiers JS locaux doivent utiliser `is:inline` pour éviter le traitement par le bundler Astro. `<slot />` est le point d'injection du contenu de chaque page.

- [ ] **Step 1 : Créer src/layouts/BaseLayout.astro**

```astro
---
interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Comité des Fêtes d'Auzielle",
  description = "Le comité des fêtes...C'est pour faire la fête !!!",
} = Astro.props;
---
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>

  <meta name="keywords" content="comite, fete, auzielle, cfa, village, association" />
  <meta name="description" content={description} />
  <meta name="robots" content="index" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="/images/icon.ico" />
  <meta property="og:url" content="https://www.comitedesfetesdauzielle.fr" />
  <meta property="og:type" content="website" />

  <link rel="stylesheet" href="/style.css">
  <script is:inline src="https://kit.fontawesome.com/7a0b90407e.js" crossorigin="anonymous"></script>
  <link rel="icon" href="/images/icon.ico" type="image/x-icon">
  <script is:inline src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
  <script is:inline>
    (function () {
      emailjs.init("");
    })();
  </script>
  <script is:inline src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
  <script is:inline src="https://cdn.jsdelivr.net/gh/nwcell/ics.js/ics.min.js"></script>
</head>
<body>
  <header>
    <a href="/" class="title">Comité des Fêtes d'Auzielle</a>
    <ul class="nav_links">
      <li><a href="/">Accueil</a></li>
      <li><a href="/#events">Évènements</a></li>
      <li><a href="/#partners">Nos partenaires</a></li>
      <li><a href="/#about">Qui sommes-nous</a></li>
      <li><a href="/#contact">Nous contacter</a></li>
    </ul>
  </header>

  <div class="header_responsive">
    <a href="/" class="title">Comité des Fêtes d'Auzielle</a>
    <i class="fa-solid fa-bars menu_hamburger"></i>
  </div>

  <slot />

  <script is:inline src="/index.js"></script>
  <script is:inline src="/events.js"></script>
</body>
</html>
```

- [ ] **Step 2 : Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout with head, header and scripts"
```

---

## Task 6 : Créer la page d'accueil index.astro

**Files:**
- Create: `src/pages/index.astro`

> La page d'accueil reproduit fidèlement le `index.html` actuel. Les données événements et partenaires sont chargées depuis les collections. Le formulaire de contact et son script inline (`handleSubmit`, `USER_ID`) sont inclus avec `is:inline`.

- [ ] **Step 1 : Créer src/pages/index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const events = await getCollection('events');
const partners = await getCollection('partners');
---
<BaseLayout>
  <section id="home">
    <h1>Le comité des fêtes...C'est pour faire la fête !!!</h1>

    <div class="btn">
      <a href="#events" class="contactBtn">Nos évènements ! <i class="fa-solid fa-chevron-right"></i></a>
    </div>

    <div class="row">
      <a class="link" href="https://www.facebook.com/CFA31650?locale=fr_FR" target="_blank">
        <i class="fa-brands fa-facebook"></i>
        <p>Comite des Fêtes d'Auzielle</p>
      </a>
      <a class="link" href="https://www.instagram.com/comitedauzielle/" target="_blank">
        <i class="fa-brands fa-instagram"></i>
        <p>@comitedauzielle</p>
      </a>
      <a class="link" href="https://www.tiktok.com/@comitedauzielle" target="_blank">
        <i class="fa-brands fa-tiktok"></i>
        <p>@comitedauzielle</p>
      </a>
      <a class="link" href="mailto:comitedesfetesdauzielle@gmail.com">
        <i class="fa-solid fa-envelope"></i>
        <p>comitedesfetesdauzielle@gmail.com</p>
      </a>
    </div>
  </section>

  <section id="events">
    <div class="custom-shape-divider-bottom-1731860165">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
      </svg>
    </div>

    <div class="events">
      <h1>Quels sont les évènements ?</h1>
      <div class="grid">
        {events.map((event) => (
          <div class="card">
            <div class="image_events" onclick={`openFullImg('/images/${event.data.image}')`}>
              <img src={`/images/${event.data.image}`} alt={`Image ${event.data.title}`}>
              <i class="fa-solid fa-expand"></i>
            </div>
            <div class="column">
              <h2>{event.data.title}</h2>
              <div class="btn">
                <a class="contactBtn" href={`/${event.id}/`}>Découvrir</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div class="custom-shape-divider-top-1731859965">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
        </svg>
      </div>
    </div>
  </section>

  <section id="partners">
    <div class="partners">
      <h1>Nos partenaires !</h1>
      <div class="grid">
        {partners.map((partner) => (
          <div class="card">
            <img src={`/images/${partner.data.image}`} alt={`Image ${partner.data.name}`}>
            <h2>{partner.data.name}</h2>
            <p>{partner.data.description}</p>
            <div class="btn">
              <a href={partner.data.url} target="_blank" class="contactBtn">Voir le site web</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section id="about">
    <div class="about">
      <h1>À propos de nous</h1>
      <h2>2013 : Renaissance du Comité des Fêtes d'Auzielle</h2>
      <div class="row">
        <p>Cette année-là, nous avons eu le plaisir d'officialiser la création du nouveau comité des fêtes
          d'Auzielle (C.F.A.). En effet, le précédent comité avait souhaité se retirer après plus de 40 années de
          bons et loyaux services. Après quelques mois de sommeil, le passage de relais a donc eu lieu le vendredi
          22 février 2013. <br>
          C'est à cette date que plusieurs Auziellois (habitants de longue date, nouveaux arrivants, membres du
          conseil municipal, etc…) se sont rassemblés à la salle des fêtes du village pour élire le nouveau
          bureau, et commencer à préparer comme il se doit les nombreux événements prévus pour cette année. <br>
          2013 a donc été une année charnière, permettant à la nouvelle équipe de prendre ses repères, en prenant
          en compte l'expérience des membres de l'ancien comité, et en proposant de nouvelles idées et activités
          pour réveiller et rassembler le peuple Auziellois, autour de festivités diverses et variées, tout au
          long de l'année.
        </p>
        <img src="/images/cfa.jpg" alt="Image à propos de nous">
      </div>
    </div>

    <div class="nous">
      <div class="star"></div>
      <div class="star2"><i class="fa-solid fa-people-group"></i></div>
      <h2>Le CFA</h2>
      <p>Le CFA a besoin de sang neuf et des idées nouvelles. Nous ne serons jamais trop nombreux pour faire
        fonctionner le comité des fêtes, organiser des manifestations et animations. Toutes les bonnes volontés
        sont les bienvenues.</p>
    </div>
  </section>

  <section id="contact">
    <div class="custom-shape-divider-bottom-1731860165">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
      </svg>
    </div>

    <div class="custom-shape-divider-top-1731859965">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
      </svg>
    </div>

    <div class="contacts">
      <div class="title">
        <h1>Vous souhaitez nous contacter ?</h1>
      </div>
      <div class="rowContact">
        <div class="formulaire">
          <form id="contactForm">
            <div class="row">
              <div class="column">
                <label for="name">Votre nom</label>
                <input type="text" name="name" placeholder="Quel est votre nom ?">
              </div>
              <div class="column">
                <label for="email">Votre email</label>
                <input type="email" name="email" placeholder="Quel est votre email ?">
              </div>
            </div>
            <div class="column">
              <label for="message">Votre message</label>
              <textarea name="message" placeholder="Quel est votre message ?"></textarea>
            </div>
            <div class="row second">
              <div class="btn">
                <button type="submit" class="contactBtn">
                  Envoyer le message <i class="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="columnContact">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2892.112216824981!2d1.5636290768389658!3d43.54170267110767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12ae942e4668d965%3A0xc896674dab003536!2sMairie%20d&#39;Auzielle!5e0!3m2!1sfr!2sfr!4v1707327332174!5m2!1sfr!2sfr"
            width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
          <div class="columnContact2">
            <p>Comité des Fêtes d'Auzielle</p>
            <p>Village</p>
            <p>Auzielle 31650</p>
            <p>France</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class='credit'>
    <a href="https://thdev.vercel.app/" target='_blank'>Made by THDev</a>
  </div>

  <div class="full-img" id="fullImgBox" style="display: none;">
    <img src="" id="fullImg" alt="Full Image">
    <i class="fa-solid fa-xmark" onclick="closeFullImg()"></i>
  </div>

  <script is:inline>
    const USER_ID = '5512K-AZX12fCBtPK';

    const handleSubmit = (e) => {
      e.preventDefault();
      const form = document.getElementById('contactForm');
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      if (!name || !email || !message) {
        alert('Veuillez remplir tous les champs du formulaire.');
        return;
      }

      emailjs.send('service_ajykrdq', 'template_taaikfc', {
        from_name: formData.get('name'),
        to_name: 'CFA',
        from_email: formData.get('email'),
        to_email: '',
        message: formData.get('message')
      }, USER_ID)
        .then(() => {
          alert('Merci pour votre message. Je vous contacte très rapidement.');
        })
        .catch((error) => {
          console.error(error);
          alert("Quelque chose s'est mal passé.");
        });
    };

    const form = document.getElementById('contactForm');
    form.addEventListener('submit', handleSubmit);
  </script>
</BaseLayout>
```

- [ ] **Step 2 : Vérifier la syntaxe Astro**

```bash
npx astro check
```

Expected : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add index page with all sections from vanilla HTML"
```

---

## Task 7 : Créer la page dynamique [slug].astro

**Files:**
- Create: `src/pages/[slug].astro`

> Ce fichier génère une page statique pour chaque événement : `/carnaval/`, `/fete-saint-jean/`, `/fete-village/`. `getStaticPaths()` est obligatoire pour le mode static. Les champs `extra_intro`, `extra_text`, `extra_image_url` sont optionnels et n'apparaissent que pour la Saint-Jean.

- [ ] **Step 1 : Créer src/pages/[slug].astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const events = await getCollection('events');
  return events.map((event) => ({
    params: { slug: event.id },
    props: { event: event.data },
  }));
}

const { event } = Astro.props;
---
<BaseLayout title={`${event.title} — Comité des Fêtes d'Auzielle`} description={event.description}>
  <section id="subpages">
    <div class="head_subpage">
      <i class="fa-solid fa-circle"></i>
      <h1>{event.title}</h1>
    </div>

    <div class="row top">
      <div class="card">
        <div class="column">
          <p>{event.description}</p>
          <p>{event.tagline}</p>
          <p><em>Les informations pour la prochaine édition seront disponibles prochainement.</em></p>
          <div class="btn">
            <a class="contactBtn" href={event.helloasso} target="_blank" rel="noopener noreferrer">HelloAsso</a>
            <a class="contactBtn" href="https://www.facebook.com/CFA31650?locale=fr_FR" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a class="contactBtn" href="mailto:comitedesfetesdauzielle@gmail.com">Nous contacter</a>
          </div>
        </div>
      </div>
    </div>

    {event.extra_intro && (
      <div class="row">
        <p>{event.extra_intro}</p>
        {event.extra_text && <p><em>{event.extra_text}</em></p>}
        {event.extra_image_url && (
          <img src={event.extra_image_url} alt={event.extra_image_alt} />
        )}
      </div>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 2 : Commit**

```bash
git add src/pages/[slug].astro
git commit -m "feat: add dynamic event sub-pages from content collection"
```

---

## Task 8 : Build local de vérification

> Cette étape valide que tout compile avant de toucher au déploiement.

- [ ] **Step 1 : Lancer le build**

```bash
npm run build
```

Expected : `dist/` créé, aucune erreur. Les pages générées doivent inclure :
- `dist/index.html`
- `dist/carnaval/index.html`
- `dist/fete-saint-jean/index.html`
- `dist/fete-village/index.html`

- [ ] **Step 2 : Vérifier les pages générées**

```bash
ls dist/
ls dist/carnaval/
ls dist/fete-saint-jean/
ls dist/fete-village/
```

- [ ] **Step 3 : Prévisualiser localement**

```bash
npm run preview
```

Ouvrir `http://localhost:4321` et vérifier :
- [ ] Page d'accueil s'affiche comme avant
- [ ] Les 3 événements apparaissent dans la grille
- [ ] Cliquer sur "Découvrir" mène à la bonne sous-page
- [ ] Les 6 partenaires s'affichent
- [ ] Le formulaire de contact est présent
- [ ] Les sous-pages (`/carnaval/`, `/fete-saint-jean/`, `/fete-village/`) s'affichent
- [ ] La Saint-Jean affiche bien le texte historique et l'image Wikipedia

---

## Task 9 : Supprimer les anciens fichiers HTML et assets

> Une fois le build validé, les anciens fichiers vanilla peuvent être retirés.

- [ ] **Step 1 : Supprimer les fichiers HTML racine et sous-dossiers**

```bash
rm index.html
rm -rf carnaval/ fete-saint-jean/ fete-village/
```

- [ ] **Step 2 : Supprimer les assets dupliqués (originaux déplacés dans public/)**

```bash
rm style.css index.js events.js
rm -r images/ fonts/
```

- [ ] **Step 3 : Vérifier que le build fonctionne toujours**

```bash
npm run build
```

Expected : même résultat qu'en Task 8.

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "chore: remove vanilla HTML files after Astro migration"
```

---

## Task 10 : Configurer Pages CMS

**Files:**
- Create: `.pages.yml`

> Pages CMS lit `.pages.yml` à la racine du repo GitHub. Il fournit une interface web pour éditer les fichiers JSON de `src/data/`. Chaque `content` entry mappe vers un fichier de données. Les champs `type: rich-text` sont des champs texte enrichi ; utiliser `type: text` pour du texte simple.

- [ ] **Step 1 : Créer .pages.yml**

```yaml
media:
  input: public/images
  output: /images

content:
  - name: events
    label: Événements
    type: file
    path: src/data/events.json
    list: true
    fields:
      - name: id
        label: Identifiant (slug URL)
        type: string
      - name: title
        label: Titre
        type: string
      - name: image
        label: Image (nom du fichier dans /images/)
        type: string
      - name: description
        label: Description principale
        type: text
      - name: tagline
        label: Accroche
        type: string
      - name: helloasso
        label: Lien HelloAsso
        type: string
      - name: extra_intro
        label: Intro supplémentaire (optionnel)
        type: text
        required: false
      - name: extra_text
        label: Texte supplémentaire (optionnel)
        type: text
        required: false
      - name: extra_image_url
        label: URL image supplémentaire (optionnel)
        type: string
        required: false
      - name: extra_image_alt
        label: Alt image supplémentaire (optionnel)
        type: string
        required: false

  - name: partners
    label: Partenaires
    type: file
    path: src/data/partners.json
    list: true
    fields:
      - name: id
        label: Identifiant
        type: string
      - name: name
        label: Nom
        type: string
      - name: image
        label: Image (nom du fichier dans /images/)
        type: string
      - name: description
        label: Description
        type: text
      - name: url
        label: Site web
        type: string
```

- [ ] **Step 2 : Commit**

```bash
git add .pages.yml
git commit -m "feat: add Pages CMS config for events and partners"
```

---

## Task 11 : Déployer et vérifier sur Vercel

> Vercel détecte automatiquement Astro via `package.json`. Il exécute `npm run build` et sert depuis `dist/`. Première fois que Vercel voit un `package.json` dans ce repo : il devra reconfigurer le projet.

- [ ] **Step 1 : Pousser la branche sur GitHub**

```bash
git push origin feat/astro-migration
```

- [ ] **Step 2 : Créer une Pull Request et vérifier le preview Vercel**

Sur GitHub, ouvrir une PR de `feat/astro-migration` vers `main`. Vercel crée automatiquement un preview deployment. Vérifier l'URL preview fournie par Vercel.

- [ ] **Step 3 : Si Vercel ne détecte pas Astro automatiquement**

Dans le dashboard Vercel du projet `cfa-website`, aller dans Settings → General → Framework Preset → sélectionner "Astro". Output Directory : `dist`.

- [ ] **Step 4 : Vérifier les 5 URLs sur le preview**

- [ ] `/` — page d'accueil complète
- [ ] `/carnaval/` — sous-page carnaval
- [ ] `/fete-saint-jean/` — sous-page saint-jean avec texte historique
- [ ] `/fete-village/` — sous-page fête du village
- [ ] Les images s'affichent (CSS, fonts chargés)

- [ ] **Step 5 : Merger la PR sur main**

Une fois le preview validé, merger la PR. Vercel rebuilde automatiquement la production.

- [ ] **Step 6 : Vérifier la production**

Ouvrir `https://www.comitedesfetesdauzielle.fr` et confirmer que le site est identique à l'ancien.

---

## Task 12 : Connecter Pages CMS au repo

> Pages CMS fonctionne via `https://app.pagescms.org`. Il se connecte au repo GitHub via OAuth et lit `.pages.yml`.

- [ ] **Step 1 : Aller sur https://app.pagescms.org et se connecter avec GitHub**

- [ ] **Step 2 : Sélectionner le repo `enguerran/CFA-Website`**

- [ ] **Step 3 : Vérifier que les collections "Événements" et "Partenaires" apparaissent**

- [ ] **Step 4 : Tester une modification (ex: changer la tagline du carnaval)**

Modifier un champ → sauvegarder → vérifier que Pages CMS crée un commit sur `main` → vérifier que Vercel rebuilde.

- [ ] **Step 5 : Partager l'accès à l'équipe CFA**

Donner l'accès au repo GitHub aux membres CFA qui utiliseront Pages CMS (Settings → Collaborators sur GitHub).

---

## Notes importantes

**`is:inline` obligatoire** : Astro traite les `<script>` comme des modules ES par défaut. Les scripts tiers (EmailJS, FileSaver, ics.js) et les scripts vanilla existants (`index.js`, `events.js`) doivent tous utiliser `is:inline` pour être servis sans traitement.

**`onclick` dans les templates Astro** : Astro compile les templates côté serveur. Les attributs `onclick` inline avec des chaînes de caractères fonctionnent car ils ne sont pas interceptés par Astro (contrairement aux event handlers dans les frameworks comme React/Vue). La fonction `openFullImg` définie dans `public/index.js` est disponible globalement.

**Ordre d'affichage des événements** : L'ordre dans `events.json` est l'ordre d'affichage sur la page d'accueil. Pages CMS permet de réordonner les entrées.

**Vercel et `dist/`** : Après migration, Vercel ne sert plus depuis la racine du repo mais depuis `dist/`. C'est géré automatiquement par la détection Astro.
