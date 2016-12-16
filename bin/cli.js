#!/usr/bin/env node

var bundler = require("../src/pakit");
var path = require("path");
var subarg = require("subarg");
var argv = subarg(process.argv.slice(2));

var src = argv._.concat(argv.files || []);
var dest = argv.out || path.join(process.cwd(), "dist/out.js");

bundler({ src: src, dest: dest }, argv);
