#!/usr/bin/env node

const bundler = require("../src/pakit");
const path = require("path");
const subarg = require("subarg");
const utils = require("belty");
const argv = subarg(process.argv.slice(2));

Object.keys(argv).forEach(function(key) {
  argv[key] = (
    argv[key] === "true" ? true :
    argv[key] === "false" ? false :
    argv[key]
  );
});

if (argv.config) {
  const config = require(path.join(process.cwd(), argv.config));

  // We want to override anything in the config file with options from the CLI
  Object.keys(argv)
    .filter(key => key !== "_")
    .forEach(key => {
      config[key] = argv[key];
    });

  bundler(
    utils.pick(config, ["content", "path", "src", "files", "dest"]),
    utils.omit(config, ["content", "path", "src", "files", "dest"]),
  );
}
else {
  bundler({
    content: argv.content,
    path: argv.path,
    src: [].concat(argv._).concat(argv.src).concat(argv.files).filter(Boolean),
    dest: argv.dest || argv.out || path.join(process.cwd(), "dist/out.js")
  },
    utils.omit(argv, ["content", "path", "src", "files", "dest"])
  );
}
