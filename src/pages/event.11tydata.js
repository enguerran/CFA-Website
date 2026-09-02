module.exports = {
  eleventyComputed: {
    title: (data) => `${data.event.title} — ${data.site.name}`,
    description: (data) => data.event.description,
  },
};
