import { expect } from "chai";
import pakit from "../../src/pakit";

describe("pakit test suite", function() {
  describe("when bundling a module with no dependencies", function() {
    var result;
    before(() => {
      return pakit("test/sample/hello-world/index.js", { log: false }).then(ctx => result = ctx);
    });

    it("then result has a 'main' shard", function() {
      expect(result.shards).to.have.property("main");
    });

    it("then content of the 'main' shard with correct  value", function() {
      expect(trimResult(result.shards["main"].content)).to.be.contain(`(c) 2017 Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=function r(e,n,o){function t(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var a=n[i]={exports:{}};e[i][0].call(a.exports,function(r){var n=e[i][1][r];return t(n||r)},a,a.exports,r,e,n,o)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<o.length;i++)t(o[i]);return t}({1:[function(r,e,n){"use strict";console.log("hello world")},{}]},{},[1]);`);
    });

    it("then the result has one module", function() {
      expect(result.shards["main"].modules).to.have.lengthOf(1);
    });
  });
});

function trimResult(data) {
  return data
    .toString()
    .replace(/\n/g, "")
    .replace(/\/\/# sourceMappingURL=.*/, "");
}

function arrayItemContains(value) {
  return function(array) {
    return array.find(function(str) {
      return str.indexOf(value) !== -1;
    });
  };
}
