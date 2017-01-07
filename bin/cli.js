#!/usr/bin/env node

var bundler = require("../src/pakit");
var path = require("path");
var subarg = require("subarg");
var argv = subarg(process.argv.slice(2));

var src = argv._.concat(argv.files || []);
var dest = argv.out || path.join(process.cwd(), "dist/out.js");

Object.keys(argv).forEach(function(key) {
  argv[key] = (
    argv[key] === "true" ? true :
    argv[key] === "false" ? false :
    argv[key]
  );
});

bundler({ src: src, dest: dest }, argv);
