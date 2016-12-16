var fs = require("fs-extra");
var path = require("path");
var resolve = require("resolve");
var cwd = process.cwd();

var Bitbundler = requireModule("bit-bundler");
var jsPlugin = requireModule("bit-loader-js");
var eslintPlugin = requireModule("bit-eslint");
var babelPlugin = requireModule("bit-loader-babel");
var excludesPlugin = requireModule("bit-loader-excludes");
var extensionsPuglin = requireModule("bit-loader-extensions");
var nodeBuiltins = requireModule("bit-loader-builtins");
var cssPlugin = requireModule("bit-loader-css");
var jsonPlugin = requireModule("bit-loader-json");
var httpResourcePlugin = requireModule("bit-loader-httpresource");
var minifyjs = requireModule("bit-bundler-minifyjs");
var extractsm = requireModule("bit-bundler-extractsm");
var splitter = requireModule("bit-bundler-splitter");
var babelCore = requireModule("babel-core");

// Config file
var config = require(path.join(__dirname, "../", ".bundlerrc.json"));
try { config = require(path.join(cwd, ".bundlerrc.json")); }
catch(e) {}

function createBundler(options) {
  settings = Object.assign({}, config, options);

  return new Bitbundler({
    watch: settings.watch,
    loader: {
      plugins: [
        excludesPlugin(settings.excludes),
        extensionsPuglin(settings.extensions),
        httpResourcePlugin(settings.httpResources),
        eslintPlugin(settings.eslint),
        jsPlugin(settings.js),
        babelPlugin(Object.assign({ core: babelCore, options: { presets: [], sourceMaps: "inline" }}, settings.babel)),
        cssPlugin(settings.css),
        jsonPlugin(settings.json),
        nodeBuiltins()
      ]
    },
    bundler: {
      plugins: [
        // splitter("dist/vendor.js", { match: { path: /\/node_modules\// } }),
        // minifyjs({ banner: buildBannerString() }),
        // extractsm()
      ]
    }
  });
}

// function buildBannerString() {
//   var date = new Date();
//   var pkg = {};
//   try { pkg = require(path.join(process.cwd(), "package")); }
//   catch(e) {}
//   return grunt.template.process("/*! <%= pkg.name %> v<%= pkg.version %> - <%= date %>. (c) <%= date.getFullYear() %> <%= pkg.author %>. Licensed under <%= pkg.license %> */", { data: { pkg: pkg }});
// }


function requireModule(name) {
  var modulePath;

  try {
    modulePath = resolve.sync(name, { basedir: cwd });
  }
  catch(ex) {
    modulePath = resolve.sync(name, { basedir: __dirname });
  }

  return require(modulePath);
}


module.exports = function(files, options) {
  return createBundler(options).bundle(files);
};

