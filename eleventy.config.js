export default function (eleventyConfig) {
  // Static files copied as-is
  eleventyConfig.addPassthroughCopy("src/theme");
  eleventyConfig.addPassthroughCopy("src/uploads");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  const GR_MONTHS = ["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"];
  const pad = (n) => String(n).padStart(2, "0");

  eleventyConfig.addFilter("dmy", (d) => `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`);
  eleventyConfig.addFilter("iso", (d) => d.toISOString());
  eleventyConfig.addFilter("rfc822", (d) => d.toUTCString());
  eleventyConfig.addFilter("monthName", (ym) => { const [y, m] = ym.split("-"); return `${GR_MONTHS[+m - 1]} ${y}`; });
  eleventyConfig.addFilter("catSlug", (name) => String(name).toLowerCase());
  eleventyConfig.addFilter("stripHtml", (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  eleventyConfig.addFilter("excerpt", (s, n = 300) => {
    const t = String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t;
  });
  eleventyConfig.addFilter("maxOf", (arr) => Math.max(...arr));
  eleventyConfig.addFilter("minOf", (arr) => Math.min(...arr));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("jsonify", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  const byDateDesc = (a, b) => b.date - a.date || (b.data.order || 0) - (a.data.order || 0);

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort(byDateDesc)
  );

  // One entry per listing page, so category and month archives paginate like WordPress did
  const chunk = (posts, perPage, make) => {
    const pages = Math.max(1, Math.ceil(posts.length / perPage));
    return Array.from({ length: pages }, (_, i) => make(posts.slice(i * perPage, (i + 1) * perPage), i + 1, pages));
  };

  eleventyConfig.addCollection("categoryPages", (api) => {
    const posts = api.getFilteredByGlob("src/posts/*.md").sort(byDateDesc);
    const menu = api.getAll()[0]?.data?.site?.menu || [];
    const per = api.getAll()[0]?.data?.site?.perPage || 10;
    return menu.flatMap(({ name, slug }) => {
      const list = posts.filter((p) => (p.data.categories || []).includes(name));
      return chunk(list, per, (items, page, pages) => ({ name, slug, items, page, pages, total: list.length, base: `/${slug}/` }));
    });
  });

  eleventyConfig.addCollection("monthPages", (api) => {
    const posts = api.getFilteredByGlob("src/posts/*.md").sort(byDateDesc);
    const per = api.getAll()[0]?.data?.site?.perPage || 10;
    const groups = new Map();
    for (const p of posts) {
      const ym = `${p.date.getUTCFullYear()}-${pad(p.date.getUTCMonth() + 1)}`;
      if (!groups.has(ym)) groups.set(ym, []);
      groups.get(ym).push(p);
    }
    return [...groups].flatMap(([ym, list]) =>
      chunk(list, per, (items, page, pages) => ({ ym, items, page, pages, total: list.length, base: `/${ym.replace("-", "/")}/` }))
    );
  });

  eleventyConfig.addCollection("months", (api) => {
    const posts = api.getFilteredByGlob("src/posts/*.md").sort(byDateDesc);
    const counts = new Map();
    for (const p of posts) {
      const ym = `${p.date.getUTCFullYear()}-${pad(p.date.getUTCMonth() + 1)}`;
      counts.set(ym, (counts.get(ym) || 0) + 1);
    }
    return [...counts].map(([ym, count]) => ({ ym, count, url: `/${ym.replace("-", "/")}/` }));
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
