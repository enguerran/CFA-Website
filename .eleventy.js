module.exports = function (eleventyConfig) {
  // Copy static assets to the site root (templates and style.css reference
  // them as root-relative paths: /style.css, /index.js, /events.js,
  // /images/..., and style.css itself uses relative "fonts/..." urls).
  eleventyConfig.addPassthroughCopy({ "src/assets/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/index.js": "index.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/events.js": "events.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
