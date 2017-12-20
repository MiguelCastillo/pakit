var resolve = require("resolve");

function resolveModule(name) {
  var modulePath;

  try {
    modulePath = resolve.sync(name, { basedir: process.cwd() });
  }
  catch (ex) {
    modulePath = resolve.sync(name, { basedir: __dirname });
  }

  return modulePath;
}

module.exports = resolveModule;
