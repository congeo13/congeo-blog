// Every file in src/posts is a blog post. New posts written in the editor get the
// same WordPress-style address the old ones had: /YYYY/MM/DD/slug/
const pad = (n) => String(n).padStart(2, "0");

export default {
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      const d = data.page.date;
      return `/${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}/${data.page.fileSlug}/`;
    },
  },
};
