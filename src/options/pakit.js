const path = require("path");
const glob = require("glob");
const chalk = require("chalk");

function buildPakitOptions() {
  var config = require(path.join(__dirname, "../../", ".pakit"));

  if (glob.sync(path.join(process.cwd(), ".bundlerrc*(.js|.json)")).length) {
    process.stderr.write(`${chalk.cyan.bold("pakit:")} ${chalk.yellow.bold(".bundlerrc is deprecated")}. Please rename to ${chalk.bold(".pakit")} instead. We will continue to load .bundlerrc files for now. Please see visit https://github.com/MiguelCastillo/pakit#config-file-or-directory for more information.\n`);
    Object.assign(config, require(path.join(process.cwd(), ".bundlerrc")));
  }
  else {
    try {
      Object.assign(config, require(path.join(process.cwd(), ".pakit")));
    }
    catch(ex) {
      if (ex.code !== "MODULE_NOT_FOUND") {
        throw ex;
      }
    }  
  }

  return config;
}

module.exports = buildPakitOptions;
