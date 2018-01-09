const utils = require("belty");
const Bitbundler = require("bit-bundler");
const resolveModule = require("./resolveModule");
const pakitDefaultOptionsBuilder = require("./options/pakit");
const loaderDefaultOptionsBuilder = require("./options/loader");
const stringBannerBuilder = require("./stringBannerBuilder");

const defaultLoaderPlugins = [
  "excludes",
  "extensions",
  "httpresource",
  "shimmer",
  "eslint",
  "js",
  "css",
  "json",
  "babel",
  "builtins",
  "remove"
];

function createBundler(options) {
  var settings = Object.assign({}, pakitDefaultOptionsBuilder(), options);

  return new Bitbundler({
    baseUrl: settings.baseUrl,
    log: settings.log,
    umd: settings.umd,
    watch: settings.watch,
    loader: {
      plugins: []
        .concat(configureLoaderPlugins(utils.pick(settings, defaultLoaderPlugins)))
        .concat(configureLoaderPlugins(settings.loaders || {}))
        .concat(configureLoaderPlugins(utils.pick(settings, ["cache"])))
    },
    bundler: {
      plugins: configureBundlerPlugins(settings)
    }
  });
}

function configureLoaderPlugins(configurations) {
  const defaultLoaderOptions = loaderDefaultOptionsBuilder();

  return Object
    .keys(configurations)
    .filter(function(plugin) {
      return configurations[plugin];
    })
    .map(function(plugin) {
      var settings = configurations[plugin].constructor === Object ?
        Object.assign({}, defaultLoaderOptions[plugin], configurations[plugin]) :
        configurations[plugin];

      return [resolveModule("bit-loader-" + plugin),(settings)];
    });
}

function configureBundlerPlugins(configurations) {
  var plugins = []
  
  if (Object.keys(configurations.shards).length) {
    plugins.push([resolveModule("bit-bundler-splitter"), configureShards(configurations.shards)]);
  }

  if (configurations.minify !== false) {
    plugins.push([resolveModule("bit-bundler-minifyjs"), Object.assign({ output: {
      beautify: false,
      preamble: stringBannerBuilder()
    }}, configurations.minify)]);
  }

  if (configurations.extractsm !== false) {
    plugins.push([resolveModule("bit-bundler-extractsm"), configurations.extractsm]);
  }

  return plugins;
}

function configureShards(options) {
  return Object.keys(options || {}).map(function (name) {
    return Object.assign({ name: name }, options[name]);
  });
}

module.exports = function (files, options) {
  return createBundler(options).bundle(files);
};
