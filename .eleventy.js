module.exports = function (eleventyConfig) {
  // Copy static assets to the site root (templates and the CSS files
  // reference them as root-relative paths: /base.css, /index.js,
  // /announcement.js, /images/..., and the CSS files themselves use
  // relative "fonts/..." urls, hence copying each CSS file to the root
  // rather than into a subfolder).
  // style.css was split into 10 files (see docs/adr/0003-css-split.md):
  // loaded in this exact order in layout.njk, matching the original
  // file's cascade order.
  eleventyConfig.addPassthroughCopy({ "src/assets/base.css": "base.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/header.css": "header.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/home.css": "home.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/events.css": "events.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/partners.css": "partners.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/about.css": "about.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/contact.css": "contact.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/subpages.css": "subpages.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/misc.css": "misc.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/responsive.css": "responsive.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/index.js": "index.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/announcement.js": "announcement.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/contact.js": "contact.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts" });

  // Collection des événements (src/events/*.md), triée selon le champ
  // "order" de chaque fichier plutôt que la date par défaut d'Eleventy.
  // Un fichier sans "order" (ou non numérique) est placé en fin de liste
  // plutôt que de casser le tri (NaN).
  eleventyConfig.addCollection("events", (collectionApi) => {
    return collectionApi.getFilteredByTag("events").sort((a, b) => {
      const orderA = typeof a.data.order === "number" ? a.data.order : Infinity;
      const orderB = typeof b.data.order === "number" ? b.data.order : Infinity;
      return orderA - orderB;
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
  };
};
