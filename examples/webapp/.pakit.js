module.exports = {
  "shards": {
    "vendor": { dest: "dist/vendor.js", match: "/node_modules/" },
    "hello": { dest: "dist/hello.js", match: "/hello.jsx$" },
    "world": { dest: "dist/world.js", match: "/world.jsx$" }
  },
  "minify": false,
  "cache": true
};
