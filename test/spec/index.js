import { expect } from "chai";
import pakit from "../../src/pakit";
import path from "path";

describe("pakit test suite", function() {
  this.timeout(10000);

  describe("when bundling a module with no dependencies", function() {
    var result;
    before(function () {
      return pakit("test/sample/hello-world/all.js", { log: false }).then(ctx => result = ctx);
    });

    it("then result has a 'main' shard", function() {
      expect(result.shards).to.have.property("main");
    });

    it("then content of the 'main' shard with correct  value", function() {
      expect(trimResult(result.shards["main"].content)).to.be.contain(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=function r(e,n,o){function t(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var a=n[i]={exports:{}};e[i][0].call(a.exports,function(r){var n=e[i][1][r];return t(n||r)},a,a.exports,r,e,n,o)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<o.length;i++)t(o[i]);return t}({1:[function(r,e,n){"use strict";console.log("hello world")},{}]},{},[1]);`);
    });

    it("then the result has one module", function() {
      expect(result.shards["main"].modules).to.have.lengthOf(1);
    });
  });

  describe("when bundling a module with two dependencies", function() {
    var result;
    before(function () {
      return pakit("test/sample/hello-world/index.js", { log: false }).then(ctx => result = ctx);
    });

    it("then result has a 'main' shard", function() {
      expect(result.shards).to.have.property("main");
    });

    it("then content of the 'main' shard with correct  value", function() {
      expect(trimResult(result.shards["main"].content)).to.be.contain(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=function r(o,e,n){function t(i,l){if(!e[i]){if(!o[i]){var c="function"==typeof require&&require;if(!l&&c)return c(i,!0);if(u)return u(i,!0);var f=new Error("Cannot find module \'"+i+"\'");throw f.code="MODULE_NOT_FOUND",f}var s=e[i]={exports:{}};o[i][0].call(s.exports,function(r){var e=o[i][1][r];return t(e||r)},s,s.exports,r,o,e,n)}return e[i].exports}for(var u="function"==typeof require&&require,i=0;i<n.length;i++)t(n[i]);return t}({1:[function(r,o,e){"use strict";r("./hello"),console.log(" == "),r("./world")},{"./hello":2,"./world":3}],2:[function(r,o,e){"use strict";console.log("hello")},{}],3:[function(r,o,e){"use strict";console.log("world")},{}]},{},[1]);`);
    });

    it("then the result has one module", function() {
      expect(result.shards["main"].modules).to.have.lengthOf(3);
    });
  });

  describe("when bundling a file content with no dependencies", function() {
    var result, content;

    before(function () {
      content = "console.log('hello world - content');";
      return pakit({ content: content }, { log: false }).then(ctx => result = ctx);
    });

    it("then result has a 'main' shard", function() {
      expect(result.shards).to.have.property("main");
    });

    it("then content of the 'main' shard with correct  value", function() {
      expect(trimResult(result.shards["main"].content)).to.be.contain(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=function r(e,n,o){function t(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var l=new Error("Cannot find module \'"+i+"\'");throw l.code="MODULE_NOT_FOUND",l}var a=n[i]={exports:{}};e[i][0].call(a.exports,function(r){var n=e[i][1][r];return t(n||r)},a,a.exports,r,e,n,o)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<o.length;i++)t(o[i]);return t}({1:[function(r,e,n){console.log("hello world - content")},{}]},{},[1]);`);
    });

    it("then the result has one module", function() {
      expect(result.shards["main"].modules).to.have.lengthOf(1);
    });
  });

  describe("when bundling a file content with two dependencies", function() {
    var result, content, filePath = path.join(process.cwd(), "test/sample/hello-world/index.js");

    before(function () {
      content = `require("./hello");console.log(" == ");require("./world");`;
      return pakit({ content: content, path: filePath }, { log: false }).then(ctx => result = ctx);
    });

    it("then result has a 'main' shard", function() {
      expect(result.shards).to.have.property("main");
    });

    it("then content of the 'main' shard with correct  value", function() {
      expect(trimResult(result.shards["main"].content)).to.be.contain(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=function r(o,e,n){function t(i,l){if(!e[i]){if(!o[i]){var c="function"==typeof require&&require;if(!l&&c)return c(i,!0);if(u)return u(i,!0);var f=new Error("Cannot find module \'"+i+"\'");throw f.code="MODULE_NOT_FOUND",f}var s=e[i]={exports:{}};o[i][0].call(s.exports,function(r){var e=o[i][1][r];return t(e||r)},s,s.exports,r,o,e,n)}return e[i].exports}for(var u="function"==typeof require&&require,i=0;i<n.length;i++)t(n[i]);return t}({1:[function(r,o,e){"use strict";r("./hello"),console.log(" == "),r("./world")},{"./hello":2,"./world":3}],2:[function(r,o,e){"use strict";console.log("hello")},{}],3:[function(r,o,e){"use strict";console.log("world")},{}]},{},[1]);`);
    });

    it("then the result has three module", function() {
      expect(result.shards["main"].modules).to.have.lengthOf(3);
    });
  });
});

function trimResult(data) {
  return data
    .toString()
    .replace(/\n/g, "")
    .replace(/\/\/# sourceMappingURL=.*/, "");
}
