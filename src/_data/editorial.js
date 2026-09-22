const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

// Miroir de la config Markdown par défaut d'Eleventy (voir
// node_modules/@11ty/eleventy/src/Engines/Markdown.js : markdownIt({ html:
// true }).disable("code")), pour que ces fragments rendent exactement comme
// les autres pages Markdown du site (ex. src/events/*.md).
const md = new MarkdownIt({ html: true }).disable("code");

// Fragments de contenu éditorial de la page d'accueil (titre + prose),
// colocalisés dans un seul fichier Markdown par section — front matter pour
// les champs structurés, corps Markdown pour la prose, même schéma que
// src/events/*.md (voir ADR-0001). {% renderFile %} ne convient pas ici car
// il ne parse pas le front matter des fichiers qu'il rend — voir ADR-0004
// pour le détail du raisonnement, dont le compromis sur about-content.md
// (son sous-titre est un texte en dur, plus templaté sur site.name).
function readFragment(filename) {
  const filePath = path.join(__dirname, "..", "_includes", filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    ...data,
    body: md.render(content),
  };
}

module.exports = {
  about: readFragment("about-content.md"),
  nous: readFragment("nous-content.md"),
};
