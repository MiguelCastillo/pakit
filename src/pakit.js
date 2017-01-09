var fs = require("fs-extra");
var path = require("path");
var resolve = require("resolve");
var handlebars = require("handlebars");
var utils = require("belty");
var cwd = process.cwd();

var Bitbundler = requireModule("bit-bundler");
var minify = requireModule("bit-bundler-minifyjs");
var extractsm = requireModule("bit-bundler-extractsm");
var splitter = requireModule("bit-bundler-splitter");
var babelCore = requireModule("babel-core");

// Config file
var config = require(path.join(__dirname, "../", ".bundlerrc.json"));
try { config = Object.assign({}, config, require(path.join(cwd, ".bundlerrc.json"))); }
catch (e) { }

var defaultLoaderPlugins = [
  "excludes",
  "extensions",
  "httpresource",
  "eslint",
  "js",
  "css",
  "json",
  "babel",
  "builtins",
  "remove"
];

function createBundler(options) {
  settings = Object.assign({ loaders: {} }, config, options);

  return new Bitbundler({
    umd: settings.umd,
    watch: settings.watch,
    loader: {
      plugins: []
        .concat(configureLoaderPlugins(settings, defaultLoaderPlugins))
        .concat(configureLoaderPlugins(settings.loaders, Object.keys(settings.loaders)))
        .concat(configureLoaderPlugins(settings, ["cache"]))
    },
    bundler: {
      plugins: configureBundlerPlugins(settings)
    }
  });
}

function configureLoaderPlugins(configurations, plugins) {
  configurations = configurations || {};

  if (configurations.babel) {
    configurations.babel = Object.assign({ core: babelCore, options: { presets: [], sourceMaps: "inline" } }, configurations.babel);
  }

  return plugins
    .filter(function(plugin) {
      return configurations[plugin];
    })
    .map(function(plugin) {
      return requireModule("bit-loader-" + plugin)(configurations[plugin]);
    });
}

function configureBundlerPlugins(configurations) {
  var plugins = configureShards(configurations.shards);

  if (configurations.minify !== false) {
    plugins.push(minify(Object.assign({ banner: buildBannerString() }, configurations.minify)));
  }

  if (configurations.extractsm !== false) {
    plugins.push(extractsm(configurations.extractsm));
  }

  return plugins;
}

function configureShards(options) {
  return Object.keys(options || {}).map(function (name) {
    // Sample config
    // splitter("dist/vendor.js", { match: { path: /\/node_modules\// } })
    // The input config can a string and it will be coerced to a match.path matcher
    if (typeof options[name] === "string" || options[name] instanceof Array) {
      options[name] = { match: { path: options[name] } };
    }

    return splitter(name, configureSplitterOptions(name, options[name]));
  });
}

function configureSplitterOptions(name, options) {
  // this is specifically to convert all string matching rules to be regexps
  if (typeof options === "string" || options instanceof Array) {
    return name === "extensions" ?
      options :
      [].concat(options).map(function (opt) { return new RegExp(opt); });
  }

  return Object.keys(options).reduce(function (result, option) {
    result[option] = configureSplitterOptions(option, options[option]);
    return result;
  }, {});
}

function buildBannerString() {
  var date = new Date();
  var pkg = {};
  try { pkg = require(path.join(process.cwd(), "package")); }
  catch (e) { }

  var template = handlebars.compile("/*! {{ pkg.name }} v{{ pkg.version }} - {{ date }}. (c) {{ fullYear }} {{{ pkg.author }}}. Licensed under {{ pkg.license }} */");
  return template({ pkg: pkg, date: date, fullYear: date.getFullYear() });
}

function requireModule(name) {
  var modulePath;

  try {
    modulePath = resolve.sync(name, { basedir: cwd });
  }
  catch (ex) {
    modulePath = resolve.sync(name, { basedir: __dirname });
  }

  return require(modulePath);
}

module.exports = function (files, options) {
  return createBundler(options).bundle(files);
};
