const path = require("path");

function buildBannerString() {
  var date = new Date();
  var fullYear = date.getFullYear();
  var pkg = {};

  try {
    pkg = require(path.join(process.cwd(), "package"));
  }
  catch (ex) {
    if (ex.code !== "MODULE_NOT_FOUND") {
      throw ex;
    }
  }

  return `/*! ${pkg.name} v${pkg.version} - ${date}. (c) ${fullYear} ${pkg.author}. Licensed under ${pkg.license} */`;
}

module.exports = buildBannerString;
