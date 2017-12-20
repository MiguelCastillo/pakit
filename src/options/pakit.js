var path = require("path");

function buildPakitOptions() {
  var config = require(path.join(__dirname, "../../", ".pakit"));

  try {
    Object.assign(config, require(path.join(process.cwd(), ".pakit")));
  }
  catch(ex) {
    if (ex.code !== "MODULE_NOT_FOUND") {
      throw ex;
    }
  }

  return config;
}

module.exports = buildPakitOptions;
