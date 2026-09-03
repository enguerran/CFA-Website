const { RenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Permet de convertir des fragments Markdown en HTML depuis les templates
  // Nunjucks via {% renderFile %} (ex: src/_includes/about-content.md).
  eleventyConfig.addPlugin(RenderPlugin);

  // Copy static assets to the site root (templates and style.css reference
  // them as root-relative paths: /style.css, /index.js, /announcement.js,
  // /images/..., and style.css itself uses relative "fonts/..." urls).
  eleventyConfig.addPassthroughCopy({ "src/assets/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/index.js": "index.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/announcement.js": "announcement.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/contact.js": "contact.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts" });

  // Collection des événements (src/events/*.md), triée selon le champ
  // "order" de chaque fichier plutôt que la date par défaut d'Eleventy.
  eleventyConfig.addCollection("events", (collectionApi) => {
    return collectionApi.getFilteredByTag("events").sort((a, b) => a.data.order - b.data.order);
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
